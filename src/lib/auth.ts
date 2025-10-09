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
  trustHost: true, // ✅ Required for Vercel production cookies
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
            }),
            credentials: "include",
          });

          if (!res.ok) {
            const errorBody = await res.text();
            console.error(`Backend authentication failed:`, res.status, errorBody);
            throw new Error(`Backend auth failed`);
          }

          const data = await res.json();
          const user = data.user || {};

          token.accessToken = data.accessToken;
          token.userId = user.id;
          token.onboardingCompleted = !!user.onboardingCompleted;
          token.isNewUser = !user.onboardingCompleted;
        } catch (error) {
          console.error("JWT callback error:", error);
          token.error = "BackendError";
        }
      }

      if (trigger === "update" && session) {
        token.onboardingCompleted = session.onboardingCompleted;
        token.isNewUser = !session.onboardingCompleted;
      }

      return token;
    },

    // ---- Expose token fields to session ----
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.userId = token.userId as string;

      if (session.user) {
        session.user.id = token.userId;
        (session.user as any).onboardingCompleted = token.onboardingCompleted;
        (session.user as any).isNewUser = token.isNewUser;
      }

      return session;
    },

    async signIn({ account, profile }) {
      return !!(account?.provider === "google" && profile?.email);
    },

    // ✅ FIXED REDIRECT LOOP
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`; // ✅ Always land here after auth
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  debug: process.env.NODE_ENV === "development",
};