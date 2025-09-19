import axios from "axios";

// Base URL trùng với backend
const API = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor: tự động gửi token nếu có
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(
      "📤 API Request:",
      config.method?.toUpperCase(),
      config.url,
      config.data
    );
    return config;
  },
  (error) => {
    console.error("🚨 Request Error:", error);
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    console.log("📥 API Response:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error(
      "🚨 Response Error:",
      error.response?.status,
      error.response?.data || error.message
    );
    if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
      error.message =
        "Không thể kết nối đến server. Hãy chắc chắn backend đang chạy trên port 5000";
    }
    return Promise.reject(error);
  }
);

export default API;
