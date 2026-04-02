import pool from '../config/database';

export async function initDatabase() {
  try {
    console.log('🔄 Đang kiểm tra và khởi tạo database...');

    // Tạo bảng users
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'sales', 'kythuat') DEFAULT 'sales',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ Bảng users đã sẵn sàng');

    // Tạo bảng QLDM (Định mức) - CẤU TRÚC MỚI
    await pool.query(`
      CREATE TABLE IF NOT EXISTS qldm (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ma_bv VARCHAR(50) NOT NULL COMMENT 'Mã bảo vệ/sản phẩm',
        so_luong INT NOT NULL COMMENT 'Số lượng định mức',
        don_gia DECIMAL(15,2) NOT NULL COMMENT 'Đơn giá',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_ma_bv (ma_bv),
        INDEX idx_ma_bv_sl (ma_bv, so_luong)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ Bảng qldm đã sẵn sàng');

    // Tạo bảng QLBG (Báo giá) - CẤU TRÚC MỚI
    await pool.query(`
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ Bảng qlbg đã sẵn sàng');

    // Tạo bảng QLPO (PO) - CẤU TRÚC MỚI
    await pool.query(`
      CREATE TABLE IF NOT EXISTS qlpo (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ma_po VARCHAR(50) NOT NULL COMMENT 'Mã PO',
        ma_bv VARCHAR(50) NOT NULL COMMENT 'Mã bảo vệ',
        ma_kh VARCHAR(50) NULL COMMENT 'Mã khách hàng',
        so_luong INT NOT NULL DEFAULT 0 COMMENT 'Số lượng',
        dvt VARCHAR(20) NULL COMMENT 'Đơn vị tính',
        ngay_tao DATE NULL COMMENT 'Ngày tạo PO',
        ngay_giao DATE NULL COMMENT 'Ngày giao hàng',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_ma_po (ma_po),
        INDEX idx_ma_bv (ma_bv),
        INDEX idx_ma_kh (ma_kh)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ Bảng qlpo đã sẵn sàng');

    // Bảng QLKH đã được thay thế bởi QLBG
    // Giữ lại để tương thích với dữ liệu cũ (nếu có)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS qlkh (
        id INT AUTO_INCREMENT PRIMARY KEY,
        po VARCHAR(50) NOT NULL,
        ma_bv VARCHAR(50) NOT NULL,
        so_luong INT NOT NULL,
        don_gia DECIMAL(15,2) NOT NULL,
        thanh_tien DECIMAL(15,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_po_mabv (po, ma_bv)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ Bảng qlkh (legacy) đã sẵn sàng');

    // Tạo bảng QLNB (Nội bộ) - CẤU TRÚC MỚI
    await pool.query(`
      CREATE TABLE IF NOT EXISTS qlnb (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ma_po VARCHAR(50) NOT NULL COMMENT 'Mã PO',
        ma_bv VARCHAR(50) NOT NULL COMMENT 'Mã bảo vệ',
        so_luong INT NOT NULL DEFAULT 0 COMMENT 'Số lượng',
        phoi_lieu DECIMAL(15,2) NOT NULL DEFAULT 0,
        gia_cong_ngoai DECIMAL(15,2) NOT NULL DEFAULT 0,
        gia_cong_noi_bo DECIMAL(15,2) NOT NULL DEFAULT 0,
        xu_ly_be_mat DECIMAL(15,2) NOT NULL DEFAULT 0,
        van_chuyen DECIMAL(15,2) NOT NULL DEFAULT 0,
        phi_qldn DECIMAL(15,2) NOT NULL DEFAULT 0,
        tong_phi DECIMAL(15,2) NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_ma_po (ma_po),
        INDEX idx_ma_bv (ma_bv),
        INDEX idx_ma_po_ma_bv (ma_po, ma_bv)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ Bảng qlnb đã sẵn sàng');

    // Tạo bảng QLKHO_NHAP
    await pool.query(`
      CREATE TABLE IF NOT EXISTS qlkho_nhap (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ma_bv VARCHAR(50) NOT NULL COMMENT 'Mã bảo vệ/sản phẩm',
        ngay_nhap DATE NOT NULL COMMENT 'Ngày nhập',
        so_luong INT NOT NULL COMMENT 'Số lượng nhập',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_ma_bv (ma_bv)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ Bảng qlkho_nhap đã sẵn sàng');

    // Tạo bảng QLKHO_XUAT
    await pool.query(`
      CREATE TABLE IF NOT EXISTS qlkho_xuat (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ma_bv VARCHAR(50) NOT NULL COMMENT 'Mã bảo vệ/sản phẩm',
        ma_po VARCHAR(50) NULL COMMENT 'Mã PO',
        ngay_xuat DATE NOT NULL COMMENT 'Ngày xuất',
        so_luong INT NOT NULL COMMENT 'Số lượng xuất',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_ma_bv (ma_bv),
        INDEX idx_ma_po (ma_po)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ Bảng qlkho_xuat đã sẵn sàng');

    // Kiểm tra và cập nhật cấu trúc bảng nếu cần
    await checkAndUpdateTables();

    console.log('✅ Database đã được khởi tạo thành công!');
  } catch (error) {
    console.error('❌ Lỗi khi khởi tạo database:', error);
    throw error;
  }
}

async function checkAndUpdateTables() {
  try {
    // Kiểm tra và cập nhật bảng QLNB
    const [qlnbColumns]: any = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'qlnb'
    `);
    
    const qlnbColumnNames = qlnbColumns.map((col: any) => col.COLUMN_NAME);
    
    // Thêm các cột thiếu vào QLNB
    const requiredQLNBColumns = [
      { name: 'ma_po', type: 'VARCHAR(50) NOT NULL', comment: 'Mã PO' },
      { name: 'so_luong', type: 'INT NOT NULL DEFAULT 0', comment: 'Số lượng' },
      { name: 'phoi_lieu', type: 'DECIMAL(15,2) NOT NULL DEFAULT 0', comment: 'Phôi liệu' },
      { name: 'gia_cong_ngoai', type: 'DECIMAL(15,2) NOT NULL DEFAULT 0', comment: 'Gia công ngoài' },
      { name: 'gia_cong_noi_bo', type: 'DECIMAL(15,2) NOT NULL DEFAULT 0', comment: 'Gia công nội bộ' },
      { name: 'xu_ly_be_mat', type: 'DECIMAL(15,2) NOT NULL DEFAULT 0', comment: 'Xử lý bề mặt' },
      { name: 'van_chuyen', type: 'DECIMAL(15,2) NOT NULL DEFAULT 0', comment: 'Vận chuyển' },
      { name: 'phi_qldn', type: 'DECIMAL(15,2) NOT NULL DEFAULT 0', comment: 'Phí QLDN' },
      { name: 'tong_phi', type: 'DECIMAL(15,2) NOT NULL DEFAULT 0', comment: 'Tổng phí' }
    ];

    for (const col of requiredQLNBColumns) {
      if (!qlnbColumnNames.includes(col.name)) {
        try {
          await pool.query(`
            ALTER TABLE qlnb 
            ADD COLUMN ${col.name} ${col.type} COMMENT '${col.comment}'
          `);
          console.log(`✓ Đã thêm cột ${col.name} vào bảng qlnb`);
        } catch (err: any) {
          console.log(`⚠️  Không thể thêm cột ${col.name}: ${err.message}`);
        }
      }
    }
    
    // Nếu có cột 'so_bg' (cấu trúc cũ) nhưng không có 'ma_po'
    if (qlnbColumnNames.includes('so_bg') && !qlnbColumnNames.includes('ma_po')) {
      console.log('⚠️  Phát hiện cấu trúc cũ trong bảng qlnb (có so_bg, thiếu ma_po)');
      console.log('💡 Cần migration dữ liệu từ so_bg sang ma_po');
    }

    // Kiểm tra bảng QLDM
    const [qldmColumns]: any = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'qldm'
    `);
    
    const qldmColumnNames = qldmColumns.map((col: any) => col.COLUMN_NAME);
    
    if (qldmColumnNames.includes('po')) {
      console.log('⚠️  Phát hiện cấu trúc cũ trong bảng qldm');
      console.log('💡 Vui lòng chạy migration script: database_new_fixed.sql');
    }

    // Kiểm tra và sửa bảng QLPO
    const [qlpoColumns]: any = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'qlpo'
    `);
    
    const qlpoColumnNames = qlpoColumns.map((col: any) => col.COLUMN_NAME);
    
    // Thêm các cột thiếu vào QLPO
    const requiredQLPOColumns = [
      { name: 'ma_kh', type: 'VARCHAR(50) NULL', comment: 'Mã khách hàng' },
      { name: 'so_luong', type: 'INT NOT NULL DEFAULT 0', comment: 'Số lượng' },
      { name: 'dvt', type: 'VARCHAR(20) NULL', comment: 'Đơn vị tính' },
      { name: 'ngay_tao', type: 'DATE NULL', comment: 'Ngày tạo PO' },
      { name: 'ngay_giao', type: 'DATE NULL', comment: 'Ngày giao hàng' }
    ];

    for (const col of requiredQLPOColumns) {
      if (!qlpoColumnNames.includes(col.name)) {
        await pool.query(`
          ALTER TABLE qlpo 
          ADD COLUMN ${col.name} ${col.type} COMMENT '${col.comment}'
        `);
        console.log(`✓ Đã thêm cột ${col.name} vào bảng qlpo`);
      }
    }
    
    // Nếu có cột 'so_bg' (cấu trúc cũ), cần rebuild
    if (qlpoColumnNames.includes('so_bg')) {
      console.log('⚠️  Phát hiện cấu trúc cũ trong bảng qlpo với cột so_bg');
      console.log('💡 Vui lòng chạy migration script để chuyển đổi dữ liệu');
    }

    // Kiểm tra bảng users
    const [userColumns]: any = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'users'
    `);
    
    const userColumnNames = userColumns.map((col: any) => col.COLUMN_NAME);
    
    if (!userColumnNames.includes('role')) {
      await pool.query(`
        ALTER TABLE users 
        ADD COLUMN role ENUM('admin', 'sales', 'kythuat') DEFAULT 'sales'
      `);
      console.log('✓ Đã thêm cột role vào bảng users');
    }

  } catch (error) {
    console.error('⚠️  Lỗi khi kiểm tra cấu trúc bảng:', error);
    // Không throw error để server vẫn chạy được
  }
}
