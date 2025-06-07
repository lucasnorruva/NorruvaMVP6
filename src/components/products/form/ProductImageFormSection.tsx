
// --- File: ProductImageFormSection.tsx ---
// Description: Component for displaying and generating product image in a form.
"use client";

import React from "react";
import Image from "next/image";
import { UseFormReturn } from "react-hook-form";
import type { ProductFormData } from "@/components/products/ProductForm";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Label } from "@/components/ui/label";
import { FormDescription, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Cpu, ImagePlus, ImageIcon, Loader2 } from "lucide-react";
import type { ToastInput } from "@/hooks/use-toast"; // Simplified toast type

// Simplified toast function type signature from useToast
type ToastFn = (input: ToastInput) => void;

interface ProductImageFormSectionProps {
  currentImageUrl: string | null;
  form: UseFormReturn<ProductFormData>;
  onImageGenerated: (imageUrl: string) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  aiImageHelper: (
    form: UseFormReturn<ProductFormData>,
    toast: ToastFn, // Use the simplified ToastFn type
    setLoadingState: (loading: boolean) => void
  ) => Promise<string | null>;
  initialImageUrlOrigin?: 'AI_EXTRACTED' | 'manual';
  toast: ToastFn; // Pass toast function
}

// Local AiIndicator for this component
const AiIndicator = ({ fieldOrigin, fieldName }: { fieldOrigin?: 'AI_EXTRACTED' | 'manual', fieldName: string }) => {
  if (fieldOrigin === 'AI_EXTRACTED') {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger type="button" className="ml-1.5 cursor-help align-middle">
            <Cpu className="h-4 w-4 text-info" />
          </TooltipTrigger>
          <TooltipContent>
            <p>This {fieldName.toLowerCase()} was suggested by AI.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  return null;
};

export default function ProductImageFormSection({
  currentImageUrl,
  form,
  onImageGenerated,
  isGenerating,
  setIsGenerating,
  aiImageHelper,
  initialImageUrlOrigin,
  toast
}: ProductImageFormSectionProps) {

  const triggerImageGeneration = async () => {
    const imageUrl = await aiImageHelper(form, toast, setIsGenerating);
    if (imageUrl) {
      onImageGenerated(imageUrl);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center">
        Product Image
        <AiIndicator fieldOrigin={initialImageUrlOrigin} fieldName="Product Image" />
      </Label>
      {currentImageUrl ? (
        <div className="w-full max-w-sm border rounded-md overflow-hidden shadow-sm">
          <AspectRatio ratio={4 / 3} className="bg-muted">
            <Image src={currentImageUrl} alt="Generated product image" layout="fill" objectFit="contain" />
          </AspectRatio>
        </div>
      ) : (
        <div className="w-full max-w-sm h-40 border border-dashed rounded-md flex flex-col items-center justify-center bg-muted/50 text-muted-foreground shadow-sm">
          <ImageIcon className="h-10 w-10 mb-2" />
          <p className="text-sm">No image provided or generated yet.</p>
        </div>
      )}
      {/* Hidden FormField to hold the imageUrl value for react-hook-form */}
      <FormField
        control={form.control}
        name="imageUrl"
        render={({ field }) => (
          <FormItem className="hidden">
            <FormControl>
              <input {...field} type="hidden" />
            </FormControl>
          </FormItem>
        )}
      />
      <Button
        type="button"
        variant="secondary"
        onClick={triggerImageGeneration}
        disabled={isGenerating || form.formState.isSubmitting}
        className="w-full sm:w-auto"
      >
        {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
        <span className="ml-2">{isGenerating ? "Generating..." : "Generate Image with AI"}</span>
      </Button>
      <FormDescription>AI will attempt to generate an image based on product name and category.</FormDescription>
    </div>
  );
}
