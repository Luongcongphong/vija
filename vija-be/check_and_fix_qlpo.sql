-- Kiểm tra và sửa bảng QLPO

USE vija;

-- Kiểm tra cấu trúc hiện tại
SELECT 'Current QLPO structure:' as info;
DESCRIBE qlpo;

-- Kiểm tra dữ liệu
SELECT 'Current QLPO data:' as info;
SELECT * FROM qlpo LIMIT 5;

-- Nếu bảng có cấu trúc cũ (so_bg), xóa và tạo lại
DROP TABLE IF EXISTS qlpo_old_backup;
CREATE TABLE qlpo_old_backup AS SELECT * FROM qlpo;

DROP TABLE IF EXISTS qlpo;

CREATE TABLE qlpo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ma_po VARCHAR(50) NOT NULL COMMENT 'Mã PO',
  ma_bv VARCHAR(50) NOT NULL COMMENT 'Mã bảo vệ',
  ngay_tao DATE NULL COMMENT 'Ngày tạo PO',
  ngay_giao DATE NULL COMMENT 'Ngày giao hàng',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_ma_po (ma_po),
  INDEX idx_ma_bv (ma_bv)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SELECT 'QLPO table recreated!' as status;

-- Kiểm tra lại
DESCRIBE qlpo;
