import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function createDatabase() {
  let connection;
  
  try {
    console.log('🔄 Đang kết nối MySQL...');
    
    // Kết nối không chỉ định database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    console.log('✓ Đã kết nối MySQL');

    // Tạo database nếu chưa có
    const dbName = process.env.DB_NAME || 'vija';
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    
    console.log(`✓ Database '${dbName}' đã sẵn sàng`);
    console.log('\n✅ Hoàn tất! Bây giờ chạy: npm run setup\n');

    await connection.end();
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Lỗi:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Kiểm tra lại thông tin trong file .env:');
      console.error(`   DB_HOST=${process.env.DB_HOST}`);
      console.error(`   DB_PORT=${process.env.DB_PORT}`);
      console.error(`   DB_USER=${process.env.DB_USER}`);
      console.error(`   DB_PASSWORD=${process.env.DB_PASSWORD}`);
    }
    
    if (connection) await connection.end();
    process.exit(1);
  }
}

createDatabase();
