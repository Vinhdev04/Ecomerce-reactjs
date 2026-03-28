import React from 'react';
import styles from './ShopCouponSection.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const promoBanners = [
    {
        title: 'Flash Sale Weekend',
        subtitle: 'Giam den 35% cho phu kien gaming chon loc',
        tag: 'HOT'
    },
    {
        title: 'Mua 2 Giam Them',
        subtitle: 'Them 10% khi mua kem dock, grip hoac skin',
        tag: 'COMBO'
    }
];

const couponItems = [
    {
        code: 'XPAD100K',
        title: 'Voucher thanh vien moi',
        desc: 'Don tu 1.200.000d giam ngay 100.000d'
    },
    {
        code: 'FREESHIPVN',
        title: 'Mien phi van chuyen',
        desc: 'Ap dung toan quoc cho don tu 1.500.000d'
    },
    {
        code: 'PAYDAY7',
        title: 'Uu dai luong ve',
        desc: 'Giam 7% toi da 400.000d khi thanh toan vi dien tu'
    }
];

function ShopCouponSection() {
    return (
        <section className={styles.wrap}>
            <Swiper
                modules={[Autoplay, Pagination]}
                className={styles.bannerSwiper}
                spaceBetween={12}
                slidesPerView={1}
                autoplay={{ delay: 3200, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                breakpoints={{
                    992: {
                        slidesPerView: 2
                    }
                }}
            >
                {promoBanners.map((item) => (
                    <SwiperSlide key={item.title}>
                        <article className={styles.bannerCard}>
                            <span>{item.tag}</span>
                            <h3>{item.title}</h3>
                            <p>{item.subtitle}</p>
                        </article>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className={styles.couponBlock}>
                <div className={styles.head}>
                    <h3>Coupon cho ban</h3>
                    <small>Copy ma khi checkout</small>
                </div>
                <div className={styles.couponGrid}>
                    {couponItems.map((item) => (
                        <article key={item.code} className={styles.couponCard}>
                            <strong>{item.code}</strong>
                            <span>{item.title}</span>
                            <p>{item.desc}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ShopCouponSection;
