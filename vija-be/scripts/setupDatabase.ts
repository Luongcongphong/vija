import dotenv from 'dotenv';
import { initDatabase } from '../src/utils/initDatabase';
import bcrypt from 'bcryptjs';
import pool from '../src/config/database';

dotenv.config();

async function setupDatabase() {
  try {
    console.log('🔧 Bắt đầu thiết lập database...\n');

    // Khởi tạo các bảng
    await initDatabase();

    // Tạo user admin mặc định
    console.log('\n🔄 Đang tạo user admin...');
    const username = 'admin';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (username, password) VALUES (?, ?) ON DUPLICATE KEY UPDATE password = ?',
      [username, hashedPassword, hashedPassword]
    );

    console.log('✓ User admin đã được tạo/cập nhật');
    console.log('  Username: admin');
    console.log('  Password: admin123');

    console.log('\n✅ Thiết lập database hoàn tất!');
    console.log('\nBạn có thể chạy server bằng lệnh: npm run dev\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Lỗi khi thiết lập database:', error);
    process.exit(1);
  }
}

setupDatabase();
