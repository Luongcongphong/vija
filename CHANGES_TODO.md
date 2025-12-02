# CÁC THAY ĐỔI CẦN THỰC HIỆN

## ✅ 1. Ẩn mục QLBG - HOÀN TẤT
- File: `Vija-fe/src/components/layout/AppSidebar.vue`
- Đã comment out menu item QLBG

## 🔄 2. QLDM: Thêm cột Số BG, Mã KH và Filter - ĐANG LÀM

### Backend Changes Needed:
1. **Database Migration**: Thêm cột `so_bg` và `ma_kh` vào bảng `qldm`
   ```sql
   ALTER TABLE qldm ADD COLUMN so_bg VARCHAR(50) AFTER ma_bv;
   ALTER TABLE qldm ADD COLUMN ma_kh VARCHAR(50) AFTER so_bg;
   ```

2. **Update qldmController.ts**:
   - Thêm `so_bg`, `ma_kh` vào create/update
   - Thêm API filter theo Mã BV

3. **Update qldmRoutes.ts**:
   - Thêm route search

### Frontend Changes Needed:
1. **Update qldmService.ts**:
   - Thêm `so_bg`, `ma_kh` vào interface QLDM
   - Thêm method search

2. **Update QLDM.vue**:
   - Thêm cột Số BG, Mã KH vào bảng
   - Thêm input Số BG, Mã KH vào form
   - Thêm filter/search theo Mã BV
   - Hiển thị dạng danh sách (đã có)

## 🔄 3. QLPO: Thêm cột Số Lượng - ĐANG LÀM

### Backend Changes Needed:
1. **Database Migration**: Thêm cột `so_luong` vào bảng `qlpo`
   ```sql
   ALTER TABLE qlpo ADD COLUMN so_luong INT DEFAULT 0 AFTER ma_bv;
   ```

2. **Update qlpoController.ts**:
   - Thêm `so_luong` vào create/update

### Frontend Changes Needed:
1. **Update qlpoService.ts**:
   - Thêm `so_luong` vào interface QLPO

2. **Update QLPO.vue**:
   - Thêm cột Số Lượng vào bảng
   - Thêm input Số Lượng vào form
   - Cập nhật import Excel template

## Thứ tự thực hiện:
1. ✅ Ẩn QLBG (Done)
2. QLPO: Thêm Số Lượng (Đơn giản hơn)
3. QLDM: Thêm Số BG, Mã KH và Filter (Phức tạp hơn)
