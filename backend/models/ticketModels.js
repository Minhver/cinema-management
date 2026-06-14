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
    }
};

module.exports = Ticket;
