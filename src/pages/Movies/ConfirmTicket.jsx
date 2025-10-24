import React, { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

const ConfirmTicket = () => {
  const [ticketData, setTicketData] = useState(null);
  const ticketRef = useRef(null);

  useEffect(() => {
    const data = sessionStorage.getItem("paymentData");
    if (!data) {
      console.error("Không tìm thấy thông tin thanh toán");
      return;
    }
    try {
      const parsedData = JSON.parse(data);
      setTicketData(parsedData);
    } catch (err) {
      console.error("Dữ liệu thanh toán không hợp lệ", err);
    }
  }, []);

  const handleDownloadTicket = () => {
    if (!ticketData) return;
    const ticketInfo = `
CINEMA TICKET
═══════════════════════════════════
Movie: ${ticketData.movieTitle}
System: ${ticketData.systemName}
Cluster: ${ticketData.clusterName}
Hall: ${ticketData.hallName}
Date: ${ticketData.date}
Time: ${ticketData.startTime} - ${ticketData.endTime}
Seats: ${ticketData.selectedSeats?.map((s) => s.seatNumber).join(", ")}
Total: ${ticketData.total.toLocaleString()}₫
Payment: ${ticketData.paymentMethod.toUpperCase()}
Transaction ID: ${ticketData.transactionId}
═══════════════════════════════════
    `.trim();

    const blob = new Blob([ticketInfo], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ticket-${ticketData.transactionId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBackToHome = () => {
    sessionStorage.removeItem("bookingData");
    sessionStorage.removeItem("paymentData");
    window.location.href = "/";
  };

  if (!ticketData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    );
  }

  // chuẩn bị value cho QR code
  const qrValue = JSON.stringify({
    id: ticketData.transactionId,
    movie: ticketData.movieTitle,
    system: ticketData.systemName,
    cluster: ticketData.clusterName,
    hall: ticketData.hallName,
    date: ticketData.date,
    time: ticketData.startTime,
    seats: ticketData.selectedSeats?.map((s) => s.seatNumber).join(", "),
  });

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div
          className="absolute top-0 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div ref={ticketRef} className="relative z-10 px-4 py-10">
        <div className="max-w-5xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4 animate-bounce">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Ticket Details */}
            <div className="lg:col-span-2 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <svg
                  className="w-7 h-7 text-purple-400"
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
                Thông tin vé
              </h2>

              <div className="space-y-5">
                {/* Movie Info */}
                <div className="flex gap-4 pb-5 border-b border-white/10">
                  <div className="relative flex-shrink-0">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-25"></div>
                    <img
                      src={ticketData.moviePoster}
                      alt={ticketData.movieTitle}
                      className="relative w-24 h-36 object-cover rounded-xl shadow-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {ticketData.movieTitle}
                    </h3>
                    <div className="space-y-2 text-gray-300">
                      <p className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-purple-400"
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
                        <span className="font-semibold">{ticketData.date}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-pink-400"
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
                        <span className="font-semibold">
                          {ticketData.startTime} - {ticketData.endTime}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cinema Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-400/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <svg
                        className="w-5 h-5 text-purple-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      <span className="text-xs text-purple-300 font-medium">
                        Hệ thống rạp
                      </span>
                    </div>
                    <p className="text-white font-bold">
                      {ticketData.systemName}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 border border-pink-400/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <svg
                        className="w-5 h-5 text-pink-400"
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
                      <span className="text-xs text-pink-300 font-medium">
                        Cụm rạp
                      </span>
                    </div>
                    <p className="text-white font-bold">
                      {ticketData.clusterName}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 border border-indigo-400/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <svg
                        className="w-5 h-5 text-indigo-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                        />
                      </svg>
                      <span className="text-xs text-indigo-300 font-medium">
                        Phòng chiếu
                      </span>
                    </div>
                    <p className="text-white font-bold">
                      {ticketData.hallName}
                    </p>
                  </div>
                </div>

                {/* Seats */}
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-yellow-400"
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
                    <span className="font-semibold">Ghế đã đặt:</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {ticketData.selectedSeats?.map((seat, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500/40 to-pink-500/40 border-2 border-purple-400/60 rounded-xl text-white font-bold shadow-lg"
                      >
                        {seat.seatNumber}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Combos */}
                {ticketData.selectedCombos &&
                  ticketData.selectedCombos.length > 0 && (
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-orange-400"
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
                        <span className="font-semibold">Combo đã chọn:</span>
                      </p>
                      <div className="space-y-2">
                        {ticketData.selectedCombos.map((combo, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-3"
                          >
                            <span className="text-white font-medium">
                              🍿 {combo.name}
                            </span>
                            <span className="text-gray-300 font-semibold">
                              × {combo.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Payment Info */}
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-white">
                      Tổng thanh toán:
                    </span>
                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                      {ticketData.total.toLocaleString()}₫
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <p className="text-gray-400 mb-1">Phương thức</p>
                      <p className="text-white font-semibold">
                        {ticketData.paymentMethod.toUpperCase()}
                      </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <p className="text-gray-400 mb-1">Mã giao dịch</p>
                      <p className="text-white font-semibold text-xs">
                        {ticketData.transactionId}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
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
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                  />
                </svg>
                Mã QR Vé
              </h2>

              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-30"></div>
                  <div className="relative bg-white rounded-2xl p-4 shadow-2xl">
                    <QRCodeCanvas
                      value={qrValue}
                      size={256}
                      bgColor="#ffffff"
                      fgColor="#000000"
                      level="H"
                    />
                  </div>
                </div>

                <div className="text-center mb-6">
                  <p className="text-gray-300 mb-2">
                    Quét mã QR này tại rạp để vào xem phim
                  </p>
                  <div className="inline-block bg-purple-500/20 border border-purple-400/30 rounded-lg px-4 py-2">
                    <p className="text-purple-300 text-xs font-mono">
                      ID: {ticketData.transactionId.slice(-8)}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 w-full">
                  <button
                    onClick={handleDownloadTicket}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-6 py-3 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
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
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Tải vé
                  </button>

                  <button
                    onClick={handleBackToHome}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 py-3 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
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
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    Về trang chủ
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="mt-8 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-yellow-300 mb-4 flex items-center gap-2">
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Lưu ý quan trọng
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-yellow-100">
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 font-bold">•</span>
                <span>Vui lòng đến rạp trước giờ chiếu 15 phút</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 font-bold">•</span>
                <span>Mang theo mã QR để quét tại cổng</span>
              </div>
              <div className="flex items-start gap-3">
                <span classize="text-yellow-400 font-bold">•</span>
                <span>Vé không thể hoàn trả sau khi thanh toán</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 font-bold">•</span>
                <span>Liên hệ hotline: 1900-xxxx nếu cần hỗ trợ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmTicket;
