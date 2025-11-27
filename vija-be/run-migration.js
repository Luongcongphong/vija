const mysql = require('mysql2/promise');
require('dotenv').config();

async function runMigration() {
  console.log('========================================');
  console.log('Migration: Update QLNB so_bg to ma_po');
  console.log('========================================\n');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'vija_db'
  });

  try {
    console.log('Connected to database:', process.env.DB_NAME);
    console.log('Host:', process.env.DB_HOST);
    console.log('User:', process.env.DB_USER);
    console.log('\nRunning migration...\n');

    // Bước 1: Kiểm tra xem cột ma_po đã tồn tại chưa
    const [columns] = await connection.query(
      "SHOW COLUMNS FROM qlnb LIKE 'ma_po'"
    );

    if (columns.length > 0) {
      console.log('✓ Column ma_po already exists. Skipping migration.');
      await connection.end();
      return;
    }

    // Bước 2: Thêm cột ma_po mới
    console.log('Step 1: Adding column ma_po...');
    await connection.query('ALTER TABLE qlnb ADD COLUMN ma_po VARCHAR(50) AFTER id');
    console.log('✓ Column ma_po added');

    // Bước 3: Copy dữ liệu từ so_bg sang ma_po
    console.log('\nStep 2: Copying data from so_bg to ma_po...');
    await connection.query('UPDATE qlnb SET ma_po = so_bg');
    console.log('✓ Data copied');

    // Bước 4: Xóa cột so_bg cũ
    console.log('\nStep 3: Dropping column so_bg...');
    await connection.query('ALTER TABLE qlnb DROP COLUMN so_bg');
    console.log('✓ Column so_bg dropped');

    // Bước 5: Đặt ma_po là NOT NULL
    console.log('\nStep 4: Setting ma_po as NOT NULL...');
    await connection.query('ALTER TABLE qlnb MODIFY COLUMN ma_po VARCHAR(50) NOT NULL');
    console.log('✓ Column ma_po set as NOT NULL');

    // Kiểm tra kết quả
    console.log('\nVerifying results...');
    const [rows] = await connection.query('SELECT * FROM qlnb LIMIT 5');
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
