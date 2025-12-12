const mysql = require('mysql2/promise');
require('dotenv').config();

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    console.log('Connected to database successfully');
    console.log('Running migration...');
    
    // Danh sách các câu lệnh ALTER TABLE
    const alterStatements = [
      "ALTER TABLE qldm ADD COLUMN so_bg VARCHAR(50) AFTER ma_bv",
      "ALTER TABLE qldm ADD COLUMN ma_kh VARCHAR(50) AFTER so_bg", 
      "ALTER TABLE qldm ADD COLUMN ngay_bg DATE AFTER ma_kh",
      "ALTER TABLE qldm ADD COLUMN nguyen_lieu VARCHAR(255) AFTER ngay_bg",
      "ALTER TABLE qldm ADD COLUMN xlbm VARCHAR(255) AFTER nguyen_lieu",
      "ALTER TABLE qldm ADD COLUMN dvt VARCHAR(20) DEFAULT 'p' AFTER so_luong",
      "ALTER TABLE qldm ADD COLUMN don_vi_tien_te VARCHAR(10) DEFAULT 'VND' AFTER don_gia",
      "ALTER TABLE qldm ADD COLUMN ghi_chu TEXT AFTER don_vi_tien_te"
    ];
    
    // Chạy từng câu lệnh
    for (const statement of alterStatements) {
      try {
        await connection.execute(statement);
        console.log(`✓ ${statement}`);
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log(`⚠ Column already exists: ${statement}`);
        } else {
          console.error(`✗ Failed: ${statement}`, error.message);
        }
      }
    }
    
    console.log('\nMigration completed!');
    
    // Kiểm tra cấu trúc bảng sau migration
    const [columns] = await connection.execute('DESCRIBE qldm');
    console.log('\nTable structure after migration:');
    console.table(columns);
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await connection.end();
  }
}

runMigration();