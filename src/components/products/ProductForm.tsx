
"use client";
// --- File: ProductForm.tsx ---
// Description: Main form component for creating or editing product DPPs.
// Now uses aiFormHelpers.tsx for AI logic and sub-components for sections.

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { InitialProductFormData } from "@/app/(app)/products/new/page";
import { Cpu, BatteryCharging, Loader2, Sparkles, PlusCircle, Info } from "lucide-react";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import BasicInfoFormSection from "./form/BasicInfoFormSection";
import ProductImageFormSection from "./form/ProductImageFormSection";
import BatteryDetailsFormSection from "./form/BatteryDetailsFormSection"; // New import
import {
  handleSuggestNameAI,
  handleSuggestDescriptionAI,
  handleSuggestClaimsAI,
  handleGenerateImageAI,
  handleSuggestSpecificationsAI,
} from "@/utils/aiFormHelpers.tsx"; 
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


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
  imageUrl: z.string().url("Must be a valid URL or Data URI").optional().or(z.literal("")),
  imageHint: z.string().max(30, "Hint should be concise, max 2-3 words or 30 chars.").optional(),
  batteryChemistry: z.string().optional(),
  stateOfHealth: z.coerce.number().nullable().optional(),
  carbonFootprintManufacturing: z.coerce.number().nullable().optional(),
  recycledContentPercentage: z.coerce.number().nullable().optional(),
});

export type ProductFormData = z.infer<typeof formSchema>;

interface AiIndicatorProps {
  fieldOrigin?: 'AI_EXTRACTED' | 'manual';
  fieldName: string;
}

