import React from 'react';
import Banner from '@components/Banner/Banner.jsx';
import Header from '@/components/Header/Header';
import styles from './HomePage.module.scss';
import Heading from '@/components/Heading/Heading';
import Info from '@/components/Info/Info';
import ProductList from '@/components/HomeListProduct/ProductList/ProductList.jsx';

function HomePage() {
    const { container } = styles;
    return (
        <>
            <div className={container}>
                <Header />
                <Banner />
                <Info />
                <Heading />
                <ProductList />
            </div>
        </>
    );
}

export default HomePage;
