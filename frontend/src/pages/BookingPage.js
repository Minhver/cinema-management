import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Seat from '../components/Seat';
import { fetchMovieById, fetchShowtimesByMovie, fetchBookedSeats, createBooking } from '../services/api';

const ALL_SEATS = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'];

function BookingPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const [customerName, setCustomerName] = useState('');
    const [showtime, setShowtime] = useState('');
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [bookedSeats, setBookedSeats] = useState([]);
    const [seatsLoading, setSeatsLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [movieData, showtimeData] = await Promise.all([
                    fetchMovieById(id),
                    fetchShowtimesByMovie(id)
                ]);
                setMovie(movieData);
                setShowtimes(showtimeData);
                if (showtimeData.length > 0) {
                    setShowtime(showtimeData[0].key);
                }
            } catch (err) {
                setError('Không tìm thấy phim. Vui lòng quay lại trang chủ.');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    const loadBookedSeats = useCallback(async () => {
        if (!showtime) return;
        try {
            setSeatsLoading(true);
            setSelectedSeats([]);
            const data = await fetchBookedSeats(id, showtime);
            setBookedSeats(data.bookedSeats || []);
        } catch (err) {
            console.warn('Không thể tải ghế đã đặt:', err);
            setBookedSeats([]);
        } finally {
            setSeatsLoading(false);
        }
    }, [id, showtime]);

    useEffect(() => {
        loadBookedSeats();
    }, [loadBookedSeats]);

    const toggleSeatSelection = (seat) => {
        if (bookedSeats.includes(seat)) return;
        setSelectedSeats(prev =>
            prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]
        );
    };

    const getSeatStatus = (seat) => {
        if (bookedSeats.includes(seat)) return 'booked';
        if (selectedSeats.includes(seat)) return 'selected';
        return 'available';
    };

    const selectedShowtimeLabel = showtimes.find(s => s.key === showtime)?.label || showtime;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!customerName.trim()) {
            alert('Vui lòng nhập họ tên khách hàng!');
            return;
        }
        if (!showtime) {
            alert('Vui lòng chọn suất chiếu!');
            return;
        }
        if (selectedSeats.length === 0) {
            alert('Vui lòng chọn ít nhất một ghế ngồi!');
            return;
        }

        try {
            setSubmitting(true);
            const data = await createBooking(id, {
                customerName: customerName.trim(),
                showtime,
                seats: selectedSeats
            });

            alert(`✅ ${data.message}`);
            navigate('/');
        } catch (err) {
            alert(`❌ ${err.message}`);
            await loadBookedSeats();
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner" />
                <p className="loading-text">Đang tải thông tin phim...</p>
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div className="booking-page">
                <div className="error-message">⚠️ {error || 'Không tìm thấy phim!'}</div>
            </div>
        );
    }

    const availableCount = ALL_SEATS.filter(s => !bookedSeats.includes(s)).length;

    return (
        <div className="booking-page">
            <h2>Đặt Vé: <span>{movie.title}</span></h2>

            <div className="booking-container">
                <img
                    src={movie.image || 'https://via.placeholder.com/280x400?text=No+Image'}
                    alt={movie.title}
                    className="booking-poster"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/280x400?text=No+Image'; }}
                />

                <form onSubmit={handleSubmit} className="booking-form">
                    <div className="form-group">
                        <label>👤 Họ và Tên khách hàng</label>
                        <input
                            type="text"
                            required
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Nhập tên người nhận vé..."
                        />
                    </div>

                    <div className="form-group">
                        <label>🕐 Suất chiếu</label>
                        {showtimes.length === 0 ? (
                            <p className="no-showtimes-msg">
                                Hiện chưa có suất chiếu nào. Vui lòng liên hệ quản trị viên.
                            </p>
                        ) : (
                            <select value={showtime} onChange={(e) => setShowtime(e.target.value)}>
                                {showtimes.map(s => (
                                    <option key={s.id} value={s.key}>{s.label}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="form-group">
                        <label>🪑 Chọn Ghế Ngồi ({availableCount} ghế trống)</label>

                        <div className="screen-indicator">🎬 MÀN HÌNH CHÍNH</div>

                        <div className="seat-legend">
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

                        {seatsLoading ? (
                            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>
                                Đang cập nhật ghế...
                            </div>
                        ) : (
                            <div className="seat-grid">
                                {ALL_SEATS.map(seat => (
                                    <Seat
                                        key={seat}
                                        seatId={seat}
                                        status={getSeatStatus(seat)}
                                        onToggle={toggleSeatSelection}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {selectedSeats.length > 0 && (
                        <div className="booking-summary">
                            <div className="booking-summary-text">
                                Suất: <strong style={{ color: 'white' }}>{selectedShowtimeLabel}</strong>
                                <br />
                                Ghế: <strong style={{ color: 'white' }}>{selectedSeats.join(', ')}</strong>
                            </div>
                            <div className="booking-summary-count">
                                {selectedSeats.length} vé
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="confirm-btn"
                        disabled={submitting || selectedSeats.length === 0 || showtimes.length === 0}
                    >
                        {submitting ? '⏳ Đang xử lý...' : `✅ Xác Nhận Đặt ${selectedSeats.length > 0 ? selectedSeats.length + ' Ghế' : 'Vé'}`}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default BookingPage;
