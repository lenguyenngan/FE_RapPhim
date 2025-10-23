import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../api";

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
      if (bookings.length === 0) loadBookings();
    }
  }, [location.state, bookings.length]);

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
        return "bg-green-500/20 border-green-500/50 text-green-300";
      case "pending":
        return "bg-yellow-500/20 border-yellow-500/50 text-yellow-300";
      case "cancelled":
        return "bg-red-500/20 border-red-500/50 text-red-300";
      default:
        return "bg-gray-500/20 border-gray-500/50 text-gray-300";
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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Đang tải...
      </div>
    );

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="animated-grid"></div>
      <div className="relative z-10 px-4 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Nút quay lại */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/")}
              className="flex items-center text-white hover:text-purple-300 transition-colors group"
            >
              <svg
                className="w-6 h-6 mr-2 group-hover:-translate-x-1 transition-transform"
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
              <span className="font-medium">Về trang chủ</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex space-x-1 bg-white/10 rounded-xl p-1">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === "profile"
                    ? "bg-purple-500 text-white"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                Thông tin cá nhân
              </button>
              <button
                onClick={() => {
                  setActiveTab("bookings");
                  if (bookings.length === 0) loadBookings();
                }}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === "bookings"
                    ? "bg-purple-500 text-white"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                Lịch sử đặt vé
              </button>
            </div>
          </div>

          {/* Tab Thông tin cá nhân */}
          {activeTab === "profile" && (
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Thông tin hồ sơ</h2>
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-full overflow-hidden border border-white/30">
                  <img
                    src={
                      profile.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        profile.fullName || "U"
                      )}&background=8B5CF6&color=fff`
                    }
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-2xl font-semibold">
                    {profile.fullName}
                  </div>
                  <div className="text-gray-300">{profile.email}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-sm text-gray-400">Số điện thoại</p>
                  <p className="font-medium">
                    {profile.phone || "Chưa cập nhật"}
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-sm text-gray-400">Quyền</p>
                  <p className="font-medium capitalize">{profile.role}</p>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={goToEdit}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600"
                >
                  Update
                </button>
              </div>
            </div>
          )}

          {/* Tab Lịch sử đặt vé */}
          {activeTab === "bookings" && (
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">🎟️ Lịch sử đặt vé</h2>

              {bookingsLoading ? (
                <div className="text-center py-8 text-gray-300">
                  Đang tải...
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8 text-gray-300">
                  Chưa có vé nào được đặt
                </div>
              ) : (
                <div className="space-y-5">
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
                        className="bg-white/5 border border-white/10 rounded-xl p-5 transform transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:bg-white/10 hover:shadow-lg hover:shadow-purple-500/20"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={b.moviePoster || "/no-poster.jpg"}
                              alt={b.movieTitle}
                              className="w-12 h-16 object-cover rounded"
                            />
                            <div>
                              <h3 className="font-semibold text-white text-lg">
                                {b.movieTitle || "Không rõ tên phim"}
                              </h3>
                              <p className="text-sm text-gray-400">
                                {b.date || b.showtimeInfo?.date} •{" "}
                                {b.startTime || b.showtimeInfo?.startTime}
                              </p>
                              <p className="text-sm text-gray-400">
                                {b.systemName || b.cinemaInfo?.systemName} •{" "}
                                {b.clusterName || b.cinemaInfo?.clusterName}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-yellow-400">
                              {(b.totalPrice || b.total || 0).toLocaleString(
                                "vi-VN"
                              )}
                              ₫
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                                b.status
                              )}`}
                            >
                              {getStatusText(b.status)}
                            </span>
                          </div>
                        </div>

                        {/* Chi tiết vé */}
                        <div className="mt-2 text-sm text-gray-300 space-y-1">
                          {b.bookingCode && (
                            <p>
                              <span className="text-gray-400">Mã vé:</span>{" "}
                              <span className="font-semibold text-purple-300">
                                {b.bookingCode}
                              </span>
                            </p>
                          )}

                          <p>
                            <span className="text-gray-400">
                              Hình thức thanh toán:
                            </span>{" "}
                            <span className="font-medium text-white">
                              {b.paymentMethod?.toUpperCase() || "Không rõ"}
                            </span>
                          </p>

                          <p>
                            <span className="text-gray-400">Ghế:</span>{" "}
                            {seatsArr.map((s, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-purple-500/30 border border-purple-400 rounded text-xs text-white mr-1"
                              >
                                {typeof s === "object"
                                  ? `${s.seatNumber} (${s.type || "Regular"})`
                                  : s}
                              </span>
                            ))}
                          </p>

                          {/* ✅ Combo đầy đủ */}
                          <div>
                            <span className="text-gray-400">Combo:</span>
                            {Array.isArray(b.combos) && b.combos.length > 0 ? (
                              <div className="mt-1 flex flex-wrap gap-2">
                                {b.combos.map((combo, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-pink-500/20 border border-pink-400/40 rounded text-xs text-pink-200"
                                  >
                                    {combo.name} × {combo.quantity || 1}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400 ml-1 text-sm">
                                Không có combo
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* ⚠️ Lưu ý */}
                  <div className="mt-6 bg-yellow-500/10 border border-yellow-400/40 rounded-xl p-4 text-yellow-300 text-sm leading-relaxed">
                    <h4 className="font-semibold mb-2">⚠️ Lưu ý quan trọng:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Vui lòng đến rạp trước giờ chiếu 15 phút.</li>
                      <li>Mang theo mã QR hoặc vé điện tử để quét tại cổng.</li>
                      <li>Vé không thể hoàn trả sau khi thanh toán.</li>
                      <li>
                        Liên hệ hotline nếu có vấn đề:{" "}
                        <span className="font-semibold text-white">
                          1900-xxxx
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-6 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-200">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
