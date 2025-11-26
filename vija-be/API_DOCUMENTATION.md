# API Documentation - Vija Management System v2.0

## Tổng quan

Hệ thống quản lý Vija với cấu trúc mới:
- **QLDM (QLBV)**: Quản lý định mức bảo vệ
- **QLBG (QLKH)**: Quản lý báo giá
- **QLPO**: Quản lý PO theo báo giá

## Base URL
```
http://localhost:3000/api
```

## Authentication
Tất cả API đều yêu cầu JWT token trong header:
```
Authorization: Bearer <token>
```

---

## 1. QLDM - Quản lý Định mức

### GET /qldm
Lấy tất cả định mức

**Response:**
```json
[
  {
    "id": 1,
    "ma_bv": "BV001",
    "so_luong": 100,
    "don_gia": 50000,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET /qldm/ma-bv
Lấy danh sách Mã BV (unique)

**Response:**
```json
[
  { "ma_bv": "BV001" },
  { "ma_bv": "BV002" }
]
```

### GET /qldm/:id
Lấy định mức theo ID

### POST /qldm
Tạo định mức mới

**Request Body:**
```json
{
  "ma_bv": "BV001",
  "so_luong": 100,
  "don_gia": 50000
}
```

### PUT /qldm/:id
Cập nhật định mức

### DELETE /qldm/:id
Xóa định mức

---

## 2. QLBG - Quản lý Báo giá

### GET /qlbg
Lấy tất cả báo giá

**Response:**
```json
[
  {
    "id": 1,
    "stt": 1,
    "so_bg": "BG0001",
    "ma_bv": "BV001",
    "so_luong": 150,
    "don_gia": 50000,
    "thanh_tien": 7500000,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET /qlbg/so-bg
Lấy danh sách Số BG (unique)

**Response:**
```json
[
  { "so_bg": "BG0001" },
  { "so_bg": "BG0002" }
]
```

### GET /qlbg/by-so-bg/:so_bg
Lấy tất cả báo giá theo Số BG

**Example:** `/qlbg/by-so-bg/BG0001`

**Response:**
```json
[
  {
    "id": 1,
    "stt": 1,
    "so_bg": "BG0001",
    "ma_bv": "BV001",
    "so_luong": 150,
    "don_gia": 50000,
    "thanh_tien": 7500000
  },
  {
    "id": 2,
    "stt": 2,
    "so_bg": "BG0001",
    "ma_bv": "BV002",
    "so_luong": 200,
    "don_gia": 30000,
    "thanh_tien": 6000000
  }
]
```

### GET /qlbg/don-gia
Lấy đơn giá từ QLDM theo Mã BV và Số lượng

**Query Parameters:**
- `ma_bv`: Mã bảo vệ
- `so_luong`: Số lượng

**Example:** `/qlbg/don-gia?ma_bv=A12&so_luong=75`

**Response:**
```json
{
  "don_gia": 34,
  "matched_sl": 100,
  "range": "51-100",
  "all_ranges": [
    { "so_luong": 50, "don_gia": 23 },
    { "so_luong": 100, "don_gia": 34 },
    { "so_luong": 200, "don_gia": 40 }
  ]
}
```

**Logic theo định mức (≤):**

Giả sử QLDM có:
- Mã A12, SL=50 → Giá 23
- Mã A12, SL=100 → Giá 34
- Mã A12, SL=200 → Giá 40

Khi nhập số lượng:
- **1-50**: Lấy giá **23** (vì 1-50 ≤ 50)
- **51-100**: Lấy giá **34** (vì 51-100 ≤ 100, lấy định mức gần nhất)
- **101-200**: Lấy giá **40** (vì 101-200 ≤ 200, lấy định mức gần nhất)
- **201+**: Lấy giá **40** (vì > tất cả định mức, lấy định mức cuối)

**Quy tắc:**
1. Sắp xếp định mức theo số lượng tăng dần
2. Tìm định mức GẦN NHẤT mà số_lượng_nhập ≤ định_mức
3. Lấy đơn giá của định mức đó
4. Nếu số lượng > tất cả định mức → lấy giá của định mức cuối

### GET /qlbg/:id
Lấy báo giá theo ID

### POST /qlbg
Tạo báo giá mới

**Request Body:**
```json
{
  "so_bg": "BG0001",
  "ma_bv": "BV001",
  "so_luong": 150,
  "don_gia": 50000
}
```

**Note:** 
- `stt` tự động tăng (1-999999)
- `so_bg` tự động tạo nếu để trống (BG0001-BG9999)
- `thanh_tien` tự động tính = `so_luong * don_gia`

**Response:**
```json
{
  "message": "Tạo thành công",
  "data": {
    "id": 1,
    "stt": 1,
    "so_bg": "BG0001",
    "ma_bv": "BV001",
    "so_luong": 150,
    "don_gia": 50000,
    "thanh_tien": 7500000
  }
}
```

### PUT /qlbg/:id
Cập nhật báo giá

### DELETE /qlbg/:id
Xóa báo giá

---

## 3. QLPO - Quản lý PO

### GET /qlpo
Lấy tất cả PO

**Response:**
```json
[
  {
    "id": 1,
    "ma_po": "PO001",
    "so_bg": "BG0001",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET /qlpo/:id
Lấy PO theo ID

### POST /qlpo
Tạo PO mới

**Request Body:**
```json
{
  "ma_po": "PO001",
  "so_bg": "BG0001"
}
```

**Note:** Khi tạo PO với `so_bg`, tự động liên kết với tất cả Mã BV của báo giá đó.

### PUT /qlpo/:id
Cập nhật PO

### DELETE /qlpo/:id
Xóa PO

---

## Workflow

### 1. Tạo Định mức (QLDM)
```
POST /qldm
{
  "ma_bv": "BV001",
  "so_luong": 100,
  "don_gia": 50000
}
```

### 2. Tạo Báo giá (QLBG)
```
# Lấy danh sách Mã BV
GET /qldm/ma-bv

# Lấy đơn giá tự động
GET /qlbg/don-gia?ma_bv=BV001&so_luong=150

# Tạo báo giá
POST /qlbg
{
  "so_bg": "BG0001",
  "ma_bv": "BV001",
  "so_luong": 150,
  "don_gia": 50000
}

# Thêm Mã BV khác vào cùng Số BG
POST /qlbg
{
  "so_bg": "BG0001",
  "ma_bv": "BV002",
  "so_luong": 200,
  "don_gia": 30000
}
```

### 3. Tạo PO (QLPO)
```
# Lấy danh sách Số BG
GET /qlbg/so-bg

# Tạo PO theo Số BG
POST /qlpo
{
  "ma_po": "PO001",
  "so_bg": "BG0001"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Dữ liệu không hợp lệ"
}
```

### 401 Unauthorized
```json
{
  "message": "Token không hợp lệ"
}
```

### 404 Not Found
```json
{
  "message": "Không tìm thấy"
}
```

### 500 Internal Server Error
```json
{
  "message": "Lỗi server",
  "error": "..."
}
```
