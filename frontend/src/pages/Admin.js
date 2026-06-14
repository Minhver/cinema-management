import React, { useState, useEffect } from 'react';
import {
    fetchMovies, fetchAllBookings, addMovie, updateMovie, deleteMovie,
    fetchAllShowtimes, addShowtime, deleteShowtime
} from '../services/api';

const today = () => new Date().toISOString().split('T')[0];

function Admin() {
    const [movies, setMovies] = useState([]);
    const [showtimes, setShowtimes] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('');
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [stMovieId, setStMovieId] = useState('');
    const [stDate, setStDate] = useState(today());
    const [stTime, setStTime] = useState('18:00');
    const [stHall, setStHall] = useState('Phòng 1');
    const [stSubmitting, setStSubmitting] = useState(false);

    const syncData = async () => {
        try {
            setLoading(true);
            const [moviesData, bookingsData, showtimesData] = await Promise.all([
                fetchMovies(),
                fetchAllBookings(),
                fetchAllShowtimes()
            ]);
            setMovies(moviesData);
            setBookings(bookingsData);
            setShowtimes(showtimesData);
            if (!stMovieId && moviesData.length > 0) {
                setStMovieId(String(moviesData[0].id));
            }
        } catch (err) {
            alert(`❌ ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        syncData();
    }, []);

    const resetMovieForm = () => {
        setTitle('');
        setGenre('');
        setImage('');
        setDescription('');
        setDuration('');
        setEditingId(null);
    };

    const handleMovieSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !genre.trim()) {
            alert('Vui lòng nhập ít nhất tên phim và thể loại!');
            return;
        }

        const payload = {
            title: title.trim(),
            genre: genre.trim(),
            image: image.trim(),
            description: description.trim(),
            duration: duration ? parseInt(duration) : 120
        };

        try {
            setSubmitting(true);
            const data = editingId
                ? await updateMovie(editingId, payload)
                : await addMovie(payload);
            alert(`✅ ${data.message}`);
            resetMovieForm();
            await syncData();
        } catch (err) {
            alert(`❌ ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditMovie = (movie) => {
        setEditingId(movie.id);
        setTitle(movie.title);
        setGenre(movie.genre);
        setImage(movie.image || '');
        setDescription(movie.description || '');
        setDuration(movie.duration ? String(movie.duration) : '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteMovie = async (id, movieTitle) => {
        if (!window.confirm(`Xóa phim "${movieTitle}"? Tất cả suất chiếu và đơn đặt vé liên quan cũng sẽ bị xóa.`)) {
            return;
        }
        try {
            const data = await deleteMovie(id);
            alert(`✅ ${data.message}`);
            if (editingId === id) resetMovieForm();
            await syncData();
        } catch (err) {
            alert(`❌ ${err.message}`);
        }
    };

    const handleShowtimeSubmit = async (e) => {
        e.preventDefault();
        if (!stMovieId || !stDate || !stTime) {
            alert('Vui lòng chọn phim, ngày và giờ chiếu!');
            return;
        }
        try {
            setStSubmitting(true);
            const data = await addShowtime({
                movie_id: parseInt(stMovieId),
                show_date: stDate,
                show_time: stTime,
                hall: stHall
            });
            alert(`✅ ${data.message}`);
            setStDate(today());
            setStTime('18:00');
            await syncData();
        } catch (err) {
            alert(`❌ ${err.message}`);
        } finally {
            setStSubmitting(false);
        }
    };

    const handleDeleteShowtime = async (id) => {
        if (!window.confirm('Xóa suất chiếu này?')) return;
        try {
            const data = await deleteShowtime(id);
            alert(`✅ ${data.message}`);
            await syncData();
        } catch (err) {
            alert(`❌ ${err.message}`);
        }
    };

    return (
        <div className="admin-page">
            <h2>⚙️ HỆ THỐNG QUẢN TRỊ — ADMIN PANEL</h2>
            <p className="admin-subtitle">Quản lý phim, suất chiếu và theo dõi đơn đặt vé</p>

            <div className="admin-sections">
                {/* Thêm / Sửa phim */}
                <div className="admin-card">
                    <h3>{editingId ? '✏️ Chỉnh Sửa Phim' : '🎬 Đăng Tải Phim Mới'}</h3>
                    <form onSubmit={handleMovieSubmit} className="admin-form">
                        <input
                            type="text"
                            placeholder="Tên tiêu đề phim *"
                            required
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Thể loại (VD: Hành Động, Kinh Dị...) *"
                            required
                            value={genre}
                            onChange={e => setGenre(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="URL hình ảnh poster phim"
                            value={image}
                            onChange={e => setImage(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Thời lượng (phút, VD: 120)"
                            value={duration}
                            onChange={e => setDuration(e.target.value)}
                            min="1"
                            max="300"
                        />
                        <textarea
                            placeholder="Nội dung mô tả ngắn gọn bộ phim..."
                            rows="4"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                        <div className="admin-form-actions">
                            {editingId && (
                                <button type="button" className="cancel-btn" onClick={resetMovieForm}>
                                    Hủy
                                </button>
                            )}
                            <button type="submit" disabled={submitting}>
                                {submitting ? '⏳ Đang lưu...' : editingId ? '💾 Lưu Thay Đổi' : '🚀 Phát Hành Phim'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Danh sách phim */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3>🎞 Danh Sách Phim ({movies.length})</h3>
                        <button onClick={syncData} className="refresh-btn" disabled={loading}>
                            {loading ? '⏳' : '🔄'} Tải Lại
                        </button>
                    </div>
                    {loading ? (
                        <div className="admin-loading">Đang tải...</div>
                    ) : movies.length === 0 ? (
                        <p className="admin-empty">Chưa có phim nào.</p>
                    ) : (
                        <div className="admin-movie-list">
                            {movies.map(movie => (
                                <div key={movie.id} className="admin-movie-item">
                                    <div className="admin-movie-info">
                                        <strong>{movie.title}</strong>
                                        <span className="genre-badge">{movie.genre}</span>
                                    </div>
                                    <div className="admin-movie-actions">
                                        <button className="edit-btn" onClick={() => handleEditMovie(movie)}>Sửa</button>
                                        <button className="delete-btn" onClick={() => handleDeleteMovie(movie.id, movie.title)}>Xóa</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quản lý suất chiếu */}
                <div className="admin-card">
                    <h3>🕐 Thêm Suất Chiếu</h3>
                    <form onSubmit={handleShowtimeSubmit} className="admin-form">
                        <select value={stMovieId} onChange={e => setStMovieId(e.target.value)} required>
                            <option value="">-- Chọn phim --</option>
                            {movies.map(m => (
                                <option key={m.id} value={m.id}>{m.title}</option>
                            ))}
                        </select>
                        <input type="date" value={stDate} onChange={e => setStDate(e.target.value)} required />
                        <select value={stTime} onChange={e => setStTime(e.target.value)}>
                            <option value="15:00">15:00 - Chiều</option>
                            <option value="18:00">18:00 - Tối</option>
                            <option value="21:00">21:00 - Đêm</option>
                        </select>
                        <select value={stHall} onChange={e => setStHall(e.target.value)}>
                            <option value="Phòng 1">Phòng 1</option>
                            <option value="Phòng 2">Phòng 2</option>
                            <option value="Phòng 3">Phòng 3</option>
                        </select>
                        <button type="submit" disabled={stSubmitting || movies.length === 0}>
                            {stSubmitting ? '⏳ Đang thêm...' : '➕ Thêm Suất Chiếu'}
                        </button>
                    </form>

                    <h3 className="admin-subheading">📅 Suất Chiếu Đang Có ({showtimes.length})</h3>
                    {showtimes.length === 0 ? (
                        <p className="admin-empty">Chưa có suất chiếu nào.</p>
                    ) : (
                        <div className="admin-showtime-list">
                            {showtimes.map(st => (
                                <div key={st.id} className="admin-showtime-item">
                                    <span>{st.movie_title} — {st.label}</span>
                                    <button className="delete-btn" onClick={() => handleDeleteShowtime(st.id)}>Xóa</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Danh sách đặt vé */}
                <div className="admin-card admin-card-wide">
                    <div className="admin-card-header">
                        <h3>📋 Danh Sách Khách Đặt Vé ({bookings.length})</h3>
                        <button onClick={syncData} className="refresh-btn" disabled={loading}>
                            {loading ? '⏳' : '🔄'} Tải Lại
                        </button>
                    </div>

                    {loading ? (
                        <div className="admin-loading">Đang tải...</div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="booking-table">
                                <thead>
                                    <tr>
                                        <th>Mã Đơn</th>
                                        <th>Phim</th>
                                        <th>Khách Hàng</th>
                                        <th>Suất Chiếu</th>
                                        <th>Ghế</th>
                                        <th>Ngày Đặt</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="admin-empty-cell">
                                                🎭 Chưa có đơn đặt vé nào trên hệ thống
                                            </td>
                                        </tr>
                                    ) : (
                                        bookings.map(b => (
                                            <tr key={b.id}>
                                                <td><span className="booking-id-badge">#{b.id}</span></td>
                                                <td className="truncate-cell">{b.movie_title || `Phim #${b.movie_id}`}</td>
                                                <td><strong>{b.customer_name}</strong></td>
                                                <td>{b.showtime}</td>
                                                <td>
                                                    <span className="seat-indicator-cell">
                                                        {Array.isArray(b.seats) ? b.seats.join(', ') : b.seats}
                                                    </span>
                                                </td>
                                                <td className="date-cell">
                                                    {b.booking_date
                                                        ? new Date(b.booking_date).toLocaleString('vi-VN')
                                                        : '—'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Admin;
