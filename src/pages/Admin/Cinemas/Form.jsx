import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../api";

const Form = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [systems, setSystems] = useState([]);
  const [values, setValues] = useState({
    name: "",
    address: "",
    phone: "",
    systemId: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    (async () => {
      const res = await API.get("/cinema-systems");
      setSystems(res.data.systems || []);
    })();
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      const res = await API.get("/cinemas");
      const c = (res.data.cinemas || []).find((x) => x._id === id);
      if (c)
        setValues({
          name: c.name || "",
          address: c.address || "",
          phone: c.phone || "",
          systemId: c.systemId || "",
        });
    })();
  }, [isEdit, id]);

  const validate = () => {
    const e = {};
    if (!values.name.trim()) e.name = "Tên bắt buộc";
    if (!values.systemId) e.systemId = "Chọn hệ thống";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    if (isEdit) await API.put(`/cinemas/${id}`, values);
    else await API.post(`/cinemas`, values);
    navigate("/admin/cinemas");
  };

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">
        {isEdit ? "Sửa cụm rạp" : "Thêm cụm rạp"}
      </h1>
      <form onSubmit={submit} className="space-y-4 max-w-xl">
        <div>
          <label className="block mb-1">Tên cụm rạp</label>
          <input
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            className="w-full px-4 py-2 rounded bg-white/10 border border-white/20"
          />
          {errors.name && (
            <p className="text-red-300 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <label className="block mb-1">Địa chỉ</label>
          <input
            value={values.address}
            onChange={(e) =>
              setValues((v) => ({ ...v, address: e.target.value }))
            }
            className="w-full px-4 py-2 rounded bg-white/10 border border-white/20"
          />
        </div>
        <div>
          <label className="block mb-1">Điện thoại</label>
          <input
            value={values.phone}
            onChange={(e) =>
              setValues((v) => ({ ...v, phone: e.target.value }))
            }
            className="w-full px-4 py-2 rounded bg-white/10 border border-white/20"
          />
        </div>
        <div>
          <label className="block mb-1">Hệ thống</label>
          <select
            value={values.systemId}
            onChange={(e) =>
              setValues((v) => ({ ...v, systemId: e.target.value }))
            }
            className="w-full px-4 py-2 rounded bg-white text-black"
          >
            <option value="">-- Chọn hệ thống --</option>
            {systems.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
          {errors.systemId && (
            <p className="text-red-300 text-sm mt-1">{errors.systemId}</p>
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
  );
};

export default Form;
