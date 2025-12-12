-- Migration: Thêm các cột còn thiếu vào bảng qldm
-- Ngày: 2024-12-12
-- Mô tả: Thêm các cột ngay_bg, nguyen_lieu, xlbm, ghi_chu, so_bg, ma_kh, dvt, don_vi_tien_te

USE vija;

-- Thêm các cột một cách đơn giản (sẽ báo lỗi nếu cột đã tồn tại, nhưng không sao)
ALTER TABLE qldm ADD COLUMN so_bg VARCHAR(50) AFTER ma_bv;
ALTER TABLE qldm ADD COLUMN ma_kh VARCHAR(50) AFTER so_bg;
ALTER TABLE qldm ADD COLUMN ngay_bg DATE AFTER ma_kh;
ALTER TABLE qldm ADD COLUMN nguyen_lieu VARCHAR(255) AFTER ngay_bg;
ALTER TABLE qldm ADD COLUMN xlbm VARCHAR(255) AFTER nguyen_lieu;
ALTER TABLE qldm ADD COLUMN dvt VARCHAR(20) DEFAULT 'p' AFTER so_luong;
ALTER TABLE qldm ADD COLUMN don_vi_tien_te VARCHAR(10) DEFAULT 'VND' AFTER don_gia;
ALTER TABLE qldm ADD COLUMN ghi_chu TEXT AFTER don_vi_tien_te;

-- Kiểm tra kết quả
DESCRIBE qldm;

-- Hiển thị thông báo hoàn thành
SELECT 'Migration completed: Added missing columns to qldm table' as status;