const AiIndicator: React.FC<AiIndicatorProps> = ({ fieldOrigin, fieldName }) => {
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


interface ProductFormProps {
  id?: string; 
  initialData?: Partial<InitialProductFormData>; 
  onSubmit: (data: ProductFormData) => Promise<void>;
  isSubmitting?: boolean;
  isStandalonePage?: boolean; 
}

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
      imageHint: initialData?.imageHint || "",
      batteryChemistry: initialData?.batteryChemistry || "",
      stateOfHealth: initialData?.stateOfHealth ?? undefined,
      carbonFootprintManufacturing: initialData?.carbonFootprintManufacturing ?? undefined,
      recycledContentPercentage: initialData?.recycledContentPercentage ?? undefined,
    },
  });

  const { toast } = useToast();
  const [suggestedClaims, setSuggestedClaims] = useState<string[]>([]);
  
  const [isSuggestingName, setIsSuggestingName] = useState(false);
  const [isSuggestingDescription, setIsSuggestingDescription] = useState(false);
  const [isSuggestingClaims, setIsSuggestingClaims] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isSuggestingSpecs, setIsSuggestingSpecs] = useState(false);
  
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
        imageHint: initialData.imageHint || "",
        batteryChemistry: initialData.batteryChemistry || "",
        stateOfHealth: initialData.stateOfHealth ?? undefined,
        carbonFootprintManufacturing: initialData.carbonFootprintManufacturing ?? undefined,
        recycledContentPercentage: initialData.recycledContentPercentage ?? undefined,
      });
    }
  }, [initialData, form]);

  const callSuggestNameAI = async () => {
    const result = await handleSuggestNameAI(form, toast, setIsSuggestingName);
    if (result) {
        form.setValue("productName", result, { shouldValidate: true });
    }
  };

  const callSuggestDescriptionAI = async () => {
    const result = await handleSuggestDescriptionAI(form, toast, setIsSuggestingDescription);
     if (result) {
        form.setValue("productDescription", result, { shouldValidate: true });
    }
  };
  
  const callSuggestClaimsAI = async () => {
    const claims = await handleSuggestClaimsAI(form, toast, setIsSuggestingClaims);
    if (claims) {
        setSuggestedClaims(claims);
    } else {
        setSuggestedClaims([]);
    }
  };

  const callSuggestSpecificationsAI = async () => {
    const result = await handleSuggestSpecificationsAI(form, toast, setIsSuggestingSpecs);
    if (result) {
        form.setValue("specifications", result, { shouldValidate: true });
    }
  };
  
  const anyAISuggestionInProgress = isSuggestingName || isSuggestingDescription || isSuggestingClaims || isGeneratingImage || isSuggestingSpecs;

  const handleClaimClick = (claim: string) => {
    const currentClaimsValue = form.getValues("sustainabilityClaims") || "";
    const newClaimsValue = currentClaimsValue ? `${currentClaimsValue}\n- ${claim}` : `- ${claim}`;
    form.setValue("sustainabilityClaims", newClaimsValue, { shouldValidate: true });
  };

  const formContent = (
    <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3', 'item-4', 'item-5', 'item-custom-attributes']} className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-lg font-semibold">Basic Information</AccordionTrigger>
        <AccordionContent>
          <BasicInfoFormSection
            form={form}
            initialData={initialData}
            isSuggestingName={isSuggestingName}
            callSuggestNameAI={callSuggestNameAI}
            isSuggestingDescription={isSuggestingDescription}
            callSuggestDescriptionAI={callSuggestDescriptionAI}
            anyAISuggestionInProgress={anyAISuggestionInProgress}
            isSubmittingForm={isSubmitting}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-5">
        <AccordionTrigger className="text-lg font-semibold">Product Image</AccordionTrigger>
        <AccordionContent className="pt-4">
          <ProductImageFormSection
            form={form}
            aiImageHelper={handleGenerateImageAI} 
            initialImageUrlOrigin={initialData?.imageUrlOrigin}
            toast={toast}
            isGeneratingImageState={isGeneratingImage}
            setIsGeneratingImageState={setIsGeneratingImage}
            initialImageUrl={initialData?.imageUrl}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger className="text-lg font-semibold">Sustainability & Compliance</AccordionTrigger>
        <AccordionContent className="space-y-6 pt-4">
           <FormField control={form.control} name="materials" render={({ field }) => ( <FormItem> <FormLabel className="flex items-center">Key Materials <AiIndicator fieldOrigin={initialData?.materialsOrigin} fieldName="Key Materials" /></FormLabel> <FormControl><Textarea placeholder="e.g., Organic Cotton, Recycled PET" {...field} rows={3}/></FormControl> <FormDescription>Primary materials used.</FormDescription> <FormMessage /> </FormItem> )}/>
          <FormField control={form.control} name="sustainabilityClaims" render={({ field }) => ( <FormItem> <div className="flex items-center justify-between"> <FormLabel className="flex items-center">Sustainability Claims <AiIndicator fieldOrigin={initialData?.sustainabilityClaimsOrigin} fieldName="Sustainability Claims" /></FormLabel> <Button type="button" variant="ghost" size="sm" onClick={callSuggestClaimsAI} disabled={anyAISuggestionInProgress || !!isSubmitting}> {isSuggestingClaims ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-info" />} <span className="ml-2">{isSuggestingClaims ? "Suggesting..." : "Suggest Claims"}</span> </Button> </div> <FormControl><Textarea placeholder="e.g., - Made with 70% recycled materials" {...field} rows={3}/></FormControl> <FormDescription>Highlight key sustainability features. Each claim on a new line, optionally start with '- '. AI suggestions will follow this format.</FormDescription> <FormMessage /> </FormItem> )}/>
          {suggestedClaims.length > 0 && ( <div className="space-y-2 pt-2"> <p className="text-sm font-medium text-muted-foreground">Click to add suggested claim:</p> <div className="flex flex-wrap gap-2">{suggestedClaims.map((claim, index) => ( <Button key={index} type="button" variant="outline" size="sm" onClick={() => handleClaimClick(claim)}>{claim}</Button>))}</div> </div> )}
          <FormField control={form.control} name="energyLabel" render={({ field }) => ( <FormItem> <FormLabel className="flex items-center">Energy Label <AiIndicator fieldOrigin={initialData?.energyLabelOrigin} fieldName="Energy Label" /></FormLabel> <FormControl><Input placeholder="e.g., A++" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="item-3">
        <AccordionTrigger className="text-lg font-semibold">Technical Specifications</AccordionTrigger>
        <AccordionContent className="pt-4">
           <FormField control={form.control} name="specifications" render={({ field }) => ( 
            <FormItem> 
              <div className="flex items-center justify-between">
                <FormLabel className="flex items-center">Specifications (JSON) <AiIndicator fieldOrigin={initialData?.specificationsOrigin} fieldName="Specifications" /></FormLabel>
                <Button type="button" variant="ghost" size="sm" onClick={callSuggestSpecificationsAI} disabled={anyAISuggestionInProgress || !!isSubmitting}>
                  {isSuggestingSpecs ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-info" />}
                  <span className="ml-2">{isSuggestingSpecs ? "Suggesting..." : "Suggest Specs"}</span>
                </Button>
              </div>
              <FormControl><Textarea placeholder='e.g., { "color": "blue", "weight": "10kg" }' {...field} rows={5} /></FormControl> 
              <FormDescription>Enter as a JSON object. AI can help suggest a structure. You can pretty-format JSON using online tools before pasting.</FormDescription> 
              <FormMessage /> 
            </FormItem> 
            )}/>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-4">
        <AccordionTrigger className="text-lg font-semibold flex items-center"><BatteryCharging className="mr-2 h-5 w-5 text-primary" /> Battery Details (if applicable)</AccordionTrigger>
        <AccordionContent className="pt-4">
          <BatteryDetailsFormSection form={form} initialData={initialData} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-custom-attributes">
        <AccordionTrigger className="text-lg font-semibold">Custom Attributes</AccordionTrigger>
        <AccordionContent className="space-y-4 pt-4">
          <p className="text-sm text-muted-foreground">
            Define additional key-value pairs specific to this product category or your internal tracking needs.
            This feature allows for extending the standard DPP schema.
          </p>
          <Card className="bg-muted/50">
            <CardContent className="p-4 space-y-3">
              <div className="text-sm">
                <Label className="font-semibold text-foreground/80">Example Attribute 1:</Label>
                <p><span className="text-muted-foreground">Name:</span> EcoRating</p>
                <p><span className="text-muted-foreground">Value:</span> Gold</p>
              </div>
              <div className="text-sm border-t pt-3">
                <Label className="font-semibold text-foreground/80">Example Attribute 2:</Label>
                <p><span className="text-muted-foreground">Name:</span> SpecialFeature</p>
                <p><span className="text-muted-foreground">Value:</span> Waterproof IP68</p>
              </div>
            </CardContent>
          </Card>
          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <div className="inline-block"> 
                  <Button type="button" variant="outline" disabled>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Custom Attribute
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="flex items-center"><Info className="h-4 w-4 mr-2 text-info" /> Feature coming soon. For demonstration purposes.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
              <CardDescription>Fill in the details. AI suggestions from document extraction are marked with a <Cpu className="inline h-4 w-4 text-info align-middle" /> icon.</CardDescription>
            </CardHeader>
            <CardContent>{formContent}</CardContent>
          </Card>
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto" disabled={!!isSubmitting || anyAISuggestionInProgress}>
            {(!!isSubmitting || anyAISuggestionInProgress) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Saving..." : (anyAISuggestionInProgress ? "AI Processing..." : "Save Product")}
          </Button>
        </form>
      </Form>
    );
  }

  return (
     <Form {...form}>
        <form id={id} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">{formContent}</form>
    </Form>
  );
}
