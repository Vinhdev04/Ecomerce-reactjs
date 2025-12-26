import { useState, useEffect, useCallback } from 'react';
import { getAllProducts } from '@api/productsService.js';

export const useProducts = (initialLimit = 6) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: initialLimit,
        total: 0,
        totalPages: 0
    });

    const fetchProducts = useCallback(
        async (page = 1, limit = initialLimit) => {
            try {
                setLoading(true);
                setError(null);

                const response = await getAllProducts(page, limit);

                if (response && response.success) {
                    setProducts(response.data || []);

                    setPagination({
                        page,
                        limit,
                        total: response.pagination?.total || 0,
                        totalPages: response.pagination?.totalPages || 1
                    });
                } else {
                    throw new Error(
                        response?.message ||
                            'Không thể tải dữ liệu các sản phẩm!'
                    );
                }
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                        err.message ||
                        'Không thể tải dữ liệu các sản phẩm!'
                );
                setProducts([]);
            } finally {
                setLoading(false);
            }
        },
        [initialLimit]
    );

    // #OVERVIEW: SỬ DỤNG UseCallback() -> chỉ render khi cần
    const handlePageChange = useCallback(
        (newPage) => {
            if (newPage < 1 || newPage > pagination.totalPages) {
                console.warn('Invalid page number:', newPage);
                return;
            }

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            fetchProducts(newPage, pagination.limit);
        },
        [pagination.totalPages, pagination.limit, fetchProducts]
    );

    // NOTE: RETRY KHI GẶP LỖI
    const retry = () => {
        console.log('Retrying fetchProducts...');
        fetchProducts(pagination.page, pagination.limit);
    };

    // NOTE: RESET VỀ ĐẦU PAGE
    const resetToFirstPage = () => {
        console.log('Reset to first page');
        fetchProducts(1, pagination.limit);
    };

    const changeLimit = (newLimit) => {
        console.log('Change limit to:', newLimit);
        fetchProducts(1, newLimit);
    };

    // NOTE: TỰU ĐỘNG REFRESH PAGE
    const refresh = () => {
        console.log('Refreshing current page...');
        fetchProducts(pagination.page, pagination.limit);
    };

    // NOTE: TỰ ĐỘNG FETCH KHI COMPONENT MOUNT
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return {
        products,
        loading,
        error,
        pagination,

        fetchProducts,
        handlePageChange,
        retry,
        resetToFirstPage,
        changeLimit,
        refresh
    };
};

export default useProducts;
