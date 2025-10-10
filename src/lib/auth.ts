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
 * Refreshes the access token using the refresh token.
 * This function is called from the `jwt` callback when the access token has expired.
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined");
    }

    const response = await fetch(`${backendUrl}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Failed to refresh access token:", response.status, errorBody);
      return {
        ...token,
        error: "RefreshAccessTokenError",
      };
    }

    const refreshedTokens = (await response.json()) as Pick<
      BackendAuthResponse,
      "accessToken" | "refreshToken" | "accessTokenExpiresIn"
    >;

    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      refreshToken: refreshedTokens.refreshToken,
      accessTokenExpiresAt: Date.now() + refreshedTokens.accessTokenExpiresIn * 1000,
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
            return null;
          }

          const backendResponse = await response.json();
          
          return {
            id: backendResponse.user.id,
            email: backendResponse.user.email,
            name: backendResponse.user.name,
            accessToken: backendResponse.accessToken,
            refreshToken: backendResponse.refreshToken,
            accessTokenExpiresIn: backendResponse.accessTokenExpiresIn,
            onboardingCompleted: backendResponse.user.onboardingCompleted,
            isNewUser: !backendResponse.user.onboardingCompleted,
          };
        } catch (error) {
          console.error("Credentials auth error:", error);
          return null;
        }
      },
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
        user.refreshToken = backendResponse.refreshToken;
        user.accessTokenExpiresIn = backendResponse.accessTokenExpiresIn;
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
        token.refreshToken = user.refreshToken as string;
        token.accessTokenExpiresAt = Date.now() + (user.accessTokenExpiresIn as number) * 1000;
        token.userId = user.id as string;
        token.onboardingCompleted = user.onboardingCompleted as boolean;
        token.isNewUser = user.isNewUser as boolean;
      }

      // If the access token has not expired, return the existing token.
      const isTokenValid = Date.now() < (token.accessTokenExpiresAt as number);
      console.log(`JWT Check: Token is ${isTokenValid ? 'valid' : 'expired'}.`);

      if (isTokenValid) {
        return token;
      }

      // If the access token has expired, try to refresh it.
      console.log("Access token expired, attempting to refresh...");
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
