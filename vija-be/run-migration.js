require('dotenv').config();
const mysql = require('mysql2/promise');

async function runMigration() {
  let connection;
  
  try {
    // Tạo connection từ .env
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('🔗 Connected to database');
    console.log('📝 Running migration: add_dvt_and_currency_to_qldm');
    console.log('');
    
    // Kiểm tra xem cột đã tồn tại chưa
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'qldm' 
        AND COLUMN_NAME IN ('dvt', 'don_vi_tien_te')
    `);
    
    const existingColumns = columns.map(col => col.COLUMN_NAME);
    
    // Thêm cột dvt nếu chưa có
    if (!existingColumns.includes('dvt')) {
      await connection.query(`
        ALTER TABLE qldm 
        ADD COLUMN dvt VARCHAR(20) DEFAULT 'p' AFTER so_luong
      `);
      console.log('✅ Added column: dvt');
    } else {
      console.log('ℹ️  Column dvt already exists');
    }
    
    // Thêm cột don_vi_tien_te nếu chưa có
    if (!existingColumns.includes('don_vi_tien_te')) {
      await connection.query(`
        ALTER TABLE qldm 
        ADD COLUMN don_vi_tien_te VARCHAR(10) DEFAULT 'VND' AFTER don_gia
      `);
      console.log('✅ Added column: don_vi_tien_te');
    } else {
      console.log('ℹ️  Column don_vi_tien_te already exists');
    }
    
    // Cập nhật giá trị mặc định cho dữ liệu cũ
    const [result1] = await connection.query(`UPDATE qldm SET dvt = 'p' WHERE dvt IS NULL`);
    const [result2] = await connection.query(`UPDATE qldm SET don_vi_tien_te = 'VND' WHERE don_vi_tien_te IS NULL`);
    
    console.log(`✅ Updated ${result1.affectedRows} rows with default dvt`);
    console.log(`✅ Updated ${result2.affectedRows} rows with default don_vi_tien_te`);
    
    console.log('');
    console.log('🎉 Migration completed successfully!');
    console.log('');
    
    // Hiển thị cấu trúc bảng
    const [tableStructure] = await connection.query(`DESCRIBE qldm`);
    console.log('📋 Current table structure:');
    console.table(tableStructure);
    
  } catch (error) {
    console.error('');
    console.error('❌ Migration failed!');
    console.error('Error:', error.message);
    console.error('');
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('💡 Tip: Check your database credentials');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('💡 Tip: Database does not exist');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('💡 Tip: MySQL server is not running');
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Chạy migration
runMigration();
