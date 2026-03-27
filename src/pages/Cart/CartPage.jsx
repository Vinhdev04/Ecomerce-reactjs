import React, { useContext } from 'react';
import Layout from '@/components/Layout/Layout';
import { CartContext } from '@contexts/CartContext.js';
import styles from './CartPage.module.scss';
import {
    FaCreditCard,
    FaMoneyBillWave,
    FaShieldAlt,
    FaTruck
} from 'react-icons/fa';

function CartPage() {
    const {
        cartItems,
        totalPrice,
        updateQuantity,
        removeFromCart
    } = useContext(CartContext);

    const shippingFee = cartItems.length > 0 ? 30000 : 0;
    const finalTotal = totalPrice + shippingFee;

    return (
        <Layout>
            <div className={styles.cartPage}>
                <div className="container">
                    <div className={styles.header}>
                        <h1>Giỏ hàng</h1>
                        <p>Xem lại sản phẩm và hoàn tất thanh toán.</p>
                    </div>

                    {cartItems.length === 0 ? (
                        <div className={styles.emptyState}>
                            <h3>Chưa có sản phẩm nào trong giỏ hàng</h3>
                            <p>Hãy quay lại shop và thêm sản phẩm bạn muốn mua.</p>
                        </div>
                    ) : (
                        <div className={styles.layout}>
                            <div className={styles.itemsPanel}>
                                {cartItems.map((item) => (
                                    <div key={item.id} className={styles.cartItem}>
                                        <img
                                            src={
                                                item.image ||
                                                'https://via.placeholder.com/120x120?text=Item'
                                            }
                                            alt={item.title}
                                            className={styles.thumb}
                                        />

                                        <div className={styles.itemBody}>
                                            <div className={styles.itemTop}>
                                                <div className={styles.itemHeading}>
                                                    <h3>{item.title}</h3>
                                                    <p className={styles.itemCaption}>
                                                        Hàng chính hãng, giao nhanh toàn quốc
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    className={styles.removeBtn}
                                                    onClick={() =>
                                                        removeFromCart(item.id)
                                                    }
                                                >
                                                    Xóa
                                                </button>
                                            </div>

                                            <p className={styles.price}>
                                                {item.price?.toLocaleString('vi-VN')}đ
                                            </p>

                                            <div className={styles.itemBottom}>
                                                <div className={styles.controls}>
                                                    <button
                                                        type="button"
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

                                                <div className={styles.lineTotal}>
                                                    Thành tiền:{' '}
                                                    <b>
                                                        {(
                                                            item.price * item.quantity
                                                        ).toLocaleString('vi-VN')}
                                                        đ
                                                    </b>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.summaryPanel}>
                                <h2>Tóm tắt đơn hàng</h2>
                                <div className={styles.trustList}>
                                    <div className={styles.trustItem}>
                                        <FaShieldAlt />
                                        <span>Bảo mật thanh toán</span>
                                    </div>
                                    <div className={styles.trustItem}>
                                        <FaTruck />
                                        <span>Giao hàng toàn quốc</span>
                                    </div>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Tạm tính</span>
                                    <b>{totalPrice.toLocaleString('vi-VN')}đ</b>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Phí vận chuyển</span>
                                    <b>{shippingFee.toLocaleString('vi-VN')}đ</b>
                                </div>
                                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                                    <span>Tổng cộng</span>
                                    <b>{finalTotal.toLocaleString('vi-VN')}đ</b>
                                </div>

                                <form className={styles.checkoutForm}>
                                    <h3>Thông tin thanh toán</h3>
                                    <input type="text" placeholder="Họ và tên" />
                                    <input type="text" placeholder="Số điện thoại" />
                                    <input type="email" placeholder="Email" />
                                    <textarea
                                        rows="4"
                                        placeholder="Địa chỉ giao hàng"
                                    ></textarea>
                                    <div className={styles.paymentMethods}>
                                        <label className={styles.paymentOption}>
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                defaultChecked
                                            />
                                            <span>
                                                <FaMoneyBillWave />
                                                Thanh toán khi nhận hàng
                                            </span>
                                        </label>
                                        <label className={styles.paymentOption}>
                                            <input type="radio" name="payment_method" />
                                            <span>
                                                <FaCreditCard />
                                                Thẻ ATM / Visa / MasterCard
                                            </span>
                                        </label>
                                        <label className={styles.paymentOption}>
                                            <input type="radio" name="payment_method" />
                                            <span>Ví điện tử Momo / ZaloPay</span>
                                        </label>
                                        <label className={styles.paymentOption}>
                                            <input type="radio" name="payment_method" />
                                            <span>Chuyển khoản ngân hàng</span>
                                        </label>
                                    </div>
                                    <button type="button" className={styles.checkoutBtn}>
                                        Thanh toán
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default CartPage;
