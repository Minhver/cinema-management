const db = require('../config/db');
const { parseSeats } = require('../utils/showtimeHelper');

const Ticket = {
    // Tạo đơn đặt vé mới với transaction để tránh đặt trùng ghế
    create: async (data) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [rows] = await connection.execute(
                'SELECT seats FROM bookings WHERE movie_id = ? AND showtime = ? FOR UPDATE',
                [data.movieId, data.showtime]
            );

            let bookedSeats = [];
            rows.forEach(row => {
                bookedSeats = bookedSeats.concat(parseSeats(row.seats));
            });

            const conflictSeats = data.seats.filter(seat => bookedSeats.includes(seat));
            if (conflictSeats.length > 0) {
                await connection.rollback();
                const error = new Error(`Ghế ${conflictSeats.join(', ')} đã được đặt!`);
                error.conflictSeats = conflictSeats;
                error.statusCode = 409;
                throw error;
            }

            const seatsJson = JSON.stringify(data.seats);
            const [result] = await connection.execute(
                `INSERT INTO bookings (movie_id, customer_name, showtime, seats, total_tickets)
                 VALUES (?, ?, ?, ?, ?)`,
                [data.movieId, data.customerName, data.showtime, seatsJson, data.seats.length]
            );

            await connection.commit();
            return result;
        } catch (error) {
            if (error.statusCode !== 409) {
                await connection.rollback();
            }
            throw error;
        } finally {
            connection.release();
        }
    },

    // Lấy tất cả đơn đặt vé (Admin)
    getAll: async () => {
        const sql = `
            SELECT b.*, m.title AS movie_title
            FROM bookings b
            JOIN movies m ON b.movie_id = m.id
            ORDER BY b.booking_date DESC
        `;
        const [rows] = await db.execute(sql);
        return rows.map(row => ({
            ...row,
            seats: parseSeats(row.seats)
        }));
    },

    // Lấy ghế đã đặt theo phim + suất chiếu
    getBookedSeats: async (movieId, showtime) => {
        const [rows] = await db.execute(
            'SELECT seats FROM bookings WHERE movie_id = ? AND showtime = ?',
            [movieId, showtime]
        );
        let bookedSeats = [];
        rows.forEach(row => {
            bookedSeats = bookedSeats.concat(parseSeats(row.seats));
        });
        return bookedSeats;
    },

    // Lấy đơn đặt vé theo phim
    getByMovieId: async (movieId) => {
        const [rows] = await db.execute(
            'SELECT * FROM bookings WHERE movie_id = ? ORDER BY booking_date DESC',
            [movieId]
        );
        return rows.map(row => ({
            ...row,
            seats: parseSeats(row.seats)
        }));
    },

    // Cập nhật đơn đặt vé (Admin)
    update: async (id, data) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Lấy thông tin booking hiện tại để kiểm tra
            const [currentBookingRows] = await connection.execute(
                'SELECT * FROM bookings WHERE id = ? FOR UPDATE',
                [id]
            );
            if (currentBookingRows.length === 0) {
                await connection.rollback();
                const error = new Error('Không tìm thấy đơn đặt vé!');
                error.statusCode = 404;
                throw error;
            }
            const currentBooking = currentBookingRows[0];

            const movieId = data.movieId || currentBooking.movie_id;
            const customerName = data.customerName || currentBooking.customer_name;
            
            let cleanShowtime = data.showtime || currentBooking.showtime;
            if (cleanShowtime && cleanShowtime.includes('(')) {
                cleanShowtime = cleanShowtime.split('(')[0].trim();
            }

            const seats = data.seats || JSON.parse(currentBooking.seats);

            // Kiểm tra trùng ghế (loại trừ chính booking này)
            const [rows] = await connection.execute(
                'SELECT id, seats FROM bookings WHERE movie_id = ? AND showtime = ? AND id != ? FOR UPDATE',
                [movieId, cleanShowtime, id]
            );

            let bookedSeats = [];
            rows.forEach(row => {
                bookedSeats = bookedSeats.concat(parseSeats(row.seats));
            });

            const conflictSeats = seats.filter(seat => bookedSeats.includes(seat));
            if (conflictSeats.length > 0) {
                await connection.rollback();
                const error = new Error(`Ghế ${conflictSeats.join(', ')} đã được đặt!`);
                error.conflictSeats = conflictSeats;
                error.statusCode = 409;
                throw error;
            }

            const seatsJson = JSON.stringify(seats);
            const [result] = await connection.execute(
                `UPDATE bookings 
                 SET movie_id = ?, customer_name = ?, showtime = ?, seats = ?, total_tickets = ?
                 WHERE id = ?`,
                [movieId, customerName, cleanShowtime, seatsJson, seats.length, id]
            );

            await connection.commit();
            return result;
        } catch (error) {
            if (error.statusCode !== 409 && error.statusCode !== 404) {
                await connection.rollback();
            }
            throw error;
        } finally {
            connection.release();
        }
    },

    // Xóa đơn đặt vé (Admin)
    delete: async (id) => {
        const [result] = await db.execute('DELETE FROM bookings WHERE id = ?', [id]);
        return result;
    }
};

module.exports = Ticket;


module.exports = Ticket;
