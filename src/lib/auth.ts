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
      console.log('--- JWT Callback ---');
      console.log('Trigger:', trigger);
      console.log('Account:', account);
      console.log('Profile:', profile);
      console.log('Initial Token:', token);

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
            console.log('Backend Response (Success):', userData);
            
            if (userData.accessToken) {
              token.accessToken = userData.accessToken;
              token.userId = userData.user?.id || userData.user?._id || profile.email;
              token.userEmail = profile.email;
              token.onboardingCompleted = userData.user?.onboardingCompleted || false;
              console.log('Token after backend sync:', token);
              return token;
            }
          } else {
            const errorData = await response.json();
            console.error('Backend authentication failed:', errorData);
            return { ...token, error: "BackendAuthenticationError" };
          }
        } catch (error) {
          console.error('Error during backend authentication:', error);
          return { ...token, error: "BackendFetchError" };
        }
      } else if (trigger === "update" && session) {
        console.log('JWT update trigger with session:', session);
        if (session.onboardingCompleted !== undefined) {
          token.onboardingCompleted = session.onboardingCompleted;
        }
      }
      
      console.log('Final Token:', token);
      return token;
    },
    async session({ session, token }) {
      console.log('--- Session Callback ---');
      console.log('Token:', token);
      
      session.accessToken = token.accessToken as string;
      session.userId = token.userId as string;
      
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.onboardingCompleted = token.onboardingCompleted as boolean || false;
      }
      
      console.log('Final Session:', session);
      return session;
    },
    async signIn({ account, profile, user }) {
      console.log('--- SignIn Callback ---');
      console.log('Account:', account);
      console.log('Profile:', profile);
      console.log('User object from JWT:', user);

      if (account?.provider === "google" && profile?.email) {
        if ((user as any)?.error) {
          console.log('Denying sign-in due to error in JWT.');
          return false;
        }
        console.log('Allowing Google sign-in.');
        return true;
      }
      console.log('Denying sign-in for other providers.');
      return false;
    },
    async redirect({ url, baseUrl }) {
      console.log('--- Redirect Callback ---');
      console.log('URL:', url);
      console.log('Base URL:', baseUrl);

      // If URL already specified and valid, use it
      if (url.startsWith(baseUrl)) {
        console.log('Redirecting to provided URL:', url);
        return url;
      }
      if (url.startsWith('/')) {
        const finalUrl = `${baseUrl}${url}`;
        console.log('Redirecting to relative URL:', finalUrl);
        return finalUrl;
      }
      
      // After sign-in, go to onboarding by default
      const defaultRedirect = `${baseUrl}/onboarding`;
      console.log('Defaulting redirect to onboarding:', defaultRedirect);
      return defaultRedirect;
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
