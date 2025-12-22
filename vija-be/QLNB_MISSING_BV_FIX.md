# QLNB Missing BV Detection & Auto-Add Fix - 2024-12-12

## Vấn đề
Khi QLPO thêm Mã BV mới vào PO12 (hoặc bất kỳ PO nào), QLNB không hiển thị Mã BV mới đó và không cho phép thêm chi phí cho Mã BV mới.

**Ví dụ:**
- PO12 ban đầu có 1 Mã BV → QLNB hiển thị 1 Mã BV
- Sau đó ở QLPO thêm PO12 thêm 1 Mã BV mới → QLNB vẫn chỉ hiển thị 1 Mã BV cũ
- User không thể thêm chi phí cho Mã BV mới

## Nguyên nhân
QLNB chỉ hiển thị các Mã BV đã có dữ liệu trong bảng `qlnb`. Nó không so sánh với dữ liệu từ QLPO để phát hiện Mã BV còn thiếu.

## Giải pháp đã thực hiện

### 1. Cải thiện logic groupedData
**Trước:**
```typescript
const groupedData = computed(() => {
  const groups: { [key: string]: QLNB[] } = {}
  
  filteredData.value.forEach(item => {
    if (!groups[item.ma_po]) {
      groups[item.ma_po] = []
    }
    groups[item.ma_po].push(item)
  })
  
  return Object.keys(groups).map(ma_po => ({
    ma_po,
    items: groups[ma_po]
  })).sort((a, b) => b.ma_po.localeCompare(a.ma_po))
})
```

**Sau:**
```typescript
const groupedData = computed(() => {
  // Nhóm dữ liệu QLNB theo Mã PO
  const groups: { [key: string]: QLNB[] } = {}
  filteredData.value.forEach(item => {
    if (!groups[item.ma_po]) {
      groups[item.ma_po] = []
    }
    groups[item.ma_po].push(item)
  })
  
  // Lấy tất cả Mã PO từ QLPO (bao gồm cả PO không có trong QLNB)
  const allPOs = [...new Set([
    ...Object.keys(groups),
    ...qlpoData.value.map(item => item.ma_po)
  ])]
  
  return allPOs.map(ma_po => {
    const items = groups[ma_po] || []
    
    // Lấy tất cả Mã BV từ QLPO cho PO này
    const allBVsInPO = qlpoData.value.filter(item => item.ma_po === ma_po)
    
    // Tìm các Mã BV còn thiếu (có trong QLPO nhưng chưa có trong QLNB)
    const existingBVs = items.map(item => item.ma_bv)
    const missingBVs = allBVsInPO.filter(bv => !existingBVs.includes(bv.ma_bv))
    
    return {
      ma_po,
      items,
      missingBVs,
      totalBVCount: allBVsInPO.length,
      totalRows: items.length + missingBVs.length + 1 // +1 for header row
    }
  })
  .filter(group => group.items.length > 0 || group.missingBVs.length > 0)
  .sort((a, b) => b.ma_po.localeCompare(a.ma_po))
})
```

### 2. Cải thiện hiển thị header PO
**Trước:**
```vue
<td colspan="2">SLBV: {{ group.items.length }}</td>
```

**Sau:**
```vue
<td colspan="2">
  SLBV: {{ group.items.length }}/{{ group.totalBVCount }}
  <span v-if="group.missingBVs.length > 0" class="text-orange-600 font-medium">
    ({{ group.missingBVs.length }} thiếu)
  </span>
</td>
```

### 3. Thêm nút "Thêm BV thiếu"
```vue
<button
  v-if="group.missingBVs.length > 0"
  @click="addMissingBVs(group.ma_po, group.missingBVs)"
  class="text-blue-600 hover:text-blue-800 text-xs font-medium"
>
  ➕ Thêm {{ group.missingBVs.length }}
</button>
```

### 4. Hiển thị các Mã BV còn thiếu
```vue
<!-- Hiển thị các Mã BV còn thiếu -->
<tr
  v-for="missingBV in group.missingBVs"
  :key="`missing-${group.ma_po}-${missingBV.ma_bv}`"
  class="border-b dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900/20"
>
  <td class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-orange-600 font-medium">
    {{ missingBV.ma_bv }}
    <span class="text-xs text-orange-500 ml-1">(chưa có chi phí)</span>
  </td>
  <!-- ... các cột khác hiển thị "-" -->
  <td class="px-3 py-2 border border-gray-300 dark:border-gray-600">
    <button
      @click="addSingleBV(group.ma_po, missingBV)"
      class="text-green-600 hover:text-green-800 text-sm"
    >
      ➕ Thêm
    </button>
  </td>
</tr>
```

### 5. Thêm các hàm xử lý
```typescript
// Thêm một Mã BV còn thiếu
const addSingleBV = async (ma_po: string, missingBV: any) => {
  // Tạo dòng chi phí với giá trị 0
}

// Thêm tất cả Mã BV còn thiếu cho một PO
const addMissingBVs = async (ma_po: string, missingBVs: any[]) => {
  // Tạo tất cả dòng chi phí còn thiếu
}
```

## Kết quả

### Trước khi sửa:
- ❌ QLNB chỉ hiển thị Mã BV đã có chi phí
- ❌ Không biết có Mã BV mới trong QLPO
- ❌ Không thể thêm chi phí cho Mã BV mới

### Sau khi sửa:
- ✅ Hiển thị số lượng BV: "SLBV: 1/3 (2 thiếu)"
- ✅ Hiển thị các Mã BV còn thiếu với background màu vàng
- ✅ Nút "➕ Thêm 2" để thêm tất cả BV thiếu
- ✅ Nút "➕ Thêm" cho từng BV thiếu
- ✅ Tự động phát hiện BV mới khi refresh dữ liệu

## Workflow mới

1. **QLPO thêm Mã BV mới vào PO12**
2. **Chuyển sang QLNB và click "🔄 Refresh PO"**
   - → Tự động cập nhật dữ liệu từ QLPO
3. **QLNB hiển thị:**
   - Header: "SLBV: 1/2 (1 thiếu)"
   - Dòng BV cũ: hiển thị bình thường
   - Dòng BV mới: background vàng, text "(chưa có chi phí)"
4. **User có thể:**
   - Click "➕ Thêm 1" để thêm tất cả BV thiếu
   - Click "➕ Thêm" cho từng BV cụ thể
5. **Sau khi thêm:**
   - BV mới được tạo với chi phí = 0
   - User có thể sửa chi phí sau

## Ví dụ cụ thể

**Trước:**
```
PO12
├── BV001 (có chi phí)
└── [BV002 không hiển thị]
```

**Sau:**
```
PO12 - SLBV: 1/2 (1 thiếu) [➕ Thêm 1]
├── BV001 (có chi phí) - [Sửa] [Xóa]
└── BV002 (chưa có chi phí) - [➕ Thêm] ← background vàng
```

## Files đã thay đổi
- `Vija-fe/src/views/QLNB.vue` - Thêm logic phát hiện và hiển thị BV thiếu