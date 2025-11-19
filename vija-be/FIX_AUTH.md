# Fix lỗi xác thực sau khi thêm phân quyền

## Vấn đề

Sau khi thêm hệ thống phân quyền, token cũ không có thông tin `role` gây lỗi xác thực.

## Giải pháp

### 1. Tương thích ngược (Đã fix)

Middleware đã được cập nhật để:
- Token cũ (không có role) → Mặc định là `admin`
- Token mới (có role) → Sử dụng role từ token

### 2. Đăng nhập lại (Khuyến nghị)

**Cách nhanh nhất:**
1. Xóa localStorage trong browser:
   - F12 → Application → Local Storage
   - Xóa `token` và `user`
2. Đăng nhập lại với:
   - Username: `admin`
   - Password: `admin123`

### 3. Cập nhật database

Nếu database chưa có cột `role`:

```bash
cd vija-be
npm run setup
```

Hoặc chạy SQL:
```sql
ALTER TABLE users 
ADD COLUMN role ENUM('admin', 'sales', 'kythuat') DEFAULT 'sales';

UPDATE users SET role = 'admin' WHERE username = 'admin';
```

## Kiểm tra

### 1. Backend đang chạy
```bash
cd vija-be
npm run dev
```

### 2. Test API
```bash
curl http://localhost:3000
```

Kết quả mong đợi:
```json
{"message":"Vija Backend API"}
```

### 3. Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

Kết quả mong đợi:
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

## Nếu vẫn lỗi

### Bước 1: Clear browser cache
- Ctrl + Shift + Delete
- Xóa Cookies và Cache

### Bước 2: Hard refresh
- Ctrl + Shift + R

### Bước 3: Restart backend
```bash
# Stop server (Ctrl+C)
cd vija-be
npm run dev
```

### Bước 4: Restart frontend
```bash
# Stop server (Ctrl+C)
cd Vija-fe
npm run dev
```

### Bước 5: Kiểm tra console
- F12 → Console
- Xem lỗi cụ thể
- F12 → Network → Xem request/response

## Lỗi thường gặp

### Lỗi 401: Token không hợp lệ
**Giải pháp:** Đăng nhập lại

### Lỗi 403: Không có quyền
**Giải pháp:** 
- Đăng nhập với tài khoản có quyền phù hợp
- Hoặc đăng nhập lại để lấy token mới có role

### Lỗi: Cannot read property 'role'
**Giải pháp:** Đã fix trong middleware, restart backend

## Checklist

- [ ] Backend đang chạy (port 3000)
- [ ] Database có cột `role`
- [ ] User admin có role = 'admin'
- [ ] Đã xóa localStorage cũ
- [ ] Đã đăng nhập lại
- [ ] Token mới có thông tin role
- [ ] Frontend có thể gọi API

## Liên hệ

Nếu vẫn gặp vấn đề, cung cấp:
1. Lỗi trong Console (F12)
2. Response từ API (Network tab)
3. Thông tin token (localStorage)
