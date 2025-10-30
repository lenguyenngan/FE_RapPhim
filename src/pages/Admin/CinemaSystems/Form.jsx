import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../api";

const Form = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [values, setValues] = useState({ name: "", logo: "", address: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      const res = await API.get("/cinema-systems");
      const s = (res.data.systems || []).find((x) => x._id === id);
      if (s)
        setValues({
          name: s.name || "",
          logo: s.logo || "",
          address: s.address || "",
        });
    })();
  }, [isEdit, id]);

  const validate = () => {
    const e = {};
    if (!values.name.trim()) e.name = "Tên bắt buộc";
    if (!values.logo.trim()) e.logo = "Logo không rỗng";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    if (isEdit) await API.put(`/cinema-systems/${id}`, values);
    else await API.post(`/cinema-systems`, values);
    navigate("/admin/cinema-systems");
  };

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">
        {isEdit ? "Sửa hệ thống" : "Thêm hệ thống"}
      </h1>
      <form onSubmit={submit} className="space-y-4 max-w-xl">
        <div>
          <label className="block mb-1">Tên hệ thống</label>
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
          <label className="block mb-1">Logo URL</label>
          <input
            value={values.logo}
            onChange={(e) => setValues((v) => ({ ...v, logo: e.target.value }))}
            className="w-full px-4 py-2 rounded bg-white/10 border border-white/20"
          />
          {errors.logo && (
            <p className="text-red-300 text-sm mt-1">{errors.logo}</p>
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
