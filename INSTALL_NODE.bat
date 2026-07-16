@echo off
title NutriBite - Install Node.js
color 0E

echo.
echo  =============================================
echo   NUTRIBITE - Node.js Installer
echo  =============================================
echo.
echo  Node.js is required to run NutriBite.
echo  This script will download and install it.
echo.

REM Check if winget is available (Windows 10 v1709+)
where winget >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo  Found winget! Installing Node.js LTS...
    winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
    echo.
    echo  Node.js installed! Now run START.bat to launch NutriBite.
    pause
    exit /b 0
)

echo  Winget not found. Trying Chocolatey...
where choco >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo  Found Chocolatey! Installing Node.js...
    choco install nodejs-lts -y
    echo  Node.js installed! Now run START.bat to launch NutriBite.
    pause
    exit /b 0
)

echo.
echo  =============================================
echo   MANUAL INSTALLATION REQUIRED
echo  =============================================
echo.
echo  Please install Node.js manually:
echo.
echo  1. Go to:  https://nodejs.org/en/download
echo  2. Download the "LTS" version for Windows
echo  3. Run the installer (keep all defaults)
echo  4. Restart your terminal/CMD
echo  5. Run START.bat to launch NutriBite
echo.
echo  Opening download page now...
start https://nodejs.org/en/download

pause
