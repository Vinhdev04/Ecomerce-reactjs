import React from 'react';
import Banner from '@components/Banner/Banner.jsx';
import Header from '@/components/Header/Header';
import styles from './HomePage.module.scss';
function HomePage() {
    const { container } = styles;
    return (
        <>
            <div className={container}>
                <Header />
                <Banner />
            </div>
        </>
    );
}

export default HomePage;
