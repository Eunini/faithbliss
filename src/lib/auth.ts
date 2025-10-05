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
          console.log('🌐 Backend URL:', backendUrl);
          
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
          
          console.log('📡 Backend response status:', response.status);
          
          if (!response.ok) {
            console.error('❌ Backend auth failed - HTTP error:', response.status);
            const errorText = await response.text();
            console.error('📄 Error response:', errorText);
            
            // Don't throw - allow sign-in to proceed with Google data only
            console.warn('⚠️ Proceeding with Google OAuth only (backend unavailable)');
            token.accessToken = account.access_token; // Use Google token temporarily
            token.userId = profile.email;
            token.userEmail = profile.email;
            token.onboardingCompleted = false; // Assume not onboarded
            return token;
          }
          
          const userData = await response.json();
          console.log('📥 Backend auth response received');
          console.log('🔍 Response structure:', Object.keys(userData));
          
          if (userData.accessToken) {
            const jwtToken = userData.accessToken;
            console.log('✅ JWT token received, preview:', jwtToken.substring(0, 20) + '...');
            
            // Store the JWT token from our backend (not the Google token)
            token.accessToken = jwtToken;
            token.userId = userData.user?.id || userData.user?._id || profile.email;
            token.userEmail = profile.email;
            token.onboardingCompleted = userData.user?.onboardingCompleted || false;
            
            console.log('📋 User onboarding status:', token.onboardingCompleted ? 'Completed' : 'Not completed');
            console.log('🆔 User ID:', token.userId);
          } else {
            console.error('❌ Backend auth failed - no JWT token in response');
            console.error('📄 Response data:', JSON.stringify(userData, null, 2));
            
            // Don't throw - allow sign-in to proceed with Google data only
            console.warn('⚠️ Proceeding with Google OAuth only (no JWT token)');
            token.accessToken = account.access_token; // Use Google token temporarily
            token.userId = profile.email;
            token.userEmail = profile.email;
            token.onboardingCompleted = false; // Assume not onboarded
          }
        } catch (error) {
          console.error('💥 Failed to exchange token with backend:', error);
          console.error('📋 Error details:', error instanceof Error ? error.message : String(error));
          
          // Don't re-throw - allow sign-in to proceed with Google data only
          console.warn('⚠️ Proceeding with Google OAuth only (exception caught)');
          token.accessToken = account.access_token; // Use Google token temporarily
          token.userId = profile.email;
          token.userEmail = profile.email;
          token.onboardingCompleted = false; // Assume not onboarded
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client - now with proper JWT token
      session.accessToken = token.accessToken as string;
      session.userId = token.userId as string;
      
      // Add userId and onboarding status to the user object
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.onboardingCompleted = token.onboardingCompleted as boolean || false;
      }
      
      console.log('📤 Session created with onboarding status:', session.user?.onboardingCompleted);
      
      return session;
    },
    async signIn({ account, profile }) {
      // Allow sign-in for Google OAuth
      if (account?.provider === "google" && profile?.email) {
        console.log('✅ Google OAuth successful for:', profile.email);
        // Return true to allow NextAuth to proceed to the jwt callback
        // The jwt callback will handle the backend token exchange
        return true;
      }
      
      // For other providers or missing data, deny sign-in
      console.warn('⚠️ Sign-in attempt with invalid provider or missing profile');
      return false;
    },
    // Custom redirect logic - simpler approach
    async redirect({ url, baseUrl }) {
      console.log('🔀 Redirect callback triggered');
      console.log('   URL:', url);
      console.log('   Base URL:', baseUrl);
      
      // Check if the URL is trying to redirect to onboarding
      if (url.includes('/onboarding')) {
        console.log('🔀 Allowing redirect to onboarding');
        return url.startsWith('http') ? url : `${baseUrl}${url}`;
      }
      
      // Prevent redirect loops to login page
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
      
      // Default fallback
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