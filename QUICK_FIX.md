# Quick Fix - Lỗi không thể tải dữ liệu

## Nguyên nhân
Token cũ không có thông tin `role` sau khi thêm hệ thống phân quyền.

## Giải pháp nhanh (2 phút)

### Bước 1: Xóa localStorage
1. Mở trang web
2. Nhấn F12 (Developer Tools)
3. Vào tab **Application**
4. Chọn **Local Storage** → URL của bạn
5. Xóa 2 key:
   - `token`
   - `user`
6. Refresh trang (F5)

### Bước 2: Đăng nhập lại
- Username: `admin`
- Password: `admin123`

### Bước 3: Kiểm tra
- Vào Dashboard → Nếu thấy dữ liệu → OK ✅
- Vào QLKH → Nếu thấy dữ liệu → OK ✅

## Nếu vẫn lỗi

### Backend
```bash
# Terminal 1
cd vija-be
npm run setup
npm run dev
```

### Frontend
```bash
# Terminal 2
cd Vija-fe
npm run dev
```

### Clear browser cache
- Ctrl + Shift + Delete
- Xóa Cookies và Cache
- Hard refresh: Ctrl + Shift + R

## Kiểm tra backend

```bash
# Test backend
curl http://localhost:3000

# Test login
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

## Đã fix

✅ Middleware tương thích token cũ
✅ Token cũ (không có role) → Mặc định admin
✅ Token mới (có role) → Sử dụng role từ token
✅ Thông báo lỗi rõ ràng hơn

## Lưu ý

- Sau khi đăng nhập lại, token mới sẽ có thông tin role
- Không cần xóa database
- Không cần cài lại dependencies
- Chỉ cần xóa localStorage và đăng nhập lại
