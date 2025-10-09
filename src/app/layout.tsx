import SessionProviderWrapper from '@/components/SessionProviderWrapper';
import { ToastProvider } from "@/contexts/ToastContext";
import "./globals.css";

export const metadata = {
  title: "FaithBliss",
  description: "Find your soulmate",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>
          <ToastProvider>
            {children}
          </ToastProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
