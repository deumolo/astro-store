import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { Product, db, count, eq, ProductImage } from 'astro:db';

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

            const products = await db
                .select()
                .from(Product)
                .innerJoin(ProductImage, eq(Product.id, ProductImage.productId))
                .limit(limit)
                .offset((page - 1) * 12);

            return {
                products,
                totalPages,
            }

        }
    }
})
