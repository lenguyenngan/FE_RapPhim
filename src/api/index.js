// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000/api", // hoặc URL backend của bạn
//   headers: {
//     "Content-Type": "application/json",
//   },
//   timeout: 10000,
// });

// // Thêm interceptor nếu cần (cho token, etc.)
// API.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default API; // ✅ QUAN TRỌNG: phải export default
