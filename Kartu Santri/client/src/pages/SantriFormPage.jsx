import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
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
  Building2,
  Trash2
} from 'lucide-react';

// Daftar Jenis Pekerjaan Resmi Sesuai Standar Administrasi Kependudukan (UU No. 24/2013 & Permendagri No. 108/2019 / EMIS Kemenag)
export const DAFTAR_PEKERJAAN_RESMI = [
  'Belum / Tidak Bekerja',
  'Mengurus Rumah Tangga',
  'Ibu Rumah Tangga',
  'Pegawai Negeri Sipil (PNS / ASN)',
  'Tentara Nasional Indonesia (TNI)',
  'Kepolisian RI (POLRI)',
  'Karyawan BUMN',
  'Karyawan BUMD',
  'Karyawan Swasta',
  'Karyawan Honorer',
  'Wiraswasta / Pengusaha',
  'Pedagang',
  'Petani / Pekebun',
  'Peternak',
  'Nelayan / Perikanan',
  'Buruh Harian Lepas',
  'Buruh Tani / Perkebunan',
  'Buruh Pabrik / Industri',
  'Guru',
  'Dosen',
  'Dokter',
  'Bidan',
  'Perawat',
  'Apoteker',
  'Tenaga Kesehatan / Medis',
  'Ustadz / Mubaligh / Tokoh Agama',
  'Pengasuh Pondok Pesantren',
  'Imam Masjid',
  'Pensiunan',
  'Perangkat Desa / Kepala Desa',
  'Pengacara / Advokat',
  'Notaris',
  'Akuntan',
  'Arsitek',
  'Konsultan',
  'Wartawan / Jurnalis',
  'Sopir / Pengemudi',
  'Mekanik / Montir',
  'Tukang Kayu / Mebel',
  'Tukang Bangunan / Batu',
  'Tukang Jahit / Konveksi',
  'Tukang Las / Pandai Besi',
  'Tukang Listrik',
  'Tukang Cukur',
  'Penata Rias / Salon',
  'Seniman / Pengrajin',
  'Pelaut',
  'Pilot',
  'Anggota DPR / DPD / DPRD',
  'Lainnya'
];

