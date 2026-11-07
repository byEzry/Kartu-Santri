import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const defaultLogo = '/logo-qudsiyyah.png';

// Format TTL (Tempat Lahir, Tanggal Lahir)
export function formatTTL(tempat, tanggal) {
  if (!tempat && !tanggal) return '-';
  if (!tanggal) return tempat;
  
  let formattedDate = tanggal;
  try {
    const d = new Date(tanggal);
    if (!isNaN(d.getTime())) {
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      formattedDate = new Intl.DateTimeFormat('id-ID', options).format(d);
    }
  } catch (e) {}

  if (!tempat) return formattedDate;
  return `${tempat}, ${formattedDate}`;
}

// Format current date in Indonesian for signature
export function formatCurrentDate(dateStr) {
  try {
    const d = dateStr ? new Date(dateStr) : new Date();
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return `Kudus, ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch (e) {
    return 'Kudus, Juli 2025';
  }
}

// Helper tata letak dan ukuran font adaptif untuk Area Data (Nama s/d Alamat)
// Menjamin:
// 1. Nama santri tetap 1 baris, tebal (weight 900) dan selalu lebih besar dari tulisan biodata
// 2. Alamat maksimal 2 baris
// 3. Area data lebih luas: dalam kondisi normal, alamat dapat dipanjangkan sampai dua baris tanpa mengubah/mengecilkan ukuran font (tetap 8px).
//    Batas bawah area data diperluas ke bawah secara proporsional mengisi ruang hingga tepat di atas area pengesahan ("Kudus, ...").
//    Ukuran font & spasi baris otomatis menyesuaikan dengan halus agar teks alamat 2 baris tidak terpotong dan tidak menabrak Area Pengesahan.
export function getAreaDataLayout(name, alamat, wali = '') {
  const nameLen = (name || '').trim().length;
  const alamatLen = (alamat || '').trim().length;
  const waliLen = (wali || '').trim().length;

  // 1. Skala font nama agar selalu presisi 1 baris utuh, tebal (weight 900), dan selalu lebih menonjol dari NISPP
  let nameFontSize = '11.5px';
  let nameLetterSpacing = '-0.1px';

  if (nameLen > 52) {
    nameFontSize = '8.2px';
    nameLetterSpacing = '-0.35px';
  } else if (nameLen > 46) {
    nameFontSize = '8.7px';
    nameLetterSpacing = '-0.3px';
  } else if (nameLen > 39) {
    // Nama panjang 40 - 46 karakter (seperti Hasna Rahadatul... = 44 karakter) tetap besar & tebal di 9.3px
    nameFontSize = '9.3px';
    nameLetterSpacing = '-0.25px';
  } else if (nameLen > 32) {
    nameFontSize = '10.0px';
    nameLetterSpacing = '-0.2px';
  } else if (nameLen > 24) {
    nameFontSize = '10.7px';
    nameLetterSpacing = '-0.15px';
  } else {
    nameFontSize = '11.5px';
    nameLetterSpacing = '-0.1px';
  }

  // 2. Skala ukuran font biodata & spasi baris berdasarkan kepadatan data:
  // - Alamat pendek (<= 82 char): font 8px normal, spasi seimbang.
  // - Alamat sedang/panjang (83 - 105 char): font 7.4px, spasi seimbang (rowGap 1.8px, bioLeading 1.22)
  //   sehingga 2 baris muat 100% utuh tanpa terpotong & jarak ke area pengesahan padat rapi (~8-9px).
  // - Alamat sangat panjang (106 - 128 char): font 6.9px.
  // - Alamat ekstrem (> 128 char): font 6.3px.
  const isExtreme = alamatLen > 128 || (nameLen > 48 && alamatLen > 110);
  const isVeryLong = alamatLen > 105 || (nameLen > 42 && alamatLen > 92) || waliLen > 44;
  const isModerate = alamatLen > 82 || (nameLen > 35 && alamatLen > 74);

  let bioFontSize = '8px';
  let bioLeading = '1.24';
  let rowGap = '2.0px';
  let nameMarginBottom = '2.2px';
  let labelWidth = '26px';

  if (isExtreme) {
    bioFontSize = '6.3px';
    bioLeading = '1.14';
    rowGap = '1.1px';
    nameMarginBottom = '1.2px';
    labelWidth = '24px';
  } else if (isVeryLong) {
    bioFontSize = '6.9px';
    bioLeading = '1.18';
    rowGap = '1.4px';
    nameMarginBottom = '1.5px';
    labelWidth = '25px';
  } else if (isModerate) {
    bioFontSize = '7.4px';
    bioLeading = '1.22';
    rowGap = '1.8px';
    nameMarginBottom = '2.0px';
    labelWidth = '26px';
  }

  return {
    nameFontSize,
    nameLetterSpacing,
    nameMarginBottom,
    bioFontSize,
    bioLeading,
    rowGap,
    labelWidth
  };
}

export function getNameFontSize(name) {
  return getAreaDataLayout(name, '').nameFontSize;
}

export function getBioFontSize(alamat) {
  const layout = getAreaDataLayout('', alamat);
  return { size: layout.bioFontSize, leading: layout.bioLeading };
}

// Parsing text tata tertib multi-baris dari form input template
export function parseRulesText(text) {
  if (!text || typeof text !== 'string') return [];
  const rawLines = text.split('\n');
  return rawLines
    .map((line) => {
      if (!line.trim()) return { type: 'empty' };

      // Deteksi indentasi awal baris (tab atau spasi >= 3)
      const leadingSpaces = line.match(/^[\s\t]+/);
      const hasIndent = leadingSpaces && (leadingSpaces[0].includes('\t') || leadingSpaces[0].length >= 3);

      // Cek format penomoran: angka atau huruf (1., 1), a., a))
      const match = line.trim().match(/^(\d+|[a-zA-Z])[\.\)]\s+(.*)$/);
      if (match) {
        return {
          type: 'rule',
          hasIndent: !!hasIndent,
          marker: `${match[1]}.`,
          text: match[2].trim()
        };
      }

      // Baris teks biasa atau kelanjutan baris
      return {
        type: 'text',
        hasIndent: !!(hasIndent || (leadingSpaces && leadingSpaces[0].length > 0)),
        text: line.trim()
      };
    })
    .filter((item, idx, arr) => {
      if (item.type === 'empty' && (idx === 0 || idx === arr.length - 1 || arr[idx - 1].type === 'empty')) {
        return false;
      }
      return true;
    });
}

// Helper auto-fit font size untuk judul sisi belakang kartu agar selalu 1 baris
export function getBackTitleFontSize(title) {
  const len = (title || '').trim().length;
  if (len <= 20) return '16px';
  if (len <= 26) return '14.5px';
  if (len <= 34) return '13px';
  if (len <= 42) return '12px';
  if (len <= 50) return '10.5px';
  if (len <= 60) return '9.5px';
  return '8.5px';
}

// Helper memecah teks footer sisi belakang kartu menjadi baris yang rapi (mendukung manual newline atau auto-split teks panjang)
export function parseFooterLines(text) {
  if (!text) return [];
  const trimmed = text.trim();
  if (trimmed.includes('\n')) {
    return trimmed.split('\n').map(l => l.trim()).filter(Boolean);
  }
  // Jika teks tunggal cukup panjang (> 70 karakter seperti default), pisahkan secara natural pada kata penghubung
  if (trimmed.length > 70) {
    if (trimmed.includes(' atau ')) {
      const idx = trimmed.indexOf(' atau ');
      return [trimmed.slice(0, idx).trim(), trimmed.slice(idx).trim()];
    }
    const mid = Math.floor(trimmed.length / 2);
    const spaceNearMid = trimmed.indexOf(' ', mid);
    if (spaceNearMid !== -1) {
      return [trimmed.slice(0, spaceNearMid).trim(), trimmed.slice(spaceNearMid + 1).trim()];
    }
  }
  return [trimmed];
}

// Helper auto-fit layout cerdas (font size, line height, spasi) untuk isi tatib
export function getRulesLayout(parsedRules) {
  const count = parsedRules.length;
  const totalChars = parsedRules.reduce((acc, r) => acc + (r.text || '').length, 0);

  if (count <= 8 && totalChars < 500) {
    return {
      fontSize: '7px',
      lineHeight: '1.3',
      spacingClass: 'space-y-1.5',
      markerWidth: 'w-3'
    };
  }
  if (count <= 11 && totalChars < 800) {
    return {
      fontSize: '6.5px',
      lineHeight: '1.25',
      spacingClass: 'space-y-1',
      markerWidth: 'w-2.5'
    };
  }
  if (count <= 16 && totalChars < 1250) {
    return {
      fontSize: '6px',
      lineHeight: '1.2',
      spacingClass: 'space-y-0.5',
      markerWidth: 'w-2.5'
    };
  }
  if (count <= 20) {
    return {
      fontSize: '5.3px',
      lineHeight: '1.16',
      spacingClass: 'space-y-[1px]',
      markerWidth: 'w-2.5'
    };
  }
  return {
    fontSize: '4.8px',
    lineHeight: '1.12',
    spacingClass: 'space-y-0',
    markerWidth: 'w-2'
  };
}

/**
 * StampQudsiyyah: Authentic Blue Official Seal Stamp SVG
 */
export const StampQudsiyyah = ({ className = "w-16 h-16" }) => (
  <svg
    viewBox="0 0 100 100"
    className={`${className} select-none pointer-events-none text-blue-800 drop-shadow-2xs opacity-90`}
    style={{ transform: 'rotate(-7deg)' }}
  >
    {/* Outer Double Circle */}
    <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 1" />
    <circle cx="50" cy="50" r="43" fill="none" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1.2" />

    {/* Text Along Top Arc */}
    <path id="stamp-arc-top" d="M 14,50 A 36,36 0 1,1 86,50" fill="none" />
    <text fontSize="6.2" fontWeight="bold" fill="currentColor" letterSpacing="0.4">
      <textPath href="#stamp-arc-top" startOffset="50%" textAnchor="middle">
        YAYASAN PENDIDIKAN ISLAM QUDSIYYAH
      </textPath>
    </text>

    {/* Text Along Bottom Arc */}
    <path id="stamp-arc-bottom" d="M 86,50 A 36,36 0 0,1 14,50" fill="none" />
    <text fontSize="6.8" fontWeight="bold" fill="currentColor" letterSpacing="0.6">
      <textPath href="#stamp-arc-bottom" startOffset="50%" textAnchor="middle">
        ★ KUDUS ★
      </textPath>
    </text>

    {/* Center Arabic Text and Year */}
    <text x="50" y="44" fontSize="7.5" fontWeight="bold" textAnchor="middle" fill="currentColor" fontFamily="serif">
      المدرسة القدسية للبنات
    </text>
    <line x1="28" y1="48" x2="72" y2="48" stroke="currentColor" strokeWidth="0.8" />
    <text x="50" y="55" fontSize="6.5" fontWeight="bold" textAnchor="middle" fill="currentColor">
      PP QUDSIYYAH PUTRI
    </text>
    <text x="50" y="63" fontSize="5.5" textAnchor="middle" fill="currentColor" fontFamily="serif">
      ٢٠١٧ / ١٤٣٨
    </text>
  </svg>
);

/**
 * SignaturePengasuh: Authentic Handwritten Signature SVG
 */
export const SignaturePengasuh = ({ className = "w-20 h-10" }) => (
  <svg
    viewBox="0 0 120 60"
    className={`${className} select-none pointer-events-none text-black drop-shadow-2xs`}
  >
    <path
      d="M 15,45 C 25,20 32,10 40,25 C 48,40 50,48 55,20 C 60,8 65,4 68,22 C 70,35 68,52 64,55 C 60,58 55,50 62,35 C 70,18 85,15 95,28 C 102,36 108,30 112,32"
      fill="none"
      stroke="currentColor"
      strokeWidth="6.0"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M 68,2 C 67,15 66,35 66,55"
      fill="none"
      stroke="currentColor"
      strokeWidth="5.2"
      strokeLinecap="round"
    />
    <path
      d="M 45,45 Q 80,43 115,44"
      fill="none"
      stroke="currentColor"
      strokeWidth="4.4"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * BuildingWatermark: Subtle Madrasah & Pesantren building facade watermark
 */
const BuildingWatermark = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-[0.14] z-0">
    <svg viewBox="0 0 428 270" className="w-full h-full object-cover text-emerald-950" fill="currentColor">
      {/* Repeating arches and pillars representing islamic pesantren architecture */}
      <rect x="0" y="120" width="428" height="150" fill="currentColor" opacity="0.08" />
      <g opacity="0.4">
        {[20, 75, 130, 185, 240, 295, 350, 405].map((x, i) => (
          <g key={i}>
            <rect x={x} y="130" width="38" height="120" rx="19" fill="none" stroke="currentColor" strokeWidth="2" />
            <rect x={x + 4} y="145" width="30" height="95" rx="15" fill="none" stroke="currentColor" strokeWidth="1" />
            <rect x={x + 12} y="165" width="14" height="60" fill="currentColor" opacity="0.25" />
            <circle cx={x + 19} cy="140" r="4" fill="currentColor" opacity="0.3" />
          </g>
        ))}
      </g>
      {/* Roof balustrades & parapet */}
      <line x1="0" y1="125" x2="428" y2="125" stroke="currentColor" strokeWidth="2" />
      <line x1="0" y1="118" x2="428" y2="118" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
      <line x1="0" y1="210" x2="428" y2="210" stroke="currentColor" strokeWidth="1" />
    </svg>
  </div>
);

/**
 * WaveDecorations: Flowing organic green curve waves matching Image 2 & 3
 */
const WaveDecorations = ({ isBack = false }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
    <svg viewBox="0 0 428 270" className="w-full h-full">
      {/* Top right gentle curve */}
      <path
        d="M 320,0 C 370,10 410,40 428,80 L 428,0 Z"
        fill="#86efac"
        opacity="0.35"
      />
      <path
        d="M 350,0 C 390,15 418,45 428,60 L 428,0 Z"
        fill="#22c55e"
        opacity="0.2"
      />

      {/* Side and Bottom organic green waves */}
      {isBack ? (
        <>
          <path
            d="M 428,120 C 390,140 370,180 380,240 C 385,255 395,265 428,270 Z"
            fill="#86efac"
            opacity="0.4"
          />
          <path
            d="M 428,150 C 400,165 390,195 400,245 C 405,260 415,268 428,270 Z"
            fill="#16a34a"
            opacity="0.5"
          />
        </>
      ) : (
        <>
          <path
            d="M 0,210 C 60,200 120,230 150,270 L 0,270 Z"
            fill="#86efac"
            opacity="0.3"
          />
          <path
            d="M 340,270 C 360,240 395,225 428,230 L 428,270 Z"
            fill="#86efac"
            opacity="0.25"
          />
        </>
      )}
    </svg>
  </div>
);

/**
 * CardSantri Component
 * Perfectly replicates official Pondok Pesantren Qudsiyyah Putri card (CR80 standard 85.6mm x 54mm)
 */
export const CardSantri = React.forwardRef(({
  santri,
  pesantren,
  template,
  side = 'front', // 'front' | 'back'
  scale = 1,
}, ref) => {
  if (!santri) return null;

  const bgFront = template?.bg_santri_front;
  const bgBack = template?.bg_santri_back;
  const showLogo = template?.show_logo_santri !== 0;
  const keteranganSantri = template?.keterangan_santri || 'Berlaku selama menjadi santri\nPondok Pesantren Qudsiyyah Putri';
  const logoUrl = pesantren?.logo_path || defaultLogo;
  const namaPesantren = pesantren?.nama_pesantren || 'PONDOK PESANTREN QUDSIYYAH PUTRI';
  const alamatPesantren = pesantren?.alamat_pesantren || 'Jl. Lambao No. 1 Singocandi Kota Kudus, Telp. (0291) 2912874 - email : qudsiyyahputri@gmail.com';
  const namaPengasuh = pesantren?.nama_pengasuh || 'MUHAMMAD AINUN NAJIB';
  const sebutanPengasuh = pesantren?.sebutan_pengasuh || 'Pengasuh';
  const tulisanArab = pesantren?.tulisan_arab || 'المؤسسة التربوية الإسلامية قدسية منار قدس';
  const tulisanArabPath = pesantren?.tulisan_arab_path;
  const namaYayasan = pesantren?.nama_yayasan || 'YAYASAN PENDIDIKAN ISLAM QUDSIYYAH MENARA KUDUS';
  const tanggalSurat = pesantren?.tanggal_surat || formatCurrentDate();
  const ttdPath = pesantren?.ttd_pengasuh_path;
  const stempelPath = pesantren?.stempel_path;

  // Card dimensions in pixels for standard 300 DPI screen canvas (85.6mm x 54mm ratio: 1.585)
  const baseWidth = 428;
  const baseHeight = 270;

  const displayName = santri.nama_lengkap || santri.nama;
  const displayInduk = santri.nispp || santri.no_induk || '-';
  const displayWali = santri.nama_ayah || santri.wali || santri.nama_ibu || '-';
  const displayAlamat = santri.alamat_siswa || santri.alamat || '-';
  const displayTTL = formatTTL(santri.tempat_lahir, santri.tanggal_lahir);
  const areaLayout = getAreaDataLayout(displayName, displayAlamat, displayWali);
  const nameFontSize = areaLayout.nameFontSize;
  const bioFont = { size: areaLayout.bioFontSize, leading: areaLayout.bioLeading };

  // ----------------------------------------------------
  // SISI BELAKANG (Back Side - Tata Tertib Santri)
  // ----------------------------------------------------
  if (side === 'back') {
    const defaultSantriTatib = `1. Santri wajib mengikuti semua kegiatan di Pondok Pesantren
2. Santri wajib menaati peraturan dan kebijakan Pondok Pesantren
3. Santri wajib menetap di dalam kompleks Pondok Pesantren
4. Santri wajib menjaga nama baik Pondok Pesantren
5. Santri wajib menjaga kesopanan dan berakhlaqul karimah
6. Santri wajib menjaga kebersihan dan kerapian
7. Santri wajib mengenakan pakaian muslimah (gamis) dan berkerudung
8. Santri wajib menggunakan bahasa Arab dan/atau bahasa Inggris`;

    const rawTitle = template?.judul_belakang_santri || 'TATA TERTIB SANTRI';
    const titleFontSize = getBackTitleFontSize(rawTitle);

    const rawRulesText = template?.tata_tertib_santri || defaultSantriTatib;
    const parsedRules = parseRulesText(rawRulesText);
    const layout = getRulesLayout(parsedRules);

    const footerText = template?.footer_belakang_santri || 'Bagi yang menemukan kartu ini, mohon bisa mengembalikan ke alamat yang tertera atau menghubungi Pondok Pesantren Qudsiyyah Putri';
    const footerLines = parseFooterLines(footerText);
    const firstLine = footerLines[0] || '';
    const otherLines = footerLines.slice(1);

    return (
      <div
        ref={ref}
        className="id-card-cr80 relative overflow-hidden rounded-xl shadow-md border border-emerald-300 select-none text-left print:shadow-none print:border-none print:rounded-none"
        style={{
          width: `${baseWidth}px`,
          height: `${baseHeight}px`,
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: 'top left',
          backgroundColor: '#bfeee6',
          backgroundImage: bgBack ? `url(${bgBack})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxSizing: 'border-box'
        }}
      >

        {/* Content Layer (3 Zona: Header, Area Konten, Footer) */}
        <div className="relative z-10 h-full flex flex-col justify-between p-3.5 pb-2 font-redhat-black">
          {/* Header Title: Dinamis dari Template dengan Auto-Fit 1 Baris (naik ~1mm agar tidak mepet konten) */}
          <div className="text-center -mt-[3.8px] pt-0">
            <h2
              className="font-redhat-black font-black uppercase tracking-wider text-[#15803d] whitespace-nowrap"
              style={{ fontSize: titleFontSize }}
            >
              {rawTitle}
            </h2>
          </div>

          {/* Area Konten: Auto-Scale Font & Spacing Menyesuaikan Isi Tatib */}
          <div className={`${layout.spacingClass} px-3 my-auto font-redhat-black`}>
            {parsedRules.map((item, idx) => {
              if (item.type === 'empty') {
                return <div key={idx} className="h-0.5" />;
              }

              if (item.type === 'rule') {
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-1 font-redhat-black font-black text-slate-800 ${
                      item.hasIndent ? 'pl-3' : ''
                    }`}
                    style={{ fontSize: layout.fontSize, lineHeight: layout.lineHeight }}
                  >
                    <span
                      className={`font-redhat-black font-black text-slate-900 shrink-0 text-right ${layout.markerWidth}`}
                    >
                      {item.marker}
                    </span>
                    <span className="font-redhat-black font-black text-slate-800 flex-1">
                      {item.text}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={idx}
                  className={`font-redhat-black font-black text-slate-800 ${
                    item.hasIndent ? 'pl-3.5' : 'pl-0'
                  }`}
                  style={{ fontSize: layout.fontSize, lineHeight: layout.lineHeight }}
                >
                  {item.text}
                </div>
              );
            })}
          </div>

          {/* Footer Notice: Desain Rata Kanan Minimalis dengan Garis Emas di atas baris pertama */}
          <div className="mt-auto px-1 flex flex-col items-end text-right">
            {firstLine && (
              <div className="inline-block border-t-[1.5px] border-[#c59b27] pt-[2px] text-right max-w-full">
                <p
                  className="text-[6.2px] font-redhat-bold font-bold text-[#1e3f20] leading-tight tracking-tight text-right whitespace-nowrap"
                >
                  {firstLine}
                </p>
              </div>
            )}
            {otherLines.map((line, idx) => (
              <p
                key={idx}
                className="text-[6.2px] font-redhat-bold font-bold text-[#1e3f20] leading-tight tracking-tight text-right mt-[1px] whitespace-nowrap max-w-full"
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // SISI DEPAN (Front Side - Official Card Design)
  // ----------------------------------------------------
  return (
    <div
      ref={ref}
      className="id-card-cr80 relative overflow-hidden rounded-xl shadow-md border border-emerald-300 select-none text-left print:shadow-none print:border-none print:rounded-none"
      style={{
        width: `${baseWidth}px`,
        height: `${baseHeight}px`,
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top left',
        backgroundColor: '#bfeee6',
        backgroundImage: bgFront ? `url(${bgFront})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxSizing: 'border-box'
      }}
    >

      {/* Main Content Layout */}
      <div className="relative z-10 h-full p-2.5 flex flex-col justify-between">
        {/* ================= CARD HEADER ================= */}
        {/* ================= CARD HEADER ================= */}
        <div className="pb-0.5">
          <div className="flex items-center gap-2">
            {/* Logo on Left (digeser ke kanan sedikit agar tidak terlalu ke pinggir, tanpa shadow) */}
            {showLogo && (
              <div
                className="w-8 h-8 shrink-0 flex items-center justify-center ml-2"
                style={{ width: '32px', height: '32px', minWidth: '32px' }}
              >
                <img
                  src={logoUrl}
                  alt="Logo Qudsiyyah"
                  className="w-full h-full object-contain"
                  style={{ width: '32px', height: '32px', maxWidth: '32px', maxHeight: '32px', objectFit: 'contain' }}
                />
              </div>
            )}

            {/* Institution Titles (semua teks warna hitam, tanpa line/shadow) */}
            <div className="flex-1 text-center min-w-0 pr-1">
              {/* Arabic Calligraphy Header (Image or Font) */}
              {tulisanArabPath ? (
                <img
                  src={tulisanArabPath}
                  alt="Kaligrafi Yayasan"
                  className="h-3 max-w-[200px] object-contain mx-auto mb-0.5"
                />
              ) : (
                <p className="text-[8.5px] font-bold text-black leading-none tracking-normal font-serif mb-0.5">
                  {tulisanArab}
                </p>
              )}
              {/* Yayasan Name (font Poppins SemiBold ukuran 6.5, warna hitam) */}
              <h4 className="font-poppins font-semibold text-[6.5px] uppercase tracking-tight text-black leading-none mt-0.5 whitespace-nowrap overflow-hidden">
                {namaYayasan}
              </h4>
              {/* Pondok Pesantren Name (font Bookman Old Style Bold ukuran 10, warna hijau army tua, tanpa shadow) */}
              <h3
                className="font-bookman font-bold text-[10px] uppercase tracking-tight leading-none mt-0.5 whitespace-nowrap overflow-hidden"
                style={{
                  color: '#1e3f20',
                  fontWeight: 700,
                  textShadow: 'none',
                  WebkitTextStroke: '0px transparent'
                }}
              >
                {namaPesantren}
              </h3>
            </div>
          </div>

          {/* Address & Contact (font Poppins Normal ukuran 6, tipis tidak terlalu bold) */}
          <p className="font-poppins font-normal text-[6px] text-black leading-none tracking-tight text-center whitespace-nowrap overflow-hidden mt-1">
            {alamatPesantren}
          </p>
        </div>

        {/* Title: Kartu Santri (posisi dipertahankan tetap, geser ke kanan 2mm, warna solid putih) */}
        <div className="text-left -mt-[1px] mb-0 pl-6 pr-1">
          <h1
            className="font-redhat-black font-black text-[15.5px] leading-none tracking-tight inline-block text-white"
            style={{
              textShadow: '0px 1px 2px rgba(0, 0, 0, 0.65)'
            }}
          >
            Kartu Santri
          </h1>
        </div>

        {/* ================= MIDDLE BODY: PHOTO & BIODATA (geser ke bawah 0.2mm, tidak menimpa kotak kuning) ================= */}
        <div className="flex items-start gap-2 mt-[3.5px] mb-auto px-1">
          {/* Santri Photo with Official Red Background (calibrated to 66px x 84px to prevent any banner/footer overlap) */}
          <div
            className="shrink-0 rounded-lg overflow-hidden border border-emerald-600/80 shadow-xs relative flex items-center justify-center"
            style={{
              width: '66px',
              height: '84px',
              minWidth: '66px',
              minHeight: '84px',
              maxWidth: '66px',
              maxHeight: '84px',
              backgroundColor: '#dc2626'
            }}
          >
            {santri.foto_path ? (
              <img
                src={santri.foto_path}
                alt={santri.nama}
                className="w-full h-full object-cover"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className={`w-full h-full flex flex-col items-center justify-center p-1 text-center text-white ${
                santri.foto_path ? 'hidden' : 'flex'
              }`}
            >
              <svg className="w-8 h-8 text-white/80 mb-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <span className="text-[7px] font-semibold leading-tight text-white/90">Foto Santri</span>
            </div>
          </div>

          {/* Biodata Information (Area Data: Nama s/d Alamat, otomatis menyesuaikan agar tidak menabrak pengesahan) */}
          <div className="flex-1 min-w-0 pr-0.5 pt-[0.5px]">
            {/* Santri Name (Red Hat Display Weight 900, otomatis 1 baris utuh, tebal dan dominan) */}
            <h2
              className="font-redhat-black font-black text-black leading-none whitespace-nowrap overflow-hidden mt-0 pt-0 tracking-tight"
              style={{
                fontSize: areaLayout.nameFontSize,
                marginBottom: areaLayout.nameMarginBottom,
                letterSpacing: areaLayout.nameLetterSpacing,
                fontWeight: 900
              }}
            >
              {displayName}
            </h2>

            {/* Data Rows: NISPP s/d Alamat (Red Hat Display Bold, font & spasi adaptif) */}
            <div
              className="font-redhat-bold font-bold text-black"
              style={{
                fontSize: areaLayout.bioFontSize,
                lineHeight: areaLayout.bioLeading,
                display: 'flex',
                flexDirection: 'column',
                gap: areaLayout.rowGap
              }}
            >
              {/* NISPP */}
              <div className="flex items-baseline">
                <span
                  className="font-bold font-redhat-bold text-black shrink-0 whitespace-nowrap"
                  style={{ width: areaLayout.labelWidth }}
                >
                  NISPP
                </span>
                <span className="w-1.5 text-center font-bold font-redhat-bold text-black shrink-0">:</span>
                <span className="font-bold font-redhat-bold text-black tracking-wide">{displayInduk}</span>
              </div>

              {/* TTL */}
              <div className="flex items-baseline">
                <span
                  className="font-bold font-redhat-bold text-black shrink-0 whitespace-nowrap"
                  style={{ width: areaLayout.labelWidth }}
                >
                  TTL
                </span>
                <span className="w-1.5 text-center font-bold font-redhat-bold text-black shrink-0">:</span>
                <span className="font-bold font-redhat-bold text-black truncate">{displayTTL}</span>
              </div>

              {/* Wali */}
              <div className="flex items-baseline">
                <span
                  className="font-bold font-redhat-bold text-black shrink-0 whitespace-nowrap"
                  style={{ width: areaLayout.labelWidth }}
                >
                  Wali
                </span>
                <span className="w-1.5 text-center font-bold font-redhat-bold text-black shrink-0">:</span>
                <span className="font-bold font-redhat-bold text-black truncate">{displayWali}</span>
              </div>

              {/* Alamat (Maksimal 2 baris, font & line-height adaptif) */}
              <div className="flex items-start">
                <span
                  className="font-semibold font-redhat-semibold text-black shrink-0 whitespace-nowrap"
                  style={{ width: areaLayout.labelWidth }}
                >
                  Alamat
                </span>
                <span className="w-1.5 text-center font-semibold font-redhat-semibold text-black shrink-0">:</span>
                <span
                  className="font-semibold font-redhat-semibold text-black min-w-0 flex-1 overflow-hidden"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: areaLayout.bioLeading
                  }}
                >
                  {displayAlamat}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= CARD FOOTER: KETERANGAN & PENGESAHAN ================= */}
        <div className="flex items-start justify-between px-1 mb-2.5">
          {/* Bottom Left: Keterangan Masa Berlaku (Identik seperti saat ada background kustom, geser ke atas 0.01mm) */}
          <div className="text-left pl-0 max-w-[195px]" style={{ paddingTop: '5.95px' }}>
            {keteranganSantri ? (
              <div
                className="text-left flex flex-col justify-center items-start bg-transparent px-0 py-0"
                style={{ minHeight: '22px' }}
              >
                {keteranganSantri.split('\n').map((line, idx) => (
                  <p
                    key={idx}
                    className="font-redhat-bold font-bold text-[7px] leading-tight whitespace-nowrap"
                    style={{ color: '#1e3f20', fontWeight: 700 }}
                  >
                    {line}
                  </p>
                ))}
              </div>
            ) : (
              <div className="shrink-0 min-h-[16px]" />
            )}
          </div>

          {/* Bottom Right: Signature, Stamp, & Pengasuh Name (geser ke bawah 0.5mm, Red Hat Display Bold) */}
          <div className="relative text-left pr-2 -mt-[13.5px]">
            <p className="font-redhat-bold font-bold text-[8px] text-black leading-tight">
              {tanggalSurat}
            </p>
            <p className="font-redhat-bold font-bold text-[8px] text-black leading-tight mt-0">
              {sebutanPengasuh}
            </p>

            {/* Overlapping Blue Stamp on LEFT, Signature on RIGHT (compact height) */}
            <div className="relative h-4 flex items-center justify-start my-0">
              {/* Stamp (Official Upload or Fallback) - Geser ke atas dan ke kanan 1mm (-20px, -5px) */}
              {stempelPath ? (
                <div className="relative z-0 shrink-0" style={{ position: 'relative', left: '-20px', top: '-5px' }}>
                  <img
                    src={stempelPath}
                    alt="Stempel Pondok"
                    className="w-[39px] h-[39px] object-contain select-none pointer-events-none drop-shadow-2xs opacity-85 -my-2.5"
                    style={{ transform: 'rotate(-5deg)' }}
                  />
                </div>
              ) : (
                <div className="relative z-0 shrink-0" style={{ position: 'relative', left: '-20px', top: '-5px' }}>
                  <StampQudsiyyah className="w-[39px] h-[39px] -my-2.5" />
                </div>
              )}

              {/* Signature Graphic (Official Upload or Fallback) - Diperbesar & digeser ke kiri mengenai stempel */}
              {ttdPath ? (
                <div className="relative z-10 shrink-0 -ml-2.5" style={{ position: 'relative', left: '-18px' }}>
                  <img
                    src={ttdPath}
                    alt="TTD Pengasuh"
                    className="max-h-[26px] max-w-[76px] object-contain select-none pointer-events-none -my-1.5"
                  />
                </div>
              ) : (
                <div className="relative z-10 shrink-0 -ml-2.5" style={{ position: 'relative', left: '-18px' }}>
                  <SignaturePengasuh className="w-[76px] h-[26px] -my-1.5" />
                </div>
              )}
            </div>

            {/* Pengasuh Name (font Red Hat Display Weight 750 ukuran 8, warna hitam) */}
            <p
              className="font-redhat-750 text-[8px] text-black tracking-wide uppercase leading-tight mt-0"
              style={{ fontWeight: 750 }}
            >
              {namaPengasuh}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
