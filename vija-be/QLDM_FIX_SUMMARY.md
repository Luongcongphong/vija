# QLDM Fix Summary - 2024-12-12

## Vấn đề
Các cột Ngày BG, Nguyên Liệu, XLBM, Ghi Chú trong QLDM không hiển thị dữ liệu sau khi thêm mới hoặc cập nhật, chỉ hiển thị dấu "-".

## Nguyên nhân
1. **Backend Controller thiếu fields**: `qldmController.ts` không xử lý các trường `ngay_bg`, `nguyen_lieu`, `xlbm`, `ghi_chu` trong hàm `createQLDM` và `updateQLDM`.
2. **Database thiếu columns**: Bảng `qldm` không có các cột tương ứng.

## Giải pháp đã thực hiện

### 1. Database Migration
- Tạo file migration: `migrations/add_missing_columns_to_qldm.sql`
- Thêm các cột:
  - `ngay_bg` (DATE)
  - `nguyen_lieu` (VARCHAR(255))
  - `xlbm` (VARCHAR(255))
  - `ghi_chu` (TEXT)
- Chạy migration thành công với script: `scripts/run-migration.js`

### 2. Backend Controller Update
File: `src/controllers/qldmController.ts`

**Trước:**
```typescript
const { ma_bv, so_bg, ma_kh, so_luong, dvt, don_gia, don_vi_tien_te } = req.body;
```

**Sau:**
```typescript
const { 
  ma_bv, 
  so_bg, 
  ma_kh, 
  ngay_bg,
  nguyen_lieu,
  xlbm,
  so_luong, 
  dvt, 
  don_gia, 
  don_vi_tien_te,
  ghi_chu
} = req.body;
```

**SQL Query cũ:**
```sql
INSERT INTO qldm (ma_bv, so_bg, ma_kh, so_luong, dvt, don_gia, don_vi_tien_te) VALUES (?, ?, ?, ?, ?, ?, ?)
```

**SQL Query mới:**
```sql
INSERT INTO qldm (ma_bv, so_bg, ma_kh, ngay_bg, nguyen_lieu, xlbm, so_luong, dvt, don_gia, don_vi_tien_te, ghi_chu) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
```

### 3. Frontend Debug
- Thêm debug logs tạm thời để kiểm tra dữ liệu
- Xóa debug code sau khi xác nhận hoạt động

## Cấu trúc bảng qldm sau khi sửa
```
┌─────────┬──────────────────┬─────────────────┬───────┬───────┬─────────────┐
│ Field   │ Type            │ Null  │ Key   │ Default │ Extra           │
├─────────┼──────────────────┼───────┼───────┼─────────┼─────────────────┤
│ id      │ int             │ NO    │ PRI   │ null    │ auto_increment  │
│ ma_bv   │ varchar(50)     │ NO    │ MUL   │ null    │                 │
│ so_bg   │ varchar(50)     │ YES   │       │ null    │                 │
│ ma_kh   │ varchar(50)     │ YES   │       │ null    │                 │
│ ngay_bg │ date            │ YES   │       │ null    │                 │
│ nguyen_lieu │ varchar(255) │ YES   │       │ null    │                 │
│ xlbm    │ varchar(255)    │ YES   │       │ null    │                 │
│ so_luong│ int             │ NO    │       │ null    │                 │
│ dvt     │ varchar(20)     │ YES   │       │ p       │                 │
│ don_gia │ decimal(15,2)   │ NO    │       │ null    │                 │
│ don_vi_tien_te │ varchar(10) │ YES │       │ VND     │                 │
│ ghi_chu │ text            │ YES   │       │ null    │                 │
│ created_at │ timestamp    │ YES   │       │ CURRENT_TIMESTAMP │ DEFAULT_GENERATED │
│ updated_at │ timestamp    │ YES   │       │ CURRENT_TIMESTAMP │ DEFAULT_GENERATED on update │
└─────────┴──────────────────┴───────┴───────┴─────────┴─────────────────┘
```

## Kết quả
✅ Các cột Ngày BG, Nguyên Liệu, XLBM, Ghi Chú bây giờ sẽ hiển thị đúng dữ liệu sau khi thêm mới hoặc cập nhật.
✅ Backend đã được build và restart thành công.
✅ Database migration hoàn tất.

## Files đã thay đổi
1. `vija-be/src/controllers/qldmController.ts` - Cập nhật logic xử lý dữ liệu
2. `vija-be/migrations/add_missing_columns_to_qldm.sql` - Migration script
3. `vija-be/scripts/run-migration.js` - Script chạy migration
4. `Vija-fe/src/views/QLDM.vue` - Xóa debug code