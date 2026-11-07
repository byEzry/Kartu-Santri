@echo off
title Pasang Shortcut Desktop - Aplikasi Kartu Santri
color 0B

cd /d "%~dp0"

echo ================================================================
echo      MEMBUAT SHORTCUT APLIKASI KARTU SANTRI DI DESKTOP
echo ================================================================
echo.
echo Sedang mendeteksi folder Desktop Windows...

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ws = New-Object -ComObject WScript.Shell; " ^
  "$desktop = [Environment]::GetFolderPath('Desktop'); " ^
  "$lnkPath = Join-Path $desktop 'Aplikasi Kartu Santri.lnk'; " ^
  "if (Test-Path $lnkPath) { Remove-Item $lnkPath -Force }; " ^
  "$targetBat = Join-Path '%~dp0' 'JALANKAN_APLIKASI.bat'; " ^
  "$iconPath = Join-Path '%~dp0' 'app-icon-hd.ico'; " ^
  "if (-not (Test-Path $iconPath)) { $iconPath = Join-Path '%~dp0' 'app-icon.ico' }; " ^
  "$s = $ws.CreateShortcut($lnkPath); " ^
  "$s.TargetPath = $targetBat; " ^
  "$s.WorkingDirectory = '%~dp0'; " ^
  "if (Test-Path $iconPath) { $s.IconLocation = \"$iconPath,0\" }; " ^
  "$s.Description = 'Aplikasi Kartu Santri & Mahrom - SIM Pesantren'; " ^
  "$s.Save(); " ^
  "$type = '[DllImport(\"shell32.dll\")] public static extern void SHChangeNotify(int w, uint u, IntPtr p1, IntPtr p2);'; " ^
  "Add-Type -MemberDefinition $type -Name 'ShellUtil' -Namespace 'Win32' -ErrorAction SilentlyContinue; " ^
  "[Win32.ShellUtil]::SHChangeNotify(0x08000000, 0x0000, [IntPtr]::Zero, [IntPtr]::Zero); " ^
  "Write-Host 'Shortcut berhasil dibuat di: ' $lnkPath -ForegroundColor Green"

if %errorlevel% equ 0 (
    echo.
    echo ================================================================
    echo  BERHASIL! 
    echo  Ikon resmi "Aplikasi Kartu Santri" sudah terpasang jernih di Desktop.
    echo  Anda sekarang bisa menjalankan aplikasi langsung dari Desktop.
    echo ================================================================
) else (
    echo.
    echo [Gagal membuat shortcut secara otomatis]
)

echo.
echo Tekan tombol apa saja untuk menutup jendela ini...
pause >nul
