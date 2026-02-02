import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Header.module.scss';
import { SideBarContext } from '@contexts/SideBarContext.js';
import { UserInfoContext } from "@contexts/UserInfoContext.js";

function MenuItem({ title, href }) {
    const { navItem, subMenu } = styles;
    const { setIsOpen, setType } = useContext(SideBarContext);
    const { userInfo, handleLogout, isLoading } = useContext(UserInfoContext);
    const [isShowSubMenu, setIsShowSubMenu] = useState(false);
    const navigate = useNavigate();

    const handleClick = () => {
        if (title === 'Sign in') {
            if (!userInfo) {
                // Chưa login -> Mở sidebar login
                setIsOpen(true);
                setType('login');
            } else {
              
                setIsShowSubMenu(!isShowSubMenu);
            }
        } else if (href) {
            navigate(href);
        }
    };

  
    const onLogout = (e) => {
        e.stopPropagation(); 
        handleLogout();
    };

  
    const getDisplayText = () => {
        if (title !== 'Sign in') {
            return title;
        }

        if (isLoading) {
            return 'Loading...';
        }

        if (userInfo) {
            //  Hiển thị tên user từ userInfo object
            return <b>{`Hello: ${userInfo.name || userInfo.email?.split('@')[0] || 'User'}`}</b>;
        }

        return 'Sign in';
    };

    return (
        <div className={navItem} onClick={handleClick}>
            {getDisplayText()}

            {/* SUBMENU - CHỈ HIỂN THỊ KHI ĐÃ LOGIN */}
            {isShowSubMenu && userInfo && (
                <div 
                    className={subMenu} 
                    onMouseLeave={() => setIsShowSubMenu(false)}
                >
                    <div onClick={onLogout} style={{ cursor: 'pointer' }}>
                        Log out
                    </div>
                </div>
            )}
        </div>
    );
}

export default MenuItem;