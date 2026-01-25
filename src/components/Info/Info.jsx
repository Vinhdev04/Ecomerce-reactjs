import React from 'react';
import styles from './Info.module.scss';
import InfoCard from './InfoCard/InfoCard';
import data from './const.js';

function Info() {
    return (
        <div className={styles.containerBox}>
            {data?.map((item) => (
                <InfoCard key={item.title} item={item} />
            ))}
        </div>
    );
}

export default Info;