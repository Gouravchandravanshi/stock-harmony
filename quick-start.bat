@echo off
REM Stock Harmony - Quick Start Script for Windows

echo =========================================
echo Stock Harmony - Quick Start Setup
echo =========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed. Please install Node.js first.
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo Node.js found: %NODE_VERSION%
echo.

REM Setup Backend
echo =========================================
echo Setting up Backend...
echo =========================================
cd backend

if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
) else (
    echo Backend dependencies already installed
)

if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
    echo Edit backend\.env to configure MongoDB URI if needed
) else (
    echo .env file already exists
)

echo.
echo Backend setup complete!
echo.

REM Setup Frontend
echo =========================================
echo Setting up Frontend...
echo =========================================
cd ..

if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
) else (
    echo Frontend dependencies already installed
)

if not exist ".env.local" (
    echo Creating .env.local file from template...
    copy .env.example .env.local
    echo Edit .env.local to configure API URL if needed
) else (
    echo .env.local file already exists
)

echo.
echo =========================================
echo Setup Complete!
echo =========================================
echo.
echo To start the application:
echo.
echo 1. Terminal 1 - Start Backend:
echo    cd backend ^&^& npm run dev
echo.
echo 2. Terminal 2 - Start Frontend:
echo    npm run dev
echo.
echo Then:
echo - Backend will run on: http://localhost:5000
echo - Frontend will run on: http://localhost:5173
echo.
echo To seed initial data ^(backend only^):
echo    cd backend ^&^& npm run seed
echo.
echo =========================================
echo.
pause
