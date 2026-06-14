const db = require('../config/db');

const Showtime = {
    // Lấy suất chiếu theo ID
    getById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM showtimes WHERE id = ?', [id]);
        return rows[0] || null;
    },

    // Lấy tất cả suất chiếu của một phim (từ hôm nay trở đi)
    getByMovieId: async (movieId) => {
        const [rows] = await db.execute(
            `SELECT * FROM showtimes
             WHERE movie_id = ? AND show_date >= CURDATE()
             ORDER BY show_date, show_time`,
            [movieId]
        );
        return rows;
    },

    // Lấy tất cả suất chiếu
    getAll: async () => {
        const sql = `
            SELECT s.*, m.title AS movie_title
            FROM showtimes s
            JOIN movies m ON s.movie_id = m.id
            ORDER BY s.show_date, s.show_time
        `;
        const [rows] = await db.execute(sql);
        return rows;
    },

    // Thêm suất chiếu mới
    create: async (data) => {
        const sql = 'INSERT INTO showtimes (movie_id, show_date, show_time, hall) VALUES (?, ?, ?, ?)';
        const [result] = await db.execute(sql, [
            data.movie_id,
            data.show_date,
            data.show_time,
            data.hall || 'Phòng 1'
        ]);
        return result;
    },

    // Xóa suất chiếu
    delete: async (id) => {
        const [result] = await db.execute('DELETE FROM showtimes WHERE id = ?', [id]);
        return result;
    }
};

module.exports = Showtime;
