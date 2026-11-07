import React, { useState, useEffect } from 'react';
import { formatTTL } from '../components/CardSantri';
import {
  Stethoscope,
  Printer,
  FileDown,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Phone,
  HeartPulse,
  User,
  CheckSquare,
  Square,
  RefreshCw,
  Building2,
  Sparkles
} from 'lucide-react';

function formatKelasRuang(kelas, ruang) {
  const k = (kelas || '').trim();
  const r = (ruang || '').trim();
  if (!k && !r) return '-';
  if (k && r) {
    if (k.toLowerCase().includes(r.toLowerCase())) return k;
    return `${k} ${r}`;
  }
  return k || r;
}

export function KesehatanBerobat({ onPrintCards }) {
  const [santriList, setSantriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [kamarFilter, setKamarFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [kamarList, setKamarList] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        limit: 100,
        q: search,
        kamar: kamarFilter
      });

      const res = await fetch(`/api/santri?${queryParams.toString()}`);
      const json = await res.json();
      if (json.success && json.data) {
        setSantriList(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchKamarList = async () => {
    try {
      const res = await fetch('/api/santri/stats');
      const json = await res.json();
      if (json.success && json.filterOptions?.kamar) {
        setKamarList(json.filterOptions.kamar);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchKamarList();
  }, []);

  useEffect(() => {
    fetchData();
  }, [search, kamarFilter]);

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

  const handlePrintMedicalBatch = () => {
    if (selectedSantriObjects.length === 0) {
      alert('Pilih minimal satu santri yang akan berobat terlebih dahulu.');
      return;
    }
    onPrintCards(selectedSantriObjects, 'sheet');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header Banner with Solid Deep Teal & Concentric Rings */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#094B44] text-white p-5 sm:p-6 lg:p-7 shadow-md shadow-[#094B44]/25 border border-white/15">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#D6F2EE] tracking-tight">
              Layanan Cetak Kolektif Santri Berobat
            </h1>
            <p className="text-xs sm:text-sm text-[#EFF6F3]/90 font-normal mt-1">
              pilih santri yang sakit hari ini yang akan diberobatkan ke rumah sakit
            </p>
          </div>

          {selectedIds.length > 0 && (
            <div className="relative z-20 flex items-center gap-2 sm:gap-3 flex-wrap">
              <button
                onClick={handlePrintMedicalBatch}
                className="px-6 py-3 rounded-xl bg-[#009688] hover:bg-[#007D71] text-white text-xs font-bold flex items-center gap-2 shadow-xs border border-[#009688] transition animate-in zoom-in-95 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-white" />
                <span>Cetak Lembar Kolektif</span>
              </button>
            </div>
          )}
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


      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-teal-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama santri, NISPP, atau catatan medis (misal: asma, alergi)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-teal-200/80 bg-teal-50/30 text-xs text-teal-900 focus:bg-white focus:border-teal-600 outline-hidden transition font-normal"
            />
          </div>

          <div>
            <select
              value={kamarFilter}
              onChange={(e) => setKamarFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-teal-200/80 bg-teal-50/30 text-xs text-teal-900 focus:bg-white focus:border-teal-600 outline-hidden font-normal"
            >
              <option value="">Semua Kamar / Asrama</option>
              {kamarList.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table of Santri with Medical Highlight */}
      <div className="bg-white rounded-2xl border border-teal-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-teal-50/90 border-b-2 border-teal-200 text-teal-900 font-bold text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">
                  <button onClick={handleToggleSelectAll} className="text-teal-700 hover:text-teal-900">
                    {santriList.length > 0 && selectedIds.length === santriList.length ? (
                      <CheckSquare className="w-4 h-4 text-teal-700" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3.5 px-3 w-12 text-center">No</th>
                <th className="py-3.5 px-4">Nama Santri & NISPP</th>
                <th className="py-3.5 px-4">Kamar & Kelas</th>
                <th className="py-3.5 px-4">Catatan Medis & Gol. Darah</th>
                <th className="py-3.5 px-4">Kontak Darurat Wali</th>
                <th className="py-3.5 px-4 text-right">Pilih Berobat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-teal-600" />
                    <span>Memuat data santri...</span>
                  </td>
                </tr>
              ) : santriList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-normal">
                    Tidak ada santri yang sesuai dengan pencarian.
                  </td>
                </tr>
              ) : (
                santriList.map((santri, index) => {
                  const isSelected = selectedIds.includes(santri.id);
                  const hasMedicalNotes = Boolean(santri.catatan_medis && santri.catatan_medis.trim());

                  return (
                    <tr
                      key={santri.id}
                      className={`hover:bg-teal-50/40 transition ${isSelected ? 'bg-teal-50/80' : ''}`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleSelectOne(santri.id)}
                          className="text-teal-700 hover:text-teal-900 cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-teal-700" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-3 text-center text-slate-700 font-normal text-xs">
                        {index + 1}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-normal text-xs">
                        <span className="block text-slate-700 font-normal text-xs">{santri.nama}</span>
                        <span className="block text-slate-700 font-normal text-xs">{santri.nispp}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-normal text-xs">
                        <span className="block text-slate-800 font-normal text-xs">{santri.kamar || '-'}</span>
                        <span className="block text-slate-600 font-normal text-xs mt-0.5">{formatKelasRuang(santri.kelas, santri.ruang)}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-normal text-xs">
                        <span className="block text-slate-700 font-normal text-xs">
                          {santri.catatan_medis ? `${santri.catatan_medis}${santri.gol_darah ? ` • Gol. ${santri.gol_darah}` : ''}` : 'Tidak ada catatan khusus'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-normal text-xs">
                        <span className="block text-slate-700 font-normal text-xs">{santri.wali || '-'}</span>
                        <span className="block text-slate-700 font-normal text-xs">{santri.no_hp_wali || '-'}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleToggleSelectOne(santri.id)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition border cursor-pointer ${
                            isSelected
                              ? 'bg-teal-600 hover:bg-teal-700 text-white border-teal-500 shadow-xs'
                              : 'bg-teal-50 hover:bg-teal-100 text-teal-900 border-teal-200'
                          }`}
                        >
                          {isSelected ? '✓ Terpilih' : '+ Pilih Berobat'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
