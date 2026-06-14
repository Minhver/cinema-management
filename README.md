# cinema-management

PHẦN 1: Phát Triển \& Hoàn Thiện Backend

1.1. Thư mục gốc: server.js

const express = require('express');

const cors = require('cors');

require('dotenv').config();



const movieRoutes = require('./routes/movieRoutes');



const app = express();



// Middleware

app.use(cors()); // Cho phép Frontend truy cập chéo nguồn

app.use(express.json()); // Đọc cấu trúc dữ liệu JSON gửi lên từ client



// Routes

app.use('/api/movies', movieRoutes);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

&#x20;   console.log(`Server is running on port ${PORT}`);

});



1.2. Thư mục controllers: controllers/bookingController.js

// Hệ thống mảng lưu trữ danh sách đặt vé tạm thời

let bookings = \[];



// 1. Logic xử lý tạo đơn đặt vé mới

exports.createBooking = (req, res) => {

&#x20;   const movieId = parseInt(req.params.id);

&#x20;   const { customerName, seats, showtime } = req.body;



&#x20;   // Kiểm tra dữ liệu đầu vào bắt buộc

&#x20;   if (!customerName || !seats || !showtime || seats.length === 0) {

&#x20;       return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin và chọn ghế ngồi hợp lệ!" });

&#x20;   }



&#x20;   const newBooking = {

&#x20;       id: bookings.length + 1,

&#x20;       movieId,

&#x20;       customerName,

&#x20;       seats, // Định dạng mảng: \['A1', 'A2']

&#x20;       showtime,

&#x20;       bookingDate: new Date().toLocaleString('vi-VN')

&#x20;   };



&#x20;   bookings.push(newBooking);

&#x20;   res.status(201).json({ message: "Đặt vé thành công!", booking: newBooking });

};



// 2. Lấy toàn bộ danh sách đặt vé hiện tại (Quyền hạn quản trị)

exports.getAllBookings = (req, res) => {

&#x20;   res.json(bookings);

};



1.3. Thư mục controllers: controllers/movieController.js



// Danh mục cơ sở dữ liệu phim mô phỏng ban đầu

let movies = \[

&#x20;   { 

&#x20;       id: 1, 

&#x20;       title: "Doctor Strange: Đa Vũ Trụ Điên Loạn", 

&#x20;       genre: "Hành Động / Viễn Tưởng", 

&#x20;       image: "\[https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500](https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500)", 

&#x20;       description: "Hành trình khám phá đa vũ trụ đầy huyền bí và nguy hiểm của Phù Thủy Tối Thượng." 

&#x20;   },

&#x20;   { 

&#x20;       id: 2, 

&#x20;       title: "Lật Mặt 7: Một Điều Ước", 

&#x20;       genre: "Tâm Lý / Gia Đình", 

&#x20;       image: "\[https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500](https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500)", 

&#x20;       description: "Câu chuyện gia đình cảm động lấy đi nước mắt của hàng triệu khán giả." 

&#x20;   }

];



// Lấy danh sách toàn bộ các bộ phim đang có

exports.getAllMovies = (req, res) => {

&#x20;   res.json(movies);

};



// Lấy thông tin chi tiết của một bộ phim cụ thể theo ID đường dẫn

exports.getMovieById = (req, res) => {

&#x20;   const movie = movies.find(m => m.id === parseInt(req.params.id));

&#x20;   if (!movie) return res.status(404).json({ message: "Không tìm thấy bộ phim yêu cầu!" });

&#x20;   res.json(movie);

};



// Cơ chế dành cho Admin nhằm đăng tải thêm phim mới lên hệ thống

exports.addMovie = (req, res) => {

&#x20;   const { title, genre, image, description } = req.body;

&#x20;   

&#x20;   if (!title || !genre || !image) {

&#x20;       return res.status(400).json({ message: "Vui lòng cung cấp đầy đủ tên phim, thể loại và đường dẫn hình ảnh!" });

&#x20;   }

&#x20;   

&#x20;   const newMovie = {

&#x20;       id: movies.length + 1,

&#x20;       title,

&#x20;       genre,

&#x20;       image,

&#x20;       description: description || "Chưa có nội dung mô tả chi tiết cho bộ phim này."

&#x20;   };

&#x20;   

&#x20;   movies.push(newMovie);

&#x20;   res.status(201).json({ message: "Đăng tải phim mới lên hệ thống thành công!", movie: newMovie });

};





