import React, { useState } from 'react';
import { Database, Download, Upload, ShieldCheck, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';

export function BackupRestore({ onRestoreSuccess }) {
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreResult, setRestoreResult] = useState(null);
  const [restoreError, setRestoreError] = useState('');

  const handleDownloadBackup = () => {
    window.location.href = '/api/backup/download';
  };

  const handleRestoreFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!window.confirm('PERINGATAN: Memulihkan database akan menggantikan data dan foto saat ini dengan isi file backup. Apakah anda yakin ingin melanjutkan?')) {
      e.target.value = null;
      return;
    }

    setIsRestoring(true);
    setRestoreResult(null);
    setRestoreError('');

    try {
      const data = new FormData();
      data.append('backupFile', file);

      const res = await fetch('/api/backup/restore', {
        method: 'POST',
        body: data
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Gagal memulihkan backup.');
      }

      setRestoreResult(json.message);
      if (onRestoreSuccess) onRestoreSuccess();
    } catch (error) {
      setRestoreError(error.message);
    } finally {
      setIsRestoring(false);
      e.target.value = null;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-4xl mx-auto">
      {/* Top Header Banner with Solid Deep Teal & Concentric Rings */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#094B44] text-white p-5 sm:p-6 lg:p-7 shadow-md shadow-[#094B44]/25 border border-white/15">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#D6F2EE] tracking-tight">
              Backup & Pemulihan Database
            </h1>
            <p className="text-xs sm:text-sm text-[#EFF6F3]/90 font-normal mt-1">
              Amankan seluruh data santri, arsip foto, konfigurasi desain kartu, dan profil pesantren dalam satu file arsip terkompresi
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Card 1: Download Backup */}
        <div className="bg-white rounded-2xl border border-teal-100 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-teal-100/60 pb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60 flex items-center justify-center font-bold">
              <Download className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <h3 className="font-bold text-teal-900 text-sm">Download Backup Lengkap</h3>
              <p className="text-xs text-slate-400 font-normal">File arsip .ZIP mandiri</p>
            </div>
          </div>

          <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <p className="font-medium text-slate-700">Backup mencakup seluruh aset penting pesantren:</p>
            <ul className="list-disc pl-4 space-y-1 text-slate-500 font-normal">
              <li>File database SQLite (<code className="font-mono text-teal-800 font-semibold">pesantren.db</code>)</li>
              <li>Seluruh pasfoto santri yang tersimpan</li>
              <li>Gambar background kustom Kartu Santri & Mahrom</li>
              <li>Logo resmi dan konfigurasi pesantren</li>
            </ul>
          </div>

          <button
            onClick={handleDownloadBackup}
            className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs border border-amber-300/40 transition"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>Download File Backup Lengkap (.ZIP)</span>
          </button>
        </div>

        {/* Card 2: Restore Database */}
        <div className="bg-white rounded-2xl border border-amber-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-amber-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center justify-center font-bold">
              <Upload className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-teal-900 text-sm">Pulihkan Database (Restore)</h3>
              <p className="text-xs text-slate-400 font-normal">Kembalikan data dari file .ZIP</p>
            </div>
          </div>

          <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-2 text-amber-950 font-normal">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <span>
                <b className="font-semibold text-amber-900">Perhatian:</b> Memulihkan backup akan menggantikan data aktif saat ini. Pastikan file backup berasal dari aplikasi ini.
              </span>
            </div>
          </div>

          {restoreResult && (
            <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>{restoreResult}</span>
            </div>
          )}

          {restoreError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs font-semibold">
              {restoreError}
            </div>
          )}

          <label className="relative w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs border border-[#20E2D7]/50 cursor-pointer transition">
            {isRestoring ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#20E2D7]" />
                <span>Memulihkan Database...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 text-[#20E2D7]" />
                <span>Pilih File Backup (.ZIP) untuk Restore</span>
              </>
            )}
            <input
              type="file"
              accept=".zip"
              disabled={isRestoring}
              onChange={handleRestoreFile}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
