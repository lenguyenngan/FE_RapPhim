import React from "react";
import { useNavigate } from "react-router-dom";
import { useAdminMovies } from "../../../context/AdminMoviesContext";

const List = () => {
  const navigate = useNavigate();
  const { movies, deleteMovie } = useAdminMovies();

  const handleDelete = async (movieId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phim này?")) {
      await deleteMovie(movieId);
      alert("Đã xóa phim thành công!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8">
      <div className="max-w-6xl mx-auto bg-white/10 border border-white/20 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Quản lý phim</h1>
          <button
            onClick={() => navigate("/admin/movies/add")}
            className="px-4 py-2 rounded-xl bg-green-500/20 border border-green-500/50 text-green-300 hover:bg-green-500/30"
          >
            + Thêm phim
          </button>
        </div>

        {movies.length === 0 ? (
          <p className="text-gray-300">Chưa có phim nào.</p>
        ) : (
          <table className="w-full border-collapse text-white">
            <thead>
              <tr className="bg-white/10">
                <th className="p-3 border border-white/20">Poster</th>
                <th className="p-3 border border-white/20">Tên phim</th>
                <th className="p-3 border border-white/20">Thể loại</th>
                <th className="p-3 border border-white/20">Thời lượng</th>
                <th className="p-3 border border-white/20">Trạng thái</th>
                <th className="p-3 border border-white/20">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie.movieId} className="hover:bg-white/5">
                  <td className="p-3 border border-white/20">
                    {movie.poster ? (
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-16 h-24 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400">Không có</span>
                    )}
                  </td>
                  <td className="p-3 border border-white/20">{movie.title}</td>
                  <td className="p-3 border border-white/20">
                    {Array.isArray(movie.genre)
                      ? movie.genre.join(", ")
                      : movie.genre}
                  </td>
                  <td className="p-3 border border-white/20">
                    {movie.duration} phút
                  </td>
                  <td className="p-3 border border-white/20">
                    {movie.status === "showing" ? "Đang chiếu" : "Sắp chiếu"}
                  </td>
                  <td className="p-3 border border-white/20">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          navigate(`/admin/movies/${movie.movieId}/edit`)
                        }
                        className="px-3 py-1 rounded-lg bg-blue-500/20 border border-blue-500/50 text-blue-300 hover:bg-blue-500/30"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(movie.movieId)}
                        className="px-3 py-1 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default List;
