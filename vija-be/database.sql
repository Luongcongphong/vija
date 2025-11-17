-- Tạo database nếu chưa có
CREATE DATABASE IF NOT EXISTS vija CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE vija;

-- Xóa các bảng cũ nếu muốn reset (bỏ comment nếu cần)
-- DROP TABLE IF EXISTS qlpo;
-- DROP TABLE IF EXISTS qldm;
-- DROP TABLE IF EXISTS qlnb;
-- DROP TABLE IF EXISTS qlkh;
-- DROP TABLE IF EXISTS users;

-- Bảng users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng QLKH (Quản lý Khách hàng)
CREATE TABLE IF NOT EXISTS qlkh (
  id INT AUTO_INCREMENT PRIMARY KEY,
  po VARCHAR(50) NOT NULL,
  ma_bv VARCHAR(50) NOT NULL,
  so_luong INT NOT NULL,
  don_gia DECIMAL(15,2) NOT NULL,
  thanh_tien DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_po_mabv (po, ma_bv)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng QLNB (Quản lý Nội bộ)
CREATE TABLE IF NOT EXISTS qlnb (
  id INT AUTO_INCREMENT PRIMARY KEY,
  po VARCHAR(50) NOT NULL,
  ma_bv VARCHAR(50) NOT NULL,
  phoi_lieu DECIMAL(15,2) NOT NULL DEFAULT 0,
  gia_cong_ngoai DECIMAL(15,2) NOT NULL DEFAULT 0,
  gia_cong_noi_bo DECIMAL(15,2) NOT NULL DEFAULT 0,
  xu_ly_be_mat DECIMAL(15,2) NOT NULL DEFAULT 0,
  van_chuyen DECIMAL(15,2) NOT NULL DEFAULT 0,
  phi_qldn DECIMAL(15,2) NOT NULL DEFAULT 0,
  tong_phi DECIMAL(15,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_po_mabv (po, ma_bv)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng QLDM (Quản lý Định mức)
CREATE TABLE IF NOT EXISTS qldm (
  id INT AUTO_INCREMENT PRIMARY KEY,
  po VARCHAR(50) NOT NULL,
  ma_bv VARCHAR(50) NOT NULL,
  so_luong INT NOT NULL,
  don_gia DECIMAL(15,2) NOT NULL,
  dinh_muc DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng QLPO (Quản lý PO)
CREATE TABLE IF NOT EXISTS qlpo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  po VARCHAR(50) NOT NULL,
  ma_bv VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tạo user admin mặc định (password: admin123)
INSERT INTO users (username, password) VALUES 
('admin', '$2a$10$YourHashedPasswordHere')
ON DUPLICATE KEY UPDATE username=username;
