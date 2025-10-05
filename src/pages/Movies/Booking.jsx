import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
// nếu bạn dùng combo data frontend:
import { getActiveCombos } from "../../data/combos";

const Booking = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);

  // Params từ MovieDetail
  // const movieId = params.get("movieId") || "";
  const showtimeId = params.get("showtimeId") || "";
  const date = params.get("date") || "";
  const startTime = params.get("startTime") || "";
  const endTime = params.get("endTime") || "";
  const systemName = params.get("systemName") || "";
  const clusterName = params.get("clusterName") || "";
  const hallName = params.get("hallName") || "";
  const movieTitle = params.get("movieTitle") || "";
  const moviePoster = params.get("moviePoster") || "";
  const seatTypeParam = params.get("seatType") || "regular";
  const seatPriceParam = Number(params.get("price")) || 0;

  // State
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [combos, setCombos] = useState([]);
  const [selectedCombos, setSelectedCombos] = useState({});
  const [lockId, setLockId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);

  // Mock / Real seats: bạn có thể fetch từ BE /showtimes/:showtimeId/seats
  const [seatsFromServer, setSeatsFromServer] = useState(null);

  // Mặc định: tạo mock seat map nếu backend không trả
  const buildMockSeats = (rows = 5, cols = 8) =>
    Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => ({
        seatNumber: `${String.fromCharCode(65 + r)}${String(c + 1).padStart(
          2,
          "0"
        )}`,
        type: r >= rows - 1 ? "vip" : "regular", // hàng cuối là vip
        status: "available",
      }))
    ).flat();

  // Load combos (dùng dữ liệu static nếu backend ko có)
  useEffect(() => {
    try {
      const active = getActiveCombos?.() || [];
      setCombos(active);
    } catch (err) {
      setCombos([]);
    }
  }, []);

  // Load seats from backend (nếu API có) — fallback to mock
  useEffect(() => {
    let cancelled = false;
    const loadSeats = async () => {
      if (!showtimeId) {
        setSeatsFromServer(buildMockSeats());
        return;
      }
      try {
        const res = await axios.get(
          `http://localhost:5000/api/showtimes/${showtimeId}/seats`
        );
        if (cancelled) return;
        // expect { seats: [...], priceBySeatType: { regular, vip } }
        const seats = Array.isArray(res.data?.seats)
          ? res.data.seats
          : buildMockSeats();
        setSeatsFromServer(
          seats.map((s) => ({
            seatNumber: s.seatNumber,
            type: s.type || (s.row >= 4 ? "vip" : "regular"),
            status: s.status || "available",
            price: s.price || null,
          }))
        );
      } catch (err) {
        // fallback
        setSeatsFromServer(buildMockSeats());
      }
    };
    loadSeats();
    return () => {
      cancelled = true;
    };
  }, [showtimeId]);

  // timer countdown if lockId exists
  useEffect(() => {
    if (!lockId || timeLeft <= 0) return;
    const t = setInterval(() => {
      setTimeLeft((p) => {
        if (p <= 1) {
          toast.error("Hết thời gian giữ ghế!");
          setLockId(null);
          return 0;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [lockId, timeLeft]);

  // Calculate total
  const total = useMemo(() => {
    const seatTotal = selectedSeats.reduce(
      (sum, s) =>
        sum +
        (s.type === "vip"
          ? Math.round(seatPriceParam * 1.4) // hoặc lấy price trên seat nếu có
          : seatPriceParam),
      0
    );
    const comboTotal = Object.entries(selectedCombos).reduce(
      (sum, [id, qty]) => {
        const combo = combos.find((c) => c.comboId === id || c._id === id);
        return sum + (combo?.price || 0) * qty;
      },
      0
    );
    return seatTotal + comboTotal;
  }, [selectedSeats, selectedCombos, combos, seatPriceParam]);

  // seat toggle: chỉ cho chọn ghế có type === seatTypeParam
  const toggleSeat = (seat) => {
    if (!seat) return;
    if (seat.status !== "available") {
      toast.error("Ghế không khả dụng");
      return;
    }
    if (seat.type !== seatTypeParam) {
      // không cho chọn ghế khác loại
      toast.error(`Vui lòng chọn ghế loại ${seatTypeParam.toUpperCase()}`);
      return;
    }
    setSelectedSeats((prev) =>
      prev.some((s) => s.seatNumber === seat.seatNumber)
        ? prev.filter((p) => p.seatNumber !== seat.seatNumber)
        : [...prev, seat]
    );
  };

  // Lock seats -> gọi BE lock (endpoint của bạn là /api/bookings/lock hoặc /api/booking/lock)
  const handleLockSeats = async () => {
    if (selectedSeats.length === 0) return toast.error("Chọn ít nhất 1 ghế");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/bookings/lock",
        {
          showtimeId,
          seatIds: selectedSeats.map((s) => s.seatNumber),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLockId(res.data.lockId);
      setTimeLeft(res.data.expiresIn || 600);
      toast.success("Đã giữ ghế — bạn có 10 phút để thanh toán");
    } catch (err) {
      console.error("Lock error:", err);
      toast.error(err?.response?.data?.message || "Không thể giữ ghế");
    } finally {
      setLoading(false);
    }
  };

  // Confirm booking -> gọi BE confirm
  const handleConfirm = async () => {
    if (!lockId) return toast.error("Bạn cần giữ ghế trước");
    if (selectedSeats.length === 0) return toast.error("Chọn ghế trước");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/bookings/confirm",
        {
          showtimeId,
          seatIds: selectedSeats.map((s) => s.seatNumber),
          lockId,
          combos: Object.entries(selectedCombos)
            .filter(([_, q]) => q > 0)
            .map(([comboId, quantity]) => ({ comboId, quantity })),
          paymentMethod: "card",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Đặt vé thành công!");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      console.error("Confirm error:", err);
      toast.error(err?.response?.data?.message || "Đặt vé thất bại");
    } finally {
      setLoading(false);
    }
  };

  // Render
  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800/50 p-6 rounded-2xl mb-6 border border-gray-700">
          <div className="flex items-center gap-4">
            {moviePoster && (
              <img
                src={moviePoster}
                alt="poster"
                className="w-24 h-32 object-cover rounded"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold">{movieTitle || "Đặt vé"}</h2>
              <p className="text-gray-300">
                {date} • {startTime} - {endTime}
              </p>
              <p className="text-gray-300">
                {systemName} • {clusterName} • {hallName}
              </p>
              <p className="mt-2">
                Loại ghế:{" "}
                <span className="font-semibold">
                  {seatTypeParam.toUpperCase()}
                </span>
              </p>
              <p className="mt-1 text-yellow-300 font-bold">
                Giá/ghế: {seatPriceParam.toLocaleString()}₫
              </p>
            </div>
          </div>
          {lockId && (
            <div className="mt-4 p-3 bg-green-800/30 rounded">
              Đang giữ ghế — mã: <span className="font-mono">{lockId}</span> —
              thời gian còn lại: {Math.floor(timeLeft / 60)}:
              {String(timeLeft % 60).padStart(2, "0")}
            </div>
          )}
        </div>

        <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Chọn ghế</h3>

          {/* Seat grid */}
          <div className="grid grid-cols-8 gap-3 mb-6">
            {(seatsFromServer || []).map((seat) => {
              const isSelected = selectedSeats.some(
                (s) => s.seatNumber === seat.seatNumber
              );
              const disabled =
                seat.status !== "available" ||
                seat.type !== seatTypeParam ||
                Boolean(lockId);
              return (
                <button
                  key={seat.seatNumber}
                  onClick={() => toggleSeat(seat)}
                  disabled={disabled}
                  className={`rounded-lg p-3 font-bold transition ${
                    isSelected
                      ? "bg-green-500 text-black scale-105"
                      : seat.type === "vip"
                      ? "bg-yellow-500 hover:bg-yellow-400"
                      : "bg-gray-600 hover:bg-gray-500"
                  } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  {seat.seatNumber}
                </button>
              );
            })}
          </div>

          {/* Combo */}
          <h3 className="text-xl font-semibold mb-3">Chọn combo (tuỳ chọn)</h3>
          <div className="space-y-3 mb-6">
            {combos.length === 0 ? (
              <div className="text-gray-400">Không có combo</div>
            ) : (
              combos.map((combo) => (
                <div
                  key={combo.comboId}
                  className="flex items-center justify-between bg-gray-700/40 p-3 rounded"
                >
                  <div>
                    <div className="font-semibold">{combo.name}</div>
                    <div className="text-sm text-gray-300">
                      {combo.description}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="font-bold text-yellow-300">
                      {combo.price.toLocaleString()}₫
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={selectedCombos[combo.comboId] || 0}
                      onChange={(e) =>
                        setSelectedCombos((prev) => ({
                          ...prev,
                          [combo.comboId]: Math.max(
                            0,
                            Number(e.target.value) || 0
                          ),
                        }))
                      }
                      className="w-16 text-black rounded p-1"
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Total & buttons */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-300">
                Ghế đã chọn:{" "}
                {selectedSeats.map((s) => s.seatNumber).join(", ") ||
                  "Chưa chọn"}
              </div>
              <div className="text-2xl font-bold text-yellow-300 mt-2">
                {total.toLocaleString()}₫
              </div>
            </div>

            <div className="flex gap-3">
              {!lockId ? (
                <button
                  onClick={handleLockSeats}
                  disabled={selectedSeats.length === 0 || loading}
                  className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-xl font-bold disabled:opacity-50"
                >
                  {loading ? "Đang giữ..." : "🔒 Giữ ghế"}
                </button>
              ) : (
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-xl font-bold"
                >
                  {loading ? "Đang xử lý..." : "✅ Xác nhận đặt vé"}
                </button>
              )}

              <button
                onClick={() => navigate(-1)}
                className="px-4 py-3 bg-gray-700 rounded-xl"
              >
                ← Quay lại
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
