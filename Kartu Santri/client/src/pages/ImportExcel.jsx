import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  FolderArchive,
  Image,
  RefreshCw,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  UserPlus,
  Info,
  Check
} from 'lucide-react';

export function ImportExcel({ onImportComplete, onBackToSantri }) {
  // Mode: 'create' (Impor Santri Baru) | 'update' (Update & Lengkapi Data Kolektif)
  const [activeMode, setActiveMode] = useState('create');
  const [incompleteCount, setIncompleteCount] = useState(0);

  // Excel Import States
  const [excelFile, setExcelFile] = useState(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [duplicateMode, setDuplicateMode] = useState('skip'); // 'skip' | 'update'
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  // Bulk Photo Zip States
  const [zipFile, setZipFile] = useState(null);
  const [isProcessingZip, setIsProcessingZip] = useState(false);
  const [zipResult, setZipResult] = useState(null);

  // Load incomplete santri count for quick indicator badge
  const fetchIncompleteCount = async () => {
    try {
      const res = await fetch('/api/santri/stats');
      const json = await res.json();
      if (json.success && json.stats) {
        setIncompleteCount(json.stats.incompleteData || 0);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchIncompleteCount();
  }, []);

  // Handle Mode Change (Reset temporary preview state)
  const handleModeChange = (mode) => {
    setActiveMode(mode);
    setExcelFile(null);
    setPreviewData(null);
    setImportResult(null);
  };

  // Handle Excel File Selection
  const handleExcelFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setExcelFile(file);
    setPreviewData(null);
    setImportResult(null);
    setIsPreviewing(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('mode', activeMode);

      const res = await fetch(`/api/excel/preview?mode=${activeMode}`, {
        method: 'POST',
        body: formData
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Gagal memproses file Excel.');
      }

      setPreviewData(json);
    } catch (error) {
      alert(error.message);
      setExcelFile(null);
    } finally {
      setIsPreviewing(false);
    }
  };

  // Handle Commit Import
  const handleCommitImport = async () => {
    if (!previewData || !previewData.allRows) return;

    setIsImporting(true);
    try {
      const res = await fetch('/api/excel/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rows: previewData.allRows,
          mode: activeMode,
          duplicateMode
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Gagal mengimpor data santri.');
      }

      setImportResult(json);
      setPreviewData(null);
      setExcelFile(null);
      fetchIncompleteCount();
      if (onImportComplete) onImportComplete();
    } catch (error) {
      alert(error.message);
    } finally {
      setIsImporting(false);
    }
  };

  // Handle Bulk Photo ZIP Upload
  const handleZipUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setZipFile(file);
    setZipResult(null);
    setIsProcessingZip(true);

    try {
      const formData = new FormData();
      formData.append('zipFile', file);

      const res = await fetch('/api/photos/bulk-zip', {
        method: 'POST',
        body: formData
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Gagal memproses arsip ZIP foto.');
      }

      setZipResult(json);
      if (onImportComplete) onImportComplete();
    } catch (error) {
      alert(error.message);
    } finally {
      setIsProcessingZip(false);
      setZipFile(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Top Header Banner with Solid Deep Teal & Concentric Rings */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#094B44] text-white p-5 sm:p-6 lg:p-7 shadow-md shadow-[#094B44]/25 border border-white/15">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#D6F2EE] tracking-tight">
              Impor Massal Data & Foto Santri
            </h1>
            <p className="text-xs sm:text-sm text-[#EFF6F3]/90 font-normal mt-1">
              Daftarkan santri baru atau lengkapi berkas data secara kolektif dengan mudah
            </p>
          </div>

          {onBackToSantri && (
            <div className="relative z-20 flex items-center gap-2 sm:gap-3 flex-wrap">
              <button
                onClick={onBackToSantri}
                className="px-4 py-2.5 rounded-xl border border-teal-200 text-teal-950 bg-white hover:bg-teal-50 text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-teal-700" />
                <span>Kembali ke Data Santri</span>
              </button>
            </div>
          )}
        </div>

        {/* Pattern Mandala Watermark */}
        <div className="absolute -right-8 -bottom-16 sm:-right-6 sm:-bottom-20 pointer-events-none z-0 opacity-[0.16] text-white select-none">
          <svg className="w-72 h-72 sm:w-96 sm:h-96" viewBox="0 0 200 200" fill="none" stroke="currentColor">
            <circle cx="100" cy="100" r="16" strokeWidth="1.2" />
            <circle cx="100" cy="100" r="32" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="100" cy="100" r="54" strokeWidth="1.2" />
            <circle cx="100" cy="100" r="76" strokeWidth="1" />
            <circle cx="100" cy="100" r="95" strokeWidth="1.5" />
            <path
              d="M100 20 C110 50 130 70 160 80 C130 90 110 110 100 140 C90 110 70 90 40 80 C70 70 90 50 100 20 Z"
              strokeWidth="1.2"
            />
            <path
              d="M100 20 C110 50 130 70 160 80 C130 90 110 110 100 140 C90 110 70 90 40 80 C70 70 90 50 100 20 Z"
              strokeWidth="1"
              transform="rotate(45 100 100)"
            />
            <polygon points="100,8 123,77 192,100 123,123 100,192 77,123 8,100 77,77" strokeWidth="0.8" />
            <polygon
              points="100,8 123,77 192,100 123,123 100,192 77,123 8,100 77,77"
              strokeWidth="0.8"
              transform="rotate(45 100 100)"
            />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Excel Importer (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-teal-100 shadow-xs p-6 space-y-6">
          
          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-full border border-slate-200">
            <button
              type="button"
              onClick={() => handleModeChange('create')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                activeMode === 'create'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-teal-900 hover:bg-white/60'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Impor Data Baru (Registrasi)</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange('update')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                activeMode === 'update'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-teal-900 hover:bg-white/60'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Update & Lengkapi Data Kolektif</span>
              {incompleteCount > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeMode === 'update' ? 'bg-[#20E2D7] text-teal-950' : 'bg-amber-100 text-amber-900'
                }`}>
                  {incompleteCount} Belum Lengkap
                </span>
              )}
            </button>
          </div>

          {/* Section Header with Dynamic Download Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-teal-100/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60 flex items-center justify-center font-bold">
                <FileSpreadsheet className="w-5 h-5 text-teal-700" />
              </div>
              <div>
                <h3 className="font-bold text-teal-900 text-sm">
                  {activeMode === 'create'
                    ? '1. Registrasi Santri Baru (.xlsx / .csv)'
                    : '1. Update & Lengkapi Data Santri (.xlsx / .csv)'}
                </h3>
                <p className="text-xs text-slate-400 font-normal">
                  {activeMode === 'create'
                    ? 'Pendaftaran santri baru massal dari file template resmi'
                    : 'Melengkapi berkas santri lama via Smart Merge'}
                </p>
              </div>
            </div>

            {activeMode === 'create' ? (
              <a
                href="/api/excel/template"
                className="px-4 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 text-xs font-semibold flex items-center gap-2 border border-teal-200 transition"
                title="Download template kosong Excel resmi"
              >
                <Download className="w-4 h-4 text-teal-700" />
                <span>Download Template Kosong</span>
              </a>
            ) : (
              <a
                href="/api/excel/export?filter_status=belum_lengkap"
                className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 text-xs font-semibold flex items-center gap-2 border border-emerald-300 transition"
                title="Download daftar santri yang datanya belum lengkap beserta kolom kekurangannya"
              >
                <Download className="w-4 h-4 text-emerald-700" />
                <span>Download Data Santri Belum Lengkap (.xlsx)</span>
              </a>
            )}
          </div>

          {/* Information & Guidance Card */}
          {activeMode === 'update' ? (
            <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-200/70 text-xs text-teal-950 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-teal-900">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Fitur Smart Merge Aktif: Aman & Tanpa Risiko Hapus Data</span>
              </div>
              <p className="text-slate-600 leading-relaxed font-normal">
                File Excel yang anda unduh di atas sudah otomatis terisi No. Induk dan Nama Santri beserta kolom <strong>Catatan Kekurangan</strong>. 
                Cukup isi kolom yang masih kosong di Excel lalu upload kembali ke sini. <strong>Kolom yang dibiarkan kosong di Excel tidak akan menghapus data lama di database</strong>.
              </p>
              <p className="text-[11px] text-teal-700 font-medium">
                💡 <em>Tips: anda juga bisa menggunakan file Excel hasil filter tertentu dari menu Data Santri (misal hanya kelas tertentu).</em>
              </p>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
              <p className="font-normal">
                Gunakan mode ini untuk menambahkan santri baru. Sistem otomatis mendeteksi dan mencegah nomor induk yang sudah pernah terdaftar di database.
              </p>
            </div>
          )}

          {/* Upload Dropzone */}
          {!previewData && !importResult && (
            <div className="relative border-2 border-dashed border-teal-200 hover:border-teal-500 rounded-2xl p-8 text-center bg-teal-50/20 hover:bg-teal-50/40 transition cursor-pointer group">
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleExcelFileSelect}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="max-w-sm mx-auto space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-teal-200 mx-auto flex items-center justify-center text-teal-600 group-hover:scale-105 transition">
                  <Upload className="w-6 h-6 text-teal-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {activeMode === 'create'
                      ? 'Pilih atau Drag File Excel Santri Baru'
                      : 'Pilih atau Drag File Excel untuk Update Data'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 font-normal">Mendukung format .xlsx, .xls, dan .csv</p>
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-semibold">
                  Angka 0 di depan No. Induk / NISPP aman dan tidak hilang
                </div>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isPreviewing && (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-teal-600" />
              <p className="text-sm font-semibold text-teal-900">
                {activeMode === 'update'
                  ? 'Mencocokkan No. Induk ke database & memvalidasi data...'
                  : 'Membaca dan memvalidasi file Excel...'}
              </p>
            </div>
          )}

          {/* Import Success Message */}
          {importResult && (
            <div className="p-6 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-teal-800 font-bold">
                <CheckCircle2 className="w-5 h-5 text-teal-600" />
                <span>{activeMode === 'update' ? 'Pembaruan Data Berhasil!' : 'Impor Data Baru Berhasil!'}</span>
              </div>
              <p className="text-xs text-teal-900 font-normal">{importResult.message}</p>
              <button
                onClick={() => setImportResult(null)}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition shadow-xs cursor-pointer"
              >
                Impor File Lainnya
              </button>
            </div>
          )}

          {/* Preview & Validation Report */}
          {previewData && (
            <div className="space-y-5 animate-in fade-in">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Total Baris</span>
                  <span className="text-lg font-bold text-slate-800">{previewData.summary.totalRows}</span>
                </div>

                {activeMode === 'update' ? (
                  <>
                    <div className="p-3 bg-teal-50 rounded-xl border border-teal-200">
                      <span className="text-[10px] text-teal-700 font-semibold block uppercase">Ada di Database</span>
                      <span className="text-lg font-bold text-teal-800">{previewData.summary.foundInDbCount || 0}</span>
                    </div>
                    <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                      <span className="text-[10px] text-rose-600 font-semibold block uppercase">Tidak Ditemukan</span>
                      <span className="text-lg font-bold text-rose-700">{previewData.summary.notFoundCount || 0}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-teal-50 rounded-xl border border-teal-200">
                      <span className="text-[10px] text-teal-700 font-semibold block uppercase">Valid Siap Impor</span>
                      <span className="text-lg font-bold text-teal-800">{previewData.summary.validCount}</span>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                      <span className="text-[10px] text-amber-700 font-semibold block uppercase">NIS Sudah Ada</span>
                      <span className="text-lg font-bold text-amber-800">{previewData.summary.duplicateDbCount}</span>
                    </div>
                  </>
                )}

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">Format Tidak Valid</span>
                  <span className="text-lg font-bold text-slate-700">{previewData.summary.invalidCount}</span>
                </div>
              </div>

              {/* Duplicate Handling Option (Only for Data Baru) */}
              {activeMode === 'create' && (
                <div className="p-4 bg-teal-50/30 rounded-xl border border-teal-100 space-y-2 text-xs">
                  <label className="font-semibold text-teal-900 block">
                    Pilihan Penanganan Jika No. Induk Sudah Ada di Database:
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                      <input
                        type="radio"
                        name="dupMode"
                        value="skip"
                        checked={duplicateMode === 'skip'}
                        onChange={() => setDuplicateMode('skip')}
                        className="text-teal-600"
                      />
                      <span>Lewati data yang sudah ada (Pertahankan data lama)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                      <input
                        type="radio"
                        name="dupMode"
                        value="update"
                        checked={duplicateMode === 'update'}
                        onChange={() => setDuplicateMode('update')}
                        className="text-teal-600"
                      />
                      <span>Perbarui data lama dengan data baru dari Excel</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Preview Table */}
              <div className="border border-teal-200/80 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-teal-50/80 text-teal-900 font-bold text-[10px] uppercase sticky top-0 border-b border-teal-200">
                    <tr>
                      <th className="p-2.5">Baris</th>
                      <th className="p-2.5">No. Induk</th>
                      <th className="p-2.5">Nama Santri</th>
                      <th className="p-2.5">TTL</th>
                      <th className="p-2.5">Kamar / Kelas</th>
                      <th className="p-2.5">Status Validasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previewData.preview.map((row, idx) => (
                      <tr key={idx} className={row.isValid ? 'hover:bg-teal-50/20' : 'bg-rose-50/50'}>
                        <td className="p-2.5 font-mono text-slate-400">{row.rowNum}</td>
                        <td className="p-2.5 font-mono font-semibold text-teal-800">{row.no_induk || row.nispp || '-'}</td>
                        <td className="p-2.5 font-semibold text-slate-800">{row.nama_lengkap || row.nama || '-'}</td>
                        <td className="p-2.5 text-slate-600 font-normal">
                          {row.kamar_asrama || row.kamar || '-'} / {row.kelas ? `${row.kelas}${row.ruang ? ` ${row.ruang}` : ''}` : (row.ruang || '-')}
                        </td>
                        <td className="p-2.5">
                          {activeMode === 'update' ? (
                            row.foundInDb ? (
                              <span className="text-[10px] text-teal-800 font-semibold bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                                <Check className="w-3 h-3 text-teal-600" />
                                <span>Terdaftar (Siap Dilengkapi)</span>
                              </span>
                            ) : (
                              <span className="text-[10px] text-rose-700 font-semibold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                                {row.errors.join(', ')}
                              </span>
                            )
                          ) : (
                            row.isValid ? (
                              row.isDuplicateDb ? (
                                <span className="text-[10px] text-amber-800 font-semibold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                  Duplikat DB ({duplicateMode === 'update' ? 'Akan Diupdate' : 'Dilewati'})
                                </span>
                              ) : (
                                <span className="text-[10px] text-teal-800 font-semibold bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                                  Siap Ditambahkan
                                </span>
                              )
                            ) : (
                              <span className="text-[10px] text-rose-700 font-semibold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                                {row.errors.join(', ')}
                              </span>
                            )
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setPreviewData(null);
                    setExcelFile(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
                >
                  Batal & Pilih File Lain
                </button>

                <button
                  type="button"
                  disabled={isImporting || (activeMode === 'update' ? (previewData.summary.foundInDbCount === 0) : (previewData.summary.validCount === 0))}
                  onClick={handleCommitImport}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-2 shadow-xs border border-teal-500 transition disabled:opacity-50 cursor-pointer"
                >
                  {isImporting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#20E2D7]" />
                      <span>{activeMode === 'update' ? 'Sedang Memperbarui Data...' : 'Sedang Menyimpan ke Database...'}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#20E2D7]" />
                      <span>
                        {activeMode === 'update'
                          ? `Konfirmasi & Terapkan Pembaruan (${previewData.summary.foundInDbCount || previewData.summary.validCount} Santri)`
                          : `Konfirmasi & Simpan Santri Baru (${previewData.summary.validCount} Data)`}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Bulk Photo ZIP Matcher (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-teal-100 shadow-xs p-6 space-y-5">
          <div className="flex items-center gap-3 border-b border-teal-100/60 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center justify-center font-bold">
              <FolderArchive className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-teal-900 text-sm">2. Upload Foto Massal (ZIP)</h3>
              <p className="text-xs text-slate-400 font-normal">Pencocokan nama file otomatis ke NISPP</p>
            </div>
          </div>

          <div className="text-xs text-slate-600 space-y-2 bg-teal-50/30 p-4 rounded-xl border border-teal-100">
            <p className="font-semibold text-teal-900">Petunjuk Penamaan File Foto:</p>
            <p className="font-normal">1. Beri nama file foto sesuai dengan NISPP santri.</p>
            <p className="font-mono bg-white p-1.5 rounded border border-amber-200 text-[11px] text-amber-900 font-semibold">
              Contoh: 002401001.jpg, 002401002.png
            </p>
            <p className="font-normal">2. Kumpulkan seluruh foto santri ke dalam 1 file <b>.ZIP</b> lalu upload di bawah ini.</p>
          </div>

          {/* ZIP Upload Dropzone */}
          <div className="relative border-2 border-dashed border-amber-200 hover:border-amber-500 rounded-2xl p-6 text-center bg-amber-50/20 hover:bg-amber-50/40 transition cursor-pointer group">
            <input
              type="file"
              accept=".zip"
              disabled={isProcessingZip}
              onChange={handleZipUpload}
              className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-amber-200 mx-auto flex items-center justify-center text-amber-600 group-hover:scale-105 transition">
                {isProcessingZip ? (
                  <RefreshCw className="w-5 h-5 animate-spin text-amber-600" />
                ) : (
                  <Image className="w-5 h-5" />
                )}
              </div>
              <p className="text-xs font-semibold text-slate-700">
                {isProcessingZip ? 'Sedang Mengekstrak & Mencocokkan...' : 'Pilih File ZIP Foto'}
              </p>
              <span className="text-[10px] text-slate-400 block font-normal">Maksimal 100MB</span>
            </div>
          </div>

          {/* ZIP Result Report */}
          {zipResult && (
            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 space-y-3 text-xs animate-in fade-in">
              <div className="flex items-center gap-2 font-bold text-teal-800">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Hasil Pencocokan Foto:</span>
              </div>
              <div className="space-y-1 font-normal">
                <p>• <b>{zipResult.matchedCount}</b> foto berhasil dicocokkan ke database.</p>
                {zipResult.unmatchedCount > 0 && (
                  <p className="text-amber-800 font-semibold">• <b>{zipResult.unmatchedCount}</b> foto tidak cocok dengan NISPP mana pun.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
