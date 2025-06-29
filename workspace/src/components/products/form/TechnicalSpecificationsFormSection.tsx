// --- File: TechnicalSpecificationsFormSection.tsx ---
// Description: Form section component for technical specifications.
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
import { Button } from "@/components/ui/button";
import { AiIndicator } from "@/components/products/form"; // Import from barrel
import { Loader2, Sparkles } from "lucide-react";
import type { ProductFormData } from "@/types/productFormTypes"; // Corrected import
import type { InitialProductFormData } from "@/app/(app)/products/new/page";
import type { ToastInput } from "@/hooks/use-toast";
import { handleSuggestSpecificationsAI } from "@/utils/aiFormHelpers"; // Import helper

type ToastFn = (input: ToastInput) => void;

interface TechnicalSpecificationsFormSectionProps {
  form: UseFormReturn<ProductFormData>;
  initialData?: Partial<InitialProductFormData>;
  isSubmittingForm?: boolean;
  toast: ToastFn;
}

export default function TechnicalSpecificationsFormSection({
  form,
  initialData,
  isSubmittingForm,
  toast,
}: TechnicalSpecificationsFormSectionProps) {
  const [isSuggestingSpecsInternal, setIsSuggestingSpecsInternal] =
    useState(false);

  const callSuggestSpecificationsAIInternal = async () => {
    const result = await handleSuggestSpecificationsAI(
      form,
      toast,
      setIsSuggestingSpecsInternal,
    );
    if (result) {
      form.setValue("specifications", result, { shouldValidate: true });
      form.setValue("specificationsOrigin", "AI_EXTRACTED");
    }
  };

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
                <AiIndicator
                  fieldOrigin={
                    form.getValues("specificationsOrigin") ||
                    initialData?.specificationsOrigin
                  }
                  fieldName="Specifications"
                />
              </FormLabel>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={callSuggestSpecificationsAIInternal}
                disabled={isSuggestingSpecsInternal || !!isSubmittingForm}
              >
                {isSuggestingSpecsInternal ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 text-info" />
                )}
                <span className="ml-2">
                  {isSuggestingSpecsInternal
                    ? "Suggesting..."
                    : "Suggest Specs"}
                </span>
              </Button>
            </div>
            <FormControl>
              <Textarea
                placeholder='e.g., { "color": "blue", "weight": "10kg" }'
                {...field}
                rows={5}
                onChange={(e) => {
                  field.onChange(e);
                  form.setValue("specificationsOrigin", "manual");
                }}
              />
            </FormControl>
            <FormDescription>
              Enter as a JSON object. AI can help suggest a structure. You can
              pretty-format JSON using online tools before pasting.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
