
// --- File: aiFormHelpers.tsx ---
// Description: Utility functions for handling AI-powered suggestions in product forms.
"use client";

import React from "react"; // Added React import for JSX
import type { UseFormReturn } from "react-hook-form";
import type { ProductFormData } from "@/components/products/ProductForm";
import { generateProductName } from "@/ai/flows/generate-product-name-flow";
import { generateProductDescription } from "@/ai/flows/generate-product-description-flow";
import { suggestSustainabilityClaims } from "@/ai/flows/suggest-sustainability-claims-flow";
import { generateProductImage } from "@/ai/flows/generate-product-image-flow";
import { generateProductSpecifications } from "@/ai/flows/generate-product-specifications-flow";
import { generateCustomAttributes } from "@/ai/flows/generate-custom-attributes-flow"; // New import
import type { CustomAttribute } from "@/types/dpp"; // New import
import type { ToastInput } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";

type ToastFn = (input: ToastInput) => void;

export async function handleSuggestNameAI(
  form: UseFormReturn<ProductFormData>,
  toast: ToastFn,
  setLoadingState: (loading: boolean) => void
): Promise<string | null> {
  setLoadingState(true);
  const { productDescription, productCategory } = form.getValues();
  if (!productDescription && !productCategory) {
    toast({ title: "Input Required", description: "Please provide a product description or category to suggest a name.", variant: "destructive" });
    setLoadingState(false);
    return null;
  }
  try {
    const result = await generateProductName({
      productDescription: productDescription || "",
      productCategory: productCategory || undefined,
    });
    toast({ title: "Product Name Suggested!", description: `AI suggested: "${result.productName}"`, variant: "default" });
    // The calling component will use form.setValue
    return result.productName;
  } catch (error) {
    console.error("Failed to suggest product name:", error);
    const iconElement = <AlertTriangle className="text-white" />;
    toast({
      title: "Error Suggesting Name",
      description: error instanceof Error ? error.message : "An unknown error occurred.",
      variant: "destructive",
      action: iconElement,
    });
    return null;
  } finally {
    setLoadingState(false);
  }
}

export async function handleSuggestDescriptionAI(
  form: UseFormReturn<ProductFormData>,
  toast: ToastFn,
  setLoadingState: (loading: boolean) => void
): Promise<string | null> {
  setLoadingState(true);
  const { productName, productCategory, materials } = form.getValues();
  if (!productName) {
    toast({ title: "Product Name Required", description: "Please provide a product name to suggest a description.", variant: "destructive" });
    setLoadingState(false);
    return null;
  }
  try {
    const result = await generateProductDescription({
      productName: productName,
      productCategory: productCategory || undefined,
      keyFeatures: materials || undefined,
    });
    toast({ title: "Product Description Suggested!", description: "AI has generated a product description.", variant: "default" });
    // The calling component will use form.setValue
    return result.productDescription;
  } catch (error) {
    console.error("Failed to suggest product description:", error);
    const iconElement = <AlertTriangle className="text-white" />;
    toast({
      title: "Error Suggesting Description",
      description: error instanceof Error ? error.message : "An unknown error occurred.",
      variant: "destructive",
      action: iconElement,
    });
    return null;
  } finally {
    setLoadingState(false);
  }
}

export async function handleSuggestClaimsAI(
  form: UseFormReturn<ProductFormData>,
  toast: ToastFn,
  setLoadingState: (loading: boolean) => void
): Promise<string[] | null> {
  setLoadingState(true);
  const formData = form.getValues();
  if (!formData.productCategory && !formData.productName && !formData.materials) {
    toast({ title: "Input Required", description: "Please provide product category, name, or materials to suggest claims.", variant: "destructive" });
    setLoadingState(false);
    return null;
  }
  try {
    const result = await suggestSustainabilityClaims({
      productCategory: formData.productCategory || "General Product", // Provide a default if empty
      productName: formData.productName,
      productDescription: formData.productDescription,
      materials: formData.materials,
    });
    if (result.claims.length === 0) {
      toast({ title: "No specific claims suggested.", description: "Try adding more product details like category or materials." });
    } else {
      toast({ title: "Sustainability Claims Suggested!", description: `${result.claims.length} claims suggested by AI.`, variant: "default" });
    }
    return result.claims;
  } catch (error) {
    console.error("Failed to suggest claims:", error);
    const iconElement = <AlertTriangle className="text-white" />;
    toast({
      title: "Error Suggesting Claims",
      description: error instanceof Error ? error.message : "An unknown error occurred.",
      variant: "destructive",
      action: iconElement,
    });
    return null;
  } finally {
    setLoadingState(false);
  }
}

