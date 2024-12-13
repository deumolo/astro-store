import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { Product, db, count, eq, ProductImage, sql } from 'astro:db';
import type { ProductWithImages } from '@/interfaces/product-with-images.interface';

export const getProductsByPage = defineAction({
    accept: 'json',
    input: z.object({
        page: z.number().optional().default(1),
        limit: z.number().optional().default(10),
    }),
    handler: async ({ page, limit }) => {
        {
            page = page < 1 ? 1 : page;
            const [totalRecords] = await db.select({ count: count() }).from(Product);
            const totalPages = Math.ceil(totalRecords.count / limit);

            if (page > totalPages) {
                // page = totalPages;
                return {
                    products: [],
                    totalPages: totalPages,
                }
            }

            const productsQuery = sql`select a.*,
                                    ( select GROUP_CONCAT(image,',') from 
                                        ( select * from ${ProductImage} where productId = a.id limit 2 )
                                    ) as images
                                    from ${Product} a
                                    LIMIT ${limit} OFFSET ${(page - 1) * limit};`;

            const { rows } = await db.run(productsQuery);

            // const products = await db
            //     .select()
            //     .from(Product)
            //     .innerJoin(ProductImage, eq(Product.id, ProductImage.productId))
            //     .limit(limit)
            //     .offset((page - 1) * 12);

            return {
                products: rows as unknown as ProductWithImages[],
                totalPages,
            }

        }
    }
})
