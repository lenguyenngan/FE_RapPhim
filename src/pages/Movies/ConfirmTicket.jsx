import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ConfirmTicket = () => {
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState(null);
  const [qrCode, setQrCode] = useState("");

  useEffect(() => {
    // Lấy payment data từ sessionStorage
    const data = sessionStorage.getItem("paymentData");
    if (!data) {
      toast.error("Không tìm thấy thông tin thanh toán");
      navigate("/");
      return;
    }

    try {
      const parsedData = JSON.parse(data);
      setPaymentData(parsedData);

      // Generate QR Code (tạm thời dùng text, có thể tích hợp thư viện QR)
      const qrData = `BOOKING:${parsedData.transactionId}:${parsedData.movieTitle}:${parsedData.date}:${parsedData.startTime}`;
      setQrCode(qrData);
    } catch (err) {
      toast.error("Dữ liệu thanh toán không hợp lệ");
      navigate("/");
    }
  }, [navigate]);

  const handleDownloadTicket = () => {
    // TODO: Implement PDF download
    toast.success("Tính năng tải vé sẽ được cập nhật sớm!");
  };

  const handleBackToHome = () => {
    // Clear session data
    sessionStorage.removeItem("bookingData");
    sessionStorage.removeItem("paymentData");
    navigate("/");
  };

  if (!paymentData) {
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
      <div className="animated-grid"></div>
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
      <div className="relative z-10 px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              🎉 Đặt vé thành công!
            </h1>
            <p className="text-gray-300 text-lg">
              Vé điện tử của bạn đã được tạo thành công
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Ticket Details */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">
                Thông tin vé
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={paymentData.moviePoster}
                    alt={paymentData.movieTitle}
                    className="w-16 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {paymentData.movieTitle}
                    </h3>
                    <p className="text-gray-300">
                      {paymentData.date} • {paymentData.startTime} -{" "}
                      {paymentData.endTime}
                    </p>
                    <p className="text-gray-300">
                      {paymentData.systemName} • {paymentData.clusterName}
                    </p>
                    <p className="text-gray-300">
                      Phòng {paymentData.hallName}
                    </p>
                  </div>
                </div>

                <div className="border-t border-white/20 pt-4">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Ghế đã đặt:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {paymentData.selectedSeats.map((seat, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-500/30 border border-purple-400 rounded-lg text-white text-sm"
                      >
                        {seat.seatNumber} ({seat.type.toUpperCase()})
                      </span>
                    ))}
                  </div>
                </div>

                {Object.entries(paymentData.selectedCombos).some(
                  ([_, qty]) => qty > 0
                ) && (
                  <div className="border-t border-white/20 pt-4">
                    <h4 className="text-lg font-semibold text-white mb-2">
                      Combo đã mua:
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(paymentData.selectedCombos).map(
                        ([comboId, qty]) => {
                          if (qty === 0) return null;
                          return (
                            <div
                              key={comboId}
                              className="flex justify-between text-white"
                            >
                              <span>Combo {comboId}</span>
                              <span>x{qty}</span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

                <div className="border-t border-white/20 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-white">
                      Tổng thanh toán:
                    </span>
                    <span className="text-3xl font-bold text-green-400">
                      {paymentData.total.toLocaleString()}₫
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    Phương thức: {paymentData.paymentMethod.toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-400">
                    Mã giao dịch: {paymentData.transactionId}
                  </p>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Mã QR Vé
              </h2>

              <div className="flex flex-col items-center">
                {/* QR Code Placeholder */}
                <div className="w-64 h-64 bg-white rounded-2xl p-4 mb-6 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-48 h-48 bg-gray-200 rounded-xl flex items-center justify-center mb-4">
                      <div className="text-gray-600 text-sm text-center">
                        <div className="text-4xl mb-2">📱</div>
                        <div>QR Code</div>
                        <div className="text-xs mt-2 break-all">{qrCode}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 text-center mb-6">
                  Quét mã QR này tại rạp để vào xem phim
                </p>

                <div className="space-y-3 w-full">
                  <button
                    onClick={handleDownloadTicket}
                    className="w-full bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105"
                  >
                    📥 Tải vé PDF
                  </button>

                  <button
                    onClick={handleBackToHome}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105"
                  >
                    🏠 Về trang chủ
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="mt-8 bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-yellow-300 mb-3">
              📋 Lưu ý quan trọng:
            </h3>
            <ul className="text-yellow-200 space-y-2">
              <li>• Vui lòng đến rạp trước giờ chiếu 15 phút</li>
              <li>• Mang theo mã QR hoặc vé điện tử để quét tại cổng</li>
              <li>• Vé không thể hoàn trả sau khi thanh toán</li>
              <li>• Liên hệ hotline nếu có vấn đề: 1900-xxxx</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmTicket;
