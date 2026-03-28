/**
 * Dedicated compare page for users to view product comparison cleanly.
 */
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { CartContext } from '@contexts/CartContext.js';
import styles from './ComparePage.module.scss';
import {
    PRODUCT_COLLECTION_EVENT,
    clearCompareProducts,
    getCompareProducts,
    removeComparedProduct
} from '@/utils/productCollections';

function ComparePage() {
    const [items, setItems] = useState([]);
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

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

    if (items.length === 0) {
        return (
            <Layout>
                <section className={`container ${styles.comparePage}`}>
                    <div className={styles.breadcrumb}>
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <strong>Compare</strong>
                    </div>
                    <div className={styles.emptyState}>
                        <h1>Compare products</h1>
                        <p>Ban chua them san pham nao vao danh sach compare.</p>
                        <Link to="/shop" className={styles.primaryBtn}>
                            Di den shop
                        </Link>
                    </div>
                </section>
            </Layout>
        );
    }

    return (
        <Layout>
            <section className={`container ${styles.comparePage}`}>
                <div className={styles.breadcrumb}>
                    <Link to="/">Home</Link>
                    <span>/</span>
                    <strong>Compare</strong>
                </div>

                <div className={styles.headerRow}>
                    <div>
                        <p className={styles.kicker}>Realtime compare</p>
                        <h1>So sanh san pham</h1>
                        <p className={styles.subtitle}>
                            So sanh nhanh cac thong so quan trong de chon san pham phu
                            hop.
                        </p>
                    </div>
                    <button
                        type="button"
                        className={styles.clearBtn}
                        onClick={clearCompareProducts}
                    >
                        Clear all
                    </button>
                </div>

                <div className={styles.tableWrap}>
                    <table className={styles.compareTable}>
                        <thead>
                            <tr>
                                <th className={styles.criteriaCol}>Tieu chi</th>
                                {items.map((item) => (
                                    <th key={`head-${item.id}`}>
                                        <div className={styles.productHead}>
                                            <img
                                                src={
                                                    item.image?.[0] ||
                                                    'https://via.placeholder.com/220x140?text=Item'
                                                }
                                                alt={item.title}
                                            />
                                            <h4>{item.title}</h4>
                                            <p>
                                                {Number(item.price || 0).toLocaleString(
                                                    'vi-VN'
                                                )}
                                                d
                                            </p>
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
                                        {Number(item.price || 0).toLocaleString('vi-VN')}d
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
                                    <td key={`stock-${item.id}`}>{item.stock || 0}</td>
                                ))}
                            </tr>
                            <tr>
                                <th>Category</th>
                                {items.map((item) => (
                                    <td key={`cat-${item.id}`}>{item.category || '-'}</td>
                                ))}
                            </tr>
                            <tr>
                                <th>Hanh dong</th>
                                {items.map((item) => (
                                    <td key={`action-${item.id}`}>
                                        <div className={styles.actionGroup}>
                                            <button
                                                type="button"
                                                className={styles.ghostBtn}
                                                onClick={() =>
                                                    navigate(`/products/${item.id}`)
                                                }
                                            >
                                                Chi tiet
                                            </button>
                                            <button
                                                type="button"
                                                className={styles.successBtn}
                                                onClick={() => addToCart(item)}
                                            >
                                                Add cart
                                            </button>
                                            <button
                                                type="button"
                                                className={styles.dangerBtn}
                                                onClick={() =>
                                                    removeComparedProduct(item.id)
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
            </section>
        </Layout>
    );
}

export default ComparePage;
