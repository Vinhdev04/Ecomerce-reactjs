/**
 * Product detail UI page.
 * Rendering only; business logic lives in useProductDetailPage hook.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import {
    FaCirclePlay,
    FaGift,
    FaHeadset,
    FaShield,
    FaTruckFast,
    FaUpLong
} from 'react-icons/fa6';
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
                        Quay lai cua hang
                    </Link>
                </div>
            </Layout>
        );
    }

    const coupons = Array.isArray(product.coupons) ? product.coupons : [];
    const promotions = Array.isArray(product.promotions) ? product.promotions : [];
    const paymentOffers = Array.isArray(product.paymentOffers)
        ? product.paymentOffers
        : [];
    const specs = Array.isArray(product.specs) ? product.specs : [];
    const bundles = Array.isArray(product.bundles) ? product.bundles : [];
    const heroBanner =
        product.heroBanner && typeof product.heroBanner === 'object'
            ? product.heroBanner
            : null;

    const commitments = [
        {
            icon: <FaShield />,
            title: 'Bao hanh 12 thang chinh hang',
            desc: '1 doi 1 trong 30 ngay neu co loi NSX.'
        },
        {
            icon: <FaTruckFast />,
            title: 'Giao nhanh 2 gio noi thanh',
            desc: 'Kiem tra hang truoc khi thanh toan.'
        },
        {
            icon: <FaHeadset />,
            title: 'Ho tro ky thuat 24/7',
            desc: 'Tu van set-up va mapping profile game.'
        }
    ];

    const faqs = [
        {
            q: 'San pham co phai hang chinh hang khong?',
            a: 'Tat ca san pham duoc phan phoi boi doi tac chinh thuc va co hoa don day du.'
        },
        {
            q: 'Mua online co duoc tra gop 0%?',
            a: 'Co. Ban co the chon tra gop 0% khi thanh toan bang the tin dung ho tro.'
        },
        {
            q: 'Neu khong vua tay cam thi co doi duoc khong?',
            a: 'Ban co the doi sang model khac trong 7 ngay neu san pham con nguyen seal phu kien.'
        }
    ];

    return (
        <Layout>
            <div className={`container ${styles.detailPage}`}>
                <div className={styles.breadcrumb}>
                    <Link to="/">Trang chu</Link>
                    <span>/</span>
                    <Link to="/shop">Cua hang</Link>
                    <span>/</span>
                    <strong>{product.title}</strong>
                </div>

                <div className={styles.detailGrid}>
                    <section className={styles.leftCol}>
                        <header className={styles.headlineBlock}>
                            <h1>{product.title}</h1>
                            <div className={styles.metaRow}>
                                <span className={styles.newBadge}>Hang moi ve</span>
                                <span>{Number(product.rating || 0).toFixed(1)} / 5</span>
                                <span>Ton kho: {product.stock ?? 0}</span>
                            </div>
                            <div className={styles.quickActions}>
                                <button type="button" onClick={toggleFavorite}>
                                    {isFavorite ? 'Da yeu thich' : 'Yeu thich'}
                                </button>
                                <button type="button" onClick={toggleCompare}>
                                    {isCompared ? 'Da so sanh' : 'So sanh'}
                                </button>
                            </div>
                        </header>

                        <div className={styles.gallery}>
                            <div className={styles.heroBox}>
                                <img
                                    src={heroBanner?.mediaUrl || heroImage}
                                    alt={product.title}
                                    className={styles.mainImage}
                                />
                                <button type="button" className={styles.videoPlayBtn}>
                                    <FaCirclePlay />
                                </button>
                                {heroBanner?.title && (
                                    <div className={styles.overlayBanner}>
                                        <strong>{heroBanner.title}</strong>
                                        <small>{heroBanner.subtitle}</small>
                                    </div>
                                )}
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

                            <div className={styles.mediaTabs}>
                                <button type="button" className={styles.mediaTabActive}>
                                    Video
                                </button>
                                <button type="button">Tinh nang noi bat</button>
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
                        </div>

                        <section className={styles.cardSection}>
                            <div className={styles.sectionHead}>
                                <h3>Cam ket san pham</h3>
                            </div>
                            <div className={styles.commitGrid}>
                                {commitments.map((item) => (
                                    <article key={item.title} className={styles.commitCard}>
                                        <i>{item.icon}</i>
                                        <strong>{item.title}</strong>
                                        <p>{item.desc}</p>
                                    </article>
                                ))}
                            </div>
                        </section>

                        <section className={styles.cardSection}>
                            <div className={styles.sectionHead}>
                                <h3>Thong so ky thuat</h3>
                            </div>
                            <div className={styles.specTable}>
                                {specs.length ? (
                                    specs.map((item, idx) => (
                                        <div key={`${item.label}-${idx}`} className={styles.specRow}>
                                            <span>{item.label}</span>
                                            <strong>{item.value}</strong>
                                        </div>
                                    ))
                                ) : (
                                    <div className={styles.specRow}>
                                        <span>Thong tin</span>
                                        <strong>Dang cap nhat them.</strong>
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className={styles.cardSection}>
                            <div className={styles.sectionHead}>
                                <h3>Cau hoi thuong gap</h3>
                            </div>
                            <div className={styles.faqList}>
                                {faqs.map((item) => (
                                    <details key={item.q} className={styles.faqItem}>
                                        <summary>{item.q}</summary>
                                        <p>{item.a}</p>
                                    </details>
                                ))}
                            </div>
                        </section>
                    </section>

                    <aside className={styles.rightCol}>
                        <div className={styles.priceCard}>
                            <span className={styles.category}>{product.category || 'Tong hop'}</span>
                            <p className={styles.price}>
                                {Number(product.price || 0).toLocaleString('vi-VN')}d
                            </p>
                            <p className={styles.desc}>{product.description}</p>
                            <div className={styles.actions}>
                                <button
                                    type="button"
                                    className={styles.buyBtn}
                                    disabled={Number(product.stock || 0) <= 0}
                                    onClick={addProductToCart}
                                >
                                    {Number(product.stock || 0) <= 0 ? 'Het hang' : 'Mua ngay'}
                                </button>
                                <button type="button" className={styles.actionBtn}>
                                    Tra gop 0%
                                </button>
                            </div>
                        </div>

                        {promotions.length > 0 && (
                            <section className={styles.promoCard}>
                                <h3>
                                    <FaGift /> Khuyen mai hap dan
                                </h3>
                                <ul>
                                    {promotions.map((line) => (
                                        <li key={line}>{line}</li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {paymentOffers.length > 0 && (
                            <section className={styles.promoCard}>
                                <h3>Uu dai thanh toan</h3>
                                <ul>
                                    {paymentOffers.map((line) => (
                                        <li key={line}>{line}</li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {coupons.length > 0 && (
                            <section className={styles.couponCard}>
                                <h3>Ma giam gia danh cho ban</h3>
                                <div className={styles.couponList}>
                                    {coupons.map((coupon) => (
                                        <article key={coupon.code} className={styles.couponItem}>
                                            <strong>{coupon.code}</strong>
                                            <span>{coupon.title}</span>
                                            <p>{coupon.discountText}</p>
                                            <small>HSD: {coupon.expiresAt}</small>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        )}

                        {bundles.length > 0 && (
                            <section className={styles.couponCard}>
                                <h3>Mua kem gia soc</h3>
                                <div className={styles.bundleList}>
                                    {bundles.map((bundle) => (
                                        <article key={`${bundle.title}-${bundle.price}`} className={styles.bundleCard}>
                                            <img src={bundle.image || heroImage} alt={bundle.title} />
                                            <div>
                                                <strong>{bundle.title}</strong>
                                                <p>{bundle.discountLabel}</p>
                                                <span>
                                                    {Number(bundle.price || 0).toLocaleString('vi-VN')}d
                                                </span>
                                                <small>
                                                    {Number(bundle.oldPrice || 0).toLocaleString('vi-VN')}d
                                                </small>
                                            </div>
                                            <button type="button">
                                                {bundle.ctaLabel || 'Them vao gio'}
                                            </button>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        )}
                    </aside>
                </div>

                <div className={styles.stickyContact}>
                    <button
                        type="button"
                        className={styles.scrollTopBtn}
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        <FaUpLong /> Len dau
                    </button>
                    <a href="tel:+84123456789" className={styles.contactBtn}>
                        Lien he
                    </a>
                </div>
            </div>
        </Layout>
    );
}

export default ProductDetailPage;
