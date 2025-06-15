
"use client";
// --- File: ProductForm.tsx ---
// Description: Main form component for creating or editing product DPPs.
// AI loading states for text suggestions are now managed within individual section components.

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";
// Import Zod schema and type from the new types file
import { formSchema, type ProductFormData } from "@/types/productFormTypes"; 
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

// Use direct path aliases for all form sections
import BasicInfoFormSection from "@/components/products/form/BasicInfoFormSection";
import ProductImageFormSection from "@/components/products/form/ProductImageFormSection";
import BatteryDetailsFormSection from "@/components/products/form/BatteryDetailsFormSection";
import SustainabilityComplianceFormSection from "@/components/products/form/SustainabilityComplianceFormSection";
import TechnicalSpecificationsFormSection from "@/components/products/form/TechnicalSpecificationsFormSection";
import CustomAttributesFormSection from "@/components/products/form/CustomAttributesFormSection";
import ScipNotificationFormSection from "@/components/products/form/ScipNotificationFormSection";
import EuCustomsDataFormSection from "@/components/products/form/EuCustomsDataFormSection";
import TextileInformationFormSection from "@/components/products/form/TextileInformationFormSection";
import ConstructionProductInformationFormSection from "@/components/products/form/ConstructionProductInformationFormSection";
import EthicalSourcingFormSection from "@/components/products/form/EthicalSourcingFormSection";


import {
  handleGenerateImageAI, 
} from "@/utils/aiFormHelpers";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { CustomAttribute } from "@/types/dpp"; // Keep this if CustomAttribute type is directly used in ProductForm

interface AiIndicatorPropsUi { 
  fieldOrigin?: 'AI_EXTRACTED' | 'manual';
  fieldName: string;
}

const AiIndicatorUi: React.FC<AiIndicatorPropsUi> = ({ fieldOrigin, fieldName }) => {
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
      keyCompliancePoints: initialData?.keyCompliancePoints || "",
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
          cbamGoodsIdentifier: ""
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
      keyCompliancePointsOrigin: initialData?.keyCompliancePointsOrigin,
      specificationsOrigin: initialData?.specificationsOrigin,
      energyLabelOrigin: initialData?.energyLabelOrigin,
      imageUrlOrigin: initialData?.imageUrlOrigin,
      batteryRegulationOrigin: initialData?.batteryRegulationOrigin,
    },
  });

  const { toast } = useToast();
  const [suggestedClaims, setSuggestedClaims] = useState<string[]>([]);
  const [suggestedKeyCompliancePoints, setSuggestedKeyCompliancePoints] = useState<string[]>([]);
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
        keyCompliancePoints: initialData.keyCompliancePoints || "",
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
            cbamGoodsIdentifier: "",
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
        keyCompliancePointsOrigin: initialData.keyCompliancePointsOrigin,
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
    <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3', 'item-12', 'item-13', 'item-4', 'item-5', 'item-6', 'item-7', 'item-8', 'item-9', 'item-10', 'item-11']} className="w-full">
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
        <AccordionTrigger className="text-lg font-semibold flex items-center"><Leaf className="mr-2 h-5 w-5 text-primary" />Sustainability & Compliance Points</AccordionTrigger>
        <AccordionContent>
          <SustainabilityComplianceFormSection
            form={form}
            initialData={initialData}
            suggestedClaims={suggestedClaims}
            setSuggestedClaims={setSuggestedClaims}
            handleClaimClick={handleClaimClick}
            suggestedKeyCompliancePoints={suggestedKeyCompliancePoints}
            setSuggestedKeyCompliancePoints={setSuggestedKeyCompliancePoints}
            isSubmittingForm={!!isSubmitting}
            toast={toast}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-13">
        <AccordionTrigger className="text-lg font-semibold flex items-center"><Handshake className="mr-2 h-5 w-5 text-primary" />Ethical Sourcing</AccordionTrigger>
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
                    {["Unknown", "Design", "Manufacturing", "Quality Assurance", "Distribution", "In Use", "Maintenance", "End of Life"].map(s => <SelectItem key={`ocls-${s}`} value={s}>{s}</SelectItem)}
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
