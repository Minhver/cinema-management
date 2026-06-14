const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// ==========================================
// Nhóm Endpoint quản lý Đặt Vé (Bookings)
// ==========================================

// GET /api/bookings       — Admin: Lấy toàn bộ danh sách đặt vé
router.get('/', bookingController.getAllBookings);

module.exports = router;
