# Test Dashboard

## Bước 1: Kiểm tra Backend đang chạy

Mở browser và vào: http://localhost:3000

Phải thấy:
```json
{"message":"Vija Backend API"}
```

Nếu không thấy → Backend không chạy → Chạy:
```bash
cd vija-be
npm run dev
```

## Bước 2: Test Login và lấy token

Mở Console (F12) và chạy:

```javascript
// Test login
fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({username: 'admin', password: 'admin123'})
})
.then(r => r.json())
.then(d => {
  console.log('Login response:', d)
  if (d.token) {
    console.log('✅ Token:', d.token)
    localStorage.setItem('token', d.token)
    localStorage.setItem('user', JSON.stringify(d.user))
    localStorage.setItem('isAuthenticated', 'true')
  }
})
.catch(e => console.error('❌ Login error:', e))
```

## Bước 3: Test Dashboard API

Sau khi có token, chạy:

```javascript
// Test dashboard
const token = localStorage.getItem('token')
fetch('http://localhost:3000/api/dashboard', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(r => r.json())
.then(d => {
  console.log('✅ Dashboard data:', d)
  console.log('Số dòng:', d.length)
})
.catch(e => console.error('❌ Dashboard error:', e))
```

## Bước 4: Kiểm tra dữ liệu trong database

```bash
cd vija-be
npm run setup
```

Hoặc thêm dữ liệu test:

```javascript
// Thêm QLKH test
const token = localStorage.getItem('token')
fetch('http://localhost:3000/api/qlkh', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    po: 'PO001',
    ma_bv: 'BV001',
    so_luong: 100,
    don_gia: 50000
  })
})
.then(r => r.json())
.then(d => console.log('✅ Created QLKH:', d))
.catch(e => console.error('❌ Error:', e))
```

## Bước 5: Refresh Dashboard

Sau khi có dữ liệu, refresh trang Dashboard.

## Kết quả mong đợi

### Login thành công:
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

### Dashboard có dữ liệu:
```json
[
  {
    "id": 1,
    "po": "PO001",
    "ma_bv": "BV001",
    "so_luong": 100,
    "don_gia": 50000,
    "thanh_tien": 5000000,
    ...
  }
]
```

### Dashboard không có dữ liệu:
```json
[]
```
→ Bình thường nếu database trống

## Lỗi thường gặp

### 1. Backend không chạy
```
Failed to fetch
```
→ Chạy: `cd vija-be && npm run dev`

### 2. Token không hợp lệ
```json
{"message": "Token không hợp lệ"}
```
→ Đăng nhập lại

### 3. Database trống
```json
[]
```
→ Thêm dữ liệu vào QLKH

### 4. CORS error
```
Access-Control-Allow-Origin
```
→ Backend đã có CORS, restart backend

## Quick Fix

Chạy tất cả trong Console (F12):

```javascript
// 1. Login
fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({username: 'admin', password: 'admin123'})
})
.then(r => r.json())
.then(d => {
  localStorage.setItem('token', d.token)
  localStorage.setItem('user', JSON.stringify(d.user))
  localStorage.setItem('isAuthenticated', 'true')
  console.log('✅ Logged in')
  
  // 2. Test Dashboard
  return fetch('http://localhost:3000/api/dashboard', {
    headers: {'Authorization': `Bearer ${d.token}`}
  })
})
.then(r => r.json())
.then(d => {
  console.log('✅ Dashboard:', d)
  if (d.length === 0) {
    console.log('⚠️ Database trống, cần thêm dữ liệu')
  }
})
.catch(e => console.error('❌ Error:', e))
```

Sau đó F5 (Refresh)
