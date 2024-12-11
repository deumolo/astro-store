import type { CartItem } from '@/interfaces/cart-item';
import { defineAction } from 'astro:actions';
import { db, eq, inArray, Product, ProductImage } from 'astro:db';
import { z } from 'astro:schema';
import { serialize } from 'node_modules/@auth/core/lib/vendored/cookie';

export const loadProductsFromCart = defineAction({
    accept: 'json',
    handler: async (_, { cookies }) => {
        {
            const cart = JSON.parse(cookies.get('cart')?.value ?? '[]') as CartItem[];

            const productIds = cart.map((item) => item.productId);

            const dbProducts = await db
                .select()
                .from(Product)
                .innerJoin(ProductImage, eq(Product.id, ProductImage.productId))
                .where(inArray(Product.id, productIds))


            return cart.map(item => {
                const dbProduct = dbProducts.find((product) => product.Product.id === item.productId);

                const { title, price } = dbProduct?.Product as any;
                const image = dbProduct?.ProductImage.image;

                return {
                    size: item.size,
                    productId: item.productId,
                    quantity: item.quantity,
                    title,
                    price,
                    image: image?.startsWith('http') ? image : `${import.meta.env.PUBLIC_URL}/images/products/${image}`
                }

            })
        }
    }
})
