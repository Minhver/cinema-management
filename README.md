# Cinema Management System (Hệ Thống Quản Lý Rạp Chiếu Phim)

Đây là một ứng dụng web giúp quản lý rạp chiếu phim, cho phép người dùng xem danh sách phim, lịch chiếu, đặt vé và cung cấp một khu vực quản trị viên (Admin) để quản lý toàn bộ hệ thống.

## 🚀 Công Nghệ Sử Dụng

- **Frontend**: React.js (Giao diện người dùng)
- **Backend**: Node.js & Express (API, Server)

## 📦 Hướng Dẫn Cài Đặt và Khởi Chạy

### 1. Khởi chạy Backend (Server)
Mở một terminal mới và chạy các lệnh sau:
```bash
cd backend
npm install
npm start
```
*Server sẽ chạy mặc định ở cổng 5000.*

### 2. Khởi chạy Frontend (Client)
Mở một terminal khác và chạy các lệnh sau:
```bash
cd frontend
npm install
npm start
```
*Giao diện web sẽ được mở tại `http://localhost:3000`.*

---

## 🔒 Khu Vực Quản Trị (Admin Panel)

Khu vực dành riêng cho quản trị viên để quản lý phim, suất chiếu và đơn đặt vé của khách.

- **Truy cập từ giao diện**: Bấm vào nút "Admin" hoặc truy cập đường dẫn `/admin`
- **Mật mã truy cập**: `12345689`

### Các tính năng của Admin:
- **Quản lý phim**: Đăng tải phim mới, chỉnh sửa thông tin (tên, thể loại, mô tả, ảnh poster) hoặc xóa phim.
- **Quản lý suất chiếu**: Thêm suất chiếu mới cho các phim đang có, chọn ngày giờ và phòng chiếu.
- **Quản lý đặt vé**: Theo dõi danh sách khách hàng đặt vé, chỉnh sửa thông tin khách (tên, suất chiếu, đổi ghế ngồi) hoặc hủy đơn đặt vé











