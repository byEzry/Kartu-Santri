import React, { useState, useEffect } from 'react';
import {
  Users,
  Image,
  CreditCard,
  AlertCircle,
  PlusCircle,
  FileSpreadsheet,
  Printer,
  Database,
  ArrowRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  Crown,
  BarChart3,
  Eye,
  Filter,
  User
} from 'lucide-react';

export function Dashboard({
  currentUser,
  onNavigate,
  onAddNewSantri,
  onOpenCardDetail,
  onQuickPrint
}) {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'lengkap' | 'belum_lengkap' | 'belum_foto'
  const [tableSantri, setTableSantri] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/santri/stats');
      const json = await res.json();
      if (json.success) {
        setStatsData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredSantri = async (filterKey) => {
    try {
      setTableLoading(true);
      const param = filterKey === 'all' ? '' : `filter_status=${filterKey}&`;
      const res = await fetch(`/api/santri?${param}limit=10&page=1`);
      const json = await res.json();
      if (json.success && (json.data || json.santri)) {
        setTableSantri(json.data || json.santri);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchFilteredSantri(activeFilter);
  }, [activeFilter]);

  // Statistik aktual dari database master
  const totalSantriCount = statsData?.stats?.totalSantri ?? 0;
  const completeCount = statsData?.stats?.completeData ?? 0;
  const incompleteCount = statsData?.stats?.incompleteData ?? 0;
  const withoutPhotoCount = statsData?.stats?.withoutPhoto ?? 0;

  const chartItems = [
    {
      key: 'all',
      label: 'Total Santri',
      value: totalSantriCount,
      percentage: totalSantriCount > 0 ? 100 : 0,
      subtext: 'Santri terdaftar aktif di database',
      badge: 'Semua Data'
    },
    {
      key: 'lengkap',
      label: 'Data Lengkap',
      value: completeCount,
      percentage: totalSantriCount > 0 ? Math.round((completeCount / totalSantriCount) * 100) : 0,
      subtext: 'Biodata & wali santri telah lengkap',
      badge: 'Lengkap'
    },
    {
      key: 'belum_lengkap',
      label: 'Data Belum Lengkap',
      value: incompleteCount,
      percentage: totalSantriCount > 0 ? Math.round((incompleteCount / totalSantriCount) * 100) : 0,
      subtext: 'Perlu verifikasi berkas atau data wali',
      badge: 'Belum Lengkap'
    },
    {
      key: 'belum_foto',
      label: 'Belum Foto',
      value: withoutPhotoCount,
      percentage: totalSantriCount > 0 ? Math.round((withoutPhotoCount / totalSantriCount) * 100) : 0,
      subtext: 'Belum mengunggah pasfoto resmi',
      badge: 'Belum Foto'
    }
  ];

  // Metadata keterangan filter untuk judul tabel
  const filterTitles = {
    all: {
      title: 'Data Santri: Semua Santri',
      subtitle: 'Menampilkan data santri terdaftar di database master',
      totalCount: totalSantriCount
    },
    lengkap: {
      title: 'Data Santri: Data Lengkap',
      subtitle: 'Menampilkan santri yang biodata dan berkas walinya sudah lengkap',
      totalCount: completeCount
    },
    belum_lengkap: {
      title: 'Data Santri: Data Belum Lengkap',
      subtitle: 'Menampilkan santri yang memerlukan kelengkapan biodata atau data wali',
      totalCount: incompleteCount
    },
    belum_foto: {
      title: 'Data Santri: Belum Foto',
      subtitle: 'Menampilkan santri yang belum mengunggah pasfoto resmi untuk kartu',
      totalCount: withoutPhotoCount
    }
  };

  const currentFilterInfo = filterTitles[activeFilter] || filterTitles.all;

  const recentActivitiesList = statsData?.recentActivities || [];

  const userName = currentUser?.nama || currentUser?.username || 'Administrator';

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-8 max-w-7xl mx-auto">
      {/* Hero Welcome Banner (Matching Sidebar Deep Teal & Mandala Pattern) */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#094B44] text-white p-5 sm:p-7 lg:p-8 shadow-md shadow-[#094B44]/25 border border-white/15">
        <div className="relative z-10 max-w-2xl space-y-1">
          <span className="text-base sm:text-lg lg:text-xl font-medium text-[#D6F2EE]/90 block">
            Selamat datang,
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#D6F2EE] tracking-tight">
            {userName}
          </h1>
        </div>

        {/* Mandala Watermark Pattern (Same as Sidebar) */}
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

      {/* Horizontal Bar Chart (Interaktif untuk filter data tabel di bawahnya) */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-teal-200/70 shadow-xs p-4 sm:p-5 lg:p-6 space-y-3 sm:space-y-4">
        {/* Header Bar Chart */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-teal-100/60 pb-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold border border-teal-200/60 shadow-2xs">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-teal-700" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base lg:text-lg font-bold text-teal-950 tracking-tight">
                Statistik & Kelengkapan Data Santri
              </h2>
            </div>
          </div>
        </div>

        {/* Chart Body */}
        <div className="pt-1">
          <div className="relative">
            {/* Background Vertical Grid Lines */}
            <div className="absolute inset-y-0 left-24 sm:left-36 md:left-44 right-16 sm:right-28 md:right-36 pointer-events-none flex justify-between z-0">
              {[0, 25, 50, 75, 100].map((val) => (
                <div key={val} className={`h-full border-r border-slate-100 last:border-r-0 ${[25, 75].includes(val) ? 'hidden sm:block' : ''}`} />
              ))}
            </div>

            {/* Bars List */}
            <div className="relative z-10 space-y-1 sm:space-y-1.5">
              {chartItems.map((item) => {
                const percent = item.percentage;
                const isActive = activeFilter === item.key;
                return (
                  <div
                    key={item.key}
                    onClick={() => setActiveFilter(item.key)}
                    role="button"
                    tabIndex={0}
                    title={`Klik untuk memfilter: ${item.label}`}
                    className={`flex items-center gap-2 sm:gap-3 md:gap-4 cursor-pointer select-none transition-all duration-150 rounded-lg sm:rounded-xl py-1 sm:py-1.5 px-2 sm:px-2.5 -mx-2 sm:-mx-2.5 border ${
                      isActive
                        ? 'bg-teal-50/50 border-teal-300/60 shadow-2xs'
                        : 'border-transparent hover:bg-slate-50/80'
                    }`}
                  >
                    {/* Y-Axis Label (Left) */}
                    <div className="w-24 sm:w-36 md:w-44 text-right shrink-0">
                      <div className="flex items-center justify-end gap-1.5">
                        {isActive && (
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-teal-600 animate-pulse shrink-0" />
                        )}
                        <span className={`text-xs sm:text-sm font-bold block truncate transition ${
                          isActive ? 'text-teal-900' : 'text-slate-700 hover:text-teal-900'
                        }`}>
                          {item.label}
                        </span>
                      </div>
                    </div>

                    {/* Bar Track & Fill */}
                    <div className="flex-1 flex items-center min-w-0">
                      <div className="w-full bg-slate-100/70 rounded-r-lg overflow-hidden h-7 sm:h-8 flex items-center border border-slate-200/50">
                        {percent > 0 ? (
                          <div
                            className={`h-full rounded-r-lg bg-[#009688] shadow-xs transition-all duration-500 ease-out flex items-center justify-end pr-2 sm:pr-3 ${
                              isActive ? 'brightness-110' : 'opacity-90 hover:opacity-100'
                            }`}
                            style={{ width: `${percent}%` }}
                          >
                            {percent >= 15 && (
                              <span className="text-[10px] sm:text-xs font-bold text-white font-mono opacity-95 whitespace-nowrap">
                                {percent}%
                              </span>
                            )}
                          </div>
                        ) : null}
                      </div>

                      {/* Total angka & persen diujung chart */}
                      <div className="ml-2.5 sm:ml-4 shrink-0 flex items-center gap-1.5 min-w-[75px] sm:min-w-[110px] md:min-w-[130px]">
                        <span className={`font-mono font-black text-sm sm:text-base ${
                          isActive ? 'text-teal-700' : 'text-teal-950'
                        }`}>
                          {item.value.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase hidden sm:inline">
                          Santri
                        </span>
                        <span className={`text-[10.5px] font-bold font-mono px-1.5 py-0.5 rounded-md ${
                          isActive ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {percent}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* X-Axis Scale along the bottom (Persen Asli) */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mt-2.5 sm:mt-3 pt-2 border-t border-slate-100">
              <div className="w-24 sm:w-36 md:w-44 text-right shrink-0 text-[10px] font-bold text-slate-400 uppercase">
                Skala
              </div>
              <div className="flex-1 flex justify-between pr-16 sm:pr-28 md:pr-36 text-[10px] sm:text-xs font-mono font-semibold text-slate-400">
                <span>0%</span>
                <span className="hidden sm:inline">25%</span>
                <span>50%</span>
                <span className="hidden sm:inline">75%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Filtered Santri Table & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Filtered Santri Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-teal-200/70 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-teal-100/60 pb-3">
            <div>
              <h3 className="font-bold text-teal-950 text-base">{currentFilterInfo.title}</h3>
            </div>

            <button
              onClick={() => onNavigate('santri')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 transition cursor-pointer"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#20E2D7]" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-teal-50/90 border-b-2 border-teal-200 text-teal-900 font-bold text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-3 w-12 text-center">FOTO</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">NIS</th>
                  <th className="py-2.5 px-3">NAMA LENGKAP</th>
                  <th className="py-2.5 px-3">STATUS DATA</th>
                  <th className="py-2.5 px-3 text-right">AKSI CEPAT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-teal-100/40">
                {tableLoading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                        <span>Memuat data santri...</span>
                      </div>
                    </td>
                  </tr>
                ) : tableSantri && tableSantri.length > 0 ? (
                  tableSantri.map((santri, index) => {
                    const hasNik = Boolean(santri.nik_santri && santri.nik_santri.trim() !== '');
                    const hasWali = Boolean((santri.nama_ayah || santri.wali) && (santri.nama_ayah || santri.wali).trim() !== '');
                    const hasKamar = Boolean((santri.kamar_asrama || santri.kamar) && (santri.kamar_asrama || santri.kamar) !== '-');
                    const isComplete = santri.isComplete !== undefined ? santri.isComplete : (hasNik && hasWali && hasKamar);
                    const hasPhoto = santri.hasPhoto !== undefined ? santri.hasPhoto : Boolean(santri.foto_path && santri.foto_path.trim() !== '');
                    const namaSantri = santri.nama_lengkap || santri.nama;
                    const nisppSantri = santri.no_induk || santri.nispp;
                    const isEven = index % 2 === 1;
                    const rowBg = isEven ? 'bg-teal-50/40' : 'bg-white';

                    return (
                      <tr key={santri.id} className={`${rowBg} hover:bg-teal-100/50 transition border-b border-teal-100/40`}>
                        {/* Foto */}
                        <td className="py-1.5 px-3 text-center">
                          <div className="w-7 h-9 rounded-md overflow-hidden bg-teal-50/70 border border-teal-200/80 shrink-0 shadow-2xs mx-auto flex items-center justify-center">
                            {santri.foto_path ? (
                              <img src={santri.foto_path} alt={namaSantri} className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-3.5 h-3.5 text-teal-600/70" />
                            )}
                          </div>
                        </td>

                        {/* NIS */}
                        <td className="py-1.5 px-3 whitespace-nowrap">
                          <span className="font-mono text-teal-700 text-xs font-normal tracking-wider">
                            {nisppSantri}
                          </span>
                        </td>

                        {/* Nama Lengkap */}
                        <td className="py-1.5 px-3">
                          <span className="font-normal text-slate-900 block truncate max-w-xs text-xs">
                            {namaSantri}
                          </span>
                        </td>

                        {/* Status Data */}
                        <td className="py-1.5 px-3 whitespace-nowrap">
                          {isComplete && hasPhoto ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-normal bg-teal-50 text-teal-700 border border-teal-200">
                              <CheckCircle2 className="w-3 h-3 text-teal-600" />
                              <span>Lengkap</span>
                            </span>
                          ) : !hasPhoto && isComplete ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-normal bg-rose-50 text-rose-700 border border-rose-200">
                              <Image className="w-3 h-3 text-rose-500" />
                              <span>Belum Foto</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-normal bg-amber-50 text-amber-700 border border-amber-200">
                              <AlertCircle className="w-3 h-3 text-amber-500" />
                              <span>{santri.statusKeterangan || 'Belum Lengkap'}</span>
                            </span>
                          )}
                        </td>

                        {/* Aksi Cepat (Icon Only, Same Button Color) */}
                        <td className="py-1.5 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => onOpenCardDetail && onOpenCardDetail(santri)}
                              className="p-1 rounded-md bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/60 transition cursor-pointer"
                              title="Lihat Detail Santri"
                            >
                              <Eye className="w-3.5 h-3.5 text-teal-700" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onQuickPrint && onQuickPrint([santri])}
                              className="p-1 rounded-md bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/60 transition cursor-pointer"
                              title="Cetak Kartu Santri"
                            >
                              <Printer className="w-3.5 h-3.5 text-teal-700" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-10 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2 text-slate-400">
                        <Users className="w-8 h-8 text-slate-300" />
                        <p className="text-sm font-semibold text-slate-600">Belum ada data santri</p>
                        <p className="text-xs text-slate-400 max-w-sm">
                          {activeFilter === 'all'
                            ? 'Database santri masih kosong. Tambahkan santri baru atau import dari file Excel.'
                            : 'Tidak ada data santri untuk kategori filter ini.'}
                        </p>
                        {activeFilter === 'all' && (
                          <div className="pt-2 flex items-center justify-center gap-2">
                            <button
                              onClick={onAddNewSantri}
                              className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                            >
                              <PlusCircle className="w-3.5 h-3.5" />
                              <span>Tambah Santri</span>
                            </button>
                            <button
                              onClick={() => onNavigate('import')}
                              className="px-3 py-1.5 rounded-lg border border-teal-300 text-teal-800 hover:bg-teal-50 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                            >
                              <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />
                              <span>Import Excel</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Print Activities (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-teal-200/70 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-teal-100/60 pb-3">
            <div>
              <h3 className="font-bold text-teal-900 text-base">Riwayat Cetak Kartu</h3>
              <p className="text-xs text-slate-400 font-normal">Aktivitas penerbitan kartu terkini</p>
            </div>
          </div>

          <div className="space-y-3">
            {recentActivitiesList && recentActivitiesList.length > 0 ? (
              recentActivitiesList.map((act) => (
                <div key={act.id} className="p-3 rounded-xl bg-teal-50/40 border border-teal-100/80 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-600 text-[#20E2D7] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs border border-teal-500/40">
                    <Printer className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1 text-xs">
                    <p className="font-normal text-slate-800 truncate">{act.nama}</p>
                    <p className="text-[11px] text-teal-900 font-normal">
                      Cetak: <span className="font-normal text-teal-900">{act.jenis_kartu}</span> ({act.mode_cetak})
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-0.5 font-normal">
                      {new Date(act.timestamp).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 font-normal">
                Belum ada riwayat pencetakan kartu.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

