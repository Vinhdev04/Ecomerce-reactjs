import React, { useEffect, useRef } from 'react';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function BannerHome() {
    const swiperRef = useRef(null);

    useEffect(() => {
        const swiper = new Swiper(swiperRef.current, {
            modules: [Navigation, Pagination, Autoplay],
            direction: 'horizontal',
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
            speed: 800
        });

        return () => {
            if (swiper) swiper.destroy();
        };
    }, []);

    return <></>;
}
export default BannerHome;
