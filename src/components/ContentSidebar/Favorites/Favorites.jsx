import React from 'react'
import styles from './Favorites.module.scss';
import HeaderSidebar from '@components/ContentSidebar/components/HeaderSidebar/HeaderSidebar.jsx';
import { FaRegHeart } from "react-icons/fa";
function Favorites() {
  const { favoritesBox,favoritesIcon } = styles
  return (
    <div className={favoritesBox}>
      <HeaderSidebar title="Favorites Product" icon={<FaRegHeart className={favoritesIcon}/>} />
      <div className="d-flex flex-column justify-content-center align-items-center">
          <button className="mt-3 mb-2 btn btn-dark w-75">
                    View Compare
          </button>
          <button className="mb-2 btn btn-primary w-75">
                   Add To Cart
          </button>

          
      </div>
    </div>
  )
}

export default Favorites
