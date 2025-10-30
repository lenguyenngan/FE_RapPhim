import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAdminMovies } from "../../../context/AdminMoviesContext";

const Detail = () => {
  const { movieId } = useParams();
  const { getMovieById, updateMovie } = useAdminMovies();
  const navigate = useNavigate();
  const movie = useMemo(() => getMovieById(movieId), [getMovieById, movieId]);

  const [quickTitle, setQuickTitle] = useState(movie?.title || "");

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8">
        <div className="max-w-4xl mx-auto text-white">Không tìm thấy phim.</div>
      </div>
    );
  }

  const saveQuick = () => {
    if (quickTitle.trim()) {
      updateMovie(movie.movieId, { title: quickTitle.trim() });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-start gap-6">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-48 h-72 object-cover rounded-xl border border-white/20"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">{movie.title}</h1>
              <div className="flex gap-2">
                <Link
                  to={`/admin/movies/${movie.movieId}/edit`}
                  className="px-3 py-1 rounded-lg bg-purple-500/20 border border-purple-500/50 text-purple-200 hover:bg-purple-500/30"
                >
                  Sửa
                </Link>
                <button
                  onClick={() => navigate("/admin")}
                  className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-gray-200 hover:bg-white/20"
                >
                  Quay lại
                </button>
              </div>
            </div>
            <p className="text-gray-300 mt-3">{movie.description}</p>
            <div className="mt-4 text-gray-300 space-y-1">
              <p>
                <span className="text-gray-400">Mã:</span> {movie.movieId}
              </p>
              <p>
                <span className="text-gray-400">Thể loại:</span>{" "}
                {Array.isArray(movie.genre)
                  ? movie.genre.join(", ")
                  : movie.genre}
              </p>
              <p>
                <span className="text-gray-400">Thời lượng:</span>{" "}
                {movie.duration} phút
              </p>
              <p>
                <span className="text-gray-400">Trailer:</span>{" "}
                <a
                  href={movie.trailer}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-300 hover:underline"
                >
                  Xem trailer
                </a>
              </p>
              <p>
                <span className="text-gray-400">Trạng thái:</span>{" "}
                {movie.status === "showing" ? "Đang chiếu" : "Sắp chiếu"}
              </p>
            </div>

            <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-white font-semibold mb-2">
                Chỉnh nhanh tiêu đề
              </p>
              <div className="flex gap-2">
                <input
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
                />
                <button
                  onClick={saveQuick}
                  className="px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/50 text-blue-300 hover:bg-blue-500/30"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
