# Generator Kartu Santri & Kartu Mahrom - SIM Pesantren

Aplikasi web profesional berbasis database persisten yang dirancang khusus untuk pondok pesantren dalam mengelola master data santri, menerbitkan kartu identitas santri (KTS), kartu izin kunjungan mahrom (KTM), pencetakan ulang kapan saja, impor Excel cerdas, dan ekspor PDF siap cetak dengan ukuran baku internasional CR80 (85.6 × 54.0 mm).

---

## 🔐 Akun Login & Hak Akses (3 Role)

Aplikasi dilengkapi sistem autentikasi multi-peran untuk menjaga keamanan dan pembagian tugas di pondok pesantren:

| Role / Peran | Username | Password | Hak Akses & Tugas |
| :--- | :--- | :--- | :--- |
| **👑 Administrator** | `admin` | `admin123` | **Akses Penuh**: Beranda, Master Data Santri, Generator Kartu, Layanan Kesehatan, Impor Excel, Pengaturan Desain, Profil Pesantren, Backup & Restore, serta manajemen pengguna. |
| **📋 Tata Usaha (TU)** | `tu` | `tu123` | **Akses Operasional Seperti Admin**: Beranda, Data Santri lengkap (tambah, edit, hapus, impor excel), Generator Kartu, Layanan Kesehatan, dan Desain Kartu. *(Menu Pengaturan & Backup Restore disembunyikan)*. |
| **🏥 Perawat** | `kesehatan` | `sehat123` | **Akses Layanan Kesehatan**: Akses data santri dan pencetakan lembaran kartu rujukan kolektif santri berobat A4 multi-up siap pakai untuk klinik/faskes. |

*(Pada halaman login, tersedia juga **Tombol Akses Cepat (Quick Demo)** untuk beralih role dengan satu klik).*

---

## 🌟 Fitur Utama Aplikasi

### 1. Satu Data Master = Dua Kartu Resmi
- **Kartu Santri (KTS)**: Memuat logo pondok, judul KARTU SANTRI, foto resmi santri, nama lengkap, NISPP, Tempat Tanggal Lahir (TTL), nama wali, alamat asal, QR Code verifikasi, dan tata tertib santri di sisi belakang.
- **Kartu Mahrom (KTM)**: Terhubung langsung dengan santri yang sama, berfokus pada verifikasi wali/mahrom saat sambangan/kunjungan, dilengkapi aturan jam berkunjung di sisi belakang.
- **Sinkronisasi Otomatis**: Jika data santri diperbarui, tampilan kedua kartu otomatis ikut terbarui seketika.

### 2. Kustomisasi Background Kartu Tanpa Batas
- Admin dapat **mengunggah gambar background kustom** hasil desain dari Canva, Photoshop, atau CorelDraw untuk:
  - Kartu Santri (Sisi Depan & Belakang)
  - Kartu Mahrom (Sisi Depan & Belakang)
- Dilengkapi saklar **Tampilkan/Sembunyikan Logo** jika background yang diunggah sudah memuat logo pondok.
- Tersedia tombol reset untuk kembali ke tema bawaan (Islami Hijau Zamrud & Emas Kerajaan).

### 3. Dual-Mode Printing (Cetak Fisik & PDF)
- **Mode A: Printer Khusus ID Card PVC** (Fargo, Zebra, Evolis, Datacard):
  - Cetak 1 kartu per job ukuran persis 85.6 × 54.0 mm tanpa margin kertas biasa.
- **Mode B: Printer Biasa (Lembar A4 Multi-Up)**:
  - Sangat bermanfaat bagi **Tim Kesehatan / Poskestren / UKS** untuk mencetak rujukan berobat beberapa santri sekaligus.
  - Dilengkapi **garis potong (crop marks)** rapi.
- **Ekspor PDF Berkualitas Tinggi**: Hasil render tajam (300 DPI) berbasis vektor/high-res canvas.

### 4. Database Utama Pesantren (Future-Proof Master Data)
- Menyimpan kolom internal yang lengkap: **Kamar/Asrama, Kelas/Jenjang, Jenis Kelamin (L/P), No. WhatsApp Wali, Catatan Medis & Golongan Darah, NIK, No. KK, dan Ibu Kandung**.
- Menjadi fondasi master data terpusat yang siap dihubungkan ke sistem **Perizinan (Izin Keluar/Pulang)** dan **Absensi Shalat/Madrasah** di masa depan.
- **Perlindungan Soft-Delete**: Data tidak hilang permanen tanpa sengaja.

