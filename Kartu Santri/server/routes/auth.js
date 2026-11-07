const express = require('express');
const router = express.Router();
const { db, hashPassword } = require('../db');

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username dan password wajib diisi!' });
    }

    const cleanUser = String(username).trim().toLowerCase();
    const user = db.prepare('SELECT id, nama, username, password_hash, role, created_at FROM pengguna WHERE LOWER(username) = ?').get(cleanUser);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Username tidak ditemukan!' });
    }

    const inputHash = hashPassword(password);
    if (inputHash !== user.password_hash) {
      return res.status(401).json({ success: false, message: 'Password salah!' });
    }

    const userData = {
      id: user.id,
      nama: user.nama,
      username: user.username,
      role: user.role, // 'admin' | 'tu' | 'kesehatan'
      created_at: user.created_at
    };

    res.json({
      success: true,
      message: `Selamat datang, ${user.nama}!`,
      user: userData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/auth/users - List users
router.get('/users', (req, res) => {
  try {
    const users = db.prepare('SELECT id, nama, username, role, created_at FROM pengguna ORDER BY id ASC').all();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/auth/users - Create new user
router.post('/users', (req, res) => {
  try {
    const { nama, username, password, role } = req.body;
    if (!nama || !username || !password || !role) {
      return res.status(400).json({ success: false, message: 'Nama, username, password, dan role wajib diisi!' });
    }

    const allowedRoles = ['admin', 'tu', 'kesehatan'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Role tidak valid! Pilih: admin, tu, atau kesehatan.' });
    }

    const cleanUser = String(username).trim().toLowerCase();
    const existing = db.prepare('SELECT id FROM pengguna WHERE LOWER(username) = ?').get(cleanUser);
    if (existing) {
      return res.status(400).json({ success: false, message: `Username "${cleanUser}" sudah digunakan.` });
    }

    const passHash = hashPassword(password);
    const result = db.prepare('INSERT INTO pengguna (nama, username, password_hash, role) VALUES (?, ?, ?, ?)').run(
      nama.trim(),
      cleanUser,
      passHash,
      role
    );

    const newUser = db.prepare('SELECT id, nama, username, role, created_at FROM pengguna WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, message: 'Pengguna baru berhasil ditambahkan.', data: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/auth/users/:id - Delete user
router.delete('/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const user = db.prepare('SELECT id, username, role FROM pengguna WHERE id = ?').get(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
    }

    if (user.username === 'admin') {
      return res.status(400).json({ success: false, message: 'Akun Super Admin utama tidak boleh dihapus.' });
    }

    db.prepare('DELETE FROM pengguna WHERE id = ?').run(id);
    res.json({ success: true, message: `Pengguna "${user.username}" berhasil dihapus.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/auth/users/:id - Update user (nama, role, and/or new password)
router.put('/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { nama, role, password } = req.body;

    const user = db.prepare('SELECT id, username, role FROM pengguna WHERE id = ?').get(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
    }

    if (!nama || !nama.trim()) {
      return res.status(400).json({ success: false, message: 'Nama lengkap wajib diisi!' });
    }

    const updates = ['nama = ?'];
    const params = [nama.trim()];

    // Super Admin role cannot be changed
    if (role && user.username !== 'admin') {
      const allowedRoles = ['admin', 'tu', 'kesehatan'];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ success: false, message: 'Role tidak valid! Pilih: admin, tu, atau kesehatan.' });
      }
      updates.push('role = ?');
      params.push(role);
    }

    // Optional password reset
    if (password && String(password).trim().length > 0) {
      if (String(password).trim().length < 4) {
        return res.status(400).json({ success: false, message: 'Password minimal 4 karakter!' });
      }
      updates.push('password_hash = ?');
      params.push(hashPassword(String(password).trim()));
    }

    params.push(id);
    db.prepare(`UPDATE pengguna SET ${updates.join(', ')} WHERE id = ?`).run(...params);

    const updatedUser = db.prepare('SELECT id, nama, username, role, created_at FROM pengguna WHERE id = ?').get(id);
    res.json({ success: true, message: `Data akun "${user.username}" berhasil diperbarui.`, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
