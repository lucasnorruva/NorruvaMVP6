// --- File: TechnicalDetailsTabContent.tsx ---
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
import { Input } from "@/components/ui/input";
import type { ProductFormData } from "@/types/productFormTypes";

export default function TechnicalDetailsTabContent() {
  const form = useFormContext<ProductFormData>();

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="technical.modelNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Model Number</FormLabel>
            <FormControl>
              <Input placeholder="e.g., XG-500-ECO" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <FormField
        control={form.control}
        name="technical.gtin"
        render={({ field }) => (
          <FormItem>
            <FormLabel>GTIN (Global Trade Item Number)</FormLabel>
            <FormControl>
              <Input placeholder="e.g., 01234567890123" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