1.4. Thư mục routes: routes/movieRoutes.js

const express = require('express');

const router = express.Router();

const movieController = require('../controllers/movieController');

const bookingController = require('../controllers/bookingController');



// Nhóm Endpoint quản lý Phim (Movies)

router.get('/', movieController.getAllMovies);                    // GET: http://localhost:5000/api/movies

router.get('/:id', movieController.getMovieById);                // GET: http://localhost:5000/api/movies/:id

router.post('/', movieController.addMovie);                       // POST: http://localhost:5000/api/movies (Quyền Admin)



// Nhóm Endpoint quản lý Đặt Vé (Bookings)

router.post('/:id/book', bookingController.createBooking);        // POST: http://localhost:5000/api/movies/:id/book

router.get('/admin/bookings', bookingController.getAllBookings);  // GET: http://localhost:5000/api/movies/admin/bookings



module.exports = router;





PHẦN 2: Xây Dựng Khung Giao Diện Frontend (React)

import React from 'react';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Home from './pages/Home';

import BookingPage from './pages/BookingPage';

import Admin from './pages/Admin';



function App() {

&#x20; return (

&#x20;   <Router>

&#x20;     <div className="app-container">

&#x20;       {/\* Thanh Menu Điều Hướng Toàn Cục \*/}

&#x20;       <nav className="navbar">

&#x20;         <div className="logo">

&#x20;           <Link to="/">🎬 SUNSTAR CINEMA</Link>

&#x20;         </div>

&#x20;         <div className="nav-links">

&#x20;           <Link to="/">Trang Chủ</Link>

&#x20;           <Link to="/admin" className="admin-btn">Khu Quản Trị</Link>

&#x20;         </div>

&#x20;       </nav>



&#x20;       {/\* Cửa Sổ Render Nội Dung Giao Diện Khách Hàng \*/}

&#x20;       <main className="content">

&#x20;         <Routes>

&#x20;           <Route path="/" element={<Home />} />

&#x20;           <Route path="/book/:id" element={<BookingPage />} />

&#x20;           <Route path="/admin" element={<Admin />} />

&#x20;         </Routes>

&#x20;       </main>

&#x20;     </div>

&#x20;   </Router>

&#x20; );

}



export default App;







2.1. Cấu hình định tuyến: src/App.js



import React from 'react';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Home from './pages/Home';

import BookingPage from './pages/BookingPage';

import Admin from './pages/Admin';



function App() {

&#x20; return (

&#x20;   <Router>

&#x20;     <div className="app-container">

&#x20;       {/\* Thanh Menu Điều Hướng Toàn Cục \*/}

&#x20;       <nav className="navbar">

&#x20;         <div className="logo">

&#x20;           <Link to="/">🎬 SUNSTAR CINEMA</Link>

&#x20;         </div>

&#x20;         <div className="nav-links">

&#x20;           <Link to="/">Trang Chủ</Link>

&#x20;           <Link to="/admin" className="admin-btn">Khu Quản Trị</Link>

&#x20;         </div>

&#x20;       </nav>



&#x20;       {/\* Cửa Sổ Render Nội Dung Giao Diện Khách Hàng \*/}

&#x20;       <main className="content">

&#x20;         <Routes>

&#x20;           <Route path="/" element={<Home />} />

&#x20;           <Route path="/book/:id" element={<BookingPage />} />

&#x20;           <Route path="/admin" element={<Admin />} />

&#x20;         </Routes>

&#x20;       </main>

&#x20;     </div>

&#x20;   </Router>

&#x20; );

}



export default App;



2.2. Giao diện trang chủ: src/pages/Home.js

import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';



