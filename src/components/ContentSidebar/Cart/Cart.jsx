import React, { useContext } from 'react';
import styles from './Cart.module.scss';
import { BsCart } from 'react-icons/bs';
import HeaderSidebar from '@components/ContentSidebar/components/HeaderSidebar/HeaderSidebar.jsx';
import { CartContext } from '@contexts/CartContext.js';
import { useNavigate } from 'react-router-dom';
import { SideBarContext } from '@contexts/SideBarContext.js';

function Cart() {
    const {
        cartIcon,
        cartBox,
        total,
        cartList,
        cartItem,
        productThumb,
        itemInfo,
        itemTitle,
        itemMeta,
        quantityControls,
        qtyBtn,
        removeBtn,
        emptyState,
        actionGroup
    } = styles;

    const {
        cartItems,
        totalPrice,
        updateQuantity,
        removeFromCart,
        clearCart
    } = useContext(CartContext);
    const { setIsOpen } = useContext(SideBarContext);
    const navigate = useNavigate();

    const handleOpenCartPage = () => {
        setIsOpen(false);
        navigate('/cart');
    };

    return (
        <div className={cartBox}>
            <HeaderSidebar
                title="Cart Product"
                icon={<BsCart className={cartIcon} />}
            />

            {cartItems.length === 0 ? (
                <div className={emptyState}>
                    <p>Giỏ hàng của bạn đang trống.</p>
                </div>
            ) : (
                <>
                    <div className={cartList}>
                        {cartItems.map((item) => (
                            <div key={item.id} className={cartItem}>
                                <img
                                    src={
                                        item.image ||
                                        'https://via.placeholder.com/80x80?text=Item'
                                    }
                                    alt={item.title}
                                    className={productThumb}
                                />

                                <div className={itemInfo}>
                                    <h6 className={itemTitle}>{item.title}</h6>
                                    <p className={itemMeta}>
                                        {item.price?.toLocaleString('vi-VN')}đ
                                    </p>

                                    <div className={quantityControls}>
                                        <button
                                            type="button"
                                            className={qtyBtn}
                                            onClick={() =>
                                                updateQuantity(
                                                    item.id,
                                                    item.quantity - 1
                                                )
                                            }
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            type="button"
                                            className={qtyBtn}
                                            onClick={() =>
                                                updateQuantity(
                                                    item.id,
                                                    item.quantity + 1
                                                )
                                            }
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        className={removeBtn}
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={total}>
                        <h6>Tổng tiền:</h6>
                        <b>{totalPrice.toLocaleString('vi-VN')}đ</b>
                    </div>

                    <div className={actionGroup}>
                        <button
                            className="mb-2 btn btn-outline-dark w-100"
                            type="button"
                            onClick={handleOpenCartPage}
                        >
                            Xem giỏ hàng
                        </button>
                        <button
                            className="mb-2 btn btn-primary w-100"
                            type="button"
                            onClick={clearCart}
                        >
                            Xóa tất cả
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;
