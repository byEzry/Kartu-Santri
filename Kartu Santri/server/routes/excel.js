const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const { db } = require('../db');

// In-memory or temporary disk upload for Excel files
const upload = multer({
  dest: path.join(__dirname, '../uploads/temp'),
  limits: { fileSize: 10 * 1024 * 1024 }
});

// GET /api/excel/template - Download standardized template (37 Fields)
router.get('/template', (req, res) => {
  try {
    const templateData = [
      {
        'No. Induk *': '202601001',
        'NISN': '0081234501',
        'Nama Lengkap *': 'Fathimah Az-Zahra',
        'Jenjang (MI/MTs/MA)': 'MTs',
        'Kelas': 'VII',
        'Ruang': 'A',
        'Program (Tahfidz/Kitab)': 'Tahfidz',
        'Kamar Asrama': 'Khadijah 01',
        'NIK Santri': '3319015204080001',
        'Tempat Lahir': 'Kudus',
        'Tanggal Lahir (YYYY-MM-DD)': '2008-04-12',
        'Jenis Kelamin (P/L)': 'P',
        'Agama': 'Islam',
        'Golongan Darah': 'O',
        'Alamat Siswa': 'Jl. Menara Kudus No. 15, Kauman, Kota Kudus',
        'Anak ke': 1,
        'Jumlah Saudara': 3,
        'No. KK': '3319010101080001',
        'Nama Ayah': 'H. Muhammad Ridwan, S.Pd.I',
        'NIK Ayah': '3319011205750001',
        'Status Ayah (Hidup/Almarhum)': 'Hidup',
        'Tempat Lahir Ayah': 'Kudus',
        'Tanggal Lahir Ayah (YYYY-MM-DD)': '1975-05-12',
        'Pendidikan Ayah': 'S1 Pendidikan',
        'Pekerjaan Ayah': 'Guru / Ustadz',
        'Penghasilan Ayah': 'Rp 3.000.000 - Rp 5.000.000',
        'No. Telp Ayah': '081234567801',
        'Alamat Ayah': 'Jl. Menara Kudus No. 15, Kauman, Kota Kudus',
        'Nama Ibu': 'Hj. Siti Maryam',
        'NIK Ibu': '3319015508780002',
        'Status Ibu (Hidup/Almarhumah)': 'Hidup',
        'Tempat Lahir Ibu': 'Kudus',
        'Tanggal Lahir Ibu (YYYY-MM-DD)': '1978-08-15',
        'Pendidikan Ibu': 'SMA / MA',
        'Pekerjaan Ibu': 'Ibu Rumah Tangga',
        'Penghasilan Ibu': '-',
        'No. Telp Ibu': '081234567802',
        'Alamat Ibu': 'Jl. Menara Kudus No. 15, Kauman, Kota Kudus'
      },
      {
        'No. Induk *': '202601002',
        'NISN': '0076543202',
        'Nama Lengkap *': 'Nabilah Syarifah Qurrota Aini',
        'Jenjang (MI/MTs/MA)': 'MTs',
        'Kelas': 'VIII',
        'Ruang': 'B',
        'Program (Tahfidz/Kitab)': 'Kitab',
        'Kamar Asrama': 'Aisyah 02',
        'NIK Santri': '3319024806070002',
        'Tempat Lahir': 'Pati',
        'Tanggal Lahir (YYYY-MM-DD)': '2007-06-08',
        'Jenis Kelamin (P/L)': 'P',
        'Agama': 'Islam',
        'Golongan Darah': 'A',
        'Alamat Siswa': 'Desa Sukolilo RT 03 RW 02, Pati',
        'Anak ke': 2,
        'Jumlah Saudara': 4,
        'No. KK': '3319020202070002',
        'Nama Ayah': 'Drs. H. Ahmad Syarif',
        'NIK Ayah': '3319021403720002',
        'Status Ayah (Hidup/Almarhum)': 'Hidup',
        'Tempat Lahir Ayah': 'Pati',
        'Tanggal Lahir Ayah (YYYY-MM-DD)': '1972-03-14',
        'Pendidikan Ayah': 'S1 Hukum Islam',
        'Pekerjaan Ayah': 'Wiraswasta',
        'Penghasilan Ayah': 'Rp 5.000.000 - Rp 10.000.000',
        'No. Telp Ayah': '081398765402',
        'Alamat Ayah': 'Desa Sukolilo RT 03 RW 02, Pati',
        'Nama Ibu': 'Hj. Nurul Hidayah',
        'NIK Ibu': '3319025004750003',
        'Status Ibu (Hidup/Almarhumah)': 'Hidup',
        'Tempat Lahir Ibu': 'Pati',
        'Tanggal Lahir Ibu (YYYY-MM-DD)': '1975-04-10',
        'Pendidikan Ibu': 'D3 Kebidanan',
        'Pekerjaan Ibu': 'Bidan Mandiri',
        'Penghasilan Ibu': 'Rp 3.000.000 - Rp 5.000.000',
        'No. Telp Ibu': '081398765403',
        'Alamat Ibu': 'Desa Sukolilo RT 03 RW 02, Pati'
      }
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(templateData);

    // Set column widths
    ws['!cols'] = Object.keys(templateData[0]).map(() => ({ wch: 22 }));

    XLSX.utils.book_append_sheet(wb, ws, 'Template Master Santri');
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename="Template_Master_Santri_Qudsiyyah.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Helper: Identifikasi kolom yang masih kosong/kurang pada data santri
function getCatatanKekurangan(s) {
  const missing = [];
  if (!s.nik_santri && !s.nik) missing.push('NIK Santri');
  if (!s.no_kk && !s.kartu_keluarga) missing.push('No. KK');
  if (!s.nama_ayah && !s.wali) missing.push('Nama Ayah/Wali');
  if (!s.no_telp_ayah && !s.no_hp_wali) missing.push('No. HP Wali');
  if (!s.nama_ibu && !s.ibu_kandung) missing.push('Nama Ibu');
  if (!s.kelas) missing.push('Kelas');
  if (!s.kamar_asrama && !s.kamar) missing.push('Kamar');
  if (!s.tempat_lahir || !s.tanggal_lahir) missing.push('TTL');
  if (!s.alamat_siswa && !s.alamat) missing.push('Alamat');
  if (!s.foto_path) missing.push('Pasfoto');

  if (missing.length === 0) return 'Data Lengkap';
  return 'Kurang: ' + missing.join(', ');
}

// Helper: Normalize column names for all 37 fields
function getNormalizedRow(row, isUpdateMode = false) {
  const norm = isUpdateMode ? {} : {
    jenjang: 'MTs',
    program: 'Tahfidz',
    jenis_kelamin: 'P',
    agama: 'Islam',
    golongan_darah: '-',
    anak_ke: 1,
    jumlah_saudara: 1,
    almarhum_ayah: 0,
    almarhumah_ibu: 0
  };

  for (const key of Object.keys(row)) {
    const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    const val = row[key] !== undefined && row[key] !== null ? String(row[key]).trim() : '';

    // Abaikan kolom catatan bantu saat diupload ulang
    if (
      cleanKey.includes('catatankekurangan') ||
      cleanKey.includes('kekurangan') ||
      cleanKey.includes('statuskelengkapan') ||
      cleanKey === 'no' ||
      cleanKey.includes('fototersedia') ||
      cleanKey === 'statussantri'
    ) {
      continue;
    }

    if (cleanKey.includes('noinduk') || cleanKey === 'induk' || cleanKey.includes('nispp') || cleanKey === 'nis') {
      norm.no_induk = val;
      norm.nispp = val;
    } else if (cleanKey.includes('nisn')) {
      norm.nisn = val;
    } else if (cleanKey.includes('namalengkap') || (cleanKey.includes('nama') && !cleanKey.includes('ayah') && !cleanKey.includes('ibu') && !cleanKey.includes('wali'))) {
      norm.nama_lengkap = val;
      norm.nama = val;
    } else if (cleanKey.includes('jenjang') || cleanKey === 'tingkat') {
      if (val) {
        const up = val.toUpperCase();
        if (up.includes('MI')) norm.jenjang = 'MI';
        else if (up.includes('MA') || up.includes('ALIYAH')) norm.jenjang = 'MA';
        else norm.jenjang = 'MTs';
      }
    } else if (cleanKey.includes('kelas') && !cleanKey.includes('ruang')) {
      if (val) norm.kelas = val;
    } else if (cleanKey.includes('ruang') || cleanKey.includes('rombel')) {
      if (val) norm.ruang = val;
    } else if (cleanKey.includes('program') || cleanKey.includes('jurusan')) {
      if (val) {
        const up = val.toLowerCase();
        norm.program = up.includes('kitab') ? 'Kitab' : 'Tahfidz';
      }
    } else if (cleanKey.includes('kamar') || cleanKey.includes('asrama') || cleanKey.includes('pondok')) {
      if (val) {
        norm.kamar_asrama = val;
        norm.kamar = val;
      }
    } else if (cleanKey.includes('niksantri') || cleanKey === 'nik') {
      if (val) {
        norm.nik_santri = val;
        norm.nik = val;
      }
    } else if (cleanKey.includes('tempatlahir') && !cleanKey.includes('ayah') && !cleanKey.includes('ibu')) {
      if (val) norm.tempat_lahir = val;
    } else if (cleanKey.includes('tanggallahir') && !cleanKey.includes('ayah') && !cleanKey.includes('ibu')) {
      if (val) norm.tanggal_lahir = val;
    } else if (cleanKey.includes('gender') || cleanKey.includes('jeniskelamin') || cleanKey === 'jk') {
      if (val) {
        const up = val.toUpperCase();
        norm.jenis_kelamin = up.startsWith('L') ? 'L' : 'P';
      }
    } else if (cleanKey.includes('agama')) {
      if (val) norm.agama = val;
    } else if (cleanKey.includes('golongandarah') || cleanKey.includes('goldar')) {
      if (val) norm.golongan_darah = val;
    } else if (cleanKey.includes('alamatsiswa') || (cleanKey.includes('alamat') && !cleanKey.includes('ayah') && !cleanKey.includes('ibu'))) {
      if (val) {
        norm.alamat_siswa = val;
        norm.alamat = val;
      }
    } else if (cleanKey.includes('anakke')) {
      if (val) norm.anak_ke = parseInt(val) || 1;
    } else if (cleanKey.includes('jumlahsaudara') || cleanKey.includes('jmlsaudara')) {
      if (val) norm.jumlah_saudara = parseInt(val) || 1;
    } else if (cleanKey.includes('nokk') || cleanKey.includes('kartukeluarga')) {
      if (val) {
        norm.no_kk = val;
        norm.kartu_keluarga = val;
      }
    }
    // Ayah
    else if (cleanKey.includes('namaayah') || (cleanKey.includes('wali') && !cleanKey.includes('ibu'))) {
      if (val) {
        norm.nama_ayah = val;
        norm.wali = val;
      }
    } else if (cleanKey.includes('nikayah')) {
      if (val) norm.nik_ayah = val;
    } else if (cleanKey.includes('statusayah') || cleanKey.includes('almarhumayah')) {
      if (val) {
        const up = val.toLowerCase();
        norm.almarhum_ayah = (up.includes('alm') || up.includes('meninggal') || up === '1') ? 1 : 0;
      }
    } else if (cleanKey.includes('tempatlahirayah') || cleanKey.includes('tmplahirayah')) {
      if (val) norm.tempat_lahir_ayah = val;
    } else if (cleanKey.includes('tanggallahirayah') || cleanKey.includes('tgllahirayah')) {
      if (val) norm.tanggal_lahir_ayah = val;
    } else if (cleanKey.includes('pendidikanayah')) {
      if (val) norm.pendidikan_ayah = val;
    } else if (cleanKey.includes('pekerjaanayah')) {
      if (val) norm.pekerjaan_ayah = val;
    } else if (cleanKey.includes('penghasilanayah')) {
      if (val) norm.penghasilan_ayah = val;
    } else if (cleanKey.includes('telpayah') || cleanKey.includes('hpayah') || (cleanKey.includes('wa') && !cleanKey.includes('ibu'))) {
      if (val) {
        norm.no_telp_ayah = val;
        norm.no_hp_wali = val;
      }
    } else if (cleanKey.includes('alamatayah')) {
      if (val) norm.alamat_ayah = val;
    }
    // Ibu
    else if (cleanKey.includes('namaibu') || cleanKey.includes('ibukandung')) {
      if (val) {
        norm.nama_ibu = val;
        norm.ibu_kandung = val;
      }
    } else if (cleanKey.includes('nikibu')) {
      if (val) norm.nik_ibu = val;
    } else if (cleanKey.includes('statusibu') || cleanKey.includes('almarhumahibu') || cleanKey.includes('almarhumibu')) {
      if (val) {
        const up = val.toLowerCase();
        norm.almarhumah_ibu = (up.includes('alm') || up.includes('meninggal') || up === '1') ? 1 : 0;
      }
    } else if (cleanKey.includes('tempatlahiribu') || cleanKey.includes('tmplahiribu')) {
      if (val) norm.tempat_lahir_ibu = val;
    } else if (cleanKey.includes('tanggallahiribu') || cleanKey.includes('tgllahiribu')) {
      if (val) norm.tanggal_lahir_ibu = val;
    } else if (cleanKey.includes('pendidikanibu')) {
      if (val) norm.pendidikan_ibu = val;
    } else if (cleanKey.includes('pekerjaanibu')) {
      if (val) norm.pekerjaan_ibu = val;
    } else if (cleanKey.includes('penghasilanibu')) {
      if (val) norm.penghasilan_ibu = val;
    } else if (cleanKey.includes('telpibu') || cleanKey.includes('hpibu')) {
      if (val) norm.no_telp_ibu = val;
    } else if (cleanKey.includes('alamatibu')) {
      if (val) norm.alamat_ibu = val;
    }
  }

  // Fallbacks
  if (!isUpdateMode) {
    if (!norm.alamat_ayah && norm.alamat_siswa) norm.alamat_ayah = norm.alamat_siswa;
    if (!norm.alamat_ibu && norm.alamat_ayah) norm.alamat_ibu = norm.alamat_ayah;
  }

  return norm;
}

// POST /api/excel/preview - Parse file & validate before saving
router.post('/preview', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Harap upload file Excel atau CSV.' });
    }

    const mode = req.body.mode || req.query.mode || 'create'; // 'create' | 'update'
    const isUpdateMode = mode === 'update';

    const workbook = XLSX.readFile(req.file.path, { raw: false, cellText: true });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false });

    if (!rawData || rawData.length === 0) {
      return res.status(400).json({ success: false, message: 'File kosong atau tidak ada data yang terbaca.' });
    }

    const existingSantriMap = new Map();
    const existingRows = db.prepare('SELECT id, no_induk, nispp, nama_lengkap, nama, jenjang, kelas, kamar_asrama FROM santri WHERE is_deleted = 0').all();
    for (const r of existingRows) {
      if (r.no_induk) existingSantriMap.set(String(r.no_induk).trim(), r);
      if (r.nispp) existingSantriMap.set(String(r.nispp).trim(), r);
    }

    const seenInFile = new Set();
    const parsedRows = [];
    const errors = [];
    let validCount = 0;
    let duplicateDbCount = 0;
    let duplicateFileCount = 0;
    let notFoundCount = 0;
    let invalidCount = 0;

    rawData.forEach((row, index) => {
      const rowNum = index + 2;
      const normalized = getNormalizedRow(row, isUpdateMode);
      const rowErrors = [];

      const identifier = normalized.no_induk || normalized.nispp;
      const name = normalized.nama_lengkap || normalized.nama;

      if (!identifier) {
        rowErrors.push('No. Induk / NIS kosong');
      }

      if (!isUpdateMode && !name) {
        rowErrors.push('Nama santri kosong');
      }

      let isDuplicateDb = false;
      let isDuplicateFile = false;
      let foundInDb = false;
      let dbSantri = null;

      if (identifier) {
        if (existingSantriMap.has(identifier)) {
          foundInDb = true;
          isDuplicateDb = true;
          dbSantri = existingSantriMap.get(identifier);
          duplicateDbCount++;
        } else if (isUpdateMode) {
          notFoundCount++;
          rowErrors.push(`No. Induk "${identifier}" tidak ditemukan di database`);
        }

        if (seenInFile.has(identifier)) {
          isDuplicateFile = true;
          duplicateFileCount++;
          rowErrors.push(`No. Induk duplikat dalam file (baris sebelumnya sudah memakai ${identifier})`);
        } else {
          seenInFile.add(identifier);
        }
      }

      const isValid = rowErrors.length === 0;
      if (isValid) {
        validCount++;
      } else {
        invalidCount++;
        errors.push({
          row: rowNum,
          nispp: identifier || '-',
          nama: name || (dbSantri ? dbSantri.nama_lengkap || dbSantri.nama : '-'),
          reasons: rowErrors
        });
      }

      parsedRows.push({
        rowNum,
        ...normalized,
        no_induk: identifier,
        nispp: identifier,
        nama_lengkap: name || (dbSantri ? dbSantri.nama_lengkap || dbSantri.nama : ''),
        nama: name || (dbSantri ? dbSantri.nama_lengkap || dbSantri.nama : ''),
        isValid,
        foundInDb,
        isDuplicateDb,
        isDuplicateFile,
        dbSantri: dbSantri ? { id: dbSantri.id, nama: dbSantri.nama_lengkap || dbSantri.nama, kelas: dbSantri.kelas, kamar: dbSantri.kamar_asrama } : null,
        errors: rowErrors
      });
    });

    res.json({
      success: true,
      mode,
      summary: {
        totalRows: rawData.length,
        validCount,
        invalidCount,
        foundInDbCount: duplicateDbCount,
        duplicateDbCount,
        duplicateFileCount,
        notFoundCount
      },
      errors,
      preview: parsedRows.slice(0, 50),
      allRows: parsedRows
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memproses file Excel: ' + error.message });
  }
});

// POST /api/excel/import - Commit verified data to database
router.post('/import', (req, res) => {
  try {
    const { rows, mode = 'create', duplicateMode = 'skip' } = req.body;

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Data yang akan diimpor tidak ditemukan.' });
    }

    const isUpdateMode = mode === 'update';

    const insertStmt = db.prepare(`
      INSERT INTO santri (
        no_induk, nispp, nisn, nama_lengkap, nama, jenjang, kelas, ruang, program, kamar_asrama, kamar,
        nik_santri, nik, tempat_lahir, tanggal_lahir, jenis_kelamin, agama, golongan_darah, alamat_siswa, alamat,
        anak_ke, jumlah_saudara, no_kk, kartu_keluarga,
        nama_ayah, wali, nik_ayah, almarhum_ayah, tempat_lahir_ayah, tanggal_lahir_ayah, pendidikan_ayah, pekerjaan_ayah, penghasilan_ayah, no_telp_ayah, no_hp_wali, alamat_ayah,
        nama_ibu, ibu_kandung, nik_ibu, almarhumah_ibu, tempat_lahir_ibu, tanggal_lahir_ibu, pendidikan_ibu, pekerjaan_ibu, penghasilan_ibu, no_telp_ibu, alamat_ibu,
        status, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        'Aktif', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
    `);

    let importedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    const runImport = db.transaction(() => {
      for (const row of rows) {
        const idVal = row.no_induk || row.nispp;
        const nameVal = row.nama_lengkap || row.nama;

        if (!row.isValid || !idVal) {
          skippedCount++;
          continue;
        }

        const existing = db.prepare('SELECT id, nama_lengkap, nama FROM santri WHERE (no_induk = ? OR nispp = ?) AND is_deleted = 0').get(idVal, idVal);

        if (isUpdateMode) {
          // MODE UPDATE / MELENGKAPI DATA (Smart Merge)
          if (!existing) {
            skippedCount++;
            continue;
          }

          const candidateFields = [
            ['nisn', row.nisn],
            ['nama_lengkap', row.nama_lengkap],
            ['nama', row.nama_lengkap || row.nama],
            ['jenjang', row.jenjang],
            ['kelas', row.kelas],
            ['ruang', row.ruang],
            ['program', row.program],
            ['kamar_asrama', row.kamar_asrama],
            ['kamar', row.kamar_asrama || row.kamar],
            ['nik_santri', row.nik_santri],
            ['nik', row.nik_santri || row.nik],
            ['tempat_lahir', row.tempat_lahir],
            ['tanggal_lahir', row.tanggal_lahir],
            ['jenis_kelamin', row.jenis_kelamin],
            ['agama', row.agama],
            ['golongan_darah', row.golongan_darah],
            ['alamat_siswa', row.alamat_siswa],
            ['alamat', row.alamat_siswa || row.alamat],
            ['anak_ke', row.anak_ke],
            ['jumlah_saudara', row.jumlah_saudara],
            ['no_kk', row.no_kk],
            ['kartu_keluarga', row.no_kk || row.kartu_keluarga],
            ['nama_ayah', row.nama_ayah],
            ['wali', row.nama_ayah || row.wali],
            ['nik_ayah', row.nik_ayah],
            ['almarhum_ayah', row.almarhum_ayah],
            ['tempat_lahir_ayah', row.tempat_lahir_ayah],
            ['tanggal_lahir_ayah', row.tanggal_lahir_ayah],
            ['pendidikan_ayah', row.pendidikan_ayah],
            ['pekerjaan_ayah', row.pekerjaan_ayah],
            ['penghasilan_ayah', row.penghasilan_ayah],
            ['no_telp_ayah', row.no_telp_ayah],
            ['no_hp_wali', row.no_telp_ayah || row.no_hp_wali],
            ['alamat_ayah', row.alamat_ayah],
            ['nama_ibu', row.nama_ibu],
            ['ibu_kandung', row.nama_ibu || row.ibu_kandung],
            ['nik_ibu', row.nik_ibu],
            ['almarhumah_ibu', row.almarhumah_ibu],
            ['tempat_lahir_ibu', row.tempat_lahir_ibu],
            ['tanggal_lahir_ibu', row.tanggal_lahir_ibu],
            ['pendidikan_ibu', row.pendidikan_ibu],
            ['pekerjaan_ibu', row.pekerjaan_ibu],
            ['penghasilan_ibu', row.penghasilan_ibu],
            ['no_telp_ibu', row.no_telp_ibu],
            ['alamat_ibu', row.alamat_ibu]
          ];

          const setClauses = [];
          const updateParams = [];

          for (const [col, val] of candidateFields) {
            // Hanya update kolom yang memiliki nilai baru dari Excel (tidak menimpa data lama dengan nilai kosong)
            if (val !== undefined && val !== null && String(val).trim() !== '' && String(val).trim() !== '-') {
              setClauses.push(`${col} = ?`);
              updateParams.push(val);
            }
          }

          if (setClauses.length > 0) {
            setClauses.push('updated_at = CURRENT_TIMESTAMP');
            updateParams.push(existing.id);
            db.prepare(`UPDATE santri SET ${setClauses.join(', ')} WHERE id = ?`).run(...updateParams);
            updatedCount++;
          } else {
            skippedCount++;
          }
        } else {
          // MODE REGISTRASI DATA BARU
          if (existing) {
            if (duplicateMode === 'update') {
              // Jika memilih update saat data baru
              const updateStmt = db.prepare(`
                UPDATE santri SET
                  nisn = ?, nama_lengkap = ?, nama = ?, jenjang = ?, kelas = ?, ruang = ?, program = ?, kamar_asrama = ?, kamar = ?,
                  nik_santri = ?, nik = ?, tempat_lahir = ?, tanggal_lahir = ?, jenis_kelamin = ?, agama = ?, golongan_darah = ?, alamat_siswa = ?, alamat = ?,
                  anak_ke = ?, jumlah_saudara = ?, no_kk = ?, kartu_keluarga = ?,
                  nama_ayah = ?, wali = ?, nik_ayah = ?, almarhum_ayah = ?, tempat_lahir_ayah = ?, tanggal_lahir_ayah = ?, pendidikan_ayah = ?, pekerjaan_ayah = ?, penghasilan_ayah = ?, no_telp_ayah = ?, no_hp_wali = ?, alamat_ayah = ?,
                  nama_ibu = ?, ibu_kandung = ?, nik_ibu = ?, almarhumah_ibu = ?, tempat_lahir_ibu = ?, tanggal_lahir_ibu = ?, pendidikan_ibu = ?, pekerjaan_ibu = ?, penghasilan_ibu = ?, no_telp_ibu = ?, alamat_ibu = ?,
                  updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
              `);
              updateStmt.run(
                row.nisn || '', nameVal, nameVal, row.jenjang || 'MTs', row.kelas || '', row.ruang || '', row.program || 'Tahfidz', row.kamar_asrama || row.kamar || '', row.kamar_asrama || row.kamar || '',
                row.nik_santri || row.nik || '', row.nik_santri || row.nik || '', row.tempat_lahir || '', row.tanggal_lahir || '', row.jenis_kelamin || 'P', row.agama || 'Islam', row.golongan_darah || '-', row.alamat_siswa || row.alamat || '', row.alamat_siswa || row.alamat || '',
                parseInt(row.anak_ke) || 1, parseInt(row.jumlah_saudara) || 1, row.no_kk || row.kartu_keluarga || '', row.no_kk || row.kartu_keluarga || '',
                row.nama_ayah || row.wali || '', row.nama_ayah || row.wali || '', row.nik_ayah || '', parseInt(row.almarhum_ayah) || 0, row.tempat_lahir_ayah || '', row.tanggal_lahir_ayah || '', row.pendidikan_ayah || '', row.pekerjaan_ayah || '', row.penghasilan_ayah || '', row.no_telp_ayah || row.no_hp_wali || '', row.no_telp_ayah || row.no_hp_wali || '', row.alamat_ayah || '',
                row.nama_ibu || row.ibu_kandung || '', row.nama_ibu || row.ibu_kandung || '', row.nik_ibu || '', parseInt(row.almarhumah_ibu) || 0, row.tempat_lahir_ibu || '', row.tanggal_lahir_ibu || '', row.pendidikan_ibu || '', row.pekerjaan_ibu || '', row.penghasilan_ibu || '', row.no_telp_ibu || '', row.alamat_ibu || '',
                existing.id
              );
              updatedCount++;
            } else {
              skippedCount++;
            }
          } else {
            if (!nameVal) {
              skippedCount++;
              continue;
            }
            insertStmt.run(
              idVal, idVal, row.nisn || '', nameVal, nameVal, row.jenjang || 'MTs', row.kelas || '', row.ruang || '', row.program || 'Tahfidz', row.kamar_asrama || row.kamar || '', row.kamar_asrama || row.kamar || '',
              row.nik_santri || row.nik || '', row.nik_santri || row.nik || '', row.tempat_lahir || '', row.tanggal_lahir || '', row.jenis_kelamin || 'P', row.agama || 'Islam', row.golongan_darah || '-', row.alamat_siswa || row.alamat || '', row.alamat_siswa || row.alamat || '',
              parseInt(row.anak_ke) || 1, parseInt(row.jumlah_saudara) || 1, row.no_kk || row.kartu_keluarga || '', row.no_kk || row.kartu_keluarga || '',
              row.nama_ayah || row.wali || '', row.nama_ayah || row.wali || '', row.nik_ayah || '', parseInt(row.almarhum_ayah) || 0, row.tempat_lahir_ayah || '', row.tanggal_lahir_ayah || '', row.pendidikan_ayah || '', row.pekerjaan_ayah || '', row.penghasilan_ayah || '', row.no_telp_ayah || row.no_hp_wali || '', row.no_telp_ayah || row.no_hp_wali || '', row.alamat_ayah || '',
              row.nama_ibu || row.ibu_kandung || '', row.nama_ibu || row.ibu_kandung || '', row.nik_ibu || '', parseInt(row.almarhumah_ibu) || 0, row.tempat_lahir_ibu || '', row.tanggal_lahir_ibu || '', row.pendidikan_ibu || '', row.pekerjaan_ibu || '', row.penghasilan_ibu || '', row.no_telp_ibu || '', row.alamat_ibu || ''
            );
            importedCount++;
          }
        }
      }
    });

    runImport();

    const successMsg = isUpdateMode
      ? `Pembaruan data selesai! ${updatedCount} santri berhasil dilengkapi/diperbarui${skippedCount > 0 ? `, ${skippedCount} dilewati/tidak berubah` : ''}.`
      : `Impor data selesai! ${importedCount} data baru ditambahkan, ${updatedCount} data diperbarui, ${skippedCount} dilewati.`;

    res.json({
      success: true,
      message: successMsg,
      result: {
        importedCount,
        updatedCount,
        skippedCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengimpor data ke database: ' + error.message });
  }
});

// GET /api/excel/export - Export full or filtered santri to Excel (with helper notes for incomplete fields)
router.get('/export', (req, res) => {
  try {
    const { kamar, kamar_asrama, kelas, ruang, jenjang, program, status, filter_status, kelengkapan, has_photo, q } = req.query;
    let conditions = ['is_deleted = 0'];
    let params = [];

    // Filter status kelengkapan
    const filterStatus = filter_status || kelengkapan || '';
    if (filterStatus === 'lengkap') {
      conditions.push(`(
        COALESCE(nik_santri, '') != '' AND 
        COALESCE(kamar_asrama, kamar, '') != '' AND COALESCE(kamar_asrama, kamar, '') != '-' AND 
        COALESCE(kelas, '') != '' AND
        COALESCE(nama_ayah, wali, '') != ''
      )`);
    } else if (filterStatus === 'belum_lengkap') {
      conditions.push(`(
        COALESCE(nik_santri, '') = '' OR 
        COALESCE(kamar_asrama, kamar, '') = '' OR COALESCE(kamar_asrama, kamar, '') = '-' OR 
        COALESCE(kelas, '') = '' OR
        COALESCE(nama_ayah, wali, '') = ''
      )`);
    } else if (filterStatus === 'belum_foto') {
      conditions.push("(foto_path IS NULL OR foto_path = '')");
    }

    if (q) {
      conditions.push('(nama_lengkap LIKE ? OR nama LIKE ? OR no_induk LIKE ? OR nispp LIKE ? OR nisn LIKE ?)');
      const term = `%${q}%`;
      params.push(term, term, term, term, term);
    }

    const kmr = kamar_asrama || kamar;
    if (kmr) {
      conditions.push('(kamar_asrama = ? OR kamar = ?)');
      params.push(kmr, kmr);
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
    if (has_photo === 'yes') {
      conditions.push("foto_path IS NOT NULL AND foto_path != ''");
    } else if (has_photo === 'no') {
      conditions.push("(foto_path IS NULL OR foto_path = '')");
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;
    const santriList = db.prepare(`SELECT * FROM santri ${whereClause} ORDER BY COALESCE(nama_lengkap, nama) ASC`).all(...params);

    const exportRows = santriList.map((s, index) => {
      const catatanKekurangan = getCatatanKekurangan(s);
      return {
        'No': index + 1,
        'No. Induk': s.no_induk || s.nispp || '',
        'Nama Lengkap': s.nama_lengkap || s.nama || '',
        'Catatan Kekurangan': catatanKekurangan,
        'Status Kelengkapan': catatanKekurangan === 'Data Lengkap' ? 'Lengkap' : 'Belum Lengkap',
        'NISN': s.nisn || '',
        'Jenjang': s.jenjang || 'MTs',
        'Kelas': s.kelas || '',
        'Ruang': s.ruang || '',
        'Program': s.program || 'Tahfidz',
        'Kamar Asrama': s.kamar_asrama || s.kamar || '',
        'NIK Santri': s.nik_santri || s.nik || '',
        'Tempat Lahir': s.tempat_lahir || '',
        'Tanggal Lahir': s.tanggal_lahir || '',
        'Jenis Kelamin': s.jenis_kelamin === 'P' ? 'Perempuan' : 'Laki-Laki',
        'Agama': s.agama || 'Islam',
        'Gol. Darah': s.golongan_darah || '-',
        'Alamat Siswa': s.alamat_siswa || s.alamat || '',
        'Anak ke': s.anak_ke || 1,
        'Jumlah Saudara': s.jumlah_saudara || 1,
        'No. KK': s.no_kk || s.kartu_keluarga || '',
        'Nama Ayah': s.nama_ayah || s.wali || '',
        'NIK Ayah': s.nik_ayah || '',
        'Status Ayah': s.almarhum_ayah === 1 ? 'Almarhum' : 'Hidup',
        'Tempat Lahir Ayah': s.tempat_lahir_ayah || '',
        'Tanggal Lahir Ayah': s.tanggal_lahir_ayah || '',
        'Pendidikan Ayah': s.pendidikan_ayah || '',
        'Pekerjaan Ayah': s.pekerjaan_ayah || '',
        'Penghasilan Ayah': s.penghasilan_ayah || '',
        'No. Telp Ayah': s.no_telp_ayah || s.no_hp_wali || '',
        'Alamat Ayah': s.alamat_ayah || '',
        'Nama Ibu': s.nama_ibu || s.ibu_kandung || '',
        'NIK Ibu': s.nik_ibu || '',
        'Status Ibu': s.almarhumah_ibu === 1 ? 'Almarhumah' : 'Hidup',
        'Tempat Lahir Ibu': s.tempat_lahir_ibu || '',
        'Tanggal Lahir Ibu': s.tanggal_lahir_ibu || '',
        'Pendidikan Ibu': s.pendidikan_ibu || '',
        'Pekerjaan Ibu': s.pekerjaan_ibu || '',
        'Penghasilan Ibu': s.penghasilan_ibu || '',
        'No. Telp Ibu': s.no_telp_ibu || '',
        'Alamat Ibu': s.alamat_ibu || '',
        'Status Santri': s.status || 'Aktif',
        'Catatan Medis': s.catatan_medis || '',
        'Foto Tersedia': s.foto_path ? 'Ya' : 'Belum'
      };
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportRows);

    // Set kolom catatan kekurangan lebih lebar agar mudah dibaca di Excel
    ws['!cols'] = [
      { wch: 6 },  // No
      { wch: 14 }, // No. Induk
      { wch: 28 }, // Nama Lengkap
      { wch: 38 }, // Catatan Kekurangan
      { wch: 18 }, // Status Kelengkapan
      { wch: 14 }, // NISN
      { wch: 10 }, // Jenjang
      { wch: 10 }, // Kelas
      { wch: 8 },  // Ruang
      { wch: 12 }, // Program
      { wch: 16 }, // Kamar Asrama
      { wch: 18 }, // NIK Santri
      { wch: 16 }, // Tempat Lahir
      { wch: 14 }, // Tanggal Lahir
      { wch: 14 }, // Jenis Kelamin
      { wch: 10 }, // Agama
      { wch: 10 }, // Gol. Darah
      { wch: 35 }, // Alamat Siswa
      { wch: 8 },  // Anak ke
      { wch: 14 }, // Jumlah Saudara
      { wch: 18 }, // No. KK
      { wch: 24 }, // Nama Ayah
      { wch: 18 }, // NIK Ayah
      { wch: 12 }, // Status Ayah
      { wch: 16 }, // Tempat Lahir Ayah
      { wch: 16 }, // Tanggal Lahir Ayah
      { wch: 16 }, // Pendidikan Ayah
      { wch: 18 }, // Pekerjaan Ayah
      { wch: 20 }, // Penghasilan Ayah
      { wch: 16 }, // No. Telp Ayah
      { wch: 35 }, // Alamat Ayah
      { wch: 24 }, // Nama Ibu
      { wch: 18 }, // NIK Ibu
      { wch: 12 }, // Status Ibu
      { wch: 16 }, // Tempat Lahir Ibu
      { wch: 16 }, // Tanggal Lahir Ibu
      { wch: 16 }, // Pendidikan Ibu
      { wch: 18 }, // Pekerjaan Ibu
      { wch: 20 }, // Penghasilan Ibu
      { wch: 16 }, // No. Telp Ibu
      { wch: 35 }, // Alamat Ibu
      { wch: 12 }, // Status Santri
      { wch: 20 }, // Catatan Medis
      { wch: 14 }  // Foto Tersedia
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Master Santri Qudsiyyah');

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = filterStatus === 'belum_lengkap'
      ? `Data_Santri_Belum_Lengkap_${dateStr}.xlsx`
      : `Data_Santri_Qudsiyyah_${dateStr}.xlsx`;

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
