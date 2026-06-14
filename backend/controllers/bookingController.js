const Ticket = require('../models/ticketModels');
const Movie = require('../models/movieModels');

// 1. Tạo đơn đặt vé mới
exports.createBooking = async (req, res) => {
    try {
        const movieId = parseInt(req.params.id); // Lấy movieId từ URL params /:id/book
        const { customerName, seats, showtime } = req.body;

        // Kiểm tra dữ liệu đầu vào bắt buộc
        if (!customerName || !customerName.trim()) {
            return res.status(400).json({ message: 'Vui lòng nhập họ tên khách hàng!' });
        }
        if (!showtime) {
            return res.status(400).json({ message: 'Vui lòng chọn suất chiếu!' });
        }
        if (!seats || !Array.isArray(seats) || seats.length === 0) {
            return res.status(400).json({ message: 'Vui lòng chọn ít nhất một ghế ngồi!' });
        }

        // Kiểm tra phim có tồn tại không
        const movie = await Movie.getById(movieId);
        if (!movie) {
            return res.status(404).json({ message: 'Không tìm thấy phim yêu cầu!' });
        }

        // Tạo booking (transaction + kiểm tra conflict bên trong)
        const result = await Ticket.create({
            movieId,
            customerName: customerName.trim(),
            showtime,
            seats
        });

        const newBooking = {
            id: result.insertId,
            movieId,
            movieTitle: movie.title,
            customerName: customerName.trim(),
            showtime,
            seats,
            totalTickets: seats.length,
            bookingDate: new Date().toLocaleString('vi-VN')
        };

        res.status(201).json({
            message: `Đặt vé thành công! ${seats.length} ghế cho suất chiếu ${showtime}.`,
            booking: newBooking
        });

    } catch (error) {
        console.error('Lỗi tạo booking:', error);
        if (error.statusCode === 409) {
            return res.status(409).json({
                message: `${error.message} Vui lòng chọn ghế khác.`,
                conflictSeats: error.conflictSeats
            });
        }
        res.status(500).json({ message: 'Lỗi xử lý đặt vé', error: error.message });
    }
};

// 2. Lấy danh sách tất cả đơn đặt vé (Admin)
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Ticket.getAll();
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Lỗi lấy danh sách booking:', error);
        res.status(500).json({ message: 'Lỗi lấy danh sách đặt vé', error: error.message });
    }
};

// 3. Lấy ghế đã đặt theo movieId + showtime (để hiển thị real-time trên giao diện)
exports.getBookedSeats = async (req, res) => {
    try {
        const movieId = parseInt(req.params.id);
        const { showtime } = req.query;

        if (!showtime) {
            return res.status(400).json({ message: 'Vui lòng cung cấp tham số showtime!' });
        }

        const bookedSeats = await Ticket.getBookedSeats(movieId, showtime);
        res.status(200).json({ movieId, showtime, bookedSeats });

    } catch (error) {
        console.error('Lỗi lấy ghế đã đặt:', error);
        res.status(500).json({ message: 'Lỗi lấy thông tin ghế', error: error.message });
    }
};
