/**
 * Shared product action hook:
 * favorite, compare and add-to-cart behavior for cards/detail pages.
 */
import { useContext, useEffect, useMemo, useState } from 'react';
import { CartContext } from '@contexts/CartContext.js';
import { ToastContext } from '@contexts/ToastContext';
import { SideBarContext } from '@contexts/SideBarContext.js';
import {
    PRODUCT_COLLECTION_EVENT,
    isComparedProduct,
    isFavoriteProduct,
    normalizeProductPayload,
    toggleCompareProduct,
    toggleFavoriteProduct
} from '@/utils/productCollections';

export default function useProductActions(product) {
    const { addToCart } = useContext(CartContext);
    const { toast } = useContext(ToastContext);
    const { setIsOpen, setType } = useContext(SideBarContext);

    const normalizedProduct = useMemo(
        () => normalizeProductPayload(product),
        [product]
    );
    const productId = normalizedProduct?.id;
    const [isFavorite, setIsFavorite] = useState(false);
    const [isCompared, setIsCompared] = useState(false);

    useEffect(() => {
        if (!productId) {
            setIsFavorite(false);
            setIsCompared(false);
            return;
        }

        const syncState = () => {
            setIsFavorite(isFavoriteProduct(productId));
            setIsCompared(isComparedProduct(productId));
        };

        syncState();

        const onCollectionUpdated = () => syncState();
        const onStorage = () => syncState();

        window.addEventListener(PRODUCT_COLLECTION_EVENT, onCollectionUpdated);
        window.addEventListener('storage', onStorage);

        return () => {
            window.removeEventListener(
                PRODUCT_COLLECTION_EVENT,
                onCollectionUpdated
            );
            window.removeEventListener('storage', onStorage);
        };
    }, [productId]);

    const openSidebar = (type) => {
        setType(type);
        setIsOpen(true);
    };

    const toggleFavorite = () => {
        if (!normalizedProduct) return;

        const result = toggleFavoriteProduct(normalizedProduct);
        setIsFavorite(result.isActive);
        openSidebar('favorites');
        toast?.success?.(
            result.added
                ? `Da them "${normalizedProduct.title}" vao yeu thich.`
                : `Da bo "${normalizedProduct.title}" khoi yeu thich.`
        );
    };

    const toggleCompare = () => {
        if (!normalizedProduct) return;

        const result = toggleCompareProduct(normalizedProduct);

        if (result.limitReached) {
            toast?.warning?.('Chi duoc so sanh toi da 4 san pham.');
            openSidebar('compare');
            return;
        }

        setIsCompared(result.isActive);
        openSidebar('compare');
        toast?.success?.(
            result.added
                ? `Da them "${normalizedProduct.title}" vao compare.`
                : `Da bo "${normalizedProduct.title}" khoi compare.`
        );
    };

    const addProductToCart = () => {
        if (!normalizedProduct) return;
        addToCart(normalizedProduct);
    };

    return {
        productId,
        normalizedProduct,
        isFavorite,
        isCompared,
        toggleFavorite,
        toggleCompare,
        addProductToCart
    };
}
