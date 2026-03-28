/**
 * Favorites sidebar:
 * shows favorite products and quick actions.
 */
import React, { useContext, useEffect, useState } from 'react';
import styles from './Favorites.module.scss';
import HeaderSidebar from '@components/ContentSidebar/components/HeaderSidebar/HeaderSidebar.jsx';
import { FaRegHeart } from 'react-icons/fa';
import { SideBarContext } from '@contexts/SideBarContext.js';
import { useNavigate } from 'react-router-dom';
import {
    PRODUCT_COLLECTION_EVENT,
    getFavoriteProducts,
    removeFavoriteProduct
} from '@/utils/productCollections';

function Favorites() {
    const {
        favoritesBox,
        favoritesIcon,
        emptyState,
        list,
        itemCard,
        thumb,
        itemInfo,
        price,
        badgeRow,
        badge,
        badgeBlue,
        badgeGreen,
        actionRow,
        actionBtn,
        btnInfo,
        btnRemove,
        footerActions,
        solidBtn
    } = styles;
    const { setType } = useContext(SideBarContext);
    const navigate = useNavigate();
    const [items, setItems] = useState([]);

    useEffect(() => {
        const syncItems = () => setItems(getFavoriteProducts());
        syncItems();

        window.addEventListener(PRODUCT_COLLECTION_EVENT, syncItems);
        window.addEventListener('storage', syncItems);

        return () => {
            window.removeEventListener(PRODUCT_COLLECTION_EVENT, syncItems);
            window.removeEventListener('storage', syncItems);
        };
    }, []);

    return (
        <div className={favoritesBox}>
            <HeaderSidebar
                title={`Sản phẩm yêu thích (${items.length})`}
                icon={<FaRegHeart className={favoritesIcon} />}
            />

            {items.length === 0 ? (
                <div className={emptyState}>
                    <p className="mb-1">Chưa có sản phẩm yêu thích.</p>
                    <small>Nhấn biểu tượng tim trên thẻ sản phẩm để thêm.</small>
                </div>
            ) : (
                <div className={list}>
                    {items.map((item, index) => (
                        <div
                            key={item.id}
                            className={itemCard}
                            style={{ animationDelay: `${index * 45}ms` }}
                        >
                            <img
                                src={
                                    item.image?.[0] ||
                                    'https://via.placeholder.com/64x64?text=Item'
                                }
                                alt={item.title}
                                className={thumb}
                            />
                            <div className={itemInfo}>
                                <h6>{item.title}</h6>
                                <p className={price}>
                                    {Number(item.price || 0).toLocaleString('vi-VN')}d
                                </p>
                                <div className={badgeRow}>
                                    <span className={`${badge} ${badgeBlue}`}>
                                        {item.category || 'General'}
                                    </span>
                                    <span className={`${badge} ${badgeGreen}`}>
                                        {item.rating || 0}/5
                                    </span>
                                </div>
                                <div className={actionRow}>
                                    <button
                                        className={`${actionBtn} ${btnInfo}`}
                                        type="button"
                                        onClick={() => navigate(`/products/${item.id}`)}
                                    >
                                        Chi tiết
                                    </button>
                                    <button
                                        className={`${actionBtn} ${btnRemove}`}
                                        type="button"
                                        onClick={() => removeFavoriteProduct(item.id)}
                                    >
                                        Bỏ
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className={footerActions}>
                <button
                    className={solidBtn}
                    type="button"
                    onClick={() => setType('compare')}
                >
                    Xem so sánh
                </button>
            </div>
        </div>
    );
}

export default Favorites;
