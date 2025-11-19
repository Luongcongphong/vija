# Emergency Fix - Tạm bỏ phân quyền

## Đã làm

✅ Tạm thời bỏ tất cả middleware phân quyền
✅ Chỉ giữ lại authMiddleware (kiểm tra token)
✅ Tất cả user đã đăng nhập đều có quyền truy cập mọi module

## Làm ngay

### Bước 1: Xóa localStorage
1. F12 → Application → Local Storage
2. Xóa `token` và `user`
3. F5 (Refresh)

### Bước 2: Restart Backend
```bash
cd vija-be
# Ctrl+C để stop
npm run dev
```

### Bước 3: Đăng nhập lại
- Username: `admin`
- Password: `admin123`

### Bước 4: Kiểm tra
- Dashboard → Phải thấy dữ liệu
- QLKH → Phải thấy dữ liệu
- QLNB → Phải thấy dữ liệu

## Nếu vẫn lỗi

### Check backend đang chạy
```bash
curl http://localhost:3000
```

Phải thấy: `{"message":"Vija Backend API"}`

### Check login
```bash
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

Phải thấy token

### Check database
```bash
cd vija-be
npm run setup
```

## Lưu ý

- Phân quyền đã TẠM BỎ để hệ thống hoạt động
- Tất cả user có quyền như nhau
- Sẽ thêm lại phân quyền sau khi hệ thống ổn định
- Hiện tại ưu tiên cho hệ thống chạy được

## Các file đã sửa

- vija-be/src/routes/qlkhRoutes.ts
- vija-be/src/routes/qlnbRoutes.ts
- vija-be/src/routes/qldmRoutes.ts
- vija-be/src/routes/qlpoRoutes.ts
- vija-be/src/routes/userRoutes.ts

## Sau khi fix

1. Xóa localStorage
2. Restart backend
3. Đăng nhập lại
4. Test tất cả các trang
