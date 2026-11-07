@echo off
title Generator Kartu Santri dan Mahrom
color 0A

:: Pastikan selalu bekerja di direktori file ini berada
cd /d "%~dp0"

echo ================================================================
echo       GENERATOR KARTU SANTRI DAN MAHROM - SIM PESANTREN
echo ================================================================
echo.
echo Sedang memeriksa lingkungan kerja komputer...

REM Tambahkan Node.js ke PATH jika belum terdaftar
set "PATH=C:\Program Files\nodejs;C:\Program Files (x86)\nodejs;%PATH%"

where node >nul 2>nul
if %errorlevel% equ 0 goto :node_ok

echo.
echo ================================================================
echo [PERHATIAN] Node.js belum terinstall di laptop/komputer ini!
echo ================================================================
echo Aplikasi ini membutuhkan Node.js (gratis dan ringan).
echo.
echo Membuka halaman unduh Node.js di browser anda...
start https://nodejs.org/en/download
echo.
echo Silakan install Node.js versi LTS dari situs tersebut.
echo Setelah selesai, silakan buka kembali file ini.
echo.
pause
exit /b 1

:node_ok
echo.
echo [1/2] Membuka aplikasi di browser (http://localhost:5000)...
start "" http://localhost:5000/

echo [2/2] Menjalankan server aplikasi...
echo.
echo ================================================================
echo  SERVER AKTIF DAN BERJALAN!
echo  * Jangan tutup jendela hitam (CMD) ini selama memakai aplikasi.
echo  * Buka http://localhost:5000 di browser jika tidak otomatis buka.
echo  * Tutup jendela ini (atau tekan Ctrl+C) jika sudah selesai.
echo ================================================================
echo.

node server/index.js

pause
