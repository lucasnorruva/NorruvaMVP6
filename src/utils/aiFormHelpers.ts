
// --- File: aiFormHelpers.ts ---
// Description: Utility functions for handling AI-powered suggestions in product forms.
"use client";

import type { UseFormReturn } from "react-hook-form";
import type { ProductFormData } from "@/components/products/ProductForm"; // Assuming ProductFormData is exported from ProductForm.tsx
import { generateProductName } from "@/ai/flows/generate-product-name-flow";
import { generateProductDescription } from "@/ai/flows/generate-product-description-flow";
import { suggestSustainabilityClaims } from "@/ai/flows/suggest-sustainability-claims-flow";
import { generateProductImage } from "@/ai/flows/generate-product-image-flow";
import type { ToastInput } from "@/hooks/use-toast"; // Simplified toast type
import { AlertTriangle } from "lucide-react";
import React from "react"; // Import React for JSX in toast

// Simplified toast function type signature from useToast
type ToastFn = (input: ToastInput) => void;

/**
 * Handles AI suggestion for product name.
 */
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
    form.setValue("productName", result.productName, { shouldValidate: true });
    toast({ title: "Product Name Suggested!", description: `AI suggested: "${result.productName}"`, variant: "default" });
    return result.productName;
  } catch (error) {
    console.error("Failed to suggest product name:", error);
    toast({
      title: "Error Suggesting Name",
      description: error instanceof Error ? error.message : "An unknown error occurred.",
      variant: "destructive",
      action: <AlertTriangle className="text-white" />,
    });
    return null;
  } finally {
    setLoadingState(false);
  }
}

/**
 * Handles AI suggestion for product description.
 */
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
    form.setValue("productDescription", result.productDescription, { shouldValidate: true });
    toast({ title: "Product Description Suggested!", description: "AI has generated a product description.", variant: "default" });
    return result.productDescription;
  } catch (error) {
    console.error("Failed to suggest product description:", error);
    toast({
      title: "Error Suggesting Description",
      description: error instanceof Error ? error.message : "An unknown error occurred.",
      variant: "destructive",
      action: <AlertTriangle className="text-white" />,
    });
    return null;
  } finally {
    setLoadingState(false);
  }
}

/**
 * Handles AI suggestion for sustainability claims.
 */
export async function handleSuggestClaimsAI(
  form: UseFormReturn<ProductFormData>,
  toast: ToastFn,
  setLoadingState: (loading: boolean) => void
): Promise<string[] | null> {
  setLoadingState(true);
  const formData = form.getValues();
  try {
    const result = await suggestSustainabilityClaims({
      productCategory: formData.productCategory || "Unknown",
      productName: formData.productName,
      productDescription: formData.productDescription,
      materials: formData.materials,
    });
    if (result.claims.length === 0) {
      toast({ title: "No specific claims suggested.", description: "Try adding more product details like category or materials." });
    }
    return result.claims;
  } catch (error) {
    console.error("Failed to suggest claims:", error);
    toast({
      title: "Error Suggesting Claims",
      description: error instanceof Error ? error.message : "An unknown error occurred.",
      variant: "destructive",
      action: <AlertTriangle className="text-white" />,
    });
    return null;
  } finally {
    setLoadingState(false);
  }
}

/**
 * Handles AI generation for product image.
 */
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
    });
    // The form field and actual image display state will be updated by the calling component
    toast({ title: "Image Generated Successfully", description: "The product image has been generated." });
    return result.imageUrl;
  } catch (error) {
    console.error("Failed to generate image:", error);
    toast({
      title: "Error Generating Image",
      description: error instanceof Error ? error.message : "An unknown error occurred.",
      variant: "destructive",
      action: <AlertTriangle className="text-white" />,
    });
    return null;
  } finally {
    setLoadingState(false);
  }
}
