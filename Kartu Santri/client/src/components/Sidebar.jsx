import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  Printer,
  CreditCard,
  Stethoscope,
  Palette,
  Database,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
  Settings,
  ShieldCheck,
  Calendar,
  Sparkles
} from 'lucide-react';

const defaultLogo = '/logo-qp.png';

export function Sidebar({
  currentTab,
  setCurrentTab,
  pesantren,
  currentUser,
  isOpen = false,
  onClose
}) {
  const [isMinimized, setIsMinimized] = useState(() => {
    try {
      return localStorage.getItem('sidebar_minimized') === 'true';
    } catch (e) {
      return false;
    }
  });

  // State to track expanded accordion sub-menus
  const [openCetakSub, setOpenCetakSub] = useState(true);
  const [openPengaturanSub, setOpenPengaturanSub] = useState(true);

  const toggleMinimize = () => {
    setIsMinimized((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('sidebar_minimized', String(next));
      } catch (e) {}
      return next;
    });
  };

  const userRole = currentUser?.role || 'admin';

  // Automatically keep Cetak Kartu submenu open if an active tab belongs to it
  useEffect(() => {
    if (['generator', 'kesehatan_berobat', 'desain'].includes(currentTab)) {
      setOpenCetakSub(true);
    }
  }, [currentTab]);

  // Automatically keep Pengaturan submenu open if an active tab belongs to it
  useEffect(() => {
    if (['pengaturan', 'pengaturan_pesantren', 'pengaturan_akun', 'pengaturan_master', 'pesantren'].includes(currentTab)) {
      setOpenPengaturanSub(true);
    }
  }, [currentTab]);

  const handleMenuClick = (tabId) => {
    setCurrentTab(tabId);
    if (onClose) onClose();
  };

  const isCetakActive = ['generator', 'kesehatan_berobat', 'desain'].includes(currentTab);
  const isPengaturanActive = ['pengaturan', 'pengaturan_pesantren', 'pengaturan_akun', 'pengaturan_master', 'pesantren'].includes(currentTab);

  return (
    <>
      {/* Mobile/Tablet Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container: Solid Deep Teal (#094B44) */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 lg:inset-auto z-50 h-screen bg-[#094B44] text-white flex flex-col justify-between shrink-0 select-none shadow-xl lg:shadow-none transition-transform duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isMinimized ? 'w-72 lg:w-20' : 'w-72'}`}
      >
        {/* EMIS Style Mandala Watermark Pattern in the Bottom Area */}
        <div className="absolute -bottom-10 -left-10 pointer-events-none z-0 opacity-[0.14] text-white select-none">
          <svg className="w-80 h-80" viewBox="0 0 200 200" fill="none" stroke="currentColor">
            {/* Concentric subtle rings */}
            <circle cx="100" cy="100" r="16" strokeWidth="1.2" />
            <circle cx="100" cy="100" r="32" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="100" cy="100" r="54" strokeWidth="1.2" />
            <circle cx="100" cy="100" r="76" strokeWidth="1" />
            <circle cx="100" cy="100" r="95" strokeWidth="1.5" />
            {/* 8-Petal Islamic Lotus / Mandala Flower */}
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

        {/* TOP SECTION: Logo & Application Title */}
        <div className="relative h-14 sm:h-16 px-3.5 sm:px-4 flex items-center shrink-0 z-10 bg-[#006359] border-b border-[#B6E5DE]/20 shadow-xs overflow-hidden">
          {/* Pattern Background */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
            {/* Geometric Tessellation Pattern identical to Header */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.14]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="sidebar-header-mesh-pattern" width="36" height="36" patternUnits="userSpaceOnUse">
                  <path d="M18 0 L36 18 L18 36 L0 18 Z" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-white" />
                  <circle cx="18" cy="18" r="5" fill="none" stroke="currentColor" strokeWidth="0.6" className="text-[#B6E5DE]" />
                  <circle cx="0" cy="0" r="3" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white" />
                  <circle cx="36" cy="0" r="3" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white" />
                  <circle cx="0" cy="36" r="3" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white" />
                  <circle cx="36" cy="36" r="3" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#sidebar-header-mesh-pattern)" />
            </svg>
          </div>

          {/* Content (z-10 relative) */}
          <div className="relative z-10 w-full">
            {!isMinimized ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-white p-0.5 shadow-2xs shrink-0 flex items-center justify-center">
                    <img
                      src={pesantren?.logo_path || defaultLogo}
                      alt="Logo Qudsiyyah"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 font-sans">
                    <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-[#B6E5DE] uppercase block leading-none truncate">
                      Aplikasi Cetak
                    </span>
                    <span className="text-[15px] sm:text-[16px] font-extrabold tracking-tight text-white uppercase block leading-tight mt-1 truncate">
                      Kartu Santri
                    </span>
                  </div>
                </div>

                <div className="flex items-center shrink-0">
                  {/* Minimize Toggle (Desktop) */}
                  <button
                    type="button"
                    onClick={toggleMinimize}
                    className="hidden lg:flex p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
                    title="Perkecil Sidebar"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Mobile Close Button */}
                  <button
                    type="button"
                    onClick={onClose}
                    className="lg:hidden p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
                    aria-label="Tutup Menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1.5 w-full">
                <div className="w-8 h-8 rounded-lg bg-white p-0.5 shadow-2xs shrink-0 flex items-center justify-center">
                  <img
                    src={pesantren?.logo_path || defaultLogo}
                    alt="Logo Qudsiyyah"
                    className="w-full h-full object-contain"
                  />
                </div>
                <button
                  type="button"
                  onClick={toggleMinimize}
                  className="p-1 rounded-lg text-white hover:bg-white/10 transition cursor-pointer"
                  title="Perluas Sidebar"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MIDDLE SECTION: Menu Navigation with Solid White Pill for Active Item */}
        <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-1.5 scrollbar-thin scrollbar-thumb-teal-800 relative z-10 border-r border-[#006e60]/30">
          {/* MENU 1: Dashboard (Beranda) */}
          {(userRole === 'admin' || userRole === 'tu') && (
            <button
              onClick={() => handleMenuClick('dashboard')}
              title={isMinimized ? 'Beranda' : undefined}
              className={`w-full flex items-center gap-3.5 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all duration-200 text-left cursor-pointer ${
                currentTab === 'dashboard'
                  ? 'bg-white text-[#094B44] font-bold shadow-xs'
                  : 'text-white/95 hover:text-white hover:bg-white/10 font-semibold'
              } ${isMinimized ? 'justify-center px-0' : ''}`}
            >
              <LayoutDashboard
                className={`w-5 h-5 shrink-0 ${
                  currentTab === 'dashboard' ? 'text-[#094B44]' : 'text-white/90'
                }`}
              />
              {!isMinimized && <span className="truncate">Beranda</span>}
            </button>
          )}

          {/* MENU 2: Data Santri */}
          <button
            onClick={() => handleMenuClick('santri')}
            title={isMinimized ? 'Data Santri' : undefined}
            className={`w-full flex items-center gap-3.5 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all duration-200 text-left cursor-pointer ${
              currentTab === 'santri' || currentTab === 'import' || currentTab === 'santri_form' || currentTab === 'santri_detail'
                ? 'bg-white text-[#094B44] font-bold shadow-xs'
                : 'text-white/95 hover:text-white hover:bg-white/10 font-semibold'
            } ${isMinimized ? 'justify-center px-0' : ''}`}
          >
            <Users
              className={`w-5 h-5 shrink-0 ${
                currentTab === 'santri' || currentTab === 'import' || currentTab === 'santri_form' || currentTab === 'santri_detail' ? 'text-[#094B44]' : 'text-white/90'
              }`}
            />
            {!isMinimized && <span className="truncate">Data Santri</span>}
          </button>

          {/* MENU 3: Generator Kartu (Accordion with Cetak Kartu, Cetak Kolektif, Desain) */}
          <div className="space-y-1">
            <button
              onClick={() => {
                if (isMinimized) {
                  setIsMinimized(false);
                  if (userRole === 'kesehatan') handleMenuClick('kesehatan_berobat');
                  else handleMenuClick('generator');
                } else {
                  setOpenCetakSub(!openCetakSub);
                }
              }}
              title={isMinimized ? 'Generator Kartu' : undefined}
              className={`w-full flex items-center justify-between px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all duration-200 text-left cursor-pointer ${
                isCetakActive
                  ? 'bg-white/15 text-white font-bold'
                  : 'text-white/95 hover:text-white hover:bg-white/10 font-semibold'
              } ${isMinimized ? 'justify-center px-0' : ''}`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <CreditCard className="w-5 h-5 shrink-0 text-white/90" />
                {!isMinimized && <span className="truncate">Generator Kartu</span>}
              </div>
              {!isMinimized && (
                <span className="text-white/80">
                  {openCetakSub ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </span>
              )}
            </button>

            {/* Sub-menu Generator Kartu */}
            {!isMinimized && openCetakSub && (
              <div className="pl-4 pr-1 space-y-1 pt-1 ml-5 border-l-2 border-[#009688]/40 animate-in fade-in duration-150">
                {(userRole === 'admin' || userRole === 'tu') && (
                  <button
                    onClick={() => handleMenuClick('generator')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-[13px] transition text-left cursor-pointer ${
                      currentTab === 'generator'
                        ? 'bg-white text-[#094B44] font-bold shadow-2xs'
                        : 'text-teal-50/90 hover:text-white hover:bg-white/10 font-medium'
                    }`}
                  >
                    <Printer
                      className={`w-4 h-4 shrink-0 ${
                        currentTab === 'generator' ? 'text-[#094B44]' : 'text-teal-100'
                      }`}
                    />
                    <span className="truncate">Cetak Kartu</span>
                  </button>
                )}

                {(userRole === 'admin' || userRole === 'tu' || userRole === 'kesehatan') && (
                  <button
                    onClick={() => handleMenuClick('kesehatan_berobat')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-[13px] transition text-left cursor-pointer ${
                      currentTab === 'kesehatan_berobat'
                        ? 'bg-white text-[#094B44] font-bold shadow-2xs'
                        : 'text-teal-50/90 hover:text-white hover:bg-white/10 font-medium'
                    }`}
                  >
                    <Stethoscope
                      className={`w-4 h-4 shrink-0 ${
                        currentTab === 'kesehatan_berobat' ? 'text-[#094B44]' : 'text-teal-100'
                      }`}
                    />
                    <span className="truncate">Cetak Kolektif Berobat</span>
                  </button>
                )}

                {(userRole === 'admin' || userRole === 'tu') && (
                  <button
                    onClick={() => handleMenuClick('desain')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-[13px] transition text-left cursor-pointer ${
                      currentTab === 'desain'
                        ? 'bg-white text-[#094B44] font-bold shadow-2xs'
                        : 'text-teal-50/90 hover:text-white hover:bg-white/10 font-medium'
                    }`}
                  >
                    <Palette
                      className={`w-4 h-4 shrink-0 ${
                        currentTab === 'desain' ? 'text-[#094B44]' : 'text-teal-100'
                      }`}
                    />
                    <span className="truncate">Desain Kartu</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* MENU 4: Pengaturan (Accordion with Profil Pesantren, Data Akun) */}
          {userRole === 'admin' && (
            <div className="space-y-1">
              <button
                onClick={() => {
                  if (isMinimized) {
                    setIsMinimized(false);
                    handleMenuClick('pengaturan_pesantren');
                  } else {
                    setOpenPengaturanSub(!openPengaturanSub);
                  }
                }}
                title={isMinimized ? 'Pengaturan' : undefined}
                className={`w-full flex items-center justify-between px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all duration-200 text-left cursor-pointer ${
                  isPengaturanActive
                    ? 'bg-white/15 text-white font-bold'
                    : 'text-white/95 hover:text-white hover:bg-white/10 font-semibold'
                } ${isMinimized ? 'justify-center px-0' : ''}`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <Settings className="w-5 h-5 shrink-0 text-white/90" />
                  {!isMinimized && <span className="truncate">Pengaturan</span>}
                </div>
                {!isMinimized && (
                  <span className="text-white/80">
                    {openPengaturanSub ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </span>
                )}
              </button>

              {/* Sub-menu Pengaturan (Hanya 2 Menu: Profil Pesantren & Master Data) */}
              {!isMinimized && openPengaturanSub && (
                <div className="pl-4 pr-1 space-y-1 pt-1 ml-5 border-l-2 border-[#009688]/40 animate-in fade-in duration-150">
                  <button
                    onClick={() => handleMenuClick('pengaturan_pesantren')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-[13px] transition text-left cursor-pointer ${
                      currentTab === 'pengaturan_pesantren' || currentTab === 'pesantren'
                        ? 'bg-white text-[#094B44] font-bold shadow-2xs'
                        : 'text-teal-50/90 hover:text-white hover:bg-white/10 font-medium'
                    }`}
                  >
                    <Building2
                      className={`w-4 h-4 shrink-0 ${
                        currentTab === 'pengaturan_pesantren' || currentTab === 'pesantren'
                          ? 'text-[#094B44]'
                          : 'text-teal-100'
                      }`}
                    />
                    <span className="truncate">Profil Pesantren</span>
                  </button>

                  <button
                    onClick={() => handleMenuClick('pengaturan_master')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-[13px] transition text-left cursor-pointer ${
                      currentTab === 'pengaturan_master' || currentTab === 'pengaturan_akun'
                        ? 'bg-white text-[#094B44] font-bold shadow-2xs'
                        : 'text-teal-50/90 hover:text-white hover:bg-white/10 font-medium'
                    }`}
                  >
                    <Database
                      className={`w-4 h-4 shrink-0 ${
                        currentTab === 'pengaturan_master' || currentTab === 'pengaturan_akun' ? 'text-[#094B44]' : 'text-teal-100'
                      }`}
                    />
                    <span className="truncate">Master Data</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* MENU 5: Backup & Restore DB */}
          {userRole === 'admin' && (
            <button
              onClick={() => handleMenuClick('backup')}
              title={isMinimized ? 'Backup & Restore DB' : undefined}
              className={`w-full flex items-center gap-3.5 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all duration-200 text-left cursor-pointer ${
                currentTab === 'backup'
                  ? 'bg-white text-[#094B44] font-bold shadow-xs'
                  : 'text-white/95 hover:text-white hover:bg-white/10 font-semibold'
              } ${isMinimized ? 'justify-center px-0' : ''}`}
            >
              <Database
                className={`w-5 h-5 shrink-0 ${
                  currentTab === 'backup' ? 'text-[#094B44]' : 'text-white/90'
                }`}
              />
              {!isMinimized && <span className="truncate">Backup & Restore DB</span>}
            </button>
          )}
        </div>

        {/* BOTTOM SECTION: Institution Notice */}
        <div className="p-3.5 sm:p-4 border-t border-white/10 shrink-0 relative z-10 text-center border-r border-[#006e60]/30">
          {!isMinimized ? (
            <p className="text-xs text-teal-100/90 font-medium leading-relaxed tracking-wide">
              ©2026 Pondok Pesantren Qudsiyyah Putri
            </p>
          ) : (
            <div className="flex justify-center" title="©2026 Pondok Pesantren Qudsiyyah Putri">
              <span className="text-xs font-bold text-teal-100">QP</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
