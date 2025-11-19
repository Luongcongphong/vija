# Cập nhật tính năng mới

## 1. QLDM - Quản lý Định mức

✅ **Đã cập nhật:**
- Sử dụng SearchableSelect cho PO và Mã BV (lấy từ QLPO)
- Kết nối API backend
- Đổi field names sang snake_case
- CRUD operations hoàn chỉnh

**Cách sử dụng:**
1. Vào QLPO → Thêm PO và Mã BV
2. Vào QLDM → Chọn PO và Mã BV từ dropdown
3. Nhập Số lượng, Đơn giá, Định mức

## 2. QLKH - Tự động lấy Đơn giá từ QLDM

✅ **Tính năng mới:**
- Khi chọn PO và Mã BV, hệ thống tự động tìm và điền Đơn giá từ QLDM
- Nếu tìm thấy → Đơn giá tự động điền và readonly (màu xám)
- Nếu không tìm thấy → Có thể nhập thủ công

**Quy trình:**
1. Vào QLDM → Thêm định mức với PO, Mã BV và Đơn giá
2. Vào QLKH → Chọn PO và Mã BV
3. Đơn giá tự động điền từ QLDM
4. Nhập Số lượng → Thành tiền tự động tính

**Ví dụ:**
```
QLDM:
- PO: PO001
- Mã BV: BV001
- Đơn giá: 50,000 VNĐ

QLKH:
- Chọn PO: PO001
- Chọn Mã BV: BV001
- Đơn giá: 50,000 VNĐ (tự động, readonly) ✅
- Số lượng: 100
- Thành tiền: 5,000,000 VNĐ (tự động)
```

## Luồng dữ liệu

```
QLPO (Quản lý PO)
    ↓
    ├─→ QLDM (Định mức + Đơn giá)
    │       ↓
    │       └─→ QLKH (Lấy Đơn giá tự động)
    │
    ├─→ QLNB (Chi phí nội bộ)
    │
    └─→ Dashboard (Tổng hợp)
```

## Lợi ích

✅ **Tránh nhập sai:**
- PO và Mã BV chọn từ danh sách có sẵn
- Đơn giá tự động từ QLDM

✅ **Tiết kiệm thời gian:**
- Không cần nhập lại Đơn giá
- Tự động tính Thành tiền

✅ **Dữ liệu nhất quán:**
- Đơn giá đồng bộ từ QLDM
- Giảm sai sót do nhập tay

## Ghi chú

- Nếu QLDM chưa có Đơn giá cho PO + Mã BV → Có thể nhập thủ công
- Đơn giá từ QLDM sẽ readonly (không sửa được)
- Muốn đổi Đơn giá → Sửa trong QLDM

## Checklist hoàn thành

- [x] QLPO - Kết nối API
- [x] QLDM - SearchableSelect + API
- [x] QLKH - Tự động lấy Đơn giá từ QLDM
- [x] QLNB - SearchableSelect + API
- [ ] QLUser - Kết nối API
- [ ] Dashboard - Kết nối API
