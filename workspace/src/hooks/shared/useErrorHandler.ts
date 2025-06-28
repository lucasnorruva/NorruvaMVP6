// src/hooks/shared/useErrorHandler.ts
"use client";

import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { ApiError } from '@/types/products';
import { AlertTriangle } from 'lucide-react';
import React from 'react';

export function useErrorHandler() {
  const { toast } = useToast();

  const handleError = useCallback(
    (error: ApiError | Error, defaultMessage: string = 'An unexpected error occurred.') => {
      console.error(defaultMessage, error);

      let description = defaultMessage;
      if ('message' in error && error.message) {
        description = error.message;
      }

      toast({
        title: 'Error',
        description,
        variant: 'destructive',
        action: <AlertTriangle className="text-white h-5 w-5" />
      });
    },
    [toast]
  );

  return { handleError };
}
