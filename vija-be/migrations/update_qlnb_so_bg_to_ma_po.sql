-- Migration: Thay đổi cột so_bg thành ma_po trong bảng qlnb
-- Ngày: 2024-11-27

-- Bước 1: Thêm cột ma_po mới
ALTER TABLE qlnb ADD COLUMN ma_po VARCHAR(50) AFTER id;

-- Bước 2: Copy dữ liệu từ so_bg sang ma_po
UPDATE qlnb SET ma_po = so_bg;

-- Bước 3: Xóa cột so_bg cũ
ALTER TABLE qlnb DROP COLUMN so_bg;

-- Bước 4: Đặt ma_po là NOT NULL (nếu cần)
ALTER TABLE qlnb MODIFY COLUMN ma_po VARCHAR(50) NOT NULL;

-- Kiểm tra kết quả
SELECT * FROM qlnb LIMIT 5;
