// --- File: BasicInfoFormSection.tsx ---
// Description: Form section component for basic product information.
"use client";

import React, { useState } from "react"; // Added useState
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
import AiIndicator from "./AiIndicator";
import { Loader2, Sparkles } from "lucide-react";
import type { ProductFormData } from "@/types/productFormTypes"; // Corrected import
import type { InitialProductFormData } from "@/app/(app)/products/new/page";
import type { ToastInput } from "@/hooks/use-toast";
import { handleSuggestNameAI, handleSuggestDescriptionAI } from "@/utils/aiFormHelpers"; // Import helpers

type ToastFn = (input: ToastInput) => void;

interface BasicInfoFormSectionProps {
  form: UseFormReturn<ProductFormData>;
  initialData?: Partial<InitialProductFormData>;
  isSubmittingForm?: boolean;
  toast: ToastFn; // Added toast prop
}

export default function BasicInfoFormSection({
  form,
  initialData,
  isSubmittingForm,
  toast, // Destructure toast
}: BasicInfoFormSectionProps) {
  const [isSuggestingNameInternal, setIsSuggestingNameInternal] = useState(false);
  const [isSuggestingDescriptionInternal, setIsSuggestingDescriptionInternal] = useState(false);

  const callSuggestNameAIInternal = async () => {
    const result = await handleSuggestNameAI(form, toast, setIsSuggestingNameInternal);
    if (result) {
      form.setValue("productName", result, { shouldValidate: true });
      form.setValue("productNameOrigin", 'AI_EXTRACTED');
    }
  };

  const callSuggestDescriptionAIInternal = async () => {
    const result = await handleSuggestDescriptionAI(form, toast, setIsSuggestingDescriptionInternal);
    if (result) {
      form.setValue("productDescription", result, { shouldValidate: true });
      form.setValue("productDescriptionOrigin", 'AI_EXTRACTED');
    }
  };

  const anyLocalAISuggestionInProgress = isSuggestingNameInternal || isSuggestingDescriptionInternal;

  return (
    <div className="space-y-6 pt-4">
      <FormField
        control={form.control}
        name="productName"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel className="flex items-center">Product Name <AiIndicator fieldOrigin={form.getValues("productNameOrigin") || initialData?.productNameOrigin} fieldName="Product Name" /></FormLabel>
              <Button type="button" variant="ghost" size="sm" onClick={callSuggestNameAIInternal} disabled={anyLocalAISuggestionInProgress || !!isSubmittingForm}>
                {isSuggestingNameInternal ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-info" />}
                <span className="ml-2">{isSuggestingNameInternal ? "Suggesting..." : "Suggest Name"}</span>
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
      <FormField control={form.control} name="sku" render={({ field }) => (<FormItem><FormLabel>SKU</FormLabel><FormControl><Input placeholder="e.g., SKU123" {...field} /></FormControl><FormMessage /></FormItem>)}/>
      <FormField control={form.control} name="nfcTagId" render={({ field }) => (<FormItem><FormLabel>NFC Tag ID</FormLabel><FormControl><Input placeholder="e.g., NFC-ABC123" {...field} /></FormControl><FormMessage /></FormItem>)}/>
      <FormField control={form.control} name="rfidTagId" render={({ field }) => (<FormItem><FormLabel>RFID Tag ID</FormLabel><FormControl><Input placeholder="e.g., RFID-XYZ789" {...field} /></FormControl><FormMessage /></FormItem>)}/>
      <FormField
        control={form.control}
        name="productCategory"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product Category</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Electronics, Apparel, Construction Materials"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Specify a relevant category. This helps in organizing products, applying category-specific rules (e.g., for "Textiles" or "Construction Materials" sections below), and enabling tailored AI suggestions.
            </FormDescription>
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
              <Button type="button" variant="ghost" size="sm" onClick={callSuggestDescriptionAIInternal} disabled={anyLocalAISuggestionInProgress || !!isSubmittingForm}>
                {isSuggestingDescriptionInternal ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-info" />}
                <span className="ml-2">{isSuggestingDescriptionInternal ? "Suggesting..." : "Suggest Description"}</span>
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