function Home() {

&#x20; const \[movies, setMovies] = useState(\[]);



&#x20; useEffect(() => {

&#x20;   fetch('http://localhost:5000/api/movies')

&#x20;     .then((res) => res.json())

&#x20;     .then((data) => setMovies(data))

&#x20;     .catch((err) => console.error("Lỗi đồng bộ dữ liệu phim:", err));

&#x20; }, \[]);



&#x20; return (

&#x20;   <div className="home-page">

&#x20;     <header className="hero-banner">

&#x20;       <h1>PHIM ĐANG CHIẾU HOT NHẤT</h1>

&#x20;       <p>Đặt vé nhanh chóng, trải nghiệm điện ảnh đỉnh cao tại rạp phim của Sơn</p>

&#x20;     </header>



&#x20;     <div className="movie-grid">

&#x20;       {movies.map((movie) => (

&#x20;         <div key={movie.id} className="movie-card">

&#x20;           <img src={movie.image} alt={movie.title} className="movie-poster" />

&#x20;           <div className="movie-info">

&#x20;             <h3>{movie.title}</h3>

&#x20;             <span className="genre-badge">{movie.genre}</span>

&#x20;             <p className="movie-desc">{movie.description.substring(0, 100)}...</p>

&#x20;             <Link to={`/book/${movie.id}`} className="book-now-btn">Đặt Vé Ngay</Link>

&#x20;           </div>

&#x20;         </div>

&#x20;       ))}

&#x20;     </div>

&#x20;   </div>

&#x20; );

}



export default Home;



2.3. Giao diện đặt vé: src/pages/BookingPage.js

import React, { useState, useEffect } from 'react';

import { useParams, useNavigate } from 'react-router-dom';



function BookingPage() {

&#x20; const { id } = useParams();

&#x20; const navigate = useNavigate();

&#x20; const \[movie, setMovie] = useState(null);

&#x20; 

&#x20; // Quản lý trạng thái Form nhập liệu

&#x20; const \[customerName, setCustomerName] = useState('');

&#x20; const \[showtime, setShowtime] = useState('18:00');

&#x20; const \[selectedSeats, setSelectedSeats] = useState(\[]);



&#x20; // Danh sách sơ đồ ghế mô phỏng trong rạp

&#x20; const availableSeats = \['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'];



&#x20; useEffect(() => {

&#x20;   fetch(`http://localhost:5000/api/movies/${id}`)

&#x20;     .then((res) => res.json())

&#x20;     .then((data) => setMovie(data))

&#x20;     .catch((err) => console.error("Lỗi lấy thông tin phim:", err));

&#x20; }, \[id]);



&#x20; const toggleSeatSelection = (seat) => {

&#x20;   if (selectedSeats.includes(seat)) {

&#x20;     setSelectedSeats(selectedSeats.filter(s => s !== seat));

&#x20;   } else {

&#x20;     setSelectedSeats(\[...selectedSeats, seat]);

&#x20;   }

&#x20; };



&#x20; const executeBookingSubmit = (e) => {

&#x20;   e.preventDefault();

&#x20;   

&#x20;   if(selectedSeats.length === 0) {

&#x20;       alert("Vui lòng lựa chọn ít nhất một vị trí ghế ngồi trước khi thanh toán!");

&#x20;       return;

&#x20;   }



&#x20;   fetch(`http://localhost:5000/api/movies/${id}/book`, {

&#x20;     method: 'POST',

&#x20;     headers: { 'Content-Type': 'application/json' },

&#x20;     body: JSON.stringify({ customerName, showtime, seats: selectedSeats })

&#x20;   })

&#x20;   .then(res => res.json())

&#x20;   .then(data => {

&#x20;     alert(data.message);

&#x20;     if(data.booking) {

&#x20;       navigate('/'); // Điều hướng trả người dùng về trang chủ

&#x20;     }

&#x20;   })

&#x20;   .catch(err => console.error("Lỗi xử lý đặt vé:", err));

&#x20; };



&#x20; if (!movie) return <div className="loading">Đang tải dữ liệu phòng chiếu từ hệ thống...</div>;



&#x20; return (

&#x20;   <div className="booking-page">

&#x20;     <h2>Tiến Hành Đặt Vé Phim: {movie.title}</h2>

&#x20;     <div className="booking-container">

&#x20;       <img src={movie.image} alt={movie.title} className="booking-poster" />

&#x20;       

&#x20;       <form onSubmit={executeBookingSubmit} className="booking-form">

&#x20;         <div className="form-group">

&#x20;           <label>Họ và Tên khách hàng:</label>

&#x20;           <input 

&#x20;             type="text" 

&#x20;             required 

&#x20;             value={customerName} 

&#x20;             onChange={(e) => setCustomerName(e.target.value)} 

&#x20;             placeholder="Nhập tên người nhận vé..."

&#x20;           />

&#x20;         </div>



&#x20;         <div className="form-group">

&#x20;           <label>Suất chiếu:</label>

&#x20;           <select value={showtime} onChange={(e) => setShowtime(e.target.value)}>

&#x20;             <option value="15:00">15:00 - Chiều</option>

&#x20;             <option value="18:00">18:00 - Tối</option>

&#x20;             <option value="21:00">21:00 - Đêm</option>

&#x20;           </select>

&#x20;         </div>



&#x20;         <div className="form-group">

&#x20;           <label>Vị trí ghế ngồi (Chọn trực tiếp bên dưới):</label>

&#x20;           <div className="screen-indicator">🎬 MÀN HÌNH CHÍNH</div>

&#x20;           <div className="seat-grid">

&#x20;             {availableSeats.map(seat => (

&#x20;               <button

&#x20;                 type="button"

&#x20;                 key={seat}

&#x20;                 className={`seat-btn ${selectedSeats.includes(seat) ? 'selected' : ''}`}

&#x20;                 onClick={() => toggleSeatSelection(seat)}

&#x20;               >

&#x20;                 {seat}

&#x20;               </button>

&#x20;             ))}

&#x20;           </div>

&#x20;         </div>



&#x20;         <button type="submit" className="confirm-btn">Xác Nhận Đặt Ghế \& Thanh Toán</button>

&#x20;       </form>

&#x20;     </div>

&#x20;   </div>

&#x20; );

}



