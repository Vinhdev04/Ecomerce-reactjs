/**
 * Product detail UI page.
 * Rendering only; business logic lives in useProductDetailPage hook.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import useProductDetailPage from './useProductDetailPage';
import styles from './ProductDetailPage.module.scss';

function ProductDetailPage() {
    const {
        product,
        loading,
        error,
        activeIndex,
        selectImage,
        nextImage,
        prevImage,
        hasMultipleImages,
        safeImages,
        heroImage,
        isFavorite,
        isCompared,
        toggleFavorite,
        toggleCompare,
        addProductToCart
    } = useProductDetailPage();

    if (loading) {
        return (
            <Layout>
                <div className={`container ${styles.stateBox}`}>Dang tai chi tiet...</div>
            </Layout>
        );
    }

    if (error || !product) {
        return (
            <Layout>
                <div className={`container ${styles.stateBox}`}>
                    <p>{error || 'Khong tim thay san pham.'}</p>
                    <Link to="/shop" className={styles.backLink}>
                        Quay lai shop
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className={`container ${styles.detailPage}`}>
                <div className={styles.breadcrumb}>
                    <Link to="/">Home</Link>
                    <span>/</span>
                    <Link to="/shop">Shop</Link>
                    <span>/</span>
                    <strong>{product.title}</strong>
                </div>

                <div className={styles.detailGrid}>
                    <section className={styles.gallery}>
                        <div className={styles.heroBox}>
                            <img
                                src={heroImage}
                                alt={product.title}
                                className={styles.mainImage}
                            />
                            {hasMultipleImages && (
                                <>
                                    <button
                                        type="button"
                                        className={`${styles.sliderNav} ${styles.prevNav}`}
                                        onClick={prevImage}
                                    >
                                        ‹
                                    </button>
                                    <button
                                        type="button"
                                        className={`${styles.sliderNav} ${styles.nextNav}`}
                                        onClick={nextImage}
                                    >
                                        ›
                                    </button>
                                </>
                            )}
                        </div>
                        <div className={styles.thumbs}>
                            {safeImages.map((img, index) => (
                                <button
                                    key={`${img}-${index}`}
                                    type="button"
                                    className={`${styles.thumbBtn} ${
                                        activeIndex === index ? styles.activeThumb : ''
                                    }`}
                                    onClick={() => selectImage(index)}
                                >
                                    <img src={img} alt={`${product.title}-${index}`} />
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className={styles.info}>
                        <span className={styles.category}>{product.category || 'General'}</span>
                        <h1>{product.title}</h1>
                        <p className={styles.price}>
                            {Number(product.price || 0).toLocaleString('vi-VN')}d
                        </p>
                        <p className={styles.desc}>{product.description}</p>
                        <p className={styles.meta}>
                            Ton kho: <strong>{product.stock ?? 0}</strong>
                        </p>
                        <p className={styles.meta}>
                            Rating: <strong>{product.rating ?? 0}/5</strong>
                        </p>
                        {Array.isArray(product.size) && product.size.length > 0 && (
                            <p className={styles.meta}>
                                Size: <strong>{product.size.join(', ')}</strong>
                            </p>
                        )}
                        <div className={styles.actions}>
                            <button
                                type="button"
                                className={styles.buyBtn}
                                disabled={Number(product.stock || 0) <= 0}
                                onClick={addProductToCart}
                            >
                                {Number(product.stock || 0) <= 0
                                    ? 'Het hang'
                                    : 'Them vao gio hang'}
                            </button>
                            <button
                                type="button"
                                className={`${styles.actionBtn} ${
                                    isFavorite ? styles.activeAction : ''
                                }`}
                                onClick={toggleFavorite}
                            >
                                {isFavorite ? 'Da yeu thich' : 'Yeu thich'}
                            </button>
                            <button
                                type="button"
                                className={`${styles.actionBtn} ${
                                    isCompared ? styles.activeAction : ''
                                }`}
                                onClick={toggleCompare}
                            >
                                {isCompared ? 'Da compare' : 'Compare san pham'}
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </Layout>
    );
}

export default ProductDetailPage;
