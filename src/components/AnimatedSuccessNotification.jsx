import React, { useEffect, useState, useCallback } from "react";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

const AnimatedSuccessNotification = ({ message, onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Định nghĩa handleClose với useCallback để không bị tạo lại mỗi render
  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onClose && onClose();
    }, 300); // khớp với transition
  }, [onClose]);

  useEffect(() => {
    // Hiện thông báo với delay nhỏ
    const showTimer = setTimeout(() => setIsVisible(true), 100);

    // Auto hide sau duration
    const hideTimer = setTimeout(() => handleClose(), duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, handleClose]);

  return (
    <div
      className={`fixed top-4 left-1/2 z-50 w-full max-w-sm transform -translate-x-1/2 transition-all duration-300 ease-out
        ${
          isVisible && !isExiting
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-20 opacity-0 scale-95"
        }`}
    >
      <div className="relative mx-auto w-full cursor-pointer overflow-hidden rounded-2xl p-4 bg-green-600/90 backdrop-blur-md border border-green-500 shadow-lg transition-all duration-200 hover:scale-[103%]">
        {/* Content */}
        <div className="relative flex flex-row items-center gap-3">
          {/* Icon */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
            <CheckCircleIcon className="w-6 h-6 text-white animate-pulse" />
          </div>

          {/* Text */}
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex flex-row items-center text-white font-medium text-lg">
              <span>Thành công!</span>
              <span className="mx-1">·</span>
              <span className="text-sm text-green-200/80">Vừa xong</span>
            </div>
            <p className="text-sm text-white/90 truncate">{message}</p>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors duration-200 flex-shrink-0"
          >
            <XMarkIcon className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Optional Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400/20 to-emerald-400/20 blur-xl -z-10"></div>
      </div>
    </div>
  );
};

export default AnimatedSuccessNotification;
