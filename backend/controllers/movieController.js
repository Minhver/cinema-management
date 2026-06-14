const Movie = require('../models/movieModels'); // Sửa: đúng tên file movieModels.js

// Lấy danh sách tất cả phim
exports.getMovies = async (req, res) => {
    try {
        const movies = await Movie.getAll();
        res.status(200).json(movies);
    } catch (error) {
        console.error('Lỗi lấy danh sách phim:', error);
        res.status(500).json({ message: 'Lỗi lấy danh sách phim', error: error.message });
    }
};

// Lấy thông tin chi tiết một bộ phim theo ID
exports.getMovieById = async (req, res) => {
    try {
        const movie = await Movie.getById(parseInt(req.params.id));
        if (!movie) {
            return res.status(404).json({ message: 'Không tìm thấy bộ phim yêu cầu!' });
        }
        res.status(200).json(movie);
    } catch (error) {
        console.error('Lỗi lấy thông tin phim:', error);
        res.status(500).json({ message: 'Lỗi lấy thông tin phim', error: error.message });
    }
};

// Admin: Thêm phim mới
exports.addMovie = async (req, res) => {
    try {
        const { title, genre, image, description, duration } = req.body;

        if (!title || !genre) {
            return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ tên phim và thể loại!' });
        }

        const result = await Movie.create({ title, genre, image, description, duration });
        const newMovie = await Movie.getById(result.insertId);

        res.status(201).json({ message: 'Đăng tải phim mới lên hệ thống thành công!', movie: newMovie });
    } catch (error) {
        console.error('Lỗi thêm phim:', error);
        res.status(500).json({ message: 'Lỗi thêm phim mới', error: error.message });
    }
};

// Admin: Cập nhật phim
exports.updateMovie = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { title, genre, image, description, duration } = req.body;

        if (!title || !genre) {
            return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ tên phim và thể loại!' });
        }

        const result = await Movie.update(id, { title, genre, image, description, duration });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy phim để cập nhật!' });
        }

        const updatedMovie = await Movie.getById(id);
        res.status(200).json({ message: 'Cập nhật phim thành công!', movie: updatedMovie });
    } catch (error) {
        console.error('Lỗi cập nhật phim:', error);
        res.status(500).json({ message: 'Lỗi cập nhật phim', error: error.message });
    }
};

// Admin: Xóa phim
exports.deleteMovie = async (req, res) => {
    try {
        const result = await Movie.delete(parseInt(req.params.id));
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy phim để xóa!' });
        }
        res.status(200).json({ message: 'Xóa phim thành công!' });
    } catch (error) {
        console.error('Lỗi xóa phim:', error);
        res.status(500).json({ message: 'Lỗi xóa phim', error: error.message });
    }
};
