import React from 'react';
import styles from './Header.module.scss';
import { icons, navItem } from './constant.js';
import NavIcon from './NavIcon/NavIcon.jsx';
import MenuItem from './MenuItem/MenuItem.jsx';
import logo from '@icons/images/logos.png';
import cart from '@icons/svg/cart.svg';
import reload from '@icons/svg/reload.svg';
import heart from '@icons/svg/heart.svg';
function Header() {
    const { containerBox, containerItem, containerHeader, navLogo } = styles;
    return (
        <div className={containerHeader}>
            <div className={containerItem}>
                <div className={containerBox}>
                    {icons?.map((item, idx) => {
                        return (
                            <NavIcon
                                key={idx}
                                href={item.href}
                                type={item.type}
                            />
                        );
                    })}
                </div>

                <div className={containerItem}>
                    {navItem?.slice(0, 3).map((item, idx) => {
                        return <MenuItem key={idx} title={item.title} />;
                    })}
                </div>
            </div>

            <div className=''>
                <img src={logo} alt='logo' className={navLogo} />
            </div>

            <div className={containerItem}>
                {' '}
                <div className={containerItem}>
                    {navItem?.slice(3, navItem.length).map((item, idx) => {
                        return <MenuItem key={idx} title={item.title} />;
                    })}
                </div>
                <div className={containerBox}>
                    <img src={reload} width={26} height={26} />
                    <img src={heart} width={26} height={26} />
                    <img src={cart} width={26} height={26} />
                </div>
            </div>
        </div>
    );
}

export default Header;
