# Hệ thống phân quyền

## Các vai trò (Roles)

### 1. Admin (Quản trị viên)
- **Quyền:** Toàn quyền
- **Truy cập:**
  - ✅ Dashboard
  - ✅ QLKH (Quản lý Khách hàng)
  - ✅ QLNB (Quản lý Nội bộ)
  - ✅ QLDM (Quản lý Định mức)
  - ✅ QLPO (Quản lý PO)
  - ✅ QL User (Quản lý User)

### 2. Sales (Kinh doanh)
- **Quyền:** Quản lý khách hàng và định mức
- **Truy cập:**
  - ✅ Dashboard (chỉ xem)
  - ✅ QLKH (Quản lý Khách hàng)
  - ✅ QLDM (Quản lý Định mức)
  - ❌ QLNB
  - ❌ QLPO
  - ❌ QL User

### 3. Kỹ thuật (kythuat)
- **Quyền:** Quản lý nội bộ và PO
- **Truy cập:**
  - ✅ Dashboard (chỉ xem)
  - ✅ QLNB (Quản lý Nội bộ)
  - ✅ QLPO (Quản lý PO)
  - ❌ QLKH
  - ❌ QLDM
  - ❌ QL User

## Bảng phân quyền

| Module | Admin | Sales | Kỹ thuật |
|--------|-------|-------|----------|
| Dashboard | ✅ | ✅ | ✅ |
| QLKH | ✅ | ✅ | ❌ |
| QLNB | ✅ | ❌ | ✅ |
| QLDM | ✅ | ✅ | ❌ |
| QLPO | ✅ | ❌ | ✅ |
| QL User | ✅ | ❌ | ❌ |

## API Endpoints và Middleware

### Admin only
```typescript
router.use(requireAdmin);
```
- `/api/users/*` - Quản lý user

### Sales (Admin + Sales)
```typescript
router.use(requireSales);
```
- `/api/qlkh/*` - Quản lý Khách hàng
- `/api/qldm/*` - Quản lý Định mức

### Kỹ thuật (Admin + Kỹ thuật)
```typescript
router.use(requireKyThuat);
```
- `/api/qlnb/*` - Quản lý Nội bộ
- `/api/qlpo/*` - Quản lý PO

### Tất cả (Authenticated)
```typescript
router.use(authMiddleware);
```
- `/api/dashboard` - Dashboard

## Tạo user mới

### Qua API:
```bash
POST /api/users
{
  "username": "sales01",
  "password": "password123",
  "role": "sales"
}
```

### Qua giao diện:
1. Đăng nhập với tài khoản admin
2. Vào "QL User"
3. Click "Thêm mới"
4. Chọn vai trò phù hợp

## Lưu ý

- User admin mặc định không thể xóa
- Chỉ admin mới có quyền quản lý user
- Token JWT chứa thông tin role
- Frontend tự động ẩn/hiện menu theo quyền
- Backend kiểm tra quyền ở mỗi API endpoint

## Ví dụ sử dụng

### Tạo user Sales:
```
Username: sales01
Password: sales123
Role: Sales
→ Có quyền: QLKH, QLDM
```

### Tạo user Kỹ thuật:
```
Username: kythuat01
Password: kt123
Role: Kỹ thuật
→ Có quyền: QLNB, QLPO
```

## Cập nhật database

Nếu database cũ chưa có cột `role`, chạy:

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
