import { useState, useEffect, useCallback } from 'react';
import { getAllProducts } from '@api/productsService.js';

/* ==============================
     HOOKS: SỬ DỤNG TRONG PRODUCTS
 ============================== */
export const useProducts = (initialLimit = 8) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: initialLimit,
        total: 0,
        totalPages: 0
    });
    const [filters, setFilters] = useState({
        sortType: '0',
        category: null
    });

    const fetchProducts = useCallback(
        async (queryParams = {}) => {
            try {
                setLoading(true);
                setError(null);

                // Merge query params với state hiện tại
                const finalParams = {
                    page: queryParams.page ?? pagination.page,
                    limit: queryParams.limit ?? pagination.limit,
                    sortType: queryParams.sortType ?? filters.sortType,
                    category: queryParams.category ?? filters.category
                };

                // console.log('🔍 Fetching products with params:', finalParams);

                const response = await getAllProducts(finalParams);

                if (response && response.success) {
                    setProducts(response.data || []);

                    setPagination({
                        page: finalParams.page,
                        limit: finalParams.limit,
                        total: response.pagination?.total || 0,
                        totalPages: response.pagination?.totalPages || 1
                    });

                    setFilters({
                        sortType: finalParams.sortType,
                        category: finalParams.category
                    });

                    console.log('✅ Products loaded:', response.data?.length);
                } else {
                    throw new Error(
                        response?.message || 'Không thể tải dữ liệu các sản phẩm!'
                    );
                }
            } catch (err) {
                console.error('❌ Error fetching products:', err);
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
        [pagination.page, pagination.limit, filters.sortType, filters.category]
    );

    /* ==============================
         THAY ĐỔI TRANG
     ============================== */
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

            fetchProducts({ page: newPage });
        },
        [pagination.totalPages, fetchProducts]
    );

    /* ==============================
         THAY ĐỔI SORTING
     ============================== */
    const handleSortChange = useCallback(
        (sortType) => {
            // console.log('📊 Sort changed to:', sortType);
            fetchProducts({
                page: 1, // Reset về trang 1
                sortType
            });
        },
        [fetchProducts]
    );

    /* ==============================
         THAY ĐỔI SỐ LƯỢNG HIỂN THỊ
     ============================== */
    const handleLimitChange = useCallback(
        (newLimit) => {
            // console.log('📏 Limit changed to:', newLimit);
            fetchProducts({
                page: 1, // Reset về trang 1
                limit: newLimit
            });
        },
        [fetchProducts]
    );

    /* ==============================
         THAY ĐỔI CATEGORY
     ============================== */
    const handleCategoryChange = useCallback(
        (category) => {
            // console.log('🏷️ Category changed to:', category);
            fetchProducts({
                page: 1, // Reset về trang 1
                category
            });
        },
        [fetchProducts]
    );

    /* ==============================
         RETRY KHI GẶP LỖI
     ============================== */
    const retry = useCallback(() => {
        // console.log('🔄 Retrying...');
        fetchProducts();
    }, [fetchProducts]);

    /* ==============================
         RESET VỀ ĐẦU PAGE
     ============================== */
    const resetToFirstPage = useCallback(() => {
        fetchProducts({ page: 1 });
    }, [fetchProducts]);

    /* ==============================
         REFRESH CURRENT PAGE
     ============================== */
    const refresh = useCallback(() => {
        fetchProducts();
    }, [fetchProducts]);

    /* ==============================
         TỰ ĐỘNG FETCH KHI COMPONENT MOUNT
     ============================== */
    useEffect(() => {
        // console.log('🚀 useProducts mounted, fetching initial data...');
        fetchProducts();
       
    }, []);

    return {
        products,
        loading,
        error,
        pagination,
        filters,

        // Actions
        handlePageChange,
        handleSortChange,
        handleLimitChange,
        handleCategoryChange,
        retry,
        resetToFirstPage,
        refresh
    };
};

export default useProducts;