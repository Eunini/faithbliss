import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FaithBliss - Find Your Faithful Connection",
  description: "A fun, safe, and faith-driven way to meet people who share your journey. Join the FaithBliss community today!",
  keywords: "Christian dating, faith-based relationships, Christian singles, dating app",
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
        {children}
      </body>
    </html>
  );
}
