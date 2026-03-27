import React from 'react';
import styles from '../Header.module.scss';
import { FaTiktok } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';
import { FaFacebook } from 'react-icons/fa';

function NavIcon({ type, href }) {
  const { navIcons } = styles;
  const handleShowIcon = (type) => {
    switch (type) {
      case 'fb':
        return <FaFacebook />;
      case 'ins':
        return <FaInstagram />;
      case 'tiktok':
        return <FaTiktok />;
      default:
        throw new Error('Error when render icon');
    }
  };
  return (
    <a className={navIcons} href={href} target="_blank" rel="noreferrer noopener" aria-label={type}>
      {handleShowIcon(type)}
    </a>
  );
}

export default NavIcon;
