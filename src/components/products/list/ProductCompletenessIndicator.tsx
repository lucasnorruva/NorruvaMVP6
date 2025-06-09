
// --- File: ProductCompletenessIndicator.tsx ---
// Description: Component to display DPP completeness with a progress bar and tooltip.
"use client";

import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle2 } from "lucide-react";

interface CompletenessData {
  score: number;
  filledFields: number;
  totalFields: number;
  missingFields: string[];
}

interface ProductCompletenessIndicatorProps {
  completenessData: CompletenessData;
}

export default function ProductCompletenessIndicator({ completenessData }: ProductCompletenessIndicatorProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <div className="flex items-center w-24 cursor-help">
            <Progress value={completenessData.score} className="h-2 flex-grow [&>div]:bg-primary" />
            <span className="text-xs text-muted-foreground ml-1.5">{completenessData.score}%</span>
          </div>
        </TooltipTrigger>
        <TooltipContent align="start" className="bg-background shadow-xl p-3 rounded-lg border max-w-xs z-50">
          <p className="font-medium text-sm mb-1 text-foreground">DPP Completeness: {completenessData.score}%</p>
          <p className="text-xs text-muted-foreground mb-1">
            ({completenessData.filledFields}/{completenessData.totalFields} essential fields filled)
          </p>
          {completenessData.missingFields.length > 0 ? (
            <>
              <p className="text-xs font-semibold mt-2 text-foreground/90">Missing essential fields:</p>
              <ul className="list-disc list-inside text-xs text-muted-foreground max-h-32 overflow-y-auto space-y-0.5 mt-1">
                {completenessData.missingFields.slice(0, 5).map(field => <li key={field}>{field}</li>)}
                {completenessData.missingFields.length > 5 && (
                  <li>...and {completenessData.missingFields.length - 5} more.</li>
                )}
              </ul>
            </>
          ) : (
            <p className="text-xs text-green-600 flex items-center mt-2">
              <CheckCircle2 className="mr-1 h-3.5 w-3.5"/>All essential fields filled!
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
