/**
 * Product detail page logic hook:
 * loads product by id and manages gallery state.
 */
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '@/api/productsService';
import { CartContext } from '@contexts/CartContext.js';

export default function useProductDetailPage() {
    const { id } = useParams();
    const { addToCart } = useContext(CartContext);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeImage, setActiveImage] = useState('');

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await getProductById(id);
                if (response?.success && response?.data) {
                    setProduct(response.data);
                    setActiveImage(
                        Array.isArray(response.data.image)
                            ? response.data.image[0]
                            : response.data.image
                    );
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
    const heroImage =
        activeImage ||
        safeImages[0] ||
        'https://via.placeholder.com/800x800?text=Product';

    return {
        product,
        loading,
        error,
        activeImage,
        setActiveImage,
        safeImages,
        heroImage,
        addToCart
    };
}
