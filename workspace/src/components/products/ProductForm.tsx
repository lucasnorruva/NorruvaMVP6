
"use client";
// --- File: ProductForm.tsx ---
// Description: Main form component for creating or editing product DPPs.
// Imports all section components from the barrel file.

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { InitialProductFormData } from "@/app/(app)/products/new/page";
import { Cpu, BatteryCharging, Loader2, Sparkles, PlusCircle, Info, Trash2, XCircle, ImageIcon as ImageIconLucide, FileText, Leaf, Settings2, Tag, Anchor, Database, Shirt, Construction as ConstructionIcon, Handshake, Cloud } from "lucide-react"; 
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Import types and schema from the centralized types file
import type { ProductFormData } from "@/types/productFormTypes";
import { formSchema } from "@/types/productFormTypes";

// Import all form section components from the barrel file
import {
  AiIndicator,
  BasicInfoFormSection,
  ProductImageFormSection,
  BatteryDetailsFormSection,
  SustainabilityComplianceFormSection,
  TechnicalSpecificationsFormSection,
  CustomAttributesFormSection,
  ScipNotificationFormSection,
  EuCustomsDataFormSection,
  TextileInformationFormSection,
  ConstructionProductInformationFormSection,
  EthicalSourcingFormSection, 
  EsprSpecificsFormSection, 
  CarbonFootprintFormSection, 
} from "@/components/products/form"; 

import { handleGenerateImageAI } from "@/utils/aiFormHelpers";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { CustomAttribute } from "@/types/dpp";


interface ProductFormProps {
  id?: string; 
  initialData?: Partial<InitialProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isSubmitting?: boolean;
  isStandalonePage?: boolean;
  categoryComplianceSummary?: string | null; // Task 12
  isLoadingCategoryCompliance?: boolean; // Task 12
  onFetchCategoryComplianceSummary?: (category: string, focusedRegulations?: string) => void; // Task 12
}

