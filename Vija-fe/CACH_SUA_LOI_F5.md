# Cách sửa lỗi "Redirecting..." khi F5/Reload

## Vấn đề
Khi đang ở các trang `/qlkh`, `/qlnb`, `/qldm`, `/qlpo`, `/qluser` mà nhấn F5 hoặc Reload, trang bị lỗi "Redirecting..." liên tục.

## Nguyên nhân
Đây là vấn đề phổ biến với SPA (Single Page Application). Khi F5, browser request trực tiếp đến server với URL như `/qlkh`, nhưng server không có file `/qlkh/index.html`, nên không biết phải trả về gì.

## Giải pháp

### ✅ ĐÃ SỬA trong code:

1. **Đã thêm SPA fallback middleware** trong `vite.config.ts`
2. **Đã cải thiện router logic** trong `src/router/index.ts`
3. **Đã tạo các file config** cho deployment (.htaccess, vercel.json, netlify.toml)

### 🔴 BẠN CẦN LÀM:

#### Bước 1: RESTART DEV SERVER (QUAN TRỌNG!)

```bash
# Dừng dev server hiện tại
# Nhấn Ctrl+C trong terminal đang chạy npm run dev

# Chạy lại dev server
npm run dev
```

**LƯU Ý**: Vite dev server chỉ load config khi khởi động. Nếu không restart, middleware mới sẽ không hoạt động!

#### Bước 2: Xóa cache browser

**Cách 1: Hard Reload (Khuyến nghị)**
1. Mở DevTools (F12)
2. Click chuột phải vào nút Reload
3. Chọn "Empty Cache and Hard Reload"

**Cách 2: Xóa cache thủ công**
1. Nhấn `Ctrl + Shift + Delete`
2. Chọn "Cached images and files"
3. Chọn "All time"
4. Click "Clear data"

#### Bước 3: Test lại

1. Mở browser (hoặc tab Incognito: `Ctrl + Shift + N`)
2. Truy cập `http://localhost:5173` (hoặc port của bạn)
3. Đăng nhập
4. Click vào QLKH
5. Nhấn F5 → Không còn lỗi!

### Nếu vẫn còn lỗi:

#### A. Kiểm tra dev server đã restart chưa

Trong terminal, bạn phải thấy:
```
VITE v6.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

Nếu không thấy, có nghĩa là dev server chưa chạy. Chạy lại `npm run dev`.

#### B. Kiểm tra port

Đảm bảo bạn đang truy cập đúng port. Mặc định là `5173`, nhưng có thể khác nếu port đó đang bị chiếm.

#### C. Thử Incognito mode

Mở browser ở chế độ Incognito/Private để đảm bảo không có cache:
- Chrome: `Ctrl + Shift + N`
- Edge: `Ctrl + Shift + P`
- Firefox: `Ctrl + Shift + P`

#### D. Kiểm tra localStorage

Mở DevTools (F12) > Console, gõ:
```javascript
localStorage.getItem('isAuthenticated')
```

Phải trả về `"true"`. Nếu không, đăng nhập lại.

#### E. Xóa node_modules và reinstall (Phương án cuối cùng)

```bash
# Dừng dev server (Ctrl+C)

# Xóa node_modules
rmdir /s /q node_modules

# Xóa package-lock.json
del package-lock.json

# Cài lại
npm install

# Chạy lại
npm run dev
```

### Test Production Build

Nếu muốn test production build:

```bash
# Build
npm run build

# Preview
npm run preview
```

Sau đó truy cập URL preview (thường là `http://localhost:4173`) và test F5.

### Giải thích kỹ thuật

**Middleware đã thêm trong vite.config.ts:**
```javascript
{
  name: 'spa-fallback',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      // Nếu request không phải file tĩnh và không phải API
      if (
        req.url &&
        !req.url.includes('.') &&
        !req.url.startsWith('/api') &&
        !req.url.startsWith('/@')
      ) {
        req.url = '/index.html'  // Trả về index.html
      }
      next()
    })
  },
}
```

Middleware này bắt tất cả các request không phải file tĩnh (như .js, .css, .png) và trả về `index.html`. Vue Router sau đó sẽ xử lý routing phía client.

### Checklist

- [ ] Đã restart dev server (`Ctrl+C` rồi `npm run dev`)
- [ ] Đã xóa cache browser (Hard Reload)
- [ ] Đã test ở Incognito mode
- [ ] Đã kiểm tra localStorage có `isAuthenticated = "true"`
- [ ] Đã đăng nhập lại nếu cần

Nếu làm đủ 5 bước trên mà vẫn lỗi, hãy:
1. Restart máy tính
2. Xóa node_modules và reinstall
3. Chạy lại `npm run dev`
