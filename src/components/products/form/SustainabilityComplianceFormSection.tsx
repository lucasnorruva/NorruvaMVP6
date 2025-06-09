
// --- File: SustainabilityComplianceFormSection.tsx ---
// Description: Form section component for sustainability and compliance details.
"use client";

import React, { useState } from "react"; // Added useState
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
import AiIndicator from "./AiIndicator"; 
import AiSuggestionDisplay from "./AiSuggestionDisplay";
import { Loader2, Sparkles } from "lucide-react";
import type { ProductFormData } from "@/components/products/ProductForm";
import type { InitialProductFormData } from "@/app/(app)/products/new/page";
import type { ToastInput } from "@/hooks/use-toast"; // Simplified toast type
import { handleSuggestClaimsAI } from "@/utils/aiFormHelpers"; // Import helper

type ToastFn = (input: ToastInput) => void;

interface SustainabilityComplianceFormSectionProps {
  form: UseFormReturn<ProductFormData>;
  initialData?: Partial<InitialProductFormData>;
  suggestedClaims: string[]; // Keep this prop as ProductForm will manage this list
  setSuggestedClaims: React.Dispatch<React.SetStateAction<string[]>>; // Allow ProductForm to set claims
  handleClaimClick: (claim: string) => void;
  isSubmittingForm?: boolean;
  toast: ToastFn; // Added toast prop
}

export default function SustainabilityComplianceFormSection({
  form,
  initialData,
  suggestedClaims,
  setSuggestedClaims, // Destructure setSuggestedClaims
  handleClaimClick,
  isSubmittingForm,
  toast, // Destructure toast
}: SustainabilityComplianceFormSectionProps) {
  const [isSuggestingClaimsInternal, setIsSuggestingClaimsInternal] = useState(false);

  const callSuggestClaimsAIInternal = async () => {
    const claims = await handleSuggestClaimsAI(form, toast, setIsSuggestingClaimsInternal);
    if (claims) {
        setSuggestedClaims(claims); // Update parent state
    } else {
        setSuggestedClaims([]); // Update parent state
    }
  };
  
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
              <Button type="button" variant="ghost" size="sm" onClick={callSuggestClaimsAIInternal} disabled={isSuggestingClaimsInternal || !!isSubmittingForm}>
                {isSuggestingClaimsInternal ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-info" />}
                <span className="ml-2">{isSuggestingClaimsInternal ? "Suggesting..." : "Suggest Claims"}</span>
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
      
      <AiSuggestionDisplay
        suggestions={suggestedClaims}
        onAddSuggestion={handleClaimClick}
        title="AI Suggested Claims:"
        itemNoun="claim"
      />

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
