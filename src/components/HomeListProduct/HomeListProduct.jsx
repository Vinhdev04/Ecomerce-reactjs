import React from 'react';
import ProductList from '@/components/ProductList/ProductList.jsx';
import useProducts from '@/hooks/useProducts';

function HomeListProduct() {
    const { products, loading, error, pagination, handlePageChange, retry } =
        useProducts(6); // 6 sản phẩm mỗi trang

    return (
        <ProductList
            products={products}
            loading={loading}
            error={error}
            pagination={pagination}
            handlePageChange={handlePageChange}
            retry={retry}
        />
    );
}

export default HomeListProduct;