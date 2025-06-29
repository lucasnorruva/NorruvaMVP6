// --- File: EsprSpecificsFormSection.tsx ---
// Description: Form section for ESPR-specific narrative details.
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
import { AiIndicator } from "@/components/products/form";
import type { ProductFormData } from "@/types/productFormTypes";
import type { InitialProductFormData } from "@/app/(app)/products/new/page";

interface EsprSpecificsFormSectionProps {
  form: UseFormReturn<ProductFormData>;
  initialData?: Partial<InitialProductFormData>;
}

export default function EsprSpecificsFormSection({
  form,
  initialData,
}: EsprSpecificsFormSectionProps) {
  return (
    <div className="space-y-6 pt-4">
      <FormDescription>
        Provide specific narrative information related to Ecodesign for
        Sustainable Products Regulation (ESPR) requirements.
      </FormDescription>

      <FormField
        control={form.control}
        name="productDetails.esprSpecifics.durabilityInformation"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Durability & Reliability Information
              <AiIndicator
                fieldOrigin={
                  initialData?.productDetailsOrigin?.esprSpecificsOrigin
                    ?.durabilityInformationOrigin
                }
                fieldName="Durability Information"
              />
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe expected lifespan, resistance to wear, testing methods, etc."
                {...field}
                rows={3}
                onChange={(e) => {
                  field.onChange(e);
                  form.setValue(
                    "productDetailsOrigin.esprSpecificsOrigin.durabilityInformationOrigin" as any,
                    "manual",
                  );
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="productDetails.esprSpecifics.repairabilityInformation"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Repairability & Maintainability
              <AiIndicator
                fieldOrigin={
                  initialData?.productDetailsOrigin?.esprSpecificsOrigin
                    ?.repairabilityInformationOrigin
                }
                fieldName="Repairability Information"
              />
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe availability of spare parts, ease of disassembly, repair manuals, repair score (if any)."
                {...field}
                rows={3}
                onChange={(e) => {
                  field.onChange(e);
                  form.setValue(
                    "productDetailsOrigin.esprSpecificsOrigin.repairabilityInformationOrigin" as any,
                    "manual",
                  );
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="productDetails.esprSpecifics.recycledContentSummary"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Recycled Content & Material Efficiency (Summary)
              <AiIndicator
                fieldOrigin={
                  initialData?.productDetailsOrigin?.esprSpecificsOrigin
                    ?.recycledContentSummaryOrigin
                }
                fieldName="Recycled Content Summary"
              />
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Summarize key aspects of recycled content and material efficiency efforts."
                {...field}
                rows={3}
                onChange={(e) => {
                  field.onChange(e);
                  form.setValue(
                    "productDetailsOrigin.esprSpecificsOrigin.recycledContentSummaryOrigin" as any,
                    "manual",
                  );
                }}
              />
            </FormControl>
            <FormDescription>
              This is for a narrative summary. Detailed material breakdowns are
              handled elsewhere.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="productDetails.esprSpecifics.energyEfficiencySummary"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Energy & Resource Efficiency (Summary)
              <AiIndicator
                fieldOrigin={
                  initialData?.productDetailsOrigin?.esprSpecificsOrigin
                    ?.energyEfficiencySummaryOrigin
                }
                fieldName="Energy Efficiency Summary"
              />
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Detail energy consumption in use phase, water usage, etc. Refer to specific metrics if applicable."
                {...field}
                rows={3}
                onChange={(e) => {
                  field.onChange(e);
                  form.setValue(
                    "productDetailsOrigin.esprSpecificsOrigin.energyEfficiencySummaryOrigin" as any,
                    "manual",
                  );
                }}
              />
            </FormControl>
            <FormDescription>
              This is for a narrative summary. Specific energy labels are
              handled elsewhere.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="productDetails.esprSpecifics.substanceOfConcernSummary"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Presence of Substances of Concern (Summary)
              <AiIndicator
                fieldOrigin={
                  initialData?.productDetailsOrigin?.esprSpecificsOrigin
                    ?.substanceOfConcernSummaryOrigin
                }
                fieldName="Substance Summary"
              />
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Declare any substances of concern relevant to ESPR and measures to restrict them. Link to SCIP if applicable."
                {...field}
                rows={3}
                onChange={(e) => {
                  field.onChange(e);
                  form.setValue(
                    "productDetailsOrigin.esprSpecificsOrigin.substanceOfConcernSummaryOrigin" as any,
                    "manual",
                  );
                }}
              />
            </FormControl>
            <FormDescription>
              This is for a narrative summary. Detailed SCIP notifications are
              handled elsewhere.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
