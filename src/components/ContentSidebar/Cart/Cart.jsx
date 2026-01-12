import React from 'react'
import styles from './Cart.module.scss';
import { BsCart } from "react-icons/bs";
import HeaderSidebar from '@components/ContentSidebar/components/HeaderSidebar/HeaderSidebar.jsx';

function Cart() {
  const { cartIcon,cartBox,total } = styles
  return (
    <div className={cartBox}>
        <HeaderSidebar title="Cart Product" icon={<BsCart className={cartIcon}/>} />
       
         <div className="d-flex flex-column justify-content-center align-items-center">
          <div className={total}>
            <h6 className=''>Total: <b>160$</b></h6>
          </div>
          
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

export default Cart
