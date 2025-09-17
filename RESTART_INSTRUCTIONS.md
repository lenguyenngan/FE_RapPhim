# Hướng dẫn Restart Client để áp dụng Proxy

## Đã cấu hình xong:

### ✅ 1. Package.json đã có proxy:
```json
{
  "name": "client",
  "version": "0.1.0",
  "private": true,
  "proxy": "http://localhost:5000",
  "dependencies": {
    // ... existing dependencies
  }
}
```

### ✅ 2. API config đã sử dụng proxy:
```javascript
const API = axios.create({ 
  baseURL: "/api", // Thay vì "http://localhost:5000/api"
  // ... other config
});
```

## Bước tiếp theo:

### 🔄 Restart Client:
```bash
# Dừng client hiện tại (Ctrl + C)
# Sau đó chạy lại:
cd client
npm start
```

### 🧪 Test kết nối:
1. Mở `http://localhost:3000/login`
2. Click **"Test Connection"** (nút xanh lá)
3. Nếu thấy ✅ SUCCESS → CORS đã được giải quyết!

### 🎯 Test đăng ký:
1. Click **"Test Register"** (nút xanh dương)
2. Nếu thấy ✅ REGISTER SUCCESS → API hoạt động hoàn hảo!

## Cách hoạt động:

- **Trước:** `localhost:3000` → `localhost:5000` (CORS error)
- **Sau:** `localhost:3000` → `/api/` → proxy → `localhost:5000/api/` (No CORS)

## Nếu vẫn lỗi:

1. **Kiểm tra server có chạy:**
   ```bash
   curl http://localhost:5000/api/
   ```

2. **Kiểm tra proxy trong package.json:**
   ```bash
   cat package.json | grep proxy
   ```

3. **Clear cache browser:**
   - Ctrl + Shift + R
   - Hoặc mở Incognito mode

4. **Restart cả server và client:**
   ```bash
   # Terminal 1 (Server)
   cd server
   npm start
   
   # Terminal 2 (Client)
   cd client
   npm start
   ```

## Kết quả mong đợi:

- ✅ Test Connection: SUCCESS
- ✅ Test Register: SUCCESS  
- ✅ Login form: Hoạt động bình thường
- ✅ Register form: Hoạt động bình thường
- ✅ Dữ liệu lưu vào MongoDB thành công

