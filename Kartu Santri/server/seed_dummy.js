const { db } = require('./db');

console.log('Seeding 850 authentic santriwati dummy records for Qudsiyyah Putri...');

// Clear old records
db.prepare('DELETE FROM riwayat_cetak').run();
db.prepare('DELETE FROM santri').run();

const insertSantri = db.prepare(`
  INSERT INTO santri (
    no_induk, nispp, nisn, nama_lengkap, nama, jenjang, kelas, ruang, program, kamar_asrama, kamar,
    nik_santri, tempat_lahir, tanggal_lahir, jenis_kelamin, agama, golongan_darah, alamat_siswa, alamat,
    anak_ke, jumlah_saudara, no_kk,
    nama_ayah, nik_ayah, almarhum_ayah, tempat_lahir_ayah, tanggal_lahir_ayah, pendidikan_ayah, pekerjaan_ayah, penghasilan_ayah, no_telp_ayah, alamat_ayah, wali, no_hp_wali,
    nama_ibu, nik_ibu, almarhumah_ibu, tempat_lahir_ibu, tanggal_lahir_ibu, pendidikan_ibu, pekerjaan_ibu, penghasilan_ibu, no_telp_ibu, alamat_ibu,
    foto_path, status, created_at, updated_at
  ) VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?, ?, ?,
    ?, ?, ?,
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?
  )
`);

const firstNames = [
  'Fathimah', 'Nabilah', 'Aisyah', 'Zulfa', 'Maryam', 'Khadijah', 'Safira', 'Salma', 'Najwa',
  'Zahratun', 'Hilyatul', 'Durrotul', 'Wardah', 'Syifa', 'Annisa', 'Laila', 'Farah', 'Hana',
  'Qonita', 'Mufida', 'Zakiyya', 'Rif\'atun', 'Naila', 'Alya', 'Bilqis', 'Alfi', 'Nada',
  'Nafisah', 'Rahmatika', 'Maulida', 'Fitriana', 'Khansa', 'Hasna', 'Rania', 'Salwa', 'Tasneem'
];

const middleNames = [
  'Az-Zahra', 'Syarifah', 'Nurul', 'Zakiyyatunnisa', 'Nailaturrahmah', 'Al-Kubro', 'Mumtaza',
  'Hanifah', 'Khairunnisa', 'Nida', 'Aulia', 'Hikmah', 'Fauziyyah', 'Rahadatul', 'Amalia',
  'Karimah', 'Sholihatun', 'Husna', 'Kamila', 'Maghfirah', 'Mawaddah', 'Salsabila', 'Nadia'
];

const lastNames = [
  'Qurrata Aini', 'Hikmah', 'Maulida', 'Hasanah', 'Fitriana', 'Rasyidah', 'Nabila', 'Muna',
  'Wahyuni', 'Lestari', 'Salsabila', 'Munawaroh', 'Azizah', 'Mahmudah', 'Adawiyah', 'Rosyidah',
  'Kusuma', 'Kurniawati', 'Hidayati', 'Rahmawati', 'Anggraini', 'Dewi'
];

const rooms = [
  'Khadijah 01', 'Khadijah 02', 'Khadijah 03',
  'Aisyah 01', 'Aisyah 02', 'Aisyah 03',
  'Fathimah 01', 'Fathimah 02', 'Fathimah 03',
  'Zainab 01', 'Zainab 02',
  'Hafshah 01', 'Hafshah 02'
];

const cities = ['Kudus', 'Pati', 'Demak', 'Jepara', 'Semarang', 'Rembang', 'Grobogan', 'Blora'];
const bloodTypes = ['A', 'B', 'AB', 'O'];

const totalTarget = 850;
const incompleteTarget = 135; // index >= 715
const sampleWithPhotoTarget = 15; // only first 15 have sample photo, others show profile icon

