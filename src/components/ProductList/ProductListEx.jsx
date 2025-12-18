import React, { useState, useEffect } from 'react';
import styles from './HomeListProduct.module.scss';
import Layout from '@/components/Layout/Layout';
import CalculatorTimer from '@/components/Countdown/CalculatorTimer.jsx';
import ProductCard from '@/components/ProductItem/ProductItem.jsx';
import { getAllProducts } from '@api/productsService.js';

import img01 from '@images/8BitDoUltimate 3-mode.webp';
import img03 from '@images/8BitDoUltimate.webp';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 6,
        total: 0,
        totalPages: 0
    });

    // Fetch products from API
    useEffect(() => {
        fetchProducts(pagination.page, pagination.limit);
    }, []);

    const fetchProducts = async (page = 1, limit = 6) => {
        try {
            setLoading(true);
            const response = await getAllProducts(page, limit);

            if (response.success) {
                setProducts(response.data);
                setPagination(response.pagination);
                setError(null);
            }
        } catch (err) {
            console.error('Error loading products:', err);
            setError('Không thể tải sản phẩm. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        fetchProducts(newPage, pagination.limit);
        // Scroll to top of products section
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Layout>
            <div className={styles.homeListProduct}>
                <div className={styles.countdownSection}>
                    <div className='container'>
                        <div className={styles.countdownWrapper}>
                            <h2 className={styles.sectionTitle}>
                                The Classics Make A Comeback
                            </h2>
                            <CalculatorTimer
                                endTime={new Date('2025-12-31T23:59:59')}
                            />
                            <button className={styles.buyNowBtn}>
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>

                <div className='container'>
                    <div className={styles.featuredSection}>
                        <div className='row g-4'>
                            <div className='col-lg-6'>
                                <div className={styles.featuredBig}>
                                    <div className={styles.featuredBigImage}>
                                        <img
                                            src={img01}
                                            alt='Featured Product'
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
                                            alt='Featured Product'
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

                    <div className={styles.regularSection}>
                        <h2 className={styles.sectionTitle}>Best Sellers</h2>

                        {/* Loading State */}
                        {loading && (
                            <div className={styles.loadingState}>
                                <div className={styles.spinner}></div>
                                <p>Đang tải sản phẩm...</p>
                            </div>
                        )}

                        {/* Error State */}
                        {error && !loading && (
                            <div className={styles.errorState}>
                                <p>{error}</p>
                                <button
                                    onClick={() =>
                                        fetchProducts(
                                            pagination.page,
                                            pagination.limit
                                        )
                                    }
                                    className={styles.retryBtn}
                                >
                                    Thử lại
                                </button>
                            </div>
                        )}

                        {/* Products Grid */}
                        {!loading && !error && products.length > 0 && (
                            <>
                                <div className='row g-4'>
                                    {products.map((product) => (
                                        <div
                                            key={product.id}
                                            className='col-xl-4 col-md-6'
                                        >
                                            <ProductCard
                                                image={product.image[0]} // First image from array
                                                images={product.image} // All images
                                                title={product.title}
                                                description={
                                                    product.description
                                                }
                                                price={product.price}
                                                badge={product.badge}
                                                rating={product.rating}
                                                stock={product.stock}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pagination.totalPages > 1 && (
                                    <div className={styles.pagination}>
                                        <button
                                            onClick={() =>
                                                handlePageChange(
                                                    pagination.page - 1
                                                )
                                            }
                                            disabled={pagination.page === 1}
                                            className={styles.paginationBtn}
                                        >
                                            « Trước
                                        </button>

                                        <div
                                            className={styles.paginationNumbers}
                                        >
                                            {[
                                                ...Array(pagination.totalPages)
                                            ].map((_, index) => (
                                                <button
                                                    key={index + 1}
                                                    onClick={() =>
                                                        handlePageChange(
                                                            index + 1
                                                        )
                                                    }
                                                    className={`${
                                                        styles.paginationNumber
                                                    } ${
                                                        pagination.page ===
                                                        index + 1
                                                            ? styles.active
                                                            : ''
                                                    }`}
                                                >
                                                    {index + 1}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() =>
                                                handlePageChange(
                                                    pagination.page + 1
                                                )
                                            }
                                            disabled={
                                                pagination.page ===
                                                pagination.totalPages
                                            }
                                            className={styles.paginationBtn}
                                        >
                                            Sau »
                                        </button>
                                    </div>
                                )}

                                {/* Pagination Info */}
                                <div className={styles.paginationInfo}>
                                    Hiển thị {products.length} trên{' '}
                                    {pagination.total} sản phẩm (Trang{' '}
                                    {pagination.page}/{pagination.totalPages})
                                </div>
                            </>
                        )}

                        {/* Empty State */}
                        {!loading && !error && products.length === 0 && (
                            <div className={styles.emptyState}>
                                <p>Chưa có sản phẩm nào!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default ProductList;