export function SantriFormPage({
  santriToEdit = null,
  onBack,
  onSaveSuccess,
  onSaveAndCreateCard
}) {
  const isEdit = Boolean(santriToEdit && santriToEdit.id);

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

  // Master options from database (Admin configurable)
  const [masterOptions, setMasterOptions] = useState({
    jenjang: [
      { value: 'MI', label: 'MI (Madrasah Ibtidaiyyah)' },
      { value: 'MTs', label: 'MTs (Madrasah Tsanawiyyah)' },
      { value: 'MA', label: 'MA (Madrasah Aliyah)' }
    ],
    kelas: [
      { value: 'VII', label: 'VII' },
      { value: 'VIII', label: 'VIII' },
      { value: 'IX', label: 'IX' },
      { value: 'X', label: 'X' },
      { value: 'XI', label: 'XI' },
      { value: 'XII', label: 'XII' }
    ],
    rombel: [
      { value: 'A', label: 'A' },
      { value: 'B', label: 'B' },
      { value: 'C', label: 'C' },
      { value: 'D', label: 'D' },
      { value: 'E', label: 'E' }
    ],
    program: [
      { value: 'Tahfidz', label: "Tahfidz Al-Qur'an" },
      { value: 'Kitab', label: 'Pendalaman Kitab Kuning' }
    ],
    kamar: [
      { value: 'Khadijah 01', label: 'Khadijah 01' },
      { value: 'Khadijah 02', label: 'Khadijah 02' },
      { value: 'Khadijah 03', label: 'Khadijah 03' },
      { value: 'Aisyah 01', label: 'Aisyah 01' },
      { value: 'Aisyah 02', label: 'Aisyah 02' },
      { value: 'Aisyah 03', label: 'Aisyah 03' },
      { value: 'Fathimah 01', label: 'Fathimah 01' },
      { value: 'Fathimah 02', label: 'Fathimah 02' },
      { value: 'Fathimah 03', label: 'Fathimah 03' },
      { value: 'Zainab 01', label: 'Zainab 01' },
      { value: 'Zainab 02', label: 'Zainab 02' },
      { value: 'Hafshah 01', label: 'Hafshah 01' },
      { value: 'Hafshah 02', label: 'Hafshah 02' }
    ]
  });

  useEffect(() => {
    fetch('/api/settings/master-options')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setMasterOptions((prev) => ({
            jenjang: json.data.jenjang?.length ? json.data.jenjang : prev.jenjang,
            kelas: json.data.kelas?.length ? json.data.kelas : prev.kelas,
            rombel: json.data.rombel?.length ? json.data.rombel : prev.rombel,
            program: json.data.program?.length ? json.data.program : prev.program,
            kamar: json.data.kamar?.length ? json.data.kamar : prev.kamar
          }));
        }
      })
      .catch((err) => console.warn('Gagal memuat master-options', err));
  }, []);

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
        tanggal_lahir: santriToEdit.tanggal_lahir ? santriToEdit.tanggal_lahir.split('T')[0] : '',
        jenis_kelamin: santriToEdit.jenis_kelamin || 'P',
        agama: santriToEdit.agama || 'Islam',
        golongan_darah: santriToEdit.golongan_darah || '-',
        alamat_siswa: santriToEdit.alamat_siswa || santriToEdit.alamat || '',
        anak_ke: santriToEdit.anak_ke || 1,
        jumlah_saudara: santriToEdit.jumlah_saudara || 1,
        no_kk: santriToEdit.no_kk || '',

        nama_ayah: santriToEdit.nama_ayah || santriToEdit.wali || '',
        nik_ayah: santriToEdit.nik_ayah || '',
        almarhum_ayah: santriToEdit.almarhum_ayah === 1 ? 1 : 0,
        tempat_lahir_ayah: santriToEdit.tempat_lahir_ayah || '',
        tanggal_lahir_ayah: santriToEdit.tanggal_lahir_ayah ? santriToEdit.tanggal_lahir_ayah.split('T')[0] : '',
        pendidikan_ayah: santriToEdit.pendidikan_ayah || 'SMA / MA',
        pekerjaan_ayah: santriToEdit.pekerjaan_ayah || '',
        penghasilan_ayah: santriToEdit.penghasilan_ayah || '',
        no_telp_ayah: santriToEdit.no_telp_ayah || santriToEdit.no_hp_wali || '',
        alamat_ayah: santriToEdit.alamat_ayah || santriToEdit.alamat || '',

        nama_ibu: santriToEdit.nama_ibu || '',
        nik_ibu: santriToEdit.nik_ibu || '',
        almarhumah_ibu: santriToEdit.almarhumah_ibu === 1 ? 1 : 0,
        tempat_lahir_ibu: santriToEdit.tempat_lahir_ibu || '',
        tanggal_lahir_ibu: santriToEdit.tanggal_lahir_ibu ? santriToEdit.tanggal_lahir_ibu.split('T')[0] : '',
        pendidikan_ibu: santriToEdit.pendidikan_ibu || 'SMA / MA',
        pekerjaan_ibu: santriToEdit.pekerjaan_ibu || 'Ibu Rumah Tangga',
        penghasilan_ibu: santriToEdit.penghasilan_ibu || '-',
        no_telp_ibu: santriToEdit.no_telp_ibu || '',
        alamat_ibu: santriToEdit.alamat_ibu || santriToEdit.alamat || '',

        catatan_medis: santriToEdit.catatan_medis || ''
      });

      if (santriToEdit.foto_path) {
        setPhotoPreview(santriToEdit.foto_path);
      } else {
        setPhotoPreview(null);
      }
    } else {
      setFormData(initialForm);
      setPhotoPreview(null);
      setPhotoFile(null);
    }
  }, [santriToEdit]);

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const copyAddressToAyah = () => {
    setFormData(prev => ({ ...prev, alamat_ayah: prev.alamat_siswa }));
  };

  const copyAddressToIbu = () => {
    setFormData(prev => ({ ...prev, alamat_ibu: prev.alamat_siswa }));
  };

  const handleSubmit = async (andCreateCard = false) => {
    setErrorMsg('');

    // Validasi dasar
    if (!formData.no_induk.trim()) {
      setErrorMsg('No. Induk (NIS) wajib diisi');
      return;
    }
    if (!formData.nama_lengkap.trim()) {
      setErrorMsg('Nama lengkap santri wajib diisi');
      return;
    }

    try {
      setIsSubmitting(true);
      const dataPayload = new FormData();
      Object.keys(formData).forEach(key => {
        dataPayload.append(key, formData[key] !== null ? formData[key] : '');
      });

      // Sinkronisasi alias nama & no induk
      dataPayload.append('nama', formData.nama_lengkap);
      dataPayload.append('nispp', formData.no_induk);
      dataPayload.append('kamar', formData.kamar_asrama);
      dataPayload.append('alamat', formData.alamat_siswa);
      dataPayload.append('wali', formData.nama_ayah || formData.nama_ibu);
      dataPayload.append('no_hp_wali', formData.no_telp_ayah || formData.no_telp_ibu);

      if (photoFile) {
        dataPayload.append('foto', photoFile);
      }

      const url = isEdit ? `/api/santri/${santriToEdit.id}` : '/api/santri';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: dataPayload
      });

      const json = await res.json();
      if (json.success) {
        if (andCreateCard && onSaveAndCreateCard) {
          onSaveAndCreateCard(json.data);
        } else if (onSaveSuccess) {
          onSaveSuccess(json.data);
        }
      } else {
        setErrorMsg(json.message || 'Gagal menyimpan data santri');
      }
    } catch (e) {
      setErrorMsg('Terjadi kesalahan koneksi server: ' + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 pb-20">
      {/* Top Banner Header with Pattern */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#094B44] p-5 sm:p-8 text-white shadow-md border border-white/15">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white transition backdrop-blur-xs cursor-pointer border border-white/20"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#D6F2EE] tracking-tight flex items-center gap-2.5">
              <span>{isEdit ? 'Edit Data Santri' : 'Input Santri Baru'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#EFF6F3]/90 font-normal max-w-2xl">
              Lengkapi data santri sesuai dengan data di akte / KK
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#009688] hover:bg-[#007D71] text-white text-xs font-bold flex items-center gap-2 shadow-xs border border-[#009688] transition cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4 text-white" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Data'}</span>
            </button>
          </div>
        </div>

        {/* Pattern Mandala Watermark */}
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
            <polygon points="100,8 123,77 192,100 123,123 100,192 77,123 8,100 77,77" strokeWidth="0.8" />
          </svg>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      {/* Main Single Sheet Form Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-teal-200/80 shadow-xs overflow-hidden">
        {/* Form Body - 1 Lembar Utuh (Continuous Sheet) */}
        <div className="p-5 sm:p-7 lg:p-9 space-y-9">
          
          {/* ========================================================= */}
          {/* BAGIAN 1: INFORMASI SEKOLAH DAN PESANTREN */}
          {/* ========================================================= */}
          <section className="space-y-5">
            <div className="pb-3 border-b border-teal-200">
              <h3 className="font-bold text-teal-950 text-sm sm:text-base">
                Informasi Sekolah dan Pesantren
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              <div>
                <label className="text-xs font-bold text-teal-950 block mb-1">
                  NISPP <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 202601001"
                  value={formData.no_induk}
                  onChange={(e) => handleChange('no_induk', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-teal-950 block mb-1">
                  NISN
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 0081234501"
                  value={formData.nisn}
                  onChange={(e) => handleChange('nisn', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-teal-950 block mb-1">
                  Jenjang Pendidikan <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.jenjang}
                  onChange={(e) => handleChange('jenjang', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 outline-hidden"
                >
                  <option value="">-- Pilih Jenjang --</option>
                  {masterOptions.jenjang.map((opt) => (
                    <option key={opt.id || opt.value} value={opt.value}>
                      {opt.label || opt.value}
                    </option>
                  ))}
                  {formData.jenjang && !masterOptions.jenjang.some((o) => o.value === formData.jenjang) && (
                    <option value={formData.jenjang}>{formData.jenjang}</option>
                  )}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-teal-950 block mb-1">
                  Kelas <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.kelas}
                  onChange={(e) => handleChange('kelas', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 outline-hidden"
                >
                  <option value="">-- Pilih Kelas --</option>
                  {masterOptions.kelas.map((opt) => (
                    <option key={opt.id || opt.value} value={opt.value}>
                      {opt.label || opt.value}
                    </option>
                  ))}
                  {formData.kelas && !masterOptions.kelas.some((o) => o.value === formData.kelas) && (
                    <option value={formData.kelas}>{formData.kelas}</option>
                  )}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-teal-950 block mb-1">
                  Ruang / Rombel <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.ruang}
                  onChange={(e) => handleChange('ruang', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 outline-hidden"
                >
                  <option value="">-- Pilih Ruang / Rombel --</option>
                  {masterOptions.rombel.map((opt) => (
                    <option key={opt.id || opt.value} value={opt.value}>
                      {opt.label || opt.value}
                    </option>
                  ))}
                  {formData.ruang && !masterOptions.rombel.some((o) => o.value === formData.ruang) && (
                    <option value={formData.ruang}>{formData.ruang}</option>
                  )}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-teal-950 block mb-1">
                  Program <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.program}
                  onChange={(e) => handleChange('program', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 outline-hidden"
                >
                  <option value="">-- Pilih Program --</option>
                  {masterOptions.program.map((opt) => (
                    <option key={opt.id || opt.value} value={opt.value}>
                      {opt.label || opt.value}
                    </option>
                  ))}
                  {formData.program && !masterOptions.program.some((o) => o.value === formData.program) && (
                    <option value={formData.program}>{formData.program}</option>
                  )}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-teal-950 block mb-1">
                  Kamar <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.kamar_asrama}
                  onChange={(e) => handleChange('kamar_asrama', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 outline-hidden"
                >
                  <option value="">-- Pilih Kamar --</option>
                  {masterOptions.kamar.map((opt) => (
                    <option key={opt.id || opt.value} value={opt.value}>
                      {opt.label || opt.value}
                    </option>
                  ))}
                  {formData.kamar_asrama && !masterOptions.kamar.some((o) => o.value === formData.kamar_asrama) && (
                    <option value={formData.kamar_asrama}>{formData.kamar_asrama}</option>
                  )}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-teal-950 block mb-1">
                  Status Santri
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 outline-hidden"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Cuti">Cuti</option>
                  <option value="Mutasi">Mutasi / Pindah</option>
                  <option value="Alumni">Alumni / Lulus</option>
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <label className="text-xs font-bold text-teal-950 block mb-1">
                  Catatan Khusus / Medis
                </label>
                <input
                  type="text"
                  placeholder="Riwayat alergi / asma / penyakit bawaan"
                  value={formData.catatan_medis}
                  onChange={(e) => handleChange('catatan_medis', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 outline-hidden"
                />
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* BAGIAN 2: DATA SANTRI */}
          {/* ========================================================= */}
          <section className="space-y-5 pt-4">
            <div className="pb-3 border-b border-teal-200">
              <h3 className="font-bold text-teal-950 text-sm sm:text-base">
                Data Santri
              </h3>
            </div>

            {/* Foto Profil Upload Section */}
            <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/50 border border-teal-200 flex flex-col sm:flex-row items-center gap-5">
              <div className="w-24 h-32 rounded-xl border-2 border-dashed border-teal-300 bg-white overflow-hidden flex items-center justify-center shrink-0 shadow-xs relative group">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview Foto" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-2 text-slate-400">
                    <User className="w-9 h-9 mx-auto mb-1 text-teal-600/60" />
                    <span className="text-[10px] block leading-tight font-medium text-slate-500">Pasfoto 3×4</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
                <h4 className="text-xs font-bold text-teal-950">Pas Foto</h4>
                <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
                  Unggah foto resmi berseragam pondok dengan format jpg/png/webp maksimal 5mb.
                </p>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <label className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{photoPreview ? 'Ganti Foto' : 'Pilih Foto'}</span>
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  </label>
                  {photoPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoFile(null);
                        setPhotoPreview(null);
                      }}
                      className="px-3 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition cursor-pointer"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-teal-950 block mb-1">
                  Nama Lengkap (Sesuai Ijazah / Akta) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nama lengkap santriwati tanpa singkatan"
                  value={formData.nama_lengkap}
                  onChange={(e) => handleChange('nama_lengkap', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-teal-950 block mb-1">
                  NIK Santri (16 Digit)
                </label>
                <input
                  type="text"
                  maxLength={16}
                  placeholder="331901xxxxxxxxxx"
                  value={formData.nik_santri}
                  onChange={(e) => handleChange('nik_santri', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-teal-950 block mb-1">
                  Tempat Lahir
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Kudus, Pati, Demak"
                  value={formData.tempat_lahir}
                  onChange={(e) => handleChange('tempat_lahir', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-teal-950 block mb-1">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  value={formData.tanggal_lahir}
                  onChange={(e) => handleChange('tanggal_lahir', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-teal-950 block mb-1">
                  Jenis Kelamin
                </label>
                <select
                  value={formData.jenis_kelamin}
                  onChange={(e) => handleChange('jenis_kelamin', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 outline-hidden"
                >
                  <option value="P">Perempuan</option>
                  <option value="L">Laki-laki</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-teal-950 block mb-1">
                  Golongan Darah
                </label>
                <select
                  value={formData.golongan_darah}
                  onChange={(e) => handleChange('golongan_darah', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 outline-hidden"
                >
                  <option value="-">- (Belum Tahu)</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                  <option value="O">O</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-teal-950 block mb-1">
                  No. Kartu Keluarga (KK)
                </label>
                <input
                  type="text"
                  maxLength={16}
                  placeholder="16 digit nomor KK"
                  value={formData.no_kk}
                  onChange={(e) => handleChange('no_kk', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 outline-hidden font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-teal-950 block mb-1">
                    Anak Ke
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.anak_ke}
                    onChange={(e) => handleChange('anak_ke', e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-teal-950 block mb-1">
                    Dari Bersaudara
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.jumlah_saudara}
                    onChange={(e) => handleChange('jumlah_saudara', e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 outline-hidden"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="text-xs font-bold text-teal-950 block mb-1">
                  Alamat Domisili Siswa
                </label>
                <textarea
                  rows={2}
                  placeholder="Desa / Kelurahan, RT / RW, Kecamatan, Kabupaten / Kota, Provinsi"
                  value={formData.alamat_siswa}
                  onChange={(e) => handleChange('alamat_siswa', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden"
                />
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* BAGIAN 3: DATA AYAH KANDUNG */}
          {/* ========================================================= */}
          <section className="space-y-5 pt-4">
            <div className="flex items-center justify-between pb-3 border-b border-teal-200 flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-teal-950 text-sm sm:text-base">
                  Data Ayah Kandung
                </h3>
              </div>

              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  checked={formData.almarhum_ayah === 1}
                  onChange={(e) => handleChange('almarhum_ayah', e.target.checked ? 1 : 0)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span>Ayah Telah Wafat (Almarhum)</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              <div>
                <label className="text-xs font-bold text-teal-950 block mb-1">
                  Nama Ayah
                </label>
                <input
                  type="text"
                  placeholder="Nama lengkap ayah"
                  value={formData.nama_ayah}
                  onChange={(e) => handleChange('nama_ayah', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-teal-950 block mb-1">
                  NIK Ayah
                </label>
                <input
                  type="text"
                  maxLength={16}
                  placeholder="16 digit NIK ayah"
                  value={formData.nik_ayah}
                  onChange={(e) => handleChange('nik_ayah', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-teal-950 block mb-1">
                  No. Telepon / WA
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 081234567890"
                  value={formData.no_telp_ayah}
                  onChange={(e) => handleChange('no_telp_ayah', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-teal-950 block mb-1">
                  Tempat Lahir Ayah
                </label>
                <input
                  type="text"
                  placeholder="Kota kelahiran ayah"
                  value={formData.tempat_lahir_ayah}
                  onChange={(e) => handleChange('tempat_lahir_ayah', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-teal-950 block mb-1">
                  Tanggal Lahir Ayah
                </label>
                <input
                  type="date"
                  value={formData.tanggal_lahir_ayah}
                  onChange={(e) => handleChange('tanggal_lahir_ayah', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-teal-950 block mb-1">
                  Pendidikan Ayah
                </label>
                <select
                  value={formData.pendidikan_ayah}
                  onChange={(e) => handleChange('pendidikan_ayah', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 outline-hidden"
                >
                  <option value="Tidak Sekolah">Tidak Sekolah</option>
                  <option value="SD / MI">SD / MI</option>
                  <option value="SMP / MTs">SMP / MTs</option>
                  <option value="SMA / MA">SMA / MA</option>
                  <option value="Diploma (D1-D3)">Diploma (D1-D3)</option>
                  <option value="S1">Sarjana (S1)</option>
                  <option value="S2">Magister (S2)</option>
                  <option value="S3">Doktor (S3)</option>
                  <option value="Pondok Pesantren">Pondok Pesantren</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-teal-950 block mb-1">
                  Pekerjaan Ayah
                </label>
                <select
                  value={formData.pekerjaan_ayah}
                  onChange={(e) => handleChange('pekerjaan_ayah', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 outline-hidden"
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
                <label className="text-xs font-bold text-teal-950 block mb-1">
                  Penghasilan Per Bulan
                </label>
                <select
                  value={formData.penghasilan_ayah}
                  onChange={(e) => handleChange('penghasilan_ayah', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 outline-hidden"
                >
                  <option value="">Pilih Rentang Penghasilan</option>
                  <option value="< Rp 1.000.000">&lt; Rp 1.000.000</option>
                  <option value="Rp 1.000.000 - Rp 3.000.000">Rp 1.000.000 - Rp 3.000.000</option>
                  <option value="Rp 3.000.000 - Rp 5.000.000">Rp 3.000.000 - Rp 5.000.000</option>
                  <option value="Rp 5.000.000 - Rp 10.000.000">Rp 5.000.000 - Rp 10.000.000</option>
                  <option value="> Rp 10.000.000">&gt; Rp 10.000.000</option>
                  <option value="Tidak Berpenghasilan">Tidak Berpenghasilan</option>
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-teal-950">
                    Alamat Ayah
                  </label>
                  <button
                    type="button"
                    onClick={copyAddressToAyah}
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
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden"
                />
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* BAGIAN 4: DATA IBU KANDUNG */}
          {/* ========================================================= */}
          <section className="space-y-5 pt-4">
            <div className="flex items-center justify-between pb-3 border-b border-teal-200 flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-teal-950 text-sm sm:text-base">
                  Data Ibu Kandung
                </h3>
              </div>

              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  checked={formData.almarhumah_ibu === 1}
                  onChange={(e) => handleChange('almarhumah_ibu', e.target.checked ? 1 : 0)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span>Ibu Telah Wafat (Almarhumah)</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              <div>
                <label className="text-xs font-bold text-teal-950 block mb-1">
                  Nama Ibu
                </label>
                <input
                  type="text"
                  placeholder="Nama lengkap ibu"
                  value={formData.nama_ibu}
                  onChange={(e) => handleChange('nama_ibu', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-teal-950 block mb-1">
                  NIK Ibu
                </label>
                <input
                  type="text"
                  maxLength={16}
                  placeholder="16 digit NIK ibu"
                  value={formData.nik_ibu}
                  onChange={(e) => handleChange('nik_ibu', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-teal-950 block mb-1">
                  No. Telepon / WA
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 081234567890"
                  value={formData.no_telp_ibu}
                  onChange={(e) => handleChange('no_telp_ibu', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-teal-950 block mb-1">
                  Tempat Lahir Ibu
                </label>
                <input
                  type="text"
                  placeholder="Kota kelahiran ibu"
                  value={formData.tempat_lahir_ibu}
                  onChange={(e) => handleChange('tempat_lahir_ibu', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-teal-950 block mb-1">
                  Tanggal Lahir Ibu
                </label>
                <input
                  type="date"
                  value={formData.tanggal_lahir_ibu}
                  onChange={(e) => handleChange('tanggal_lahir_ibu', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-teal-950 block mb-1">
                  Pendidikan Ibu
                </label>
                <select
                  value={formData.pendidikan_ibu}
                  onChange={(e) => handleChange('pendidikan_ibu', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 outline-hidden"
                >
                  <option value="Tidak Sekolah">Tidak Sekolah</option>
                  <option value="SD / MI">SD / MI</option>
                  <option value="SMP / MTs">SMP / MTs</option>
                  <option value="SMA / MA">SMA / MA</option>
                  <option value="Diploma (D1-D3)">Diploma (D1-D3)</option>
                  <option value="S1">Sarjana (S1)</option>
                  <option value="S2">Magister (S2)</option>
                  <option value="S3">Doktor (S3)</option>
                  <option value="Pondok Pesantren">Pondok Pesantren</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-teal-950 block mb-1">
                  Pekerjaan Ibu
                </label>
                <select
                  value={formData.pekerjaan_ibu}
                  onChange={(e) => handleChange('pekerjaan_ibu', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 outline-hidden"
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
                <label className="text-xs font-bold text-teal-950 block mb-1">
                  Penghasilan Per Bulan
                </label>
                <select
                  value={formData.penghasilan_ibu}
                  onChange={(e) => handleChange('penghasilan_ibu', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 outline-hidden"
                >
                  <option value="-">Tidak Berpenghasilan / IRT</option>
                  <option value="< Rp 1.000.000">&lt; Rp 1.000.000</option>
                  <option value="Rp 1.000.000 - Rp 3.000.000">Rp 1.000.000 - Rp 3.000.000</option>
                  <option value="Rp 3.000.000 - Rp 5.000.000">Rp 3.000.000 - Rp 5.000.000</option>
                  <option value="> Rp 5.000.000">&gt; Rp 5.000.000</option>
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-teal-950">
                    Alamat Ibu
                  </label>
                  <button
                    type="button"
                    onClick={copyAddressToIbu}
                    className="text-[11px] text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Sama dengan Alamat Santri</span>
                  </button>
                </div>
                <textarea
                  rows={2}
                  placeholder="Alamat domisili ibu saat ini"
                  value={formData.alamat_ibu}
                  onChange={(e) => handleChange('alamat_ibu', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-teal-200 bg-white text-teal-950 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/25 outline-hidden"
                />
              </div>
            </div>
          </section>

        </div>

        {/* Footer Actions Bar - 1 Lembar Utuh */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-teal-100 flex flex-wrap items-center justify-between gap-3 sticky bottom-0 z-20 backdrop-blur-md bg-slate-50/95">
          <div className="text-xs text-slate-500 font-medium">
            <span>Pastikan seluruh data yang berbintang (<span className="text-rose-500">*</span>) terisi dengan benar.</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 ml-auto flex-wrap justify-end">
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-200/60 transition cursor-pointer"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-[#094B44] hover:bg-[#06332E] text-white shadow-xs transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer border border-[#094B44]"
            >
              <Check className="w-4 h-4 text-[#D6F2EE]" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Data'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-[#009688] hover:bg-[#007D71] text-white shadow-xs transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer border border-[#009688]"
            >
              <CreditCard className="w-4 h-4 text-white" />
              <span>Simpan & Cetak</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SantriFormPage;