const insertMany = db.transaction(() => {
  for (let i = 1; i <= totalTarget; i++) {
    const idx = i - 1;
    const isComplete = idx < (totalTarget - incompleteTarget); // first 715 are complete
    const hasPhoto = idx < sampleWithPhotoTarget; // only first 15 have photo, others null

    const fn = firstNames[(i * 7) % firstNames.length];
    const mn = middleNames[(i * 11) % middleNames.length];
    const ln = lastNames[(i * 13) % lastNames.length];
    const namaLengkap = `${fn} ${mn} ${ln}`;
    const nispp = `202601${String(i).padStart(3, '0')}`;
    const nisn = `008${String(1000000 + i)}`;

    // Jenjang & Kelas distribution
    let jenjang, kelas, ruang;
    if (i <= 130) {
      jenjang = 'MI';
      kelas = 'VI';
      ruang = ['A', 'B', 'C'][i % 3];
    } else if (i <= 580) {
      jenjang = 'MTs';
      kelas = ['VII', 'VIII', 'IX'][i % 3];
      ruang = ['A', 'B', 'C', 'D'][i % 4];
    } else {
      jenjang = 'MA';
      kelas = ['X', 'XI', 'XII'][i % 3];
      ruang = ['A', 'B', 'C'][i % 3];
    }

    const program = (i % 2 === 0) ? 'Tahfidz' : 'Kitab';
    const city = cities[i % cities.length];
    const goldar = bloodTypes[i % bloodTypes.length];
    const room = rooms[i % rooms.length];

    let nikSantri = `3319${String(100000000000 + i)}`;
    let kamar = room;
    let kamarAsrama = room;
    let namaAyah = `H. ${firstNames[(i * 5) % firstNames.length]} ${lastNames[(i * 3) % lastNames.length]}`;
    let wali = namaAyah;
    let noHpWali = `08123456${String(1000 + i).slice(-4)}`;
    let alamat = `Desa Kauman RT 0${(i % 5) + 1} RW 0${(i % 4) + 1}, ${city}`;

    // For incomplete records (exactly 135 records: index 715 to 849)
    if (!isComplete) {
      const type = idx % 3;
      if (type === 0) {
        nikSantri = ''; // missing NIK
      } else if (type === 1) {
        wali = ''; // missing wali & phone
        noHpWali = '';
        namaAyah = '';
      } else {
        kamar = '-'; // missing room
        kamarAsrama = '-';
      }
    }

    const fotoPath = hasPhoto ? '/avatar-profile.jpg' : null;
    const createdAt = new Date(Date.now() - (850 - i) * 3600000).toISOString().replace('T', ' ').slice(0, 19);

    insertSantri.run(
      nispp, nispp, nisn, namaLengkap, namaLengkap, jenjang, kelas, ruang, program, kamarAsrama, kamar,
      nikSantri, city, '2008-05-15', 'P', 'Islam', goldar, alamat, alamat,
      1, 3, '3319010101080001',
      namaAyah, '3319011205750001', 0, city, '1975-05-12', 'S1 Pendidikan', 'Wiraswasta', 'Rp 3.000.000 - Rp 5.000.000', noHpWali, alamat, wali, noHpWali,
      'Hj. Siti Aminah', '3319015508780002', 0, city, '1978-08-15', 'SMA / MA', 'Ibu Rumah Tangga', '-', noHpWali, alamat,
      fotoPath, 'Aktif', createdAt, createdAt
    );
  }
});

insertMany();

// Insert sample riwayat_cetak
const insertRiwayat = db.prepare(`
  INSERT INTO riwayat_cetak (santri_id, jenis_kartu, mode_cetak, petugas, tanggal_cetak)
  VALUES (?, ?, ?, ?, ?)
`);

const topSantris = db.prepare('SELECT id, nama_lengkap FROM santri ORDER BY id ASC LIMIT 10').all();
if (topSantris.length > 0) {
  insertRiwayat.run(topSantris[0].id, 'Santri', 'Cetak Langsung PVC', 'Admin TU', new Date().toISOString());
  insertRiwayat.run(topSantris[0].id, 'Mahrom', 'Cetak Langsung PVC', 'Admin TU', new Date().toISOString());
  insertRiwayat.run(topSantris[1].id, 'Santri', 'Kertas A4 (Isi 8)', 'Staf TU', new Date(Date.now() - 3600000 * 2).toISOString());
  insertRiwayat.run(topSantris[2].id, 'Mahrom', 'Cetak Langsung PVC', 'Admin TU', new Date(Date.now() - 3600000 * 5).toISOString());
  insertRiwayat.run(topSantris[3].id, 'Santri', 'Kertas A4 (Isi 4)', 'Admin TU', new Date(Date.now() - 3600000 * 24).toISOString());
  insertRiwayat.run(topSantris[4].id, 'Santri', 'Cetak Langsung PVC', 'Admin TU', new Date(Date.now() - 3600000 * 48).toISOString());
}

console.log('Seeding completed successfully!');
console.log('Total Santri:', db.prepare('SELECT COUNT(*) as c FROM santri').get().c);
console.log('With Photo:', db.prepare("SELECT COUNT(*) as c FROM santri WHERE foto_path IS NOT NULL AND foto_path != ''").get().c);
console.log('Without Photo:', db.prepare("SELECT COUNT(*) as c FROM santri WHERE foto_path IS NULL OR foto_path = ''").get().c);
console.log('Incomplete Data:', db.prepare(`
  SELECT COUNT(*) as c FROM santri 
  WHERE COALESCE(nik_santri, '') = '' OR 
        COALESCE(kamar_asrama, kamar, '') = '' OR COALESCE(kamar_asrama, kamar, '') = '-' OR 
        COALESCE(kelas, '') = '' OR
        COALESCE(nama_ayah, wali, '') = ''
`).get().c);
