const Movie = require('../models/movieModel');

exports.getMovies = async (req, res) => {
    try {
        const movies = await Movie.getAll();
        res.status(200).json(movies); // Trả về danh sách phim dạng JSON
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh sách phim", error });
    }
};
