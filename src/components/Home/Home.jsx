import React, { Suspense, lazy, useRef } from 'react';
import Banner from '@components/Banner/Banner.jsx';
import Heading from '@/components/Heading/Heading';
import Info from '@/components/Info/Info';
import Layout from '@/components/Layout/Layout';
import useSectionReveal from '@/hooks/useSectionReveal';
import styles from './Home.module.scss';

const HomeListProduct = lazy(() => import('@/components/HomeListProduct/HomeListProduct'));
const BannerHome = lazy(() => import('@/components/BannerHome/BannerHome'));

function Home() {
    const shellRef = useRef(null);
    useSectionReveal(shellRef);

    return (
        <Layout>
            <div ref={shellRef} className={styles.homeShell}>
                <section className={`${styles.heroStage} ${styles.reveal}`} data-visible="true">
                    <Banner />
                </section>

                <section className={`${styles.sectionStage} ${styles.infoStage} ${styles.reveal}`} data-reveal>
                    <div className="container">
                        <Info />
                    </div>
                </section>

                <section className={`${styles.sectionStage} ${styles.productStage} ${styles.reveal}`} data-reveal>
                    <Heading />
                    <Suspense fallback={<div className={styles.sectionSkeleton} aria-hidden="true" />}>
                        <HomeListProduct />
                    </Suspense>
                </section>

                <section className={`${styles.sectionStage} ${styles.spotlightStage} ${styles.reveal}`} data-reveal>
                    <Suspense fallback={<div className={styles.sectionSkeleton} aria-hidden="true" />}>
                        <BannerHome />
                    </Suspense>
                </section>
            </div>
        </Layout>
    );
}

export default Home;
