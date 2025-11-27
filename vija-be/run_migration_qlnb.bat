@echo off
echo ========================================
echo Migration: Update QLNB so_bg to ma_po
echo ========================================
echo.

REM Đọc thông tin từ .env
for /f "tokens=1,2 delims==" %%a in ('type .env ^| findstr /v "^#"') do (
    if "%%a"=="DB_HOST" set DB_HOST=%%b
    if "%%a"=="DB_USER" set DB_USER=%%b
    if "%%a"=="DB_PASSWORD" set DB_PASSWORD=%%b
    if "%%a"=="DB_NAME" set DB_NAME=%%b
)

echo Connecting to database: %DB_NAME%
echo Host: %DB_HOST%
echo User: %DB_USER%
echo.

REM Chạy migration
mysql -h %DB_HOST% -u %DB_USER% -p%DB_PASSWORD% %DB_NAME% < migrations\update_qlnb_so_bg_to_ma_po.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Migration completed successfully!
    echo ========================================
) else (
    echo.
    echo ========================================
    echo Migration failed! Error code: %ERRORLEVEL%
    echo ========================================
)

echo.
pause
