import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { getProductById } from '@/api/productsService';
import { CartContext } from '@contexts/CartContext.js';
import styles from './ProductDetailPage.module.scss';

function ProductDetailPage() {
    const { id } = useParams();
    const { addToCart } = useContext(CartContext);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeImage, setActiveImage] = useState('');

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true);
                const response = await getProductById(id);
                if (response?.success && response?.data) {
                    setProduct(response.data);
                    setActiveImage(
                        Array.isArray(response.data.image)
                            ? response.data.image[0]
                            : response.data.image
                    );
                } else {
                    setError('Khong tim thay san pham.');
                }
            } catch (err) {
                setError(
                    err?.response?.data?.message || 'Khong the tai chi tiet san pham.'
                );
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [id]);

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

    const images = Array.isArray(product.image) ? product.image : [product.image];
    const safeImages = images.filter(Boolean);
    const heroImage =
        activeImage ||
        safeImages[0] ||
        'https://via.placeholder.com/800x800?text=Product';

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
                        <img
                            src={heroImage}
                            alt={product.title}
                            className={styles.mainImage}
                        />
                        <div className={styles.thumbs}>
                            {safeImages.map((img, index) => (
                                <button
                                    key={`${img}-${index}`}
                                    type="button"
                                    className={`${styles.thumbBtn} ${
                                        activeImage === img ? styles.activeThumb : ''
                                    }`}
                                    onClick={() => setActiveImage(img)}
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
                                onClick={() => addToCart(product)}
                            >
                                {Number(product.stock || 0) <= 0
                                    ? 'Het hang'
                                    : 'Them vao gio hang'}
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </Layout>
    );
}

export default ProductDetailPage;
