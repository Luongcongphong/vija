# Vija Backend API

Backend API cho hệ thống quản lý Vija sử dụng Node.js, Express, TypeScript và MySQL.

## Yêu cầu

- Node.js >= 16
- MySQL >= 5.7
- npm hoặc yarn

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Cấu hình database trong file `.env`:
```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=vija
DB_PASSWORD=vija@2024
DB_NAME=vija
JWT_SECRET=vija_secret_key_2024
```

3. Thiết lập database (tự động tạo bảng và user admin):
```bash
npm run setup
```

Hoặc nếu muốn tạo thủ công:
```bash
mysql -u vija -p < database.sql
npm run create-admin
```

## Chạy ứng dụng

### Development mode:
```bash
npm run dev
```

### Production mode:
```bash
npm run build
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký

### QLKH (Quản lý Khách hàng)
- `GET /api/qlkh` - Lấy danh sách
- `GET /api/qlkh/:id` - Lấy chi tiết
- `POST /api/qlkh` - Tạo mới
- `PUT /api/qlkh/:id` - Cập nhật
- `DELETE /api/qlkh/:id` - Xóa

### QLNB (Quản lý Nội bộ)
- `GET /api/qlnb` - Lấy danh sách
- `GET /api/qlnb/:id` - Lấy chi tiết
- `POST /api/qlnb` - Tạo mới
- `PUT /api/qlnb/:id` - Cập nhật
- `DELETE /api/qlnb/:id` - Xóa

### QLDM (Quản lý Định mức)
- `GET /api/qldm` - Lấy danh sách
- `GET /api/qldm/:id` - Lấy chi tiết
- `POST /api/qldm` - Tạo mới
- `PUT /api/qldm/:id` - Cập nhật
- `DELETE /api/qldm/:id` - Xóa

### QLPO (Quản lý PO)
- `GET /api/qlpo` - Lấy danh sách
- `GET /api/qlpo/:id` - Lấy chi tiết
- `POST /api/qlpo` - Tạo mới
- `PUT /api/qlpo/:id` - Cập nhật
- `DELETE /api/qlpo/:id` - Xóa

### Users (Quản lý User)
- `GET /api/users` - Lấy danh sách
- `GET /api/users/:id` - Lấy chi tiết
- `POST /api/users` - Tạo mới
- `PUT /api/users/:id` - Cập nhật
- `DELETE /api/users/:id` - Xóa

### Dashboard
- `GET /api/dashboard` - Lấy dữ liệu tổng hợp

## Authentication

Tất cả các endpoint (trừ `/api/auth/login` và `/api/auth/register`) yêu cầu JWT token trong header:

```
Authorization: Bearer <token>
```

## Cấu trúc dữ liệu

### QLKH
```json
{
  "po": "PO001",
  "ma_bv": "BV001",
  "so_luong": 100,
  "don_gia": 50000
}
```

### QLNB
```json
{
  "po": "PO001",
  "ma_bv": "BV001",
  "phoi_lieu": 1000000,
  "gia_cong_ngoai": 500000,
  "gia_cong_noi_bo": 800000,
  "xu_ly_be_mat": 300000,
  "van_chuyen": 200000,
  "phi_qldn": 200000
}
```

## Lưu ý

- Đảm bảo MySQL đang chạy trước khi start server
- Thông tin kết nối database phải chính xác trong file `.env`
- JWT token có thời hạn 24 giờ
- Tất cả số tiền được lưu dưới dạng DECIMAL(15,2)
