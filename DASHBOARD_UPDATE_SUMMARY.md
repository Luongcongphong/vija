# Cập nhật Dashboard - Lấy dữ liệu từ QLPO và QLDM

## Thay đổi đã thực hiện

### Backend (vija-be/src/controllers/dashboardController.ts)

**Trước đây:**
- Dashboard lấy dữ liệu từ QLBG (Báo giá)
- JOIN với QLPO để lấy Mã PO
- Đơn giá và số lượng lấy từ QLBG

**Bây giờ:**
- Dashboard lấy dữ liệu chính từ **QLPO** (Purchase Order)
- Mã PO, Mã BV, Số Lượng: lấy từ **QLPO**
- Đơn giá: lấy từ **QLDM** (Định mức) dựa trên:
  - `ma_bv` (Mã bao vải)
  - `so_luong` (Số lượng)
- Thành tiền = Số lượng × Đơn giá
- JOIN với QLNB để lấy các chi phí (phôi liệu, gia công, vận chuyển...)

### SQL Query mới:
```sql
SELECT 
  po.id as id,
  po.ma_po,
  po.ma_bv,
  po.so_luong,
  COALESCE(dm.don_gia, 0) as don_gia,
  (po.so_luong * COALESCE(dm.don_gia, 0)) as thanh_tien,
  COALESCE(nb.phoi_lieu, 0) as phoi_lieu,
  COALESCE(nb.gia_cong_ngoai, 0) as gia_cong_ngoai,
  COALESCE(nb.gia_cong_noi_bo, 0) as gia_cong_noi_bo,
  COALESCE(nb.xu_ly_be_mat, 0) as xu_ly_be_mat,
  COALESCE(nb.van_chuyen, 0) as van_chuyen,
  COALESCE(nb.phi_qldn, 0) as phi_qldn,
  COALESCE(nb.tong_phi, 0) as tong_phi,
  ((po.so_luong * COALESCE(dm.don_gia, 0)) - COALESCE(nb.tong_phi, 0)) as loi_nhuan,
  CASE 
    WHEN (po.so_luong * COALESCE(dm.don_gia, 0)) > 0 THEN 
      ROUND((((po.so_luong * COALESCE(dm.don_gia, 0)) - COALESCE(nb.tong_phi, 0)) / (po.so_luong * COALESCE(dm.don_gia, 0)) * 100), 2)
    ELSE 0 
  END as ty_le,
  po.created_at as ngay_tao
FROM qlpo po
LEFT JOIN qldm dm ON dm.ma_bv = po.ma_bv AND dm.so_luong = po.so_luong
LEFT JOIN qlnb nb ON nb.ma_po = po.ma_po AND nb.ma_bv = po.ma_bv
ORDER BY 
  CAST(REGEXP_REPLACE(po.ma_po, '[^0-9]', '') AS UNSIGNED) ASC,
  po.ma_po ASC
```

### Frontend (Vija-fe/src/views/Dashboard.vue)

**Cập nhật Interface:**
- Bỏ các trường không cần: `stt`, `so_bg`
- Giữ lại các trường cần thiết từ QLPO và QLDM

**Không thay đổi:**
- Giao diện hiển thị
- Chức năng lọc theo Mã PO
- Chức năng export Excel
- Tính toán tổng theo nhóm Mã PO

## Luồng dữ liệu mới

1. **QLPO** (Purchase Order): Chứa thông tin đơn hàng
   - Mã PO
   - Mã BV
   - Số lượng

2. **QLDM** (Định mức): Chứa đơn giá theo Mã BV và Số lượng
   - Mã BV
   - Số lượng
   - Đơn giá

3. **QLNB** (Nội bộ): Chứa các chi phí
   - Phôi liệu
   - Gia công ngoài
   - Gia công nội bộ
   - Xử lý bề mặt
   - Vận chuyển
   - Phí QLDN

4. **Dashboard**: Tổng hợp và tính toán
   - Thành tiền = Số lượng × Đơn giá
   - Lợi nhuận = Thành tiền - Tổng phí
   - Tỷ lệ % = (Lợi nhuận / Thành tiền) × 100

## Lưu ý quan trọng

⚠️ **Điều kiện JOIN với QLDM:**
- Phải khớp cả `ma_bv` VÀ `so_luong`
- Nếu không tìm thấy đơn giá phù hợp trong QLDM, đơn giá sẽ là 0
- Cần đảm bảo QLDM có đầy đủ dữ liệu định mức cho các Mã BV và Số lượng trong QLPO

## Kiểm tra sau khi cập nhật

1. Khởi động lại backend server
2. Refresh trang Dashboard
3. Kiểm tra dữ liệu hiển thị đúng
4. Kiểm tra đơn giá có được lấy từ QLDM
5. Kiểm tra tính toán thành tiền, lợi nhuận, tỷ lệ %
