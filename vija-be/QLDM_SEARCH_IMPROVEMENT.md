# QLDM Search Improvement - 2024-12-12

## Vấn đề
Trong QLDM, kết quả lọc chỉ ưu tiên lấy kết quả đầu tiên thay vì hiển thị tất cả kết quả phù hợp.

**Ví dụ:**
- Mã BV có: `aaadf`, `aaak`, `aad`
- Khi gõ "aa" → chỉ hiển thị 1 kết quả đầu tiên
- **Mong muốn:** hiển thị tất cả 3 kết quả chứa "aa"

## Nguyên nhân
Logic `filteredData` chỉ filter theo giá trị được chọn từ dropdown (`filterMaKH`, `filterMaBV`) mà không filter theo text được gõ vào input search (`searchMaKH`, `searchMaBV`).

## Giải pháp đã thực hiện

### 1. Cải thiện logic filteredData
**Trước:**
```typescript
const filteredData = computed(() => {
  let result = data.value
  
  // Chỉ filter theo dropdown selection
  if (filterMaKH.value) {
    result = result.filter(item => item.ma_kh === filterMaKH.value)
  }
  
  if (filterMaBV.value) {
    result = result.filter(item => item.ma_bv === filterMaBV.value)
  }
  
  return result.sort(...)
})
```

**Sau:**
```typescript
const filteredData = computed(() => {
  let result = data.value
  
  // Filter theo search text Mã KH (khi user gõ vào input)
  if (searchMaKH.value) {
    result = result.filter(item => 
      item.ma_kh && item.ma_kh.toLowerCase().includes(searchMaKH.value.toLowerCase())
    )
  }
  
  // Filter theo search text Mã BV (khi user gõ vào input)
  if (searchMaBV.value) {
    result = result.filter(item => 
      item.ma_bv.toLowerCase().includes(searchMaBV.value.toLowerCase())
    )
  }
  
  // Filter theo selected value Mã KH (khi user chọn từ dropdown)
  if (filterMaKH.value) {
    result = result.filter(item => item.ma_kh === filterMaKH.value)
  }
  
  // Filter theo selected value Mã BV (khi user chọn từ dropdown)
  if (filterMaBV.value) {
    result = result.filter(item => item.ma_bv === filterMaBV.value)
  }
  
  return result.sort(...)
})
```

### 2. Cải thiện thông báo kết quả
**Trước:**
```vue
<p v-if="filterMaKH || filterMaBV" class="text-xs text-green-600">
  Đang hiển thị: {{ filteredData.length }} kết quả
  <span v-if="filterMaKH"> cho KH: {{ filterMaKH }}</span>
  <span v-if="filterMaBV"> cho BV: {{ filterMaBV }}</span>
</p>
```

**Sau:**
```vue
<p v-if="filterMaKH || filterMaBV || searchMaKH || searchMaBV" class="text-xs text-green-600">
  Đang hiển thị: {{ filteredData.length }} kết quả
  <span v-if="searchMaKH"> tìm KH: "{{ searchMaKH }}"</span>
  <span v-if="filterMaKH"> cho KH: {{ filterMaKH }}</span>
  <span v-if="searchMaBV"> tìm BV: "{{ searchMaBV }}"</span>
  <span v-if="filterMaBV"> cho BV: {{ filterMaBV }}</span>
</p>
```

### 3. Cải thiện placeholder text
**Trước:**
```vue
<input placeholder="Tìm kiếm Mã KH..." />
<input placeholder="Tìm kiếm Mã BV..." />
```

**Sau:**
```vue
<input placeholder="Gõ để tìm tất cả KH chứa từ khóa..." />
<input placeholder="Gõ để tìm tất cả BV chứa từ khóa..." />
```

### 4. Cập nhật điều kiện hiển thị nút "Xóa tất cả lọc"
```vue
<!-- Trước -->
<button v-if="filterMaKH || filterMaBV" @click="clearFilter">
  Xóa tất cả lọc
</button>

<!-- Sau -->
<button v-if="filterMaKH || filterMaBV || searchMaKH || searchMaBV" @click="clearFilter">
  Xóa tất cả lọc
</button>
```

## Kết quả

### Trước khi sửa:
- ❌ Gõ "aa" → chỉ hiển thị 1 kết quả đầu tiên
- ❌ Phải chọn từ dropdown để filter
- ❌ Không thể tìm kiếm linh hoạt

### Sau khi sửa:
- ✅ Gõ "aa" → hiển thị TẤT CẢ kết quả chứa "aa"
- ✅ Search real-time khi gõ
- ✅ Có thể kết hợp search text + dropdown selection
- ✅ Thông báo rõ ràng về filter đang áp dụng
- ✅ Placeholder text hướng dẫn rõ ràng

## Ví dụ cụ thể

### Dữ liệu mẫu:
```
KH001 - aaadf
KH001 - aaak  
KH002 - aad
KH002 - bbbb
```

### Trước khi sửa:
- Gõ "aa" → chỉ hiển thị `aaadf`
- Phải chọn từ dropdown để thấy thêm

### Sau khi sửa:
- Gõ "aa" → hiển thị `aaadf`, `aaak`, `aad` (3 kết quả)
- Thông báo: "Đang hiển thị: 3 kết quả tìm BV: 'aa'"
- Có thể tiếp tục gõ "aaa" → chỉ hiển thị `aaadf`, `aaak` (2 kết quả)

## Tính năng mới

### 1. Search real-time
- Gõ vào input → tự động filter dữ liệu trong bảng
- Không cần nhấn Enter hay chọn dropdown

### 2. Filter kết hợp
- Có thể search text + chọn dropdown cùng lúc
- Ví dụ: search "aa" + chọn KH001 → chỉ hiển thị BV chứa "aa" của KH001

### 3. Thông báo chi tiết
- Phân biệt rõ search text vs dropdown selection
- Hiển thị từ khóa search trong dấu ngoặc kép

### 4. UX cải thiện
- Placeholder text hướng dẫn rõ ràng
- Nút "Xóa tất cả lọc" xuất hiện khi có bất kỳ filter nào

## Workflow mới

1. **User gõ "aa" vào ô search Mã BV**
   - → Tự động hiển thị TẤT CẢ BV chứa "aa"
   - → Thông báo: "Đang hiển thị: X kết quả tìm BV: 'aa'"

2. **User tiếp tục gõ "aaa"**
   - → Tự động thu hẹp kết quả chỉ BV chứa "aaa"
   - → Thông báo cập nhật real-time

3. **User có thể kết hợp với dropdown**
   - → Chọn KH001 từ dropdown
   - → Chỉ hiển thị BV chứa "aaa" của KH001
   - → Thông báo: "tìm BV: 'aaa' cho KH: KH001"

## Files đã thay đổi
- `Vija-fe/src/views/QLDM.vue` - Cải thiện logic search và filter