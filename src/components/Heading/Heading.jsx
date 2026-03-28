import React from 'react';
import styles from './Heading.module.scss';

function Heading() {
    const { containerX, containerBox, title, desc, headline } = styles;

    return (
        <div className={containerX}>
            <div className={headline}></div>
            <div className={containerBox}>
                <p className={desc}>Do not miss this super offer</p>
                <h6 className={title}>Our Best Products</h6>
            </div>
            <div className={headline}></div>
        </div>
    );
}

export default Heading;
