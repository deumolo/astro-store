import { Role, User, Product, ProductImage, db } from 'astro:db';
import { seedProducts } from './seed-data';
import { v4 } from 'uuid'
import bcrypt from 'bcryptjs'

// https://astro.build/db/seed
export default async function seed() {
	const roles = [
		{ id: 'admin', name: 'Admin', createdAt: new Date() },
		{ id: 'user', name: 'User', createdAt: new Date() },
	];

	const johnDoe = {
		id: v4(),
		name: 'John Doe',
		email: 'john@gmail.com',
		password: bcrypt.hashSync('1234'),
		createdAt: new Date(),
		role: 'admin',
	}
	const janeDoe = {
		id: v4(),
		name: 'Jane Doe',
		email: 'jane@gmail.com',
		password: bcrypt.hashSync('1234'),
		createdAt: new Date(),
		role: 'user',
	}

	await db.insert(Role).values(roles);
	await db.insert(User).values([johnDoe, janeDoe]);

	const queries: any = []

	seedProducts.forEach(p => {
		const product = {
			id: v4(),
			description: p.description,
			gender: p.description,
			price: p.price,
			sizes: p.sizes.join(','),
			slug: p.slug,
			stock: p.stock,
			tags: p.tags.join(','),
			title: p.title,
			type: p.type,
			user: johnDoe.id,
		}

		queries.push(db.insert(Product).values(product))

		p.images.forEach(i => {
			const image = {
				id: v4(),
				productId: product.id,
				image: i,
			}
			queries.push(db.insert(ProductImage).values(image))
		})

	});

	await db.batch(queries);

}
