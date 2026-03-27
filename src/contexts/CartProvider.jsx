import React, { useContext, useEffect, useMemo, useState } from 'react';
import { CartContext } from '@contexts/CartContext.js';
import { ToastContext } from '@contexts/ToastContext';
import { SideBarContext } from '@contexts/SideBarContext.js';

const CART_STORAGE_KEY = 'xpad-cart-items';

const normalizeCartItem = (product) => ({
    id: product.id,
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

    useEffect(() => {
        const storedItems = localStorage.getItem(CART_STORAGE_KEY);

        if (!storedItems) {
            return;
        }

        try {
            setCartItems(JSON.parse(storedItems));
        } catch (error) {
            console.error('Failed to parse cart items:', error);
            localStorage.removeItem(CART_STORAGE_KEY);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }, [cartItems]);

    const openCartSidebar = () => {
        setType('cart');
        setIsOpen(true);
    };

    const addToCart = (product) => {
        if (!product?.id) {
            return;
        }

        if (product.stock === 0) {
            toast?.error?.('Sản phẩm hiện đã hết hàng.');
            return;
        }

        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === product.id);

            if (existingItem) {
                return prevItems.map((item) =>
                    item.id === product.id
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
