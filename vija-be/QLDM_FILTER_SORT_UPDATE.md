# QLDM Filter & Sort Update - 2024-12-12

## Yêu cầu
Trong QLDM, đang lọc theo Mã BV và sắp xếp theo Mã BV. Cần sửa lại:
- Thêm lọc theo Mã KH
- Sắp xếp theo Mã KH (thay vì Mã BV)

## Thay đổi đã thực hiện

### 1. Cải thiện UI Filter
**Trước:**
```vue
<!-- Filter đơn giản chỉ có Mã BV -->
<div class="mb-4 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
  <label class="block text-sm font-medium mb-2">Lọc theo Mã BV:</label>
  <div class="flex gap-2">
    <input v-model="searchMaBV" placeholder="Tìm kiếm Mã BV..." />
    <select v-model="filterMaBV">
      <option value="">Tất cả</option>
      <option v-for="item in filteredMaBVList" :value="item.ma_bv">
        {{ item.ma_bv }}
      </option>
    </select>
  </div>
</div>
```

**Sau:**
```vue
<!-- Filter grid 2 cột với cả Mã KH và Mã BV -->
<div class="mb-4 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
  <div class="grid grid-cols-2 gap-4">
    <!-- Lọc theo Mã KH -->
    <div>
      <label class="block text-sm font-medium mb-2">Lọc theo Mã KH:</label>
      <div class="flex gap-2">
        <input v-model="searchMaKH" placeholder="Tìm kiếm Mã KH..." />
        <select v-model="filterMaKH">
          <option value="">Tất cả</option>
          <option v-for="item in filteredMaKHList" :value="item">
            {{ item }}
          </option>
        </select>
      </div>
    </div>
    
    <!-- Lọc theo Mã BV -->
    <div>
      <label class="block text-sm font-medium mb-2">Lọc theo Mã BV:</label>
      <div class="flex gap-2">
        <input v-model="searchMaBV" placeholder="Tìm kiếm Mã BV..." />
        <select v-model="filterMaBV">
          <option value="">Tất cả</option>
          <option v-for="item in filteredMaBVList" :value="item.ma_bv">
            {{ item.ma_bv }}
          </option>
        </select>
      </div>
    </div>
  </div>
  
  <!-- Nút xóa filter và thông báo -->
  <div class="flex gap-2 mt-2">
    <button v-if="filterMaKH || filterMaBV" @click="clearFilter">
      Xóa tất cả lọc
    </button>
    <p v-if="filterMaKH || filterMaBV" class="text-xs text-green-600">
      Đang hiển thị: {{ filteredData.length }} kết quả
      <span v-if="filterMaKH"> cho KH: {{ filterMaKH }}</span>
      <span v-if="filterMaBV"> cho BV: {{ filterMaBV }}</span>
    </p>
  </div>
</div>
```

### 2. Thêm Variables cho Mã KH
```typescript
const searchMaKH = ref('')
const filterMaKH = ref('')
```

### 3. Tạo danh sách Mã KH
```typescript
// Tạo danh sách unique Mã KH từ dữ liệu
const maKHList = computed(() => {
  const uniqueKH = [...new Set(data.value.map(item => item.ma_kh).filter(kh => kh))]
  return uniqueKH.sort()
})

// Filter danh sách Mã KH theo search
const filteredMaKHList = computed(() => {
  if (!searchMaKH.value) return maKHList.value
  return maKHList.value.filter(item => 
    item.toLowerCase().includes(searchMaKH.value.toLowerCase())
  )
})
```

### 4. Cập nhật logic Filter & Sort
**Trước:**
```typescript
const filteredData = computed(() => {
  if (!filterMaBV.value) return data.value
  return data.value.filter(item => item.ma_bv === filterMaBV.value)
})
```

**Sau:**
```typescript
const filteredData = computed(() => {
  let result = data.value
  
  // Lọc theo Mã KH
  if (filterMaKH.value) {
    result = result.filter(item => item.ma_kh === filterMaKH.value)
  }
  
  // Lọc theo Mã BV
  if (filterMaBV.value) {
    result = result.filter(item => item.ma_bv === filterMaBV.value)
  }
  
  // Sắp xếp theo Mã KH, sau đó theo Mã BV
  return result.sort((a, b) => {
    const khA = a.ma_kh || ''
    const khB = b.ma_kh || ''
    
    if (khA !== khB) {
      return khA.localeCompare(khB)
    }
    
    // Nếu Mã KH giống nhau, sắp xếp theo Mã BV
    return a.ma_bv.localeCompare(b.ma_bv)
  })
})
```

### 5. Cập nhật các hàm helper
```typescript
// Thêm hàm select cho Mã KH
const selectFirstMatchKH = () => {
  if (filteredMaKHList.value.length > 0) {
    filterMaKH.value = filteredMaKHList.value[0]
  }
}

// Cập nhật hàm clear filter
const clearFilter = () => {
  filterMaKH.value = ''
  searchMaKH.value = ''
  filterMaBV.value = ''
  searchMaBV.value = ''
}
```

## Kết quả

### Trước khi sửa:
- ❌ Chỉ lọc được theo Mã BV
- ❌ Sắp xếp theo Mã BV
- ❌ UI đơn giản, ít tùy chọn

### Sau khi sửa:
- ✅ Lọc được theo cả Mã KH và Mã BV
- ✅ Sắp xếp theo Mã KH (ưu tiên), sau đó theo Mã BV
- ✅ UI grid 2 cột, dễ sử dụng
- ✅ Có thể lọc kết hợp (vừa KH vừa BV)
- ✅ Hiển thị thông tin filter rõ ràng
- ✅ Nút "Xóa tất cả lọc" tiện lợi

## Tính năng mới

### 1. Lọc kết hợp
- Có thể lọc chỉ theo Mã KH
- Có thể lọc chỉ theo Mã BV  
- Có thể lọc theo cả Mã KH và Mã BV cùng lúc

### 2. Sắp xếp thông minh
- Ưu tiên sắp xếp theo Mã KH
- Nếu Mã KH giống nhau, sắp xếp theo Mã BV
- Xử lý trường hợp Mã KH null/empty

### 3. Search thông minh
- Search Mã KH: gõ một phần → hiển thị danh sách phù hợp
- Search Mã BV: gõ một phần → hiển thị danh sách phù hợp
- Enter để chọn kết quả đầu tiên

### 4. UI cải thiện
- Layout grid 2 cột gọn gàng
- Thông báo kết quả chi tiết
- Nút xóa filter dễ thấy

## Ví dụ sử dụng

### Trước:
```
Dữ liệu hiển thị theo thứ tự Mã BV:
BV001 (KH002)
BV002 (KH001) 
BV003 (KH002)
```

### Sau:
```
Dữ liệu hiển thị theo thứ tự Mã KH:
BV002 (KH001)
BV001 (KH002)
BV003 (KH002)

Có thể lọc:
- Chỉ KH001 → hiển thị BV002
- Chỉ KH002 → hiển thị BV001, BV003
- KH002 + BV001 → hiển thị BV001
```

## Files đã thay đổi
- `Vija-fe/src/views/QLDM.vue` - Thêm filter Mã KH và sắp xếp theo Mã KH