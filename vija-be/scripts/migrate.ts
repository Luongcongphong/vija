import dotenv from 'dotenv';
import pool from '../src/config/database';

dotenv.config();

async function migrate() {
  try {
    console.log('🚀 Đang chạy migration sửa lỗi DB...');

    // 1. Kiểm tra và DROP cột so_bg trong bảng qlnb
    try {
      await pool.query('ALTER TABLE qlnb DROP COLUMN so_bg');
      console.log('✅ Đã xoá thành công cột so_bg dư thừa khỏi bảng qlnb');
    } catch (error: any) {
      if (error.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
        console.log('⚠️ Cột so_bg đã được xoá từ trước, bỏ qua...');
      } else {
        throw error;
      }
    }

    console.log('\n🎉 Hoàn thành cập nhật cấu trúc database!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Lỗi khi chạy migration:', error);
    process.exit(1);
  }
}

migrate();
