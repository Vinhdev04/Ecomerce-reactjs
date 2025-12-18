import { Heart, Eye, ShoppingCart } from 'lucide-react';
import styles from './ProductIcons.module.scss';
// Icon Components
const FavoriteIcon = ({ isFavorite, className = '' }) => (
    <button
        className={`${styles.iconBtn} ${
            isFavorite ? styles.active : ''
        } ${className}`}
        aria-label='Thêm vào yêu thích'
        type='button'
    >
        <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
    </button>
);

const QuickViewIcon = ({ className = '' }) => (
    <button
        className={`${styles.iconBtn} ${className}`}
        aria-label='Xem nhanh'
        type='button'
    >
        <Eye size={20} />
    </button>
);

const AddToCartIcon = ({ className = '' }) => (
    <button
        className={`${styles.iconBtn} ${styles.cartBtn} ${className}`}
        aria-label='Thêm vào giỏ'
        type='button'
    >
        <ShoppingCart size={20} />
    </button>
);

export { FavoriteIcon, QuickViewIcon, AddToCartIcon };
