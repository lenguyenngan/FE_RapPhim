import axios from "axios";

const API = axios.create({ 
  baseURL: "http://localhost:5000/api", // BE port 5000
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable credentials for CORS
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Response Error:', error);
    
    // Handle network errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      error.message = 'Không thể kết nối đến server. Vui lòng kiểm tra server có đang chạy trên port 5000 không.';
    }
    
    return Promise.reject(error);
  }
);

export default API;
