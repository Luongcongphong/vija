# Hướng dẫn sử dụng Hệ thống Quản lý

## 1. Đăng nhập

Khi chạy ứng dụng lần đầu, hệ thống tự động tạo tài khoản admin mặc định.

Truy cập trang đăng nhập và sử dụng:
- **Tên đăng nhập**: admin
- **Mật khẩu**: admin123

Nhập vào ô "Tên đăng nhập" (không phải email) và mật khẩu, sau đó click "Đăng nhập".

## 2. Các chức năng chính

### Dashboard
- Hiển thị tổng hợp dữ liệu từ QLKH và QLNB
- Tự động tính toán:
  - **Lợi Nhuận** = Thành Tiền - Tổng Phí
  - **Tỷ lệ** = (Lợi Nhuận / Thành Tiền) × 100%
- Các cột hiển thị:
  - PO, Mã BV, Số Lượng, Đơn giá, Thành Tiền
  - Phôi Liệu, Gia Công Ngoài, Gia Công Nội Bộ
  - Xử lý Bề Mặt, Vận Chuyển, Phí QLDN
  - Tổng Phí, Lợi Nhuận, Tỷ lệ
  - Ngày tạo, Ghi chú

### QLKH (Quản lý Khách hàng)
- Quản lý thông tin đơn hàng từ khách hàng
- Các trường dữ liệu:
  - **PO**: Mã đơn hàng
  - **Mã BV**: Mã bảo vệ/sản phẩm
  - **Số Lượng**: Số lượng sản phẩm
  - **Đơn giá**: Giá bán cho khách hàng
  - **Thành tiền**: Tự động tính = Số Lượng × Đơn giá

### QLNB (Quản lý Nội bộ)
- Quản lý chi phí nội bộ cho từng đơn hàng
- Các trường dữ liệu:
  - **PO**: Mã đơn hàng (phải trùng với QLKH)
  - **Mã BV**: Mã bảo vệ/sản phẩm (phải trùng với QLKH)
  - **Phôi Liệu**: Chi phí nguyên vật liệu
  - **Gia Công Ngoài**: Chi phí gia công bên ngoài
  - **Gia Công Nội Bộ**: Chi phí gia công nội bộ
  - **Xử lý Bề Mặt**: Chi phí xử lý bề mặt
  - **Vận Chuyển**: Chi phí vận chuyển
  - **Phí QLDN**: Phí quản lý doanh nghiệp
  - **Tổng Phí**: Tự động tính tổng các chi phí trên

### QLDM (Quản lý Định mức)
- Quản lý định mức cho sản phẩm
- Các trường: PO, Mã BV, SL, Đơn giá, Định Mức

### QLPO (Quản lý PO)
- Quản lý danh sách PO
- Các trường: PO, Mã BV

### QL User (Quản lý User)
- Quản lý tài khoản người dùng
- Thêm, sửa, xóa user
- Các trường: Tên (username), Password

## 3. Quy trình làm việc

### Bước 1: Thêm thông tin khách hàng
1. Vào menu **QLKH**
2. Click nút **Thêm mới**
3. Nhập thông tin:
   - PO: VD "PO001"
   - Mã BV: VD "BV001"
   - Số Lượng: VD 100
   - Đơn giá: VD 50000
4. Click **Lưu**

### Bước 2: Thêm chi phí nội bộ
1. Vào menu **QLNB**
2. Click nút **Thêm mới**
3. Nhập thông tin (PO và Mã BV phải trùng với QLKH):
   - PO: "PO001" (trùng với QLKH)
   - Mã BV: "BV001" (trùng với QLKH)
   - Phôi Liệu: VD 1000000
   - Gia Công Ngoài: VD 500000
   - Gia Công Nội Bộ: VD 800000
   - Xử lý Bề Mặt: VD 300000
   - Vận Chuyển: VD 200000
   - Phí QLDN: VD 200000
4. Click **Lưu**

### Bước 3: Xem báo cáo tổng hợp
1. Vào menu **Dashboard**
2. Xem thông tin tổng hợp với:
   - Thành Tiền = 100 × 50000 = 5,000,000 VNĐ
   - Tổng Phí = 1,000,000 + 500,000 + 800,000 + 300,000 + 200,000 + 200,000 = 3,000,000 VNĐ
   - Lợi Nhuận = 5,000,000 - 3,000,000 = 2,000,000 VNĐ
   - Tỷ lệ = (2,000,000 / 5,000,000) × 100% = 40%

## 4. Đăng xuất

Click vào avatar ở góc trên bên phải, chọn **Đăng xuất**

## 5. Lưu ý

- Dữ liệu được lưu trong localStorage của trình duyệt
- Để Dashboard hiển thị đúng, PO và Mã BV trong QLKH và QLNB phải trùng khớp
- Xóa dữ liệu localStorage sẽ mất toàn bộ dữ liệu đã nhập
- Tài khoản admin mặc định được tạo tự động khi chạy lần đầu
