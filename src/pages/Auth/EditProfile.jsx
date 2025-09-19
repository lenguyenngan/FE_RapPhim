import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

const EditProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    avatar: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/users/me");
        const { fullName, email, phone, avatar } = res.data.user || {};
        setProfile({
          fullName: fullName || "",
          email: email || "",
          phone: phone || "",
          avatar: avatar || "",
        });
      } catch (e) {
        setError(e.response?.data?.message || "Không tải được hồ sơ");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    try {
      setSaving(true);
      const res = await API.post("/users/me", {
        fullName: profile.fullName,
        phone: profile.phone,
        avatar: profile.avatar,
      });
      setMsg(res.data?.message || "Cập nhật hồ sơ thành công");
      setTimeout(() => navigate("/profile"), 800);
    } catch (e) {
      setError(e.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Đang tải...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-10 px-4 text-white">
      <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-2xl font-semibold mb-6">Cập nhật hồ sơ</h1>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-300">
              Họ và tên
            </label>
            <input
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl"
              value={profile.fullName}
              onChange={(e) =>
                setProfile({ ...profile, fullName: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-300">Email</label>
            <input
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl opacity-60"
              value={profile.email}
              disabled
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-300">
              Số điện thoại
            </label>
            <input
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl"
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-300">
              Avatar URL
            </label>
            <input
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl"
              value={profile.avatar}
              onChange={(e) =>
                setProfile({ ...profile, avatar: e.target.value })
              }
              placeholder="https://..."
            />
            {profile.avatar && (
              <img
                src={profile.avatar}
                alt="avatar"
                className="mt-3 w-20 h-20 rounded-full object-cover border border-white/30"
              />
            )}
          </div>
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-200">
              {error}
            </div>
          )}
          {msg && (
            <div className="p-3 bg-green-500/20 border border-green-500/40 rounded-lg text-green-200">
              {msg}
            </div>
          )}
          <div className="flex items-center gap-3">
            <button
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50"
            >
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
