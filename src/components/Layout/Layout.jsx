import React from 'react';

import styles from './Layout.module.scss';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import BackToTop from '@/components/BackToTop/BackToTop';

function Layout({ children }) {
    const { wrapperLayout, containerLayout } = styles;
    return (
        <>
            <main className={wrapperLayout}>
                <div className={containerLayout}>{children}</div>
            </main>
        </>
    );
}

export default Layout;
