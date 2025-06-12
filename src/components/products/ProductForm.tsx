
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
import { Cpu, BatteryCharging, Loader2, Sparkles, PlusCircle, Info, Trash2, XCircle, Image as ImageIcon, FileText, Leaf, Settings2, Tag, Anchor, Database } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import BasicInfoFormSection from "./form/BasicInfoFormSection";
import ProductImageFormSection from "./form/ProductImageFormSection";
import BatteryDetailsFormSection from "./form/BatteryDetailsFormSection";
import SustainabilityComplianceFormSection from "./form/SustainabilityComplianceFormSection";
import TechnicalSpecificationsFormSection from "./form/TechnicalSpecificationsFormSection";
import CustomAttributesFormSection from "./form/CustomAttributesFormSection";
import ScipNotificationFormSection from "./form/ScipNotificationFormSection"; // New Import
import EuCustomsDataFormSection from "./form/EuCustomsDataFormSection"; // New Import
import {
  handleGenerateImageAI, 
} from "@/utils/aiFormHelpers";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { CustomAttribute, BatteryRegulationDetails, CarbonFootprintData, StateOfHealthData, RecycledContentData, ScipNotificationDetails, EuCustomsDataDetails } from "@/types/dpp";


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
  measurementDate: z.string().optional(),
  vcId: z.string().optional(),
});

const batteryRegulationDetailsSchema = z.object({
  status: z.string().optional(),
  batteryChemistry: z.string().optional(),
  batteryPassportId: z.string().optional(),
  carbonFootprint: carbonFootprintSchema.optional(),
  recycledContent: z.array(recycledContentSchema).optional(),
  stateOfHealth: stateOfHealthSchema.optional(),
  vcId: z.string().optional(),
});

const scipNotificationSchema = z.object({
  status: z.string().optional(),
  notificationId: z.string().optional(),
  svhcListVersion: z.string().optional(),
  submittingLegalEntity: z.string().optional(),
  articleName: z.string().optional(),
  primaryArticleId: z.string().optional(),
  safeUseInstructionsLink: z.string().url().or(z.literal("")).optional(),
});

const customsValuationSchema = z.object({
  value: z.coerce.number().nullable().optional(),
  currency: z.string().optional(),
});

const euCustomsDataSchema = z.object({
  status: z.string().optional(),
  declarationId: z.string().optional(),
  hsCode: z.string().optional(),
  countryOfOrigin: z.string().optional(),
  netWeightKg: z.coerce.number().nullable().optional(),
  grossWeightKg: z.coerce.number().nullable().optional(),
  customsValuation: customsValuationSchema.optional(),
});

