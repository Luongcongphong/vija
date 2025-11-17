# Quick Start - Vija Backend

## Cài đặt nhanh trong 3 bước

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình database
Đảm bảo file `.env` có thông tin đúng:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=vija
DB_PASSWORD=vija@2024
DB_NAME=vija
```

### 3. Thiết lập và chạy
```bash
npm run setup
npm run dev
```

**Xong!** Server chạy tại `http://localhost:3000`

---

## Nếu gặp lỗi

### Lỗi: Database không tồn tại
```bash
npm run create-db
npm run setup
```

### Lỗi: Không kết nối được MySQL
- Kiểm tra MySQL đang chạy
- Kiểm tra thông tin trong `.env`
- Thử kết nối thủ công: `mysql -u vija -p`

### Lỗi: Port 3000 đã được sử dụng
Đổi PORT trong `.env`:
```
PORT=3001
```

---

## Test API

### 1. Kiểm tra server
```bash
curl http://localhost:3000
```

### 2. Đăng nhập
```bash
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

### 3. Lấy danh sách QLKH (cần token)
```bash
curl http://localhost:3000/api/qlkh ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Tính năng tự động

✅ Server tự động tạo bảng nếu chưa có khi khởi động
✅ Tự động kiểm tra và thêm cột thiếu
✅ Tự động tạo index cho hiệu suất tốt hơn

---

## Tài khoản mặc định

- **Username:** admin
- **Password:** admin123

Đổi password sau khi đăng nhập lần đầu!
