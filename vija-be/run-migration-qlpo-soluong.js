const mysql = require('mysql2/promise');
require('dotenv').config();

async function runMigration() {
  console.log('========================================');
  console.log('Migration: Add so_luong to qlpo');
  console.log('========================================\n');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'vija_db'
  });

  try {
    console.log('Connected to database:', process.env.DB_NAME);
    
    // Kiểm tra xem cột so_luong đã tồn tại chưa
    const [columns] = await connection.query(
      "SHOW COLUMNS FROM qlpo LIKE 'so_luong'"
    );

    if (columns.length > 0) {
      console.log('✓ Column so_luong already exists. Skipping migration.');
      await connection.end();
      return;
    }

    // Thêm cột so_luong
    console.log('Adding column so_luong...');
    await connection.query('ALTER TABLE qlpo ADD COLUMN so_luong INT DEFAULT 0 AFTER ma_bv');
    console.log('✓ Column so_luong added');

    // Kiểm tra kết quả
    console.log('\nVerifying results...');
    const [rows] = await connection.query('SELECT * FROM qlpo LIMIT 5');
    console.log('Sample data:', rows);

    console.log('\n========================================');
    console.log('Migration completed successfully!');
    console.log('========================================');

  } catch (error) {
    console.error('\n========================================');
    console.error('Migration failed!');
    console.error('Error:', error.message);
    console.error('========================================');
    process.exit(1);
  } finally {
    await connection.end();
  }
}

runMigration();
