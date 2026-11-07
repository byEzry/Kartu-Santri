import React, { useState } from 'react';
import { CardSantri, formatTTL } from '../components/CardSantri';
import { CardMahrom } from '../components/CardMahrom';
import {
  ArrowLeft,
  Printer,
  Edit,
  User,
  Phone,
  Home,
  BookOpen,
  Users,
  Heart,
  CreditCard,
  Building2,
  Calendar,
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export function SantriDetailPage({
  santri,
  pesantren,
  template,
  onBack,
  onEdit,
  onPrint
}) {
  if (!santri) return null;

  const [activeCardTab, setActiveCardTab] = useState('santri'); // 'santri' | 'mahrom'
  const [cardSide, setCardSide] = useState('front'); // 'front' | 'back'

  const namaDisplay = santri.nama_lengkap || santri.nama;
  const noIndukDisplay = santri.no_induk || santri.nispp;
  const kamarDisplay = santri.kamar_asrama || santri.kamar;
  const alamatDisplay = santri.alamat_siswa || santri.alamat;
  const ayahDisplay = santri.nama_ayah || santri.wali;
  const ibuDisplay = santri.nama_ibu || santri.ibu_kandung;
  const telpAyahDisplay = santri.no_telp_ayah || santri.no_hp_wali;
  const rawKelas = (santri.kelas || '')
    .replace(/^Kelas\s+/i, '')
    .replace(/\s+(MTs|MA|MI)$/i, '')
    .trim();
  const cleanRuang = (santri.ruang || '').replace(/^Ruang\s+/i, '').trim();
  let kelasRuangDisplay = rawKelas;
  if (cleanRuang && !rawKelas.toLowerCase().endsWith(cleanRuang.toLowerCase())) {
    kelasRuangDisplay = `${rawKelas} ${cleanRuang}`;
  }
  kelasRuangDisplay = kelasRuangDisplay.replace('-', ' ').trim() || '-';

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-150 pb-16">
      {/* Top Header Banner with Back Button & Student Info */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#094B44] text-white p-5 sm:p-6 lg:p-7 shadow-md shadow-[#094B44]/25 border border-white/15">
        <div className="relative z-10 space-y-4">
          <div>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-xs transition cursor-pointer border border-white/20"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </button>
          </div>

          <div className="flex items-center gap-4 sm:gap-5 pt-2">
            <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl bg-white/15 border-2 border-[#B6E5DE]/50 shadow-md flex items-center justify-center font-bold text-xl sm:text-2xl text-[#D6F2EE] shrink-0 overflow-hidden backdrop-blur-xs">
              {santri.foto_path ? (
                <img src={santri.foto_path} alt={namaDisplay} className="w-full h-full object-cover" />
              ) : (
                <User className="w-9 h-9 text-[#D6F2EE]" />
              )}
            </div>

            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight truncate">
                {namaDisplay}
              </h1>
            </div>
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

      {/* Main Grid: Left side Full Dossier, Right side Live Card Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Complete Master Record Dossier - 1 Halaman Penuh Mengalir Ke Bawah (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl border border-teal-200/80 shadow-xs p-5 sm:p-7 space-y-6">
          <div className="flex items-center justify-between border-b border-teal-100 pb-3">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-teal-950">
                Detail Data Santri
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onEdit && onEdit(santri)}
              className="px-4 py-2 rounded-xl bg-[#009688] hover:bg-[#007D71] text-white text-xs font-bold shadow-xs border border-[#009688] transition cursor-pointer"
            >
              <span>Edit Data</span>
            </button>
          </div>
          
          {/* ========================================================= */}
          {/* 1. AKADEMIK & ASRAMA */}
          {/* ========================================================= */}
          <section className="space-y-3">
            <div className="pb-2.5 border-b border-teal-200">
              <h3 className="font-bold text-teal-950 text-sm sm:text-base">
                Informasi Sekolah dan Pesantren
              </h3>
            </div>

            <div className="bg-teal-50/30 rounded-2xl p-4 sm:p-5 border border-teal-100/80">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">Jenjang Pendidikan</span>
                  <span className="font-normal text-slate-800 text-sm block mt-0.5">{santri.jenjang || 'MTs'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">Kelas</span>
                  <span className="font-normal text-slate-800 text-sm block mt-0.5">
                    {kelasRuangDisplay}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">Program</span>
                  <span className="font-normal text-slate-800 text-sm block mt-0.5">
                    {santri.program || 'Tahfidz'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">Status Santri</span>
                  <span className="font-normal text-slate-800 text-sm block mt-0.5">
                    {santri.status || 'Aktif'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">Kamar</span>
                  <span className="font-normal text-slate-800 text-sm block mt-0.5">{kamarDisplay || '-'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">NISPP</span>
                  <span className="font-normal text-slate-800 text-sm block mt-0.5">{noIndukDisplay}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">NISN</span>
                  <span className="font-normal text-slate-800 text-sm block mt-0.5">{santri.nisn || '-'}</span>
                </div>
                <div className="sm:col-span-2 pt-2 border-t border-slate-200/60">
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">Catatan Khusus / Medis</span>
                  <span className="font-normal text-slate-800 text-sm block mt-0.5">
                    {santri.catatan_medis || 'Tidak ada riwayat alergi / penyakit khusus tercatat.'}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* 2. BIODATA SANTRI */}
          {/* ========================================================= */}
          <section className="space-y-3 pt-2">
            <div className="pb-2.5 border-b border-teal-200">
              <h3 className="font-bold text-teal-950 text-sm sm:text-base">
                Data Santri
              </h3>
            </div>

            <div className="bg-teal-50/30 rounded-2xl p-4 sm:p-5 border border-teal-100/80">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">Nama Lengkap</span>
                  <span className="font-normal text-slate-800 text-sm block mt-0.5">{namaDisplay}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">NIK Santri</span>
                  <span className="font-normal text-slate-800 text-sm block mt-0.5">{santri.nik_santri || santri.nik || '-'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">No. Kartu Keluarga</span>
                  <span className="font-normal text-slate-800 text-sm block mt-0.5">{santri.no_kk || santri.kartu_keluarga || '-'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">Tempat, Tanggal Lahir</span>
                  <span className="font-normal text-slate-800 text-sm block mt-0.5">{formatTTL(santri.tempat_lahir, santri.tanggal_lahir)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">Jenis Kelamin</span>
                  <span className="font-normal text-slate-800 text-sm block mt-0.5">{santri.jenis_kelamin === 'P' || santri.jenis_kelamin === 'Perempuan' ? 'Perempuan' : 'Laki-Laki'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">Agama</span>
                  <span className="font-normal text-slate-800 text-sm block mt-0.5">{santri.agama || 'Islam'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">Golongan Darah</span>
                  <span className="font-normal text-slate-800 text-sm block mt-0.5">{santri.golongan_darah || '-'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">Anak Ke</span>
                  <span className="font-normal text-slate-800 text-sm block mt-0.5">{santri.anak_ke || 1}</span>
                </div>
                <div className="sm:col-span-2 pt-2 border-t border-slate-200/60">
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">Alamat Domisili Siswa</span>
                  <span className="font-normal text-slate-800 text-sm block mt-0.5 leading-relaxed">{alamatDisplay || '-'}</span>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* 3. DATA ORANG TUA */}
          {/* ========================================================= */}
          <section className="space-y-4 pt-2">
            <div className="pb-2.5 border-b border-teal-200">
              <h3 className="font-bold text-teal-950 text-sm sm:text-base">
                Data Orang Tua / Wali
              </h3>
            </div>

            {/* Ayah */}
            <div className="bg-teal-50/30 rounded-2xl p-4 sm:p-5 border border-teal-100/80 space-y-3">
              <div className="border-b border-teal-100/80 pb-2">
                <h4 className="font-bold text-teal-950 text-sm">
                  Data Ayah Kandung
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">Nama Ayah</span>
                  <span className="font-normal text-slate-800 text-sm block mt-0.5">{ayahDisplay || '-'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">Status Ayah</span>
                  <span className="font-normal text-slate-800 text-sm block mt-0.5">{santri.almarhum_ayah === 1 ? 'Almarhum' : 'Masih Hidup'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">No. Telepon / WA</span>
                  <span className="font-normal text-slate-800 text-sm block mt-0.5">{telpAyahDisplay || '-'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">NIK Ayah</span>
                  <span className="font-normal text-slate-800 text-sm block mt-0.5">{santri.nik_ayah || '-'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">Pendidikan Ayah</span>
                  <span className="font-normal text-slate-800 text-sm block mt-0.5">{santri.pendidikan_ayah || '-'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">Pekerjaan Ayah</span>
                  <span className="font-normal text-slate-800 text-sm block mt-0.5">{santri.pekerjaan_ayah || '-'}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">Alamat Ayah</span>
                  <span className="font-normal text-slate-800 text-sm block mt-0.5">{santri.alamat_ayah || alamatDisplay || '-'}</span>
                </div>
              </div>
            </div>

            {/* Ibu */}
            <div className="bg-teal-50/30 rounded-2xl p-4 sm:p-5 border border-teal-100/80 space-y-3">
              <div className="border-b border-teal-100/80 pb-2">
                <h4 className="font-bold text-teal-950 text-sm">
                  Data Ibu Kandung
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">Nama Ibu</span>
                  <span className="font-normal text-slate-800 text-sm block mt-0.5">{ibuDisplay || '-'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">Status Ibu</span>
                  <span className="font-normal text-slate-800 text-sm block mt-0.5">{santri.almarhumah_ibu === 1 ? 'Almarhumah' : 'Masih Hidup'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">No. Telepon / WA</span>
                  <span className="font-normal text-slate-800 text-sm block mt-0.5">{santri.no_telp_ibu || '-'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">NIK Ibu</span>
                  <span className="font-normal text-slate-800 text-sm block mt-0.5">{santri.nik_ibu || '-'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">Pendidikan Ibu</span>
                  <span className="font-normal text-slate-800 text-sm block mt-0.5">{santri.pendidikan_ibu || '-'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">Pekerjaan Ibu</span>
                  <span className="font-normal text-slate-800 text-sm block mt-0.5">{santri.pekerjaan_ibu || '-'}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">Alamat Ibu</span>
                  <span className="font-normal text-slate-800 text-sm block mt-0.5">{santri.alamat_ibu || alamatDisplay || '-'}</span>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* RIGHT: Live Card Preview Studio (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-teal-200/80 shadow-xs p-5 space-y-4 sticky top-6">
            <div className="flex items-center justify-between border-b border-teal-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-teal-950">
                  Pratinjau Kartu
                </h3>
              </div>

              <button
                type="button"
                onClick={() => onPrint && onPrint([santri], activeCardTab === 'santri' ? 'Santri' : 'Mahrom')}
                className="px-4 py-2 rounded-xl bg-[#009688] hover:bg-[#007D71] text-white text-xs font-bold shadow-xs border border-[#009688] transition cursor-pointer"
              >
                <span>Cetak Kartu</span>
              </button>
            </div>

            {/* Switch Kartu Santri / Kartu Mahrom */}
            <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold gap-1">
              <button
                type="button"
                onClick={() => setActiveCardTab('santri')}
                className={`flex-1 py-1.5 rounded-lg transition text-center cursor-pointer ${
                  activeCardTab === 'santri'
                    ? 'bg-white text-teal-950 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Kartu Santri
              </button>
              <button
                type="button"
                onClick={() => setActiveCardTab('mahrom')}
                className={`flex-1 py-1.5 rounded-lg transition text-center cursor-pointer ${
                  activeCardTab === 'mahrom'
                    ? 'bg-white text-teal-950 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Kartu Mahrom
              </button>
            </div>

            {/* Switch Front / Back */}
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => setCardSide('front')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  cardSide === 'front'
                    ? 'bg-teal-100 text-teal-900 font-bold border border-teal-300'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Sisi Depan
              </button>
              <button
                type="button"
                onClick={() => setCardSide('back')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  cardSide === 'back'
                    ? 'bg-teal-100 text-teal-900 font-bold border border-teal-300'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Sisi Belakang
              </button>
            </div>

            {/* Card Render Container with Responsive Scaling */}
            <div className="flex items-center justify-center p-2 sm:p-4 bg-slate-900/5 rounded-2xl border border-dashed border-teal-200 min-h-[220px] overflow-hidden">
              <div className="card-scale-box">
                {activeCardTab === 'santri' ? (
                  <CardSantri
                    santri={santri}
                    pesantren={pesantren}
                    template={template}
                    side={cardSide}
                  />
                ) : (
                  <CardMahrom
                    santri={santri}
                    pesantren={pesantren}
                    template={template}
                    side={cardSide}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SantriDetailPage;