export default BookingPage;



2.4. Giao diện quản trị viên: src/pages/Admin.js

import React, { useState, useEffect } from 'react';



function Admin() {

&#x20; // Biến trạng thái Form thêm phim mới

&#x20; const \[title, setTitle] = useState('');

&#x20; const \[genre, setGenre] = useState('');

&#x20; const \[image, setImage] = useState('');

&#x20; const \[description, setDescription] = useState('');

&#x20; 

&#x20; // Trạng thái lưu danh sách khách hàng đặt vé từ Backend

&#x20; const \[bookings, setBookings] = useState(\[]);



&#x20; const syncBookingsFromServer = () => {

&#x20;   fetch('http://localhost:5000/api/movies/admin/bookings')

&#x20;     .then(res => res.json())

&#x20;     .then(data => setBookings(data))

&#x20;     .catch(err => console.error("Lỗi đồng bộ danh sách đơn hàng:", err));

&#x20; };



&#x20; useEffect(() => {

&#x20;   syncBookingsFromServer();

&#x20; }, \[]);



&#x20; const handlePostMovieSubmit = (e) => {

&#x20;   e.preventDefault();

&#x20;   fetch('http://localhost:5000/api/movies', {

&#x20;     method: 'POST',

&#x20;     headers: { 'Content-Type': 'application/json' },

&#x20;     body: JSON.stringify({ title, genre, image, description })

&#x20;   })

&#x20;   .then(res => res.json())

&#x20;   .then(data => {

&#x20;     alert(data.message);

&#x20;     // Xóa sạch dữ liệu ô input sau khi thêm thành công

&#x20;     setTitle(''); setGenre(''); setImage(''); setDescription('');

&#x20;   })

&#x20;   .catch(err => console.error("Lỗi thêm phim mới:", err));

&#x20; };



&#x20; return (

&#x20;   <div className="admin-page">

&#x20;     <h2>HỆ THỐNG QUẢN TRỊ HỆ THỐNG - ADMIN PANEL</h2>

&#x20;     

&#x20;     <div className="admin-grid">

&#x20;       {/\* Phân hệ 1: Biểu mẫu thêm dữ liệu phim \*/}

&#x20;       <div className="admin-card">

&#x20;         <h3>Đăng Tải Thước Phim Mới</h3>

&#x20;         <form onSubmit={handlePostMovieSubmit} className="admin-form">

&#x20;           <input type="text" placeholder="Tên tiêu đề phim..." required value={title} onChange={e => setTitle(e.target.value)} />

&#x20;           <input type="text" placeholder="Thể loại (Ví dụ: Kinh dị, Hành động)..." required value={genre} onChange={e => setGenre(e.target.value)} />

&#x20;           <input type="text" placeholder="Đường dẫn URL hình ảnh poster..." required value={image} onChange={e => setImage(e.target.value)} />

&#x20;           <textarea placeholder="Nội dung mô tả ngắn gọn bộ phim..." rows="4" value={description} onChange={e => setDescription(e.target.value)}></textarea>

&#x20;           <button type="submit">Phát Hành Phim</button>

&#x20;         </form>

&#x20;       </div>



&#x20;       {/\* Phân hệ 2: Bảng hiển thị thông tin đặt chỗ của khách hàng \*/}

&#x20;       <div className="admin-card">

&#x20;         <div className="admin-card-header">

&#x20;           <h3>Danh Sách Khách Đặt Vé</h3>

&#x20;           <button onClick={syncBookingsFromServer} className="refresh-btn">🔄 Tải Lại Dữ Liệu</button>

&#x20;         </div>

&#x20;         <table className="booking-table">

&#x20;           <thead>

&#x20;             <tr>

&#x20;               <th>Mã Đơn</th>

&#x20;               <th>Mã Phim</th>

&#x20;               <th>Tên Khách Hàng</th>

&#x20;               <th>Suất Chiếu</th>

&#x20;               <th>Vị Trí Ghế</th>

&#x20;             </tr>

&#x20;           </thead>

&#x20;           <tbody>

&#x20;             {bookings.length === 0 ? (

&#x20;               <tr><td colSpan="5" style={{textAlign:'center', color: '#aaa'}}>Chưa ghi nhận dữ liệu đặt chỗ nào trên hệ thống.</td></tr>

&#x20;             ) : (

&#x20;               bookings.map(b => (

&#x20;                 <tr key={b.id}>

&#x20;                   <td>#{b.id}</td>

&#x20;                   <td>Phim ID: {b.movieId}</td>

&#x20;                   <td><strong>{b.customerName}</strong></td>

&#x20;                   <td>{b.showtime}</td>

&#x20;                   <td><span className="seat-indicator-cell">{b.seats.join(', ')}</span></td>

&#x20;                 </tr>

&#x20;               ))

&#x20;             )}

&#x20;           </tbody>

&#x20;         </table>

&#x20;       </div>

&#x20;     </div>

&#x20;   </div>

&#x20; );

}



