import React, { useState, useEffect } from 'react';
import { CardSantri } from '../components/CardSantri';
import { CardMahrom } from '../components/CardMahrom';
import {
  CreditCard,
  Printer,
  FileDown,
  Search,
  Filter,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Layers,
  SlidersHorizontal,
  Eye
} from 'lucide-react';

export function GeneratorKartu({
  pesantren,
  template,
  onOpenPrintModal
}) {
  const [santriList, setSantriList] = useState([]);
  const [selectedSantri, setSelectedSantri] = useState(null);
  const [search, setSearch] = useState('');
  const [kamarFilter, setKamarFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Card view controls
  const [activeTab, setActiveTab] = useState('santri'); // 'santri' | 'mahrom' | 'side-by-side'
  const [cardSide, setCardSide] = useState('front'); // 'front' | 'back'
  const [kamarList, setKamarList] = useState([]);

  const fetchSantriList = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/santri?limit=100&q=${encodeURIComponent(search)}&kamar=${encodeURIComponent(kamarFilter)}`);
      const json = await res.json();
      if (json.success && json.data) {
        setSantriList(json.data);
        if (!selectedSantri && json.data.length > 0) {
          setSelectedSantri(json.data[0]);
        }
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
    fetchSantriList();
  }, [search, kamarFilter]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-8 max-w-7xl mx-auto">
      {/* Top Header Banner with Solid Deep Teal & Concentric Rings */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#094B44] text-white p-5 sm:p-6 lg:p-7 shadow-md shadow-[#094B44]/25 border border-white/15">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#D6F2EE] tracking-tight">
              Generator Kartu Santri & Mahrom
            </h1>
          </div>

          {selectedSantri && (
            <div className="relative z-20 flex items-center gap-2 sm:gap-3 flex-wrap">
              <button
                onClick={() => onOpenPrintModal([selectedSantri])}
                className="px-5 py-2.5 rounded-xl bg-[#009688] hover:bg-[#007D71] text-white text-xs font-bold flex items-center gap-2 shadow-xs border border-[#009688] transition cursor-pointer"
              >
                <Printer className="w-4 h-4 text-white" />
                <span>Cetak Kartu</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
        {/* Left Side: Santri Selector & Search (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-teal-100 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-teal-100/60 pb-3">
            <h3 className="font-bold text-teal-900 text-sm">Pilih Santri</h3>
            <span className="text-[11px] text-teal-800/70 font-medium">{santriList.length} santri</span>
          </div>

          {/* Search & Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-teal-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama atau NISPP..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-teal-200/80 bg-teal-50/30 text-xs text-teal-900 focus:bg-white focus:border-teal-600 outline-hidden font-normal"
              />
            </div>

            <select
              value={kamarFilter}
              onChange={(e) => setKamarFilter(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-teal-200/80 bg-teal-50/30 text-xs text-teal-900 focus:bg-white focus:border-teal-600 outline-hidden font-normal"
            >
              <option value="">Semua Asrama / Kamar</option>
              {kamarList.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>

          {/* Santri Selection List */}
          <div className="max-h-96 overflow-y-auto space-y-1 pr-1 divide-y divide-slate-100">
            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400 font-normal">
                <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-1 text-teal-600" />
                <span>Memuat daftar...</span>
              </div>
            ) : santriList.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 font-normal">
                Santri tidak ditemukan.
              </div>
            ) : (
              santriList.map((s) => {
                const isSelected = selectedSantri?.id === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSantri(s)}
                    className={`w-full p-2.5 rounded-xl text-left transition flex items-center gap-3 ${
                      isSelected
                        ? 'bg-teal-50 border border-teal-300/80 shadow-2xs'
                        : 'hover:bg-teal-50/30'
                    }`}
                  >
                    <div className="w-8 h-9 rounded-lg overflow-hidden bg-slate-100 border border-teal-200 shrink-0">
                      {s.foto_path ? (
                        <img src={s.foto_path} alt={s.nama} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-teal-700 bg-teal-50">
                          {s.nama.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-normal text-slate-800 text-xs truncate">{s.nama}</p>
                      <p className="text-[10px] font-mono text-teal-800 font-normal">{s.nispp}</p>
                      <span className="text-[9px] text-slate-400 truncate block font-normal">{s.kamar || 'Kamar -'}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Interactive Studio Preview (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-teal-100 shadow-xs p-6 space-y-6">
          {/* Studio Controls Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-teal-100/60 pb-4">
            {/* Card Switcher */}
            <div className="flex bg-teal-50/70 p-1 rounded-xl text-xs font-semibold border border-teal-200/60">
              <button
                onClick={() => setActiveTab('santri')}
                className={`px-4 py-1.5 rounded-lg transition ${
                  activeTab === 'santri' ? 'bg-teal-700 text-white shadow-xs' : 'text-teal-800 hover:text-teal-900'
                }`}
              >
                Kartu Santri
              </button>
              <button
                onClick={() => setActiveTab('mahrom')}
                className={`px-4 py-1.5 rounded-lg transition ${
                  activeTab === 'mahrom' ? 'bg-teal-700 text-white shadow-xs' : 'text-teal-800 hover:text-teal-900'
                }`}
              >
                Kartu Mahrom
              </button>
              <button
                onClick={() => setActiveTab('side-by-side')}
                className={`px-4 py-1.5 rounded-lg transition ${
                  activeTab === 'side-by-side' ? 'bg-teal-700 text-white shadow-xs' : 'text-teal-800 hover:text-teal-900'
                }`}
              >
                Keduanya
              </button>
            </div>

            {/* Side Switcher (Front / Back) */}
            <div className="flex bg-teal-50/70 p-1 rounded-xl text-xs font-medium border border-teal-200/60">
              <button
                onClick={() => setCardSide('front')}
                className={`px-3 py-1 rounded-lg transition ${
                  cardSide === 'front' ? 'bg-white text-teal-900 shadow-xs font-semibold' : 'text-teal-800 hover:text-teal-900'
                }`}
              >
                Sisi Depan
              </button>
              <button
                onClick={() => setCardSide('back')}
                className={`px-3 py-1 rounded-lg transition ${
                  cardSide === 'back' ? 'bg-white text-teal-900 shadow-xs font-semibold' : 'text-teal-800 hover:text-teal-900'
                }`}
              >
                Sisi Belakang
              </button>
            </div>
          </div>

          {/* Card Presentation Display */}
          <div className="p-3 sm:p-6 lg:p-8 bg-[#f4fbf9] rounded-2xl border border-teal-200/80 flex flex-col items-center justify-center min-h-[340px] overflow-x-auto no-scrollbar">
            {selectedSantri ? (
              activeTab === 'side-by-side' ? (
                <div className="flex flex-col xl:flex-row items-center justify-center gap-6 sm:gap-8 py-2 w-full">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-bold text-teal-900">
                      Kartu Santri ({cardSide === 'front' ? 'Sisi Depan' : 'Sisi Belakang'})
                    </span>
                    <div className="card-scale-box">
                      <CardSantri santri={selectedSantri} pesantren={pesantren} template={template} side={cardSide} />
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-bold text-teal-900">
                      Kartu Mahrom ({cardSide === 'front' ? 'Sisi Depan' : 'Sisi Belakang'})
                    </span>
                    <div className="card-scale-box">
                      <CardMahrom santri={selectedSantri} pesantren={pesantren} template={template} side={cardSide} />
                    </div>
                  </div>
                </div>
              ) : activeTab === 'santri' ? (
                <div className="flex flex-col items-center gap-2 py-2">
                  <span className="text-xs font-bold text-teal-900">
                    Kartu Santri {cardSide === 'front' ? '(Sisi Depan)' : '(Sisi Belakang)'}
                  </span>
                  <div className="card-scale-box">
                    <CardSantri santri={selectedSantri} pesantren={pesantren} template={template} side={cardSide} />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-2">
                  <span className="text-xs font-bold text-teal-900">
                    Kartu Mahrom {cardSide === 'front' ? '(Sisi Depan)' : '(Sisi Belakang)'}
                  </span>
                  <div className="card-scale-box">
                    <CardMahrom santri={selectedSantri} pesantren={pesantren} template={template} side={cardSide} />
                  </div>
                </div>
              )
            ) : (
              <div className="text-center text-slate-400 py-6">
                <CreditCard className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="text-sm font-semibold text-slate-600">Pilih santri di sebelah kiri untuk melihat kartu</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