### 5. Impor Excel Cerdas & Pencocokan Foto Massal (ZIP)
- Download template Excel resmi dengan kolom terstandar.
- **Preservasi Angka 0 di Depan NISPP** (misal: `002401001` tidak akan terpotong).
- Pratinjau validasi data sebelum disimpan: mendeteksi baris valid, baris salah, dan duplikasi.
- Pilihan penanganan duplikat: lewati data lama atau perbarui dengan data baru.
- **Upload File ZIP Foto**: Sistem otomatis mencocokkan nama file foto (contoh: `002401001.jpg`) langsung ke santri ber-NISPP tersebut.

### 6. Backup & Restore Lengkap Satu Klik
- Download arsip `.ZIP` lengkap yang berisi file database SQLite (`pesantren.db`), seluruh pasfoto santri, gambar background kustom, logo, dan manifest metadata.
- Fitur restore aman dengan validasi integritas file.

---

## 🚀 Panduan Menjalankan Aplikasi

### Cara 1: Sekali Klik di Windows (Paling Mudah)
Cukup klik ganda pada file:
```
JALANKAN_APLIKASI.bat
```
Server akan aktif dan browser otomatis membuka halaman `http://localhost:5000/`.

### Cara 2: Menjalankan via Terminal / Command Prompt
```bash
# Jalankan server aplikasi
npm start
```
Aplikasi dapat dibuka di browser pada alamat:
- **Komputer Lokal**: [http://localhost:5000/](http://localhost:5000/)
- **Multi-Komputer / Jaringan Wi-Fi Pesantren**: `http://<IP-KOMPUTER-SERVER>:5000/`

---

## 🌐 Cara Akses dari Komputer Lain (Multi-Komputer LAN / Wi-Fi)

Agar panitia PSB, petugas TU, kepala asrama, dan tim kesehatan dapat mengakses aplikasi secara bersamaan dari komputer/laptop masing-masing:

1. Pastikan semua komputer terhubung ke jaringan Wi-Fi atau kabel LAN yang sama di kantor pesantren.
2. Di komputer server (komputer utama tempat aplikasi terpasang), buka terminal/command prompt dan ketik:
   ```cmd
   ipconfig
   ```
   Cari baris **IPv4 Address** (contoh: `192.168.1.50`).
3. Dari laptop atau komputer staf lain, buka browser (Chrome, Edge, Firefox) dan ketik:
   ```
   http://192.168.1.50:5000/
   ```
4. Semua data yang diinput oleh staf mana pun langsung tersimpan di satu database pusat secara serentak.

---

## 📂 Struktur File Proyek

```
Kartu Santri/
├── server/
│   ├── db.js                 # Database SQLite, skema tabel, indexing, seed
│   ├── index.js              # Server Express.js, routing API, static file server
│   ├── routes/
│   │   ├── santri.js         # API CRUD santri, pencarian instan, filter, stats
│   │   ├── excel.js          # Impor Excel, template download, validasi baris
│   │   ├── settings.js       # Pengaturan profil pesantren & upload background
│   │   ├── photos.js         # Pencocokan foto massal berbasis file ZIP & NISPP
│   │   └── backup.js         # Backup dan restore database lengkap (.zip)
│   ├── data/
│   │   └── pesantren.db      # File database SQLite persisten
│   └── uploads/              # Folder penyimpanan persisten (foto, background, logo)
├── client/                   # Frontend modern React + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── CardSantri.jsx      # Komponen Kartu Santri (Depan & Belakang)
│   │   │   ├── CardMahrom.jsx      # Komponen Kartu Mahrom (Depan & Belakang)
│   │   │   ├── PrintModal.jsx      # Modal cetak PVC 1-by-1 & lembaran A4 PDF
│   │   │   ├── SantriFormModal.jsx # Form input/edit santri lengkap
│   │   │   ├── SantriDetailModal.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Navbar.jsx
│   │   └── pages/
│   │       ├── Dashboard.jsx
│   │       ├── DataSantri.jsx
│   │       ├── GeneratorKartu.jsx
│   │       ├── ImportExcel.jsx
│   │       ├── Pengaturan.jsx          # Pusat Pengaturan: Profil Pesantren, Data Akun, Sistem
│   │       ├── PengaturanDesain.jsx
│   │       ├── PengaturanPesantren.jsx
│   │       └── BackupRestore.jsx
│   └── dist/                 # Bundle produksi siap saji
├── JALANKAN_APLIKASI.bat     # Shortcut sekali klik Windows
└── package.json
```
