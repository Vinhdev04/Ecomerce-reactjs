import React from 'react';
import Layout from '@/components/Layout/Layout';
import ProductList from '@/components/ProductList/ProductList.jsx';
import useProducts from '@/hooks/useProducts';

function HomeListProduct() {
    const { products, loading, error, pagination, handlePageChange, retry } =
        useProducts(6); // 6 sản phẩm mỗi trang

    return (
        <Layout>
        
            <ProductList
                products={products}
                loading={loading}
                error={error}
                pagination={pagination}
                handlePageChange={handlePageChange}
                retry={retry}
            />
        </Layout>
    );
}

export default HomeListProduct;
