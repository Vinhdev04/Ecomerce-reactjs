import React from 'react';
import ProductCard from '@/components/ProductItem/ProductItem.jsx';

export const ProductGrid = ({ products }) => (
    <div className='row g-4'>
        {products?.map((product) => (
            <div key={product.id} className='col-xl-4 col-md-6'>
                <ProductCard
                    image={product.image[0]}
                    images={product.image}
                    title={product.title}
                    description={product.description}
                    price={product.price}
                    badge={product.badge}
                    rating={product.rating}
                    stock={product.stock}
                />
            </div>
        ))}
    </div>
);
