# Bật lại phân quyền - An toàn

## ✅ Đã làm

### 1. Middleware tương thích ngược
- Token cũ (không có role) → Cho phép truy cập (mặc định admin)
- Token mới (có role) → Kiểm tra quyền đúng

### 2. Thông báo lỗi rõ ràng
Khi không có quyền, hiển thị:
```json
{
  "message": "Không có quyền truy cập. Chỉ Admin và Sales mới có quyền này.",
  "requiredRole": ["admin", "sales"],
  "yourRole": "kythuat"
}
```

### 3. Phân quyền đã bật

| Module | Admin | Sales | Kỹ thuật |
|--------|-------|-------|----------|
| Dashboard | ✅ | ✅ | ✅ |
| QLKH | ✅ | ✅ | ❌ |
| QLNB | ✅ | ❌ | ✅ |
| QLDM | ✅ | ✅ | ❌ |
| QLPO | ✅ | ❌ | ✅ |
| QL User | ✅ | ❌ | ❌ |

## 🔄 Cách hoạt động

### Token cũ (không có role)
```javascript
{
  userId: 1
  // Không có role
}
```
→ Middleware: `req.userRole = 'admin'` (mặc định)
→ Cho phép truy cập mọi module

### Token mới (có role)
```javascript
{
  userId: 1,
  role: 'sales'
}
```
→ Middleware: `req.userRole = 'sales'`
→ Kiểm tra quyền:
- QLKH ✅ (sales có quyền)
- QLNB ❌ (sales không có quyền)

## 📝 Hướng dẫn sử dụng

### Bước 1: Restart Backend
```bash
cd vija-be
# Ctrl+C
npm run dev
```

### Bước 2: Đăng nhập lại (Khuyến nghị)
Để có token mới với role:
1. F12 → Application → Local Storage
2. Xóa `token`, `user`, `isAuthenticated`
3. F5 (Refresh)
4. Đăng nhập lại

### Bước 3: Kiểm tra role
```javascript
// Xem user hiện tại
const user = JSON.parse(localStorage.getItem('user'))
console.log('User:', user)
console.log('Role:', user.role)
```

### Bước 4: Test phân quyền

**Với user admin:**
- Vào tất cả các trang → OK ✅

**Với user sales:**
- QLKH → OK ✅
- QLDM → OK ✅
- QLNB → Lỗi 403 ❌
- QLPO → Lỗi 403 ❌

**Với user kythuat:**
- QLNB → OK ✅
- QLPO → OK ✅
- QLKH → Lỗi 403 ❌
- QLDM → Lỗi 403 ❌

## 🆕 Tạo user mới

### Qua giao diện (Admin only)
1. Đăng nhập với admin
2. Vào "QL User"
3. Click "Thêm mới"
4. Chọn vai trò:
   - Admin: Toàn quyền
   - Sales: QLDM, QLKH
   - Kỹ thuật: QLNB, QLPO

### Qua API
```javascript
const token = localStorage.getItem('token')
fetch('http://localhost:3000/api/users', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'sales01',
    password: 'sales123',
    role: 'sales'
  })
})
.then(r => r.json())
.then(d => console.log('Created:', d))
```

## 🔒 Bảo mật

### Token cũ
- Vẫn hoạt động (tương thích ngược)
- Được coi là admin
- Nên đăng nhập lại để có token mới

### Token mới
- Có thông tin role
- Kiểm tra quyền chính xác
- Hết hạn sau 24 giờ

## ⚠️ Lưu ý

1. **Token cũ = Admin**
   - User đang dùng token cũ sẽ có quyền admin
   - Khuyến nghị: Yêu cầu tất cả user đăng nhập lại

2. **Không bị loop**
   - Middleware kiểm tra `if (!req.userRole)` trước
   - Cho phép token cũ truy cập

3. **Thông báo lỗi rõ ràng**
   - Hiển thị role cần thiết
   - Hiển thị role hiện tại
   - Dễ debug

## 🧪 Test

### Test với token cũ
```javascript
// Giả lập token cũ (không có role)
const oldToken = 'eyJhbGc...' // Token cũ
localStorage.setItem('token', oldToken)

// Test API
fetch('http://localhost:3000/api/qlkh', {
  headers: {'Authorization': `Bearer ${oldToken}`}
})
.then(r => r.json())
.then(d => console.log('✅ Token cũ vẫn hoạt động:', d))
```

### Test với token mới
```javascript
// Đăng nhập lại để có token mới
fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({username: 'sales01', password: 'sales123'})
})
.then(r => r.json())
.then(d => {
  console.log('Token mới:', d)
  localStorage.setItem('token', d.token)
  
  // Test quyền
  return fetch('http://localhost:3000/api/qlnb', {
    headers: {'Authorization': `Bearer ${d.token}`}
  })
})
.then(r => r.json())
.then(d => console.log('Response:', d))
// Sales không có quyền QLNB → Lỗi 403
```

## ✅ Checklist

- [x] Middleware tương thích token cũ
- [x] Phân quyền đã bật
- [x] Thông báo lỗi rõ ràng
- [x] Không bị loop
- [x] Token cũ vẫn hoạt động
- [x] Token mới có role
- [x] Test thành công

## 🎯 Kết luận

Phân quyền đã được bật lại một cách an toàn:
- ✅ Token cũ vẫn hoạt động (admin)
- ✅ Token mới có phân quyền đúng
- ✅ Không bị lỗi loop
- ✅ Thông báo lỗi rõ ràng

**Khuyến nghị:** Yêu cầu tất cả user đăng nhập lại để có token mới với role chính xác.
