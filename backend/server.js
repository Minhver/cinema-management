const express = require('express');
const cors = require('cors');
require('dotenv').config();

const movieRoutes = require('./routes/movieRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const showtimeRoutes = require('./routes/showtimeRoutes');

const app = express();

// Middleware
app.use(cors()); // Cho phép Frontend truy cập chéo nguồn
app.use(express.json()); // Đọc dữ liệu JSON gửi lên từ client

// Routes
app.use('/api/movies', movieRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/showtimes', showtimeRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Cinema API đang chạy!', timestamp: new Date().toLocaleString('vi-VN') });
});

// API root - trả về thông tin ngắn gọn để người dùng mở http://localhost:5000/api
app.get('/api', (req, res) => {
    res.json({ message: 'Cinema API root. Thử /api/health hoặc /api/movies', status: 'OK' });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint không tồn tại!' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Lỗi server:', err.stack);
    res.status(500).json({ message: 'Lỗi nội bộ server!', error: err.message });
});

const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
        console.log(`🎬 Cinema Server đang chạy trên cổng ${PORT}`);
        console.log(`   API: http://localhost:${PORT}/api`);
    });

    server.on('error', (err) => {
        if (err && err.code === 'EADDRINUSE') {
            console.error(`Lỗi: cổng ${PORT} đã được sử dụng. Hãy dừng tiến trình khác hoặc đổi PORT.`);
            process.exit(1);
        }
        console.error('Lỗi server không xác định:', err);
        process.exit(1);
    });
