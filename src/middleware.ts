export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/', '/mumble/:id?', '/profile/:id?', '/tag/:id?'],
};
