import React from 'react';
import styles from '../Info.module.scss';

function InfoCard({ item }) {
    const { title, desc, src } = item;
    const { card } = styles;

    return (
        <div
            className={`${card} p-3 rounded-3 border  d-flex align-items-center gap-3 shadow-sm`}
        >
            <img
                src={src}
                alt={title}
                width={38}
                height={38}
                className='rounded'
            />

            <div className='d-flex flex-column'>
                <p className='mb-1 fw-semibold fs-6'>{title}</p>
                <span className='text-muted fs-6'>{desc}</span>
            </div>
        </div>
    );
}

export default InfoCard;
