import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import Admin from './pages/Admin';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Thanh Menu Điều Hướng Toàn Cục */}
        <nav className="navbar">
          <div className="logo">
            <Link to="/">🎬 SUNSTAR CINEMA</Link>
          </div>
          <div className="nav-links">
            <Link to="/">Trang Chủ</Link>
            <Link to="/admin" className="admin-btn">Khu Quản Trị</Link>
          </div>
        </nav>

        {/* Cửa Sổ Render Nội Dung */}
        <main className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/book/:id" element={<BookingPage />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>© 2026 SUNSTAR CINEMA — Trải nghiệm điện ảnh đỉnh cao</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
