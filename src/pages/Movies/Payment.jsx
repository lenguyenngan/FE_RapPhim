import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import QRCode from "qrcode";
import axios from "axios";

const Payment = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [loading, setLoading] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeDataURL, setQrCodeDataURL] = useState("");

  // 🧩 Lấy dữ liệu đặt vé từ sessionStorage
  useEffect(() => {
    const data = sessionStorage.getItem("bookingData");
    if (!data) {
      toast.error("Không tìm thấy thông tin đặt vé");
      navigate("/");
      return;
    }
    try {
      setBookingData(JSON.parse(data));
    } catch (err) {
      toast.error("Dữ liệu đặt vé không hợp lệ");
      navigate("/");
    }
  }, [navigate]);

  // 🔹 Tạo mã QR MoMo
  const generateMoMoQR = async (amount) => {
    try {
      const qrString = `momo://transfer?amount=${amount}&note=${encodeURIComponent(
        `Thanh toán vé xem phim - ${bookingData.movieTitle}`
      )}&orderId=MOMO_${Date.now()}`;

      const qrDataURL = await QRCode.toDataURL(qrString, {
        width: 256,
        margin: 2,
      });

      setQrCodeDataURL(qrDataURL);
      setShowQRCode(true);
    } catch (err) {
      console.error("QR error:", err);
      toast.error("Không thể tạo mã QR");
    }
  };

  // 🧾 Hàm gửi xác nhận thanh toán đến backend
  const confirmBooking = async (method = paymentMethod) => {
    if (!bookingData) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !token) {
        toast.error("Bạn cần đăng nhập để thanh toán");
        navigate("/login");
        return;
      }

      // Chuẩn hóa dữ liệu gửi lên server
      const payload = {
        lockId: bookingData.lockId,
        userId: user._id,
        bookingData: {
          userEmail: user.email,
          movieTitle: bookingData.movieTitle,
          moviePoster: bookingData.moviePoster,
          systemName: bookingData.systemName,
          clusterName: bookingData.clusterName,
          hallName: bookingData.hallName,
          date: bookingData.date,
          startTime: bookingData.startTime,
          endTime: bookingData.endTime,
          selectedSeats: bookingData.selectedSeats,
          selectedCombos: bookingData.selectedCombos || [], // 🟢 combo được lưu chuẩn
          total: bookingData.total,
          paymentMethod: method,
          cinemaId: bookingData.cinemaId,
          systemId: bookingData.systemId,
        },
      };

      const resp = await axios.post(
        "http://localhost:5000/api/seat-locks/confirm",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Booking confirmed:", resp.data);
      toast.success("Thanh toán thành công!");
      navigate("/history");
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Thanh toán thất bại, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  // 🟣 Xử lý khi chọn thanh toán bằng MoMo
  const handlePayment = async () => {
    if (paymentMethod === "momo") {
      await generateMoMoQR(bookingData.total);
    } else {
      await confirmBooking(paymentMethod);
    }
  };

  // ✅ Người dùng xác nhận đã thanh toán MoMo thành công
  const handleMoMoPaymentSuccess = async () => {
    await confirmBooking("momo");
    setShowQRCode(false);
  };

  if (!bookingData) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-4 text-center">Thanh Toán</h2>

        <div className="mb-4">
          <p>
            🎬 <strong>{bookingData.movieTitle}</strong>
          </p>
          <p>
            🏢 {bookingData.systemName} - {bookingData.clusterName}
          </p>
          <p>
            🕒 {bookingData.date} | {bookingData.startTime} -{" "}
            {bookingData.endTime}
          </p>
          <p>
            💺 Ghế:{" "}
            {bookingData.selectedSeats?.map((s) => s.seatNumber).join(", ") ||
              "Không có"}
          </p>
          <p>
            🍿 Combo:{" "}
            {bookingData.selectedCombos?.length
              ? bookingData.selectedCombos
                  .map((c) => `${c.name} x${c.quantity}`)
                  .join(", ")
              : "Không có"}
          </p>
          <p className="text-xl mt-2">
            💰 <strong>{bookingData.total.toLocaleString()} VNĐ</strong>
          </p>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">
            Phương thức thanh toán
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white"
          >
            <option value="momo">MoMo</option>
            <option value="vnpay">VNPay</option>
            <option value="visa">Visa</option>
          </select>
        </div>

        {showQRCode ? (
          <div className="flex flex-col items-center">
            <img src={qrCodeDataURL} alt="MoMo QR Code" className="w-64 h-64" />
            <button
              onClick={handleMoMoPaymentSuccess}
              disabled={loading}
              className="mt-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold"
            >
              {loading ? "Đang xác nhận..." : "Xác nhận đã thanh toán MoMo"}
            </button>
          </div>
        ) : (
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold mt-4"
          >
            {loading ? "Đang xử lý..." : "Thanh toán ngay"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Payment;
