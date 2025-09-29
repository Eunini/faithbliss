import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = ['/dashboard', '/messages', '/profile', '/matches', '/notifications'];
const authRoutes = ['/login', '/signup'];
const onboardingRoutes = ['/onboarding'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  const isOnboardingRoute = onboardingRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Get the authentication token from cookies (if using Firebase Auth)
  // Note: This is a basic implementation. In a real app, you'd validate the token
  const authToken = request.cookies.get('auth-token');

  // If user is trying to access a protected route without authentication
  if (isProtectedRoute && !authToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If authenticated user tries to access auth pages, redirect to dashboard
  if (isAuthRoute && authToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};