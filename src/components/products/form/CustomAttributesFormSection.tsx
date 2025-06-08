
// --- File: CustomAttributesFormSection.tsx ---
// Description: Form section component for managing custom product attributes.
"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, XCircle } from "lucide-react";
import type { CustomAttribute } from "@/types/dpp";
import type { ProductFormData } from "@/components/products/ProductForm";
import type { ToastInput } from "@/hooks/use-toast";


type ToastFn = (input: ToastInput) => void;

interface CustomAttributesFormSectionProps {
  customAttributes: CustomAttribute[];
  setCustomAttributes: React.Dispatch<React.SetStateAction<CustomAttribute[]>>;
  currentCustomKey: string;
  setCurrentCustomKey: React.Dispatch<React.SetStateAction<string>>;
  currentCustomValue: string;
  setCurrentCustomValue: React.Dispatch<React.SetStateAction<string>>;
  handleAddCustomAttribute: () => void;
  handleRemoveCustomAttribute: (keyToRemove: string) => void;
  form: UseFormReturn<ProductFormData>; // To set the hidden JSON string field
}

export default function CustomAttributesFormSection({
  customAttributes,
  // setCustomAttributes, // No longer needed as prop, handled by parent via effect
  currentCustomKey,
  setCurrentCustomKey,
  currentCustomValue,
  setCurrentCustomValue,
  handleAddCustomAttribute,
  handleRemoveCustomAttribute,
  form, // Used to set the hidden field
}: CustomAttributesFormSectionProps) {

  // This effect updates the hidden form field whenever local customAttributes change
  React.useEffect(() => {
    form.setValue("customAttributesJsonString", JSON.stringify(customAttributes), { shouldValidate: true });
  }, [customAttributes, form]);


  return (
    <div className="space-y-4 pt-4">
      <p className="text-sm text-muted-foreground">
        Define additional key-value pairs specific to this product.
      </p>
      {customAttributes.length > 0 && (
        <div className="space-y-2 rounded-md border p-3 bg-muted/30">
          <FormLabel className="text-xs text-muted-foreground">Current Custom Attributes:</FormLabel>
          {customAttributes.map((attr, index) => (
            <div key={index} className="flex items-center justify-between text-sm p-1.5 bg-background rounded shadow-sm">
              <div>
                <span className="font-medium">{attr.key}:</span>
                <span className="text-muted-foreground ml-1">{attr.value}</span>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveCustomAttribute(attr.key)} className="h-6 w-6 text-destructive hover:text-destructive">
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
        <FormItem>
          <FormLabel htmlFor="customAttrKey" className="text-xs">Attribute Key</FormLabel>
          <FormControl>
            <Input
              id="customAttrKey"
              value={currentCustomKey}
              onChange={(e) => setCurrentCustomKey(e.target.value)}
              placeholder="e.g., Color Code"
              className="h-9"
            />
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel htmlFor="customAttrValue" className="text-xs">Attribute Value</FormLabel>
          <FormControl>
            <Input
              id="customAttrValue"
              value={currentCustomValue}
              onChange={(e) => setCurrentCustomValue(e.target.value)}
              placeholder="e.g., #FF0000"
              className="h-9"
            />
          </FormControl>
        </FormItem>
        <Button type="button" variant="outline" onClick={handleAddCustomAttribute} className="h-9 mt-auto sm:mt-0">
          <PlusCircle className="mr-2 h-4 w-4" /> Add
        </Button>
      </div>
      <FormField
        control={form.control}
        name="customAttributesJsonString"
        render={({ field }) => (
          // This field is now managed by the useEffect hook above.
          // It needs to be registered with react-hook-form for submission.
          <FormItem className="hidden">
            <FormControl><Input type="hidden" {...field} /></FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
