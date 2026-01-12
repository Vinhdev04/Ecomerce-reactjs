import React from 'react'
import styles from './Compare.module.scss';
import { TfiReload } from "react-icons/tfi";
import HeaderSidebar from '@components/ContentSidebar/components/HeaderSidebar/HeaderSidebar.jsx';

function Compare() {
  const { reloadIcon,compareBox } = styles
  return (
    <div className={compareBox}>
      <HeaderSidebar title="Compare Product" icon={<TfiReload className={reloadIcon}/>} />
      <div className="d-flex flex-column justify-content-center align-items-center">
          <button className="mt-3 mb-2 btn btn-dark w-75">
                    View Compare
          </button>
          

          
      </div>
    </div>
  )
}

export default Compare
