
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
import { Cpu, BatteryCharging, Loader2, Sparkles, PlusCircle, Info, Trash2, XCircle, Image as ImageIcon, FileText, Leaf, Settings2, Tag, Anchor, Database, Shirt, Construction, Handshake } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import BasicInfoFormSection from "./form/BasicInfoFormSection";
import ProductImageFormSection from "./form/ProductImageFormSection";
import BatteryDetailsFormSection from "./form/BatteryDetailsFormSection";
import SustainabilityComplianceFormSection from "./form/SustainabilityComplianceFormSection";
import TechnicalSpecificationsFormSection from "./form/TechnicalSpecificationsFormSection";
import CustomAttributesFormSection from "./form/CustomAttributesFormSection";
import ScipNotificationFormSection from "./form/ScipNotificationFormSection"; 
import EuCustomsDataFormSection from "./form/EuCustomsDataFormSection"; 
import TextileInformationFormSection from "./form/TextileInformationFormSection"; 
import ConstructionProductInformationFormSection from "./form/ConstructionProductInformationFormSection"; 
import EthicalSourcingFormSection from "./form/EthicalSourcingFormSection"; 
import {
  handleGenerateImageAI, 
} from "@/utils/aiFormHelpers";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { CustomAttribute, BatteryRegulationDetails, CarbonFootprintData, StateOfHealthData, RecycledContentData, ScipNotificationDetails, EuCustomsDataDetails, TextileInformation, ConstructionProductInformation } from "@/types/dpp";


const carbonFootprintSchema = z.object({
  value: z.coerce.number().nullable().optional(),
  unit: z.string().optional(),
  calculationMethod: z.string().optional(),
  scope1Emissions: z.coerce.number().nullable().optional(),
  scope2Emissions: z.coerce.number().nullable().optional(),
  scope3Emissions: z.coerce.number().nullable().optional(),
  dataSource: z.string().optional(),
  vcId: z.string().optional(),
});

const recycledContentSchema = z.object({
  material: z.string().optional(),
  percentage: z.coerce.number().nullable().optional(),
  source: z.string().optional(),
  vcId: z.string().optional(),
});

const stateOfHealthSchema = z.object({
  value: z.coerce.number().nullable().optional(),
  unit: z.string().optional(),
  measurementDate: z.string().optional(),
  measurementMethod: z.string().optional(),
  vcId: z.string().optional(),
});

const batteryRegulationDetailsSchema = z.object({
  status: z.string().optional(),
  batteryChemistry: z.string().optional(),
  batteryPassportId: z.string().optional(),
  ratedCapacityAh: z.coerce.number().nullable().optional(),
  nominalVoltage: z.coerce.number().nullable().optional(),
  expectedLifetimeCycles: z.coerce.number().nullable().optional(),
  manufacturingDate: z.string().optional(),
  manufacturerName: z.string().optional(),
  carbonFootprint: carbonFootprintSchema.optional(),
  recycledContent: z.array(recycledContentSchema).optional(),
  stateOfHealth: stateOfHealthSchema.optional(),
  recyclingEfficiencyRate: z.coerce.number().nullable().optional(),
  materialRecoveryRates: z.object({
    cobalt: z.coerce.number().nullable().optional(),
    lead: z.coerce.number().nullable().optional(),
    lithium: z.coerce.number().nullable().optional(),
    nickel: z.coerce.number().nullable().optional(),
  }).optional(),
  dismantlingInformationUrl: z.string().url().or(z.literal("")).optional(),
  safetyInformationUrl: z.string().url().or(z.literal("")).optional(),
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
  cbamGoodsIdentifier: z.string().optional(), // Added for CBAM
});

const fiberCompositionEntrySchema = z.object({
  fiberName: z.string().min(1, "Fiber name is required."),
  percentage: z.coerce.number().min(0).max(100).nullable(),
});

const textileInformationSchema = z.object({
  fiberComposition: z.array(fiberCompositionEntrySchema).optional(),
  countryOfOriginLabeling: z.string().optional(),
  careInstructionsUrl: z.string().url().or(z.literal("")).optional(),
  isSecondHand: z.boolean().optional(),
});

const essentialCharacteristicSchema = z.object({
  characteristicName: z.string().min(1, "Characteristic name is required."),
  value: z.string().min(1, "Value is required."),
  unit: z.string().optional(),
  testMethod: z.string().optional(),
});

