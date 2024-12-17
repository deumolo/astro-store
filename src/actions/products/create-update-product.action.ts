import { defineAction } from 'astro:actions';
import { db, eq, Product } from 'astro:db';
import { z } from 'astro:schema';
import { getSession } from 'auth-astro/server';
import { v4 as UUID } from 'uuid'

const MAX_IMAGE_SIZE = 5_000_000; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/tiff', 'image/bmp', 'image/avif'];

export const createUpdateProduct = defineAction({
    accept: 'form',
    input: z.object({
        id: z.string().optional(),
        description: z.string(),
        gender: z.string(),
        price: z.number(),
        sizes: z.string(),
        slug: z.string(),
        stock: z.number(),
        tags: z.string(),
        title: z.string(),
        type: z.string(),
        imageFiles: z.array(z.instanceof(File)
            .refine(file => file.size <= MAX_IMAGE_SIZE, 'Max image size : 5mb')
            .refine(file => {
                if (file.size === 0) return true
                return ACCEPTED_IMAGE_TYPES.includes(file.type)
            }, 'Only accepted image files: ' + ACCEPTED_IMAGE_TYPES.join(','))
        ).optional(),
    }),
    handler: async (form, { request }) => {
        {


            const session = await getSession(request)
            const user = session?.user;


            if (!user) {
                throw new Error('Unauthorized')
            }


            const { id = UUID(), imageFiles, ...rest } = form;
            rest.slug = rest.slug.toLowerCase().replaceAll(' ', '_').trim();

            const product = {
                id: id,
                user: user.id!,
                ...rest
            }

            if (!form.id) {
                await db.insert(Product).values(product);
            } else {
                await db.update(Product).set(product).where(eq(Product.id, product.id));
            }


            return product;
        }
    }
})
