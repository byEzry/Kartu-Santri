import React, { useState, useRef, useEffect } from 'react';
import { CardSantri } from './CardSantri';
import { CardMahrom } from './CardMahrom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { Printer, FileDown, X, Loader2, ChevronLeft, ChevronRight, Check } from 'lucide-react';

export function PrintModal({
  isOpen,
  onClose,
  santriList = [],
  pesantren,
  template,
  initialMode = 'pvc',
  onPrintSuccess
}) {
  if (!isOpen || !santriList || santriList.length === 0) return null;

  // Print Mode Options
  const [printMode, setPrintMode] = useState(initialMode || 'pvc'); // 'pvc' | 'sheet'
  const [cardType, setCardType] = useState('santri'); // 'santri' | 'mahrom' | 'both'
  const [cardSide, setCardSide] = useState('front'); // 'front' | 'both' | 'back'
  // When 1 santri is selected: default to 1 card (hemat kertas & tinta), with option to fill 8 slots
  const [a4FillPage, setA4FillPage] = useState(false);
  const [previewPageIndex, setPreviewPageIndex] = useState(0);
  const [previewZoomFit, setPreviewZoomFit] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');

  const printAreaRef = useRef(null);

  // Sync mode whenever modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialMode === 'sheet') {
        setPrintMode('sheet');
        setCardType('santri');
        setCardSide('front');
        setA4FillPage(false);
      } else {
        setPrintMode('pvc');
        setCardType('santri');
        setCardSide('front');
      }
      setPreviewPageIndex(0);
    }
  }, [isOpen, initialMode]);

  // Generate structured A4 pages (8 slots per page)
  const generateA4Pages = () => {
    if (printMode !== 'sheet') return [];

    // 1. Determine base santri list
    let baseSantri = santriList;
    if (santriList.length === 1 && a4FillPage) {
      baseSantri = Array(8).fill(santriList[0]);
    }

    // 2. Expand by cardType
    let cardPairs = []; // array of { santri, type: 'santri' | 'mahrom' }
    baseSantri.forEach((santri) => {
      if (cardType === 'both') {
        cardPairs.push({ santri, type: 'santri' });
        cardPairs.push({ santri, type: 'mahrom' });
      } else {
        cardPairs.push({ santri, type: cardType });
      }
    });

    // 3. Chunk into groups of 8
    const rawChunks = [];
    for (let i = 0; i < cardPairs.length; i += 8) {
      const chunk = cardPairs.slice(i, i + 8);
      while (chunk.length < 8) {
        chunk.push(null);
      }
      rawChunks.push(chunk);
    }
    if (rawChunks.length === 0) rawChunks.push(Array(8).fill(null));

    // 4. Generate pages according to cardSide
    const pages = [];
    rawChunks.forEach((chunk) => {
      if (cardSide === 'front') {
        pages.push({
          pageNumber: pages.length + 1,
          label: `Halaman ${pages.length + 1} • Sisi Depan`,
          slots: chunk.map((item) => (item ? { ...item, side: 'front' } : null))
        });
      } else if (cardSide === 'back') {
        pages.push({
          pageNumber: pages.length + 1,
          label: `Halaman ${pages.length + 1} • Sisi Belakang`,
          slots: chunk.map((item) => (item ? { ...item, side: 'back' } : null))
        });
      } else if (cardSide === 'both') {
        // Page A: Sisi Depan
        pages.push({
          pageNumber: pages.length + 1,
          label: `Halaman ${pages.length + 1} • Sisi Depan`,
          slots: chunk.map((item) => (item ? { ...item, side: 'front' } : null))
        });

        // Page B: Sisi Belakang (Horizontally Mirrored for Duplex/Bolak-Balik Printing)
        // In 2 columns x 4 rows: Row r has [leftIdx = r*2, rightIdx = r*2+1]
        // On duplex, the left column matches the right column of the front
        const mirroredSlots = [];
        for (let r = 0; r < 4; r++) {
          const leftIdx = r * 2;
          const rightIdx = r * 2 + 1;
          const itemRight = chunk[rightIdx];
          const itemLeft = chunk[leftIdx];
          mirroredSlots.push(itemRight ? { ...itemRight, side: 'back' } : null);
          mirroredSlots.push(itemLeft ? { ...itemLeft, side: 'back' } : null);
        }

        pages.push({
          pageNumber: pages.length + 1,
          label: `Halaman ${pages.length + 1} • Sisi Belakang (Duplex Pas)`,
          slots: mirroredSlots
        });
      }
    });

    return pages;
  };

  const a4Pages = generateA4Pages();
  const activeA4Page = a4Pages[previewPageIndex] || a4Pages[0];

  // Total physical card count calculation
  const totalPhysicalCards = printMode === 'sheet'
    ? (santriList.length === 1 && a4FillPage ? 8 : (santriList.length * (cardType === 'both' ? 2 : 1)))
    : santriList.length * (cardType === 'both' ? 2 : 1) * (cardSide === 'both' ? 2 : 1);

  // Handler: Log print to backend
  const logPrintActivity = async (mode) => {
    try {
      const ids = santriList.map((s) => s.id);
      await fetch('/api/santri/log-print', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          santri_ids: ids,
          jenis_kartu: cardType === 'both' ? 'Keduanya' : cardType === 'santri' ? 'Santri' : 'Mahrom',
          mode_cetak: mode === 'pdf' ? 'PDF Export' : printMode === 'pvc' ? 'PVC Printer' : 'A4 Sheet'
        })
      });
      if (onPrintSuccess) onPrintSuccess();
    } catch (e) {
      console.error('Failed to log print', e);
    }
  };

  // Handler: Direct Native Print with exact W3C compliant @page dimensions
  const handleDirectPrint = () => {
    logPrintActivity('direct');

    const isPvc = printMode === 'pvc';

    // 1. DYNAMICALLY INJECT @page SIZE INTO MAIN DOCUMENT HEAD
    // Crucial for Chromium: Chrome print preview evaluates the active document's
    // @page rule to size paper (85.6mm x 54mm for CR80 or 210mm x 297mm for A4).
    let hostPrintStyle = document.getElementById('app-host-print-style');
    if (!hostPrintStyle) {
      hostPrintStyle = document.createElement('style');
      hostPrintStyle.id = 'app-host-print-style';
      document.head.appendChild(hostPrintStyle);
    }
    hostPrintStyle.innerHTML = `
      @page {
        size: ${isPvc ? '85.6mm 54mm' : '210mm 297mm'};
        margin: 0 !important;
      }
    `;

    // 2. Collect all stylesheets from current document
    const styleElements = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map((el) => el.outerHTML)
      .join('\n');

    const printBodyContent = printAreaRef.current.innerHTML;

    let printIframe = document.getElementById('app-print-frame');
    if (printIframe) printIframe.remove();

    printIframe = document.createElement('iframe');
    printIframe.id = 'app-print-frame';
    printIframe.style.position = 'fixed';
    printIframe.style.left = '-10000px';
    printIframe.style.top = '-10000px';
    printIframe.style.width = isPvc ? '85.6mm' : '210mm';
    printIframe.style.height = isPvc ? '54mm' : '297mm';
    printIframe.style.border = 'none';
    printIframe.style.opacity = '0';
    printIframe.style.pointerEvents = 'none';
    document.body.appendChild(printIframe);

    const doc = printIframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cetak Kartu - ${pesantren?.nama_pesantren || 'Pondok Pesantren Qudsiyyah Putri'}</title>
          <meta charset="utf-8">
          ${styleElements}
          <style>
            @page {
              size: ${isPvc ? '85.6mm 54mm' : '210mm 297mm'};
              margin: 0 !important;
            }
            * {
              box-sizing: border-box !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
              font-family: 'Roboto', 'Segoe UI', sans-serif !important;
              width: ${isPvc ? '85.6mm' : '210mm'} !important;
              height: ${isPvc ? '54mm' : '297mm'} !important;
            }
            ${isPvc ? `
            .pvc-card-page {
              width: 85.6mm !important;
              height: 54.0mm !important;
              min-width: 85.6mm !important;
              min-height: 54.0mm !important;
              max-width: 85.6mm !important;
              max-height: 54.0mm !important;
              page-break-after: always !important;
              break-after: page !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              overflow: hidden !important;
              position: relative !important;
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
              box-sizing: border-box !important;
            }
            .pvc-card-page:last-child {
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            .pvc-card-inner {
              width: 85.6mm !important;
              height: 54.0mm !important;
              position: absolute !important;
              top: 0 !important;
              left: 0 !important;
              box-sizing: border-box !important;
            }
            ` : `
            .a4-print-sheet {
              width: 210mm !important;
              height: 297mm !important;
              max-width: 210mm !important;
              max-height: 297mm !important;
              page-break-after: always !important;
              break-after: page !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: space-between !important;
              box-sizing: border-box !important;
              overflow: hidden !important;
              padding: 8mm 12mm !important;
              background: #ffffff !important;
              margin: 0 auto !important;
            }
            .a4-print-sheet:last-child {
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            .a4-sheet-header {
              border-bottom: 0.3mm dashed #94a3b8 !important;
              padding-bottom: 1.5mm !important;
              margin-bottom: 1.5mm !important;
              display: flex !important;
              justify-content: space-between !important;
              font-size: 8pt !important;
              font-family: monospace !important;
              color: #0f766e !important;
            }
            .a4-sheet-footer {
              border-top: 0.3mm dashed #94a3b8 !important;
              padding-top: 1.5mm !important;
              margin-top: 1.5mm !important;
              display: flex !important;
              justify-content: space-between !important;
              font-size: 7.5pt !important;
              font-family: monospace !important;
              color: #64748b !important;
            }
            .a4-print-grid {
              display: grid !important;
              grid-template-columns: repeat(2, 85.6mm) !important;
              grid-template-rows: repeat(4, 54.0mm) !important;
              gap: 5mm 14.8mm !important;
              justify-content: center !important;
              align-content: center !important;
              margin: auto auto !important;
            }
            .a4-card-slot {
              width: 85.6mm !important;
              height: 54.0mm !important;
              min-width: 85.6mm !important;
              min-height: 54.0mm !important;
              max-width: 85.6mm !important;
              max-height: 54.0mm !important;
              position: relative !important;
              overflow: hidden !important;
              box-sizing: border-box !important;
              background: #ffffff !important;
              border: 0.25mm dashed #94a3b8 !important;
              border-radius: 1.5mm !important;
            }
            .a4-card-inner {
              width: 85.6mm !important;
              height: 54.0mm !important;
              position: absolute !important;
              top: 0 !important;
              left: 0 !important;
              box-sizing: border-box !important;
            }
            .a4-card-slot-empty {
              width: 85.6mm !important;
              height: 54.0mm !important;
              border: 0.25mm dashed #cbd5e1 !important;
              border-radius: 1.5mm !important;
              box-sizing: border-box !important;
              background: #ffffff !important;
            }
            `}
          </style>
        </head>
        <body>
          ${printBodyContent}
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      try {
        printIframe.contentWindow.focus();
        printIframe.contentWindow.print();
      } catch (err) {
        console.error('Print error:', err);
      }
    }, 450);
  };

  // Handler: Export to PDF
  const handleExportPdf = async () => {
    setIsGeneratingPdf(true);
    setProgressMsg('Mempersiapkan layout kartu...');

    try {
      if (printMode === 'pvc') {
        const cardPages = printAreaRef.current.querySelectorAll('.pvc-card-page');
        if (!cardPages || cardPages.length === 0) {
          throw new Error('Tidak ada kartu yang ditemukan untuk diekspor.');
        }

        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: [85.6, 54.0]
        });

        for (let i = 0; i < cardPages.length; i++) {
          setProgressMsg(`Merender kartu ke-${i + 1} dari ${cardPages.length}...`);
          if (i > 0) pdf.addPage([85.6, 54.0], 'landscape');

          const innerCard = cardPages[i].querySelector('.id-card-cr80') || cardPages[i];

          const canvas = await html2canvas(innerCard, {
            scale: 3,
            useCORS: true,
            logging: false,
            backgroundColor: null
          });

          const imgData = canvas.toDataURL('image/jpeg', 0.98);
          pdf.addImage(imgData, 'JPEG', 0, 0, 85.6, 54.0);
        }

        const fileName = santriList.length === 1
          ? `Kartu_${santriList[0].nama.replace(/[^a-zA-Z0-9]/g, '_')}_${santriList[0].nispp}.pdf`
          : `Kartu_Santri_Massal_${santriList.length}_Santri.pdf`;

        pdf.save(fileName);
      } else {
        // Sheet Mode: A4 Portrait
        setProgressMsg('Membuat dokumen PDF Lembar A4...');
        const sheetPages = printAreaRef.current.querySelectorAll('.a4-print-sheet');
        if (!sheetPages || sheetPages.length === 0) {
          throw new Error('Elemen lembar cetak A4 tidak ditemukan.');
        }

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        for (let i = 0; i < sheetPages.length; i++) {
          setProgressMsg(`Merender lembar A4 ke-${i + 1} dari ${sheetPages.length}...`);
          if (i > 0) pdf.addPage('a4', 'portrait');

          const canvas = await html2canvas(sheetPages[i], {
            scale: 2.5,
            useCORS: true,
            logging: false
          });

          const imgData = canvas.toDataURL('image/jpeg', 0.98);
          pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
        }

        const fileName = santriList.length === 1
          ? `Lembar_A4_${santriList[0].nama.replace(/[^a-zA-Z0-9]/g, '_')}_${santriList[0].nispp}.pdf`
          : `Lembar_Kartu_A4_${santriList.length}_Santri.pdf`;

        pdf.save(fileName);
      }

      logPrintActivity('pdf');
      setProgressMsg('Selesai!');
    } catch (error) {
      alert('Gagal membuat PDF: ' + error.message);
    } finally {
      setIsGeneratingPdf(false);
      setProgressMsg('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col max-h-[96vh] sm:max-h-[92vh] animate-in fade-in duration-200">
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-teal-100 flex items-center justify-between bg-teal-50/50">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm shrink-0">
              <Printer className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-teal-900 text-sm sm:text-base lg:text-lg truncate">
                Pusat Percetakan & Ekspor PDF
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 truncate">
                {santriList.length} santri terpilih • Total {totalPhysicalCards} kartu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-xl transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options & Preview Body */}
        <div className="p-3.5 sm:p-5 overflow-y-auto space-y-4 sm:space-y-5">
          {/* Options Grid (3 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {/* 1. Mode Printer */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex flex-col justify-between">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-teal-900 mb-2">
                  1. Mode Printer
                </label>
                <div className="space-y-2">
                  <label
                    className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition ${
                      printMode === 'pvc'
                        ? 'bg-teal-50 border-teal-600 text-teal-900 font-semibold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="printMode"
                      value="pvc"
                      checked={printMode === 'pvc'}
                      onChange={() => setPrintMode('pvc')}
                      className="mt-0.5 text-teal-700 accent-teal-700"
                    />
                    <div>
                      <p className="font-bold text-teal-900 leading-tight">Printer ID Card (PVC)</p>
                      <p className="text-[10px] text-slate-500 font-normal leading-tight mt-0.5">
                        Cetak satuan CR80 (85.6 × 54 mm) pas kartu.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition ${
                      printMode === 'sheet'
                        ? 'bg-teal-50 border-teal-600 text-teal-900 font-semibold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="printMode"
                      value="sheet"
                      checked={printMode === 'sheet'}
                      onChange={() => setPrintMode('sheet')}
                      className="mt-0.5 text-teal-700 accent-teal-700"
                    />
                    <div>
                      <p className="font-bold text-teal-900 leading-tight">Printer Biasa (Lembar A4)</p>
                      <p className="text-[10px] text-slate-500 font-normal leading-tight mt-0.5">
                        Multi-kartu per lembar A4 dengan garis potong.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* 2. Jenis Kartu */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex flex-col justify-between">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-teal-900 mb-2">
                  2. Jenis Kartu
                </label>
                <div className="space-y-1.5 text-xs">
                  <label
                    className={`flex items-center gap-2 p-1.5 px-2.5 rounded-lg border cursor-pointer transition ${
                      cardType === 'santri'
                        ? 'bg-teal-50 border-teal-600 text-teal-900 font-semibold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cardType"
                      value="santri"
                      checked={cardType === 'santri'}
                      onChange={() => setCardType('santri')}
                      className="text-teal-700 accent-teal-700"
                    />
                    <span>Kartu Santri</span>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-1.5 px-2.5 rounded-lg border cursor-pointer transition ${
                      cardType === 'mahrom'
                        ? 'bg-teal-50 border-teal-600 text-teal-900 font-semibold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cardType"
                      value="mahrom"
                      checked={cardType === 'mahrom'}
                      onChange={() => setCardType('mahrom')}
                      className="text-teal-700 accent-teal-700"
                    />
                    <span>Kartu Mahrom</span>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-1.5 px-2.5 rounded-lg border cursor-pointer transition ${
                      cardType === 'both'
                        ? 'bg-teal-50 border-teal-600 text-teal-900 font-semibold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cardType"
                      value="both"
                      checked={cardType === 'both'}
                      onChange={() => setCardType('both')}
                      className="text-teal-700 accent-teal-700"
                    />
                    <span>Keduanya (Santri & Mahrom)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 3. Sisi Kartu */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex flex-col justify-between">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-teal-900 mb-2">
                  3. Sisi Kartu
                </label>
                <div className="space-y-1.5 text-xs">
                  <label
                    className={`flex items-center gap-2 p-1.5 px-2.5 rounded-lg border cursor-pointer transition ${
                      cardSide === 'front'
                        ? 'bg-teal-50 border-teal-600 text-teal-900 font-semibold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cardSide"
                      value="front"
                      checked={cardSide === 'front'}
                      onChange={() => setCardSide('front')}
                      className="text-teal-700 accent-teal-700"
                    />
                    <span>Sisi Depan</span>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-1.5 px-2.5 rounded-lg border cursor-pointer transition ${
                      cardSide === 'back'
                        ? 'bg-teal-50 border-teal-600 text-teal-900 font-semibold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cardSide"
                      value="back"
                      checked={cardSide === 'back'}
                      onChange={() => setCardSide('back')}
                      className="text-teal-700 accent-teal-700"
                    />
                    <span>Sisi Belakang</span>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-1.5 px-2.5 rounded-lg border cursor-pointer transition ${
                      cardSide === 'both'
                        ? 'bg-teal-50 border-teal-600 text-teal-900 font-semibold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cardSide"
                      value="both"
                      checked={cardSide === 'both'}
                      onChange={() => setCardSide('both')}
                      className="text-teal-700 accent-teal-700"
                    />
                    <span>Keduanya (Depan & Belakang)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Container */}
          <div className="border border-slate-200 rounded-xl p-3.5 sm:p-4 bg-slate-100">
            {/* Preview Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900">
                  {printMode === 'sheet'
                    ? `Pratinjau Lembar A4 (${totalPhysicalCards} Kartu)`
                    : `Pratinjau Satuan CR80: ${
                        cardType === 'both'
                          ? 'Santri & Mahrom'
                          : cardType === 'santri'
                          ? 'Kartu Santri'
                          : 'Kartu Mahrom'
                      } (${
                        cardSide === 'both'
                          ? 'Depan & Belakang'
                          : cardSide === 'back'
                          ? 'Sisi Belakang'
                          : 'Sisi Depan'
                      })`}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  {printMode === 'sheet'
                    ? 'Simulasi cetak kertas A4 (210 × 297 mm) dengan garis potong rapi standar CR80'
                    : 'Cetak satuan standar CR80 (85.6 × 54.0 mm) untuk printer kartu PVC'}
                </p>
              </div>

              {/* Controls for A4 Mode: Single Santri Choice & Page Switcher */}
              {printMode === 'sheet' && (
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Single Santri 1 vs 8 cards toggle */}
                  {santriList.length === 1 && (
                    <div className="flex items-center bg-white p-0.5 rounded-lg border border-teal-200 text-xs shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setA4FillPage(false)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                          !a4FillPage ? 'bg-teal-600 text-white shadow-2xs' : 'text-teal-800 hover:text-teal-950'
                        }`}
                      >
                        1 Kartu Saja
                      </button>
                      <button
                        type="button"
                        onClick={() => setA4FillPage(true)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                          a4FillPage ? 'bg-teal-600 text-white shadow-2xs' : 'text-teal-800 hover:text-teal-950'
                        }`}
                      >
                        Penuhi 1 Lembar (8 Kartu)
                      </button>
                    </div>
                  )}

                  {/* Multi-page Navigation */}
                  {a4Pages.length > 1 && (
                    <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-teal-200 text-xs shadow-2xs">
                      <button
                        type="button"
                        disabled={previewPageIndex === 0}
                        onClick={() => setPreviewPageIndex((p) => Math.max(0, p - 1))}
                        className="p-0.5 rounded hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        title="Halaman Sebelumnya"
                      >
                        <ChevronLeft className="w-3.5 h-3.5 text-teal-800" />
                      </button>
                      <span className="text-[11px] font-bold text-teal-900 font-mono px-1">
                        Hal {previewPageIndex + 1} / {a4Pages.length}
                      </span>
                      <button
                        type="button"
                        disabled={previewPageIndex >= a4Pages.length - 1}
                        onClick={() => setPreviewPageIndex((p) => Math.min(a4Pages.length - 1, p + 1))}
                        className="p-0.5 rounded hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        title="Halaman Berikutnya"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-teal-800" />
                      </button>
                    </div>
                  )}

                  {/* Zoom Fit Toggle */}
                  <button
                    type="button"
                    onClick={() => setPreviewZoomFit((prev) => !prev)}
                    className="px-2 py-1 bg-white hover:bg-teal-50 border border-teal-200 rounded-lg text-[11px] font-semibold text-teal-800 transition cursor-pointer shadow-2xs"
                  >
                    {previewZoomFit ? '🔍 Ukuran Penuh' : '📄 Pas di Layar'}
                  </button>
                </div>
              )}
            </div>

            {/* PREVIEW DISPLAY */}
            {printMode === 'pvc' ? (
              /* PVC Mode Preview: Individual CR80 Card Preview */
              <div className="max-h-72 overflow-y-auto overflow-x-auto p-3 bg-white rounded-xl border border-slate-200 flex flex-wrap gap-4 justify-center items-center">
                {santriList.map((santri) => (
                  <React.Fragment key={santri.id}>
                    {(cardType === 'both' || cardType === 'santri') && (
                      <div className="flex flex-col items-center gap-1.5 p-2 bg-slate-50/60 rounded-xl border border-teal-100 max-w-full">
                        <span className="text-[10px] font-bold text-teal-900">
                          Kartu Santri • {cardSide === 'both' ? 'Depan & Belakang' : cardSide === 'back' ? 'Sisi Belakang' : 'Sisi Depan'}
                        </span>
                        <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-3">
                          {(cardSide === 'front' || cardSide === 'both') && (
                            <div className="flex flex-col items-center">
                              {cardSide === 'both' && <span className="text-[9px] text-teal-700 font-semibold mb-0.5">Sisi Depan</span>}
                              <div className="scale-[0.58] xs:scale-[0.68] sm:scale-75 origin-top -mb-22 xs:-mb-18 sm:-mb-14 transition-transform">
                                <CardSantri
                                  santri={santri}
                                  pesantren={pesantren}
                                  template={template}
                                  side="front"
                                />
                              </div>
                            </div>
                          )}
                          {(cardSide === 'back' || cardSide === 'both') && (
                            <div className="flex flex-col items-center">
                              {cardSide === 'both' && <span className="text-[9px] text-teal-700 font-semibold mb-0.5">Sisi Belakang</span>}
                              <div className="scale-[0.58] xs:scale-[0.68] sm:scale-75 origin-top -mb-22 xs:-mb-18 sm:-mb-14 transition-transform">
                                <CardSantri
                                  santri={santri}
                                  pesantren={pesantren}
                                  template={template}
                                  side="back"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {(cardType === 'both' || cardType === 'mahrom') && (
                      <div className="flex flex-col items-center gap-1.5 p-2 bg-slate-50/60 rounded-xl border border-teal-100 max-w-full">
                        <span className="text-[10px] font-bold text-teal-900">
                          Kartu Mahrom • {cardSide === 'both' ? 'Depan & Belakang' : cardSide === 'back' ? 'Sisi Belakang' : 'Sisi Depan'}
                        </span>
                        <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-3">
                          {(cardSide === 'front' || cardSide === 'both') && (
                            <div className="flex flex-col items-center">
                              {cardSide === 'both' && <span className="text-[9px] text-teal-700 font-semibold mb-0.5">Sisi Depan</span>}
                              <div className="scale-[0.58] xs:scale-[0.68] sm:scale-75 origin-top -mb-22 xs:-mb-18 sm:-mb-14 transition-transform">
                                <CardMahrom
                                  santri={santri}
                                  pesantren={pesantren}
                                  template={template}
                                  side="front"
                                />
                              </div>
                            </div>
                          )}
                          {(cardSide === 'back' || cardSide === 'both') && (
                            <div className="flex flex-col items-center">
                              {cardSide === 'both' && <span className="text-[9px] text-teal-700 font-semibold mb-0.5">Sisi Belakang</span>}
                              <div className="scale-[0.58] xs:scale-[0.68] sm:scale-75 origin-top -mb-22 xs:-mb-18 sm:-mb-14 transition-transform">
                                <CardMahrom
                                  santri={santri}
                                  pesantren={pesantren}
                                  template={template}
                                  side="back"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              /* A4 Sheet Preview: Fully visible, clean proportional preview without vertical clipping */
              <div className="p-3 sm:p-5 bg-slate-300/60 rounded-xl border border-slate-300 flex flex-col items-center justify-center overflow-x-auto">
                {activeA4Page && (
                  <div
                    className="bg-white shadow-xl border border-slate-300 rounded-sm flex flex-col justify-between select-none shrink-0 transition-all duration-200"
                    style={{
                      width: previewZoomFit ? '364px' : '460px',
                      height: previewZoomFit ? '515px' : '651px',
                      padding: previewZoomFit ? '12px 12px' : '18px 16px',
                      boxShadow: '0 10px 25px -4px rgba(0, 0, 0, 0.15), 0 4px 8px -2px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    {/* Sheet Header */}
                    <div className="border-b border-dashed border-slate-300 pb-1.5 mb-2 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                      <span className="font-bold text-teal-900 truncate max-w-[210px]">
                        {pesantren?.nama_pesantren || 'PONDOK PESANTREN QUDSIYYAH PUTRI'} • A4
                      </span>
                      <span className="text-[8.5px] text-teal-700 font-semibold">{activeA4Page.label}</span>
                    </div>

                    {/* 2 Columns x 4 Rows Grid (8 Card Slots) */}
                    <div
                      className="grid grid-cols-2 justify-center items-center my-auto"
                      style={{
                        gap: previewZoomFit ? '5px 12px' : '8px 14px'
                      }}
                    >
                      {activeA4Page.slots.map((slot, slotIdx) => {
                        const slotWidth = previewZoomFit ? 158 : 202;
                        const slotHeight = previewZoomFit ? 99.7 : 127.4;
                        // CR80 standard width: 85.6mm = 323.527559px at 96 DPI
                        const cardBaseWidth = 323.527559;
                        const cardScale = slotWidth / cardBaseWidth;

                        return (
                          <div
                            key={slotIdx}
                            className="relative overflow-hidden flex items-center justify-center bg-slate-50/50 rounded-xs"
                            style={{
                              width: `${slotWidth}px`,
                              height: `${slotHeight}px`,
                              border: slot ? '1px dashed #64748b' : '1px dashed #cbd5e1'
                            }}
                          >
                            {/* Corner Cut Marks */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-slate-400 z-20 pointer-events-none" />
                            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-slate-400 z-20 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-slate-400 z-20 pointer-events-none" />
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-slate-400 z-20 pointer-events-none" />

                            {slot ? (
                              <div
                                style={{
                                  width: '85.6mm',
                                  height: '54.0mm',
                                  transform: `scale(${cardScale})`,
                                  transformOrigin: 'top left',
                                  position: 'absolute',
                                  top: 0,
                                  left: 0
                                }}
                                className="[&_.id-card-cr80]:border-none [&_.id-card-cr80]:shadow-none [&_.id-card-cr80]:rounded-none"
                              >
                                {slot.type === 'mahrom' ? (
                                  <CardMahrom
                                    santri={slot.santri}
                                    pesantren={pesantren}
                                    template={template}
                                    side={slot.side}
                                  />
                                ) : (
                                  <CardSantri
                                    santri={slot.santri}
                                    pesantren={pesantren}
                                    template={template}
                                    side={slot.side}
                                  />
                                )}
                              </div>
                            ) : (
                              <div className="text-center p-1">
                                <span className="text-[8px] font-mono text-slate-400 block font-semibold">
                                  Slot Kosong
                                </span>
                                <span className="text-[7.5px] text-slate-300">Garis Potong A4</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Sheet Footer */}
                    <div className="border-t border-dashed border-slate-300 pt-1.5 mt-2 flex items-center justify-between text-[8px] text-slate-400 font-mono">
                      <span>Dicetak melalui SIM Pesantren</span>
                      <span>Gunting rapi mengikuti garis putus-putus</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Off-screen Container for Native Print & PDF Export */}
          <div
            style={{
              position: 'fixed',
              left: '-9999px',
              top: '0',
              zIndex: -100,
              pointerEvents: 'none',
              opacity: 1
            }}
          >
            <div ref={printAreaRef}>
              {printMode === 'pvc' ? (
                /* PVC Print Container */
                <div>
                  {santriList.map((santri) => (
                    <React.Fragment key={`pvc-${santri.id}`}>
                      {/* Kartu Santri Front */}
                      {(cardType === 'both' || cardType === 'santri') &&
                        (cardSide === 'front' || cardSide === 'both') && (
                          <div className="pvc-card-page">
                            <div className="pvc-card-inner">
                              <CardSantri
                                santri={santri}
                                pesantren={pesantren}
                                template={template}
                                side="front"
                              />
                            </div>
                          </div>
                        )}
                      {/* Kartu Santri Back */}
                      {(cardType === 'both' || cardType === 'santri') &&
                        (cardSide === 'back' || cardSide === 'both') && (
                          <div className="pvc-card-page">
                            <div className="pvc-card-inner">
                              <CardSantri
                                santri={santri}
                                pesantren={pesantren}
                                template={template}
                                side="back"
                              />
                            </div>
                          </div>
                        )}

                      {/* Kartu Mahrom Front */}
                      {(cardType === 'both' || cardType === 'mahrom') &&
                        (cardSide === 'front' || cardSide === 'both') && (
                          <div className="pvc-card-page">
                            <div className="pvc-card-inner">
                              <CardMahrom
                                santri={santri}
                                pesantren={pesantren}
                                template={template}
                                side="front"
                              />
                            </div>
                          </div>
                        )}
                      {/* Kartu Mahrom Back */}
                      {(cardType === 'both' || cardType === 'mahrom') &&
                        (cardSide === 'back' || cardSide === 'both') && (
                          <div className="pvc-card-page">
                            <div className="pvc-card-inner">
                              <CardMahrom
                                santri={santri}
                                pesantren={pesantren}
                                template={template}
                                side="back"
                              />
                            </div>
                          </div>
                        )}
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                /* A4 Sheet Print Container */
                <div>
                  {a4Pages.map((page, pIdx) => (
                    <div key={`a4-page-${pIdx}`} className="a4-print-sheet">
                      <div className="a4-sheet-header">
                        <span style={{ fontWeight: 'bold', color: '#0f766e' }}>
                          {pesantren?.nama_pesantren || 'PONDOK PESANTREN QUDSIYYAH PUTRI'} • {page.label}
                        </span>
                        <span>STANDAR CR80 (85.6 × 54.0 mm)</span>
                      </div>

                      <div className="a4-print-grid">
                        {page.slots.map((slot, sIdx) =>
                          slot ? (
                            <div key={`slot-${sIdx}`} className="a4-card-slot">
                              <div className="a4-card-inner">
                                {slot.type === 'mahrom' ? (
                                  <CardMahrom
                                    santri={slot.santri}
                                    pesantren={pesantren}
                                    template={template}
                                    side={slot.side}
                                  />
                                ) : (
                                  <CardSantri
                                    santri={slot.santri}
                                    pesantren={pesantren}
                                    template={template}
                                    side={slot.side}
                                  />
                                )}
                              </div>
                            </div>
                          ) : (
                            <div key={`slot-${sIdx}`} className="a4-card-slot-empty">
                              <span style={{ fontSize: '8px', color: '#94a3b8', fontFamily: 'monospace' }}>
                                Slot Kosong • Garis Potong
                              </span>
                            </div>
                          )
                        )}
                      </div>

                      <div className="a4-sheet-footer">
                        <span>Dicetak melalui SIM Pesantren</span>
                        <span>Gunting rapi mengikuti garis putus-putus</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="px-3.5 sm:px-6 py-3 sm:py-4 border-t border-teal-100 bg-teal-50/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 w-full sm:w-auto justify-center sm:justify-start">
            {isGeneratingPdf && (
              <span className="flex items-center gap-2 text-teal-800 font-semibold">
                <Loader2 className="w-4 h-4 animate-spin text-teal-700" />
                {progressMsg}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              disabled={isGeneratingPdf}
              className="px-3 sm:px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-100 transition disabled:opacity-50 cursor-pointer text-center"
            >
              Batal
            </button>

            <button
              onClick={handleExportPdf}
              disabled={isGeneratingPdf}
              className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#16A699] hover:bg-[#139488] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 shadow-xs border border-[#16A699] transition disabled:opacity-50 cursor-pointer whitespace-nowrap"
            >
              <FileDown className="w-4 h-4 text-white shrink-0" />
              <span>Ekspor ke PDF</span>
            </button>

            <button
              onClick={handleDirectPrint}
              disabled={isGeneratingPdf}
              className="col-span-2 sm:col-auto px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-[#009688] hover:bg-[#007D71] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm transition disabled:opacity-50 cursor-pointer border border-[#009688] whitespace-nowrap"
            >
              <Printer className="w-4 h-4 text-white shrink-0" />
              <span>Cetak Sekarang</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrintModal;
