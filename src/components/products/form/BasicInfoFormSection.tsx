
// --- File: BasicInfoFormSection.tsx ---
// Description: Form section component for basic product information.
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
import { Button } from "@/components/ui/button";
import AiIndicator from "./AiIndicator"; // Import shared component
import { Loader2, Sparkles } from "lucide-react";
import type { ProductFormData } from "@/components/products/ProductForm";
import type { InitialProductFormData } from "@/app/(app)/products/new/page";

interface BasicInfoFormSectionProps {
  form: UseFormReturn<ProductFormData>;
  initialData?: Partial<InitialProductFormData>;
  isSuggestingName: boolean;
  callSuggestNameAI: () => Promise<void>;
  isSuggestingDescription: boolean;
  callSuggestDescriptionAI: () => Promise<void>;
  anyAISuggestionInProgress: boolean;
  isSubmittingForm?: boolean;
}

export default function BasicInfoFormSection({
  form,
  initialData,
  isSuggestingName,
  callSuggestNameAI,
  isSuggestingDescription,
  callSuggestDescriptionAI,
  anyAISuggestionInProgress,
  isSubmittingForm,
}: BasicInfoFormSectionProps) {
  return (
    <div className="space-y-6 pt-4">
      <FormField
        control={form.control}
        name="productName"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel className="flex items-center">Product Name <AiIndicator fieldOrigin={form.getValues("productNameOrigin") || initialData?.productNameOrigin} fieldName="Product Name" /></FormLabel>
              <Button type="button" variant="ghost" size="sm" onClick={callSuggestNameAI} disabled={anyAISuggestionInProgress || !!isSubmittingForm}>
                {isSuggestingName ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-info" />}
                <span className="ml-2">{isSuggestingName ? "Suggesting..." : "Suggest Name"}</span>
              </Button>
            </div>
            <FormControl>
              <Input
                placeholder="e.g., EcoBoiler X1"
                {...field}
                onChange={(e) => { field.onChange(e); form.setValue("productNameOrigin", "manual"); }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField control={form.control} name="gtin" render={({ field }) => ( <FormItem> <FormLabel>GTIN</FormLabel> <FormControl><Input placeholder="e.g., 01234567890123" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
      <FormField
        control={form.control}
        name="productCategory"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product Category</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Electronics, Apparel"
                {...field}
              />
            </FormControl>
            <FormDescription>Used to help generate relevant suggestions.</FormDescription>
            <FormMessage />
          </FormItem>
      )}/>
      <FormField
        control={form.control}
        name="productDescription"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel className="flex items-center">Product Description <AiIndicator fieldOrigin={form.getValues("productDescriptionOrigin") || initialData?.productDescriptionOrigin} fieldName="Product Description" /></FormLabel>
              <Button type="button" variant="ghost" size="sm" onClick={callSuggestDescriptionAI} disabled={anyAISuggestionInProgress || !!isSubmittingForm}>
                {isSuggestingDescription ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-info" />}
                <span className="ml-2">{isSuggestingDescription ? "Suggesting..." : "Suggest Description"}</span>
              </Button>
            </div>
            <FormControl>
              <Textarea
                placeholder="Detailed description..."
                {...field}
                rows={4}
                onChange={(e) => { field.onChange(e); form.setValue("productDescriptionOrigin", "manual"); }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
      )}/>
      <div className="grid md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="manufacturer"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">Manufacturer <AiIndicator fieldOrigin={form.getValues("manufacturerOrigin") || initialData?.manufacturerOrigin} fieldName="Manufacturer" /></FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., GreenTech Inc."
                  {...field}
                  onChange={(e) => { field.onChange(e); form.setValue("manufacturerOrigin", "manual"); }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
        )}/>
        <FormField
          control={form.control}
          name="modelNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">Model Number <AiIndicator fieldOrigin={form.getValues("modelNumberOrigin") || initialData?.modelNumberOrigin} fieldName="Model Number" /></FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., GTX-EB-001"
                  {...field}
                  onChange={(e) => { field.onChange(e); form.setValue("modelNumberOrigin", "manual"); }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
        )}/>
      </div>
    </div>
  );
}
