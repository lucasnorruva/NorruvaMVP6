// --- File: SustainabilityTabContent.tsx ---
"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { ProductFormData } from "@/types/productFormTypes";

export default function SustainabilityTabContent() {
  const form = useFormContext<ProductFormData>();

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="sustainability.recycledContentPercentage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Recycled Content (%)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="e.g., 70" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="sustainability.materials"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Key Materials</FormLabel>
            <FormControl>
              <Textarea placeholder="List key materials, e.g., Recycled Steel, Organic Cotton" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
