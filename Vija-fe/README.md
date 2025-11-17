# Hệ thống Quản lý

Hệ thống quản lý với các chức năng:
- **Dashboard**: Tổng hợp thông tin từ QLKH và QLNB, hiển thị lợi nhuận và tỷ lệ
- **QLKH**: Quản lý Khách hàng (PO, Mã BV, Số Lượng, Đơn giá, Thành tiền)
- **QLNB**: Quản lý Nội bộ (Chi phí: Phôi Liệu, Gia Công Ngoài, Gia Công Nội Bộ, Xử lý Bề Mặt, Vận Chuyển, Phí QLDN)
- **QLDM**: Quản lý Định mức
- **QLPO**: Quản lý PO
- **QL User**: Quản lý người dùng

## Đăng nhập mặc định
- Username: `admin`
- Password: `admin123`

## Cài đặt và Chạy

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build

# Preview production build
npm run preview
```

## Hướng dẫn sử dụng

1. Đăng nhập bằng tài khoản admin mặc định
2. Thêm dữ liệu vào **QLKH** (thông tin khách hàng)
3. Thêm dữ liệu vào **QLNB** (chi phí nội bộ) với cùng PO và Mã BV
4. Xem tổng hợp tại **Dashboard** - hệ thống tự động tính lợi nhuận và tỷ lệ

## Tính năng

- Quản lý dữ liệu với localStorage
- Tự động tính toán lợi nhuận = Thành tiền - Tổng phí
- Tự động tính tỷ lệ lợi nhuận
- Xác thực đăng nhập
- Giao diện responsive với Tailwind CSS
- Dark mode support
