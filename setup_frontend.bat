@echo off
REM Setup frontend dependencies
cd /d "%~dp0\smart-city-main\frontend"

echo [1/2] Installing npm packages...
call npm install

echo [2/2] Frontend ready. 
echo Run "npm run dev" to start the development server.

pause