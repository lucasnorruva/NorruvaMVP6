
"use client";
// --- File: ProductForm.tsx ---
// Description: Main form component for creating or editing product DPPs.
// AI loading states for text suggestions are now managed within individual section components.

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
import { Cpu, BatteryCharging, Loader2, Sparkles, PlusCircle, Info, Trash2, XCircle, Image as ImageIcon, FileText, Leaf, Settings2, Tag } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import BasicInfoFormSection from "./form/BasicInfoFormSection";
import ProductImageFormSection from "./form/ProductImageFormSection";
import BatteryDetailsFormSection from "./form/BatteryDetailsFormSection";
import SustainabilityComplianceFormSection from "./form/SustainabilityComplianceFormSection";
import TechnicalSpecificationsFormSection from "./form/TechnicalSpecificationsFormSection";
import CustomAttributesFormSection from "./form/CustomAttributesFormSection";
import {
  handleGenerateImageAI, 
} from "@/utils/aiFormHelpers";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { CustomAttribute, BatteryRegulationDetails, CarbonFootprintData, StateOfHealthData, RecycledContentData } from "@/types/dpp";


const carbonFootprintSchema = z.object({
  value: z.coerce.number().nullable().optional(),
  unit: z.string().optional(),
  calculationMethod: z.string().optional(),
  vcId: z.string().optional(),
});

const recycledContentSchema = z.object({
  material: z.string().optional(),
  percentage: z.coerce.number().nullable().optional(),
  vcId: z.string().optional(),
});

const stateOfHealthSchema = z.object({
  value: z.coerce.number().nullable().optional(),
  unit: z.string().optional(),
  measurementDate: z.string().optional(), // Assuming ISO date string
  vcId: z.string().optional(),
});

const batteryRegulationDetailsSchema = z.object({
  batteryChemistry: z.string().optional(),
  batteryPassportId: z.string().optional(),
  carbonFootprint: carbonFootprintSchema.optional(),
  recycledContent: z.array(recycledContentSchema).optional(),
  stateOfHealth: stateOfHealthSchema.optional(),
  vcId: z.string().optional(), // Overall VC ID for battery regulation
});


const formSchema = z.object({
  productName: z.string().min(2, "Product name must be at least 2 characters.").optional(),
  // Removed productNameOrigin - managed in parent state
  gtin: z.string().optional().describe("Global Trade Item Number"),
  productDescription: z.string().optional(),
  // Removed productDescriptionOrigin
  manufacturer: z.string().optional(),
  // Removed manufacturerOrigin
  modelNumber: z.string().optional(),
  // Removed modelNumberOrigin
  sku: z.string().optional(),
  nfcTagId: z.string().optional(),
  rfidTagId: z.string().optional(),
  materials: z.string().optional().describe("Key materials used in the product, e.g., Cotton, Recycled Polyester, Aluminum."),
  // Removed materialsOrigin
  sustainabilityClaims: z.string().optional().describe("Brief sustainability claims, e.g., 'Made with 50% recycled content', 'Carbon neutral production'."),
  // Removed sustainabilityClaimsOrigin
  specifications: z.string().optional(),
  // Removed specificationsOrigin
  energyLabel: z.string().optional(),
  // Removed energyLabelOrigin
  productCategory: z.string().optional().describe("Category of the product, e.g., Electronics, Apparel."),
  imageUrl: z.string().url("Must be a valid URL or Data URI").optional().or(z.literal("")),
  imageHint: z.string().max(60, "Hint should be concise, max 2-3 keywords or 60 chars.").optional(),
  // Removed imageUrlOrigin
  
  // New nested batteryRegulation object
  batteryRegulation: batteryRegulationDetailsSchema.optional(),

  customAttributesJsonString: z.string().optional(),
  // Origins for battery fields are not part of Zod schema, managed in parent state
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
            <p>This {fieldName.toLowerCase()} was suggested by AI.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  return null;
};


interface ProductFormProps {
  id?: string; // Form ID for standalone usage
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
      // productNameOrigin: initialData?.productNameOrigin, // Not part of form data schema
      gtin: initialData?.gtin || "",
      productDescription: initialData?.productDescription || "",
      // productDescriptionOrigin: initialData?.productDescriptionOrigin,
      manufacturer: initialData?.manufacturer || "",
      // manufacturerOrigin: initialData?.manufacturerOrigin,
      modelNumber: initialData?.modelNumber || "",
      // modelNumberOrigin: initialData?.modelNumberOrigin,
      sku: initialData?.sku || "",
      nfcTagId: initialData?.nfcTagId || "",
      rfidTagId: initialData?.rfidTagId || "",
      materials: initialData?.materials || "",
      // materialsOrigin: initialData?.materialsOrigin,
      sustainabilityClaims: initialData?.sustainabilityClaims || "",
      // sustainabilityClaimsOrigin: initialData?.sustainabilityClaimsOrigin,
      specifications: initialData?.specifications ? (typeof initialData.specifications === 'string' ? initialData.specifications : JSON.stringify(initialData.specifications, null, 2)) : "",
      // specificationsOrigin: initialData?.specificationsOrigin,
      energyLabel: initialData?.energyLabel || "",
      // energyLabelOrigin: initialData?.energyLabelOrigin,
      productCategory: initialData?.productCategory || "",
      imageUrl: initialData?.imageUrl || "",
      imageHint: initialData?.imageHint || "",
      // imageUrlOrigin: initialData?.imageUrlOrigin,
      
      // Initialize new nested batteryRegulation object
      batteryRegulation: initialData?.batteryRegulation ? {
        batteryChemistry: initialData.batteryRegulation.batteryChemistry || "",
        batteryPassportId: initialData.batteryRegulation.batteryPassportId || "",
        carbonFootprint: {
          value: initialData.batteryRegulation.carbonFootprint?.value ?? undefined,
          unit: initialData.batteryRegulation.carbonFootprint?.unit || "",
          calculationMethod: initialData.batteryRegulation.carbonFootprint?.calculationMethod || "",
          vcId: initialData.batteryRegulation.carbonFootprint?.vcId || "",
        },
        recycledContent: initialData.batteryRegulation.recycledContent || [],
        stateOfHealth: {
          value: initialData.batteryRegulation.stateOfHealth?.value ?? undefined,
          unit: initialData.batteryRegulation.stateOfHealth?.unit || "",
          measurementDate: initialData.batteryRegulation.stateOfHealth?.measurementDate || "",
          vcId: initialData.batteryRegulation.stateOfHealth?.vcId || "",
        },
        vcId: initialData.batteryRegulation.vcId || "",
      } : { // Default structure if initialData.batteryRegulation is undefined
        batteryChemistry: "",
        batteryPassportId: "",
        carbonFootprint: { value: undefined, unit: "", calculationMethod: "", vcId: "" },
        recycledContent: [],
        stateOfHealth: { value: undefined, unit: "", measurementDate: "", vcId: "" },
        vcId: "",
      },
      customAttributesJsonString: initialData?.customAttributesJsonString || "",
    },
  });

  const { toast } = useToast();
  const [suggestedClaims, setSuggestedClaims] = useState<string[]>([]);
  const [suggestedCustomAttributes, setSuggestedCustomAttributes] = useState<CustomAttribute[]>([]);


  // State for ProductImageFormSection (already managed there, but need to pass down setter)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);


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
    } else if (initialData && !initialData.customAttributesJsonString) { // Ensure it resets if initialData is provided but without customAttributesJsonString
        setCustomAttributes([]);
    }
  }, [initialData?.customAttributesJsonString]);


  // Reset form when initialData changes (e.g., when switching from AI extraction to manual or editing)
  useEffect(() => {
    if (initialData) {
      form.reset({
        productName: initialData.productName || "",
        // Removed origin fields from reset as they are not in form schema
        gtin: initialData.gtin || "",
        productDescription: initialData.productDescription || "",
        manufacturer: initialData.manufacturer || "",
        modelNumber: initialData.modelNumber || "",
        sku: initialData.sku || "",
        nfcTagId: initialData.nfcTagId || "",
        rfidTagId: initialData.rfidTagId || "",
        materials: initialData.materials || "",
        sustainabilityClaims: initialData.sustainabilityClaims || "",
        specifications: initialData.specifications ? (typeof initialData.specifications === 'string' ? initialData.specifications : JSON.stringify(initialData.specifications, null, 2)) : "",
        energyLabel: initialData.energyLabel || "",
        productCategory: initialData.productCategory || "",
        imageUrl: initialData.imageUrl || "",
        imageHint: initialData.imageHint || "",
        batteryRegulation: initialData.batteryRegulation ? {
          batteryChemistry: initialData.batteryRegulation.batteryChemistry || "",
          batteryPassportId: initialData.batteryRegulation.batteryPassportId || "",
          carbonFootprint: {
            value: initialData.batteryRegulation.carbonFootprint?.value ?? undefined,
            unit: initialData.batteryRegulation.carbonFootprint?.unit || "",
            calculationMethod: initialData.batteryRegulation.carbonFootprint?.calculationMethod || "",
            vcId: initialData.batteryRegulation.carbonFootprint?.vcId || "",
          },
          recycledContent: initialData.batteryRegulation.recycledContent || [],
          stateOfHealth: {
            value: initialData.batteryRegulation.stateOfHealth?.value ?? undefined,
            unit: initialData.batteryRegulation.stateOfHealth?.unit || "",
            measurementDate: initialData.batteryRegulation.stateOfHealth?.measurementDate || "",
            vcId: initialData.batteryRegulation.stateOfHealth?.vcId || "",
          },
          vcId: initialData.batteryRegulation.vcId || "",
        } : { // Default structure if initialData.batteryRegulation is undefined
          batteryChemistry: "",
          batteryPassportId: "",
          carbonFootprint: { value: undefined, unit: "", calculationMethod: "", vcId: "" },
          recycledContent: [],
          stateOfHealth: { value: undefined, unit: "", measurementDate: "", vcId: "" },
          vcId: "",
        },
        customAttributesJsonString: initialData.customAttributesJsonString || "",
      });
    }
  }, [initialData, form]);
  
  useEffect(() => {
    form.setValue("customAttributesJsonString", JSON.stringify(customAttributes), { shouldValidate: true });
  }, [customAttributes, form]);


  const handleFormSubmit = (data: ProductFormData) => {
    // Transform batteryRegulation fields that are empty strings for numbers to null
    const transformedData = { ...data };
    if (transformedData.batteryRegulation) {
      if (transformedData.batteryRegulation.carbonFootprint) {
        if (transformedData.batteryRegulation.carbonFootprint.value === undefined || String(transformedData.batteryRegulation.carbonFootprint.value).trim() === "") {
          transformedData.batteryRegulation.carbonFootprint.value = null;
        }
      }
      if (transformedData.batteryRegulation.stateOfHealth) {
         if (transformedData.batteryRegulation.stateOfHealth.value === undefined || String(transformedData.batteryRegulation.stateOfHealth.value).trim() === "") {
          transformedData.batteryRegulation.stateOfHealth.value = null;
        }
      }
      if (transformedData.batteryRegulation.recycledContent) {
        transformedData.batteryRegulation.recycledContent = transformedData.batteryRegulation.recycledContent.map(item => ({
          ...item,
          percentage: (item.percentage === undefined || String(item.percentage).trim() === "") ? null : item.percentage,
        }));
      }
    }
    
    const dataToSubmit = {
      ...transformedData,
      customAttributesJsonString: JSON.stringify(customAttributes)
    };
    onSubmit(dataToSubmit);
  };


  const handleClaimClick = (claim: string) => {
    const currentClaimsValue = form.getValues("sustainabilityClaims") || "";
    const newClaimsValue = currentClaimsValue ? `${currentClaimsValue}\n- ${claim}` : `- ${claim}`;
    form.setValue("sustainabilityClaims", newClaimsValue, { shouldValidate: true });
    // form.setValue("sustainabilityClaimsOrigin", 'manual'); // Origin managed by parent
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
  
  const handleAddSuggestedCustomAttribute = (suggestedAttr: CustomAttribute) => {
    if (customAttributes.some(attr => attr.key.toLowerCase() === suggestedAttr.key.toLowerCase())) {
      toast({
        title: "Attribute Exists",
        description: `An attribute with key "${suggestedAttr.key}" already exists. You can edit it or use a different key.`,
        variant: "default",
      });
      return;
    }
    setCustomAttributes(prev => [...prev, suggestedAttr]);
    setSuggestedCustomAttributes(prev => prev.filter(attr => attr.key !== suggestedAttr.key));
    toast({ title: "Attribute Added", description: `"${suggestedAttr.key}" has been added.`, variant: "default" });
  };


  const formContent = (
    <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3', 'item-4', 'item-5', 'item-6']} className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-lg font-semibold flex items-center"><FileText className="mr-2 h-5 w-5 text-primary" />Basic Information</AccordionTrigger>
        <AccordionContent>
          <BasicInfoFormSection
            form={form}
            initialData={initialData}
            isSubmittingForm={isSubmitting}
            toast={toast}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger className="text-lg font-semibold flex items-center">
          <ImageIcon className="mr-2 h-5 w-5 text-primary" /> Product Image
        </AccordionTrigger>
        <AccordionContent>
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

      <AccordionItem value="item-3">
        <AccordionTrigger className="text-lg font-semibold flex items-center"><Leaf className="mr-2 h-5 w-5 text-primary" />Sustainability & Compliance</AccordionTrigger>
        <AccordionContent>
          <SustainabilityComplianceFormSection
            form={form}
            initialData={initialData}
            suggestedClaims={suggestedClaims}
            setSuggestedClaims={setSuggestedClaims}
            handleClaimClick={handleClaimClick}
            isSubmittingForm={isSubmitting}
            toast={toast}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-4">
        <AccordionTrigger className="text-lg font-semibold flex items-center"><Tag className="mr-2 h-5 w-5 text-primary" />Technical Specifications</AccordionTrigger>
        <AccordionContent>
          <TechnicalSpecificationsFormSection
            form={form}
            initialData={initialData}
            isSubmittingForm={isSubmitting}
            toast={toast}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-5">
        <AccordionTrigger className="text-lg font-semibold flex items-center"><BatteryCharging className="mr-2 h-5 w-5 text-primary" /> Battery Details (if applicable)</AccordionTrigger>
        <AccordionContent>
          <BatteryDetailsFormSection 
            form={form} 
            initialData={initialData} 
            isSubmittingForm={isSubmitting}
            toast={toast}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-6">
        <AccordionTrigger className="text-lg font-semibold flex items-center"><Settings2 className="mr-2 h-5 w-5 text-primary" />Custom Attributes</AccordionTrigger>
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
            suggestedCustomAttributes={suggestedCustomAttributes}
            setSuggestedCustomAttributes={setSuggestedCustomAttributes}
            isSubmittingForm={isSubmitting}
            toast={toast}
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
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto" disabled={!!isSubmitting || isGeneratingImage}>
            {(!!isSubmitting || isGeneratingImage) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Saving..." : (isGeneratingImage ? "AI Processing..." : "Save Product")}
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

