// types/next-auth.d.ts - NextAuth type extensions
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    userId: string;
    accessToken: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      onboardingCompleted?: boolean;
      isNewUser?: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    userId: string;
    onboardingCompleted?: boolean;
    isNewUser?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    userEmail?: string;
    accessToken?: string;
    onboardingCompleted?: boolean;
    isNewUser?: boolean;
  }
}