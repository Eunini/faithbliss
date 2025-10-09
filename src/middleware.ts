import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface ExtendedJWT {
  accessToken?: string;
  userId?: string;
  onboardingCompleted?: boolean;
  isNewUser?: boolean;
  [key: string]: unknown;
}

export async function middleware(req: NextRequest) {
  const token = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as ExtendedJWT | null;

  const { pathname, searchParams } = req.nextUrl;

  // ✅ Public (no auth required)
  const publicRoutes = ["/", "/login", "/signup"];

  // ✅ Always allow NextAuth and static files
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // ✅ Prevent infinite loops from callbackUrl=/login
  const callbackUrl = searchParams.get("callbackUrl");
  if (callbackUrl && callbackUrl.includes("/login")) {
    const cleanUrl = new URL("/dashboard", req.url);
    return NextResponse.redirect(cleanUrl);
  }

  // ✅ Unauthenticated user trying to access protected route → redirect to login
  if (!token && !publicRoutes.includes(pathname)) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Authenticated user
  if (token) {
    const isNewUser = !!token.isNewUser;

    // New user (just signed up) must complete onboarding first
    if (isNewUser && pathname !== "/onboarding") {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    // Existing user who completed onboarding shouldn't be on auth pages
    if (!isNewUser && publicRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};