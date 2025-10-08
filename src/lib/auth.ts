/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/auth.ts - NextAuth configuration
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
    /**
     * Handles JWT token creation and updates
     */
    async jwt({ token, account, profile, trigger, session }) {
      if (
        (trigger === "signIn" || trigger === "signUp") &&
        account?.provider === "google" &&
        profile?.email
      ) {
        try {
          const backendUrl =
            process.env.NEXT_PUBLIC_BACKEND_URL ||
            "https://faithbliss-backend.fly.dev";

          const response = await fetch(`${backendUrl}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: profile.email,
              name: profile.name,
              picture: (profile as GoogleProfile).picture,
              googleId: (profile as GoogleProfile).sub,
              accessToken: account.access_token,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const user = data.user || {};

            token.accessToken = data.accessToken;
            token.userId = user.id || user._id || profile.email;
            token.userEmail = profile.email;
            token.onboardingCompleted = !!user.onboardingCompleted;
            token.isNewUser = !user.onboardingCompleted; // backend decides this
          } else {
            token.error = "BackendAuthenticationError";
          }
        } catch (err) {
          console.error("JWT callback backend fetch failed:", err);
          token.error = "BackendFetchError";
        }
      }

      // Handle manual token updates (like onboarding completion)
      if (trigger === "update" && session) {
        if (typeof session.onboardingCompleted !== "undefined") {
          token.onboardingCompleted = session.onboardingCompleted;
          if (session.onboardingCompleted) token.isNewUser = false;
        }
      }

      return token;
    },

    /**
     * Merge token info into session
     */
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.userId = token.userId as string;

      if (session.user) {
        session.user.id = token.userId as string;
        (session.user as any).isNewUser = !!token.isNewUser;
        (session.user as any).onboardingCompleted =
          !!token.onboardingCompleted;
      }

      return session;
    },

    /**
     * Allow or deny sign-ins
     */
    async signIn({ account, profile, user }) {
      if (account?.provider === "google" && profile?.email) {
        if ((user as any)?.error) return false;
        return true;
      }
      return false;
    },

    /**
     * Handle redirects after login
     */
    async redirect({ url, baseUrl }) {
      // If it's the OAuth callback (login finished), go to dashboard
      if (url.includes("/api/auth/callback")) {
        return `${baseUrl}/dashboard`;
      }

      // Allow in-app relative URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;

      // Keep internal redirects within domain
      if (url.startsWith(baseUrl)) return url;

      // Default fallback
      return `${baseUrl}/dashboard`;
    },
  },

  /**
   * Custom page routes
   */
  pages: {
    signIn: "/login",
    error: "/login",
  },

  /**
   * Use stateless JWT sessions
   */
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60,   // 24 hours
  },

  /**
   * Vercel-safe cookie settings
   */
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
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