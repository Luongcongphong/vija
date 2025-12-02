# Debug Dashboard - Đơn giá = 0

## Vấn đề
Dashboard hiển thị đơn giá = 0 và thành tiền = 0

## Các bước kiểm tra

### 1. Kiểm tra dữ liệu trong QLDM
Chạy query này trong MySQL để xem dữ liệu QLDM:

```sql
SELECT * FROM qldm ORDER BY ma_bv, so_luong LIMIT 10;
```

### 2. Kiểm tra dữ liệu trong QLPO
```sql
SELECT * FROM qlpo ORDER BY ma_po LIMIT 10;
```

### 3. Kiểm tra JOIN giữa QLPO và QLDM
```sql
SELECT 
  po.ma_po,
  po.ma_bv,
  po.so_luong as po_so_luong,
  dm.ma_bv as dm_ma_bv,
  dm.so_luong as dm_so_luong,
  dm.don_gia
FROM qlpo po
LEFT JOIN qldm dm ON dm.ma_bv = po.ma_bv
LIMIT 10;
```

### 4. Xem backend log
Sau khi refresh Dashboard, kiểm tra console backend để xem log:
```
Dashboard query result sample: { ... }
```

## Giải pháp đã thử

### Phiên bản 1: JOIN với điều kiện ma_bv VÀ so_luong
```sql
LEFT JOIN qldm dm ON dm.ma_bv = po.ma_bv AND dm.so_luong = po.so_luong
```
**Vấn đề:** Nếu so_luong không khớp chính xác, không lấy được đơn giá

### Phiên bản 2 (Hiện tại): Lấy đơn giá đầu tiên của mỗi Mã BV
```sql
LEFT JOIN (
  SELECT 
    dm1.ma_bv,
    dm1.so_luong,
    dm1.don_gia
  FROM qldm dm1
  INNER JOIN (
    SELECT 
      ma_bv,
      MIN(id) as min_id
    FROM qldm
    GROUP BY ma_bv
  ) dm2 ON dm1.ma_bv = dm2.ma_bv AND dm1.id = dm2.min_id
) dm ON dm.ma_bv = po.ma_bv
```
**Logic:** Lấy dòng đầu tiên (id nhỏ nhất) của mỗi Mã BV trong QLDM

## Các khả năng gây lỗi

1. **QLDM chưa có dữ liệu**
   - Kiểm tra: `SELECT COUNT(*) FROM qldm;`
   - Giải pháp: Thêm dữ liệu vào QLDM

2. **Mã BV trong QLPO không tồn tại trong QLDM**
   - Kiểm tra: 
   ```sql
   SELECT DISTINCT po.ma_bv 
   FROM qlpo po 
   LEFT JOIN qldm dm ON dm.ma_bv = po.ma_bv 
   WHERE dm.ma_bv IS NULL;
   ```
   - Giải pháp: Thêm các Mã BV còn thiếu vào QLDM

3. **Kiểu dữ liệu không khớp**
   - Kiểm tra cấu trúc bảng:
   ```sql
   DESCRIBE qlpo;
   DESCRIBE qldm;
   ```

4. **Dữ liệu có khoảng trắng thừa**
   - Thử query với TRIM:
   ```sql
   LEFT JOIN qldm dm ON TRIM(dm.ma_bv) = TRIM(po.ma_bv)
   ```

## Cách test nhanh

Thêm 1 dòng test vào QLDM:
```sql
INSERT INTO qldm (ma_bv, so_luong, don_gia) 
VALUES ('BV001', 100, 50000);
```

Sau đó thêm 1 dòng test vào QLPO:
```sql
INSERT INTO qlpo (ma_po, ma_bv, so_luong) 
VALUES ('PO_TEST', 'BV001', 100);
```

Refresh Dashboard và xem có hiển thị đơn giá 50,000 không.
