
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { RoleProvider } from '@/contexts/RoleContext';
import { SkipToContent } from '@/components/layout/SkipToContent'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

export const metadata: Metadata = {
  title: 'Norruva Digital Product Passport',
  description: 'Secure and Compliant Product Data Management',
  manifest: '/manifest.json', 
  themeColor: '#29ABE2', // Corrected theme-color to Saturated Blue
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/*
        Next.js will automatically manage the <head> tag.
        Font links are direct children of <html> and Next.js will optimize them.
        Manifest and theme-color are handled by the metadata object.
      */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="preload"
        as="style"
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
      />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <body className="font-body antialiased">
        <SkipToContent />
        <ServiceWorkerRegister />
        <RoleProvider>
          {children}
        </RoleProvider>
        <Toaster />
      </body>
