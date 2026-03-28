/**
 * Compare sidebar:
 * shows compare products list and quick actions.
 */
import React, { useContext, useEffect, useState } from 'react';
import styles from './Compare.module.scss';
import { TfiReload } from 'react-icons/tfi';
import HeaderSidebar from '@components/ContentSidebar/components/HeaderSidebar/HeaderSidebar.jsx';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '@contexts/CartContext.js';
import {
    PRODUCT_COLLECTION_EVENT,
    clearCompareProducts,
    getCompareProducts,
    removeComparedProduct
} from '@/utils/productCollections';

function Compare() {
    const { reloadIcon, compareBox } = styles;
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();
    const [items, setItems] = useState([]);

    useEffect(() => {
        const syncItems = () => setItems(getCompareProducts());
        syncItems();

        window.addEventListener(PRODUCT_COLLECTION_EVENT, syncItems);
        window.addEventListener('storage', syncItems);

        return () => {
            window.removeEventListener(PRODUCT_COLLECTION_EVENT, syncItems);
            window.removeEventListener('storage', syncItems);
        };
    }, []);

    return (
        <div className={compareBox}>
            <HeaderSidebar
                title={`Compare Product (${items.length}/4)`}
                icon={<TfiReload className={reloadIcon} />}
            />

            {items.length === 0 ? (
                <div className="d-flex flex-column justify-content-center align-items-center h-100 text-secondary">
                    <p className="mb-1">Chua co san pham compare.</p>
                    <small>Click icon compare tren card hoac trang detail.</small>
                </div>
            ) : (
                <div className="d-flex flex-column gap-2 p-3 overflow-auto">
                    <div className="table-responsive border rounded-3 bg-white">
                        <table className="table table-sm table-bordered align-middle mb-0">
                            <thead>
                                <tr>
                                    <th style={{ minWidth: 120 }}>Tieu chi</th>
                                    {items.map((item) => (
                                        <th
                                            key={`head-${item.id}`}
                                            style={{ minWidth: 170 }}
                                        >
                                            <div className="d-flex flex-column gap-1">
                                                <img
                                                    src={
                                                        item.image?.[0] ||
                                                        'https://via.placeholder.com/140x90?text=Item'
                                                    }
                                                    alt={item.title}
                                                    style={{
                                                        width: '100%',
                                                        height: 90,
                                                        objectFit: 'cover',
                                                        borderRadius: 8
                                                    }}
                                                />
                                                <span className="small">
                                                    {item.title}
                                                </span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>Gia</th>
                                    {items.map((item) => (
                                        <td key={`price-${item.id}`}>
                                            {Number(item.price || 0).toLocaleString(
                                                'vi-VN'
                                            )}
                                            d
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <th>Rating</th>
                                    {items.map((item) => (
                                        <td key={`rating-${item.id}`}>
                                            {item.rating || 0}/5
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <th>Ton kho</th>
                                    {items.map((item) => (
                                        <td key={`stock-${item.id}`}>
                                            {item.stock || 0}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <th>Category</th>
                                    {items.map((item) => (
                                        <td key={`category-${item.id}`}>
                                            {item.category || '-'}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <th>Hanh dong</th>
                                    {items.map((item) => (
                                        <td key={`actions-${item.id}`}>
                                            <div className="d-flex flex-wrap gap-1">
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/products/${item.id}`
                                                        )
                                                    }
                                                >
                                                    Chi tiet
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-success"
                                                    type="button"
                                                    onClick={() => addToCart(item)}
                                                >
                                                    Add cart
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    type="button"
                                                    onClick={() =>
                                                        removeComparedProduct(
                                                            item.id
                                                        )
                                                    }
                                                >
                                                    Bo
                                                </button>
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {items.length < 2 && (
                        <small className="text-muted px-1">
                            Can it nhat 2 san pham de so sanh hieu qua.
                        </small>
                    )}
                </div>
            )}

            <div className="d-flex flex-column gap-2 p-3">
                <button
                    className="btn btn-dark"
                    type="button"
                    onClick={() => navigate('/shop')}
                >
                    View Compare in Shop
                </button>
                <button
                    className="btn btn-outline-danger"
                    type="button"
                    onClick={clearCompareProducts}
                    disabled={items.length === 0}
                >
                    Clear compare
                </button>
            </div>
        </div>
    );
}

export default Compare;
