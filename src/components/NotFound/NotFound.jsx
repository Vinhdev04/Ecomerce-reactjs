import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import styles from './NotFound.module.scss';

function NotFound() {
    return (
        <Layout>
            <div className={styles.notFoundContainer}>
         
                <div className={`${styles.gameController} ${styles.left}`}>
                    🎮
                </div>
                <div className={`${styles.gameController} ${styles.right}`}>
                    🎮
                </div>

                <div className={styles.content}>
              
                    <div className={styles.glitchWrapper}>
                        <h1 className={styles.errorCode}>404</h1>
                    </div>

            
                    <h2 className={styles.title}>
                        Oops! <span className={styles.highlight}>Game Over</span>
                    </h2>

              
                    <p className={styles.subtitle}>
                        The page you're looking for has disconnected from the server.
                        <br />
                        Let's get you back in the game!
                    </p>

               
                    <div className={styles.buttonGroup}>
                        <Link to='/' className={styles.primaryButton}>
                            🏠 Back to Home
                        </Link>
                        <Link to='/shop' className={styles.secondaryButton}>
                            🛒 Browse Shop
                        </Link>
                    </div>

               
                    <div className={styles.quickLinks}>
                        <h3 className={styles.quickLinksTitle}>
                            Popular Destinations
                        </h3>
                        <div className={styles.linkGrid}>
                            <Link to='/controllers' className={styles.linkCard}>
                                <div className={styles.icon}>🎮</div>
                                <div className={styles.linkTitle}>Controllers</div>
                                <p className={styles.linkDesc}>
                                    Latest gaming controllers
                                </p>
                            </Link>
                            <Link to='/bestsellers' className={styles.linkCard}>
                                <div className={styles.icon}>⭐</div>
                                <div className={styles.linkTitle}>Best Sellers</div>
                                <p className={styles.linkDesc}>
                                    Top rated products
                                </p>
                            </Link>
                            <Link to='/deals' className={styles.linkCard}>
                                <div className={styles.icon}>🏷️</div>
                                <div className={styles.linkTitle}>Special Deals</div>
                                <p className={styles.linkDesc}>
                                    Hot offers & discounts
                                </p>
                            </Link>
                            <Link to='/contact' className={styles.linkCard}>
                                <div className={styles.icon}>🎧</div>
                                <div className={styles.linkTitle}>Support</div>
                                <p className={styles.linkDesc}>
                                    Get help from our team
                                </p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default NotFound;