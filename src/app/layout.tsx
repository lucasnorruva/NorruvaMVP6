import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { RoleProvider } from '@/contexts/RoleContext'; // Import RoleProvider
import { SkipToContent } from '@/components/layout/SkipToContent'

export const metadata: Metadata = {
  title: 'Norruva Digital Product Passport',
  description: 'Secure and Compliant Product Data Management',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Inter is already included, Space Grotesk is removed as per new typography guidelines for general text. Logo might still use it. */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <SkipToContent />
        <RoleProvider> {/* RoleProvider now wraps all children at the root level */}
          {children}
        </RoleProvider>
        <Toaster />
      </body>
    </html>
  );
}
