// middleware.ts - Handle authentication and routing
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // If user is authenticated
    if (token) {
      // Redirect from onboarding if already completed
      if (path === '/onboarding' && token.onboardingCompleted) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      // Redirect to onboarding if accessing protected routes without completing onboarding
      const protectedRoutes = ['/dashboard', '/discover', '/matches', '/messages', '/profile', '/community'];
      if (protectedRoutes.some(route => path.startsWith(route)) && !token.onboardingCompleted) {
        return NextResponse.redirect(new URL('/onboarding', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        
        // Public routes that don't require authentication
        const publicRoutes = [
          '/', 
          '/login', 
          '/signup',
          '/test-cloudinary',
          '/test-upload'
        ];
        
        if (publicRoutes.includes(path)) {
          return true;
        }

        // Protected routes that require authentication
        const protectedRoutes = [
          '/dashboard',
          '/discover', 
          '/matches', 
          '/messages', 
          '/profile',
          '/community',
          '/onboarding',
          '/notifications'
        ];
        
        // Only require auth for protected routes
        if (protectedRoutes.some(route => path.startsWith(route))) {
          return !!token;
        }

        // Allow all other routes without authentication
        return true;
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
