# Fix lỗi không thể sửa QLNB

## Đã sửa

### 1. Frontend (Vija-fe/src/views/QLNB.vue)
- ✅ Sửa modal title: `editIndex` → `editId`
- ✅ Thêm console.log để debug
- ✅ Hiển thị lỗi chi tiết hơn

### 2. Backend (vija-be/src/controllers/qlnbController.ts)
- ✅ Thêm validation PO và Mã BV
- ✅ Xử lý giá trị null/undefined (default 0)
- ✅ Kiểm tra affectedRows
- ✅ Log lỗi chi tiết

## Cách test

### Bước 1: Restart Backend
```bash
cd vija-be
# Ctrl+C
npm run dev
```

### Bước 2: Mở Console
F12 → Console tab

### Bước 3: Thử sửa QLNB
1. Vào trang QLNB
2. Click "Sửa" một dòng
3. Thay đổi giá trị
4. Click "Lưu"
5. Xem Console log

## Console log sẽ hiển thị

### Khi bắt đầu lưu:
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

### Nếu thành công:
```
✅ Saved successfully
```

### Nếu lỗi:
```
❌ Lỗi khi lưu: Error: ...
Error response: { message: "..." }
```

## Lỗi thường gặp

### 1. "PO và Mã BV là bắt buộc"
**Nguyên nhân:** Chưa chọn PO hoặc Mã BV
**Giải pháp:** Chọn đầy đủ PO và Mã BV

### 2. "Không tìm thấy bản ghi để cập nhật"
**Nguyên nhân:** ID không tồn tại trong database
**Giải pháp:** 
- Refresh trang
- Kiểm tra database có bản ghi đó không

### 3. "Token không hợp lệ"
**Nguyên nhân:** Token hết hạn
**Giải pháp:** Đăng nhập lại

### 4. "Không có quyền truy cập"
**Nguyên nhân:** User không có quyền QLNB
**Giải pháp:** 
- Đăng nhập với user admin hoặc kythuat
- Hoặc đăng nhập lại để có token mới

## Kiểm tra database

```sql
-- Xem dữ liệu QLNB
SELECT * FROM qlnb;

-- Xem bản ghi cụ thể
SELECT * FROM qlnb WHERE id = 1;

-- Kiểm tra có bản ghi nào không
SELECT COUNT(*) FROM qlnb;
```

## Test thủ công với API

```javascript
// Lấy token
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
.then(d => console.log('Update result:', d))
.catch(e => console.error('Error:', e))
```

## Nếu vẫn lỗi

### 1. Clear localStorage và đăng nhập lại
```javascript
localStorage.clear()
// F5 và đăng nhập lại
```

### 2. Kiểm tra Network tab
F12 → Network → Xem request/response

### 3. Kiểm tra Backend log
Xem terminal backend có lỗi gì

### 4. Thử tạo mới thay vì sửa
Nếu tạo mới OK → Vấn đề ở update
Nếu tạo mới cũng lỗi → Vấn đề ở validation hoặc quyền

## Checklist

- [ ] Backend đang chạy
- [ ] Đã đăng nhập
- [ ] Token còn hạn
- [ ] User có quyền QLNB (admin hoặc kythuat)
- [ ] Database có dữ liệu
- [ ] Console không có lỗi màu đỏ
- [ ] Network tab không có request lỗi

## Thông tin cần cung cấp nếu vẫn lỗi

1. Console log (toàn bộ)
2. Network tab → Request/Response
3. Backend terminal log
4. User role hiện tại
5. ID của bản ghi đang sửa
