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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ Bảng users đã sẵn sàng');

    // Tạo bảng QLKH
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
    console.log('✓ Bảng qlkh đã sẵn sàng');

    // Tạo bảng QLNB
    await pool.query(`
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ Bảng qlnb đã sẵn sàng');

    // Tạo bảng QLDM
    await pool.query(`
      CREATE TABLE IF NOT EXISTS qldm (
        id INT AUTO_INCREMENT PRIMARY KEY,
        po VARCHAR(50) NOT NULL,
        ma_bv VARCHAR(50) NOT NULL,
        so_luong INT NOT NULL,
        don_gia DECIMAL(15,2) NOT NULL,
        dinh_muc DECIMAL(15,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ Bảng qldm đã sẵn sàng');

    // Tạo bảng QLPO
    await pool.query(`
      CREATE TABLE IF NOT EXISTS qlpo (
        id INT AUTO_INCREMENT PRIMARY KEY,
        po VARCHAR(50) NOT NULL,
        ma_bv VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ Bảng qlpo đã sẵn sàng');

    // Kiểm tra và thêm cột nếu thiếu
    await checkAndAddColumns();

    console.log('✅ Database đã được khởi tạo thành công!');
  } catch (error) {
    console.error('❌ Lỗi khi khởi tạo database:', error);
    throw error;
  }
}

async function checkAndAddColumns() {
  try {
    // Kiểm tra các cột trong bảng users
    const [userColumns]: any = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'users'
    `);
    
    const userColumnNames = userColumns.map((col: any) => col.COLUMN_NAME);
    
    if (!userColumnNames.includes('created_at')) {
      await pool.query(`
        ALTER TABLE users 
        ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `);
      console.log('✓ Đã thêm cột created_at vào bảng users');
    }

    // Kiểm tra các cột trong bảng qlkh
    const [qlkhColumns]: any = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'qlkh'
    `);
    
    const qlkhColumnNames = qlkhColumns.map((col: any) => col.COLUMN_NAME);
    
    if (!qlkhColumnNames.includes('thanh_tien')) {
      await pool.query(`
        ALTER TABLE qlkh 
        ADD COLUMN thanh_tien DECIMAL(15,2) NOT NULL DEFAULT 0
      `);
      console.log('✓ Đã thêm cột thanh_tien vào bảng qlkh');
    }

    // Kiểm tra các cột trong bảng qlnb
    const [qlnbColumns]: any = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'qlnb'
    `);
    
    const qlnbColumnNames = qlnbColumns.map((col: any) => col.COLUMN_NAME);
    
    const qlnbRequiredColumns = [
      'phoi_lieu', 'gia_cong_ngoai', 'gia_cong_noi_bo', 
      'xu_ly_be_mat', 'van_chuyen', 'phi_qldn', 'tong_phi'
    ];

    for (const colName of qlnbRequiredColumns) {
      if (!qlnbColumnNames.includes(colName)) {
        await pool.query(`
          ALTER TABLE qlnb 
          ADD COLUMN ${colName} DECIMAL(15,2) NOT NULL DEFAULT 0
        `);
        console.log(`✓ Đã thêm cột ${colName} vào bảng qlnb`);
      }
    }

    // Kiểm tra index
    const [indexes]: any = await pool.query(`
      SHOW INDEX FROM qlkh WHERE Key_name = 'idx_po_mabv'
    `);

    if (indexes.length === 0) {
      await pool.query(`
        ALTER TABLE qlkh ADD INDEX idx_po_mabv (po, ma_bv)
      `);
      console.log('✓ Đã thêm index idx_po_mabv vào bảng qlkh');
    }

    const [qlnbIndexes]: any = await pool.query(`
      SHOW INDEX FROM qlnb WHERE Key_name = 'idx_po_mabv'
    `);

    if (qlnbIndexes.length === 0) {
      await pool.query(`
        ALTER TABLE qlnb ADD INDEX idx_po_mabv (po, ma_bv)
      `);
      console.log('✓ Đã thêm index idx_po_mabv vào bảng qlnb');
    }

  } catch (error) {
    console.error('Lỗi khi kiểm tra/thêm cột:', error);
  }
}
