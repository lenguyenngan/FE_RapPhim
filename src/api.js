import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // BE chạy port 5000
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Resolve asset URLs that come from backend (e.g., "/uploads/...")
export const resolveAssetUrl = (path) => {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/uploads/")) {
    const apiBase = API.defaults.baseURL || "";
    const origin = apiBase.replace(/\/$/, "").replace(/\/api$/, "");
    return `${origin}${path}`;
  }
  return path;
};

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(
      "API Request:",
      config.method?.toUpperCase(),
      config.url,
      config.data
    );
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error("Response Error:", error);
    if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
      error.message =
        "Không thể kết nối đến server. Vui lòng kiểm tra server có đang chạy trên port 5000 không.";
    }
    return Promise.reject(error);
  }
);

export default API;
