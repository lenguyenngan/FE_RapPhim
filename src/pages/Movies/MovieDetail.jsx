import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api";
import { getShowtimesByMovie as getMovieShowtimes } from "../../data/showtimes";
import {
  getCinemaSystems,
  getClustersBySystem,
  getHallsByCluster,
} from "../../data/cinemas";
// import { getClustersBySystem } from "../../data/cinemas";

const MovieDetail = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedSystem, setSelectedSystem] = useState("");
  const [selectedCluster, setSelectedCluster] = useState("");
  const [selectedHall, setSelectedHall] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const isYouTubeUrl = (url) => {
    if (!url) return false;
    return /youtube\.com|youtu\.be/.test(url);
  };

  const toYouTubeEmbed = (url) => {
    if (!url) return "";
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtu.be")) {
        const id = u.pathname.replace("/", "");
        return `https://www.youtube.com/embed/${id}`;
      }
      if (u.hostname.includes("youtube.com")) {
        const id = u.searchParams.get("v");
        if (id) return `https://www.youtube.com/embed/${id}`;
        // fallback for already-embed links
        if (u.pathname.startsWith("/embed/")) return url;
      }
    } catch (_) {}
    return url;
  };

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    (async () => {
      try {
        const res = await API.get(`/movies/${movieId}`);
        setMovie(res.data.movie);
        const movieShowtimes = getMovieShowtimes(movieId);
        setShowtimes(movieShowtimes);
      } catch (e) {
        console.error("Load movie failed", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [movieId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleBookTicket = (showtime) => {
    if (!user) {
      navigate("/login");
      return;
    }
    const params = new URLSearchParams({
      movieId: movie.movieId,
      date: showtime.date,
      clusterId: showtime.clusterId,
      hallId: showtime.hallId,
      startTime: showtime.startTime,
      endTime: showtime.endTime,
      price: String(showtime.price),
    });
    navigate(`/booking?${params.toString()}`);
  };

  const handleWatchTrailer = () => {
    if (movie?.trailer) {
      window.open(movie.trailer, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Không tìm thấy phim</h1>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  const filteredShowtimes = showtimes.filter((showtime) => {
    if (showtime.date !== selectedDate) return false;
    if (selectedCluster && showtime.clusterId !== selectedCluster) return false;
    if (selectedHall && showtime.hallId !== selectedHall) return false;
    return true;
  });

  const availableDates = [...new Set(showtimes.map((s) => s.date))].sort();

  // Cinema hierarchy options
  const systems = getCinemaSystems();
  const clusters = selectedSystem ? getClustersBySystem(selectedSystem) : [];
  const halls = selectedCluster ? getHallsByCluster(selectedCluster) : [];

  // Map clusterId to labels (system + cluster names) for grouped rendering
  const clusterMeta = (() => {
    const map = new Map();
    systems.forEach((sys) => {
      (sys.clusters || []).forEach((cl) => {
        map.set(cl.clusterId, {
          systemId: sys.systemId,
          systemName: sys.name,
          clusterName: cl.name,
        });
      });
    });
    return map;
  })();

  // Group filtered showtimes by cluster, optionally by hall
  const groupedByCluster = (() => {
    const groups = new Map();
    filteredShowtimes.forEach((s) => {
      const meta = clusterMeta.get(s.clusterId);
      if (selectedSystem && meta && meta.systemId !== selectedSystem) return;
      if (!groups.has(s.clusterId)) groups.set(s.clusterId, []);
      groups.get(s.clusterId).push(s);
    });
    return groups;
  })();

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

      {/* Floating Orbs */}
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
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="px-4 py-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <button
              onClick={() => navigate("/")}
              className="flex items-center text-white hover:text-purple-300 transition-colors"
            >
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Quay lại
            </button>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="text-white text-right">
                    <p className="text-sm text-gray-400">Xin chào,</p>
                    <p className="font-semibold">{user.fullName}</p>
                  </div>
                  <button
                    onClick={() => navigate("/profile")}
                    className="w-10 h-10 rounded-full overflow-hidden border border-white/30 hover:scale-105 transition-transform"
                    title="Quản lý hồ sơ"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.fullName || "U"
                        )}&background=8B5CF6&color=fff`}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => navigate("/login")}
                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                  >
                    Đăng nhập
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="px-6 py-2 bg-white/10 border border-white/30 rounded-xl text-white hover:bg-white/20 transition-all duration-300"
                  >
                    Đăng ký
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Movie Hero Section */}
        <div className="px-4 mb-12">
          <div className="max-w-7xl mx-auto">
            {/* Trailer Hero */}
            <div className="relative h-[70vh] rounded-3xl overflow-hidden shadow-2xl mb-8">
              {/* Video/Iframe layer */}
              {isYouTubeUrl(movie.trailer) ? (
                <iframe
                  title="trailer"
                  src={`${toYouTubeEmbed(
                    movie.trailer
                  )}?rel=0&autoplay=1&mute=1&playsinline=1`}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  src={movie.trailer}
                  controls
                  playsInline
                  autoPlay
                  muted
                  loop
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

              {/* Movie Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                <div className="max-w-4xl">
                  <div className="flex items-center space-x-4 mb-4">
                    {movie.isHot && (
                      <span className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-full animate-pulse">
                        🔥 HOT
                      </span>
                    )}
                    {movie.isComingSoon && (
                      <span className="px-4 py-2 bg-blue-500 text-white text-sm font-bold rounded-full">
                        🎬 SẮP CHIẾU
                      </span>
                    )}
                    <span className="px-4 py-2 bg-black/50 text-white text-sm rounded-full border border-white/30">
                      {movie.rating}
                    </span>
                  </div>

                  <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                    {movie.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-6 mb-6">
                    <div className="flex items-center">
                      <svg
                        className="w-6 h-6 text-yellow-400 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="text-white font-bold text-xl">
                        {movie.imdbRating}/10
                      </span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{movie.duration} phút</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>
                        {new Date(movie.releaseDate).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-8">
                    {movie.genre.map((g, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-purple-500/30 text-purple-200 text-sm rounded-full border border-purple-400/50"
                      >
                        {g}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={handleWatchTrailer}
                      className="px-8 py-4 bg-red-600 hover:bg-red-700 rounded-xl text-white font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-red-500/25 flex items-center"
                    >
                      <svg
                        className="w-6 h-6 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      Xem Trailer
                    </button>
                    <button className="px-8 py-4 bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl text-white font-bold text-lg transition-all duration-300 hover:scale-105 flex items-center">
                      <svg
                        className="w-6 h-6 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      Yêu thích
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Movie Details Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Info Card */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <svg
                      className="w-6 h-6 mr-3 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Nội dung phim
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {movie.description}
                  </p>
                </div>

                {/* Cast & Crew */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <svg
                      className="w-6 h-6 mr-3 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Diễn viên & Đạo diễn
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">
                        Đạo diễn
                      </h4>
                      <p className="text-gray-300 text-lg">{movie.director}</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">
                        Diễn viên chính
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {movie.cast.map((actor, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-400/30 hover:bg-purple-500/30 transition-colors"
                          >
                            {actor}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Side Info Card */}
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Thông tin chi tiết
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Ngôn ngữ:</span>
                      <span className="text-white">{movie.language}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Độ tuổi:</span>
                      <span className="text-white font-semibold">
                        {movie.rating}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Thời lượng:</span>
                      <span className="text-white">{movie.duration} phút</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Khởi chiếu:</span>
                      <span className="text-white">
                        {new Date(movie.releaseDate).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">IMDb Rating:</span>
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 text-yellow-400 mr-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span className="text-white font-semibold">
                          {movie.imdbRating}/10
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Thể loại
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.genre.map((g, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-sm rounded-full border border-purple-400/30"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Showtimes Section */}
        <div className="px-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                <svg
                  className="w-8 h-8 mr-3 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Lịch chiếu
              </h2>

              {/* Filters */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Chọn ngày
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {availableDates.map((date) => (
                      <option key={date} value={date} className="bg-slate-800">
                        {new Date(date).toLocaleDateString("vi-VN", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">
                    Hệ thống rạp
                  </label>
                  <select
                    value={selectedSystem}
                    onChange={(e) => {
                      setSelectedSystem(e.target.value);
                      setSelectedCluster("");
                      setSelectedHall("");
                    }}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="" className="bg-slate-800">
                      Tất cả hệ thống
                    </option>
                    {systems.map((s) => (
                      <option
                        key={s.systemId}
                        value={s.systemId}
                        className="bg-slate-800"
                      >
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">
                    Cụm rạp
                  </label>
                  <select
                    value={selectedCluster}
                    onChange={(e) => {
                      setSelectedCluster(e.target.value);
                      setSelectedHall("");
                    }}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="" className="bg-slate-800">
                      Tất cả cụm
                    </option>
                    {clusters.map((c) => (
                      <option
                        key={c.clusterId}
                        value={c.clusterId}
                        className="bg-slate-800"
                      >
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">
                    Phòng chiếu
                  </label>
                  <select
                    value={selectedHall}
                    onChange={(e) => setSelectedHall(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="" className="bg-slate-800">
                      Tất cả phòng
                    </option>
                    {halls.map((h) => (
                      <option
                        key={h.hallId}
                        value={h.hallId}
                        className="bg-slate-800"
                      >
                        {h.name} • {h.screenType}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Showtimes grouped by hệ thống/cụm */}
              {filteredShowtimes.length > 0 ? (
                <div className="space-y-6">
                  {[...groupedByCluster.entries()].map(([clusterId, list]) => {
                    const meta = clusterMeta.get(clusterId);
                    return (
                      <div
                        key={clusterId}
                        className="bg-white/5 border border-white/10 rounded-2xl p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="text-white font-semibold text-lg">
                              {meta?.systemName || "Hệ thống"} •{" "}
                              {meta?.clusterName || clusterId}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              Ngày{" "}
                              {new Date(selectedDate).toLocaleDateString(
                                "vi-VN"
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {list.map((showtime) => (
                            <div
                              key={showtime.showtimeId}
                              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <p className="text-gray-300 text-sm">
                                    Phòng {showtime.hallId}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-white font-bold text-lg">
                                    {formatPrice(showtime.price)}
                                  </p>
                                  <p className="text-gray-300 text-sm">
                                    {showtime.availableSeats}/
                                    {showtime.totalSeats} ghế
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="text-center">
                                  <p className="text-white font-bold text-xl">
                                    {showtime.startTime}
                                  </p>
                                  <p className="text-gray-300 text-sm">
                                    Kết thúc: {showtime.endTime}
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleBookTicket(showtime)}
                                  className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${
                                    user
                                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                                      : "bg-gray-500/20 border border-gray-500/50 text-gray-400 cursor-not-allowed"
                                  }`}
                                  disabled={!user}
                                >
                                  {user ? "Đặt vé" : "Cần đăng nhập"}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg
                    className="w-16 h-16 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Không có suất chiếu
                  </h3>
                  <p className="text-gray-300">
                    Không có suất chiếu nào cho ngày và rạp đã chọn
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        {!user && (
          <div className="px-4 mb-12">
            <div className="max-w-7xl mx-auto">
              <div className="bg-yellow-500/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-yellow-500/20 p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  🔒 Đăng nhập để đặt vé
                </h3>
                <p className="text-gray-300 mb-6">
                  Bạn cần đăng nhập để có thể đặt vé xem phim này
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate("/login")}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                  >
                    Đăng nhập
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="px-8 py-3 bg-white/10 border border-white/30 rounded-xl font-semibold text-white hover:bg-white/20 transition-all duration-300"
                  >
                    Đăng ký
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;
