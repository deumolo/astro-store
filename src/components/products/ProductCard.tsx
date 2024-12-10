import type { ProductWithImages } from '@/interfaces/product-with-images.interface';
import { useState } from 'react';

interface Props {
  product: ProductWithImages;
}

export const ProductCard = ({ product }: Props) => {
  const images = product.images.split(',').map((image) => {
    return image.startsWith('http')
      ? image
      : `${import.meta.env.PUBLIC_URL}/images/products/${image}`;
  });

  const [currentImage, setCurrentImage] = useState(images[0]);

  return (
    <a
      onMouseEnter={() => {
        setCurrentImage(images[1]);
      }}
      onMouseLeave={() => {
        setCurrentImage(images[0]);
      }}
    >
      <img
        src={currentImage}
        alt={product.title}
        className='h-[350px] object-contain'
      />
      <h4>{product.title}</h4>
      <p>${product.price}</p>
    </a>
  );
};
