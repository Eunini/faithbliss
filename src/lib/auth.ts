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
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        // Use email as the user ID
        if (profile?.email && !token.userId) {
          token.userId = profile.email;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken as string;
      session.userId = token.userId as string;
      return session;
    },
    async signIn({ account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        // Register/update user in our backend
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
            console.log('User registered with backend successfully:', userData);
            return true;
          } else {
            const error = await response.json().catch(() => null);
            console.error('Backend registration failed:', error);
            return false;
          }
        } catch (error) {
          console.error('Failed to connect to backend:', error);
          return false;
        }
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