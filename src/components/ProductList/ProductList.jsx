import React from 'react';
import styles from './HomeListProduct.module.scss';
import CalculatorTimer from '@/components/Countdown/CalculatorTimer.jsx';

import { ProductGrid } from '@/components/ProductList/ProductGrid.jsx';
import { Pagination } from '@/components/ProductList/Pagination.jsx';
import {
    LoadingState,
    ErrorState,
    EmptyState
} from '@/components/ProductList/ProductStates.jsx';

import img01 from '@images/8BitDoUltimate 3-mode.webp';
import img03 from '@images/8BitDoUltimate.webp';

function ProductList({
    products,
    loading,
    error,
    pagination,
    handlePageChange,
    retry
}) {
    return (
        <div className={styles.homeListProduct}>
            {/* Countdown Section */}
            <div className={styles.countdownSection}>
                <div className='container'>
                    <div className={styles.countdownWrapper}>
                        <h2 className={styles.sectionTitle}>
                            The Classics Make A Comeback
                        </h2>
                        <CalculatorTimer
                            endTime={new Date('2026-12-31T23:59:59')}
                        />
                        <button className={styles.buyNowBtn}>
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Featured Section */}
            <div className='container'>
                <div className={styles.featuredSection}>
                    <div className='row g-4'>
                        <div className='col-lg-6'>
                            <div className={styles.featuredBig}>
                                <div className={styles.featuredBigImage}>
                                    <img
                                        src={img01}
                                        alt='8BitDo Ultimate 3-mode Controller'
                                    />
                                    <div className={styles.featuredBadge}>
                                        <span>50% OFF</span>
                                    </div>
                                </div>
                                <div className={styles.featuredBigContent}>
                                    <h3>Premium Collection</h3>
                                    <p>Exclusive deals on luxury items</p>
                                    <button className={styles.shopNowBtn}>
                                        Shop Now
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className='col-lg-6'>
                            <div className={styles.featuredBig}>
                                <div className={styles.featuredBigImage}>
                                    <img
                                        src={img03}
                                        alt='8BitDo Ultimate Controller'
                                    />
                                    <div className={styles.featuredBadge}>
                                        <span>50% OFF</span>
                                    </div>
                                </div>
                                <div className={styles.featuredBigContent}>
                                    <h3>Premium Collection</h3>
                                    <p>Exclusive deals on luxury items</p>
                                    <button className={styles.shopNowBtn}>
                                        Shop Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Best Sellers Section */}
                <div className={styles.regularSection}>
                    <h2 className={styles.sectionTitle}>Best Sellers</h2>

                    {loading && <LoadingState />}

                    {error && !loading && (
                        <ErrorState error={error} onRetry={retry} />
                    )}

                    {!loading && !error && products.length > 0 && (
                        <>
                            <ProductGrid products={products} />
                            <Pagination
                                pagination={pagination}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}

                    {!loading && !error && products.length === 0 && (
                        <EmptyState />
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductList;