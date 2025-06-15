
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { ProductFormData } from "@/types/productFormTypes";
import { extractProductData } from "@/ai/flows/extract-product-data";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, CheckCircle2, Info, Edit, Compass, Wand2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProductSupplyChainLink, SimpleLifecycleEvent, ProductComplianceSummary, CustomAttribute, BatteryRegulationDetails, ScipNotificationDetails, EuCustomsDataDetails, TextileInformation, ConstructionProductInformation, CarbonFootprintData, StateOfHealthData, RecycledContentData, EsprSpecifics } from '@/types/dpp'; // Added EsprSpecifics
import { USER_PRODUCTS_LOCAL_STORAGE_KEY } from '@/types/dpp';
import { fileToDataUri } from '@/utils/fileUtils';
import AiExtractionSection from "@/components/products/new/AiExtractionSection";
import ProductDetailsSection from "@/components/products/new/ProductDetailsSection";

type AiOrigin = 'AI_EXTRACTED' | 'manual' | undefined;

interface ProductDetailsOrigin { // New interface for origin tracking of productDetails sub-objects
  descriptionOrigin?: AiOrigin;
  materialsOrigin?: AiOrigin;
  sustainabilityClaimsOrigin?: AiOrigin;
  keyCompliancePointsOrigin?: AiOrigin;
  specificationsOrigin?: AiOrigin;
  energyLabelOrigin?: AiOrigin;
  imageUrlOrigin?: AiOrigin;
  esprSpecificsOrigin?: {
    durabilityInformationOrigin?: AiOrigin;
    repairabilityInformationOrigin?: AiOrigin;
    recycledContentSummaryOrigin?: AiOrigin;
    energyEfficiencySummaryOrigin?: AiOrigin;
    substanceOfConcernSummaryOrigin?: AiOrigin;
  };
}


interface BatteryRegulationOrigin {
  batteryChemistryOrigin?: AiOrigin;
  batteryPassportIdOrigin?: AiOrigin;
  manufacturerNameOrigin?: AiOrigin;
  manufacturingDateOrigin?: AiOrigin;
  ratedCapacityAhOrigin?: AiOrigin;
  nominalVoltageOrigin?: AiOrigin;
  expectedLifetimeCyclesOrigin?: AiOrigin;
  recyclingEfficiencyRateOrigin?: AiOrigin;
  dismantlingInformationUrlOrigin?: AiOrigin;
  safetyInformationUrlOrigin?: AiOrigin;
  carbonFootprintOrigin?: {
    valueOrigin?: AiOrigin;
    unitOrigin?: AiOrigin;
    calculationMethodOrigin?: AiOrigin;
    scope1EmissionsOrigin?: AiOrigin;
    scope2EmissionsOrigin?: AiOrigin;
    scope3EmissionsOrigin?: AiOrigin;
    dataSourceOrigin?: AiOrigin;
    vcIdOrigin?: AiOrigin;
  };
  recycledContentOrigin?: Array<{
    materialOrigin?: AiOrigin;
    percentageOrigin?: AiOrigin;
    sourceOrigin?: AiOrigin;
    vcIdOrigin?: AiOrigin;
  }>;
  stateOfHealthOrigin?: {
    valueOrigin?: AiOrigin;
    unitOrigin?: AiOrigin;
    measurementDateOrigin?: AiOrigin;
    measurementMethodOrigin?: AiOrigin;
    vcIdOrigin?: AiOrigin;
  };
  materialRecoveryRatesOrigin?: {
    cobaltOrigin?: AiOrigin;
    leadOrigin?: AiOrigin;
    lithiumOrigin?: AiOrigin;
    nickelOrigin?: AiOrigin;
  };
  vcIdOrigin?: AiOrigin;
}

export interface InitialProductFormData extends Omit<ProductFormData, 'batteryRegulation' | 'compliance' | 'productDetails'> {
  productNameOrigin?: AiOrigin;
  manufacturerOrigin?: AiOrigin;
  modelNumberOrigin?: AiOrigin;
  productDetails?: Partial<ProductFormData['productDetails']>; // Keep this for structure
  productDetailsOrigin?: ProductDetailsOrigin; // For origin tracking of productDetails fields
  batteryRegulation?: Partial<BatteryRegulationDetails>; 
  batteryRegulationOrigin?: BatteryRegulationOrigin;
  compliance?: { 
    eprel?: Partial<ProductFormData['compliance']['eprel']>;
    esprConformity?: Partial<ProductFormData['compliance']['esprConformity']>;
    scipNotification?: Partial<ScipNotificationDetails>;
    euCustomsData?: Partial<EuCustomsDataDetails & { cbamGoodsIdentifier?: string }>;
    battery_regulation?: Partial<BatteryRegulationDetails>; 
  };
  textileInformation?: Partial<TextileInformation>; 
  constructionProductInformation?: Partial<ConstructionProductInformation>; 
  onChainStatus?: string; 
  onChainLifecycleStage?: string; 
  conflictMineralsReportUrl?: string; 
  fairTradeCertificationId?: string; 
  ethicalSourcingPolicyUrl?: string; 
}


