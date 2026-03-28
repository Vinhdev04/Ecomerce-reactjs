/**
 * Realtime counter hook for favorite and compare product collections.
 */
import { useEffect, useState } from 'react';
import {
    PRODUCT_COLLECTION_EVENT,
    getCompareProducts,
    getFavoriteProducts
} from '@/utils/productCollections';

export default function useProductCollectionCounts() {
    const [favoriteCount, setFavoriteCount] = useState(0);
    const [compareCount, setCompareCount] = useState(0);

    useEffect(() => {
        const syncCounts = () => {
            setFavoriteCount(getFavoriteProducts().length);
            setCompareCount(getCompareProducts().length);
        };

        syncCounts();

        window.addEventListener(PRODUCT_COLLECTION_EVENT, syncCounts);
        window.addEventListener('storage', syncCounts);

        return () => {
            window.removeEventListener(PRODUCT_COLLECTION_EVENT, syncCounts);
            window.removeEventListener('storage', syncCounts);
        };
    }, []);

    return { favoriteCount, compareCount };
}
