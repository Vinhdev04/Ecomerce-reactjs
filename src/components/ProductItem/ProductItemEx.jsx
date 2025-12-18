import React, { useState } from 'react';
import styles from './ProductItem.module.scss';
import {
    FavoriteIcon,
    QuickViewIcon,
    AddToCartIcon
} from '@/components/ProductIcons/ProductIcon.jsx';

export default function ProductCard({
    image,
    images = [], // Array of all images
    title,
    description,
    price,
    badge = null,
    rating = 0,
    stock = 0,
    className = ''
}) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const productImages = images.length > 0 ? images : [image];

    const handleImageHover = (index) => {
        if (productImages.length > 1) {
            setCurrentImageIndex(index);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <div className={`${styles.card} ${className}`}>
            <div className={styles.cardBody}>
                <div className={styles.cardImg}>
                    <img
                        src={
                            productImages[currentImageIndex] ||
                            'https://via.placeholder.com/400x400?text=Product+Image'
                        }
                        alt={title || 'Product'}
                        loading='lazy'
                    />

                    {badge && <div className={styles.badge}>{badge}</div>}

                    {/* Stock indicator */}
                    {stock === 0 && (
                        <div className={styles.outOfStock}>Hết hàng</div>
                    )}
                    {stock > 0 && stock <= 5 && (
                        <div className={styles.lowStock}>Chỉ còn {stock}</div>
                    )}

                    <div className={styles.iconOverlay}>
                        <FavoriteIcon />
                        <QuickViewIcon />
                        <AddToCartIcon />
                    </div>

                    {/* Image thumbnails for hover */}
                    {productImages.length > 1 && (
                        <div className={styles.imageThumbnails}>
                            {productImages.slice(0, 4).map((img, index) => (
                                <div
                                    key={index}
                                    className={`${styles.thumbnail} ${
                                        currentImageIndex === index
                                            ? styles.active
                                            : ''
                                    }`}
                                    onMouseEnter={() => handleImageHover(index)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>
                        {title || 'Tên sản phẩm'}
                    </h3>

                    {/* Rating */}
                    {rating > 0 && (
                        <div className={styles.rating}>
                            {[...Array(5)].map((_, index) => (
                                <span
                                    key={index}
                                    className={
                                        index < Math.floor(rating)
                                            ? styles.starFilled
                                            : styles.starEmpty
                                    }
                                >
                                    ★
                                </span>
                            ))}
                            <span className={styles.ratingValue}>
                                ({rating.toFixed(1)})
                            </span>
                        </div>
                    )}

                    <p className={styles.cardText}>
                        {description ||
                            'Mô tả ngắn gọn về sản phẩm, tính năng nổi bật và ưu điểm của sản phẩm này'}
                    </p>

                    {price && (
                        <div className={styles.cardPrice}>
                            <span className={styles.currentPrice}>
                                {formatPrice(price)}
                            </span>
                            {badge === 'Hot Deal' || badge === 'Sale' ? (
                                <span className={styles.oldPrice}>
                                    {formatPrice(price * 1.2)}
                                </span>
                            ) : null}
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
