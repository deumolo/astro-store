import { Role, User, db } from 'astro:db';

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
		password: bcrypt.hashSync('password'),
		createdAt: new Date(),
		role: 'admin',
	}
	const janeDoe = {
		id: v4(),
		name: 'Jane Doe',
		email: 'jane@gmail.com',
		password: bcrypt.hashSync('password'),
		createdAt: new Date(),
		role: 'user',
	}

	await db.insert(Role).values(roles);
	await db.insert(User).values([johnDoe, janeDoe]);

}
