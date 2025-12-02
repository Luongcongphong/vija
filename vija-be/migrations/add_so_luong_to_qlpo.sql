-- Migration: Thêm cột so_luong vào bảng qlpo
-- Ngày: 2024-12-02

-- Thêm cột so_luong
ALTER TABLE qlpo ADD COLUMN so_luong INT DEFAULT 0 AFTER ma_bv;

-- Kiểm tra kết quả
DESCRIBE qlpo;
SELECT * FROM qlpo LIMIT 5;
