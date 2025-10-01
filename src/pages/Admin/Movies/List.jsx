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
    if (window.confirm("Xóa phim này?")) {
      deleteMovie(movieId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Danh sách phim</h1>
            <p className="text-gray-300">Quản lý phim: thêm, sửa, xóa</p>
          </div>
          <div className="flex gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm phim..."
              className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
            />
            <button
              onClick={() => navigate("/admin/movies/add")}
              className="px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/50 text-blue-300 hover:bg-blue-500/30"
            >
              + Thêm phim
            </button>
          </div>
        </div>

        <div className="overflow-x-auto bg-white/10 border border-white/20 rounded-2xl">
          <table className="min-w-full text-sm text-left">
            <thead className="text-gray-300">
              <tr>
                <th className="px-4 py-3">Poster</th>
                <th className="px-4 py-3">Mã</th>
                <th className="px-4 py-3">Tiêu đề</th>
                <th className="px-4 py-3">Thể loại</th>
                <th className="px-4 py-3">Thời lượng</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr
                  key={m.movieId}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="px-4 py-3">
                    <img
                      alt={m.title}
                      src={m.poster}
                      className="h-16 w-12 object-cover rounded-md"
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-300">{m.movieId}</td>
                  <td className="px-4 py-3 text-white font-medium">
                    <Link
                      to={`/admin/movies/${m.movieId}`}
                      className="hover:underline"
                    >
                      {m.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {Array.isArray(m.genre) ? m.genre.join(", ") : m.genre}
                  </td>
                  <td className="px-4 py-3 text-gray-300">{m.duration} phút</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-md text-xs ${
                        m.status === "showing"
                          ? "bg-green-500/20 text-green-300 border border-green-500/40"
                          : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40"
                      }`}
                    >
                      {m.status === "showing" ? "Đang chiếu" : "Sắp chiếu"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          navigate(`/admin/movies/${m.movieId}/edit`)
                        }
                        className="px-3 py-1 rounded-lg bg-purple-500/20 border border-purple-500/50 text-purple-200 hover:bg-purple-500/30"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(m.movieId)}
                        className="px-3 py-1 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 hover:bg-red-500/30"
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
                    className="px-4 py-6 text-center text-gray-400"
                    colSpan="7"
                  >
                    Không có phim phù hợp.
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
