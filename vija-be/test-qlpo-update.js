const mysql = require('mysql2/promise');
require('dotenv').config();

async function testQLPOUpdate() {
  console.log('========================================');
  console.log('Test QLPO Update');
  console.log('========================================\n');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'vija_db'
  });

  try {
    // 1. Kiểm tra cấu trúc bảng qlpo
    console.log('1. Checking qlpo table structure...');
    const [columns] = await connection.query('DESCRIBE qlpo');
    console.log('Columns:', columns.map(c => c.Field).join(', '));
    console.log('');

    // 2. Lấy 1 record để test
    console.log('2. Getting sample record...');
    const [rows] = await connection.query('SELECT * FROM qlpo LIMIT 1');
    if (rows.length === 0) {
      console.log('No records found in qlpo table');
      await connection.end();
      return;
    }
    const sampleRecord = rows[0];
    console.log('Sample record:', sampleRecord);
    console.log('');

    // 3. Thử update
    console.log('3. Testing update...');
    const testUpdate = {
      ma_po: sampleRecord.ma_po,
      ma_bv: sampleRecord.ma_bv,
      ngay_tao: sampleRecord.ngay_tao,
      ngay_giao: sampleRecord.ngay_giao
    };
    
    console.log('Update data:', testUpdate);
    
    const [result] = await connection.query(
      'UPDATE qlpo SET ma_po = ?, ma_bv = ?, ngay_tao = ?, ngay_giao = ? WHERE id = ?',
      [testUpdate.ma_po, testUpdate.ma_bv, testUpdate.ngay_tao, testUpdate.ngay_giao, sampleRecord.id]
    );
    
    console.log('Update result:', result);
    console.log('');

    // 4. Kiểm tra foreign keys
    console.log('4. Checking foreign keys...');
    const [fks] = await connection.query(`
      SELECT 
        CONSTRAINT_NAME,
        TABLE_NAME,
        COLUMN_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'qlpo' AND REFERENCED_TABLE_NAME IS NOT NULL
    `, [process.env.DB_NAME]);
    
    if (fks.length > 0) {
      console.log('Foreign keys found:');
      fks.forEach(fk => {
        console.log(`  - ${fk.CONSTRAINT_NAME}: ${fk.COLUMN_NAME} -> ${fk.REFERENCED_TABLE_NAME}.${fk.REFERENCED_COLUMN_NAME}`);
      });
    } else {
      console.log('No foreign keys found');
    }
    console.log('');

    // 5. Kiểm tra unique constraints
    console.log('5. Checking unique constraints...');
    const [indexes] = await connection.query(`
      SHOW INDEX FROM qlpo WHERE Non_unique = 0
    `);
    
    if (indexes.length > 0) {
      console.log('Unique indexes:');
      indexes.forEach(idx => {
        console.log(`  - ${idx.Key_name}: ${idx.Column_name}`);
      });
    } else {
      console.log('No unique indexes found (except PRIMARY)');
    }

    console.log('\n========================================');
    console.log('Test completed successfully!');
    console.log('========================================');

  } catch (error) {
    console.error('\n========================================');
    console.error('Test failed!');
    console.error('Error:', error.message);
    console.error('SQL Message:', error.sqlMessage);
    console.error('========================================');
  } finally {
    await connection.end();
  }
}

testQLPOUpdate();
