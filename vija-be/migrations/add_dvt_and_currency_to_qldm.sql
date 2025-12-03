-- Thêm cột ĐVT (Đơn vị tính) và Đơn vị tiền tệ vào bảng QLDM

ALTER TABLE qldm 
ADD COLUMN dvt VARCHAR(20) DEFAULT 'p' AFTER so_luong,
ADD COLUMN don_vi_tien_te VARCHAR(10) DEFAULT 'VND' AFTER don_gia;

-- Cập nhật giá trị mặc định cho dữ liệu cũ
UPDATE qldm SET dvt = 'p' WHERE dvt IS NULL;
UPDATE qldm SET don_vi_tien_te = 'VND' WHERE don_vi_tien_te IS NULL;
