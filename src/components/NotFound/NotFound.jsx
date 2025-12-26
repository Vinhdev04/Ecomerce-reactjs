import React from 'react';
import styles from './NotFound.module.scss';

function NotFound() {
    return (
        <div className={styles.notFoundContainer}>
            {/* Decorative game controllers */}
            <div className={`${styles.gameController} ${styles.left}`}>
                <i className='fas fa-gamepad'></i>
            </div>
            <div className={`${styles.gameController} ${styles.right}`}>
                <i className='fas fa-gamepad'></i>
            </div>

            <div className={styles.content}>
                {/* 404 Error Code with Glitch Effect */}
                <div className={styles.glitchWrapper}>
                    <h1 className={styles.errorCode}>404</h1>
                </div>

                {/* Error Title */}
                <h2 className={styles.title}>
                    Oops! <span className={styles.highlight}>Game Over</span>
                </h2>

                {/* Error Description */}
                <p className={styles.subtitle}>
                    The page you're looking for has disconnected from the
                    server.
                    <br />
                    Let's get you back in the game!
                </p>

                {/* Action Buttons */}
                <div className={styles.buttonGroup}>
                    <a href='/' className={styles.primaryButton}>
                        <i className='fas fa-home me-2'></i>
                        Back to Home
                    </a>
                    <a href='/shop' className={styles.secondaryButton}>
                        <i className='fas fa-shopping-cart me-2'></i>
                        Browse Shop
                    </a>
                </div>

                {/* Quick Links */}
                <div className={styles.quickLinks}>
                    <h3 className={styles.quickLinksTitle}>
                        Popular Destinations
                    </h3>
                    <div className={styles.linkGrid}>
                        <a href='/controllers' className={styles.linkCard}>
                            <i className='fas fa-gamepad'></i>
                            <div className={styles.linkTitle}>Controllers</div>
                            <p className={styles.linkDesc}>
                                Latest gaming controllers
                            </p>
                        </a>
                        <a href='/bestsellers' className={styles.linkCard}>
                            <i className='fas fa-star'></i>
                            <div className={styles.linkTitle}>Best Sellers</div>
                            <p className={styles.linkDesc}>
                                Top rated products
                            </p>
                        </a>
                        <a href='/deals' className={styles.linkCard}>
                            <i className='fas fa-tag'></i>
                            <div className={styles.linkTitle}>
                                Special Deals
                            </div>
                            <p className={styles.linkDesc}>
                                Hot offers & discounts
                            </p>
                        </a>
                        <a href='/contact' className={styles.linkCard}>
                            <i className='fas fa-headset'></i>
                            <div className={styles.linkTitle}>Support</div>
                            <p className={styles.linkDesc}>
                                Get help from our team
                            </p>
                        </a>
                    </div>
                </div>
            </div>

            {/* Font Awesome CDN for icons */}
            <link
                rel='stylesheet'
                href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
            />
            {/* Bootstrap CSS */}
            <link
                href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css'
                rel='stylesheet'
            />
        </div>
    );
}

export default NotFound;
