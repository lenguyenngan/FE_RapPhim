import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api";

const BookingsList = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/bookings", {
        params: { status: filter === "all" ? undefined : filter },
      });
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error("Error loading bookings:", err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

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

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const handleViewDetail = (booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const calculateTotalRevenue = () =>
    bookings
      .filter((b) => b.status === "confirmed")
      .reduce((sum, b) => sum + (b.total || 0), 0);

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
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="meteor"
            style={{
              left: `${(i + 1) * 10}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + (i % 3) * 0.5}s`,
            }}
          ></div>
        ))}
      </div>
      <div className="animated-grid"></div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full animate-float"></div>
      <div
        className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full animate-float"
        style={{ animationDelay: "1s" }}
      ></div>

      {/* Main Content */}
      <div className="relative z-10 p-4 text-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              🎫 Quản lý đặt vé
            </h1>
            <p className="text-gray-400 mt-1">
              Xem và quản lý tất cả vé đã đặt
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="px-6 py-2 bg-purple-500/20 border border-purple-500/50 rounded-xl text-purple-300 hover:bg-purple-500/30 transition-all"
          >
            ← Về Dashboard
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-white">
              {bookings.length}
            </div>
            <div className="text-gray-400 text-sm">Tổng vé</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-green-400">
              {bookings.filter((b) => b.status === "confirmed").length}
            </div>
            <div className="text-gray-400 text-sm">Đã xác nhận</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-yellow-400">
              {bookings.filter((b) => b.status === "pending").length}
            </div>
            <div className="text-gray-400 text-sm">Chờ xử lý</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-red-400">
              {bookings.filter((b) => b.status === "cancelled").length}
            </div>
            <div className="text-gray-400 text-sm">Đã hủy</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-yellow-500/20">
            <div className="text-2xl font-bold text-yellow-400">
              {formatCurrency(calculateTotalRevenue())}
            </div>
            <div className="text-gray-400 text-sm">Tổng doanh thu</div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-xl transition-all ${
                filter === "all"
                  ? "bg-purple-500 text-white"
                  : "bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilter("confirmed")}
              className={`px-4 py-2 rounded-xl transition-all ${
                filter === "confirmed"
                  ? "bg-green-500 text-white"
                  : "bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20"
              }`}
            >
              Đã xác nhận
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-xl transition-all ${
                filter === "pending"
                  ? "bg-yellow-500 text-white"
                  : "bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20"
              }`}
            >
              Chờ xử lý
            </button>
            <button
              onClick={() => setFilter("cancelled")}
              className={`px-4 py-2 rounded-xl transition-all ${
                filter === "cancelled"
                  ? "bg-red-500 text-white"
                  : "bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20"
              }`}
            >
              Đã hủy
            </button>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="text-left px-6 py-4 text-white font-semibold">
                    Mã vé
                  </th>
                  <th className="text-left px-6 py-4 text-white font-semibold">
                    Người đặt
                  </th>
                  <th className="text-left px-6 py-4 text-white font-semibold">
                    Phim
                  </th>
                  <th className="text-left px-6 py-4 text-white font-semibold">
                    Rạp
                  </th>
                  <th className="text-left px-6 py-4 text-white font-semibold">
                    Ghế
                  </th>
                  <th className="text-left px-6 py-4 text-white font-semibold">
                    Tổng tiền
                  </th>
                  <th className="text-left px-6 py-4 text-white font-semibold">
                    Trạng thái
                  </th>
                  <th className="text-left px-6 py-4 text-white font-semibold">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-gray-400">
                      Không có vé nào
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="border-t border-white/10 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm bg-white/10 px-2 py-1 rounded">
                          {booking.bookingId || booking._id.slice(-8)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-white">
                            {booking.userInfo?.fullName || "N/A"}
                          </div>
                          <div className="text-sm text-gray-400">
                            {booking.userInfo?.email || ""}
                          </div>
                          <div className="text-sm text-gray-400">
                            {booking.userInfo?.phone || ""}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={booking.moviePoster}
                            alt={booking.movieTitle}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <div>
                            <div className="font-semibold text-white">
                              {booking.movieTitle}
                            </div>
                            <div className="text-sm text-gray-400">
                              {booking.startTime} - {booking.endTime}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white">{booking.systemName}</div>
                          <div className="text-sm text-gray-400">
                            {booking.clusterName}
                          </div>
                          <div className="text-sm text-gray-400">
                            Phòng {booking.hallName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {booking.seats?.slice(0, 3).map((seat, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-purple-500/30 border border-purple-400 rounded text-xs text-white"
                            >
                              {seat.seatNumber}
                            </span>
                          ))}
                          {booking.seats?.length > 3 && (
                            <span className="text-gray-400 text-xs">
                              +{booking.seats.length - 3}
                            </span>
                          )}
                        </div>

                        {/* 👇 Thêm combo ở đây */}
                        {booking.combos && booking.combos.length > 0 && (
                          <ul className="mt-2 ml-2 list-disc text-xs text-gray-300">
                            {booking.combos.map((combo, idx) => (
                              <li key={idx}>
                                {combo.name} × {combo.quantity}
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-semibold text-yellow-400">
                          {formatCurrency(booking.total)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {getStatusText(booking.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewDetail(booking)}
                          className="px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-300 hover:bg-blue-500/30 transition-all text-sm"
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl border border-white/20 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Chi tiết đặt vé
                </h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Thông tin người đặt */}
                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <h3 className="text-lg font-semibold text-purple-400 mb-3">
                    👤 Thông tin người đặt
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-400">Họ tên:</span>
                      <span className="text-white ml-2 font-semibold">
                        {selectedBooking.userInfo?.fullName || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white ml-2">
                        {selectedBooking.userInfo?.email || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Số điện thoại:</span>
                      <span className="text-white ml-2">
                        {selectedBooking.userInfo?.phone || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mã vé */}
                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">
                    🎟️ Mã vé đặt
                  </h3>
                  <div className="bg-black/30 rounded-lg p-3 font-mono text-center">
                    <span className="text-2xl font-bold text-yellow-400">
                      {selectedBooking.bookingId ||
                        selectedBooking._id.slice(-8)}
                    </span>
                  </div>
                </div>

                {/* Thông tin phim */}
                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <h3 className="text-lg font-semibold text-pink-400 mb-3">
                    🎬 Thông tin phim
                  </h3>
                  <div className="flex gap-3">
                    <img
                      src={selectedBooking.moviePoster}
                      alt={selectedBooking.movieTitle}
                      className="w-20 h-28 object-cover rounded"
                    />
                    <div className="space-y-1 text-sm">
                      <div className="text-white font-semibold">
                        {selectedBooking.movieTitle}
                      </div>
                      <div className="text-gray-400">
                        Ngày chiếu:{" "}
                        {new Date(selectedBooking.date).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                      <div className="text-gray-400">
                        Thời gian: {selectedBooking.startTime} -{" "}
                        {selectedBooking.endTime}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hệ thống rạp */}
                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <h3 className="text-lg font-semibold text-green-400 mb-3">
                    🏢 Hệ thống rạp
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-400">Hệ thống:</span>
                      <span className="text-white ml-2 font-semibold">
                        {selectedBooking.systemName}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Cụm rạp:</span>
                      <span className="text-white ml-2">
                        {selectedBooking.clusterName}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Phòng chiếu:</span>
                      <span className="text-white ml-2">
                        {selectedBooking.hallName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ghế đã chọn */}
                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-3">
                    💺 Ghế đã chọn
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedBooking.seats?.map((seat, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-500/30 border border-purple-400 rounded text-white font-semibold"
                      >
                        {seat.seatNumber}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 text-sm text-gray-400">
                    Tổng: {selectedBooking.seats?.length} ghế
                  </div>
                </div>

                {/* Combo đã chọn */}
                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <h3 className="text-lg font-semibold text-orange-400 mb-3">
                    🍿 Combo đã chọn
                  </h3>
                  {selectedBooking.combos &&
                  selectedBooking.combos.length > 0 ? (
                    <div className="space-y-2">
                      {selectedBooking.combos.map((combo, index) => (
                        <div
                          key={index}
                          className="bg-black/30 rounded-lg p-3 text-sm text-white flex justify-between items-center"
                        >
                          <div>
                            <div className="font-semibold text-orange-300">
                              {combo.name}
                            </div>
                            <div className="text-gray-400">
                              Số lượng: {combo.quantity} ×{" "}
                              {formatCurrency(combo.price)}
                            </div>
                          </div>
                          <div className="font-semibold text-green-400">
                            {formatCurrency(
                              combo.totalPrice || combo.price * combo.quantity
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Tổng tiền combo */}
                      <div className="border-t border-white/10 pt-3 mt-3 flex justify-between text-sm">
                        <span className="text-gray-300 font-medium">
                          Tổng tiền combo:
                        </span>
                        <span className="text-yellow-400 font-bold">
                          {formatCurrency(
                            selectedBooking.combos.reduce(
                              (sum, combo) =>
                                sum +
                                (combo.totalPrice ||
                                  combo.price * combo.quantity),
                              0
                            )
                          )}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm">
                      Không có combo nào
                    </div>
                  )}
                </div>

                {/* Thanh toán */}
                <div className="bg-white/10 rounded-xl p-4 border border-yellow-500/20 col-span-1 md:col-span-2">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">
                    💰 Thông tin thanh toán
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Tiền vé:</span>
                      <span className="text-white">
                        {formatCurrency(
                          selectedBooking.ticketPrice *
                            (selectedBooking.seats?.length || 0)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Tiền combo:</span>
                      <span className="text-white">
                        {formatCurrency(
                          selectedBooking.combos?.reduce(
                            (sum, c) => sum + c.price * c.quantity,
                            0
                          ) || 0
                        )}
                      </span>
                    </div>

                    <div className="border-t border-white/20 pt-2 flex justify-between">
                      <span className="text-white font-bold text-lg">
                        Tổng tiền:
                      </span>
                      <span className="text-yellow-400 font-bold text-2xl">
                        {formatCurrency(selectedBooking.total)}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Trạng thái:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          selectedBooking.status
                        )}`}
                      >
                        {getStatusText(selectedBooking.status)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Ngày đặt:</span>
                      <span className="text-white">
                        {new Date(selectedBooking.createdAt).toLocaleString(
                          "vi-VN"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-6 py-2 bg-purple-500/20 border border-purple-500/50 rounded-xl text-purple-300 hover:bg-purple-500/30 transition-all"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsList;
