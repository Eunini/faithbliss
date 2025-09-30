import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import { NetworkStatusIndicator } from "@/components/NetworkStatusIndicator";
import "./globals.css";

export const metadata: Metadata = {
  title: "FaithBliss - Find Your Faithful Connection",
  description: "A fun, safe, and faith-driven way to meet people who share your journey. Join the FaithBliss community today!",
  keywords: "Christian dating, faith-based relationships, Christian singles, dating app",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
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
        <AuthProvider>
          {children}
          <NetworkStatusIndicator />
        </AuthProvider>
      </body>
    </html>
  );
}
