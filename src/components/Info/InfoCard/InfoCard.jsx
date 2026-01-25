import React from 'react';
import styles from '../Info.module.scss';

function InfoCard({ item }) {
    const { title, desc, src } = item;
    const { card, cardIcon, cardContent, cardTitle, cardDesc } = styles;

    return (
        <div className={card}>
            <div className={cardIcon}>
                <img
                    src={src}
                    alt={title}
                    width={42}
                    height={42}
                />
            </div>

            <div className={cardContent}>
                <h3 className={cardTitle}>{title}</h3>
                <p className={cardDesc}>{desc}</p>
            </div>
        </div>
    );
}

export default InfoCard;