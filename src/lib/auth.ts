/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

interface GoogleProfile {
  sub: string;
  email: string;
  name: string;
  picture: string;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    // ---- Handle JWT token creation and backend sync ----
    async jwt({ token, account, profile, trigger, session }) {
      if (account?.provider === "google" && (trigger === "signIn" || trigger === "signUp")) {
        try {
          const backendUrl =
            process.env.NEXT_PUBLIC_BACKEND_URL || "https://faithbliss-backend.fly.dev";

          const res = await fetch(`${backendUrl}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: profile?.email,
              name: profile?.name,
              picture: (profile as GoogleProfile).picture,
              googleId: (profile as GoogleProfile).sub,
              accessToken: account.access_token,
            }),
          });

          if (!res.ok) throw new Error("Backend authentication failed");
          const data = await res.json();

          const user = data.user || {};
          token.accessToken = data.accessToken;
          token.userId = user.id || user._id || profile?.email;
          token.userEmail = profile?.email;
          token.onboardingCompleted = !!user.onboardingCompleted;
          token.isNewUser = !user.onboardingCompleted;
        } catch (error) {
          console.error("JWT callback backend fetch failed:", error);
          token.error = "BackendError";
        }
      }

      if (trigger === "update" && session) {
        token.onboardingCompleted = session.onboardingCompleted;
        token.isNewUser = !session.onboardingCompleted;
      }

      return token;
    },

    // ---- Handle session data exposure ----
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.userId = token.userId as string;

      if (session.user) {
        session.user.id = token.userId as string;
        (session.user as any).isNewUser = !!token.isNewUser;
        (session.user as any).onboardingCompleted = !!token.onboardingCompleted;
      }

      return session;
    },

    // ---- Allow sign-ins ----
    async signIn({ account, profile }) {
      if (account?.provider === "google" && profile?.email) return true;
      return false;
    },

    // ---- FIXED Redirect Logic ----
    async redirect({ url, baseUrl }) {
      try {
        // NextAuth sometimes includes ?callbackUrl=...
        const callbackUrlMatch = url.match(/[?&]callbackUrl=([^&]+)/);
        if (callbackUrlMatch) {
          const decoded = decodeURIComponent(callbackUrlMatch[1]);
          if (decoded.startsWith(baseUrl)) return decoded;
        }

        // After successful OAuth callback, go to onboarding if new
        if (url.includes("/api/auth/callback")) return `${baseUrl}/onboarding`;

        // Prevent loop only for direct login pages
        if (url === `${baseUrl}/login` || url === `${baseUrl}/signup`) {
          return `${baseUrl}/onboarding`;
        }

        // Default fallback
        return url.startsWith(baseUrl) ? url : `${baseUrl}/onboarding`;
      } catch (err) {
        console.error("Redirect handling failed:", err);
        return `${baseUrl}/onboarding`;
      }
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },

  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  debug: process.env.NODE_ENV === "development",
};