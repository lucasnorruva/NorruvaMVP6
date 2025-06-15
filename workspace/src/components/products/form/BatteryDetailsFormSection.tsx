
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
import { AiIndicator } from "@/components/products/form"; // Import from barrel
import type { ProductFormData } from "@/types/productFormTypes"; // Corrected import
import type { InitialProductFormData } from "@/app/(app)/products/new/page";
import { suggestBatteryDetails } from "@/ai/flows/suggest-battery-details-flow";
import type { ToastInput } from "@/hooks/use-toast";
import { Sparkles, Loader2, AlertTriangle, PlusCircle, Trash2, Info } from "lucide-react";
import type { BatteryRegulationDetails, CarbonFootprintData, StateOfHealthData, RecycledContentData } from "@/types/dpp";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
      if (result.suggestedBatteryPassportId) {
        form.setValue("batteryRegulation.batteryPassportId", result.suggestedBatteryPassportId, { shouldValidate: true });
        form.setValue(`${originPath}.batteryPassportIdOrigin` as any, 'AI_EXTRACTED');
        suggestionsMade = true;
      }
      if (result.suggestedCarbonFootprint) {
        const cf = result.suggestedCarbonFootprint;
        if (cf.value !== undefined && cf.value !== null) { form.setValue("batteryRegulation.carbonFootprint.value", cf.value, { shouldValidate: true }); form.setValue(`${originPath}.carbonFootprintOrigin.valueOrigin` as any, 'AI_EXTRACTED'); suggestionsMade = true; }
        if (cf.unit) { form.setValue("batteryRegulation.carbonFootprint.unit", cf.unit); form.setValue(`${originPath}.carbonFootprintOrigin.unitOrigin` as any, 'AI_EXTRACTED'); suggestionsMade = true; }
        if (cf.calculationMethod) { form.setValue("batteryRegulation.carbonFootprint.calculationMethod", cf.calculationMethod); form.setValue(`${originPath}.carbonFootprintOrigin.calculationMethodOrigin` as any, 'AI_EXTRACTED'); suggestionsMade = true; }
      }
      if (result.suggestedRecycledContent && result.suggestedRecycledContent.length > 0) {
        const currentRecycledContent = form.getValues("batteryRegulation.recycledContent") || [];
        const newContent = result.suggestedRecycledContent
          .filter(s => s.material && s.percentage !== undefined && s.percentage !== null)
          .map(s => ({ material: s.material!, percentage: s.percentage!, source: s.source || "Unknown", vcId: s.vcId || "" })); // Ensure source is always a string
          
        form.setValue("batteryRegulation.recycledContent", [...currentRecycledContent, ...newContent]);
        // This origin marking is conceptual; more complex for arrays
        suggestionsMade = true;
      }
      if (result.suggestedStateOfHealth) {
        const soh = result.suggestedStateOfHealth;
        if (soh.value !== undefined && soh.value !== null) { form.setValue("batteryRegulation.stateOfHealth.value", soh.value, { shouldValidate: true }); form.setValue(`${originPath}.stateOfHealthOrigin.valueOrigin` as any, 'AI_EXTRACTED'); suggestionsMade = true; }
        if (soh.unit) { form.setValue("batteryRegulation.stateOfHealth.unit", soh.unit); form.setValue(`${originPath}.stateOfHealthOrigin.unitOrigin` as any, 'AI_EXTRACTED'); suggestionsMade = true; }
        if (soh.measurementDate) { form.setValue("batteryRegulation.stateOfHealth.measurementDate", soh.measurementDate); form.setValue(`${originPath}.stateOfHealthOrigin.measurementDateOrigin` as any, 'AI_EXTRACTED'); suggestionsMade = true; }
      }
      if (result.suggestedBatteryRegulationVcId) {
        form.setValue("batteryRegulation.vcId", result.suggestedBatteryRegulationVcId, { shouldValidate: true });
        form.setValue(`${originPath}.vcIdOrigin` as any, 'AI_EXTRACTED');
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


  const batteryStatusOptions = ['compliant', 'non_compliant', 'pending', 'not_applicable'];
  const recycledContentSourceOptions = ['Pre-consumer', 'Post-consumer', 'Mixed', 'Unknown'];


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
        name="batteryRegulation.status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Battery Regulation Status</FormLabel>
             <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || ""}>
              <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
              <SelectContent>
                {batteryStatusOptions.map(s => <SelectItem key={`batt-status-${s}`} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ')}</SelectItem>)}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField control={form.control} name="batteryRegulation.batteryChemistry"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">Battery Chemistry <AiIndicator fieldOrigin={initialData?.batteryRegulationOrigin?.batteryChemistryOrigin} fieldName="Battery Chemistry" /></FormLabel>
            <FormControl><Input placeholder="e.g., Li-ion NMC, LFP" {...field} onChange={(e) => { field.onChange(e); form.setValue("batteryRegulationOrigin.batteryChemistryOrigin" as any, "manual"); }} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      
      <FormField control={form.control} name="batteryRegulation.manufacturerName"
        render={({ field }) => (
          <FormItem><FormLabel>Battery Manufacturer Name (if different)</FormLabel><FormControl><Input placeholder="e.g., BatteryCells International" {...field} /></FormControl><FormMessage /></FormItem>
        )} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name="batteryRegulation.ratedCapacityAh"
            render={({ field }) => ( <FormItem><FormLabel>Rated Capacity (Ah)</FormLabel><FormControl><Input type="number" placeholder="e.g., 100" {...field} onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem> )}/>
        <FormField control={form.control} name="batteryRegulation.nominalVoltage"
            render={({ field }) => ( <FormItem><FormLabel>Nominal Voltage (V)</FormLabel><FormControl><Input type="number" placeholder="e.g., 48" {...field} onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem> )}/>
        <FormField control={form.control} name="batteryRegulation.expectedLifetimeCycles"
            render={({ field }) => ( <FormItem><FormLabel>Expected Lifetime (Cycles)</FormLabel><FormControl><Input type="number" placeholder="e.g., 3000" {...field} onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem> )}/>
        <FormField control={form.control} name="batteryRegulation.manufacturingDate"
            render={({ field }) => ( <FormItem><FormLabel>Manufacturing Date</FormLabel><FormControl><Input type="date" {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem> )}/>
      </div>
      
      <FormField control={form.control} name="batteryRegulation.batteryPassportId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">Battery Passport ID <AiIndicator fieldOrigin={initialData?.batteryRegulationOrigin?.batteryPassportIdOrigin} fieldName="Battery Passport ID" /></FormLabel>
            <FormControl><Input placeholder="Unique ID for the battery passport itself" {...field} onChange={(e) => { field.onChange(e); form.setValue("batteryRegulationOrigin.batteryPassportIdOrigin" as any, "manual"); }} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      
      {/* Carbon Footprint Section */}
      <div className="p-4 border rounded-md space-y-3 bg-muted/30">
        <h4 className="font-medium text-md text-primary">Manufacturing Carbon Footprint</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={form.control} name="batteryRegulation.carbonFootprint.value"
            render={({ field }) => ( <FormItem> <FormLabel className="flex items-center">Value <AiIndicator fieldOrigin={initialData?.batteryRegulationOrigin?.carbonFootprintOrigin?.valueOrigin} fieldName="CF Value" /></FormLabel> <FormControl><Input type="number" placeholder="e.g., 85.5" {...field} onChange={e => { field.onChange(e.target.value === '' ? null : parseFloat(e.target.value)); form.setValue("batteryRegulationOrigin.carbonFootprintOrigin.valueOrigin" as any, "manual"); }} value={field.value ?? ""} /></FormControl> <FormMessage /> </FormItem> )}/>
          <FormField control={form.control} name="batteryRegulation.carbonFootprint.unit"
            render={({ field }) => ( <FormItem><FormLabel>Unit</FormLabel><FormControl><Input placeholder="e.g., kg CO2e/kWh" {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem> )}/>
        </div>
        <FormField control={form.control} name="batteryRegulation.carbonFootprint.calculationMethod"
          render={({ field }) => ( <FormItem><FormLabel>Calculation Method</FormLabel><FormControl><Input placeholder="e.g., PEFCR for Batteries v1.2" {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem> )}/>
        <FormField control={form.control} name="batteryRegulation.carbonFootprint.dataSource"
          render={({ field }) => ( <FormItem><FormLabel>Primary Data Source</FormLabel><FormControl><Input placeholder="e.g., Internal LCA Study, Supplier Data" {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem> )}/>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField control={form.control} name="batteryRegulation.carbonFootprint.scope1Emissions"
            render={({ field }) => ( <FormItem><FormLabel>Scope 1 Emissions</FormLabel><FormControl><Input type="number" placeholder="tCO2e" {...field} onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem> )}/>
          <FormField control={form.control} name="batteryRegulation.carbonFootprint.scope2Emissions"
            render={({ field }) => ( <FormItem><FormLabel>Scope 2 Emissions</FormLabel><FormControl><Input type="number" placeholder="tCO2e" {...field} onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem> )}/>
          <FormField control={form.control} name="batteryRegulation.carbonFootprint.scope3Emissions"
            render={({ field }) => ( <FormItem><FormLabel>Scope 3 Emissions</FormLabel><FormControl><Input type="number" placeholder="tCO2e" {...field} onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem> )}/>
        </div>
        <FormField control={form.control} name="batteryRegulation.carbonFootprint.vcId"
          render={({ field }) => ( <FormItem><FormLabel>Carbon Footprint VC ID (Optional)</FormLabel><FormControl><Input placeholder="VC ID for carbon footprint data" {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem> )}/>
      </div>

      {/* State of Health Section */}
      <div className="p-4 border rounded-md space-y-3 bg-muted/30">
        <h4 className="font-medium text-md text-primary">State of Health (SoH)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="batteryRegulation.stateOfHealth.value"
            render={({ field }) => ( <FormItem><FormLabel className="flex items-center">Value <AiIndicator fieldOrigin={initialData?.batteryRegulationOrigin?.stateOfHealthOrigin?.valueOrigin} fieldName="SoH Value" /></FormLabel><FormControl><Input type="number" placeholder="e.g., 100 (for new)" {...field} onChange={e => { field.onChange(e.target.value === '' ? null : parseFloat(e.target.value)); form.setValue("batteryRegulationOrigin.stateOfHealthOrigin.valueOrigin" as any, "manual"); }} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem> )}/>
            <FormField control={form.control} name="batteryRegulation.stateOfHealth.unit"
            render={({ field }) => ( <FormItem><FormLabel>Unit</FormLabel><FormControl><Input placeholder="e.g., %" {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem> )}/>
        </div>
        <FormField control={form.control} name="batteryRegulation.stateOfHealth.measurementDate"
          render={({ field }) => ( <FormItem><FormLabel>Measurement Date</FormLabel><FormControl><Input type="date" {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem> )}/>
        <FormField control={form.control} name="batteryRegulation.stateOfHealth.measurementMethod"
          render={({ field }) => ( <FormItem><FormLabel>Measurement Method (Optional)</FormLabel><FormControl><Input placeholder="e.g., Impedance Spectroscopy" {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem> )}/>
        <FormField control={form.control} name="batteryRegulation.stateOfHealth.vcId"
          render={({ field }) => ( <FormItem><FormLabel>State of Health VC ID (Optional)</FormLabel><FormControl><Input placeholder="VC ID for SoH data" {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem> )}/>
      </div>

      {/* Recycled Content Section */}
      <div className="p-4 border rounded-md space-y-3 bg-muted/30">
        <h4 className="font-medium text-md text-primary">Recycled Content in Active Materials</h4>
        {recycledContentFields.map((item, index) => (
          <div key={item.id} className="p-3 border rounded-md bg-background space-y-2 relative">
            <FormField control={form.control} name={`batteryRegulation.recycledContent.${index}.material`}
              render={({ field }) => ( <FormItem><FormLabel>Material</FormLabel><FormControl><Input placeholder="e.g., Cobalt, Lithium, Nickel, Lead" {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem> )}/>
            <FormField control={form.control} name={`batteryRegulation.recycledContent.${index}.percentage`}
              render={({ field }) => ( <FormItem><FormLabel className="flex items-center">Percentage (%) <AiIndicator fieldOrigin={initialData?.batteryRegulationOrigin?.recycledContentOrigin?.[index]?.percentageOrigin} fieldName="Recycled Content %" /></FormLabel><FormControl><Input type="number" placeholder="e.g., 16" {...field} onChange={e => { field.onChange(e.target.value === '' ? null : parseFloat(e.target.value)); form.setValue(`batteryRegulationOrigin.recycledContentOrigin.${index}.percentageOrigin` as any, "manual"); }} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem> )}/>
            <FormField control={form.control} name={`batteryRegulation.recycledContent.${index}.source`}
              render={({ field }) => (
                <FormItem><FormLabel>Source</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || ""}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {recycledContentSourceOptions.map(s => <SelectItem key={`rc-source-${index}-${s}`} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select><FormMessage /></FormItem> )}/>
            <FormField control={form.control} name={`batteryRegulation.recycledContent.${index}.vcId`}
              render={({ field }) => ( <FormItem><FormLabel>VC ID for this material (Optional)</FormLabel><FormControl><Input placeholder="VC ID for specific recycled material claim" {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem> )}/>
            <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 text-destructive" onClick={() => removeRecycledContent(index)} title="Remove this material"> <Trash2 className="h-4 w-4" /> </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => appendRecycledContent({ material: "", percentage: null, source: "Unknown", vcId: "" })}> <PlusCircle className="mr-2 h-4 w-4" /> Add Material for Recycled Content </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name="batteryRegulation.recyclingEfficiencyRate"
            render={({ field }) => ( <FormItem><FormLabel>Recycling Efficiency Rate (%)</FormLabel><FormControl><Input type="number" placeholder="e.g., 75" {...field} onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem> )}/>
         <FormField control={form.control} name="batteryRegulation.materialRecoveryRates.cobalt"
            render={({ field }) => ( <FormItem><FormLabel>Cobalt Recovery Rate (%)</FormLabel><FormControl><Input type="number" placeholder="e.g., 90" {...field} onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem> )}/>
         <FormField control={form.control} name="batteryRegulation.materialRecoveryRates.lead"
            render={({ field }) => ( <FormItem><FormLabel>Lead Recovery Rate (%)</FormLabel><FormControl><Input type="number" placeholder="e.g., 95" {...field} onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem> )}/>
         <FormField control={form.control} name="batteryRegulation.materialRecoveryRates.lithium"
            render={({ field }) => ( <FormItem><FormLabel>Lithium Recovery Rate (%)</FormLabel><FormControl><Input type="number" placeholder="e.g., 50" {...field} onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem> )}/>
         <FormField control={form.control} name="batteryRegulation.materialRecoveryRates.nickel"
            render={({ field }) => ( <FormItem><FormLabel>Nickel Recovery Rate (%)</FormLabel><FormControl><Input type="number" placeholder="e.g., 90" {...field} onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem> )}/>
      </div>

      <FormField control={form.control} name="batteryRegulation.dismantlingInformationUrl"
        render={({ field }) => ( <FormItem><FormLabel>Dismantling Information URL</FormLabel><FormControl><Input type="url" placeholder="https://example.com/dismantling-guide.pdf" {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem> )}/>
      <FormField control={form.control} name="batteryRegulation.safetyInformationUrl"
        render={({ field }) => ( <FormItem><FormLabel>Safety Information URL</FormLabel><FormControl><Input type="url" placeholder="https://example.com/safety-precautions.pdf" {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem> )}/>
      
      <FormField control={form.control} name="batteryRegulation.vcId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">Overall Battery Regulation VC ID (Optional) <AiIndicator fieldOrigin={initialData?.batteryRegulationOrigin?.vcIdOrigin} fieldName="Battery Regulation VC ID" /></FormLabel>
            <FormControl><Input placeholder="VC ID for overall battery regulation compliance" {...field} onChange={(e) => { field.onChange(e); form.setValue("batteryRegulationOrigin.vcIdOrigin" as any, "manual"); }} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
    </div>
  );
}
