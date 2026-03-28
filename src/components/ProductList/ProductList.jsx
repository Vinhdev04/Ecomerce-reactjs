import React from 'react';
import styles from './HomeListProduct.module.scss';
import { ProductGrid } from '@/components/ProductList/ProductGrid.jsx';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import {
    LoadingState,
    ErrorState,
    EmptyState,
    InlineLoadingState
} from '@/components/ProductList/ProductStates.jsx';

function ProductList({
    products,
    loading,
    isFetchingMore,
    hasMore,
    error,
    loadMore,
    retry
}) {
    const { sentinelRef } = useInfiniteScroll({
        enabled: !error,
        loading: loading || isFetchingMore,
        hasMore,
        onLoadMore: loadMore
    });

    return (
        <div className={styles.homeListProduct}>
            <div className="container">
                <div className={styles.regularSection}>
                    <h2 className={styles.sectionTitle}>Best Sellers</h2>

                    {loading && products.length === 0 && (
                        <LoadingState variant="grid" count={6} />
                    )}

                    {error && !loading && (
                        <ErrorState error={error} onRetry={retry} />
                    )}

                    {!loading && !error && products.length > 0 && (
                        <>
                            <ProductGrid products={products} />

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

                    {!loading && !error && products.length === 0 && (
                        <EmptyState />
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductList;