export interface StoredUserProduct extends Omit<ProductFormData, 'batteryRegulation' | 'compliance' | 'productDetails'> {
  id: string;
  status: string; 
  compliance: string; 
  lastUpdated: string;
  productCategory?: string;
  keySustainabilityPoints?: string[]; 
  supplyChainLinks?: ProductSupplyChainLink[];
  lifecycleEvents?: SimpleLifecycleEvent[];
  complianceSummary?: ProductComplianceSummary; 
  
  productDetails?: Partial<ProductFormData['productDetails']>; // Includes esprSpecifics
  complianceData?: { 
    eprel?: Partial<ProductFormData['compliance']['eprel']>;
    esprConformity?: Partial<ProductFormData['compliance']['esprConformity']>;
    scipNotification?: Partial<ScipNotificationDetails>;
    euCustomsData?: Partial<EuCustomsDataDetails & { cbamGoodsIdentifier?: string }>;
    battery_regulation?: Partial<ProductFormData['compliance']['battery_regulation']>;
  };
  batteryRegulation?: Partial<BatteryRegulationDetails>; 
  textileInformation?: Partial<TextileInformation>; 
  constructionProductInformation?: Partial<ConstructionProductInformation>; 
  metadata?: Partial<InitialProductFormData>; // Re-using this for metadata structure if needed
  authenticationVcId?: string; 
  ownershipNftLink?: { registryUrl?: string; contractAddress: string; tokenId: string; chainName?: string; }; 
  blockchainIdentifiers?: InitialProductFormData['blockchainIdentifiers']; 
  conflictMineralsReportUrl?: string; 
  fairTradeCertificationId?: string; 
  ethicalSourcingPolicyUrl?: string; 
  productNameOrigin?: AiOrigin;
  productDetailsOrigin?: ProductDetailsOrigin; // For AI origin tracking
  manufacturerOrigin?: AiOrigin;
  modelNumberOrigin?: AiOrigin;
  batteryRegulationOrigin?: BatteryRegulationOrigin;
}

const defaultBatteryRegulationState: BatteryRegulationDetails = {
  status: "not_applicable", batteryChemistry: "", batteryPassportId: "",
  ratedCapacityAh: null, nominalVoltage: null, expectedLifetimeCycles: null, manufacturingDate: "",
  manufacturerName: "",
  carbonFootprint: { value: null, unit: "", calculationMethod: "", scope1Emissions: null, scope2Emissions: null, scope3Emissions: null, dataSource: "", vcId: "" },
  recycledContent: [],
  stateOfHealth: { value: null, unit: "", measurementDate: "", measurementMethod: "", vcId: "" },
  recyclingEfficiencyRate: null,
  materialRecoveryRates: { cobalt: null, lead: null, lithium: null, nickel: null },
  dismantlingInformationUrl: "", safetyInformationUrl: "",
  vcId: "",
};

const defaultBatteryRegulationOriginState: BatteryRegulationOrigin = {
  batteryChemistryOrigin: undefined, batteryPassportIdOrigin: undefined, manufacturerNameOrigin: undefined, manufacturingDateOrigin: undefined,
  ratedCapacityAhOrigin: undefined, nominalVoltageOrigin: undefined, expectedLifetimeCyclesOrigin: undefined, recyclingEfficiencyRateOrigin: undefined,
  dismantlingInformationUrlOrigin: undefined, safetyInformationUrlOrigin: undefined,
  carbonFootprintOrigin: { valueOrigin: undefined, unitOrigin: undefined, calculationMethodOrigin: undefined, scope1EmissionsOrigin: undefined, scope2EmissionsOrigin: undefined, scope3EmissionsOrigin: undefined, dataSourceOrigin: undefined, vcIdOrigin: undefined, },
  recycledContentOrigin: [],
  stateOfHealthOrigin: { valueOrigin: undefined, unitOrigin: undefined, measurementDateOrigin: undefined, measurementMethodOrigin: undefined, vcIdOrigin: undefined, },
  materialRecoveryRatesOrigin: { cobaltOrigin: undefined, leadOrigin: undefined, lithiumOrigin: undefined, nickelOrigin: undefined },
  vcIdOrigin: undefined,
};

const defaultScipNotificationState: Partial<ScipNotificationDetails> = {
  status: "N/A", notificationId: "", svhcListVersion: "", submittingLegalEntity: "",
  articleName: "", primaryArticleId: "", safeUseInstructionsLink: ""
};

