import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import BackToTop from '@/components/BackToTop/BackToTop';

function Layout({ children }) {
    return (
        <div className="app-wrapper">
            <Header />
            
            <main className="main-content">
                {children}
            </main>
            
            <Footer />
            <BackToTop />
        </div>
    );
}

export default Layout;