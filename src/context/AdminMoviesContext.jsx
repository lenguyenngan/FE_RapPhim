import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import API from "../api";

const STORAGE_KEY = "admin_movies_state_v1";

const AdminMoviesContext = createContext(null);

export const AdminMoviesProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("/movies");
      setMovies(res.data.movies || []);
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(res.data.movies || [])
        );
      } catch (_) {}
    } catch (e) {
      // fallback to local cache if any
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) setMovies(JSON.parse(cached));
      } catch (_) {}
      setError(
        e?.response?.data?.message || e.message || "Lỗi tải danh sách phim"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const addMovie = useCallback(async (movieOrFormData) => {
    // Accept plain object or FormData; detect FormData by instanceof
    const isFormData =
      typeof FormData !== "undefined" && movieOrFormData instanceof FormData;
    const payload = isFormData
      ? movieOrFormData
      : movieToFormData(movieOrFormData);
    const headers = { "Content-Type": "multipart/form-data" };
    const res = await API.post("/movies", payload, { headers });
    setMovies((prev) => [res.data.movie, ...prev]);
    return res.data.movie;
  }, []);

  const updateMovie = useCallback(async (movieId, updates) => {
    const isFormData =
      typeof FormData !== "undefined" && updates instanceof FormData;
    const payload = isFormData ? updates : movieToFormData(updates, false);
    const headers = { "Content-Type": "multipart/form-data" };
    const res = await API.put(`/movies/${movieId}`, payload, { headers });
    setMovies((prev) =>
      prev.map((m) => (m.movieId === movieId ? res.data.movie : m))
    );
    return res.data.movie;
  }, []);

  const deleteMovie = useCallback(async (movieId) => {
    await API.delete(`/movies/${movieId}`);
    setMovies((prev) => prev.filter((m) => m.movieId !== movieId));
  }, []);

  const getMovieById = useCallback(
    (movieId) => movies.find((m) => m.movieId === movieId),
    [movies]
  );

  const value = useMemo(
    () => ({
      movies,
      loading,
      error,
      fetchMovies,
      addMovie,
      updateMovie,
      deleteMovie,
      getMovieById,
    }),
    [
      movies,
      loading,
      error,
      fetchMovies,
      addMovie,
      updateMovie,
      deleteMovie,
      getMovieById,
    ]
  );

  return (
    <AdminMoviesContext.Provider value={value}>
      {children}
    </AdminMoviesContext.Provider>
  );
};

export const useAdminMovies = () => {
  const ctx = useContext(AdminMoviesContext);
  if (!ctx)
    throw new Error("useAdminMovies must be used within AdminMoviesProvider");
  return ctx;
};

// Helpers
function movieToFormData(movie, includeRequired = true) {
  const fd = new FormData();
  const entries = Object.entries(movie || {});
  for (const [key, value] of entries) {
    if (value === undefined || value === null) continue;
    if (key === "genre" && Array.isArray(value)) {
      fd.append("genre", value.join(","));
    } else if (key === "cast" && Array.isArray(value)) {
      fd.append("cast", value.join(","));
    } else if (
      (key === "poster" || key === "trailer") &&
      value instanceof File
    ) {
      fd.append(key, value);
    } else {
      fd.append(key, value);
    }
  }
  return fd;
}
