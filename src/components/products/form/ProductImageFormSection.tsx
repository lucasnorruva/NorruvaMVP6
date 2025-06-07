
// --- File: ProductImageFormSection.tsx ---
// Description: Component for displaying and generating product image in a form.
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import type { UseFormReturn } from "react-hook-form";
import type { ProductFormData } from "@/components/products/ProductForm";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Label } from "@/components/ui/label";
import { FormDescription, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Cpu, ImagePlus, ImageIcon, Loader2 } from "lucide-react";
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

const AiIndicator = ({ fieldOrigin, fieldName }: { fieldOrigin?: 'AI_EXTRACTED' | 'manual', fieldName: string }) => {
  if (fieldOrigin === 'AI_EXTRACTED') {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger type="button" className="ml-1.5 cursor-help align-middle">
            <Cpu className="h-4 w-4 text-info" />
          </TooltipTrigger>
          <TooltipContent>
            <p>This {fieldName.toLowerCase()} was suggested by AI document extraction.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  return null;
};

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
    // Sync currentImageUrl with form value if it changes externally (e.g., initialData load)
    const subscription = form.watch((value, { name }) => {
      if (name === "imageUrl") {
        setCurrentImageUrl(value.imageUrl || null);
      }
    });
    // Set initial value from form state if available
    setCurrentImageUrl(form.getValues("imageUrl") || initialImageUrl || null);
    return () => subscription.unsubscribe();
  }, [form, initialImageUrl]);


  const triggerImageGeneration = async () => {
    const newImageUrl = await aiImageHelper(form, toast, setIsGeneratingImageState);
    if (newImageUrl) {
      form.setValue("imageUrl", newImageUrl, { shouldValidate: true });
      setCurrentImageUrl(newImageUrl); // Update local state to re-render image
    }
  };

  const productNameForHint = form.getValues("productName") || "product";
  const categoryForHint = form.getValues("productCategory") || "";
  const imageHint = (currentImageUrl && currentImageUrl.startsWith("data:")) 
    ? `${productNameForHint} ${categoryForHint}`.trim().split(" ").slice(0,2).join(" ") 
    : form.getValues("imageHint") || productNameForHint.split(" ").slice(0,2).join(" ");


  return (
    <div className="space-y-2">
      <Label className="flex items-center">
        Product Image
        <AiIndicator fieldOrigin={initialImageUrlOrigin} fieldName="Product Image" />
      </Label>
      {currentImageUrl ? (
        <div className="w-full max-w-sm border rounded-md overflow-hidden shadow-sm">
          <AspectRatio ratio={4 / 3} className="bg-muted">
            <Image 
              src={currentImageUrl} 
              alt="Product image" 
              fill
              className="object-contain" 
              data-ai-hint={imageHint}
              priority={!currentImageUrl.startsWith("data:")}
            />
          </AspectRatio>
        </div>
      ) : (
        <div className="w-full max-w-sm h-40 border border-dashed rounded-md flex flex-col items-center justify-center bg-muted/50 text-muted-foreground shadow-sm">
          <ImageIcon className="h-10 w-10 mb-2" />
          <p className="text-sm">No image provided or generated yet.</p>
        </div>
      )}
       <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormControl><Input type="url" placeholder="Enter image URL or generate with AI" {...field} /></FormControl>
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
        <span className="ml-2">{isGeneratingImageState ? "Generating..." : "Generate Image with AI"}</span>
      </Button>
      <FormDescription>AI will attempt to generate an image based on product name and category. You can also paste an image URL directly.</FormDescription>
    </div>
  );
}

    
