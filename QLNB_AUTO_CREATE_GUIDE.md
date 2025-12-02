# QLNB - Hướng dẫn thêm tính năng tự động tạo

## ✅ Đã hoàn thành:
1. Database migration: Thêm cột `so_luong` vào bảng `qlnb`
2. Backend: Cập nhật create/update trong qlnbController.ts
3. Frontend Service: Thêm `so_luong` vào interface QLNB
4. Frontend View: Thêm cột "Số lượng" vào bảng

## 🔄 Cần làm tiếp:

### File: `Vija-fe/src/views/QLNB.vue`

#### 1. Thêm nút "Tạo tự động" (sau khi chọn Mã PO):

```vue
<div class="mb-4 col-span-2">
  <button
    v-if="formData.ma_po && !editId"
    @click="autoCreateFromPO"
    type="button"
    class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
  >
    🔄 Tạo tự động từ PO ({{ maBVOptions.length }} Mã BV)
  </button>
</div>
```

#### 2. Thêm hàm `autoCreateFromPO`:

```typescript
const autoCreateFromPO = async () => {
  if (!formData.value.ma_po) {
    alert('Vui lòng chọn Mã PO trước!')
    return
  }
  
  const confirmMsg = `Tạo tự động ${maBVOptions.value.length} dòng chi phí cho PO "${formData.value.ma_po}"?\n\n` +
    `Các Mã BV: ${maBVOptions.value.map(opt => opt.value).join(', ')}\n\n` +
    `Tất cả chi phí sẽ được đặt = 0`
  
  if (!confirm(confirmMsg)) return
  
  try {
    loading.value = true
    
    let successCount = 0
    let failCount = 0
    const failedItems: string[] = []
    
    // Lấy thông tin từ QLPO
    const poResponse = await qlpoService.getByMaPO(formData.value.ma_po)
    const poItems = poResponse.data
    
    for (const poItem of poItems) {
      try {
        await qlnbService.create({
          ma_po: formData.value.ma_po,
          ma_bv: poItem.ma_bv,
          so_luong: poItem.so_luong || 0,
          phoi_lieu: 0,
          gia_cong_ngoai: 0,
          gia_cong_noi_bo: 0,
          xu_ly_be_mat: 0,
          van_chuyen: 0,
          phi_qldn: 0
        })
        successCount++
      } catch (error) {
        failCount++
        failedItems.push(poItem.ma_bv)
      }
    }
    
    await loadData()
    closeModal()
    
    let resultMsg = `Tạo tự động hoàn tất!\n\n`
    resultMsg += `✅ Thành công: ${successCount} dòng\n`
    if (failCount > 0) {
      resultMsg += `❌ Thất bại: ${failCount} dòng\n`
      resultMsg += `Mã BV lỗi: ${failedItems.join(', ')}`
    }
    
    alert(resultMsg)
  } catch (error) {
    console.error('Lỗi khi tạo tự động:', error)
    alert('Không thể tạo tự động!')
  } finally {
    loading.value = false
  }
}
```

#### 3. Thêm input Số lượng vào form (sau Mã BV):

```vue
<div class="mb-4">
  <label class="block text-sm font-medium mb-2">Số lượng</label>
  <input
    v-model.number="formData.so_luong"
    type="number"
    min="0"
    placeholder="VD: 100"
    class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
  />
</div>
```

#### 4. Cập nhật formData (thêm so_luong):

```typescript
const formData = ref({
  ma_po: '',
  ma_bv: '',
  so_luong: 0,  // THÊM DÒNG NÀY
  phoi_lieu: 0,
  gia_cong_ngoai: 0,
  gia_cong_noi_bo: 0,
  xu_ly_be_mat: 0,
  van_chuyen: 0,
  phi_qldn: 0,
})
```

#### 5. Cập nhật editItem:

```typescript
const editItem = (item: QLNB) => {
  editId.value = item.id || null
  formData.value = {
    ma_po: item.ma_po,
    ma_bv: item.ma_bv,
    so_luong: item.so_luong || 0,  // THÊM DÒNG NÀY
    phoi_lieu: item.phoi_lieu,
    gia_cong_ngoai: item.gia_cong_ngoai,
    gia_cong_noi_bo: item.gia_cong_noi_bo,
    xu_ly_be_mat: item.xu_ly_be_mat,
    van_chuyen: item.van_chuyen,
    phi_qldn: item.phi_qldn,
  }
  showAddModal.value = true
}
```

#### 6. Cập nhật closeModal:

```typescript
const closeModal = () => {
  showAddModal.value = false
  editId.value = null
  formData.value = {
    ma_po: '',
    ma_bv: '',
    so_luong: 0,  // THÊM DÒNG NÀY
    phoi_lieu: 0,
    gia_cong_ngoai: 0,
    gia_cong_noi_bo: 0,
    xu_ly_be_mat: 0,
    van_chuyen: 0,
    phi_qldn: 0,
  }
}
```

## Lưu ý:
- Restart backend sau khi sửa controller
- Tính năng "Tạo tự động" chỉ hiển thị khi:
  - Đã chọn Mã PO
  - Đang ở chế độ thêm mới (không phải sửa)
- Tất cả chi phí mặc định = 0, người dùng có thể sửa sau
