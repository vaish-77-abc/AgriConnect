@echo off
title AgriConnect Launcher
echo ============================================================
echo           Starting AgriConnect Full-Stack App
echo ============================================================

echo [1/2] Launching FastAPI Backend on http://127.0.0.1:8000...
start "AgriConnect Backend" cmd /k "cd /d %~dp0backend && .\venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000"

timeout /t 2 >nul

echo [2/2] Launching React Frontend on http://localhost:5173...
start "AgriConnect Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo ============================================================
echo Both Backend and Frontend are starting up!
echo Open your browser at: http://localhost:5173
echo ============================================================
