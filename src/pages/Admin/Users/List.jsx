import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api";

const AdminUsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/users");
        setUsers(res.data.users || []);
      } catch (e) {
        // Fallback to empty list on error; keeps UI stable
        setUsers([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">
          Quản lý người dùng
        </h1>
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden">
          <table className="w-full text-left">
            <thead className="text-gray-300">
              <tr>
                <th className="py-3 px-4">Họ tên</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t border-white/10 text-white">
                  <td className="py-3 px-4">{u.fullName || "(Không tên)"}</td>
                  <td className="py-3 px-4">{u.email}</td>
                  <td className="py-3 px-4">{u.role}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      className="px-3 py-1 bg-purple-500/30 border border-purple-500/50 rounded-lg hover:bg-purple-500/40"
                      onClick={() => navigate(`/admin/users/${u._id}`)}
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td className="py-6 px-4 text-gray-400" colSpan={4}>
                    Chưa có người dùng
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersList;
