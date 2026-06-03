const db = require('../config/db');

const Movie = {
    // Lấy tất cả phim đang chiếu
    getAll: async () => {
        const [rows] = await db.execute('SELECT * FROM movies');
        return rows;
    },
    // Thêm phim mới (dành cho Admin)
    create: async (data) => {
        const sql = 'INSERT INTO movies (title, duration, genre, image) VALUES (?, ?, ?, ?)';
        return await db.execute(sql, [data.title, data.duration, data.genre, data.image]);
    }
};

module.exports = Movie;
