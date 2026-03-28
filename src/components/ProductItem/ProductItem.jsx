import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProductItem.module.scss';
import {
    FavoriteIcon,
    QuickViewIcon,
    AddToCartIcon
} from '@/components/ProductIcons/ProductIcon.jsx';
import { CartContext } from '@contexts/CartContext.js';

export default function ProductCard({
    details,
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
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    const productDetails = details || {
        id: title,
        image: images?.length ? images : [image],
        title,
        description,
        price,
        badge,
        rating,
        stock
    };
    const productId = productDetails?.id || productDetails?._id;

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
                        loading="lazy"
                    />

                    {badge && <div className={styles.badge}>{badge}</div>}

                    {stock !== undefined && stock < 10 && stock > 0 && (
                        <div className={styles.stockWarning}>
                            Chi con {stock} san pham
                        </div>
                    )}

                    {stock === 0 && (
                        <div className={styles.outOfStock}>Het hang</div>
                    )}

                    <div className={styles.iconOverlay}>
                        <FavoriteIcon />
                        <QuickViewIcon />
                        <AddToCartIcon
                            onClick={() => addToCart(productDetails)}
                            disabled={stock === 0}
                        />
                    </div>
                </div>

                <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{title || 'Ten san pham'}</h3>

                    <p className={styles.cardText}>
                        {description ||
                            'Mo ta ngan gon ve san pham, tinh nang noi bat va uu diem cua san pham nay'}
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
                                    *
                                </span>
                            ))}
                            <span className={styles.ratingText}>({rating}/5)</span>
                        </div>
                    )}

                    {price && (
                        <div className={styles.cardPrice}>
                            <span className={styles.currentPrice}>
                                {price.toLocaleString('vi-VN')}d
                            </span>
                            <span className={styles.oldPrice}>
                                {(price * 1.2).toLocaleString('vi-VN')}d
                            </span>
                        </div>
                    )}
                </div>

                <div className={styles.cardFooter}>
                    <button
                        className={styles.btnDetail}
                        type="button"
                        onClick={() => productId && navigate(`/products/${productId}`)}
                    >
                        Chi tiet
                    </button>
                    <button
                        className={styles.btnBuy}
                        type="button"
                        disabled={stock === 0}
                        onClick={() => addToCart(productDetails)}
                    >
                        {stock === 0 ? 'Het hang' : 'Them vao gio'}
                    </button>
                </div>
            </div>
        </div>
    );
}
