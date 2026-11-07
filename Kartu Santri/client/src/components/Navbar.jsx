import React, { useState } from 'react';
import { LogOut, User, Menu } from 'lucide-react';

export function Navbar({
  currentUser,
  onLogout,
  onToggleMobileSidebar
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const userRole = currentUser?.role || 'admin';

  // Role mapping: tidak kapital (huruf kecil) sesuai instruksi: admin, tata usaha, perawat
  const roleDisplayNames = {
    admin: 'admin',
    tu: 'tata usaha',
    kesehatan: 'perawat'
  };

  const roleText = roleDisplayNames[userRole] || 'admin';

  // Deteksi bahasa browser pengguna: jika bahasa Indonesia gunakan 'Keluar', selain itu 'Logout'
  const isIndonesian = typeof navigator !== 'undefined' &&
    ((navigator.language || navigator.userLanguage || '').toLowerCase().startsWith('id'));
  const logoutText = isIndonesian ? 'Keluar' : 'Logout';

  return (
    <header className="relative h-14 sm:h-16 px-4 sm:px-8 flex items-center justify-between shrink-0 z-30 bg-[#006359] shadow-xs border-b border-[#B6E5DE]/20">
      {/* Pattern Watermark Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        {/* Geometric Tessellation Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.14]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="header-mesh-pattern" width="36" height="36" patternUnits="userSpaceOnUse">
              <path d="M18 0 L36 18 L18 36 L0 18 Z" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-white" />
              <circle cx="18" cy="18" r="5" fill="none" stroke="currentColor" strokeWidth="0.6" className="text-[#B6E5DE]" />
              <circle cx="0" cy="0" r="3" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white" />
              <circle cx="36" cy="0" r="3" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white" />
              <circle cx="0" cy="36" r="3" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white" />
              <circle cx="36" cy="36" r="3" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#header-mesh-pattern)" />
        </svg>

        {/* Mandala Watermark Motif (Right Edge) */}
        <div className="absolute -right-6 -bottom-12 opacity-[0.18] text-white pointer-events-none">
          <svg className="w-52 h-52 sm:w-64 sm:h-64" viewBox="0 0 200 200" fill="none" stroke="currentColor">
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
          </svg>
        </div>
      </div>

      {/* Sisi Kiri: Menu Hamburger (hanya muncul di Mobile/Tablet) */}
      <div className="relative z-10 flex items-center min-w-0">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="p-2 -ml-2 rounded-xl text-white hover:bg-white/15 lg:hidden transition cursor-pointer"
          aria-label="Buka Menu Navigasi"
        >
          <Menu className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Sisi Kanan: Foto Profil / Icon User & Status Role */}
      <div className="relative z-10 flex items-center ml-auto">
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(prev => !prev)}
            className="flex flex-col items-center group cursor-pointer focus:outline-hidden py-1 px-1.5 rounded-xl hover:bg-white/15 transition select-none"
            title="Klik untuk keluar"
          >
            {/* Foto Profil: Jika user tidak upload foto profil, gunakan icon user */}
            {currentUser?.foto_path ? (
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-white/80 shadow-2xs p-0.5 bg-white group-hover:scale-105 transition-transform">
                <img
                  src={currentUser.foto_path}
                  alt="Foto Profil"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            ) : (
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-xs border-2 border-white/60 text-teal-950 flex items-center justify-center shadow-2xs group-hover:scale-105 group-hover:bg-white/30 transition-all">
                <User className="w-5 h-5 text-teal-950" />
              </div>
            )}

            {/* Status Role: Huruf kecil, warna soft turquoise mist */}
            <span className="text-[11px] font-normal text-[#D6F2EE]/85 mt-1 leading-none font-sans tracking-wide">
              {roleText}
            </span>
          </button>

          {/* Dropdown Menu Saat Foto Profil Diklik: Hanya Tombol Keluar / Logout */}
          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsDropdownOpen(false)}
                aria-hidden="true"
              />
              <div className="absolute right-0 top-full mt-2 w-32 sm:w-36 bg-white rounded-2xl shadow-xl border border-teal-100/90 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{logoutText}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
