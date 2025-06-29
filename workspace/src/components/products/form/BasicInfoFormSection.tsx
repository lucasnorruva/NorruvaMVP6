// --- File: BasicInfoFormSection.tsx ---
// Description: Form section component for basic product information.
"use client";

import React, { useState, useEffect } from "react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AiIndicator } from "@/components/products/form";
import { Loader2, Sparkles, Info as InfoIcon } from "lucide-react";
import type { ProductFormData } from "@/types/productFormTypes";
import type { InitialProductFormData } from "@/app/(app)/products/new/page";
import type { ToastInput } from "@/hooks/use-toast";
import {
  handleSuggestNameAI,
  handleSuggestDescriptionAI,
} from "@/utils/aiFormHelpers";
import { generateComplianceSummaryForCategory } from "@/ai/flows/generate-compliance-summary-for-category"; // Task 12 import

type ToastFn = (input: ToastInput) => void;

interface BasicInfoFormSectionProps {
  form: UseFormReturn<ProductFormData>;
  initialData?: Partial<InitialProductFormData>;
  isSubmittingForm?: boolean;
  toast: ToastFn;
  categoryComplianceSummary?: string | null; // Prop for summary from parent
  isLoadingCategoryCompliance?: boolean; // Prop for loading state from parent
  onFetchCategoryComplianceSummary?: (
    category: string,
    focusedRegulations?: string,
  ) => void; // Handler from parent
}

