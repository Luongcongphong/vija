# Logic tự động lấy Đơn giá từ QLDM

## Quy tắc

QLKH sẽ tự động lấy Đơn giá từ QLDM dựa trên:
1. **PO** (phải khớp)
2. **Mã BV** (phải khớp)
3. **Số lượng** (tìm định mức có SL lớn nhất mà ≤ SL nhập)

## Ví dụ

### Dữ liệu QLDM:

| PO    | Mã BV | Số lượng | Đơn giá  |
|-------|-------|----------|----------|
| PO001 | BV001 | 100      | 50,000   |
| PO001 | BV001 | 500      | 45,000   |
| PO001 | BV001 | 1000     | 40,000   |

### Trường hợp 1: Nhập SL = 150

```
Tìm kiếm:
- PO: PO001 ✓
- Mã BV: BV001 ✓
- SL ≤ 150: [100] ✓

Kết quả:
→ Chọn SL = 100 (lớn nhất mà ≤ 150)
→ Đơn giá = 50,000 VNĐ
```

### Trường hợp 2: Nhập SL = 750

```
Tìm kiếm:
- PO: PO001 ✓
- Mã BV: BV001 ✓
- SL ≤ 750: [100, 500] ✓

Kết quả:
→ Chọn SL = 500 (lớn nhất mà ≤ 750)
→ Đơn giá = 45,000 VNĐ
```

### Trường hợp 3: Nhập SL = 1500

```
Tìm kiếm:
- PO: PO001 ✓
- Mã BV: BV001 ✓
- SL ≤ 1500: [100, 500, 1000] ✓

Kết quả:
→ Chọn SL = 1000 (lớn nhất mà ≤ 1500)
→ Đơn giá = 40,000 VNĐ
```

### Trường hợp 4: Nhập SL = 50

```
Tìm kiếm:
- PO: PO001 ✓
- Mã BV: BV001 ✓
- SL ≤ 50: [] ✗ (không có định mức nào ≤ 50)

Kết quả:
→ Không tìm thấy định mức phù hợp
→ Đơn giá = 0 (có thể nhập thủ công)
```

## Giao diện

### Khi tìm thấy định mức:
```
Đơn giá: 45,000 (Tự động từ QLDM - SL: 500)
[Ô input màu xám, readonly]
Áp dụng định mức cho số lượng ≤ 500
```

### Khi không tìm thấy:
```
Đơn giá: [Ô input trắng, có thể nhập]
```

## Quy trình sử dụng

1. **Thêm định mức vào QLDM:**
   - PO: PO001
   - Mã BV: BV001
   - Số lượng: 100, 500, 1000
   - Đơn giá tương ứng

2. **Thêm đơn hàng vào QLKH:**
   - Chọn PO: PO001
   - Chọn Mã BV: BV001
   - Nhập Số lượng: 750
   - → Đơn giá tự động: 45,000 (từ định mức SL=500)

## Lợi ích

✅ **Giá bậc thang:** Số lượng càng nhiều, giá càng rẻ
✅ **Tự động hóa:** Không cần nhập giá thủ công
✅ **Chính xác:** Luôn áp dụng đúng bảng giá
✅ **Linh hoạt:** Nếu không có định mức, vẫn nhập được thủ công

## Lưu ý

- Định mức trong QLDM nên được sắp xếp theo số lượng tăng dần
- Nên có định mức cho các mức số lượng phổ biến
- Nếu SL nhập < SL nhỏ nhất trong QLDM → Không tìm thấy → Nhập thủ công
