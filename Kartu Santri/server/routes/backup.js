const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const AdmZip = require('adm-zip');
const { db, dataDir, uploadsDir } = require('../db');

const tempDir = path.join(__dirname, '../uploads/temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

const uploadBackup = multer({
  dest: tempDir,
  limits: { fileSize: 250 * 1024 * 1024 } // Up to 250MB backup
});

// GET /api/backup/download - Download complete system backup (.zip) using AdmZip
router.get('/download', (req, res) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `Backup_Pesantren_${timestamp}.zip`;

    // Save current DB checkpoint to disk
    db.pragma('wal_checkpoint(TRUNCATE)');

    const zip = new AdmZip();
    const dbPath = path.join(dataDir, 'pesantren.db');
    if (fs.existsSync(dbPath)) {
      zip.addLocalFile(dbPath);
    }

    // Include uploads folder (photos, backgrounds, logos)
    if (fs.existsSync(uploadsDir)) {
      zip.addLocalFolder(uploadsDir, 'uploads');
    }

    // Add metadata manifest
    const totalSantri = db.prepare('SELECT COUNT(*) as count FROM santri WHERE is_deleted = 0').get().count;
    const pesantren = db.prepare('SELECT nama_pesantren FROM pengaturan_pesantren WHERE id = 1').get();

    const manifest = {
      appName: 'Generator Kartu Santri & Mahrom',
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      pesantrenName: pesantren ? pesantren.nama_pesantren : 'Pondok Pesantren',
      totalSantriActive: totalSantri
    };

    zip.addFile('manifest.json', Buffer.from(JSON.stringify(manifest, null, 2), 'utf8'));

    const zipBuffer = zip.toBuffer();

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', zipBuffer.length);
    res.send(zipBuffer);
  } catch (error) {
    console.error('Backup download error:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Gagal membuat file backup: ' + error.message });
    }
  }
});

// POST /api/backup/restore - Restore system from backup (.zip)
router.post('/restore', uploadBackup.single('backupFile'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Harap upload file backup (.zip).' });
    }

    const zip = new AdmZip(req.file.path);
    const zipEntries = zip.getEntries();

    // Validate that manifest.json or pesantren.db exists in the zip
    const hasDb = zipEntries.some(e => e.entryName === 'pesantren.db' || e.entryName.endsWith('pesantren.db'));
    if (!hasDb) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
      return res.status(400).json({
        success: false,
        message: 'File backup tidak valid! File "pesantren.db" tidak ditemukan di dalam arsip ZIP.'
      });
    }

    // Extract database and uploads
    zipEntries.forEach((entry) => {
      if (entry.entryName === 'pesantren.db') {
        const targetDbPath = path.join(dataDir, 'pesantren.db');
        fs.writeFileSync(targetDbPath, entry.getData());
      } else if (entry.entryName.startsWith('uploads/') && !entry.isDirectory) {
        const relativeSubPath = entry.entryName.replace(/^uploads\//, '');
        const targetFilePath = path.join(uploadsDir, relativeSubPath);
        const targetFolder = path.dirname(targetFilePath);
        if (!fs.existsSync(targetFolder)) fs.mkdirSync(targetFolder, { recursive: true });
        fs.writeFileSync(targetFilePath, entry.getData());
      }
    });

    try { fs.unlinkSync(req.file.path); } catch (e) {}

    // Verify restored database
    const verifySantri = db.prepare('SELECT COUNT(*) as count FROM santri WHERE is_deleted = 0').get().count;

    res.json({
      success: true,
      message: `Database dan file berhasil dipulihkan! Total ${verifySantri} data santri aktif siap digunakan.`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memulihkan database: ' + error.message });
  }
});

module.exports = router;
