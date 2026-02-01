import React, { useContext } from 'react';
import { Select, Space } from 'antd';
import { CiGrid42, CiCircleList } from 'react-icons/ci';
import { OurShopContext } from '@contexts/OurShopContext.js';
import styles from './FilterProduct.module.scss';

function FilterProduct() {
    const {
        sortOptions,
        showOptions,
        setViewMode,
        setSortType,
        setShowLimit,
        viewMode
    } = useContext(OurShopContext);

    const handleSortChange = (value) => {
        console.log('Sort changed:', value);
        setSortType(value);
    };

    const handleShowChange = (value) => {
        console.log('Show limit changed:', value);
        setShowLimit(value);
    };

    const handleViewModeChange = (mode) => {
        console.log('View mode changed:', mode);
        setViewMode(mode);
    };

    return (
        <div className="mb-3 d-flex justify-content-between align-items-center">
            {/* Left side - Sort & View Mode */}
            <div className="gap-3 d-flex align-items-center">
                {/* Sort Select */}
                <Space>
                    <Select
                        defaultValue="0"
                        style={{ width: 150 }}
                        onChange={handleSortChange}
                        options={sortOptions}
                        placeholder="Sort by"
                    />
                </Space>

                {/* View Mode Buttons */}
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

            {/* Right side - Show Items */}
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