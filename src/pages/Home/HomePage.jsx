import React from 'react';
import Banner from '@components/Banner/Banner.jsx';
import Header from '@/components/Header/Header';
import styles from './HomePage.module.scss';
import Heading from '@/components/Heading/Heading';
import Info from '@/components/Info/Info';
import HomeListProduct from '@/components/HomeListProduct/HomeListProduct';
import BannerHome from '@/components/BannerHome/BannerHome';
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
            </div>
        </>
    );
}

export default HomePage;
