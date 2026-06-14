const Showtime = require('../models/showtimeModel');
const Movie = require('../models/movieModels');
const { formatShowtimeKey, formatShowtimeLabel } = require('../utils/showtimeHelper');

const enrichShowtime = (row) => ({
    ...row,
    key: formatShowtimeKey(row.show_date, row.show_time, row.hall),
    label: formatShowtimeLabel(row.show_date, row.show_time, row.hall)
});

exports.getShowtimesByMovie = async (req, res) => {
    try {
        const movieId = parseInt(req.params.id);
        const movie = await Movie.getById(movieId);
        if (!movie) {
            return res.status(404).json({ message: 'Không tìm thấy phim!' });
        }

        const showtimes = await Showtime.getByMovieId(movieId);
        res.status(200).json(showtimes.map(enrichShowtime));
    } catch (error) {
        console.error('Lỗi lấy suất chiếu:', error);
        res.status(500).json({ message: 'Lỗi lấy danh sách suất chiếu', error: error.message });
    }
};

exports.getAllShowtimes = async (req, res) => {
    try {
        const showtimes = await Showtime.getAll();
        res.status(200).json(showtimes.map(enrichShowtime));
    } catch (error) {
        console.error('Lỗi lấy suất chiếu:', error);
        res.status(500).json({ message: 'Lỗi lấy danh sách suất chiếu', error: error.message });
    }
};

exports.addShowtime = async (req, res) => {
    try {
        const { movie_id, show_date, show_time, hall } = req.body;

        if (!movie_id || !show_date || !show_time) {
            return res.status(400).json({ message: 'Vui lòng cung cấp phim, ngày và giờ chiếu!' });
        }

        const movie = await Movie.getById(parseInt(movie_id));
        if (!movie) {
            return res.status(404).json({ message: 'Không tìm thấy phim!' });
        }

        const result = await Showtime.create({
            movie_id: parseInt(movie_id),
            show_date,
            show_time,
            hall: hall || 'Phòng 1'
        });

        const newShowtime = await Showtime.getById(result.insertId);
        res.status(201).json({
            message: 'Thêm suất chiếu thành công!',
            showtime: enrichShowtime(newShowtime)
        });
    } catch (error) {
        console.error('Lỗi thêm suất chiếu:', error);
        res.status(500).json({ message: 'Lỗi thêm suất chiếu', error: error.message });
    }
};

exports.deleteShowtime = async (req, res) => {
    try {
        const result = await Showtime.delete(parseInt(req.params.id));
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy suất chiếu để xóa!' });
        }
        res.status(200).json({ message: 'Xóa suất chiếu thành công!' });
    } catch (error) {
        console.error('Lỗi xóa suất chiếu:', error);
        res.status(500).json({ message: 'Lỗi xóa suất chiếu', error: error.message });
    }
};
