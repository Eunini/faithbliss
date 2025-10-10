/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/auth.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { JWT } from "next-auth/jwt";

// Define a type for the backend response to ensure type safety
interface BackendAuthResponse {
  accessToken: string;
  refreshToken: string; // Added for token refresh
  accessTokenExpiresIn: number; // Added for token refresh (in seconds)
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

/**
 * Refreshes the access token using the httpOnly refresh token cookie.
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined");
    }

    // The backend expects a POST request to /auth/refresh.
    // It will use the httpOnly cookie to identify the user and issue a new token.
    // We don't need to send the refresh token in the body.
    const response = await fetch(`${backendUrl}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Failed to refresh access token:", response.status, errorBody);
      return {
        ...token,
        error: "RefreshAccessTokenError",
      };
    }

    // The backend should return a new access token and its expiry.
    const refreshedData = await response.json() as Pick<
      BackendAuthResponse,
      "accessToken" | "accessTokenExpiresIn"
    >;

    return {
      ...token,
      accessToken: refreshedData.accessToken,
      accessTokenExpiresAt: Date.now() + refreshedData.accessTokenExpiresIn * 1000,
      error: undefined, // Clear any previous errors
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
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
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        try {
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
          const response = await fetch(`${backendUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Invalid email or password");
          }

          const backendResponse = await response.json();
          
          return {
            id: backendResponse.user.id,
            email: backendResponse.user.email,
            name: backendResponse.user.name,
            accessToken: backendResponse.accessToken,
            accessTokenExpiresIn: backendResponse.accessTokenExpiresIn,
            onboardingCompleted: backendResponse.user.onboardingCompleted,
            isNewUser: !backendResponse.user.onboardingCompleted,
          };
        } catch (error: any) {
          // The error thrown here will be displayed on the login page
          throw new Error(error.message || "An error occurred during sign-in.");
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login", // Redirect users to login page on error
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && profile) {
        const backendResponse = await syncWithBackend(profile as GoogleProfile);

        if (!backendResponse) {
          return false;
        }

        // We only need to attach the data the frontend can access.
        // The refresh token is handled by the httpOnly cookie.
        user.accessToken = backendResponse.accessToken;
        user.accessTokenExpiresIn = backendResponse.accessTokenExpiresIn;
        user.id = backendResponse.user.id;
        user.onboardingCompleted = backendResponse.user.onboardingCompleted;
        user.isNewUser = !backendResponse.user.onboardingCompleted;
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken as string;
        // No need to store refreshToken here anymore
        token.accessTokenExpiresAt = Date.now() + (user.accessTokenExpiresIn as number) * 1000;
        token.userId = user.id as string;
        token.onboardingCompleted = user.onboardingCompleted as boolean;
        token.isNewUser = user.isNewUser as boolean;
      }

      const isTokenValid = Date.now() < (token.accessTokenExpiresAt as number);
      if (isTokenValid) {
        return token;
      }

      console.log("Access token expired, attempting to refresh via httpOnly cookie...");
      return refreshAccessToken(token);
    },

    /**
     * The `session` callback is invoked whenever a session is accessed.
     * It uses the data from the `jwt` token to populate the session object.
     */
    async session({ session, token }) {
      // Transfer the custom data from the JWT (token) to the session object
      session.accessToken = token.accessToken as string;
      session.userId = token.userId as string;
      session.error = token.error as "RefreshAccessTokenError" | undefined;

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
