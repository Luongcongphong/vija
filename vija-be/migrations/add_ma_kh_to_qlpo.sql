-- Thêm cột Mã KH vào bảng QLPO

ALTER TABLE qlpo 
ADD COLUMN ma_kh VARCHAR(50) AFTER ma_bv;

-- Cập nhật Mã KH từ QLDM cho dữ liệu cũ
UPDATE qlpo po
LEFT JOIN qldm dm ON dm.ma_bv = po.ma_bv
SET po.ma_kh = dm.ma_kh
WHERE po.ma_kh IS NULL;
