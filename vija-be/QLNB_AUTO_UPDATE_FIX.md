# QLNB Auto Update Fix - 2024-12-12

## Vấn đề
QLNB lấy Mã BV theo PO từ QLPO, nhưng khi QLPO thêm Mã BV mới thì QLNB không tự động cập nhật danh sách Mã BV.

## Nguyên nhân
- QLNB chỉ load dữ liệu từ QLPO một lần khi component mount
- Khi QLPO thêm Mã BV mới, QLNB không biết và không refresh dữ liệu
- User phải reload trang để thấy Mã BV mới

## Giải pháp đã thực hiện

### 1. Thêm nút Refresh PO
```vue
<button
  @click="refreshData"
  class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
  :disabled="loading"
>
  🔄 Refresh PO
</button>
```

### 2. Hàm refreshData()
```typescript
const refreshData = async () => {
  try {
    loading.value = true
    console.log('Refreshing all data...')
    
    // Load lại dữ liệu từ QLPO trước
    await loadQLPO()
    await loadMaPOList()
    
    // Sau đó load lại QLNB
    await loadData()
    
    alert('✅ Đã cập nhật dữ liệu từ QLPO!')
  } catch (error) {
    console.error('Lỗi khi refresh:', error)
    alert('Không thể refresh dữ liệu!')
  } finally {
    loading.value = false
  }
}
```

### 3. Auto-refresh khi mở modal thêm mới
```typescript
const openAddModal = async () => {
  try {
    loading.value = true
    
    // Refresh dữ liệu QLPO trước khi mở modal
    console.log('Refreshing QLPO data before opening modal...')
    await loadQLPO()
    await loadMaPOList()
    
    showAddModal.value = true
  } catch (error) {
    console.error('Lỗi khi refresh dữ liệu:', error)
    alert('Không thể tải dữ liệu mới nhất từ QLPO!')
  } finally {
    loading.value = false
  }
}
```

### 4. Cải thiện hàm autoCreateFromPO()
- Tự động refresh dữ liệu QLPO trước khi tạo
- Kiểm tra trùng lặp trước khi tạo
- Hiển thị thông tin chi tiết về kết quả

```typescript
// Refresh dữ liệu QLPO trước khi tạo
await loadQLPO()

// Lấy lại danh sách Mã BV sau khi refresh
const poItems = qlpoData.value.filter(item => item.ma_po === formData.value.ma_po)

// Kiểm tra trùng lặp
const existing = data.value.find(item => 
  item.ma_po === formData.value.ma_po && item.ma_bv === poItem.ma_bv
)
```

### 5. Thêm thông báo trong modal
```vue
<!-- Thông báo dữ liệu đã cập nhật -->
<div v-if="!editId" class="mb-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
  <p class="text-sm text-blue-700 dark:text-blue-300">
    ✅ Dữ liệu PO đã được cập nhật từ QLPO mới nhất
  </p>
</div>
```

## Kết quả

### Trước khi sửa:
- ❌ QLNB không biết khi QLPO thêm Mã BV mới
- ❌ User phải reload trang để thấy dữ liệu mới
- ❌ Tạo tự động có thể bị thiếu Mã BV mới

### Sau khi sửa:
- ✅ Nút "🔄 Refresh PO" để cập nhật dữ liệu thủ công
- ✅ Tự động refresh khi mở modal "Thêm mới"
- ✅ Tự động refresh trước khi "Tạo tự động"
- ✅ Kiểm tra trùng lặp khi tạo tự động
- ✅ Thông báo rõ ràng về trạng thái cập nhật
- ✅ Hiển thị kết quả chi tiết (thành công/thất bại/đã tồn tại)

## Workflow mới

1. **Khi user thêm Mã BV mới vào QLPO**
2. **Chuyển sang QLNB và click "Thêm mới"**
   - → Tự động refresh dữ liệu từ QLPO
   - → Hiển thị thông báo "Dữ liệu PO đã được cập nhật"
3. **Chọn PO và click "Tạo tự động"**
   - → Tự động refresh lại lần nữa để đảm bảo dữ liệu mới nhất
   - → Tạo các dòng chi phí cho tất cả Mã BV (bao gồm Mã BV mới)
   - → Hiển thị kết quả chi tiết

## Files đã thay đổi
- `Vija-fe/src/views/QLNB.vue` - Thêm auto-refresh và cải thiện UX