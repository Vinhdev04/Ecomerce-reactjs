import React, { useContext, useMemo, useState } from 'react';
import Layout from '@/components/Layout/Layout';
import { CartContext } from '@contexts/CartContext.js';
import { ToastContext } from '@contexts/ToastContext';
import styles from './CartPage.module.scss';
import {
    FaCreditCard,
    FaMoneyBillWave,
    FaShieldAlt,
    FaTruck,
    FaUniversity,
    FaQrcode
} from 'react-icons/fa';
import { SiZalo, SiVisa } from 'react-icons/si';

const BANK_ACCOUNT = {
    bankCode: 'MB',
    bankName: 'MB Bank',
    accountName: 'PHAM CONG VINH',
    accountNumber: '02969904011210'
};

const WALLET_ACCOUNT = {
    provider: 'Momo / ZaloPay',
    owner: 'PHAM CONG VINH',
    phone: '0909040404'
};

const PAYMENT_OPTIONS = [
    {
        id: 'cod',
        label: 'Thanh toán khi nhận hàng',
        icon: <FaMoneyBillWave />,
        helper: 'Bạn thanh toán trực tiếp với đơn vị giao hàng khi nhận sản phẩm.',
        buttonLabel: 'Đặt hàng COD',
        fee: 0
    },
    {
        id: 'card',
        label: 'Thẻ ATM / Visa / MasterCard',
        icon: <FaCreditCard />,
        helper: 'Hỗ trợ thanh toán bằng thẻ nội địa và thẻ quốc tế bảo mật 3D Secure.',
        buttonLabel: 'Thanh toán bằng thẻ',
        fee: 15000
    },
    {
        id: 'wallet',
        label: 'Ví điện tử Momo / ZaloPay',
        icon: <SiZalo />,
        helper: 'Nhập số điện thoại ví điện tử để tiếp tục xác nhận thanh toán.',
        buttonLabel: 'Thanh toán bằng ví',
        fee: 5000
    },
    {
        id: 'bank',
        label: 'Chuyển khoản ngân hàng',
        icon: <FaUniversity />,
        helper: 'Bạn sẽ nhận được thông tin tài khoản ngân hàng ngay sau khi xác nhận.',
        buttonLabel: 'Xác nhận chuyển khoản',
        fee: 0
    }
];

const INITIAL_FORM = {
    fullName: '',
    phone: '',
    email: '',
    address: '',
    cardName: '',
    cardNumber: '',
    walletPhone: ''
};

