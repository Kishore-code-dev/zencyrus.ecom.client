@echo off
title Zencyrus E-Commerce - Demo Launcher
echo.
echo ========================================
echo   Zencyrus E-Commerce Demo
echo   Free UI Preview - No Login Required
echo ========================================
echo.
echo Starting development server...
cd /d "D:\zencyrus.ecom.client"
start "" cmd /c "npm run dev"
timeout /t 5 >nul
echo.
echo Opening demo in browser...
start "" "https://localhost:3000/"
echo.
echo Demo is running at: https://localhost:3000/
echo.
echo Press any key to close this window...
pause >nul
