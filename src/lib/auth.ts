/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/auth.ts
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
    // ---- Handle JWT token creation and backend sync ----
    async jwt({ token, account, profile, trigger, session }) {
      console.log(`--- JWT Callback Triggered --- Trigger: ${trigger}`);

      if (account?.provider === "google" && (trigger === "signIn" || trigger === "signUp")) {
        try {
          const backendUrl =
            process.env.NEXT_PUBLIC_BACKEND_URL || "https://faithbliss-backend.fly.dev";

          console.log("Attempting to authenticate with backend...");
          const res = await fetch(`${backendUrl}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: profile?.email,
              name: profile?.name,
              picture: (profile as GoogleProfile).picture,
              googleId: (profile as GoogleProfile).sub,
              accessToken: account.access_token,
            }),
          });

          if (!res.ok) {
            const errorBody = await res.text();
            console.error(`Backend authentication failed with status: ${res.status}`, errorBody);
            throw new Error(`Backend authentication failed. Status: ${res.status}`);
          }
          const data = await res.json();
          console.log("Backend authentication successful.");

          const user = data.user || {};
          token.accessToken = data.accessToken;
          token.userId = user.id || user._id || profile?.email;
          token.userEmail = profile?.email;
          token.onboardingCompleted = !!user.onboardingCompleted;
          token.isNewUser = !user.onboardingCompleted;
        } catch (error) {
          console.error("JWT callback backend fetch failed:", error);
          token.error = "BackendError";
        }
      }

      if (trigger === "update" && session) {
        console.log("Updating session from client...");
        token.onboardingCompleted = session.onboardingCompleted;
        token.isNewUser = !session.onboardingCompleted;
      }

      console.log("--- JWT Callback Finished ---");
      return token;
    },

    // ---- Handle session data exposure ----
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.userId = token.userId as string;

      if (session.user) {
        session.user.id = token.userId as string;
        (session.user as any).isNewUser = !!token.isNewUser;
        (session.user as any).onboardingCompleted = !!token.onboardingCompleted;
      }

      return session;
    },

    // ---- Allow sign-ins ----
    async signIn({ account, profile }) {
      console.log("--- SignIn Callback Triggered ---");
      if (account?.provider === "google" && profile?.email) {
        console.log("Google sign-in allowed.");
        return true;
      }
      console.log("Sign-in denied.");
      return false;
    },

    // ---- FIXED Redirect Logic ----
    async redirect({ url, baseUrl }) {
      // The `url` is the URL that the user is redirected to after a successful sign-in.
      // It's usually the page they were on before starting the sign-in process.
      // We want to make sure that the user is redirected to a safe page.

      // If the redirect URL is the base URL, it means the user is coming from the login page.
      // In this case, we should redirect them to the dashboard.
      if (url === baseUrl) {
        return `${baseUrl}/dashboard`;
      }

      // If the URL is a relative path, we need to make it absolute.
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }

      // If the URL is on a different domain, we should redirect to the dashboard for security.
      if (new URL(url).origin !== new URL(baseUrl).origin) {
        return `${baseUrl}/dashboard`;
      }

      // Otherwise, the URL is safe and we can redirect to it.
      return url;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },

  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  debug: process.env.NODE_ENV === "development",
};