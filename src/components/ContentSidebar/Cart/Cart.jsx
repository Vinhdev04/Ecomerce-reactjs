import React from 'react'
import styles from './Cart.module.scss';
import { BsCart } from "react-icons/bs";
import HeaderSidebar from '@components/ContentSidebar/components/HeaderSidebar/HeaderSidebar.jsx';

function Cart() {
  const { cartIcon,cartBox } = styles
  return (
    <div className={cartBox}>
        <HeaderSidebar title="Cart Product" icon={<BsCart className={cartIcon}/>} />
    </div>
  )
}

export default Cart
