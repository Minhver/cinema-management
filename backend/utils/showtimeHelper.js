const formatShowtimeKey = (showDate, showTime, hall = 'Phòng 1') => {
    let date;
    if (showDate instanceof Date) {
        const y = showDate.getFullYear();
        const m = String(showDate.getMonth() + 1).padStart(2, '0');
        const d = String(showDate.getDate()).padStart(2, '0');
        date = `${y}-${m}-${d}`;
    } else {
        date = String(showDate).split('T')[0];
    }
    return `${date} ${showTime}|${hall}`;
};

const formatShowtimeLabel = (showDate, showTime, hall = 'Phòng 1') => {
    let date;
    if (showDate instanceof Date) {
        const y = showDate.getFullYear();
        const m = String(showDate.getMonth() + 1).padStart(2, '0');
        const d = String(showDate.getDate()).padStart(2, '0');
        date = `${d}/${m}/${y}`;
    } else {
        const raw = String(showDate).split('T')[0];
        const [year, month, day] = raw.split('-');
        date = `${day}/${month}/${year}`;
    }
    return `${date} — ${showTime} (${hall})`;
};

const parseSeats = (seatsJson) => {
    if (!seatsJson) return [];
    try {
        const parsed = JSON.parse(seatsJson);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

module.exports = { formatShowtimeKey, formatShowtimeLabel, parseSeats };
