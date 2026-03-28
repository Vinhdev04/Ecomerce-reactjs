import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import styles from '../Header.module.scss';
import { SideBarContext } from '@contexts/SideBarContext.js';
import { UserInfoContext } from '@contexts/UserInfoContext.js';

function MenuItem({ title, href, className, onClick }) {
    const { navItem, subMenu, accountItem, accountLabel } = styles;
    const { setIsOpen, setType } = useContext(SideBarContext);
    const { userInfo, handleLogout, isLoading } = useContext(UserInfoContext);
    const [isShowSubMenu, setIsShowSubMenu] = useState(false);
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) onClick();

        if (title === 'Sign in') {
            if (!userInfo) {
                setIsOpen(true);
                setType('login');
            } else {
                setIsShowSubMenu((prev) => !prev);
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
            const displayName =
                userInfo.name || userInfo.email?.split('@')[0] || 'User';

            return (
                <span className={accountLabel} title={displayName}>
                    {`Hello: ${displayName}`}
                </span>
            );
        }

        return 'Sign in';
    };

    return (
        <div
            className={classNames(navItem, className, {
                [accountItem]: title === 'Sign in' && userInfo
            })}
            onClick={handleClick}
        >
            {getDisplayText()}

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
