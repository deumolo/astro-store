import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { Product, db, ProductImage, sql } from 'astro:db';
import type { ProductWithImages } from '@/interfaces/product-with-images.interface';

const newProduct = {
    id: '',
    description:
        "",
    images: [],
    stock: 0,
    price: 0,
    sizes: ['XS','S','M'],
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
            if(slug === 'new'){
                return { 
                    product: newProduct
                }
            }

            const productQuery = sql`select a.*,
                                    ( select GROUP_CONCAT(image,',') from 
                                        ( select * from ${ProductImage} where productId = a.id limit 2 )
                                    ) as images
                                    from ${Product} a
                                    where a.slug = ${slug};`;

            const { rows } = await db.run(productQuery);

            const products = rows.map(product=>{
                return {
                    ...product,
                    images: product.images ? product.images : 'no-image.png'
                }
            })

            return {
                product: products[0] as unknown as ProductWithImages
            }

        }
    }
})
