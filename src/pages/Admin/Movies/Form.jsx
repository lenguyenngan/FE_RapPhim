import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdminMovies } from "../../../context/AdminMoviesContext";
import AnimatedSuccessNotification from "../../../components/AnimatedSuccessNotification";

const empty = {
  movieId: "",
  title: "",
  description: "",
  genre: "",
  duration: "",
  releaseDate: "",
  poster: "",
  trailer: "",
  language: "Tiếng Anh - Phụ đề Việt",
  rating: "C13",
  director: "",
  cast: "",
  imdbRating: "",
  isHot: false,
  isComingSoon: false,
  status: "showing",
};

const Form = () => {
  const { movieId } = useParams();
  const isEdit = Boolean(movieId);
  const navigate = useNavigate();
  const { addMovie, updateMovie, getMovieById } = useAdminMovies();

  const existing = useMemo(
    () => (isEdit ? getMovieById(movieId) : null),
    [isEdit, movieId, getMovieById]
  );

  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [notify, setNotify] = useState(null);
  const GENRE_OPTIONS = [
    "Hành động",
    "Phiêu lưu",
    "Khoa học viễn tưởng",
    "Siêu anh hùng",
    "Drama",
    "Tội phạm",
    "Kinh dị",
    "Hài",
    "Tâm lý",
    "Lãng mạn",
    "Hoạt hình",
  ];
  const [isGenreOpen, setIsGenreOpen] = useState(false);

  useEffect(() => {
    if (isEdit && existing) {
      setValues({
        movieId: existing.movieId,
        title: existing.title || "",
        description: existing.description || "",
        genre: Array.isArray(existing.genre)
          ? existing.genre.join(", ")
          : existing.genre || "",
        duration: existing.duration || "",
        releaseDate: existing.releaseDate
          ? new Date(existing.releaseDate).toISOString().split("T")[0]
          : "",
        poster: existing.poster || "",
        trailer: existing.trailer || "",
        language: existing.language || "Tiếng Anh - Phụ đề Việt",
        rating: existing.rating || "C13",
        director: existing.director || "",
        cast: Array.isArray(existing.cast)
          ? existing.cast.join(", ")
          : existing.cast || "",
        imdbRating: existing.imdbRating ?? "",
        isHot: Boolean(existing.isHot),
        isComingSoon: Boolean(existing.isComingSoon),
        status: existing.status || "showing",
      });
    }
  }, [isEdit, existing]);

  const validate = () => {
    const e = {};
    if (!values.title.trim()) e.title = "Nhập tiêu đề";
    if (!values.description.trim()) e.description = "Nhập mô tả";
    if (!values.genre.trim()) e.genre = "Nhập thể loại";
    if (!String(values.duration).trim() || Number(values.duration) <= 0)
      e.duration = "Thời lượng > 0";
    if (!values.releaseDate) e.releaseDate = "Chọn ngày chiếu";
    else {
      const sel = new Date(values.releaseDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (!(sel instanceof Date) || isNaN(sel.getTime()) || sel <= today) {
        e.releaseDate = "Ngày chiếu phải sau hôm nay";
      }
    }
    if (!values.poster && !values.posterFile)
      e.poster = "Chọn ảnh hoặc nhập URL";
    if (!values.trailer && !values.trailerFile)
      e.trailer = "Tải trailer hoặc nhập URL";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (!validate()) return;

    const base = {
      title: values.title.trim(),
      description: values.description.trim(),
      genre: values.genre
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean),
      duration: Number(values.duration),
      releaseDate: values.releaseDate,
      language: values.language.trim(),
      rating: values.rating.trim(),
      director: values.director.trim(),
      cast: values.cast
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      imdbRating:
        values.imdbRating !== "" ? Number(values.imdbRating) : undefined,
      isHot: Boolean(values.isHot),
      isComingSoon: Boolean(values.isComingSoon),
      status: values.status,
    };

    const fd = new FormData();
    Object.entries(base).forEach(([k, v]) =>
      fd.append(k, Array.isArray(v) ? v.join(",") : v)
    );
    if (values.posterFile) fd.append("poster", values.posterFile);
    else if (values.poster) fd.append("poster", values.poster.trim());
    if (values.trailerFile) fd.append("trailer", values.trailerFile);
    else if (values.trailer) fd.append("trailer", values.trailer.trim());

    try {
      if (isEdit) {
        fd.append("movieId", values.movieId);
        await updateMovie(movieId, fd);
        setNotify({ type: "success", msg: "Cập nhật phim thành công" });
        navigate(`/admin/movies/${movieId}`);
      } else {
        // Lấy movieId mới từ backend
        const res = await fetch("/api/movies/new-id");
        const data = await res.json();
        fd.append("movieId", data.movieId);

        await addMovie(fd);
        setNotify({ type: "success", msg: "Thêm phim thành công" });
        navigate("/admin/movies");
      }
    } catch (e) {
      setNotify({
        type: "error",
        msg: e?.response?.data?.message || e.message || "Thao tác thất bại",
      });
    }
  };

  const onChange = (key) => (e) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));
  const onFile = (key) => (e) => {
    const file = e.target.files?.[0];
    setValues((v) => ({ ...v, [key]: file }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white/10 border border-white/20 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-white mb-4">
          {isEdit ? "Sửa phim" : "Thêm phim"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Tiêu đề</label>
            <input
              value={values.title}
              onChange={onChange("title")}
              className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
            />
            {errors.title && (
              <p className="text-red-300 text-sm mt-1">{errors.title}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Mô tả</label>
            <textarea
              value={values.description}
              onChange={onChange("description")}
              rows="4"
              className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
            />
            {errors.description && (
              <p className="text-red-300 text-sm mt-1">{errors.description}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-gray-300 mb-1">Thể loại</label>
              <button
                type="button"
                onClick={() => setIsGenreOpen((o) => !o)}
                className="w-full flex items-center justify-between px-4 py-2 rounded-xl bg-white text-black border border-gray-300 focus:outline-none"
              >
                <span className="truncate text-left">
                  {values.genre?.trim()
                    ? values.genre
                        .split(",")
                        .map((g) => g.trim())
                        .filter(Boolean)
                        .join(", ")
                    : "Chọn thể loại"}
                </span>
                <svg
                  className={`w-5 h-5 transition-transform ${
                    isGenreOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {isGenreOpen && (
                <div className="absolute z-20 mt-2 w-full rounded-xl bg-white border border-gray-300 shadow-xl">
                  <div className="max-h-56 overflow-y-auto p-2 custom-scroll">
                    {GENRE_OPTIONS.map((g) => {
                      const selected = values.genre
                        .split(",")
                        .map((x) => x.trim())
                        .filter(Boolean);
                      const checked = selected.includes(g);
                      return (
                        <label
                          key={g}
                          className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 cursor-pointer text-black"
                        >
                          <input
                            type="checkbox"
                            className="accent-purple-500"
                            checked={checked}
                            onChange={(e) => {
                              const set = new Set(selected);
                              if (e.target.checked) set.add(g);
                              else set.delete(g);
                              setValues((v) => ({
                                ...v,
                                genre: Array.from(set).join(", "),
                              }));
                            }}
                          />
                          <span>{g}</span>
                        </label>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between gap-2 p-2 border-t border-gray-200 bg-gray-50">
                    <button
                      type="button"
                      onClick={() =>
                        setValues((v) => ({
                          ...v,
                          genre: GENRE_OPTIONS.join(", "),
                        }))
                      }
                      className="px-3 py-1 text-xs rounded-lg bg-white text-black border border-gray-300 hover:bg-gray-100"
                    >
                      Chọn tất cả
                    </button>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setValues((v) => ({ ...v, genre: "" }))}
                        className="px-3 py-1 text-xs rounded-lg bg-white text-black border border-gray-300 hover:bg-gray-100"
                      >
                        Xóa
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsGenreOpen(false)}
                        className="px-3 py-1 text-xs rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                      >
                        Xong
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {errors.genre && (
                <p className="text-red-300 text-sm mt-1">{errors.genre}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-300 mb-1">
                Thời lượng (phút)
              </label>
              <input
                type="number"
                value={values.duration}
                onChange={onChange("duration")}
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
              />
              {errors.duration && (
                <p className="text-red-300 text-sm mt-1">{errors.duration}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-1">Đạo diễn</label>
              <input
                value={values.director}
                onChange={onChange("director")}
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">
                Diễn viên (phân cách bằng dấu phẩy)
              </label>
              <input
                value={values.cast}
                onChange={onChange("cast")}
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-300 mb-1">
                Độ tuổi (Rating)
              </label>
              <select
                value={values.rating}
                onChange={onChange("rating")}
                className="w-full px-4 py-2 rounded-xl bg-white text-black border border-gray-300 focus:outline-none"
              >
                <option value="P">P</option>
                <option value="C13">C13</option>
                <option value="C16">C16</option>
                <option value="C18">C18</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Ngôn ngữ</label>
              <select
                value={values.language}
                onChange={onChange("language")}
                className="w-full px-4 py-2 rounded-xl bg-white text-black border border-gray-300 focus:outline-none"
              >
                <option value="Tiếng Anh - Phụ đề Việt">
                  Tiếng Anh - Phụ đề Việt
                </option>
                <option value="Lồng tiếng Việt">Lồng tiếng Việt</option>
                <option value="Tiếng Hàn - Phụ đề Việt">
                  Tiếng Hàn - Phụ đề Việt
                </option>
                <option value="Tiếng Nhật - Phụ đề Việt">
                  Tiếng Nhật - Phụ đề Việt
                </option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-1">IMDb Rating</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={values.imdbRating}
                onChange={onChange("imdbRating")}
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 text-white">
              <input
                type="checkbox"
                checked={values.isHot}
                onChange={(e) =>
                  setValues((v) => ({ ...v, isHot: e.target.checked }))
                }
                className="accent-purple-500"
              />
              Phim Hot
            </label>
            <label className="flex items-center gap-3 text-white">
              <input
                type="checkbox"
                checked={values.isComingSoon}
                onChange={(e) =>
                  setValues((v) => ({ ...v, isComingSoon: e.target.checked }))
                }
                className="accent-purple-500"
              />
              Sắp chiếu
            </label>
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Ngày khởi chiếu</label>
            <input
              type="date"
              value={values.releaseDate}
              onChange={onChange("releaseDate")}
              className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
            />
            {errors.releaseDate && (
              <p className="text-red-300 text-sm mt-1">{errors.releaseDate}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-1">Poster</label>
              <input
                placeholder="URL"
                value={values.poster}
                onChange={onChange("poster")}
                className="mb-2 w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
              />
              <input
                type="file"
                accept="image/*"
                onChange={onFile("posterFile")}
                className="w-full text-gray-300"
              />
              {errors.poster && (
                <p className="text-red-300 text-sm mt-1">{errors.poster}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Trailer</label>
              <input
                placeholder="URL"
                value={values.trailer}
                onChange={onChange("trailer")}
                className="mb-2 w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
              />
              <input
                type="file"
                accept="video/*"
                onChange={onFile("trailerFile")}
                className="w-full text-gray-300"
              />
              {errors.trailer && (
                <p className="text-red-300 text-sm mt-1">{errors.trailer}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Trạng thái</label>
            <select
              value={values.status}
              onChange={onChange("status")}
              className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
            >
              <option value="showing">Đang chiếu</option>
              <option value="coming_soon">Sắp chiếu</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-gray-200 hover:bg-white/20"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/50 text-blue-300 hover:bg-blue-500/30"
            >
              {isEdit ? "Lưu thay đổi" : "Thêm phim"}
            </button>
          </div>
        </form>
      </div>
      {notify?.type === "success" && (
        <AnimatedSuccessNotification
          message={notify.msg}
          onClose={() => setNotify(null)}
        />
      )}
      {notify?.type === "error" && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-600/90 text-white px-4 py-3 rounded-xl border border-red-500">
          {notify.msg}
        </div>
      )}
    </div>
  );
};
export default Form;
