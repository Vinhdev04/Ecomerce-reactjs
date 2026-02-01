import React, { useContext } from 'react';
import Layout from '@/components/Layout/Layout';
import styles from './OurShop.module.scss';
import { Breadcrumb } from 'antd';
import { GoArrowLeft } from 'react-icons/go';
import classNames from 'classnames';
import BannerShop from './components/BannerShop';
import { useNavigate } from 'react-router-dom';
import { OurShopProvider, OurShopContext } from '@/contexts/OurShopProvider';
import FilterProduct from '@components/OurShop/components/FilterProduct';
import ProductList from '@components/ProductList/ProductList';

/* ==============================
   COMPONENT CONTENT (Sử dụng Context)
 ============================== */
function OurShopContent() {
    const navigate = useNavigate();
    const {
        shopContainer,
        itemBreadcrumb,
        wrapHeader,
        btnReturn
    } = styles;

    //  Lấy data từ context
    const context = useContext(OurShopContext);

    // Debug: Log context
    // console.log('OurShop Context:', context);

    // Kiểm tra context có undefined không
    if (!context) {
        console.error('❌ OurShopContext is undefined!');
        return (
            <Layout>
                <div className="container">
                    <div className="alert alert-danger" role="alert">
                        <h4>Error: Context not found</h4>
                        <p>OurShopContext is undefined. Make sure OurShopProvider is wrapping this component.</p>
                    </div>
                </div>
            </Layout>
        );
    }

    const {
        products,
        loading,
        error,
        pagination,
        handlePageChange,
        retry
    } = context;

    const items = [
        { title: 'Home' },
        { title: 'Shop', href: '' }
    ];

    return (
        <Layout>
            <div className={classNames(shopContainer, 'container')}>
                {/* Header */}
                <div
                    className={classNames(
                        wrapHeader,
                        'd-flex justify-content-between align-items-center'
                    )}
                >
                    <Breadcrumb
                        separator=">"
                        items={items}
                        className={itemBreadcrumb}
                    />
                    <button className={btnReturn} onClick={() => navigate(-1)}>
                        <GoArrowLeft className="me-1" />
                        Return to pages
                    </button>
                </div>

                {/* Banner */}
                {/* <BannerShop /> */}

                {/* Filter Section */}
                <FilterProduct />

                {/* Product List */}
                <ProductList
                    products={products}
                    loading={loading}
                    error={error}
                    pagination={pagination}
                    handlePageChange={handlePageChange}
                    retry={retry}
                />

                {/* Load More Button (Optional) */}
                {!loading && products.length > 0 && pagination.page < pagination.totalPages && (
                    <div className="mt-4 text-center">
                        <button
                            className="btn btn-primary"
                            onClick={() => handlePageChange(pagination.page + 1)}
                        >
                            Load More
                        </button>
                    </div>
                )}
            </div>
        </Layout>
    );
}

/* ==============================
   COMPONENT WRAPPER (Provider)
 ============================== */
function OurShop() {
    return (
        <OurShopProvider>
            <OurShopContent />
        </OurShopProvider>
    );
}

export default OurShop;