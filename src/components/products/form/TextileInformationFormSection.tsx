"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Trash2, Shirt } from "lucide-react";
import type { ProductFormData } from "@/types/productFormTypes";

interface TextileInformationFormSectionProps {
  form: UseFormReturn<ProductFormData>;
}

export default function TextileInformationFormSection({ 
  form 
}: TextileInformationFormSectionProps) {
  const fiberComposition = form.watch("textileInformation.fiberComposition") || [];

  const addFiberComposition = () => {
    const currentComposition = form.getValues("textileInformation.fiberComposition") || [];
    form.setValue("textileInformation.fiberComposition", [
      ...currentComposition,
      { fiberName: "", percentage: null }
    ], { shouldValidate: true });
  };

  const removeFiberComposition = (index: number) => {
    const currentComposition = form.getValues("textileInformation.fiberComposition") || [];
    form.setValue(
      "textileInformation.fiberComposition",
      currentComposition.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  };

  // Calculate total percentage
  const totalPercentage = fiberComposition.reduce((sum, fiber) => {
    const percentage = fiber.percentage || 0;
    return sum + Number(percentage);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium">Fiber Composition</h4>
            <p className="text-sm text-muted-foreground">
              Specify the fiber composition of the textile product
              {totalPercentage > 0 && (
                <span className={`ml-2 font-medium ${totalPercentage !== 100 ? 'text-amber-600' : 'text-green-600'}`}>
                  (Total: {totalPercentage}%)
                </span>
              )}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addFiberComposition}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Fiber
          </Button>
        </div>

        {fiberComposition.length > 0 && (
          <div className="space-y-3">
            {fiberComposition.map((_, index) => (
              <Card key={index}>
                <CardContent className="pt-4">
                  <div className="flex items-end gap-4">
                    <FormField
                      control={form.control}
                      name={`textileInformation.fiberComposition.${index}.fiberName`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Fiber Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Cotton, Polyester, Wool" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`textileInformation.fiberComposition.${index}.percentage`}
                      render={({ field }) => (
                        <FormItem className="w-32">
                          <FormLabel>Percentage</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              placeholder="0-100" 
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(value === "" ? null : parseFloat(value));
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFiberComposition(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {fiberComposition.length === 0 && (
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
      </div>

      <FormField
        control={form.control}
        name="textileInformation.countryOfOriginLabeling"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country of Origin Labeling</FormLabel>
            <FormControl>
              <Input 
                placeholder="e.g., Made in Portugal, Assembled in Spain" 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Country or countries where the textile product was manufactured
            </FormDescription>
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
            <FormControl>
              <Input 
                type="url"
                placeholder="https://example.com/care-instructions" 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Link to detailed care and washing instructions for the textile product
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="textileInformation.isSecondHand"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Second-hand Product
              </FormLabel>
              <FormDescription>
                Check this if the textile product is second-hand or pre-owned
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}