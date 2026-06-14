import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import { fetchMovies } from '../services/api';

function HomePage() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadMovies = async () => {
            try {
                setLoading(true);
                const data = await fetchMovies();
                setMovies(data);
            } catch (err) {
                console.error('Lỗi đồng bộ dữ liệu phim:', err);
                setError('Không thể kết nối tới server. Vui lòng kiểm tra backend đang chạy!');
            } finally {
                setLoading(false);
            }
        };
        loadMovies();
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner" />
                <p className="loading-text">Đang tải danh sách phim...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <header className="hero-banner">
                    <h1>PHIM ĐANG CHIẾU <span>HOT NHẤT</span></h1>
                    <p>Đặt vé nhanh chóng, trải nghiệm điện ảnh đỉnh cao</p>
                </header>
                <div className="error-message">⚠️ {error}</div>
            </div>
        );
    }

    return (
        <div className="home-page">
            <header className="hero-banner">
                <h1>PHIM ĐANG CHIẾU <span>HOT NHẤT</span></h1>
                <p>Đặt vé nhanh chóng, trải nghiệm điện ảnh đỉnh cao tại SUNSTAR CINEMA</p>
            </header>

            <h2 className="section-title">🎬 Danh Sách Phim ({movies.length})</h2>

            <div className="movie-grid">
                {movies.length === 0 ? (
                    <div className="no-movies">
                        <div style={{ fontSize: '60px' }}>🎭</div>
                        <p>Chưa có phim nào được đăng tải. Hãy vào Khu Quản Trị để thêm phim!</p>
                    </div>
                ) : (
                    movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))
                )}
            </div>
        </div>
    );
}

export default HomePage;
