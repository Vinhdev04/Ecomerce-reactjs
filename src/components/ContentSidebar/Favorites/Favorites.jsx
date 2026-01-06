import React from 'react'
import styles from './Favorites.module.scss';
import HeaderSidebar from '@components/ContentSidebar/components/HeaderSidebar/HeaderSidebar.jsx';
import { FaRegHeart } from "react-icons/fa";
function Favorites() {
  const { favoritesBox,favoritesIcon } = styles
  return (
    <div className={favoritesBox}>
      <HeaderSidebar title="Favorites Product" icon={<FaRegHeart className={favoritesIcon}/>} />
    </div>
  )
}

export default Favorites
