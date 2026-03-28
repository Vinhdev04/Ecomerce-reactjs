/**
 * Product collections store (favorites + compare) backed by localStorage.
 */
const FAVORITES_STORAGE_KEY = 'xpad-favorite-products';
const COMPARE_STORAGE_KEY = 'xpad-compare-products';
export const PRODUCT_COLLECTION_EVENT = 'xpad:product-collection-updated';
const COMPARE_LIMIT = 4;

const readCollection = (storageKey) => {
    try {
        const raw = localStorage.getItem(storageKey);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const writeCollection = (storageKey, items) => {
    localStorage.setItem(storageKey, JSON.stringify(items));
    window.dispatchEvent(
        new CustomEvent(PRODUCT_COLLECTION_EVENT, {
            detail: { storageKey, items }
        })
    );
};

export const normalizeProductPayload = (product) => {
    if (!product) return null;

    const id = product.id || product._id;
    if (!id) return null;

    const imageList = Array.isArray(product.image)
        ? product.image.filter(Boolean)
        : product.image
          ? [product.image]
          : [];

    return {
        id,
        title: product.title || 'Product',
        description: product.description || '',
        price: Number(product.price || 0),
        image: imageList,
        stock: Number(product.stock ?? 0),
        category: product.category || '',
        rating: Number(product.rating ?? 0),
        badge: product.badge || ''
    };
};

const isInCollection = (storageKey, productId) => {
    return readCollection(storageKey).some((item) => item.id === productId);
};

const toggleCollection = (storageKey, product, options = {}) => {
    const normalized = normalizeProductPayload(product);
    if (!normalized) {
        return { items: readCollection(storageKey), isActive: false, added: false };
    }

    const items = readCollection(storageKey);
    const existed = items.some((item) => item.id === normalized.id);

    if (!existed && options.limit && items.length >= options.limit) {
        return {
            items,
            isActive: false,
            added: false,
            limitReached: true
        };
    }

    const nextItems = existed
        ? items.filter((item) => item.id !== normalized.id)
        : [normalized, ...items];

    writeCollection(storageKey, nextItems);

    return {
        items: nextItems,
        isActive: !existed,
        added: !existed,
        limitReached: false
    };
};

export const getFavoriteProducts = () => readCollection(FAVORITES_STORAGE_KEY);
export const getCompareProducts = () => readCollection(COMPARE_STORAGE_KEY);

export const isFavoriteProduct = (productId) =>
    isInCollection(FAVORITES_STORAGE_KEY, productId);
export const isComparedProduct = (productId) =>
    isInCollection(COMPARE_STORAGE_KEY, productId);

export const toggleFavoriteProduct = (product) =>
    toggleCollection(FAVORITES_STORAGE_KEY, product);

export const toggleCompareProduct = (product) =>
    toggleCollection(COMPARE_STORAGE_KEY, product, { limit: COMPARE_LIMIT });

export const removeFavoriteProduct = (productId) => {
    const nextItems = getFavoriteProducts().filter((item) => item.id !== productId);
    writeCollection(FAVORITES_STORAGE_KEY, nextItems);
    return nextItems;
};

export const removeComparedProduct = (productId) => {
    const nextItems = getCompareProducts().filter((item) => item.id !== productId);
    writeCollection(COMPARE_STORAGE_KEY, nextItems);
    return nextItems;
};

export const clearCompareProducts = () => {
    writeCollection(COMPARE_STORAGE_KEY, []);
};
