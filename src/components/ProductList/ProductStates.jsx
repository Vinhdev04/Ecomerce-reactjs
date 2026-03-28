import React from 'react';
import styles from './HomeListProduct.module.scss';

const SkeletonCard = () => (
    <div className={styles.skeletonCard} aria-hidden="true">
        <div className={styles.skeletonImage} />
        <div className={styles.skeletonLineLg} />
        <div className={styles.skeletonLineMd} />
        <div className={styles.skeletonLineSm} />
    </div>
);

const SkeletonListItem = () => (
    <div className={styles.skeletonListItem} aria-hidden="true">
        <div className={styles.skeletonListImage} />
        <div className={styles.skeletonListContent}>
            <div className={styles.skeletonLineLg} />
            <div className={styles.skeletonLineMd} />
            <div className={styles.skeletonLineMd} />
            <div className={styles.skeletonLineSm} />
        </div>
    </div>
);

export const LoadingState = ({ variant = 'grid', count = 8 }) => (
    <div className={styles.loadingState}>
        {variant === 'list' ? (
            <div className={styles.skeletonListWrap}>
                {Array.from({ length: Math.max(count, 5) }).map((_, index) => (
                    <SkeletonListItem key={`list-skeleton-${index}`} />
                ))}
            </div>
        ) : (
            <div className={`row g-4 ${styles.skeletonGrid}`}>
                {Array.from({ length: count }).map((_, index) => (
                    <div key={`grid-skeleton-${index}`} className="col-xl-4 col-md-6">
                        <SkeletonCard />
                    </div>
                ))}
            </div>
        )}
    </div>
);

export const InlineLoadingState = () => (
    <div className={styles.inlineLoading} aria-live="polite">
        <span className={styles.inlineSpinner} />
        Dang tai them san pham...
    </div>
);

export const ErrorState = ({ error, onRetry }) => (
    <div className={styles.errorState}>
        <p>{error}</p>
        <button onClick={onRetry} className={styles.retryBtn}>
            Thu lai
        </button>
    </div>
);

export const EmptyState = () => (
    <div className={styles.emptyState}>
        <p>Chua co san pham nao!</p>
    </div>
);
