
// --- File: aiFormHelpers.tsx ---
// Description: Utility functions for handling AI-powered suggestions in product forms.


import React from "react"; 
import type { UseFormReturn } from "react-hook-form";
import type { ProductFormData } from "@/types/productFormTypes"; 
import { generateProductName } from "@/ai/flows/generate-product-name-flow";
import { generateProductDescription } from "@/ai/flows/generate-product-description-flow";
import { suggestSustainabilityClaims } from "@/ai/flows/suggest-sustainability-claims-flow";
import { suggestKeyCompliancePoints } from "@/ai/flows/suggest-key-compliance-points"; 
import { generateProductImage } from "@/ai/flows/generate-product-image-flow";
import { generateProductSpecifications } from "@/ai/flows/generate-product-specifications-flow";
import { generateCustomAttributes } from "@/ai/flows/generate-custom-attributes-flow"; 
import type { CustomAttribute } from "@/types/dpp"; 
import type { ToastInput } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";

type ToastFn = (input: ToastInput) => void;

interface AiHandlerOptions<T> {
  aiCall: () => Promise<T>;
  toast: ToastFn;
  setLoadingState: (loading: boolean) => void;
  successToast?: ToastInput | ((result: T) => ToastInput);
  errorTitle: string;
}

async function withAiHandling<T>(options: AiHandlerOptions<T>): Promise<T | null> {
  const { aiCall, toast, setLoadingState, successToast, errorTitle } = options;
  setLoadingState(true);
  try {
    const result = await aiCall();
    if (successToast) {
      const toastInput =
        typeof successToast === "function" ? successToast(result) : successToast;
      toast(toastInput);
    }
    return result;
  } catch (error) {
    console.error(`${errorTitle}:`, error);
    const iconElement = <AlertTriangle className="text-white" />;
    toast({
      title: errorTitle,
      description: error instanceof Error
        ? error.message
        : "An unknown error occurred.",
      variant: "destructive",
      action: iconElement,
    });
    return null;
  } finally {
    setLoadingState(false);
  }
}

export async function handleSuggestNameAI(
  form: UseFormReturn<ProductFormData>,
  toast: ToastFn,
  setLoadingState: (loading: boolean) => void
): Promise<string | null> {
  const { productDetails, productCategory } = form.getValues();
  if (!productDetails?.description && !productCategory) {
    toast({ title: "Input Required", description: "Please provide a product description or category to suggest a name.", variant: "destructive" });
    setLoadingState(false); 
    return null;
  }
  const result = await withAiHandling({
    aiCall: () => generateProductName({
      productDescription: productDetails?.description || "",
      productCategory: productCategory || undefined,
    }),
    toast,
    setLoadingState,
    successToast: (res) => ({
      title: "Product Name Suggested!",
      description: `AI suggested: \"${res.productName}\"`,
      variant: "default",
    }),
    errorTitle: "Error Suggesting Name",
  });
  return result ? result.productName : null;
}

export async function handleSuggestDescriptionAI(
  form: UseFormReturn<ProductFormData>,
  toast: ToastFn,
  setLoadingState: (loading: boolean) => void
): Promise<string | null> {
  const { productName, productCategory, productDetails } = form.getValues();
  if (!productName) {
    toast({ title: "Product Name Required", description: "Please provide a product name to suggest a description.", variant: "destructive" });
    setLoadingState(false);
    return null;
  }
  const result = await withAiHandling({
    aiCall: () =>
      generateProductDescription({
        productName: productName,
        productCategory: productCategory || undefined,
        keyFeatures: productDetails?.materials || undefined,
      }),
    toast,
    setLoadingState,
    successToast: {
      title: "Product Description Suggested!",
      description: "AI has generated a product description.",
      variant: "default",
    },
    errorTitle: "Error Suggesting Description",
  });
  return result ? result.productDescription : null;
}

export async function handleSuggestClaimsAI(
  form: UseFormReturn<ProductFormData>,
  toast: ToastFn,
  setLoadingState: (loading: boolean) => void
): Promise<string[] | null> {
  const formData = form.getValues();
  if (!formData.productCategory && !formData.productName && !formData.productDetails?.materials) {
    toast({ title: "Input Required", description: "Please provide product category, name, or materials to suggest claims.", variant: "destructive" });
    setLoadingState(false);
    return null;
  }
  const result = await withAiHandling({
    aiCall: () =>
      suggestSustainabilityClaims({
        productCategory: formData.productCategory || "General Product",
        productName: formData.productName,
        productDescription: formData.productDetails?.description,
        materials: formData.productDetails?.materials,
      }),
    toast,
    setLoadingState,
    successToast: (res) =>
      res.claims.length === 0
        ? {
            title: "No specific claims suggested.",
            description:
              "Try adding more product details like category or materials.",
          }
        : {
            title: "Sustainability Claims Suggested!",
            description: `${res.claims.length} claims suggested by AI.`,
            variant: "default",
          },
    errorTitle: "Error Suggesting Claims",
  });
  return result ? result.claims : null;
}

