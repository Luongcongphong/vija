-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.4.3 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.16.0.7229
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for vija
CREATE DATABASE IF NOT EXISTS `vija` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `vija`;

-- Dumping structure for table vija.qlbg
CREATE TABLE IF NOT EXISTS `qlbg` (
  `id` int NOT NULL AUTO_INCREMENT,
  `stt` int NOT NULL COMMENT 'Số thứ tự tự động 1-999999',
  `so_bg` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Số báo giá (BG0001-BG9999)',
  `ma_bv` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mã bảo vệ từ QLDM',
  `so_luong` int NOT NULL COMMENT 'Số lượng',
  `don_gia` decimal(15,2) NOT NULL COMMENT 'Đơn giá tự động từ QLDM',
  `thanh_tien` decimal(15,2) NOT NULL COMMENT 'Thành tiền = SL × Đơn giá',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_so_bg` (`so_bg`),
  KEY `idx_ma_bv` (`ma_bv`),
  KEY `idx_stt` (`stt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table vija.qldm
CREATE TABLE IF NOT EXISTS `qldm` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ma_bv` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `so_bg` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ma_kh` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ngay_bg` date DEFAULT NULL,
  `nguyen_lieu` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `xlbm` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `so_luong` int NOT NULL,
  `dvt` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'p',
  `don_gia` decimal(15,2) NOT NULL,
  `don_vi_tien_te` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT 'VND',
  `ghi_chu` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table vija.qlkh
CREATE TABLE IF NOT EXISTS `qlkh` (
  `id` int NOT NULL AUTO_INCREMENT,
  `po` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ma_bv` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `so_luong` int NOT NULL,
  `don_gia` decimal(15,2) NOT NULL,
  `thanh_tien` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_po_mabv` (`po`,`ma_bv`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table vija.qlnb
CREATE TABLE IF NOT EXISTS `qlnb` (
  `id` int NOT NULL AUTO_INCREMENT,
  `so_bg` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Số báo giá',
  `ma_bv` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phoi_lieu` decimal(15,2) NOT NULL DEFAULT '0.00',
  `gia_cong_ngoai` decimal(15,2) NOT NULL DEFAULT '0.00',
  `gia_cong_noi_bo` decimal(15,2) NOT NULL DEFAULT '0.00',
  `xu_ly_be_mat` decimal(15,2) NOT NULL DEFAULT '0.00',
  `van_chuyen` decimal(15,2) NOT NULL DEFAULT '0.00',
  `phi_qldn` decimal(15,2) NOT NULL DEFAULT '0.00',
  `tong_phi` decimal(15,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ma_po` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mã PO',
  `so_luong` int NOT NULL DEFAULT '0' COMMENT 'Số lượng',
  PRIMARY KEY (`id`),
  KEY `idx_po_mabv` (`ma_bv`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table vija.qlpo
CREATE TABLE IF NOT EXISTS `qlpo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ma_po` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mã PO',
  `ma_bv` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ma_kh` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Mã khách hàng',
  `so_luong` int NOT NULL DEFAULT '0' COMMENT 'Số lượng',
  `dvt` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Đơn vị tính',
  `ngay_tao` date DEFAULT NULL COMMENT 'Ngày tạo PO',
  `ngay_giao` date DEFAULT NULL COMMENT 'Ngày giao hàng',
  `so_bg` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Số báo giá từ QLBG',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table vija.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','sales','kythuat') COLLATE utf8mb4_unicode_ci DEFAULT 'sales',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for view vija.v_dashboard
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `v_dashboard` (
	`id` INT NOT NULL,
	`stt` INT NOT NULL COMMENT 'Số thứ tự tự động 1-999999',
	`so_bg` VARCHAR(1) NOT NULL COMMENT 'Số báo giá (BG0001-BG9999)' COLLATE 'utf8mb4_unicode_ci',
	`ma_po` VARCHAR(1) NULL COMMENT 'Mã PO' COLLATE 'utf8mb4_unicode_ci',
	`ma_bv` VARCHAR(1) NOT NULL COMMENT 'Mã bảo vệ từ QLDM' COLLATE 'utf8mb4_unicode_ci',
	`so_luong` INT NOT NULL COMMENT 'Số lượng',
	`don_gia` DECIMAL(15,2) NOT NULL COMMENT 'Đơn giá tự động từ QLDM',
	`thanh_tien` DECIMAL(15,2) NOT NULL COMMENT 'Thành tiền = SL × Đơn giá',
	`phoi_lieu` DECIMAL(15,2) NOT NULL,
	`gia_cong_ngoai` DECIMAL(15,2) NOT NULL,
	`gia_cong_noi_bo` DECIMAL(15,2) NOT NULL,
	`xu_ly_be_mat` DECIMAL(15,2) NOT NULL,
	`van_chuyen` DECIMAL(15,2) NOT NULL,
	`phi_qldn` DECIMAL(15,2) NOT NULL,
	`tong_phi` DECIMAL(15,2) NOT NULL,
	`loi_nhuan` DECIMAL(16,2) NOT NULL,
	`ty_le` DECIMAL(22,2) NULL,
	`ngay_tao` TIMESTAMP NULL
);

-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `v_dashboard`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `v_dashboard` AS select `bg`.`id` AS `id`,`bg`.`stt` AS `stt`,`bg`.`so_bg` AS `so_bg`,`po`.`ma_po` AS `ma_po`,`bg`.`ma_bv` AS `ma_bv`,`bg`.`so_luong` AS `so_luong`,`bg`.`don_gia` AS `don_gia`,`bg`.`thanh_tien` AS `thanh_tien`,coalesce(`nb`.`phoi_lieu`,0) AS `phoi_lieu`,coalesce(`nb`.`gia_cong_ngoai`,0) AS `gia_cong_ngoai`,coalesce(`nb`.`gia_cong_noi_bo`,0) AS `gia_cong_noi_bo`,coalesce(`nb`.`xu_ly_be_mat`,0) AS `xu_ly_be_mat`,coalesce(`nb`.`van_chuyen`,0) AS `van_chuyen`,coalesce(`nb`.`phi_qldn`,0) AS `phi_qldn`,coalesce(`nb`.`tong_phi`,0) AS `tong_phi`,(`bg`.`thanh_tien` - coalesce(`nb`.`tong_phi`,0)) AS `loi_nhuan`,(case when (`bg`.`thanh_tien` > 0) then round((((`bg`.`thanh_tien` - coalesce(`nb`.`tong_phi`,0)) / `bg`.`thanh_tien`) * 100),2) else 0 end) AS `ty_le`,`bg`.`created_at` AS `ngay_tao` from ((`qlbg` `bg` left join `qlpo` `po` on((`bg`.`so_bg` = `po`.`so_bg`))) left join `qlnb` `nb` on(((`bg`.`so_bg` = `nb`.`so_bg`) and (`bg`.`ma_bv` = `nb`.`ma_bv`)))) order by `bg`.`stt` desc
;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
