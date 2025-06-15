
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { RoleProvider } from '@/contexts/RoleContext'; // Import RoleProvider
import { SkipToContent } from '@/components/layout/SkipToContent'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

export const metadata: Metadata = {
  title: 'Norruva Digital Product Passport',
  description: 'Secure and Compliant Product Data Management',
  manifest: '/manifest.json', 
  themeColor: '#1A202C',    
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/*
        No explicit <head> tag here.
        The <link> tags for fonts can be placed directly inside <html>
        if not using next/font. Next.js will move them.
      */}
      {/* Font preconnects and preloads. */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="preload"
        as="style"
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
      />
      {/* Font stylesheets */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      {/*
        The manifest and theme-color meta tags are handled by the metadata object.
      */}
      <body className="font-body antialiased">
        <SkipToContent />
        <ServiceWorkerRegister />
        <RoleProvider> {/* RoleProvider now wraps all children at the root level */}
          {children}
        </RoleProvider>
        <Toaster />
      </body>
    </html>
  );
}
