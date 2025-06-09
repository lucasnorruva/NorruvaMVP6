
// --- File: src/components/developer/DocsPageLayout.tsx ---
// Description: Reusable layout component for developer documentation pages.
"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Info } from 'lucide-react';

interface DocsPageLayoutProps {
  pageTitle: string;
  pageIcon: React.ElementType;
  alertTitle?: string;
  alertDescription?: string;
  children: React.ReactNode;
  backLink?: string;
  backLinkText?: string;
}

export default function DocsPageLayout({
  pageTitle,
  pageIcon: PageIconComponent,
  alertTitle,
  alertDescription,
  children,
  backLink = "/developer",
  backLinkText = "Back to Developer Portal"
}: DocsPageLayoutProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <PageIconComponent className="mr-3 h-7 w-7 text-primary" />
          {pageTitle}
        </h1>
        <Button variant="outline" asChild>
          <Link href={backLink}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {backLinkText}
          </Link>
        </Button>
      </div>

      {(alertTitle || alertDescription) && (
        <Alert>
          <Info className="h-4 w-4" />
          {alertTitle && <AlertTitle>{alertTitle}</AlertTitle>}
          {alertDescription && <AlertDescription>{alertDescription}</AlertDescription>}
        </Alert>
      )}
      {children}
    </div>
  );
}
