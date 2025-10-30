import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api";

const CinemaSystemsList = () => {
  const navigate = useNavigate();
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await API.get("/cinema-systems");
      setSystems(res.data.systems || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const del = async (id) => {
    if (!window.confirm("Xóa hệ thống này?")) return;
    await API.delete(`/cinema-systems/${id}`);
    load();
  };

  if (loading) return <div className="p-4 text-white">Đang tải...</div>;

  return (
    <div className="p-4 text-white">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Hệ thống rạp</h1>
        <button
          onClick={() => navigate("add")}
          className="px-3 py-2 rounded-lg bg-green-500/20 border border-green-500/50 text-green-300 hover:bg-green-500/30"
        >
          + Thêm hệ thống
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <thead className="bg-white/10">
            <tr>
              <th className="text-left px-4 py-3">Tên</th>
              <th className="text-left px-4 py-3">Logo</th>
              <th className="text-left px-4 py-3">Địa chỉ</th>
              <th className="px-4 py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {systems.map((s) => (
              <tr key={s._id} className="border-t border-white/10">
                <td className="px-4 py-3">{s.name}</td>
                <td className="px-4 py-3">
                  <img src={s.logo} alt={s.name} className="h-8" />
                </td>
                <td className="px-4 py-3">{s.address}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => navigate(`${s._id}/edit`)}
                    className="mr-2 px-3 py-1 rounded bg-blue-500/20 border border-blue-500/50"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => del(s._id)}
                    className="px-3 py-1 rounded bg-red-500/20 border border-red-500/50"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CinemaSystemsList;
