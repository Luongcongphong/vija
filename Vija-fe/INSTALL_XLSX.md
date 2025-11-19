# Cài đặt thư viện xlsx cho Export Excel

## Bước 1: Cài đặt

```bash
cd Vija-fe
npm install xlsx
```

## Bước 2: Kiểm tra

```bash
npm list xlsx
```

Kết quả mong đợi:
```
tailadmin-vue-pro-2.0.1@2.0.1
└── xlsx@0.18.5
```

## Bước 3: Restart dev server

```bash
# Stop server (Ctrl+C)
npm run dev
```

## Sử dụng

Sau khi cài đặt, tính năng Export Excel trong Dashboard sẽ hoạt động:

1. Vào Dashboard
2. Click nút "Export Excel"
3. File sẽ tự động tải về với tên: `Dashboard_YYYY-MM-DD.xlsx`

## Lỗi thường gặp

### Lỗi: Cannot find module 'xlsx'

**Giải pháp:**
```bash
npm install xlsx
npm run dev
```

### Lỗi: Module not found

**Giải pháp:**
```bash
rm -rf node_modules
npm install
npm run dev
```

## Tính năng Export

- ✅ Export tất cả dữ liệu Dashboard
- ✅ Định dạng cột tự động
- ✅ Tên file có timestamp
- ✅ Hỗ trợ tiếng Việt
- ✅ Định dạng số tiền
