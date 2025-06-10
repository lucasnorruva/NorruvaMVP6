import React from 'react';
import { cn } from '@/lib/utils';

export function SkipToContent({ className }: { className?: string }) {
  return (
    <a
      href="#main-content"
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 z-50 bg-primary text-primary-foreground rounded-md p-2",
        className
      )}
    >
      Skip to content
    </a>
  );
}
