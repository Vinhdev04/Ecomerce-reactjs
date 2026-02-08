import React, { useEffect } from 'react';
import Layout from '@/components/Layout/Layout';
import { FaUserShield, FaLock, FaDatabase, FaCookieBite, FaUserSecret, FaEnvelope } from 'react-icons/fa';
import styles from './PrivacyPolicy.module.scss';

const PrivacyPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.iconWrapper}>
                        <FaUserShield className={styles.mainIcon} />
                    </div>
                    <h1>Privacy Policy</h1>
                    <p className={styles.subtitle}>Your privacy is our priority. Secure. Transparent. Trusted.</p>
                </div>
                
                <div className={styles.content}>
                    <p className={styles.lastUpdated}>Last updated: February 2026</p>
                    
                    <p className={styles.intro}>
                        At xPad Game Store, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or make a purchase.
                    </p>

                    <div className={styles.gridContainer}>
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <FaDatabase className={styles.cardIcon} />
                                <h2>1. Information We Collect</h2>
                            </div>
                            <div className={styles.cardBody}>
                                <p>We collect information that you provide to us directly, such as:</p>
                                <ul>
                                    <li>Personal identification information (Name, email address, phone number, shipping address).</li>
                                    <li>Payment information (Credit card details, billing address) - Note: We do not store your full credit card details.</li>
                                    <li>Account login credentials (Username, password).</li>
                                </ul>
                            </div>
                        </div>

                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <FaUserSecret className={styles.cardIcon} />
                                <h2>2. How We Use Your Information</h2>
                            </div>
                            <div className={styles.cardBody}>
                                <p>We use the information we collect to:</p>
                                <ul>
                                    <li>Process and fulfill your orders.</li>
                                    <li>Communicate with you regarding your order status.</li>
                                    <li>Improve our website and customer service.</li>
                                    <li>Send you promotional emails (only if you have opted in).</li>
                                </ul>
                            </div>
                        </div>

                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <FaLock className={styles.cardIcon} />
                                <h2>3. Data Protection</h2>
                            </div>
                            <div className={styles.cardBody}>
                                <p>We implement a variety of security measures to maintain the safety of your personal information. Your personal data is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems.</p>
                            </div>
                        </div>

                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <FaCookieBite className={styles.cardIcon} />
                                <h2>4. Cookies</h2>
                            </div>
                            <div className={styles.cardBody}>
                                <p>We use cookies to enhance your browsing experience. Cookies help us remember and process the items in your shopping cart and understand your preferences based on previous or current site activity.</p>
                            </div>
                        </div>

                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <FaUserShield className={styles.cardIcon} />
                                <h2>5. Third-Party Disclosure</h2>
                            </div>
                            <div className={styles.cardBody}>
                                <p>We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users.</p>
                            </div>
                        </div>

                        <div className={`${styles.card} ${styles.contactCard}`}>
                            <div className={styles.cardHeader}>
                                <FaEnvelope className={styles.cardIcon} />
                                <h2>6. Contact Us</h2>
                            </div>
                            <div className={styles.cardBody}>
                                <p>If there are any questions regarding this privacy policy, you may contact us using the information below:</p>
                                <div className={styles.contactInfo}>
                                    <p><strong>Email:</strong> support@xpadgame.vn</p>
                                    <p><strong>Address:</strong> 123 Gaming Street, Tech District, Ho Chi Minh City</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PrivacyPolicy;