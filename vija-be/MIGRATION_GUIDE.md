# HƯỚNG DẪN MIGRATION: Thay đổi QLNB từ Số BG sang Mã PO

## Tổng quan
Migration này thay đổi cột `so_bg` thành `ma_po` trong bảng `qlnb` để phù hợp với yêu cầu mới.

## Các thay đổi

### Database
- Bảng `qlnb`: Đổi cột `so_bg` → `ma_po`

### Backend
- `qlnbController.ts`: Cập nhật tất cả references từ `so_bg` → `ma_po`
- `dashboardController.ts`: Bỏ filter theo `so_bg`

### Frontend
- `QLNB.vue`: 
  - Thay header "Số BG" → "Mã PO"
  - Thêm filter theo Mã PO
  - Cập nhật form để chọn Mã PO thay vì Số BG
- `Dashboard.vue`: Bỏ filter theo Số BG
- `qlnbService.ts`: Cập nhật interface
- `dashboardService.ts`: Bỏ parameter `so_bg`

## Cách chạy Migration

### Bước 1: Backup Database
```bash
mysqldump -u root -p vija_db > backup_before_migration.sql
```

### Bước 2: Chạy Migration
```bash
cd vija-be
run_migration_qlnb.bat
```

Hoặc chạy thủ công:
```bash
mysql -u root -p vija_db < migrations/update_qlnb_so_bg_to_ma_po.sql
```

### Bước 3: Kiểm tra
```sql
-- Kiểm tra cấu trúc bảng
DESCRIBE qlnb;

-- Kiểm tra dữ liệu
SELECT * FROM qlnb LIMIT 5;
```

### Bước 4: Restart Backend
```bash
cd vija-be
npm run dev
```

### Bước 5: Test Frontend
1. Vào trang QLNB
2. Kiểm tra header đã đổi thành "Mã PO"
3. Test thêm/sửa/xóa với Mã PO
4. Test filter theo Mã PO
5. Vào Dashboard, kiểm tra đã bỏ filter Số BG

## Rollback (nếu cần)

Nếu có vấn đề, restore từ backup:
```bash
mysql -u root -p vija_db < backup_before_migration.sql
```

Sau đó revert code về commit trước đó.

## Lưu ý
- Migration này sẽ giữ nguyên dữ liệu, chỉ đổi tên cột
- Đảm bảo đã backup trước khi chạy
- Test kỹ trên môi trường dev trước khi deploy production
