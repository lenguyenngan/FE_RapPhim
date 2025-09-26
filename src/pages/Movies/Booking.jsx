import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../api";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Booking = () => {
  const navigate = useNavigate();
  const query = useQuery();

  const movieId = query.get("movieId") || "";
  const date = query.get("date") || "";
  const clusterId = query.get("clusterId") || "";
  const hallId = query.get("hallId") || "";
  const startTime = query.get("startTime") || "";
  const endTime = query.get("endTime") || "";
  const price = Number(query.get("price") || 0);

  const [seats, setSeats] = useState([]);
  const [combos, setCombos] = useState([]);
  const [selectedCombos, setSelectedCombos] = useState({});
  const [loading, setLoading] = useState(false);

  // fetch combos
  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const res = await API.get("/combos");
        setCombos(res.data.combos || []);

        // 👉 Khởi tạo số lượng = 0 cho tất cả combo
        const initial = {};
        (res.data.combos || []).forEach((c) => {
          initial[c.id] = 0;
        });
        setSelectedCombos(initial);
      } catch (e) {
        console.error("Lỗi tải combo:", e);
      }
    };
    fetchCombos();
  }, []);

  const canSubmit = useMemo(
    () =>
      movieId && date && clusterId && hallId && startTime && seats.length > 0,
    [movieId, date, clusterId, hallId, startTime, seats.length]
  );

  const toggleSeat = (seat) => {
    setSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  // ✅ chỉ cho phép 1 combo có số lượng > 0, reset combo khác về 0
  const updateCombo = (comboId, qty) => {
    if (qty > 0) {
      const reset = {};
      combos.forEach((c) => {
        reset[c.id] = 0;
      });
      reset[comboId] = qty;
      setSelectedCombos(reset);
    } else {
      setSelectedCombos((prev) => ({ ...prev, [comboId]: 0 }));
    }
  };

  const confirmBooking = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      const body = {
        movieId,
        date,
        clusterId,
        hallId,
        startTime,
        endTime,
        seats,
        pricePerSeat: price,
        combos: Object.entries(selectedCombos)
          .filter(([_, qty]) => qty > 0)
          .map(([id, qty]) => ({ comboId: id, quantity: qty })),
      };
      await API.post("/bookings", body);
      alert("🎉 Đặt vé thành công!");
      navigate("/");
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || e.message || "Đặt vé thất bại");
    } finally {
      setLoading(false);
    }
  };

  const seatGrid = Array.from({ length: 6 }).map((_, r) =>
    Array.from({ length: 10 }).map((_, c) => `R${r + 1}C${c + 1}`)
  );

  const comboTotal = combos.reduce((sum, combo) => {
    const qty = selectedCombos[combo.id] || 0;
    return sum + qty * combo.price;
  }, 0);

  const totalPrice = seats.length * price + comboTotal;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-purple-300 mb-6 hover:text-pink-400 transition-colors"
        >
          ← Quay lại
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Seat selection */}
          <div className="lg:col-span-2 bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg">
            <h1 className="text-2xl font-bold text-white mb-6">Chọn ghế</h1>
            <div className="grid grid-cols-10 gap-2 justify-items-center">
              {seatGrid.flat().map((seat) => (
                <button
                  key={seat}
                  onClick={() => toggleSeat(seat)}
                  className={`w-10 h-10 rounded-md text-sm transition-colors ${
                    seats.includes(seat)
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-white/10 border border-white/20 text-white hover:bg-purple-500/50"
                  }`}
                >
                  {seat.replace("R", "").replace("C", "-")}
                </button>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-300">
              Chọn tối thiểu 1 ghế để tiếp tục.
            </p>
          </div>

          {/* Info & confirmation */}
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg text-white">
            <h2 className="text-xl font-bold mb-4">Thông tin suất chiếu</h2>
            <div className="space-y-2 text-gray-200">
              <div>
                <span className="text-gray-400">🎬 Mã phim:</span> {movieId}
              </div>
              <div>
                <span className="text-gray-400">📅 Ngày:</span>{" "}
                {new Date(date).toLocaleDateString("vi-VN")}
              </div>
              <div>
                <span className="text-gray-400">Rạp:</span> {clusterId} •{" "}
                {hallId}
              </div>
              <div>
                <span className="text-gray-400">Giờ:</span> {startTime} -{" "}
                {endTime}
              </div>
              <div>
                <span className="text-gray-400">Giá vé:</span>{" "}
                {price.toLocaleString("vi-VN")} ₫
              </div>
              <div>
                <span className="text-gray-400">Ghế đã chọn:</span>{" "}
                {seats.join(", ") || "(chưa chọn)"}
              </div>
            </div>

            {/* Combos */}
            <h3 className="text-lg font-semibold mt-6 mb-3">Chọn combo</h3>
            <div className="space-y-3">
              {combos.map((combo) => (
                <div
                  key={combo.id}
                  className="flex items-center justify-between bg-white/5 p-3 rounded-lg"
                >
                  <div>
                    <div className="font-medium">{combo.name}</div>
                    <div className="text-sm text-gray-400">
                      {combo.price.toLocaleString("vi-VN")} ₫
                    </div>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={selectedCombos[combo.id] || 0}
                    onChange={(e) =>
                      updateCombo(combo.id, Number(e.target.value))
                    }
                    className="w-16 text-center rounded bg-white/10 border border-white/20 text-white"
                  />
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="pt-4 mt-4 border-t border-white/20 font-bold text-white text-lg">
              Tổng:{" "}
              <span className="text-pink-400">
                {totalPrice.toLocaleString("vi-VN")} ₫
              </span>
            </div>

            <button
              disabled={!canSubmit || loading}
              onClick={confirmBooking}
              className={`mt-6 w-full px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                canSubmit && !loading
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  : "bg-gray-500/20 border border-gray-500/50 text-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? "Đang xử lý..." : "Xác nhận đặt vé"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
