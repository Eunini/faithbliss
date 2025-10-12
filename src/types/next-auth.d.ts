// src/types/next-auth.d.ts
import 'next-auth';
import type { User as NextAuthUser } from 'next-auth';

declare module 'next-auth' {
  interface User extends NextAuthUser {
    accessToken?: string;
    accessTokenExpiresIn?: number;
    onboardingCompleted?: boolean;
    isNewUser?: boolean;
  }

  interface Session {
    accessToken?: string;
    userId?: string;
    error?: 'RefreshAccessTokenError';
    user: {
      id: string;
      onboardingCompleted: boolean;
      isNewUser: boolean;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    accessTokenExpiresAt?: number;
    userId?: string;
    onboardingCompleted?: boolean;
    isNewUser?: boolean;
    error?: 'RefreshAccessTokenError';
  }
}