export default function BasicInfoFormSection({
  form,
  initialData,
  isSubmittingForm,
  toast,
}: BasicInfoFormSectionProps) {
  const [isSuggestingNameInternal, setIsSuggestingNameInternal] =
    useState(false);
  const [isSuggestingDescriptionInternal, setIsSuggestingDescriptionInternal] =
    useState(false);

  const [categoryComplianceSummary, setCategoryComplianceSummary] = useState<
    string | null
  >(null);
  const [isLoadingCategoryCompliance, setIsLoadingCategoryCompliance] =
    useState(false);
  const [categoryComplianceError, setCategoryComplianceError] = useState<
    string | null
  >(null);

  const productCategoryValue = form.watch("productCategory");

  useEffect(() => {
    const fetchSummary = async () => {
      if (productCategoryValue && productCategoryValue.trim() !== "") {
        setIsLoadingCategoryCompliance(true);
        setCategoryComplianceError(null);
        setCategoryComplianceSummary(null);
        try {
          // For now, not passing focusedRegulations, can be added if a UI for it exists
          const result = await generateComplianceSummaryForCategory({
            productCategory: productCategoryValue,
          });
          setCategoryComplianceSummary(result.categoryComplianceSummary);
          toast({
            title: "Compliance Insights Loaded",
            description: `AI insights for '${productCategoryValue}' category available below.`,
            duration: 5000,
          });
        } catch (err) {
          const msg =
            err instanceof Error
              ? err.message
              : "Failed to fetch compliance insights.";
          setCategoryComplianceError(msg);
          toast({
            title: "Error Loading Insights",
            description: msg,
            variant: "destructive",
          });
        } finally {
          setIsLoadingCategoryCompliance(false);
        }
      } else {
        setCategoryComplianceSummary(null); // Clear summary if category is cleared
        setCategoryComplianceError(null);
      }
    };

    // Debounce or directly call
    const timeoutId = setTimeout(() => {
      fetchSummary();
    }, 500); // Debounce slightly to avoid rapid API calls while typing

    return () => clearTimeout(timeoutId);
  }, [productCategoryValue, toast]);

  const callSuggestNameAIInternal = async () => {
    const result = await handleSuggestNameAI(
      form,
      toast,
      setIsSuggestingNameInternal,
    );
    if (result) {
      form.setValue("productName", result, { shouldValidate: true });
      form.setValue("productNameOrigin", "AI_EXTRACTED");
    }
  };

  const callSuggestDescriptionAIInternal = async () => {
    const result = await handleSuggestDescriptionAI(
      form,
      toast,
      setIsSuggestingDescriptionInternal,
    );
    if (result) {
      // Use form.setValue on productDetails.description
      form.setValue("productDetails.description", result, {
        shouldValidate: true,
      });
      // Update the origin for the description within productDetailsOrigin
      form.setValue(
        "productDetailsOrigin.descriptionOrigin" as any,
        "AI_EXTRACTED",
      );
    }
  };

  const anyLocalAISuggestionInProgress =
    isSuggestingNameInternal || isSuggestingDescriptionInternal;

  return (
    <div className="space-y-6 pt-4">
      <FormField
        control={form.control}
        name="productName"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel className="flex items-center">
                Product Name{" "}
                <AiIndicator
                  fieldOrigin={
                    form.getValues("productNameOrigin") ||
                    initialData?.productNameOrigin
                  }
                  fieldName="Product Name"
                />
              </FormLabel>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={callSuggestNameAIInternal}
                disabled={anyLocalAISuggestionInProgress || !!isSubmittingForm}
              >
                {isSuggestingNameInternal ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 text-info" />
                )}
                <span className="ml-2">
                  {isSuggestingNameInternal ? "Suggesting..." : "Suggest Name"}
                </span>
              </Button>
            </div>
            <FormControl>
              <Input
                placeholder="e.g., EcoBoiler X1"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  form.setValue("productNameOrigin", "manual");
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="gtin"
        render={({ field }) => (
          <FormItem>
            {" "}
            <FormLabel>GTIN</FormLabel>{" "}
            <FormControl>
              <Input placeholder="e.g., 01234567890123" {...field} />
            </FormControl>{" "}
            <FormMessage />{" "}
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="sku"
        render={({ field }) => (
          <FormItem>
            <FormLabel>SKU</FormLabel>
            <FormControl>
              <Input placeholder="e.g., SKU123" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="nfcTagId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>NFC Tag ID</FormLabel>
            <FormControl>
              <Input placeholder="e.g., NFC-ABC123" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="rfidTagId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>RFID Tag ID</FormLabel>
            <FormControl>
              <Input placeholder="e.g., RFID-XYZ789" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

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
              Specify a relevant category. This helps in organizing products,
              applying category-specific rules (e.g., for "Textiles" or
              "Construction Materials" sections below), and enabling tailored AI
              suggestions.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {isLoadingCategoryCompliance && (
        <div className="flex items-center text-sm text-muted-foreground p-2">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Loading compliance insights for category...
        </div>
      )}
      {categoryComplianceError && !isLoadingCategoryCompliance && (
        <Alert variant="destructive" className="mt-2">
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertTitle>Compliance Insight Error</AlertTitle>
          <AlertDescription>{categoryComplianceError}</AlertDescription>
        </Alert>
      )}
      {categoryComplianceSummary && !isLoadingCategoryCompliance && (
        <Alert className="mt-2 bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300">
          <InfoIcon className="h-4 w-4 !text-blue-600 dark:!text-blue-400" />
          <AlertTitle className="font-semibold !text-blue-700 dark:!text-blue-300">
            AI Compliance Insights for "{productCategoryValue}"
          </AlertTitle>
          <AlertDescription className="whitespace-pre-line !text-blue-600/90 dark:!text-blue-300/90 text-xs">
            {categoryComplianceSummary}
          </AlertDescription>
        </Alert>
      )}

      <FormField
        control={form.control}
        name="productDetails.description" // Corrected path
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel className="flex items-center">
                Product Description{" "}
                <AiIndicator
                  fieldOrigin={
                    form.getValues("productDetailsOrigin.descriptionOrigin") ||
                    initialData?.productDetailsOrigin?.descriptionOrigin
                  }
                  fieldName="Product Description"
                />
              </FormLabel>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={callSuggestDescriptionAIInternal}
                disabled={anyLocalAISuggestionInProgress || !!isSubmittingForm}
              >
                {isSuggestingDescriptionInternal ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 text-info" />
                )}
                <span className="ml-2">
                  {isSuggestingDescriptionInternal
                    ? "Suggesting..."
                    : "Suggest Description"}
                </span>
              </Button>
            </div>
            <FormControl>
              <Textarea
                placeholder="Detailed description..."
                {...field}
                rows={4}
                onChange={(e) => {
                  field.onChange(e);
                  form.setValue(
                    "productDetailsOrigin.descriptionOrigin" as any,
                    "manual",
                  );
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="manufacturer"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                Manufacturer{" "}
                <AiIndicator
                  fieldOrigin={
                    form.getValues("manufacturerOrigin") ||
                    initialData?.manufacturerOrigin
                  }
                  fieldName="Manufacturer"
                />
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., GreenTech Inc."
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    form.setValue("manufacturerOrigin", "manual");
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="modelNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                Model Number{" "}
                <AiIndicator
                  fieldOrigin={
                    form.getValues("modelNumberOrigin") ||
                    initialData?.modelNumberOrigin
                  }
                  fieldName="Model Number"
                />
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., GTX-EB-001"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    form.setValue("modelNumberOrigin", "manual");
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
