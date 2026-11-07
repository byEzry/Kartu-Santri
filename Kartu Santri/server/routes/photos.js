const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const AdmZip = require('adm-zip');
const { db, photosDir } = require('../db');

const tempDir = path.join(__dirname, '../uploads/temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

const uploadZip = multer({
  dest: tempDir,
  limits: { fileSize: 100 * 1024 * 1024 } // Up to 100MB zip
});

const uploadMulti = multer({
  dest: tempDir,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Helper: Normalize filename to NISPP
function extractNisppFromFilename(filename) {
  const nameWithoutExt = path.parse(filename).name;
  // Remove spaces, underscores, dashes, prefix "foto_", etc.
  return nameWithoutExt.trim();
}

// POST /api/photos/bulk-zip - Extract ZIP and match photos to santri by NISPP
router.post('/bulk-zip', uploadZip.single('zipFile'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Harap upload file ZIP yang berisi foto santri.' });
    }

    const zip = new AdmZip(req.file.path);
    const zipEntries = zip.getEntries();

    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
    const matched = [];
    const unmatched = [];

    // Map all active santri by NISPP
    const allSantri = db.prepare('SELECT id, nispp, nama, foto_path FROM santri WHERE is_deleted = 0').all();
    const santriMap = new Map();
    allSantri.forEach(s => santriMap.set(String(s.nispp).trim(), s));

    const updateStmt = db.prepare('UPDATE santri SET foto_path = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');

    const runMatches = db.transaction(() => {
      for (const entry of zipEntries) {
        if (entry.isDirectory) continue;

        const ext = path.extname(entry.name).toLowerCase();
        if (!allowedExts.includes(ext)) continue;

        const baseName = path.basename(entry.name);
        const candidateNispp = extractNisppFromFilename(baseName);

        const santri = santriMap.get(candidateNispp);
        if (santri) {
          const targetFilename = `${santri.nispp}-${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`;
          const targetPath = path.join(photosDir, targetFilename);

          // Write buffer to photos directory
          fs.writeFileSync(targetPath, entry.getData());
          const relativeUrl = `/uploads/photos/${targetFilename}`;

          updateStmt.run(relativeUrl, santri.id);
          matched.push({
            nispp: santri.nispp,
            nama: santri.nama,
            filename: baseName,
            url: relativeUrl
          });
        } else {
          unmatched.push({
            filename: baseName,
            extractedNispp: candidateNispp,
            reason: `Tidak ada santri dengan NISPP "${candidateNispp}"`
          });
        }
      }
    });

    runMatches();

    // Clean up uploaded temp zip file
    try { fs.unlinkSync(req.file.path); } catch (e) {}

    res.json({
      success: true,
      message: `Pencocokan selesai! ${matched.length} foto berhasil dipasangkan ke santri.`,
      matchedCount: matched.length,
      unmatchedCount: unmatched.length,
      matched,
      unmatched: unmatched.slice(0, 50)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengekstrak file ZIP: ' + error.message });
  }
});

// POST /api/photos/bulk-files - Multiple file upload from browser
router.post('/bulk-files', uploadMulti.array('photos', 100), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Tidak ada file yang diunggah.' });
    }

    const allSantri = db.prepare('SELECT id, nispp, nama FROM santri WHERE is_deleted = 0').all();
    const santriMap = new Map();
    allSantri.forEach(s => santriMap.set(String(s.nispp).trim(), s));

    const matched = [];
    const unmatched = [];
    const updateStmt = db.prepare('UPDATE santri SET foto_path = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');

    const runMatches = db.transaction(() => {
      for (const file of req.files) {
        const ext = path.extname(file.originalname).toLowerCase();
        const candidateNispp = extractNisppFromFilename(file.originalname);
        const santri = santriMap.get(candidateNispp);

        if (santri) {
          const targetFilename = `${santri.nispp}-${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`;
          const targetPath = path.join(photosDir, targetFilename);
          fs.renameSync(file.path, targetPath);

          const relativeUrl = `/uploads/photos/${targetFilename}`;
          updateStmt.run(relativeUrl, santri.id);

          matched.push({
            nispp: santri.nispp,
            nama: santri.nama,
            filename: file.originalname,
            url: relativeUrl
          });
        } else {
          try { fs.unlinkSync(file.path); } catch (e) {}
          unmatched.push({
            filename: file.originalname,
            extractedNispp: candidateNispp,
            reason: `Tidak ada santri dengan NISPP "${candidateNispp}"`
          });
        }
      }
    });

    runMatches();

    res.json({
      success: true,
      message: `${matched.length} foto berhasil dicocokkan berdasarkan NISPP.`,
      matchedCount: matched.length,
      unmatchedCount: unmatched.length,
      matched,
      unmatched
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
