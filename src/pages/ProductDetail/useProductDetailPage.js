/**
 * Product detail page logic hook:
 * loads product by id and manages gallery state.
 */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '@/api/productsService';
import useProductActions from '@/hooks/useProductActions';

export default function useProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await getProductById(id);
                if (response?.success && response?.data) {
                    setProduct(response.data);
                    setActiveIndex(0);
                } else {
                    setError('Khong tim thay san pham.');
                }
            } catch (err) {
                setError(
                    err?.response?.data?.message ||
                        'Khong the tai chi tiet san pham.'
                );
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [id]);

    const images = Array.isArray(product?.image) ? product.image : [product?.image];
    const safeImages = images.filter(Boolean);
    const imageCount = safeImages.length;
    const boundedIndex =
        imageCount > 0 ? Math.min(activeIndex, imageCount - 1) : 0;
    const activeImage = safeImages[boundedIndex];
    const heroImage = activeImage || 'https://via.placeholder.com/800x800?text=Product';

    const selectImage = (index) => {
        if (!imageCount) return;
        const safeIndex = Math.max(0, Math.min(index, imageCount - 1));
        setActiveIndex(safeIndex);
    };

    const nextImage = () => {
        if (!imageCount) return;
        setActiveIndex((prev) => (prev + 1) % imageCount);
    };

    const prevImage = () => {
        if (!imageCount) return;
        setActiveIndex((prev) => (prev - 1 + imageCount) % imageCount);
    };

    const {
        isFavorite,
        isCompared,
        toggleFavorite,
        toggleCompare,
        addProductToCart
    } = useProductActions(product);

    return {
        product,
        loading,
        error,
        activeImage,
        activeIndex: boundedIndex,
        selectImage,
        nextImage,
        prevImage,
        hasMultipleImages: imageCount > 1,
        safeImages,
        heroImage,
        isFavorite,
        isCompared,
        toggleFavorite,
        toggleCompare,
        addProductToCart
    };
}
