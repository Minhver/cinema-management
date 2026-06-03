const express = require('express');
const cors = require('cors');
require('dotenv').config();

const movieRoutes = require('./routes/movieRoutes');

const app = express();

// Middleware
app.use(cors()); // Cho phép Frontend truy cập
app.use(express.json()); // Đọc dữ liệu JSON gửi lên

// Routes
app.use('/api/movies', movieRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
