import React from 'react';
import styles from './ProductCard.module.scss';

export default function ProductCard({
    image,
    title,
    description,
    price,
    onDetail,
    onBuy
}) {
    return (
        <div className={styles.card}>
            <div className={styles.cardBody}>
                <div className={styles.cardImg}>
                    <img
                        src={
                            image ||
                            'https://via.placeholder.com/300x200?text=Product+Image'
                        }
                        alt={title}
                    />
                    <div className={styles.badge}>New</div>
                </div>

                <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>
                        {title || 'San Pham 01'}
                    </h3>
                    <p className={styles.cardText}>
                        {description ||
                            'Mô tả ngắn gọn về sản phẩm, tính năng nổi bật và ưu điểm'}
                    </p>

                    {price && (
                        <div className={styles.cardPrice}>
                            <span className={styles.currentPrice}>
                                {price.toLocaleString('vi-VN')}đ
                            </span>
                            {price && (
                                <span className={styles.oldPrice}>
                                    {(price * 1.2).toLocaleString('vi-VN')}đ
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <div className={styles.cardFooter}>
                    <button className={styles.btnDetail} onClick={onDetail}>
                        Chi tiết
                    </button>
                    <button className={styles.btnBuy} onClick={onBuy}>
                        Mua Ngay
                    </button>
                </div>
            </div>
        </div>
    );
}
