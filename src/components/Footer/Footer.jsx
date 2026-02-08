import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';
import footerLogo from '@images/mynameisvinh-gaming.png';

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className='container'>
                <div className='row g-4'>
                    {/* Logo & Description */}
                    <div className='mb-4 col-lg-4 col-md-6'>
                        <div className={styles.logoContainer}>
                            <img src={footerLogo} alt="XPAD Gaming" className={styles.logoImage} />
                            <h4 className={styles.logoText}>xPad Game</h4>
                        </div>
                        <p className={styles.description}>
                            Your one-stop shop for the latest and greatest video
                            game controllers and accessories. Level up your
                            gaming experience!
                        </p>
                        <div className={styles.socialLinks}>
                            <a href='#' className={styles.socialIcon}>
                                <i className='fab fa-facebook-f'></i>
                            </a>
                            <a href='#' className={styles.socialIcon}>
                                <i className='fab fa-instagram'></i>
                            </a>
                            <a href='#' className={styles.socialIcon}>
                                <i className='fab fa-tiktok'></i>
                            </a>
                            <a href='#' className={styles.socialIcon}>
                                <i className='fab fa-youtube'></i>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className='mb-4 col-lg-2 col-md-6'>
                        <h5 className={styles.sectionTitle}>Quick Links</h5>
                        <ul className={styles.linkList}>
                            <li>
                                <a href='#'>Home</a>
                            </li>
                            <li>
                                <a href='#'>Our Shop</a>
                            </li>
                            <li>
                                <a href='#'>About Us</a>
                            </li>
                            <li>
                                <a href='#'>Controllers & Gear</a>
                            </li>
                            <li>
                                <a href='#'>Contact</a>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div className='mb-4 col-lg-2 col-md-6'>
                        <h5 className={styles.sectionTitle}>Categories</h5>
                        <ul className={styles.linkList}>
                            <li>
                                <a href='#'>PlayStation</a>
                            </li>
                            <li>
                                <a href='#'>Xbox</a>
                            </li>
                            <li>
                                <a href='#'>Nintendo Switch</a>
                            </li>
                            <li>
                                <a href='#'>PC Gaming</a>
                            </li>
                            <li>
                                <a href='#'>Accessories</a>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div className='mb-4 col-lg-4 col-md-6'>
                        <h5 className={styles.sectionTitle}>
                            Customer Service
                        </h5>
                        <ul className={styles.contactList}>
                            <li>
                                <i className='fas fa-map-marker-alt'></i>
                                <span>
                                    123 Gaming Street, Tech District, Ho Chi
                                    Minh City
                                </span>
                            </li>
                            <li className={styles.alignCenter}>
                                <i className='fas fa-phone'></i>
                                <a href='tel:+84123456789'>+84 123 456 789</a>
                            </li>
                            <li className={styles.alignCenter}>
                                <i className='fas fa-envelope'></i>
                                <a href='mailto:support@xpadgame.vn'>
                                    support@xpadgame.vn
                                </a>
                            </li>
                            <li className={styles.alignCenter}>
                                <i className='fas fa-clock'></i>
                                <span>Mon - Sun: 9:00 AM - 10:00 PM</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={styles.paymentSection}>
                    <p>Secure Payment Methods</p>
                    <div className={styles.paymentMethods}>
                        <div className={styles.paymentCard}>
                            <i className='fab fa-cc-visa'></i>
                        </div>
                        <div className={styles.paymentCard}>
                            <i className='fab fa-cc-mastercard'></i>
                        </div>
                        <div className={styles.paymentCard}>
                            <i className='fab fa-cc-paypal'></i>
                        </div>
                        <div className={styles.paymentCard}>
                            <i className='fab fa-cc-amex'></i>
                        </div>
                    </div>
                </div>

                <div className={styles.copyright}>
                    <hr />
                    <div className={styles.copyrightContent}>
                        <p>© 2025 xPad Game. Designed by Công Vinh.</p>
                        <div className={styles.policyLinks}>
                            <Link to='/privacy-policy'>Privacy Policy</Link>
                            <Link to='/terms-of-service'>Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
