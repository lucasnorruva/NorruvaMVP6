
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { InitialProductFormData } from "@/app/(app)/products/new/page"; 
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Cpu, BatteryCharging, Loader2, Sparkles, ImagePlus, Image as ImageIcon } from "lucide-react";
import React, { useState } from "react";
import { suggestSustainabilityClaims } from "@/ai/flows/suggest-sustainability-claims-flow";
import { generateProductImage } from "@/ai/flows/generate-product-image-flow";
import { generateProductName } from "@/ai/flows/generate-product-name-flow.ts";
import { generateProductDescription } from "@/ai/flows/generate-product-description-flow";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const formSchema = z.object({
  productName: z.string().min(2, "Product name must be at least 2 characters.").optional(),
  gtin: z.string().optional().describe("Global Trade Item Number"),
  productDescription: z.string().optional(),
  manufacturer: z.string().optional(),
  modelNumber: z.string().optional(),
  materials: z.string().optional().describe("Key materials used in the product, e.g., Cotton, Recycled Polyester, Aluminum."),
  sustainabilityClaims: z.string().optional().describe("Brief sustainability claims, e.g., 'Made with 50% recycled content', 'Carbon neutral production'."),
  specifications: z.string().optional(), 
  energyLabel: z.string().optional(),
  productCategory: z.string().optional().describe("Category of the product, e.g., Electronics, Apparel."),
  imageUrl: z.string().optional().describe("URL or Data URI of the product image."),
  // Battery Regulation Fields
  batteryChemistry: z.string().optional(),
  stateOfHealth: z.coerce.number().nullable().optional(),
  carbonFootprintManufacturing: z.coerce.number().nullable().optional(),
  recycledContentPercentage: z.coerce.number().nullable().optional(),
});

export type ProductFormData = z.infer<typeof formSchema>;

interface ProductFormProps {
  id?: string; // Added id for form submission in ProductDetailPage
  initialData?: Partial<InitialProductFormData & { productCategory?: string; imageUrl?: string }>; 
  onSubmit: (data: ProductFormData) => Promise<void>;
  isSubmitting?: boolean;
  isStandalonePage?: boolean; 
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
            <p>This {fieldName.toLowerCase()} was suggested by AI.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  return null;
};


