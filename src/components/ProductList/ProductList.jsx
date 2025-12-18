import React from 'react';
import styles from './HomeListProduct.module.scss';
import Layout from '@/components/Layout/Layout';
import CalculatorTimer from '@/components/Countdown/CalculatorTimer.jsx';
import ProductCard from '@/components/ProductItem/ProductItem.jsx';

import img01 from '@images/8BitDoUltimate 3-mode.webp';
import img02 from '@images/Xbox Series X.webp';
import img03 from '@images/8BitDoUltimate.webp';
import img04 from '@images/Xbox Series X Controller.webp';
import img05 from '@images/Microsoft Xbox One Elite Series 2.webp';
import img06 from '@images/home_img_list-products.jpg';
import img07 from '@images/home_img_list-products-02.jpg';
import img08 from '@images/DARE-U H101X.webp';
import img09 from '@images/8BitDoUltimate.webp';
import { getAllProducts } from '@api/productsService.js';
function ProductList() {
    getAllProducts();
    const regularProducts = [
        {
            id: 3,
            image: img04,
            title: 'Wireless Headphones',
            description: 'Active noise cancellation, 30h battery life',
            price: 4990000,
            badge: 'Hot'
        },
        {
            id: 4,
            image: img05,
            title: 'Smart Fitness Watch',
            description: 'Heart rate monitor, GPS tracking, waterproof',
            price: 3490000,
            badge: 'Sale'
        },
        {
            id: 5,
            image: img06,
            title: 'Leather Backpack',
            description:
                'Genuine leather, laptop compartment, USB charging port',
            price: 2990000,
            badge: 'New'
        },
        {
            id: 6,
            image: img07,
            title: 'Mechanical Keyboard',
            description: 'RGB backlight, Cherry MX switches, aluminum frame',
            price: 3290000,
            badge: 'New'
        },
        {
            id: 7,
            image: img08,
            title: 'Wireless Mouse',
            description: 'Ergonomic design, 2400 DPI, rechargeable battery',
            price: 890000,
            badge: 'Best Seller'
        },
        {
            id: 8,
            image: img09,
            title: 'USB-C Hub Adapter',
            description: '7-in-1 hub with HDMI, USB 3.0, SD card reader',
            price: 790000,
            badge: 'New'
        }
    ];

    return (
        <Layout>
            <div className={styles.homeListProduct}>
                <div className={styles.countdownSection}>
                    <div className='container'>
                        <div className={styles.countdownWrapper}>
                            <h2 className={styles.sectionTitle}>
                                The Classics Make A Comeback
                            </h2>
                            <CalculatorTimer
                                endTime={new Date('2025-12-31T23:59:59')}
                            />
                            <button className={styles.buyNowBtn}>
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>

                <div className='container'>
                    <div className={styles.featuredSection}>
                        <div className='row g-4'>
                            <div className='col-lg-6'>
                                <div className={styles.featuredBig}>
                                    <div className={styles.featuredBigImage}>
                                        <img
                                            src={img01}
                                            alt='Featured Product'
                                        />
                                        <div className={styles.featuredBadge}>
                                            <span>50% OFF</span>
                                        </div>
                                    </div>
                                    <div className={styles.featuredBigContent}>
                                        <h3>Premium Collection</h3>
                                        <p>Exclusive deals on luxury items</p>
                                        <button className={styles.shopNowBtn}>
                                            Shop Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className='col-lg-6'>
                                <div className={styles.featuredBig}>
                                    <div className={styles.featuredBigImage}>
                                        <img
                                            src={img03}
                                            alt='Featured Product'
                                        />
                                        <div className={styles.featuredBadge}>
                                            <span>50% OFF</span>
                                        </div>
                                    </div>
                                    <div className={styles.featuredBigContent}>
                                        <h3>Premium Collection</h3>
                                        <p>Exclusive deals on luxury items</p>
                                        <button className={styles.shopNowBtn}>
                                            Shop Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.regularSection}>
                        <h2 className={styles.sectionTitle}>Best Sellers</h2>

                        <div className='row g-4'>
                            {regularProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className='col-xl-4 col-md-6'
                                >
                                    <ProductCard
                                        image={product.image}
                                        title={product.title}
                                        description={product.description}
                                        price={product.price}
                                        badge={product.badge}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default ProductList;
