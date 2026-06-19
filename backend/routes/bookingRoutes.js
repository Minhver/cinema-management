const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// ==========================================
// Nhóm Endpoint quản lý Đặt Vé (Bookings)
// ==========================================

// GET /api/bookings       — Admin: Lấy toàn bộ danh sách đặt vé
router.get('/', bookingController.getAllBookings);

// PUT /api/bookings/:id   — Admin: Cập nhật đơn đặt vé
router.put('/:id', bookingController.updateBooking);

// DELETE /api/bookings/:id — Admin: Xóa đơn đặt vé
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;

