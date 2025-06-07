
// Mark as a Client Component
"use client";

import { useEffect } from 'react';
import Link from 'next/link'; // Import Link
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Import Card components

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error Page Caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-6 bg-background">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="w-16 h-16 text-destructive" />
          </div>
          <CardTitle className="text-3xl font-headline text-destructive">Oops! Something Went Wrong</CardTitle>
          <CardDescription className="text-md text-muted-foreground mt-2">
            We're sorry for the inconvenience. An unexpected error has occurred while trying to process your request. Our team has been notified of this issue (conceptually).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error?.message && (
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-medium text-foreground">Error Details:</p>
              <p className="text-xs text-muted-foreground break-words">{error.message}</p>
              {error.digest && <p className="text-xs text-muted-foreground mt-1">Digest: {error.digest}</p>}
            </div>
          )}
          
          <div>
            <p className="text-sm text-foreground mb-2 font-medium">What you can try:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Click the "Try Again" button below to refresh the page.</li>
              <li>Ensure your internet connection is stable.</li>
              <li>Return to the <Link href="/dashboard" className="text-primary hover:underline">Dashboard</Link> and try navigating again.</li>
              <li>If the problem persists, please note the error details and contact support (if available).</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 border-t">
            <Button
              onClick={() => reset()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
              size="lg"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button variant="outline" asChild size="lg" className="w-full sm:w-auto">
              <Link href="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
