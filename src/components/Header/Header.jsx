import React,{useState,useEffect,useContext} from 'react';
import styles from './Header.module.scss';
import { icons, navItem } from './constant.js';
import NavIcon from './NavIcon/NavIcon.jsx';
import MenuItem from './MenuItem/MenuItem.jsx';
import useScrollHandling from '@hooks/useScrollHandling.js';
import classNames from 'classnames';
import { SideBarContext } from '@contexts/SideBarContext.js';


import { TfiReload } from "react-icons/tfi";
import { FaRegHeart } from "react-icons/fa";
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
        fixedXHeader,boxIcons
    } = styles;

    const{scrollPosition} = useScrollHandling();
    const [fixedHeader,setFixedHeader] = useState(false);
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
                    <div className={containerItem}>
                        {navItem?.slice(3, navItem.length).map((item, idx) => {
                            return <MenuItem key={idx} title={item.title} setIsOpen={isOpen}/>;
                        })}
                    </div>
                    <div className={containerBox} >
                        <TfiReload width={26} height={26} className={boxIcons} onClick={() => handleShowSidebar("compare")}/>
                        <FaRegHeart width={26} height={26} className={boxIcons} onClick={() => handleShowSidebar("favorites")}/>   
                        <BsCart width={26} height={26} className={boxIcons} onClick={() => handleShowSidebar("cart")}/>
                       
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
