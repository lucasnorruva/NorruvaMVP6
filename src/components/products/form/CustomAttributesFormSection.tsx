
// --- File: CustomAttributesFormSection.tsx ---
// Description: Form section component for managing custom product attributes.
"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, XCircle, Sparkles, Loader2, Info } from "lucide-react";
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

  React.useEffect(() => {
    form.setValue("customAttributesJsonString", JSON.stringify(customAttributes), { shouldValidate: true });
  }, [customAttributes, form]);


  return (
    <div className="space-y-4 pt-4">
      <FormDescription>
        Define any additional key-value pairs that are specific to this product and not covered by standard fields. For example, 'Compatible Devices: Smartphone X, Tablet Y' or 'Special Edition: Yes'.
      </FormDescription>
      
      <div className="flex justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={callSuggestCustomAttributesAI} disabled={anyAISuggestionInProgress || !!isSubmittingForm}>
            {isSuggestingCustomAttrs ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-info" />}
            <span className="ml-2">{isSuggestingCustomAttrs ? "Suggesting..." : "Suggest Attributes"}</span>
        </Button>
      </div>

      {suggestedCustomAttributes.length > 0 && (
        <div className="space-y-2 rounded-md border border-dashed p-3 bg-muted/30">
          <FormLabel className="text-sm font-medium text-muted-foreground flex items-center">
             <Info className="h-4 w-4 mr-2 text-info"/> AI Suggested Attributes (click to add):
          </FormLabel>
          {suggestedCustomAttributes.map((attr, index) => (
            <div key={`suggested-${index}`} className="flex items-center justify-between text-sm p-1.5 bg-background rounded shadow-sm">
              <div>
                <span className="font-medium">{attr.key}:</span>
                <span className="text-muted-foreground ml-1">{attr.value}</span>
              </div>
              <Button type="button" variant="outline" size="xs" onClick={() => handleAddSuggestedCustomAttribute(attr)} className="h-6 px-2 py-1">
                <PlusCircle className="mr-1 h-3 w-3" /> Add
              </Button>
            </div>
          ))}
        </div>
      )}

      {customAttributes.length > 0 && (
        <div className="space-y-2 rounded-md border p-3 bg-muted/30">
          <FormLabel className="text-sm font-medium text-muted-foreground">Current Custom Attributes:</FormLabel>
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
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end pt-2">
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
          <PlusCircle className="mr-2 h-4 w-4" /> Add Attribute
        </Button>
      </div>
      <FormField
        control={form.control}
        name="customAttributesJsonString"
        render={({ field }) => (
          <FormItem className="hidden">
            <FormControl><Input type="hidden" {...field} /></FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
