import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    userId: string;
    user: {
      id: string;
      email: string;
      image?: string;
      name?: string;
      onboardingCompleted?: boolean;
      isNewUser?: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    onboardingCompleted?: boolean;
    isNewUser?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    userId: string;
    onboardingCompleted?: boolean;
    isNewUser?: boolean;
  }
}