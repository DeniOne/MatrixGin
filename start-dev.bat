@echo off
echo ========================================
echo Starting Matrix_Gin Development Server
echo ========================================
echo.

REM Change to project directory
cd /d "%~dp0"

REM Kill existing Node.js processes on ports 3000 and 5173
echo [0/4] Stopping existing servers...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
    echo Killing backend process (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do (
    echo Killing frontend process (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
)
echo Cleanup complete.
echo.

REM Run database seed to ensure admin exists (optional)
echo [1/4] Checking database seed...
cd backend
call npx prisma db seed >nul 2>&1 || echo Seed skipped.
cd ..
echo.

REM Wait 1 second
timeout /t 1 /nobreak > nul

REM Start Backend in new window
echo [2/4] Starting Backend...
cd backend
start "Matrix_Gin Backend" cmd /k "npm run dev"
cd ..

REM Wait 3 seconds for backend to initialize
timeout /t 3 /nobreak > nul

REM Start Frontend in new window
echo [3/4] Starting Frontend...
cd frontend
start "Matrix_Gin Frontend" cmd /k "npm run dev"
cd ..

echo.
echo ========================================
echo [4/4] Both servers are running!
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
echo ========================================
echo.
echo Admin credentials:
echo Email: admin@photomatrix.ru
echo Password: Admin123!
echo.
echo Press any key to close this window (servers will keep running)
pause > nul
