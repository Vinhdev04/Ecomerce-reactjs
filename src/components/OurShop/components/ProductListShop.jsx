import React, { useContext } from 'react';
import styles from './ProductListShop.module.scss';
import { ProductGrid } from '@/components/ProductList/ProductGrid.jsx';
import { Pagination } from '@/components/ProductList/Pagination.jsx';
import {
    LoadingState,
    ErrorState,
    EmptyState
} from '@/components/ProductList/ProductStates.jsx';
import { OurShopContext } from '@contexts/OurShopContext.js';

function ProductListShop() {
    const {
        products,
        loading,
        error,
        pagination,
        handlePageChange,
        retry,
        viewMode
    } = useContext(OurShopContext);

    return (
        <div className={styles.productListShop}>
            <div className="container">
                {/* Loading State */}
                {loading && <LoadingState />}

                {/* Error State */}
                {error && !loading && <ErrorState error={error} onRetry={retry} />}

                {/* Products Grid/List */}
                {!loading && !error && products.length > 0 && (
                    <>
                        {viewMode === 'grid' ? (
                            <ProductGrid products={products} />
                        ) : (
                            <ProductListView products={products} />
                        )}

                        {/* Pagination */}
                        <Pagination
                            pagination={pagination}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}

                {/* Empty State */}
                {!loading && !error && products.length === 0 && <EmptyState />}
            </div>
        </div>
    );
}


function ProductListView({ products }) {
    return (
        <div className={styles.productListView}>
            {products?.map((product) => (
                <ProductListItem
                    key={product.id}
                    image={product.image[0]}
                    images={product.image}
                    title={product.title}
                    description={product.description}
                    price={product.price}
                    badge={product.badge}
                    rating={product.rating}
                    stock={product.stock}
                    category={product.category}
                />
            ))}
        </div>
    );
}


function ProductListItem({
    image,
    images,
    title,
    description,
    price,
    badge,
    rating,
    stock,
    category
}) {
    return (
        <div className={styles.productListItem}>
            {/* Image Section */}
            <div className={styles.itemImage}>
                <img
                    src={image || 'https://via.placeholder.com/200x200'}
                    alt={title}
                    loading="lazy"
                />
                {badge && <div className={styles.badge}>{badge}</div>}
            </div>

            {/* Info Section */}
            <div className={styles.itemInfo}>
                <div className={styles.itemHeader}>
                    <h3 className={styles.itemTitle}>{title}</h3>
                    {category && <span className={styles.category}>{category}</span>}
                </div>

                <p className={styles.itemDescription}>
                    {description?.substring(0, 150)}...
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
                        <span className={styles.ratingText}>({rating}/5)</span>
                    </div>
                )}

                <div className={styles.itemFooter}>
                    <div className={styles.priceInfo}>
                        <span className={styles.currentPrice}>
                            {price?.toLocaleString('vi-VN')}đ
                        </span>
                        {stock !== undefined && (
                            <span className={styles.stock}>
                                {stock > 0 ? `Còn ${stock} sản phẩm` : 'Hết hàng'}
                            </span>
                        )}
                    </div>

                    <div className={styles.actions}>
                      
                        <button
                            className={styles.btnBuy}
                            disabled={stock === 0}
                        >
                            {stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductListShop;