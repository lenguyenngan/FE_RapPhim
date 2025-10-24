import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../api";
import { QRCodeCanvas } from "qrcode.react";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    avatar: "",
  });

  const [activeTab, setActiveTab] = useState("profile");
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // 🟣 Lấy thông tin user
  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      try {
        const parsed = JSON.parse(localUser);
        setProfile(parsed);
        setLoading(false);
      } catch (_) {}
    }

    (async () => {
      try {
        const res = await API.get("/users/me");
        setProfile(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } catch (e) {
        if (!localUser) setLoading(false);
        setError(e.response?.data?.message || "Không tải được hồ sơ");
      } finally {
        if (!localUser) setLoading(false);
      }
    })();
  }, []);

  // 🟣 Mở tab bookings nếu navigate với state
  useEffect(() => {
    if (location.state?.tab === "bookings") {
      setActiveTab("bookings");
      loadBookings();
    }
  }, [location.state]);

  const goToEdit = () => navigate("/profile/edit");

  // 🟢 Load lịch sử đặt vé
  const loadBookings = async () => {
    try {
      setBookingsLoading(true);
      const res = await API.get("/bookings/user");
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.bookings || res.data.data || [];
      setBookings(data);
    } catch (err) {
      console.error(err);
      setError("Không thể tải lịch sử đặt vé.");
    } finally {
      setBookingsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-500/20 border-emerald-500/50 text-emerald-300";
      case "pending":
        return "bg-amber-500/20 border-amber-500/50 text-amber-300";
      case "cancelled":
        return "bg-rose-500/20 border-rose-500/50 text-rose-300";
      default:
        return "bg-slate-500/20 border-slate-500/50 text-slate-300";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Chờ xử lý";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return "✓";
      case "pending":
        return "⏳";
      case "cancelled":
        return "✕";
      default:
        return "?";
    }
  };

  const openQRModal = (booking) => {
    setSelectedBooking(booking);
    setShowQRModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-white text-lg">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          {/* 🔙 Header với nút quay lại */}
          <div className="mb-8 flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="group flex items-center gap-2 text-white/80 hover:text-white transition-all duration-300"
            >
              <div className="p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 group-hover:bg-white/10 group-hover:border-purple-400/50 transition-all">
                <svg
                  className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </div>
              <span className="font-medium">Trang chủ</span>
            </button>

            <div className="text-white/60 text-sm hidden md:block">
              Xin chào,{" "}
              <span className="text-purple-300 font-semibold">
                {profile.fullName}
              </span>
            </div>
          </div>

          {/* 🔖 Tabs Navigation */}
          <div className="mb-8">
            <div className="relative flex gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 shadow-2xl">
              <button
                onClick={() => setActiveTab("profile")}
                className={`relative flex-1 px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === "profile"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Thông tin cá nhân
                </span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("bookings");
                  if (bookings.length === 0) loadBookings();
                }}
                className={`relative flex-1 px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === "bookings"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                    />
                  </svg>
                  Lịch sử đặt vé
                </span>
              </button>
            </div>
          </div>

          {/* 🧍 Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  {/* Avatar Section */}
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-300"></div>
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-xl">
                      <img
                        src={
                          profile.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            profile.fullName || "U"
                          )}&background=8B5CF6&color=fff&size=256`
                        }
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {profile.fullName}
                    </h2>
                    <p className="text-gray-300 mb-4 flex items-center justify-center md:justify-start gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      {profile.email}
                    </p>
                    <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/50 rounded-full">
                      <span className="text-purple-300 font-semibold capitalize text-sm">
                        🎭 {profile.role}
                      </span>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <button
                    onClick={goToEdit}
                    className="group relative px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/75 transition-all duration-300 hover:scale-105"
                  >
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Chỉnh sửa
                    </span>
                  </button>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  <div className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/50 rounded-2xl p-6 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <svg
                          className="w-5 h-5 text-purple-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-400 font-medium">
                        Số điện thoại
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-white ml-14">
                      {profile.phone || "Chưa cập nhật"}
                    </p>
                  </div>

                  <div className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/50 rounded-2xl p-6 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-pink-500/20 rounded-lg">
                        <svg
                          className="w-5 h-5 text-pink-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-400 font-medium">
                        Vai trò
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-white capitalize ml-14">
                      {profile.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-200 text-sm mb-1">
                        Tổng vé đã đặt
                      </p>
                      <p className="text-3xl font-bold text-white">
                        {bookings.length}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-500/30 rounded-xl">
                      <svg
                        className="w-8 h-8 text-purple-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-xl border border-pink-400/30 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-pink-200 text-sm mb-1">
                        Vé đã xác nhận
                      </p>
                      <p className="text-3xl font-bold text-white">
                        {
                          bookings.filter((b) => b.status === "confirmed")
                            .length
                        }
                      </p>
                    </div>
                    <div className="p-3 bg-pink-500/30 rounded-xl">
                      <svg
                        className="w-8 h-8 text-pink-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 backdrop-blur-xl border border-indigo-400/30 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-indigo-200 text-sm mb-1">
                        Thành viên từ
                      </p>
                      <p className="text-xl font-bold text-white">2024</p>
                    </div>
                    <div className="p-3 bg-indigo-500/30 rounded-xl">
                      <svg
                        className="w-8 h-8 text-indigo-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 🎟️ Bookings Tab */}
          {activeTab === "bookings" && (
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="p-2 bg-purple-500/20 rounded-xl">🎟️</span>
                  Lịch sử đặt vé
                </h2>
                {bookings.length > 0 && (
                  <div className="text-sm text-gray-300">
                    Tổng:{" "}
                    <span className="font-semibold text-purple-300">
                      {bookings.length}
                    </span>{" "}
                    vé
                  </div>
                )}
              </div>

              {bookingsLoading ? (
                <div className="text-center py-16">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                  <p className="text-gray-300">Đang tải lịch sử đặt vé...</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-16">
                  <div className="inline-block p-6 bg-white/5 rounded-full mb-4">
                    <svg
                      className="w-16 h-16 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-300 text-lg mb-2">
                    Chưa có vé nào được đặt
                  </p>
                  <p className="text-gray-400 text-sm">
                    Hãy đặt vé để trải nghiệm những bộ phim tuyệt vời!
                  </p>
                  <button
                    onClick={() => navigate("/")}
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Đặt vé ngay
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {bookings.map((b) => {
                    const seatsArr = Array.isArray(b.seats)
                      ? b.seats
                      : typeof b.seats === "string"
                      ? b.seats.split(",")
                      : b.seats
                      ? Object.values(b.seats)
                      : [];

                    return (
                      <div
                        key={b._id}
                        className="group relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 hover:border-purple-400/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20"
                      >
                        <div className="p-6">
                          {/* Header */}
                          <div className="flex flex-col md:flex-row gap-6 mb-6">
                            {/* Movie Poster */}
                            <div className="relative flex-shrink-0">
                              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                              <img
                                src={b.moviePoster || "/no-poster.jpg"}
                                alt={b.movieTitle}
                                className="relative w-24 h-32 object-cover rounded-xl shadow-lg"
                              />
                            </div>

                            {/* Movie Info */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                                    {b.movieTitle || "Không rõ tên phim"}
                                  </h3>
                                  <div className="space-y-1 text-sm text-gray-300">
                                    <p className="flex items-center gap-2">
                                      <svg
                                        className="w-4 h-4"
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
                                      {b.date || b.showtimeInfo?.date}
                                    </p>
                                    <p className="flex items-center gap-2">
                                      <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                      </svg>
                                      {b.startTime || b.showtimeInfo?.startTime}
                                    </p>
                                    <p className="flex items-center gap-2">
                                      <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                      </svg>
                                      {b.systemName || b.cinemaInfo?.systemName}{" "}
                                      •{" "}
                                      {b.clusterName ||
                                        b.cinemaInfo?.clusterName}
                                    </p>
                                  </div>
                                </div>

                                {/* Status & Price */}
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-2">
                                    {(
                                      b.totalPrice ||
                                      b.total ||
                                      0
                                    ).toLocaleString("vi-VN")}
                                    ₫
                                  </div>
                                  <span
                                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(
                                      b.status
                                    )}`}
                                  >
                                    <span>{getStatusIcon(b.status)}</span>
                                    {getStatusText(b.status)}
                                  </span>
                                </div>
                              </div>

                              {/* Booking Code */}
                              {b.bookingCode && (
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-400/50 rounded-xl mb-4">
                                  <svg
                                    className="w-4 h-4 text-purple-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                                    />
                                  </svg>
                                  <span className="text-xs text-gray-400">
                                    Mã vé:
                                  </span>
                                  <span className="font-mono font-bold text-purple-300">
                                    {b.bookingCode}
                                  </span>
                                </div>
                              )}

                              {/* Payment Method */}
                              <div className="mb-4">
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm">
                                  <svg
                                    className="w-4 h-4 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                    />
                                  </svg>
                                  <span className="text-gray-400">
                                    Thanh toán:
                                  </span>
                                  <span className="font-semibold text-white uppercase">
                                    {b.paymentMethod || "Không rõ"}
                                  </span>
                                </span>
                              </div>

                              {/* Seats */}
                              <div className="mb-4">
                                <p className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                  Ghế đã chọn:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {seatsArr.map((s, i) => (
                                    <span
                                      key={i}
                                      className="px-3 py-1.5 bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/50 rounded-lg text-sm text-white font-semibold shadow-lg"
                                    >
                                      {typeof s === "object"
                                        ? `${s.seatNumber} (${
                                            s.type || "Regular"
                                          })`
                                        : s}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Combos */}
                              <div>
                                <p className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    />
                                  </svg>
                                  Combo:
                                </p>
                                {Array.isArray(b.combos) &&
                                b.combos.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {b.combos.map((combo, idx) => (
                                      <span
                                        key={idx}
                                        className="px-3 py-1.5 bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-400/40 rounded-lg text-sm text-pink-200 font-medium"
                                      >
                                        🍿 {combo.name} × {combo.quantity || 1}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-gray-500 text-sm italic">
                                    Không có combo
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* QR Code Section */}
                          {b.bookingCode && (
                            <div className="mt-6 pt-6 border-t border-white/10">
                              <button
                                onClick={() => openQRModal(b)}
                                className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                                  />
                                </svg>
                                Xem mã QR
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Decorative Corner */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full"></div>
                      </div>
                    );
                  })}

                  {/* Important Notes */}
                  <div className="mt-8 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/40 rounded-2xl p-6 backdrop-blur-xl">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 p-3 bg-yellow-500/20 rounded-xl">
                        <svg
                          className="w-6 h-6 text-yellow-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-yellow-300 mb-3 flex items-center gap-2">
                          ⚠️ Lưu ý quan trọng
                        </h4>
                        <ul className="space-y-2 text-yellow-200 text-sm leading-relaxed">
                          <li className="flex items-start gap-2">
                            <span className="text-yellow-400 mt-1">•</span>
                            <span>
                              Vui lòng đến rạp trước giờ chiếu{" "}
                              <strong className="text-white">15 phút</strong> để
                              làm thủ tục.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-yellow-400 mt-1">•</span>
                            <span>
                              Mang theo{" "}
                              <strong className="text-white">mã QR</strong> hoặc
                              vé điện tử để quét tại cổng vào.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-yellow-400 mt-1">•</span>
                            <span>
                              Vé{" "}
                              <strong className="text-white">
                                không thể hoàn trả
                              </strong>{" "}
                              sau khi thanh toán thành công.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-yellow-400 mt-1">•</span>
                            <span>
                              Liên hệ hotline{" "}
                              <strong className="text-white">1900-xxxx</strong>{" "}
                              nếu cần hỗ trợ.
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-500/20 backdrop-blur-xl border border-red-500/40 rounded-2xl p-4 flex items-start gap-3 shadow-lg">
              <svg
                className="w-6 h-6 text-red-300 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-200 flex-1">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowQRModal(false)}
        >
          <div
            className="relative bg-gradient-to-br from-slate-900 to-purple-900 border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal Content */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">
                Mã QR của bạn
              </h3>
              <p className="text-gray-300 mb-6">{selectedBooking.movieTitle}</p>

              {/* QR Code */}
              <div className="bg-white p-6 rounded-2xl inline-block mb-6 shadow-xl">
                <QRCodeCanvas
                  value={selectedBooking.bookingCode}
                  size={240}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="H"
                />
              </div>

              {/* Booking Code */}
              <div className="bg-white/10 border border-white/20 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-400 mb-1">Mã đặt vé</p>
                <p className="text-xl font-mono font-bold text-purple-300">
                  {selectedBooking.bookingCode}
                </p>
              </div>

              {/* Info */}
              <div className="text-left space-y-2 text-sm text-gray-300 mb-6">
                <p className="flex justify-between">
                  <span>Ngày chiếu:</span>
                  <span className="font-semibold text-white">
                    {selectedBooking.date || selectedBooking.showtimeInfo?.date}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span>Giờ chiếu:</span>
                  <span className="font-semibold text-white">
                    {selectedBooking.startTime ||
                      selectedBooking.showtimeInfo?.startTime}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span>Rạp:</span>
                  <span className="font-semibold text-white">
                    {selectedBooking.systemName ||
                      selectedBooking.cinemaInfo?.systemName}
                  </span>
                </p>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed">
                Vui lòng xuất trình mã QR này tại quầy để nhận vé. Mã QR chỉ có
                hiệu lực cho suất chiếu đã đặt.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Inline Styles for Animations */}
      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }

        .animate-blob {
          animation: blob 20s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Profile;
