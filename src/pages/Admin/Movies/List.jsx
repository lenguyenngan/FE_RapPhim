import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdminMovies } from "../../../context/AdminMoviesContext";

const List = () => {
  const { movies, deleteMovie } = useAdminMovies();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return movies;
    return movies.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        (Array.isArray(m.genre)
          ? m.genre.join(" ").toLowerCase().includes(q)
          : String(m.genre || "")
              .toLowerCase()
              .includes(q)) ||
        String(m.duration || "").includes(q)
    );
  }, [movies, query]);

  const handleDelete = (movieId) => {
    if (window.confirm("Bạn có chắc muốn xóa phim này?")) {
      deleteMovie(movieId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-slate-900 px-6 py-10 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              🎬 Danh sách phim
            </h1>
            <p className="text-gray-400 mt-1">
              Quản lý phim — thêm, sửa, xóa hoặc tìm kiếm dễ dàng
            </p>
          </div>

          <div className="flex gap-3 items-center">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder=" Tìm kiếm phim..."
              className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-purple-400 placeholder-gray-400 w-56"
            />
            <button
              onClick={() => navigate("/admin/movies/add")}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:opacity-90 transition-all"
            >
              + Thêm phim
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-white/5 text-gray-300 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-5 py-3">Poster</th>
                <th className="px-5 py-3">Mã</th>
                <th className="px-5 py-3">Tiêu đề</th>
                <th className="px-5 py-3">Thể loại</th>
                <th className="px-5 py-3">Thời lượng</th>
                <th className="px-5 py-3">Trạng thái</th>
                <th className="px-5 py-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr
                  key={m.movieId}
                  className="border-t border-white/10 hover:bg-white/5 transition-all"
                >
                  <td className="px-5 py-3">
                    <img
                      alt={m.title}
                      src={m.poster}
                      className="h-20 w-14 object-cover rounded-lg shadow-md border border-white/20"
                    />
                  </td>
                  <td className="px-5 py-3 text-gray-300 font-mono">
                    {m.movieId}
                  </td>
                  <td className="px-5 py-3 font-semibold text-white hover:text-purple-300">
                    <Link to={`/admin/movies/${m.movieId}`}>{m.title}</Link>
                  </td>
                  <td className="px-5 py-3 text-gray-400">
                    {Array.isArray(m.genre) ? m.genre.join(", ") : m.genre}
                  </td>
                  <td className="px-5 py-3 text-gray-400">{m.duration} phút</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-block px-3 py-[6px] rounded-full text-xs font-semibold border whitespace-nowrap text-center min-w-[90px] ${
                        m.status === "showing"
                          ? "bg-green-500/20 text-green-300 border-green-500/40"
                          : "bg-yellow-500/20 text-yellow-300 border-yellow-500/40"
                      }`}
                    >
                      {m.status === "showing" ? "Đang chiếu" : "Sắp chiếu"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() =>
                          navigate(`/admin/movies/${m.movieId}/edit`)
                        }
                        className="px-3 py-1 rounded-lg bg-purple-500/20 border border-purple-500/50 text-purple-200 hover:bg-purple-500/30 transition-all"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(m.movieId)}
                        className="px-3 py-1 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 hover:bg-red-500/30 transition-all"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-8 text-center text-gray-400 italic"
                  >
                    Không tìm thấy phim phù hợp 😢
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

export default List;
