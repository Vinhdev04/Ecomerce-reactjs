/**
 * Reusable action icons for product cards.
 */
import { Heart, Eye, ShoppingCart, GitCompareArrows } from 'lucide-react';
import styles from './ProductIcons.module.scss';

const FavoriteIcon = ({ isFavorite, className = '', onClick }) => (
    <button
        className={`${styles.iconBtn} ${
            isFavorite ? styles.active : ''
        } ${className}`}
        aria-label="Them vao yeu thich"
        type="button"
        onClick={onClick}
    >
        <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
    </button>
);

const QuickViewIcon = ({ className = '', onClick }) => (
    <button
        className={`${styles.iconBtn} ${className}`}
        aria-label="Xem nhanh"
        type="button"
        onClick={onClick}
    >
        <Eye size={20} />
    </button>
);

const AddToCartIcon = ({ className = '', onClick, disabled = false }) => (
    <button
        className={`${styles.iconBtn} ${styles.cartBtn} ${className}`}
        aria-label="Them vao gio"
        type="button"
        onClick={onClick}
        disabled={disabled}
    >
        <ShoppingCart size={20} />
    </button>
);

const CompareIcon = ({ className = '', onClick, isCompared = false }) => (
    <button
        className={`${styles.iconBtn} ${
            isCompared ? styles.active : ''
        } ${className}`}
        aria-label="So sanh san pham"
        type="button"
        onClick={onClick}
    >
        <GitCompareArrows size={20} />
    </button>
);

export { FavoriteIcon, QuickViewIcon, CompareIcon, AddToCartIcon };
