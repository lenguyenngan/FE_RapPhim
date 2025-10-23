import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { resolveAssetUrl } from "../../api";

const History = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Gắn token vào header
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete API.defaults.headers.common["Authorization"];
    }
  }, []);

  // ✅ Lấy danh sách vé
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Bạn cần đăng nhập để xem lịch sử vé");
          setLoading(false);
          return;
        }

        const res = await API.get("/bookings/user");
        const fetched = Array.isArray(res.data?.bookings)
          ? res.data.bookings
          : [];
        setBookings(fetched);
      } catch (e) {
        const status = e.response?.status;
        if (status === 401 || status === 403) {
          setError("Unauthorized");
        } else {
          setError(e.response?.data?.message || "Không tải được lịch sử vé");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ✅ Format tiền
  const formatCurrency = (n) => (n || 0).toLocaleString("vi-VN") + "₫";

  // ✅ Hiển thị combo an toàn và đẹp hơn
  const renderCombos = (booking) => {
    const combos = Array.isArray(booking?.combos)
      ? booking.combos
      : booking?.selectedCombos || [];

    if (!combos.length) {
      return <p className="text-gray-400 italic text-sm">Không có combo</p>;
    }

    return (
      <div className="flex flex-wrap gap-2 mt-1">
        {combos.map((combo, index) => (
          <span
            key={combo._id || index}
            className="bg-indigo-600/30 border border-indigo-400 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
          >
            🍿 {combo.name} × {combo.quantity}
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center text-white">
        Đang tải...
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Meteors */}
      <div className="meteors-container">
        {[...Array(9)].map((_, i) => (
          <div
            key={`meteor-${i}`}
            className="meteor"
            style={{
              left: `${10 * (i + 1)}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${3 + (i % 3)}s`,
            }}
          />
        ))}
      </div>
      <div className="animated-grid" />

      <div className="relative z-10 px-4 py-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
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
            <h1 className="text-3xl font-bold">Lịch sử vé của bạn</h1>
          </div>

          {/* Thông báo lỗi */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-200">
              {error}
            </div>
          )}

          {/* Trạng thái hiển thị */}
          {error === "Unauthorized" ? (
            <div className="text-center space-y-3">
              <div className="text-gray-300">
                Bạn cần đăng nhập để xem lịch sử vé.
              </div>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700"
              >
                Đăng nhập
              </button>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center text-gray-300">
              Chưa có vé nào được đặt
            </div>
          ) : (
            <div className="space-y-5">
              {bookings.map((b) => (
                <div
                  key={b._id || Math.random()}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5"
                >
                  <div className="flex gap-4">
                    <img
                      src={
                        b.moviePoster
                          ? resolveAssetUrl(b.moviePoster)
                          : "https://via.placeholder.com/300x450?text=No+Image"
                      }
                      alt={b.movieTitle}
                      className="w-24 h-36 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="text-xl font-semibold">
                            {b.movieTitle || "Phim không xác định"}
                          </h2>
                          <div className="text-gray-300 text-sm">
                            {b.date} • {b.startTime} - {b.endTime}
                          </div>
                          <div className="text-gray-300 text-sm">
                            {b.systemName} • {b.clusterName} • Phòng{" "}
                            {b.hallName}
                          </div>
                          {/* Ghế */}
                          <div className="mt-2">
                            <div className="text-sm text-gray-300 mb-1">
                              Ghế:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {(() => {
                                let seatsArray = [];

                                if (Array.isArray(b.seats)) {
                                  seatsArray = b.seats;
                                } else if (
                                  typeof b.seats === "object" &&
                                  b.seats !== null
                                ) {
                                  seatsArray = Object.keys(b.seats);
                                } else if (typeof b.seats === "string") {
                                  seatsArray = b.seats
                                    .split(",")
                                    .map((s) => s.trim());
                                }

                                return seatsArray.length > 0 ? (
                                  seatsArray.map((s, i) => (
                                    <span
                                      key={`${b._id || "seat"}-${s}-${i}`}
                                      className="px-2 py-1 bg-purple-500/30 border border-purple-400 rounded text-xs text-white"
                                    >
                                      {s}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-gray-400 text-xs">
                                    Không có ghế
                                  </span>
                                );
                              })()}
                            </div>
                          </div>
                          {/* Combo */}{" "}
                          <div className="mt-3">
                            {" "}
                            <div className="text-sm text-gray-300 mb-1">
                              {" "}
                              Combo:{" "}
                            </div>{" "}
                            {renderCombos(b)}{" "}
                          </div>{" "}
                        </div>

                        {/* Tổng tiền */}
                        <div className="text-right">
                          <div className="text-2xl font-bold text-yellow-400">
                            {formatCurrency(b.total || b.totalPrice)}
                          </div>
                          {b.paymentMethod && (
                            <div className="text-xs text-gray-300 mt-1">
                              Thanh toán:{" "}
                              {b.paymentMethod.toUpperCase?.() || "MOMO"}
                            </div>
                          )}
                          {b.bookingCode && (
                            <div className="mt-2 text-xs px-2 py-1 rounded bg-white/10 border border-white/20">
                              Mã vé: {b.bookingCode}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
