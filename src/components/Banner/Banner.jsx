import React from 'react';
import styles from './Banner.module.scss';
import useTypedTitle from './hooks/typedTitle.js';
import Button from '@components/Button/Button.jsx';
function Banner() {
    const { container, bannerInform } = styles;

    const { typedRef } = useTypedTitle();

    return (
        <div className={container}>
            <div className={bannerInform}>
                <h1>
                    <span ref={typedRef}></span>
                </h1>

                <p>
                    Your one-stop shop for the latest and greatest video games!
                    Shop now and get your hands on the best games of the future.
                </p>

                <Button content={'Go To Shop'}></Button>
            </div>
        </div>
    );
}

export default Banner;
