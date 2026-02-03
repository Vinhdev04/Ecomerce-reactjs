import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { FaPhoneAlt, FaFacebookMessenger, FaTimes } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';
import styles from './ContactModal.module.scss';

const cx = classNames.bind(styles);

const ContactModal = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={cx('contactWrapper')}>
            {/* Popup Menu */}
            <div className={cx('popup', { open: isOpen })}>
                <a href="https://m.me/yourpage" target="_blank" rel="noopener noreferrer" className={cx('popupItem')}>
                    <div className={cx('icon', 'messenger')}>
                        <FaFacebookMessenger />
                    </div>
                    <span>Chat Messenger</span>
                </a>
                
                <a href="https://zalo.me/yourzalo" target="_blank" rel="noopener noreferrer" className={cx('popupItem')}>
                    <div className={cx('icon', 'zalo')}>
                        <SiZalo />
                    </div>
                    <span>Chat Zalo</span>
                </a>

                <a href="tel:0123456789" className={cx('popupItem')}>
                    <div className={cx('icon', 'phone')}>
                        <FaPhoneAlt />
                    </div>
                    <span>0123.456.789</span>
                </a>
            </div>

            {/* Main Toggle Button */}
            <button 
                className={cx('mainButton', { active: isOpen })} 
                onClick={toggleOpen}
                aria-label="Liên hệ"
            >
                {isOpen ? <FaTimes /> : <FaPhoneAlt />}
            </button>
            
            {!isOpen && <div className={cx('tooltip')}>Liên hệ</div>}
        </div>
    );
};

export default ContactModal;
