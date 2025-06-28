// --- File: ComplianceRegulationsTabContent.tsx ---
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

export default function ComplianceRegulationsTabContent() {
  const form = useFormContext<ProductFormData>();

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="compliance.eprelId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>EPREL ID (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="EPREL Database ID" {...field} />
            </FormControl>
            <FormDescription>
              European Product Registry for Energy Labelling ID.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* Add other compliance fields here in the future */}
    </div>
  );
}