export default function ProductForm({ id, initialData, onSubmit, isSubmitting, isStandalonePage = true, categoryComplianceSummary, isLoadingCategoryCompliance, onFetchCategoryComplianceSummary }: ProductFormProps) {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: initialData?.productName || "",
      gtin: initialData?.gtin || "",
      productDetails: { 
        description: initialData?.productDetails?.description || "",
        materials: initialData?.productDetails?.materials || "",
        sustainabilityClaims: initialData?.productDetails?.sustainabilityClaims || "",
        keyCompliancePoints: initialData?.productDetails?.keyCompliancePoints || "",
        specifications: initialData?.productDetails?.specifications ? (typeof initialData.productDetails.specifications === 'string' ? initialData.productDetails.specifications : JSON.stringify(initialData.productDetails.specifications, null, 2)) : "",
        energyLabel: initialData?.productDetails?.energyLabel || "",
        imageUrl: initialData?.productDetails?.imageUrl || "",
        imageHint: initialData?.productDetails?.imageHint || "",
        customAttributesJsonString: initialData?.productDetails?.customAttributesJsonString || "",
        esprSpecifics: {
          durabilityInformation: initialData?.productDetails?.esprSpecifics?.durabilityInformation || "",
          repairabilityInformation: initialData?.productDetails?.esprSpecifics?.repairabilityInformation || "",
          recycledContentSummary: initialData?.productDetails?.esprSpecifics?.recycledContentSummary || "",
          energyEfficiencySummary: initialData?.productDetails?.esprSpecifics?.energyEfficiencySummary || "",
          substanceOfConcernSummary: initialData?.productDetails?.esprSpecifics?.substanceOfConcernSummary || "",
        },
        carbonFootprint: initialData?.productDetails?.carbonFootprint || { 
            value: null, unit: "", calculationMethod: "",
            scope1Emissions: null, scope2Emissions: null, scope3Emissions: null,
            dataSource: "", vcId: ""
        },
        conflictMineralsReportUrl: initialData?.productDetails?.conflictMineralsReportUrl || "",
        fairTradeCertificationId: initialData?.productDetails?.fairTradeCertificationId || "",
        ethicalSourcingPolicyUrl: initialData?.productDetails?.ethicalSourcingPolicyUrl || "",
      },
      manufacturer: initialData?.manufacturer || "",
      modelNumber: initialData?.modelNumber || "",
      sku: initialData?.sku || "",
      nfcTagId: initialData?.nfcTagId || "",
      rfidTagId: initialData?.rfidTagId || "",
      productCategory: initialData?.productCategory || "",
      onChainStatus: initialData?.onChainStatus || "Unknown", 
      onChainLifecycleStage: initialData?.onChainLifecycleStage || "Unknown", 
      
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
          cbamGoodsIdentifier: "",
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
      manufacturerOrigin: initialData?.manufacturerOrigin,
      modelNumberOrigin: initialData?.modelNumberOrigin,
      productDetailsOrigin: initialData?.productDetailsOrigin,
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
    if (initialData?.productDetails?.customAttributesJsonString) {
      try {
        const parsedAttributes = JSON.parse(initialData.productDetails.customAttributesJsonString);
        if (Array.isArray(parsedAttributes)) {
          setCustomAttributes(parsedAttributes);
        }
      } catch (e) {
        console.error("Failed to parse custom attributes JSON:", e);
        setCustomAttributes([]);
      }
    } else if (initialData && !initialData.productDetails?.customAttributesJsonString) {
        setCustomAttributes([]);
    }
  }, [initialData?.productDetails?.customAttributesJsonString]);

  useEffect(() => {
    if (initialData) {
      form.reset({
        productName: initialData.productName || "",
        gtin: initialData.gtin || "",
        manufacturer: initialData.manufacturer || "",
        modelNumber: initialData.modelNumber || "",
        sku: initialData.sku || "",
        nfcTagId: initialData.nfcTagId || "",
        rfidTagId: initialData.rfidTagId || "",
        productCategory: initialData.productCategory || "",
        onChainStatus: initialData.onChainStatus || "Unknown", 
        onChainLifecycleStage: initialData.onChainLifecycleStage || "Unknown", 

        productDetails: {
          description: initialData.productDetails?.description || "",
          materials: initialData.productDetails?.materials || "",
          sustainabilityClaims: initialData.productDetails?.sustainabilityClaims || "",
          keyCompliancePoints: initialData.productDetails?.keyCompliancePoints || "",
          specifications: initialData.productDetails?.specifications ? (typeof initialData.productDetails.specifications === 'string' ? initialData.productDetails.specifications : JSON.stringify(initialData.productDetails.specifications, null, 2)) : "",
          energyLabel: initialData.productDetails?.energyLabel || "",
          imageUrl: initialData.productDetails?.imageUrl || "",
          imageHint: initialData.productDetails?.imageHint || "",
          customAttributesJsonString: initialData.productDetails?.customAttributesJsonString || "",
          esprSpecifics: {
            durabilityInformation: initialData.productDetails?.esprSpecifics?.durabilityInformation || "",
            repairabilityInformation: initialData.productDetails?.esprSpecifics?.repairabilityInformation || "",
            recycledContentSummary: initialData.productDetails?.esprSpecifics?.recycledContentSummary || "",
            energyEfficiencySummary: initialData.productDetails?.esprSpecifics?.energyEfficiencySummary || "",
            substanceOfConcernSummary: initialData.productDetails?.esprSpecifics?.substanceOfConcernSummary || "",
          },
          carbonFootprint: initialData.productDetails?.carbonFootprint || { 
            value: null, unit: "", calculationMethod: "",
            scope1Emissions: null, scope2Emissions: null, scope3Emissions: null,
            dataSource: "", vcId: ""
          },
          conflictMineralsReportUrl: initialData.productDetails?.conflictMineralsReportUrl || "",
          fairTradeCertificationId: initialData.productDetails?.fairTradeCertificationId || "",
          ethicalSourcingPolicyUrl: initialData.productDetails?.ethicalSourcingPolicyUrl || "",
        },
        
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
        manufacturerOrigin: initialData.manufacturerOrigin,
        modelNumberOrigin: initialData.modelNumberOrigin,
        productDetailsOrigin: initialData.productDetailsOrigin,
        batteryRegulationOrigin: initialData.batteryRegulationOrigin,
      });
    }
  }, [initialData, form]);
  
  useEffect(() => {
    form.setValue("productDetails.customAttributesJsonString", JSON.stringify(customAttributes), { shouldValidate: true });
  }, [customAttributes, form]);

  const handleFormSubmit = (data: ProductFormData) => {
    const transformedData = { ...data };
    if (transformedData.batteryRegulation) {
        const br = transformedData.batteryRegulation;
        if (br.carbonFootprint) {
            if (br.carbonFootprint.value === undefined || String(br.carbonFootprint.value).trim() === "") br.carbonFootprint.value = null;
            if (br.carbonFootprint.scope1Emissions === undefined || String(br.carbonFootprint.scope1Emissions).trim() === "") br.carbonFootprint.scope1Emissions = null;
            if (br.carbonFootprint.scope2Emissions === undefined || String(br.carbonFootprint.scope2Emissions).trim() === "") br.carbonFootprint.scope2Emissions = null;
            if (br.carbonFootprint.scope3Emissions === undefined || String(br.carbonFootprint.scope3Emissions).trim() === "") br.carbonFootprint.scope3Emissions = null;
        }
        if (br.stateOfHealth) {
            if (br.stateOfHealth.value === undefined || String(br.stateOfHealth.value).trim() === "") br.stateOfHealth.value = null;
        }
        if (br.recycledContent) {
            br.recycledContent = br.recycledContent.map(item => ({ ...item, percentage: (item.percentage === undefined || String(item.percentage).trim() === "") ? null : item.percentage }));
        }
        if (br.ratedCapacityAh === undefined || String(br.ratedCapacityAh).trim() === "") br.ratedCapacityAh = null;
        if (br.nominalVoltage === undefined || String(br.nominalVoltage).trim() === "") br.nominalVoltage = null;
        if (br.expectedLifetimeCycles === undefined || String(br.expectedLifetimeCycles).trim() === "") br.expectedLifetimeCycles = null;
        if (br.recyclingEfficiencyRate === undefined || String(br.recyclingEfficiencyRate).trim() === "") br.recyclingEfficiencyRate = null;
        if (br.materialRecoveryRates) {
            if (br.materialRecoveryRates.cobalt === undefined || String(br.materialRecoveryRates.cobalt).trim() === "") br.materialRecoveryRates.cobalt = null;
            if (br.materialRecoveryRates.lead === undefined || String(br.materialRecoveryRates.lead).trim() === "") br.materialRecoveryRates.lead = null;
            if (br.materialRecoveryRates.lithium === undefined || String(br.materialRecoveryRates.lithium).trim() === "") br.materialRecoveryRates.lithium = null;
            if (br.materialRecoveryRates.nickel === undefined || String(br.materialRecoveryRates.nickel).trim() === "") br.materialRecoveryRates.nickel = null;
        }
    }
    if (transformedData.productDetails?.carbonFootprint) { 
        const pcf = transformedData.productDetails.carbonFootprint;
        if (pcf.value === undefined || String(pcf.value).trim() === "") pcf.value = null;
        if (pcf.scope1Emissions === undefined || String(pcf.scope1Emissions).trim() === "") pcf.scope1Emissions = null;
        if (pcf.scope2Emissions === undefined || String(pcf.scope2Emissions).trim() === "") pcf.scope2Emissions = null;
        if (pcf.scope3Emissions === undefined || String(pcf.scope3Emissions).trim() === "") pcf.scope3Emissions = null;
    }
    if (transformedData.compliance?.euCustomsData) {
        const cd = transformedData.compliance.euCustomsData;
        if(cd.netWeightKg === undefined || String(cd.netWeightKg).trim() === "") cd.netWeightKg = null;
        if(cd.grossWeightKg === undefined || String(cd.grossWeightKg).trim() === "") cd.grossWeightKg = null;
        if(cd.customsValuation && (cd.customsValuation.value === undefined || String(cd.customsValuation.value).trim() === "")) {
            cd.customsValuation.value = null;
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
      productDetails: {
        ...transformedData.productDetails,
        customAttributesJsonString: JSON.stringify(customAttributes)
      }
    };
    onSubmit(dataToSubmit);
  };

  const handleClaimClick = (claim: string) => {
    const currentClaimsValue = form.getValues("productDetails.sustainabilityClaims") || "";
    const newClaimsValue = currentClaimsValue ? `${currentClaimsValue}\n- ${claim}` : `- ${claim}`;
    form.setValue("productDetails.sustainabilityClaims", newClaimsValue, { shouldValidate: true });
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
    <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3', 'item-12', 'item-13', 'item-4', 'item-14', 'item-5', 'item-6', 'item-7', 'item-8', 'item-9', 'item-10', 'item-11']} className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-lg font-semibold flex items-center"><FileText className="mr-2 h-5 w-5 text-primary" />Basic Information</AccordionTrigger>
        <AccordionContent>
          <BasicInfoFormSection
            form={form}
            initialData={initialData}
            isSubmittingForm={!!isSubmitting}
            toast={toast}
            categoryComplianceSummary={categoryComplianceSummary}
            isLoadingCategoryCompliance={isLoadingCategoryCompliance}
            onFetchCategoryComplianceSummary={onFetchCategoryComplianceSummary}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger className="text-lg font-semibold flex items-center">
          <ImageIconLucide className="mr-2 h-5 w-5 text-primary" /> Product Image
        </AccordionTrigger>
        <AccordionContent>
          <ProductImageFormSection
            form={form}
            aiImageHelper={handleGenerateImageAI} 
            initialImageUrlOrigin={initialData?.productDetailsOrigin?.imageUrlOrigin}
            toast={toast}
            isGeneratingImageState={isGeneratingImage}
            setIsGeneratingImageState={setIsGeneratingImage}
            initialImageUrl={initialData?.productDetails?.imageUrl}
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

      <AccordionItem value="item-14">
        <AccordionTrigger className="text-lg font-semibold flex items-center"><Cloud className="mr-2 h-5 w-5 text-primary" />Product Carbon Footprint</AccordionTrigger>
        <AccordionContent>
          <CarbonFootprintFormSection
            form={form}
            initialData={initialData}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-13">
        <AccordionTrigger className="text-lg font-semibold flex items-center"><Handshake className="mr-2 h-5 w-5 text-primary" />Ethical Sourcing</AccordionTrigger>
        <AccordionContent>
          <EthicalSourcingFormSection form={form} />
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="item-12">
        <AccordionTrigger className="text-lg font-semibold flex items-center"><Leaf className="mr-2 h-5 w-5 text-green-600" />ESPR Specifics (Ecodesign)</AccordionTrigger>
        <AccordionContent>
          <EsprSpecificsFormSection form={form} initialData={initialData} />
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
        <AccordionTrigger className="text-lg font-semibold flex items-center"><ConstructionIcon className="mr-2 h-5 w-5 text-primary" />Construction Product Information (if applicable)</AccordionTrigger>
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

  // This part is for when the form is embedded and not a standalone page
  return (
     <Form {...form}>
        <form id={id} onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">{formContent}</form>
    </Form>
  );
}
