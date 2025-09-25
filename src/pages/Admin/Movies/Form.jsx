import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdminMovies } from "../../../context/AdminMoviesContext.jsx";

const Form = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { getMovieById, addMovie, updateMovie } = useAdminMovies();

  const editing = Boolean(movieId);
  const existing = useMemo(
    () => (editing ? getMovieById(movieId) : null),
    [editing, movieId, getMovieById]
  );

  const [form, setForm] = useState({
    title: existing?.title || "",
    description: existing?.description || "",
    duration: existing?.duration || 120,
    releaseDate: existing?.releaseDate
      ? new Date(existing.releaseDate).toISOString().slice(0, 10)
      : new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 10),
    language: existing?.language || "Tiếng Anh - Phụ đề Việt",
    rating: existing?.rating || "C13",
    genre: Array.isArray(existing?.genre)
      ? existing.genre.join(",")
      : existing?.genre || "Hành động, Phiêu lưu",
    poster: existing?.poster || "",
    trailer: existing?.trailer || "",
    director: existing?.director || "",
    cast: Array.isArray(existing?.cast)
      ? existing.cast.join(",")
      : existing?.cast || "",
    status: existing?.status || "showing",
    isHot: Boolean(existing?.isHot),
    isComingSoon: Boolean(existing?.isComingSoon),
  });

  useEffect(() => {
    if (editing && !existing) {
      // If no movie found, go back to list
      navigate("/admin/movies");
    }
  }, [editing, existing, navigate]);

  const onChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") return setForm((f) => ({ ...f, [name]: checked }));
    if (type === "file") return setForm((f) => ({ ...f, [name]: files?.[0] }));
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      duration: Number(form.duration) || 0,
    };
    try {
      if (editing) {
        await updateMovie(existing.movieId, payload);
      } else {
        await addMovie(payload);
      }
      navigate("/admin/movies");
    } catch (err) {
      // keep simple UI, console for now
      console.error("Save movie failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">
          {editing ? "Sửa phim" : "Thêm phim"}
        </h1>

        <form
          onSubmit={onSubmit}
          className="space-y-4 bg-white/10 border border-white/20 rounded-2xl p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-gray-300 mb-2">Tiêu đề</span>
              <input
                name="title"
                value={form.title}
                onChange={onChange}
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="block text-gray-300 mb-2">
                Thời lượng (phút)
              </span>
              <input
                name="duration"
                type="number"
                value={form.duration}
                onChange={onChange}
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="block text-gray-300 mb-2">Ngày chiếu</span>
              <input
                name="releaseDate"
                type="date"
                value={form.releaseDate}
                onChange={onChange}
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="block text-gray-300 mb-2">Ngôn ngữ</span>
              <input
                name="language"
                value={form.language}
                onChange={onChange}
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
              />
            </label>
          </div>

          <label className="block">
            <span className="block text-gray-300 mb-2">Mô tả</span>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              rows={4}
              className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-gray-300 mb-2">
                Thể loại (phân tách bằng dấu phẩy)
              </span>
              <input
                name="genre"
                value={form.genre}
                onChange={onChange}
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="block text-gray-300 mb-2">
                Diễn viên (phân tách bằng dấu phẩy)
              </span>
              <input
                name="cast"
                value={form.cast}
                onChange={onChange}
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-gray-300 mb-2">Đạo diễn</span>
              <input
                name="director"
                value={form.director}
                onChange={onChange}
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="block text-gray-300 mb-2">Xếp hạng</span>
              <input
                name="rating"
                value={form.rating}
                onChange={onChange}
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-gray-300 mb-2">
                Poster (file hoặc URL)
              </span>
              <input
                name="poster"
                type="file"
                accept="image/*"
                onChange={onChange}
                className="w-full text-gray-300"
              />
            </label>
            <label className="block">
              <span className="block text-gray-300 mb-2">
                Trailer (file/video URL)
              </span>
              <input
                name="trailer"
                type="text"
                value={form.trailer}
                onChange={onChange}
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="inline-flex items-center gap-2 text-gray-200">
              <input
                type="checkbox"
                name="isHot"
                checked={form.isHot}
                onChange={onChange}
              />
              <span>Phim hot</span>
            </label>
            <label className="inline-flex items-center gap-2 text-gray-2 00">
              <input
                type="checkbox"
                name="isComingSoon"
                checked={form.isComingSoon}
                onChange={onChange}
              />
              <span>Sắp chiếu</span>
            </label>
            <label className="block">
              <span className="block text-gray-300 mb-2">Trạng thái</span>
              <select
                name="status"
                value={form.status}
                onChange={onChange}
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
              >
                <option value="showing" className="bg-slate-800">
                  Đang chiếu
                </option>
                <option value="coming_soon" className="bg-slate-800">
                  Sắp chiếu
                </option>
              </select>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-purple-500/20 border border-purple-500/50 text-purple-200 hover:bg-purple-500/30"
            >
              {editing ? "Lưu thay đổi" : "Tạo phim"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/movies")}
              className="px-6 py-2 rounded-xl bg-white/10 border border-white/20 text-gray-200 hover:bg-white/20"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
