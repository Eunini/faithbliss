/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/auth.ts
import NextAuth, { type Session, type User, type Account, type Profile } from "next-auth";
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
      credentials: "include", // Send cookies with the request
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
      credentials: "include", // Send cookies with the request
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Failed to refresh access token:", response.status, errorBody);
      // This error will be caught by the session callback and can be used to force a sign-out
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
            credentials: "include", // Send cookies with the request
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

          // Handle a flat response structure from the backend
          if (!backendResponse.id) {
            throw new Error("Malformed API response: user ID missing.");
          }
          
          return {
            id: backendResponse.id,
            email: backendResponse.email,
            name: backendResponse.name,
            accessToken: backendResponse.accessToken,
            accessTokenExpiresIn: backendResponse.accessTokenExpiresIn,
            onboardingCompleted: backendResponse.onboardingCompleted,
            isNewUser: !backendResponse.onboardingCompleted,
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
    async signIn({ user, account, profile }: { user: User; account?: Account | null; profile?: Profile }) {
      if (account?.provider === "google" && profile) {
        const backendResponse = await syncWithBackend(profile as GoogleProfile);

        if (!backendResponse || !backendResponse.user?.id) {
          console.error("Google sign-in failed: Malformed response from backend, user ID is missing.");
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

    async jwt({ token, user, trigger, session }: { session?: Session; token: JWT; user?: User; trigger?: "signIn" | "signUp" | "update"; }) {
      // Handle session updates from the client
      if (trigger === "update" && session) {
        token.onboardingCompleted = (session as any).onboardingCompleted;
        return token;
      }
      
      // Initial sign-in
      if (user) {
        const expiresIn = user.accessTokenExpiresIn;
        const expiresInMs = (expiresIn ? parseInt(String(expiresIn), 10) : 3600) * 1000;

        token.accessToken = user.accessToken as string;
        token.accessTokenExpiresAt = Date.now() + expiresInMs;
        token.userId = user.id as string;
        token.onboardingCompleted = user.onboardingCompleted as boolean;
        token.isNewUser = user.isNewUser as boolean;
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpiresAt as number)) {
        return token;
      }

      // Access token has expired, try to update it
      console.log("Access token expired. Refreshing...");
      return refreshAccessToken(token);
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.userId as string;
        session.user.onboardingCompleted = token.onboardingCompleted as boolean;
        session.accessToken = token.accessToken as string;
        // Pass the error to the client-side session
        if (token.error) {
          session.error = token.error as string;
        }
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
