import Credentials from '@auth/core/providers/credentials';
import { db, eq, User } from 'astro:db';
import { defineConfig } from 'auth-astro';
import bcrypt from 'bcryptjs'

export default defineConfig({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async ({ email, password }) =>   {
        const [user] = await db.select().from(User).where(eq(User.email, email as string));

        if (!user) {
          return null
        }

        if (!bcrypt.compareSync(password as string, user.password)) {
          return null
        }

        const { password: _, ...rest } = user;

        return rest;

      }
    })
  ],
});