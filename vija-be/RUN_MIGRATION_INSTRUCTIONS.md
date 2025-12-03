# Hướng dẫn chạy Migration

## Cách 1: Sử dụng script tự động (Windows)

1. Mở file `run_migration.bat`
2. Sửa thông tin kết nối database:
   ```batch
   set DB_HOST=localhost
   set DB_USER=root
   set DB_PASS=your_password
   set DB_NAME=vija_db
   ```
3. Lưu file và chạy `run_migration.bat`

## Cách 2: Chạy thủ công qua MySQL Command Line

```bash
mysql -u root -p vija_db < migrations/add_dvt_and_currency_to_qldm.sql
```

## Cách 3: Chạy qua phpMyAdmin hoặc MySQL Workbench

1. Mở file `migrations/add_dvt_and_currency_to_qldm.sql`
2. Copy nội dung
3. Paste vào SQL tab trong phpMyAdmin/MySQL Workbench
4. Chạy query

## Cách 4: Chạy từ Node.js (nếu đã có kết nối)

Tạo file `vija-be/run-migration.js`:

```javascript
const mysql = require('mysql2/promise');

async function runMigration() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'vija_db'
  });

  try {
    console.log('Running migration...');
    
    // Thêm cột dvt
    await connection.query(`
      ALTER TABLE qldm 
      ADD COLUMN dvt VARCHAR(20) DEFAULT 'p' AFTER so_luong
    `);
    console.log('✓ Added column: dvt');
    
    // Thêm cột don_vi_tien_te
    await connection.query(`
      ALTER TABLE qldm 
      ADD COLUMN don_vi_tien_te VARCHAR(10) DEFAULT 'VND' AFTER don_gia
    `);
    console.log('✓ Added column: don_vi_tien_te');
    
    // Cập nhật giá trị mặc định
    await connection.query(`UPDATE qldm SET dvt = 'p' WHERE dvt IS NULL`);
    await connection.query(`UPDATE qldm SET don_vi_tien_te = 'VND' WHERE don_vi_tien_te IS NULL`);
    console.log('✓ Updated default values');
    
    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await connection.end();
  }
}

runMigration();
```

Sau đó chạy:
```bash
cd vija-be
node run-migration.js
```

## Kiểm tra sau khi chạy

Chạy query này để kiểm tra:
```sql
DESCRIBE qldm;
```

Bạn sẽ thấy 2 cột mới:
- `dvt` VARCHAR(20) DEFAULT 'p'
- `don_vi_tien_te` VARCHAR(10) DEFAULT 'VND'
