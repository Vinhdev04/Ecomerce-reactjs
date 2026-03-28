import React from 'react';
import ProductCard from '@/components/ProductItem/ProductItem.jsx';
import styles from './HomeListProduct.module.scss';

export const ProductGrid = ({ products }) => (
    <div className='row g-4'>
        {products?.map((product, index) => (
            <div
                key={product.id || product._id || `${product.title}-${index}`}
                className={`col-xl-4 col-md-6 ${styles.productEnter}`}
                style={{ animationDelay: `${(index % 8) * 45}ms` }}
            >
                <ProductCard
                    image={product.image[0]}
                    images={product.image}
                    title={product.title}
                    description={product.description}
                    price={product.price}
                    badge={product.badge}
                    rating={product.rating}
                    stock={product.stock}
                    details={product}
                />
            </div>
        ))}
    </div>
);