const constructionProductInformationSchema = z.object({
  declarationOfPerformanceId: z.string().optional(),
  ceMarkingDetailsUrl: z.string().url().or(z.literal("")).optional(),
  intendedUseDescription: z.string().optional(),
  essentialCharacteristics: z.array(essentialCharacteristicSchema).optional(),
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
  keyCompliancePoints: z.string().optional().describe("Key compliance points summary."), // Added for Task 21
  specifications: z.string().optional(),
  energyLabel: z.string().optional(),
  productCategory: z.string().optional().describe("Category of the product, e.g., Electronics, Apparel."),
  imageUrl: z.string().url("Must be a valid URL or Data URI").optional().or(z.literal("")),
  imageHint: z.string().max(60, "Hint should be concise, max 2-3 keywords or 60 chars.").optional(),
  
  batteryRegulation: batteryRegulationDetailsSchema.optional(),
  customAttributesJsonString: z.string().optional(),

  compliance: z.object({
    eprel: z.object({ 
        id: z.string().optional(),
        status: z.string().optional(),
        url: z.string().url().or(z.literal("")).optional(),
        lastChecked: z.string().optional(), 
    }).optional(),
    esprConformity: z.object({
        assessmentId: z.string().optional(),
        status: z.string().optional(), 
        assessmentDate: z.string().optional(), 
        vcId: z.string().optional(),
    }).optional(),
    scipNotification: scipNotificationSchema.optional(),
    euCustomsData: euCustomsDataSchema.optional(),
    battery_regulation: batteryRegulationDetailsSchema.optional(),
  }).optional(),
  
  textileInformation: textileInformationSchema.optional(), 
  constructionProductInformation: constructionProductInformationSchema.optional(), 
  onChainStatus: z.string().optional(), 
  onChainLifecycleStage: z.string().optional(), 

  // Ethical Sourcing Fields - Task 19
  conflictMineralsReportUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  fairTradeCertificationId: z.string().optional(),
  ethicalSourcingPolicyUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),

  productNameOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  productDescriptionOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  manufacturerOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  modelNumberOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  materialsOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  sustainabilityClaimsOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  keyCompliancePointsOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(), // Added for Task 21
  specificationsOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  energyLabelOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  imageUrlOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  batteryRegulationOrigin: z.any().optional(), 
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
      keyCompliancePoints: initialData?.keyCompliancePoints || "", // Added for Task 21
      specifications: initialData?.specifications ? (typeof initialData.specifications === 'string' ? initialData.specifications : JSON.stringify(initialData.specifications, null, 2)) : "",
      energyLabel: initialData?.energyLabel || "",
      productCategory: initialData?.productCategory || "",
      imageUrl: initialData?.imageUrl || "",
      imageHint: initialData?.imageHint || "",
      onChainStatus: initialData?.onChainStatus || "Unknown", 
      onChainLifecycleStage: initialData?.onChainLifecycleStage || "Unknown", 
      conflictMineralsReportUrl: initialData?.conflictMineralsReportUrl || "",
      fairTradeCertificationId: initialData?.fairTradeCertificationId || "",
      ethicalSourcingPolicyUrl: initialData?.ethicalSourcingPolicyUrl || "",
      
      batteryRegulation: initialData?.batteryRegulation ? {
        status: initialData.batteryRegulation.status || "not_applicable",
        batteryChemistry: initialData.batteryRegulation.batteryChemistry || "",
        batteryPassportId: initialData.batteryRegulation.batteryPassportId || "",
        ratedCapacityAh: initialData.batteryRegulation.ratedCapacityAh ?? null,
        nominalVoltage: initialData.batteryRegulation.nominalVoltage ?? null,
        expectedLifetimeCycles: initialData.batteryRegulation.expectedLifetimeCycles ?? null,
        manufacturingDate: initialData.batteryRegulation.manufacturingDate || "",
        manufacturerName: initialData.batteryRegulation.manufacturerName || "",
        carbonFootprint: {
          value: initialData.batteryRegulation.carbonFootprint?.value ?? null,
          unit: initialData.batteryRegulation.carbonFootprint?.unit || "",
          calculationMethod: initialData.batteryRegulation.carbonFootprint?.calculationMethod || "",
          scope1Emissions: initialData.batteryRegulation.carbonFootprint?.scope1Emissions ?? null,
          scope2Emissions: initialData.batteryRegulation.carbonFootprint?.scope2Emissions ?? null,
          scope3Emissions: initialData.batteryRegulation.carbonFootprint?.scope3Emissions ?? null,
          dataSource: initialData.batteryRegulation.carbonFootprint?.dataSource || "",
          vcId: initialData.batteryRegulation.carbonFootprint?.vcId || "",
        },
        recycledContent: initialData.batteryRegulation.recycledContent?.map(rc => ({ ...rc, percentage: rc.percentage ?? null })) || [],
        stateOfHealth: {
          value: initialData.batteryRegulation.stateOfHealth?.value ?? null,
          unit: initialData.batteryRegulation.stateOfHealth?.unit || "",
          measurementDate: initialData.batteryRegulation.stateOfHealth?.measurementDate || "",
          measurementMethod: initialData.batteryRegulation.stateOfHealth?.measurementMethod || "",
          vcId: initialData.batteryRegulation.stateOfHealth?.vcId || "",
        },
        recyclingEfficiencyRate: initialData.batteryRegulation.recyclingEfficiencyRate ?? null,
        materialRecoveryRates: {
          cobalt: initialData.batteryRegulation.materialRecoveryRates?.cobalt ?? null,
          lead: initialData.batteryRegulation.materialRecoveryRates?.lead ?? null,
          lithium: initialData.batteryRegulation.materialRecoveryRates?.lithium ?? null,
          nickel: initialData.batteryRegulation.materialRecoveryRates?.nickel ?? null,
        },
        dismantlingInformationUrl: initialData.batteryRegulation.dismantlingInformationUrl || "",
        safetyInformationUrl: initialData.batteryRegulation.safetyInformationUrl || "",
        vcId: initialData.batteryRegulation.vcId || "",
      } : { 
        status: "not_applicable", batteryChemistry: "", batteryPassportId: "",
        ratedCapacityAh: null, nominalVoltage: null, expectedLifetimeCycles: null, manufacturingDate: "", manufacturerName: "",
        carbonFootprint: { value: null, unit: "", calculationMethod: "", scope1Emissions: null, scope2Emissions: null, scope3Emissions: null, dataSource: "", vcId: "" },
        recycledContent: [],
        stateOfHealth: { value: null, unit: "", measurementDate: "", measurementMethod: "", vcId: "" },
        recyclingEfficiencyRate: null, materialRecoveryRates: {}, dismantlingInformationUrl: "", safetyInformationUrl: "", vcId: "",
      },
      customAttributesJsonString: initialData?.customAttributesJsonString || "",
      
      compliance: { 
        eprel: initialData?.compliance?.eprel || { status: "N/A", id: "", url: ""},
        esprConformity: initialData?.compliance?.esprConformity || { status: "pending_assessment" },
        scipNotification: initialData?.compliance?.scipNotification || {
          status: "N/A", notificationId: "", svhcListVersion: "", submittingLegalEntity: "",
          articleName: "", primaryArticleId: "", safeUseInstructionsLink: ""
        },
        euCustomsData: initialData?.compliance?.euCustomsData || {
          status: "N/A", declarationId: "", hsCode: "", countryOfOrigin: "",
          netWeightKg: null, grossWeightKg: null,
          customsValuation: { value: null, currency: "" },
          cbamGoodsIdentifier: "" // Added for CBAM
        },
        battery_regulation: initialData?.compliance?.battery_regulation || { 
          status: "not_applicable", batteryChemistry: "", batteryPassportId: "",
          carbonFootprint: { value: null, unit: "", calculationMethod: "", vcId: "" },
          recycledContent: [],
          stateOfHealth: { value: null, unit: "", measurementDate: "", vcId: "" },
          vcId: "",
        }
      },
      textileInformation: initialData?.textileInformation || { fiberComposition: [], isSecondHand: false }, 
      constructionProductInformation: initialData?.constructionProductInformation || { essentialCharacteristics: [] }, 

      productNameOrigin: initialData?.productNameOrigin,
      productDescriptionOrigin: initialData?.productDescriptionOrigin,
      manufacturerOrigin: initialData?.manufacturerOrigin,
      modelNumberOrigin: initialData?.modelNumberOrigin,
      materialsOrigin: initialData?.materialsOrigin,
      sustainabilityClaimsOrigin: initialData?.sustainabilityClaimsOrigin,
      keyCompliancePointsOrigin: initialData?.keyCompliancePointsOrigin, // Added for Task 21
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
        keyCompliancePoints: initialData.keyCompliancePoints || "", // Added for Task 21
        specifications: initialData.specifications ? (typeof initialData.specifications === 'string' ? initialData.specifications : JSON.stringify(initialData.specifications, null, 2)) : "",
        energyLabel: initialData.energyLabel || "",
        productCategory: initialData.productCategory || "",
        imageUrl: initialData.imageUrl || "",
        imageHint: initialData.imageHint || "",
        onChainStatus: initialData.onChainStatus || "Unknown", 
        onChainLifecycleStage: initialData.onChainLifecycleStage || "Unknown", 
        conflictMineralsReportUrl: initialData.conflictMineralsReportUrl || "",
        fairTradeCertificationId: initialData.fairTradeCertificationId || "",
        ethicalSourcingPolicyUrl: initialData.ethicalSourcingPolicyUrl || "",
        batteryRegulation: initialData.batteryRegulation ? {
          status: initialData.batteryRegulation.status || "not_applicable",
          batteryChemistry: initialData.batteryRegulation.batteryChemistry || "",
          batteryPassportId: initialData.batteryRegulation.batteryPassportId || "",
          ratedCapacityAh: initialData.batteryRegulation.ratedCapacityAh ?? null,
          nominalVoltage: initialData.batteryRegulation.nominalVoltage ?? null,
          expectedLifetimeCycles: initialData.batteryRegulation.expectedLifetimeCycles ?? null,
          manufacturingDate: initialData.batteryRegulation.manufacturingDate || "",
          manufacturerName: initialData.manufacturerName || "",
          carbonFootprint: {
            value: initialData.batteryRegulation.carbonFootprint?.value ?? null,
            unit: initialData.batteryRegulation.carbonFootprint?.unit || "",
            calculationMethod: initialData.batteryRegulation.carbonFootprint?.calculationMethod || "",
            scope1Emissions: initialData.batteryRegulation.carbonFootprint?.scope1Emissions ?? null,
            scope2Emissions: initialData.batteryRegulation.carbonFootprint?.scope2Emissions ?? null,
            scope3Emissions: initialData.batteryRegulation.carbonFootprint?.scope3Emissions ?? null,
            dataSource: initialData.batteryRegulation.carbonFootprint?.dataSource || "",
            vcId: initialData.batteryRegulation.carbonFootprint?.vcId || "",
          },
          recycledContent: initialData.batteryRegulation.recycledContent?.map(rc => ({ ...rc, percentage: rc.percentage ?? null })) || [],
          stateOfHealth: {
            value: initialData.batteryRegulation.stateOfHealth?.value ?? null,
            unit: initialData.batteryRegulation.stateOfHealth?.unit || "",
            measurementDate: initialData.batteryRegulation.stateOfHealth?.measurementDate || "",
            measurementMethod: initialData.batteryRegulation.stateOfHealth?.measurementMethod || "",
            vcId: initialData.batteryRegulation.stateOfHealth?.vcId || "",
          },
          recyclingEfficiencyRate: initialData.batteryRegulation.recyclingEfficiencyRate ?? null,
          materialRecoveryRates: {
            cobalt: initialData.batteryRegulation.materialRecoveryRates?.cobalt ?? null,
            lead: initialData.batteryRegulation.materialRecoveryRates?.lead ?? null,
            lithium: initialData.batteryRegulation.materialRecoveryRates?.lithium ?? null,
            nickel: initialData.batteryRegulation.materialRecoveryRates?.nickel ?? null,
          },
          dismantlingInformationUrl: initialData.batteryRegulation.dismantlingInformationUrl || "",
          safetyInformationUrl: initialData.batteryRegulation.safetyInformationUrl || "",
          vcId: initialData.batteryRegulation.vcId || "",
        } : { 
          status: "not_applicable", batteryChemistry: "", batteryPassportId: "",
          ratedCapacityAh: null, nominalVoltage: null, expectedLifetimeCycles: null, manufacturingDate: "", manufacturerName: "",
          carbonFootprint: { value: null, unit: "", calculationMethod: "", scope1Emissions: null, scope2Emissions: null, scope3Emissions: null, dataSource: "", vcId: "" },
          recycledContent: [],
          stateOfHealth: { value: null, unit: "", measurementDate: "", measurementMethod: "", vcId: "" },
          recyclingEfficiencyRate: null, materialRecoveryRates: {}, dismantlingInformationUrl: "", safetyInformationUrl: "", vcId: "",
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
            customsValuation: { value: null, currency: "" },
            cbamGoodsIdentifier: "" // Added for CBAM
          },
          battery_regulation: initialData.compliance?.battery_regulation || { 
            status: "not_applicable", batteryChemistry: "", batteryPassportId: "",
            carbonFootprint: { value: null, unit: "", calculationMethod: "", vcId: "" },
            recycledContent: [],
            stateOfHealth: { value: null, unit: "", measurementDate: "", vcId: "" },
            vcId: "",
          }
        },
        textileInformation: initialData.textileInformation || { fiberComposition: [], isSecondHand: false }, 
        constructionProductInformation: initialData.constructionProductInformation || { essentialCharacteristics: [] }, 
        productNameOrigin: initialData.productNameOrigin,
        productDescriptionOrigin: initialData.productDescriptionOrigin,
        manufacturerOrigin: initialData.manufacturerOrigin,
        modelNumberOrigin: initialData.modelNumberOrigin,
        materialsOrigin: initialData.materialsOrigin,
        sustainabilityClaimsOrigin: initialData.sustainabilityClaimsOrigin,
        keyCompliancePointsOrigin: initialData.keyCompliancePointsOrigin, // Added for Task 21
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
    if (transformedData.compliance?.euCustomsData) {
        if(transformedData.compliance.euCustomsData.netWeightKg === undefined || String(transformedData.compliance.euCustomsData.netWeightKg).trim() === "") transformedData.compliance.euCustomsData.netWeightKg = null;
        if(transformedData.compliance.euCustomsData.grossWeightKg === undefined || String(transformedData.compliance.euCustomsData.grossWeightKg).trim() === "") transformedData.compliance.euCustomsData.grossWeightKg = null;
        if(transformedData.compliance.euCustomsData.customsValuation && (transformedData.compliance.euCustomsData.customsValuation.value === undefined || String(transformedData.compliance.euCustomsData.customsValuation.value).trim() === "")) {
            transformedData.compliance.euCustomsData.customsValuation.value = null;
        }
    }
    if (transformedData.textileInformation?.fiberComposition) {
      transformedData.textileInformation.fiberComposition = transformedData.textileInformation.fiberComposition.map(fc => ({
        ...fc,
        percentage: (fc.percentage === undefined || String(fc.percentage).trim() === "") ? null : fc.percentage,
      }));
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
    setSuggestedCustomAttributes(prev => prev.filter(attr => attr.key.toLowerCase() !== suggestedAttr.key.toLowerCase()));
    toast({ title: "Attribute Added", description: `"${suggestedAttr.key}" has been added from suggestions.`, variant: "default" });
  };

  const formContent = (
    <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3', 'item-12', 'item-4', 'item-5', 'item-6', 'item-7', 'item-8', 'item-9', 'item-10', 'item-11']} className="w-full">
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
        <AccordionTrigger className="text-lg font-semibold flex items-center"><Leaf className="mr-2 h-5 w-5 text-primary" />Sustainability & Key Compliance Points</AccordionTrigger>
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
      
      <AccordionItem value="item-12"> 
        <AccordionTrigger className="text-lg font-semibold flex items-center">
          <Handshake className="mr-2 h-5 w-5 text-primary" />Ethical Sourcing & Supply Chain
        </AccordionTrigger>
        <AccordionContent>
          <EthicalSourcingFormSection form={form} />
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

      <AccordionItem value="item-9">
        <AccordionTrigger className="text-lg font-semibold flex items-center"><Shirt className="mr-2 h-5 w-5 text-primary" />Textile Product Information (if applicable)</AccordionTrigger>
        <AccordionContent>
          <TextileInformationFormSection form={form} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-10">
        <AccordionTrigger className="text-lg font-semibold flex items-center"><Construction className="mr-2 h-5 w-5 text-primary" />Construction Product Information (if applicable)</AccordionTrigger>
        <AccordionContent>
          <ConstructionProductInformationFormSection form={form} />
        </AccordionContent>
      </AccordionItem>
      
       <AccordionItem value="item-11">
        <AccordionTrigger className="text-lg font-semibold flex items-center">
            <Cpu className="mr-2 h-5 w-5 text-primary" /> Conceptual On-Chain State
        </AccordionTrigger>
        <AccordionContent className="space-y-6 pt-4">
            <FormField
            control={form.control}
            name="onChainStatus"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Conceptual On-Chain Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || "Unknown"} value={field.value || "Unknown"}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                    {["Unknown", "Active", "Pending Activation", "Recalled", "Flagged for Review", "Archived"].map(s => <SelectItem key={`ocs-${s}`} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="onChainLifecycleStage"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Conceptual On-Chain Lifecycle Stage</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || "Unknown"} value={field.value || "Unknown"}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                    {["Unknown", "Design", "Manufacturing", "Quality Assurance", "Distribution", "In Use", "Maintenance", "End of Life"].map(s => <SelectItem key={`ocls-${s}`} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                </Select>
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

```
- workspace/src/components/products/form/EthicalSourcingFormSection.tsx:
```tsx

// --- File: EthicalSourcingFormSection.tsx ---
// Description: Form section component for ethical sourcing details.
"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { ProductFormData } from "@/components/products/ProductForm";

interface EthicalSourcingFormSectionProps {
  form: UseFormReturn<ProductFormData>;
  // No AI suggestions for these fields yet
}

export default function EthicalSourcingFormSection({
  form,
}: EthicalSourcingFormSectionProps) {
  return (
    <div className="space-y-6 pt-4">
      <FormDescription>
        Provide links or identifiers related to ethical sourcing practices for this product.
      </FormDescription>

      <FormField
        control={form.control}
        name="conflictMineralsReportUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Conflict Minerals Report URL (Optional)</FormLabel>
            <FormControl><Input type="url" placeholder="https://example.com/reports/conflict-minerals.pdf" {...field} value={field.value || ""} /></FormControl>
            <FormDescription>Link to your company's conflict minerals disclosure or report.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="fairTradeCertificationId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fair Trade Certification ID/Link (Optional)</FormLabel>
            <FormControl><Input placeholder="e.g., FLOID 12345 or link to certificate" {...field} value={field.value || ""} /></FormControl>
            <FormDescription>Identifier or URL for any Fair Trade certifications relevant to the product or its components.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="ethicalSourcingPolicyUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ethical Sourcing Policy URL (Optional)</FormLabel>
            <FormControl><Input type="url" placeholder="https://example.com/ethics/sourcing-policy.pdf" {...field} value={field.value || ""} /></FormControl>
            <FormDescription>Link to your company's broader ethical sourcing or supplier code of conduct policy.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

```
- workspace/src/components/products/form/EuCustomsDataFormSection.tsx:
```tsx

// --- File: EuCustomsDataFormSection.tsx ---
// Description: Form section component for EU Customs Data details.
"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ProductFormData } from "@/components/products/ProductForm";
// AiIndicator and AI helper imports are not needed for this initial version.

interface EuCustomsDataFormSectionProps {
  form: UseFormReturn<ProductFormData>;
  // initialData?: Partial<InitialProductFormData>; // Not used in this simple version yet
  // isSubmittingForm?: boolean; // Not used in this simple version yet
}

export default function EuCustomsDataFormSection({
  form,
}: EuCustomsDataFormSectionProps) {
  const customsStatusOptions = ['Verified', 'Pending Documents', 'Mismatch', 'Cleared', 'N/A'];

  return (
    <div className="space-y-6 pt-4">
      <FormField
        control={form.control}
        name="compliance.euCustomsData.status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>EU Customs Data Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select customs data status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {customsStatusOptions.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="compliance.euCustomsData.declarationId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Customs Declaration ID</FormLabel>
            <FormControl><Input placeholder="e.g., DECL-XYZ-789" {...field} value={field.value || ""} /></FormControl>
            <FormDescription>Customs declaration reference number.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="compliance.euCustomsData.hsCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>HS Code</FormLabel>
            <FormControl><Input placeholder="e.g., 84181020" {...field} value={field.value || ""} /></FormControl>
            <FormDescription>Harmonized System (HS) code for customs classification.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="compliance.euCustomsData.countryOfOrigin"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country of Origin (ISO Alpha-2)</FormLabel>
            <FormControl><Input placeholder="e.g., DE, CN, US" {...field} value={field.value || ""} /></FormControl>
            <FormDescription>ISO 3166-1 alpha-2 country code.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="compliance.euCustomsData.cbamGoodsIdentifier"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CBAM Goods Identifier / Reference (Optional)</FormLabel>
            <FormControl><Input placeholder="e.g., CBAM-REF-123" {...field} value={field.value || ""} /></FormControl>
            <FormDescription>Identifier relevant for Carbon Border Adjustment Mechanism reporting, if applicable.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="compliance.euCustomsData.netWeightKg"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Net Weight (kg)</FormLabel>
              <FormControl><Input type="number" placeholder="e.g., 75.5" {...field} onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} value={field.value ?? ""} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="compliance.euCustomsData.grossWeightKg"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gross Weight (kg)</FormLabel>
              <FormControl><Input type="number" placeholder="e.g., 80.2" {...field} onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} value={field.value ?? ""} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="p-4 border rounded-md space-y-3 bg-muted/30">
        <h4 className="font-medium text-md text-primary">Customs Valuation</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="compliance.euCustomsData.customsValuation.value"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Value</FormLabel>
                <FormControl><Input type="number" placeholder="e.g., 450.00" {...field} onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} value={field.value ?? ""} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="compliance.euCustomsData.customsValuation.currency"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Currency (ISO 4217)</FormLabel>
                <FormControl><Input placeholder="e.g., EUR, USD" {...field} value={field.value || ""} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
      </div>
    </div>
  );
}

```
- workspace/src/data/mockDpps.ts:
```tsx

import type { DigitalProductPassport, EbsiVerificationDetails, BatteryRegulationDetails, ScipNotificationDetails, EuCustomsDataDetails, TextileInformation, ConstructionProductInformation } from '@/types/dpp'; // Added EbsiVerificationDetails

export const MOCK_DPPS: DigitalProductPassport[] = [
  {
    id: "DPP001",
    productName: "EcoSmart Refrigerator X500",
    category: "Appliances",
    manufacturer: { name: "GreenTech Appliances", did: "did:ebsi:zyxts12345", eori: "DE123456789" },
    modelNumber: "X500-ECO",
    sku: "SKU-X500",
    nfcTagId: "NFC123456",
    rfidTagId: "RFID654321",
    metadata: {
      created_at: "2024-01-01T10:00:00Z",
      last_updated: "2024-07-30T10:00:00Z",
      status: "published",
      dppStandardVersion: "CIRPASS v0.9 Draft",
      onChainStatus: "Active", 
      onChainLifecycleStage: "InUse", 
    },
    authenticationVcId: "vc_auth_DPP001_mock123", 
    ownershipNftLink: { 
        registryUrl: "https://mock-nft-market.example/token/0xNFTContractForDPP001/1",
        contractAddress: "0xNFTContractForDPP001",
        tokenId: "1",
        chainName: "MockEthereum",
    },
    productDetails: {
      description: "An eco friendly fridge.",
      energyLabel: "A++",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "refrigerator appliance",
      materials: [{name: "Recycled Steel", percentage: 70, isRecycled: true}],
      specifications: JSON.stringify({ "Capacity (Liters)": "400", "Annual Energy Consumption (kWh)": "150", "Noise Level (dB)": "38", "Dimensions (HxWxD cm)": "180x70x65", "Color": "Stainless Steel" }, null, 2),
      customAttributes: [
        {key: "Eco Rating", value: "Gold Star (Self-Assessed)"},
        {key: "Special Feature", value: "AI Defrost Technology"},
        {key: "Warranty Period", value: "5 Years"},
        {key: "Country of Origin", value: "Germany"}
      ],
      ethicalSourcingPolicyUrl: "https://greentech.com/ethics/sourcing-policy.pdf", // Task 19
    },
    compliance: {
      eprel: { id: "EPREL_REG_12345", status: "Registered", url: "#eprel-link", lastChecked: "2024-01-18T00:00:00Z" },
      esprConformity: { status: "conformant", assessmentId: "ESPR_ASSESS_001", assessmentDate: "2024-01-01" },
      battery_regulation: { status: "not_applicable" },
      scipNotification: { 
        status: 'Notified', 
        notificationId: 'SCIP-REF-DPP001-1A2B',
        svhcListVersion: '2024/01 (24.0.1)',
        submittingLegalEntity: 'GreenTech Appliances GmbH',
        articleName: 'Refrigerator Control Panel Assembly X500',
        primaryArticleId: 'X500-CTRL-ASSY',
        safeUseInstructionsLink: 'https://greentech.com/sds/X500-CTRL-ASSY-SUI.pdf',
        lastChecked: "2024-07-29T00:00:00Z" 
      },
      euCustomsData: { 
        status: 'Verified', 
        declarationId: 'CUST_DECL_XYZ789', 
        hsCode: "84181020", 
        countryOfOrigin: "DE",
        netWeightKg: 75.5,
        grossWeightKg: 80.2,
        customsValuation: { value: 450.00, currency: "EUR" },
        cbamGoodsIdentifier: "CBAM_REF_FRIDGE_STEEL_ALUM_001", // Added for CBAM
        lastChecked: "2024-07-28T00:00:00Z" 
      },
    },
    ebsiVerification: {
      status: "verified",
      verificationId: "EBSI_TX_ABC123",
      issuerDid: "did:ebsi:zIssuerXYZ789", 
      schema: "EBSIProductComplianceSchema_v1.2", 
      issuanceDate: "2024-07-24T10:00:00Z", 
      lastChecked: "2024-07-25T00:00:00Z"
    } as EbsiVerificationDetails,
    blockchainIdentifiers: { 
      platform: "MockChain", 
      anchorTransactionHash: "0x123abc456def789ghi012jkl345mno678pqr901stu234vwx567yz890abcdef", 
      contractAddress: "0xMOCK_CONTRACT_FOR_DPP001", 
      tokenId: "MOCK_TOKENID_FOR_DPP001_mock1"
    },
    consumerScans: 1250,
    lifecycleEvents: [
      {id: "evt1", type: "Manufactured", timestamp: "2024-01-15T00:00:00Z", transactionHash: "0xabc...def", responsibleParty: "GreenTech Appliances"}
    ],
    certifications: [
      {id: "cert1", name: "Energy Star", issuer: "EPA", issueDate: "2024-01-01T11:00:00Z", documentUrl: "#", transactionHash: "0xcertAnchor1", standard: "Energy Star Program Requirements for Refrigerators v6.0"},
      {id: "cert2", name: "ISO 14001", issuer: "TUV Rheinland", issueDate: "2024-01-20T00:00:00Z", expiryDate: "2026-11-14", documentUrl: "#iso14001", vcId: "vc:iso:14001:greentech:dpp001", standard: "ISO 14001:2015"}
    ],
    verifiableCredentials: [
        {
            id: "urn:uuid:cred-energy-star-dpp001",
            type: ["VerifiableCredential", "EnergyStarCertification"],
            name: "Energy Star Certificate VC",
            issuer: "did:ebsi:zEnergyStarIssuer",
            issuanceDate: "2024-01-01T11:00:00Z",
            credentialSubject: {
                productId: "DPP001",
                certificationStandard: "Energy Star Program Requirements for Refrigerators v6.0",
                certificationStatus: "Active"
            }
        },
        {
            id: "urn:uuid:cred-iso14001-dpp001",
            type: ["VerifiableCredential", "ISOComplianceCredential"],
            name: "ISO 14001 Compliance VC",
            issuer: "did:ebsi:zTuvRheinland",
            issuanceDate: "2024-01-20T00:00:00Z",
            credentialSubject: {
                productId: "DPP001", 
                standard: "ISO 14001:2015",
                complianceStatus: "Conformant",
                expiryDate: "2026-11-14"
            }
        }
    ],
    documents: [
      { name: "User Manual v1.2", url: "#manual_v1.2.pdf", type: "User Manual", addedTimestamp: "2024-01-15T00:00:00Z" },
      { name: "Warranty Card", url: "#warranty.pdf", type: "Warranty", addedTimestamp: "2024-01-15T00:00:00Z" },
    ],
    traceability: {
    originCountry: "DE",
      supplyChainSteps: [
        {
          stepName: 'Manufactured',
          actorDid: 'did:example:greentech',
          timestamp: '2024-01-15T00:00:00Z',
          location: 'Factory A',
          transactionHash: '0xstep1'
        }
      ]
    },
    supplyChainLinks: [
      { supplierId: "SUP001", suppliedItem: "Compressor Unit XJ-500", notes: "Primary compressor supplier for EU market. Audited for ethical sourcing." },
      { supplierId: "SUP002", suppliedItem: "Recycled Steel Panels (70%)", notes: "Certified post-consumer recycled content." }
    ]
  },
  {
    id: "DPP002",
    productName: "Sustainable Cotton T-Shirt",
    category: "Apparel",
    manufacturer: { name: "EcoThreads", eori: "FR987654321"},
    modelNumber: "ET-TS-ORG-M",
    metadata: { 
      last_updated: "2024-07-25T14:30:00Z", 
      status: "draft", 
      created_at: "2024-03-01T10:00:00Z",
      onChainStatus: "Pending Activation", 
      onChainLifecycleStage: "Manufacturing", 
    },
    authenticationVcId: "vc_auth_DPP002_mock456", 
    productDetails: {
      description: "A sustainable t-shirt made from organic cotton.",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "cotton t-shirt apparel",
      materials: [{name: "Organic Cotton", percentage: 100}],
      specifications: JSON.stringify({ "Fit": "Regular", "GSM": "180", "Origin": "India", "Care": "Machine wash cold" }, null, 2),
      customAttributes: [{key: "Certifications", value: "GOTS, Fair Trade"}, {key: "Care Instructions", value: "Machine wash cold, tumble dry low"}],
      conflictMineralsReportUrl: "https://ecothreads.com/reports/conflict-minerals-na.pdf", // Task 19
      fairTradeCertificationId: "FLOID12345", // Task 19
      ethicalSourcingPolicyUrl: "https://ecothreads.com/ethics/sourcing-policy.pdf", // Task 19
    },
    textileInformation: {
      fiberComposition: [
        { fiberName: "Organic Cotton", percentage: 95 },
        { fiberName: "Elastane", percentage: 5 }
      ],
      countryOfOriginLabeling: "India (Spinning, Weaving), Portugal (Making-up)",
      careInstructionsUrl: "https://ecothreads.com/care/ET-TS-ORG-M",
      isSecondHand: false,
    },
    compliance: {
      eprel: { status: "Not Applicable", lastChecked: "2024-07-25T00:00:00Z" },
      eu_espr: { status: "pending" },
      battery_regulation: { status: "not_applicable" },
      scipNotification: { status: 'Not Required', lastChecked: "2024-07-25T00:00:00Z", svhcListVersion: "N/A" }, 
      euCustomsData: { 
        status: 'Pending Documents', 
        hsCode: "61091000", 
        countryOfOrigin: "IN",
        netWeightKg: 0.15,
        grossWeightKg: 0.2,
        customsValuation: { value: 8.50, currency: "USD" },
        lastChecked: "2024-07-25T00:00:00Z" 
      },
    },
    ebsiVerification: { status: "pending_verification", lastChecked: "2024-07-20T00:00:00Z"} as EbsiVerificationDetails,
    consumerScans: 300,
    blockchainIdentifiers: { 
      platform: "MockChain", 
      contractAddress: "0xSomeOtherContract", 
      tokenId: "TOKEN_TSHIRT_002" 
    }, 
    certifications: [
      {id: "cert3", name: "GOTS", issuer: "Control Union", issueDate: "2024-02-20", expiryDate: "2025-02-19", documentUrl: "#gots", standard: "Global Organic Textile Standard 6.0"},
    ],
    verifiableCredentials: [
      {
          id: "urn:uuid:cred-gots-dpp002",
          type: ["VerifiableCredential", "GOTSCertification"],
          name: "GOTS Certificate VC",
          issuer: "did:ebsi:zControlUnion",
          issuanceDate: "2024-02-20T00:00:00Z",
          credentialSubject: {
              productId: "DPP002",
              standard: "Global Organic Textile Standard 6.0",
              certificationStatus: "Active",
              scope: "Organic Cotton T-Shirt"
          }
      }
    ],
    documents: [],
    traceability: {
    originCountry: "IN",
      supplyChainSteps: [
        {
          stepName: 'Manufactured',
          actorDid: 'did:example:ecothreads',
          timestamp: '2024-03-05T00:00:00Z',
          location: 'Factory B',
          transactionHash: '0xstep2'
        }
      ]
    },
    supplyChainLinks: [
       { supplierId: "SUP003", suppliedItem: "Organic Cotton Yarn", notes: "GOTS Certified Supplier for all global production." }
    ]
  },
  {
    id: "DPP003",
    productName: "Recycled Polymer Phone Case",
    category: "Accessories",
    manufacturer: { name: "ReCase It", eori: "NL112233445"},
    modelNumber: "RC-POLY-IP15",
    metadata: { 
      last_updated: "2024-07-22T09:15:00Z", 
      status: "flagged", 
      created_at: "2024-04-10T10:00:00Z",
      onChainStatus: "FlaggedForReview", 
      onChainLifecycleStage: "InUse" 
    },
    compliance: {
      eprel: { status: "Not Applicable", lastChecked: "2024-07-22T00:00:00Z" },
      eu_espr: { status: "compliant" },
      us_scope3: { status: "compliant" },
      battery_regulation: { status: "not_applicable" },
      scipNotification: { 
        status: 'Notified', 
        notificationId: 'SCIP-REF-DPP003-C3D4',
        svhcListVersion: '2023/06 (23.1.0)',
        submittingLegalEntity: 'ReCase It B.V.',
        articleName: 'Phone Case Housing (Recycled Polymer)',
        primaryArticleId: 'RC-POLY-IP15-HOUSING',
        safeUseInstructionsLink: 'https://recaseit.com/sui/RC-POLY-IP15.pdf',
        lastChecked: "2024-07-21T00:00:00Z" 
      },
      euCustomsData: { 
        status: 'Cleared', 
        declarationId: 'CUST_IMP_DEF456', 
        hsCode: "39269097", 
        countryOfOrigin: "CN",
        netWeightKg: 0.05,
        grossWeightKg: 0.08,
        customsValuation: { value: 3.50, currency: "EUR" },
        lastChecked: "2024-07-20T00:00:00Z" 
      },
    },
    consumerScans: 2100,
     productDetails: { description: "A recycled phone case."},
     blockchainIdentifiers: { platform: "OtherChain", anchorTransactionHash: "0x789polymerAnchorHash000333"},
    documents: [],
    traceability: {
      originCountry: "CN",
      supplyChainSteps: [
        {
          stepName: 'Manufactured',
          actorDid: 'did:example:recaseit',
          timestamp: '2024-04-15T00:00:00Z',
          location: 'Factory C',
          transactionHash: '0xstep3'
        }
      ]
    },
    supplyChainLinks: [],
    ebsiVerification: { status: "not_verified", lastChecked: "2024-07-23T00:00:00Z", message: "Connection timeout to EBSI node."} as EbsiVerificationDetails,
  },
  {
    id: "DPP004",
    productName: "Modular Sofa System",
    category: "Furniture",
    manufacturer: { name: "Comfy Living"},
    modelNumber: "CL-MODSOFA-01",
    metadata: { 
      last_updated: "2024-07-20T11:00:00Z", 
      status: "archived", 
      created_at: "2023-12-01T10:00:00Z",
      onChainStatus: "Archived", 
      onChainLifecycleStage: "EndOfLife" 
    },
    compliance: {
      eprel: { status: "Not Applicable", lastChecked: "2024-07-20T00:00:00Z" },
      eu_espr: { status: "compliant" },
      battery_regulation: { status: "not_applicable" },
      scipNotification: { status: 'Pending Notification', svhcListVersion: '2024/01 (24.0.1)', submittingLegalEntity: 'Comfy Living Designs', articleName: 'Sofa Frame Connector', primaryArticleId: 'CL-MODSOFA-CONN01', lastChecked: "2024-07-19T00:00:00Z" },
      euCustomsData: { 
        status: 'Verified', 
        declarationId: 'CUST_SOFA_777', 
        hsCode: "94016100", 
        countryOfOrigin: "PL",
        netWeightKg: 45.0,
        grossWeightKg: 50.0,
        customsValuation: { value: 350.00, currency: "EUR" },
        lastChecked: "2024-07-18T00:00:00Z" 
      }
    },
    consumerScans: 850,
    productDetails: { description: "A modular sofa."},
    documents: [],
    traceability: {
      originCountry: "SE",
      supplyChainSteps: [
        {
          stepName: 'Manufactured',
          actorDid: 'did:example:comfyliving',
          timestamp: '2023-12-10T00:00:00Z',
          location: 'Factory D',
          transactionHash: '0xstep4'
        }
      ]
    },
    supplyChainLinks: [],
    ebsiVerification: { status: "error", lastChecked: "2024-07-19T00:00:00Z", message: "Connection timeout to EBSI node."} as EbsiVerificationDetails,
  },
  {
    id: "DPP005",
    productName: "High-Performance EV Battery",
    category: "Automotive Parts",
    manufacturer: { name: "PowerVolt", eori: "US567890123"},
    modelNumber: "PV-EVB-75KWH",
    metadata: { 
      last_updated: "2024-07-29T08:00:00Z", 
      status: "pending_review", 
      created_at: "2024-05-01T10:00:00Z",
      onChainStatus: "Active",
      onChainLifecycleStage: "QualityAssurance",
    },
    productDetails: {
      description: "A high-performance EV battery module designed for long range and fast charging. Contains NMC 811 chemistry for optimal energy density.",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "ev battery module electric car",
      materials: [
        { name: "Nickel", percentage: 60, origin: "Various", isRecycled: true, recycledContentPercentage: 15 },
        { name: "Manganese", percentage: 10, origin: "Various" },
        { name: "Cobalt", percentage: 10, origin: "Various", isRecycled: true, recycledContentPercentage: 10 },
        { name: "Lithium", percentage: 5, origin: "Australia", isRecycled: true, recycledContentPercentage: 5 },
        { name: "Graphite (Anode)", percentage: 10, origin: "China" },
        { name: "Aluminum (Casing)", percentage: 5, origin: "Various", isRecycled: true, recycledContentPercentage: 50 },
      ],
      specifications: JSON.stringify({ "Capacity (kWh)": "75", "Nominal Voltage (V)": "400", "Weight (kg)": "450", "Chemistry": "NMC 811", "Cycle Life (80% DoD)": "3000" }, null, 2),
      customAttributes: [
        {key: "Charging Time (0-80%)", value: "30 minutes (DC Fast Charge @ 150kW)"},
        {key: "Energy Density (Wh/kg)", value: "167"},
        {key: "Thermal Management", value: "Liquid Cooled"}
      ],
      conflictMineralsReportUrl: "https://powervolt.com/reports/conflict-minerals-2023.pdf", // Task 19
    },
    compliance: {
      eprel: { status: "Not Applicable", lastChecked: "2024-07-28T00:00:00Z" }, 
      battery_regulation: {
        status: "pending",
        batteryChemistry: "NMC 811",
        batteryPassportId: "BATT-ID-PV-EVB-75KWH-SN001",
        ratedCapacityAh: 187.5, 
        nominalVoltage: 400,
        expectedLifetimeCycles: 3000,
        manufacturingDate: "2024-04-15",
        manufacturerName: "PowerVolt Cell Division",
        carbonFootprint: { 
            value: 85.5, unit: "kg CO2e/kWh", calculationMethod: "PEFCR for Batteries v1.2", 
            scope1Emissions: 10.2, scope2Emissions: 5.3, scope3Emissions: 70.0, 
            dataSource: "Internal LCA Study Q1 2024", 
            vcId: "vc:cf:dpp005" 
        },
        recycledContent: [
          { material: "Cobalt", percentage: 12, source: "Post-consumer", vcId: "vc:rc:cobalt:dpp005" },
          { material: "Lithium", percentage: 4, source: "Pre-consumer", vcId: "vc:rc:lithium:dpp005" },
          { material: "Nickel", percentage: 10, source: "Post-consumer", vcId: "vc:rc:nickel:dpp005" }
        ],
        stateOfHealth: {value: 100, unit: '%', measurementDate: "2024-07-15T00:00:00Z", measurementMethod: "Direct Measurement Post-Production", vcId: "vc:soh:dpp005"},
        recyclingEfficiencyRate: 70, 
        materialRecoveryRates: { cobalt: 95, lithium: 50, nickel: 90 },
        dismantlingInformationUrl: "https://powervolt.com/manuals/dismantling_pv_evb_75.pdf",
        safetyInformationUrl: "https://powervolt.com/manuals/safety_pv_evb_75.pdf",
        vcId: "vc:battreg:overall:dpp005"
      } as BatteryRegulationDetails,
      eu_espr: { status: "pending" }, 
      scipNotification: { 
        status: 'Pending Notification', 
        svhcListVersion: '2024/01 (24.0.1)',
        submittingLegalEntity: 'PowerVolt Inc.',
        articleName: 'EV Battery Module Assembly',
        primaryArticleId: 'PV-EVB-75KWH-ASSY',
        lastChecked: "2024-07-27T00:00:00Z" 
      },
      euCustomsData: { 
        status: 'Pending Documents', 
        hsCode: "85076000", 
        countryOfOrigin: "US",
        netWeightKg: 450.0,
        grossWeightKg: 465.0,
        customsValuation: { value: 8500.00, currency: "USD" },
        lastChecked: "2024-07-29T00:00:00Z" 
      },
    },
    ebsiVerification: { status: "pending_verification", lastChecked: "2024-07-29T00:00:00Z"} as EbsiVerificationDetails,
    consumerScans: 50,
    certifications: [
      {id: "cert_bat_01", name: "UN 38.3 Transport Test", issuer: "TestCert Ltd.", issueDate: "2024-07-01", documentUrl: "#", transactionHash: "0xcertAnchorBat1", standard: "UN Manual of Tests and Criteria, Part III, subsection 38.3"},
      {id: "cert_bat_02", name: "ISO 26262 (ASIL D)", issuer: "AutomotiveSafetyCert", issueDate: "2024-06-15", documentUrl: "#", standard: "ISO 26262-Road vehicles Functional safety", vcId: "vc:iso26262:dpp005"}
    ],
    documents: [
        { name: "Battery Safety Data Sheet (SDS)", url: "#sds_pv_evb_75kwh.pdf", type: "Safety Data Sheet", addedTimestamp: "2024-05-10T00:00:00Z" },
        { name: "Technical Specification Sheet", url: "#techspec_pv_evb_75kwh.pdf", type: "Technical Specification", addedTimestamp: "2024-05-10T00:00:00Z" },
    ],
    traceability: {
      originCountry: "US",
      supplyChainSteps: [
        {
          stepName: 'Cell Manufacturing',
          actorDid: 'did:example:cellmaker',
          timestamp: '2024-05-10T00:00:00Z',
          location: 'Nevada, US',
          transactionHash: '0xcellmfg_tx_hash'
        },
        {
          stepName: 'Module Assembly',
          actorDid: 'did:example:powervolt',
          timestamp: '2024-06-01T00:00:00Z',
          location: 'Michigan, US',
          transactionHash: '0xmoduleassy_tx_hash'
        }
      ]
    },
    blockchainIdentifiers: { 
      platform: "PowerChain Ledger", 
      anchorTransactionHash: "0xevBatteryAnchorHash555AAA", 
      contractAddress: "0xEV_BATTERY_REGISTRY", 
      tokenId: "TOKEN_PV_EVB_75KWH_SN001"
    },
    supplyChainLinks: []
  },
  { 
    id: "DPP006",
    productName: "EcoSmart Insulation Panel R50",
    category: "Construction Materials",
    manufacturer: { name: "BuildGreen Systems", eori: "BE0123456789" },
    modelNumber: "ESP-R50-1200",
    metadata: {
      created_at: "2024-07-01T00:00:00Z",
      last_updated: "2024-08-01T10:00:00Z",
      status: "published",
      dppStandardVersion: "CPR EN 13163",
      onChainStatus: "Active",
      onChainLifecycleStage: "InUse",
    },
    productDetails: {
      description: "High-performance, sustainable insulation panel made from recycled cellulose fibers and a bio-based binder. Provides excellent thermal resistance (R-value 50).",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "insulation panel construction",
      materials: [
        { name: "Recycled Cellulose Fiber", percentage: 85, isRecycled: true },
        { name: "Bio-based Binder", percentage: 10 },
        { name: "Fire Retardant (Non-halogenated)", percentage: 5 }
      ],
      specifications: JSON.stringify({ "Thermal Resistance (R-value)": "50", "Thickness (mm)": "150", "Density (kg/m^3)": "35", "Fire Rating": "Euroclass B-s1, d0" }, null, 2),
      customAttributes: [
        {key: "Recycled Content Source", value: "Post-consumer paper"},
        {key: "VOC Emissions", value: "Low (A+)"}
      ]
    },
    constructionProductInformation: {
      declarationOfPerformanceId: "DoP_ESP-R50-1200_001",
      ceMarkingDetailsUrl: "https://buildgreen.com/certs/ce_esp-r50.pdf",
      intendedUseDescription: "Thermal insulation for building envelopes (walls, roofs, floors).",
      essentialCharacteristics: [
        { characteristicName: "Thermal Conductivity (λ)", value: "0.030 W/(m·K)", testMethod: "EN 12667" },
        { characteristicName: "Reaction to Fire", value: "Euroclass B-s1, d0", testMethod: "EN 13501-1" },
        { characteristicName: "Water Vapour Diffusion Resistance (µ)", value: "3", testMethod: "EN 12086" }
      ]
    },
    compliance: {
      eprel: { status: "Not Applicable", lastChecked: "2024-08-01T00:00:00Z" },
      battery_regulation: { status: "not_applicable" },
      scipNotification: { status: 'Not Required', lastChecked: "2024-08-01T00:00:00Z", svhcListVersion: "N/A" },
      esprConformity: { status: "conformant", assessmentId: "CPR_ASSESS_006", assessmentDate: "2024-07-15" },
      euCustomsData: {
        status: "Verified",
        declarationId: "CUST_CPR_DPP006",
        hsCode: "68061000", 
        countryOfOrigin: "BE",
        lastChecked: "2024-07-20T00:00:00Z"
      }
    },
    ebsiVerification: { status: "pending_verification", lastChecked: "2024-08-01T00:00:00Z"} as EbsiVerificationDetails,
    traceability: { originCountry: "BE" },
    consumerScans: 15,
    certifications: [
      {id: "cert_cpr_01", name: "CE Marking (CPR)", issuer: "Notified Body 0123 (BE)", issueDate: "2024-07-15", documentUrl: "https://buildgreen.com/certs/ce_esp-r50.pdf", standard: "EN 13163"},
      {id: "cert_epd_01", name: "Environmental Product Declaration", issuer: "EPD Program Operator XYZ", issueDate: "2024-07-20", documentUrl: "https://buildgreen.com/epd/esp-r50.pdf", standard: "ISO 14025", vcId: "vc:epd:buildgreen:dpp006"}
    ],
  }
];

```
  </change>
  <change>
    <file>/workspace/src/components/products/detail/ComplianceTab.tsx</file>
    <content><![CDATA[
// --- File: ComplianceTab.tsx ---
// Description: Displays compliance-related information for a product.
"use client";

import type { SimpleProductDetail, ComplianceDetailItem as SpecificComplianceDetailItemFromDPP } from "@/types/dpp";
import ProductComplianceHeader from "./ProductComplianceHeader";
import ComplianceDetailItemDisplay, { type ComplianceDetailItemProps } from "./ComplianceDetailItemDisplay"; // Import the new component and its props type
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListChecks, RefreshCw, Loader2, Info as InfoIconFromLucide, FileText, Fingerprint, Database, Anchor, BatteryCharging, ShieldCheck } from "lucide-react"; // Added BatteryCharging & ShieldCheck
import Link from "next/link";
import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


interface ComplianceTabProps {
  product: SimpleProductDetail;
  onSyncEprel: () => Promise<void>;
  isSyncingEprel: boolean;
  canSyncEprel: boolean;
}

export default function ComplianceTab({ product, onSyncEprel, isSyncingEprel, canSyncEprel }: ComplianceTabProps) {
  const summary = product.complianceSummary;

  if (!summary) {
    return <p className="text-muted-foreground p-4">Compliance summary not available for this product.</p>;
  }

  const allComplianceItems: ComplianceDetailItemProps[] = [];

  // Handle EPREL explicitly
  if (summary.eprel) {
    const eprelSyncButton = (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={onSyncEprel}
              disabled={isSyncingEprel || !canSyncEprel}
              className="h-7 w-7"
            >
              {isSyncingEprel ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              <span className="sr-only">Sync with EPREL</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {canSyncEprel ? (
              <p>Sync with EPREL Database</p>
            ) : (
              <p className="flex items-center">
                <InfoIconFromLucide className="h-4 w-4 mr-2 text-info" />
                Model number required to sync.
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    allComplianceItems.push({
      title: "EPREL Energy Label",
      icon: FileText,
      status: summary.eprel.status,
      lastChecked: summary.eprel.lastChecked,
      id: summary.eprel.id,
      url: summary.eprel.url,
      actionButton: eprelSyncButton,
    });
  }

  // Handle EBSI explicitly
  if (summary.ebsi) {
    allComplianceItems.push({
      title: "EBSI Blockchain Verification",
      icon: Fingerprint,
      status: summary.ebsi.status,
      lastChecked: summary.ebsi.lastChecked,
      verificationId: summary.ebsi.verificationId,
      url: summary.ebsi.transactionUrl,
    });
  }
  
  // Handle SCIP explicitly
  if (summary.scip) {
    const scipNotesParts = [];
    if (summary.scip.articleName) scipNotesParts.push(`Article: ${summary.scip.articleName}`);
    if (summary.scip.svhcListVersion) scipNotesParts.push(`SVHC List Ver: ${summary.scip.svhcListVersion}`);
    if (summary.scip.submittingLegalEntity) scipNotesParts.push(`Submitter: ${summary.scip.submittingLegalEntity}`);

    allComplianceItems.push({
      title: "ECHA SCIP Notification",
      icon: Database,
      status: summary.scip.status || "N/A",
      lastChecked: summary.scip.lastChecked || product.lastUpdated || new Date().toISOString(),
      id: summary.scip.notificationId,
      notes: scipNotesParts.join(' | ') || undefined,
      url: summary.scip.safeUseInstructionsLink,
    });
  }

  // Handle EU Customs Data explicitly
  if (summary.euCustomsData) {
    const customsNotesParts = [];
    if (summary.euCustomsData.hsCode) customsNotesParts.push(`HS Code: ${summary.euCustomsData.hsCode}`);
    if (summary.euCustomsData.countryOfOrigin) customsNotesParts.push(`Origin: ${summary.euCustomsData.countryOfOrigin}`);
    if (summary.euCustomsData.netWeightKg !== undefined && summary.euCustomsData.netWeightKg !== null) customsNotesParts.push(`Net Wt: ${summary.euCustomsData.netWeightKg}kg`);
    if (summary.euCustomsData.customsValuation?.value !== undefined && summary.euCustomsData.customsValuation.value !== null) {
        customsNotesParts.push(`Value: ${summary.euCustomsData.customsValuation.value} ${summary.euCustomsData.customsValuation.currency || ''}`);
    }
    if (summary.euCustomsData.cbamGoodsIdentifier) { // Added for CBAM
        customsNotesParts.push(`CBAM ID: ${summary.euCustomsData.cbamGoodsIdentifier}`);
    }
    
    allComplianceItems.push({
      title: "EU Customs Data",
      icon: Anchor,
      status: summary.euCustomsData.status || "N/A",
      lastChecked: summary.euCustomsData.lastChecked || product.lastUpdated || new Date().toISOString(),
      id: summary.euCustomsData.declarationId,
      notes: customsNotesParts.join(' | ') || undefined,
    });
  }

  // Handle Battery Regulation explicitly
  if (summary.battery) {
    const batteryNotesParts: string[] = [];
    if (summary.battery.batteryChemistry) batteryNotesParts.push(`Chemistry: ${summary.battery.batteryChemistry}`);
    if (summary.battery.carbonFootprint?.value !== undefined && summary.battery.carbonFootprint.value !== null) {
      batteryNotesParts.push(`CF: ${summary.battery.carbonFootprint.value} ${summary.battery.carbonFootprint.unit || ''}`);
    }
    if (summary.battery.stateOfHealth?.value !== undefined && summary.battery.stateOfHealth.value !== null) {
      batteryNotesParts.push(`SoH: ${summary.battery.stateOfHealth.value}${summary.battery.stateOfHealth.unit || '%'}`);
    }
    if (summary.battery.recycledContent && summary.battery.recycledContent.length > 0) {
      const mainRecycled = summary.battery.recycledContent.find(rc => rc.material && rc.percentage !== undefined && rc.percentage !== null);
      if (mainRecycled) {
        batteryNotesParts.push(`Recycled ${mainRecycled.material}: ${mainRecycled.percentage}%`);
      } else if (summary.battery.recycledContent.length > 0) {
        batteryNotesParts.push(`${summary.battery.recycledContent.length} recycled material(s) declared.`);
      }
    }
    if (summary.battery.vcId) batteryNotesParts.push(`Main VC: ${summary.battery.vcId.substring(0,15)}...`);


    allComplianceItems.push({
      title: "EU Battery Regulation",
      icon: BatteryCharging,
      status: summary.battery.status || "N/A",
      lastChecked: product.lastUpdated || new Date().toISOString(), 
      id: summary.battery.batteryPassportId,
      url: summary.battery.vcId ? `#vc-${summary.battery.vcId}` : undefined, 
      notes: batteryNotesParts.join(' | ') || "Detailed battery passport information available.",
    });
  }

  // Handle other specific regulations
  if (summary.specificRegulations) {
    summary.specificRegulations.forEach(reg => {
      allComplianceItems.push({
        title: reg.regulationName,
        icon: ShieldCheck, // Using ShieldCheck for general compliance
        status: reg.status,
        lastChecked: reg.lastChecked,
        id: reg.verificationId, 
        url: reg.detailsUrl,
        notes: reg.notes,
      });
    });
  }
  
  return (
    <div className="space-y-6">
      <ProductComplianceHeader
        overallStatusText={summary.overallStatus}
        // notifications={product.notifications} // This prop does not exist on SimpleProductDetail
      />

      {allComplianceItems.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <ListChecks className="mr-2 h-5 w-5 text-primary" />
              Detailed Compliance Checkpoints
            </CardTitle>
            <CardDescription>Status for specific regulations and verifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {allComplianceItems.map((item, index) => (
              <ComplianceDetailItemDisplay key={`${item.title}-${index}`} {...item} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

