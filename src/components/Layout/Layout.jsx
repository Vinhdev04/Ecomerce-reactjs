import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import BackToTop from '@/components/BackToTop/BackToTop';
import ContactModal from '@/components/ContactModal/ContactModal';
import { useLocation } from 'react-router-dom';
import { useRef } from 'react';
import useSiteMotion from '@hooks/useSiteMotion';

function Layout({ children }) {
    const location = useLocation();
    const mainRef = useRef(null);

    useSiteMotion(mainRef, [location.pathname]);

    return (
        <div className="app-wrapper">
            <Header />
            
            <main
                key={location.pathname}
                ref={mainRef}
                className="main-content page-shell"
            >
                {children}
            </main>
            
            <Footer />
            <ContactModal />
            <BackToTop />
        </div>
    );
}

export default Layout;
