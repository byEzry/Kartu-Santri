import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  User,
  Home,
  BookOpen,
  Phone,
  Heart,
  Users,
  Check,
  AlertCircle,
  Copy,
  CreditCard,
  Building2
} from 'lucide-react';
import { DAFTAR_PEKERJAAN_RESMI } from '../pages/SantriFormPage';

export function SantriFormModal({
  isOpen,
  onClose,
  santriToEdit = null,
  onSaveSuccess,
  onSaveAndCreateCard
}) {
  if (!isOpen) return null;

  const isEdit = Boolean(santriToEdit && santriToEdit.id);

  const [activeTab, setActiveTab] = useState('akademik'); // 'akademik' | 'biodata' | 'ayah' | 'ibu'

  const initialForm = {
    // Akademik & Asrama
    no_induk: '',
    nisn: '',
    jenjang: 'MTs',
    kelas: 'VII',
    ruang: 'A',
    program: 'Tahfidz',
    kamar_asrama: '',
    status: 'Aktif',

    // Biodata Santri
    nama_lengkap: '',
    nik_santri: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    jenis_kelamin: 'P',
    agama: 'Islam',
    golongan_darah: '-',
    alamat_siswa: '',
    anak_ke: 1,
    jumlah_saudara: 1,
    no_kk: '',

    // Data Ayah
    nama_ayah: '',
    nik_ayah: '',
    almarhum_ayah: 0,
    tempat_lahir_ayah: '',
    tanggal_lahir_ayah: '',
    pendidikan_ayah: 'SMA / MA',
    pekerjaan_ayah: '',
    penghasilan_ayah: '',
    no_telp_ayah: '',
    alamat_ayah: '',

    // Data Ibu
    nama_ibu: '',
    nik_ibu: '',
    almarhumah_ibu: 0,
    tempat_lahir_ibu: '',
    tanggal_lahir_ibu: '',
    pendidikan_ibu: 'SMA / MA',
    pekerjaan_ibu: 'Ibu Rumah Tangga',
    penghasilan_ibu: '-',
    no_telp_ibu: '',
    alamat_ibu: '',

    catatan_medis: ''
  };

  const [formData, setFormData] = useState(initialForm);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (santriToEdit) {
      setFormData({
        no_induk: santriToEdit.no_induk || santriToEdit.nispp || '',
        nisn: santriToEdit.nisn || '',
        jenjang: santriToEdit.jenjang || 'MTs',
        kelas: santriToEdit.kelas || '',
        ruang: santriToEdit.ruang || '',
        program: santriToEdit.program || 'Tahfidz',
        kamar_asrama: santriToEdit.kamar_asrama || santriToEdit.kamar || '',
        status: santriToEdit.status || 'Aktif',

        nama_lengkap: santriToEdit.nama_lengkap || santriToEdit.nama || '',
        nik_santri: santriToEdit.nik_santri || santriToEdit.nik || '',
        tempat_lahir: santriToEdit.tempat_lahir || '',
        tanggal_lahir: santriToEdit.tanggal_lahir || '',
        jenis_kelamin: santriToEdit.jenis_kelamin || 'P',
        agama: santriToEdit.agama || 'Islam',
        golongan_darah: santriToEdit.golongan_darah || '-',
        alamat_siswa: santriToEdit.alamat_siswa || santriToEdit.alamat || '',
        anak_ke: santriToEdit.anak_ke || 1,
        jumlah_saudara: santriToEdit.jumlah_saudara || 1,
        no_kk: santriToEdit.no_kk || santriToEdit.kartu_keluarga || '',

        nama_ayah: santriToEdit.nama_ayah || santriToEdit.wali || '',
        nik_ayah: santriToEdit.nik_ayah || '',
        almarhum_ayah: santriToEdit.almarhum_ayah ? 1 : 0,
        tempat_lahir_ayah: santriToEdit.tempat_lahir_ayah || '',
        tanggal_lahir_ayah: santriToEdit.tanggal_lahir_ayah || '',
        pendidikan_ayah: santriToEdit.pendidikan_ayah || 'SMA / MA',
        pekerjaan_ayah: santriToEdit.pekerjaan_ayah || '',
        penghasilan_ayah: santriToEdit.penghasilan_ayah || '',
        no_telp_ayah: santriToEdit.no_telp_ayah || santriToEdit.no_hp_wali || '',
        alamat_ayah: santriToEdit.alamat_ayah || '',

        nama_ibu: santriToEdit.nama_ibu || santriToEdit.ibu_kandung || '',
        nik_ibu: santriToEdit.nik_ibu || '',
        almarhumah_ibu: santriToEdit.almarhumah_ibu ? 1 : 0,
        tempat_lahir_ibu: santriToEdit.tempat_lahir_ibu || '',
        tanggal_lahir_ibu: santriToEdit.tanggal_lahir_ibu || '',
        pendidikan_ibu: santriToEdit.pendidikan_ibu || 'SMA / MA',
        pekerjaan_ibu: santriToEdit.pekerjaan_ibu || 'Ibu Rumah Tangga',
        penghasilan_ibu: santriToEdit.penghasilan_ibu || '-',
        no_telp_ibu: santriToEdit.no_telp_ibu || '',
        alamat_ibu: santriToEdit.alamat_ibu || '',

        catatan_medis: santriToEdit.catatan_medis || ''
      });
      setPhotoPreview(santriToEdit.foto_path || null);
    } else {
      setFormData(initialForm);
      setPhotoPreview(null);
    }
    setPhotoFile(null);
    setErrorMsg('');
    setActiveTab('akademik');
  }, [santriToEdit, isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('File harus berupa gambar (JPG, PNG, atau WebP).');
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      setErrorMsg('');
    }
  };

  // Helper copy alamat
  const copyAlamatSantriToAyah = () => {
    handleChange('alamat_ayah', formData.alamat_siswa);
  };

  const copyAlamatAyahToIbu = () => {
    handleChange('alamat_ibu', formData.alamat_ayah || formData.alamat_siswa);
  };

  const handleSubmit = async (andCreateCard = false) => {
    setErrorMsg('');

    if (!formData.no_induk.trim()) {
      setActiveTab('akademik');
      setErrorMsg('No. Induk santri wajib diisi!');
      return;
    }

    if (!formData.nama_lengkap.trim()) {
      setActiveTab('biodata');
      setErrorMsg('Nama lengkap santri wajib diisi!');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        payload.append(key, formData[key]);
      });

      // Backward compatibility aliases
      payload.append('nispp', formData.no_induk);
      payload.append('nama', formData.nama_lengkap);
      payload.append('kamar', formData.kamar_asrama);
      payload.append('alamat', formData.alamat_siswa);
      payload.append('wali', formData.nama_ayah);
      payload.append('no_hp_wali', formData.no_telp_ayah);
      payload.append('nik', formData.nik_santri);
      payload.append('kartu_keluarga', formData.no_kk);
      payload.append('ibu_kandung', formData.nama_ibu);

      if (photoFile) {
        payload.append('foto', photoFile);
      }

      const url = isEdit ? `/api/santri/${santriToEdit.id}` : '/api/santri';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: payload
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Gagal menyimpan data santri.');
      }

      const savedData = json.data;

      if (andCreateCard && onSaveAndCreateCard) {
        onSaveAndCreateCard(savedData);
      } else {
        onSaveSuccess(savedData);
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col max-h-[96vh] sm:max-h-[92vh] animate-in fade-in duration-200">
        {/* Header */}
        <div className="px-3.5 sm:px-5 py-3 sm:py-3.5 border-b border-[#B6E5DE] flex items-center justify-between bg-[#E2F1ED]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-teal-600 text-amber-300 flex items-center justify-center shadow-xs shrink-0">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="font-bold text-teal-950 text-sm sm:text-base leading-tight">
                {isEdit ? 'Edit Master Data Santri' : 'Input Santri Baru'}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-teal-800/80 font-medium truncate max-w-[200px] sm:max-w-none">
                Pondok Pesantren Qudsiyyah Putri Kudus
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation (Responsive Horizontal Scroll) */}
        <div className="flex border-b border-teal-100 bg-slate-50/70 px-2 sm:px-4 pt-2 gap-1 overflow-x-auto select-none no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('akademik')}
            className={`px-2.5 sm:px-3.5 py-2 text-xs font-bold rounded-t-xl transition flex items-center gap-1.5 cursor-pointer border-t-2 shrink-0 ${
              activeTab === 'akademik'
                ? 'bg-white text-teal-800 border-teal-600 shadow-2xs'
                : 'text-slate-600 hover:text-teal-700 border-transparent hover:bg-white/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>1. Akademik & Asrama</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('biodata')}
            className={`px-2.5 sm:px-3.5 py-2 text-xs font-bold rounded-t-xl transition flex items-center gap-1.5 cursor-pointer border-t-2 shrink-0 ${
              activeTab === 'biodata'
                ? 'bg-white text-teal-800 border-teal-600 shadow-2xs'
                : 'text-slate-600 hover:text-teal-700 border-transparent hover:bg-white/50'
            }`}
          >
            <User className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>2. Biodata Santri</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ayah')}
            className={`px-2.5 sm:px-3.5 py-2 text-xs font-bold rounded-t-xl transition flex items-center gap-1.5 cursor-pointer border-t-2 shrink-0 ${
              activeTab === 'ayah'
                ? 'bg-white text-teal-800 border-teal-600 shadow-2xs'
                : 'text-slate-600 hover:text-teal-700 border-transparent hover:bg-white/50'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>3. Data Ayah</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ibu')}
            className={`px-2.5 sm:px-3.5 py-2 text-xs font-bold rounded-t-xl transition flex items-center gap-1.5 cursor-pointer border-t-2 shrink-0 ${
              activeTab === 'ibu'
                ? 'bg-white text-teal-800 border-teal-600 shadow-2xs'
                : 'text-slate-600 hover:text-teal-700 border-transparent hover:bg-white/50'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>4. Data Ibu</span>
          </button>
        </div>

        {/* Modal Body / Tab Contents */}
        <div className="p-3.5 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: AKADEMIK & ASRAMA */}
          {activeTab === 'akademik' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-teal-950 mb-1">
                    No. Induk (NIS Pesantren) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 202601001"
                    value={formData.no_induk}
                    onChange={(e) => handleChange('no_induk', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal-950 mb-1">
                    NISN (Nomor Induk Siswa Nasional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 0081234501"
                    value={formData.nisn}
                    onChange={(e) => handleChange('nisn', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal-950 mb-1">
                    Jenjang Pendidikan <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.jenjang}
                    onChange={(e) => handleChange('jenjang', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden font-medium"
                  >
                    <option value="MI">MI (Madrasah Ibtidaiyyah)</option>
                    <option value="MTs">MTs (Madrasah Tsanawiyyah)</option>
                    <option value="MA">MA (Madrasah Aliyyah)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal-950 mb-1">
                    Kelas
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: VII, VIII, IX, X, XI, XII"
                    value={formData.kelas}
                    onChange={(e) => handleChange('kelas', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal-950 mb-1">
                    Ruang / Rombel
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: A, B, C, D"
                    value={formData.ruang}
                    onChange={(e) => handleChange('ruang', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal-950 mb-1">
                    Program Pendidikan <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.program}
                    onChange={(e) => handleChange('program', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden font-medium"
                  >
                    <option value="Tahfidz">Tahfidz Al-Qur'an</option>
                    <option value="Kitab">Kitab Kuning / Salaf</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal-950 mb-1">
                    Kamar Asrama
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Khadijah 01, Aisyah 02"
                    value={formData.kamar_asrama}
                    onChange={(e) => handleChange('kamar_asrama', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal-950 mb-1">
                    Status Santri
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden font-medium"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Alumni">Alumni</option>
                    <option value="Boyong">Boyong</option>
                    <option value="Cuti">Cuti</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal-950 mb-1">
                    Catatan Khusus / Medis
                  </label>
                  <input
                    type="text"
                    placeholder="Riwayat alergi / asma / penyakit bawaan"
                    value={formData.catatan_medis}
                    onChange={(e) => handleChange('catatan_medis', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BIODATA DIRI SANTRI */}
          {activeTab === 'biodata' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Photo Upload Box */}
                <div className="flex flex-col items-center justify-center p-4 bg-teal-50/40 rounded-2xl border-2 border-dashed border-teal-200 text-center">
                  <div className="w-24 h-32 rounded-xl bg-white border border-teal-300 shadow-xs flex items-center justify-center overflow-hidden mb-3 relative">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Foto Santri" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-2 text-slate-400">
                        <User className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                        <span className="text-[10px] block leading-tight font-medium">Foto 3x4 Santri</span>
                      </div>
                    )}
                  </div>

                  <label className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold cursor-pointer shadow-xs transition flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Foto</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[10px] text-slate-500 mt-1">Format: JPG, PNG, WebP (Max 5MB)</p>
                </div>

                {/* Biodata Fields */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-teal-950 mb-1">
                      Nama Lengkap Santri <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Fathimah Az-Zahra"
                      value={formData.nama_lengkap}
                      onChange={(e) => handleChange('nama_lengkap', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-teal-950 mb-1">
                      NIK Santri (16 Digit)
                    </label>
                    <input
                      type="text"
                      maxLength={16}
                      placeholder="3319..."
                      value={formData.nik_santri}
                      onChange={(e) => handleChange('nik_santri', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-teal-950 mb-1">
                      No. Kartu Keluarga (KK)
                    </label>
                    <input
                      type="text"
                      maxLength={16}
                      placeholder="3319..."
                      value={formData.no_kk}
                      onChange={(e) => handleChange('no_kk', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-teal-950 mb-1">
                      Tempat Lahir
                    </label>
                    <input
                      type="text"
                      placeholder="Kota / Kabupaten"
                      value={formData.tempat_lahir}
                      onChange={(e) => handleChange('tempat_lahir', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-teal-950 mb-1">
                      Tanggal Lahir
                    </label>
                    <input
                      type="date"
                      value={formData.tanggal_lahir}
                      onChange={(e) => handleChange('tanggal_lahir', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-teal-950 mb-1">
                      Jenis Kelamin
                    </label>
                    <select
                      value={formData.jenis_kelamin}
                      onChange={(e) => handleChange('jenis_kelamin', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden font-medium"
                    >
                      <option value="P">Perempuan (Santriwati)</option>
                      <option value="L">Laki-Laki</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-teal-950 mb-1">
                      Golongan Darah
                    </label>
                    <select
                      value={formData.golongan_darah}
                      onChange={(e) => handleChange('golongan_darah', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden font-medium"
                    >
                      <option value="-">- (Belum Tahu)</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="AB">AB</option>
                      <option value="O">O</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-teal-950 mb-1">
                      Anak ke-
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={formData.anak_ke}
                      onChange={(e) => handleChange('anak_ke', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-teal-950 mb-1">
                      Jumlah Saudara
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={formData.jumlah_saudara}
                      onChange={(e) => handleChange('jumlah_saudara', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden"
                    />
                  </div>
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-teal-950 mb-1">
                    Alamat Lengkap Siswa / Asal
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Nama Jalan, RT/RW, Dusun, Desa/Kelurahan, Kecamatan, Kabupaten/Kota"
                    value={formData.alamat_siswa}
                    onChange={(e) => handleChange('alamat_siswa', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DATA AYAH KANDUNG */}
          {activeTab === 'ayah' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950">
                  Data Ayah Kandung Santri
                </span>
                <label className="flex items-center gap-2 text-xs text-amber-900 cursor-pointer font-medium select-none">
                  <input
                    type="checkbox"
                    checked={formData.almarhum_ayah === 1}
                    onChange={(e) => handleChange('almarhum_ayah', e.target.checked ? 1 : 0)}
                    className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span>Status: Almarhum (Meninggal Dunia)</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-teal-950 mb-1">
                    Nama Ayah
                  </label>
                  <input
                    type="text"
                    placeholder="Nama Lengkap Ayah"
                    value={formData.nama_ayah}
                    onChange={(e) => handleChange('nama_ayah', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal-950 mb-1">
                    NIK Ayah (16 Digit)
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    placeholder="3319..."
                    value={formData.nik_ayah}
                    onChange={(e) => handleChange('nik_ayah', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal-950 mb-1">
                    No. Telp / WhatsApp Ayah
                  </label>
                  <input
                    type="text"
                    placeholder="0812..."
                    value={formData.no_telp_ayah}
                    onChange={(e) => handleChange('no_telp_ayah', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal-950 mb-1">
                    Tempat Lahir Ayah
                  </label>
                  <input
                    type="text"
                    placeholder="Kota / Kabupaten"
                    value={formData.tempat_lahir_ayah}
                    onChange={(e) => handleChange('tempat_lahir_ayah', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal-950 mb-1">
                    Tanggal Lahir Ayah
                  </label>
                  <input
                    type="date"
                    value={formData.tanggal_lahir_ayah}
                    onChange={(e) => handleChange('tanggal_lahir_ayah', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal-950 mb-1">
                    Pendidikan Ayah
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: S1 Pendidikan, SMA/MA"
                    value={formData.pendidikan_ayah}
                    onChange={(e) => handleChange('pendidikan_ayah', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal-950 mb-1">
                    Pekerjaan Ayah
                  </label>
                  <select
                    value={formData.pekerjaan_ayah}
                    onChange={(e) => handleChange('pekerjaan_ayah', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden"
                  >
                    <option value="">-- Pilih Pekerjaan Ayah --</option>
                    {DAFTAR_PEKERJAAN_RESMI.map((pek) => (
                      <option key={pek} value={pek}>
                        {pek}
                      </option>
                    ))}
                    {formData.pekerjaan_ayah && !DAFTAR_PEKERJAAN_RESMI.includes(formData.pekerjaan_ayah) && (
                      <option value={formData.pekerjaan_ayah}>{formData.pekerjaan_ayah}</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal-950 mb-1">
                    Penghasilan Ayah
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Rp 3.000.000 - Rp 5.000.000"
                    value={formData.penghasilan_ayah}
                    onChange={(e) => handleChange('penghasilan_ayah', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-teal-950">
                      Alamat Ayah
                    </label>
                    <button
                      type="button"
                      onClick={copyAlamatSantriToAyah}
                      className="text-[11px] text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Sama dengan Alamat Santri</span>
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Alamat domisili ayah saat ini"
                    value={formData.alamat_ayah}
                    onChange={(e) => handleChange('alamat_ayah', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DATA IBU KANDUNG */}
          {activeTab === 'ibu' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl flex items-center justify-between">
                <span className="text-xs font-bold text-rose-950">
                  Data Ibu Kandung Santri
                </span>
                <label className="flex items-center gap-2 text-xs text-rose-900 cursor-pointer font-medium select-none">
                  <input
                    type="checkbox"
                    checked={formData.almarhumah_ibu === 1}
                    onChange={(e) => handleChange('almarhumah_ibu', e.target.checked ? 1 : 0)}
                    className="rounded border-rose-300 text-rose-600 focus:ring-rose-500"
                  />
                  <span>Status: Almarhumah (Meninggal Dunia)</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-teal-950 mb-1">
                    Nama Ibu
                  </label>
                  <input
                    type="text"
                    placeholder="Nama Lengkap Ibu Kandung"
                    value={formData.nama_ibu}
                    onChange={(e) => handleChange('nama_ibu', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal-950 mb-1">
                    NIK Ibu (16 Digit)
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    placeholder="3319..."
                    value={formData.nik_ibu}
                    onChange={(e) => handleChange('nik_ibu', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal-950 mb-1">
                    No. Telp / WhatsApp Ibu
                  </label>
                  <input
                    type="text"
                    placeholder="0813..."
                    value={formData.no_telp_ibu}
                    onChange={(e) => handleChange('no_telp_ibu', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal-950 mb-1">
                    Tempat Lahir Ibu
                  </label>
                  <input
                    type="text"
                    placeholder="Kota / Kabupaten"
                    value={formData.tempat_lahir_ibu}
                    onChange={(e) => handleChange('tempat_lahir_ibu', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal-950 mb-1">
                    Tanggal Lahir Ibu
                  </label>
                  <input
                    type="date"
                    value={formData.tanggal_lahir_ibu}
                    onChange={(e) => handleChange('tanggal_lahir_ibu', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal-950 mb-1">
                    Pendidikan Ibu
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: D3 Kebidanan, SMA"
                    value={formData.pendidikan_ibu}
                    onChange={(e) => handleChange('pendidikan_ibu', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal-950 mb-1">
                    Pekerjaan Ibu
                  </label>
                  <select
                    value={formData.pekerjaan_ibu}
                    onChange={(e) => handleChange('pekerjaan_ibu', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden"
                  >
                    <option value="">-- Pilih Pekerjaan Ibu --</option>
                    {DAFTAR_PEKERJAAN_RESMI.map((pek) => (
                      <option key={pek} value={pek}>
                        {pek}
                      </option>
                    ))}
                    {formData.pekerjaan_ibu && !DAFTAR_PEKERJAAN_RESMI.includes(formData.pekerjaan_ibu) && (
                      <option value={formData.pekerjaan_ibu}>{formData.pekerjaan_ibu}</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal-950 mb-1">
                    Penghasilan Ibu
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: - atau Rp 2.000.000"
                    value={formData.penghasilan_ibu}
                    onChange={(e) => handleChange('penghasilan_ibu', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-teal-950">
                      Alamat Ibu
                    </label>
                    <button
                      type="button"
                      onClick={copyAlamatAyahToIbu}
                      className="text-[11px] text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Sama dengan Alamat Ayah / Santri</span>
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Alamat domisili ibu saat ini"
                    value={formData.alamat_ibu}
                    onChange={(e) => handleChange('alamat_ibu', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-3.5 sm:px-5 py-3 sm:py-3.5 bg-slate-50 border-t border-teal-100 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          {/* Quick tab jumper */}
          <div className="text-xs text-slate-500 font-medium hidden md:block">
            {activeTab === 'akademik' && <span>Langkah 1 dari 4: Akademik & Asrama</span>}
            {activeTab === 'biodata' && <span>Langkah 2 dari 4: Biodata Santri</span>}
            {activeTab === 'ayah' && <span>Langkah 3 dari 4: Data Ayah Kandung</span>}
            {activeTab === 'ibu' && <span>Langkah 4 dari 4: Data Ibu Kandung</span>}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto flex-wrap justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3 sm:px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-200/60 transition cursor-pointer"
            >
              Batal
            </button>

            {/* Previous tab button */}
            {activeTab !== 'akademik' && (
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'biodata') setActiveTab('akademik');
                  if (activeTab === 'ayah') setActiveTab('biodata');
                  if (activeTab === 'ibu') setActiveTab('ayah');
                }}
                className="px-3 sm:px-3.5 py-2 text-xs font-semibold rounded-xl border border-teal-200 text-teal-800 hover:bg-teal-50 transition cursor-pointer"
              >
                Kembali
              </button>
            )}

            {/* Next tab button */}
            {activeTab !== 'ibu' && (
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'akademik') setActiveTab('biodata');
                  if (activeTab === 'biodata') setActiveTab('ayah');
                  if (activeTab === 'ayah') setActiveTab('ibu');
                }}
                className="px-3 sm:px-3.5 py-2 text-xs font-semibold rounded-xl bg-teal-50 text-teal-800 hover:bg-teal-100 transition cursor-pointer border border-teal-200"
              >
                Lanjut →
              </button>
            )}

            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
              className="px-3.5 sm:px-4 py-2 text-xs font-bold rounded-xl bg-[#094B44] hover:bg-[#06332E] text-white shadow-xs transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer border border-[#094B44]"
            >
              <Check className="w-3.5 h-3.5 text-[#D6F2EE]" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Data'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting}
              className="px-3.5 sm:px-4 py-2 text-xs font-bold rounded-xl bg-[#009688] hover:bg-[#007D71] text-white shadow-xs transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer border border-[#009688]"
            >
              <CreditCard className="w-3.5 h-3.5 text-white" />
              <span>Simpan & Cetak</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
