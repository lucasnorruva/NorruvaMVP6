// Mark as a Client Component
"use client";

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-6">
      <AlertTriangle className="w-16 h-16 text-destructive mb-6" />
      <h1 className="text-4xl font-headline font-semibold mb-4 text-destructive">Something went wrong!</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        We're sorry, but an unexpected error occurred. You can try to refresh the page or contact support if the problem persists.
      </p>
      {error?.message && (
        <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md mb-6">
          Error details: {error.message}
        </p>
      )}
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        className="bg-primary text-primary-foreground hover:bg-primary/90"
        size="lg"
      >
        Try Again
      </Button>
    </div>
  );
}
