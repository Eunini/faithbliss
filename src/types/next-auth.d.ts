// src/types/next-auth.d.ts
import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Extends the built-in User model from NextAuth.js.
   */
  interface User {
    id: string;
    accessToken?: string;
    accessTokenExpiresIn?: number;
    onboardingCompleted?: boolean;
    isNewUser?: boolean;
  }

  /**
   * Extends the built-in Session model from NextAuth.js.
   */
  interface Session {
    accessToken?: string;
    error?: 'RefreshAccessTokenError';
    user: {
      id: string;
      onboardingCompleted?: boolean;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extends the built-in JWT model from NextAuth.js.
   */
  interface JWT {
    accessToken?: string;
    accessTokenExpiresAt?: number;
    userId?: string;
    onboardingCompleted?: boolean;
    isNewUser?: boolean;
    error?: 'RefreshAccessTokenError';
  }
}
