import { NextAuthConfig } from 'next-auth';

export const authConfig = {
  providers: [],
  pages: { signIn: '/login' },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = Boolean(auth?.user);
      const isDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isDashboard) {
        return isLoggedIn;
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
