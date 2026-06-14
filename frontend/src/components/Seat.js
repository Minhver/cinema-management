import React from 'react';

/**
 * Seat component — Hiển thị một ghế ngồi với 3 trạng thái:
 * - available: Ghế trống, có thể chọn
 * - selected:  Ghế đang được chọn bởi người dùng
 * - booked:    Ghế đã được đặt (không thể chọn)
 */
function Seat({ seatId, status, onToggle }) {
    const isBooked = status === 'booked';
    const isSelected = status === 'selected';

    const handleClick = () => {
        if (!isBooked) {
            onToggle(seatId);
        }
    };

    const className = [
        'seat-btn',
        isSelected ? 'selected' : '',
        isBooked ? 'booked' : ''
    ].filter(Boolean).join(' ');

    const icon = isBooked ? '✗' : isSelected ? '✓' : '○';

    return (
        <button
            type="button"
            className={className}
            onClick={handleClick}
            disabled={isBooked}
            title={isBooked ? `Ghế ${seatId} đã được đặt` : `Ghế ${seatId}`}
            aria-label={`Ghế ${seatId} - ${isBooked ? 'đã đặt' : isSelected ? 'đang chọn' : 'trống'}`}
        >
            <span>{icon}</span>
            <span>{seatId}</span>
        </button>
    );
}

export default Seat;
