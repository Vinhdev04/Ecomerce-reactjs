import React from 'react';
import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';
import BackToTop from '../BackToTop/BackToTop.jsx';
import styles from './Layout.module.scss';
function Layout({ children }) {
    const { wrapperLayout, containerLayout } = styles;
    return (
        <>
            <Header />

            <main className={wrapperLayout}>
                <div className={containerLayout}>{children}</div>
            </main>

            <BackToTop />

            <Footer />
        </>
    );
}

export default Layout;
