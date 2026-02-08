import React,{useState,useEffect,useContext} from 'react';
import styles from './Header.module.scss';
import { icons, navItem } from './constant.js';
import NavIcon from './NavIcon/NavIcon.jsx';
import MenuItem from './MenuItem/MenuItem.jsx';
import useScrollHandling from '@hooks/useScrollHandling.js';
import classNames from 'classnames';
import { SideBarContext } from '@contexts/SideBarContext.js';


import { TfiReload } from "react-icons/tfi";
import { FaRegHeart, FaBars, FaTimes } from "react-icons/fa";
import { BsCart } from "react-icons/bs";

function Header() {
    const {
        containerBox,
        containerItem,
        containerHeader,

        headerContent,
        titleBox,
        titleRow,
        logoFont,
        descLogo,
        container,
        topHeader,
        fixedXHeader,boxIcons,
        hamburgerBtn,
        desktopOnly,
        mobileMenu,
        mobileMenuHeader,
        closeBtn,
        mobileMenuList,
        mobileSocials,
        mobileNavItem
    } = styles;

    const{scrollPosition} = useScrollHandling();
    const [fixedHeader,setFixedHeader] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const {isOpen,setIsOpen,setType} = useContext(SideBarContext);

    const handleShowSidebar = (type)=> {
        setIsOpen(true);
        setType(type);
        
    }

    useEffect(()=>{
        setFixedHeader(scrollPosition > 80);
    },[scrollPosition])
    return (
        <div className={classNames(container,topHeader,{[fixedXHeader]:fixedHeader})}>
            <div className={containerHeader}>
                <div className={containerItem}>
                    {/* Mobile Hamburger Button */}
                    <FaBars className={hamburgerBtn} onClick={() => setIsMobileMenuOpen(true)} />
                    
                    <div className={classNames(containerBox, desktopOnly)}>
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

                    <div className={classNames(containerItem, desktopOnly)}>
                        {navItem?.slice(0, 3).map((item, idx) => {
                            return <MenuItem key={idx} title={item.title} href={item.href} />;
                        })}
                    </div>
                </div>

                <div className={headerContent}>
                    <div className={titleBox}>
                        <span className={logoFont}>Premium GameXBox</span>

                        <div className={titleRow}>
                            <span className={descLogo}>Controllers & Gear</span>
                        </div>
                    </div>
                </div>

                <div className={containerItem}>
                    {' '}
                    <div className={classNames(containerItem, desktopOnly)}>
                        {navItem?.slice(3, navItem.length).map((item, idx) => {
                            return <MenuItem key={idx} title={item.title} href={item.href} setIsOpen={isOpen}/>;
                        })}
                    </div>
                    <div className={containerBox} >
                        <TfiReload width={26} height={26} className={boxIcons} onClick={() => handleShowSidebar("compare")}/>
                        <FaRegHeart width={26} height={26} className={boxIcons} onClick={() => handleShowSidebar("favorites")}/>   
                        <BsCart width={26} height={26} className={boxIcons} onClick={() => handleShowSidebar("cart")}/>
                       
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={classNames(mobileMenu, { [styles.open]: isMobileMenuOpen })}>
                <div className={mobileMenuHeader}>
                    <span className={logoFont}>Menu</span>
                    <FaTimes className={closeBtn} onClick={() => setIsMobileMenuOpen(false)} />
                </div>
                <div className={mobileMenuList}>
                    {navItem?.map((item, idx) => {
                        return (
                            <MenuItem 
                                key={idx} 
                                title={item.title} 
                                href={item.href} 
                                className={mobileNavItem}
                                onClick={() => setIsMobileMenuOpen(false)}
                            />
                        );
                    })}
                </div>
                <div className={mobileSocials}>
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
            </div>
        </div>
    );
}

export default Header;
