const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const bookingController = require('../controllers/bookingController');
const showtimeController = require('../controllers/showtimeController');

// ==========================================
// Nhóm Endpoint quản lý Phim (Movies)
// ==========================================

// GET  /api/movies        — Lấy danh sách tất cả phim
router.get('/', movieController.getMovies);

// POST /api/movies        — Admin: Thêm phim mới
router.post('/', movieController.addMovie);

// GET  /api/movies/:id/showtimes     — Lấy suất chiếu của phim
router.get('/:id/showtimes', showtimeController.getShowtimesByMovie);

// POST /api/movies/:id/book           — Tạo đơn đặt vé
router.post('/:id/book', bookingController.createBooking);

// GET  /api/movies/:id/booked-seats   — Lấy ghế đã đặt (theo suất chiếu)
router.get('/:id/booked-seats', bookingController.getBookedSeats);

// GET  /api/movies/:id    — Lấy thông tin chi tiết phim
router.get('/:id', movieController.getMovieById);

// PUT    /api/movies/:id  — Admin: Cập nhật phim
router.put('/:id', movieController.updateMovie);

// DELETE /api/movies/:id  — Admin: Xóa phim
router.delete('/:id', movieController.deleteMovie);

module.exports = router;
