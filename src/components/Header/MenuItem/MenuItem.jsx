import React, { useContext } from 'react';
import styles from '../Header.module.scss';
import { SideBarContext } from '@contexts/SideBarContext.js';
function MenuItem({ title, href }) {
    const { navItem } = styles;
    const {setIsOpen,setType} = useContext(SideBarContext);

    const handleShowLogin = () => {
       if(title === 'Sign in'){
        setIsOpen(true);
        setType('login');
       }

    }
    return <div className={navItem} onClick={handleShowLogin }>{title}</div>;
}

export default MenuItem;
