import React from 'react';
import styles from './ProductCard.module.scss';
import { Heart, Eye, ShoppingCart } from 'lucide-react';

// Icon Components
export const FavoriteIcon = ({ isFavorite, className = '' }) => (
    <button
        className={`${styles.iconBtn} ${
            isFavorite ? styles.active : ''
        } ${className}`}
        aria-label='Thêm vào yêu thích'
        type='button'
    >
        <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
    </button>
);

export const QuickViewIcon = ({ className = '' }) => (
    <button
        className={`${styles.iconBtn} ${className}`}
        aria-label='Xem nhanh'
        type='button'
    >
        <Eye size={20} />
    </button>
);

export const AddToCartIcon = ({ className = '' }) => (
    <button
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

    badge = 'New',
    className = ''
}) {
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
                        <FavoriteIcon />
                        <QuickViewIcon />
                        <AddToCartIcon />
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
                    <button className={styles.btnDetail} type='button'>
                        Chi tiết
                    </button>
                    <button className={styles.btnBuy} type='button'>
                        Mua Ngay
                    </button>
                </div>
            </div>
        </div>
    );
}
