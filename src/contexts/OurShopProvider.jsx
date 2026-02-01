/* ==============================
     Context: OurShopProvider
 ============================== */
import React from 'react';
import { OurShopContext } from '@contexts/OurShopContext.js';
import { useState, useEffect } from 'react';
import { useProducts } from '@hooks/useProducts.js';

export const OurShopProvider = ({ children }) => {
   

    const sortOptions = [
        { label: 'Default', value: '0' },
        { label: 'Popularity', value: '1' },
        { label: 'High to Low', value: '2' },
        { label: 'Low to High', value: '3' },
        { label: 'Newest', value: '4' },
        { label: 'Oldest', value: '5' }
    ];

    const showOptions = [
        { label: '8', value: '8' },
        { label: '12', value: '12' },
        { label: '16', value: '16' },
        { label: '24', value: '24' }
    ];

 
    const [viewMode, setViewMode] = useState('grid');

  
    const {
        products,
        loading,
        error,
        pagination,
        filters,
        handlePageChange,
        handleSortChange,
        handleLimitChange,
        handleCategoryChange,
        retry,
        refresh
    } = useProducts(8);

    // Debug: Log hook values
    useEffect(() => {
        // console.log('📊 Provider state:', {
        //     productsCount: products?.length,
        //     loading,
        //     error,
        //     pagination,
        //     filters
        // });
    }, [products, loading, error, pagination, filters]);

    // Handlers wrapper
    const setSortType = (sortType) => {
    
        handleSortChange(sortType);
    };

    const setShowLimit = (limit) => {
   
        handleLimitChange(parseInt(limit));
    };

    const value = {
        // Options
        sortOptions,
        showOptions,

        // Data
        products,
        loading,
        error,
        pagination,
        filters,

        // View Mode
        viewMode,
        setViewMode,

        // Actions 
        setSortType,
        setShowLimit,
        handlePageChange,
        handleSortChange,
        handleLimitChange,
        handleCategoryChange,
        retry,
        refresh
    };



    return (
        <OurShopContext.Provider value={value}>
            {children}
        </OurShopContext.Provider>
    );
};

// Export context để sử dụng trong components
export { OurShopContext };