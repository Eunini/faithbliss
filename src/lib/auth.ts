// lib/auth.ts - NextAuth configuration
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";

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
    async jwt({ token, account, profile }) {
      // If this is the initial sign-in, exchange Google token for our JWT
      if (account?.provider === "google" && profile?.email) {
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
            console.log('Backend auth response:', userData);
            
            // Store the JWT token from our backend (not the Google token)
            token.accessToken = userData.access_token || userData.token;
            token.userId = userData.user?.id || profile.email;
            token.userEmail = profile.email;
          } else {
            console.error('Backend auth failed');
            // Fallback - we'll handle this in the session
            token.accessToken = undefined;
            token.userId = profile.email;
            token.userEmail = profile.email;
          }
        } catch (error) {
          console.error('Failed to exchange token with backend:', error);
          token.accessToken = undefined;
          token.userId = profile.email;
          token.userEmail = profile.email;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client - now with proper JWT token
      session.accessToken = token.accessToken as string;
      session.userId = token.userId as string;
      return session;
    },
    async signIn({ account, profile }) {
      // Allow sign-in for Google OAuth
      if (account?.provider === "google" && profile?.email) {
        return true;
      }
      return true;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
  },
};