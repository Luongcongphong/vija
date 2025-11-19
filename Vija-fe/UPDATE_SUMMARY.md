# Tóm tắt cập nhật - Searchable Dropdown cho PO và Mã BV

## Đã hoàn thành

### 1. Component SearchableSelect
✅ Tạo `src/components/common/SearchableSelect.vue`
- Dropdown có search
- Click outside để đóng
- Hiển thị "Không tìm thấy kết quả"

### 2. QLPO - Quản lý PO
✅ Cập nhật kết nối API
- Lấy dữ liệu từ backend
- CRUD operations với API

### 3. QLKH - Quản lý Khách hàng
✅ Sử dụng SearchableSelect cho PO và Mã BV
- PO: Dropdown lấy từ QLPO (unique)
- Mã BV: Lọc theo PO đã chọn
- Khi chọn PO mới, Mã BV tự động reset

### 4. QLNB - Quản lý Nội bộ
✅ Sử dụng SearchableSelect cho PO và Mã BV
✅ Cập nhật kết nối API
✅ Đổi field names sang snake_case

## Cần làm tiếp

### QLDM - Quản lý Định mức
- [ ] Thêm SearchableSelect cho PO và Mã BV
- [ ] Cập nhật kết nối API
- [ ] Đổi field names

### QLUser - Quản lý User
- [ ] Cập nhật kết nối API
- [ ] Không cần SearchableSelect (không có PO/Mã BV)

### Dashboard
- [ ] Cập nhật kết nối API
- [ ] Hiển thị dữ liệu từ backend

## Cách sử dụng SearchableSelect

```vue
<template>
  <SearchableSelect
    v-model="formData.po"
    :options="poOptions"
    label="PO"
    placeholder="Chọn hoặc tìm PO..."
    :required="true"
    @update:modelValue="handlePOChange"
  />
</template>

<script setup>
import SearchableSelect from '@/components/common/SearchableSelect.vue'
import { qlpoService } from '@/services/qlpoService'

const qlpoData = ref([])
const formData = ref({ po: '', ma_bv: '' })

// Load QLPO data
const loadQLPO = async () => {
  const result = await qlpoService.getAll()
  qlpoData.value = result
}

// Create options for PO
const poOptions = computed(() => {
  const uniquePOs = [...new Set(qlpoData.value.map(item => item.po))]
  return uniquePOs.map(po => ({
    value: po,
    label: po
  }))
})

// Create options for Mã BV (filtered by selected PO)
const maBVOptions = computed(() => {
  if (!formData.value.po) {
    return qlpoData.value.map(item => ({
      value: item.ma_bv,
      label: `${item.ma_bv} (${item.po})`
    }))
  }
  
  return qlpoData.value
    .filter(item => item.po === formData.value.po)
    .map(item => ({
      value: item.ma_bv,
      label: item.ma_bv
    }))
})

// Reset Mã BV when PO changes
const handlePOChange = (po) => {
  formData.value.ma_bv = ''
}

onMounted(() => {
  loadQLPO()
})
</script>
```

## Quy trình làm việc

1. **Thêm PO và Mã BV vào QLPO trước**
2. **Các trang khác (QLKH, QLNB, QLDM) chọn từ danh sách QLPO**
3. **Khi chọn PO, danh sách Mã BV tự động lọc theo PO đó**

## Lợi ích

✅ Tránh nhập sai PO/Mã BV
✅ Dữ liệu nhất quán
✅ Dễ tìm kiếm với search
✅ UX tốt hơn với dropdown
