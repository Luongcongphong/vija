const mysql = require('mysql2/promise');
require('dotenv').config();

async function runMigration() {
  console.log('========================================');
  console.log('Migration: Add so_bg and ma_kh to qldm');
  console.log('========================================\n');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'vija_db'
  });

  try {
    console.log('Connected to database:', process.env.DB_NAME);
    
    // Kiểm tra xem cột so_bg đã tồn tại chưa
    const [columns1] = await connection.query(
      "SHOW COLUMNS FROM qldm LIKE 'so_bg'"
    );

    if (columns1.length === 0) {
      console.log('Adding column so_bg...');
      await connection.query('ALTER TABLE qldm ADD COLUMN so_bg VARCHAR(50) AFTER ma_bv');
      console.log('✓ Column so_bg added');
    } else {
      console.log('✓ Column so_bg already exists');
    }

    // Kiểm tra xem cột ma_kh đã tồn tại chưa
    const [columns2] = await connection.query(
      "SHOW COLUMNS FROM qldm LIKE 'ma_kh'"
    );

    if (columns2.length === 0) {
      console.log('Adding column ma_kh...');
      await connection.query('ALTER TABLE qldm ADD COLUMN ma_kh VARCHAR(50) AFTER so_bg');
      console.log('✓ Column ma_kh added');
    } else {
      console.log('✓ Column ma_kh already exists');
    }

    // Kiểm tra kết quả
    console.log('\nVerifying results...');
    const [rows] = await connection.query('SELECT * FROM qldm LIMIT 5');
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
