import { defineMiddleware } from 'astro:middleware';
import { date } from 'astro:schema';
// import { getSession } from 'auth-astro/server';
import { getSession } from 'auth-astro/server';

const notAuthenticatedRoutes = ['/login', '/register'];
const authenticatedRoutes = ['/dashboard', '/protected'];

export const onRequest = defineMiddleware(
  async ({ url, locals, redirect, request }, next) => {

    const session = await getSession(request);
    const isLoggedIn = !!session;

    const user = session?.user
    locals.isLoggedIn = isLoggedIn;
    locals.user = null;

    if (user) {
      locals.user = {
        email: user.email!,
        name: user.name!,
        dateCreated : user.dateCreated!,
        role: user.role!,
      };
      locals.isAdmin = user.role === 'admin';
    }

    if (!isLoggedIn && authenticatedRoutes.includes(url.pathname)) {
      return redirect('/login');
    }

    if (isLoggedIn && !locals.isAdmin && url.pathname.startsWith('/dashboard')) {
      return redirect('/');
    }

    if (isLoggedIn && notAuthenticatedRoutes.includes(url.pathname)) {
      return redirect('/');
    }

    return next();
  }
);
