import React, { useState, useEffect } from 'react';
import { Building2, Upload, Check, Trash2, CheckCircle2 } from 'lucide-react';

export function PengaturanPesantren({ pesantren, onUpdatePesantren }) {
  const [formData, setFormData] = useState({
    nama_pesantren: '',
    alamat_pesantren: '',
    kontak: '',
    website: '',
    email: '',
    nama_pengasuh: '',
    sebutan_pengasuh: ''
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (pesantren) {
      setFormData({
        nama_pesantren: pesantren.nama_pesantren || '',
        alamat_pesantren: pesantren.alamat_pesantren || '',
        kontak: pesantren.kontak || '',
        website: pesantren.website || '',
        email: pesantren.email || '',
        nama_pengasuh: pesantren.nama_pengasuh || '',
        sebutan_pengasuh: pesantren.sebutan_pengasuh || 'Pengasuh Pondok Pesantren'
      });
      setLogoPreview(pesantren.logo_path || null);
    }
  }, [pesantren]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach((k) => data.append(k, formData[k] || ''));

      if (logoFile) {
        data.append('logo', logoFile);
      }

      const res = await fetch('/api/settings/pesantren', {
        method: 'PUT',
        body: data
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Gagal menyimpan profil pesantren.');
      }

      onUpdatePesantren(json.data);
      setSuccessMsg('Profil pesantren berhasil disimpan dan diperbarui!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Top Header Banner with Solid Deep Teal & Concentric Rings */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#094B44] text-white p-5 sm:p-6 lg:p-7 shadow-md shadow-[#094B44]/25 border border-white/15">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#D6F2EE] tracking-tight">
              Profil Pondok Pesantren
            </h1>
            <p className="text-xs sm:text-sm text-[#EFF6F3]/90 font-normal mt-1">
              Data identitas resmi pesantren yang akan tampil pada kop kartu santri, kartu mahrom, dan laporan
            </p>
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

      {successMsg && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-teal-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-teal-100 shadow-xs p-6 space-y-6">
        {/* Logo Upload */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 border-b border-teal-100/60 pb-6">
          <div className="relative w-24 h-24 rounded-2xl border-2 border-dashed border-teal-200 hover:border-teal-500 bg-teal-50/25 flex items-center justify-center overflow-hidden cursor-pointer group shrink-0">
            <img
              src={logoPreview || pesantren?.logo_path || '/logo-qudsiyyah.png'}
              alt="Logo Resmi Qudsiyyah"
              className="w-full h-full object-contain p-2"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <h4 className="text-xs font-bold text-teal-900">Logo Resmi Pondok Pesantren</h4>
            <p className="text-xs text-slate-400 font-normal">Format PNG atau JPG dengan latar belakang transparan direkomendasikan.</p>
            <label className="inline-block mt-2 px-3 py-1.5 rounded-lg border border-teal-200 text-teal-900 text-xs font-semibold hover:bg-teal-50 cursor-pointer">
              Pilih Logo Baru
              <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
            </label>
          </div>
        </div>

        {/* Text Fields */}
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-teal-900 mb-1">
              Nama Resmi Pondok Pesantren <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.nama_pesantren}
              onChange={(e) => setFormData({ ...formData, nama_pesantren: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-teal-200/80 bg-teal-50/20 focus:bg-white focus:border-teal-600 outline-hidden font-bold text-teal-900 text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold text-teal-900 mb-1">
              Alamat Lengkap Pesantren
            </label>
            <input
              type="text"
              value={formData.alamat_pesantren}
              onChange={(e) => setFormData({ ...formData, alamat_pesantren: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-teal-200/80 bg-teal-50/20 focus:bg-white focus:border-teal-600 outline-hidden font-normal text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-teal-900 mb-1">
                Kontak (Telepon / WhatsApp Sekretariat)
              </label>
              <input
                type="text"
                value={formData.kontak}
                onChange={(e) => setFormData({ ...formData, kontak: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-teal-200/80 bg-teal-50/20 focus:bg-white focus:border-teal-600 outline-hidden font-normal text-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold text-teal-900 mb-1">
                Alamat Website Resmi
              </label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-teal-200/80 bg-teal-50/20 focus:bg-white focus:border-teal-600 outline-hidden font-mono font-normal text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-teal-900 mb-1">
                Nama Pengasuh / Pimpinan Pondok
              </label>
              <input
                type="text"
                value={formData.nama_pengasuh}
                onChange={(e) => setFormData({ ...formData, nama_pengasuh: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-teal-200/80 bg-teal-50/20 focus:bg-white focus:border-teal-600 outline-hidden font-normal text-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold text-teal-900 mb-1">
                Sebutan Jabatan Pimpinan
              </label>
              <input
                type="text"
                placeholder="Contoh: Pengasuh Pondok Pesantren"
                value={formData.sebutan_pengasuh}
                onChange={(e) => setFormData({ ...formData, sebutan_pengasuh: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-teal-200/80 bg-teal-50/20 focus:bg-white focus:border-teal-600 outline-hidden font-normal text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-teal-100/60 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-2 shadow-xs border border-[#20E2D7]/50 transition disabled:opacity-50"
          >
            <Check className="w-4 h-4 text-[#20E2D7]" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Profil Pesantren'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
