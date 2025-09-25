import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ResetPassword from "./pages/Auth/ResetPassword";
import Profile from "./pages/Auth/Profile";
import EditProfile from "./pages/Auth/EditProfile";
import Home from "./pages/Home/Home";
import MovieDetail from "./pages/Movies/MovieDetail";
import Dashboard from "./pages/Admin/Dashboard";
import AdminUsersList from "./pages/Admin/Users/List";
import AdminUserDetail from "./pages/Admin/Users/Detail";
import AdminMoviesList from "./pages/Admin/Movies/List";
import AdminMovieForm from "./pages/Admin/Movies/Form";
import AdminMovieDetail from "./pages/Admin/Movies/Detail";
import { AdminMoviesProvider } from "./context/AdminMoviesContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";
import "./App.css";
import Booking from "./pages/Movies/Booking";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen flex flex-col">
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movies/:movieId" element={<MovieDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminUsersList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users/:id"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminUserDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/movies"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminMoviesProvider>
                      <AdminMoviesList />
                    </AdminMoviesProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/movies/add"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminMoviesProvider>
                      <AdminMovieForm />
                    </AdminMoviesProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/movies/:movieId"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminMoviesProvider>
                      <AdminMovieDetail />
                    </AdminMoviesProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/movies/:movieId/edit"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminMoviesProvider>
                      <AdminMovieForm />
                    </AdminMoviesProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/edit"
                element={
                  <ProtectedRoute>
                    <EditProfile />
                  </ProtectedRoute>
                }
              />
              <Route path="/booking" element={<Booking />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
