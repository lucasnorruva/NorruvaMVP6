
// --- File: TechnicalSpecificationsFormSection.tsx ---
// Description: Form section component for technical specifications.
"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Cpu, Loader2, Sparkles } from "lucide-react";
import type { ProductFormData } from "@/components/products/ProductForm";
import type { InitialProductFormData } from "@/app/(app)/products/new/page";

interface AiIndicatorProps {
  fieldOrigin?: 'AI_EXTRACTED' | 'manual';
  fieldName: string;
}

const AiIndicator: React.FC<AiIndicatorProps> = ({ fieldOrigin, fieldName }) => {
  if (fieldOrigin === 'AI_EXTRACTED') {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger type="button" className="ml-1.5 cursor-help align-middle">
            <Cpu className="h-4 w-4 text-info" />
          </TooltipTrigger>
          <TooltipContent>
            <p>This {fieldName.toLowerCase()} was suggested by AI document extraction.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  return null;
};

interface TechnicalSpecificationsFormSectionProps {
  form: UseFormReturn<ProductFormData>;
  initialData?: Partial<InitialProductFormData>;
  isSuggestingSpecs: boolean;
  callSuggestSpecificationsAI: () => Promise<void>;
  anyAISuggestionInProgress: boolean;
  isSubmittingForm?: boolean;
}

export default function TechnicalSpecificationsFormSection({
  form,
  initialData,
  isSuggestingSpecs,
  callSuggestSpecificationsAI,
  anyAISuggestionInProgress,
  isSubmittingForm,
}: TechnicalSpecificationsFormSectionProps) {
  return (
    <div className="pt-4">
      <FormField
        control={form.control}
        name="specifications"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel className="flex items-center">
                Specifications (JSON)
                <AiIndicator fieldOrigin={initialData?.specificationsOrigin} fieldName="Specifications" />
              </FormLabel>
              <Button type="button" variant="ghost" size="sm" onClick={callSuggestSpecificationsAI} disabled={anyAISuggestionInProgress || !!isSubmittingForm}>
                {isSuggestingSpecs ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-info" />}
                <span className="ml-2">{isSuggestingSpecs ? "Suggesting..." : "Suggest Specs"}</span>
              </Button>
            </div>
            <FormControl><Textarea placeholder='e.g., { "color": "blue", "weight": "10kg" }' {...field} rows={5} /></FormControl>
            <FormDescription>Enter as a JSON object. AI can help suggest a structure. You can pretty-format JSON using online tools before pasting.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
