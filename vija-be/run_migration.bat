@echo off
echo Running QLDM migration...
echo.

REM Thay đổi các thông tin kết nối database của bạn ở đây
set DB_HOST=localhost
set DB_USER=root
set DB_PASS=
set DB_NAME=vija_db

REM Chạy migration
mysql -h %DB_HOST% -u %DB_USER% -p%DB_PASS% %DB_NAME% < migrations/add_dvt_and_currency_to_qldm.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Migration completed successfully!
    echo Added columns: dvt and don_vi_tien_te to qldm table
) else (
    echo.
    echo Migration failed! Please check your database connection.
)

echo.
pause
