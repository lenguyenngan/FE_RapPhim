import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ResetPassword from "./pages/Auth/ResetPassword";
import Profile from "./pages/Auth/Profile";
import EditProfile from "./pages/Auth/EditProfile";
import Home from "./pages/Home/Home";
import MovieDetail from "./pages/Movies/MovieDetail";
import Booking from "./pages/Movies/Booking";
import Payment from "./pages/Movies/Payment";
import History from "./pages/Movies/History";
import ConfirmTicket from "./pages/Movies/ConfirmTicket";
import Dashboard from "./pages/Admin/Dashboard";
import CinemaSystemsList from "./pages/Admin/CinemaSystems/List";
import CinemaSystemForm from "./pages/Admin/CinemaSystems/Form";
import CinemasList from "./pages/Admin/Cinemas/List";
import CinemaForm from "./pages/Admin/Cinemas/Form";
import RoomsList from "./pages/Admin/Rooms/List";
import RoomForm from "./pages/Admin/Rooms/Form";
import AdminUsersList from "./pages/Admin/Users/List";
import AdminUserDetail from "./pages/Admin/Users/Detail";
import AdminMoviesList from "./pages/Admin/Movies/List";
import AdminMovieForm from "./pages/Admin/Movies/Form";
import AdminMovieDetail from "./pages/Admin/Movies/Detail";
import BookingsList from "./pages/Admin/Bookings/List";
import { AdminMoviesProvider } from "./context/AdminMoviesContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";
import "./App.css";

// Component để kiểm tra xem có nên hiển thị Footer hay không
const AppContent = () => {
  const location = useLocation();

  // Các route không hiển thị Footer
  const noFooterRoutes = ["/login", "/register", "/reset-password"];
  const isAdminRoute = location.pathname.startsWith("/admin");
  const shouldShowFooter =
    !noFooterRoutes.includes(location.pathname) && !isAdminRoute;

  return (
    <div className="App min-h-screen flex flex-col">
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies/:movieId" element={<MovieDetail />} />
          <Route
            path="/booking"
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/confirm-ticket"
            element={
              <ProtectedRoute>
                <ConfirmTicket />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
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
            path="/admin/cinema-systems"
            element={
              <ProtectedRoute requireAdmin={true}>
                <CinemaSystemsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/cinema-systems/add"
            element={
              <ProtectedRoute requireAdmin={true}>
                <CinemaSystemForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/cinema-systems/:id/edit"
            element={
              <ProtectedRoute requireAdmin={true}>
                <CinemaSystemForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/cinemas"
            element={
              <ProtectedRoute requireAdmin={true}>
                <CinemasList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/cinemas/add"
            element={
              <ProtectedRoute requireAdmin={true}>
                <CinemaForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/cinemas/:id/edit"
            element={
              <ProtectedRoute requireAdmin={true}>
                <CinemaForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/rooms"
            element={
              <ProtectedRoute requireAdmin={true}>
                <RoomsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/rooms/add"
            element={
              <ProtectedRoute requireAdmin={true}>
                <RoomForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/rooms/:id/edit"
            element={
              <ProtectedRoute requireAdmin={true}>
                <RoomForm />
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
            path="/admin/bookings"
            element={
              <ProtectedRoute requireAdmin={true}>
                <BookingsList />
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {shouldShowFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
