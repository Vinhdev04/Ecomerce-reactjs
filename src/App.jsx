import './App.css';
import 'normalize.css';
import '@styles/app.module.scss';
import Layout from '@components/Layout/Layout';
import Header from '@components/Header/Header';
import Footer from '@components/Footer/Footer';
import BackToTop from '@components/BackToTop/BackToTop';

function App() {
    return (
        <>
            <Layout>
                <Header />

                <div>Hello World</div>

                <BackToTop />
                <Footer />
            </Layout>
        </>
    );
}

export default App;