const defaultEuCustomsDataState: Partial<EuCustomsDataDetails> = {
  status: "N/A", declarationId: "", hsCode: "", countryOfOrigin: "",
  netWeightKg: null, grossWeightKg: null,
  customsValuation: { value: null, currency: "" },
  cbamGoodsIdentifier: "",
};

const defaultTextileInformationState: Partial<TextileInformation> = {
  fiberComposition: [],
  countryOfOriginLabeling: "",
  careInstructionsUrl: "",
  isSecondHand: false,
};

const defaultConstructionProductInformationState: Partial<ConstructionProductInformation> = {
  declarationOfPerformanceId: "",
  ceMarkingDetailsUrl: "",
  intendedUseDescription: "",
  essentialCharacteristics: [],
};

const defaultEsprSpecificsState: EsprSpecifics = {
  durabilityInformation: "",
  repairabilityInformation: "",
  recycledContentSummary: "",
  energyEfficiencySummary: "",
  substanceOfConcernSummary: "",
};

const defaultProductDetailsOriginState: ProductDetailsOrigin = {
  descriptionOrigin: undefined,
  materialsOrigin: undefined,
  sustainabilityClaimsOrigin: undefined,
  keyCompliancePointsOrigin: undefined,
  specificationsOrigin: undefined,
  energyLabelOrigin: undefined,
  imageUrlOrigin: undefined,
  esprSpecificsOrigin: {
    durabilityInformationOrigin: undefined,
    repairabilityInformationOrigin: undefined,
    recycledContentSummaryOrigin: undefined,
    energyEfficiencySummaryOrigin: undefined,
    substanceOfConcernSummaryOrigin: undefined,
  }
};


