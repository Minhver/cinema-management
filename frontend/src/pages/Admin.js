import React, { useState, useEffect } from 'react';
import {
    fetchMovies, fetchAllBookings, addMovie, updateMovie, deleteMovie,
    fetchAllShowtimes, addShowtime, deleteShowtime, updateBooking, deleteBooking, fetchBookedSeats
} from '../services/api';
import CustomSelect from '../components/CustomSelect';

const ALL_SEATS = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'];

const today = () => new Date().toISOString().split('T')[0];

function Admin() {
    
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passcode, setPasscode] = useState('');

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

    const [editingBooking, setEditingBooking] = useState(null);
    const [ebCustomerName, setEbCustomerName] = useState('');
    const [ebShowtime, setEbShowtime] = useState('');
    const [ebSeats, setEbSeats] = useState([]);
    const [ebBookedSeats, setEbBookedSeats] = useState([]);
    const [ebSeatsLoading, setEbSeatsLoading] = useState(false);
    const [ebSubmitting, setEbSubmitting] = useState(false);

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

    const loadEbBookedSeats = async (movieId, showtimeKey, originalSeats = [], originalShowtime = '') => {
        if (!showtimeKey) return;
        try {
            setEbSeatsLoading(true);
            const data = await fetchBookedSeats(movieId, showtimeKey);
            const isSameShowtime = (showtimeKey === originalShowtime);
            const otherBooked = (data.bookedSeats || []).filter(s => isSameShowtime ? !originalSeats.includes(s) : true);
            setEbBookedSeats(otherBooked);
        } catch (err) {
            console.warn('Không thể tải ghế đã đặt:', err);
            setEbBookedSeats([]);
        } finally {
            setEbSeatsLoading(false);
        }
    };

    const handleEditBooking = (booking) => {
        setEditingBooking(booking);
        setEbCustomerName(booking.customer_name);
        setEbShowtime(booking.showtime);
        setEbSeats(booking.seats || []);
        loadEbBookedSeats(booking.movie_id, booking.showtime, booking.seats || [], booking.showtime);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetBookingForm = () => {
        setEditingBooking(null);
        setEbCustomerName('');
        setEbShowtime('');
        setEbSeats([]);
        setEbBookedSeats([]);
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        if (!ebCustomerName.trim()) {
            alert('Vui lòng nhập họ tên khách hàng!');
            return;
        }
        if (!ebShowtime) {
            alert('Vui lòng chọn suất chiếu!');
            return;
        }
        if (ebSeats.length === 0) {
            alert('Vui lòng chọn ít nhất một ghế ngồi!');
            return;
        }

        try {
            setEbSubmitting(true);
            const data = await updateBooking(editingBooking.id, {
                customerName: ebCustomerName.trim(),
                showtime: ebShowtime,
                seats: ebSeats,
                movieId: editingBooking.movie_id
            });
            alert(`✅ ${data.message}`);
            resetBookingForm();
            await syncData();
        } catch (err) {
            alert(`❌ ${err.message}`);
        } finally {
            setEbSubmitting(false);
        }
    };

    const handleDeleteBooking = async (id) => {
        if (!window.confirm('Xác nhận hủy/xóa đơn đặt vé này?')) {
            return;
        }
        try {
            const data = await deleteBooking(id);
            alert(`✅ ${data.message}`);
            if (editingBooking && editingBooking.id === id) {
                resetBookingForm();
            }
            await syncData();
        } catch (err) {
            alert(`❌ ${err.message}`);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="admin-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div className="admin-card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                    <h2>🔒 Khu Vực Quản Trị</h2>
                    <p style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>Vui lòng nhập mật mã để truy cập</p>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (passcode === '12345689') {
                            setIsAuthenticated(true);
                        } else {
                            alert('❌ Mật mã không chính xác!');
                        }
                    }} className="admin-form">
                        <input 
                            type="password" 
                            placeholder="Nhập mật mã..." 
                            value={passcode}
                            onChange={e => setPasscode(e.target.value)}
                            required
                            style={{ textAlign: 'center', letterSpacing: '2px' }}
                        />
                        <button type="submit" style={{ marginTop: '10px' }}>Đăng nhập</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <h2>⚙️ HỆ THỐNG QUẢN TRỊ — ADMIN PANEL</h2>
            <p className="admin-subtitle">Quản lý phim, suất chiếu và theo dõi đơn đặt vé</p>

            <div className="admin-sections">
                {/* Chỉnh sửa đơn đặt vé */}
                {editingBooking && (
                    <div className="admin-card admin-card-wide">
                        <h3>✏️ Chỉnh Sửa Đơn Đặt Vé #{editingBooking.id}</h3>
                        <form onSubmit={handleBookingSubmit} className="admin-form">
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                                <div className="form-group">
                                    <label>👤 Họ và Tên khách hàng</label>
                                    <input
                                        type="text"
                                        required
                                        value={ebCustomerName}
                                        onChange={e => setEbCustomerName(e.target.value)}
                                        placeholder="Nhập tên người nhận vé..."
                                    />
                                </div>
                                <div className="form-group">
                                    <label>🕐 Suất chiếu</label>
                                    <CustomSelect
                                        value={ebShowtime}
                                        onChange={(newShowtime) => {
                                            setEbShowtime(newShowtime);
                                            setEbSeats([]);
                                            loadEbBookedSeats(editingBooking.movie_id, newShowtime, editingBooking.seats || [], editingBooking.showtime);
                                        }}
                                        options={[
                                            ...(showtimes
                                                .filter(st => st.movie_id === editingBooking.movie_id)
                                                .map(st => ({ value: st.key, label: st.label }))),
                                            ...(showtimes.filter(st => st.movie_id === editingBooking.movie_id).length === 0
                                                ? [{ value: editingBooking.showtime, label: editingBooking.showtime }]
                                                : [])
                                        ]}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group" style={{ marginTop: '10px' }}>
                                <label>🪑 Chọn Ghế Ngồi (Ghế trống / Ghế đang chọn)</label>
                                {ebSeatsLoading ? (
                                    <div style={{ color: 'var(--text-secondary)' }}>Đang tải ghế...</div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <div className="seat-legend" style={{ marginBottom: '5px' }}>
                                            <div className="legend-item">
                                                <div className="legend-dot available" />
                                                <span>Ghế trống</span>
                                            </div>
                                            <div className="legend-item">
                                                <div className="legend-dot selected" />
                                                <span>Đang chọn</span>
                                            </div>
                                            <div className="legend-item">
                                                <div className="legend-dot booked" />
                                                <span>Đã đặt</span>
                                            </div>
                                        </div>
                                        <div className="seat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', maxWidth: '300px' }}>
                                            {ALL_SEATS.map(seat => {
                                                const isBooked = ebBookedSeats.includes(seat);
                                                const isSelected = ebSeats.includes(seat);
                                                let status = 'available';
                                                if (isBooked) status = 'booked';
                                                else if (isSelected) status = 'selected';

                                                return (
                                                    <button
                                                        key={seat}
                                                        type="button"
                                                        className={`seat-btn ${status}`}
                                                        disabled={isBooked}
                                                        onClick={() => {
                                                            setEbSeats(prev =>
                                                                prev.includes(seat)
                                                                    ? prev.filter(s => s !== seat)
                                                                    : [...prev, seat]
                                                            );
                                                        }}
                                                    >
                                                        {seat}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="admin-form-actions" style={{ marginTop: '15px' }}>
                                <button type="button" className="cancel-btn" onClick={resetBookingForm}>
                                    Hủy
                                </button>
                                <button type="submit" disabled={ebSubmitting}>
                                    {ebSubmitting ? '⏳ Đang lưu...' : '💾 Lưu Thay Đổi'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

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
                        <CustomSelect
                            value={stMovieId}
                            onChange={setStMovieId}
                            placeholder="-- Chọn phim --"
                            options={[
                                ...movies.map(m => ({ value: String(m.id), label: m.title }))
                            ]}
                            required
                            disabled={movies.length === 0}
                        />
                        <input type="date" value={stDate} onChange={e => setStDate(e.target.value)} required />
                        <CustomSelect
                            value={stTime}
                            onChange={setStTime}
                            options={[
                                { value: '15:00', label: '15:00 - Chiều' },
                                { value: '18:00', label: '18:00 - Tối' },
                                { value: '21:00', label: '21:00 - Đêm' },
                            ]}
                        />
                        <CustomSelect
                            value={stHall}
                            onChange={setStHall}
                            options={[
                                { value: 'Phòng 1', label: 'Phòng 1' },
                                { value: 'Phòng 2', label: 'Phòng 2' },
                                { value: 'Phòng 3', label: 'Phòng 3' },
                            ]}
                        />
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
                                        <th>Thao Tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="admin-empty-cell">
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
                                                <td>
                                                    <div style={{ display: 'flex', gap: '6px' }}>
                                                        <button className="edit-btn" onClick={() => handleEditBooking(b)}>Sửa</button>
                                                        <button className="delete-btn" onClick={() => handleDeleteBooking(b.id)}>Xóa</button>
                                                    </div>
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

