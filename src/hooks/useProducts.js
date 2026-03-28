/**
 * Shared product data hook:
 * filtering, pagination and infinite append behaviors.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { getAllProducts } from '@api/productsService.js';

export const useProducts = (initialLimit = 8) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);
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
    const paginationRef = useRef({
        page: 1,
        limit: initialLimit
    });
    const filtersRef = useRef({
        sortType: '0',
        category: null
    });
    const isRequestInFlightRef = useRef(false);

    useEffect(() => {
        paginationRef.current = {
            page: pagination.page,
            limit: pagination.limit
        };
    }, [pagination.page, pagination.limit]);

    useEffect(() => {
        filtersRef.current = {
            sortType: filters.sortType,
            category: filters.category
        };
    }, [filters.sortType, filters.category]);

    const fetchProducts = useCallback(
        async (queryParams = {}, options = {}) => {
            const { append = false } = options;
            if (isRequestInFlightRef.current) return;

            try {
                isRequestInFlightRef.current = true;
                if (append) {
                    setIsFetchingMore(true);
                } else {
                    setLoading(true);
                }

                setError(null);

                const finalParams = {
                    page: queryParams.page ?? paginationRef.current.page,
                    limit: queryParams.limit ?? paginationRef.current.limit,
                    sortType: queryParams.sortType ?? filtersRef.current.sortType,
                    category: queryParams.category ?? filtersRef.current.category
                };

                const response = await getAllProducts(finalParams);

                if (!response?.success) {
                    throw new Error(
                        response?.message || 'Khong the tai du lieu san pham.'
                    );
                }

                const incomingProducts = Array.isArray(response?.data)
                    ? response.data
                    : [];
                const nextTotalPages = Number(
                    response?.pagination?.totalPages || 1
                );

                setProducts((prev) => {
                    if (!append) return incomingProducts;

                    const existingIds = new Set(
                        prev.map((item) => item.id || item._id)
                    );
                    const uniqueIncoming = incomingProducts.filter(
                        (item) => !existingIds.has(item.id || item._id)
                    );
                    return [...prev, ...uniqueIncoming];
                });

                setPagination({
                    page: finalParams.page,
                    limit: finalParams.limit,
                    total: Number(response?.pagination?.total || 0),
                    totalPages: nextTotalPages
                });

                setFilters({
                    sortType: finalParams.sortType,
                    category: finalParams.category ?? null
                });

                setHasMore(
                    finalParams.page < nextTotalPages &&
                        incomingProducts.length > 0
                );
            } catch (err) {
                setError(
                    err?.response?.data?.message ||
                        err?.message ||
                        'Khong the tai du lieu san pham.'
                );

                if (!options.append) {
                    setProducts([]);
                }

                setHasMore(false);
            } finally {
                isRequestInFlightRef.current = false;
                setLoading(false);
                setIsFetchingMore(false);
            }
        },
        []
    );

    const handlePageChange = useCallback(
        (newPage) => {
            if (newPage < 1 || newPage > pagination.totalPages) return;
            fetchProducts({ page: newPage });
        },
        [pagination.totalPages, fetchProducts]
    );

    const loadMore = useCallback(() => {
        if (loading || isFetchingMore || !hasMore) return;
        fetchProducts({ page: pagination.page + 1 }, { append: true });
    }, [fetchProducts, hasMore, isFetchingMore, loading, pagination.page]);

    const handleSortChange = useCallback(
        (sortType) => {
            setHasMore(true);
            fetchProducts({
                page: 1,
                sortType
            });
        },
        [fetchProducts]
    );

    const handleLimitChange = useCallback(
        (newLimit) => {
            setHasMore(true);
            fetchProducts({
                page: 1,
                limit: newLimit
            });
        },
        [fetchProducts]
    );

    const handleCategoryChange = useCallback(
        (category) => {
            setHasMore(true);
            fetchProducts({
                page: 1,
                category
            });
        },
        [fetchProducts]
    );

    const retry = useCallback(() => {
        fetchProducts({ page: 1 });
    }, [fetchProducts]);

    const resetToFirstPage = useCallback(() => {
        fetchProducts({ page: 1 });
    }, [fetchProducts]);

    const refresh = useCallback(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        fetchProducts({ page: 1 });
    }, [fetchProducts]);

    return {
        products,
        loading,
        isFetchingMore,
        hasMore,
        error,
        pagination,
        filters,
        loadMore,
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
