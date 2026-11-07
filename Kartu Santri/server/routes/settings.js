const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { db, backgroundsDir, logosDir } = require('../db');

// Multer storage for custom backgrounds
const bgStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, backgroundsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const type = req.params.cardType || 'bg';
    cb(null, `${type}-${Date.now()}${ext}`);
  }
});
const uploadBg = multer({ storage: bgStorage });

// Multer storage for logo
const logoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, logosDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const prefix = file.fieldname === 'tulisan_arab_img' ? 'arab' : file.fieldname === 'ttd_pengasuh' ? 'ttd' : file.fieldname === 'stempel' ? 'stempel' : 'logo';
    cb(null, `${prefix}-${Date.now()}${ext}`);
  }
});
const uploadOfficialAssets = multer({ storage: logoStorage }).fields([
  { name: 'logo', maxCount: 1 },
  { name: 'tulisan_arab_img', maxCount: 1 },
  { name: 'ttd_pengasuh', maxCount: 1 },
  { name: 'stempel', maxCount: 1 }
]);

// GET /api/settings - Get all settings
router.get('/', (req, res) => {
  try {
    const pesantren = db.prepare('SELECT * FROM pengaturan_pesantren WHERE id = 1').get();
    const template = db.prepare('SELECT * FROM template_kartu WHERE id = 1').get();
    res.json({ success: true, pesantren, template });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/settings/pesantren - Update pesantren info, signature, stamp, and arabic logo
router.put('/pesantren', uploadOfficialAssets, (req, res) => {
  try {
    const {
      nama_pesantren,
      alamat_pesantren,
      kontak,
      website,
      email,
      nama_pengasuh,
      sebutan_pengasuh,
      tulisan_arab,
      nama_yayasan,
      tanggal_surat,
      tempat_terbit,
      hapus_logo,
      hapus_tulisan_arab_img,
      hapus_ttd,
      hapus_stempel
    } = req.body;

    const current = db.prepare('SELECT * FROM pengaturan_pesantren WHERE id = 1').get();
    let logo_path = current.logo_path;
    let tulisan_arab_path = current.tulisan_arab_path;
    let ttd_pengasuh_path = current.ttd_pengasuh_path;
    let stempel_path = current.stempel_path;

    if (req.files) {
      if (req.files['logo'] && req.files['logo'][0]) {
        logo_path = `/uploads/logos/${req.files['logo'][0].filename}`;
      }
      if (req.files['tulisan_arab_img'] && req.files['tulisan_arab_img'][0]) {
        tulisan_arab_path = `/uploads/logos/${req.files['tulisan_arab_img'][0].filename}`;
      }
      if (req.files['ttd_pengasuh'] && req.files['ttd_pengasuh'][0]) {
        ttd_pengasuh_path = `/uploads/logos/${req.files['ttd_pengasuh'][0].filename}`;
      }
      if (req.files['stempel'] && req.files['stempel'][0]) {
        stempel_path = `/uploads/logos/${req.files['stempel'][0].filename}`;
      }
    }

    if (hapus_logo === 'true' || hapus_logo === true) logo_path = null;
    if (hapus_tulisan_arab_img === 'true' || hapus_tulisan_arab_img === true) tulisan_arab_path = null;
    if (hapus_ttd === 'true' || hapus_ttd === true) ttd_pengasuh_path = null;
    if (hapus_stempel === 'true' || hapus_stempel === true) stempel_path = null;

    db.prepare(`
      UPDATE pengaturan_pesantren SET
        nama_pesantren = ?,
        alamat_pesantren = ?,
        kontak = ?,
        website = ?,
        email = ?,
        logo_path = ?,
        tulisan_arab_path = ?,
        ttd_pengasuh_path = ?,
        stempel_path = ?,
        nama_pengasuh = ?,
        sebutan_pengasuh = ?,
        tulisan_arab = ?,
        nama_yayasan = ?,
        tanggal_surat = ?,
        tempat_terbit = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `).run(
      nama_pesantren !== undefined ? nama_pesantren : current.nama_pesantren,
      alamat_pesantren !== undefined ? alamat_pesantren : current.alamat_pesantren,
      kontak !== undefined ? kontak : current.kontak,
      website !== undefined ? website : current.website,
      email !== undefined ? email : current.email,
      logo_path,
      tulisan_arab_path,
      ttd_pengasuh_path,
      stempel_path,
      nama_pengasuh !== undefined ? nama_pengasuh : current.nama_pengasuh,
      sebutan_pengasuh !== undefined ? sebutan_pengasuh : current.sebutan_pengasuh,
      tulisan_arab !== undefined ? tulisan_arab : current.tulisan_arab,
      nama_yayasan !== undefined ? nama_yayasan : current.nama_yayasan,
      tanggal_surat !== undefined ? tanggal_surat : current.tanggal_surat,
      tempat_terbit !== undefined ? tempat_terbit : current.tempat_terbit
    );

    const updated = db.prepare('SELECT * FROM pengaturan_pesantren WHERE id = 1').get();
    res.json({ success: true, message: 'Profil pesantren dan pengesahan kartu berhasil diperbarui.', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/settings/template - Update card design template
router.put('/template', (req, res) => {
  try {
    const current = db.prepare('SELECT * FROM template_kartu WHERE id = 1').get();
    const {
      theme,
      card_width_mm,
      card_height_mm,
      show_logo_santri,
      show_logo_mahrom,
      text_color_santri,
      text_color_mahrom,
      accent_color_santri,
      accent_color_mahrom,
      qr_position,
      ketentuan_mahrom,
      tata_tertib_santri,
      keterangan_santri,
      keterangan_mahrom,
      judul_belakang_santri,
      footer_belakang_santri,
      judul_belakang_mahrom,
      footer_belakang_mahrom
    } = req.body;

    db.prepare(`
      UPDATE template_kartu SET
        theme = ?, card_width_mm = ?, card_height_mm = ?,
        show_logo_santri = ?, show_logo_mahrom = ?,
        text_color_santri = ?, text_color_mahrom = ?,
        accent_color_santri = ?, accent_color_mahrom = ?,
        qr_position = ?, ketentuan_mahrom = ?, tata_tertib_santri = ?,
        keterangan_santri = ?, keterangan_mahrom = ?,
        judul_belakang_santri = ?, footer_belakang_santri = ?,
        judul_belakang_mahrom = ?, footer_belakang_mahrom = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `).run(
      theme !== undefined ? theme : current.theme,
      card_width_mm !== undefined ? parseFloat(card_width_mm) : current.card_width_mm,
      card_height_mm !== undefined ? parseFloat(card_height_mm) : current.card_height_mm,
      show_logo_santri !== undefined ? (show_logo_santri ? 1 : 0) : current.show_logo_santri,
      show_logo_mahrom !== undefined ? (show_logo_mahrom ? 1 : 0) : current.show_logo_mahrom,
      text_color_santri || current.text_color_santri,
      text_color_mahrom || current.text_color_mahrom,
      accent_color_santri || current.accent_color_santri,
      accent_color_mahrom || current.accent_color_mahrom,
      qr_position || current.qr_position,
      ketentuan_mahrom !== undefined ? ketentuan_mahrom : current.ketentuan_mahrom,
      tata_tertib_santri !== undefined ? tata_tertib_santri : current.tata_tertib_santri,
      keterangan_santri !== undefined ? keterangan_santri : current.keterangan_santri,
      keterangan_mahrom !== undefined ? keterangan_mahrom : current.keterangan_mahrom,
      judul_belakang_santri !== undefined ? judul_belakang_santri : (current.judul_belakang_santri || 'TATA TERTIB SANTRI'),
      footer_belakang_santri !== undefined ? footer_belakang_santri : (current.footer_belakang_santri || 'Bagi yang menemukan kartu ini, mohon bisa mengembalikan ke alamat yang tertera atau menghubungi Pondok Pesantren Qudsiyyah Putri'),
      judul_belakang_mahrom !== undefined ? judul_belakang_mahrom : (current.judul_belakang_mahrom || 'PERATURAN KUNJUNGAN DAN PERIJINAN PULANG'),
      footer_belakang_mahrom !== undefined ? footer_belakang_mahrom : (current.footer_belakang_mahrom || 'Bagi yang menemukan kartu ini, mohon bisa mengembalikan ke alamat yang tertera atau menghubungi Pondok Pesantren Qudsiyyah Putri')
    );

    const updated = db.prepare('SELECT * FROM template_kartu WHERE id = 1').get();
    res.json({ success: true, message: 'Pengaturan desain kartu berhasil disimpan.', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/settings/background/:cardType - Upload custom background
// cardType: 'santri_front' | 'santri_back' | 'mahrom_front' | 'mahrom_back'
router.post('/background/:cardType', uploadBg.single('background'), (req, res) => {
  try {
    const { cardType } = req.params;
    const allowed = ['santri_front', 'santri_back', 'mahrom_front', 'mahrom_back'];
    if (!allowed.includes(cardType)) {
      return res.status(400).json({ success: false, message: 'Tipe kartu tidak valid.' });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Pilih file background untuk diupload.' });
    }

    const columnMap = {
      santri_front: 'bg_santri_front',
      santri_back: 'bg_santri_back',
      mahrom_front: 'bg_mahrom_front',
      mahrom_back: 'bg_mahrom_back'
    };

    const columnName = columnMap[cardType];
    const bgUrl = `/uploads/backgrounds/${req.file.filename}`;

    db.prepare(`UPDATE template_kartu SET ${columnName} = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1`).run(bgUrl);

    const updated = db.prepare('SELECT * FROM template_kartu WHERE id = 1').get();
    res.json({ success: true, message: `Background ${cardType.replace('_', ' ')} berhasil diupdate.`, data: updated, bgUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/settings/background/:cardType - Reset custom background to default
router.delete('/background/:cardType', (req, res) => {
  try {
    const { cardType } = req.params;
    const columnMap = {
      santri_front: 'bg_santri_front',
      santri_back: 'bg_santri_back',
      mahrom_front: 'bg_mahrom_front',
      mahrom_back: 'bg_mahrom_back'
    };

    const columnName = columnMap[cardType];
    if (!columnName) {
      return res.status(400).json({ success: false, message: 'Tipe kartu tidak valid.' });
    }

    db.prepare(`UPDATE template_kartu SET ${columnName} = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = 1`).run();
    const updated = db.prepare('SELECT * FROM template_kartu WHERE id = 1').get();
    res.json({ success: true, message: `Background kustom ${cardType.replace('_', ' ')} dihapus. Kembali ke tema standar.`, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/settings/master-options - Get all categorized master options
router.get('/master-options', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM master_options ORDER BY id ASC').all();
    const result = {
      jenjang: [],
      kelas: [],
      rombel: [],
      program: [],
      kamar: []
    };
    for (const r of rows) {
      if (result[r.category]) {
        result[r.category].push(r);
      }
    }
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/settings/master-options - Add new master option
router.post('/master-options', (req, res) => {
  try {
    const { category, value, label, sort_order } = req.body;
    const allowed = ['jenjang', 'kelas', 'rombel', 'program', 'kamar'];
    if (!allowed.includes(category)) {
      return res.status(400).json({ success: false, message: 'Kategori master data tidak valid.' });
    }
    if (!value || !value.trim()) {
      return res.status(400).json({ success: false, message: 'Nilai data tidak boleh kosong.' });
    }

    const trimmedValue = value.trim();
    const finalLabel = (label && label.trim()) ? label.trim() : trimmedValue;

    const stmt = db.prepare(`
      INSERT INTO master_options (category, value, label, sort_order)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(category, value) DO UPDATE SET label = excluded.label
    `);
    const info = stmt.run(category, trimmedValue, finalLabel, sort_order ? parseInt(sort_order) : 50);

    const newItem = db.prepare('SELECT * FROM master_options WHERE id = ? OR (category = ? AND value = ?)').get(info.lastInsertRowid, category, trimmedValue);
    res.json({ success: true, message: 'Data master berhasil ditambahkan/diperbarui.', data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/settings/master-options/:id - Update an existing master option
router.put('/master-options/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { value, label } = req.body;

    if (!value || !value.trim()) {
      return res.status(400).json({ success: false, message: 'Nilai data tidak boleh kosong.' });
    }

    const current = db.prepare('SELECT * FROM master_options WHERE id = ?').get(id);
    if (!current) {
      return res.status(404).json({ success: false, message: 'Data master tidak ditemukan.' });
    }

    const trimmedValue = value.trim();
    const finalLabel = (label && label.trim()) ? label.trim() : trimmedValue;

    // Check if new value already exists for this category (other than this id)
    const duplicate = db.prepare('SELECT id FROM master_options WHERE category = ? AND value = ? AND id != ?').get(current.category, trimmedValue, id);
    if (duplicate) {
      return res.status(400).json({ success: false, message: `Pilihan "${trimmedValue}" sudah ada di daftar ini.` });
    }

    const oldValue = current.value;

    db.prepare(`
      UPDATE master_options 
      SET value = ?, label = ? 
      WHERE id = ?
    `).run(trimmedValue, finalLabel, id);

    // Also update santri records that were using the oldValue, so data stays in sync!
    if (oldValue !== trimmedValue) {
      const colMap = {
        jenjang: 'jenjang',
        kelas: 'kelas',
        rombel: 'ruang',
        program: 'program',
        kamar: 'kamar_asrama'
      };
      const santriCol = colMap[current.category];
      if (santriCol) {
        db.prepare(`UPDATE santri SET ${santriCol} = ? WHERE ${santriCol} = ?`).run(trimmedValue, oldValue);
        if (current.category === 'kamar') {
          db.prepare(`UPDATE santri SET kamar = ? WHERE kamar = ?`).run(trimmedValue, oldValue);
        }
      }
    }

    const updated = db.prepare('SELECT * FROM master_options WHERE id = ?').get(id);
    res.json({ success: true, message: 'Data master berhasil diperbarui.', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/settings/master-options/:id - Delete a master option
router.delete('/master-options/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM master_options WHERE id = ?').run(id);
    res.json({ success: true, message: 'Pilihan data master berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

