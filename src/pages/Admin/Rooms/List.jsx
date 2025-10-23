import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api";

const RoomsList = () => {
  const navigate = useNavigate();
  const [cinemas, setCinemas] = useState([]);
  const [cinemaId, setCinemaId] = useState("");
  const [rooms, setRooms] = useState([]);

  const loadCinemas = useCallback(async () => {
    const res = await API.get("/cinemas");
    setCinemas(res.data.cinemas || []);
  }, []);

  const loadRooms = useCallback(async () => {
    const res = await API.get("/rooms", {
      params: cinemaId ? { cinemaId } : {},
    });
    setRooms(res.data.rooms || []);
  }, [cinemaId]); // phụ thuộc cinemaId

  useEffect(() => {
    loadCinemas();
  }, [loadCinemas]);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const del = async (id) => {
    if (!window.confirm("Xóa phòng này?")) return;
    await API.delete(`/rooms/${id}`);
    loadRooms();
  };

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
      <div className="relative z-10 p-4 text-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Phòng chiếu</h1>
          <button
            onClick={() => navigate("add")}
            className="px-3 py-2 rounded-lg bg-green-500/20 border border-green-500/50 text-green-300 hover:bg-green-500/30"
          >
            + Thêm phòng
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">Cụm rạp</label>
          <select
            value={cinemaId}
            onChange={(e) => setCinemaId(e.target.value)}
            className="px-3 py-2 rounded bg-white text-black"
          >
            <option value="">Tất cả</option>
            {cinemas.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <thead className="bg-white/10">
              <tr>
                <th className="text-left px-4 py-3">Tên</th>
                <th className="text-left px-4 py-3">Sức chứa</th>
                <th className="text-left px-4 py-3">Loại phòng</th>
                <th className="text-left px-4 py-3">Cụm rạp</th>
                <th className="px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r) => (
                <tr key={r._id} className="border-t border-white/10">
                  <td className="px-4 py-3">{r.name}</td>
                  <td className="px-4 py-3">{r.capacity}</td>
                  <td className="px-4 py-3">{r.type}</td>
                  <td className="px-4 py-3">
                    {cinemas.find((c) => c._id === r.cinemaId)?.name ||
                      r.cinemaId}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => navigate(`${r._id}/edit`)}
                      className="mr-2 px-3 py-1 rounded bg-blue-500/20 border border-blue-500/50"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => del(r._id)}
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
    </div>
  );
};

export default RoomsList;
