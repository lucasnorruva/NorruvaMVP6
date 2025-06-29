// --- File: SustainabilityComplianceFormSection.tsx ---
// Description: Form section component for sustainability and compliance details.
"use client";

import React, { useState } from "react";
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
import { AiIndicator, AiSuggestionDisplay } from "@/components/products/form";
import { Loader2, Sparkles } from "lucide-react";
import type { ProductFormData } from "@/types/productFormTypes";
import type { InitialProductFormData } from "@/app/(app)/products/new/page";
import type { ToastInput } from "@/hooks/use-toast";
import {
  handleSuggestClaimsAI,
  handleSuggestKeyCompliancePointsAI,
} from "@/utils/aiFormHelpers";

type ToastFn = (input: ToastInput) => void;

interface SustainabilityComplianceFormSectionProps {
  form: UseFormReturn<ProductFormData>;
  initialData?: Partial<InitialProductFormData>;
  suggestedClaims: string[];
  setSuggestedClaims: React.Dispatch<React.SetStateAction<string[]>>;
  handleClaimClick: (claim: string) => void;
  suggestedKeyCompliancePoints: string[];
  setSuggestedKeyCompliancePoints: React.Dispatch<
    React.SetStateAction<string[]>
  >;
  isSubmittingForm?: boolean;
  toast: ToastFn;
}

export default function SustainabilityComplianceFormSection({
  form,
  initialData,
  suggestedClaims,
  setSuggestedClaims,
  handleClaimClick,
  suggestedKeyCompliancePoints,
  setSuggestedKeyCompliancePoints,
  isSubmittingForm,
  toast,
}: SustainabilityComplianceFormSectionProps) {
  const [isSuggestingClaimsInternal, setIsSuggestingClaimsInternal] =
    useState(false);
  const [isSuggestingComplianceInternal, setIsSuggestingComplianceInternal] =
    useState(false);

  const callSuggestClaimsAIInternal = async () => {
    const claims = await handleSuggestClaimsAI(
      form,
      toast,
      setIsSuggestingClaimsInternal,
    );
    if (claims) {
      setSuggestedClaims(claims);
    } else {
      setSuggestedClaims([]);
    }
  };

  const callSuggestKeyCompliancePointsAIInternal = async () => {
    const points = await handleSuggestKeyCompliancePointsAI(
      form,
      toast,
      setIsSuggestingComplianceInternal,
    );
    if (points) {
      setSuggestedKeyCompliancePoints(points);
    } else {
      setSuggestedKeyCompliancePoints([]);
    }
  };

  const anyLocalAISuggestionInProgress =
    isSuggestingClaimsInternal || isSuggestingComplianceInternal;

  return (
    <div className="space-y-6 pt-4">
      <FormField
        control={form.control}
        name="productDetails.materials"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Key Materials
              <AiIndicator
                fieldOrigin={
                  form.getValues("productDetailsOrigin.materialsOrigin") ||
                  initialData?.productDetailsOrigin?.materialsOrigin
                }
                fieldName="Key Materials"
              />
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., Organic Cotton, Recycled PET, Aluminum (comma-separated)"
                {...field}
                rows={3}
                onChange={(e) => {
                  field.onChange(e);
                  form.setValue(
                    "productDetailsOrigin.materialsOrigin" as any,
                    "manual",
                  );
                }}
              />
            </FormControl>
            <FormDescription>
              List primary materials. This helps AI suggest relevant claims.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="productDetails.sustainabilityClaims"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel className="flex items-center">
                Sustainability Claims
                <AiIndicator
                  fieldOrigin={
                    form.getValues(
                      "productDetailsOrigin.sustainabilityClaimsOrigin",
                    ) ||
                    initialData?.productDetailsOrigin
                      ?.sustainabilityClaimsOrigin
                  }
                  fieldName="Sustainability Claims"
                />
              </FormLabel>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={callSuggestClaimsAIInternal}
                disabled={anyLocalAISuggestionInProgress || !!isSubmittingForm}
              >
                {isSuggestingClaimsInternal ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 text-info" />
                )}
                <span className="ml-2">
                  {isSuggestingClaimsInternal
                    ? "Suggesting..."
                    : "Suggest Claims"}
                </span>
              </Button>
            </div>
            <FormControl>
              <Textarea
                placeholder="e.g., - Made with 70% recycled materials\n- Carbon neutral production"
                {...field}
                rows={4}
                onChange={(e) => {
                  field.onChange(e);
                  form.setValue(
                    "productDetailsOrigin.sustainabilityClaimsOrigin" as any,
                    "manual",
                  );
                }}
              />
            </FormControl>
            <FormDescription>
              Enter sustainability claims manually, one per line (optionally
              start with '- '). Or, use AI suggestions which will be appended.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <AiSuggestionDisplay
        suggestions={suggestedClaims}
        onAddSuggestion={handleClaimClick}
        title="AI Suggested Sustainability Claims:"
        itemNoun="claim"
      />

      <FormField
        control={form.control}
        name="productDetails.keyCompliancePoints"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel className="flex items-center">
                Key Compliance Points
                <AiIndicator
                  fieldOrigin={
                    form.getValues(
                      "productDetailsOrigin.keyCompliancePointsOrigin",
                    ) ||
                    initialData?.productDetailsOrigin?.keyCompliancePointsOrigin
                  }
                  fieldName="Key Compliance Points"
                />
              </FormLabel>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={callSuggestKeyCompliancePointsAIInternal}
                disabled={anyLocalAISuggestionInProgress || !!isSubmittingForm}
              >
                {isSuggestingComplianceInternal ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 text-info" />
                )}
                <span className="ml-2">
                  {isSuggestingComplianceInternal
                    ? "Suggesting..."
                    : "Suggest Points"}
                </span>
              </Button>
            </div>
            <FormControl>
              <Textarea
                placeholder="e.g., - EU ESPR Compliant\n- RoHS Certified\n- Battery Passport Ready"
                {...field}
                rows={4}
                onChange={(e) => {
                  field.onChange(e);
                  form.setValue(
                    "productDetailsOrigin.keyCompliancePointsOrigin" as any,
                    "manual",
                  );
                }}
              />
            </FormControl>
            <FormDescription>
              List key compliance aspects, one per line. AI can help suggest
              these based on product category and applicable regulations.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <AiSuggestionDisplay
        suggestions={suggestedKeyCompliancePoints}
        onAddSuggestion={(point) => {
          const currentPoints =
            form.getValues("productDetails.keyCompliancePoints") || "";
          form.setValue(
            "productDetails.keyCompliancePoints",
            currentPoints ? `${currentPoints}\n- ${point}` : `- ${point}`,
            { shouldValidate: true },
          );
        }}
        title="AI Suggested Key Compliance Points:"
        itemNoun="compliance point"
      />

      <FormField
        control={form.control}
        name="productDetails.energyLabel"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Energy Label
              <AiIndicator
                fieldOrigin={
                  form.getValues("productDetailsOrigin.energyLabelOrigin") ||
                  initialData?.productDetailsOrigin?.energyLabelOrigin
                }
                fieldName="Energy Label"
              />
            </FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., A++, B, Not Applicable"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  form.setValue(
                    "productDetailsOrigin.energyLabelOrigin" as any,
                    "manual",
                  );
                }}
              />
            </FormControl>
            <FormDescription>
              Specify the product's energy efficiency rating, if applicable.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
