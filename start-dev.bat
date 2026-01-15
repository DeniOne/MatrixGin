@echo off
echo ========================================
echo Starting Matrix_Gin Development Servers
echo ========================================
echo.

REM Change to project directory
cd /d "%~dp0"

REM Kill existing Node.js processes on ports 3000, 3002 and 5173
echo [0/5] Stopping existing servers...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
    echo Killing backend process on 3000 (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3002" ^| findstr "LISTENING"') do (
    echo Killing system-registry process on 3002 (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do (
    echo Killing frontend process on 5173 (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
)
echo Cleanup complete.
echo.

REM Run database seed to ensure admin exists (optional)
echo [1/5] Checking database seed...
cd backend
call npx prisma db seed >nul 2>&1 || echo Seed skipped.
cd ..
echo.

REM Wait 1 second
timeout /t 1 /nobreak > nul

REM Start Main Backend in new window
echo [2/5] Starting Main Backend (port 3000)...
cd backend
start "Matrix_Gin Backend (3000)" cmd /k "npm run dev"
cd ..

REM Wait 2 seconds for main backend to initialize
timeout /t 2 /nobreak > nul

REM Start System Registry Service in new window
echo [3/5] Starting System Registry Service (port 3002)...
cd services\system-registry
start "System Registry (3002)" cmd /k "npm run dev"
cd ..\..

REM Wait 3 seconds for backends to initialize
timeout /t 3 /nobreak > nul

REM Start Frontend in new window
echo [4/5] Starting Frontend (port 5173)...
cd frontend
start "Matrix_Gin Frontend (5173)" cmd /k "npm run dev"
cd ..

echo.
echo ========================================
echo [5/5] All servers are running!
echo ----------------------------------------
echo Main Backend:      http://localhost:3000
echo System Registry:   http://localhost:3002
echo Frontend:          http://localhost:5173
echo ========================================
echo.
echo Admin credentials:
echo Email: admin@photomatrix.ru
echo Password: Admin123!
echo.
echo Press any key to close this window (servers will keep running)
pause > nul

