const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { db, photosDir } = require('../db');

// Multer storage for photo upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, photosDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanNispp = (req.body.nispp || 'photo').replace(/[^a-zA-Z0-9_-]/g, '');
    const filename = `${cleanNispp}-${Date.now()}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    const mime = file.mimetype;
    if (allowed.test(ext) && (mime.startsWith('image/') || allowed.test(mime))) {
      cb(null, true);
    } else {
      cb(new Error('Format file tidak didukung! Gunakan format JPG, JPEG, PNG, atau WebP.'));
    }
  }
});

// GET /api/santri/stats - Dashboard analytics
router.get('/stats', (req, res) => {
  try {
    const totalSantri = db.prepare('SELECT COUNT(*) as count FROM santri WHERE is_deleted = 0').get().count;
    const withPhoto = db.prepare("SELECT COUNT(*) as count FROM santri WHERE is_deleted = 0 AND foto_path IS NOT NULL AND foto_path != ''").get().count;
    const withoutPhoto = totalSantri - withPhoto;

    const totalCetakSantri = db.prepare("SELECT COUNT(*) as count FROM riwayat_cetak WHERE jenis_kartu = 'Santri' OR jenis_kartu = 'Keduanya'").get().count;
    const totalCetakMahrom = db.prepare("SELECT COUNT(*) as count FROM riwayat_cetak WHERE jenis_kartu = 'Mahrom' OR jenis_kartu = 'Keduanya'").get().count;

    const incompleteData = db.prepare(`
      SELECT COUNT(*) as count FROM santri 
      WHERE is_deleted = 0 AND (
        COALESCE(nik_santri, '') = '' OR 
        COALESCE(kamar_asrama, kamar, '') = '' OR COALESCE(kamar_asrama, kamar, '') = '-' OR 
        COALESCE(kelas, '') = '' OR
        COALESCE(nama_ayah, wali, '') = ''
      )
    `).get().count;
    const completeData = totalSantri - incompleteData;

    // Recent activities (recent creations & recent print history)
    const recentActivities = db.prepare(`
      SELECT 'print' as type, rc.id, rc.jenis_kartu, rc.mode_cetak, rc.petugas, rc.tanggal_cetak as timestamp, 
             COALESCE(s.nama_lengkap, s.nama) as nama, COALESCE(s.no_induk, s.nispp) as nispp
      FROM riwayat_cetak rc
      JOIN santri s ON rc.santri_id = s.id
      ORDER BY rc.tanggal_cetak DESC LIMIT 5
    `).all();

    const recentSantri = db.prepare(`
      SELECT id, COALESCE(nama_lengkap, nama) as nama, COALESCE(no_induk, nispp) as nispp, 
             COALESCE(kamar_asrama, kamar) as kamar, kelas, jenjang, program, created_at, foto_path
      FROM santri
      WHERE is_deleted = 0
      ORDER BY created_at DESC LIMIT 5
    `).all();

    // Filter options from master_options table
    const masterKamar = db.prepare("SELECT value FROM master_options WHERE category = 'kamar' ORDER BY sort_order ASC, value ASC").all().map(r => r.value);
    const masterKelas = db.prepare("SELECT value FROM master_options WHERE category = 'kelas' ORDER BY sort_order ASC, CASE WHEN value GLOB '[0-9]*' THEN CAST(value AS INTEGER) ELSE 9999 END ASC, value ASC").all().map(r => r.value);
    const masterRuang = db.prepare("SELECT value FROM master_options WHERE category IN ('rombel', 'ruang') ORDER BY sort_order ASC, value ASC").all().map(r => r.value);
    const masterJenjang = db.prepare("SELECT value FROM master_options WHERE category = 'jenjang' ORDER BY sort_order ASC, value ASC").all().map(r => r.value);
    const masterProgram = db.prepare("SELECT value FROM master_options WHERE category = 'program' ORDER BY sort_order ASC, value ASC").all().map(r => r.value);

    // Distinct options from active santri
    const distinctJenjang = db.prepare("SELECT DISTINCT jenjang FROM santri WHERE is_deleted = 0 AND jenjang IS NOT NULL AND jenjang != '' ORDER BY jenjang ASC").all().map(r => r.jenjang);
    const distinctProgram = db.prepare("SELECT DISTINCT program FROM santri WHERE is_deleted = 0 AND program IS NOT NULL AND program != '' ORDER BY program ASC").all().map(r => r.program);
    const distinctKamar = db.prepare("SELECT DISTINCT COALESCE(kamar_asrama, kamar) as kamar_asrama FROM santri WHERE is_deleted = 0 AND COALESCE(kamar_asrama, kamar) IS NOT NULL AND COALESCE(kamar_asrama, kamar) != '' ORDER BY kamar_asrama ASC").all().map(r => r.kamar_asrama);
    const distinctKelas = db.prepare("SELECT DISTINCT kelas FROM santri WHERE is_deleted = 0 AND kelas IS NOT NULL AND kelas != '' ORDER BY kelas ASC").all().map(r => r.kelas);
    const distinctRuang = db.prepare("SELECT DISTINCT ruang FROM santri WHERE is_deleted = 0 AND ruang IS NOT NULL AND ruang != '' ORDER BY ruang ASC").all().map(r => r.ruang);

    const kamarOptions = masterKamar.length > 0
      ? Array.from(new Set([...masterKamar, ...distinctKamar]))
      : distinctKamar;

    const kelasOptions = masterKelas.length > 0
      ? Array.from(new Set([...masterKelas, ...distinctKelas]))
      : distinctKelas;

    const ruangOptions = masterRuang.length > 0
      ? Array.from(new Set([...masterRuang, ...distinctRuang]))
      : distinctRuang;

    const jenjangOptions = masterJenjang.length > 0
      ? Array.from(new Set([...masterJenjang, ...distinctJenjang]))
      : Array.from(new Set(['MI', 'MTs', 'MA', ...distinctJenjang]));

    const programOptions = masterProgram.length > 0
      ? Array.from(new Set([...masterProgram, ...distinctProgram]))
      : Array.from(new Set(['Tahfidz', 'Kitab', ...distinctProgram]));

    res.json({
      success: true,
      stats: {
        totalSantri,
        completeData,
        incompleteData,
        withPhoto,
        withoutPhoto,
        totalCetakSantri,
        totalCetakMahrom,
      },
      recentActivities,
      recentSantri,
      filterOptions: {
        jenjang: jenjangOptions,
        program: programOptions,
        kamar: kamarOptions,
        kelas: kelasOptions,
        ruang: ruangOptions,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/santri - List with search, filter, pagination
router.get('/', (req, res) => {
  try {
    const {
      q = '',
      kamar = '',
      kamar_asrama = '',
      kelas = '',
      ruang = '',
      jenjang = '',
      program = '',
      status = '',
      has_photo = '',
      filter_status = '',
      jenis_kelamin = '',
      page = 1,
      limit = 20,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = req.query;

    const offset = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);
    let conditions = ['is_deleted = 0'];
    let params = [];

    if (q.trim()) {
      conditions.push(`(
        nama_lengkap LIKE ? OR nama LIKE ? OR
        no_induk LIKE ? OR nispp LIKE ? OR nisn LIKE ? OR nik_santri LIKE ? OR
        nama_ayah LIKE ? OR nama_ibu LIKE ? OR wali LIKE ? OR
        alamat_siswa LIKE ? OR alamat LIKE ?
      )`);
      const searchParam = `%${q.trim()}%`;
      params.push(
        searchParam, searchParam, searchParam, searchParam, searchParam, searchParam,
        searchParam, searchParam, searchParam, searchParam, searchParam
      );
    }

    const kamarFilterVal = kamar_asrama || kamar;
    if (kamarFilterVal) {
      conditions.push('(kamar_asrama = ? OR kamar = ?)');
      params.push(kamarFilterVal, kamarFilterVal);
    }

    if (kelas) {
      conditions.push('kelas = ?');
      params.push(kelas);
    }

    if (ruang) {
      conditions.push('ruang = ?');
      params.push(ruang);
    }

    if (jenjang) {
      conditions.push('jenjang = ?');
      params.push(jenjang);
    }

    if (program) {
      conditions.push('program = ?');
      params.push(program);
    }

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (jenis_kelamin) {
      conditions.push('jenis_kelamin = ?');
      params.push(jenis_kelamin);
    }

    if (has_photo === 'yes') {
      conditions.push("foto_path IS NOT NULL AND foto_path != ''");
    } else if (has_photo === 'no') {
      conditions.push("(foto_path IS NULL OR foto_path = '')");
    }

    if (filter_status === 'lengkap') {
      conditions.push(`(
        COALESCE(nik_santri, '') != '' AND 
        COALESCE(kamar_asrama, kamar, '') != '' AND COALESCE(kamar_asrama, kamar, '') != '-' AND 
        COALESCE(kelas, '') != '' AND
        COALESCE(nama_ayah, wali, '') != ''
      )`);
    } else if (filter_status === 'belum_lengkap') {
      conditions.push(`(
        COALESCE(nik_santri, '') = '' OR 
        COALESCE(kamar_asrama, kamar, '') = '' OR COALESCE(kamar_asrama, kamar, '') = '-' OR 
        COALESCE(kelas, '') = '' OR
        COALESCE(nama_ayah, wali, '') = ''
      )`);
    } else if (filter_status === 'belum_foto') {
      conditions.push("(foto_path IS NULL OR foto_path = '')");
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const allowedSort = ['nama_lengkap', 'nama', 'no_induk', 'nispp', 'kamar_asrama', 'kamar', 'kelas', 'jenjang', 'program', 'status', 'created_at', 'updated_at'];
    const safeSortBy = allowedSort.includes(sort_by) ? sort_by : 'created_at';
    const safeOrder = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const countQuery = `SELECT COUNT(*) as total FROM santri ${whereClause}`;
    const total = db.prepare(countQuery).get(...params).total;

    const dataQuery = `
      SELECT *, 
             COALESCE(no_induk, nispp) as no_induk,
             COALESCE(nispp, no_induk) as nispp,
             COALESCE(nama_lengkap, nama) as nama_lengkap,
             COALESCE(nama, nama_lengkap) as nama,
             COALESCE(kamar_asrama, kamar) as kamar_asrama,
             COALESCE(kamar, kamar_asrama) as kamar,
             COALESCE(alamat_siswa, alamat) as alamat_siswa,
             COALESCE(alamat, alamat_siswa) as alamat,
             COALESCE(nama_ayah, wali) as nama_ayah,
             COALESCE(wali, nama_ayah) as wali,
             COALESCE(no_telp_ayah, no_hp_wali) as no_telp_ayah,
             COALESCE(no_hp_wali, no_telp_ayah) as no_hp_wali
      FROM santri
      ${whereClause}
      ORDER BY ${safeSortBy} ${safeOrder}
      LIMIT ? OFFSET ?
    `;

    const santriList = db.prepare(dataQuery).all(...params, parseInt(limit), offset);

    res.json({
      success: true,
      data: santriList,
      santri: santriList,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)) || 1
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/santri/:id - Single detail
router.get('/:id', (req, res) => {
  try {
    const santri = db.prepare(`
      SELECT *,
             COALESCE(no_induk, nispp) as no_induk,
             COALESCE(nispp, no_induk) as nispp,
             COALESCE(nama_lengkap, nama) as nama_lengkap,
             COALESCE(nama, nama_lengkap) as nama,
             COALESCE(kamar_asrama, kamar) as kamar_asrama,
             COALESCE(kamar, kamar_asrama) as kamar,
             COALESCE(alamat_siswa, alamat) as alamat_siswa,
             COALESCE(alamat, alamat_siswa) as alamat,
             COALESCE(nama_ayah, wali) as nama_ayah,
             COALESCE(wali, nama_ayah) as wali,
             COALESCE(no_telp_ayah, no_hp_wali) as no_telp_ayah,
             COALESCE(no_hp_wali, no_telp_ayah) as no_hp_wali
      FROM santri WHERE id = ? AND is_deleted = 0
    `).get(req.params.id);

    if (!santri) {
      return res.status(404).json({ success: false, message: 'Data santri tidak ditemukan.' });
    }

    const printHistory = db.prepare(`
      SELECT * FROM riwayat_cetak 
      WHERE santri_id = ? 
      ORDER BY tanggal_cetak DESC
    `).all(req.params.id);

    res.json({ success: true, data: santri, printHistory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/santri - Create new santri (37 Master Fields)
router.post('/', upload.single('foto'), (req, res) => {
  try {
    const b = req.body;
    const no_induk = (b.no_induk || b.nispp || '').trim();
    const nama_lengkap = (b.nama_lengkap || b.nama || '').trim();

    if (!no_induk || !nama_lengkap) {
      return res.status(400).json({ success: false, message: 'No. Induk dan Nama Lengkap wajib diisi!' });
    }

    // Check duplicate No. Induk
    const existing = db.prepare('SELECT id FROM santri WHERE (no_induk = ? OR nispp = ?) AND is_deleted = 0').get(no_induk, no_induk);
    if (existing) {
      return res.status(400).json({ success: false, message: `No. Induk "${no_induk}" sudah terdaftar pada santri lain!` });
    }

    let foto_path = null;
    if (req.file) {
      foto_path = `/uploads/photos/${req.file.filename}`;
    }

    const insertStmt = db.prepare(`
      INSERT INTO santri (
        no_induk, nispp, nisn, nama_lengkap, nama, jenjang, kelas, ruang, program, kamar_asrama, kamar,
        nik_santri, nik, tempat_lahir, tanggal_lahir, jenis_kelamin, agama, golongan_darah, alamat_siswa, alamat,
        anak_ke, jumlah_saudara, no_kk, kartu_keluarga, foto_path,
        nama_ayah, wali, nik_ayah, almarhum_ayah, tempat_lahir_ayah, tanggal_lahir_ayah, pendidikan_ayah, pekerjaan_ayah, penghasilan_ayah, no_telp_ayah, no_hp_wali, alamat_ayah,
        nama_ibu, ibu_kandung, nik_ibu, almarhumah_ibu, tempat_lahir_ibu, tanggal_lahir_ibu, pendidikan_ibu, pekerjaan_ibu, penghasilan_ibu, no_telp_ibu, alamat_ibu,
        status, catatan_medis, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
    `);

    const result = insertStmt.run(
      no_induk, no_induk, (b.nisn || '').trim(), nama_lengkap, nama_lengkap, b.jenjang || 'MTs', (b.kelas || '').trim(), (b.ruang || '').trim(), b.program || 'Tahfidz', (b.kamar_asrama || b.kamar || '').trim(), (b.kamar_asrama || b.kamar || '').trim(),
      (b.nik_santri || b.nik || '').trim(), (b.nik_santri || b.nik || '').trim(), (b.tempat_lahir || '').trim(), (b.tanggal_lahir || '').trim(), b.jenis_kelamin || 'P', b.agama || 'Islam', b.golongan_darah || '-', (b.alamat_siswa || b.alamat || '').trim(), (b.alamat_siswa || b.alamat || '').trim(),
      parseInt(b.anak_ke) || 1, parseInt(b.jumlah_saudara) || 1, (b.no_kk || b.kartu_keluarga || '').trim(), (b.no_kk || b.kartu_keluarga || '').trim(), foto_path,
      (b.nama_ayah || b.wali || '').trim(), (b.nama_ayah || b.wali || '').trim(), (b.nik_ayah || '').trim(), parseInt(b.almarhum_ayah) || 0, (b.tempat_lahir_ayah || '').trim(), (b.tanggal_lahir_ayah || '').trim(), (b.pendidikan_ayah || '').trim(), (b.pekerjaan_ayah || '').trim(), (b.penghasilan_ayah || '').trim(), (b.no_telp_ayah || b.no_hp_wali || '').trim(), (b.no_telp_ayah || b.no_hp_wali || '').trim(), (b.alamat_ayah || '').trim(),
      (b.nama_ibu || b.ibu_kandung || '').trim(), (b.nama_ibu || b.ibu_kandung || '').trim(), (b.nik_ibu || '').trim(), parseInt(b.almarhumah_ibu) || 0, (b.tempat_lahir_ibu || '').trim(), (b.tanggal_lahir_ibu || '').trim(), (b.pendidikan_ibu || '').trim(), (b.pekerjaan_ibu || '').trim(), (b.penghasilan_ibu || '').trim(), (b.no_telp_ibu || '').trim(), (b.alamat_ibu || '').trim(),
      b.status || 'Aktif', (b.catatan_medis || '').trim()
    );

    const newSantri = db.prepare('SELECT * FROM santri WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, message: 'Data santri berhasil disimpan.', data: newSantri });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/santri/:id - Update santri (37 Master Fields)
router.put('/:id', upload.single('foto'), (req, res) => {
  try {
    const { id } = req.params;
    const current = db.prepare('SELECT * FROM santri WHERE id = ? AND is_deleted = 0').get(id);
    if (!current) {
      return res.status(404).json({ success: false, message: 'Data santri tidak ditemukan.' });
    }

    const b = req.body;
    const no_induk = (b.no_induk || b.nispp || current.no_induk || current.nispp).trim();
    const nama_lengkap = (b.nama_lengkap || b.nama || current.nama_lengkap || current.nama).trim();

    if (!no_induk || !nama_lengkap) {
      return res.status(400).json({ success: false, message: 'No. Induk dan Nama Lengkap wajib diisi!' });
    }

    // Check duplicate No. Induk if changed
    if (no_induk !== current.no_induk && no_induk !== current.nispp) {
      const duplicate = db.prepare('SELECT id FROM santri WHERE (no_induk = ? OR nispp = ?) AND id != ? AND is_deleted = 0').get(no_induk, no_induk, id);
      if (duplicate) {
        return res.status(400).json({ success: false, message: `No. Induk "${no_induk}" sudah terdaftar pada santri lain!` });
      }
    }

    let foto_path = current.foto_path;
    if (req.file) {
      foto_path = `/uploads/photos/${req.file.filename}`;
    } else if (b.hapus_foto === 'true' || b.hapus_foto === true) {
      foto_path = null;
    }

    const updateStmt = db.prepare(`
      UPDATE santri SET
        no_induk = ?, nispp = ?, nisn = ?, nama_lengkap = ?, nama = ?, jenjang = ?, kelas = ?, ruang = ?, program = ?, kamar_asrama = ?, kamar = ?,
        nik_santri = ?, nik = ?, tempat_lahir = ?, tanggal_lahir = ?, jenis_kelamin = ?, agama = ?, golongan_darah = ?, alamat_siswa = ?, alamat = ?,
        anak_ke = ?, jumlah_saudara = ?, no_kk = ?, kartu_keluarga = ?, foto_path = ?,
        nama_ayah = ?, wali = ?, nik_ayah = ?, almarhum_ayah = ?, tempat_lahir_ayah = ?, tanggal_lahir_ayah = ?, pendidikan_ayah = ?, pekerjaan_ayah = ?, penghasilan_ayah = ?, no_telp_ayah = ?, no_hp_wali = ?, alamat_ayah = ?,
        nama_ibu = ?, ibu_kandung = ?, nik_ibu = ?, almarhumah_ibu = ?, tempat_lahir_ibu = ?, tanggal_lahir_ibu = ?, pendidikan_ibu = ?, pekerjaan_ibu = ?, penghasilan_ibu = ?, no_telp_ibu = ?, alamat_ibu = ?,
        status = ?, catatan_medis = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    updateStmt.run(
      no_induk, no_induk, (b.nisn !== undefined ? b.nisn : current.nisn || '').trim(), nama_lengkap, nama_lengkap, b.jenjang || current.jenjang || 'MTs', (b.kelas !== undefined ? b.kelas : current.kelas || '').trim(), (b.ruang !== undefined ? b.ruang : current.ruang || '').trim(), b.program || current.program || 'Tahfidz', (b.kamar_asrama || b.kamar || current.kamar_asrama || current.kamar || '').trim(), (b.kamar_asrama || b.kamar || current.kamar_asrama || current.kamar || '').trim(),
      (b.nik_santri || b.nik || current.nik_santri || current.nik || '').trim(), (b.nik_santri || b.nik || current.nik_santri || current.nik || '').trim(), (b.tempat_lahir !== undefined ? b.tempat_lahir : current.tempat_lahir || '').trim(), (b.tanggal_lahir !== undefined ? b.tanggal_lahir : current.tanggal_lahir || '').trim(), b.jenis_kelamin || current.jenis_kelamin || 'P', b.agama || current.agama || 'Islam', b.golongan_darah || current.golongan_darah || '-', (b.alamat_siswa || b.alamat || current.alamat_siswa || current.alamat || '').trim(), (b.alamat_siswa || b.alamat || current.alamat_siswa || current.alamat || '').trim(),
      parseInt(b.anak_ke) || current.anak_ke || 1, parseInt(b.jumlah_saudara) || current.jumlah_saudara || 1, (b.no_kk || b.kartu_keluarga || current.no_kk || current.kartu_keluarga || '').trim(), (b.no_kk || b.kartu_keluarga || current.no_kk || current.kartu_keluarga || '').trim(), foto_path,
      (b.nama_ayah || b.wali || current.nama_ayah || current.wali || '').trim(), (b.nama_ayah || b.wali || current.nama_ayah || current.wali || '').trim(), (b.nik_ayah !== undefined ? b.nik_ayah : current.nik_ayah || '').trim(), b.almarhum_ayah !== undefined ? parseInt(b.almarhum_ayah) : (current.almarhum_ayah || 0), (b.tempat_lahir_ayah !== undefined ? b.tempat_lahir_ayah : current.tempat_lahir_ayah || '').trim(), (b.tanggal_lahir_ayah !== undefined ? b.tanggal_lahir_ayah : current.tanggal_lahir_ayah || '').trim(), (b.pendidikan_ayah !== undefined ? b.pendidikan_ayah : current.pendidikan_ayah || '').trim(), (b.pekerjaan_ayah !== undefined ? b.pekerjaan_ayah : current.pekerjaan_ayah || '').trim(), (b.penghasilan_ayah !== undefined ? b.penghasilan_ayah : current.penghasilan_ayah || '').trim(), (b.no_telp_ayah || b.no_hp_wali || current.no_telp_ayah || current.no_hp_wali || '').trim(), (b.no_telp_ayah || b.no_hp_wali || current.no_telp_ayah || current.no_hp_wali || '').trim(), (b.alamat_ayah !== undefined ? b.alamat_ayah : current.alamat_ayah || '').trim(),
      (b.nama_ibu || b.ibu_kandung || current.nama_ibu || current.ibu_kandung || '').trim(), (b.nama_ibu || b.ibu_kandung || current.nama_ibu || current.ibu_kandung || '').trim(), (b.nik_ibu !== undefined ? b.nik_ibu : current.nik_ibu || '').trim(), b.almarhumah_ibu !== undefined ? parseInt(b.almarhumah_ibu) : (current.almarhumah_ibu || 0), (b.tempat_lahir_ibu !== undefined ? b.tempat_lahir_ibu : current.tempat_lahir_ibu || '').trim(), (b.tanggal_lahir_ibu !== undefined ? b.tanggal_lahir_ibu : current.tanggal_lahir_ibu || '').trim(), (b.pendidikan_ibu !== undefined ? b.pendidikan_ibu : current.pendidikan_ibu || '').trim(), (b.pekerjaan_ibu !== undefined ? b.pekerjaan_ibu : current.pekerjaan_ibu || '').trim(), (b.penghasilan_ibu !== undefined ? b.penghasilan_ibu : current.penghasilan_ibu || '').trim(), (b.no_telp_ibu !== undefined ? b.no_telp_ibu : current.no_telp_ibu || '').trim(), (b.alamat_ibu !== undefined ? b.alamat_ibu : current.alamat_ibu || '').trim(),
      b.status || current.status || 'Aktif', (b.catatan_medis !== undefined ? b.catatan_medis : current.catatan_medis || '').trim(),
      id
    );

    const updated = db.prepare('SELECT * FROM santri WHERE id = ?').get(id);
    res.json({ success: true, message: 'Data santri berhasil diperbarui.', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// DELETE /api/santri/:id - Soft delete
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const exists = db.prepare('SELECT id, nama FROM santri WHERE id = ? AND is_deleted = 0').get(id);
    if (!exists) {
      return res.status(404).json({ success: false, message: 'Data santri tidak ditemukan.' });
    }

    db.prepare('UPDATE santri SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(id);
    res.json({ success: true, message: `Data santri "${exists.nama}" berhasil dihapus ke arsip.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/santri/bulk-delete - Delete multiple
router.post('/bulk-delete', (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Pilih minimal satu santri untuk dihapus.' });
    }

    const placeholders = ids.map(() => '?').join(',');
    const stmt = db.prepare(`UPDATE santri SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id IN (${placeholders})`);
    stmt.run(...ids);

    res.json({ success: true, message: `${ids.length} data santri berhasil dihapus.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/santri/log-print - Log printing history
router.post('/log-print', (req, res) => {
  try {
    const { santri_ids, jenis_kartu = 'Santri', mode_cetak = 'PVC', petugas = 'Admin TU' } = req.body;
    if (!Array.isArray(santri_ids) || santri_ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Santri ID tidak boleh kosong.' });
    }

    const insertStmt = db.prepare(`
      INSERT INTO riwayat_cetak (santri_id, jenis_kartu, mode_cetak, petugas, tanggal_cetak)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);

    const insertMany = db.transaction((ids) => {
      for (const id of ids) {
        insertStmt.run(id, jenis_kartu, mode_cetak, petugas);
      }
    });

    insertMany(santri_ids);
    res.json({ success: true, message: 'Riwayat pencetakan berhasil dicatat.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
