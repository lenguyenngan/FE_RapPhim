import React, { useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../../api";

const ResetPassword = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = useMemo(() => params.get("token") || "", [params]);
  const id = useMemo(() => params.get("id") || "", [params]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [email, setEmail] = useState("");
  const [reqMsg, setReqMsg] = useState("");
  const [reqLoading, setReqLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Tính độ mạnh mật khẩu
  const passwordStrength = useMemo(() => {
    let score = 0;
    if (password.length >= 6) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score; // 0-5
  }, [password]);

  // Gửi yêu cầu reset mật khẩu
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (!password || password.length < 6)
      return setErr("Mật khẩu phải từ 6 ký tự");
    if (password !== confirm) return setErr("Mật khẩu nhập lại không khớp");
    if (!token || !id) return setErr("Liên kết không hợp lệ");

    try {
      setLoading(true);
      const res = await API.post("/auth/reset-password", {
        token,
        id,
        newPassword: password,
      });
      setMsg(res.data?.message || "Đặt lại mật khẩu thành công");
      setTimeout(() => navigate("/login"), 1000); // redirect về login
    } catch (e) {
      setErr(e.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  // Gửi yêu cầu nhận liên kết reset password
  const handleRequest = async (e) => {
    e.preventDefault();
    setReqMsg("");
    setErr("");

    if (!/\S+@\S+\.\S+/.test(email))
      return setErr("Vui lòng nhập email hợp lệ");

    try {
      setReqLoading(true);
      const res = await API.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );
      setReqMsg(
        res.data?.message || "Nếu email tồn tại, liên kết đặt lại đã được gửi"
      );

      // Nếu backend trả về resetUrl, redirect sang trang reset password
      if (res.data?.resetUrl) {
        setTimeout(() => (window.location.href = res.data.resetUrl), 1000);
      }
    } catch (e) {
      setErr(e.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setReqLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 text-white shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold">
            {token && id ? "Đặt lại mật khẩu" : "Yêu cầu đặt lại mật khẩu"}
          </h1>
          <p className="text-sm text-gray-300 mt-1">
            {token && id
              ? "Nhập mật khẩu mới để hoàn tất"
              : "Nhập email để nhận liên kết đặt lại"}
          </p>
        </div>

        {token && id ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Mật khẩu mới */}
            <div>
              <label className="block mb-2 text-sm text-gray-300">
                Mật khẩu mới
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ít nhất 6 ký tự, nên có chữ, số, ký tự đặc biệt"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-3 text-gray-300 hover:text-white"
                >
                  {showPassword ? "Ẩn" : "Hiện"}
                </button>
              </div>
              {/* Strength bar */}
              <div className="mt-2 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    passwordStrength <= 1
                      ? "bg-red-400"
                      : passwordStrength <= 3
                      ? "bg-yellow-400"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-gray-300">
                Độ mạnh:{" "}
                {passwordStrength <= 1
                  ? "Yếu"
                  : passwordStrength <= 3
                  ? "Trung bình"
                  : "Mạnh"}
              </div>
            </div>

            {/* Xác nhận mật khẩu */}
            <div>
              <label className="block mb-2 text-sm text-gray-300">
                Xác nhận mật khẩu
              </label>
              <div className="relative group">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute inset-y-0 right-3 text-gray-300 hover:text-white"
                >
                  {showConfirm ? "Ẩn" : "Hiện"}
                </button>
              </div>
              {confirm && (
                <div
                  className={`mt-1 text-xs ${
                    confirm === password ? "text-green-300" : "text-red-300"
                  }`}
                >
                  {confirm === password
                    ? "Mật khẩu khớp"
                    : "Mật khẩu không khớp"}
                </div>
              )}
            </div>

            <button
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 shadow-lg hover:shadow-purple-500/25 hover:from-purple-600 hover:to-pink-600 transition"
            >
              {loading ? "Đang xử lý..." : "Xác nhận"}
            </button>

            {err && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-200">
                {err}
              </div>
            )}
            {msg && (
              <div className="mt-4 p-3 bg-green-500/20 border border-green-500/40 rounded-lg text-green-200">
                {msg}
              </div>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/login")}
                className="text-sm text-purple-300 hover:text-purple-200 underline"
              >
                Quay về đăng nhập
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRequest} className="space-y-5">
            <div>
              <label className="block mb-2 text-sm text-gray-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
              />
            </div>
            <button
              disabled={reqLoading}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 shadow-lg hover:shadow-purple-500/25 hover:from-purple-600 hover:to-pink-600 transition"
            >
              {reqLoading ? "Đang gửi..." : "Gửi liên kết đặt lại"}
            </button>

            {err && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-200">
                {err}
              </div>
            )}
            {reqMsg && (
              <div className="mt-4 p-3 bg-green-500/20 border border-green-500/40 rounded-lg text-green-200">
                {reqMsg}
              </div>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/login")}
                className="text-sm text-purple-300 hover:text-purple-200 underline"
              >
                Quay về đăng nhập
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
