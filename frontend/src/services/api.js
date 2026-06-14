// Tập trung tất cả API calls, dùng proxy /api -> http://localhost:5000/api
const BASE_URL = '/api';

const handleResponse = async (res, fallbackMessage) => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data.message || fallbackMessage);
    }
    return data;
};

// ==========================================
// Movies API
// ==========================================
export const fetchMovies = async () => {
    const res = await fetch(`${BASE_URL}/movies`);
    return handleResponse(res, 'Không thể tải danh sách phim');
};

export const fetchMovieById = async (id) => {
    const res = await fetch(`${BASE_URL}/movies/${id}`);
    return handleResponse(res, 'Không tìm thấy phim');
};

export const addMovie = async (movieData) => {
    const res = await fetch(`${BASE_URL}/movies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movieData)
    });
    return handleResponse(res, 'Lỗi thêm phim');
};

export const updateMovie = async (id, movieData) => {
    const res = await fetch(`${BASE_URL}/movies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movieData)
    });
    return handleResponse(res, 'Lỗi cập nhật phim');
};

export const deleteMovie = async (id) => {
    const res = await fetch(`${BASE_URL}/movies/${id}`, { method: 'DELETE' });
    return handleResponse(res, 'Lỗi xóa phim');
};

// ==========================================
// Showtimes API
// ==========================================
export const fetchShowtimesByMovie = async (movieId) => {
    const res = await fetch(`${BASE_URL}/movies/${movieId}/showtimes`);
    return handleResponse(res, 'Không thể tải suất chiếu');
};

export const fetchAllShowtimes = async () => {
    const res = await fetch(`${BASE_URL}/showtimes`);
    return handleResponse(res, 'Không thể tải danh sách suất chiếu');
};

export const addShowtime = async (showtimeData) => {
    const res = await fetch(`${BASE_URL}/showtimes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(showtimeData)
    });
    return handleResponse(res, 'Lỗi thêm suất chiếu');
};

export const deleteShowtime = async (id) => {
    const res = await fetch(`${BASE_URL}/showtimes/${id}`, { method: 'DELETE' });
    return handleResponse(res, 'Lỗi xóa suất chiếu');
};

// ==========================================
// Booking API
// ==========================================
export const createBooking = async (movieId, bookingData) => {
    const res = await fetch(`${BASE_URL}/movies/${movieId}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
    });
    return handleResponse(res, 'Lỗi đặt vé');
};

export const fetchAllBookings = async () => {
    const res = await fetch(`${BASE_URL}/bookings`);
    return handleResponse(res, 'Lỗi tải danh sách đặt vé');
};

export const fetchBookedSeats = async (movieId, showtime) => {
    const res = await fetch(`${BASE_URL}/movies/${movieId}/booked-seats?showtime=${encodeURIComponent(showtime)}`);
    return handleResponse(res, 'Lỗi tải thông tin ghế');
};
