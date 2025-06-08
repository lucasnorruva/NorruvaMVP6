
// --- File: SustainabilityComplianceFormSection.tsx ---
// Description: Form section component for sustainability and compliance details.
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
import { Input } from "@/components/ui/input";
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

interface SustainabilityComplianceFormSectionProps {
  form: UseFormReturn<ProductFormData>;
  initialData?: Partial<InitialProductFormData>;
  isSuggestingClaims: boolean;
  callSuggestClaimsAI: () => Promise<void>;
  suggestedClaims: string[];
  handleClaimClick: (claim: string) => void;
  anyAISuggestionInProgress: boolean;
  isSubmittingForm?: boolean;
}

export default function SustainabilityComplianceFormSection({
  form,
  initialData,
  isSuggestingClaims,
  callSuggestClaimsAI,
  suggestedClaims,
  handleClaimClick,
  anyAISuggestionInProgress,
  isSubmittingForm,
}: SustainabilityComplianceFormSectionProps) {
  return (
    <div className="space-y-6 pt-4">
      <FormField
        control={form.control}
        name="materials"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Key Materials
              <AiIndicator fieldOrigin={initialData?.materialsOrigin} fieldName="Key Materials" />
            </FormLabel>
            <FormControl><Textarea placeholder="e.g., Organic Cotton, Recycled PET" {...field} rows={3} /></FormControl>
            <FormDescription>Primary materials used.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="sustainabilityClaims"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel className="flex items-center">
                Sustainability Claims
                <AiIndicator fieldOrigin={initialData?.sustainabilityClaimsOrigin} fieldName="Sustainability Claims" />
              </FormLabel>
              <Button type="button" variant="ghost" size="sm" onClick={callSuggestClaimsAI} disabled={anyAISuggestionInProgress || !!isSubmittingForm}>
                {isSuggestingClaims ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-info" />}
                <span className="ml-2">{isSuggestingClaims ? "Suggesting..." : "Suggest Claims"}</span>
              </Button>
            </div>
            <FormControl><Textarea placeholder="e.g., - Made with 70% recycled materials" {...field} rows={3} /></FormControl>
            <FormDescription>Highlight key sustainability features. Each claim on a new line, optionally start with '- '. AI suggestions will follow this format.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      {suggestedClaims.length > 0 && (
        <div className="space-y-2 pt-2">
          <p className="text-sm font-medium text-muted-foreground">Click to add suggested claim:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedClaims.map((claim, index) => (
              <Button key={index} type="button" variant="outline" size="sm" onClick={() => handleClaimClick(claim)}>{claim}</Button>
            ))}
          </div>
        </div>
      )}
      <FormField
        control={form.control}
        name="energyLabel"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Energy Label
              <AiIndicator fieldOrigin={initialData?.energyLabelOrigin} fieldName="Energy Label" />
            </FormLabel>
            <FormControl><Input placeholder="e.g., A++" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
