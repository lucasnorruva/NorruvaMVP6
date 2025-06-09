
// --- File: BatteryDetailsFormSection.tsx ---
// Description: Form section component for battery-specific details in the product form.
"use client";

import React, { useState } from "react"; // Added useState
import type { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AiIndicator from "./AiIndicator"; // Import shared component
import type { ProductFormData } from "@/components/products/ProductForm";
import type { InitialProductFormData } from "@/app/(app)/products/new/page";
import { suggestBatteryDetails } from "@/ai/flows/suggest-battery-details-flow";
import type { ToastInput } from "@/hooks/use-toast";
import { Sparkles, Loader2, AlertTriangle } from "lucide-react";
import ReactDS from "react"; // Aliasing React to avoid conflict if any

type ToastFn = (input: ToastInput) => void;

interface BatteryDetailsFormSectionProps {
  form: UseFormReturn<ProductFormData>;
  initialData?: Partial<InitialProductFormData>;
  isSubmittingForm?: boolean; // Prop to know if the main form is submitting
  toast: ToastFn;
}

export default function BatteryDetailsFormSection({ form, initialData, isSubmittingForm, toast }: BatteryDetailsFormSectionProps) {
  const [isSuggestingBatteryDetails, setIsSuggestingBatteryDetails] = useState(false);

  const handleSuggestBatteryDetails = async () => {
    setIsSuggestingBatteryDetails(true);
    const { productName, productCategory, productDescription } = form.getValues();

    try {
      const result = await suggestBatteryDetails({
        productName: productName || undefined,
        productCategory: productCategory || undefined,
        productDescription: productDescription || undefined,
      });

      let suggestionsMade = false;
      if (result.suggestedBatteryChemistry) {
        form.setValue("batteryChemistry", result.suggestedBatteryChemistry, { shouldValidate: true });
        form.setValue("batteryChemistryOrigin", 'AI_EXTRACTED');
        suggestionsMade = true;
      }
      if (result.suggestedStateOfHealth !== undefined) {
        form.setValue("stateOfHealth", result.suggestedStateOfHealth, { shouldValidate: true });
        form.setValue("stateOfHealthOrigin", 'AI_EXTRACTED');
        suggestionsMade = true;
      }
      if (result.suggestedCarbonFootprintManufacturing !== undefined) {
        form.setValue("carbonFootprintManufacturing", result.suggestedCarbonFootprintManufacturing, { shouldValidate: true });
        form.setValue("carbonFootprintManufacturingOrigin", 'AI_EXTRACTED');
        suggestionsMade = true;
      }
      if (result.suggestedRecycledContentPercentage !== undefined) {
        form.setValue("recycledContentPercentage", result.suggestedRecycledContentPercentage, { shouldValidate: true });
        form.setValue("recycledContentPercentageOrigin", 'AI_EXTRACTED');
        suggestionsMade = true;
      }

      if (suggestionsMade) {
        toast({ title: "Battery Details Suggested", description: "AI has provided suggestions for battery fields.", variant: "default" });
      } else {
        toast({ title: "No Battery Details Suggested", description: "AI did not find relevant battery information to suggest for this product, or the product may not be battery-related.", variant: "default" });
      }

    } catch (error) {
      console.error("Failed to suggest battery details:", error);
      const iconElement = <AlertTriangle className="text-white" />;
      toast({
        title: "Error Suggesting Battery Details",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
        action: iconElement,
      });
    } finally {
      setIsSuggestingBatteryDetails(false);
    }
  };


  return (
    <div className="space-y-6 pt-4">
      <div className="flex justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={handleSuggestBatteryDetails} disabled={isSuggestingBatteryDetails || !!isSubmittingForm}>
            {isSuggestingBatteryDetails ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-info" />}
            <span className="ml-2">{isSuggestingBatteryDetails ? "Suggesting..." : "Suggest Battery Details"}</span>
        </Button>
      </div>

      <FormField
        control={form.control}
        name="batteryChemistry"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Battery Chemistry
              <AiIndicator fieldOrigin={form.getValues("batteryChemistryOrigin") || initialData?.batteryChemistryOrigin} fieldName="Battery Chemistry" />
            </FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Li-ion NMC, LFP"
                {...field}
                onChange={(e) => { field.onChange(e); form.setValue("batteryChemistryOrigin", "manual"); }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="stateOfHealth"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              State of Health (%)
              <AiIndicator fieldOrigin={form.getValues("stateOfHealthOrigin") || initialData?.stateOfHealthOrigin} fieldName="State of Health" />
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="e.g., 98"
                {...field}
                value={field.value ?? ''}
                onChange={e => {
                  field.onChange(e.target.value === '' ? null : e.target.valueAsNumber);
                  form.setValue("stateOfHealthOrigin", "manual");
                }}
              />
            </FormControl>
            <FormDescription>For new products, typically 100%.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="carbonFootprintManufacturing"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Mfg. Carbon Footprint (kg CO₂e/kWh)
              <AiIndicator fieldOrigin={form.getValues("carbonFootprintManufacturingOrigin") || initialData?.carbonFootprintManufacturingOrigin} fieldName="Manufacturing Carbon Footprint" />
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="e.g., 75.5"
                {...field}
                value={field.value ?? ''}
                onChange={e => {
                  field.onChange(e.target.value === '' ? null : e.target.valueAsNumber);
                  form.setValue("carbonFootprintManufacturingOrigin", "manual");
                }}
              />
            </FormControl>
            <FormDescription>Carbon footprint per kWh of total energy over service life.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="recycledContentPercentage"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Recycled Content in Battery (%)
              <AiIndicator fieldOrigin={form.getValues("recycledContentPercentageOrigin") || initialData?.recycledContentPercentageOrigin} fieldName="Recycled Content Percentage" />
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="e.g., 15"
                {...field}
                value={field.value ?? ''}
                onChange={e => {
                  field.onChange(e.target.value === '' ? null : e.target.valueAsNumber);
                  form.setValue("recycledContentPercentageOrigin", "manual");
                }}
              />
            </FormControl>
            <FormDescription>Overall percentage of recycled materials in the battery pack.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