export default function AddNewProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editProductId = searchParams.get('edit');
  const isEditMode = !!editProductId;

  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>("invoice");
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(isEditMode ? "manual" : "ai-extraction");
  const [aiExtractionAppliedSuccessfully, setAiExtractionAppliedSuccessfully] = useState(false);

  const defaultFormState: InitialProductFormData = {
    productName: "", gtin: "", sku: "", nfcTagId: "", rfidTagId: "", manufacturer: "", modelNumber: "",
    productCategory: "",
    productDetails: {
        description: "",
        materials: "",
        sustainabilityClaims: "",
        keyCompliancePoints: "",
        specifications: "",
        energyLabel: "",
        imageUrl: "",
        imageHint: "",
        customAttributesJsonString: "",
        esprSpecifics: { ...defaultEsprSpecificsState },
    },
    onChainStatus: "Unknown", 
    onChainLifecycleStage: "Unknown", 
    conflictMineralsReportUrl: "", 
    fairTradeCertificationId: "", 
    ethicalSourcingPolicyUrl: "", 
    batteryRegulation: { ...defaultBatteryRegulationState },
    productNameOrigin: undefined, 
    manufacturerOrigin: undefined,
    modelNumberOrigin: undefined,
    productDetailsOrigin: { ...defaultProductDetailsOriginState },
    batteryRegulationOrigin: { ...defaultBatteryRegulationOriginState },
    compliance: {
      eprel: { status: "N/A", id: "", url: ""},
      esprConformity: { status: "pending_assessment" },
      scipNotification: { ...defaultScipNotificationState },
      euCustomsData: { ...defaultEuCustomsDataState },
      battery_regulation: { ...defaultBatteryRegulationState },
    },
    textileInformation: { ...defaultTextileInformationState }, 
    constructionProductInformation: { ...defaultConstructionProductInformationState }, 
  };

  const [currentProductDataForForm, setCurrentProductDataForForm] = useState<InitialProductFormData>(defaultFormState);

  useEffect(() => {
    if (isEditMode && editProductId) {
      const storedProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
      const userProducts: StoredUserProduct[] = storedProductsString ? JSON.parse(storedProductsString) : [];
      const productToEdit = userProducts.find(p => p.id === editProductId);
      if (productToEdit) {
        const editData: InitialProductFormData = {
          productName: productToEdit.productName || "",
          gtin: productToEdit.gtin || "",
          manufacturer: productToEdit.manufacturer || "",
          modelNumber: productToEdit.modelNumber || "",
          sku: productToEdit.sku || "",
          nfcTagId: productToEdit.nfcTagId || "",
          rfidTagId: productToEdit.rfidTagId || "",
          productCategory: productToEdit.productCategory || "",
          onChainStatus: productToEdit.metadata?.onChainStatus || "Unknown",
          onChainLifecycleStage: productToEdit.metadata?.onChainLifecycleStage || "Unknown",
          conflictMineralsReportUrl: productToEdit.conflictMineralsReportUrl || "",
          fairTradeCertificationId: productToEdit.fairTradeCertificationId || "",
          ethicalSourcingPolicyUrl: productToEdit.ethicalSourcingPolicyUrl || "",
          productDetails: {
            description: productToEdit.productDescription || "",
            materials: productToEdit.materials || "",
            sustainabilityClaims: productToEdit.sustainabilityClaims || "",
            keyCompliancePoints: productToEdit.keyCompliancePoints || "",
            specifications: productToEdit.specifications || "",
            energyLabel: productToEdit.energyLabel || "",
            imageUrl: productToEdit.imageUrl || "",
            imageHint: productToEdit.imageHint || "",
            customAttributesJsonString: productToEdit.customAttributesJsonString || "",
            esprSpecifics: { 
                ...defaultEsprSpecificsState, 
                ...(productToEdit.productDetails?.esprSpecifics || {}) 
            },
          },
          batteryRegulation: {
            ...defaultBatteryRegulationState,
            ...(productToEdit.batteryRegulation || {}),
            carbonFootprint: {
              ...defaultBatteryRegulationState.carbonFootprint,
              ...(productToEdit.batteryRegulation?.carbonFootprint || {}),
            },
            stateOfHealth: {
              ...defaultBatteryRegulationState.stateOfHealth,
              ...(productToEdit.batteryRegulation?.stateOfHealth || {}),
            },
            recycledContent: Array.isArray(productToEdit.batteryRegulation?.recycledContent)
              ? productToEdit.batteryRegulation.recycledContent
              : [],
          },
          compliance: {
            eprel: { ...(defaultFormState.compliance?.eprel || {}), ...(productToEdit.complianceData?.eprel || {}) },
            esprConformity: { ...(defaultFormState.compliance?.esprConformity || {}), ...(productToEdit.complianceData?.esprConformity || {}) },
            scipNotification: { ...defaultScipNotificationState, ...(productToEdit.complianceData?.scipNotification || {}) },
            euCustomsData: { ...defaultEuCustomsDataState, ...(productToEdit.complianceData?.euCustomsData || {}),
              customsValuation: {
                ...(defaultEuCustomsDataState.customsValuation || {}),
                ...(productToEdit.complianceData?.euCustomsData?.customsValuation || {})
              }
            },
            battery_regulation: { 
                ...defaultBatteryRegulationState,
                ...(productToEdit.complianceData?.battery_regulation || productToEdit.batteryRegulation || {}), 
                 carbonFootprint: {
                    ...defaultBatteryRegulationState.carbonFootprint,
                    ...((productToEdit.complianceData?.battery_regulation || productToEdit.batteryRegulation)?.carbonFootprint || {}),
                },
                stateOfHealth: {
                    ...defaultBatteryRegulationState.stateOfHealth,
                    ...((productToEdit.complianceData?.battery_regulation || productToEdit.batteryRegulation)?.stateOfHealth || {}),
                },
                 recycledContent: Array.isArray((productToEdit.complianceData?.battery_regulation || productToEdit.batteryRegulation)?.recycledContent)
                    ? (productToEdit.complianceData?.battery_regulation || productToEdit.batteryRegulation)!.recycledContent
                    : [],
            }
          },
          textileInformation: { ...defaultTextileInformationState, ...(productToEdit.textileInformation || {}) }, 
          constructionProductInformation: { ...defaultConstructionProductInformationState, ...(productToEdit.constructionProductInformation || {}) }, 
          productNameOrigin: productToEdit.productNameOrigin || undefined,
          manufacturerOrigin: productToEdit.manufacturerOrigin || undefined,
          modelNumberOrigin: productToEdit.modelNumberOrigin || undefined,
          productDetailsOrigin: productToEdit.productDetailsOrigin || { ...defaultProductDetailsOriginState },
          batteryRegulationOrigin: productToEdit.batteryRegulationOrigin || { ...defaultBatteryRegulationOriginState },
        };
        setCurrentProductDataForForm(editData);
        setActiveTab("manual");
        setAiExtractionAppliedSuccessfully(false);
      } else {
        toast({ title: "Error", description: "Product not found for editing.", variant: "destructive" });
        router.push("/products/new");
      }
    } else {
      setAiExtractionAppliedSuccessfully(false);
      setCurrentProductDataForForm(defaultFormState);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, editProductId, router, toast]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setCurrentProductDataForForm(prev => ({
        ...defaultFormState, 
        gtin: prev.gtin,
        productCategory: prev.productCategory,
        compliance: { ...defaultFormState.compliance }, 
        textileInformation: { ...defaultTextileInformationState }, 
        constructionProductInformation: { ...defaultConstructionProductInformationState }, 
      }));
      setError(null);
      setAiExtractionAppliedSuccessfully(false);
    }
  };

  const handleExtractData = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    setIsLoadingAi(true);
    setError(null);
    setAiExtractionAppliedSuccessfully(false);

    try {
      const documentDataUri = await fileToDataUri(file);
      const result = await extractProductData({ documentDataUri, documentType });

      const aiInitialFormData: Partial<InitialProductFormData> = {
        productDetails: { esprSpecifics: { ...defaultEsprSpecificsState } },
        batteryRegulation: { ...defaultBatteryRegulationState },
        batteryRegulationOrigin: { ...defaultBatteryRegulationOriginState },
        productDetailsOrigin: { ...defaultProductDetailsOriginState },
        compliance: { 
          eprel: defaultFormState.compliance?.eprel,
          esprConformity: defaultFormState.compliance?.esprConformity,
          scipNotification: { ...defaultScipNotificationState },
          euCustomsData: { ...defaultEuCustomsDataState },
          battery_regulation: { ...defaultBatteryRegulationState },
        },
        textileInformation: { ...defaultTextileInformationState }, 
        constructionProductInformation: { ...defaultConstructionProductInformationState }, 
      };

      if (result.productName) { aiInitialFormData.productName = result.productName; aiInitialFormData.productNameOrigin = 'AI_EXTRACTED'; }
      if (aiInitialFormData.productDetails && result.productDescription) { aiInitialFormData.productDetails.description = result.productDescription; if(aiInitialFormData.productDetailsOrigin) aiInitialFormData.productDetailsOrigin.descriptionOrigin = 'AI_EXTRACTED'; }
      if (result.manufacturer) { aiInitialFormData.manufacturer = result.manufacturer; aiInitialFormData.manufacturerOrigin = 'AI_EXTRACTED'; }
      if (result.modelNumber) { aiInitialFormData.modelNumber = result.modelNumber; aiInitialFormData.modelNumberOrigin = 'AI_EXTRACTED'; }

      if (result.specifications && Object.keys(result.specifications).length > 0) {
        if (aiInitialFormData.productDetails) aiInitialFormData.productDetails.specifications = JSON.stringify(result.specifications, null, 2);
        if (aiInitialFormData.productDetailsOrigin) aiInitialFormData.productDetailsOrigin.specificationsOrigin = 'AI_EXTRACTED';
      } else {
        if (aiInitialFormData.productDetails) aiInitialFormData.productDetails.specifications = "";
        if (result.specifications && aiInitialFormData.productDetailsOrigin) aiInitialFormData.productDetailsOrigin.specificationsOrigin = 'AI_EXTRACTED';
      }

      if (result.energyLabel && aiInitialFormData.productDetails) { aiInitialFormData.productDetails.energyLabel = result.energyLabel; if(aiInitialFormData.productDetailsOrigin) aiInitialFormData.productDetailsOrigin.energyLabelOrigin = 'AI_EXTRACTED'; }
      
      if (aiInitialFormData.batteryRegulation) { 
        if (result.batteryRegulation?.batteryChemistry) {
            aiInitialFormData.batteryRegulation.batteryChemistry = result.batteryRegulation.batteryChemistry;
            if (aiInitialFormData.batteryRegulationOrigin) aiInitialFormData.batteryRegulationOrigin.batteryChemistryOrigin = 'AI_EXTRACTED';
        }
        if (result.batteryRegulation?.batteryPassportId) {
            aiInitialFormData.batteryRegulation.batteryPassportId = result.batteryRegulation.batteryPassportId;
            if (aiInitialFormData.batteryRegulationOrigin) aiInitialFormData.batteryRegulationOrigin.batteryPassportIdOrigin = 'AI_EXTRACTED';
        }
        
        if (result.batteryRegulation?.carbonFootprint) {
            aiInitialFormData.batteryRegulation.carbonFootprint = {
                value: result.batteryRegulation.carbonFootprint.value ?? null,
                unit: result.batteryRegulation.carbonFootprint.unit || "",
                calculationMethod: result.batteryRegulation.carbonFootprint.calculationMethod || "",
                scope1Emissions: result.batteryRegulation.carbonFootprint.scope1Emissions ?? null,
                scope2Emissions: result.batteryRegulation.carbonFootprint.scope2Emissions ?? null,
                scope3Emissions: result.batteryRegulation.carbonFootprint.scope3Emissions ?? null,
                dataSource: result.batteryRegulation.carbonFootprint.dataSource || "",
                vcId: result.batteryRegulation.carbonFootprint.vcId || "",
            };
            if (aiInitialFormData.batteryRegulationOrigin) aiInitialFormData.batteryRegulationOrigin.carbonFootprintOrigin = { valueOrigin: 'AI_EXTRACTED', unitOrigin: 'AI_EXTRACTED', calculationMethodOrigin: 'AI_EXTRACTED', scope1EmissionsOrigin: 'AI_EXTRACTED', scope2EmissionsOrigin: 'AI_EXTRACTED', scope3EmissionsOrigin: 'AI_EXTRACTED', dataSourceOrigin: 'AI_EXTRACTED', vcIdOrigin: 'AI_EXTRACTED' };
        }
        
        if (result.batteryRegulation?.recycledContent) {
            aiInitialFormData.batteryRegulation.recycledContent = result.batteryRegulation.recycledContent.map(rc => ({
                material: rc.material || "",
                percentage: rc.percentage ?? null,
                source: rc.source || undefined,
                vcId: rc.vcId || "",
            }));
            if (aiInitialFormData.batteryRegulationOrigin) aiInitialFormData.batteryRegulationOrigin.recycledContentOrigin = result.batteryRegulation.recycledContent.map(() => ({ materialOrigin: 'AI_EXTRACTED', percentageOrigin: 'AI_EXTRACTED', sourceOrigin: 'AI_EXTRACTED', vcIdOrigin: 'AI_EXTRACTED' }));
        }
        
        if (result.batteryRegulation?.stateOfHealth) {
            aiInitialFormData.batteryRegulation.stateOfHealth = {
                value: result.batteryRegulation.stateOfHealth.value ?? null,
                unit: result.batteryRegulation.stateOfHealth.unit || "",
                measurementDate: result.batteryRegulation.stateOfHealth.measurementDate || "",
                measurementMethod: result.batteryRegulation.stateOfHealth.measurementMethod || "",
                vcId: result.batteryRegulation.stateOfHealth.vcId || "",
            };
            if (aiInitialFormData.batteryRegulationOrigin) aiInitialFormData.batteryRegulationOrigin.stateOfHealthOrigin = { valueOrigin: 'AI_EXTRACTED', unitOrigin: 'AI_EXTRACTED', measurementDateOrigin: 'AI_EXTRACTED', measurementMethodOrigin: 'AI_EXTRACTED', vcIdOrigin: 'AI_EXTRACTED' };
        }
        if (result.batteryRegulation?.vcId) {
            aiInitialFormData.batteryRegulation.vcId = result.batteryRegulation.vcId;
            if (aiInitialFormData.batteryRegulationOrigin) aiInitialFormData.batteryRegulationOrigin.vcIdOrigin = 'AI_EXTRACTED';
        }
      }
      
      if (result.scipData && aiInitialFormData.compliance?.scipNotification) {
          if(result.scipData.articleName) aiInitialFormData.compliance.scipNotification.articleName = result.scipData.articleName;
          if(result.scipData.primaryArticleId) aiInitialFormData.compliance.scipNotification.primaryArticleId = result.scipData.primaryArticleId;
          if(result.scipData.svhcListVersion) aiInitialFormData.compliance.scipNotification.svhcListVersion = result.scipData.svhcListVersion;
          if(result.scipData.submittingLegalEntity) aiInitialFormData.compliance.scipNotification.submittingLegalEntity = result.scipData.submittingLegalEntity;
          if(result.scipData.safeUseInstructionsLink) aiInitialFormData.compliance.scipNotification.safeUseInstructionsLink = result.scipData.safeUseInstructionsLink;
      }
      if (result.customsData && aiInitialFormData.compliance?.euCustomsData) {
          if(result.customsData.hsCode) aiInitialFormData.compliance.euCustomsData.hsCode = result.customsData.hsCode;
          if(result.customsData.countryOfOrigin) aiInitialFormData.compliance.euCustomsData.countryOfOrigin = result.customsData.countryOfOrigin;
      }

      if (aiInitialFormData.productDetails) {
        aiInitialFormData.productDetails.imageUrl = "";
        aiInitialFormData.productDetails.imageHint = "";
        if(aiInitialFormData.productDetailsOrigin) aiInitialFormData.productDetailsOrigin.imageUrlOrigin = undefined;
        aiInitialFormData.productDetails.customAttributesJsonString = "";
      }
      aiInitialFormData.onChainStatus = "Unknown"; 
      aiInitialFormData.onChainLifecycleStage = "Unknown"; 

      setCurrentProductDataForForm(prev => ({...prev, ...aiInitialFormData}));
      setAiExtractionAppliedSuccessfully(true);

      toast({
        title: "AI Extraction Complete!",
        description: "Information has been extracted. Please review and complete in the 'Manual Entry / Review' tab. AI-suggested fields are marked.",
        variant: "default",
        duration: 7000,
        action: <CheckCircle2 className="text-success" />,
      });
      setActiveTab("manual");
    } catch (err) {
      console.error("Extraction failed:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during extraction.";
      setError(errorMessage);
      toast({ title: "Extraction Failed", description: errorMessage, variant: "destructive", action: <AlertTriangle className="text-white" /> });
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleProductFormSubmit = async (formDataFromForm: ProductFormData) => {
    setIsSubmittingProduct(true);

    try {
      const storedProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
      let userProducts: StoredUserProduct[] = storedProductsString ? JSON.parse(storedProductsString) : [];

      const productCoreData: StoredUserProduct = {
        id: isEditMode && editProductId ? editProductId : `USER_PROD_${Date.now().toString().slice(-6)}`,
        ...formDataFromForm, 
        productName: formDataFromForm.productName || "Unnamed Product",
        status: (isEditMode && editProductId ? (userProducts.find(p => p.id === editProductId)?.status) : "Draft") || "Draft",
        compliance: (isEditMode && editProductId ? (userProducts.find(p => p.id === editProductId)?.compliance) : "N/A") || "N/A", 
        lastUpdated: new Date().toISOString(),
        
        supplyChainLinks: isEditMode && editProductId ? (userProducts.find(p => p.id === editProductId)?.supplyChainLinks) || [] : [],
        lifecycleEvents: isEditMode && editProductId ? (userProducts.find(p => p.id === editProductId)?.lifecycleEvents) || [] : [],
        
        productDetails: {
            description: formDataFromForm.productDetails?.description,
            materials: formDataFromForm.productDetails?.materials,
            sustainabilityClaims: formDataFromForm.productDetails?.sustainabilityClaims,
            keyCompliancePoints: formDataFromForm.productDetails?.keyCompliancePoints,
            specifications: formDataFromForm.productDetails?.specifications,
            energyLabel: formDataFromForm.productDetails?.energyLabel,
            imageUrl: formDataFromForm.productDetails?.imageUrl,
            imageHint: formDataFromForm.productDetails?.imageHint,
            customAttributesJsonString: formDataFromForm.productDetails?.customAttributesJsonString,
            esprSpecifics: formDataFromForm.productDetails?.esprSpecifics,
        },
        productDetailsOrigin: formDataFromForm.productDetailsOrigin,

        complianceData: {
          eprel: formDataFromForm.compliance?.eprel,
          esprConformity: formDataFromForm.compliance?.esprConformity,
          scipNotification: formDataFromForm.compliance?.scipNotification,
          euCustomsData: formDataFromForm.compliance?.euCustomsData,
          battery_regulation: formDataFromForm.compliance?.battery_regulation, 
        },
        batteryRegulation: formDataFromForm.batteryRegulation, 
        textileInformation: formDataFromForm.textileInformation, 
        constructionProductInformation: formDataFromForm.constructionProductInformation, 
        metadata: { 
          onChainStatus: formDataFromForm.onChainStatus, 
          onChainLifecycleStage: formDataFromForm.onChainLifecycleStage, 
          ...(isEditMode && editProductId ? userProducts.find(p => p.id === editProductId)?.metadata : {}), 
          created_at: (isEditMode && editProductId ? userProducts.find(p => p.id === editProductId)?.metadata?.created_at : undefined) || new Date().toISOString(),
          last_updated: new Date().toISOString(),
          status: (isEditMode && editProductId ? userProducts.find(p => p.id === editProductId)?.metadata?.status as StoredUserProduct['status'] : 'draft') || 'draft',
          dppStandardVersion: (isEditMode && editProductId ? userProducts.find(p => p.id === editProductId)?.metadata?.dppStandardVersion : "CIRPASS v1.0 Draft") || "CIRPASS v1.0 Draft",
        },
        
        complianceSummary: { 
          overallStatus: 'Pending Review', 
          eprel: { status: formDataFromForm.compliance?.eprel?.status || 'N/A', lastChecked: new Date().toISOString() },
          ebsi: { status: 'N/A', lastChecked: new Date().toISOString() }, 
          scip: formDataFromForm.compliance?.scipNotification ? {
            status: formDataFromForm.compliance.scipNotification.status || 'N/A',
            notificationId: formDataFromForm.compliance.scipNotification.notificationId,
            
            lastChecked: new Date().toISOString(),
          } : undefined,
          euCustomsData: formDataFromForm.compliance?.euCustomsData ? {
            status: formDataFromForm.compliance.euCustomsData.status || 'N/A',
            declarationId: formDataFromForm.compliance.euCustomsData.declarationId,
            cbamGoodsIdentifier: formDataFromForm.compliance.euCustomsData.cbamGoodsIdentifier, 
            lastChecked: new Date().toISOString(),
          } : undefined,
          battery: formDataFromForm.compliance?.battery_regulation ? { 
            status: formDataFromForm.compliance.battery_regulation.status || 'not_applicable',
            batteryChemistry: formDataFromForm.compliance.battery_regulation.batteryChemistry,
            
          } : undefined,
        },
        conflictMineralsReportUrl: formDataFromForm.conflictMineralsReportUrl, 
        fairTradeCertificationId: formDataFromForm.fairTradeCertificationId, 
        ethicalSourcingPolicyUrl: formDataFromForm.ethicalSourcingPolicyUrl, 
      };


      if (isEditMode && editProductId) {
        const productIndex = userProducts.findIndex(p => p.id === editProductId);
        if (productIndex > -1) {
          userProducts[productIndex] = {
            ...userProducts[productIndex], 
            ...productCoreData, 
          };
          localStorage.setItem(USER_PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(userProducts));
          toast({ title: "Product Updated", description: `${productCoreData.productName} has been updated.`, variant: "default", action: <CheckCircle2 className="text-success" /> });
          router.push(`/products/${editProductId}`);
        } else {
          throw new Error("Product not found for update.");
        }
      } else {
        userProducts.push(productCoreData);
        localStorage.setItem(USER_PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(userProducts));
        toast({ title: "Product Saved", description: `${productCoreData.productName} has been saved.`, variant: "default", action: <CheckCircle2 className="text-success" /> });
        router.push('/products');
      }

      setCurrentProductDataForForm(defaultFormState);
      setAiExtractionAppliedSuccessfully(false);
      if (!isEditMode) setActiveTab("ai-extraction");

    } catch (e) {
      console.error("Failed to save/update product:", e);
      const action = isEditMode ? "updating" : "saving";
      toast({ title: `Product ${action} Failed`, description: `Could not ${action} the product. ${e instanceof Error ? e.message : ''}`, variant: "destructive" });
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          {isEditMode && <Edit className="mr-3 h-7 w-7 text-primary" />}
          {isEditMode ? "Edit Product" : "Add New Product"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {isEditMode
            ? `Modify the details for product ID: ${editProductId}. Fields previously suggested by AI are marked with a CPU icon.`
            : "Create a Digital Product Passport by providing product information. You can start by extracting data from a document using AI, or fill the form manually."}
        </p>
      </div>

      {!isEditMode && (
        <Card className="shadow-md bg-muted/30 border-primary/20">
            <CardHeader className="pb-3">
                <CardTitle className="font-headline text-xl flex items-center"><Compass className="mr-2 h-5 w-5 text-primary"/>Choose Your Path</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground grid md:grid-cols-2 gap-4">
                <div>
                    <h4 className="font-semibold text-primary mb-1 flex items-center"><Wand2 className="mr-1.5 h-4 w-4"/>AI-Powered Start</h4>
                    <p>Upload a product document (like a spec sheet or invoice) and let our AI extract key information to pre-fill the form. Great for quick starts and complex products.</p>
                </div>
                <div>
                    <h4 className="font-semibold text-primary mb-1 flex items-center"><Edit className="mr-1.5 h-4 w-4"/>Manual Entry</h4>
                    <p>Prefer to enter details yourself or have specific information ready? Head straight to the manual form. You can still use AI to suggest content for individual fields.</p>
                </div>
            </CardContent>
        </Card>
      )}


      <Tabs value={activeTab} onValueChange={(newTab) => {
          setActiveTab(newTab);
          if (newTab !== "manual" && aiExtractionAppliedSuccessfully) {
            // User moved away from manual review after AI extraction
          }
      }} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="ai-extraction" disabled={isEditMode}>AI Data Extraction</TabsTrigger>
          <TabsTrigger value="manual">{isEditMode ? "Edit Product Details" : "Manual Entry / Review"}</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="mt-6">
          <ProductDetailsSection
            isEditMode={isEditMode}
            aiExtractionAppliedSuccessfully={aiExtractionAppliedSuccessfully}
            initialData={currentProductDataForForm}
            isSubmitting={isSubmittingProduct}
            onSubmit={handleProductFormSubmit}
            editProductId={editProductId}
          />
        </TabsContent>

        <TabsContent value="ai-extraction" className="mt-6">
          {isEditMode ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>AI Extraction Disabled in Edit Mode</AlertTitle>
              <AlertDescription>
                To use AI data extraction for a new base, please create a new product. You are currently editing an existing product.
              </AlertDescription>
            </Alert>
          ) : (
            <AiExtractionSection
              file={file}
              documentType={documentType}
              isLoading={isLoadingAi}
              error={error}
              currentProductData={currentProductDataForForm}
              aiExtractionAppliedSuccessfully={aiExtractionAppliedSuccessfully}
              onFileChange={handleFileChange}
              onDocumentTypeChange={setDocumentType}
              onExtractData={handleExtractData}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
