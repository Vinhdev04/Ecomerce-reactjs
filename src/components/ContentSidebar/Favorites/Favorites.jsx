/**
 * Favorites sidebar:
 * shows favorite products and quick actions.
 */
import React, { useContext, useEffect, useState } from 'react';
import styles from './Favorites.module.scss';
import HeaderSidebar from '@components/ContentSidebar/components/HeaderSidebar/HeaderSidebar.jsx';
import { FaRegHeart } from 'react-icons/fa';
import { CartContext } from '@contexts/CartContext.js';
import { SideBarContext } from '@contexts/SideBarContext.js';
import { useNavigate } from 'react-router-dom';
import {
    PRODUCT_COLLECTION_EVENT,
    getFavoriteProducts,
    removeFavoriteProduct
} from '@/utils/productCollections';

function Favorites() {
    const { favoritesBox, favoritesIcon } = styles;
    const { addToCart } = useContext(CartContext);
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
                title={`Favorites Product (${items.length})`}
                icon={<FaRegHeart className={favoritesIcon} />}
            />

            {items.length === 0 ? (
                <div className="d-flex flex-column justify-content-center align-items-center h-100 text-secondary">
                    <p className="mb-1">Chua co san pham yeu thich.</p>
                    <small>Click icon tim tren card de them.</small>
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
                                        onClick={() => removeFavoriteProduct(item.id)}
                                    >
                                        Bo
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
                    onClick={() => setType('compare')}
                >
                    View Compare
                </button>
                <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => items.forEach((item) => addToCart(item))}
                    disabled={items.length === 0}
                >
                    Add all to cart
                </button>
            </div>
        </div>
    );
}

export default Favorites;
