-- =============================================
-- Cập nhật QLPO: Đơn giản - chỉ Mã PO + Mã BV
-- =============================================

USE vija;

-- Backup bảng cũ
CREATE TABLE IF NOT EXISTS qlpo_backup AS SELECT * FROM qlpo;

-- Xóa bảng cũ
DROP TABLE IF EXISTS qlpo;

-- Tạo bảng mới (đơn giản)
CREATE TABLE qlpo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ma_po VARCHAR(50) NOT NULL COMMENT 'Mã PO',
  ma_bv VARCHAR(50) NOT NULL COMMENT 'Mã bảo vệ',
  ngay_tao DATE NULL COMMENT 'Ngày tạo PO',
  ngay_giao DATE NULL COMMENT 'Ngày giao hàng',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_ma_po (ma_po),
  INDEX idx_ma_bv (ma_bv),
  INDEX idx_ngay_tao (ngay_tao),
  INDEX idx_ngay_giao (ngay_giao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample data
INSERT INTO qlpo (ma_po, ma_bv, ngay_tao, ngay_giao) VALUES
('PO001', 'BV001', '2024-01-15', '2024-02-15'),
('PO001', 'BV002', '2024-01-15', '2024-02-15'),
('PO002', 'BV001', '2024-01-20', '2024-02-20');

SELECT 'QLPO updated successfully!' as status;
