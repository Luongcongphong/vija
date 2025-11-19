# Hướng dẫn Dashboard

## Tính năng

### 1. Hiển thị dữ liệu tổng hợp
Dashboard tự động lấy và tổng hợp dữ liệu từ:
- **QLKH** (Quản lý Khách hàng): PO, Mã BV, Số lượng, Đơn giá, Thành tiền
- **QLNB** (Quản lý Nội bộ): Chi phí (Phôi liệu, Gia công, Vận chuyển, v.v.)

### 2. Tính toán tự động
- **Tổng Phí** = Tổng các chi phí từ QLNB
- **Lợi Nhuận** = Thành Tiền - Tổng Phí
- **Tỷ lệ** = (Lợi Nhuận / Thành Tiền) × 100%

### 3. Export Excel
- Click nút "Export Excel" để tải file
- File tự động đặt tên: `Dashboard_YYYY-MM-DD.xlsx`
- Bao gồm tất cả dữ liệu hiển thị trên bảng

## Cấu trúc dữ liệu

### Các cột hiển thị:

| Cột | Nguồn | Mô tả |
|-----|-------|-------|
| PO | QLKH | Mã đơn hàng |
| Mã BV | QLKH | Mã bảo vệ/sản phẩm |
| Số Lượng | QLKH | Số lượng sản phẩm |
| Đơn giá | QLKH | Giá bán cho khách |
| Thành Tiền | QLKH | Số lượng × Đơn giá |
| Phôi Liệu | QLNB | Chi phí nguyên vật liệu |
| Gia Công Ngoài | QLNB | Chi phí gia công bên ngoài |
| Gia Công Nội Bộ | QLNB | Chi phí gia công nội bộ |
| Xử lý Bề Mặt | QLNB | Chi phí xử lý bề mặt |
| Vận Chuyển | QLNB | Chi phí vận chuyển |
| Phí QLDN | QLNB | Phí quản lý doanh nghiệp |
| Tổng Phí | Tính toán | Tổng các chi phí |
| Lợi Nhuận | Tính toán | Thành Tiền - Tổng Phí |
| Tỷ lệ | Tính toán | % lợi nhuận |
| Ngày tạo | QLKH | Ngày tạo đơn hàng |

## Màu sắc

- **Lợi Nhuận > 0**: Màu xanh (lãi)
- **Lợi Nhuận < 0**: Màu đỏ (lỗ)
- **Tỷ lệ > 0**: Màu xanh
- **Tỷ lệ < 0**: Màu đỏ

## Quy trình sử dụng

1. **Thêm dữ liệu QLKH:**
   - PO: PO001
   - Mã BV: BV001
   - Số lượng: 100
   - Đơn giá: 50,000
   - → Thành tiền: 5,000,000

2. **Thêm dữ liệu QLNB:**
   - PO: PO001 (trùng với QLKH)
   - Mã BV: BV001 (trùng với QLKH)
   - Các chi phí...
   - → Tổng phí: 3,000,000

3. **Xem Dashboard:**
   - Lợi nhuận: 5,000,000 - 3,000,000 = 2,000,000
   - Tỷ lệ: (2,000,000 / 5,000,000) × 100% = 40%

4. **Export Excel:**
   - Click "Export Excel"
   - File tải về: `Dashboard_2024-01-15.xlsx`

## Lưu ý

- Dashboard tự động cập nhật khi có thay đổi trong QLKH hoặc QLNB
- Nếu QLKH có dữ liệu nhưng QLNB không có → Tổng phí = 0
- Nếu QLNB có dữ liệu nhưng QLKH không có → Không hiển thị
- Export Excel chỉ hoạt động khi có dữ liệu

## Cài đặt

Cần cài đặt thư viện xlsx:

```bash
cd Vija-fe
npm install xlsx
```

## API Endpoint

Dashboard gọi API:
```
GET /api/dashboard
```

Backend tự động JOIN dữ liệu từ QLKH và QLNB, tính toán lợi nhuận và tỷ lệ.
