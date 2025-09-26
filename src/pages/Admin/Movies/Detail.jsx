import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdminMovies } from "../../../context/AdminMoviesContext";

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { movies } = useAdminMovies();

  const movie = movies.find((m) => String(m.movieId) === String(id));

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300 text-lg mb-4">Không tìm thấy phim</p>
          <button
            onClick={() => navigate("/admin/movies")}
            className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/50 text-blue-300 hover:bg-blue-500/30"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white/10 border border-white/20 rounded-2xl p-6">
        <div className="flex items-start gap-6">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-48 h-72 object-cover rounded-xl border border-white/20"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">
              {movie.title}
            </h1>
            <p className="text-gray-300 mb-2">
              <span className="font-semibold text-white">Mã phim:</span>{" "}
              {movie.movieId}
            </p>
            <p className="text-gray-300 mb-2">
              <span className="font-semibold text-white">Thể loại:</span>{" "}
              {Array.isArray(movie.genre)
                ? movie.genre.join(", ")
                : movie.genre}
            </p>
            <p className="text-gray-300 mb-2">
              <span className="font-semibold text-white">Thời lượng:</span>{" "}
              {movie.duration} phút
            </p>
            <p className="text-gray-300 mb-4">
              <span className="font-semibold text-white">Trạng thái:</span>{" "}
              <span
                className={`px-2 py-1 rounded-md text-xs ${
                  movie.status === "showing"
                    ? "bg-green-500/20 text-green-300 border border-green-500/40"
                    : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40"
                }`}
              >
                {movie.status === "showing" ? "Đang chiếu" : "Sắp chiếu"}
              </span>
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/admin/movies/${movie.movieId}/edit`)}
                className="px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/50 text-purple-200 hover:bg-purple-500/30"
              >
                Sửa
              </button>
              <button
                onClick={() => navigate("/admin/movies")}
                className="px-4 py-2 rounded-lg bg-gray-500/20 border border-gray-500/40 text-gray-300 hover:bg-gray-500/30"
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
