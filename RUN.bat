@echo off
title NutriBite - Quick Start
color 0A

echo.
echo  NutriBite Quick Start
echo  (Dependencies must already be installed - run START.bat first)
echo.

SET "PATH=C:\Program Files\nodejs;%PATH%"

start "NutriBite - Backend  :5000" cmd /k "SET PATH=C:\Program Files\nodejs;%PATH% && cd /d "%~dp0backend" && npm run dev"
timeout /t 3 /nobreak >nul
start "NutriBite - Frontend :5173" cmd /k "SET PATH=C:\Program Files\nodejs;%PATH% && cd /d "%~dp0frontend" && npm run dev"
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo  Both servers started! Browser opening at http://localhost:5173
echo.
pause
