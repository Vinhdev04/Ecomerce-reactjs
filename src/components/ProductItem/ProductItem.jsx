// components/ProductItem/ProductItem.jsx
import React from 'react';
import styles from './ProductItem.module.scss';
import {
    FavoriteIcon,
    QuickViewIcon,
    AddToCartIcon
} from '@/components/ProductIcons/ProductIcon.jsx';

export default function ProductCard({
    image,
    images = [],
    title,
    description,
    price,
    badge = 'New',
    rating,
    stock,
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

                    {stock !== undefined && stock < 10 && stock > 0 && (
                        <div className={styles.stockWarning}>
                            Chỉ còn {stock} sản phẩm
                        </div>
                    )}

                    {stock === 0 && (
                        <div className={styles.outOfStock}>Hết hàng</div>
                    )}

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

                    {rating && (
                        <div className={styles.rating}>
                            {[...Array(5)].map((_, index) => (
                                <span
                                    key={index}
                                    className={
                                        index < rating
                                            ? styles.starFilled
                                            : styles.starEmpty
                                    }
                                >
                                    ★
                                </span>
                            ))}
                            <span className={styles.ratingText}>
                                ({rating}/5)
                            </span>
                        </div>
                    )}

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
                    <button
                        className={styles.btnBuy}
                        type='button'
                        disabled={stock === 0}
                    >
                        {stock === 0 ? 'Hết hàng' : 'Mua Ngay'}
                    </button>
                </div>
            </div>
        </div>
    );
}
