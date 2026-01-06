import React, { useContext } from 'react';
import styles from '../Header.module.scss';
import { SideBarContext } from '@contexts/SideBarContext.js';
function MenuItem({ title, href }) {
    const { navItem } = styles;
    const {setIsOpen} = useContext(SideBarContext);
    return <div className={navItem} onClick={()=>setIsOpen(true)}>{title}</div>;
}

export default MenuItem;