export async function handleGenerateImageAI(
  form: UseFormReturn<ProductFormData>,
  toast: ToastFn,
  setLoadingState: (loading: boolean) => void
): Promise<string | null> {
  setLoadingState(true);
  const formData = form.getValues();
  if (!formData.productName) {
    toast({ title: "Product Name Required", description: "Please enter a product name before generating an image.", variant: "destructive" });
    setLoadingState(false);
    return null;
  }
  try {
    const result = await generateProductImage({
      productName: formData.productName,
      productCategory: formData.productCategory,
      imageHint: formData.imageHint, // Pass the imageHint
    });
    toast({ title: "Image Generated Successfully", description: "The product image has been generated." });
    // The calling component will use form.setValue
    return result.imageUrl;
  } catch (error) {
    console.error("Failed to generate image:", error);
    const iconElement = <AlertTriangle className="text-white" />;
    toast({
      title: "Error Generating Image",
      description: error instanceof Error ? error.message : "An unknown error occurred.",
      variant: "destructive",
      action: iconElement,
    });
    return null;
  } finally {
    setLoadingState(false);
  }
}

export async function handleSuggestSpecificationsAI(
  form: UseFormReturn<ProductFormData>,
  toast: ToastFn,
  setLoadingState: (loading: boolean) => void
): Promise<string | null> {
  setLoadingState(true);
  const { productName, productDescription, productCategory } = form.getValues();
  if (!productName && !productDescription && !productCategory) {
    toast({ title: "Input Required", description: "Please provide product name, description, or category to suggest specifications.", variant: "destructive" });
    setLoadingState(false);
    return null;
  }
  try {
    const result = await generateProductSpecifications({
      productName: productName || "",
      productDescription: productDescription || undefined,
      productCategory: productCategory || undefined,
    });
    toast({ title: "Specifications Suggested!", description: `AI suggested specifications for "${productName || 'the product'}".`, variant: "default" });
    // The calling component will use form.setValue
    return result.specificationsJsonString;
  } catch (error) {
    console.error("Failed to suggest specifications:", error);
    const iconElement = <AlertTriangle className="text-white" />;
    toast({
      title: "Error Suggesting Specifications",
      description: error instanceof Error ? error.message : "An unknown error occurred.",
      variant: "destructive",
      action: iconElement,
    });
    return null;
  } finally {
    setLoadingState(false);
  }
}

export async function handleSuggestCustomAttributesAI(
  form: UseFormReturn<ProductFormData>,
  toast: ToastFn,
  setLoadingState: (loading: boolean) => void
): Promise<CustomAttribute[] | null> {
  setLoadingState(true);
  const { productName, productCategory, productDescription } = form.getValues();
  if (!productName && !productCategory && !productDescription) {
    toast({ title: "Input Required", description: "Please provide product name, category, or description to suggest custom attributes.", variant: "destructive" });
    setLoadingState(false);
    return null;
  }
  try {
    const result = await generateCustomAttributes({
      productName: productName || "",
      productCategory: productCategory || undefined,
      productDescription: productDescription || undefined,
    });
    if (result.customAttributes.length === 0) {
        toast({ title: "No specific attributes suggested.", description: "Try adding more product details." });
    } else {
        toast({ title: "Custom Attributes Suggested!", description: `${result.customAttributes.length} custom attributes suggested by AI.`, variant: "default" });
    }
    return result.customAttributes;
  } catch (error) {
    console.error("Failed to suggest custom attributes:", error);
    const iconElement = <AlertTriangle className="text-white" />;
    toast({
      title: "Error Suggesting Attributes",
      description: error instanceof Error ? error.message : "An unknown error occurred.",
      variant: "destructive",
      action: iconElement,
    });
    return null;
  } finally {
    setLoadingState(false);
  }
}
