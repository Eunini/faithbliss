import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Get the token from the request
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Define routes that are public and don't require authentication
  const publicRoutes = ['/', '/login', '/signup'];

  // If a token exists, the user is considered authenticated
  if (token) {
    const onboardingCompleted = token.onboardingCompleted as boolean;

    // If onboarding is not completed, redirect to onboarding (unless already there)
    if (!onboardingCompleted && pathname !== '/onboarding') {
      return NextResponse.redirect(new URL('/onboarding', req.url));
    }

    // If onboarding is completed and user tries to access onboarding or public routes, redirect to dashboard
    if (onboardingCompleted && (pathname === '/onboarding' || publicRoutes.includes(pathname))) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }
  // If no token exists, the user is unauthenticated
  else {
    // If an unauthenticated user tries to access any page that isn't public,
    // redirect them to the login page.
    if (!publicRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // If none of the above conditions are met, allow the request to proceed.
  return NextResponse.next();
}

// Config to specify which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
