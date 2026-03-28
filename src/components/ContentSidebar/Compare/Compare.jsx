/**
 * Compare sidebar:
 * compact preview list + quick navigation to dedicated compare page.
 */
import React, { useEffect, useState } from 'react';
import styles from './Compare.module.scss';
import { TfiReload } from 'react-icons/tfi';
import HeaderSidebar from '@components/ContentSidebar/components/HeaderSidebar/HeaderSidebar.jsx';
import { useNavigate } from 'react-router-dom';
import {
    PRODUCT_COLLECTION_EVENT,
    clearCompareProducts,
    getCompareProducts,
    removeComparedProduct
} from '@/utils/productCollections';

function Compare() {
    const { reloadIcon, compareBox } = styles;
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
                title={`Sản phẩm so sánh (${items.length}/4)`}
                icon={<TfiReload className={reloadIcon} />}
            />

            {items.length === 0 ? (
                <div className="d-flex flex-column justify-content-center align-items-center h-100 text-secondary">
                    <p className="mb-1">Chưa có sản phẩm so sánh.</p>
                    <small>Thêm từ thẻ sản phẩm hoặc trang chi tiết.</small>
                </div>
            ) : (
                <div className="d-flex flex-column gap-2 p-3 overflow-auto">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="border rounded-3 p-2 bg-white d-flex gap-2"
                        >
                            <img
                                src={
                                    item.image?.[0] ||
                                    'https://via.placeholder.com/64x64?text=Item'
                                }
                                alt={item.title}
                                width={64}
                                height={64}
                                style={{ objectFit: 'cover', borderRadius: 8 }}
                            />
                            <div className="d-flex flex-column flex-grow-1">
                                <strong className="small">{item.title}</strong>
                                <small className="text-muted">
                                    {Number(item.price || 0).toLocaleString('vi-VN')}d
                                </small>
                                <div className="d-flex gap-2 mt-2">
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        type="button"
                                        onClick={() => navigate(`/products/${item.id}`)}
                                    >
                                        Chi tiết
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        type="button"
                                        onClick={() => removeComparedProduct(item.id)}
                                    >
                                        Bỏ
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="d-flex flex-column gap-2 p-3">
                <button
                    className="btn btn-dark"
                    type="button"
                    onClick={() => navigate('/compare')}
                >
                    Mở trang so sánh
                </button>
                <button
                    className="btn btn-outline-danger"
                    type="button"
                    onClick={clearCompareProducts}
                    disabled={items.length === 0}
                >
                    Xóa danh sách so sánh
                </button>
            </div>
        </div>
    );
}

export default Compare;
