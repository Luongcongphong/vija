# Hướng dẫn kết nối Backend

## Đã hoàn thành

✅ Tạo các service API trong `src/services/`:
- `api.ts` - Axios instance với interceptor
- `authService.ts` - Đăng nhập/đăng ký
- `qlkhService.ts` - Quản lý Khách hàng
- `qlnbService.ts` - Quản lý Nội bộ
- `qldmService.ts` - Quản lý Định mức
- `qlpoService.ts` - Quản lý PO
- `userService.ts` - Quản lý User
- `dashboardService.ts` - Dashboard

✅ Cập nhật view:
- `SignIn.vue` - Đã kết nối API đăng nhập
- `QLKH.vue` - Đã kết nối API QLKH

## Cần cập nhật

Các view sau cần cập nhật tương tự QLKH.vue:

### 1. QLNB.vue
Thay đổi:
- Import `qlnbService`
- Đổi tên field: `maBV` → `ma_bv`, `phoiLieu` → `phoi_lieu`, etc.
- Sử dụng `item.id` thay vì `index`
- Gọi API thay vì localStorage

### 2. QLDM.vue
Thay đổi:
- Import `qldmService`
- Đổi tên field: `maBV` → `ma_bv`, `soLuong` → `so_luong`, `donGia` → `don_gia`, `dinhMuc` → `dinh_muc`
- Sử dụng API

### 3. QLPO.vue
Thay đổi:
- Import `qlpoService`
- Đổi tên field: `maBV` → `ma_bv`
- Sử dụng API

### 4. QLUser.vue
Thay đổi:
- Import `userService`
- Sử dụng API

### 5. Dashboard.vue
Thay đổi:
- Import `dashboardService`
- Gọi `dashboardService.getData()` thay vì đọc localStorage
- Đổi tên field theo snake_case

## Cấu hình

File `.env`:
```
VITE_API_URL=http://localhost:3000/api
```

## Chạy ứng dụng

1. Đảm bảo backend đang chạy tại `http://localhost:3000`
2. Chạy frontend:
```bash
npm run dev
```

## Lưu ý

- Token JWT được lưu trong localStorage
- Tự động redirect về login nếu token hết hạn (401)
- Tất cả request đều có Authorization header
- Field names từ frontend (camelCase) đã được đổi sang backend (snake_case)

## Mapping Field Names

| Frontend (camelCase) | Backend (snake_case) |
|---------------------|---------------------|
| maBV                | ma_bv               |
| soLuong             | so_luong            |
| donGia              | don_gia             |
| thanhTien           | thanh_tien          |
| phoiLieu            | phoi_lieu           |
| giaCongNgoai        | gia_cong_ngoai      |
| giaCongNoiBo        | gia_cong_noi_bo     |
| xuLyBeMatItem       | xu_ly_be_mat        |
| vanChuyen           | van_chuyen          |
| phiQLDN             | phi_qldn            |
| tongPhi             | tong_phi            |
| loiNhuan            | loi_nhuan           |
| tyLe                | ty_le               |
| ngayTao             | ngay_tao            |
| ghiChu              | ghi_chu             |
| dinhMuc             | dinh_muc            |
