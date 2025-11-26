@echo off
echo Fixing QLPO table...
echo.

REM Thay đổi đường dẫn MySQL nếu cần
set MYSQL_PATH="C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"

REM Nếu MySQL ở đường dẫn khác, sửa dòng trên
REM Hoặc nếu MySQL đã có trong PATH, dùng dòng dưới:
REM set MYSQL_PATH=mysql

%MYSQL_PATH% -u vija -pvija@2024 vija < check_and_fix_qlpo.sql

echo.
echo Done! Press any key to exit...
pause
