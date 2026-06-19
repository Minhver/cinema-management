import React, { useState, useRef, useEffect } from 'react';

/**
 * CustomSelect — thay thế native <select> để dropdown luôn mở xuống dưới.
 * Props:
 *   value       – giá trị đang chọn
 *   onChange    – hàm (value) => void
 *   options     – mảng { value, label }
 *   placeholder – chuỗi hiển thị khi chưa chọn (tuỳ chọn)
 *   required    – boolean (tuỳ chọn)
 *   disabled    – boolean (tuỳ chọn)
 *   className   – class thêm vào wrapper (tuỳ chọn)
 */
function CustomSelect({ value, onChange, options = [], placeholder, required, disabled, className }) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    // Đóng dropdown khi click bên ngoài
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(o => String(o.value) === String(value));
    const displayLabel = selectedOption ? selectedOption.label : (placeholder || '-- Chọn --');

    const handleSelect = (optValue) => {
        onChange(optValue);
        setOpen(false);
    };

    return (
        <div
            ref={wrapperRef}
            className={`custom-select-wrapper${open ? ' open' : ''}${disabled ? ' disabled' : ''} ${className || ''}`}
        >
            <button
                type="button"
                className="custom-select-trigger"
                onClick={() => !disabled && setOpen(prev => !prev)}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span className={selectedOption ? '' : 'placeholder-text'}>{displayLabel}</span>
                <svg
                    className={`custom-select-arrow${open ? ' rotated' : ''}`}
                    width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round"
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {open && (
                <ul className="custom-select-dropdown" role="listbox">
                    {options.map(opt => (
                        <li
                            key={opt.value}
                            role="option"
                            aria-selected={String(opt.value) === String(value)}
                            className={`custom-select-option${String(opt.value) === String(value) ? ' selected' : ''}`}
                            onClick={() => handleSelect(opt.value)}
                        >
                            {opt.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default CustomSelect;
