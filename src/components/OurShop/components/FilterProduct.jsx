import React, { useContext } from 'react';
import { Select, Space } from 'antd';
import { CiGrid42, CiCircleList } from 'react-icons/ci';
import { OurShopContext } from '@contexts/OurShopContext.js';


function FilterProduct() {

    const {
        sortOptions,
        showOptions,
        setViewMode,
        setSortType,
        setShowLimit,
        viewMode
    } = useContext(OurShopContext);

    // Debug: Check context
    console.log('FilterProduct context:', {
        sortOptions,
        showOptions,
        setViewMode,
        setSortType,
        setShowLimit
    });

    const handleSortChange = (value) => {
        setSortType(value);
    };

    const handleShowChange = (value) => {
        setShowLimit(value);
    };

    const handleViewModeChange = (mode) => {
        
        setViewMode(mode);
    };

    return (
        <div className="mb-3 d-flex justify-content-between align-items-center">
            
            <div className="gap-3 d-flex align-items-center">
             
                <Space>
                    <Select
                        defaultValue="0"
                        style={{ width: 150 }}
                        onChange={handleSortChange}
                        options={sortOptions}
                        placeholder="Sort by"
                    />
                </Space>

           
                <div className="ms-2">
                    <button
                        className={`btn fw-bold ${viewMode === 'grid' ? 'btn-primary' : ''}`}
                        onClick={() => handleViewModeChange('grid')}
                    >
                        <CiGrid42 size={20} />
                    </button>
                    <button
                        className={`btn ms-2 fw-bold ${viewMode === 'list' ? 'btn-primary' : ''}`}
                        onClick={() => handleViewModeChange('list')}
                    >
                        <CiCircleList size={20} />
                    </button>
                </div>
            </div>

       
            <div>
                <Space>
                    <span>Show</span>
                    <Select
                        defaultValue="8"
                        style={{ width: 80 }}
                        onChange={handleShowChange}
                        options={showOptions}
                    />
                </Space>
            </div>
        </div>
    );
}

export default FilterProduct;