# Debug Steps - Lỗi "Không thể truy cập dữ liệu"

## Bước 1: Kiểm tra Backend đang chạy

```bash
# Terminal 1
cd vija-be
npm run dev
```

Kiểm tra xem có thông báo:
```
🚀 Server đang chạy tại http://localhost:3000
```

## Bước 2: Test Backend trực tiếp

Mở trình duyệt hoặc dùng curl:

```bash
# Test health check
curl http://localhost:3000

# Kết quả mong đợi:
{"message":"Vija Backend API"}
```

## Bước 3: Test Login API

```bash
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

Kết quả mong đợi:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin"
  }
}
```

**Nếu lỗi:** Chạy lại `npm run setup` trong vija-be

## Bước 4: Kiểm tra Frontend

Mở Browser Console (F12) khi truy cập QLKH và xem:

### 4.1. Kiểm tra token
```javascript
localStorage.getItem('token')
```

**Nếu null:** Token không được lưu sau khi đăng nhập

### 4.2. Kiểm tra API URL
```javascript
console.log(import.meta.env.VITE_API_URL)
```

**Nếu undefined:** File `.env` không được load

### 4.3. Xem Network tab
- Mở tab Network trong DevTools
- Reload trang QLKH
- Xem request đến `/api/qlkh`
- Kiểm tra:
  - Status code (401 = không có token, 500 = lỗi server)
  - Request Headers (có Authorization không?)
  - Response (thông báo lỗi gì?)

## Bước 5: Fix các lỗi thường gặp

### Lỗi 1: Backend không chạy
```bash
cd vija-be
npm run dev
```

### Lỗi 2: Database chưa setup
```bash
cd vija-be
npm run setup
```

### Lỗi 3: Token không được lưu sau login

Kiểm tra file `SignIn.vue` có gọi `authService.login()` đúng không.

Sau khi đăng nhập, check:
```javascript
localStorage.getItem('token')  // Phải có giá trị
```

### Lỗi 4: CORS error

Backend đã có CORS enabled, nhưng nếu vẫn lỗi, kiểm tra:
- Frontend chạy đúng port (thường 5173)
- Backend chạy đúng port 3000

### Lỗi 5: .env không load

Đảm bảo:
1. File `.env` ở root của Vija-fe
2. Có dòng: `VITE_API_URL=http://localhost:3000/api`
3. Restart dev server sau khi tạo/sửa .env

```bash
# Stop server (Ctrl+C)
npm run dev
```

## Bước 6: Test thủ công với token

1. Đăng nhập và copy token từ localStorage
2. Test API với token:

```bash
curl http://localhost:3000/api/qlkh ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Nếu thành công → Frontend có vấn đề
Nếu thất bại → Backend có vấn đề

## Checklist

- [ ] Backend đang chạy (port 3000)
- [ ] Database đã setup (có bảng users, qlkh, etc.)
- [ ] User admin đã tạo
- [ ] Login API trả về token
- [ ] Token được lưu vào localStorage
- [ ] Frontend .env có VITE_API_URL
- [ ] Frontend dev server đã restart sau khi tạo .env
- [ ] Browser console không có lỗi CORS
- [ ] Network tab thấy request có Authorization header

## Quick Fix

Nếu vẫn lỗi, thử:

```bash
# 1. Reset backend
cd vija-be
npm run setup
npm run dev

# 2. Reset frontend (terminal mới)
cd Vija-fe
rm -rf node_modules
npm install
npm install axios
npm run dev

# 3. Clear browser
# - Xóa localStorage (F12 > Application > Local Storage > Clear)
# - Hard refresh (Ctrl+Shift+R)
# - Đăng nhập lại
```
