import React, { useContext, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Layout from '@/components/Layout/Layout';
import orderService from '@api/orderService';
import { CartContext } from '@contexts/CartContext.js';
import { ToastContext } from '@contexts/ToastContext';
import { UserInfoContext } from '@contexts/UserInfoContext.js';
import { SideBarContext } from '@contexts/SideBarContext.js';
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

const PAYMENT_LOCK_KEY = 'xpad-checkout-active-lock';
const PAYMENT_RECENT_KEY = 'xpad-checkout-recent-success';
const ACTIVE_LOCK_TTL_MS = 90 * 1000;
const RECENT_PAYMENT_TTL_MS = 45 * 1000;
const SIMULATED_PAYMENT_DELAY_MS = 1200;

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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const readStorage = (key) => {
    try {
        const rawValue = localStorage.getItem(key);
        return rawValue ? JSON.parse(rawValue) : null;
    } catch {
        localStorage.removeItem(key);
        return null;
    }
};

const writeStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

const removeStorage = (key) => {
    localStorage.removeItem(key);
};

function CartPage() {
    const { cartItems, totalPrice, updateQuantity, removeFromCart, clearCart } =
        useContext(CartContext);
    const { toast } = useContext(ToastContext);
    const { userInfo, userId, isLoading } = useContext(UserInfoContext);
    const { setIsOpen, setType } = useContext(SideBarContext);
    const [selectedPayment, setSelectedPayment] = useState('cod');
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

    const selectedPaymentOption = useMemo(
        () =>
            PAYMENT_OPTIONS.find((option) => option.id === selectedPayment) ||
            PAYMENT_OPTIONS[0],
        [selectedPayment]
    );

    const shippingFee = cartItems.length > 0 ? 30000 : 0;
    const paymentFee = cartItems.length > 0 ? selectedPaymentOption.fee : 0;
    const finalTotal = totalPrice + shippingFee + paymentFee;
    const checkoutUserKey =
        userInfo?.id || userId || userInfo?.email || 'guest-user';
    const orderCode = useMemo(
        () => `XPAD-${Date.now().toString().slice(-6)}`,
        []
    );

    const baseInitialValues = useMemo(
        () => ({
            fullName: userInfo?.name || '',
            phone: userInfo?.phone || '',
            email: userInfo?.email || '',
            address: userInfo?.address || '',
            cardName: userInfo?.name || '',
            cardNumber: '',
            walletPhone: userInfo?.phone || ''
        }),
        [userInfo]
    );

    const validationSchema = useMemo(() => {
        const shape = {
            fullName: Yup.string()
                .trim()
                .min(2, 'Họ và tên phải có ít nhất 2 ký tự.')
                .required('Vui lòng nhập họ và tên.'),
            phone: Yup.string()
                .trim()
                .matches(
                    /^(0|\+84)[0-9]{9,10}$/,
                    'Số điện thoại không hợp lệ.'
                )
                .required('Vui lòng nhập số điện thoại.'),
            email: Yup.string()
                .trim()
                .email('Email không hợp lệ.')
                .required('Vui lòng nhập email.'),
            address: Yup.string()
                .trim()
                .min(8, 'Địa chỉ giao hàng quá ngắn.')
                .required('Vui lòng nhập địa chỉ giao hàng.'),
            cardName: Yup.string().trim(),
            cardNumber: Yup.string().trim(),
            walletPhone: Yup.string().trim()
        };

        if (selectedPayment === 'card') {
            shape.cardName = Yup.string()
                .trim()
                .min(2, 'Tên chủ thẻ quá ngắn.')
                .required('Vui lòng nhập tên chủ thẻ.');
            shape.cardNumber = Yup.string()
                .trim()
                .matches(/^[0-9 ]{8,25}$/, 'Số thẻ không hợp lệ.')
                .required('Vui lòng nhập số thẻ.');
        }

        if (selectedPayment === 'wallet') {
            shape.walletPhone = Yup.string()
                .trim()
                .matches(
                    /^(0|\+84)[0-9]{9,10}$/,
                    'Số điện thoại ví không hợp lệ.'
                )
                .required('Vui lòng nhập số điện thoại ví điện tử.');
        }

        return Yup.object(shape);
    }, [selectedPayment]);

    const formik = useFormik({
        initialValues: baseInitialValues,
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values, helpers) => {
            if (!userInfo) {
                toast?.error?.(
                    'Bạn cần đăng nhập trước khi có thể thanh toán.'
                );
                setType('login');
                setIsOpen(true);
                helpers.setSubmitting(false);
                return;
            }

            if (isLoading) {
                toast?.info?.('Đang tải thông tin tài khoản, vui lòng thử lại.');
                helpers.setSubmitting(false);
                return;
            }

            if (!cartItems.length) {
                toast?.error?.('Giỏ hàng đang trống.');
                helpers.setSubmitting(false);
                return;
            }

            const cartSignature = cartItems
                .map((item) => `${item.id}:${item.quantity}:${item.price}`)
                .join('|');
            const fingerprint = JSON.stringify({
                user: checkoutUserKey,
                paymentMethod: selectedPayment,
                total: finalTotal,
                address: values.address.trim(),
                phone: values.phone.trim(),
                cartSignature
            });

            const now = Date.now();
            const activeLock = readStorage(PAYMENT_LOCK_KEY);

            if (
                activeLock &&
                activeLock.user === checkoutUserKey &&
                activeLock.expiresAt > now
            ) {
                toast?.error?.(
                    'Thanh toán đang được xử lý. Vui lòng không bấm lặp lại.'
                );
                helpers.setSubmitting(false);
                return;
            }

            const recentPayment = readStorage(PAYMENT_RECENT_KEY);
            if (
                recentPayment &&
                recentPayment.user === checkoutUserKey &&
                recentPayment.fingerprint === fingerprint &&
                now - recentPayment.createdAt < RECENT_PAYMENT_TTL_MS
            ) {
                toast?.error?.(
                    'Đơn thanh toán này vừa được tạo. Vui lòng chờ thêm một chút trước khi thử lại.'
                );
                helpers.setSubmitting(false);
                return;
            }

            const lockPayload = {
                user: checkoutUserKey,
                fingerprint,
                expiresAt: now + ACTIVE_LOCK_TTL_MS
            };

            writeStorage(PAYMENT_LOCK_KEY, lockPayload);
            setIsPaymentProcessing(true);

            try {
                await sleep(SIMULATED_PAYMENT_DELAY_MS);

                await orderService.createOrder({
                    orderCode,
                    customerName: values.fullName.trim(),
                    customerEmail: values.email.trim(),
                    customerPhone: values.phone.trim(),
                    shippingAddress: values.address.trim(),
                    paymentMethod: selectedPayment.toUpperCase(),
                    note:
                        selectedPayment === 'wallet'
                            ? `Ví điện tử: ${values.walletPhone.trim()}`
                            : selectedPayment === 'card'
                              ? `Thẻ: ${values.cardName.trim()}`
                              : '',
                    subtotal: totalPrice,
                    shippingFee,
                    paymentFee,
                    total: finalTotal,
                    items: cartItems.map((item) => ({
                        id: item.id,
                        title: item.title,
                        image: item.image,
                        price: item.price,
                        quantity: item.quantity
                    }))
                });

                writeStorage(PAYMENT_RECENT_KEY, {
                    user: checkoutUserKey,
                    fingerprint,
                    createdAt: Date.now()
                });

                toast?.success?.(
                    `Đơn hàng đã được xác nhận với hình thức ${selectedPaymentOption.label.toLowerCase()}.`
                );
                clearCart();
                helpers.resetForm({ values: baseInitialValues });
                setSelectedPayment('cod');
            } finally {
                const latestLock = readStorage(PAYMENT_LOCK_KEY);
                if (
                    latestLock &&
                    latestLock.user === checkoutUserKey &&
                    latestLock.fingerprint === fingerprint
                ) {
                    removeStorage(PAYMENT_LOCK_KEY);
                }

                setIsPaymentProcessing(false);
                helpers.setSubmitting(false);
            }
        }
    });

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

    const getFieldClassName = (fieldName) =>
        formik.touched[fieldName] && formik.errors[fieldName]
            ? styles.inputError
            : '';

    const renderFieldError = (fieldName) =>
        formik.touched[fieldName] && formik.errors[fieldName] ? (
            <span className={styles.fieldError}>{formik.errors[fieldName]}</span>
        ) : null;

    const isCheckoutDisabled =
        formik.isSubmitting || isPaymentProcessing || cartItems.length === 0;

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
                                                        Hàng chính hãng, giao nhanh
                                                        toàn quốc
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
                                    onSubmit={formik.handleSubmit}
                                >
                                    <h3>Thông tin thanh toán</h3>

                                    {!userInfo && (
                                        <div className={styles.loginNotice}>
                                            <span>
                                                Bạn cần đăng nhập trước khi có thể
                                                thanh toán.
                                            </span>
                                            <button
                                                type="button"
                                                className={styles.loginAction}
                                                onClick={() => {
                                                    setType('login');
                                                    setIsOpen(true);
                                                }}
                                            >
                                                Mở đăng nhập
                                            </button>
                                        </div>
                                    )}

                                    <div className={styles.formField}>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formik.values.fullName}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={getFieldClassName(
                                                'fullName'
                                            )}
                                            placeholder="Họ và tên"
                                        />
                                        {renderFieldError('fullName')}
                                    </div>

                                    <div className={styles.formField}>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formik.values.phone}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={getFieldClassName(
                                                'phone'
                                            )}
                                            placeholder="Số điện thoại"
                                        />
                                        {renderFieldError('phone')}
                                    </div>

                                    <div className={styles.formField}>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={getFieldClassName(
                                                'email'
                                            )}
                                            placeholder="Email"
                                        />
                                        {renderFieldError('email')}
                                    </div>

                                    <div className={styles.formField}>
                                        <textarea
                                            rows="4"
                                            name="address"
                                            value={formik.values.address}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={getFieldClassName(
                                                'address'
                                            )}
                                            placeholder="Địa chỉ giao hàng"
                                        />
                                        {renderFieldError('address')}
                                    </div>

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
                                                <div
                                                    className={styles.formField}
                                                >
                                                    <input
                                                        type="text"
                                                        name="cardName"
                                                        value={
                                                            formik.values
                                                                .cardName
                                                        }
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                        onBlur={
                                                            formik.handleBlur
                                                        }
                                                        className={getFieldClassName(
                                                            'cardName'
                                                        )}
                                                        placeholder="Tên chủ thẻ"
                                                    />
                                                    {renderFieldError(
                                                        'cardName'
                                                    )}
                                                </div>
                                                <div
                                                    className={styles.formField}
                                                >
                                                    <input
                                                        type="text"
                                                        name="cardNumber"
                                                        value={
                                                            formik.values
                                                                .cardNumber
                                                        }
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                        onBlur={
                                                            formik.handleBlur
                                                        }
                                                        className={getFieldClassName(
                                                            'cardNumber'
                                                        )}
                                                        placeholder="Số thẻ"
                                                    />
                                                    {renderFieldError(
                                                        'cardNumber'
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {selectedPayment === 'wallet' && (
                                            <div
                                                className={
                                                    styles.paymentFieldGroup
                                                }
                                            >
                                                <div
                                                    className={styles.formField}
                                                >
                                                    <input
                                                        type="text"
                                                        name="walletPhone"
                                                        value={
                                                            formik.values
                                                                .walletPhone
                                                        }
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                        onBlur={
                                                            formik.handleBlur
                                                        }
                                                        className={getFieldClassName(
                                                            'walletPhone'
                                                        )}
                                                        placeholder="Số điện thoại ví"
                                                    />
                                                    {renderFieldError(
                                                        'walletPhone'
                                                    )}
                                                </div>
                                                <div
                                                    className={styles.qrPanel}
                                                >
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
                                                <div
                                                    className={styles.qrPanel}
                                                >
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
                                        type="submit"
                                        className={styles.checkoutBtn}
                                        disabled={isCheckoutDisabled}
                                    >
                                        {isPaymentProcessing
                                            ? 'Đang xử lý thanh toán...'
                                            : !userInfo
                                              ? 'Đăng nhập để thanh toán'
                                              : selectedPaymentOption.buttonLabel}
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
