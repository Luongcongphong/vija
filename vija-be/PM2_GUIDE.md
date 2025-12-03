# Hướng dẫn sử dụng PM2

## Cài đặt PM2

```bash
npm install -g pm2
```

## Các lệnh PM2

### 1. Build và Start ứng dụng

```bash
# Build TypeScript
npm run build

# Start với PM2 (production)
npm run pm2:start

# Hoặc start development mode
npm run pm2:dev
```

### 2. Quản lý ứng dụng

```bash
# Dừng ứng dụng
npm run pm2:stop

# Restart ứng dụng
npm run pm2:restart

# Xóa ứng dụng khỏi PM2
npm run pm2:delete

# Xem logs
npm run pm2:logs

# Monitor ứng dụng
npm run pm2:monit
```

### 3. Các lệnh PM2 khác

```bash
# Xem danh sách ứng dụng đang chạy
pm2 list

# Xem thông tin chi tiết
pm2 show vija-backend

# Xem logs realtime
pm2 logs vija-backend --lines 100

# Flush logs
pm2 flush

# Reload ứng dụng (zero-downtime)
pm2 reload vija-backend

# Save PM2 process list
pm2 save

# Startup script (chạy PM2 khi khởi động hệ thống)
pm2 startup
```

## Cấu trúc file ecosystem.config.js

File `ecosystem.config.js` chứa cấu hình PM2:

- **name**: Tên ứng dụng
- **script**: File entry point
- **instances**: Số instance (1 hoặc 'max' cho cluster mode)
- **exec_mode**: 'cluster' hoặc 'fork'
- **autorestart**: Tự động restart khi crash
- **max_memory_restart**: Restart khi vượt quá memory
- **env**: Biến môi trường cho production
- **env_development**: Biến môi trường cho development

## Logs

Logs được lưu trong thư mục `logs/`:
- `err.log`: Error logs
- `out.log`: Output logs
- `combined.log`: Combined logs

## Tips

1. **Sau khi update code:**
   ```bash
   npm run build
   npm run pm2:restart
   ```

2. **Xem logs realtime:**
   ```bash
   npm run pm2:logs
   ```

3. **Monitor CPU và Memory:**
   ```bash
   npm run pm2:monit
   ```

4. **Chạy PM2 khi khởi động hệ thống:**
   ```bash
   pm2 startup
   pm2 save
   ```
