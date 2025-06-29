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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Trash2, FileText } from "lucide-react";
import type { ProductFormData } from "@/types/productFormTypes";

interface ConstructionProductInformationFormSectionProps {
  form: UseFormReturn<ProductFormData>;
}

export default function ConstructionProductInformationFormSection({
  form,
}: ConstructionProductInformationFormSectionProps) {
  const essentialCharacteristics =
    form.watch("constructionProductInformation.essentialCharacteristics") || [];

  const addEssentialCharacteristic = () => {
    const currentCharacteristics =
      form.getValues(
        "constructionProductInformation.essentialCharacteristics",
      ) || [];
    form.setValue(
      "constructionProductInformation.essentialCharacteristics",
      [
        ...currentCharacteristics,
        { characteristicName: "", value: "", unit: "", testMethod: "" },
      ],
      { shouldValidate: true },
    );
  };

  const removeEssentialCharacteristic = (index: number) => {
    const currentCharacteristics =
      form.getValues(
        "constructionProductInformation.essentialCharacteristics",
      ) || [];
    form.setValue(
      "constructionProductInformation.essentialCharacteristics",
      currentCharacteristics.filter((_, i) => i !== index),
      { shouldValidate: true },
    );
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="constructionProductInformation.declarationOfPerformanceId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Declaration of Performance ID</FormLabel>
            <FormControl>
              <Input placeholder="e.g., DoP-12345-2024" {...field} />
            </FormControl>
            <FormDescription>
              Unique identifier for the Declaration of Performance document
            </FormDescription>
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
            <FormControl>
              <Input
                type="url"
                placeholder="https://example.com/ce-marking-details"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Link to detailed CE marking information and conformity
              documentation
            </FormDescription>
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
            <FormControl>
              <Textarea
                placeholder="Describe the intended use of this construction product..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Detailed description of how this product is intended to be used in
              construction
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium">Essential Characteristics</h4>
            <p className="text-sm text-muted-foreground">
              Define the essential characteristics and their declared
              performance values
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addEssentialCharacteristic}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Characteristic
          </Button>
        </div>

        {essentialCharacteristics.length > 0 && (
          <div className="space-y-4">
            {essentialCharacteristics.map((_, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="grid gap-4">
                    <div className="flex items-start justify-between">
                      <div className="grid gap-4 flex-1">
                        <FormField
                          control={form.control}
                          name={`constructionProductInformation.essentialCharacteristics.${index}.characteristicName`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Characteristic Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., Compressive strength, Fire resistance"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name={`constructionProductInformation.essentialCharacteristics.${index}.value`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., 25, Class A1"
                                    {...field}
                                  />
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
                                <FormLabel>Unit (Optional)</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., N/mm², min"
                                    {...field}
                                  />
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
                                <FormLabel>Test Method (Optional)</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., EN 12390-3"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEssentialCharacteristic(index)}
                        className="ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {essentialCharacteristics.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-6 text-center">
              <FileText className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No essential characteristics defined yet.
                <br />
                Click "Add Characteristic" to define performance
                characteristics.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
