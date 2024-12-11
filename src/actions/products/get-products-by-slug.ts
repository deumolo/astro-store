import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { Product, db, ProductImage, sql } from 'astro:db';
import type { ProductWithImages } from '@/interfaces/product-with-images.interface';

export const getProductBySlug = defineAction({
    accept: 'json',
    input: z.object({
        slug: z.string().optional(),
    }),
    handler: async ({ slug }) => {
        {
            console.log("server action: ", slug);

            const productQuery = sql`select a.*,
                                    ( select GROUP_CONCAT(image,',') from 
                                        ( select * from ${ProductImage} where productId = a.id limit 2 )
                                    ) as images
                                    from ${Product} a
                                    where a.slug = ${slug};`;

            const { rows } = await db.run(productQuery);

            console.log('Product details: ', rows);

            return {
                product: rows[0] as unknown as ProductWithImages
            }

        }
    }
})
