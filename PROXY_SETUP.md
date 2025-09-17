# Cấu hình Proxy để giải quyết lỗi CORS

## Vấn đề
- Server chạy trên port 5000 ✅
- Client chạy trên port 3000 ✅  
- CORS chặn kết nối giữa FE và BE ❌

## Giải pháp: Sử dụng Proxy

### Bước 1: Cấu hình Proxy trong package.json

Mở file `client/package.json` và thêm dòng `"proxy"`:

```json
{
  "name": "client",
  "version": "0.1.0",
  "private": true,
  "proxy": "http://localhost:5000",
  "dependencies": {
    // ... các dependencies khác
  }
}
```

### Bước 2: Cập nhật API config

Thay vì sử dụng:
```javascript
const API = axios.create({ 
  baseURL: "http://localhost:5000/api"
});
```

Sử dụng:
```javascript
const API = axios.create({ 
  baseURL: "/api"  // Relative path, proxy sẽ handle
});
```

### Bước 3: Restart Client

```bash
cd client
npm start
```

### Bước 4: Test

1. Mở `http://localhost:3000/login`
2. Click "Test Proxy API"
3. Nếu thành công → CORS đã được giải quyết!

## Cách hoạt động

- Client gửi request đến `/api/...`
- React proxy tự động chuyển hướng đến `http://localhost:5000/api/...`
- Không có CORS vì cùng origin (localhost:3000)
- Server nhận request bình thường

## Lưu ý

- Chỉ hoạt động trong development
- Production cần cấu hình CORS đúng cách
- Proxy chỉ hoạt động với relative URLs

## Troubleshooting

### Nếu proxy không hoạt động:
1. Kiểm tra `package.json` có dòng `"proxy": "http://localhost:5000"`
2. Restart client: `npm start`
3. Kiểm tra server có chạy trên port 5000
4. Xem console có lỗi gì không

### Nếu vẫn lỗi:
1. Thử clear cache: `Ctrl + Shift + R`
2. Thử mở Incognito mode
3. Kiểm tra firewall có chặn không

