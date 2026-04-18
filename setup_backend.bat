@echo off
REM Setup backend environment and download data

REM Ensure you're running from project root
cd /d "%~dp0"

echo [1/4] Creating virtual environment...
python -m venv .venv
if %errorlevel% neq 0 (
    echo Failed to create venv, make sure Python is installed and on PATH.
    goto :end
)

echo [2/4] Activating venv and installing requirements...
call .venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r smart-city-main\backend\requirements.txt

echo [3/4] Downloading and preparing datasets...
python smart-city-main\backend\download_aqi_data.py
python smart-city-main\backend\download_chennai_data.py
python smart-city-main\backend\scripts\geocode_stations.py

echo [4/4] Setup complete.
echo You can now run the backend with:
echo cd smart-city-main\backend
echo ..\.venv\Scripts\python api.py

:end
pause