export async function handleSuggestKeyCompliancePointsAI(
  form: UseFormReturn<ProductFormData>,
  toast: ToastFn,
  setLoadingState: (loading: boolean) => void
): Promise<string[] | null> {
  const { productName, productCategory, compliance } = form.getValues();
  if (!productCategory) {
    toast({ title: "Category Required", description: "Please provide a product category to suggest compliance points.", variant: "destructive" });
    setLoadingState(false);
    return null;
  }
  
  const applicableRegs: string[] = [];
  if (compliance?.battery_regulation?.status && compliance.battery_regulation.status !== 'not_applicable') {
    applicableRegs.push("EU Battery Regulation");
  }
  if (compliance?.eu_espr?.status && compliance.eu_espr.status !== 'not_applicable') {
    applicableRegs.push("EU ESPR");
  }
  if (compliance?.scipNotification?.status && compliance.scipNotification.status !== 'N/A' && compliance.scipNotification.status !== 'Not Required') {
    applicableRegs.push("SCIP Database");
  }
  
  const result = await withAiHandling({
    aiCall: () =>
      suggestKeyCompliancePoints({
        productName: productName || undefined,
        productCategory: productCategory,
        regulationsApplicable: applicableRegs.join(', ') || undefined,
      }),
    toast,
    setLoadingState,
    successToast: (res) =>
      res.compliancePoints.length === 0
        ? {
            title: "No specific compliance points suggested.",
            description:
              "Ensure product category and relevant regulations are selected.",
          }
        : {
            title: "Key Compliance Points Suggested!",
            description: `${res.compliancePoints.length} points suggested by AI.`,
            variant: "default",
          },
    errorTitle: "Error Suggesting Compliance Points",
  });
  return result ? result.compliancePoints : null;
}


export async function handleGenerateImageAI(
  form: UseFormReturn<ProductFormData>,
  toast: ToastFn,
  setLoadingState: (loading: boolean) => void
): Promise<string | null> {
  const formData = form.getValues();
  if (!formData.productName) {
    toast({ title: "Product Name Required", description: "Please enter a product name before generating an image.", variant: "destructive" });
    setLoadingState(false);
    return null;
  }
  const result = await withAiHandling({
    aiCall: () =>
      generateProductImage({
        productName: formData.productName,
        productCategory: formData.productCategory,
        imageHint: formData.productDetails?.imageHint,
      }),
    toast,
    setLoadingState,
    successToast: {
      title: "Image Generated Successfully",
      description: "The product image has been generated.",
    },
    errorTitle: "Error Generating Image",
  });
  return result ? result.imageUrl : null;
}

export async function handleSuggestSpecificationsAI(
  form: UseFormReturn<ProductFormData>,
  toast: ToastFn,
  setLoadingState: (loading: boolean) => void
): Promise<string | null> {
  const { productName, productDetails, productCategory } = form.getValues();
  if (!productName && !productDetails?.description && !productCategory) {
    toast({ title: "Input Required", description: "Please provide product name, description, or category to suggest specifications.", variant: "destructive" });
    setLoadingState(false);
    return null;
  }
  const result = await withAiHandling({
    aiCall: () =>
      generateProductSpecifications({
        productName: productName || "",
        productDescription: productDetails?.description || undefined,
        productCategory: productCategory || undefined,
      }),
    toast,
    setLoadingState,
    successToast: {
      title: "Specifications Suggested!",
      description: `AI suggested specifications for "${productName || 'the product'}".`,
      variant: "default",
    },
    errorTitle: "Error Suggesting Specifications",
  });
  return result ? result.specificationsJsonString : null;
}

export async function handleSuggestCustomAttributesAI(
  form: UseFormReturn<ProductFormData>,
  toast: ToastFn,
  setLoadingState: (loading: boolean) => void
): Promise<CustomAttribute[] | null> {
  const { productName, productCategory, productDetails } = form.getValues();

  if (!productName && !productCategory && !productDetails?.description) {
    toast({
      title: "Input Required",
      description:
        "Please provide product name, category, or description to suggest custom attributes.",
      variant: "destructive",
    });
    setLoadingState(false);
    return null;
  }

  const result = await withAiHandling({
    aiCall: () =>
      generateCustomAttributes({
        productName: productName || "",
        productCategory: productCategory || undefined,
        productDescription: productDetails?.description || undefined,
      }),
    toast,
    setLoadingState,
    successToast: (res) =>
      res.customAttributes.length === 0
        ? {
            title: "No specific attributes suggested.",
            description: "Try adding more product details.",
          }
        : {
            title: "Custom Attributes Suggested!",
            description: `${res.customAttributes.length} custom attribute(s) suggested by AI.`,
            variant: "default",
          },
    errorTitle: "Error Suggesting Attributes",
  });

  return result ? result.customAttributes : null;
}
