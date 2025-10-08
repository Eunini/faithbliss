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
    async jwt({ token, account, profile, trigger, session }) {
      // If this is a sign-in or token update
      if ((trigger === "signIn" || trigger === "signUp") && account?.provider === "google" && profile?.email) {
        try {
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://faithbliss-backend.fly.dev';
          
          const response = await fetch(`${backendUrl}/auth/google`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: profile.email,
              name: profile.name,
              picture: (profile as GoogleProfile).picture,
              googleId: (profile as GoogleProfile).sub,
              accessToken: account.access_token,
            }),
          });
          
          if (response.ok) {
            const userData = await response.json();
            
            if (userData.accessToken) {
              token.accessToken = userData.accessToken;
              token.userId = userData.user?.id || userData.user?._id || profile.email;
              token.userEmail = profile.email;
              token.onboardingCompleted = userData.user?.onboardingCompleted || false;
              // Set flag to determine if this is login vs signup
              token.isNewUser = !userData.user?.onboardingCompleted;
              return token;
            }
          } else {
            return { ...token, error: "BackendAuthenticationError" };
          }
        } catch {
          return { ...token, error: "BackendFetchError" };
        }
      } else if (trigger === "update" && session) {
        if (session.onboardingCompleted !== undefined) {
          token.onboardingCompleted = session.onboardingCompleted;
          // Once onboarding is completed, user is no longer "new"
          if (session.onboardingCompleted) {
            token.isNewUser = false;
          }
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.userId = token.userId as string;
      
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.onboardingCompleted = token.onboardingCompleted as boolean || false;
        (session.user as any).isNewUser = token.isNewUser as boolean || false;
      }
      
      return session;
    },
    async signIn({ account, profile, user }) {
      if (account?.provider === "google" && profile?.email) {
        if ((user as any)?.error) {
          return false;
        }
        return true;
      }
      return false;
    },
    async redirect({ url, baseUrl }) {
      // For OAuth callbacks, redirect to home page and let middleware handle final redirect
      if (url.includes('/api/auth/callback/')) {
        return `${baseUrl}/`;
      }

      // If URL already specified and valid, use it
      if (url.startsWith(baseUrl)) {
        return url;
      }

      // Default to home page, let middleware handle redirects
      return `${baseUrl}/`;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  debug: process.env.NODE_ENV === 'development',
};
