
// --- File: CustomAttributesFormSection.tsx ---
// Description: Form section component for managing custom product attributes.
"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, XCircle, Sparkles, Loader2, Info, ListChecks } from "lucide-react"; // Added ListChecks
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
  form: UseFormReturn<ProductFormData>;
  isSuggestingCustomAttrs: boolean;
  callSuggestCustomAttributesAI: () => Promise<void>;
  suggestedCustomAttributes: CustomAttribute[];
  handleAddSuggestedCustomAttribute: (attribute: CustomAttribute) => void;
  anyAISuggestionInProgress: boolean;
  isSubmittingForm?: boolean;
}

export default function CustomAttributesFormSection({
  customAttributes,
  setCustomAttributes, // Added to ensure customAttributes update the form's JSON string
  currentCustomKey,
  setCurrentCustomKey,
  currentCustomValue,
  setCurrentCustomValue,
  handleAddCustomAttribute,
  handleRemoveCustomAttribute,
  form,
  isSuggestingCustomAttrs,
  callSuggestCustomAttributesAI,
  suggestedCustomAttributes,
  handleAddSuggestedCustomAttribute,
  anyAISuggestionInProgress,
  isSubmittingForm,
}: CustomAttributesFormSectionProps) {

  // Ensure customAttributesJsonString in the form is updated whenever customAttributes state changes
  React.useEffect(() => {
    form.setValue("customAttributesJsonString", JSON.stringify(customAttributes), { shouldValidate: true });
  }, [customAttributes, form]);


  return (
    <div className="space-y-6 pt-4">
      <FormDescription>
        Define any additional key-value pairs that are specific to this product and not covered by standard fields. For example, 'Compatible Devices: Smartphone X, Tablet Y' or 'Special Edition: Yes'.
      </FormDescription>
      
      <div className="flex justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={callSuggestCustomAttributesAI} disabled={anyAISuggestionInProgress || !!isSubmittingForm}>
            {isSuggestingCustomAttrs ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-info" />}
            <span className="ml-2">{isSuggestingCustomAttrs ? "Suggesting Attributes..." : "Suggest Custom Attributes"}</span>
        </Button>
      </div>

      {suggestedCustomAttributes.length > 0 && (
        <div className="space-y-2 rounded-md border border-dashed p-3 bg-muted/30">
          <FormLabel className="text-sm font-medium text-muted-foreground flex items-center">
             <Info className="h-4 w-4 mr-2 text-info"/> AI Suggested Attributes:
          </FormLabel>
          <p className="text-xs text-muted-foreground mb-2">Click on a suggestion to add it to the list below.</p>
          <div className="flex flex-wrap gap-2">
            {suggestedCustomAttributes.map((attr, index) => (
              <Button 
                key={`suggested-${index}`} 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => handleAddSuggestedCustomAttribute(attr)} 
                className="bg-background hover:bg-accent/10 text-xs"
              >
                <PlusCircle className="mr-1.5 h-3.5 w-3.5" /> {attr.key}: {attr.value}
              </Button>
            ))}
          </div>
        </div>
      )}

      {customAttributes.length > 0 && (
        <div className="space-y-3 rounded-md border p-4 bg-muted/10">
          <FormLabel className="text-md font-medium text-foreground flex items-center">
            <ListChecks className="h-5 w-5 mr-2 text-primary"/> Current Custom Attributes:
          </FormLabel>
          <ul className="space-y-2">
            {customAttributes.map((attr, index) => (
              <li key={index} className="flex items-center justify-between text-sm p-2.5 bg-background rounded-md shadow-sm border">
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

      {/* Hidden field to store the JSON string representation of customAttributes for form submission */}
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
