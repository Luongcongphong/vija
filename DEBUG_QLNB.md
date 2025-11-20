# Debug QLNB - Lỗi không thể lưu

## Bước 1: Restart Backend với log
```bash
cd vija-be
# Ctrl+C
npm run dev
```

## Bước 2: Mở Console
F12 → Console tab

## Bước 3: Thử sửa QLNB
1. Vào trang QLNB
2. Click "Sửa" một dòng
3. Thay đổi giá trị
4. Click "Lưu"

## Bước 4: Xem log

### Frontend Console sẽ hiển thị:
```
Saving QLNB: {
  editId: 1,
  formData: {
    po: "PO001",
    ma_bv: "BV001",
    phoi_lieu: 1000000,
    ...
  }
}
Updating QLNB ID: 1
```

### Backend Terminal sẽ hiển thị:
```
=== UPDATE QLNB ===
ID: 1
Body: { po: 'PO001', ma_bv: 'BV001', ... }
User: 1 Role: admin
Tổng phí: 3000000
Query result: ...
Affected rows: 1
✅ Update successful
```

## Nếu thấy lỗi

### Lỗi: "PO và Mã BV là bắt buộc"
```
❌ Validation failed: Missing PO or ma_bv
```
→ Kiểm tra formData có đầy đủ không

### Lỗi: "Không tìm thấy bản ghi"
```
❌ No rows affected
```
→ ID không tồn tại trong database

### Lỗi SQL
```
❌ Error updating QLNB: ...
Error stack: ...
```
→ Lỗi database, kiểm tra:
- Database có chạy không
- Bảng qlnb có tồn tại không
- Các cột có đúng không

## Test thủ công

### 1. Kiểm tra database
```sql
-- Xem tất cả QLNB
SELECT * FROM qlnb;

-- Xem bản ghi cụ thể
SELECT * FROM qlnb WHERE id = 1;

-- Kiểm tra cấu trúc bảng
DESCRIBE qlnb;
```

### 2. Test API trực tiếp
```javascript
// Mở Console (F12)
const token = localStorage.getItem('token')

// Test update
fetch('http://localhost:3000/api/qlnb/1', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    po: 'PO001',
    ma_bv: 'BV001',
    phoi_lieu: 1000000,
    gia_cong_ngoai: 500000,
    gia_cong_noi_bo: 800000,
    xu_ly_be_mat: 300000,
    van_chuyen: 200000,
    phi_qldn: 200000
  })
})
.then(r => r.json())
.then(d => console.log('Result:', d))
.catch(e => console.error('Error:', e))
```

## Kiểm tra quyền

```javascript
// Xem user hiện tại
const user = JSON.parse(localStorage.getItem('user'))
console.log('User:', user)
console.log('Role:', user.role)

// QLNB cần quyền: admin hoặc kythuat
// Nếu role là 'sales' → Không có quyền
```

## Các trường hợp lỗi

### 1. Token hết hạn
**Triệu chứng:** Lỗi 401
**Giải pháp:** Đăng nhập lại

### 2. Không có quyền
**Triệu chứng:** Lỗi 403
**Giải pháp:** Đăng nhập với user admin hoặc kythuat

### 3. Database không chạy
**Triệu chứng:** Backend log "Error: connect ECONNREFUSED"
**Giải pháp:** Start MySQL

### 4. Bảng không tồn tại
**Triệu chứng:** Backend log "Table 'vija.qlnb' doesn't exist"
**Giải pháp:** 
```bash
cd vija-be
npm run setup
```

### 5. Cột không đúng
**Triệu chứng:** Backend log "Unknown column"
**Giải pháp:** 
```bash
cd vija-be
npm run setup
```

## Quick Fix

```bash
# 1. Restart Backend
cd vija-be
npm run setup
npm run dev

# 2. Clear localStorage
# F12 → Console
localStorage.clear()

# 3. Đăng nhập lại
# Username: admin
# Password: admin123

# 4. Thử lại
```

## Thông tin cần cung cấp

Nếu vẫn lỗi, cung cấp:

1. **Frontend Console log** (toàn bộ)
2. **Backend Terminal log** (toàn bộ)
3. **Network tab** (F12 → Network → Request/Response)
4. **User role** hiện tại
5. **ID** của bản ghi đang sửa
6. **Database** có chạy không
