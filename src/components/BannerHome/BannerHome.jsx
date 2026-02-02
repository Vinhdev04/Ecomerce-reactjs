import React from 'react';
import { Carousel, Row, Col, Button } from 'antd';
import { NavLink } from 'react-router-dom';
import {
    ShoppingCartOutlined,
    RocketOutlined,
    SafetyOutlined,
    TrophyOutlined,
    ThunderboltOutlined
} from '@ant-design/icons';
import styles from './BannerHome.module.scss';

function BannerHome() {
    const sliderImages = [
        {
            id: 1,
            url: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=800&h=500&fit=crop',
            title: 'PlayStation 5 Controllers'
        },
        {
            id: 2,
            url: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=800&h=500&fit=crop',
            title: 'Xbox Series X|S'
        },
        {
            id: 3,
            url: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&h=500&fit=crop',
            title: 'Nintendo Switch'
        }
    ];

    return (
        <section className={styles.bannerSection}>
            <div className='container'>
                <Row gutter={[32, 32]} align='middle'>
                    <Col xs={24} lg={12}>
                        <div className={styles.carouselWrapper}>
                            <Carousel
                                autoplay
                                autoplaySpeed={4000}
                                effect='fade'
                                dots={true}
                                arrows={true}
                            >
                                {sliderImages.map((image) => (
                                    <div key={image.id}>
                                        <div
                                            className={styles.slideItem}
                                            style={{
                                                backgroundImage: `url(${image.url})`
                                            }}
                                        >
                                            <div
                                                className={styles.slideContent}
                                            >
                                                <h3>{image.title}</h3>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Carousel>
                        </div>
                    </Col>

                    <Col xs={24} lg={12}>
                        <div className={styles.contentWrapper}>
                            <div className={styles.badge}>
                                <ThunderboltOutlined
                                    style={{ marginRight: '8px' }}
                                />
                                New Arrivals 2025 | xPad Gaming
                            </div>

                            <h1 className={styles.mainTitle}>
                                Level Up Your
                                <span className={styles.highlight}>
                                    Gaming Experience
                                </span>
                            </h1>

                            <p className={styles.description}>
                                Discover the latest gaming controllers and
                                accessories from top brands. Get premium quality
                                products with unbeatable prices and fast
                                shipping across Vietnam.
                            </p>

                            <div className={styles.buttonGroup}>
                                <NavLink to="/shop">
                                    <Button
                                        type='primary'
                                        size='large'
                                        className={styles.primaryBtn}
                                        icon={<ShoppingCartOutlined />}
                                    >
                                        Shop Now
                                    </Button>
                                </NavLink>
                                <Button
                                    size='large'
                                    className={styles.secondaryBtn}
                                    icon={<RocketOutlined />}
                                >
                                    Explore Products
                                </Button>
                            </div>

                            <div className={styles.features}>
                                <div className={styles.featureItem}>
                                    <div className={styles.featureIcon}>
                                        <SafetyOutlined />
                                    </div>
                                    <div className={styles.featureText}>
                                        <div className={styles.featureTitle}>
                                            Genuine Products
                                        </div>
                                        <p className={styles.featureDesc}>
                                            100% Authentic
                                        </p>
                                    </div>
                                </div>

                                <div className={styles.featureItem}>
                                    <div className={styles.featureIcon}>
                                        <TrophyOutlined />
                                    </div>
                                    <div className={styles.featureText}>
                                        <div className={styles.featureTitle}>
                                            Best Quality
                                        </div>
                                        <p className={styles.featureDesc}>
                                            Top-rated brands
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </section>
    );
}

export default BannerHome;
