import React from 'react';
import styles from './Banner.module.scss';
import useTypedTitle from './hooks/typedTitle.js';
import Button from '@components/Button/Button.jsx';
import { NavLink } from 'react-router-dom';

function Banner() {
    const { container, bannerInform, statGrid, statItem } = styles;
    const { typedRef } = useTypedTitle();

    return (
        <div className={container}>
            <div className={styles.bgOrbs} aria-hidden="true">
                <span />
                <span />
            </div>

            <div className={bannerInform}>
                <p className={styles.kicker}>xPad Gaming Collection 2026</p>

                <h1>
                    <span ref={typedRef}></span>
                </h1>

                <p>
                    Your one-stop shop for the latest and greatest video games!
                    Shop now and get your hands on the best games of the future.
                </p>

                <NavLink to="/shop" className={styles.ctaWrap}>
                    <Button content={'Go To Shop'}></Button>
                </NavLink>

                <div className={statGrid}>
                    <div className={statItem}>
                        <strong>2h</strong>
                        <span>Average delivery</span>
                    </div>
                    <div className={statItem}>
                        <strong>10k+</strong>
                        <span>Trusted gamers</span>
                    </div>
                    <div className={statItem}>
                        <strong>4.9</strong>
                        <span>Store rating</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Banner;
