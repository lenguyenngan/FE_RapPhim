import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../api";

const Form = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [cinemas, setCinemas] = useState([]);
  const [values, setValues] = useState({
    name: "",
    capacity: 0,
    type: "2D",
    cinemaId: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    (async () => {
      const res = await API.get("/cinemas");
      setCinemas(res.data.cinemas || []);
    })();
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      const res = await API.get("/rooms");
      const r = (res.data.rooms || []).find((x) => x._id === id);
      if (r)
        setValues({
          name: r.name || "",
          capacity: r.capacity || 0,
          type: r.type || "2D",
          cinemaId: r.cinemaId || "",
        });
    })();
  }, [isEdit, id]);

  const validate = () => {
    const e = {};
    if (!values.name.trim()) e.name = "Tên bắt buộc";
    if (!values.cinemaId) e.cinemaId = "Chọn cụm rạp";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    if (isEdit) await API.put(`/rooms/${id}`, values);
    else await API.post(`/rooms`, values);
    navigate("/admin/rooms");
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
        <h1 className="text-2xl font-bold mb-4">
          {isEdit ? "Sửa phòng" : "Thêm phòng"}
        </h1>
        <form onSubmit={submit} className="space-y-4 max-w-xl">
          <div>
            <label className="block mb-1">Tên phòng</label>
            <input
              value={values.name}
              onChange={(e) =>
                setValues((v) => ({ ...v, name: e.target.value }))
              }
              className="w-full px-4 py-2 rounded bg-white/10 border border-white/20"
            />
            {errors.name && (
              <p className="text-red-300 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block mb-1">Sức chứa</label>
            <input
              type="number"
              value={values.capacity}
              onChange={(e) =>
                setValues((v) => ({ ...v, capacity: Number(e.target.value) }))
              }
              className="w-full px-4 py-2 rounded bg-white/10 border border-white/20"
            />
          </div>
          <div>
            <label className="block mb-1">Loại phòng</label>
            <select
              value={values.type}
              onChange={(e) =>
                setValues((v) => ({ ...v, type: e.target.value }))
              }
              className="w-full px-4 py-2 rounded bg-white text-black"
            >
              <option value="2D">2D</option>
              <option value="3D">3D</option>
              <option value="IMAX">IMAX</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Cụm rạp</label>
            <select
              value={values.cinemaId}
              onChange={(e) =>
                setValues((v) => ({ ...v, cinemaId: e.target.value }))
              }
              className="w-full px-4 py-2 rounded bg-white text-black"
            >
              <option value="">-- Chọn cụm rạp --</option>
              {cinemas.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.cinemaId && (
              <p className="text-red-300 text-sm mt-1">{errors.cinemaId}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded bg-white/10 border border-white/20"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-500/20 border border-green-500/50 text-green-300"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
