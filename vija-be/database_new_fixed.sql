-- =============================================
-- DATABASE SCHEMA MỚI - VIJA MANAGEMENT SYSTEM
-- Version: 2.0 - Fixed
-- =============================================

USE vija;

-- =============================================
-- BACKUP TABLES CŨ (Bỏ qua nếu bảng không tồn tại)
-- =============================================

-- Backup QLKH nếu tồn tại và chưa backup
SET @table_exists = (SELECT COUNT(*) FROM information_schema.TABLES 
                     WHERE TABLE_SCHEMA = 'vija' AND TABLE_NAME = 'qlkh');
SET @backup_exists = (SELECT COUNT(*) FROM information_schema.TABLES 
                      WHERE TABLE_SCHEMA = 'vija' AND TABLE_NAME = 'qlkh_old');

SET @sql = IF(@table_exists > 0 AND @backup_exists = 0,
  'CREATE TABLE qlkh_old AS SELECT * FROM qlkh',
  'SELECT "Skip backup qlkh" as info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Backup QLPO nếu tồn tại và chưa backup
SET @table_exists = (SELECT COUNT(*) FROM information_schema.TABLES 
                     WHERE TABLE_SCHEMA = 'vija' AND TABLE_NAME = 'qlpo');
SET @backup_exists = (SELECT COUNT(*) FROM information_schema.TABLES 
                      WHERE TABLE_SCHEMA = 'vija' AND TABLE_NAME = 'qlpo_old');

SET @sql = IF(@table_exists > 0 AND @backup_exists = 0,
  'CREATE TABLE qlpo_old AS SELECT * FROM qlpo',
  'SELECT "Skip backup qlpo" as info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Backup QLDM nếu tồn tại và chưa backup
SET @table_exists = (SELECT COUNT(*) FROM information_schema.TABLES 
                     WHERE TABLE_SCHEMA = 'vija' AND TABLE_NAME = 'qldm');
SET @backup_exists = (SELECT COUNT(*) FROM information_schema.TABLES 
                      WHERE TABLE_SCHEMA = 'vija' AND TABLE_NAME = 'qldm_old');

SET @sql = IF(@table_exists > 0 AND @backup_exists = 0,
  'CREATE TABLE qldm_old AS SELECT * FROM qldm',
  'SELECT "Skip backup qldm" as info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- =============================================
-- XÓA BẢNG CŨ (Nếu tồn tại)
-- =============================================
DROP TABLE IF EXISTS qlkh;
DROP TABLE IF EXISTS qlpo;
DROP TABLE IF EXISTS qldm;

-- =============================================
-- 1. QLDM - QUẢN LÝ ĐỊNH MỨC/BẢO VỆ (MỚI)
-- =============================================
CREATE TABLE IF NOT EXISTS qldm (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ma_bv VARCHAR(50) NOT NULL COMMENT 'Mã bảo vệ/sản phẩm',
  so_luong INT NOT NULL COMMENT 'Số lượng định mức',
  don_gia DECIMAL(15,2) NOT NULL COMMENT 'Đơn giá',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_ma_bv (ma_bv),
  INDEX idx_ma_bv_sl (ma_bv, so_luong)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 2. QLBG - QUẢN LÝ BÁO GIÁ (Thay QLKH)
-- =============================================
CREATE TABLE IF NOT EXISTS qlbg (
  id INT AUTO_INCREMENT PRIMARY KEY,
  stt INT NOT NULL COMMENT 'Số thứ tự tự động 1-999999',
  so_bg VARCHAR(10) NOT NULL COMMENT 'Số báo giá (BG0001-BG9999)',
  ma_bv VARCHAR(50) NOT NULL COMMENT 'Mã bảo vệ từ QLDM',
  so_luong INT NOT NULL COMMENT 'Số lượng',
  don_gia DECIMAL(15,2) NOT NULL COMMENT 'Đơn giá tự động từ QLDM',
  thanh_tien DECIMAL(15,2) NOT NULL COMMENT 'Thành tiền = SL × Đơn giá',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_so_bg (so_bg),
  INDEX idx_ma_bv (ma_bv),
  INDEX idx_stt (stt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 3. QLPO - QUẢN LÝ PO (MỚI)
-- =============================================
CREATE TABLE IF NOT EXISTS qlpo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ma_po VARCHAR(50) NOT NULL COMMENT 'Mã PO',
  so_bg VARCHAR(10) NOT NULL COMMENT 'Số báo giá từ QLBG',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_ma_po (ma_po),
  INDEX idx_so_bg (so_bg)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 4. QLNB - CẬP NHẬT (Bỏ qua nếu không tồn tại)
-- =============================================
-- Drop columns nếu tồn tại
SET @sql = IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS 
   WHERE TABLE_SCHEMA = 'vija' AND TABLE_NAME = 'qlnb' AND COLUMN_NAME = 'po') > 0,
  'ALTER TABLE qlnb DROP COLUMN po',
  'SELECT "Column po does not exist" as info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS 
   WHERE TABLE_SCHEMA = 'vija' AND TABLE_NAME = 'qlnb' AND COLUMN_NAME = 'ma_bv') > 0,
  'ALTER TABLE qlnb DROP COLUMN ma_bv',
  'SELECT "Column ma_bv does not exist" as info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add columns nếu chưa tồn tại
SET @sql = IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS 
   WHERE TABLE_SCHEMA = 'vija' AND TABLE_NAME = 'qlnb' AND COLUMN_NAME = 'so_bg') = 0,
  'ALTER TABLE qlnb ADD COLUMN so_bg VARCHAR(10) NOT NULL COMMENT "Số báo giá" AFTER id',
  'SELECT "Column so_bg already exists" as info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS 
   WHERE TABLE_SCHEMA = 'vija' AND TABLE_NAME = 'qlnb' AND COLUMN_NAME = 'ma_bv') = 0,
  'ALTER TABLE qlnb ADD COLUMN ma_bv VARCHAR(50) NOT NULL COMMENT "Mã bảo vệ" AFTER so_bg',
  'SELECT "Column ma_bv already exists" as info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add indexes nếu chưa tồn tại
SET @sql = IF(
  (SELECT COUNT(*) FROM information_schema.STATISTICS 
   WHERE TABLE_SCHEMA = 'vija' AND TABLE_NAME = 'qlnb' AND INDEX_NAME = 'idx_so_bg') = 0,
  'ALTER TABLE qlnb ADD INDEX idx_so_bg (so_bg)',
  'SELECT "Index idx_so_bg already exists" as info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF(
  (SELECT COUNT(*) FROM information_schema.STATISTICS 
   WHERE TABLE_SCHEMA = 'vija' AND TABLE_NAME = 'qlnb' AND INDEX_NAME = 'idx_ma_bv') = 0,
  'ALTER TABLE qlnb ADD INDEX idx_ma_bv (ma_bv)',
  'SELECT "Index idx_ma_bv already exists" as info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- =============================================
-- TRIGGER: Auto STT và Số BG
-- =============================================
DROP TRIGGER IF EXISTS before_insert_qlbg;

DELIMITER $$

CREATE TRIGGER before_insert_qlbg
BEFORE INSERT ON qlbg
FOR EACH ROW
BEGIN
  DECLARE next_stt INT;
  DECLARE next_bg_num INT;
  DECLARE last_so_bg VARCHAR(10);
  
  -- Auto STT
  SELECT COALESCE(MAX(stt), 0) + 1 INTO next_stt FROM qlbg;
  SET NEW.stt = next_stt;
  
  -- Auto Số BG nếu chưa có
  IF NEW.so_bg IS NULL OR NEW.so_bg = '' THEN
    SELECT so_bg INTO last_so_bg FROM qlbg ORDER BY id DESC LIMIT 1;
    
    IF last_so_bg IS NULL THEN
      SET next_bg_num = 1;
    ELSE
      SET next_bg_num = CAST(SUBSTRING(last_so_bg, 3) AS UNSIGNED) + 1;
    END IF;
    
    SET NEW.so_bg = CONCAT('BG', LPAD(next_bg_num, 4, '0'));
  END IF;
  
  -- Auto Thành tiền
  SET NEW.thanh_tien = NEW.so_luong * NEW.don_gia;
END$$

DELIMITER ;

-- =============================================
-- SAMPLE DATA (Chỉ insert nếu chưa có)
-- =============================================
INSERT IGNORE INTO qldm (ma_bv, so_luong, don_gia) VALUES
('BV001', 100, 50000),
('BV001', 500, 45000),
('BV001', 1000, 40000),
('BV002', 100, 30000),
('BV002', 500, 28000);

-- Test QLBG với auto STT và Số BG (Chỉ insert nếu bảng rỗng)
INSERT INTO qlbg (so_bg, ma_bv, so_luong, don_gia, thanh_tien, stt)
SELECT 'BG0001', 'BV001', 150, 50000, 7500000, 1
WHERE NOT EXISTS (SELECT 1 FROM qlbg LIMIT 1)
UNION ALL
SELECT 'BG0001', 'BV002', 200, 30000, 6000000, 2
WHERE NOT EXISTS (SELECT 1 FROM qlbg LIMIT 1)
UNION ALL
SELECT 'BG0002', 'BV001', 600, 45000, 27000000, 3
WHERE NOT EXISTS (SELECT 1 FROM qlbg LIMIT 1);

INSERT INTO qlpo (ma_po, so_bg)
SELECT 'PO001', 'BG0001'
WHERE NOT EXISTS (SELECT 1 FROM qlpo WHERE ma_po = 'PO001')
UNION ALL
SELECT 'PO002', 'BG0002'
WHERE NOT EXISTS (SELECT 1 FROM qlpo WHERE ma_po = 'PO002');

-- =============================================
-- VIEW Dashboard (Tự động replace nếu đã tồn tại)
-- =============================================
DROP VIEW IF EXISTS v_dashboard;
CREATE VIEW v_dashboard AS
SELECT 
  bg.id,
  bg.stt,
  bg.so_bg,
  po.ma_po,
  bg.ma_bv,
  bg.so_luong,
  bg.don_gia,
  bg.thanh_tien,
  COALESCE(nb.phoi_lieu, 0) as phoi_lieu,
  COALESCE(nb.gia_cong_ngoai, 0) as gia_cong_ngoai,
  COALESCE(nb.gia_cong_noi_bo, 0) as gia_cong_noi_bo,
  COALESCE(nb.xu_ly_be_mat, 0) as xu_ly_be_mat,
  COALESCE(nb.van_chuyen, 0) as van_chuyen,
  COALESCE(nb.phi_qldn, 0) as phi_qldn,
  COALESCE(nb.tong_phi, 0) as tong_phi,
  (bg.thanh_tien - COALESCE(nb.tong_phi, 0)) as loi_nhuan,
  CASE 
    WHEN bg.thanh_tien > 0 THEN 
      ROUND(((bg.thanh_tien - COALESCE(nb.tong_phi, 0)) / bg.thanh_tien * 100), 2)
    ELSE 0 
  END as ty_le,
  bg.created_at as ngay_tao
FROM qlbg bg
LEFT JOIN qlpo po ON bg.so_bg = po.so_bg
LEFT JOIN qlnb nb ON bg.so_bg = nb.so_bg AND bg.ma_bv = nb.ma_bv
ORDER BY bg.stt DESC;

-- =============================================
-- STORED PROCEDURE
-- =============================================
DROP PROCEDURE IF EXISTS sp_get_don_gia;

DELIMITER $$

CREATE PROCEDURE sp_get_don_gia(
  IN p_ma_bv VARCHAR(50),
  IN p_so_luong INT,
  OUT p_don_gia DECIMAL(15,2)
)
BEGIN
  SELECT don_gia INTO p_don_gia
  FROM qldm
  WHERE ma_bv = p_ma_bv AND so_luong <= p_so_luong
  ORDER BY so_luong DESC
  LIMIT 1;
  
  IF p_don_gia IS NULL THEN
    SET p_don_gia = 0;
  END IF;
END$$

DELIMITER ;

-- =============================================
-- VERIFY
-- =============================================
SELECT 'Migration completed successfully!' as status;
SELECT 'Tables created:' as info;
SHOW TABLES LIKE 'ql%';
