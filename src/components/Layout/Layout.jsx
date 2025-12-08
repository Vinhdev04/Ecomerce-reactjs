import React from 'react';
import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';
import BackToTop from '../BackToTop/BackToTop.jsx';
import Button from '../Button/Button.jsx';
function Layout({ children }) {
    return (
        <>
            <Header />
            <Button />
            <main>
                <div>{children}</div>
            </main>

            <BackToTop />

            <Footer />
        </>
    );
}

export default Layout;
