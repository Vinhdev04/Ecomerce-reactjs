import React, { useState } from 'react';
import styles from './ProductCard.module.scss';
import { Heart, Eye, ShoppingCart } from 'lucide-react';

// Icon Components
export const FavoriteIcon = ({ onClick, isFavorite, className = '' }) => (
    <button
        onClick={onClick}
        className={`${styles.iconBtn} ${
            isFavorite ? styles.active : ''
        } ${className}`}
        aria-label='Thêm vào yêu thích'
        type='button'
    >
        <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
    </button>
);

export const QuickViewIcon = ({ onClick, className = '' }) => (
    <button
        onClick={onClick}
        className={`${styles.iconBtn} ${className}`}
        aria-label='Xem nhanh'
        type='button'
    >
        <Eye size={20} />
    </button>
);

export const AddToCartIcon = ({ onClick, className = '' }) => (
    <button
        onClick={onClick}
        className={`${styles.iconBtn} ${styles.cartBtn} ${className}`}
        aria-label='Thêm vào giỏ'
        type='button'
    >
        <ShoppingCart size={20} />
    </button>
);

export default function ProductCard({
    image,
    title,
    description,
    price,
    onDetail,
    onBuy,
    onQuickView,
    badge = 'New',
    className = ''
}) {
    const [isFavorite, setIsFavorite] = useState(false);

    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        setIsFavorite(!isFavorite);
        console.log('Favorite toggled:', title);
    };

    const handleQuickViewClick = (e) => {
        e.stopPropagation();
        if (onQuickView) {
            onQuickView();
        }
        console.log('Quick view:', title);
    };

    const handleAddToCartClick = (e) => {
        e.stopPropagation();
        if (onBuy) {
            onBuy();
        }
        console.log('Add to cart:', title);
    };

    const handleDetailClick = () => {
        if (onDetail) {
            onDetail();
        }
        console.log('View detail:', title);
    };

    const handleBuyClick = () => {
        if (onBuy) {
            onBuy();
        }
        console.log('Buy now:', title);
    };

    return (
        <div className={`${styles.card} ${className}`}>
            <div className={styles.cardBody}>
                <div className={styles.cardImg}>
                    <img
                        src={
                            image ||
                            'https://via.placeholder.com/400x400?text=Product+Image'
                        }
                        alt={title || 'Product'}
                        loading='lazy'
                    />
                    {badge && <div className={styles.badge}>{badge}</div>}

                    <div className={styles.iconOverlay}>
                        <FavoriteIcon
                            onClick={handleFavoriteClick}
                            isFavorite={isFavorite}
                        />
                        <QuickViewIcon onClick={handleQuickViewClick} />
                        <AddToCartIcon onClick={handleAddToCartClick} />
                    </div>
                </div>

                <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>
                        {title || 'Tên sản phẩm'}
                    </h3>
                    <p className={styles.cardText}>
                        {description ||
                            'Mô tả ngắn gọn về sản phẩm, tính năng nổi bật và ưu điểm của sản phẩm này'}
                    </p>

                    {price && (
                        <div className={styles.cardPrice}>
                            <span className={styles.currentPrice}>
                                {price.toLocaleString('vi-VN')}đ
                            </span>
                            <span className={styles.oldPrice}>
                                {(price * 1.2).toLocaleString('vi-VN')}đ
                            </span>
                        </div>
                    )}
                </div>

                <div className={styles.cardFooter}>
                    <button
                        className={styles.btnDetail}
                        onClick={handleDetailClick}
                        type='button'
                    >
                        Chi tiết
                    </button>
                    <button
                        className={styles.btnBuy}
                        onClick={handleBuyClick}
                        type='button'
                    >
                        Mua Ngay
                    </button>
                </div>
            </div>
        </div>
    );
}
