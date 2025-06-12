
// --- File: BatteryDetailsFormSection.tsx ---
// Description: Form section component for battery-specific details in the product form.
"use client";

import React, { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import AiIndicator from "./AiIndicator";
import type { ProductFormData } from "@/components/products/ProductForm";
import type { InitialProductFormData } from "@/app/(app)/products/new/page";
import { suggestBatteryDetails } from "@/ai/flows/suggest-battery-details-flow";
import type { ToastInput } from "@/hooks/use-toast";
import { Sparkles, Loader2, AlertTriangle, PlusCircle, Trash2 } from "lucide-react";
import type { BatteryRegulationDetails, CarbonFootprintData, StateOfHealthData, RecycledContentData } from "@/types/dpp";

type ToastFn = (input: ToastInput) => void;

interface BatteryDetailsFormSectionProps {
  form: UseFormReturn<ProductFormData>;
  initialData?: Partial<InitialProductFormData>;
  isSubmittingForm?: boolean;
  toast: ToastFn;
}

export default function BatteryDetailsFormSection({ form, initialData, isSubmittingForm, toast }: BatteryDetailsFormSectionProps) {
  const [isSuggestingBatteryDetails, setIsSuggestingBatteryDetails] = useState(false);

  const { fields: recycledContentFields, append: appendRecycledContent, remove: removeRecycledContent } = useFieldArray({
    control: form.control,
    name: "batteryRegulation.recycledContent",
  });

  const handleSuggestBatteryDetailsAI = async () => {
    setIsSuggestingBatteryDetails(true);
    const { productName, productCategory, productDescription } = form.getValues();

    try {
      const result = await suggestBatteryDetails({
        productName: productName || undefined,
        productCategory: productCategory || undefined,
        productDescription: productDescription || undefined,
      });

      let suggestionsMade = false;
      const originPath = "batteryRegulationOrigin"; // Base path for origin tracking

      if (result.suggestedBatteryChemistry) {
        form.setValue("batteryRegulation.batteryChemistry", result.suggestedBatteryChemistry, { shouldValidate: true });
        form.setValue(`${originPath}.batteryChemistryOrigin` as any, 'AI_EXTRACTED');
        suggestionsMade = true;
      }
      if (result.suggestedStateOfHealth !== undefined) {
        form.setValue("batteryRegulation.stateOfHealth.value", result.suggestedStateOfHealth, { shouldValidate: true });
        form.setValue(`${originPath}.stateOfHealthOrigin.valueOrigin` as any, 'AI_EXTRACTED');
        suggestionsMade = true;
      }
      if (result.suggestedCarbonFootprintManufacturing !== undefined) {
        form.setValue("batteryRegulation.carbonFootprint.value", result.suggestedCarbonFootprintManufacturing, { shouldValidate: true });
        form.setValue(`${originPath}.carbonFootprintOrigin.valueOrigin` as any, 'AI_EXTRACTED');
        suggestionsMade = true;
      }
      if (result.suggestedRecycledContentPercentage !== undefined) {
        // For simplicity, AI suggests one overall recycled content. We add it as the first item or update if empty.
        if (recycledContentFields.length === 0) {
          appendRecycledContent({ material: "Overall Battery", percentage: result.suggestedRecycledContentPercentage, vcId: "" });
        } else {
          form.setValue(`batteryRegulation.recycledContent.0.percentage`, result.suggestedRecycledContentPercentage, { shouldValidate: true });
        }
        // Conceptual: Mark this first item's percentage as AI suggested
        form.setValue(`${originPath}.recycledContentOrigin.0.percentageOrigin` as any, 'AI_EXTRACTED');
        suggestionsMade = true;
      }
      

      if (suggestionsMade) {
        toast({ title: "Battery Details Suggested", description: "AI has provided suggestions for some battery fields.", variant: "default" });
      } else {
        toast({ title: "No Battery Details Suggested", description: "AI did not find relevant battery information to suggest for this product.", variant: "default" });
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
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">Provide detailed battery information as per EU Battery Regulation. Fields are optional.</p>
        <Button type="button" variant="ghost" size="sm" onClick={handleSuggestBatteryDetailsAI} disabled={isSuggestingBatteryDetails || !!isSubmittingForm}>
            {isSuggestingBatteryDetails ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-info" />}
            <span className="ml-2">{isSuggestingBatteryDetails ? "Suggesting..." : "Suggest Details"}</span>
        </Button>
      </div>

      <FormField
        control={form.control}
        name="batteryRegulation.batteryChemistry"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Battery Chemistry
              <AiIndicator fieldOrigin={initialData?.batteryRegulationOrigin?.batteryChemistryOrigin} fieldName="Battery Chemistry" />
            </FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Li-ion NMC, LFP"
                {...field}
                onChange={(e) => { field.onChange(e); form.setValue("batteryRegulationOrigin.batteryChemistryOrigin" as any, "manual"); }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="batteryRegulation.batteryPassportId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">Battery Passport ID (Optional)</FormLabel>
            <FormControl><Input placeholder="Unique ID for the battery passport itself" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="batteryRegulation.vcId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">Overall Battery Regulation VC ID (Optional)</FormLabel>
            <FormControl><Input placeholder="Verifiable Credential ID for overall compliance" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Carbon Footprint Section */}
      <div className="p-4 border rounded-md space-y-3 bg-muted/30">
        <h4 className="font-medium text-md text-primary">Manufacturing Carbon Footprint</h4>
        <FormField control={form.control} name="batteryRegulation.carbonFootprint.value"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">Value
                <AiIndicator fieldOrigin={initialData?.batteryRegulationOrigin?.carbonFootprintOrigin?.valueOrigin} fieldName="CF Value" />
              </FormLabel>
              <FormControl><Input type="number" placeholder="e.g., 85.5" {...field} onChange={e => { field.onChange(e.target.value === '' ? null : e.target.valueAsNumber); form.setValue("batteryRegulationOrigin.carbonFootprintOrigin.valueOrigin" as any, "manual"); }} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        <FormField control={form.control} name="batteryRegulation.carbonFootprint.unit"
          render={({ field }) => (
            <FormItem><FormLabel>Unit</FormLabel><FormControl><Input placeholder="e.g., kg CO2e/kWh" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        <FormField control={form.control} name="batteryRegulation.carbonFootprint.calculationMethod"
          render={({ field }) => (
            <FormItem><FormLabel>Calculation Method</FormLabel><FormControl><Input placeholder="e.g., PEFCR for Batteries v1.2" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        <FormField control={form.control} name="batteryRegulation.carbonFootprint.vcId"
          render={({ field }) => (
            <FormItem><FormLabel>Carbon Footprint VC ID (Optional)</FormLabel><FormControl><Input placeholder="VC ID for carbon footprint data" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
      </div>

      {/* State of Health Section */}
      <div className="p-4 border rounded-md space-y-3 bg-muted/30">
        <h4 className="font-medium text-md text-primary">State of Health (SoH)</h4>
        <FormField control={form.control} name="batteryRegulation.stateOfHealth.value"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">Value
                <AiIndicator fieldOrigin={initialData?.batteryRegulationOrigin?.stateOfHealthOrigin?.valueOrigin} fieldName="SoH Value" />
              </FormLabel>
              <FormControl><Input type="number" placeholder="e.g., 100 (for new)" {...field} onChange={e => { field.onChange(e.target.value === '' ? null : e.target.valueAsNumber); form.setValue("batteryRegulationOrigin.stateOfHealthOrigin.valueOrigin" as any, "manual"); }} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        <FormField control={form.control} name="batteryRegulation.stateOfHealth.unit"
          render={({ field }) => (
            <FormItem><FormLabel>Unit</FormLabel><FormControl><Input placeholder="e.g., %" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        <FormField control={form.control} name="batteryRegulation.stateOfHealth.measurementDate"
          render={({ field }) => (
            <FormItem><FormLabel>Measurement Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        <FormField control={form.control} name="batteryRegulation.stateOfHealth.vcId"
          render={({ field }) => (
            <FormItem><FormLabel>State of Health VC ID (Optional)</FormLabel><FormControl><Input placeholder="VC ID for SoH data" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
      </div>

      {/* Recycled Content Section */}
      <div className="p-4 border rounded-md space-y-3 bg-muted/30">
        <h4 className="font-medium text-md text-primary">Recycled Content in Active Materials</h4>
        {recycledContentFields.map((item, index) => (
          <div key={item.id} className="p-3 border rounded-md bg-background space-y-2 relative">
            <FormField control={form.control} name={`batteryRegulation.recycledContent.${index}.material`}
              render={({ field }) => (
                <FormItem><FormLabel>Material</FormLabel><FormControl><Input placeholder="e.g., Cobalt, Lithium, Nickel, Lead" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name={`batteryRegulation.recycledContent.${index}.percentage`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">Percentage (%)
                    <AiIndicator fieldOrigin={initialData?.batteryRegulationOrigin?.recycledContentOrigin?.[index]?.percentageOrigin} fieldName="Recycled Content %" />
                  </FormLabel>
                  <FormControl><Input type="number" placeholder="e.g., 16" {...field} onChange={e => { field.onChange(e.target.value === '' ? null : e.target.valueAsNumber); form.setValue(`batteryRegulationOrigin.recycledContentOrigin.${index}.percentageOrigin` as any, "manual"); }} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            <FormField control={form.control} name={`batteryRegulation.recycledContent.${index}.vcId`}
              render={({ field }) => (
                <FormItem><FormLabel>VC ID for this material (Optional)</FormLabel><FormControl><Input placeholder="VC ID for specific recycled material claim" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 text-destructive" onClick={() => removeRecycledContent(index)} title="Remove this material">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => appendRecycledContent({ material: "", percentage: null, vcId: "" })}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Material for Recycled Content
        </Button>
      </div>

    </div>
  );
}
