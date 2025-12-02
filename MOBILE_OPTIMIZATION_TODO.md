# Tối ưu giao diện Mobile - TODO

## Các vấn đề cần sửa

### 1. Modal QLNB
- Modal quá rộng trên mobile (max-w-5xl)
- Padding quá lớn
- Grid 2 cột không phù hợp với màn hình nhỏ

### 2. Bảng dữ liệu
- Bảng quá rộng, cần scroll ngang
- Nhiều cột không cần thiết trên mobile
- Font size có thể nhỏ hơn

### 3. Filter/Search
- Input và select nằm ngang chiếm nhiều không gian
- Cần stack dọc trên mobile

### 4. Buttons
- Các nút có thể quá nhỏ để tap trên mobile
- Cần tăng kích thước touch target

## Giải pháp đề xuất

### Modal responsive
```vue
<!-- Thay đổi class modal -->
<div class="bg-white dark:bg-gray-800 rounded-lg w-full max-w-5xl lg:max-w-5xl md:max-w-3xl sm:max-w-full flex flex-col max-h-[96vh]">
  <!-- Giảm padding trên mobile -->
  <div class="p-4 sm:p-6 border-b dark:border-gray-700">
  
  <!-- Grid responsive -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
```

### Bảng responsive
```vue
<!-- Ẩn một số cột trên mobile -->
<th class="hidden md:table-cell">Cột không quan trọng</th>

<!-- Hoặc dùng card layout trên mobile -->
<div class="block md:hidden">
  <!-- Card view cho mobile -->
</div>
<table class="hidden md:table">
  <!-- Table view cho desktop -->
</table>
```

### Filter responsive
```vue
<div class="flex flex-col sm:flex-row gap-2">
  <input class="w-full sm:flex-1" />
  <select class="w-full sm:w-auto" />
</div>
```

## Cần làm gì?

Bạn muốn tôi:
1. Tối ưu toàn bộ giao diện cho mobile?
2. Chỉ tối ưu một số trang cụ thể?
3. Tập trung vào modal QLNB trước?

Hãy cho tôi biết ưu tiên của bạn!
