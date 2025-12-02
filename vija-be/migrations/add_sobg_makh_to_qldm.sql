-- Migration: Thêm cột so_bg và ma_kh vào bảng qldm
-- Ngày: 2024-12-02

-- Thêm cột so_bg
ALTER TABLE qldm ADD COLUMN so_bg VARCHAR(50) AFTER ma_bv;

-- Thêm cột ma_kh
ALTER TABLE qldm ADD COLUMN ma_kh VARCHAR(50) AFTER so_bg;

-- Kiểm tra kết quả
DESCRIBE qldm;
SELECT * FROM qldm LIMIT 5;
