// --- File: BasicInfoTabContent.tsx ---
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

export default function BasicInfoTabContent() {
  const form = useFormContext<ProductFormData>();

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="productName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g., EcoBoiler X1" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Electronics, Apparel" {...field} />
            </FormControl>
            <FormDescription>
              Specify a category to help with compliance and suggestions.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
