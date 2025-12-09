import React from 'react';
import styles from './Info.module.scss';
import Layout from '@components/Layout/Layout';
import InfoCard from './InfoCard/InfoCard';
import data from './const.js';

function Info() {
    return (
        <Layout>
            <div className={styles.containerBox}>
                {data?.map((item) => (
                    <InfoCard key={item.title} item={item} />
                ))}
            </div>
        </Layout>
    );
}

export default Info;
