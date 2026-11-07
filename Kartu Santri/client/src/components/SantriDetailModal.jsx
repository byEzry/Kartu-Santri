import React, { useState } from 'react';
import { CardSantri, formatTTL } from './CardSantri';
import { CardMahrom } from './CardMahrom';
import {
  X,
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
  FileText
} from 'lucide-react';

export function SantriDetailModal({
  isOpen,
  onClose,
  santri,
  pesantren,
  template,
  onEdit,
  onPrint
}) {
  if (!isOpen || !santri) return null;

  const [activeCardTab, setActiveCardTab] = useState('santri'); // 'santri' | 'mahrom'
  const [cardSide, setCardSide] = useState('front'); // 'front' | 'back'
  const [detailTab, setDetailTab] = useState('akademik'); // 'akademik' | 'biodata' | 'orangtua'

  const namaDisplay = santri.nama_lengkap || santri.nama;
  const noIndukDisplay = santri.no_induk || santri.nispp;
  const kamarDisplay = santri.kamar_asrama || santri.kamar;
  const alamatDisplay = santri.alamat_siswa || santri.alamat;
  const ayahDisplay = santri.nama_ayah || santri.wali;
  const ibuDisplay = santri.nama_ibu || santri.ibu_kandung;
  const telpAyahDisplay = santri.no_telp_ayah || santri.no_hp_wali;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl overflow-hidden flex flex-col max-h-[96vh] sm:max-h-[92vh] animate-in fade-in duration-200">
        {/* Header */}
        <div className="px-3.5 sm:px-5 py-3 sm:py-3.5 border-b border-[#B6E5DE] flex items-center justify-between bg-[#E2F1ED]">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-600 text-amber-300 flex items-center justify-center font-bold text-sm sm:text-base shadow-xs shrink-0 overflow-hidden">
              {santri.foto_path ? (
                <img src={santri.foto_path} alt={namaDisplay} className="w-full h-full object-cover" />
              ) : (
                namaDisplay.charAt(0)
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-teal-950 text-sm sm:text-base leading-tight truncate">{namaDisplay}</h3>
              <p className="text-[11px] sm:text-xs text-slate-500 font-mono truncate">
                No. Induk: <span className="text-teal-700 font-semibold">{noIndukDisplay}</span>
                {santri.nisn ? <span> • NISN: <span className="text-teal-700 font-semibold">{santri.nisn}</span></span> : null}
                <span> • Status: <span className="font-semibold text-teal-600">{santri.status || 'Aktif'}</span></span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content: 2-Columns */}
        <div className="p-3.5 sm:p-5 overflow-y-auto space-y-4 sm:space-y-5 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5">
            {/* Left: Complete Master Record Dossier */}
            <div className="lg:col-span-6 flex flex-col space-y-3">
              {/* Sub-tab Navigation */}
              <div className="flex border-b border-teal-100 bg-slate-50 rounded-xl p-1 gap-1 text-xs font-bold select-none">
                <button
                  type="button"
                  onClick={() => setDetailTab('akademik')}
                  className={`flex-1 py-1.5 rounded-lg transition text-center cursor-pointer ${
                    detailTab === 'akademik' ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Akademik & Asrama
                </button>
                <button
                  type="button"
                  onClick={() => setDetailTab('biodata')}
                  className={`flex-1 py-1.5 rounded-lg transition text-center cursor-pointer ${
                    detailTab === 'biodata' ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Biodata Diri
                </button>
                <button
                  type="button"
                  onClick={() => setDetailTab('orangtua')}
                  className={`flex-1 py-1.5 rounded-lg transition text-center cursor-pointer ${
                    detailTab === 'orangtua' ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Data Orang Tua
                </button>
              </div>

              {/* Sub-tab: Akademik & Asrama */}
              {detailTab === 'akademik' && (
                <div className="bg-slate-50/80 rounded-xl p-4 border border-teal-100 space-y-3 text-xs animate-in fade-in duration-150">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block uppercase">Jenjang</span>
                      <span className="font-bold text-teal-900">{santri.jenjang || 'MTs'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block uppercase">Kelas & Ruang</span>
                      <span className="font-bold text-teal-900">
                        Kelas {santri.kelas || '-'} {santri.ruang ? `(Ruang ${santri.ruang})` : ''}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block uppercase">Program</span>
                      <span className="inline-block px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold text-[10px]">
                        {santri.program || 'Tahfidz'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block uppercase">Kamar Asrama</span>
                      <span className="font-bold text-teal-900">{kamarDisplay || '-'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block uppercase">No. Induk</span>
                      <span className="font-mono font-bold text-teal-800">{noIndukDisplay}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block uppercase">NISN</span>
                      <span className="font-mono font-bold text-slate-700">{santri.nisn || '-'}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[10px] text-slate-500 font-semibold block uppercase">Catatan Medis / Khusus</span>
                      <span className="font-medium text-rose-700">
                        {santri.catatan_medis || 'Tidak ada riwayat alergi / penyakit khusus.'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab: Biodata Diri */}
              {detailTab === 'biodata' && (
                <div className="bg-slate-50/80 rounded-xl p-4 border border-teal-100 space-y-3 text-xs animate-in fade-in duration-150">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <span className="text-[10px] text-slate-500 font-semibold block uppercase">Nama Lengkap</span>
                      <span className="font-bold text-teal-950 text-sm">{namaDisplay}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block uppercase">NIK Santri</span>
                      <span className="font-mono font-semibold text-slate-800">{santri.nik_santri || santri.nik || '-'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block uppercase">No. Kartu Keluarga</span>
                      <span className="font-mono font-semibold text-slate-800">{santri.no_kk || santri.kartu_keluarga || '-'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block uppercase">Tempat, Tanggal Lahir</span>
                      <span className="font-medium text-slate-800">{formatTTL(santri.tempat_lahir, santri.tanggal_lahir)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block uppercase">Jenis Kelamin</span>
                      <span className="font-medium text-slate-800">{santri.jenis_kelamin === 'P' ? 'Perempuan (Santriwati)' : 'Laki-Laki'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block uppercase">Agama</span>
                      <span className="font-medium text-slate-800">{santri.agama || 'Islam'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block uppercase">Golongan Darah</span>
                      <span className="font-bold text-rose-600">{santri.golongan_darah || '-'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block uppercase">Anak ke- / Jumlah Saudara</span>
                      <span className="font-medium text-slate-800">Anak ke-{santri.anak_ke || 1} dari {santri.jumlah_saudara || 1} bersaudara</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[10px] text-slate-500 font-semibold block uppercase">Alamat Siswa (Asal)</span>
                      <span className="font-medium text-slate-800">{alamatDisplay || '-'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab: Data Orang Tua */}
              {detailTab === 'orangtua' && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  {/* Ayah */}
                  <div className="bg-amber-50/50 rounded-xl p-3.5 border border-amber-200/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-amber-200/60 pb-1.5">
                      <span className="font-bold text-amber-950 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-amber-700" />
                        <span>Data Ayah Kandung</span>
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${santri.almarhum_ayah === 1 ? 'bg-slate-200 text-slate-700' : 'bg-emerald-100 text-emerald-800'}`}>
                        {santri.almarhum_ayah === 1 ? 'Almarhum' : 'Masih Hidup'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-[9px] text-slate-500 font-semibold block uppercase">Nama Ayah</span>
                        <span className="font-bold text-slate-900">{ayahDisplay || '-'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 font-semibold block uppercase">No. Telp / WA</span>
                        <span className="font-medium text-teal-800">{telpAyahDisplay || '-'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 font-semibold block uppercase">NIK Ayah</span>
                        <span className="font-mono text-slate-700">{santri.nik_ayah || '-'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 font-semibold block uppercase">Pendidikan / Pekerjaan</span>
                        <span className="font-medium text-slate-800">{santri.pendidikan_ayah || '-'} / {santri.pekerjaan_ayah || '-'}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[9px] text-slate-500 font-semibold block uppercase">Alamat Ayah</span>
                        <span className="font-medium text-slate-700">{santri.alamat_ayah || alamatDisplay || '-'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Ibu */}
                  <div className="bg-rose-50/40 rounded-xl p-3.5 border border-rose-200/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-rose-200/60 pb-1.5">
                      <span className="font-bold text-rose-950 flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-rose-600" />
                        <span>Data Ibu Kandung</span>
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${santri.almarhumah_ibu === 1 ? 'bg-slate-200 text-slate-700' : 'bg-emerald-100 text-emerald-800'}`}>
                        {santri.almarhumah_ibu === 1 ? 'Almarhumah' : 'Masih Hidup'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-[9px] text-slate-500 font-semibold block uppercase">Nama Ibu</span>
                        <span className="font-bold text-slate-900">{ibuDisplay || '-'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 font-semibold block uppercase">No. Telp / WA</span>
                        <span className="font-medium text-teal-800">{santri.no_telp_ibu || '-'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 font-semibold block uppercase">NIK Ibu</span>
                        <span className="font-mono text-slate-700">{santri.nik_ibu || '-'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 font-semibold block uppercase">Pendidikan / Pekerjaan</span>
                        <span className="font-medium text-slate-800">{santri.pendidikan_ibu || '-'} / {santri.pekerjaan_ibu || '-'}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[9px] text-slate-500 font-semibold block uppercase">Alamat Ibu</span>
                        <span className="font-medium text-slate-700">{santri.alamat_ibu || santri.alamat_ayah || alamatDisplay || '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Live Card Preview Studio */}
            <div className="lg:col-span-6 flex flex-col items-center justify-between bg-slate-100 rounded-2xl p-4 border border-slate-200">
              <div className="w-full flex items-center justify-between mb-3">
                <div className="flex bg-white rounded-xl p-1 border border-slate-200 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setActiveCardTab('santri')}
                    className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                      activeCardTab === 'santri' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Kartu Santri
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCardTab('mahrom')}
                    className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                      activeCardTab === 'mahrom' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Kartu Mahrom
                  </button>
                </div>

                <div className="flex bg-white rounded-xl p-1 border border-slate-200 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setCardSide('front')}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                      cardSide === 'front' ? 'bg-teal-700 text-white' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Depan
                  </button>
                  <button
                    type="button"
                    onClick={() => setCardSide('back')}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                      cardSide === 'back' ? 'bg-teal-700 text-white' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Belakang
                  </button>
                </div>
              </div>

              {/* Preview Canvas with responsive scaling */}
              <div className="my-auto py-2 flex items-center justify-center w-full overflow-x-auto no-scrollbar">
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

              {/* Action Buttons for Card */}
              <div className="w-full flex items-center justify-between pt-3 border-t border-slate-200 mt-2">
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                  Standar PVC CR80 (85.6 × 54 mm)
                </span>
                <button
                  type="button"
                  onClick={() => onPrint && onPrint(santri, activeCardTab === 'santri' ? 'Santri' : 'Mahrom')}
                  className="px-3 sm:px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak {activeCardTab === 'santri' ? 'Kartu Santri' : 'Kartu Mahrom'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-3.5 sm:px-5 py-3 bg-slate-50 border-t border-teal-100 flex flex-wrap items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 sm:px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-200 transition cursor-pointer"
          >
            Tutup
          </button>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit && onEdit(santri);
              }}
              className="px-3 sm:px-3.5 py-2 text-xs font-bold rounded-xl border border-teal-300 text-teal-800 bg-white hover:bg-teal-50 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5 text-teal-600" />
              <span>Edit Biodata</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onPrint && onPrint(santri, 'Keduanya');
              }}
              className="px-3.5 sm:px-4 py-2 text-xs font-bold rounded-xl bg-[#009688] hover:bg-[#007D71] text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer border border-[#009688]"
            >
              <Printer className="w-3.5 h-3.5 text-white" />
              <span>Cetak Kedua Kartu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