const formSchema = z.object({
  productName: z.string().min(2, "Product name must be at least 2 characters.").optional(),
  gtin: z.string().optional().describe("Global Trade Item Number"),
  productDescription: z.string().optional(),
  manufacturer: z.string().optional(),
  modelNumber: z.string().optional(),
  sku: z.string().optional(),
  nfcTagId: z.string().optional(),
  rfidTagId: z.string().optional(),
  materials: z.string().optional().describe("Key materials used in the product, e.g., Cotton, Recycled Polyester, Aluminum."),
  sustainabilityClaims: z.string().optional().describe("Brief sustainability claims, e.g., 'Made with 50% recycled content', 'Carbon neutral production'."),
  specifications: z.string().optional(),
  energyLabel: z.string().optional(),
  productCategory: z.string().optional().describe("Category of the product, e.g., Electronics, Apparel."),
  imageUrl: z.string().url("Must be a valid URL or Data URI").optional().or(z.literal("")),
  imageHint: z.string().max(60, "Hint should be concise, max 2-3 keywords or 60 chars.").optional(),
  
  batteryRegulation: batteryRegulationDetailsSchema.optional(),
  customAttributesJsonString: z.string().optional(),

  // Add new compliance sections
  compliance: z.object({
    eprel: z.object({ // Assuming eprel structure might be simple or expanded later
        id: z.string().optional(),
        status: z.string().optional(),
        url: z.string().url().or(z.literal("")).optional(),
        lastChecked: z.string().optional(), // This might not be a form field
    }).optional(),
    esprConformity: z.object({
        assessmentId: z.string().optional(),
        status: z.string().optional(), // e.g., 'conformant', 'non_conformant'
        assessmentDate: z.string().optional(), // ISO Date
        vcId: z.string().optional(),
    }).optional(),
    scipNotification: scipNotificationSchema.optional(),
    euCustomsData: euCustomsDataSchema.optional(),
    battery_regulation: batteryRegulationDetailsSchema.optional(), // Renamed from batteryRegulation to match openapi.yaml style
  }).optional(),
  
  // These origin fields are for parent state management, not part of Zod schema for form data
  productNameOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  productDescriptionOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  manufacturerOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  modelNumberOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  materialsOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  sustainabilityClaimsOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  specificationsOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  energyLabelOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  imageUrlOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  batteryRegulationOrigin: z.any().optional(), // Complex origin object, not for Zod validation
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
      sku: initialData?.sku || "",
      nfcTagId: initialData?.nfcTagId || "",
      rfidTagId: initialData?.rfidTagId || "",
      materials: initialData?.materials || "",
      sustainabilityClaims: initialData?.sustainabilityClaims || "",
      specifications: initialData?.specifications ? (typeof initialData.specifications === 'string' ? initialData.specifications : JSON.stringify(initialData.specifications, null, 2)) : "",
      energyLabel: initialData?.energyLabel || "",
      productCategory: initialData?.productCategory || "",
      imageUrl: initialData?.imageUrl || "",
      imageHint: initialData?.imageHint || "",
      
      batteryRegulation: initialData?.batteryRegulation ? {
        status: initialData.batteryRegulation.status || "not_applicable",
        batteryChemistry: initialData.batteryRegulation.batteryChemistry || "",
        batteryPassportId: initialData.batteryRegulation.batteryPassportId || "",
        carbonFootprint: {
          value: initialData.batteryRegulation.carbonFootprint?.value ?? null,
          unit: initialData.batteryRegulation.carbonFootprint?.unit || "",
          calculationMethod: initialData.batteryRegulation.carbonFootprint?.calculationMethod || "",
          vcId: initialData.batteryRegulation.carbonFootprint?.vcId || "",
        },
        recycledContent: initialData.batteryRegulation.recycledContent || [],
        stateOfHealth: {
          value: initialData.batteryRegulation.stateOfHealth?.value ?? null,
          unit: initialData.batteryRegulation.stateOfHealth?.unit || "",
          measurementDate: initialData.batteryRegulation.stateOfHealth?.measurementDate || "",
          vcId: initialData.batteryRegulation.stateOfHealth?.vcId || "",
        },
        vcId: initialData.batteryRegulation.vcId || "",
      } : { 
        status: "not_applicable", batteryChemistry: "", batteryPassportId: "",
        carbonFootprint: { value: null, unit: "", calculationMethod: "", vcId: "" },
        recycledContent: [],
        stateOfHealth: { value: null, unit: "", measurementDate: "", vcId: "" },
        vcId: "",
      },
      customAttributesJsonString: initialData?.customAttributesJsonString || "",
      
      compliance: { // Initialize new compliance sections
        eprel: initialData?.compliance?.eprel || { status: "N/A", id: "", url: ""},
        esprConformity: initialData?.compliance?.esprConformity || { status: "pending_assessment" },
        scipNotification: initialData?.compliance?.scipNotification || {
          status: "N/A", notificationId: "", svhcListVersion: "", submittingLegalEntity: "",
          articleName: "", primaryArticleId: "", safeUseInstructionsLink: ""
        },
        euCustomsData: initialData?.compliance?.euCustomsData || {
          status: "N/A", declarationId: "", hsCode: "", countryOfOrigin: "",
          netWeightKg: null, grossWeightKg: null,
          customsValuation: { value: null, currency: "" }
        },
        battery_regulation: initialData?.compliance?.battery_regulation || { // Use the same structure as top-level batteryRegulation
          status: "not_applicable", batteryChemistry: "", batteryPassportId: "",
          carbonFootprint: { value: null, unit: "", calculationMethod: "", vcId: "" },
          recycledContent: [],
          stateOfHealth: { value: null, unit: "", measurementDate: "", vcId: "" },
          vcId: "",
        }
      },
      // Initialize origin fields for parent component's state tracking (not for Zod)
      productNameOrigin: initialData?.productNameOrigin,
      productDescriptionOrigin: initialData?.productDescriptionOrigin,
      manufacturerOrigin: initialData?.manufacturerOrigin,
      modelNumberOrigin: initialData?.modelNumberOrigin,
      materialsOrigin: initialData?.materialsOrigin,
      sustainabilityClaimsOrigin: initialData?.sustainabilityClaimsOrigin,
      specificationsOrigin: initialData?.specificationsOrigin,
      energyLabelOrigin: initialData?.energyLabelOrigin,
      imageUrlOrigin: initialData?.imageUrlOrigin,
      batteryRegulationOrigin: initialData?.batteryRegulationOrigin,
    },
  });

  const { toast } = useToast();
  const [suggestedClaims, setSuggestedClaims] = useState<string[]>([]);
  const [suggestedCustomAttributes, setSuggestedCustomAttributes] = useState<CustomAttribute[]>([]);
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
    } else if (initialData && !initialData.customAttributesJsonString) {
        setCustomAttributes([]);
    }
  }, [initialData?.customAttributesJsonString]);

  useEffect(() => {
    if (initialData) {
      form.reset({
        productName: initialData.productName || "",
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
          status: initialData.batteryRegulation.status || "not_applicable",
          batteryChemistry: initialData.batteryRegulation.batteryChemistry || "",
          batteryPassportId: initialData.batteryRegulation.batteryPassportId || "",
          carbonFootprint: {
            value: initialData.batteryRegulation.carbonFootprint?.value ?? null,
            unit: initialData.batteryRegulation.carbonFootprint?.unit || "",
            calculationMethod: initialData.batteryRegulation.carbonFootprint?.calculationMethod || "",
            vcId: initialData.batteryRegulation.carbonFootprint?.vcId || "",
          },
          recycledContent: initialData.batteryRegulation.recycledContent || [],
          stateOfHealth: {
            value: initialData.batteryRegulation.stateOfHealth?.value ?? null,
            unit: initialData.batteryRegulation.stateOfHealth?.unit || "",
            measurementDate: initialData.batteryRegulation.stateOfHealth?.measurementDate || "",
            vcId: initialData.batteryRegulation.stateOfHealth?.vcId || "",
          },
          vcId: initialData.batteryRegulation.vcId || "",
        } : { 
          status: "not_applicable", batteryChemistry: "", batteryPassportId: "",
          carbonFootprint: { value: null, unit: "", calculationMethod: "", vcId: "" },
          recycledContent: [],
          stateOfHealth: { value: null, unit: "", measurementDate: "", vcId: "" },
          vcId: "",
        },
        customAttributesJsonString: initialData.customAttributesJsonString || "",
        compliance: {
          eprel: initialData.compliance?.eprel || { status: "N/A", id: "", url: ""},
          esprConformity: initialData.compliance?.esprConformity || { status: "pending_assessment" },
          scipNotification: initialData.compliance?.scipNotification || {
            status: "N/A", notificationId: "", svhcListVersion: "", submittingLegalEntity: "",
            articleName: "", primaryArticleId: "", safeUseInstructionsLink: ""
          },
          euCustomsData: initialData.compliance?.euCustomsData || {
            status: "N/A", declarationId: "", hsCode: "", countryOfOrigin: "",
            netWeightKg: null, grossWeightKg: null,
            customsValuation: { value: null, currency: "" }
          },
          battery_regulation: initialData.compliance?.battery_regulation || { // Match structure
            status: "not_applicable", batteryChemistry: "", batteryPassportId: "",
            carbonFootprint: { value: null, unit: "", calculationMethod: "", vcId: "" },
            recycledContent: [],
            stateOfHealth: { value: null, unit: "", measurementDate: "", vcId: "" },
            vcId: "",
          }
        },
        productNameOrigin: initialData.productNameOrigin,
        productDescriptionOrigin: initialData.productDescriptionOrigin,
        manufacturerOrigin: initialData.manufacturerOrigin,
        modelNumberOrigin: initialData.modelNumberOrigin,
        materialsOrigin: initialData.materialsOrigin,
        sustainabilityClaimsOrigin: initialData.sustainabilityClaimsOrigin,
        specificationsOrigin: initialData.specificationsOrigin,
        energyLabelOrigin: initialData.energyLabelOrigin,
        imageUrlOrigin: initialData.imageUrlOrigin,
        batteryRegulationOrigin: initialData.batteryRegulationOrigin,
      });
    }
  }, [initialData, form]);
  
  useEffect(() => {
    form.setValue("customAttributesJsonString", JSON.stringify(customAttributes), { shouldValidate: true });
  }, [customAttributes, form]);

  const handleFormSubmit = (data: ProductFormData) => {
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
    // Similar transformations for new compliance sections
    if (transformedData.compliance?.euCustomsData) {
        if(transformedData.compliance.euCustomsData.netWeightKg === undefined || String(transformedData.compliance.euCustomsData.netWeightKg).trim() === "") transformedData.compliance.euCustomsData.netWeightKg = null;
        if(transformedData.compliance.euCustomsData.grossWeightKg === undefined || String(transformedData.compliance.euCustomsData.grossWeightKg).trim() === "") transformedData.compliance.euCustomsData.grossWeightKg = null;
        if(transformedData.compliance.euCustomsData.customsValuation && (transformedData.compliance.euCustomsData.customsValuation.value === undefined || String(transformedData.compliance.euCustomsData.customsValuation.value).trim() === "")) {
            transformedData.compliance.euCustomsData.customsValuation.value = null;
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
    <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3', 'item-4', 'item-5', 'item-6', 'item-7', 'item-8']} className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-lg font-semibold flex items-center"><FileText className="mr-2 h-5 w-5 text-primary" />Basic Information</AccordionTrigger>
        <AccordionContent>
          <BasicInfoFormSection
            form={form}
            initialData={initialData}
            isSubmittingForm={!!isSubmitting}
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
        <AccordionTrigger className="text-lg font-semibold flex items-center"><Leaf className="mr-2 h-5 w-5 text-primary" />Sustainability</AccordionTrigger>
        <AccordionContent>
          <SustainabilityComplianceFormSection
            form={form}
            initialData={initialData}
            suggestedClaims={suggestedClaims}
            setSuggestedClaims={setSuggestedClaims}
            handleClaimClick={handleClaimClick}
            isSubmittingForm={!!isSubmitting}
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
            isSubmittingForm={!!isSubmitting}
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
            isSubmittingForm={!!isSubmitting}
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
            isSubmittingForm={!!isSubmitting}
            toast={toast}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-7">
        <AccordionTrigger className="text-lg font-semibold flex items-center"><Database className="mr-2 h-5 w-5 text-primary" />SCIP Notification (if applicable)</AccordionTrigger>
        <AccordionContent>
          <ScipNotificationFormSection form={form} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-8">
        <AccordionTrigger className="text-lg font-semibold flex items-center"><Anchor className="mr-2 h-5 w-5 text-primary" />EU Customs Data (if applicable)</AccordionTrigger>
        <AccordionContent>
          <EuCustomsDataFormSection form={form} />
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

