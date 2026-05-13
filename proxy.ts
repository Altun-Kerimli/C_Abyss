import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  
  // Protects the admin folder, but explicitly ignores the login page
  const isOnAdmin = req.nextUrl.pathname.startsWith('/adminOfTheAbyss') && !req.nextUrl.pathname.startsWith('/adminOfTheAbyss/login');

  if (isOnAdmin && !isLoggedIn) {
    return Response.redirect(new URL('/adminOfTheAbyss/login', req.nextUrl));
  }
});

export const config = {
  // This ensures the proxy runs on all routes except static files, images, and APIs
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};