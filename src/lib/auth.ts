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
              return token;
            }
          }
          
          // Fallback: use Google token if backend fails
          token.accessToken = account.access_token;
          token.userId = profile.email;
          token.userEmail = profile.email;
          token.onboardingCompleted = false;
        } catch (error) {
          // Fallback: use Google token on exception
          token.accessToken = account.access_token;
          token.userId = profile.email;
          token.userEmail = profile.email;
          token.onboardingCompleted = false;
        }
      } else if (trigger === "update" && session) {
        // Handle session updates
        if (session.onboardingCompleted !== undefined) {
          token.onboardingCompleted = session.onboardingCompleted;
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
      }
      
      return session;
    },
    async signIn({ account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        return true;
      }
      return false;
    },
    async redirect({ url, baseUrl }) {
      // If URL already specified and valid, use it
      if (url.startsWith(baseUrl)) {
        return url;
      }
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // After sign-in, go to onboarding by default
      // Middleware will redirect to dashboard if already onboarded
      return `${baseUrl}/onboarding`;
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
