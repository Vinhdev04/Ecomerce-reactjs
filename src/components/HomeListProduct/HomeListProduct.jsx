import React from 'react';
import ProductList from '@/components/ProductList/ProductList.jsx';
import useProducts from '@/hooks/useProducts';

function HomeListProduct() {
    const {
        products,
        loading,
        isFetchingMore,
        hasMore,
        error,
        retry,
        loadMore
    } = useProducts(6);

    return (
        <ProductList
            products={products}
            loading={loading}
            isFetchingMore={isFetchingMore}
            hasMore={hasMore}
            error={error}
            loadMore={loadMore}
            retry={retry}
        />
    );
}

export default HomeListProduct;
