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
           
            <div className='container'>
                

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