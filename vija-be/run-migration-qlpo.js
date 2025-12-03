require('dotenv').config();
const mysql = require('mysql2/promise');

async function runMigration() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('🔗 Connected to database');
    console.log('📝 Running migration: add_ma_kh_to_qlpo');
    console.log('');
    
    // Kiểm tra xem cột đã tồn tại chưa
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'qlpo' 
        AND COLUMN_NAME = 'ma_kh'
    `);
    
    if (columns.length === 0) {
      await connection.query(`
        ALTER TABLE qlpo 
        ADD COLUMN ma_kh VARCHAR(50) AFTER ma_bv
      `);
      console.log('✅ Added column: ma_kh');
      
      // Cập nhật Mã KH từ QLDM
      const [result] = await connection.query(`
        UPDATE qlpo po
        LEFT JOIN qldm dm ON dm.ma_bv = po.ma_bv
        SET po.ma_kh = dm.ma_kh
        WHERE po.ma_kh IS NULL
      `);
      console.log(`✅ Updated ${result.affectedRows} rows with ma_kh from QLDM`);
    } else {
      console.log('ℹ️  Column ma_kh already exists');
    }
    
    console.log('');
    console.log('🎉 Migration completed successfully!');
    console.log('');
    
    const [tableStructure] = await connection.query(`DESCRIBE qlpo`);
    console.log('📋 Current table structure:');
    console.table(tableStructure);
    
  } catch (error) {
    console.error('');
    console.error('❌ Migration failed!');
    console.error('Error:', error.message);
    console.error('');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

runMigration();
