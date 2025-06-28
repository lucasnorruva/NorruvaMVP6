// src/components/products/ui/ProductCompletenessIndicator.tsx
/**
 * Progress indicator for product data completeness
 */
"use client";

import React, { memo } from 'react';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ProductCompletenessIndicatorProps {
  score: number;
  size?: 'sm' | 'default' | 'lg';
  showLabel?: boolean;
  details?: {
    filledFields: number;
    totalFields: number;
    missingFields: string[];
  };
}

const ProductCompletenessIndicator = memo<ProductCompletenessIndicatorProps>(({
  score,
  size = 'default',
  showLabel = true,
  details,
}) => {
  const getColorClass = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const sizeClasses = {
    sm: 'h-1.5',
    default: 'h-2',
    lg: 'h-3',
  };

  const content = (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1">
        <Progress 
          value={score} 
          className={`${sizeClasses[size]} bg-muted`}
          indicatorClassName={getColorClass(score)}
        />
      </div>
      {showLabel && (
        <div className="flex items-center gap-1">
          {score === 100 ? (
            <CheckCircle2 className="h-3 w-3 text-green-600" />
          ) : score < 50 ? (
            <AlertCircle className="h-3 w-3 text-red-600" />
          ) : null}
          <span className="text-xs text-muted-foreground font-medium">
            {score}%
          </span>
        </div>
      )}
    </div>
  );

  if (!details) {
    return content;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">
            {content}
          </div>
        </TooltipTrigger>
        <TooltipContent align="start" className="max-w-xs">
          <div className="space-y-2">
            <p className="font-medium">Data Completeness: {score}%</p>
            <p className="text-xs">
              {details.filledFields}/{details.totalFields} fields completed
            </p>
            {details.missingFields.length > 0 && (
              <div>
                <p className="text-xs font-medium mb-1">Missing fields:</p>
                <ul className="text-xs space-y-0.5">
                  {details.missingFields.slice(0, 5).map(field => (
                    <li key={field}>• {field}</li>
                  ))}
                  {details.missingFields.length > 5 && (
                    <li>• ...and {details.missingFields.length - 5} more</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

ProductCompletenessIndicator.displayName = 'ProductCompletenessIndicator';

export { ProductCompletenessIndicator };
