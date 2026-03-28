import React, { useContext } from 'react';
import styles from './ProductListShop.module.scss';
import { ProductGrid } from '@/components/ProductList/ProductGrid.jsx';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import {
    LoadingState,
    ErrorState,
    EmptyState,
    InlineLoadingState
} from '@/components/ProductList/ProductStates.jsx';
import { OurShopContext } from '@contexts/OurShopContext.js';
import { CartContext } from '@contexts/CartContext.js';

function ProductListShop() {
    const {
        products,
        loading,
        isFetchingMore,
        hasMore,
        error,
        loadMore,
        retry,
        viewMode
    } = useContext(OurShopContext);

    const { sentinelRef } = useInfiniteScroll({
        enabled: !error,
        loading: loading || isFetchingMore,
        hasMore,
        onLoadMore: loadMore
    });

    return (
        <div className={styles.productListShop}>
            <div className="container">
                {loading && products.length === 0 && (
                    <LoadingState variant={viewMode === 'grid' ? 'grid' : 'list'} />
                )}

                {error && !loading && <ErrorState error={error} onRetry={retry} />}

                {!loading && !error && products.length > 0 && (
                    <>
                        {viewMode === 'grid' ? (
                            <ProductGrid products={products} />
                        ) : (
                            <ProductListView products={products} />
                        )}

                        <div
                            ref={sentinelRef}
                            className={styles.infiniteSentinel}
                            aria-hidden="true"
                        />
                        {isFetchingMore && <InlineLoadingState />}
                        {!hasMore && (
                            <p className={styles.endOfList}>
                                Da tai tat ca san pham.
                            </p>
                        )}
                    </>
                )}

                {!loading && !error && products.length === 0 && <EmptyState />}
            </div>
        </div>
    );
}

function ProductListView({ products }) {
    return (
        <div className={styles.productListView}>
            {products?.map((product, index) => (
                <ProductListItem
                    key={product.id || product._id || `${product.title}-${index}`}
                    className={styles.itemEnter}
                    style={{ animationDelay: `${(index % 8) * 40}ms` }}
                    product={product}
                    image={Array.isArray(product.image) ? product.image[0] : product.image}
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
    product,
    className,
    style,
    image,
    title,
    description,
    price,
    badge,
    rating,
    stock,
    category
}) {
    const { addToCart } = useContext(CartContext);

    return (
        <div className={`${styles.productListItem} ${className || ''}`} style={style}>
            <div className={styles.itemImage}>
                <img
                    src={image || 'https://via.placeholder.com/200x200'}
                    alt={title}
                    loading="lazy"
                />
                {badge && <div className={styles.badge}>{badge}</div>}
            </div>

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
                                *
                            </span>
                        ))}
                        <span className={styles.ratingText}>({rating}/5)</span>
                    </div>
                )}

                <div className={styles.itemFooter}>
                    <div className={styles.priceInfo}>
                        <span className={styles.currentPrice}>
                            {price?.toLocaleString('vi-VN')}d
                        </span>
                        {stock !== undefined && (
                            <span className={styles.stock}>
                                {stock > 0 ? `Con ${stock} san pham` : 'Het hang'}
                            </span>
                        )}
                    </div>

                    <div className={styles.actions}>
                        <button
                            className={styles.btnBuy}
                            disabled={stock === 0}
                            onClick={() => addToCart(product)}
                        >
                            {stock === 0 ? 'Het hang' : 'Them vao gio hang'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductListShop;
