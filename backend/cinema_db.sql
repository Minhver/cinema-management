-- =====================================================
--  CINEMA MANAGEMENT DATABASE SETUP SCRIPT
--  Chạy lệnh: mysql -u root -p < cinema_db.sql
-- =====================================================

CREATE DATABASE IF NOT EXISTS cinema_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cinema_db;

-- =====================================================
-- Bảng Movies: Danh sách phim
-- =====================================================
CREATE TABLE IF NOT EXISTS movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    image TEXT,
    description TEXT,
    duration INT DEFAULT 120 COMMENT 'Thời lượng phim (phút)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Bảng Showtimes: Suất chiếu
-- =====================================================
CREATE TABLE IF NOT EXISTS showtimes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT NOT NULL,
    show_date DATE NOT NULL,
    show_time VARCHAR(10) NOT NULL COMMENT 'VD: 15:00, 18:00, 21:00',
    hall VARCHAR(50) DEFAULT 'Phòng 1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

-- =====================================================
-- Bảng Bookings: Đơn đặt vé
-- =====================================================
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    showtime VARCHAR(20) NOT NULL COMMENT 'Suất chiếu: 15:00/18:00/21:00',
    seats TEXT NOT NULL COMMENT 'Danh sách ghế dạng JSON: ["A1","A2"]',
    total_tickets INT NOT NULL DEFAULT 1,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

-- =====================================================
-- Dữ liệu mẫu: Phim
-- =====================================================
INSERT INTO movies (title, genre, image, description, duration) VALUES
(
    'Doctor Strange: Đa Vũ Trụ Điên Loạn',
    'Hành Động / Viễn Tưởng',
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
    'Hành trình khám phá đa vũ trụ đầy huyền bí và nguy hiểm của Phù Thủy Tối Thượng Doctor Strange.',
    126
),
(
    'Lật Mặt 7: Một Điều Ước',
    'Tâm Lý / Gia Đình',
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500',
    'Câu chuyện gia đình cảm động lấy đi nước mắt của hàng triệu khán giả Việt Nam.',
    128
),
(
    'Avengers: Endgame',
    'Hành Động / Siêu Anh Hùng',
    'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500',
    'Trận chiến cuối cùng của các siêu anh hùng chống lại Thanos nhằm cứu vũ trụ.',
    181
),
(
    'Inception',
    'Khoa Học Viễn Tưởng / Hành Động',
    'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=500',
    'Một tên trộm tài năng chuyên đánh cắp bí mật từ giấc mơ của người khác nhận nhiệm vụ bất khả thi.',
    148
);

-- Suất chiếu mẫu
INSERT INTO showtimes (movie_id, show_date, show_time, hall) VALUES
(1, CURDATE(), '15:00', 'Phòng 1'),
(1, CURDATE(), '18:00', 'Phòng 1'),
(1, CURDATE(), '21:00', 'Phòng 2'),
(2, CURDATE(), '15:00', 'Phòng 2'),
(2, CURDATE(), '18:00', 'Phòng 3'),
(2, CURDATE(), '21:00', 'Phòng 1'),
(3, CURDATE(), '18:00', 'Phòng 2'),
(4, CURDATE(), '21:00', 'Phòng 3');

-- Xác nhận
SELECT 'Database cinema_db đã được khởi tạo thành công!' AS status;
SELECT COUNT(*) AS total_movies FROM movies;
