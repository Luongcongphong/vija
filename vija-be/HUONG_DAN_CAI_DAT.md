# Hướng dẫn cài đặt Backend Vija

## Bước 1: Cài đặt dependencies

Mở terminal trong thư mục `vija-be` và chạy:

```bash
npm install
```

## Bước 2: Cấu hình MySQL

Đảm bảo MySQL đang chạy với thông tin:
- Host: localhost
- Port: 3306
- Username: vija
- Password: vija@2024

## Bước 3: Thiết lập database

### Cách 1: Tự động (Khuyến nghị)

Chỉ cần chạy một lệnh duy nhất:

```bash
npm run setup
```

Lệnh này sẽ:
- ✅ Tự động tạo database `vija` nếu chưa có
- ✅ Tạo tất cả các bảng (users, qlkh, qlnb, qldm, qlpo)
- ✅ Kiểm tra và thêm các cột nếu thiếu
- ✅ Tạo user admin (username: `admin`, password: `admin123`)

### Cách 2: Thủ công

```bash
mysql -u vija -p < database.sql
npm run create-admin
```

Nhập password: `vija@2024`

## Bước 4: Chạy server

### Development mode (tự động reload khi có thay đổi):

```bash
npm run dev
```

Server sẽ tự động:
- ✅ Kiểm tra và tạo các bảng nếu chưa có
- ✅ Kiểm tra và thêm các cột nếu thiếu
- ✅ Tạo index cho hiệu suất

### Production mode:

```bash
npm run build
npm start
```

## Kiểm tra

Server sẽ chạy tại: `http://localhost:3000`

Mở trình duyệt và truy cập `http://localhost:3000` - bạn sẽ thấy:
```json
{"message": "Vija Backend API"}
```

## Test API

### Test đăng nhập:

```bash
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

Nếu thành công, bạn sẽ nhận được token JWT.

## Lỗi thường gặp

### 1. Không kết nối được MySQL

- Kiểm tra MySQL đang chạy
- Kiểm tra username/password trong file `.env`
- Kiểm tra database `vija` đã được tạo

### 2. Module not found

```bash
npm install
```

### 3. Port 3000 đã được sử dụng

Thay đổi PORT trong file `.env`:
```
PORT=3001
```

## Cấu trúc thư mục

```
vija-be/
├── src/
│   ├── config/          # Cấu hình database
│   ├── controllers/     # Xử lý logic
│   ├── middleware/      # Authentication middleware
│   ├── routes/          # Định nghĩa routes
│   ├── types/           # TypeScript types
│   └── server.ts        # Entry point
├── scripts/             # Scripts tiện ích
├── database.sql         # SQL schema
├── .env                 # Cấu hình môi trường
└── package.json
```

## Kết nối với Frontend

Trong frontend (Vija-fe), cấu hình API base URL:

```typescript
const API_BASE_URL = 'http://localhost:3000/api';
```

Sau khi đăng nhập, lưu token và gửi kèm trong mọi request:

```typescript
headers: {
  'Authorization': `Bearer ${token}`
}
```
