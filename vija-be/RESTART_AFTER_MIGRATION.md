# ✅ MIGRATION HOÀN TẤT - CẦN RESTART

Migration đã chạy thành công! Database đã được cập nhật.

## Các thay đổi đã thực hiện:
- ✅ Bảng `qlnb`: Đổi cột `so_bg` → `ma_po`
- ✅ Dữ liệu đã được copy từ `so_bg` sang `ma_po`
- ✅ Backend code đã được cập nhật
- ✅ Frontend code đã được cập nhật

## Bước tiếp theo:

### 1. Restart Backend Server
Nếu backend đang chạy, hãy dừng và khởi động lại:

**Cách 1: Nếu đang chạy trong terminal**
- Nhấn `Ctrl + C` để dừng
- Chạy lại: `npm run dev`

**Cách 2: Nếu đang chạy bằng PM2**
```bash
pm2 restart vija-be
```

**Cách 3: Nếu đang chạy bằng nodemon**
- Nodemon sẽ tự động restart khi phát hiện thay đổi file

### 2. Test các chức năng

#### Test QLNB:
1. Vào trang **Quản lý Nội bộ**
2. Kiểm tra header đã đổi thành "Mã PO"
3. Click "Thêm mới":
   - Chọn Mã PO (thay vì Số BG)
   - Chọn Mã BV tương ứng
   - Điền các chi phí
   - Lưu
4. Test filter theo Mã PO
5. Test sửa và xóa

#### Test Dashboard:
1. Vào trang **Dashboard**
2. Kiểm tra đã bỏ filter "Số BG"
3. Chỉ còn filter "Mã PO"
4. Test filter theo Mã PO
5. Kiểm tra dữ liệu hiển thị đúng

### 3. Nếu gặp lỗi

#### Lỗi "Unknown column 'so_bg'"
- Backend chưa restart
- Giải pháp: Restart backend server

#### Lỗi "Unknown column 'ma_po'" 
- Migration chưa chạy hoặc chạy không thành công
- Giải pháp: Chạy lại `node run-migration.js`

#### Dữ liệu không hiển thị đúng
- Cache browser
- Giải pháp: Hard refresh (Ctrl + Shift + R) hoặc xóa cache

## Rollback (nếu cần)

Nếu có vấn đề nghiêm trọng, có thể rollback:

```sql
-- Thêm lại cột so_bg
ALTER TABLE qlnb ADD COLUMN so_bg VARCHAR(50) AFTER id;

-- Copy dữ liệu từ ma_po về so_bg
UPDATE qlnb SET so_bg = ma_po;

-- Xóa cột ma_po
ALTER TABLE qlnb DROP COLUMN ma_po;

-- Set so_bg NOT NULL
ALTER TABLE qlnb MODIFY COLUMN so_bg VARCHAR(50) NOT NULL;
```

Sau đó revert code về commit trước.

## Liên hệ
Nếu gặp vấn đề, vui lòng liên hệ team dev.
