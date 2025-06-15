
// --- File: CarbonFootprintFormSection.tsx ---
// Description: Form section component for general product carbon footprint details.
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AiIndicator } from "@/components/products/form";
import type { ProductFormData } from "@/types/productFormTypes";
import type { InitialProductFormData } from "@/app/(app)/products/new/page";

interface CarbonFootprintFormSectionProps {
  form: UseFormReturn<ProductFormData>;
  initialData?: Partial<InitialProductFormData>;
  // isSubmittingForm?: boolean; // If AI suggestions are added
  // toast?: (args: any) => void; // If AI suggestions are added
}

export default function CarbonFootprintFormSection({
  form,
  initialData,
}: CarbonFootprintFormSectionProps) {
  const originPath = "productDetailsOrigin.carbonFootprintOrigin";

  return (
    <div className="space-y-6 pt-4">
      <FormDescription>
        Provide details about the product's overall carbon footprint. This is separate from battery-specific carbon footprint.
      </FormDescription>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="productDetails.carbonFootprint.value"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                Total Value
                <AiIndicator fieldOrigin={initialData?.productDetailsOrigin?.carbonFootprintOrigin?.valueOrigin} fieldName="CF Value" />
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g., 150.5"
                  {...field}
                  onChange={e => {
                    field.onChange(e.target.value === '' ? null : parseFloat(e.target.value));
                    form.setValue(`${originPath}.valueOrigin` as any, "manual");
                  }}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="productDetails.carbonFootprint.unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit</FormLabel>
              <FormControl><Input placeholder="e.g., kg CO2e/unit, kg CO2e/functional_unit" {...field} value={field.value || ""} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="productDetails.carbonFootprint.calculationMethod"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Calculation Method</FormLabel>
            <FormControl><Input placeholder="e.g., ISO 14067, GHG Protocol Product Standard, PEFCR" {...field} value={field.value || ""} /></FormControl>
            <FormDescription>Specify the standard or methodology used for calculation.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="p-4 border rounded-md space-y-3 bg-muted/30">
        <h4 className="font-medium text-md text-primary">GHG Emissions by Scope (Optional)</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="productDetails.carbonFootprint.scope1Emissions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scope 1 Emissions</FormLabel>
                <FormControl><Input type="number" placeholder="tCO2e" {...field} onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} value={field.value ?? ""} /></FormControl>
                <FormDescription className="text-xs">Direct emissions</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="productDetails.carbonFootprint.scope2Emissions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scope 2 Emissions</FormLabel>
                <FormControl><Input type="number" placeholder="tCO2e" {...field} onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} value={field.value ?? ""} /></FormControl>
                <FormDescription className="text-xs">Indirect from purchased energy</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="productDetails.carbonFootprint.scope3Emissions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scope 3 Emissions</FormLabel>
                <FormControl><Input type="number" placeholder="tCO2e" {...field} onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} value={field.value ?? ""} /></FormControl>
                <FormDescription className="text-xs">Other indirect value chain emissions</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <FormField
        control={form.control}
        name="productDetails.carbonFootprint.dataSource"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Primary Data Source(s)</FormLabel>
            <FormControl><Textarea placeholder="Describe the primary sources of data used for the calculation (e.g., supplier data, Ecoinvent, internal measurements)." {...field} value={field.value || ""} rows={2} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="productDetails.carbonFootprint.vcId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Carbon Footprint VC ID (Optional)</FormLabel>
            <FormControl><Input placeholder="Verifiable Credential ID for this carbon footprint data" {...field} value={field.value || ""} /></FormControl>
            <FormDescription>If this data is backed by a Verifiable Credential, provide its ID.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