export default Admin;



2.5. Tệp thiết kế giao diện: src/index.css



:root {

&#x20; --bg-color: #0f0f12;

&#x20; --card-bg: #1a1a24;

&#x20; --primary-color: #ff2a3b;

&#x20; --text-color: #ffffff;

&#x20; --text-secondary: #9da4b0;

&#x20; --accent-color: #2bd97b;

}



body {

&#x20; margin: 0;

&#x20; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

&#x20; background-color: var(--bg-color);

&#x20; color: var(--text-color);

&#x20; -webkit-font-smoothing: antialiased;

}



/\* Thanh Thao Tác Header Navbar \*/

.navbar {

&#x20; display: flex;

&#x20; justify-content: space-between;

&#x20; align-items: center;

&#x20; background-color: #060608;

&#x20; padding: 15px 5%;

&#x20; border-bottom: 1px solid #23232f;

}

.navbar .logo a {

&#x20; color: var(--primary-color);

&#x20; text-decoration: none;

&#x20; font-size: 22px;

&#x20; font-weight: 900;

&#x20; letter-spacing: 1px;

}

.nav-links a {

&#x20; color: var(--text-color);

&#x20; text-decoration: none;

&#x20; font-weight: 600;

&#x20; margin-left: 25px;

&#x20; transition: color 0.2s;

}

.nav-links a:hover {

&#x20; color: var(--primary-color);

}

.nav-links .admin-btn {

&#x20; background-color: var(--primary-color);

&#x20; padding: 8px 18px;

&#x20; border-radius: 20px;

&#x20; color: white;

}

