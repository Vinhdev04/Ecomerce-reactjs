import React from 'react'
import Layout from '@/components/Layout/Layout'
import styles from "./OurShop.module.scss"
import { Breadcrumb } from 'antd';
import { GoArrowLeft } from "react-icons/go";
import classNames from 'classnames';
import BannerShop from './components/BannerShop';
import { useNavigate } from 'react-router-dom';
import { OurShopProvider } from '@/contexts/OurShopProvider';
import FilterProduct from '@components/OurShop/components/FilterProduct';
import ProductList from '@components/ProductList/ProductList';

function OurShop() {
  const items = [
    { title: 'Home' },
    { title: 'Shop', href: '' },
  ];
  
  const navigate = useNavigate();
  const {
    shopContainer,
    itemBreadcrumb,
    wrapHeader,btnReturn
    
  } = styles;
  

  
  return (
    <OurShopProvider>
        <Layout>
          <div className={classNames(shopContainer, "container")}>

            <div className={classNames(wrapHeader, "d-flex justify-content-between align-items-center")}>
              <Breadcrumb
                separator=">"
                items={items}
                className={itemBreadcrumb}
              />
              <button className={btnReturn} onClick={() => navigate(-1)}>
                <GoArrowLeft className='me-1'/>
                Return to pages
              </button>
            </div>
            
            <BannerShop/>
            
     
           
          
           <FilterProduct/>
       
            
          </div>
        </Layout>
      </OurShopProvider>
  )
}

export default OurShop