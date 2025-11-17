# Hướng dẫn Setup Full Stack - Vija Management System

## Tổng quan

Hệ thống gồm 2 phần:
- **Backend** (vija-be): Node.js + Express + TypeScript + MySQL
- **Frontend** (Vija-fe): Vue 3 + TypeScript + Tailwind CSS

---

## Bước 1: Setup Backend

### 1.1. Cài đặt dependencies
```bash
cd vija-be
npm install
```

### 1.2. Cấu hình database
File `.env` đã có sẵn với thông tin:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=vija
DB_PASSWORD=vija@2024
DB_NAME=vija
```

### 1.3. Thiết lập database (tự động)
```bash
npm run setup
```

Lệnh này sẽ:
- ✅ Tạo database `vija`
- ✅ Tạo tất cả các bảng
- ✅ Tạo user admin (username: `admin`, password: `admin123`)

### 1.4. Chạy backend
```bash
npm run dev
```

Backend chạy tại: `http://localhost:3000`

---

## Bước 2: Setup Frontend

### 2.1. Cài đặt dependencies
```bash
cd Vija-fe
npm install
npm install axios
```

### 2.2. Cấu hình API URL
File `.env` đã có sẵn:
```
VITE_API_URL=http://localhost:3000/api
```

### 2.3. Chạy frontend
```bash
npm run dev
```

Frontend chạy tại: `http://localhost:5173` (hoặc port khác)

---

## Bước 3: Test hệ thống

### 3.1. Đăng nhập
1. Mở trình duyệt: `http://localhost:5173`
2. Đăng nhập với:
   - Username: `admin`
   - Password: `admin123`

### 3.2. Test các chức năng
- ✅ QLKH - Đã kết nối API
- ⚠️ QLNB - Cần cập nhật (xem hướng dẫn bên dưới)
- ⚠️ QLDM - Cần cập nhật
- ⚠️ QLPO - Cần cập nhật
- ⚠️ QL User - Cần cập nhật
- ⚠️ Dashboard - Cần cập nhật

---

## Cập nhật các view còn lại

### Mẫu cập nhật cho QLNB.vue

```typescript
// 1. Import service
import { qlnbService, type QLNB } from '@/services/qlnbService'

// 2. Đổi interface
interface QLNBItem {
  id?: number
  po: string
  ma_bv: string  // Đổi từ maBV
  phoi_lieu: number  // Đổi từ phoiLieu
  gia_cong_ngoai: number  // Đổi từ giaCongNgoai
  // ... các field khác
}

// 3. Thêm loading state
const loading = ref(false)

// 4. Đổi loadData
const loadData = async () => {
  try {
    loading.value = true
    const result = await qlnbService.getAll()
    data.value = result
  } catch (error) {
    console.error('Lỗi:', error)
    alert('Không thể tải dữ liệu!')
  } finally {
    loading.value = false
  }
}

// 5. Đổi saveItem
const saveItem = async () => {
  try {
    loading.value = true
    if (editId.value !== null) {
      await qlnbService.update(editId.value, formData.value)
    } else {
      await qlnbService.create(formData.value)
    }
    await loadData()
    closeModal()
  } catch (error) {
    console.error('Lỗi:', error)
    alert('Không thể lưu!')
  } finally {
    loading.value = false
  }
}

// 6. Đổi deleteItem
const deleteItem = async (id: number) => {
  if (confirm('Bạn có chắc muốn xóa?')) {
    try {
      loading.value = true
      await qlnbService.delete(id)
      await loadData()
    } catch (error) {
      console.error('Lỗi:', error)
      alert('Không thể xóa!')
    } finally {
      loading.value = false
    }
  }
}

// 7. Trong template, đổi v-for
<tr v-for="item in data" :key="item.id">
  <td>{{ item.po }}</td>
  <td>{{ item.ma_bv }}</td>
  <!-- ... -->
  <button @click="editItem(item)">Sửa</button>
  <button @click="deleteItem(item.id!)">Xóa</button>
</tr>
```

---

## API Endpoints

### Authentication
- POST `/api/auth/login` - Đăng nhập
- POST `/api/auth/register` - Đăng ký

### QLKH
- GET `/api/qlkh` - Lấy danh sách
- POST `/api/qlkh` - Tạo mới
- PUT `/api/qlkh/:id` - Cập nhật
- DELETE `/api/qlkh/:id` - Xóa

### QLNB, QLDM, QLPO, Users
Tương tự QLKH

### Dashboard
- GET `/api/dashboard` - Lấy dữ liệu tổng hợp

---

## Troubleshooting

### Backend không kết nối được MySQL
```bash
# Kiểm tra MySQL đang chạy
mysql -u vija -p

# Nếu lỗi, tạo user:
CREATE USER 'vija'@'localhost' IDENTIFIED BY 'vija@2024';
GRANT ALL PRIVILEGES ON vija.* TO 'vija'@'localhost';
FLUSH PRIVILEGES;
```

### Frontend không gọi được API
1. Kiểm tra backend đang chạy: `http://localhost:3000`
2. Kiểm tra CORS đã enable trong backend
3. Kiểm tra token trong localStorage
4. Xem Console log trong browser

### Lỗi 401 Unauthorized
- Token hết hạn hoặc không hợp lệ
- Đăng nhập lại

---

## Checklist

### Backend
- [x] Cài đặt dependencies
- [x] Cấu hình .env
- [x] Chạy setup database
- [x] Start server
- [x] Test API với curl/Postman

### Frontend
- [x] Cài đặt dependencies
- [x] Cài axios
- [x] Cấu hình .env
- [x] Tạo services
- [x] Cập nhật SignIn.vue
- [x] Cập nhật QLKH.vue
- [ ] Cập nhật QLNB.vue
- [ ] Cập nhật QLDM.vue
- [ ] Cập nhật QLPO.vue
- [ ] Cập nhật QLUser.vue
- [ ] Cập nhật Dashboard.vue

---

## Tài khoản mặc định

- **Username:** admin
- **Password:** admin123

**Lưu ý:** Đổi password sau khi đăng nhập lần đầu!