.nav-links .admin-btn:hover {

&#x20; background-color: #cc1f2e;

&#x20; color: white;

}



/\* Layout Trang Chủ (Catalog Phim) \*/

.hero-banner {

&#x20; text-align: center;

&#x20; padding: 60px 20px;

&#x20; background: linear-gradient(rgba(15,15,18,0.85), var(--bg-color)), url('\[https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200](https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200)');

&#x20; background-size: cover;

&#x20; background-position: center;

}

.hero-banner h1 {

&#x20; font-size: 36px;

&#x20; margin-bottom: 10px;

&#x20; letter-spacing: 1px;

}

.hero-banner p {

&#x20; color: var(--text-secondary);

}

.movie-grid {

&#x20; display: grid;

&#x20; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));

&#x20; gap: 30px;

&#x20; padding: 40px 5%;

}

.movie-card {

&#x20; background-color: var(--card-bg);

&#x20; border-radius: 12px;

&#x20; overflow: hidden;

&#x20; border: 1px solid #252538;

&#x20; transition: transform 0.3s, box-shadow 0.3s;

}

.movie-card:hover {

&#x20; transform: translateY(-8px);

&#x20; box-shadow: 0 10px 20px rgba(0,0,0,0.5);

}

.movie-poster {

&#x20; width: 100%;

&#x20; height: 360px;

&#x20; object-fit: cover;

}

.movie-info {

&#x20; padding: 20px;

}

.movie-info h3 {

&#x20; margin: 0 0 10px 0;

&#x20; font-size: 18px;

}

.genre-badge {

&#x20; background-color: #28283d;

&#x20; padding: 4px 10px;

&#x20; font-size: 11px;

&#x20; border-radius: 50px;

&#x20; color: #00d2ff;

&#x20; font-weight: bold;

}

.movie-desc {

&#x20; color: var(--text-secondary);

&#x20; font-size: 13px;

&#x20; line-height: 1.5;

&#x20; margin: 15px 0;

}

.book-now-btn {

&#x20; display: block;

&#x20; text-align: center;

&#x20; background-color: var(--primary-color);

&#x20; color: white;

&#x20; text-decoration: none;

&#x20; padding: 12px;

&#x20; border-radius: 8px;

&#x20; font-weight: bold;

&#x20; transition: background 0.2s;

}

.book-now-btn:hover {

&#x20; background-color: #d00716;

}



/\* Khối Đặt Vé Phòng Chiếu \*/

.booking-page {

&#x20; padding: 40px 5%;

}

.booking-container {

&#x20; display: flex;

&#x20; flex-wrap: wrap;

&#x20; gap: 40px;

&#x20; background-color: var(--card-bg);

&#x20; padding: 30px;

&#x20; border-radius: 16px;

&#x20; border: 1px solid #252538;

}

.booking-poster {

&#x20; width: 300px;

&#x20; height: 420px;

&#x20; object-fit: cover;

&#x20; border-radius: 10px;

}

.booking-form {

&#x20; flex: 1;

&#x20; min-width: 300px;

&#x20; display: flex;

&#x20; flex-direction: column;

&#x20; gap: 20px;

}

.form-group {

&#x20; display: flex;

&#x20; flex-direction: column;

&#x20; gap: 8px;

}

.form-group label {

&#x20; font-weight: 600;

&#x20; color: var(--text-secondary);

}

.form-group input, .form-group select, .form-group textarea {

&#x20; background-color: #0f0f14;

&#x20; border: 1px solid #32324d;

&#x20; padding: 12px;

&#x20; color: white;

&#x20; border-radius: 8px;

&#x20; outline: none;

&#x20; font-size: 15px;

}

.form-group input:focus, .form-group select:focus {

&#x20; border-color: var(--primary-color);

}

.screen-indicator {

&#x20; background: linear-gradient(to bottom, #32324d, transparent);

&#x20; text-align: center;

&#x20; padding: 8px;

&#x20; font-size: 12px;

&#x20; font-weight: bold;

&#x20; letter-spacing: 4px;

&#x20; color: var(--text-secondary);

&#x20; border-radius: 4px;

&#x20; margin-bottom: 15px;

}

