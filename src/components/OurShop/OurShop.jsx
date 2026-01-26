import React from 'react'
import Layout from '@/components/Layout/Layout'
import styles from "./OurShop.module.scss"
import { Breadcrumb } from 'antd';
import { GoArrowLeft } from "react-icons/go";
import classNames from 'classnames';
import BannerShop from './BannerShop';


function OurShop() {
  const items = [
    { title: 'Home' },
    { title: 'Shop', href: '' },
  ];

  const {
    shopContainer,
    itemBreadcrumb,
    wrapHeader,btnReturn
    
  } = styles;

  return (
    <Layout>
      <div className={classNames(shopContainer, "container")}>
        {/* Header */}
        <div className={classNames(wrapHeader, "d-flex justify-content-between align-items-center")}>
          <Breadcrumb
            separator=">"
            items={items}
            className={itemBreadcrumb}
          />
          <button className={btnReturn}>
            <GoArrowLeft className='me-1'/>
            Return to pages
          </button>
        </div>
      <BannerShop/>
      </div>
    </Layout>
  )
}

export default OurShop