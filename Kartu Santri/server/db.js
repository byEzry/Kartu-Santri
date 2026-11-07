const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const Database = require('better-sqlite3');
const fs = require('fs');


// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Ensure upload directories exist
const uploadsDir = path.join(__dirname, 'uploads');
const photosDir = path.join(uploadsDir, 'photos');
const backgroundsDir = path.join(uploadsDir, 'backgrounds');
const logosDir = path.join(uploadsDir, 'logos');

[uploadsDir, photosDir, backgroundsDir, logosDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const dbPath = path.join(dataDir, 'pesantren.db');
const db = new Database(dbPath);

// Enable WAL mode for high performance concurrency
db.pragma('journal_mode = WAL');

// Initialize tables
db.exec(`
  -- Master data santri (Master Database Pesantren Qudsiyyah Putri)
  CREATE TABLE IF NOT EXISTS santri (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    no_induk TEXT UNIQUE,
    nisn TEXT,
    nama_lengkap TEXT NOT NULL,
    jenjang TEXT DEFAULT 'MTs', -- 'MI' | 'MTs' | 'MA'
    kelas TEXT,
    ruang TEXT,
    program TEXT DEFAULT 'Tahfidz', -- 'Tahfidz' | 'Kitab'
    kamar_asrama TEXT,
    nik_santri TEXT,
    tempat_lahir TEXT,
    tanggal_lahir TEXT,
    jenis_kelamin TEXT DEFAULT 'P',
    agama TEXT DEFAULT 'Islam',
    golongan_darah TEXT DEFAULT '-',
    alamat_siswa TEXT,
    anak_ke INTEGER DEFAULT 1,
    jumlah_saudara INTEGER DEFAULT 1,
    no_kk TEXT,
    foto_path TEXT,

    -- Data Ayah
    nama_ayah TEXT,
    nik_ayah TEXT,
    almarhum_ayah INTEGER DEFAULT 0, -- 0: Hidup, 1: Almarhum
    tempat_lahir_ayah TEXT,
    tanggal_lahir_ayah TEXT,
    pendidikan_ayah TEXT,
    pekerjaan_ayah TEXT,
    penghasilan_ayah TEXT,
    no_telp_ayah TEXT,
    alamat_ayah TEXT,

    -- Data Ibu
    nama_ibu TEXT,
    nik_ibu TEXT,
    almarhumah_ibu INTEGER DEFAULT 0, -- 0: Hidup, 1: Almarhumah
    tempat_lahir_ibu TEXT,
    tanggal_lahir_ibu TEXT,
    pendidikan_ibu TEXT,
    pekerjaan_ibu TEXT,
    penghasilan_ibu TEXT,
    no_telp_ibu TEXT,
    alamat_ibu TEXT,

    -- Legacy & Compatibility columns
    nispp TEXT,
    nama TEXT,
    kamar TEXT,
    wali TEXT,
    alamat TEXT,
    no_hp_wali TEXT,
    catatan_medis TEXT,
    kartu_keluarga TEXT,
    ibu_kandung TEXT,
    nik TEXT,

    status TEXT DEFAULT 'Aktif',
    is_deleted INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Pengaturan Pesantren
  CREATE TABLE IF NOT EXISTS pengaturan_pesantren (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    nama_pesantren TEXT DEFAULT 'Pondok Pesantren Qudsiyyah Putri',
    alamat_pesantren TEXT DEFAULT 'Jl. KHR. Asnawi No. 22, Damaran, Kota Kudus, Jawa Tengah',
    kontak TEXT DEFAULT 'Telp: (0291) 431234 | WA: 0812-3456-7890',
    website TEXT DEFAULT 'www.qudsiyyahputri.sch.id',
    email TEXT DEFAULT 'sekretariat@qudsiyyahputri.sch.id',
    logo_path TEXT DEFAULT '/uploads/logos/logo-qudsiyyah.png',
    nama_pengasuh TEXT DEFAULT 'Pengasuh Pondok Pesantren',
    sebutan_pengasuh TEXT DEFAULT 'Pengasuh Pondok Pesantren',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Template & Desain Kartu
  CREATE TABLE IF NOT EXISTS template_kartu (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    theme TEXT DEFAULT 'emerald',
    card_width_mm REAL DEFAULT 85.6,
    card_height_mm REAL DEFAULT 54.0,
    bg_santri_front TEXT,
    bg_santri_back TEXT,
    bg_mahrom_front TEXT,
    bg_mahrom_back TEXT,
    show_logo_santri INTEGER DEFAULT 1,
    show_logo_mahrom INTEGER DEFAULT 1,
    text_color_santri TEXT DEFAULT '#0f291e',
    text_color_mahrom TEXT DEFAULT '#2c1808',
    accent_color_santri TEXT DEFAULT '#10b981',
    accent_color_mahrom TEXT DEFAULT '#d97706',
    qr_position TEXT DEFAULT 'bottom-right',
    ketentuan_mahrom TEXT DEFAULT '1. Kartu ini wajib dibawa saat berkunjung/sambangan santri.\n2. Hanya mahrom sah yang diizinkan memasuki kawasan asrama.\n3. Waktu berkunjung: Hari Ahad, Pukul 08.00 - 17.00 WIB.\n4. Kartu ini milik pesantren, jika menemukan harap menghubungi sekretariat.',
    tata_tertib_santri TEXT DEFAULT '1. Berakhlakul karimah dan patuh terhadap tata tertib pondok.\n2. Wajib membawa kartu ini saat perizinan keluar atau ujian resmi.\n3. Kartu ini sah bila ditandatangani oleh Pengasuh Pesantren.',
    keterangan_santri TEXT DEFAULT 'Berlaku selama menjadi santri\nPondok Pesantren Qudsiyyah Putri',
    keterangan_mahrom TEXT DEFAULT 'Kartu ini mohon dibawa\nSaat sambangan / menjemput santri',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Riwayat Cetak Kartu
  CREATE TABLE IF NOT EXISTS riwayat_cetak (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    santri_id INTEGER,
    jenis_kartu TEXT,
    mode_cetak TEXT,
    petugas TEXT DEFAULT 'Admin TU',
    tanggal_cetak DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (santri_id) REFERENCES santri(id) ON DELETE CASCADE
  );

  -- Tabel Pengguna (Multi-Role Authentication: admin, tu, kesehatan)
  CREATE TABLE IF NOT EXISTS pengguna (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL, -- 'admin' | 'tu' | 'kesehatan'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Tabel Master Pilihan (Jenjang, Kelas, Kamar, Rombel, Program)
  CREATE TABLE IF NOT EXISTS master_options (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL, -- 'jenjang' | 'kelas' | 'kamar' | 'rombel' | 'program'
    value TEXT NOT NULL,
    label TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category, value)
  );
`);

// Password hashing helper
const crypto = require('crypto');
function hashPassword(password) {
  const salt = process.env.PASSWORD_SALT || '_salt_pesantren_2026';
  return crypto.createHash('sha256').update(String(password) + salt).digest('hex');
}


// Seed default users if empty
const userCount = db.prepare('SELECT COUNT(*) as count FROM pengguna').get().count;
if (userCount === 0) {
  const insertUser = db.prepare('INSERT INTO pengguna (nama, username, password_hash, role) VALUES (?, ?, ?, ?)');
  insertUser.run('Administrator Utama', 'admin', hashPassword('admin123'), 'admin');
  insertUser.run('Tata Usaha', 'tu', hashPassword('tu123'), 'tu');
  insertUser.run('Perawat', 'kesehatan', hashPassword('sehat123'), 'kesehatan');
} else {
  try {
    db.prepare("UPDATE pengguna SET nama = 'Tata Usaha' WHERE username = 'tu' AND nama = 'Staf Tata Usaha'").run();
    db.prepare("UPDATE pengguna SET nama = 'Perawat' WHERE username = 'kesehatan' AND nama = 'Petugas Kesehatan'").run();
  } catch (e) {}
}

// Migration: add new columns to pengaturan_pesantren if not exists
const newPesantrenCols = [
  { name: 'tulisan_arab', type: "TEXT DEFAULT 'المؤسسة التربوية الإسلامية قدسية منار قدس'" },
  { name: 'tulisan_arab_path', type: "TEXT DEFAULT NULL" },
  { name: 'nama_yayasan', type: "TEXT DEFAULT 'YAYASAN PENDIDIKAN ISLAM QUDSIYYAH MENARA KUDUS'" },
  { name: 'ttd_pengasuh_path', type: "TEXT DEFAULT NULL" },
  { name: 'stempel_path', type: "TEXT DEFAULT NULL" },
  { name: 'tanggal_surat', type: "TEXT DEFAULT 'Kudus, Juli 2025'" },
  { name: 'tempat_terbit', type: "TEXT DEFAULT 'Kudus'" }
];

newPesantrenCols.forEach(col => {
  try {
    db.prepare(`ALTER TABLE pengaturan_pesantren ADD COLUMN ${col.name} ${col.type}`).run();
  } catch (e) {
    // Column already exists
  }
});

// Insert or update row for pengaturan_pesantren
const checkPesantren = db.prepare('SELECT id, nama_pesantren, logo_path FROM pengaturan_pesantren WHERE id = 1').get();
if (!checkPesantren) {
  db.prepare(`
    INSERT INTO pengaturan_pesantren (id, nama_pesantren, alamat_pesantren, kontak, website, email, logo_path, nama_pengasuh, sebutan_pengasuh, tulisan_arab, nama_yayasan, tanggal_surat, tempat_terbit)
    VALUES (1, 'Pondok Pesantren Qudsiyyah Putri', 'Jl. Lambao No. 1 Singocandi Kota Kudus, Telp. (0291) 2912874 - email : qudsiyyahputri@gmail.com', 'Telp: (0291) 2912874', 'www.qudsiyyahputri.com', 'qudsiyyahputri@gmail.com', '/uploads/logos/logo-qudsiyyah.png', 'MUHAMMAD AINUN NAJIB', 'Pengasuh', 'المؤسسة التربوية الإسلامية قدسية منار قدس', 'YAYASAN PENDIDIKAN ISLAM QUDSIYYAH MENARA KUDUS', 'Kudus, Juli 2025', 'Kudus')
  `).run();
} else {
  // Ensure official defaults are set if empty
  db.prepare(`
    UPDATE pengaturan_pesantren 
    SET nama_pesantren = COALESCE(nama_pesantren, 'Pondok Pesantren Qudsiyyah Putri'),
        alamat_pesantren = COALESCE(alamat_pesantren, 'Jl. Lambao No. 1 Singocandi Kota Kudus, Telp. (0291) 2912874 - email : qudsiyyahputri@gmail.com'),
        nama_pengasuh = COALESCE(nama_pengasuh, 'MUHAMMAD AINUN NAJIB'),
        sebutan_pengasuh = COALESCE(sebutan_pengasuh, 'Pengasuh'),
        tulisan_arab = COALESCE(tulisan_arab, 'المؤسسة التربوية الإسلامية قدسية منار قدس'),
        nama_yayasan = COALESCE(nama_yayasan, 'YAYASAN PENDIDIKAN ISLAM QUDSIYYAH MENARA KUDUS'),
        tanggal_surat = COALESCE(tanggal_surat, 'Kudus, Juli 2025'),
        tempat_terbit = COALESCE(tempat_terbit, 'Kudus'),
        logo_path = COALESCE(logo_path, '/uploads/logos/logo-qudsiyyah.png')
    WHERE id = 1
  `).run();
}

const checkTemplate = db.prepare('SELECT id FROM template_kartu WHERE id = 1').get();
if (!checkTemplate) {
  db.prepare(`
    INSERT INTO template_kartu (id, theme, card_width_mm, card_height_mm, show_logo_santri, show_logo_mahrom)
    VALUES (1, 'emerald', 85.6, 54.0, 1, 1)
  `).run();
}

// Migration: add new columns to template_kartu if not exists
const newTemplateCols = [
  { name: 'keterangan_santri', type: "TEXT DEFAULT 'Berlaku selama menjadi santri\nPondok Pesantren Qudsiyyah Putri'" },
  { name: 'keterangan_mahrom', type: "TEXT DEFAULT 'Kartu ini mohon dibawa\nSaat sambangan / menjemput santri'" },
  { name: 'judul_belakang_santri', type: "TEXT DEFAULT 'TATA TERTIB SANTRI'" },
  { name: 'footer_belakang_santri', type: "TEXT DEFAULT 'Bagi yang menemukan kartu ini, mohon bisa mengembalikan ke alamat yang tertera atau menghubungi Pondok Pesantren Qudsiyyah Putri'" },
  { name: 'judul_belakang_mahrom', type: "TEXT DEFAULT 'PERATURAN KUNJUNGAN DAN PERIJINAN PULANG'" },
  { name: 'footer_belakang_mahrom', type: "TEXT DEFAULT 'Bagi yang menemukan kartu ini, mohon bisa mengembalikan ke alamat yang tertera atau menghubungi Pondok Pesantren Qudsiyyah Putri'" }
];

newTemplateCols.forEach(col => {
  try {
    db.prepare(`ALTER TABLE template_kartu ADD COLUMN ${col.name} ${col.type}`).run();
  } catch (e) {
    // Column already exists
  }
});

try {
  db.prepare(`
    UPDATE template_kartu 
    SET keterangan_santri = COALESCE(keterangan_santri, 'Berlaku selama menjadi santri\nPondok Pesantren Qudsiyyah Putri'),
        keterangan_mahrom = COALESCE(keterangan_mahrom, 'Kartu ini mohon dibawa\nSaat sambangan / menjemput santri')
    WHERE id = 1
  `).run();
} catch (e) {}

// Seed Master Options (Jenjang, Kelas, Kamar, Rombel, Program)
const masterOptionsCount = db.prepare('SELECT COUNT(*) as count FROM master_options').get().count;
if (masterOptionsCount === 0) {
  const insertOption = db.prepare(`
    INSERT OR IGNORE INTO master_options (category, value, label, sort_order)
    VALUES (?, ?, ?, ?)
  `);

  const defaultOptions = [
    // Jenjang
    ['jenjang', 'MI', 'MI (Madrasah Ibtidaiyyah)', 1],
    ['jenjang', 'MTs', 'MTs (Madrasah Tsanawiyyah)', 2],
    ['jenjang', 'MA', 'MA (Madrasah Aliyah)', 3],

    // Kelas
    ['kelas', 'VII', 'VII', 1],
    ['kelas', 'VIII', 'VIII', 2],
    ['kelas', 'IX', 'IX', 3],
    ['kelas', 'X', 'X', 4],
    ['kelas', 'XI', 'XI', 5],
    ['kelas', 'XII', 'XII', 6],

    // Rombel (Ruang)
    ['rombel', 'A', 'A', 1],
    ['rombel', 'B', 'B', 2],
    ['rombel', 'C', 'C', 3],
    ['rombel', 'D', 'D', 4],
    ['rombel', 'E', 'E', 5],

    // Program
    ['program', 'Tahfidz', "Tahfidz Al-Qur'an", 1],
    ['program', 'Kitab', 'Pendalaman Kitab Kuning', 2],

    // Kamar
    ['kamar', 'Khadijah 01', 'Khadijah 01', 1],
    ['kamar', 'Khadijah 02', 'Khadijah 02', 2],
    ['kamar', 'Khadijah 03', 'Khadijah 03', 3],
    ['kamar', 'Aisyah 01', 'Aisyah 01', 4],
    ['kamar', 'Aisyah 02', 'Aisyah 02', 5],
    ['kamar', 'Aisyah 03', 'Aisyah 03', 6],
    ['kamar', 'Fathimah 01', 'Fathimah 01', 7],
    ['kamar', 'Fathimah 02', 'Fathimah 02', 8],
    ['kamar', 'Fathimah 03', 'Fathimah 03', 9],
    ['kamar', 'Zainab 01', 'Zainab 01', 10],
    ['kamar', 'Zainab 02', 'Zainab 02', 11],
    ['kamar', 'Hafshah 01', 'Hafshah 01', 12],
    ['kamar', 'Hafshah 02', 'Hafshah 02', 13]
  ];

  for (const opt of defaultOptions) {
    insertOption.run(...opt);
  }
}


// Automatic Column Migration for Master Data Santri (37 Fields)
const existingCols = db.prepare('PRAGMA table_info(santri)').all().map(c => c.name);
const requiredColumns = [
  { name: 'no_induk', type: 'TEXT' },
  { name: 'nisn', type: 'TEXT' },
  { name: 'nama_lengkap', type: 'TEXT' },
  { name: 'jenjang', type: "TEXT DEFAULT 'MTs'" },
  { name: 'kelas', type: 'TEXT' },
  { name: 'ruang', type: 'TEXT' },
  { name: 'program', type: "TEXT DEFAULT 'Tahfidz'" },
  { name: 'kamar_asrama', type: 'TEXT' },
  { name: 'nik_santri', type: 'TEXT' },
  { name: 'tempat_lahir', type: 'TEXT' },
  { name: 'tanggal_lahir', type: 'TEXT' },
  { name: 'jenis_kelamin', type: "TEXT DEFAULT 'P'" },
  { name: 'agama', type: "TEXT DEFAULT 'Islam'" },
  { name: 'golongan_darah', type: "TEXT DEFAULT '-'" },
  { name: 'alamat_siswa', type: 'TEXT' },
  { name: 'anak_ke', type: 'INTEGER DEFAULT 1' },
  { name: 'jumlah_saudara', type: 'INTEGER DEFAULT 1' },
  { name: 'no_kk', type: 'TEXT' },
  { name: 'foto_path', type: 'TEXT' },

  // Data Ayah
  { name: 'nama_ayah', type: 'TEXT' },
  { name: 'nik_ayah', type: 'TEXT' },
  { name: 'almarhum_ayah', type: 'INTEGER DEFAULT 0' },
  { name: 'tempat_lahir_ayah', type: 'TEXT' },
  { name: 'tanggal_lahir_ayah', type: 'TEXT' },
  { name: 'pendidikan_ayah', type: 'TEXT' },
  { name: 'pekerjaan_ayah', type: 'TEXT' },
  { name: 'penghasilan_ayah', type: 'TEXT' },
  { name: 'no_telp_ayah', type: 'TEXT' },
  { name: 'alamat_ayah', type: 'TEXT' },

  // Data Ibu
  { name: 'nama_ibu', type: 'TEXT' },
  { name: 'nik_ibu', type: 'TEXT' },
  { name: 'almarhumah_ibu', type: 'INTEGER DEFAULT 0' },
  { name: 'tempat_lahir_ibu', type: 'TEXT' },
  { name: 'tanggal_lahir_ibu', type: 'TEXT' },
  { name: 'pendidikan_ibu', type: 'TEXT' },
  { name: 'pekerjaan_ibu', type: 'TEXT' },
  { name: 'penghasilan_ibu', type: 'TEXT' },
  { name: 'no_telp_ibu', type: 'TEXT' },
  { name: 'alamat_ibu', type: 'TEXT' },

  // Compatibility columns
  { name: 'nispp', type: 'TEXT' },
  { name: 'nama', type: 'TEXT' },
  { name: 'kamar', type: 'TEXT' },
  { name: 'wali', type: 'TEXT' },
  { name: 'alamat', type: 'TEXT' },
  { name: 'no_hp_wali', type: 'TEXT' },
  { name: 'catatan_medis', type: 'TEXT' },
  { name: 'status', type: "TEXT DEFAULT 'Aktif'" },
  { name: 'is_deleted', type: 'INTEGER DEFAULT 0' }
];

for (const col of requiredColumns) {
  if (!existingCols.includes(col.name)) {
    try {
      db.prepare(`ALTER TABLE santri ADD COLUMN ${col.name} ${col.type}`).run();
    } catch (e) {
      console.warn(`[DB Migration] Column ${col.name} already exists or failed:`, e.message);
    }
  }
}

// Ensure indexes on migrated columns
try {
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_santri_no_induk ON santri (no_induk);
    CREATE INDEX IF NOT EXISTS idx_santri_nisn ON santri (nisn);
    CREATE INDEX IF NOT EXISTS idx_santri_nama_lengkap ON santri (nama_lengkap);
    CREATE INDEX IF NOT EXISTS idx_santri_jenjang ON santri (jenjang);
    CREATE INDEX IF NOT EXISTS idx_santri_kelas ON santri (kelas);
    CREATE INDEX IF NOT EXISTS idx_santri_program ON santri (program);
    CREATE INDEX IF NOT EXISTS idx_santri_kamar_asrama ON santri (kamar_asrama);
    CREATE INDEX IF NOT EXISTS idx_santri_status ON santri (status);
    CREATE INDEX IF NOT EXISTS idx_santri_is_deleted ON santri (is_deleted);
  `);
} catch (e) {
  console.warn('[DB Migration] Index creation notice:', e.message);
}

// Synchronize legacy and new columns for existing records
try {
  db.prepare(`
    UPDATE santri 
    SET no_induk = COALESCE(no_induk, nispp),
        nispp = COALESCE(nispp, no_induk),
        nama_lengkap = COALESCE(nama_lengkap, nama),
        nama = COALESCE(nama, nama_lengkap),
        kamar_asrama = COALESCE(kamar_asrama, kamar),
        kamar = COALESCE(kamar, kamar_asrama),
        alamat_siswa = COALESCE(alamat_siswa, alamat),
        alamat = COALESCE(alamat, alamat_siswa),
        nama_ayah = COALESCE(nama_ayah, wali),
        wali = COALESCE(wali, nama_ayah),
        no_telp_ayah = COALESCE(no_telp_ayah, no_hp_wali),
        no_hp_wali = COALESCE(no_hp_wali, no_telp_ayah),
        jenjang = COALESCE(jenjang, 'MTs'),
        program = COALESCE(program, 'Tahfidz'),
        jenis_kelamin = 'P'
    WHERE is_deleted = 0
  `).run();
} catch (e) {}

// Sample santri seeder disabled (clean database)
if (false) {
  const insertSample = db.prepare(`
    INSERT INTO santri (
      no_induk, nispp, nisn, nama_lengkap, nama, jenjang, kelas, ruang, program, kamar_asrama, kamar,
      nik_santri, tempat_lahir, tanggal_lahir, jenis_kelamin, agama, golongan_darah, alamat_siswa, alamat,
      anak_ke, jumlah_saudara, no_kk,
      nama_ayah, nik_ayah, almarhum_ayah, tempat_lahir_ayah, tanggal_lahir_ayah, pendidikan_ayah, pekerjaan_ayah, penghasilan_ayah, no_telp_ayah, alamat_ayah, wali, no_hp_wali,
      nama_ibu, nik_ibu, almarhumah_ibu, tempat_lahir_ibu, tanggal_lahir_ibu, pendidikan_ibu, pekerjaan_ibu, penghasilan_ibu, no_telp_ibu, alamat_ibu,
      foto_path, status
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?
    )
  `);

  const sampleSantriwati = [
    // 1. Biasa / Pendek (16 Karakter) - Jenjang MI
    [
      '202601001', '202601001', '0081234501', 'Dummy Aisyah Nur', 'Dummy Aisyah Nur', 'Madrasah Ibtidaiyyah', '6', 'Tahfidz A', 'Tahfidz', 'Khodijah 01', 'Khodijah 01',
      '3319015204080001', 'Kudus', '2012-04-12', 'P', 'Islam', 'O', 'Jl. Menara Kudus No. 15, Kauman, Kota Kudus', 'Jl. Menara Kudus No. 15, Kauman, Kota Kudus',
      1, 3, '3319010101080001',
      'H. Muhammad Ridwan, S.Pd.I', '3319011205750001', 0, 'Kudus', '1975-05-12', 'S1 Pendidikan', 'Guru / Ustadz', 'Rp 3.000.000 - Rp 5.000.000', '081234567801', 'Jl. Menara Kudus No. 15, Kauman, Kota Kudus', 'H. Muhammad Ridwan, S.Pd.I', '081234567801',
      'Hj. Siti Maryam', '3319015508780002', 0, 'Kudus', '1978-08-15', 'SMA / MA', 'Ibu Rumah Tangga', '-', '081234567802', 'Jl. Menara Kudus No. 15, Kauman, Kota Kudus',
      '/uploads/photos/202601847-1792330052213.jpg', 'Aktif'
    ],
    // 2. Biasa / Pendek (16 Karakter) - Jenjang MTs
    [
      '202601002', '202601002', '0076543202', 'Dummy Salma Dewi', 'Dummy Salma Dewi', 'Madrasah Tsanawiyyah', '1', 'Kitab B', 'Kitab', 'Fatimah 01', 'Fatimah 01',
      '3319024806070002', 'Pati', '2011-06-08', 'P', 'Islam', 'A', 'Desa Sukolilo RT 03 RW 02, Pati', 'Desa Sukolilo RT 03 RW 02, Pati',
      2, 4, '3319020202070002',
      'Drs. H. Ahmad Syarif', '3319021403720002', 0, 'Pati', '1972-03-14', 'S1 Hukum Islam', 'Wiraswasta', 'Rp 5.000.000 - Rp 10.000.000', '081398765402', 'Desa Sukolilo RT 03 RW 02, Pati', 'Drs. H. Ahmad Syarif', '081398765402',
      'Hj. Nurul Hidayah', '3319025004750003', 0, 'Pati', '1975-04-10', 'D3 Kebidanan', 'Bidan Mandiri', 'Rp 3.000.000 - Rp 5.000.000', '081398765403', 'Desa Sukolilo RT 03 RW 02, Pati',
      '/uploads/photos/202601848-1792329995576.jpg', 'Aktif'
    ],
    // 3. Biasa / Pendek (17 Karakter) - Jenjang MTs
    [
      '202601003', '202601003', '0069876503', 'Dummy Zulfa Hanum', 'Dummy Zulfa Hanum', 'Madrasah Tsanawiyyah', '2', 'Tahfidz A', 'Tahfidz', 'Khodijah 02', 'Khodijah 02',
      '3319036509060003', 'Demak', '2010-09-25', 'P', 'Islam', 'B', 'Jl. Sultan Fatah No. 42, Bintoro, Demak', 'Jl. Sultan Fatah No. 42, Bintoro, Demak',
      1, 2, '3319030303060003',
      'H. Sulaiman Hadi (Alm.)', '3319031001680003', 1, 'Demak', '1968-01-10', 'SMA', 'Almarhum', '-', '-', 'Jl. Sultan Fatah No. 42, Bintoro, Demak', 'Hj. Aminah Sholihatun', '081567890104',
      'Hj. Aminah Sholihatun', '3319035207720004', 0, 'Demak', '1972-07-12', 'S1 Ekonomi', 'Pedagang', 'Rp 3.000.000 - Rp 5.000.000', '081567890104', 'Jl. Sultan Fatah No. 42, Bintoro, Demak',
      '/uploads/photos/202601849-1792329930897.jpg', 'Aktif'
    ],
    // 4. Sedang (24 Karakter) - Jenjang MTs
    [
      '202601004', '202601004', '0098765404', 'Dummy Fathimah Az-Zahra', 'Dummy Fathimah Az-Zahra', 'Madrasah Tsanawiyyah', '3', 'Tahfidz A', 'Tahfidz', 'Khodijah 03', 'Khodijah 03',
      '3319047011090004', 'Jepara', '2009-11-30', 'P', 'Islam', 'AB', 'Desa Tahunan RT 01 RW 04, Jepara', 'Desa Tahunan RT 01 RW 04, Jepara',
      3, 3, '3319040404090004',
      'Bpk. Hendro Utomo', '3319041505770004', 0, 'Jepara', '1977-05-15', 'SMK', 'Pengrajin Mebel', 'Rp 3.000.000 - Rp 5.000.000', '081223344505', 'Desa Tahunan RT 01 RW 04, Jepara', 'Bpk. Hendro Utomo', '081223344505',
      'Ibu Siti Rochmah', '3319046006800005', 0, 'Jepara', '1980-06-20', 'SMA', 'Ibu Rumah Tangga', '-', '081223344506', 'Desa Tahunan RT 01 RW 04, Jepara',
      null, 'Aktif'
    ],
    // 5. Sedang (24 Karakter) - Jenjang MA
    [
      '202601005', '202601005', '0078912305', 'Dummy Khadijah Al-Kubro', 'Dummy Khadijah Al-Kubro', 'Madrasah Aliyah', '4', 'Kitab B', 'Kitab', 'Aisyah 01', 'Aisyah 01',
      '3319055701100005', 'Semarang', '2008-01-17', 'P', 'Islam', 'B', 'Jl. Pandanaran No. 88, Mugassari, Semarang', 'Jl. Pandanaran No. 88, Mugassari, Semarang',
      1, 2, '3319050505100005',
      'Ir. H. Bambang Prasetyo', '3319051006700005', 0, 'Semarang', '1970-06-10', 'S1 Teknik', 'PNS / ASN', 'Rp 5.000.000 - Rp 10.000.000', '081298761205', 'Jl. Pandanaran No. 88, Mugassari, Semarang', 'Ir. H. Bambang Prasetyo', '081298761205',
      'Dra. Hj. Sri Wahyuni', '3319055009740006', 0, 'Semarang', '1974-09-10', 'S1 Pendidikan', 'Guru PNS', 'Rp 3.000.000 - Rp 5.000.000', '081298761206', 'Jl. Pandanaran No. 88, Mugassari, Semarang',
      null, 'Aktif'
    ],
    // 6. Sedang (27 Karakter) - Jenjang MA
    [
      '202601006', '202601006', '0061239806', 'Dummy Safira Zahra Mumtaza', 'Dummy Safira Zahra Mumtaza', 'Madrasah Aliyah', '5', 'Tahfidz A', 'Tahfidz', 'Aisyah 02', 'Aisyah 02',
      '3319014505080006', 'Kudus', '2007-05-05', 'P', 'Islam', 'O', 'Desa Langgardalem RT 02 RW 01, Kota Kudus', 'Desa Langgardalem RT 02 RW 01, Kota Kudus',
      2, 4, '3319010606080006',
      "K.H. Mas'ud Nawawi", '3319011508650006', 0, 'Kudus', '1965-08-15', 'Pesantren', 'Tokoh Agama / Pengasuh', 'Rp 5.000.000 - Rp 10.000.000', '081323456706', 'Desa Langgardalem RT 02 RW 01, Kota Kudus', "K.H. Mas'ud Nawawi", '081323456706',
      "Nyai Hj. Mu'minah", '3319015010690007', 0, 'Kudus', '1969-10-10', 'Pesantren', 'Ibu Rumah Tangga', '-', '081323456707', 'Desa Langgardalem RT 02 RW 01, Kota Kudus',
      null, 'Aktif'
    ],
    // 7. Sedang (30 Karakter) - Jenjang MTs
    [
      '202601007', '202601007', '0084567807', 'Dummy Siti Maryam Sholihatun', 'Dummy Siti Maryam Sholihatun', 'Madrasah Tsanawiyyah', '1', 'Kitab C', 'Kitab', 'Ummu Kultsum 01', 'Ummu Kultsum 01',
      '3319076208120007', 'Rembang', '2011-08-22', 'P', 'Islam', 'A', 'Jl. Pemuda No. 10, Rembang', 'Jl. Pemuda No. 10, Rembang',
      1, 3, '3319070707120007',
      'H. Agus Salim', '3319071203760007', 0, 'Rembang', '1976-03-12', 'S1 Ekonomi', 'Wiraswasta', 'Rp 5.000.000 - Rp 10.000.000', '081122334407', 'Jl. Pemuda No. 10, Rembang', 'H. Agus Salim', '081122334407',
      'Hj. Fitriyah', '3319075507790008', 0, 'Rembang', '1979-07-15', 'SMA', 'Ibu Rumah Tangga', '-', '081122334408', 'Jl. Pemuda No. 10, Rembang',
      null, 'Aktif'
    ],
    // 8. Panjang (36 Karakter) - Jenjang MA
    [
      '202601008', '202601008', '0073216508', 'Dummy Nabilah Syarifah Qurrota Aini', 'Dummy Nabilah Syarifah Qurrota Aini', 'Madrasah Aliyah', '6', 'Tahfidz A', 'Tahfidz', 'Fatimah 02', 'Fatimah 02',
      '3319015402110008', 'Kudus', '2006-02-14', 'P', 'Islam', 'B', 'Desa Demaan RT 04 RW 02, Kota Kudus', 'Desa Demaan RT 04 RW 02, Kota Kudus',
      2, 2, '3319010808110008',
      'Bpk. Taufik Hidayat', '3319011809780008', 0, 'Kudus', '1978-09-18', 'S1 Teknik Informatika', 'Karyawan Swasta', 'Rp 3.000.000 - Rp 5.000.000', '081244556608', 'Desa Demaan RT 04 RW 02, Kota Kudus', 'Bpk. Taufik Hidayat', '081244556608',
      'Ibu Dewi Lestari', '3319016001820009', 0, 'Kudus', '1982-01-20', 'D3 Akuntansi', 'Staf Keuangan', 'Rp 3.000.000 - Rp 5.000.000', '081244556609', 'Desa Demaan RT 04 RW 02, Kota Kudus',
      null, 'Aktif'
    ],
    // 9. Panjang (40 Karakter) - Jenjang MTs
    [
      '202601009', '202601009', '0085432109', 'Dummy Zulfa Zakiyyatunnisa Al-Maghfirah', 'Dummy Zulfa Zakiyyatunnisa Al-Maghfirah', 'Madrasah Tsanawiyyah', '2', 'Kitab B', 'Kitab', 'Ummu Kultsum 02', 'Ummu Kultsum 02',
      '3319085503110009', 'Pati', '2011-03-15', 'P', 'Islam', 'AB', 'Desa Margorejo RT 02 RW 03, Pati', 'Desa Margorejo RT 02 RW 03, Pati',
      1, 3, '3319080909110009',
      'Drs. H. Mulyono Al-Hafidz', '3319081206730009', 0, 'Pati', '1973-06-12', 'S1 Agama Islam', 'Guru / Dosen', 'Rp 5.000.000 - Rp 10.000.000', '081344557709', 'Desa Margorejo RT 02 RW 03, Pati', 'Drs. H. Mulyono Al-Hafidz', '081344557709',
      'Hj. Anisatul Munawaroh', '3319085807760010', 0, 'Pati', '1976-07-18', 'S1 Matematika', 'Guru Madrasah', 'Rp 3.000.000 - Rp 5.000.000', '081344557710', 'Desa Margorejo RT 02 RW 03, Pati',
      null, 'Aktif'
    ],
    // 10. Sangat Panjang (44 Karakter) - Jenjang MA
    [
      '202601010', '202601010', '0076789110', 'Dummy Maryam Nailaturrahmah Putri Salsabila', 'Dummy Maryam Nailaturrahmah Putri Salsabila', 'Madrasah Aliyah', '5', 'Tahfidz B', 'Tahfidz', 'Ummu Kultsum 03', 'Ummu Kultsum 03',
      '3319016209080010', 'Kudus', '2008-09-22', 'P', 'Islam', 'O', 'Jl. Kyai Telingsing No. 55, Sunggingan, Kota Kudus', 'Jl. Kyai Telingsing No. 55, Sunggingan, Kota Kudus',
      2, 3, '3319011010080010',
      'H. Danang Wijayanto, S.T.', '3319011404710010', 0, 'Kudus', '1971-04-14', 'S1 Teknik Arsitektur', 'Kontraktor', '> Rp 10.000.000', '081255668810', 'Jl. Kyai Telingsing No. 55, Sunggingan, Kota Kudus', 'H. Danang Wijayanto, S.T.', '081255668810',
      'Hj. Erna Sulistyaningsih, M.Pd.', '3319015609750011', 0, 'Kudus', '1975-09-16', 'S2 Pendidikan', 'Dosen / Tenaga Pendidik', 'Rp 5.000.000 - Rp 10.000.000', '081255668811', 'Jl. Kyai Telingsing No. 55, Sunggingan, Kota Kudus',
      null, 'Aktif'
    ]
  ];

  for (const s of sampleSantriwati) {
    try {
      insertSample.run(...s);
    } catch (e) {
      console.error('[Seed Error]:', e.message);
    }
  }
}

module.exports = {
  db,
  dataDir,
  uploadsDir,
  photosDir,
  backgroundsDir,
  logosDir,
  hashPassword,
};

