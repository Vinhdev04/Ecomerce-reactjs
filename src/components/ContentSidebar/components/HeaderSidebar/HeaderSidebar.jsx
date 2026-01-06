import React from 'react'
import styles from './HeaderSidebar.module.scss'
import ProductItem from '@components/ContentSidebar/components/ProductItem/ProductItem.jsx';

function HeaderSidebar({title,icon}) {
    const { headerSidebar,wrapBox,headerTitle } = styles
  return (
    <div className={headerSidebar}>
      <div className={wrapBox}>
       {icon}
        <h4 className={headerTitle}>{title}</h4>
        </div>

        <ProductItem/>
    </div>
  )
}

export default HeaderSidebar
