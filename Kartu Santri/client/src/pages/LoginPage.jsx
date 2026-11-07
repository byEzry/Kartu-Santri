import React, { useState } from 'react';
import {
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CreditCard,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export function LoginPage({ onLoginSuccess, pesantren }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e, customUser = null, customPass = null) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const u = customUser || username;
    const p = customPass || password;

    if (!u.trim() || !p.trim()) {
      setErrorMsg('Username dan password wajib diisi.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u, password: p })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Login gagal. Periksa kembali username dan password.');
      }

      onLoginSuccess(json.user);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] w-full flex flex-col justify-between items-center relative overflow-x-hidden overflow-y-auto select-none px-3 sm:px-6 md:px-10 py-4 sm:py-6 md:py-8 bg-[#094B44]">
      {/* ======================================================== */}
      {/* BACKGROUND SVG PATTERN: PATTERN GEOMETRIS TESSELLATION   */}
      {/* ======================================================== */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        {/* Geometric Tessellation Mesh */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.15]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="login-header-mesh-pattern" width="36" height="36" patternUnits="userSpaceOnUse">
              <path d="M18 0 L36 18 L18 36 L0 18 Z" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-white" />
              <circle cx="18" cy="18" r="5" fill="none" stroke="currentColor" strokeWidth="0.6" className="text-[#B6E5DE]" />
              <circle cx="0" cy="0" r="3" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white" />
              <circle cx="36" cy="0" r="3" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white" />
              <circle cx="0" cy="36" r="3" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white" />
              <circle cx="36" cy="36" r="3" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#login-header-mesh-pattern)" />
        </svg>

        {/* ======================================================== */}
        {/* PATTERN LINGKARAN MANDALA DI SUDUT KIRI ATAS             */}
        {/* ======================================================== */}
        <div
          className="absolute top-0 left-0 pointer-events-none select-none -translate-x-1/2 -translate-y-1/2"
        >
          <svg
            viewBox="0 0 400 400"
            className="w-[280px] h-[280px] sm:w-[460px] sm:h-[460px] md:w-[600px] md:h-[600px] lg:w-[740px] lg:h-[740px] xl:w-[840px] xl:h-[840px] text-white opacity-[0.14]"
            fill="none"
          >
            <circle cx="200" cy="200" r="16" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="200" cy="200" r="28" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="200" cy="200" r="42" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="200" cy="200" r="58" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 4" />
            <circle cx="200" cy="200" r="75" stroke="currentColor" strokeWidth="1.1" />
            <circle cx="200" cy="200" r="92" stroke="currentColor" strokeWidth="1.0" strokeDasharray="5 5" />
            <circle cx="200" cy="200" r="110" stroke="currentColor" strokeWidth="0.9" />
            <circle cx="200" cy="200" r="128" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 5" />
            <circle cx="200" cy="200" r="148" stroke="currentColor" strokeWidth="0.7" />
            <circle cx="200" cy="200" r="168" stroke="currentColor" strokeWidth="0.6" strokeDasharray="5 6" />
            <circle cx="200" cy="200" r="188" stroke="currentColor" strokeWidth="0.5" />
            <polygon
              points="200,90 225,168 310,200 225,232 200,310 175,232 90,200 175,168"
              stroke="currentColor"
              strokeWidth="1.3"
            />
            <polygon
              points="200,90 225,168 310,200 225,232 200,310 175,232 90,200 175,168"
              stroke="currentColor"
              strokeWidth="1.0"
              transform="rotate(45 200 200)"
            />
            <path
              d="M200 80 C215 130 240 160 280 175 C240 190 215 220 200 270 C185 220 160 190 120 175 C160 160 185 130 200 80 Z"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path
              d="M200 80 C215 130 240 160 280 175 C240 190 215 220 200 270 C185 220 160 190 120 175 C160 160 185 130 200 80 Z"
              stroke="currentColor"
              strokeWidth="0.9"
              transform="rotate(45 200 200)"
            />
            <line x1="200" y1="200" x2="335" y2="335" stroke="currentColor" strokeWidth="0.9" strokeDasharray="4 4" />
            <line x1="200" y1="200" x2="360" y2="292" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3 4" />
            <line x1="200" y1="200" x2="292" y2="360" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3 4" />
            <line x1="200" y1="200" x2="385" y2="250" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 5" />
            <line x1="200" y1="200" x2="250" y2="385" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 5" />
          </svg>
        </div>

        {/* ======================================================== */}
        {/* PATTERN LINGKARAN MANDALA DI SUDUT KANAN BAWAH           */}
        {/* ======================================================== */}
        <div
          className="absolute bottom-0 right-0 pointer-events-none select-none translate-x-1/2 translate-y-1/2"
        >
          <svg
            viewBox="0 0 400 400"
            className="w-[440px] h-[440px] sm:w-[680px] sm:h-[680px] md:w-[860px] md:h-[860px] lg:w-[1020px] lg:h-[1020px] xl:w-[1120px] xl:h-[1120px] text-white opacity-[0.14]"
            fill="none"
          >
            <circle cx="200" cy="200" r="16" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="200" cy="200" r="28" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="200" cy="200" r="42" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="200" cy="200" r="58" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 4" />
            <circle cx="200" cy="200" r="75" stroke="currentColor" strokeWidth="1.1" />
            <circle cx="200" cy="200" r="92" stroke="currentColor" strokeWidth="1.0" strokeDasharray="5 5" />
            <circle cx="200" cy="200" r="110" stroke="currentColor" strokeWidth="0.9" />
            <circle cx="200" cy="200" r="128" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 5" />
            <circle cx="200" cy="200" r="148" stroke="currentColor" strokeWidth="0.7" />
            <circle cx="200" cy="200" r="168" stroke="currentColor" strokeWidth="0.6" strokeDasharray="5 6" />
            <circle cx="200" cy="200" r="188" stroke="currentColor" strokeWidth="0.5" />
            <polygon
              points="200,90 225,168 310,200 225,232 200,310 175,232 90,200 175,168"
              stroke="currentColor"
              strokeWidth="1.3"
            />
            <polygon
              points="200,90 225,168 310,200 225,232 200,310 175,232 90,200 175,168"
              stroke="currentColor"
              strokeWidth="1.0"
              transform="rotate(45 200 200)"
            />
            <path
              d="M200 80 C215 130 240 160 280 175 C240 190 215 220 200 270 C185 220 160 190 120 175 C160 160 185 130 200 80 Z"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path
              d="M200 80 C215 130 240 160 280 175 C240 190 215 220 200 270 C185 220 160 190 120 175 C160 160 185 130 200 80 Z"
              stroke="currentColor"
              strokeWidth="0.9"
              transform="rotate(45 200 200)"
            />
            <line x1="200" y1="200" x2="65" y2="65" stroke="currentColor" strokeWidth="0.9" strokeDasharray="4 4" />
            <line x1="200" y1="200" x2="40" y2="108" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3 4" />
            <line x1="200" y1="200" x2="108" y2="40" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3 4" />
            <line x1="200" y1="200" x2="15" y2="150" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 5" />
            <line x1="200" y1="200" x2="150" y2="15" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 5" />
          </svg>
        </div>
      </div>

      {/* ======================================================== */}
      {/* HERO MAIN: KARTU SANTRI KARTUN (UKURAN 60-70% LAYAR)     */}
      {/* ======================================================== */}
      <main className="w-full max-w-[920px] md:w-[75%] lg:w-[70%] mx-auto my-auto z-10 py-2 sm:py-4 animate-login-card-entry">
        {/* The Cartoon Card Container with Gentle 3D Floating */}
        <div className="bg-[#F8FCFB] rounded-2xl sm:rounded-3xl border-[3px] border-[#006359] shadow-2xl shadow-teal-950/50 overflow-hidden text-teal-950 flex flex-col relative transition-all duration-300 animate-card-floating">
          
          {/* HEADER KARTU (KOP SURAT RESMI QUDSIIYAH PUTRI - STAGGERED REVEAL FADE IN) */}
          <div className="relative pt-3.5 sm:pt-4 md:pt-5 px-3 sm:px-6 md:px-8 pb-3 sm:pb-4 bg-[#EFF7F5] flex items-center justify-between gap-3 sm:gap-5 md:gap-6 animate-reveal-header">
            {/* Logo Resmi Qudsiyyah (Diperbesar Sesuai Permintaan) */}
            <img
              src="/logo-qp.png"
              alt="Logo Qudsiyyah Putri"
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain shrink-0 drop-shadow-xs"
            />

            {/* Teks Identitas Yayasan & Pesantren (Diperbesar & Dijamin Tidak Terpotong) */}
            <div className="flex-1 text-center min-w-0 px-1">
              {/* Kaligrafi Arab Sama Persis Sesuai Contoh (Diperbesar) */}
              <img
                src="/arabic-qudsiyyah.png"
                alt="المؤسسة التربوية الاسلامية قدسية منار قدس"
                className="h-7 sm:h-9 md:h-11 lg:h-12 object-contain mx-auto"
              />
              <h3 className="text-[10px] sm:text-xs md:text-sm lg:text-[15px] font-bold text-[#094B44] tracking-wide uppercase leading-tight mt-1 sm:mt-1.5">
                YAYASAN PENDIDIKAN ISLAM QUDSIYYAH MENARA KUDUS
              </h3>
              {/* Nama Pesantren: Bold Font Bookman Old Style (Diperbesar) */}
              <h2
                className="font-bookman text-base sm:text-lg md:text-xl lg:text-[23px] font-bold text-[#094B44] tracking-tight uppercase leading-tight mt-1 sm:mt-1.5"
              >
                PONDOK PESANTREN QUDSIYYAH PUTRI
              </h2>
              {/* Alamat Lengkap Tidak Terpotong (Diperbesar) */}
              <p className="text-[9.5px] sm:text-[11px] md:text-xs lg:text-[13px] text-teal-900/90 font-medium leading-relaxed mt-1 sm:mt-1.5 max-w-2xl mx-auto break-words">
                Jl. Lambao No. 1 Singocandi Kota Kudus, Telp. (0291) 2912874 - email : qudsiyyahputri@gmail.com
              </p>
            </div>
          </div>

          {/* PITA IDENTITAS KARTU: APLIKASI CETAK KARTU SANTRI DENGAN AKSEN KUNING (MELUNCUR DARI KIRI) */}
          <div className="w-full flex items-center px-3 sm:px-6 md:px-8 py-2 bg-[#EFF7F5]/50 overflow-hidden animate-reveal-ribbon">
            {/* Pita Hijau Solid dengan teks */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#009688] text-white pl-3.5 sm:pl-4 pr-4 sm:pr-5 py-1 sm:py-1.5 rounded-r-full shadow-xs border border-[#007D71] z-10 shrink-0">
              <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
              <span className="text-[11px] sm:text-xs md:text-sm font-extrabold tracking-wide uppercase">
                Aplikasi Cetak Kartu Santri
              </span>
            </div>

            {/* Strip Aksen Kuning: HANYA MENYAMBUNG DARI SISI KANAN PITA HIJAU */}
            <div className="flex-1 h-2.5 sm:h-3 bg-[#E5B800] rounded-r-full -ml-3 z-0" />
          </div>

          {/* BADAN KARTU (ISINYA: FOTO SANTRIWATI & FORM LOGIN DI DALAM KARTU) */}
          <div className="p-3 sm:p-5 md:p-6 lg:p-7 flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-7 items-stretch">
            
            {/* SISI KIRI: FOTO KARTUN SANTRIWATI BERHIJAB & BADGE KUNING */}
            <div className="flex flex-col items-center justify-center shrink-0 w-full md:w-52 lg:w-60 mx-auto">
              {/* Bingkai Foto Kartun Berlatar Merah Khas Kartu Pelajar (MEMBESAR PERLAHAN / SCALE UP) */}
              <div className="w-36 h-48 sm:w-40 sm:h-54 md:w-48 md:h-64 lg:w-52 lg:h-70 aspect-[3/4] rounded-2xl border-[3px] border-[#006359]/30 bg-[#EA2423] shadow-md overflow-hidden relative mx-auto animate-reveal-photo">
                <img
                  src="/avatar-santri-hijab.png"
                  alt="Ilustrasi Santriwati Berhijab Hitam Jas Hijau Muda"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Lengkungan Badge Kuning Khas Kartu Santri - POSISI DI TENGAH (FADE IN UP) */}
              <div className="w-full max-w-[240px] sm:max-w-[260px] md:max-w-full mt-3 sm:mt-3.5 bg-[#E5B800] text-teal-950 py-2 sm:py-2.5 px-3 rounded-xl border border-amber-600/30 shadow-xs flex flex-col items-center justify-center text-center mx-auto animate-reveal-badge">
                <span className="text-[9.5px] sm:text-[10.5px] md:text-[11.5px] font-black uppercase leading-tight tracking-wider text-teal-950 text-center">
                  Berlaku Selama Menjadi Santri
                </span>
                <span className="text-[8.5px] sm:text-[9.5px] md:text-[10px] font-bold text-teal-900 leading-tight mt-0.5 text-center">
                  Pondok Pesantren Qudsiyyah Putri
                </span>
              </div>
            </div>

            {/* SISI KANAN: TEMPAT LOGIN DI DALAM KARTU (FADE IN UP) */}
            <div className="flex-1 flex flex-col justify-between min-w-0 animate-reveal-form">
              <div>
                {/* Posisi Nama Diganti: Silakan Login (Diperbesar Sesuai Permintaan) */}
                <div className="border-b-2 border-[#B6E5DE]/80 pb-2.5 sm:pb-3 mb-3.5 sm:mb-4">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-black text-[#094B44] tracking-tight leading-tight">
                    Silakan Login
                  </h1>
                  <p className="text-xs sm:text-sm md:text-base text-teal-800 font-semibold mt-1">
                    Masuk ke Sistem Administrasi Cetak Kartu Santri
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-2.5 sm:p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Form Input Username & Password */}
                <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="text-[11px] sm:text-xs font-bold text-teal-900 uppercase tracking-wider block mb-1">
                      Username
                    </label>
                    <div className="relative">
                      <User className="w-4.5 h-4.5 text-teal-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="Ketik username anda..."
                        aria-label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl border-2 border-[#B6E5DE] bg-white text-sm text-teal-950 placeholder:text-teal-800/40 focus:border-[#009688] focus:ring-2 focus:ring-[#009688]/30 outline-hidden transition font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] sm:text-xs font-bold text-teal-900 uppercase tracking-wider block mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4.5 h-4.5 text-teal-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Ketik kata sandi..."
                        aria-label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl border-2 border-[#B6E5DE] bg-white text-sm text-teal-950 placeholder:text-teal-800/40 focus:border-[#009688] focus:ring-2 focus:ring-[#009688]/30 outline-hidden transition font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-teal-600 hover:text-teal-800 transition cursor-pointer p-1"
                        aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Tombol Login Bersih & Tegas */}
                  <div className="pt-2 sm:pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto min-w-[160px] py-2.5 sm:py-3 px-6 rounded-xl sm:rounded-2xl bg-[#009688] hover:bg-[#007D71] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-[#094B44]/25 border-2 border-[#007D71] transition duration-150 active:scale-[0.98] cursor-pointer"
                    >
                      <span>{loading ? 'Memeriksa...' : 'Login Sekarang'}</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ======================================================== */}
      {/* FOOTER COPYRIGHT (Z-10) */}
      {/* ======================================================== */}
      <footer className="w-full text-center py-1 sm:py-2 z-10 shrink-0">
        <p className="text-xs sm:text-sm font-medium text-[#D6F2EE]/90 tracking-wide drop-shadow-2xs px-2">
          © 2026 Pondok Pesantren Qudsiyyah Putri || all right reserved
        </p>
      </footer>
    </div>
  );
}

