import React, { useState, useEffect } from 'react';
import styles from './BackToTop.module.scss';
import { useContext } from 'react';
import { SideBarContext } from '@contexts/SideBarContext.js';

function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);
    const { isOpen } = useContext(SideBarContext);

    // Theo dõi vị trí scroll
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    // Cuộn lên đầu trang
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <>
            {isVisible && !isOpen && (
                <button 
                    className={styles.backToTop}
                    onClick={scrollToTop}
                    aria-label="Back to top"
                >
                    <i className="fas fa-chevron-up"></i>
                </button>
            )}
        </>
    );
}

export default BackToTop;
