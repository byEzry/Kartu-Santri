import React from 'react';
import { formatTTL, formatCurrentDate, StampQudsiyyah, SignaturePengasuh, getNameFontSize, getBioFontSize, parseRulesText, getBackTitleFontSize, getRulesLayout, parseFooterLines, getAreaDataLayout } from './CardSantri';

const defaultLogo = '/logo-qudsiyyah.png';

/**
 * CardMahrom Component
 * Replicates the official card design tailored specifically for Kartu Mahrom / Wali
 */
export const CardMahrom = React.forwardRef(({
  santri,
  pesantren,
  template,
  side = 'front', // 'front' | 'back'
  scale = 1,
}, ref) => {
  if (!santri) return null;

  const bgFront = template?.bg_mahrom_front;
  const bgBack = template?.bg_mahrom_back;
  const showLogo = template?.show_logo_mahrom !== 0;
  const keteranganMahrom = template?.keterangan_mahrom || 'Kartu ini mohon dibawa\nSaat sambangan / menjemput santri';
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
  // SISI BELAKANG (Back Side - Ketentuan Kunjungan Mahrom)
  // ----------------------------------------------------
  if (side === 'back') {
    const defaultMahromKetentuan = `1.  Santri dapat dikunjungi/sambangan setiap satu bulan sekali dan boleh diajak keluar
2.  Waktu sambangan ditentukan oleh pengasuh dan akan diinfokan lebih lanjut melalui grup WA
3.  Santri memiliki jatah pulang sebanyak 3 kali dalam satu tahun pelajaran yaitu Idul Fithri, Libur semester 1 dan Libur semester 2.
4.  Jika ada acara/hajat di rumah, maka santri diperbolehkan pulang.
5.  Acara/hajat yang diperbolehkan pulang adalah :
       a.  Pernikahan saudara kandung
       b.  Khitanan saudara kandung
       c.  Haji/umroh bapak/ibu
       d.  Meninggalnya orang tua, saudara kandung, kakek/nenek (kandung).
6.  Waktu pulang untuk acara/hajat di rumah adalah :
       a.  Wilayah 1 – 50 KM : 1 hari
       b.  Wilayah 51 – 150 KM : 2 hari 
       c.  Wilayah >150 KM : 3 hari`;

    const rawTitle = template?.judul_belakang_mahrom || 'PERATURAN KUNJUNGAN DAN PERIJINAN PULANG';
    const titleFontSize = getBackTitleFontSize(rawTitle);

    const rawRulesText = template?.ketentuan_mahrom || defaultMahromKetentuan;
    const parsedRules = parseRulesText(rawRulesText);
    const layout = getRulesLayout(parsedRules);

    const footerText = template?.footer_belakang_mahrom || 'Bagi yang menemukan kartu ini, mohon bisa mengembalikan ke alamat yang tertera atau menghubungi Pondok Pesantren Qudsiyyah Putri';
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
              className="font-redhat-black font-black uppercase tracking-tight text-[#15803d] whitespace-nowrap"
              style={{ fontSize: titleFontSize }}
            >
              {rawTitle}
            </h2>
          </div>

          {/* Area Konten: Auto-Scale Font & Spacing Menyesuaikan Isi Ketentuan Mahrom */}
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
  // SISI DEPAN (Front Side - Official Kartu Mahrom Design)
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

        {/* Title: Kartu Mahrom (posisi dipertahankan tetap, geser ke kanan 2mm, warna solid putih) */}
        <div className="text-left -mt-[1px] mb-0 pl-6 pr-1">
          <h1
            className="font-redhat-black font-black text-[15.5px] leading-none tracking-tight inline-block text-white"
            style={{
              textShadow: '0px 1px 2px rgba(0, 0, 0, 0.65)'
            }}
          >
            Kartu Mahrom
          </h1>
        </div>

        {/* ================= MIDDLE BODY: PHOTO & BIODATA (geser ke bawah 0.2mm, tidak menimpa kotak kuning) ================= */}
        <div className="flex items-start gap-2 mt-[3.5px] mb-auto px-1">
          {/* Santri Photo (calibrated to 66px x 84px to prevent any banner/footer overlap) */}
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
          {/* Bottom Left: Keterangan Penggunaan (Identik seperti saat ada background kustom, geser ke atas 0.01mm) */}
          <div className="text-left pl-0 max-w-[195px]" style={{ paddingTop: '5.95px' }}>
            {keteranganMahrom ? (
              <div
                className="text-left flex flex-col justify-center items-start bg-transparent px-0 py-0"
                style={{ minHeight: '22px' }}
              >
                {keteranganMahrom.split('\n').map((line, idx) => {
                  const isFirstLine = idx === 0 || line.toLowerCase().includes('kartu ini mohon dibawa');
                  return (
                    <p
                      key={idx}
                      className={`font-redhat-bold font-bold leading-tight whitespace-nowrap ${
                        isFirstLine ? 'text-[10px]' : 'text-[7px]'
                      }`}
                      style={{
                        color: '#1e3f20',
                        fontWeight: 700,
                        fontSize: isFirstLine ? '10px' : undefined,
                        position: isFirstLine ? 'relative' : undefined,
                        top: isFirstLine ? '1.5px' : undefined
                      }}
                    >
                      {line}
                    </p>
                  );
                })}
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
