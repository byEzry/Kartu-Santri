import React, { useState, useEffect } from 'react';
import { CardSantri } from '../components/CardSantri';
import { CardMahrom } from '../components/CardMahrom';
import {
  Palette,
  Upload,
  Trash2,
  Check,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';

export function PengaturanDesain({
  template,
  pesantren,
  sampleSantri,
  onUpdateTemplate
}) {
  const [formData, setFormData] = useState({
    theme: template?.theme || 'teal',
    show_logo_santri: template?.show_logo_santri !== 0,
    show_logo_mahrom: template?.show_logo_mahrom !== 0,
    text_color_santri: template?.text_color_santri || '#042f2e',
    text_color_mahrom: template?.text_color_mahrom || '#042f2e',
    ketentuan_mahrom: template?.ketentuan_mahrom || '',
    tata_tertib_santri: template?.tata_tertib_santri || '',
    keterangan_santri: template?.keterangan_santri || 'Berlaku selama menjadi santri\nPondok Pesantren Qudsiyyah Putri',
    keterangan_mahrom: template?.keterangan_mahrom || 'Kartu ini mohon dibawa\nSaat sambangan / menjemput santri',
    judul_belakang_santri: template?.judul_belakang_santri || 'TATA TERTIB SANTRI',
    footer_belakang_santri: template?.footer_belakang_santri || 'Bagi yang menemukan kartu ini, mohon bisa mengembalikan ke alamat yang tertera atau menghubungi Pondok Pesantren Qudsiyyah Putri',
    judul_belakang_mahrom: template?.judul_belakang_mahrom || 'PERATURAN KUNJUNGAN DAN PERIJINAN PULANG',
    footer_belakang_mahrom: template?.footer_belakang_mahrom || 'Bagi yang menemukan kartu ini, mohon bisa mengembalikan ke alamat yang tertera atau menghubungi Pondok Pesantren Qudsiyyah Putri'
  });

  useEffect(() => {
    if (template) {
      setFormData(prev => ({
        ...prev,
        theme: template.theme || 'teal',
        show_logo_santri: template.show_logo_santri !== 0,
        show_logo_mahrom: template.show_logo_mahrom !== 0,
        text_color_santri: template.text_color_santri || '#042f2e',
        text_color_mahrom: template.text_color_mahrom || '#042f2e',
        ketentuan_mahrom: template.ketentuan_mahrom || '',
        tata_tertib_santri: template.tata_tertib_santri || '',
        keterangan_santri: template.keterangan_santri || 'Berlaku selama menjadi santri\nPondok Pesantren Qudsiyyah Putri',
        keterangan_mahrom: template.keterangan_mahrom || 'Kartu ini mohon dibawa\nSaat sambangan / menjemput santri',
        judul_belakang_santri: template.judul_belakang_santri || 'TATA TERTIB SANTRI',
        footer_belakang_santri: template.footer_belakang_santri || 'Bagi yang menemukan kartu ini, mohon bisa mengembalikan ke alamat yang tertera atau menghubungi Pondok Pesantren Qudsiyyah Putri',
        judul_belakang_mahrom: template.judul_belakang_mahrom || 'PERATURAN KUNJUNGAN DAN PERIJINAN PULANG',
        footer_belakang_mahrom: template.footer_belakang_mahrom || 'Bagi yang menemukan kartu ini, mohon bisa mengembalikan ke alamat yang tertera atau menghubungi Pondok Pesantren Qudsiyyah Putri'
      }));
    }
  }, [template]);

  const [previewCardType, setPreviewCardType] = useState('santri'); // 'santri' | 'mahrom'
  const [previewSide, setPreviewSide] = useState('front'); // 'front' | 'back'
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Handle Background Upload
  const handleBgUpload = async (cardType, file) => {
    if (!file) return;

    try {
      const data = new FormData();
      data.append('background', file);

      const res = await fetch(`/api/settings/background/${cardType}`, {
        method: 'POST',
        body: data
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Gagal mengupload background.');
      }

      onUpdateTemplate(json.data);
      setSaveSuccessMsg(`Background ${cardType.replace('_', ' ')} berhasil diperbarui!`);
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (e) {
      alert(e.message);
    }
  };

  // Handle Remove Custom Background
  const handleRemoveBg = async (cardType) => {
    if (window.confirm(`Hapus background kustom untuk ${cardType.replace('_', ' ')} dan kembali ke tema standar?`)) {
      try {
        const res = await fetch(`/api/settings/background/${cardType}`, {
          method: 'DELETE'
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.message || 'Gagal menghapus background.');
        }

        onUpdateTemplate(json.data);
        setSaveSuccessMsg(`Background kustom dihapus.`);
        setTimeout(() => setSaveSuccessMsg(''), 4000);
      } catch (e) {
        alert(e.message);
      }
    }
  };

  // Handle Save Design Config
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/settings/template', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Gagal menyimpan pengaturan desain.');
      }

      onUpdateTemplate(json.data);
      setSaveSuccessMsg('Pengaturan desain kartu berhasil disimpan!');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (e) {
      alert(e.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Dummy sample santri for preview if none provided
  const dummySantri = sampleSantri || {
    id: 1,
    nama: 'Dummy Aisyah Nur',
    nama_lengkap: 'Dummy Aisyah Nur',
    nispp: '202601001',
    no_induk: '202601001',
    tempat_lahir: 'Kudus',
    tanggal_lahir: '2012-04-12',
    wali: 'H. Muhammad Ridwan, S.Pd.I',
    nama_ayah: 'H. Muhammad Ridwan, S.Pd.I',
    alamat: 'Jl. Menara Kudus No. 15, Kauman, Kota Kudus',
    alamat_siswa: 'Jl. Menara Kudus No. 15, Kauman, Kota Kudus',
    kamar: 'Zainab 01',
    kamar_asrama: 'Zainab 01',
    kelas: 'VI MI',
    jenjang: 'MI',
    program: 'Tahfidz',
    foto_path: '/uploads/photos/202601847-1792330052213.jpg'
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Top Header Banner with Solid Deep Teal & Concentric Rings */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#094B44] text-white p-5 sm:p-6 lg:p-7 shadow-md shadow-[#094B44]/25 border border-white/15">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#D6F2EE] tracking-tight">
              Desain & Background Kartu
            </h1>
            <p className="text-xs sm:text-sm text-[#EFF6F3]/90 font-normal mt-1">
              Pengaturan tata letak, warna aksen, dan penggantian background kartu santri & mahrom
            </p>
          </div>

          <div className="relative z-20 flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-[#009688] hover:bg-[#007D71] text-white text-xs font-bold flex items-center gap-2 shadow-xs border border-[#009688] transition disabled:opacity-50 cursor-pointer"
            >
              <Check className="w-4 h-4 text-white" />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan Desain'}</span>
            </button>
          </div>
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

      {saveSuccessMsg && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-teal-600" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Upload Slots & Design Options (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Informative Note for Profil Pondok Pesantren */}
          <div className="p-4 rounded-2xl border border-[#B6E5DE] bg-[#E2F1ED] shadow-2xs flex items-start gap-3">
            <Info className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 space-y-1">
              <p className="font-bold text-teal-950 flex items-center gap-1.5">
                <span>Identitas Yayasan, TTD Pengasuh, & Stempel Pondok</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-semibold">Tersinkronisasi</span>
              </p>
              <p className="text-[11px] leading-relaxed text-slate-600">
                Tulisan Arab Yayasan, Nama Yayasan, Tanggal Kartu, TTD Pengasuh, dan Stempel Resmi diatur secara terpusat di menu <strong>Profil Pondok Pesantren</strong> sebagai identitas legal lembaga.
              </p>
            </div>
          </div>

          {/* Section 1: Background Uploaders */}
          <div className="bg-white rounded-2xl border border-teal-200/80 shadow-xs p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-teal-100/60 pb-3">
              <Palette className="w-4 h-4 text-teal-700" />
              <h3 className="font-bold text-teal-900 text-sm">Upload Background Kustom</h3>
            </div>

            <p className="text-xs text-slate-500 font-normal leading-relaxed">
              Resolusi yang disarankan : 1012 x 638 piksel (300 DPI) dengan ukuran 85,6 x 54,0 mm
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Slot 1: Santri Front */}
              <div className="p-4 rounded-xl border border-teal-200/80 bg-teal-50/20 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between min-h-[22px]">
                  <span className="text-xs font-bold text-teal-900">Kartu Santri (Depan)</span>
                  {template?.bg_santri_front ? (
                    <span className="text-[10px] font-semibold text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full border border-teal-200">
                      Kustom Aktif
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      Standar
                    </span>
                  )}
                </div>

                <div className="relative border border-dashed border-teal-300 hover:border-teal-600 rounded-xl p-4 text-center bg-white cursor-pointer transition shadow-2xs group flex flex-col items-center justify-center min-h-[96px]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleBgUpload('santri_front', e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-5 h-5 mx-auto text-teal-600 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-normal text-slate-500 block">Upload Gambar Depan</span>
                </div>

                <div className="min-h-[24px] flex items-center">
                  {template?.bg_santri_front && (
                    <button
                      type="button"
                      onClick={() => handleRemoveBg('santri_front')}
                      className="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer flex items-center justify-center"
                      title="Reset ke tema standar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Slot 2: Santri Back */}
              <div className="p-4 rounded-xl border border-teal-200/80 bg-teal-50/20 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between min-h-[22px]">
                  <span className="text-xs font-bold text-teal-900">Kartu Santri (Belakang)</span>
                  {template?.bg_santri_back ? (
                    <span className="text-[10px] font-semibold text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full border border-teal-200">
                      Kustom Aktif
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      Standar
                    </span>
                  )}
                </div>

                <div className="relative border border-dashed border-teal-300 hover:border-teal-600 rounded-xl p-4 text-center bg-white cursor-pointer transition shadow-2xs group flex flex-col items-center justify-center min-h-[96px]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleBgUpload('santri_back', e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-5 h-5 mx-auto text-teal-600 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-normal text-slate-500 block">Upload Gambar Belakang</span>
                </div>

                <div className="min-h-[24px] flex items-center">
                  {template?.bg_santri_back && (
                    <button
                      type="button"
                      onClick={() => handleRemoveBg('santri_back')}
                      className="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer flex items-center justify-center"
                      title="Reset ke tema standar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Slot 3: Mahrom Front */}
              <div className="p-4 rounded-xl border border-teal-200/80 bg-teal-50/20 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between min-h-[22px]">
                  <span className="text-xs font-bold text-teal-900">Kartu Mahrom (Depan)</span>
                  {template?.bg_mahrom_front ? (
                    <span className="text-[10px] font-semibold text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full border border-teal-200">
                      Kustom Aktif
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      Standar
                    </span>
                  )}
                </div>

                <div className="relative border border-dashed border-teal-300 hover:border-teal-600 rounded-xl p-4 text-center bg-white cursor-pointer transition shadow-2xs group flex flex-col items-center justify-center min-h-[96px]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleBgUpload('mahrom_front', e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-5 h-5 mx-auto text-teal-600 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-normal text-slate-500 block">Upload Gambar Depan</span>
                </div>

                <div className="min-h-[24px] flex items-center">
                  {template?.bg_mahrom_front && (
                    <button
                      type="button"
                      onClick={() => handleRemoveBg('mahrom_front')}
                      className="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer flex items-center justify-center"
                      title="Reset ke tema standar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Slot 4: Mahrom Back */}
              <div className="p-4 rounded-xl border border-teal-200/80 bg-teal-50/20 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between min-h-[22px]">
                  <span className="text-xs font-bold text-teal-900">Kartu Mahrom (Belakang)</span>
                  {template?.bg_mahrom_back ? (
                    <span className="text-[10px] font-semibold text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full border border-teal-200">
                      Kustom Aktif
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      Standar
                    </span>
                  )}
                </div>

                <div className="relative border border-dashed border-teal-300 hover:border-teal-600 rounded-xl p-4 text-center bg-white cursor-pointer transition shadow-2xs group flex flex-col items-center justify-center min-h-[96px]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleBgUpload('mahrom_back', e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-5 h-5 mx-auto text-teal-600 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-normal text-slate-500 block">Upload Gambar Belakang</span>
                </div>

                <div className="min-h-[24px] flex items-center">
                  {template?.bg_mahrom_back && (
                    <button
                      type="button"
                      onClick={() => handleRemoveBg('mahrom_back')}
                      className="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer flex items-center justify-center"
                      title="Reset ke tema standar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Layout & Toggle Options */}
          <div className="bg-white rounded-2xl border border-teal-200/80 shadow-xs p-6 space-y-4">
            <h3 className="font-bold text-teal-900 text-sm border-b border-teal-100/60 pb-3">
              Pengaturan Elemen Teks & Logo
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-teal-200/80 bg-teal-50/20 cursor-pointer hover:bg-teal-50/40 transition">
                <input
                  type="checkbox"
                  checked={formData.show_logo_santri}
                  onChange={(e) => setFormData({ ...formData, show_logo_santri: e.target.checked })}
                  className="mt-0.5 text-teal-600 rounded"
                />
                <div>
                  <span className="font-bold text-teal-900 block">Tampilkan Logo di Kartu Santri</span>
                  <span className="text-[11px] text-slate-500 font-normal">Matikan jika background kustom anda sudah memuat logo.</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-teal-200/80 bg-teal-50/20 cursor-pointer hover:bg-teal-50/40 transition">
                <input
                  type="checkbox"
                  checked={formData.show_logo_mahrom}
                  onChange={(e) => setFormData({ ...formData, show_logo_mahrom: e.target.checked })}
                  className="mt-0.5 text-teal-600 rounded"
                />
                <div>
                  <span className="font-bold text-teal-900 block">Tampilkan Logo di Kartu Mahrom</span>
                  <span className="text-[11px] text-slate-500 font-normal">Matikan jika background kustom anda sudah memuat logo.</span>
                </div>
              </label>
            </div>

            {/* Rules & Information Text Editors */}
            <div className="space-y-4 pt-2">
              {/* Sisi Depan: Keterangan Masa Berlaku & Penggunaan */}
              <div className="bg-teal-50/50 p-3.5 sm:p-4 rounded-xl border border-teal-200/70 space-y-3">
                <h4 className="text-xs sm:text-sm font-bold text-teal-900 flex items-center gap-2 border-b border-teal-200/60 pb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600 shrink-0"></span>
                  <span>Keterangan pada Sisi Depan Kartu (Badge Kuning)</span>
                </h4>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-teal-900 mb-1">
                    Keterangan pada Kartu Santri (Sisi Depan)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.keterangan_santri}
                    onChange={(e) => setFormData({ ...formData, keterangan_santri: e.target.value })}
                    placeholder="Berlaku selama menjadi santri&#10;Pondok Pesantren Qudsiyyah Putri"
                    className="w-full p-2.5 sm:p-3 rounded-xl border border-teal-200/80 bg-white text-xs focus:border-teal-600 outline-hidden font-sans font-normal transition"
                  />
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-normal mt-0.5">
                    Contoh: "Berlaku selama menjadi santri" (tekan Enter untuk baris kedua).
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-teal-900 mb-1">
                    Keterangan pada Kartu Mahrom (Sisi Depan)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.keterangan_mahrom}
                    onChange={(e) => setFormData({ ...formData, keterangan_mahrom: e.target.value })}
                    placeholder="Kartu ini mohon dibawa&#10;Saat sambangan / menjemput santri"
                    className="w-full p-2.5 sm:p-3 rounded-xl border border-teal-200/80 bg-white text-xs focus:border-teal-600 outline-hidden font-sans font-normal transition"
                  />
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-normal mt-0.5">
                    Contoh: "Kartu ini mohon dibawa saat sambangan / menjemput santri".
                  </p>
                </div>
              </div>

              {/* Sisi Belakang: Tata Tertib & Ketentuan (3 Zona: Header, Konten, Footer) */}
              <div className="pt-3 border-t border-teal-100/80 space-y-4">
                <div className="bg-teal-50/50 p-3.5 sm:p-4 rounded-xl border border-teal-200/70 space-y-3">
                  <h4 className="text-xs sm:text-sm font-bold text-teal-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
                    Sisi Belakang Kartu Santri
                  </h4>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-teal-900 mb-1">
                      1. Judul Header (Sisi Belakang Kartu Santri)
                    </label>
                    <input
                      type="text"
                      value={formData.judul_belakang_santri}
                      onChange={(e) => setFormData({ ...formData, judul_belakang_santri: e.target.value })}
                      placeholder="TATA TERTIB SANTRI"
                      className="w-full p-2.5 sm:p-3 rounded-xl border border-teal-200/80 bg-white text-xs focus:border-teal-600 outline-hidden font-sans font-normal transition"
                    />
                    <p className="text-[10px] sm:text-[11px] text-slate-500 font-normal mt-0.5">
                      Ukuran font otomatis menyesuaikan agar selalu 1 baris utuh.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-teal-900 mb-1">
                      2. Isi Tata Tertib Santri (Area Konten)
                    </label>
                    <textarea
                      rows={5}
                      value={formData.tata_tertib_santri}
                      onChange={(e) => setFormData({ ...formData, tata_tertib_santri: e.target.value })}
                      className="w-full p-2.5 sm:p-3 rounded-xl border border-teal-200/80 bg-white text-xs focus:border-teal-600 outline-hidden font-sans font-normal leading-relaxed transition"
                    />
                    <p className="text-[10px] sm:text-[11px] text-slate-500 font-normal mt-0.5">
                      Tulis per baris (mendukung angka: 1, 2, dst). Ukuran font dan spasi otomatis menyesuaikan jumlah poin.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-teal-900 mb-1">
                      3. Teks Footer / Peringatan Bawah (Kartu Santri)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.footer_belakang_santri}
                      onChange={(e) => setFormData({ ...formData, footer_belakang_santri: e.target.value })}
                      placeholder="Bagi yang menemukan kartu ini, mohon bisa mengembalikan ke..."
                      className="w-full p-2.5 sm:p-3 rounded-xl border border-teal-200/80 bg-white text-xs focus:border-teal-600 outline-hidden font-sans font-normal transition"
                    />
                  </div>
                </div>

                <div className="bg-teal-50/50 p-3.5 sm:p-4 rounded-xl border border-teal-200/70 space-y-3">
                  <h4 className="text-xs sm:text-sm font-bold text-teal-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
                    Sisi Belakang Kartu Mahrom
                  </h4>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-teal-900 mb-1">
                      1. Judul Header (Sisi Belakang Kartu Mahrom)
                    </label>
                    <input
                      type="text"
                      value={formData.judul_belakang_mahrom}
                      onChange={(e) => setFormData({ ...formData, judul_belakang_mahrom: e.target.value })}
                      placeholder="PERATURAN KUNJUNGAN DAN PERIJINAN PULANG"
                      className="w-full p-2.5 sm:p-3 rounded-xl border border-teal-200/80 bg-white text-xs focus:border-teal-600 outline-hidden font-sans font-normal transition"
                    />
                    <p className="text-[10px] sm:text-[11px] text-slate-500 font-normal mt-0.5">
                      Ukuran font otomatis menyesuaikan agar selalu 1 baris utuh.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-teal-900 mb-1">
                      2. Isi Ketentuan Kunjungan & Perizinan (Area Konten)
                    </label>
                    <textarea
                      rows={6}
                      value={formData.ketentuan_mahrom}
                      onChange={(e) => setFormData({ ...formData, ketentuan_mahrom: e.target.value })}
                      className="w-full p-2.5 sm:p-3 rounded-xl border border-teal-200/80 bg-white text-xs focus:border-teal-600 outline-hidden font-sans font-normal leading-relaxed transition"
                    />
                    <p className="text-[10px] sm:text-[11px] text-slate-500 font-normal mt-0.5">
                      Mendukung nomor (1, 2) dan sub-poin (a, b). Ukuran font dan spasi otomatis menyesuaikan kepadatan teks.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-teal-900 mb-1">
                      3. Teks Footer / Peringatan Bawah (Kartu Mahrom)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.footer_belakang_mahrom}
                      onChange={(e) => setFormData({ ...formData, footer_belakang_mahrom: e.target.value })}
                      placeholder="Bagi yang menemukan kartu ini, mohon bisa mengembalikan ke..."
                      className="w-full p-2.5 sm:p-3 rounded-xl border border-teal-200/80 bg-white text-xs focus:border-teal-600 outline-hidden font-sans font-normal transition"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Real-time Live Preview (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-teal-100 shadow-xs p-6 space-y-4 sticky top-6">
          <div className="border-b border-teal-100/60 pb-3">
            <h3 className="font-bold text-teal-900 text-sm">Pratinjau Langsung Desain</h3>
          </div>

          {/* 1. Tombol Pilihan Jenis Kartu (Kartu Santri / Kartu Mahrom) */}
          <div className="flex justify-center bg-teal-50/70 p-1 rounded-xl text-xs font-semibold border border-teal-200/60">
            <button
              onClick={() => setPreviewCardType('santri')}
              className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
                previewCardType === 'santri' ? 'bg-teal-700 text-white shadow-xs' : 'text-teal-900 hover:text-teal-950'
              }`}
            >
              Kartu Santri
            </button>
            <button
              onClick={() => setPreviewCardType('mahrom')}
              className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
                previewCardType === 'mahrom' ? 'bg-teal-700 text-white shadow-xs' : 'text-teal-900 hover:text-teal-950'
              }`}
            >
              Kartu Mahrom
            </button>
          </div>

          {/* 2. Tombol Sisi Kartu (Depan / Belakang) dipindahkan ke bawah */}
          <div className="flex justify-center bg-teal-50/70 p-1 rounded-xl text-xs font-medium border border-teal-200/60">
            <button
              onClick={() => setPreviewSide('front')}
              className={`flex-1 py-1.5 rounded-lg transition cursor-pointer text-center ${
                previewSide === 'front' ? 'bg-white font-semibold text-teal-900 shadow-xs' : 'text-teal-800 hover:text-teal-900'
              }`}
            >
              Depan
            </button>
            <button
              onClick={() => setPreviewSide('back')}
              className={`flex-1 py-1.5 rounded-lg transition cursor-pointer text-center ${
                previewSide === 'back' ? 'bg-white font-semibold text-teal-900 shadow-xs' : 'text-teal-800 hover:text-teal-900'
              }`}
            >
              Belakang
            </button>
          </div>

          {/* Render Card Preview */}
          <div className="p-2 sm:p-6 bg-[#f4fbf9] rounded-2xl border border-teal-200/80 flex items-center justify-center min-h-[220px] sm:min-h-[300px] overflow-hidden">
            <div className="card-scale-box">
              {previewCardType === 'santri' ? (
                <CardSantri
                  santri={dummySantri}
                  pesantren={pesantren}
                  template={{
                    ...template,
                    show_logo_santri: formData.show_logo_santri,
                    tata_tertib_santri: formData.tata_tertib_santri,
                    keterangan_santri: formData.keterangan_santri,
                    judul_belakang_santri: formData.judul_belakang_santri,
                    footer_belakang_santri: formData.footer_belakang_santri
                  }}
                  side={previewSide}
                />
              ) : (
                <CardMahrom
                  santri={dummySantri}
                  pesantren={pesantren}
                  template={{
                    ...template,
                    show_logo_mahrom: formData.show_logo_mahrom,
                    ketentuan_mahrom: formData.ketentuan_mahrom,
                    keterangan_mahrom: formData.keterangan_mahrom,
                    judul_belakang_mahrom: formData.judul_belakang_mahrom,
                    footer_belakang_mahrom: formData.footer_belakang_mahrom
                  }}
                  side={previewSide}
                />
              )}
            </div>
          </div>

          <div className="p-3 bg-teal-50/40 rounded-xl border border-teal-100 text-xs text-teal-900/90 leading-relaxed font-normal">
            Klik <b>Simpan Perubahan Desain</b> untuk menerapkan secara permanen ke seluruh kartu santri.
          </div>
        </div>
      </div>
    </div>
  );
}
