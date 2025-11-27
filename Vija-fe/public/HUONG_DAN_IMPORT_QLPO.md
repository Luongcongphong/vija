# HƯỚNG DẪN IMPORT FILE EXCEL VÀO QUẢN LÝ PO

## Tổng quan
Tính năng import Excel cho phép bạn nhập hàng loạt dữ liệu PO (Purchase Order) từ file Excel vào hệ thống một cách nhanh chóng.

## Cách sử dụng

### Bước 1: Tải file mẫu
1. Vào trang **Quản lý PO**
2. Click nút **📥 Tải file mẫu**
3. File `QLPO_Template.xlsx` sẽ được tải về máy

### Bước 2: Chuẩn bị dữ liệu
1. Mở file Excel mẫu vừa tải
2. Xem sheet **"Hướng dẫn"** để hiểu cấu trúc dữ liệu
3. Xem sheet **"Dữ liệu mẫu"** để tham khảo

### Bước 3: Điền dữ liệu của bạn
Trong sheet đầu tiên (hoặc tạo sheet mới), điền dữ liệu theo cấu trúc:

| Mã PO | Mã BV | Ngày tạo | Ngày giao |
|-------|-------|----------|-----------|
| PO001 | BV001 | 2024-01-15 | 2024-01-20 |
| PO001 | BV002 | 2024-01-15 | 2024-01-20 |
| PO002 | BV003 | 2024-01-16 | 2024-01-21 |

**Giải thích các cột:**
- **Mã PO**: Mã Purchase Order (bắt buộc)
  - Các dòng có cùng Mã PO sẽ được gộp thành 1 nhóm
  - VD: PO001, PO002, PO003
  
- **Mã BV**: Mã bao vải (bắt buộc)
  - Phải tồn tại trong hệ thống (Quản lý Danh mục)
  - Mỗi dòng là 1 Mã BV riêng biệt
  
- **Ngày tạo**: Ngày tạo PO (tùy chọn)
  - Định dạng: YYYY-MM-DD (VD: 2024-01-15)
  - Hoặc dùng định dạng ngày Excel (sẽ tự động chuyển đổi)
  
- **Ngày giao**: Ngày giao hàng dự kiến (tùy chọn)
  - Định dạng: YYYY-MM-DD (VD: 2024-01-20)
  - Nên sau ngày tạo

### Bước 4: Import vào hệ thống
1. Lưu file Excel
2. Vào trang **Quản lý PO**
3. Click nút **📤 Import Excel**
4. Chọn file Excel của bạn
5. Hệ thống sẽ:
   - Đọc và validate dữ liệu
   - Hiển thị xác nhận số lượng dòng và các Mã PO
   - Yêu cầu xác nhận trước khi import
6. Click **OK** để xác nhận
7. Chờ hệ thống xử lý
8. Xem kết quả import (thành công/thất bại)

## Lưu ý quan trọng

### ✅ Nên làm:
- Kiểm tra tất cả Mã BV đã tồn tại trong hệ thống trước khi import
- Sử dụng định dạng ngày chuẩn: YYYY-MM-DD
- Kiểm tra dữ liệu trước khi import
- Backup dữ liệu trước khi import số lượng lớn

### ❌ Không nên:
- Import dữ liệu trùng lặp (cùng Mã PO và Mã BV)
- Sử dụng Mã BV chưa tồn tại trong hệ thống
- Để trống các trường bắt buộc (Mã PO, Mã BV)

## Xử lý lỗi

### Lỗi thường gặp:

1. **"Mã BV không tồn tại"**
   - Nguyên nhân: Mã BV chưa được tạo trong Quản lý Danh mục
   - Giải pháp: Vào Quản lý Danh mục, thêm Mã BV trước

2. **"Dữ liệu trùng lặp"**
   - Nguyên nhân: Đã tồn tại PO với cùng Mã PO và Mã BV
   - Giải pháp: Kiểm tra lại dữ liệu hoặc xóa dữ liệu cũ

3. **"Thiếu Mã PO/Mã BV"**
   - Nguyên nhân: Các trường bắt buộc bị để trống
   - Giải pháp: Điền đầy đủ thông tin

4. **"Lỗi định dạng ngày"**
   - Nguyên nhân: Ngày không đúng định dạng
   - Giải pháp: Sử dụng định dạng YYYY-MM-DD hoặc định dạng ngày Excel

## Ví dụ thực tế

### Ví dụ 1: Import 1 PO với nhiều Mã BV
```
Mã PO | Mã BV | Ngày tạo   | Ngày giao
PO001 | BV001 | 2024-01-15 | 2024-01-20
PO001 | BV002 | 2024-01-15 | 2024-01-20
PO001 | BV003 | 2024-01-15 | 2024-01-20
```
Kết quả: 1 nhóm PO001 với 3 Mã BV

### Ví dụ 2: Import nhiều PO
```
Mã PO | Mã BV | Ngày tạo   | Ngày giao
PO001 | BV001 | 2024-01-15 | 2024-01-20
PO001 | BV002 | 2024-01-15 | 2024-01-20
PO002 | BV003 | 2024-01-16 | 2024-01-21
PO002 | BV004 | 2024-01-16 | 2024-01-21
PO003 | BV005 | 2024-01-17 | 2024-01-22
```
Kết quả: 3 nhóm PO (PO001, PO002, PO003)

## Hỗ trợ
Nếu gặp vấn đề khi import, vui lòng:
1. Kiểm tra lại file Excel theo hướng dẫn
2. Xem thông báo lỗi chi tiết
3. Liên hệ quản trị viên nếu cần hỗ trợ
