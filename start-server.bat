@echo off
echo ============================================
echo   Yuresh Portfolio - Development Server
echo ============================================
echo.
echo Starting Vite dev server...
echo.
echo   Portfolio: http://localhost:3000
echo   Admin:     http://localhost:3000/admin.html
echo.
echo Press Ctrl+C to stop.
echo ============================================
echo.
cd /d "%~dp0"
SET PATH=C:\Program Files\nodejs;%PATH%
powershell -ExecutionPolicy RemoteSigned -Command "npm run dev"
