import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Typed from 'typed.js';
import 'normalize.css';
import '@styles/app.module.scss';
import { initVisibilityHandler } from '@utils/changeFavicon';

import HomePage from '@pages/Home/HomePage.jsx';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import BackToTop from '@/components/BackToTop/BackToTop';
import Layout from '@/components/Layout/Layout';
initVisibilityHandler();

function App() {
    return (
        <>
            <HomePage />

            <BackToTop />
            <Footer />
        </>
    );
}

export default App;