export default function ProductForm({ id, initialData, onSubmit, isSubmitting, isStandalonePage = true }: ProductFormProps) {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: initialData?.productName || "",
      gtin: initialData?.gtin || "",
      productDescription: initialData?.productDescription || "",
      manufacturer: initialData?.manufacturer || "",
      modelNumber: initialData?.modelNumber || "",
      materials: initialData?.materials || "",
      sustainabilityClaims: initialData?.sustainabilityClaims || "",
      specifications: initialData?.specifications ? (typeof initialData.specifications === 'string' ? initialData.specifications : JSON.stringify(initialData.specifications, null, 2)) : "",
      energyLabel: initialData?.energyLabel || "",
      productCategory: initialData?.productCategory || "",
      imageUrl: initialData?.imageUrl || "",
      batteryChemistry: initialData?.batteryChemistry || "",
      stateOfHealth: initialData?.stateOfHealth ?? undefined,
      carbonFootprintManufacturing: initialData?.carbonFootprintManufacturing ?? undefined,
      recycledContentPercentage: initialData?.recycledContentPercentage ?? undefined,
    },
  });

  const { toast } = useToast();
  const [suggestedClaims, setSuggestedClaims] = useState<string[]>([]);
  const [isSuggestingClaims, setIsSuggestingClaims] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(initialData?.imageUrl || null);
  const [isSuggestingName, setIsSuggestingName] = useState(false);
  const [isSuggestingDescription, setIsSuggestingDescription] = useState(false);


  React.useEffect(() => {
    if (initialData) {
      form.reset({
        productName: initialData.productName || "",
        gtin: initialData.gtin || "",
        productDescription: initialData.productDescription || "",
        manufacturer: initialData.manufacturer || "",
        modelNumber: initialData.modelNumber || "",
        materials: initialData.materials || "",
        sustainabilityClaims: initialData.sustainabilityClaims || "",
        specifications: initialData.specifications ? (typeof initialData.specifications === 'string' ? initialData.specifications : JSON.stringify(initialData.specifications, null, 2)) : "",
        energyLabel: initialData.energyLabel || "",
        productCategory: initialData.productCategory || "",
        imageUrl: initialData.imageUrl || "",
        batteryChemistry: initialData.batteryChemistry || "",
        stateOfHealth: initialData.stateOfHealth ?? undefined,
        carbonFootprintManufacturing: initialData.carbonFootprintManufacturing ?? undefined,
        recycledContentPercentage: initialData.recycledContentPercentage ?? undefined,
      });
      setCurrentImageUrl(initialData.imageUrl || null);
    }
  }, [initialData, form]);

  const handleSuggestName = async () => {
    setIsSuggestingName(true);
    const { productDescription, productCategory } = form.getValues();
    if (!productDescription && !productCategory) {
      toast({ title: "Input Required", description: "Please provide a product description or category to suggest a name.", variant: "destructive" });
      setIsSuggestingName(false);
      return;
    }
    try {
      const result = await generateProductName({ 
        productDescription: productDescription || "", 
        productCategory: productCategory || undefined 
      });
      form.setValue("productName", result.productName, { shouldValidate: true });
      (initialData as InitialProductFormData).productNameOrigin = 'AI_EXTRACTED';
      toast({ title: "Product Name Suggested!", description: `AI suggested: "${result.productName}"`, variant: "default" });
    } catch (error) {
      console.error("Failed to suggest product name:", error);
      toast({
        title: "Error Suggesting Name",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
        action: <AlertTriangle className="text-white" />,
      });
    } finally {
      setIsSuggestingName(false);
    }
  };

  const handleSuggestDescription = async () => {
    setIsSuggestingDescription(true);
    const { productName, productCategory, materials } = form.getValues();
    if (!productName) {
      toast({ title: "Product Name Required", description: "Please provide a product name to suggest a description.", variant: "destructive" });
      setIsSuggestingDescription(false);
      return;
    }
    try {
      const result = await generateProductDescription({
        productName: productName,
        productCategory: productCategory || undefined,
        keyFeatures: materials || undefined,
      });
      form.setValue("productDescription", result.productDescription, { shouldValidate: true });
      (initialData as InitialProductFormData).productDescriptionOrigin = 'AI_EXTRACTED';
      toast({ title: "Product Description Suggested!", description: "AI has generated a product description.", variant: "default" });
    } catch (error) {
      console.error("Failed to suggest product description:", error);
      toast({
        title: "Error Suggesting Description",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
        action: <AlertTriangle className="text-white" />,
      });
    } finally {
      setIsSuggestingDescription(false);
    }
  };

  const handleSuggestClaims = async () => {
    setIsSuggestingClaims(true);
    setSuggestedClaims([]);
    const formData = form.getValues();
    try {
      const result = await suggestSustainabilityClaims({
        productCategory: formData.productCategory || "Unknown",
        productName: formData.productName,
        productDescription: formData.productDescription,
        materials: formData.materials,
      });
      setSuggestedClaims(result.claims);
      if (result.claims.length === 0) {
        toast({ title: "No specific claims suggested.", description: "Try adding more product details like category or materials."});
      }
    } catch (error) {
      console.error("Failed to suggest claims:", error);
      toast({
        title: "Error Suggesting Claims",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
        action: <AlertTriangle className="text-white" />,
      });
    } finally {
      setIsSuggestingClaims(false);
    }
  };

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    const formData = form.getValues();
    if (!formData.productName) {
      toast({title: "Product Name Required", description: "Please enter a product name before generating an image.", variant: "destructive"});
      setIsGeneratingImage(false);
      return;
    }
    try {
      const result = await generateProductImage({
        productName: formData.productName,
        productCategory: formData.productCategory,
      });
      form.setValue("imageUrl", result.imageUrl, { shouldValidate: true });
      setCurrentImageUrl(result.imageUrl);
      if (initialData) (initialData as InitialProductFormData).imageUrlOrigin = 'AI_EXTRACTED';
      toast({title: "Image Generated Successfully", description: "The product image has been updated."});
    } catch (error) {
      console.error("Failed to generate image:", error);
      toast({
        title: "Error Generating Image",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
        action: <AlertTriangle className="text-white" />,
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleClaimClick = (claim: string) => {
    const currentClaims = form.getValues("sustainabilityClaims") || "";
    const newClaims = currentClaims ? `${currentClaims}\n- ${claim}` : `- ${claim}`;
    form.setValue("sustainabilityClaims", newClaims, { shouldValidate: true });
    if (initialData) (initialData as InitialProductFormData).sustainabilityClaimsOrigin = 'AI_EXTRACTED'; // Mark as AI assisted
  };

  const formContent = (
    <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3', 'item-4']} className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-lg font-semibold">Basic Information</AccordionTrigger>
        <AccordionContent className="space-y-6 pt-4">
          <FormField
            control={form.control}
            name="productName"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="flex items-center">
                    Product Name 
                    <AiIndicator fieldOrigin={initialData?.productNameOrigin} fieldName="Product Name" />
                  </FormLabel>
                  <Button type="button" variant="ghost" size="sm" onClick={handleSuggestName} disabled={isSuggestingName || isSubmitting || isGeneratingImage}>
                    {isSuggestingName ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-info" />}
                    <span className="ml-2">{isSuggestingName ? "Suggesting..." : "Suggest Name"}</span>
                  </Button>
                </div>
                <FormControl>
                  <Input placeholder="e.g., EcoBoiler X1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2">
             <FormLabel className="flex items-center">
                Product Image
                <AiIndicator fieldOrigin={initialData?.imageUrlOrigin} fieldName="Product Image" />
            </FormLabel>
            {currentImageUrl ? (
              <div className="w-full max-w-sm border rounded-md overflow-hidden">
                <AspectRatio ratio={4/3}>
                  <Image src={currentImageUrl} alt="Generated product image" layout="fill" objectFit="contain" />
                </AspectRatio>
              </div>
            ) : (
              <div className="w-full max-w-sm h-40 border border-dashed rounded-md flex flex-col items-center justify-center bg-muted text-muted-foreground">
                <ImageIcon className="h-10 w-10 mb-2" />
                <p className="text-sm">No image provided or generated yet.</p>
              </div>
            )}
             <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem className="hidden"> 
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            <Button type="button" variant="secondary" onClick={handleGenerateImage} disabled={isGeneratingImage || isSubmitting || isSuggestingName || isSuggestingDescription}>
              {isGeneratingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
              <span className="ml-2">{isGeneratingImage ? "Generating..." : "Generate Image with AI"}</span>
            </Button>
            <FormDescription>AI will attempt to generate an image based on product name and category.</FormDescription>
          </div>
          <FormField
            control={form.control}
            name="gtin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GTIN (Global Trade Item Number)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 01234567890123" {...field} />
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
                  <Input placeholder="e.g., Electronics, Apparel, Homeware" {...field} />
                </FormControl>
                 <FormDescription>Used to help generate relevant suggestions.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="productDescription"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="flex items-center">
                    Product Description
                    <AiIndicator fieldOrigin={initialData?.productDescriptionOrigin} fieldName="Product Description" />
                  </FormLabel>
                  <Button type="button" variant="ghost" size="sm" onClick={handleSuggestDescription} disabled={isSuggestingDescription || isSubmitting || isGeneratingImage}>
                    {isSuggestingDescription ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-info" />}
                    <span className="ml-2">{isSuggestingDescription ? "Suggesting..." : "Suggest Description"}</span>
                  </Button>
                </div>
                <FormControl>
                  <Textarea placeholder="Detailed description of the product..." {...field} rows={4} />
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
                    Manufacturer
                    <AiIndicator fieldOrigin={initialData?.manufacturerOrigin} fieldName="Manufacturer" />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., GreenTech Inc." {...field} />
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
                    Model Number
                    <AiIndicator fieldOrigin={initialData?.modelNumberOrigin} fieldName="Model Number" />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., GTX-EB-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger className="text-lg font-semibold">Sustainability & Compliance</AccordionTrigger>
        <AccordionContent className="space-y-6 pt-4">
           <FormField
            control={form.control}
            name="materials"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                    Key Materials
                    <AiIndicator fieldOrigin={initialData?.materialsOrigin} fieldName="Key Materials" />
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="e.g., Organic Cotton, Recycled PET, Aluminum Alloy" {...field} rows={3}/>
                </FormControl>
                <FormDescription>
                  List the primary materials used in the product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sustainabilityClaims"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                    <FormLabel className="flex items-center">
                        Sustainability Claims
                        <AiIndicator fieldOrigin={initialData?.sustainabilityClaimsOrigin} fieldName="Sustainability Claims" />
                    </FormLabel>
                    <Button type="button" variant="ghost" size="sm" onClick={handleSuggestClaims} disabled={isSuggestingClaims || isSubmitting || isGeneratingImage}>
                        {isSuggestingClaims ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-info" />}
                        <span className="ml-2">{isSuggestingClaims ? "Suggesting..." : "Suggest Claims"}</span>
                    </Button>
                </div>
                <FormControl>
                  <Textarea placeholder="e.g., - Made with 70% recycled materials\n- Carbon neutral certified\n- Biodegradable packaging" {...field} rows={3}/>
                </FormControl>
                 <FormDescription>
                  Highlight key sustainability features. Click "Suggest Claims" for AI assistance.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {isSuggestingClaims && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating suggestions...
            </div>
          )}
          {suggestedClaims.length > 0 && (
            <div className="space-y-2 pt-2">
              <p className="text-sm font-medium text-muted-foreground">Click to add a suggestion:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedClaims.map((claim, index) => (
                  <Button key={index} type="button" variant="outline" size="sm" onClick={() => handleClaimClick(claim)}>
                    {claim}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <FormField
            control={form.control}
            name="energyLabel"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                    Energy Label
                    <AiIndicator fieldOrigin={initialData?.energyLabelOrigin} fieldName="Energy Label" />
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g., A++" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="item-3">
        <AccordionTrigger className="text-lg font-semibold">Technical Specifications</AccordionTrigger>
        <AccordionContent className="pt-4">
           <FormField
              control={form.control}
              name="specifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Specifications (JSON format)
                    <AiIndicator fieldOrigin={initialData?.specificationsOrigin} fieldName="Specifications" />
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder='e.g., { "color": "blue", "weight": "10kg" }' {...field} rows={5} />
                  </FormControl>
                  <FormDescription>
                    Enter detailed product specifications as a JSON object. If AI extracted this, ensure it is valid JSON.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-4">
        <AccordionTrigger className="text-lg font-semibold flex items-center">
            <BatteryCharging className="mr-2 h-5 w-5 text-primary" /> Battery Passport Details
        </AccordionTrigger>
        <AccordionContent className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="batteryChemistry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Battery Chemistry
                    <AiIndicator fieldOrigin={initialData?.batteryChemistryOrigin} fieldName="Battery Chemistry" />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Li-ion NMC, LFP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stateOfHealth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    State of Health (%)
                    <AiIndicator fieldOrigin={initialData?.stateOfHealthOrigin} fieldName="State of Health" />
                  </FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 98" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? null : e.target.valueAsNumber)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="carbonFootprintManufacturing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Manufacturing Carbon Footprint (kg CO₂e)
                    <AiIndicator fieldOrigin={initialData?.carbonFootprintManufacturingOrigin} fieldName="Carbon Footprint" />
                  </FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 75.5" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? null : e.target.valueAsNumber)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recycledContentPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Recycled Content (%)
                    <AiIndicator fieldOrigin={initialData?.recycledContentPercentageOrigin} fieldName="Recycled Content" />
                  </FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 15" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? null : e.target.valueAsNumber)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );


  if (isStandalonePage) {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Product Information</CardTitle>
              <CardDescription>Fill in the details for the Digital Product Passport. Fields suggested by AI will be marked with a <Cpu className="inline h-4 w-4 text-info align-middle" /> icon.</CardDescription>
            </CardHeader>
            <CardContent>
              {formContent}
            </CardContent>
          </Card>
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto" disabled={!!isSubmitting || isGeneratingImage || isSuggestingClaims || isSuggestingName || isSuggestingDescription}>
            {(isSubmitting || isGeneratingImage || isSuggestingClaims || isSuggestingName || isSuggestingDescription) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Saving Product..." : "Save Product"}
          </Button>
        </form>
      </Form>
    );
  }

  return (
     <Form {...form}>
        <form id={id} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6"> {/* Ensure form has an ID if used externally */}
          {formContent}
           {/* Button is rendered by parent component when not standalone */}
        </form>
    </Form>
  );
}

    