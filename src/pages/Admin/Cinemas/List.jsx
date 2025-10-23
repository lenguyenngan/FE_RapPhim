import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api";

const CinemasList = () => {
  const navigate = useNavigate();
  const [systems, setSystems] = useState([]);
  const [systemId, setSystemId] = useState("");
  const [cinemas, setCinemas] = useState([]);

  // ✅ useCallback để ổn định tham chiếu
  const loadSystems = useCallback(async () => {
    const res = await API.get("/cinema-systems");
    setSystems(res.data.systems || []);
  }, []);

  const loadCinemas = useCallback(async () => {
    const res = await API.get("/cinemas");
    setCinemas(res.data.cinemas || []);
  }, []);

  useEffect(() => {
    loadSystems();
  }, [loadSystems]);

  useEffect(() => {
    loadCinemas();
  }, [loadCinemas]);

  const del = async (id) => {
    if (!window.confirm("Xóa cụm rạp này?")) return;
    await API.delete(`/cinemas/${id}`);
    loadCinemas();
  };

  return (
    <div className="p-4 text-white">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Cụm rạp</h1>
        <button
          onClick={() => navigate("add")}
          className="px-3 py-2 rounded-lg bg-green-500/20 border border-green-500/50 text-green-300 hover:bg-green-500/30"
        >
          + Thêm cụm
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm text-gray-300 mb-1">Hệ thống</label>
        <select
          value={systemId}
          onChange={(e) => setSystemId(e.target.value)}
          className="px-3 py-2 rounded bg-white text-black"
        >
          <option value="">Tất cả</option>
          {systems.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <thead className="bg-white/10">
            <tr>
              <th className="text-left px-4 py-3">Tên</th>
              <th className="text-left px-4 py-3">Địa chỉ</th>
              <th className="text-left px-4 py-3">Điện thoại</th>
              <th className="text-left px-4 py-3">Hệ thống</th>
              <th className="px-4 py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {cinemas.map((c) => (
              <tr key={c._id} className="border-t border-white/10">
                <td className="px-4 py-3">{c.name}</td>
                <td className="px-4 py-3">{c.address}</td>
                <td className="px-4 py-3">{c.phone}</td>
                <td className="px-4 py-3">
                  {systems.find((s) => s._id === c.systemId)?.name ||
                    c.systemId}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => navigate(`${c._id}/edit`)}
                    className="mr-2 px-3 py-1 rounded bg-blue-500/20 border border-blue-500/50"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => del(c._id)}
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

export default CinemasList;
