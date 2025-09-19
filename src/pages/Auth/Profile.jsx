import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  useEffect(() => {
    // Ưu tiên hiển thị dữ liệu localStorage giống Home để không bị trống UI
    const localUser = localStorage.getItem("user");
    if (localUser) {
      try {
        const parsed = JSON.parse(localUser);
        setProfile({
          fullName: parsed.fullName || "",
          email: parsed.email || "",
          phone: parsed.phone || "",
          role: parsed.role || "",
          avatar: parsed.avatar || "",
        });
        setLoading(false);
      } catch (_) {
        // ignore parse error
      }
    }

    // Sau đó gọi API để đồng bộ dữ liệu mới nhất
    (async () => {
      try {
        const res = await API.get("/users/me");
        setProfile(res.data.user);
        // đồng bộ lại localStorage như Home sử dụng
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } catch (e) {
        if (!localUser) setLoading(false);
        setError(e.response?.data?.message || "Không tải được hồ sơ");
      } finally {
        if (!localUser) setLoading(false);
      }
    })();
  }, []);

  const goToEdit = () => navigate("/profile/edit");

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Đang tải...
      </div>
    );

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
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
        <div className="max-w-4xl mx-auto grid grid-cols-1 gap-6">
          {/* Thông tin hồ sơ (read-only) */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Thông tin hồ sơ</h2>
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 rounded-full overflow-hidden border border-white/30">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      profile.fullName || "U"
                    )}&background=8B5CF6&color=fff`}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <div className="text-2xl font-semibold">{profile.fullName}</div>
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
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-sm text-gray-400">Gmail</p>
                <p className="font-medium break-all">{profile.email}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-sm text-gray-400">Họ và tên</p>
                <p className="font-medium">{profile.fullName}</p>
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

          {/* Lịch sử đặt vé (placeholder) */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Lịch sử đặt vé</h2>
            <div className="text-gray-300">
              Chưa có dữ liệu lịch sử đặt vé. Tính năng sẽ được bổ sung sau.
            </div>
          </div>

          {/* Thông báo */}
          {error && (
            <div className="md:col-span-2">
              <div className="mt-3 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-200">
                {error}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
