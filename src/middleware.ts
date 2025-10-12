// src/middleware.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const session = await auth();
  const { pathname } = req.nextUrl;

  const isLoggedIn = !!session;

  // Define public routes that do not require authentication
  const publicRoutes = ["/", "/login", "/signup", "/onboarding"];

  // Define routes that are part of the authentication flow
  const authRoutes = ["/login", "/signup"];

  // Check if the current route is public
  const isPublicRoute = publicRoutes.includes(pathname);

  // If the user is logged in
  if (isLoggedIn) {
    const onboardingCompleted = session.user?.onboardingCompleted ?? false;

    // If the user has not completed onboarding, redirect them to the onboarding page,
    // unless they are already on it.
    if (!onboardingCompleted && pathname !== "/onboarding") {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    // If the user has completed onboarding and tries to access an auth route (e.g., /login),
    // redirect them to the dashboard.
    if (onboardingCompleted && authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }
  // If the user is not logged in and is trying to access a protected route
  else if (!isPublicRoute) {
    // Redirect them to the login page, but keep the original URL they were trying to access
    // as a callbackUrl, so they can be redirected back after logging in.
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, req.url)
    );
  }

  // If none of the above conditions are met, allow the request to proceed.
  return NextResponse.next();
}

// The matcher configures which routes the middleware will run on.
// This regex excludes API routes, Next.js internal routes, and static files.
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
