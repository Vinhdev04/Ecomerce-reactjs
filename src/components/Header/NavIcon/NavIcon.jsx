import React from 'react';
import fb from '@icons/svg/facebook.svg';
import ins from '@icons/svg/instagram.svg';
import tiktok from '@icons/svg/tiktok.svg';
import styles from '../Header.module.scss';
function NavIcon({ type, href }) {
    const { navIcons } = styles;
    const handleShowIcon = (type) => {
        switch (type) {
            case 'fb':
                return fb;
            case 'ins':
                return ins;
            case 'tiktok':
                return tiktok;
            default:
                throw new Error('Error when render icon');
        }
    };
    return (
        <div className={navIcons}>
            <img src={handleShowIcon(type)} alt={type} />
        </div>
    );
}

export default NavIcon;