function CartPage() {
    const { cartItems, totalPrice, updateQuantity, removeFromCart, clearCart } =
        useContext(CartContext);
    const { toast } = useContext(ToastContext);
    const [selectedPayment, setSelectedPayment] = useState('cod');
    const [formData, setFormData] = useState(INITIAL_FORM);

    const selectedPaymentOption = useMemo(
        () =>
            PAYMENT_OPTIONS.find((option) => option.id === selectedPayment) ||
            PAYMENT_OPTIONS[0],
        [selectedPayment]
    );

    const shippingFee = cartItems.length > 0 ? 30000 : 0;
    const paymentFee = cartItems.length > 0 ? selectedPaymentOption.fee : 0;
    const finalTotal = totalPrice + shippingFee + paymentFee;
    const orderCode = useMemo(
        () => `XPAD-${Date.now().toString().slice(-6)}`,
        []
    );
    const bankQrUrl = useMemo(() => {
        const amount = finalTotal > 0 ? `&amount=${finalTotal}` : '';
        const addInfo = encodeURIComponent(`Thanh toan ${orderCode}`);
        const accountName = encodeURIComponent(BANK_ACCOUNT.accountName);

        return `https://img.vietqr.io/image/${BANK_ACCOUNT.bankCode}-${BANK_ACCOUNT.accountNumber}-compact2.png?addInfo=${addInfo}&accountName=${accountName}${amount}`;
    }, [finalTotal, orderCode]);
    const walletQrUrl = useMemo(() => {
        const walletPayload = [
            WALLET_ACCOUNT.provider,
            WALLET_ACCOUNT.owner,
            WALLET_ACCOUNT.phone,
            `So tien ${finalTotal} VND`,
            `Noi dung ${orderCode}`
        ].join(' | ');

        return `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(
            walletPayload
        )}`;
    }, [finalTotal, orderCode]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateCheckout = () => {
        if (!formData.fullName.trim()) {
            return 'Vui lòng nhập họ và tên.';
        }

        if (!formData.phone.trim()) {
            return 'Vui lòng nhập số điện thoại.';
        }

        if (!formData.address.trim()) {
            return 'Vui lòng nhập địa chỉ giao hàng.';
        }

        if (selectedPayment === 'card') {
            if (!formData.cardName.trim()) {
                return 'Vui lòng nhập tên chủ thẻ.';
            }

            if (formData.cardNumber.replace(/\s/g, '').length < 8) {
                return 'Số thẻ chưa hợp lệ.';
            }
        }

        if (selectedPayment === 'wallet' && !formData.walletPhone.trim()) {
            return 'Vui lòng nhập số điện thoại ví điện tử.';
        }

        return '';
    };

    const handleCheckout = () => {
        const errorMessage = validateCheckout();

        if (errorMessage) {
            toast?.error?.(errorMessage);
            return;
        }

        const methodName = selectedPaymentOption.label.toLowerCase();
        toast?.success?.(
            `Đơn hàng đã được xác nhận với hình thức ${methodName}.`
        );
        clearCart();
        setFormData(INITIAL_FORM);
        setSelectedPayment('cod');
    };

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
                            <div
                                className={styles.itemsPanel}
                                data-motion-static="true"
                            >
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className={styles.cartItem}
                                        data-motion-static="true"
                                    >
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
                                                        Hàng chính hãng, giao
                                                        nhanh toàn quốc
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

                                            <div className={styles.purchaseRow}>
                                                <p className={styles.price}>
                                                    {item.price?.toLocaleString(
                                                        'vi-VN'
                                                    )}
                                                    đ
                                                </p>

                                                <div
                                                    className={styles.lineTotal}
                                                >
                                                    <span>Thành tiền</span>
                                                    <b>
                                                        {(
                                                            item.price *
                                                            item.quantity
                                                        ).toLocaleString(
                                                            'vi-VN'
                                                        )}
                                                        đ
                                                    </b>
                                                </div>
                                            </div>

                                            <div className={styles.itemBottom}>
                                                <div
                                                    className={styles.controls}
                                                    data-motion-static="true"
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.id,
                                                                item.quantity -
                                                                    1
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
                                                                item.quantity +
                                                                    1
                                                            )
                                                        }
                                                    >
                                                        +
                                                    </button>
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
                                <div className={styles.summaryRow}>
                                    <span>Phí thanh toán</span>
                                    <b>{paymentFee.toLocaleString('vi-VN')}đ</b>
                                </div>
                                <div
                                    className={`${styles.summaryRow} ${styles.totalRow}`}
                                >
                                    <span>Tổng cộng</span>
                                    <b>{finalTotal.toLocaleString('vi-VN')}đ</b>
                                </div>

                                <form
                                    className={styles.checkoutForm}
                                    onSubmit={(event) => event.preventDefault()}
                                >
                                    <h3>Thông tin thanh toán</h3>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder="Họ và tên"
                                    />
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="Số điện thoại"
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Email"
                                    />
                                    <textarea
                                        rows="4"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Địa chỉ giao hàng"
                                    />
                                    <div className={styles.paymentMethods}>
                                        {PAYMENT_OPTIONS.map((option) => (
                                            <label
                                                key={option.id}
                                                className={styles.paymentOption}
                                            >
                                                <input
                                                    type="radio"
                                                    name="payment_method"
                                                    value={option.id}
                                                    checked={
                                                        selectedPayment ===
                                                        option.id
                                                    }
                                                    onChange={() =>
                                                        setSelectedPayment(
                                                            option.id
                                                        )
                                                    }
                                                />
                                                <span>
                                                    {option.icon}
                                                    {option.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>

                                    <div
                                        className={styles.paymentInfo}
                                        data-motion-static="true"
                                    >
                                        <div className={styles.paymentHeader}>
                                            {selectedPayment === 'card' ? (
                                                <SiVisa />
                                            ) : (
                                                selectedPaymentOption.icon
                                            )}
                                            <div>
                                                <strong>
                                                    {selectedPaymentOption.label}
                                                </strong>
                                                <p>
                                                    {selectedPaymentOption.helper}
                                                </p>
                                            </div>
                                        </div>

                                        {selectedPayment === 'card' && (
                                            <div
                                                className={
                                                    styles.paymentFieldGroup
                                                }
                                            >
                                                <input
                                                    type="text"
                                                    name="cardName"
                                                    value={formData.cardName}
                                                    onChange={handleInputChange}
                                                    placeholder="Tên chủ thẻ"
                                                />
                                                <input
                                                    type="text"
                                                    name="cardNumber"
                                                    value={formData.cardNumber}
                                                    onChange={handleInputChange}
                                                    placeholder="Số thẻ"
                                                />
                                            </div>
                                        )}

                                        {selectedPayment === 'wallet' && (
                                            <div
                                                className={
                                                    styles.paymentFieldGroup
                                                }
                                            >
                                                <input
                                                    type="text"
                                                    name="walletPhone"
                                                    value={formData.walletPhone}
                                                    onChange={handleInputChange}
                                                    placeholder="Số điện thoại ví"
                                                />
                                                <div className={styles.qrPanel}>
                                                    <div
                                                        className={
                                                            styles.qrPreview
                                                        }
                                                    >
                                                        <img
                                                            src={walletQrUrl}
                                                            alt="QR thanh toán ví điện tử"
                                                        />
                                                    </div>
                                                    <div
                                                        className={
                                                            styles.qrMeta
                                                        }
                                                    >
                                                        <div
                                                            className={
                                                                styles.qrBadge
                                                            }
                                                        >
                                                            <FaQrcode />
                                                            Mã QR ví điện tử
                                                        </div>
                                                        <strong>
                                                            {WALLET_ACCOUNT.provider}
                                                        </strong>
                                                        <span>
                                                            Người nhận:{' '}
                                                            {
                                                                WALLET_ACCOUNT.owner
                                                            }
                                                        </span>
                                                        <span>
                                                            Số điện thoại:{' '}
                                                            {
                                                                WALLET_ACCOUNT.phone
                                                            }
                                                        </span>
                                                        <span>
                                                            Số tiền:{' '}
                                                            {finalTotal.toLocaleString(
                                                                'vi-VN'
                                                            )}
                                                            đ
                                                        </span>
                                                        <span>
                                                            Nội dung: {orderCode}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {selectedPayment === 'bank' && (
                                            <div className={styles.bankBox}>
                                                <div className={styles.qrPanel}>
                                                    <div
                                                        className={
                                                            styles.qrPreview
                                                        }
                                                    >
                                                        <img
                                                            src={bankQrUrl}
                                                            alt="QR chuyển khoản ngân hàng"
                                                        />
                                                    </div>
                                                    <div
                                                        className={
                                                            styles.qrMeta
                                                        }
                                                    >
                                                        <div
                                                            className={
                                                                styles.qrBadge
                                                            }
                                                        >
                                                            <FaQrcode />
                                                            VietQR ngân hàng
                                                        </div>
                                                        <strong>
                                                            {
                                                                BANK_ACCOUNT.bankName
                                                            }
                                                        </strong>
                                                        <span>
                                                            Chủ tài khoản:{' '}
                                                            {
                                                                BANK_ACCOUNT.accountName
                                                            }
                                                        </span>
                                                        <span>
                                                            Số tài khoản:{' '}
                                                            {
                                                                BANK_ACCOUNT.accountNumber
                                                            }
                                                        </span>
                                                        <span>
                                                            Số tiền:{' '}
                                                            {finalTotal.toLocaleString(
                                                                'vi-VN'
                                                            )}
                                                            đ
                                                        </span>
                                                        <span>
                                                            Nội dung: {orderCode}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        className={styles.checkoutBtn}
                                        onClick={handleCheckout}
                                    >
                                        {selectedPaymentOption.buttonLabel}
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
