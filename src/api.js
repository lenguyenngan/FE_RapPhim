import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // BE chạy port 5000
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

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

// Helper function to resolve asset URLs
export const resolveAssetUrl = (path) => {
  if (!path) return "";

  // If it's already a full URL, return as is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // If it's a relative path, make it absolute from the backend
  if (path.startsWith("/")) {
    return `http://localhost:5000${path}`;
  }

  // If it's a relative path without leading slash, add it
  return `http://localhost:5000/${path}`;
};

export default API;
