import React,{useState,useEffect,useContext} from 'react';
import styles from './Header.module.scss';
import { icons, navItem } from './constant.js';
import NavIcon from './NavIcon/NavIcon.jsx';
import MenuItem from './MenuItem/MenuItem.jsx';
import useScrollHandling from '@hooks/useScrollHandling.js';
import classNames from 'classnames';
import { SideBarContext } from '@contexts/SideBarContext.js';
import { CartContext } from '@contexts/CartContext.js';


import { TfiReload } from "react-icons/tfi";
import { FaRegHeart, FaBars, FaTimes } from "react-icons/fa";
import { BsCart } from "react-icons/bs";

function Header() {
    const {
        containerBox,
        containerItem,
        containerHeader,
        leftGroup,
        rightGroup,
        navLinks,
        actionIcons,
        headerContent,
        titleBox,
        titleRow,
        logoFont,
        descLogo,
        container,
        topHeader,
        fixedXHeader,boxIcons,
        iconButton,
        cartBadge,
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
    const { totalQuantity } = useContext(CartContext);

    const handleShowSidebar = (type)=> {
        setIsOpen(true);
        setType(type);
        
    }

    useEffect(()=>{
        setFixedHeader(scrollPosition > 80);
    },[scrollPosition])
    useEffect(() => {
        const keyHandler = (e) => {
            if (e.key === 'Escape') setIsMobileMenuOpen(false);
        };
        document.addEventListener('keydown', keyHandler);
        if (isMobileMenuOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => {
            document.removeEventListener('keydown', keyHandler);
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);
    return (
        <div className={classNames(container,topHeader,{[fixedXHeader]:fixedHeader})}>
            <div className={containerHeader}>
                <div className={classNames(containerItem, leftGroup)}>
                    <FaBars className={hamburgerBtn} onClick={() => setIsMobileMenuOpen(true)} role="button" aria-label="Open menu" tabIndex={0} />
                    
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

                    <div className={classNames(containerItem, navLinks, desktopOnly)}>
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

                <div className={classNames(containerItem, rightGroup)}>
                    <div className={classNames(containerItem, navLinks, desktopOnly)}>
                        {navItem?.slice(3, navItem.length).map((item, idx) => {
                            return <MenuItem key={idx} title={item.title} href={item.href} setIsOpen={isOpen}/>;
                        })}
                    </div>
                    <div className={classNames(containerBox, actionIcons)} >
                        <TfiReload width={26} height={26} className={boxIcons} onClick={() => handleShowSidebar("compare")}/>
                        <FaRegHeart width={26} height={26} className={boxIcons} onClick={() => handleShowSidebar("favorites")}/>
                        <button
                            type="button"
                            className={iconButton}
                            onClick={() => handleShowSidebar("cart")}
                            aria-label={`Open cart${totalQuantity ? ` (${totalQuantity} items)` : ''}`}
                        >
                            <BsCart width={26} height={26} className={boxIcons}/>
                            {totalQuantity > 0 && (
                                <span className={cartBadge}>
                                    {totalQuantity > 99 ? '99+' : totalQuantity}
                                </span>
                            )}
                        </button>
                       
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={classNames(mobileMenu, { [styles.open]: isMobileMenuOpen })}>
                <div className={mobileMenuHeader}>
                    <span className={logoFont}>Menu</span>
                    <FaTimes className={closeBtn} onClick={() => setIsMobileMenuOpen(false)} role="button" aria-label="Close menu" tabIndex={0} />
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
