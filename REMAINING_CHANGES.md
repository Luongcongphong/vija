# CÁC THAY ĐỔI CÒN LẠI

## ✅ Đã hoàn thành:
1. Ẩn mục QLBG trong menu
2. Database migration: Thêm cột `so_luong` vào bảng `qlpo`
3. Backend: Cập nhật qlpoController.ts (create, update)
4. Frontend: Cập nhật qlpoService.ts interface
5. Frontend: Thêm header cột "Số lượng" vào QLPO.vue

## 🔄 Cần làm tiếp cho QLPO:

### File: `Vija-fe/src/views/QLPO.vue`

1. **Thêm cột Số lượng vào tbody** (dòng ~120):
```vue
<td class="px-4 py-3">{{ item.ma_bv }}</td>
<td class="px-4 py-3">{{ item.so_luong || 0 }}</td>  <!-- THÊM DÒNG NÀY -->
<td class="px-4 py-3">{{ formatDate(item.ngay_tao) }}</td>
```

2. **Thêm input Số lượng vào form** (dòng ~180):
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

3. **Thêm so_luong vào formData** (dòng ~280):
```typescript
const formData = ref({
  ma_po: '',
  ma_bv: '',
  so_luong: 0,  // THÊM DÒNG NÀY
  ngay_tao: '',
  ngay_giao: '',
})
```

4. **Cập nhật editItem** (dòng ~360):
```typescript
formData.value = {
  ma_po: item.ma_po,
  ma_bv: item.ma_bv,
  so_luong: item.so_luong || 0,  // THÊM DÒNG NÀY
  ngay_tao: item.ngay_tao || '',
  ngay_giao: item.ngay_giao || '',
}
```

5. **Cập nhật closeModal** (dòng ~390):
```typescript
formData.value = {
  ma_po: '',
  ma_bv: '',
  so_luong: 0,  // THÊM DÒNG NÀY
  ngay_tao: '',
  ngay_giao: '',
}
```

6. **Cập nhật Excel template** (dòng ~500):
- Thêm cột 'Số lượng' vào templateData
- Thêm hướng dẫn về Số lượng
- Cập nhật handleFileImport để đọc Số lượng

## 🔄 Cần làm cho QLDM (Phức tạp hơn):

### Backend:
1. Database migration: Thêm `so_bg`, `ma_kh` vào bảng `qldm`
2. Update qldmController.ts
3. Thêm API search/filter

### Frontend:
1. Update qldmService.ts interface
2. Update QLDM.vue:
   - Thêm 2 cột mới
   - Thêm filter/search
   - Update form

## Lưu ý:
- Restart backend sau khi sửa controller
- Test kỹ các chức năng sau khi thay đổi
- Backup database trước khi chạy migration
