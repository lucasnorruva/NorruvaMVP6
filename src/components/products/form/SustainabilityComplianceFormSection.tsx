
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
import AiIndicator from "./AiIndicator"; // Import shared component
import { Loader2, Sparkles, Info } from "lucide-react";
import type { ProductFormData } from "@/components/products/ProductForm";
import type { InitialProductFormData } from "@/app/(app)/products/new/page";

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
              <AiIndicator fieldOrigin={form.getValues("materialsOrigin") || initialData?.materialsOrigin} fieldName="Key Materials" />
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., Organic Cotton, Recycled PET, Aluminum (comma-separated)"
                {...field}
                rows={3}
                onChange={(e) => { field.onChange(e); form.setValue("materialsOrigin", "manual"); }}
              />
            </FormControl>
            <FormDescription>List primary materials. This helps AI suggest relevant claims.</FormDescription>
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
                <AiIndicator fieldOrigin={form.getValues("sustainabilityClaimsOrigin") || initialData?.sustainabilityClaimsOrigin} fieldName="Sustainability Claims" />
              </FormLabel>
              <Button type="button" variant="ghost" size="sm" onClick={callSuggestClaimsAI} disabled={anyAISuggestionInProgress || !!isSubmittingForm}>
                {isSuggestingClaims ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-info" />}
                <span className="ml-2">{isSuggestingClaims ? "Suggesting..." : "Suggest Claims"}</span>
              </Button>
            </div>
            <FormControl>
              <Textarea
                placeholder="e.g., - Made with 70% recycled materials\n- Carbon neutral production"
                {...field}
                rows={4}
                onChange={(e) => { field.onChange(e); form.setValue("sustainabilityClaimsOrigin", "manual"); }}
              />
            </FormControl>
            <FormDescription>
              Enter sustainability claims manually, one per line (optionally start with '- '). Or, use AI suggestions which will be appended.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      {suggestedClaims.length > 0 && (
        <div className="space-y-2 pt-2 border border-dashed p-3 rounded-md bg-muted/30">
          <FormLabel className="text-sm font-medium text-muted-foreground flex items-center">
             <Info className="h-4 w-4 mr-2 text-info"/> AI Suggested Claims (click to add to the textarea above):
          </FormLabel>
          <div className="flex flex-wrap gap-2">
            {suggestedClaims.map((claim, index) => (
              <Button key={index} type="button" variant="outline" size="sm" onClick={() => handleClaimClick(claim)} className="bg-background hover:bg-accent/10">
                {claim}
              </Button>
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
              <AiIndicator fieldOrigin={form.getValues("energyLabelOrigin") || initialData?.energyLabelOrigin} fieldName="Energy Label" />
            </FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., A++, B, Not Applicable"
                {...field}
                onChange={(e) => { field.onChange(e); form.setValue("energyLabelOrigin", "manual"); }}
              />
            </FormControl>
            <FormDescription>Specify the product's energy efficiency rating, if applicable.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