.seat-grid {

&#x20; display: grid;

&#x20; grid-template-columns: repeat(3, 60px);

&#x20; gap: 12px;

&#x20; justify-content: center;

}

.seat-btn {

&#x20; padding: 12px 0;

&#x20; background-color: #2d2d3f;

&#x20; color: white;

&#x20; border: 1px solid #3d3d5c;

&#x20; cursor: pointer;

&#x20; border-radius: 6px;

&#x20; font-weight: bold;

&#x20; transition: all 0.2s;

}

.seat-btn:hover {

&#x20; background-color: #3e3e56;

}

.seat-btn.selected {

&#x20; background-color: var(--accent-color);

&#x20; color: #000;

&#x20; border-color: var(--accent-color);

&#x20; box-shadow: 0 0 10px rgba(43,217,123,0.5);

}

.confirm-btn {

&#x20; background-color: var(--accent-color);

&#x20; color: #060608;

&#x20; border: none;

&#x20; padding: 14px;

&#x20; font-size: 16px;

&#x20; font-weight: bold;

&#x20; cursor: pointer;

&#x20; border-radius: 8px;

&#x20; transition: opacity 0.2s;

&#x20; margin-top: 10px;

}

.confirm-btn:hover {

&#x20; opacity: 0.9;

}



/\* Quản Trị Hệ Thống (Admin Panel) \*/

.admin-page {

&#x20; padding: 40px 5%;

}

.admin-page h2 {

&#x20; margin-bottom: 30px;

}

.admin-grid {

&#x20; display: grid;

&#x20; grid-template-columns: 1fr 2fr;

&#x20; gap: 30px;

}

@media (max-width: 992px) {

&#x20; .admin-grid {

&#x20;   grid-template-columns: 1fr;

&#x20; }

}

.admin-card {

&#x20; background-color: var(--card-bg);

&#x20; padding: 25px;

&#x20; border-radius: 14px;

&#x20; border: 1px solid #252538;

}

.admin-card h3 {

&#x20; margin-top: 0;

&#x20; margin-bottom: 20px;

&#x20; border-bottom: 2px solid #252538;

&#x20; padding-bottom: 10px;

}

.admin-card-header {

&#x20; display: flex;

&#x20; justify-content: space-between;

&#x20; align-items: center;

&#x20; margin-bottom: 20px;

}

.admin-card-header h3 {

&#x20; margin: 0;

&#x20; border: none;

&#x20; padding: 0;

}

.admin-form {

&#x20; display: flex;

&#x20; flex-direction: column;

&#x20; gap: 15px;

}

.admin-form input, .admin-form textarea {

&#x20; background-color: #0f0f14;

&#x20; border: 1px solid #32324d;

&#x20; padding: 12px;

&#x20; color: white;

&#x20; border-radius: 6px;

}

.admin-form button {

&#x20; background-color: var(--primary-color);

&#x20; color: white;

&#x20; border: none;

&#x20; padding: 12px;

&#x20; font-weight: bold;

&#x20; cursor: pointer;

&#x20; border-radius: 6px;

}

.refresh-btn {

&#x20; background: none;

&#x20; border: 1px solid #3d3d5c;

&#x20; color: white;

&#x20; padding: 6px 12px;

&#x20; cursor: pointer;

&#x20; border-radius: 6px;

&#x20; font-size: 13px;

&#x20; transition: background 0.2s;

}

.refresh-btn:hover {

&#x20; background-color: #252538;

}

.booking-table {

&#x20; width: 100%;

&#x20; border-collapse: collapse;

}

.booking-table th, .booking-table td {

&#x20; border: 1px solid #252538;

&#x20; padding: 12px;

&#x20; text-align: left;

&#x20; font-size: 14px;

}

.booking-table th {

&#x20; background-color: #0f0f14;

&#x20; color: var(--text-secondary);

}

.booking-table tr:hover {

&#x20; background-color: rgba(255,255,255,0.02);

}

.seat-indicator-cell {

&#x20; background-color: rgba(43,217,123,0.15);

&#x20; color: var(--accent-color);

&#x20; padding: 2px 6px;

&#x20; border-radius: 4px;

&#x20; font-weight: bold;

}











