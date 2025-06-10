
// --- File: CustomAttributesFormSection.tsx ---
// Description: Form section component for managing custom product attributes.
"use client";

import React, { useState } from "react"; // Added useState
import type { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, XCircle, Sparkles, Loader2, Info, ListChecks } from "lucide-react";
import type { CustomAttribute } from "@/types/dpp";
import type { ProductFormData } from "@/components/products/ProductForm";
import type { ToastInput } from "@/hooks/use-toast";
import { handleSuggestCustomAttributesAI } from "@/utils/aiFormHelpers"; // Import helper

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
  form: UseFormReturn<ProductFormData>;
  suggestedCustomAttributes: CustomAttribute[]; 
  setSuggestedCustomAttributes: React.Dispatch<React.SetStateAction<CustomAttribute[]>>; 
  isSubmittingForm?: boolean;
  toast: ToastFn; 
}

export default function CustomAttributesFormSection({
  customAttributes,
  setCustomAttributes,
  currentCustomKey,
  setCurrentCustomKey,
  currentCustomValue,
  setCurrentCustomValue,
  handleAddCustomAttribute,
  handleRemoveCustomAttribute,
  form,
  suggestedCustomAttributes,
  setSuggestedCustomAttributes, 
  isSubmittingForm,
  toast, 
}: CustomAttributesFormSectionProps) {
  const [isSuggestingCustomAttrsInternal, setIsSuggestingCustomAttrsInternal] = useState(false);

  React.useEffect(() => {
    form.setValue("customAttributesJsonString", JSON.stringify(customAttributes), { shouldValidate: true });
  }, [customAttributes, form]);

  const callSuggestCustomAttributesAIInternal = async () => {
    const attributes = await handleSuggestCustomAttributesAI(form, toast, setIsSuggestingCustomAttrsInternal);
    if (attributes) {
      setSuggestedCustomAttributes(attributes); 
    } else {
      setSuggestedCustomAttributes([]); 
    }
  };

  // Internal handler for adding suggested attributes
  const internalHandleAddSuggestedAttribute = (suggestedAttr: CustomAttribute) => {
    if (customAttributes.some(attr => attr.key.toLowerCase() === suggestedAttr.key.toLowerCase())) {
      toast({
        title: "Attribute Exists",
        description: `An attribute with key "${suggestedAttr.key}" already exists. You can edit it or use a different key.`,
        variant: "default",
      });
      return;
    }
    setCustomAttributes(prev => [...prev, suggestedAttr]);
    setSuggestedCustomAttributes(prev => prev.filter(attr => attr.key.toLowerCase() !== suggestedAttr.key.toLowerCase()));
    toast({ title: "Attribute Added", description: `"${suggestedAttr.key}" has been added from suggestions.`, variant: "default" });
  };


  return (
    <div className="space-y-6 pt-4">
      <FormDescription>
        Define any additional key-value pairs that are specific to this product and not covered by standard fields. For example, 'Compatible Devices: Smartphone X, Tablet Y' or 'Special Edition: Yes'.
      </FormDescription>
      
      <div className="flex justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={callSuggestCustomAttributesAIInternal} disabled={isSuggestingCustomAttrsInternal || !!isSubmittingForm}>
            {isSuggestingCustomAttrsInternal ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-info" />}
            <span className="ml-2">{isSuggestingCustomAttrsInternal ? "Suggesting Attributes..." : "Suggest Custom Attributes"}</span>
        </Button>
      </div>

      {suggestedCustomAttributes.length > 0 && (
        <div className="space-y-3 rounded-md border border-dashed p-4 bg-muted/30">
          <FormLabel className="text-sm font-medium text-muted-foreground flex items-center">
             <Info className="h-4 w-4 mr-2 text-info"/> AI Suggested Attributes:
          </FormLabel>
          <p className="text-xs text-muted-foreground mb-2">Click the '+' icon next to a suggestion to add it to the list below.</p>
          <ul className="space-y-2">
            {suggestedCustomAttributes.map((attr, index) => (
              <li 
                key={`suggested-${index}-${attr.key}`} 
                className="flex items-center justify-between p-2 bg-background rounded-md border shadow-sm"
              >
                <div>
                  <span className="font-medium text-sm text-primary">{attr.key}:</span>
                  <span className="text-sm text-foreground/90 ml-1.5">{attr.value}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => internalHandleAddSuggestedAttribute(attr)}
                  className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-500/10"
                  title={`Add attribute "${attr.key}"`}
                >
                  <PlusCircle className="h-4.5 w-4.5" />
                  <span className="sr-only">Add attribute {attr.key}</span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {customAttributes.length > 0 && (
        <div className="space-y-3 rounded-md border p-4 bg-muted/10">
          <FormLabel className="text-md font-medium text-foreground flex items-center">
            <ListChecks className="h-5 w-5 mr-2 text-primary"/> Current Custom Attributes:
          </FormLabel>
          <ul className="space-y-2">
            {customAttributes.map((attr, index) => (
              <li key={`${attr.key}-${index}`} className="flex items-center justify-between text-sm p-2.5 bg-background rounded-md shadow-sm border">
                <div>
                  <span className="font-semibold text-primary">{attr.key}:</span>
                  <span className="text-foreground/90 ml-1.5">{attr.value}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveCustomAttribute(attr.key)}
                  className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                  title={`Remove ${attr.key}`}
                >
                  <XCircle className="h-4.5 w-4.5" />
                  <span className="sr-only">Remove attribute {attr.key}</span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="pt-2 space-y-3">
        <FormLabel className="text-md font-medium">Add New Custom Attribute:</FormLabel>
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
          <Button type="button" variant="secondary" onClick={handleAddCustomAttribute} className="h-9 mt-auto sm:mt-0">
            <PlusCircle className="mr-2 h-4 w-4" /> Add
          </Button>
        </div>
      </div>

      <FormField
        control={form.control}
        name="customAttributesJsonString"
        render={({ field }) => (
          <FormItem className="hidden">
            <FormControl><Input type="hidden" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
