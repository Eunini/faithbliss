import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Define public routes that do not require authentication
const publicRoutes = [
  '/', 
  '/login',
  '/signup',
  '/test-cloudinary',
  '/test-upload'
];

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    const isOnPublicRoute = publicRoutes.includes(path);
    const isOnOnboardingRoute = path === '/onboarding';

    // If user is authenticated
    if (token) {
      // If user is on a public route (like /login), redirect to dashboard
      if (isOnPublicRoute) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      // If user has not completed onboarding, redirect to onboarding page
      if (!token.onboardingCompleted && !isOnOnboardingRoute) {
        return NextResponse.redirect(new URL('/onboarding', req.url));
      }

      // If user has completed onboarding and tries to access onboarding page, redirect to dashboard
      if (token.onboardingCompleted && isOnOnboardingRoute) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // For unauthenticated users, allow access to public routes
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        
        // If user is trying to access a public route, allow access
        if (publicRoutes.includes(path)) {
          return true;
        }

        // For any other route, require a token
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
