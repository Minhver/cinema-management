const db = require('../config/db');

const Movie = {
    // Lấy tất cả phim
    getAll: async () => {
        const [rows] = await db.execute('SELECT * FROM movies ORDER BY created_at DESC');
        return rows;
    },

    // Lấy phim theo ID
    getById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM movies WHERE id = ?', [id]);
        return rows[0] || null;
    },

    // Thêm phim mới (dành cho Admin)
    create: async (data) => {
        const sql = 'INSERT INTO movies (title, genre, image, description, duration) VALUES (?, ?, ?, ?, ?)';
        const [result] = await db.execute(sql, [
            data.title,
            data.genre,
            data.image || '',
            data.description || 'Chưa có mô tả.',
            data.duration || 120
        ]);
        return result;
    },

    // Cập nhật phim (dành cho Admin)
    update: async (id, data) => {
        const sql = `
            UPDATE movies
            SET title = ?, genre = ?, image = ?, description = ?, duration = ?
            WHERE id = ?
        `;
        const [result] = await db.execute(sql, [
            data.title,
            data.genre,
            data.image || '',
            data.description || 'Chưa có mô tả.',
            data.duration || 120,
            id
        ]);
        return result;
    },

    // Xóa phim (dành cho Admin)
    delete: async (id) => {
        const [result] = await db.execute('DELETE FROM movies WHERE id = ?', [id]);
        return result;
    }
};

module.exports = Movie;
