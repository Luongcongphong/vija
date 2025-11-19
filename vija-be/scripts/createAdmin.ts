import bcrypt from 'bcryptjs';
import pool from '../src/config/database';

async function createAdmin() {
  try {
    const username = 'admin';
    const password = 'admin123';
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await pool.query(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE password = ?, role = ?',
      [username, hashedPassword, 'admin', hashedPassword, 'admin']
    );
    
    console.log('✓ Tạo user admin thành công!');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Role: admin');
    
    process.exit(0);
  } catch (error) {
    console.error('Lỗi:', error);
    process.exit(1);
  }
}

createAdmin();
