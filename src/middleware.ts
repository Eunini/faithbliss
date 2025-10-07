import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Define public routes that do not require authentication at the middleware's first check
const publicRoutes = [
  '/', 
  '/login',
  '/signup',
  '/onboarding', // Treat as public for the initial check, then protect it inside the middleware
  '/test-cloudinary',
  '/test-upload'
];

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // If the user is authenticated
    if (token) {
      const onboardingCompleted = token.onboardingCompleted as boolean;

      // Rule 1: If user has NOT onboarded and is NOT on the onboarding page,
      // force them to the onboarding page.
      if (!onboardingCompleted && path !== '/onboarding') {
        return NextResponse.redirect(new URL('/onboarding', req.url));
      }

      // Rule 2: If user HAS onboarded and tries to access login, signup, or onboarding,
      // send them to the dashboard.
      if (onboardingCompleted && ['/login', '/signup', '/onboarding'].includes(path)) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    } 
    // If the user is NOT authenticated
    else {
      // Rule 3: If an unauthenticated user tries to access a protected-by-logic route
      // like onboarding, redirect them to login.
      if (path === '/onboarding') {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    // Otherwise, allow the request to proceed.
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        
        // If the route is considered public, always run the middleware function.
        // This allows us to implement custom logic for routes like /onboarding.
        if (publicRoutes.includes(path)) {
          return true;
        }

        // For any other route not in publicRoutes, it is protected and requires a token.
        // If no token, `withAuth` will automatically redirect to the login page.
        return !!token;
      },
    },
  }
);

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};