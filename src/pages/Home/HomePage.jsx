import React from 'react';
import Banner from '@components/Banner/Banner.jsx';
import Header from '@/components/Header/Header';
import styles from './HomePage.module.scss';
import Heading from '@/components/Heading/Heading';
import Info from '@/components/Info/Info';
import HomeListProduct from '@/components/HomeListProduct/HomeListProduct';
import BannerHome from '@/components/BannerHome/BannerHome';
import Footer from '@/components/Footer/Footer';
function HomePage() {
    const { container } = styles;
    return (
        <>
            <div className={container}>
                <Header />
                <Banner />
                <Info />
                <Heading />
                <HomeListProduct />
                <BannerHome />
                <Footer />
            </div>
        </>
    );
}

export default HomePage;
