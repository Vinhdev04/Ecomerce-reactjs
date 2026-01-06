import React from 'react'
import styles from './Compare.module.scss';
import { TfiReload } from "react-icons/tfi";
import HeaderSidebar from '@components/ContentSidebar/components/HeaderSidebar/HeaderSidebar.jsx';
function Compare() {
  const { reloadIcon,compareBox } = styles
  return (
    <div className={compareBox}>
      <HeaderSidebar title="Compare Product" icon={<TfiReload className={reloadIcon}/>} />
    </div>
  )
}

export default Compare
