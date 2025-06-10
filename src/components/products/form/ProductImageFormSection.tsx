
// --- File: ProductImageFormSection.tsx ---
// Description: Component for displaying and generating product image in a form.
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import type { UseFormReturn } from "react-hook-form";
import type { ProductFormData } from "@/components/products/ProductForm";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { FormDescription, FormField, FormItem, FormControl, FormMessage, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AiIndicator from "./AiIndicator"; // Import shared component
import { ImagePlus, ImageIcon, Loader2 } from "lucide-react";
import type { ToastInput } from "@/hooks/use-toast";

type ToastFn = (input: ToastInput) => void;

interface ProductImageFormSectionProps {
  form: UseFormReturn<ProductFormData>;
  aiImageHelper: (
    form: UseFormReturn<ProductFormData>,
    toast: ToastFn,
    setLoadingState: (loading: boolean) => void
  ) => Promise<string | null>;
  initialImageUrlOrigin?: 'AI_EXTRACTED' | 'manual';
  toast: ToastFn;
  isGeneratingImageState: boolean;
  setIsGeneratingImageState: (loading: boolean) => void;
  initialImageUrl?: string | null;
}

export default function ProductImageFormSection({
  form,
  aiImageHelper,
  initialImageUrlOrigin,
  toast,
  isGeneratingImageState,
  setIsGeneratingImageState,
  initialImageUrl,
}: ProductImageFormSectionProps) {

  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(initialImageUrl || null);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "imageUrl") {
        setCurrentImageUrl(value.imageUrl || null);
      }
    });
    const formImageUrl = form.getValues("imageUrl");
    setCurrentImageUrl(formImageUrl || initialImageUrl || null);
    return () => subscription.unsubscribe();
  }, [form, initialImageUrl]);


  const triggerImageGeneration = async () => {
    const newImageUrl = await aiImageHelper(form, toast, setIsGeneratingImageState);
    if (newImageUrl) {
      form.setValue("imageUrl", newImageUrl, { shouldValidate: true });
      form.setValue("imageUrlOrigin", "AI_EXTRACTED");
    }
  };

  const productNameForHint = form.getValues("productName") || "product";
  const categoryForHint = form.getValues("productCategory") || "";
  const userProvidedHint = form.getValues("imageHint");

  const imageHintForDataAttr = userProvidedHint
    ? userProvidedHint.trim().split(" ").slice(0,2).join(" ")
    : (currentImageUrl && currentImageUrl.startsWith("data:"))
      ? `${productNameForHint} ${categoryForHint}`.trim().split(" ").slice(0,2).join(" ")
      : `${productNameForHint} ${categoryForHint}`.trim().split(" ").slice(0,2).join(" ");


  return (
    <div className="space-y-4 pt-4">
      <div className="w-full max-w-md mx-auto">
        {currentImageUrl ? (
          <div className="border rounded-md overflow-hidden shadow-sm bg-muted/30 p-2">
            <AspectRatio ratio={4 / 3} className="bg-muted">
              <Image
                src={currentImageUrl}
                alt="Product image"
                fill
                className="object-contain rounded"
                data-ai-hint={imageHintForDataAttr}
              />
            </AspectRatio>
            {(form.getValues("imageUrlOrigin") === 'AI_EXTRACTED' || (initialImageUrlOrigin === 'AI_EXTRACTED' && form.getValues("imageUrl") === initialImageUrl)) && (
                 <AiIndicator fieldOrigin="AI_EXTRACTED" fieldName="Image" className="text-xs text-info text-center py-1.5 flex items-center justify-center" />
            )}
          </div>
        ) : (
          <div className="w-full aspect-[4/3] border-2 border-dashed rounded-md flex flex-col items-center justify-center bg-muted/50 text-muted-foreground shadow-sm p-4">
            <ImageIcon className="h-12 w-12 mb-2 opacity-50" />
            <p className="text-sm text-center">No image provided. <br/>Enter a URL below or generate one with AI.</p>
          </div>
        )}
      </div>

       <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Image URL
                  <AiIndicator fieldOrigin={form.getValues("imageUrlOrigin") || initialImageUrlOrigin} fieldName="Image URL" />
                </FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://example.com/image.png or data:image/png;base64,..."
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      form.setValue("imageUrlOrigin", "manual");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
      <FormField
        control={form.control}
        name="imageHint"
        render={({ field }) => (
          <FormItem className="mt-3">
            <FormLabel className="text-sm">Image Hint (for AI Generation)</FormLabel>
            <FormControl><Input placeholder="e.g., minimalist, studio shot" {...field} /></FormControl>
            <FormDescription className="text-xs">Optional. Provide keywords to guide AI image generation (max 2 words).</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button
        type="button"
        variant="secondary"
        onClick={triggerImageGeneration}
        disabled={isGeneratingImageState || form.formState.isSubmitting}
        className="w-full sm:w-auto"
      >
        {isGeneratingImageState ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
        <span className="ml-2">{isGeneratingImageState ? "Generating Image..." : "Generate Image with AI"}</span>
      </Button>
    </div>
  );
}

