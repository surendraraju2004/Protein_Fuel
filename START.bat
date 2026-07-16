@echo off
title NutriBite - Setup & Run
color 0A

echo.
echo  =============================================
echo   NUTRIBITE - Full Stack Setup ^& Launch
echo  =============================================
echo.

REM Add nodejs to PATH for this session
SET "NODEJS=C:\Program Files\nodejs"
SET "PATH=%NODEJS%;%PATH%"

REM Check Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo  [!] Node.js not found at C:\Program Files\nodejs
    echo  [!] Please run INSTALL_NODE.bat first, then restart.
    start https://nodejs.org/en/download
    pause
    exit /b 1
)

echo  Node.js: && node -v
echo  npm:     && npm -v
echo.

echo  [1/4] Installing Backend dependencies...
cd /d "%~dp0backend"
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo  [!] Backend install failed!
    pause
    exit /b 1
)
echo  Backend OK!

echo.
echo  [2/4] Installing Frontend dependencies...
cd /d "%~dp0frontend"
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo  [!] Frontend install failed!
    pause
    exit /b 1
)
echo  Frontend OK!

echo.
echo  [3/4] Seeding Database...
cd /d "%~dp0backend"
REM Uncomment below to seed demo products/users on first run:
REM call node seed/seedData.js

echo  [i] To seed demo data, uncomment seed line in START.bat
echo.

echo  [4/4] Starting NutriBite servers...
echo.

REM Start backend
start "NutriBite - Backend  :5000" cmd /k "SET PATH=C:\Program Files\nodejs;%PATH% && cd /d "%~dp0backend" && node -e "console.log('Backend starting...')" && npm run dev"

REM Short wait before frontend
timeout /t 3 /nobreak >nul

REM Start frontend
start "NutriBite - Frontend :5173" cmd /k "SET PATH=C:\Program Files\nodejs;%PATH% && cd /d "%~dp0frontend" && npm run dev"

REM Open browser after 4s
timeout /t 4 /nobreak >nul
start http://localhost:5173

echo.
echo  =============================================
echo   NutriBite is LIVE!
echo.
echo   Frontend  ->  http://localhost:5173
echo   Backend   ->  http://localhost:5000
echo   API Docs  ->  http://localhost:5000/api
echo.
echo   Admin:  admin@nutribite.in / Admin@123
echo   User:   arjun@example.com  / User@123
echo  =============================================
echo.
pause
