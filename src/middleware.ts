// src/middleware.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const session = req.auth;
  const { pathname } = req.nextUrl;

  const isLoggedIn = !!session;

  // Define public routes that do not require authentication
  const publicRoutes = ["/", "/login", "/signup"];

  // Define routes that use client-side protection (ProtectedRoute component)
  // These are allowed through middleware but protected by client-side components
  const clientProtectedRoutes = ["/onboarding", "/dashboard", "/matches", "/messages", "/profile", "/community", "/discover", "/notifications"];

  // Define routes that are part of the authentication flow
  const authRoutes = ["/login", "/signup"];

  // Check if the current route is public or client-protected
  const isPublicRoute = publicRoutes.includes(pathname) || clientProtectedRoutes.includes(pathname);

  // If the user is logged in (NextAuth only) - but let ProtectedRoute handle most logic
  if (isLoggedIn) {
    // If the user has completed onboarding and tries to access an auth route (e.g., /login),
    // redirect them to the dashboard.
    const onboardingCompleted = session.user?.onboardingCompleted ?? false;
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
});

// The matcher configures which routes the middleware will run on.
// This regex excludes API routes, Next.js internal routes, and static files.
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};