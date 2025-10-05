// src/api/booking.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/bookings";

export const lockSeats = async ({ showtimeId, seatIds }) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    `${API_URL}/lock`,
    { showtimeId, seatIds },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data; // { lockId, expiresIn, message }
};

export const confirmBooking = async ({
  showtimeId,
  seatIds,
  lockId,
  movieId,
  combos,
}) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    `${API_URL}/confirm`,
    { showtimeId, seatIds, lockId, movieId, combos, paymentMethod: "card" },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data; // { booking, message }
};
