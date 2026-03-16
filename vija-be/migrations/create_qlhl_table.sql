-- Tạo bảng Quản lý Hàng Lỗi (QLHL)
CREATE TABLE IF NOT EXISTS qlhl (
  id INT AUTO_INCREMENT PRIMARY KEY,
  qlpo_id INT NOT NULL COMMENT 'ID của PO liên quan',
  ma_po VARCHAR(50) NOT NULL COMMENT 'Mã PO (lấy từ QLPO)',
  ma_bv VARCHAR(50) COMMENT 'Mã bảo vệ (lấy từ QLPO)',
  ma_kh VARCHAR(50) COMMENT 'Mã khách hàng (lấy từ QLPO)',
  dvt VARCHAR(20) DEFAULT 'Cái' COMMENT 'Đơn vị tính',
  sl INT NOT NULL DEFAULT 0 COMMENT 'Số lượng lỗi tự nhập',
  giao_bu INT NOT NULL DEFAULT 0 COMMENT 'Số lượng giao bù tự nhập',
  ngay_tra DATE COMMENT 'Ngày trả hàng lỗi',
  ngay_giao_bu DATE COMMENT 'Ngày giao bù hàng lỗi',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_ma_po (ma_po),
  INDEX idx_qlpo_id (qlpo_id),
  FOREIGN KEY (qlpo_id) REFERENCES qlpo(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
