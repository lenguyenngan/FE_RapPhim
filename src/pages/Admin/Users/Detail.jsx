import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../api";

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get(`/users/${id}`);
        setUser(res.data.user || null);
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8">
        <div className="max-w-3xl mx-auto text-white">
          <button className="mb-6 text-purple-300" onClick={() => navigate(-1)}>
            ← Quay lại
          </button>
          <div className="bg-white/10 border border-white/20 rounded-3xl p-6">
            Không tìm thấy người dùng
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8">
      <div className="max-w-3xl mx-auto text-white">
        <button className="mb-6 text-purple-300" onClick={() => navigate(-1)}>
          ← Quay lại
        </button>
        <div className="bg-white/10 border border-white/20 rounded-3xl p-6">
          <h1 className="text-2xl font-bold mb-4">Chi tiết người dùng</h1>
          <div className="space-y-2 text-gray-200">
            <div>
              <span className="text-gray-400">Họ tên:</span>{" "}
              {user.fullName || "(Không tên)"}
            </div>
            <div>
              <span className="text-gray-400">Email:</span> {user.email}
            </div>
            <div>
              <span className="text-gray-400">Role:</span> {user.role}
            </div>
            {user.phone && (
              <div>
                <span className="text-gray-400">SĐT:</span> {user.phone}
              </div>
            )}
            {user.address && (
              <div>
                <span className="text-gray-400">Địa chỉ:</span> {user.address}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetail;
