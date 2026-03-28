import React, { useContext, useEffect, useMemo, useState } from 'react';
import { CartContext } from '@contexts/CartContext.js';
import { ToastContext } from '@contexts/ToastContext';
import { SideBarContext } from '@contexts/SideBarContext.js';
import { UserInfoContext } from '@contexts/UserInfoContext.js';

const CART_STORAGE_KEY = 'xpad-cart-items';
const cartStorageKey = (ownerId = 'guest') => `${CART_STORAGE_KEY}:${ownerId}`;

const normalizeCartItem = (product) => ({
    id: product.id || product._id,
    title: product.title,
    price: product.price,
    image: product.image?.[0] || product.image || '',
    stock: product.stock,
    quantity: 1
});

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { toast } = useContext(ToastContext);
    const { setIsOpen, setType } = useContext(SideBarContext);
    const { userId } = useContext(UserInfoContext);
    const ownerId = userId || 'guest';

    useEffect(() => {
        const storedItems = localStorage.getItem(cartStorageKey(ownerId));

        if (!storedItems) {
            setCartItems([]);
            return;
        }

        try {
            setCartItems(JSON.parse(storedItems));
        } catch (error) {
            console.error('Failed to parse cart items:', error);
            localStorage.removeItem(cartStorageKey(ownerId));
            setCartItems([]);
        }
    }, [ownerId]);

    useEffect(() => {
        localStorage.setItem(cartStorageKey(ownerId), JSON.stringify(cartItems));
    }, [cartItems, ownerId]);

    const openCartSidebar = () => {
        setType('cart');
        setIsOpen(true);
    };

    const addToCart = (product) => {
        const productId = product?.id || product?._id;

        if (!productId) {
            return;
        }

        if (product.stock === 0) {
            toast?.error?.('Sản phẩm hiện đã hết hàng.');
            return;
        }

        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === productId);

            if (existingItem) {
                return prevItems.map((item) =>
                    item.id === productId
                        ? {
                              ...item,
                              quantity: Math.min(
                                  item.quantity + 1,
                                  product.stock ?? item.quantity + 1
                              )
                          }
                        : item
                );
            }

            return [...prevItems, normalizeCartItem(product)];
        });

        toast?.success?.(`Đã thêm "${product.title}" vào giỏ hàng.`);
        openCartSidebar();
    };

    const removeFromCart = (productId) => {
        setCartItems((prevItems) =>
            prevItems.filter((item) => item.id !== productId)
        );
    };

    const updateQuantity = (productId, nextQuantity) => {
        setCartItems((prevItems) =>
            prevItems.map((item) => {
                if (item.id !== productId) {
                    return item;
                }

                const safeQuantity = Math.max(
                    1,
                    Math.min(nextQuantity, item.stock ?? nextQuantity)
                );

                return { ...item, quantity: safeQuantity };
            })
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const value = useMemo(() => {
        const totalQuantity = cartItems.reduce(
            (sum, item) => sum + item.quantity,
            0
        );
        const totalPrice = cartItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        return {
            cartItems,
            totalQuantity,
            totalPrice,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            openCartSidebar
        };
    }, [cartItems]);

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
};
