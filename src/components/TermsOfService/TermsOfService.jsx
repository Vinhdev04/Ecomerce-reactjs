import React, { useEffect } from 'react';
import Layout from '@/components/Layout/Layout';
import { FaFileContract, FaGavel, FaMoneyBillWave, FaComments, FaGlobe, FaExclamationCircle } from 'react-icons/fa';
import styles from './TermsOfService.module.scss';

const TermsOfService = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.iconWrapper}>
                        <FaFileContract className={styles.mainIcon} />
                    </div>
                    <h1>Terms of Service</h1>
                    <p className={styles.subtitle}>Rules of engagement. Fair play. Clear terms.</p>
                </div>
                
                <div className={styles.content}>
                    <p className={styles.lastUpdated}>Last updated: February 2026</p>
                    
                    <p className={styles.intro}>
                        Welcome to xPad Game Store. By accessing or using our website, you agree to be bound by these Terms of Service. Please read them carefully before using our services.
                    </p>

                    <div className={styles.gridContainer}>
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <FaGavel className={styles.cardIcon} />
                                <h2>1. General Conditions</h2>
                            </div>
                            <p>We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted and involve transmissions over various networks.</p>
                        </div>

                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <FaExclamationCircle className={styles.cardIcon} />
                                <h2>2. Products & Services</h2>
                            </div>
                            <p>Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.</p>
                        </div>

                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <FaMoneyBillWave className={styles.cardIcon} />
                                <h2>3. Pricing & Payment</h2>
                            </div>
                            <p>Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.</p>
                        </div>

                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <FaComments className={styles.cardIcon} />
                                <h2>4. User Comments</h2>
                            </div>
                            <p>If you send creative ideas, suggestions, proposals, plans, or other materials, you agree that we may, at any time, without restriction, edit, copy, publish, distribute, translate and otherwise use in any medium any comments that you forward to us.</p>
                        </div>

                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <FaGlobe className={styles.cardIcon} />
                                <h2>5. Governing Law</h2>
                            </div>
                            <p>These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of Vietnam.</p>
                        </div>

                        <div className={`${styles.card} ${styles.highlightCard}`}>
                            <div className={styles.cardHeader}>
                                <FaFileContract className={styles.cardIcon} />
                                <h2>6. Changes to Terms</h2>
                            </div>
                            <p>You can review the most current version of the Terms of Service at any time at this page. We reserve the right to update, change or replace any part of these Terms of Service by posting updates and changes to our website.</p>
                        </div>
                    </div>

                    <div className={styles.footerNote}>
                        <p>Questions about the Terms of Service should be sent to us at <strong>support@xpadgame.vn</strong>.</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default TermsOfService;