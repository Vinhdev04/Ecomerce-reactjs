import React from 'react';
import styles from '../Header.module.scss';

function MenuItem({ title, href }) {
    const { navItem } = styles;
    return <div className={navItem}>{title}</div>;
}

export default MenuItem;
