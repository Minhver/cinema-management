import React from 'react';
import { Link } from 'react-router-dom';

function MovieCard({ movie }) {
    const descText = movie.description
        ? movie.description.substring(0, 100) + (movie.description.length > 100 ? '...' : '')
        : 'Chưa có mô tả.';

    return (
        <div className="movie-card">
            <div className="movie-poster-wrapper">
                <img
                    src={movie.image || 'https://via.placeholder.com/400x380?text=No+Image'}
                    alt={movie.title}
                    className="movie-poster"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x380?text=No+Image'; }}
                />
                <div className="movie-overlay" />
                {movie.duration && (
                    <span className="movie-duration-badge">⏱ {movie.duration} phút</span>
                )}
            </div>
            <div className="movie-info">
                <h3>{movie.title}</h3>
                <span className="genre-badge">{movie.genre}</span>
                <p className="movie-desc">{descText}</p>
                <Link to={`/book/${movie.id}`} className="book-now-btn">
                    🎟 Đặt Vé Ngay
                </Link>
            </div>
        </div>
    );
}

export default MovieCard;
