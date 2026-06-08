-- ==========================================
-- 1. NHIỆM VỤ THIẾT KẾ BẢNG (DATABASE SCHEMA)
-- ==========================================

CREATE DATABASE IF NOT EXISTS QuanLyRapPhim;
USE QuanLyRapPhim;

-- Tạo bảng phim (Movie)
CREATE TABLE Movie (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ten_phim VARCHAR(255) NOT NULL,
    thoi_luong INT NOT NULL,
    hinh_anh VARCHAR(255)
);

-- Tạo bảng suất chiếu (Showtime)
CREATE TABLE Showtime (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phim_id INT NOT NULL,
    ngay_chieu DATE NOT NULL,
    gia_ve FLOAT NOT NULL,
    FOREIGN KEY (phim_id) REFERENCES Movie(id) ON DELETE CASCADE
);

-- Tạo bảng ghế (Seat)
CREATE TABLE Seat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    suat_chieu_id INT NOT NULL,
    so_ghe VARCHAR(10) NOT NULL,
    trang_thai BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (suat_chieu_id) REFERENCES Showtime(id) ON DELETE CASCADE
);

-- ==========================================
-- 2. NHIỆM VỤ VIẾT FILE DATA (DỮ LIỆU MẪU)
-- ==========================================

-- Chèn phim mẫu
INSERT INTO Movie (id, ten_phim, thoi_luong, hinh_anh) VALUES
(1, 'Avengers: Endgame', 181, 'https://example.com/avengers.jpg'),
(2, 'Lật Mặt 7', 138, 'https://example.com/latmat7.jpg');

-- Chèn suất chiếu mẫu
INSERT INTO Showtime (id, phim_id, ngay_chieu, gia_ve) VALUES
(101, 1, '2026-06-15', 90000),
(102, 2, '2026-06-15', 85000);

-- Chèn ghế mẫu cho suất chiếu 101
INSERT INTO Seat (suat_chieu_id, so_ghe, trang_thai) VALUES
(101, 'A1', FALSE), -- FALSE là ghế trống
(101, 'A2', TRUE),  -- TRUE là ghế đã đặt
(101, 'A3', FALSE),
(101, 'B1', FALSE);

