
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
  DigitalTwinFormSection,
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
  categoryComplianceSummary?: string | null; 
  isLoadingCategoryCompliance?: boolean; 
  onFetchCategoryComplianceSummary?: (category: string, focusedRegulations?: string) => void; 
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
        digitalTwin: initialData?.productDetails?.digitalTwin || { 
          uri: "", sensorDataEndpoint: "", realTimeStatus: "", predictiveMaintenanceAlerts: ""
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
          digitalTwin: initialData.productDetails?.digitalTwin || { 
            uri: "", sensorDataEndpoint: "", realTimeStatus: "", predictiveMaintenanceAlerts: ""
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
    <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3', 'item-12', 'item-13', 'item-4', 'item-14', 'item-15', 'item-5', 'item-6', 'item-7', 'item-8', 'item-9', 'item-10', 'item-11']} className="w-full">
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

      <AccordionItem value="item-15"> 
        <AccordionTrigger className="text-lg font-semibold flex items-center">
          <Cpu className="mr-2 h-5 w-5 text-primary" /> Digital Twin (Conceptual)
        </AccordionTrigger>
        <AccordionContent>
          <DigitalTwinFormSection form={form} initialData={initialData} />
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

```
- workspace/src/components/products/form/index.ts:
```ts

// src/components/products/form/index.ts
export { default as AiIndicator } from './AiIndicator';
export { default as AiSuggestionDisplay } from './AiSuggestionDisplay';
export { default as BasicInfoFormSection } from './BasicInfoFormSection';
export { default as BatteryDetailsFormSection } from './BatteryDetailsFormSection';
export { default as ConstructionProductInformationFormSection } from './ConstructionProductInformationFormSection';
export { default as CustomAttributesFormSection } from './CustomAttributesFormSection';
export { default as EthicalSourcingFormSection } from './EthicalSourcingFormSection';
export { default as EuCustomsDataFormSection } from './EuCustomsDataFormSection';
export { default as ProductImageFormSection } from './ProductImageFormSection';
export { default as ScipNotificationFormSection } from './ScipNotificationFormSection';
export { default as SustainabilityComplianceFormSection } from './SustainabilityComplianceFormSection';
export { default as TechnicalSpecificationsFormSection } from './TechnicalSpecificationsFormSection';
export { default as TextileInformationFormSection } from './TextileInformationFormSection';
export { default as EsprSpecificsFormSection } from './EsprSpecificsFormSection';
export { default as CarbonFootprintFormSection } from './CarbonFootprintFormSection';
export { default as DigitalTwinFormSection } from './DigitalTwinFormSection'; // Added export
```
- workspace/src/components/products/detail/SustainabilityTab.tsx:
```tsx

// --- File: SustainabilityTab.tsx ---
// Description: Displays sustainability-related information for a product.
"use client";

import type { SimpleProductDetail } from "@/types/dpp";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Zap, Recycle, Wrench, CheckCircle, AlertCircle, Info, Users, Handshake, ExternalLink, FileText, BarChart3, BookText, Cloud, Sun, Wind } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SustainabilityTabProps {
  product: SimpleProductDetail;
}

const DetailItem: React.FC<{ label: string; value?: string | number | null; unit?: string; link?: string; isUrl?: boolean }> = ({ label, value, unit, link, isUrl }) => {
  if (value === undefined || value === null || String(value).trim() === "") return null;
  return (
    <div className="flex justify-between items-center text-sm py-1.5 border-b border-border/50 last:border-b-0">
      <span className="text-muted-foreground">{label}:</span>
      {isUrl && typeof value === 'string' && value.startsWith('http') ? (
        <Link href={value} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline truncate max-w-[60%]">
          View Document/Policy <ExternalLink className="inline h-3 w-3 ml-1" />
        </Link>
      ) : (
        <span className="font-medium text-foreground/90 text-right truncate max-w-[60%]">
          {value}
          {unit && <span className="ml-0.5 text-xs text-muted-foreground">{unit}</span>}
          {link && (
            <Link href={link} target="_blank" rel="noopener noreferrer" className="ml-1.5 text-primary hover:underline text-xs">(Details)</Link>
          )}
        </span>
      )}
    </div>
  );
};

export default function SustainabilityTab({ product }: SustainabilityTabProps) {
  if (!product) {
    return <p className="text-muted-foreground p-4">Sustainability data not available.</p>;
  }

  const hasEthicalSourcingInfo = product.productDetails?.conflictMineralsReportUrl || product.productDetails?.fairTradeCertificationId || product.productDetails?.ethicalSourcingPolicyUrl;
  const esprSpecifics = product.productDetails?.esprSpecifics;
  const generalCarbonFootprint = product.productDetails?.carbonFootprint;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Leaf className="mr-2 h-5 w-5 text-green-600" /> Key Sustainability Claims
          </CardTitle>
        </CardHeader>
        <CardContent>
          {product.keySustainabilityPoints && product.keySustainabilityPoints.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {product.keySustainabilityPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-success flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No specific sustainability claims listed.</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Users className="mr-2 h-5 w-5 text-indigo-600" /> Materials Composition
          </CardTitle>
        </CardHeader>
        <CardContent>
          {product.materialsUsed && product.materialsUsed.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {product.materialsUsed.map((material, index) => (
                <li key={index} className="p-2 bg-muted/50 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{material.name}</span>
                    {material.percentage && <Badge variant="secondary">{material.percentage}%</Badge>}
                  </div>
                  {material.source && <p className="text-xs text-muted-foreground">Source: {material.source}</p>}
                  {material.isRecycled && <Badge variant="outline" className="mt-1 text-xs border-green-500/50 text-green-600 bg-green-500/10">Recycled Content</Badge>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Material composition details not available.</p>
          )}
        </CardContent>
      </Card>

      {generalCarbonFootprint && (generalCarbonFootprint.value !== null && generalCarbonFootprint.value !== undefined) && (
        <Card className="shadow-sm md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <Cloud className="mr-2 h-5 w-5 text-sky-600" /> General Product Carbon Footprint
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <DetailItem label="Total Value" value={generalCarbonFootprint.value} unit={generalCarbonFootprint.unit} />
            <DetailItem label="Calculation Method" value={generalCarbonFootprint.calculationMethod} />
            <DetailItem label="Primary Data Source" value={generalCarbonFootprint.dataSource} />
            <div className="grid md:grid-cols-3 gap-2 pt-2 border-t border-border/30 mt-2">
                <DetailItem label="Scope 1" value={generalCarbonFootprint.scope1Emissions} unit={generalCarbonFootprint.unit?.replace('/kWh','')} />
                <DetailItem label="Scope 2" value={generalCarbonFootprint.scope2Emissions} unit={generalCarbonFootprint.unit?.replace('/kWh','')} />
                <DetailItem label="Scope 3" value={generalCarbonFootprint.scope3Emissions} unit={generalCarbonFootprint.unit?.replace('/kWh','')} />
            </div>
            {generalCarbonFootprint.vcId && <DetailItem label="Carbon Footprint VC ID" value={generalCarbonFootprint.vcId} />}
          </CardContent>
        </Card>
      )}

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Zap className="mr-2 h-5 w-5 text-yellow-500" /> Energy Efficiency
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DetailItem label="Energy Label Rating" value={product.energyLabelRating} />
          {esprSpecifics?.energyEfficiencySummary && <DetailItem label="ESPR Energy Summary" value={esprSpecifics.energyEfficiencySummary} />}
          {!product.energyLabelRating && !esprSpecifics?.energyEfficiencySummary && <p className="text-sm text-muted-foreground">Energy information not specified.</p>}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Wrench className="mr-2 h-5 w-5 text-blue-600" /> Repair & Recyclability
          </CardTitle>
          <CardDescription>Information on product end-of-life and maintenance.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {product.repairability && (
            <div>
              <h4 className="text-sm font-medium mb-1">Repairability Score:</h4>
              <p className="text-foreground/90">
                <span className="font-bold text-xl text-blue-700">{product.repairability.score}</span> / {product.repairability.scale}
                {product.repairability.detailsUrl && (
                  <Link href={product.repairability.detailsUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="link" size="sm" className="p-0 h-auto ml-2 text-xs">View Details</Button>
                  </Link>
                )}
              </p>
            </div>
          )}
           {esprSpecifics?.repairabilityInformation && <DetailItem label="ESPR Repairability Info" value={esprSpecifics.repairabilityInformation} />}
          {product.recyclabilityInfo && (
            <div className="mt-2">
              <h4 className="text-sm font-medium mb-1">Recyclability:</h4>
               <DetailItem label="Recyclable Content" value={product.recyclabilityInfo.percentage} unit="%" />
               {product.recyclabilityInfo.instructionsUrl && (
                 <Link href={product.recyclabilityInfo.instructionsUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block">
                   <Button variant="outline" size="sm" className="text-xs">
                     <Recycle className="mr-1.5 h-3.5 w-3.5"/> Recycling Instructions
                   </Button>
                 </Link>
               )}
            </div>
          )}
           {esprSpecifics?.recycledContentSummary && <DetailItem label="ESPR Recycled Content Summary" value={esprSpecifics.recycledContentSummary} />}
          {!product.repairability && !product.recyclabilityInfo && !esprSpecifics?.repairabilityInformation && !esprSpecifics?.recycledContentSummary &&(
             <p className="text-sm text-muted-foreground">Repair and recyclability information not specified.</p>
          )}
        </CardContent>
      </Card>

      {hasEthicalSourcingInfo && (
        <Card className="shadow-sm md:col-span-2"> 
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <Handshake className="mr-2 h-5 w-5 text-purple-600" /> Ethical Sourcing & Supply Chain Transparency
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <DetailItem label="Conflict Minerals Report" value={product.productDetails?.conflictMineralsReportUrl} isUrl />
            <DetailItem label="Fair Trade Certification ID/Link" value={product.productDetails?.fairTradeCertificationId} isUrl={product.productDetails?.fairTradeCertificationId?.startsWith('http')} />
            <DetailItem label="Ethical Sourcing Policy" value={product.productDetails?.ethicalSourcingPolicyUrl} isUrl />
            {!(product.productDetails?.conflictMineralsReportUrl || product.productDetails?.fairTradeCertificationId || product.productDetails?.ethicalSourcingPolicyUrl) && (
                 <p className="text-sm text-muted-foreground">No specific ethical sourcing information provided.</p>
            )}
          </CardContent>
        </Card>
      )}

      {product.batteryRegulation && product.batteryRegulation.status && product.batteryRegulation.status.toLowerCase() !== 'not_applicable' && (
        <Card className="shadow-sm md:col-span-2">
          <CardHeader><CardTitle className="text-lg font-semibold flex items-center"><BatteryCharging className="mr-2 h-5 w-5 text-lime-600" />EU Battery Regulation Details</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-2">
            <DetailItem label="Status" value={product.batteryRegulation.status?.replace('_',' ')} />
            <DetailItem label="Chemistry" value={product.batteryRegulation.batteryChemistry} />
            <DetailItem label="Battery Passport ID" value={product.batteryRegulation.batteryPassportId} />
            
            {product.batteryRegulation.carbonFootprint && (product.batteryRegulation.carbonFootprint.value !== null && product.batteryRegulation.carbonFootprint.value !== undefined) && (
                <div className="mt-1 pt-1 border-t border-border/30"><strong className="text-muted-foreground">Carbon Footprint:</strong> {product.batteryRegulation.carbonFootprint.value} {product.batteryRegulation.carbonFootprint.unit || ''} (Method: {product.batteryRegulation.carbonFootprint.calculationMethod || 'N/A'})
                 {(product.batteryRegulation.carbonFootprint.scope1Emissions || product.batteryRegulation.carbonFootprint.scope2Emissions || product.batteryRegulation.carbonFootprint.scope3Emissions) && (
                    <ul className="list-disc list-inside ml-4 text-xs">
                        {product.batteryRegulation.carbonFootprint.scope1Emissions && <li>Scope 1: {product.batteryRegulation.carbonFootprint.scope1Emissions} {product.batteryRegulation.carbonFootprint.unit?.replace('/kWh','')}</li>}
                        {product.batteryRegulation.carbonFootprint.scope2Emissions && <li>Scope 2: {product.batteryRegulation.carbonFootprint.scope2Emissions} {product.batteryRegulation.carbonFootprint.unit?.replace('/kWh','')}</li>}
                        {product.batteryRegulation.carbonFootprint.scope3Emissions && <li>Scope 3: {product.batteryRegulation.carbonFootprint.scope3Emissions} {product.batteryRegulation.carbonFootprint.unit?.replace('/kWh','')}</li>}
                    </ul>
                 )}
                 {product.batteryRegulation.carbonFootprint.dataSource && <p className="text-xs text-muted-foreground pl-5">Data Source: {product.batteryRegulation.carbonFootprint.dataSource}</p>}
                </div>
            )}

            {product.batteryRegulation.recycledContent && product.batteryRegulation.recycledContent.length > 0 && (
                <div className="mt-1 pt-1 border-t border-border/30"><strong className="text-muted-foreground">Recycled Content:</strong>
                    <ul className="list-disc list-inside ml-4">{product.batteryRegulation.recycledContent.map((rc,i) => <li key={i}>{rc.material}: {rc.percentage ?? 'N/A'}% {rc.source && `(Source: ${rc.source})`}</li>)}</ul>
                </div>
            )}

            {product.batteryRegulation.stateOfHealth && (product.batteryRegulation.stateOfHealth.value !== null && product.batteryRegulation.stateOfHealth.value !== undefined) && (
                <div className="mt-1 pt-1 border-t border-border/30"><strong className="text-muted-foreground">State of Health:</strong> {product.batteryRegulation.stateOfHealth.value}{product.batteryRegulation.stateOfHealth.unit || '%'} (Measured: {product.batteryRegulation.stateOfHealth.measurementDate ? new Date(product.batteryRegulation.stateOfHealth.measurementDate).toLocaleDateString() : 'N/A'}, Method: {product.batteryRegulation.stateOfHealth.measurementMethod || 'N/A'})</div>
            )}
            {product.batteryRegulation.vcId && <p className="mt-1 pt-1 border-t border-border/30"><strong className="text-muted-foreground">Overall VC ID:</strong> <span className="font-mono text-xs">{product.batteryRegulation.vcId}</span></p>}
          </CardContent>
        </Card>
      )}
    </div>
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
import type { ProductFormData } from "@/types/productFormTypes"; // Corrected import path

interface EthicalSourcingFormSectionProps {
  form: UseFormReturn<ProductFormData>;
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
        name="productDetails.conflictMineralsReportUrl"
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
        name="productDetails.fairTradeCertificationId"
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
        name="productDetails.ethicalSourcingPolicyUrl"
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
- workspace/src/app/passport/[passportId]/page.tsx:
```tsx

"use client";

// --- File: page.tsx (Public Product Passport Viewer) ---
// Description: Main page component for displaying the public view of a Digital Product Passport.

import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import * as LucideIcons from 'lucide-react'; 
import {
  Leaf, Recycle, ShieldCheck, Cpu, ExternalLink, Building, Zap, ChevronDown, ChevronUp, Fingerprint,
  ServerIcon, AlertCircle, Info as InfoIcon, ListChecks, History as HistoryIcon, Award, Bot, Barcode,
  KeyRound, FileLock, Anchor, Layers3, FileCog, Tag, SigmaSquare, Handshake, Database, Layers as LayersIconShadcn, 
  CalendarDays as CalendarIcon, FileText as FileTextIcon, Heart, Thermometer, User, Factory, Truck, ShoppingCart,
  Construction, Shirt, Cloud, Wind, Sun, BookmarkPlus, BookmarkCheck, AlertTriangle as AlertTriangleIcon, Globe
} from 'lucide-react';
import { Logo } from '@/components/icons/Logo';
import React, { useState, useEffect, useCallback, useMemo } from 'react'; 
import { cn } from '@/lib/utils';
import { useRole } from '@/contexts/RoleContext';
import type { PublicProductInfo, IconName, LifecycleHighlight, PublicCertification, CustomAttribute, BatteryRegulationDetails, RecycledContentData, CarbonFootprintData } from '@/types/dpp';
import { MOCK_PUBLIC_PASSPORTS } from '@/data';
import RoleSpecificCard from '@/components/passport/RoleSpecificCard';
import { getAiHintForImage } from '@/utils/imageUtils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; 
import { useToast } from "@/hooks/use-toast"; 
import { TRACKED_PRODUCTS_STORAGE_KEY } from '@/types/dpp'; 
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts'; 

const STORY_TRUNCATE_LENGTH = 250;

export default function PublicPassportPage() {
  const params = useParams();
  const passportId = params.passportId as string;
  const [product, setProduct] = useState<PublicProductInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStoryExpanded, setIsStoryExpanded] = useState(false);
  const [isTracked, setIsTracked] = useState(false); 
  const { currentRole } = useRole();
  const { toast } = useToast(); 

  const updateTrackedStatus = useCallback(() => {
    if (typeof window !== 'undefined') { 
      const storedIdsString = localStorage.getItem(TRACKED_PRODUCTS_STORAGE_KEY);
      const trackedIds: string[] = storedIdsString ? JSON.parse(storedIdsString) : [];
      setIsTracked(trackedIds.includes(passportId));
    }
  }, [passportId]);

  useEffect(() => {
    const fetchedProduct = MOCK_PUBLIC_PASSPORTS[passportId] || MOCK_PUBLIC_PASSPORTS[`PROD${passportId.replace('DPP','')}`] ; 
    if (fetchedProduct) {
      setProduct({
        ...fetchedProduct,
        customAttributes: fetchedProduct.customAttributes || [],
        documents: fetchedProduct.documents || [],
        authenticationVcId: fetchedProduct.authenticationVcId,
        ownershipNftLink: fetchedProduct.ownershipNftLink,
        productDetails: { 
            ...(fetchedProduct.productDetails || {}), 
            esprSpecifics: fetchedProduct.productDetails?.esprSpecifics,
            carbonFootprint: fetchedProduct.productDetails?.carbonFootprint, 
            digitalTwin: fetchedProduct.productDetails?.digitalTwin,
            conflictMineralsReportUrl: fetchedProduct.productDetails?.conflictMineralsReportUrl,
            fairTradeCertificationId: fetchedProduct.productDetails?.fairTradeCertificationId,
            ethicalSourcingPolicyUrl: fetchedProduct.productDetails?.ethicalSourcingPolicyUrl,
        }
      });
      updateTrackedStatus(); 
    }
    setIsLoading(false);
  }, [passportId, updateTrackedStatus]);

  const handleToggleTrackProduct = () => {
    if (typeof window === 'undefined') return; 

    const storedIdsString = localStorage.getItem(TRACKED_PRODUCTS_STORAGE_KEY);
    let trackedIds: string[] = storedIdsString ? JSON.parse(storedIdsString) : [];
    const productIndex = trackedIds.indexOf(passportId);

    if (productIndex > -1) {
      trackedIds.splice(productIndex, 1); 
      toast({ title: "Product Untracked", description: `${product?.productName || passportId} removed from your list.` });
    } else {
      trackedIds.push(passportId); 
      toast({ title: "Product Tracked", description: `${product?.productName || passportId} added to your list.` });
    }
    localStorage.setItem(TRACKED_PRODUCTS_STORAGE_KEY, JSON.stringify(trackedIds));
    updateTrackedStatus(); 
  };


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading product passport...</p>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const toggleStoryExpansion = () => {
    setIsStoryExpanded(!isStoryExpanded);
  };

  const displayProductStory = isStoryExpanded || product.productStory.length <= STORY_TRUNCATE_LENGTH
    ? product.productStory
    : `${product.productStory.substring(0, STORY_TRUNCATE_LENGTH)}...`;

  const getEbsiStatusBadge = (status?: 'verified' | 'pending' | 'not_verified' | 'error') => {
    switch (status) {
      case 'verified':
        return <Badge variant="default" className="bg-green-500/20 text-green-700 border-green-500/30"><ShieldCheck className="mr-1.5 h-3.5 w-3.5" />Verified</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-700 border-yellow-500/30"><InfoIcon className="mr-1.5 h-3.5 w-3.5" />Pending</Badge>;
      case 'not_verified':
        return <Badge variant="destructive"><AlertCircle className="mr-1.5 h-3.5 w-3.5" />Not Verified</Badge>;
      case 'error':
        return <Badge variant="destructive" className="bg-red-500/20 text-red-700 border-red-500/30"><AlertCircle className="mr-1.5 h-3.5 w-3.5" />Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const aiCopilotQuery = encodeURIComponent(`What are the key compliance requirements for a product like '${product.productName}' in the '${product.category}' category? Also, what are specific considerations for its EBSI status of '${product.ebsiStatus || 'N/A'}'?`);
  const aiCopilotLink = `/copilot?contextQuery=${aiCopilotQuery}`;

  const aiHintForImage = getAiHintForImage({
    productName: product.productName,
    category: product.category,
    imageHint: product.imageHint,
  });

  const hasEthicalSourcingInfo = product.productDetails?.conflictMineralsReportUrl || product.productDetails?.fairTradeCertificationId || product.productDetails?.ethicalSourcingPolicyUrl;
  const generalCarbonFootprint = product.productDetails?.carbonFootprint;
  const cbamGoodsIdentifier = product.compliance?.euCustomsData?.cbamGoodsIdentifier;

  const carbonFootprintChartData = useMemo(() => {
    if (!generalCarbonFootprint) return null;
    const { scope1Emissions, scope2Emissions, scope3Emissions, unit } = generalCarbonFootprint;
    const data = [];
    if (typeof scope1Emissions === 'number') data.push({ name: 'Scope 1', emissions: scope1Emissions, fill: 'hsl(var(--chart-1))' });
    if (typeof scope2Emissions === 'number') data.push({ name: 'Scope 2', emissions: scope2Emissions, fill: 'hsl(var(--chart-2))' });
    if (typeof scope3Emissions === 'number') data.push({ name: 'Scope 3', emissions: scope3Emissions, fill: 'hsl(var(--chart-3))' });
    return data.length > 0 ? { data, unit: unit?.replace('/kWh','').replace('/unit','') || 'kg CO2e' } : null;
  }, [generalCarbonFootprint]);


  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="py-6 bg-card shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link href="/" passHref>
            <Logo className="h-10 w-auto text-primary" />
          </Link>
          <div className="flex items-center gap-2">
             <Button variant={isTracked ? "default" : "outline"} size="sm" onClick={handleToggleTrackProduct} className="text-xs">
              {isTracked ? <BookmarkCheck className="mr-1.5 h-4 w-4" /> : <BookmarkPlus className="mr-1.5 h-4 w-4" />}
              {isTracked ? "Untrack Product" : "Track This Product"}
            </Button>
            <Badge variant="outline" className="border-primary text-primary text-sm">Digital Product Passport</Badge>
          </div>
        </div>
      </header>

      <main id="main-content" className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="bg-card p-6 sm:p-8 rounded-xl shadow-xl">
          <div className="text-center mb-8">
            <h1 className="font-headline text-3xl md:text-4xl font-semibold text-primary mb-2">
              {product.productName}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">{product.tagline}</p>
            <div className="mt-3 text-sm text-muted-foreground">
                <span>Category: {product.category}</span> | <span>Model: {product.modelNumber}</span>
                {cbamGoodsIdentifier && (
                  <span className="block mt-1">
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                      <Globe className="mr-1.5 h-3.5 w-3.5"/> CBAM ID: {cbamGoodsIdentifier}
                    </Badge>
                  </span>
                )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="w-full">
              <Image
                src={product.imageUrl}
                alt={product.productName}
                width={800}
                height={600}
                className="rounded-lg object-cover shadow-md aspect-[4/3]"
                data-ai-hint={aiHintForImage}
                priority={product.imageUrl ? !product.imageUrl.startsWith("data:") : true}
              />
            </div>
            <div className="space-y-6">
              <Card className="bg-muted border-border">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">
                    {currentRole === 'manufacturer' ? "Product Story (Manufacturer View)" : "Product Story"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed">{displayProductStory}</p>
                  {product.productStory.length > STORY_TRUNCATE_LENGTH && (
                    <Button
                      variant="link"
                      onClick={toggleStoryExpansion}
                      className="p-0 h-auto mt-2 text-primary hover:text-primary/80"
                    >
                      {isStoryExpanded ? "Read Less" : "Read More"}
                      {isStoryExpanded ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
                    </Button>
                  )}
                  {currentRole === 'recycler' && (
                    <p className="text-xs text-muted-foreground mt-3">Recyclers: Focus on 'Materials Composition' and 'Lifecycle' sections for EOL details.</p>
                  )}
                   {currentRole === 'service_provider' && (
                    <p className="text-xs text-muted-foreground mt-3">Service Providers: Check 'Technical Specifications' and 'Documents' for repair guides.</p>
                  )}
                </CardContent>
              </Card>

              {(product.sku || product.nfcTagId || product.rfidTagId) && (
                <Card className="border-accent/50">
                  <CardHeader>
                    <CardTitle className="text-xl text-accent flex items-center">
                      <Barcode className="mr-2 h-6 w-6" /> Identifiers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm">
                    {product.sku && (<p><strong className="text-muted-foreground">SKU:</strong> {product.sku}</p>)}
                    {product.nfcTagId && (<p><strong className="text-muted-foreground">NFC Tag ID:</strong> {product.nfcTagId}</p>)}
                    {product.rfidTagId && (<p><strong className="text-muted-foreground">RFID Tag ID:</strong> {product.rfidTagId}</p>)}
                  </CardContent>
                </Card>
              )}

              <Card className="border-accent/50">
                <CardHeader>
                  <CardTitle className="text-xl text-accent flex items-center">
                    <Leaf className="mr-2 h-6 w-6" /> Sustainability Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {product.sustainabilityHighlights.map((highlight, index) => {
                      const IconComponent = highlight.iconName && (LucideIcons as any)[highlight.iconName] ? (LucideIcons as any)[highlight.iconName] : Leaf;
                      return (
                        <li key={index} className="flex items-center text-foreground">
                          <IconComponent className="h-5 w-5 mr-3 text-accent flex-shrink-0" />
                          <span>{highlight.text}</span>
                        </li>
                      );
                    })}
                  </ul>
                  {currentRole === 'retailer' && (
                    <p className="text-xs text-muted-foreground mt-3">Key consumer-facing sustainability points.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-border text-center">
              <Link href={aiCopilotLink} passHref>
                <Button variant="secondary" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Bot className="mr-2 h-5 w-5" /> Ask AI Co-Pilot about this Product
                </Button>
              </Link>
          </div>


          <div className="mt-10 pt-8 border-t border-border">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-primary flex items-center">
                    <Building className="mr-2 h-6 w-6" /> Manufacturer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">{product.manufacturerName}</h3>
                  {product.brandLogoUrl && (
                     <div className="my-3">
                        <Image src={product.brandLogoUrl} alt={`${product.manufacturerName} Logo`} width={150} height={50} className="object-contain" data-ai-hint="brand logo" />
                     </div>
                  )}
                  {product.manufacturerWebsite && (
                    <Link href={product.manufacturerWebsite} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary hover:underline">
                      Visit Website <ExternalLink className="ml-1 h-4 w-4" />
                    </Link>
                  )}
                  {currentRole === 'manufacturer' && (
                    <Button variant="link" size="sm" className="p-0 h-auto mt-1 text-primary block" onClick={() => alert('Mock: View Internal Details for ' + product.passportId)}>View Internal Details (Mock)</Button>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-primary flex items-center">
                     <HistoryIcon className="mr-2 h-6 w-6" /> Product Journey Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {product.lifecycleHighlights && product.lifecycleHighlights.length > 0 ? (
                    <ul className="space-y-3">
                      {product.lifecycleHighlights.map((event, index) => {
                        const Icon = event.iconName && (LucideIcons as any)[event.iconName] ? (LucideIcons as any)[event.iconName] : ListChecks;
                        return (
                          <li key={index} className="text-sm text-foreground border-b border-border/50 pb-2 last:border-b-0 last:pb-0 flex items-start">
                            <Icon className="h-5 w-5 mr-3 mt-0.5 text-primary flex-shrink-0" />
                            <div className="flex-grow">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">{event.stage}</span>
                                    <span className="text-xs text-muted-foreground">{event.date}</span>
                                </div>
                                {event.details && <p className="text-xs text-muted-foreground mt-0.5">{event.details}</p>}
                                {event.isEbsiVerified && (
                                    <Badge variant="default" className="mt-1.5 text-xs bg-green-100 text-green-700 border-green-300">
                                    <ShieldCheck className="mr-1 h-3 w-3" /> EBSI Verified
                                    </Badge>
                                )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No key lifecycle events available.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-primary flex items-center">
                    <Award className="mr-2 h-6 w-6" /> Product Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {product.certifications && product.certifications.length > 0 ? (
                    <ul className="space-y-2">
                      {product.certifications.map((cert, index) => (
                        <li key={index} className="text-sm text-foreground border-b border-border/50 pb-1.5 last:border-b-0">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{cert.name}</span>
                            {cert.isVerified && (
                                <ShieldCheck className="h-4 w-4 text-success" title="Verified Certification" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">Authority: {cert.authority}</p>
                          {cert.expiryDate && <p className="text-xs text-muted-foreground">Expires: {new Date(cert.expiryDate).toLocaleDateString()}</p>}
                          {cert.link && (
                            <Link href={cert.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline inline-flex items-center">
                              View Details <ExternalLink className="ml-1 h-3 w-3" />
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No certifications listed for this product.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {hasEthicalSourcingInfo && ( 
              <div className="mt-8 pt-6 border-t border-border">
                <Card className="border-0 shadow-none">
                  <CardHeader className="px-0 pt-0 pb-4">
                    <CardTitle className="text-xl text-primary flex items-center">
                      <Handshake className="mr-2 h-6 w-6" /> Ethical Sourcing & Transparency
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm px-0 pb-0">
                    {product.productDetails?.conflictMineralsReportUrl && (
                       <p><strong className="text-muted-foreground">Conflict Minerals Report:</strong> <Link href={product.productDetails.conflictMineralsReportUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View Report <ExternalLink className="inline h-3 w-3 ml-1" /></Link></p>
                    )}
                    {product.productDetails?.fairTradeCertificationId && (
                       <p><strong className="text-muted-foreground">Fair Trade Certification:</strong> {product.productDetails.fairTradeCertificationId.startsWith('http') ? <Link href={product.productDetails.fairTradeCertificationId} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View Certificate <ExternalLink className="inline h-3 w-3 ml-1" /></Link> : product.productDetails.fairTradeCertificationId}</p>
                    )}
                    {product.productDetails?.ethicalSourcingPolicyUrl && (
                       <p><strong className="text-muted-foreground">Ethical Sourcing Policy:</strong> <Link href={product.productDetails.ethicalSourcingPolicyUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View Policy <ExternalLink className="inline h-3 w-3 ml-1" /></Link></p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {generalCarbonFootprint && (generalCarbonFootprint.value !== null && generalCarbonFootprint.value !== undefined) && (
                <div className="mt-8 pt-6 border-t border-border">
                    <Card className="border-0 shadow-none">
                        <CardHeader className="px-0 pt-0 pb-4">
                            <CardTitle className="text-xl text-primary flex items-center"><Cloud className="mr-2 h-6 w-6" />Product Carbon Footprint</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm px-0 pb-0">
                            <p><strong className="text-muted-foreground">Total Value:</strong> {generalCarbonFootprint.value} {generalCarbonFootprint.unit}</p>
                            {generalCarbonFootprint.calculationMethod && <p><strong className="text-muted-foreground">Method:</strong> {generalCarbonFootprint.calculationMethod}</p>}
                            {(carbonFootprintChartData && carbonFootprintChartData.data.length > 0) ? (
                                <div className="mt-3">
                                    <h4 className="text-sm font-semibold mb-1">GHG Emissions by Scope ({carbonFootprintChartData.unit}):</h4>
                                    <div className="h-48 w-full max-w-md">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={carbonFootprintChartData.data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                                                <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={10} width={60} />
                                                <RechartsTooltip 
                                                    cursor={{fill: 'hsl(var(--muted))'}}
                                                    contentStyle={{backgroundColor: 'hsl(var(--popover))', borderRadius: 'var(--radius)', border: '1px solid hsl(var(--border))'}}
                                                    labelStyle={{color: 'hsl(var(--popover-foreground))'}}
                                                    formatter={(value: any, name: any, props: any) => [`${value} ${carbonFootprintChartData.unit}`, props.payload.name ]}
                                                />
                                                <Bar dataKey="emissions" name="Emissions" radius={[0, 4, 4, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            ) : (
                                (generalCarbonFootprint.scope1Emissions || generalCarbonFootprint.scope2Emissions || generalCarbonFootprint.scope3Emissions) && (
                                    <div className="mt-1 pt-1 border-t border-border/30"><strong className="text-muted-foreground">GHG Emissions by Scope:</strong>
                                        <ul className="list-disc list-inside ml-4 text-xs">
                                            {generalCarbonFootprint.scope1Emissions && <li>Scope 1: {generalCarbonFootprint.scope1Emissions} {generalCarbonFootprint.unit?.replace('/kWh','')}</li>}
                                            {generalCarbonFootprint.scope2Emissions && <li>Scope 2: {generalCarbonFootprint.scope2Emissions} {generalCarbonFootprint.unit?.replace('/kWh','')}</li>}
                                            {generalCarbonFootprint.scope3Emissions && <li>Scope 3: {generalCarbonFootprint.scope3Emissions} {generalCarbonFootprint.unit?.replace('/kWh','')}</li>}
                                        </ul>
                                    </div>
                                 )
                            )}
                            {generalCarbonFootprint.dataSource && <p><strong className="text-muted-foreground">Data Source:</strong> {generalCarbonFootprint.dataSource}</p>}
                            {generalCarbonFootprint.vcId && <p><strong className="text-muted-foreground">VC ID:</strong> <span className="font-mono text-xs">{generalCarbonFootprint.vcId}</span></p>}
                        </CardContent>
                    </Card>
                </div>
            )}

            {(product.customAttributes && product.customAttributes.length > 0) && (
              <div className="mt-8 pt-6 border-t border-border">
                <Card className="border-0 shadow-none">
                  <CardHeader className="px-0 pt-0 pb-4">
                    <CardTitle className="text-xl text-primary flex items-center">
                      <InfoIcon className="mr-2 h-6 w-6" /> Additional Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm px-0 pb-0">
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                      {product.customAttributes.map((attr, index) => (
                        <div key={index} className="flex">
                          <dt className="font-medium text-muted-foreground w-1/3 truncate">{attr.key}:</dt>
                          <dd className="text-foreground/90 w-2/3 whitespace-pre-wrap">{attr.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {product.textileInformation && (
              <div className="mt-8 pt-6 border-t border-border">
                <Card className="border-0 shadow-none">
                  <CardHeader className="px-0 pt-0 pb-4">
                    <CardTitle className="text-xl text-primary flex items-center"><Shirt className="mr-2 h-6 w-6" />Textile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm px-0 pb-0">
                    {product.textileInformation.fiberComposition && product.textileInformation.fiberComposition.length > 0 && (
                      <div>
                        <strong className="text-muted-foreground">Fiber Composition:</strong>
                        <ul className="list-disc list-inside ml-4">
                          {product.textileInformation.fiberComposition.map((fc, idx) => (
                            <li key={idx}>{fc.fiberName}: {fc.percentage === null || fc.percentage === undefined ? 'N/A' : `${fc.percentage}%`}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {product.textileInformation.countryOfOriginLabeling && <p><strong className="text-muted-foreground">Country of Origin (Label):</strong> {product.textileInformation.countryOfOriginLabeling}</p>}
                    {product.textileInformation.careInstructionsUrl && <p><strong className="text-muted-foreground">Care Instructions:</strong> <Link href={product.textileInformation.careInstructionsUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View Care Guide</Link></p>}
                    {product.textileInformation.isSecondHand !== undefined && <p><strong className="text-muted-foreground">Second Hand:</strong> {product.textileInformation.isSecondHand ? 'Yes' : 'No'}</p>}
                  </CardContent>
                </Card>
              </div>
            )}

            {product.constructionProductInformation && (
              <div className="mt-8 pt-6 border-t border-border">
                <Card className="border-0 shadow-none">
                  <CardHeader className="px-0 pt-0 pb-4">
                    <CardTitle className="text-xl text-primary flex items-center"><Construction className="mr-2 h-6 w-6" />Construction Product Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm px-0 pb-0">
                    {product.constructionProductInformation.declarationOfPerformanceId && <p><strong className="text-muted-foreground">DoP ID:</strong> {product.constructionProductInformation.declarationOfPerformanceId}</p>}
                    {product.constructionProductInformation.ceMarkingDetailsUrl && <p><strong className="text-muted-foreground">CE Marking:</strong> <Link href={product.constructionProductInformation.ceMarkingDetailsUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View Details</Link></p>}
                    {product.constructionProductInformation.intendedUseDescription && <p><strong className="text-muted-foreground">Intended Use:</strong> {product.constructionProductInformation.intendedUseDescription}</p>}
                    {product.constructionProductInformation.essentialCharacteristics && product.constructionProductInformation.essentialCharacteristics.length > 0 && (
                      <div><strong className="text-muted-foreground">Essential Characteristics:</strong>
                        <ul className="list-disc list-inside ml-4">
                          {product.constructionProductInformation.essentialCharacteristics.map((ec, idx) => <li key={idx}>{ec.characteristicName}: {ec.value} {ec.unit || ''} {ec.testMethod ? `(Test: ${ec.testMethod})` : ''}</li>)}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
             {product.batteryRegulation && product.batteryRegulation.status && product.batteryRegulation.status.toLowerCase() !== 'not_applicable' && (
                <div className="mt-8 pt-6 border-t border-border">
                    <Card className="border-0 shadow-none">
                        <CardHeader className="px-0 pt-0 pb-4">
                            <CardTitle className="text-xl text-primary flex items-center"><BatteryCharging className="mr-2 h-6 w-6" />EU Battery Regulation Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm px-0 pb-0">
                            <p><strong className="text-muted-foreground flex items-center"><InfoIcon className="mr-1.5 h-4 w-4 text-blue-500" />Status:</strong> <Badge variant="outline" className="capitalize">{product.batteryRegulation.status?.replace('_', ' ') || 'N/A'}</Badge></p>
                            {product.batteryRegulation.batteryChemistry && <p><strong className="text-muted-foreground flex items-center"><Thermometer className="mr-1.5 h-4 w-4 text-blue-500" />Chemistry:</strong> {product.batteryRegulation.batteryChemistry}</p>}
                            {product.batteryRegulation.batteryPassportId && <p><strong className="text-muted-foreground flex items-center"><Barcode className="mr-1.5 h-4 w-4 text-blue-500" />Passport ID:</strong> <span className="font-mono text-xs">{product.batteryRegulation.batteryPassportId}</span></p>}
                            
                            {product.batteryRegulation.carbonFootprint && (product.batteryRegulation.carbonFootprint.value !== null && product.batteryRegulation.carbonFootprint.value !== undefined) && (
                                <div className="mt-2 pt-2 border-t border-border/30">
                                    <strong className="text-muted-foreground flex items-center"><Cloud className="mr-1.5 h-4 w-4 text-orange-500" />Carbon Footprint:</strong>
                                    <p className="pl-5">Value: {product.batteryRegulation.carbonFootprint.value} {product.batteryRegulation.carbonFootprint.unit || ''}</p>
                                    {product.batteryRegulation.carbonFootprint.calculationMethod && <p className="pl-5">Method: {product.batteryRegulation.carbonFootprint.calculationMethod}</p>}
                                     {(product.batteryRegulation.carbonFootprint.scope1Emissions || product.batteryRegulation.carbonFootprint.scope2Emissions || product.batteryRegulation.carbonFootprint.scope3Emissions) && (
                                        <ul className="list-disc list-inside ml-4 text-xs">
                                            {product.batteryRegulation.carbonFootprint.scope1Emissions && <li>Scope 1: {product.batteryRegulation.carbonFootprint.scope1Emissions} {product.batteryRegulation.carbonFootprint.unit?.replace('/kWh','')}</li>}
                                            {product.batteryRegulation.carbonFootprint.scope2Emissions && <li>Scope 2: {product.batteryRegulation.carbonFootprint.scope2Emissions} {product.batteryRegulation.carbonFootprint.unit?.replace('/kWh','')}</li>}
                                            {product.batteryRegulation.carbonFootprint.scope3Emissions && <li>Scope 3: {product.batteryRegulation.carbonFootprint.scope3Emissions} {product.batteryRegulation.carbonFootprint.unit?.replace('/kWh','')}</li>}
                                        </ul>
                                     )}
                                     {product.batteryRegulation.carbonFootprint.dataSource && <p className="text-xs text-muted-foreground pl-5">Data Source: {product.batteryRegulation.carbonFootprint.dataSource}</p>}
                                </div>
                            )}

                            {product.batteryRegulation.recycledContent && product.batteryRegulation.recycledContent.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-border/30">
                                    <strong className="text-muted-foreground flex items-center"><Recycle className="mr-1.5 h-4 w-4 text-green-600" />Recycled Content:</strong>
                                    <ul className="list-disc list-inside ml-5">
                                        {product.batteryRegulation.recycledContent.map((rc, idx) => (
                                            <li key={idx}>{rc.material}: {rc.percentage ?? 'N/A'}% {rc.source && `(Source: ${rc.source})`}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {product.batteryRegulation.stateOfHealth && (product.batteryRegulation.stateOfHealth.value !== null && product.batteryRegulation.stateOfHealth.value !== undefined) && (
                                <div className="mt-2 pt-2 border-t border-border/30">
                                    <strong className="text-muted-foreground flex items-center"><Heart className="mr-1.5 h-4 w-4 text-red-500" />State of Health:</strong>
                                    <p className="pl-5">Value: {product.batteryRegulation.stateOfHealth.value}{product.batteryRegulation.stateOfHealth.unit || '%'}</p>
                                    {product.batteryRegulation.stateOfHealth.measurementDate && <p className="pl-5">Measured: {new Date(product.batteryRegulation.stateOfHealth.measurementDate).toLocaleDateString()}</p>}
                                    {product.batteryRegulation.stateOfHealth.vcId && <p className="pl-5">VC ID: <span className="font-mono text-xs">{product.batteryRegulation.stateOfHealth.vcId}</span></p>}
                                </div>
                            )}
                             {product.batteryRegulation.vcId && <p className="mt-2 pt-2 border-t border-border/30"><strong className="text-muted-foreground flex items-center"><FileTextIcon className="mr-1.5 h-4 w-4 text-purple-500" />Overall Battery VC ID:</strong> <span className="font-mono text-xs">{product.batteryRegulation.vcId}</span></p>}
                        </CardContent>
                    </Card>
                </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-border">
                 <Card className="border-0 shadow-none">
                    <CardHeader className="px-0 pt-0 pb-4">
                    <CardTitle className="text-xl text-primary flex items-center">
                        <Fingerprint className="mr-2 h-6 w-6" /> Blockchain &amp; Token Details
                    </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm px-0 pb-0">
                    {product.blockchainPlatform && (
                        <p><strong className="text-muted-foreground flex items-center"><Layers3 className="mr-1.5 h-4 w-4 text-teal-600"/>Platform:</strong> {product.blockchainPlatform}</p>
                    )}
                    {product.contractAddress && (
                        <p><strong className="text-muted-foreground flex items-center"><FileCog className="mr-1.5 h-4 w-4 text-teal-600"/>Contract Address:</strong> 
                            <TooltipProvider><Tooltip><TooltipTrigger asChild>
                               <span className="font-mono text-xs break-all ml-1">{product.contractAddress}</span>
                            </TooltipTrigger><TooltipContent><p>{product.contractAddress}</p></TooltipContent></Tooltip></TooltipProvider>
                        </p>
                    )}
                    {product.tokenId && (
                        <p><strong className="text-muted-foreground flex items-center"><Tag className="mr-1.5 h-4 w-4 text-teal-600"/>Token ID:</strong> 
                             <TooltipProvider><Tooltip><TooltipTrigger asChild>
                               <span className="font-mono text-xs break-all ml-1">{product.tokenId}</span>
                             </TooltipTrigger><TooltipContent><p>{product.tokenId}</p></TooltipContent></Tooltip></TooltipProvider>
                        </p>
                    )}
                    {product.anchorTransactionHash && (
                      <div>
                        <strong className="text-muted-foreground flex items-center"><Anchor className="mr-1.5 h-4 w-4 text-teal-600"/>Anchor Tx Hash:</strong> 
                        <TooltipProvider><Tooltip><TooltipTrigger asChild>
                            <span className="font-mono text-xs break-all">{product.anchorTransactionHash}</span>
                        </TooltipTrigger><TooltipContent><p>{product.anchorTransactionHash}</p></TooltipContent></Tooltip></TooltipProvider>
                        <Link href={`https://mock-token-explorer.example.com/tx/${product.anchorTransactionHash}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center text-xs ml-2">
                        View Anchor Tx <ExternalLink className="ml-1 h-3 w-3" />
                        </Link>
                      </div>
                    )}
                     {(product.contractAddress && product.tokenId) && (
                        <Link href={`https://mock-token-explorer.example.com/token/${product.contractAddress}/${product.tokenId}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center text-xs mt-1">
                          View Token on Mock Explorer <ExternalLink className="ml-1 h-3 w-3" />
                        </Link>
                      )}
                    {product.ebsiStatus && (
                        <div className="mt-1.5 pt-1.5 border-t border-border/50">
                            <strong className="text-muted-foreground flex items-center"><LucideIcons.Database className="mr-1.5 h-4 w-4 text-indigo-500"/>EBSI Status:</strong>
                            <div className="flex items-center mt-0.5">{getEbsiStatusBadge(product.ebsiStatus)}</div>
                            {product.ebsiVerificationId && product.ebsiStatus === 'verified' && (
                               <TooltipProvider><Tooltip><TooltipTrigger asChild>
                                <p className="text-xs mt-0.5">ID: <span className="font-mono">{product.ebsiVerificationId}</span></p>
                              </TooltipTrigger><TooltipContent><p>{product.ebsiVerificationId}</p></TooltipContent></Tooltip></TooltipProvider>
                            )}
                        </div>
                    )}
                     {(product.onChainStatus || product.onChainLifecycleStage) && (
                        <div className="mt-1.5 pt-1.5 border-t border-border/50">
                          <h4 className="font-medium text-sm text-muted-foreground mb-1">Conceptual On-Chain State:</h4>
                          {product.onChainStatus && <p><strong className="text-muted-foreground flex items-center"><SigmaSquare className="mr-1.5 h-4 w-4 text-purple-600"/>Status:</strong> <Badge variant={product.onChainStatus === "Active" ? "default" : "outline"} className={`capitalize text-xs ${product.onChainStatus === "Active" ? 'bg-blue-100 text-blue-700 border-blue-300' : product.onChainStatus === "Recalled" ? 'bg-red-100 text-red-700 border-red-300' : 'bg-muted text-muted-foreground'}`}>{product.onChainStatus.replace(/_/g, ' ')}</Badge></p>}
                          {product.onChainLifecycleStage && <p className="mt-1"><strong className="text-muted-foreground flex items-center"><LayersIconShadcn className="mr-1.5 h-4 w-4 text-purple-600"/>Lifecycle Stage:</strong> <Badge variant="outline" className="capitalize text-xs">{product.onChainLifecycleStage.replace(/([A-Z])/g, ' $1').trim()}</Badge></p>}
                        </div>
                    )}
                    {!(product.blockchainPlatform || product.contractAddress || product.tokenId || product.anchorTransactionHash || product.ebsiStatus || product.onChainStatus || product.onChainLifecycleStage) && (
                        <p className="text-muted-foreground">No specific blockchain, EBSI, or on-chain state details available for this product.</p>
                    )}
                    </CardContent>
                </Card>
            </div>

            {(product.authenticationVcId || product.ownershipNftLink) && (
              <div className="mt-8 pt-6 border-t border-border">
                <Card className="border-0 shadow-none">
                  <CardHeader className="px-0 pt-0 pb-4">
                    <CardTitle className="text-xl text-primary flex items-center">
                      <KeyRound className="mr-2 h-6 w-6" /> Authenticity &amp; Ownership
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm px-0 pb-0">
                    {product.authenticationVcId && (
                      <div className="flex flex-col mb-2">
                        <span className="text-xs text-muted-foreground">Authenticity VC ID:</span>
                        <span className="font-mono text-xs break-all text-foreground/90" title={product.authenticationVcId}>
                          {product.authenticationVcId}
                        </span>
                      </div>
                    )}
                    {product.ownershipNftLink && (
                      <div className="pt-2 mt-2 border-t border-border/30">
                        <h4 className="text-sm font-semibold text-foreground mb-1">Ownership NFT Link:</h4>
                        {product.ownershipNftLink.registryUrl && (
                          <p>
                            <Link href={product.ownershipNftLink.registryUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center">
                              View on Registry <ExternalLink className="ml-1 h-3 w-3" />
                            </Link>
                          </p>
                        )}
                        <p>Contract: <span className="font-mono text-xs break-all">{product.ownershipNftLink.contractAddress}</span></p>
                        <p>Token ID: <span className="font-mono">{product.ownershipNftLink.tokenId}</span></p>
                        {product.ownershipNftLink.chainName && <p>Chain: {product.ownershipNftLink.chainName}</p>}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

             <div className="mt-8 pt-6 border-t border-border">
                <CardHeader className="px-0 pt-0 pb-4">
                    <CardTitle className="text-xl text-primary">Compliance Overview</CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  {currentRole === 'verifier' && (
                    <p className="text-sm font-semibold text-info mb-2">Auditor View: Access detailed compliance records and initiate audits via the main dashboard.</p>
                  )}
                   {currentRole === 'manufacturer' && product.ebsiStatus === 'pending' && (
                    <p className="text-sm text-orange-600 mb-2">
                      <strong>Action Required:</strong> EBSI verification for this product is pending. Please review and complete necessary steps through your dashboard.
                    </p>
                  )}
                  <p className="text-foreground">{product.complianceSummary}</p>
                  {product.learnMoreLink && (
                      <Link href={product.learnMoreLink} passHref className="mt-3 inline-block">
                      <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                          Learn More About Our Standards
                      </Button>
                      </Link>
                  )}
                </CardContent>
            </div>
          </div>
        </div>
        <RoleSpecificCard product={product} />
      </main>

      <footer className="py-8 bg-foreground text-background text-center mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} Norruva. All rights reserved.</p>
          <p className="text-sm text-muted-foreground mt-1">Empowering Transparent &amp; Sustainable Commerce.</p>
        </div>
      </footer>
    </div>
  );
}

```
- workspace/src/components/products/detail/DigitalTwinTab.tsx:
```tsx

// --- File: DigitalTwinTab.tsx ---
// Description: Displays conceptual Digital Twin information for a product.
"use client";

import type { SimpleProductDetail } from "@/types/dpp";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Cpu, Link as LinkIcon, AlertTriangle, Activity, Settings2 } from "lucide-react";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea
import { Label } from "@/components/ui/label"; // Import Label

interface DigitalTwinTabProps {
  product: SimpleProductDetail;
}

export default function DigitalTwinTab({ product }: DigitalTwinTabProps) {
  const digitalTwinData = product.productDetails?.digitalTwin;

  if (!digitalTwinData || 
      (!digitalTwinData.uri && 
       !digitalTwinData.sensorDataEndpoint &&
       !digitalTwinData.realTimeStatus &&
       !digitalTwinData.predictiveMaintenanceAlerts)) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Cpu className="mr-2 h-5 w-5 text-primary" /> Digital Twin Information (Conceptual)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No Digital Twin information provided for this product.</p>
           <p className="text-xs text-muted-foreground mt-2">This feature is conceptual and for demonstration purposes.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <Cpu className="mr-2 h-5 w-5 text-primary" /> Digital Twin Information (Conceptual)
        </CardTitle>
        <CardDescription>
          Conceptual details related to the product's Digital Twin. Actual integration would involve live data feeds.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {digitalTwinData.uri && (
          <div>
            <Label className="text-sm font-medium text-muted-foreground flex items-center mb-1">
              <LinkIcon className="mr-1.5 h-4 w-4" /> Digital Twin URI
            </Label>
            <Link href={digitalTwinData.uri} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all text-sm block p-2 bg-muted/30 rounded-md">
              {digitalTwinData.uri}
            </Link>
          </div>
        )}

        {digitalTwinData.sensorDataEndpoint && (
          <div>
            <Label className="text-sm font-medium text-muted-foreground flex items-center mb-1">
              <Settings2 className="mr-1.5 h-4 w-4" /> Sensor Data Endpoint
            </Label>
            <Link href={digitalTwinData.sensorDataEndpoint} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all text-sm block p-2 bg-muted/30 rounded-md">
              {digitalTwinData.sensorDataEndpoint}
            </Link>
          </div>
        )}

        {digitalTwinData.realTimeStatus && (
          <div>
            <Label className="text-sm font-medium text-muted-foreground flex items-center mb-1">
              <Activity className="mr-1.5 h-4 w-4" /> Real-Time Status Description
            </Label>
            <Textarea 
              value={digitalTwinData.realTimeStatus} 
              readOnly 
              className="text-sm text-foreground/90 bg-muted/30 rounded-md whitespace-pre-line min-h-[60px]"
              rows={Math.max(2, digitalTwinData.realTimeStatus.split('\n').length)}
            />
          </div>
        )}

        {digitalTwinData.predictiveMaintenanceAlerts && (
          <div>
            <Label className="text-sm font-medium text-muted-foreground flex items-center mb-1">
              <AlertTriangle className="mr-1.5 h-4 w-4 text-orange-500" /> Predictive Maintenance Alerts
            </Label>
            <Textarea 
              value={digitalTwinData.predictiveMaintenanceAlerts} 
              readOnly 
              className="text-sm text-foreground/90 bg-orange-500/10 border-orange-500/30 rounded-md whitespace-pre-line min-h-[80px]"
              rows={Math.max(3, digitalTwinData.predictiveMaintenanceAlerts.split('\n').length)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

```
- workspace/src/components/products/form/DigitalTwinFormSection.tsx:
```tsx

// --- File: DigitalTwinFormSection.tsx ---
// Description: Form section component for conceptual Digital Twin information.
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
import { Textarea } from "@/components/ui/textarea";
import type { ProductFormData } from "@/types/productFormTypes";
import { AiIndicator } from "@/components/products/form";
import type { InitialProductFormData } from "@/app/(app)/products/new/page";

interface DigitalTwinFormSectionProps {
  form: UseFormReturn<ProductFormData>;
  initialData?: Partial<InitialProductFormData>; // For AI origin tracking
}

export default function DigitalTwinFormSection({
  form,
  initialData,
}: DigitalTwinFormSectionProps) {
  return (
    <div className="space-y-6 pt-4">
      <FormDescription>
        Provide conceptual information about any associated Digital Twin for this product.
        This section is for illustrative purposes as actual Digital Twin integration is not yet implemented.
      </FormDescription>

      <FormField
        control={form.control}
        name="productDetails.digitalTwin.uri"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Digital Twin URI (Conceptual)
              <AiIndicator fieldOrigin={initialData?.productDetailsOrigin?.digitalTwinOrigin?.uriOrigin} fieldName="Digital Twin URI" />
            </FormLabel>
            <FormControl>
              <Input 
                type="url" 
                placeholder="https://example.com/digital-twin/product-xyz" 
                {...field} 
                value={field.value || ""}
                onChange={(e) => { field.onChange(e); form.setValue("productDetailsOrigin.digitalTwinOrigin.uriOrigin" as any, "manual"); }}
              />
            </FormControl>
            <FormDescription>A URL pointing to the Digital Twin platform or specific instance.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="productDetails.digitalTwin.sensorDataEndpoint"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Sensor Data Endpoint (Conceptual)
              <AiIndicator fieldOrigin={initialData?.productDetailsOrigin?.digitalTwinOrigin?.sensorDataEndpointOrigin} fieldName="Sensor Data Endpoint" />
            </FormLabel>
            <FormControl>
              <Input 
                type="url" 
                placeholder="https://api.example.com/digital-twin/product-xyz/sensors" 
                {...field} 
                value={field.value || ""}
                onChange={(e) => { field.onChange(e); form.setValue("productDetailsOrigin.digitalTwinOrigin.sensorDataEndpointOrigin" as any, "manual"); }}
              />
            </FormControl>
            <FormDescription>An API endpoint to fetch live or recent sensor data from the twin.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="productDetails.digitalTwin.realTimeStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Real-Time Status Description (Conceptual)
              <AiIndicator fieldOrigin={initialData?.productDetailsOrigin?.digitalTwinOrigin?.realTimeStatusOrigin} fieldName="Real-Time Status" />
            </FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe the current operational status as reported by the twin, e.g., 'Operational - Optimal performance', 'Warning - Filter Clogged', 'Offline - Scheduled Maintenance'."
                className="min-h-[80px]"
                {...field} 
                value={field.value || ""}
                onChange={(e) => { field.onChange(e); form.setValue("productDetailsOrigin.digitalTwinOrigin.realTimeStatusOrigin" as any, "manual"); }}
              />
            </FormControl>
            <FormDescription>A textual summary of the twin's current status.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="productDetails.digitalTwin.predictiveMaintenanceAlerts"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Predictive Maintenance Alerts (Conceptual)
              <AiIndicator fieldOrigin={initialData?.productDetailsOrigin?.digitalTwinOrigin?.predictiveMaintenanceAlertsOrigin} fieldName="Maintenance Alerts" />
            </FormLabel>
            <FormControl>
              <Textarea 
                placeholder="List current predictive maintenance alerts, one per line. E.g., '- Bearing A wear approaching limit (Est. failure in 500hrs)\n- Coolant level low (20%)'"
                className="min-h-[100px]"
                {...field} 
                value={field.value || ""}
                onChange={(e) => { field.onChange(e); form.setValue("productDetailsOrigin.digitalTwinOrigin.predictiveMaintenanceAlertsOrigin" as any, "manual"); }}
              />
            </FormControl>
            <FormDescription>Current alerts or warnings from the Digital Twin regarding upcoming maintenance.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

```
- workspace/src/app/(app)/developer/docs/digital-twin-guide/page.tsx:
```tsx

// --- File: src/app/(app)/developer/docs/digital-twin-guide/page.tsx ---
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { Cpu, Info, FileText, Layers3, Settings2, Activity } from "lucide-react";
import DocsPageLayout from '@/components/developer/DocsPageLayout';

export default function DigitalTwinGuidePage() {
  return (
    <DocsPageLayout
      pageTitle="Digital Twin Guide (Conceptual)"
      pageIcon="Cpu"
      backLink="/developer/docs"
      backLinkText="Back to Docs Hub"
      alertTitle="Conceptual Framework & Future Vision"
      alertDescription="This page provides an overview of how Digital Twins can conceptually integrate with Digital Product Passports on the Norruva platform. The platform currently supports storing basic Digital Twin metadata."
    >
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Info className="mr-2 h-5 w-5 text-primary"/>What is a Digital Twin?</CardTitle>
          <CardDescription>
            A Digital Twin is a dynamic, virtual representation of a physical product, system, or process. It's updated with real-time data from its physical counterpart, enabling advanced monitoring, analysis, and simulation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            In the context of DPPs, Digital Twins can significantly enhance the value and utility of product passports by providing live insights into a product's condition, performance, and operational history.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Layers3 className="mr-2 h-5 w-5 text-primary"/>Conceptual Integration with Norruva DPPs</CardTitle>
          <CardDescription>
            The Norruva platform allows you to conceptually link a Digital Twin to a product's DPP.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h4 className="font-semibold text-md mb-1">DPP Data Points:</h4>
            <p className="text-sm text-muted-foreground">
              The product form includes a "Digital Twin (Conceptual)" section where you can store:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm pl-4 mt-1">
              <li><strong>Digital Twin URI:</strong> A link to the primary interface or data source of the Digital Twin.</li>
              <li><strong>Sensor Data Endpoint:</strong> A conceptual API endpoint for fetching sensor data.</li>
              <li><strong>Real-Time Status Description:</strong> A textual summary of the twin's current state.</li>
              <li><strong>Predictive Maintenance Alerts:</strong> A list of current maintenance advisories from the twin.</li>
            </ul>
          </section>
           <section className="mt-3">
            <h4 className="font-semibold text-md mb-1">API & Display:</h4>
            <p className="text-sm text-muted-foreground">
              This information is part of the <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">productDetails.digitalTwin</code> object in the DPP data model retrieved via API. It's also displayed in a dedicated "Digital Twin" tab on the product detail page.
            </p>
          </section>
          <p className="text-xs text-muted-foreground pt-2 border-t">
            Note: Currently, these fields are for informational and conceptual purposes. The platform does not yet perform live data ingestion or interaction with external Digital Twin systems.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><FileText className="mr-2 h-5 w-5 text-primary"/>Detailed Concepts & Use Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            For a more in-depth discussion on the potential benefits, use cases (like predictive maintenance, lifecycle simulation), and architectural considerations for Digital Twins in DPPs, please refer to the:
          </p>
          <p className="mt-2 font-medium">
            <code className="bg-muted px-1 py-0.5 rounded-sm">docs/digital-twin-concepts.md</code>
          </p>
          <p className="text-xs text-muted-foreground">(This markdown file is located in the project's root <code className="bg-muted px-1 py-0.5 rounded-sm">/docs</code> directory.)</p>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Settings2 className="mr-2 h-5 w-5 text-primary"/>Future Vision</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Future development may include direct integrations with IoT platforms, standardized Digital Twin data exchange protocols, and AI-driven analytics based on live twin data to further enrich DPPs and enable advanced circular economy and product-as-a-service models.
          </p>
        </CardContent>
      </Card>
    </DocsPageLayout>
  );
}

```
- workspace/src/app/(app)/developer/docs/page.tsx:
```tsx

// --- File: page.tsx (Developer Documentation Hub) ---
"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    ArrowLeft,
    BookOpen, 
    BookText, 
    KeyRound, 
    Webhook, 
    Clock, 
    AlertTriangle as ErrorIcon, 
    FileJson, 
    Rocket, 
    Share2, 
    Scale, 
    Layers as LayersIcon, 
    Users, 
    ShieldCheck, 
    TestTube2,
    QrCode,
    Server as ServerIconShadcn,
    VenetianMask,
    History,
    Layers3, 
    Zap,
    Globe,
    Zap as ZapIconLucide,
    Cpu // Added Cpu for Digital Twin
} from "lucide-react";

export default function DeveloperDocumentationHubPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <BookOpen className="mr-3 h-7 w-7 text-primary" />
          Developer Documentation Hub
        </h1>
        <Button variant="outline" asChild>
          <Link href="/developer">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Developer Portal
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <BookText className="mr-3 h-6 w-6 text-primary" /> API Documentation & Guides
          </CardTitle>
          <CardDescription>
            Your central resource for detailed documentation, integration guides, and best practices for leveraging the Norruva DPP APIs.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
          <div className="space-y-3">
            <h4 className="font-semibold text-md mb-1 flex items-center">
              <BookText className="mr-2 h-5 w-5 text-accent" />Core Documentation
            </h4>
            <ul className="list-none space-y-1.5 text-sm">
              <li><Link href="/developer/docs/api-reference" className="text-primary hover:underline flex items-center"><BookText className="mr-2 h-4 w-4" />API Reference <span className="text-xs text-muted-foreground ml-1"> (Endpoints, Schemas)</span></Link></li>
              <li><Link href="/developer/docs/authentication" className="text-primary hover:underline flex items-center"><KeyRound className="mr-2 h-4 w-4" />Authentication <span className="text-xs text-muted-foreground ml-1"> (API Keys, OAuth2 Concept)</span></Link></li>
              <li><Link href="/developer/docs/webhooks-guide" className="text-primary hover:underline flex items-center"><Webhook className="mr-2 h-4 w-4" />Webhooks Guide</Link></li>
              <li><Link href="/developer/docs/rate-limiting" className="text-primary hover:underline flex items-center"><Clock className="mr-2 h-4 w-4" />Rate Limiting &amp; Usage</Link></li>
              <li><Link href="/developer/docs/error-codes" className="text-primary hover:underline flex items-center"><ErrorIcon className="mr-2 h-4 w-4" />Error Codes &amp; Handling</Link></li>
              <li><Link href="/developer/docs/api-changelog" className="text-primary hover:underline flex items-center"><History className="mr-2 h-4 w-4" />API Changelog</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-md mb-1 flex items-center">
              <Rocket className="mr-2 h-5 w-5 text-accent" />Integration Guides &amp; Best Practices
            </h4>
            <ul className="list-none space-y-1.5 text-sm">
              <li><Link href="/developer/guides/quick-start" className="text-primary hover:underline flex items-center"><Rocket className="mr-2 h-4 w-4" />Quick Start Integration Guide</Link></li>
              <li><Link href="/developer/guides/manufacturer-onboarding" className="text-primary hover:underline flex items-center"><Users className="mr-2 h-4 w-4" />Manufacturer Onboarding</Link></li>
              <li><Link href="/developer/docs/ebsi-integration" className="text-primary hover:underline flex items-center"><Share2 className="mr-2 h-4 w-4" />EBSI Integration Overview</Link></li>
              <li><Link href="/developer/docs/public-layer-ebsi" className="text-primary hover:underline flex items-center"><Share2 className="mr-2 h-4 w-4" />Public Layer & EBSI Alignment</Link></li>
              <li><Link href="/developer/docs/private-layer-architecture" className="text-primary hover:underline flex items-center"><Layers3 className="mr-2 h-4 w-4" />Private Layer Architecture</Link></li>
              <li><Link href="/developer/docs/zkp-layer-concepts" className="text-primary hover:underline flex items-center"><Zap className="mr-2 h-4 w-4" />ZKP Layer Concepts</Link></li> 
              <li><Link href="/developer/docs/regulatory-alignment" className="text-primary hover:underline flex items-center"><Scale className="mr-2 h-4 w-4" />Regulatory Alignment (ESPR, EPREL)</Link></li>
              <li><Link href="/developer/docs/cbam-concepts" className="text-primary hover:underline flex items-center"><Globe className="mr-2 h-4 w-4" />CBAM Concepts Guide</Link></li> 
              <li><Link href="/developer/docs/smart-contract-interactions" className="text-primary hover:underline flex items-center"><ZapIconLucide className="mr-2 h-4 w-4" />Smart Contract Interactions</Link></li>
              <li><Link href="/developer/docs/digital-twin-guide" className="text-primary hover:underline flex items-center"><Cpu className="mr-2 h-4 w-4" />Digital Twin Guide (Conceptual)</Link></li>
              <li><Link href="/developer/docs/data-management-best-practices" className="text-primary hover:underline flex items-center"><LayersIcon className="mr-2 h-4 w-4" />Data Management Best Practices</Link></li>
              <li><Link href="/developer/docs/qr-code-embedding" className="text-primary hover:underline flex items-center"><QrCode className="mr-2 h-4 w-4" />QR Code Generation &amp; Embedding</Link></li>
              <li><Link href="/developer/guides/auditor-integration" className="text-primary hover:underline flex items-center"><ShieldCheck className="mr-2 h-4 w-4" />Auditor Integration</Link></li>
            </ul>
          </div>
          <div className="space-y-6"> 
            <div className="space-y-3">
              <h4 className="font-semibold text-md mb-1 flex items-center">
                <TestTube2 className="mr-2 h-5 w-5 text-accent" />Testing &amp; Validation
              </h4>
              <ul className="list-none space-y-1.5 text-sm">
                <li><Link href="/developer/docs/testing-validation" className="text-primary hover:underline flex items-center"><TestTube2 className="mr-2 h-4 w-4" />Testing &amp; Validation Guide</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-md mb-1 flex items-center">
                <ServerIconShadcn className="mr-2 h-5 w-5 text-accent" />Operations
              </h4>
              <ul className="list-none space-y-1.5 text-sm">
                <li><Link href="/developer/docs/deployment-monitoring" className="text-primary hover:underline flex items-center"><ServerIconShadcn className="mr-2 h-4 w-4" />Deployment &amp; Monitoring Guide</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-md mb-1 flex items-center">
                <VenetianMask className="mr-2 h-5 w-5 text-accent" />Security &amp; Privacy
              </h4>
              <ul className="list-none space-y-1.5 text-sm">
                <li><Link href="/developer/docs/data-privacy" className="text-primary hover:underline flex items-center"><VenetianMask className="mr-2 h-4 w-4" />Data Privacy &amp; GDPR Guide</Link></li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    
```
- workspace/src/components/products/form/index.ts:
```ts

// src/components/products/form/index.ts
export { default as AiIndicator } from './AiIndicator';
export { default as AiSuggestionDisplay } from './AiSuggestionDisplay';
export { default as BasicInfoFormSection } from './BasicInfoFormSection';
export { default as BatteryDetailsFormSection } from './BatteryDetailsFormSection';
export { default as ConstructionProductInformationFormSection } from './ConstructionProductInformationFormSection';
export { default as CustomAttributesFormSection } from './CustomAttributesFormSection';
export { default as EthicalSourcingFormSection } from './EthicalSourcingFormSection';
export { default as EuCustomsDataFormSection } from './EuCustomsDataFormSection';
export { default as ProductImageFormSection } from './ProductImageFormSection';
export { default as ScipNotificationFormSection } from './ScipNotificationFormSection';
export { default as SustainabilityComplianceFormSection } from './SustainabilityComplianceFormSection';
export { default as TechnicalSpecificationsFormSection } from './TechnicalSpecificationsFormSection';
export { default as TextileInformationFormSection } from './TextileInformationFormSection';
export { default as EsprSpecificsFormSection } from './EsprSpecificsFormSection';
export { default as CarbonFootprintFormSection } from './CarbonFootprintFormSection';
export { default as DigitalTwinFormSection } from './DigitalTwinFormSection';
