import React from 'react';
import styles from './ProductItem.module.scss';
import classNames from 'classnames';
import { IoClose } from "react-icons/io5"; // Import icon

function ProductItem() {
  const { 
    productItemBox, cardStyle, imgWrapper, imgStyle, 
    contentInfo, cardTitle, cardText, badgePrice, closeIcon 
  } = styles;

  const handleCloseItem = (e) => {
     // Ngăn sự kiện click lan ra card
      e.stopPropagation();
      console.log('Close item clicked');
  };
  return (
    <div className={productItemBox}>
      <div className={classNames('card', cardStyle)}>
      
        <div className={closeIcon} onClick={handleCloseItem}>
          <IoClose />
        </div>

        <div className={imgWrapper}>
          <img 
            src='https://ncarb.github.io/bootstrap/assets/img/bootstrap-stack.png' 
            className={imgStyle} 
            alt='product' 
          />
        </div>
        
        <div className={contentInfo}>
          <h5 className={cardTitle}>Prisma ORM Guide</h5>
          <p className={cardText}>
            Tối ưu hóa truy vấn database cho hệ thống lớn...
          </p>
          <span className={badgePrice}>
            $10.00
          </span>
          <span className={badgePrice}>
            Size: M
          </span>
          <span className={badgePrice}>
            Qty: 1
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProductItem;