
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
import { Cpu, BatteryCharging, Loader2, Sparkles, PlusCircle, Info, Trash2, XCircle, Image as ImageIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import BasicInfoFormSection from "./form/BasicInfoFormSection";
import ProductImageFormSection from "./form/ProductImageFormSection";
import BatteryDetailsFormSection from "./form/BatteryDetailsFormSection";
import SustainabilityComplianceFormSection from "./form/SustainabilityComplianceFormSection";
import TechnicalSpecificationsFormSection from "./form/TechnicalSpecificationsFormSection";
import CustomAttributesFormSection from "./form/CustomAttributesFormSection";
import {
  handleSuggestNameAI,
  handleSuggestDescriptionAI,
  handleSuggestClaimsAI,
  handleGenerateImageAI,
  handleSuggestSpecificationsAI,
} from "@/utils/aiFormHelpers";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { CustomAttribute } from "@/types/dpp";


const formSchema = z.object({
  productName: z.string().min(2, "Product name must be at least 2 characters.").optional(),
  productNameOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  gtin: z.string().optional().describe("Global Trade Item Number"),
  productDescription: z.string().optional(),
  productDescriptionOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  manufacturer: z.string().optional(),
  manufacturerOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  modelNumber: z.string().optional(),
  modelNumberOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  materials: z.string().optional().describe("Key materials used in the product, e.g., Cotton, Recycled Polyester, Aluminum."),
  materialsOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  sustainabilityClaims: z.string().optional().describe("Brief sustainability claims, e.g., 'Made with 50% recycled content', 'Carbon neutral production'."),
  sustainabilityClaimsOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  specifications: z.string().optional(),
  specificationsOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  energyLabel: z.string().optional(),
  energyLabelOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  productCategory: z.string().optional().describe("Category of the product, e.g., Electronics, Apparel."),
  imageUrl: z.string().url("Must be a valid URL or Data URI").optional().or(z.literal("")),
  imageHint: z.string().max(30, "Hint should be concise, max 2-3 words or 30 chars.").optional(),
  imageUrlOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  batteryChemistry: z.string().optional(),
  batteryChemistryOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  stateOfHealth: z.coerce.number().nullable().optional(),
  stateOfHealthOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  carbonFootprintManufacturing: z.coerce.number().nullable().optional(),
  carbonFootprintManufacturingOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  recycledContentPercentage: z.coerce.number().nullable().optional(),
  recycledContentPercentageOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  customAttributesJsonString: z.string().optional(),
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
      productNameOrigin: initialData?.productNameOrigin,
      gtin: initialData?.gtin || "",
      productDescription: initialData?.productDescription || "",
      productDescriptionOrigin: initialData?.productDescriptionOrigin,
      manufacturer: initialData?.manufacturer || "",
      manufacturerOrigin: initialData?.manufacturerOrigin,
      modelNumber: initialData?.modelNumber || "",
      modelNumberOrigin: initialData?.modelNumberOrigin,
      materials: initialData?.materials || "",
      materialsOrigin: initialData?.materialsOrigin,
      sustainabilityClaims: initialData?.sustainabilityClaims || "",
      sustainabilityClaimsOrigin: initialData?.sustainabilityClaimsOrigin,
      specifications: initialData?.specifications ? (typeof initialData.specifications === 'string' ? initialData.specifications : JSON.stringify(initialData.specifications, null, 2)) : "",
      specificationsOrigin: initialData?.specificationsOrigin,
      energyLabel: initialData?.energyLabel || "",
      energyLabelOrigin: initialData?.energyLabelOrigin,
      productCategory: initialData?.productCategory || "",
      imageUrl: initialData?.imageUrl || "",
      imageHint: initialData?.imageHint || "",
      imageUrlOrigin: initialData?.imageUrlOrigin,
      batteryChemistry: initialData?.batteryChemistry || "",
      batteryChemistryOrigin: initialData?.batteryChemistryOrigin,
      stateOfHealth: initialData?.stateOfHealth ?? undefined,
      stateOfHealthOrigin: initialData?.stateOfHealthOrigin,
      carbonFootprintManufacturing: initialData?.carbonFootprintManufacturing ?? undefined,
      carbonFootprintManufacturingOrigin: initialData?.carbonFootprintManufacturingOrigin,
      recycledContentPercentage: initialData?.recycledContentPercentage ?? undefined,
      recycledContentPercentageOrigin: initialData?.recycledContentPercentageOrigin,
      customAttributesJsonString: initialData?.customAttributesJsonString || "",
    },
  });

  const { toast } = useToast();
  const [suggestedClaims, setSuggestedClaims] = useState<string[]>([]);

  const [isSuggestingName, setIsSuggestingName] = useState(false);
  const [isSuggestingDescription, setIsSuggestingDescription] = useState(false);
  const [isSuggestingClaims, setIsSuggestingClaims] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isSuggestingSpecs, setIsSuggestingSpecs] = useState(false);

  const [customAttributes, setCustomAttributes] = useState<CustomAttribute[]>([]);
  const [currentCustomKey, setCurrentCustomKey] = useState("");
  const [currentCustomValue, setCurrentCustomValue] = useState("");

  useEffect(() => {
    if (initialData?.customAttributesJsonString) {
      try {
        const parsedAttributes = JSON.parse(initialData.customAttributesJsonString);
        if (Array.isArray(parsedAttributes)) {
          setCustomAttributes(parsedAttributes);
        }
      } catch (e) {
        console.error("Failed to parse custom attributes JSON:", e);
        setCustomAttributes([]);
      }
    } else {
      setCustomAttributes([]);
    }
  }, [initialData?.customAttributesJsonString]);

  useEffect(() => {
    if (initialData) {
      form.reset({
        productName: initialData.productName || "",
        productNameOrigin: initialData.productNameOrigin,
        gtin: initialData.gtin || "",
        productDescription: initialData.productDescription || "",
        productDescriptionOrigin: initialData.productDescriptionOrigin,
        manufacturer: initialData.manufacturer || "",
        manufacturerOrigin: initialData.manufacturerOrigin,
        modelNumber: initialData.modelNumber || "",
        modelNumberOrigin: initialData.modelNumberOrigin,
        materials: initialData.materials || "",
        materialsOrigin: initialData.materialsOrigin,
        sustainabilityClaims: initialData.sustainabilityClaims || "",
        sustainabilityClaimsOrigin: initialData.sustainabilityClaimsOrigin,
        specifications: initialData.specifications ? (typeof initialData.specifications === 'string' ? initialData.specifications : JSON.stringify(initialData.specifications, null, 2)) : "",
        specificationsOrigin: initialData.specificationsOrigin,
        energyLabel: initialData.energyLabel || "",
        energyLabelOrigin: initialData.energyLabelOrigin,
        productCategory: initialData.productCategory || "",
        imageUrl: initialData.imageUrl || "",
        imageHint: initialData.imageHint || "",
        imageUrlOrigin: initialData.imageUrlOrigin,
        batteryChemistry: initialData.batteryChemistry || "",
        batteryChemistryOrigin: initialData.batteryChemistryOrigin,
        stateOfHealth: initialData.stateOfHealth ?? undefined,
        stateOfHealthOrigin: initialData.stateOfHealthOrigin,
        carbonFootprintManufacturing: initialData.carbonFootprintManufacturing ?? undefined,
        carbonFootprintManufacturingOrigin: initialData.carbonFootprintManufacturingOrigin,
        recycledContentPercentage: initialData.recycledContentPercentage ?? undefined,
        recycledContentPercentageOrigin: initialData.recycledContentPercentageOrigin,
        customAttributesJsonString: initialData.customAttributesJsonString || "",
      });
    }
  }, [initialData, form]);
  
  useEffect(() => {
    form.setValue("customAttributesJsonString", JSON.stringify(customAttributes), { shouldValidate: true });
  }, [customAttributes, form]);


  const handleFormSubmit = (data: ProductFormData) => {
    const dataToSubmit = {
      ...data,
      customAttributesJsonString: JSON.stringify(customAttributes)
    };
    onSubmit(dataToSubmit);
  };


  const callSuggestNameAI = async () => {
    const result = await handleSuggestNameAI(form, toast, setIsSuggestingName);
    if (result) {
        form.setValue("productName", result, { shouldValidate: true });
        form.setValue("productNameOrigin", 'AI_EXTRACTED');
    }
  };

  const callSuggestDescriptionAI = async () => {
    const result = await handleSuggestDescriptionAI(form, toast, setIsSuggestingDescription);
     if (result) {
        form.setValue("productDescription", result, { shouldValidate: true });
        form.setValue("productDescriptionOrigin", 'AI_EXTRACTED');
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
        form.setValue("specificationsOrigin", 'AI_EXTRACTED');
    }
  };

  const anyAISuggestionInProgress = isSuggestingName || isSuggestingDescription || isSuggestingClaims || isGeneratingImage || isSuggestingSpecs;

  const handleClaimClick = (claim: string) => {
    const currentClaimsValue = form.getValues("sustainabilityClaims") || "";
    const newClaimsValue = currentClaimsValue ? `${currentClaimsValue}\n- ${claim}` : `- ${claim}`;
    form.setValue("sustainabilityClaims", newClaimsValue, { shouldValidate: true });
    form.setValue("sustainabilityClaimsOrigin", 'manual');
  };

  const handleAddCustomAttribute = () => {
    if (currentCustomKey.trim() && currentCustomValue.trim()) {
      if (customAttributes.some(attr => attr.key.toLowerCase() === currentCustomKey.trim().toLowerCase())) {
        toast({
          title: "Duplicate Key",
          description: "An attribute with this key already exists. Please use a unique key.",
          variant: "destructive",
        });
        return;
      }
      setCustomAttributes([...customAttributes, { key: currentCustomKey.trim(), value: currentCustomValue.trim() }]);
      setCurrentCustomKey("");
      setCurrentCustomValue("");
    } else {
      toast({
        title: "Missing Input",
        description: "Please provide both a key and a value for the custom attribute.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveCustomAttribute = (keyToRemove: string) => {
    setCustomAttributes(customAttributes.filter(attr => attr.key !== keyToRemove));
  };


  const formContent = (
    <Accordion type="multiple" defaultValue={['item-1', 'item-5', 'item-2', 'item-3', 'item-4', 'item-custom-attributes']} className="w-full">
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
        <AccordionTrigger className="text-lg font-semibold flex items-center">
          <ImageIcon className="mr-2 h-5 w-5 text-primary" /> Product Image
        </AccordionTrigger>
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
        <AccordionContent>
          <SustainabilityComplianceFormSection
            form={form}
            initialData={initialData}
            isSuggestingClaims={isSuggestingClaims}
            callSuggestClaimsAI={callSuggestClaimsAI}
            suggestedClaims={suggestedClaims}
            handleClaimClick={handleClaimClick}
            anyAISuggestionInProgress={anyAISuggestionInProgress}
            isSubmittingForm={isSubmitting}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3">
        <AccordionTrigger className="text-lg font-semibold">Technical Specifications</AccordionTrigger>
        <AccordionContent>
          <TechnicalSpecificationsFormSection
            form={form}
            initialData={initialData}
            isSuggestingSpecs={isSuggestingSpecs}
            callSuggestSpecificationsAI={callSuggestSpecificationsAI}
            anyAISuggestionInProgress={anyAISuggestionInProgress}
            isSubmittingForm={isSubmitting}
          />
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
        <AccordionContent>
          <CustomAttributesFormSection
            customAttributes={customAttributes}
            setCustomAttributes={setCustomAttributes}
            currentCustomKey={currentCustomKey}
            setCurrentCustomKey={setCurrentCustomKey}
            currentCustomValue={currentCustomValue}
            setCurrentCustomValue={setCurrentCustomValue}
            handleAddCustomAttribute={handleAddCustomAttribute}
            handleRemoveCustomAttribute={handleRemoveCustomAttribute}
            form={form}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  if (isStandalonePage) {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
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
        <form id={id} onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">{formContent}</form>
    </Form>
  );
}

    
