import React from 'react';
import styles from './HomeListProduct.module.scss';

// Loading State Component

export const LoadingState = () => (
    <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Đang tải sản phẩm...</p>
    </div>
);

// Error State Component

export const ErrorState = ({ error, onRetry }) => (
    <div className={styles.errorState}>
        <p>{error}</p>
        <button onClick={onRetry} className={styles.retryBtn}>
            Thử lại
        </button>
    </div>
);

// Empty State Component

export const EmptyState = () => (
    <div className={styles.emptyState}>
        <p>Chưa có sản phẩm nào!</p>
    </div>
);
