// src/lib/auth.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";
// import { JWT } from "next-auth/jwt";

// Define a type for the backend response to ensure type safety
interface BackendAuthResponse {
  accessToken: string;
  user: {
    id: string;
    onboardingCompleted: boolean;
  };
}

// Define a type for the Google profile to ensure type safety
interface GoogleProfile {
  sub: string;
  email: string;
  name: string;
  picture: string;
}

/**
 * Exchanges the Google profile for a backend token.
 * This function is called from the `signIn` and `jwt` callbacks.
 */
async function syncWithBackend(profile: GoogleProfile): Promise<BackendAuthResponse | null> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined");
    }

    const response = await fetch(`${backendUrl}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: profile.email,
        name: profile.name,
        picture: profile.picture,
        googleId: profile.sub,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Backend authentication failed:", response.status, errorBody);
      return null;
    }

    return (await response.json()) as BackendAuthResponse;
  } catch (error) {
    console.error("Error syncing with backend:", error);
    return null;
  }
}

export const config: NextAuthConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true, // Essential for Vercel deployment
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login", // Redirect users to login page on error
  },
  callbacks: {
    /**
     * The `signIn` callback is triggered on a successful sign-in.
     * We use this to sync the user with our backend and attach backend data to the user object.
     */
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && profile) {
        const backendResponse = await syncWithBackend(profile as GoogleProfile);

        if (!backendResponse) {
          // Returning false will prevent the sign-in
          return false;
        }

        // Attach backend data to the user object to be used in other callbacks
        user.accessToken = backendResponse.accessToken;
        user.id = backendResponse.user.id;
        user.onboardingCompleted = backendResponse.user.onboardingCompleted;
        user.isNewUser = !backendResponse.user.onboardingCompleted;
      }
      // Returning true allows the sign-in to proceed
      return true;
    },

    /**
     * The `jwt` callback is invoked whenever a JWT is created or updated.
     * It persists the data from the `user` object (from the `signIn` callback) into the token.
     */
    async jwt({ token, user }) {
      // If the user object exists, it means this is the initial sign-in.
      // Persist the custom data from the user object to the token.
      if (user) {
        token.accessToken = user.accessToken as string;
        token.userId = user.id;
        token.onboardingCompleted = user.onboardingCompleted as boolean;
        token.isNewUser = user.isNewUser as boolean;
      }
      return token;
    },

    /**
     * The `session` callback is invoked whenever a session is accessed.
     * It uses the data from the `jwt` token to populate the session object.
     */
    async session({ session, token }) {
      // Transfer the custom data from the JWT (token) to the session object
      session.accessToken = token.accessToken as string;
      session.userId = token.userId as string;
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.onboardingCompleted = token.onboardingCompleted as boolean;
        session.user.isNewUser = token.isNewUser as boolean;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
