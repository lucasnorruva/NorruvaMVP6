// --- File: AiIndicator.tsx ---
// Description: Shared component to display an AI icon and tooltip for fields suggested by AI.
"use client";

import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Cpu } from "lucide-react";

interface AiIndicatorProps {
  fieldOrigin?: "AI_EXTRACTED" | "manual";
  fieldName: string;
  className?: string;
}

const AiIndicator: React.FC<AiIndicatorProps> = ({
  fieldOrigin,
  fieldName,
  className,
}) => {
  if (fieldOrigin === "AI_EXTRACTED") {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger
            type="button"
            className={`ml-1.5 cursor-help align-middle ${className}`}
          >
            <Cpu className="h-4 w-4 text-info" />
          </TooltipTrigger>
          <TooltipContent>
            <p>This {fieldName.toLowerCase()} was suggested by AI.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  return null;
};

export default AiIndicator;
