@echo off
echo Running QLDM migration...

REM Đọc thông tin database từ .env
for /f "tokens=2 delims==" %%a in ('findstr "DB_HOST" .env') do set DB_HOST=%%a
for /f "tokens=2 delims==" %%a in ('findstr "DB_USER" .env') do set DB_USER=%%a
for /f "tokens=2 delims==" %%a in ('findstr "DB_PASSWORD" .env') do set DB_PASSWORD=%%a
for /f "tokens=2 delims==" %%a in ('findstr "DB_NAME" .env') do set DB_NAME=%%a

echo Connecting to database: %DB_HOST%
echo Database: %DB_NAME%
echo User: %DB_USER%

REM Chạy migration
mysql -h %DB_HOST% -u %DB_USER% -p%DB_PASSWORD% %DB_NAME% < migrations/add_missing_columns_to_qldm.sql

if %errorlevel% equ 0 (
    echo Migration completed successfully!
) else (
    echo Migration failed!
)

pause