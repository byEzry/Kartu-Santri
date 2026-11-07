const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { uploadsDir } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// Enable CORS for multi-computer network access
app.use(cors({
  origin: CORS_ORIGIN === '*' ? '*' : CORS_ORIGIN.split(',').map(s => s.trim()),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static serving for uploaded files (photos, backgrounds, logos)
app.use('/uploads', express.static(uploadsDir, {
  maxAge: '1d',
  setHeaders: (res, path) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
}));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/santri', require('./routes/santri'));
app.use('/api/excel', require('./routes/excel'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/photos', require('./routes/photos'));
app.use('/api/backup', require('./routes/backup'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Generator Kartu Santri & Mahrom',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend build if client/dist exists
const clientDist = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    }
  }));
  app.use((req, res, next) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      return res.sendFile(path.join(clientDist, 'index.html'));
    }
    next();
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).json({ success: false, message: err.message || 'Terjadi kesalahan pada server.' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(` Generator Kartu Santri & Mahrom Server Aktif!`);
  console.log(` Port: ${PORT}`);
  console.log(` Lokal: http://localhost:${PORT}`);
  console.log(` Multi-Komputer / LAN: http://<IP-KOMPUTER>:${PORT}`);
  console.log(`====================================================`);
});
