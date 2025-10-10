// src/types/next-auth.d.ts
import "next-auth";
import { DefaultSession } from "next-auth";
import { JWT as NextAuthJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * The `session` object is what the client-side receives.
   * We are extending it to include the properties we added in the `session` callback.
   */
  interface Session extends DefaultSession {
    accessToken: string;
    userId: string;
    error?: "RefreshAccessTokenError"; // Added to propagate refresh errors
    user: {
      id: string;
      onboardingCompleted: boolean;
      isNewUser: boolean;
    } & DefaultSession["user"];
  }

  /**
   * The `user` object is what is received in the `signIn` callback.
   * We need to extend it to hold the data we fetch from our backend
   * so we can pass it to the `jwt` callback.
   */
  interface User {
    accessToken?: string;
    refreshToken?: string; // Added for token refresh
    accessTokenExpiresIn?: number; // Added for token refresh
    onboardingCompleted?: boolean;
    isNewUser?: boolean;
  }
}

declare module "next-auth/jwt" {
  /**
   * The `token` object is what is passed between the `jwt` and `session` callbacks.
   * We are extending it to include the properties we fetch from our backend.
   */
  interface JWT extends NextAuthJWT {
    accessToken: string;
    refreshToken: string; // Added for token refresh
    accessTokenExpiresAt: number; // Added for token refresh
    userId: string;
    onboardingCompleted: boolean;
    isNewUser: boolean;
    // This error field is useful for passing backend errors to the client
    error?: "RefreshAccessTokenError" | "BackendSyncFailed";
  }
}
