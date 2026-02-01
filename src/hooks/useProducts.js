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
    const [filters,setFilters] = useState({
        sortType: '0',
        category: null
    })

    const fetchProducts = useCallback(
        async (query={}) => {
            try {
                setLoading(true);
                setError(null);

                const queryParams = {
                    page: params.page || pagination.page,
                    limit:params.limit || pagination.limit,
                    sortType: params.sortType || filters.sortType,
                    category: params.category || filters.category
                };
                
                const response = await getAllProducts(queryParams);

                if (response && response.success) {
                    setProducts(response.data || []);

                    setPagination({
                        page: queryParams.page,
                        limit: queryParams.limit,
                        total: response.pagination?.total || 0,
                        totalPages: response.pagination?.totalPages || 1
                    });

                      setFilters({
                        sortType: queryParams.sortType,
                        category: queryParams.category
                      })
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
        [pagination.page, pagination.limit, filters.sortType, filters.category]
    );

    /* ==============================
         SỬ DỤNG UseCallback() -> chỉ render khi cần
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

            fetchProducts({page: newPage});
        },
       [pagination.totalPages, fetchProducts]
    );

     
    /* ==============================
         RETRY KHI GẶP LỖI
     ============================== */
    const retry = useCallback((sortType)=> {
        fetchProducts({
            page: 1,
            sortType
        });

    },[fetchProducts])

   
    /* ==============================
         RESET VỀ ĐẦU PAGE
     ============================== */
    const resetToFirstPage = () => {
        // console.log('Reset to first page');
        fetchProducts({page: 1});
    };

    const handleLimitChange =useCallback(
        (newLimit) => {
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
            fetchProducts({ 
                page: 1, // Reset về trang 1
                category 
            });
        },
        [fetchProducts]
    );

    /* ==============================
         TỰ ĐỘNG REFRESH PAGE
     ============================== */
    const refresh = () => {
        // console.log('Refreshing current page...');
        fetchProducts(pagination.page, pagination.limit);
    };

  
    /* ==============================
         TỰ ĐỘNG FETCH KHI COMPONENT MOUNT
     ============================== */
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
        handleLimitChange,
        handleCategoryChange,
        refresh
    };
};

export default useProducts;
