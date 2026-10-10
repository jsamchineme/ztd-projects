@echo off
REM Serve Mapboard on http://localhost:8080 (change the port with: start.bat 3000)
set PORT=%1
if "%PORT%"=="" set PORT=8080
cd /d "%~dp0"
echo Mapboard is running at http://localhost:%PORT%  (press Ctrl+C to stop)
where py >nul 2>nul && (py -3 -m http.server %PORT% --bind 127.0.0.1 & goto :eof)
where python >nul 2>nul && (python -m http.server %PORT% --bind 127.0.0.1 & goto :eof)
where npx >nul 2>nul && (npx --yes serve@14.2.4 -l tcp://127.0.0.1:%PORT% . & goto :eof)
echo Install Python 3 or Node.js, or simply open index.html in your browser.
