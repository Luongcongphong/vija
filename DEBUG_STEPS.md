# Debug Steps - Reload liên tục

## Bước 1: Xóa TOÀN BỘ localStorage

1. Mở trang web
2. F12 → Console
3. Chạy lệnh:
```javascript
localStorage.clear()
```
4. F5 (Refresh)

## Bước 2: Kiểm tra Backend

```bash
# Terminal 1
cd vija-be
npm run dev
```

Xem có lỗi gì không?

## Bước 3: Test API trực tiếp

Mở browser console (F12) và chạy:

```javascript
// Test backend
fetch('http://localhost:3000')
  .then(r => r.json())
  .then(d => console.log('Backend:', d))

// Test login
fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({username: 'admin', password: 'admin123'})
})
  .then(r => r.json())
  .then(d => console.log('Login:', d))
```

## Bước 4: Kiểm tra Network

1. F12 → Network tab
2. Refresh trang
3. Xem request nào bị lỗi
4. Click vào request đó xem Response

## Bước 5: Kiểm tra Console

1. F12 → Console tab
2. Xem có lỗi màu đỏ không
3. Copy lỗi đó

## Bước 6: Hard Reset

```bash
# Stop tất cả
# Ctrl+C ở cả 2 terminal

# Backend
cd vija-be
npm run setup
npm run dev

# Frontend (terminal mới)
cd Vija-fe
npm run dev
```

## Bước 7: Thử đăng nhập

1. Vào http://localhost:5173/signin
2. Username: admin
3. Password: admin123
4. Xem Console có lỗi gì

## Nếu vẫn reload liên tục

### Kiểm tra router guard

File: `Vija-fe/src/router/index.ts`

Có thể bị loop ở đây:
```typescript
router.beforeEach((to, from, next) => {
  // Check logic ở đây
})
```

### Tạm tắt router guard

Thêm vào đầu `router.beforeEach`:
```typescript
router.beforeEach((to, from, next) => {
  console.log('Router:', to.path, from.path)
  // ... rest of code
})
```

Xem console log để biết đang redirect đi đâu

## Checklist

- [ ] localStorage đã clear
- [ ] Backend đang chạy (port 3000)
- [ ] Frontend đang chạy (port 5173)
- [ ] Database có user admin
- [ ] API login trả về token
- [ ] Console không có lỗi màu đỏ
- [ ] Network tab không có request lỗi liên tục

## Lỗi thường gặp

### 1. CORS error
Backend đã có CORS, nhưng check lại port

### 2. 401 Unauthorized loop
API trả 401 → Frontend redirect → API lại 401 → Loop

**Fix:** Đã sửa trong api.ts interceptor

### 3. Router guard loop
to.path === from.path → Loop

**Fix:** Đã có check trong router

### 4. Token expired
Token cũ hết hạn → 401 → Loop

**Fix:** Clear localStorage

## Thông tin cần cung cấp

Nếu vẫn lỗi, cung cấp:

1. **Console log** (F12 → Console)
2. **Network tab** (F12 → Network) - Request nào bị lỗi?
3. **localStorage** (F12 → Application → Local Storage)
4. **Backend terminal** - Có lỗi gì?
5. **Frontend terminal** - Có lỗi gì?
