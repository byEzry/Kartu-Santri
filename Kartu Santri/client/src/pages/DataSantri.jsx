import React, { useState, useEffect } from 'react';
import { formatTTL } from '../components/CardSantri';
import {
  Search,
  Filter,
  Plus,
  Printer,
  FileSpreadsheet,
  Trash2,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Image as ImageIcon,
  User,
  UserPlus,
  ChevronDown,
  Upload,
  Download
} from 'lucide-react';

export function DataSantri({
  onAddNewSantri,
  onEditSantri,
  onViewDetail,
  onPrintCards,
  onOpenImport,
  userRole = 'admin'
}) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [santriList, setSantriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [search, setSearch] = useState('');
  const [kelengkapanFilter, setKelengkapanFilter] = useState('');
  const [jenjangFilter, setJenjangFilter] = useState('');
  const [programFilter, setProgramFilter] = useState('');
  const [kamarFilter, setKamarFilter] = useState('');
  const [kelasFilter, setKelasFilter] = useState('');
  const [ruangFilter, setRuangFilter] = useState('');
  const [photoFilter, setPhotoFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');

  // Filter options from API
  const [jenjangOptions, setJenjangOptions] = useState(['MI', 'MTs', 'MA']);
  const [programOptions, setProgramOptions] = useState(['Tahfidz', 'Kitab']);
  const [kamarOptions, setKamarOptions] = useState([]);
  const [kelasOptions, setKelasOptions] = useState([]);
  const [ruangOptions, setRuangOptions] = useState([]);

  // Selection
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page,
        limit,
        q: search,
        filter_status: kelengkapanFilter,
        jenjang: jenjangFilter,
        program: programFilter,
        kamar_asrama: kamarFilter,
        kelas: kelasFilter,
        ruang: ruangFilter,
        has_photo: photoFilter,
        jenis_kelamin: genderFilter,
        status: statusFilter,
        sort_by: sortBy,
        sort_order: sortOrder
      });

      const res = await fetch(`/api/santri?${queryParams.toString()}`);
      const json = await res.json();
      if (json.success) {
        setSantriList(json.data);
        setTotalCount(json.pagination.total);
        setTotalPages(json.pagination.totalPages);
      }
    } catch (e) {
      console.error('Failed to fetch santri', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const res = await fetch('/api/santri/stats');
      const json = await res.json();
      if (json.success && json.filterOptions) {
        if (json.filterOptions.jenjang?.length) setJenjangOptions(json.filterOptions.jenjang);
        if (json.filterOptions.program?.length) setProgramOptions(json.filterOptions.program);
        setKamarOptions(json.filterOptions.kamar || []);
        setKelasOptions(json.filterOptions.kelas || []);
        setRuangOptions(json.filterOptions.ruang || []);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchData();
  }, [page, limit, search, kelengkapanFilter, jenjangFilter, programFilter, kamarFilter, kelasFilter, ruangFilter, photoFilter, genderFilter, statusFilter, sortBy, sortOrder]);

  // Selection helpers
  const handleToggleSelectAll = () => {
    if (selectedIds.length === santriList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(santriList.map(s => s.id));
    }
  };

  const handleToggleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedSantriObjects = santriList.filter(s => selectedIds.includes(s.id));

  // Single delete
  const handleDeleteSingle = async (santri) => {
    if (window.confirm(`Yakin ingin menghapus data santri "${santri.nama}" (NISPP: ${santri.nispp})?`)) {
      try {
        const res = await fetch(`/api/santri/${santri.id}`, { method: 'DELETE' });
        const json = await res.json();
        if (json.success) {
          fetchData();
          fetchFilterOptions();
        } else {
          alert(json.message);
        }
      } catch (e) {
        alert('Gagal menghapus santri: ' + e.message);
      }
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (window.confirm(`Yakin ingin menghapus ${selectedIds.length} santri yang dipilih?`)) {
      try {
        const res = await fetch('/api/santri/bulk-delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: selectedIds })
        });
        const json = await res.json();
        if (json.success) {
          setSelectedIds([]);
          fetchData();
          fetchFilterOptions();
        } else {
          alert(json.message);
        }
      } catch (e) {
        alert('Gagal menghapus massal: ' + e.message);
      }
    }
  };

  // Export to Excel sesuai filter aktif
  const handleExportExcel = () => {
    const queryParams = new URLSearchParams();
    if (search) queryParams.set('q', search);
    if (kelengkapanFilter) queryParams.set('filter_status', kelengkapanFilter);
    if (jenjangFilter) queryParams.set('jenjang', jenjangFilter);
    if (programFilter) queryParams.set('program', programFilter);
    if (kamarFilter) queryParams.set('kamar_asrama', kamarFilter);
    if (kelasFilter) queryParams.set('kelas', kelasFilter);
    if (ruangFilter) queryParams.set('ruang', ruangFilter);
    if (photoFilter) queryParams.set('has_photo', photoFilter);
    if (genderFilter) queryParams.set('jenis_kelamin', genderFilter);

    window.location.href = `/api/excel/export?${queryParams.toString()}`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Top Header Banner with Solid Deep Teal & Concentric Rings */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#094B44] text-white p-5 sm:p-6 lg:p-7 shadow-md shadow-[#094B44]/25 border border-white/15">
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#D6F2EE] tracking-tight">
            Data Santri
          </h1>
          <p className="text-xs sm:text-sm text-[#EFF6F3]/90 font-normal mt-1">
            Data santri terdaftar aktif di database ({totalCount} Santri)
          </p>
        </div>

        {/* Pattern Mandala Watermark (Sama persis seperti pada Sidebar) */}
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

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-teal-100 shadow-xs space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-9 gap-2.5 sm:gap-3">
          {/* Instant Search input */}
          <div className="sm:col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-2 relative">
            <Search className="w-4 h-4 text-teal-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari Nama, No. Induk, NISN, Wali, Asrama..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-teal-200/80 bg-teal-50/30 text-xs text-teal-900 focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-500/20 outline-hidden transition font-normal"
            />
          </div>

          {/* Filter Kelengkapan Data */}
          <div>
            <select
              value={kelengkapanFilter}
              onChange={(e) => {
                setKelengkapanFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-teal-200/80 bg-teal-50/30 text-xs text-teal-900 focus:bg-white focus:border-teal-600 outline-hidden font-normal"
            >
              <option value="">Kelengkapan</option>
              <option value="lengkap">Data Lengkap</option>
              <option value="belum_lengkap">Data Belum Lengkap</option>
            </select>
          </div>

          {/* Filter Jenjang (MI / MTs / MA) */}
          <div>
            <select
              value={jenjangFilter}
              onChange={(e) => {
                setJenjangFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-teal-200/80 bg-teal-50/30 text-xs text-teal-900 focus:bg-white focus:border-teal-600 outline-hidden font-normal"
            >
              <option value="">Jenjang</option>
              {jenjangOptions.map((j) => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>
          </div>

          {/* Filter Program (Tahfidz / Kitab) */}
          <div>
            <select
              value={programFilter}
              onChange={(e) => {
                setProgramFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-teal-200/80 bg-teal-50/30 text-xs text-teal-900 focus:bg-white focus:border-teal-600 outline-hidden font-normal"
            >
              <option value="">Program</option>
              {programOptions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Filter Kamar Asrama */}
          <div>
            <select
              value={kamarFilter}
              onChange={(e) => {
                setKamarFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-teal-200/80 bg-teal-50/30 text-xs text-teal-900 focus:bg-white focus:border-teal-600 outline-hidden font-normal"
            >
              <option value="">Kamar Asrama</option>
              {kamarOptions.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>

          {/* Filter Kelas */}
          <div>
            <select
              value={kelasFilter}
              onChange={(e) => {
                setKelasFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-teal-200/80 bg-teal-50/30 text-xs text-teal-900 focus:bg-white focus:border-teal-600 outline-hidden font-normal"
            >
              <option value="">Kelas</option>
              {kelasOptions.map((kls) => (
                <option key={kls} value={kls}>{kls}</option>
              ))}
            </select>
          </div>

          {/* Filter Ruang */}
          <div>
            <select
              value={ruangFilter}
              onChange={(e) => {
                setRuangFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-teal-200/80 bg-teal-50/30 text-xs text-teal-900 focus:bg-white focus:border-teal-600 outline-hidden font-normal"
            >
              <option value="">Ruang</option>
              {ruangOptions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Filter Status Foto */}
          <div>
            <select
              value={photoFilter}
              onChange={(e) => {
                setPhotoFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-teal-200/80 bg-teal-50/30 text-xs text-teal-900 focus:bg-white focus:border-teal-600 outline-hidden font-normal"
            >
              <option value="">Status Foto</option>
              <option value="yes">Sudah Ada Foto</option>
              <option value="no">Belum Ada Foto</option>
            </select>
          </div>
        </div>
      </div>

      {/* Floating Bulk Action Bar (when items selected) */}
      {selectedIds.length > 0 && (
        <div className="sticky top-3 sm:top-4 z-20 bg-[#094B44] text-white px-4 sm:px-6 py-3 rounded-2xl shadow-xl border-2 border-[#B6E5DE] flex flex-col sm:flex-row items-center justify-between gap-3 animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B6E5DE] animate-ping"></span>
            <span className="text-xs font-bold text-[#D6F2EE]">{selectedIds.length} santri dipilih</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center sm:justify-end">
            <button
              onClick={() => onPrintCards(selectedSantriObjects)}
              className="px-4 sm:px-5 py-2 rounded-xl bg-[#009688] hover:bg-[#007D71] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm border border-[#009688] transition cursor-pointer"
            >
              <Printer className="w-4 h-4 text-white" />
              <span>Cetak Massal ({selectedIds.length})</span>
            </button>

            {(userRole === 'admin' || userRole === 'tu') && (
              <button
                onClick={handleBulkDelete}
                className="px-3.5 py-2 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white font-semibold text-xs flex items-center gap-1.5 transition border border-rose-400/40 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Terpilih</span>
              </button>
            )}

            <button
              onClick={() => setSelectedIds([])}
              className="text-xs text-amber-100 hover:text-white transition ml-1 font-medium cursor-pointer"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Action Bar Above Table: Info & Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="min-w-0">
          <h2 className="text-sm sm:text-base font-bold text-teal-950">
            Data Santri
          </h2>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={handleExportExcel}
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#16A699] hover:bg-[#139488] text-white text-xs font-bold flex items-center gap-2 shadow-xs border border-[#16A699] transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-white" />
            <span>Export Excel</span>
          </button>

          {(userRole === 'admin' || userRole === 'tu') && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#009688] hover:bg-[#007D71] text-white text-xs font-bold flex items-center gap-2 shadow-xs border border-[#009688] transition cursor-pointer"
              >
                <Plus className="w-4 h-4 text-white" />
                <span>Tambah Santri</span>
                <ChevronDown className={`w-3.5 h-3.5 text-white transition-transform ${showAddMenu ? 'rotate-180' : ''}`} />
              </button>

              {showAddMenu && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowAddMenu(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-teal-100 p-2 z-40 animate-in fade-in zoom-in-95 duration-150">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddMenu(false);
                        onAddNewSantri();
                      }}
                      className="w-full p-2.5 rounded-xl hover:bg-teal-50/80 text-left flex items-center gap-3 transition cursor-pointer group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition">
                        <UserPlus className="w-4 h-4" />
                      </div>
                      <div className="text-xs font-bold text-teal-950 group-hover:text-teal-900">
                        Input Manual
                      </div>
                    </button>

                    <div className="h-px bg-teal-100/60 my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        setShowAddMenu(false);
                        if (onOpenImport) onOpenImport();
                      }}
                      className="w-full p-2.5 rounded-xl hover:bg-amber-50/80 text-left flex items-center gap-3 transition cursor-pointer group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-white transition">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                      <div className="text-xs font-bold text-teal-950 group-hover:text-amber-900">
                        Impor Excel & Foto
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-teal-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-teal-50/90 border-b-2 border-teal-200 text-teal-900 font-bold text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3 w-10 text-center">
                  <button onClick={handleToggleSelectAll} className="text-teal-700 hover:text-teal-900 cursor-pointer">
                    {santriList.length > 0 && selectedIds.length === santriList.length ? (
                      <CheckSquare className="w-4 h-4 text-teal-700" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-2.5 px-2 w-12 text-center">Foto</th>
                <th className="py-2.5 px-3 whitespace-nowrap">No. Induk</th>
                <th className="py-2.5 px-3">Nama Lengkap</th>
                <th className="py-2.5 px-3">TTL</th>
                <th className="py-2.5 px-3">Alamat</th>
                <th className="py-2.5 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-teal-100/40">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-teal-600" />
                    <span>Memuat database master santri...</span>
                  </td>
                </tr>
              ) : santriList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <span className="font-semibold text-slate-600 block">Data santri tidak ditemukan</span>
                    <span className="text-[11px]">Coba ubah kata kunci pencarian atau sesuaikan filter.</span>
                  </td>
                </tr>
              ) : (
                santriList.map((santri, index) => {
                  const isSelected = selectedIds.includes(santri.id);
                  const displayName = santri.nama_lengkap || santri.nama || '-';
                  const displayInduk = santri.no_induk || santri.nispp || '-';
                  const displayTTL = formatTTL(santri.tempat_lahir, santri.tanggal_lahir);
                  const displayAlamat = santri.alamat_siswa || santri.alamat || '-';
                  const isEven = index % 2 === 1;
                  const rowBg = isSelected
                    ? 'bg-teal-100/70'
                    : isEven
                    ? 'bg-teal-50/40'
                    : 'bg-white';

                  return (
                    <tr
                      key={santri.id}
                      className={`${rowBg} hover:bg-teal-100/50 transition border-b border-teal-100/40`}
                    >
                      {/* Checkbox */}
                      <td className="py-1.5 px-3 text-center">
                        <button
                          onClick={() => handleToggleSelectOne(santri.id)}
                          className="text-slate-500 hover:text-teal-700 cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-teal-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Foto */}
                      <td className="py-1.5 px-2 text-center">
                        <div className="w-7 h-9 rounded-md overflow-hidden bg-teal-50/70 border border-teal-200/80 shrink-0 shadow-2xs mx-auto flex items-center justify-center">
                          {santri.foto_path ? (
                            <img src={santri.foto_path} alt={displayName} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-3.5 h-3.5 text-teal-600/70" />
                          )}
                        </div>
                      </td>

                      {/* No. Induk (Single data) */}
                      <td className="py-1.5 px-3 whitespace-nowrap">
                        <span className="font-mono text-teal-700 text-xs font-normal tracking-wider">
                          {displayInduk}
                        </span>
                      </td>

                      {/* Nama Lengkap (Single data) */}
                      <td className="py-1.5 px-3">
                        <span className="font-normal text-slate-900 block text-xs truncate max-w-xs">
                          {displayName}
                        </span>
                      </td>

                      {/* TTL (Single data) */}
                      <td className="py-1.5 px-3 whitespace-nowrap">
                        <span className="font-normal text-slate-700 block text-xs">
                          {displayTTL}
                        </span>
                      </td>

                      {/* Alamat (Single data) */}
                      <td className="py-1.5 px-3 max-w-sm">
                        <span className="font-normal text-slate-700 block text-xs truncate" title={displayAlamat}>
                          {displayAlamat}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="py-1.5 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {/* Print Single */}
                          <button
                            title="Cetak Kartu Santri & Mahrom"
                            onClick={() => onPrintCards([santri])}
                            className="p-1 rounded-md bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/60 transition cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5 text-teal-700" />
                          </button>

                          {/* View Detail Master */}
                          <button
                            title="Lihat Detail Santri"
                            onClick={() => onViewDetail(santri)}
                            className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Master */}
                          <button
                            title="Edit Data Santri"
                            onClick={() => onEditSantri(santri)}
                            className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete (Admin & TU) */}
                          {(userRole === 'admin' || userRole === 'tu') && (
                            <button
                              title="Hapus Data"
                              onClick={() => handleDeleteSingle(santri)}
                              className="p-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 sm:px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="text-center sm:text-left">
            Menampilkan <span className="font-bold text-slate-800">{santriList.length}</span> dari{' '}
            <span className="font-bold text-slate-800">{totalCount}</span> data santri
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 font-semibold text-slate-700">
              Halaman {page} dari {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
