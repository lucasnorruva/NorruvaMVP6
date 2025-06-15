
"use client";

import React from "react";
import type { UseFormReturn, Control } from "react-hook-form"; // Added Control
import { useFieldArray } from "react-hook-form"; // Added useFieldArray
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"; // Ensured Checkbox is imported
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Trash2, Shirt } from "lucide-react";
import type { ProductFormData } from "@/types/productFormTypes";

interface TextileInformationFormSectionProps {
  form: UseFormReturn<ProductFormData>;
}

export default function TextileInformationFormSection({ 
  form 
}: TextileInformationFormSectionProps) {
  const { fields, append, remove } = useFieldArray({ // Destructure from useFieldArray
    control: form.control as Control<ProductFormData>, // Cast control type
    name: "textileInformation.fiberComposition",
  });

  // Calculate total percentage
  const totalPercentage = (fields || []).reduce((sum, fiberItem: any) => { // Cast fiberItem to any or proper type
    const percentage = fiberItem.percentage || 0;
    return sum + Number(percentage);
  }, 0);

  return (
    <div className="space-y-6 pt-4"> 
      <FormDescription>
        Provide details specific to textile products, including fiber composition and care instructions.
      </FormDescription>

      <div>
        <FormLabel>Fiber Composition</FormLabel>
        {fields.map((item, index) => (
          <div key={item.id} className="flex items-end gap-2 mt-2 p-3 border rounded-md bg-muted/50 relative">
            <FormField
              control={form.control}
              name={`textileInformation.fiberComposition.${index}.fiberName`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel htmlFor={`fiberName-${index}`} className="text-xs">Fiber Name</FormLabel>
                  <FormControl>
                    <Input id={`fiberName-${index}`} placeholder="e.g., Organic Cotton" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`textileInformation.fiberComposition.${index}.percentage`}
              render={({ field }) => (
                <FormItem className="w-28">
                  <FormLabel htmlFor={`percentage-${index}`} className="text-xs">Percentage (%)</FormLabel>
                  <FormControl>
                    <Input id={`percentage-${index}`} type="number" placeholder="e.g., 95" {...field} 
                           onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} 
                           value={field.value ?? ""} />
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
        <Button type="button" variant="outline" size="sm" onClick={() => append({ fiberName: "", percentage: null })} className="mt-2">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Fiber
        </Button>
      </div>
      
      {fields.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-6 text-center">
              <Shirt className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No fiber composition defined yet.
                <br />
                Click "Add Fiber" to specify the textile composition.
              </p>
            </CardContent>
          </Card>
        )}

        {totalPercentage > 0 && totalPercentage !== 100 && (
          <p className="text-sm text-amber-600">
            Note: Total percentage should equal 100%. Current total: {totalPercentage}%
          </p>
        )}


      <FormField
        control={form.control}
        name="textileInformation.countryOfOriginLabeling"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country of Origin (Labeling)</FormLabel>
            <FormControl><Input placeholder="e.g., Made in Portugal" {...field} value={field.value || ""} /></FormControl>
            <FormDescription>As stated on the product label, if different from overall manufacturing origin.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="textileInformation.careInstructionsUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Care Instructions URL</FormLabel>
            <FormControl><Input type="url" placeholder="https://example.com/care/product123" {...field} value={field.value || ""} /></FormControl>
            <FormDescription>Link to detailed care instructions for the textile product.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="textileInformation.isSecondHand"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm bg-muted/50">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                id="isSecondHand"
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel htmlFor="isSecondHand" className="cursor-pointer">
                Is this a second-hand product?
              </FormLabel>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
```