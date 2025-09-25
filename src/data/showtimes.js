// Dynamic showtimes generator for frontend (no backend dependency)
// Provides: getShowtimesByMovie(movieId) → Array<Showtime>
// Fields used by UI: showtimeId, date (YYYY-MM-DD), clusterId, hallId,
// startTime, endTime, price, availableSeats, totalSeats

const CLUSTERS = ["A01", "A02", "B01"]; // giả lập mã rạp/cụm
const HALLS = ["H1", "H2", "H3"]; // giả lập phòng chiếu
const TIME_SLOTS = [
  { start: "09:00", end: "11:30" },
  { start: "13:30", end: "16:00" },
  { start: "18:00", end: "20:30" },
  { start: "21:15", end: "23:45" },
];

function formatDateYYYYMMDD(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getNextDays(numDays) {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < numDays; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(formatDateYYYYMMDD(d));
  }
  return days;
}

// Simple deterministic seat availability per movieId/time for stable UI
function seatsAvailabilityHash(movieId, date, clusterId, startTime) {
  const base = `${movieId}|${date}|${clusterId}|${startTime}`;
  let hash = 0;
  for (let i = 0; i < base.length; i++)
    hash = (hash * 31 + base.charCodeAt(i)) % 997;
  const totalSeats = 120;
  const available = 30 + (hash % 80); // 30..109
  return { availableSeats: available, totalSeats };
}

export function getShowtimesByMovie(movieId) {
  if (!movieId) return [];
  const dates = getNextDays(7); // 7 ngày tới

  const schedule = [];
  for (const date of dates) {
    for (const clusterId of CLUSTERS) {
      for (const slot of TIME_SLOTS) {
        const { availableSeats, totalSeats } = seatsAvailabilityHash(
          movieId,
          date,
          clusterId,
          slot.start
        );

        const isWeekend = (() => {
          const [y, m, d] = date.split("-").map((n) => Number(n));
          const wd = new Date(y, m - 1, d).getDay();
          return wd === 0 || wd === 6;
        })();
        const basePrice = isWeekend ? 120000 : 100000;

        schedule.push({
          showtimeId: `${movieId}-${date}-${clusterId}-${slot.start.replace(
            ":",
            ""
          )}`,
          movieId,
          date,
          clusterId,
          hallId:
            HALLS[
              (clusterId.charCodeAt(0) + clusterId.charCodeAt(1)) % HALLS.length
            ],
          startTime: slot.start,
          endTime: slot.end,
          price: basePrice,
          availableSeats,
          totalSeats,
        });
      }
    }
  }

  return schedule;
}
