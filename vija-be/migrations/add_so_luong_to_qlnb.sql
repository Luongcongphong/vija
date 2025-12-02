-- Migration: Thêm cột so_luong vào bảng qlnb
-- Ngày: 2024-12-02

-- Thêm cột so_luong
ALTER TABLE qlnb ADD COLUMN so_luong INT DEFAULT 0 AFTER ma_bv;

-- Kiểm tra kết quả
DESCRIBE qlnb;
SELECT * FROM qlnb LIMIT 5;
