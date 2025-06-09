
// --- File: BatteryDetailsFormSection.tsx ---
// Description: Form section component for battery-specific details in the product form.
"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AiIndicator from "./AiIndicator"; // Import shared component
import type { ProductFormData } from "@/components/products/ProductForm";
import type { InitialProductFormData } from "@/app/(app)/products/new/page";

interface BatteryDetailsFormSectionProps {
  form: UseFormReturn<ProductFormData>;
  initialData?: Partial<InitialProductFormData>;
}

export default function BatteryDetailsFormSection({ form, initialData }: BatteryDetailsFormSectionProps) {
  return (
    <div className="space-y-6">
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
                placeholder="e.g., Li-ion NMC"
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
              Mfg. Carbon Footprint (kg CO₂e)
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
              Recycled Content (%)
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
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
