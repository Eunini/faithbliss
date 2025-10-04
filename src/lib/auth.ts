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
    async jwt({ token, account, profile, trigger }) {
      // If this is a sign-in or token update
      if ((trigger === "signIn" || trigger === "signUp") && account?.provider === "google" && profile?.email) {
        try {
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://faithbliss-backend.fly.dev';
          
          console.log('🔄 Exchanging Google token for JWT...');
          console.log('📧 Email:', profile.email);
          console.log('🔑 Google token preview:', account.access_token?.substring(0, 20) + '...');
          
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
          
          if (!response.ok) {
            console.error('❌ Backend auth failed - HTTP error:', response.status);
            // Try to get error message from response
            try {
              const errorData = await response.json();
              console.error('Error data:', errorData);
              throw new Error(`Backend authentication failed: ${errorData.message || `HTTP ${response.status}`}`);
            } catch {
              // If can't parse JSON response
              throw new Error(`Backend authentication failed: HTTP ${response.status}`);
            }
          }
          
          const userData = await response.json();
          console.log('📥 Backend auth response received');
          
          if (userData.access_token || userData.token) {
            const jwtToken = userData.access_token || userData.token;
            console.log('✅ JWT token received, preview:', jwtToken.substring(0, 20) + '...');
            
            // Store the JWT token from our backend (not the Google token)
            token.accessToken = jwtToken;
            token.userId = userData.user?.id || profile.email;
            token.userEmail = profile.email;
          } else {
            console.error('❌ Backend auth failed - no JWT token in response');
            console.error('Response data:', userData);
            
            throw new Error(`Backend authentication failed: ${userData.message || 'No JWT token received'}`);
          }
        } catch (error) {
          console.error('💥 Failed to exchange token with backend:', error);
          // Re-throw to fail the sign-in process
          throw error;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client - now with proper JWT token
      session.accessToken = token.accessToken as string;
      session.userId = token.userId as string;
      
      // Add userId to the user object as well for convenience
      if (session.user) {
        session.user.id = token.userId as string;
      }
      
      return session;
    },
    async signIn({ account, profile }) {
      // Allow sign-in for Google OAuth
      if (account?.provider === "google" && profile?.email) {
        return true;
      }
      return true;
    },
    // Custom redirect logic to prevent redirect loops
    async redirect({ url, baseUrl }) {
      // Force redirect to dashboard for all login page redirects
      if (url.includes('/login') || url === baseUrl) {
        console.log('🔀 Intercepted redirect to login, sending to dashboard instead');
        return `${baseUrl}/dashboard`;
      }
      
      // Handle URLs from the same origin
      if (url.startsWith(baseUrl)) {
        console.log(`🔀 Allowing redirect to same-origin URL: ${url}`);
        return url;
      }
      
      // Handle relative URLs
      if (url.startsWith('/')) {
        const fullUrl = new URL(url, baseUrl).toString();
        console.log(`🔀 Converting relative URL to absolute: ${fullUrl}`);
        return fullUrl;
      }
      
      // Default fallback for any other case
      console.log(`🔀 Using default redirect to dashboard`);
      return `${baseUrl}/dashboard`;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
};