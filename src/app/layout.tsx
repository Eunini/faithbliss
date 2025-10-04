import type { Metadata, Viewport } from "next";
import { NextAuthProvider } from "@/contexts/NextAuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { NetworkStatusIndicator } from "@/components/NetworkStatusIndicator";
import ConnectionStatusBannerWrapper from "@/components/ConnectionStatusBannerWrapper";
import ErrorBoundary from "@/components/ErrorBoundary";
import "./globals.css";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "FaithBliss - Find Your Faithful Connection",
  description: "A fun, safe, and faith-driven way to meet people who share your journey. Join the FaithBliss community today!",
  keywords: "Christian dating, faith-based relationships, Christian singles, dating app",
  other: {
    'format-detection': 'telephone=no',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="font-sans antialiased"
      >
        <NextAuthProvider>
          <ToastProvider>
            <ErrorBoundary>
              <ConnectionStatusBannerWrapper />
              <div className="no-horizontal-scroll">
                {children}
              </div>
              <NetworkStatusIndicator />
            </ErrorBoundary>
          </ToastProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
