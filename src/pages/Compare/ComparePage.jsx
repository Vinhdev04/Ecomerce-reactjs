/**
 * Dedicated compare page for users to view product comparison cleanly.
 */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import styles from './ComparePage.module.scss';
import {
    PRODUCT_COLLECTION_EVENT,
    clearCompareProducts,
    getCompareProducts,
    removeComparedProduct
} from '@/utils/productCollections';

function ComparePage() {
    const [items, setItems] = useState([]);
    const navigate = useNavigate();
    const prices = items.map((item) => Number(item.price || 0));
    const ratings = items.map((item) => Number(item.rating || 0));
    const stocks = items.map((item) => Number(item.stock || 0));
    const bestPrice = prices.length ? Math.min(...prices) : 0;
    const bestRating = ratings.length ? Math.max(...ratings) : 0;
    const bestStock = stocks.length ? Math.max(...stocks) : 0;

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
                        <Link to="/">Trang chủ</Link>
                        <span>/</span>
                        <strong>So sánh</strong>
                    </div>
                    <div className={styles.emptyState}>
                        <h1>So sánh sản phẩm</h1>
                        <p>Bạn chưa thêm sản phẩm nào vào danh sách so sánh.</p>
                        <Link to="/shop" className={styles.primaryBtn}>
                            Đi đến cửa hàng
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
                    <Link to="/">Trang chủ</Link>
                    <span>/</span>
                    <strong>So sánh</strong>
                </div>

                <div className={styles.headerRow}>
                    <div>
                        <p className={styles.kicker}>So sánh thời gian thực</p>
                        <h1>So sánh sản phẩm</h1>
                        <p className={styles.subtitle}>
                            So sánh nhanh các thông số quan trọng để chọn sản phẩm
                            phù hợp.
                        </p>
                        <div className={styles.legendRow}>
                            <span className={styles.legendTag}>Giá tốt nhất</span>
                            <span className={styles.legendTag}>Đánh giá cao nhất</span>
                            <span className={styles.legendTag}>Tồn kho cao nhất</span>
                        </div>
                    </div>
                    <button
                        type="button"
                        className={styles.clearBtn}
                        onClick={clearCompareProducts}
                    >
                        Xóa tất cả
                    </button>
                </div>

                <div className={styles.tableWrap}>
                    <table className={styles.compareTable}>
                        <thead>
                            <tr>
                                <th className={styles.criteriaCol}>Tiêu chí</th>
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
                                <th>Giá</th>
                                {items.map((item) => (
                                    <td
                                        key={`price-${item.id}`}
                                        className={
                                            Number(item.price || 0) === bestPrice
                                                ? styles.bestCell
                                                : ''
                                        }
                                    >
                                        {Number(item.price || 0).toLocaleString('vi-VN')}d
                                        {Number(item.price || 0) === bestPrice && (
                                            <span className={styles.winBadge}>Tốt nhất</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <th>Đánh giá</th>
                                {items.map((item) => (
                                    <td
                                        key={`rating-${item.id}`}
                                        className={
                                            Number(item.rating || 0) === bestRating
                                                ? styles.bestCell
                                                : ''
                                        }
                                    >
                                        {item.rating || 0}/5
                                        {Number(item.rating || 0) === bestRating && (
                                            <span className={styles.winBadge}>Cao nhất</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <th>Tồn kho</th>
                                {items.map((item) => (
                                    <td
                                        key={`stock-${item.id}`}
                                        className={
                                            Number(item.stock || 0) === bestStock
                                                ? styles.bestCell
                                                : ''
                                        }
                                    >
                                        {item.stock || 0}
                                        {Number(item.stock || 0) === bestStock && (
                                            <span className={styles.winBadge}>Nhiều nhất</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <th>Danh mục</th>
                                {items.map((item) => (
                                    <td key={`cat-${item.id}`}>{item.category || '-'}</td>
                                ))}
                            </tr>
                            <tr>
                                <th>Hành động</th>
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
                                                Chi tiết
                                            </button>
                                            <button
                                                type="button"
                                                className={styles.dangerBtn}
                                                onClick={() =>
                                                    removeComparedProduct(item.id)
                                                }
                                            >
                                                Bỏ
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
