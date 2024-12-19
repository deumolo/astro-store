import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { Product, db, ProductImage, sql, eq } from 'astro:db';
import type { ProductWithImages } from '@/interfaces/product-with-images.interface';

const newProduct = {
    id: '',
    description:
        "",
    images: [],
    stock: 0,
    price: 0,
    sizes: ['XS', 'S', 'M'],
    slug: '',
    type: 'shirts',
    tags: [],
    title: "",
    gender: 'men'
}

export const getProductBySlug = defineAction({
    accept: 'json',
    input: z.object({
        slug: z.string().optional(),
    }),
    handler: async ({ slug }) => {
        {
            if (slug === 'new') {
                return {
                    product: newProduct
                }
            }

            const [product] = await db
                .select()
                .from(Product)
                .where(eq(Product.slug, slug as string));

            if (!product) {
                throw new Error('Product not found')
            }

            const images = await db
                .select()
                .from(ProductImage)
                .where(eq(ProductImage.productId, product.id));

            return {
                product: {
                    ...product,
                } as ProductWithImages,
                images: images
            }

        }
    }
})
