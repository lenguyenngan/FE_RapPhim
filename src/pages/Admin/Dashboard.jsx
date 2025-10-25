import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMovies: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra authentication và quyền admin
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const role = localStorage.getItem("role");

    if (!token || !userData) {
      navigate("/login");
      return;
    }

    // Kiểm tra quyền admin
    if (role !== "admin" && role !== "superadmin") {
      navigate("/");
      return;
    }

    // Parse user data
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.clear();
      navigate("/login");
    }

    // Load realtime stats from API
    const loadStats = async () => {
      try {
        console.log("🔍 Starting to load stats...");

        const [usersRes, moviesRes, bookingsRes] = await Promise.all([
          API.get("/users"),
          API.get("/movies"),
          API.get("/bookings"), // ✅ API này đã có ở backend
        ]);

        console.log("📊 Users response:", usersRes.data);
        console.log("🎬 Movies response:", moviesRes.data);
        console.log("🎫 Bookings response:", bookingsRes.data);

        const totalUsers = (usersRes.data?.users || []).length;
        const totalMovies = (moviesRes.data?.movies || []).length;
        const allBookings = bookingsRes.data?.bookings || [];

        console.log("📈 Total Users:", totalUsers);
        console.log("📈 Total Movies:", totalMovies);
        console.log("📈 All Bookings:", allBookings);

        // Tính tổng số vé
        const totalBookings = allBookings.length;

        // Tính tổng doanh thu (chỉ từ các vé đã được xác nhận)
        const totalRevenue = allBookings
          .filter((booking) => booking.status === "confirmed")
          .reduce((sum, booking) => sum + (booking.total || 0), 0);

        console.log("💰 Total Revenue:", totalRevenue);

        const newStats = {
          totalUsers,
          totalMovies,
          totalBookings,
          totalRevenue,
        };

        console.log("✅ Final stats:", newStats);
        setStats(newStats);
      } catch (e) {
        console.error("❌ Load stats failed:", e);
        console.error("Error details:", e.response?.data || e.message);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleGoToHome = () => {
    navigate("/");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="meteors-container">
        <div
          className="meteor"
          style={{ left: "10%", animationDelay: "0s", animationDuration: "3s" }}
        ></div>
        <div
          className="meteor"
          style={{ left: "20%", animationDelay: "1s", animationDuration: "4s" }}
        ></div>
        <div
          className="meteor"
          style={{
            left: "30%",
            animationDelay: "2s",
            animationDuration: "3.5s",
          }}
        ></div>
        <div
          className="meteor"
          style={{
            left: "40%",
            animationDelay: "0.5s",
            animationDuration: "4.5s",
          }}
        ></div>
        <div
          className="meteor"
          style={{
            left: "50%",
            animationDelay: "1.5s",
            animationDuration: "3.2s",
          }}
        ></div>
        <div
          className="meteor"
          style={{
            left: "60%",
            animationDelay: "2.5s",
            animationDuration: "4.2s",
          }}
        ></div>
        <div
          className="meteor"
          style={{
            left: "70%",
            animationDelay: "0.8s",
            animationDuration: "3.8s",
          }}
        ></div>
        <div
          className="meteor"
          style={{
            left: "80%",
            animationDelay: "1.8s",
            animationDuration: "4.1s",
          }}
        ></div>
        <div
          className="meteor"
          style={{
            left: "90%",
            animationDelay: "2.8s",
            animationDuration: "3.6s",
          }}
        ></div>
      </div>

      {/* Animated Grid Background */}
      <div className="animated-grid"></div>

      {/* Floating Orbs */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full animate-float"></div>
      <div
        className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full animate-float"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-32 left-1/3 w-28 h-28 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full animate-float"
        style={{ animationDelay: "2s" }}
      ></div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen px-4 py-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="text-white">
              <h1 className="text-4xl font-bold animate-gradient-x bg-gradient-to-r from-red-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                ADMIN DASHBOARD
              </h1>
              <p className="text-gray-300 mt-2">
                Bảng điều khiển quản trị hệ thống rạp phim
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-white text-right">
                <p className="text-sm text-gray-400">Admin,</p>
                <p className="font-semibold">{user?.fullName}</p>
              </div>

              <button
                onClick={handleGoToHome}
                className="px-6 py-2 bg-blue-500/20 border border-blue-500/50 rounded-xl text-blue-300 hover:bg-blue-500/30 transition-all duration-300 hover:scale-105"
              >
                Về Home
              </button>

              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 hover:bg-red-500/30 transition-all duration-300 hover:scale-105"
              >
                Đăng xuất
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Users */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 blur-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Tổng người dùng</p>
                  <p className="text-3xl font-bold text-white">
                    {stats.totalUsers.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-green-400 text-sm">+12%</span>
                <span className="text-gray-400 text-sm ml-2">
                  so với tháng trước
                </span>
              </div>
            </div>

            {/* Total Movies */}
            <div
              className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 blur-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Tổng phim</p>
                  <p className="text-3xl font-bold text-white">
                    {stats.totalMovies}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-green-400 text-sm">+3</span>
                <span className="text-gray-400 text-sm ml-2">
                  phim mới tuần này
                </span>
              </div>
            </div>

            {/* Total Bookings */}
            <div
              className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 blur-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Tổng đặt vé</p>
                  <p className="text-3xl font-bold text-white">
                    {stats.totalBookings.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-green-400 text-sm">+8%</span>
                <span className="text-gray-400 text-sm ml-2">
                  so với tháng trước
                </span>
              </div>
            </div>

            {/* Total Revenue */}
            <div
              className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 blur-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Tổng doanh thu</p>
                  <p className="text-3xl font-bold text-white">
                    {formatCurrency(stats.totalRevenue)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-green-400 text-sm">
                  Từ vé đã xác nhận
                </span>
              </div>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* User Management */}
            <div
              onClick={() => navigate("/admin/users")}
              className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Quản lý người dùng
                </h3>
              </div>
              <p className="text-gray-300 mb-4">
                Xem và quản lý tài khoản người dùng
              </p>
              <button
                onClick={() => navigate("/admin/users")}
                className="w-full px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-xl text-purple-300 hover:bg-purple-500/30 transition-all duration-300"
              >
                Quản lý
              </button>
            </div>

            {/* Movie Management */}
            <div
              onClick={() => navigate("/admin/movies")}
              className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Quản lý phim</h3>
              </div>
              <p className="text-gray-300 mb-4">Thêm, sửa, xóa phim</p>
              <button className="w-full px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-xl text-blue-300 hover:bg-blue-500/30 transition-all duration-300">
                Quản lý
              </button>
            </div>

            {/* Booking Management */}
            <div
              onClick={() => navigate("/admin/bookings")}
              className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Quản lý đặt vé</h3>
              </div>
              <p className="text-gray-300 mb-4">Xem và quản lý đơn đặt vé</p>
              <button
                onClick={() => navigate("/admin/bookings")}
                className="w-full px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-xl text-green-300 hover:bg-green-500/30 transition-all duration-300"
              >
                Quản lý
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
