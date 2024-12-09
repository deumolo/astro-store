import type { ProductWithImages } from '@/interfaces/product-with-images.interface';
import { init } from 'astro/virtual-modules/prefetch.js';
import { ProductCard } from './ProductCard';

interface Props {
  initProducts: {
    products: ProductWithImages[];
    totalPages: number;
  };
}

export const ProductList = (props: Props) => {
  return (
    <div>
      <h1>Product List</h1>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 place-items-center'>
        {props.initProducts.products.map((product: ProductWithImages) => {
          return <ProductCard product={product} />;
        })}
      </div>
    </div>
  );
};
