
// --- File: ConstructionProductInformationFormSection.tsx ---
// Description: Form section component for Construction Product Information.
"use client";

import React from "react";
import type { UseFormReturn, Control } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, PlusCircle } from "lucide-react";
import type { ProductFormData } from "@/components/products/ProductForm";

interface ConstructionProductInformationFormSectionProps {
  form: UseFormReturn<ProductFormData>;
}

export default function ConstructionProductInformationFormSection({
  form,
}: ConstructionProductInformationFormSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control as Control<ProductFormData>, // Ensure correct Control type
    name: "constructionProductInformation.essentialCharacteristics",
  });

  return (
    <div className="space-y-6 pt-4">
      <FormDescription>
        Provide details specific to construction products, such as Declaration of Performance (DoP) and CE marking.
      </FormDescription>

      <FormField
        control={form.control}
        name="constructionProductInformation.declarationOfPerformanceId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Declaration of Performance (DoP) ID</FormLabel>
            <FormControl><Input placeholder="e.g., DoP-XYZ-001-2024" {...field} value={field.value || ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="constructionProductInformation.ceMarkingDetailsUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CE Marking Details URL</FormLabel>
            <FormControl><Input type="url" placeholder="https://example.com/certs/ce_marking_product123.pdf" {...field} value={field.value || ""} /></FormControl>
            <FormDescription>Link to document or page detailing CE marking conformity.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="constructionProductInformation.intendedUseDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Intended Use Description</FormLabel>
            <FormControl><Textarea placeholder="Describe the intended use of the construction product..." {...field} value={field.value || ""} rows={3} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div>
        <FormLabel>Essential Characteristics</FormLabel>
        {fields.map((item, index) => (
          <div key={item.id} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_80px_80px_auto] gap-2 mt-2 p-3 border rounded-md bg-muted/50 relative items-end">
            <FormField
              control={form.control}
              name={`constructionProductInformation.essentialCharacteristics.${index}.characteristicName`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={`charName-${index}`} className="text-xs">Characteristic Name</FormLabel>
                  <FormControl>
                    <Input id={`charName-${index}`} placeholder="e.g., Thermal Resistance" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`constructionProductInformation.essentialCharacteristics.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={`charValue-${index}`} className="text-xs">Value</FormLabel>
                  <FormControl>
                    <Input id={`charValue-${index}`} placeholder="e.g., 5.0" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name={`constructionProductInformation.essentialCharacteristics.${index}.unit`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={`charUnit-${index}`} className="text-xs">Unit</FormLabel>
                  <FormControl>
                    <Input id={`charUnit-${index}`} placeholder="e.g., m²K/W" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`constructionProductInformation.essentialCharacteristics.${index}.testMethod`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={`charTestMethod-${index}`} className="text-xs">Test Method</FormLabel>
                  <FormControl>
                    <Input id={`charTestMethod-${index}`} placeholder="e.g., EN 12667" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive hover:text-destructive h-8 w-8">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => append({ characteristicName: "", value: "", unit: "", testMethod: "" })} className="mt-2">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Characteristic
        </Button>
      </div>
    </div>
  );
}
