
// --- File: EthicalSourcingFormSection.tsx ---
// Description: Form section component for ethical sourcing details.
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
// Corrected: Import from the centralized types file
import type { ProductFormData } from "@/types/productFormTypes"; 

interface EthicalSourcingFormSectionProps {
  form: UseFormReturn<ProductFormData>;
}

export default function EthicalSourcingFormSection({
  form,
}: EthicalSourcingFormSectionProps) {
  return (
    <div className="space-y-6 pt-4">
      <FormDescription>
        Provide links or identifiers related to ethical sourcing practices for this product.
      </FormDescription>

      <FormField
        control={form.control}
        name="conflictMineralsReportUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Conflict Minerals Report URL (Optional)</FormLabel>
            <FormControl><Input type="url" placeholder="https://example.com/reports/conflict-minerals.pdf" {...field} value={field.value || ""} /></FormControl>
            <FormDescription>Link to your company's conflict minerals disclosure or report.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="fairTradeCertificationId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fair Trade Certification ID/Link (Optional)</FormLabel>
            <FormControl><Input placeholder="e.g., FLOID 12345 or link to certificate" {...field} value={field.value || ""} /></FormControl>
            <FormDescription>Identifier or URL for any Fair Trade certifications relevant to the product or its components.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="ethicalSourcingPolicyUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ethical Sourcing Policy URL (Optional)</FormLabel>
            <FormControl><Input type="url" placeholder="https://example.com/ethics/sourcing-policy.pdf" {...field} value={field.value || ""} /></FormControl>
            <FormDescription>Link to your company's broader ethical sourcing or supplier code of conduct policy.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

    