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
  const token = (await getToken({ req, secret: process.env.NEXTAUTH_SECRET })) as ExtendedJWT | null;
  const { pathname, searchParams } = req.nextUrl;

  const publicRoutes = ["/", "/login", "/signup", "/onboarding"];

  // ✅ Allow NextAuth callback and static routes
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // ✅ Prevent redirect loops caused by callbackUrl queries
  if (searchParams.has("callbackUrl")) {
    return NextResponse.next();
  }

  // ✅ No token → redirect to login (if not public)
  if (!token && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ✅ Has token (authenticated)
  if (token) {
    const isNewUser = token.isNewUser || false;

    // New user → onboarding
    if (isNewUser && pathname !== "/onboarding") {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    // Logged-in user visiting login/signup → dashboard
    if (!isNewUser && ["/login", "/signup", "/"].includes(pathname)) {
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