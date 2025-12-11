// ProductIcons.jsx
// Các icon components tái sử dụng cho Product Card

import React from 'react';
import { Heart, Eye, ShoppingCart, Star } from 'lucide-react';
import "./ProductIcons.module.scss";
/**
 * Icon yêu thích (trái tim)
 * @param {function} onClick - Callback khi click
 * @param {boolean} isFavorite - Trạng thái yêu thích
 * @param {string} className - Class CSS thêm vào
 */
export const FavoriteIcon = ({ onClick, isFavorite, className = '' }) => (
    <button
        onClick={onClick}
        className={className}
        aria-label='Add to favorites'
        type='button'
    >
        <Heart
            size={20}
            fill={isFavorite ? 'currentColor' : 'none'}
            strokeWidth={2}
        />
    </button>
);

/**
 * Icon xem nhanh (mắt)
 * @param {function} onClick - Callback khi click
 * @param {string} className - Class CSS thêm vào
 */
export const QuickViewIcon = ({ onClick, className = '' }) => (
    <button
        onClick={onClick}
        className={className}
        aria-label='Quick view'
        type='button'
    >
        <Eye size={20} strokeWidth={2} />
    </button>
);

/**
 * Icon thêm vào giỏ hàng
 * @param {function} onClick - Callback khi click
 * @param {string} className - Class CSS thêm vào
 */
export const AddToCartIcon = ({ onClick, className = '' }) => (
    <button
        onClick={onClick}
        className={className}
        aria-label='Add to cart'
        type='button'
    >
        <ShoppingCart size={20} strokeWidth={2} />
    </button>
);

/**
 * Component đánh giá bằng sao
 * @param {number} rating - Số sao (0-5)
 * @param {number} size - Kích thước icon
 * @param {string} className - Class CSS thêm vào
 */
export const StarRating = ({ rating = 0, size = 14, className = '' }) => {
    return (
        <div className={className} style={{ display: 'flex', gap: '2px' }}>
            {[...Array(5)].map((_, index) => (
                <Star
                    key={index}
                    size={size}
                    fill={index < Math.floor(rating) ? '#ffc107' : 'none'}
                    stroke={index < Math.floor(rating) ? '#ffc107' : '#ddd'}
                    strokeWidth={2}
                />
            ))}
        </div>
    );
};

/**
 * Icon share/chia sẻ
 * @param {function} onClick - Callback khi click
 * @param {string} className - Class CSS thêm vào
 */
export const ShareIcon = ({ onClick, className = '' }) => (
    <button
        onClick={onClick}
        className={className}
        aria-label='Share product'
        type='button'
    >
        <svg
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
        >
            <circle cx='18' cy='5' r='3' />
            <circle cx='6' cy='12' r='3' />
            <circle cx='18' cy='19' r='3' />
            <line x1='8.59' y1='13.51' x2='15.42' y2='17.49' />
            <line x1='15.41' y1='6.51' x2='8.59' y2='10.49' />
        </svg>
    </button>
);

/**
 * Icon so sánh sản phẩm
 * @param {function} onClick - Callback khi click
 * @param {boolean} isComparing - Trạng thái so sánh
 * @param {string} className - Class CSS thêm vào
 */
export const CompareIcon = ({ onClick, isComparing, className = '' }) => (
    <button
        onClick={onClick}
        className={className}
        aria-label='Compare product'
        type='button'
    >
        <svg
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill={isComparing ? 'currentColor' : 'none'}
            stroke='currentColor'
            strokeWidth='2'
        >
            <polyline points='17 1 21 5 17 9' />
            <path d='M3 11V9a4 4 0 0 1 4-4h14' />
            <polyline points='7 23 3 19 7 15' />
            <path d='M21 13v2a4 4 0 0 1-4 4H3' />
        </svg>
    </button>
);
