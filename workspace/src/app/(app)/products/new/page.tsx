
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
import type { InitialProductFormData, StoredUserProduct, BatteryRegulationDetails, ScipNotificationDetails, EuCustomsDataDetails, TextileInformation, ConstructionProductInformation, EsprSpecifics, BatteryRegulationOrigin, ProductDetailsOrigin } from '@/types/dpp';
import { USER_PRODUCTS_LOCAL_STORAGE_KEY } from '@/types/dpp';
import { fileToDataUri } from '@/utils/fileUtils';
import AiExtractionSection from "@/components/products/new/AiExtractionSection";
import ProductDetailsSection from "@/components/products/new/ProductDetailsSection";


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
        carbonFootprint: {
            value: null, unit: "", calculationMethod: "",
            scope1Emissions: null, scope2Emissions: null, scope3Emissions: null,
            dataSource: "", vcId: ""
        },
        digitalTwin: {
          uri: "", sensorDataEndpoint: "", realTimeStatus: "", predictiveMaintenanceAlerts: ""
        },
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
      const userProducts: StoredUserProduct[] = storedProductsString ? JSON.parse(storedProductsString) : [];

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

```
- workspace/src/types/products/index.ts:
```ts
// This file is being deprecated and its functionality is handled by specific mock data files.
// It will be removed in a future refactoring step.

// Export all from base types
export * from './base';

// Export all from form types
export * from './forms';

// Export all from API types
export * from './api';

// Export all from component types
export * from './components';

```
- workspace/src/utils/aiFormHelpers.tsx:
```tsx

// --- File: aiFormHelpers.tsx ---
// Description: Utility functions for handling AI-powered suggestions in product forms.


import React from "react"; 
import type { UseFormReturn } from "react-hook-form";
import type { ProductFormData } from "@/types/productFormTypes"; 
import { generateProductName } from "@/ai/flows/generate-product-name-flow";
import { generateProductDescription } from "@/ai/flows/generate-product-description-flow";
import { suggestSustainabilityClaims } from "@/ai/flows/suggest-sustainability-claims-flow";
import { suggestKeyCompliancePoints } from "@/ai/flows/suggest-key-compliance-points"; 
import { generateProductImage } from "@/ai/flows/generate-product-image-flow";
import { generateProductSpecifications } from "@/ai/flows/generate-product-specifications-flow";
import { generateCustomAttributes } from "@/ai/flows/generate-custom-attributes-flow"; 
import { suggestCbamIdentifier, type SuggestCbamIdentifierOutput } from "@/ai/flows/suggest-cbam-identifier-flow"; 
import { suggestImageHints } from "@/ai/flows/suggest-image-hints-flow";
import type { CustomAttribute } from "@/types/dpp"; 
import type { ToastInput } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";

type ToastFn = (input: ToastInput) => void;

interface AiHandlerOptions<T> {
  aiCall: () => Promise<T>;
  toast: ToastFn;
  setLoadingState: (loading: boolean) => void;
  successToast?: ToastInput | ((result: T) => ToastInput);
  errorTitle: string;
}

async function withAiHandling<T>(options: AiHandlerOptions<T>): Promise<T | null> {
  const { aiCall, toast, setLoadingState, successToast, errorTitle } = options;
  setLoadingState(true);
  try {
    const result = await aiCall();
    if (successToast) {
      const toastInput =
        typeof successToast === "function" ? successToast(result) : successToast;
      toast(toastInput);
    }
    return result;
  } catch (error) {
    console.error(`${errorTitle}:`, error);
    const iconElement = <AlertTriangle className="text-white" />;
    toast({
      title: errorTitle,
      description: error instanceof Error
        ? error.message
        : "An unknown error occurred.",
      variant: "destructive",
      action: iconElement,
    });
    return null;
  } finally {
    setLoadingState(false);
  }
}

export async function handleSuggestNameAI(
  form: UseFormReturn<ProductFormData>,
  toast: ToastFn,
  setLoadingState: (loading: boolean) => void
): Promise<string | null> {
  const { productDetails, productCategory } = form.getValues();
  if (!productDetails?.description && !productCategory) {
    toast({ title: "Input Required", description: "Please provide a product description or category to suggest a name.", variant: "destructive" });
    setLoadingState(false); 
    return null;
  }
  const result = await withAiHandling({
    aiCall: () => generateProductName({
      productDescription: productDetails?.description || "",
      productCategory: productCategory || undefined,
    }),
    toast,
    setLoadingState,
    successToast: (res) => ({
      title: "Product Name Suggested!",
      description: `AI suggested: \"${res.productName}\"`,
      variant: "default",
    }),
    errorTitle: "Error Suggesting Name",
  });
  return result ? result.productName : null;
}

export async function handleSuggestDescriptionAI(
  form: UseFormReturn<ProductFormData>,
  toast: ToastFn,
  setLoadingState: (loading: boolean) => void
): Promise<string | null> {
  const { productName, productCategory, productDetails } = form.getValues();
  if (!productName) {
    toast({ title: "Product Name Required", description: "Please provide a product name to suggest a description.", variant: "destructive" });
    setLoadingState(false);
    return null;
  }
  const result = await withAiHandling({
    aiCall: () =>
      generateProductDescription({
        productName: productName,
        productCategory: productCategory || undefined,
        keyFeatures: productDetails?.materials || undefined,
      }),
    toast,
    setLoadingState,
    successToast: {
      title: "Product Description Suggested!",
      description: "AI has generated a product description.",
      variant: "default",
    },
    errorTitle: "Error Suggesting Description",
  });
  return result ? result.productDescription : null;
}

export async function handleSuggestClaimsAI(
  form: UseFormReturn<ProductFormData>,
  toast: ToastFn,
  setLoadingState: (loading: boolean) => void
): Promise<string[] | null> {
  const formData = form.getValues();
  if (!formData.productCategory && !formData.productName && !formData.productDetails?.materials) {
    toast({ title: "Input Required", description: "Please provide product category, name, or materials to suggest claims.", variant: "destructive" });
    setLoadingState(false);
    return null;
  }
  const result = await withAiHandling({
    aiCall: () =>
      suggestSustainabilityClaims({
        productCategory: formData.productCategory || "General Product",
        productName: formData.productName,
        productDescription: formData.productDetails?.description,
        materials: formData.productDetails?.materials,
      }),
    toast,
    setLoadingState,
    successToast: (res) =>
      res.claims.length === 0
        ? {
            title: "No specific claims suggested.",
            description:
              "Try adding more product details like category or materials.",
          }
        : {
            title: "Sustainability Claims Suggested!",
            description: `${res.claims.length} claims suggested by AI.`,
            variant: "default",
          },
    errorTitle: "Error Suggesting Claims",
  });
  return result ? result.claims : null;
}

export async function handleSuggestKeyCompliancePointsAI(
  form: UseFormReturn<ProductFormData>,
  toast: ToastFn,
  setLoadingState: (loading: boolean) => void
): Promise<string[] | null> {
  const { productName, productCategory, compliance } = form.getValues();
  if (!productCategory) {
    toast({ title: "Category Required", description: "Please provide a product category to suggest compliance points.", variant: "destructive" });
    setLoadingState(false);
    return null;
  }
  
  const applicableRegs: string[] = [];
  if (compliance?.battery_regulation?.status && compliance.battery_regulation.status !== 'not_applicable') {
    applicableRegs.push("EU Battery Regulation");
  }
  if (compliance?.esprConformity?.status && compliance.esprConformity.status !== 'not_applicable') { 
    applicableRegs.push("EU ESPR");
  }
  if (compliance?.scipNotification?.status && compliance.scipNotification.status !== 'N/A' && compliance.scipNotification.status !== 'Not Required') {
    applicableRegs.push("SCIP Database");
  }
  
  const result = await withAiHandling({
    aiCall: () =>
      suggestKeyCompliancePoints({
        productName: productName || undefined,
        productCategory: productCategory,
        regulationsApplicable: applicableRegs.join(', ') || undefined,
      }),
    toast,
    setLoadingState,
    successToast: (res) =>
      res.compliancePoints.length === 0
        ? {
            title: "No specific compliance points suggested.",
            description:
              "Ensure product category and relevant regulations are selected.",
          }
        : {
            title: "Key Compliance Points Suggested!",
            description: `${res.compliancePoints.length} points suggested by AI.`,
            variant: "default",
          },
    errorTitle: "Error Suggesting Compliance Points",
  });
  return result ? result.compliancePoints : null;
}


export async function handleGenerateImageAI(
  form: UseFormReturn<ProductFormData>,
  toast: ToastFn,
  setLoadingState: (loading: boolean) => void
): Promise<string | null> {
  const formData = form.getValues();
  if (!formData.productName) {
    toast({ title: "Product Name Required", description: "Please enter a product name before generating an image.", variant: "destructive" });
    setLoadingState(false);
    return null;
  }
  const result = await withAiHandling({
    aiCall: () =>
      generateProductImage({
        productName: formData.productName,
        productCategory: formData.productCategory,
        imageHint: formData.productDetails?.imageHint,
      }),
    toast,
    setLoadingState,
    successToast: {
      title: "Image Generated Successfully",
      description: "The product image has been generated.",
    },
    errorTitle: "Error Generating Image",
  });
  return result ? result.imageUrl : null;
}

export async function handleSuggestSpecificationsAI(
  form: UseFormReturn<ProductFormData>,
  toast: ToastFn,
  setLoadingState: (loading: boolean) => void
): Promise<string | null> {
  const { productName, productDetails, productCategory } = form.getValues();
  if (!productName && !productDetails?.description && !productCategory) {
    toast({ title: "Input Required", description: "Please provide product name, description, or category to suggest specifications.", variant: "destructive" });
    setLoadingState(false);
    return null;
  }
  const result = await withAiHandling({
    aiCall: () =>
      generateProductSpecifications({
        productName: productName || "",
        productDescription: productDetails?.description || undefined,
        productCategory: productCategory || undefined,
      }),
    toast,
    setLoadingState,
    successToast: {
      title: "Specifications Suggested!",
      description: `AI suggested specifications for "${productName || 'the product'}".`,
      variant: "default",
    },
    errorTitle: "Error Suggesting Specifications",
  });
  return result ? result.specificationsJsonString : null;
}

export async function handleSuggestCustomAttributesAI(
  form: UseFormReturn<ProductFormData>,
  toast: ToastFn,
  setLoadingState: (loading: boolean) => void
): Promise<CustomAttribute[] | null> {
  const { productName, productCategory, productDetails } = form.getValues();

  if (!productName && !productCategory && !productDetails?.description) {
    toast({
      title: "Input Required",
      description:
        "Please provide product name, category, or description to suggest custom attributes.",
      variant: "destructive",
    });
    setLoadingState(false);
    return null;
  }

  const result = await withAiHandling({
    aiCall: () =>
      generateCustomAttributes({
        productName: productName || "",
        productCategory: productCategory || undefined,
        productDescription: productDetails?.description || undefined,
      }),
    toast,
    setLoadingState,
    successToast: (res) =>
      res.customAttributes.length === 0
        ? {
            title: "No specific attributes suggested.",
            description: "Try adding more product details.",
          }
        : {
            title: "Custom Attributes Suggested!",
            description: `${res.customAttributes.length} custom attribute(s) suggested by AI.`,
            variant: "default",
          },
    errorTitle: "Error Suggesting Attributes",
  });

  return result ? result.customAttributes : null;
}

export async function handleSuggestCbamIdentifierAI(
  form: UseFormReturn<ProductFormData>,
  toast: ToastFn,
  setLoadingState: (loading: boolean) => void
): Promise<SuggestCbamIdentifierOutput | null> {
  const { productCategory, productDetails } = form.getValues();
  if (!productCategory) {
    toast({ title: "Category Required", description: "Please provide a product category to suggest a CBAM identifier.", variant: "destructive" });
    setLoadingState(false);
    return null;
  }
  const result = await withAiHandling({
    aiCall: () =>
      suggestCbamIdentifier({
        productCategory: productCategory,
        productDescription: productDetails?.description || undefined,
      }),
    toast,
    setLoadingState,
    successToast: (res) => ({
      title: "CBAM Identifier Suggested!",
      description: `AI suggested: "${res.suggestedIdentifier}". Reasoning: ${res.reasoning}`,
      variant: "default",
      duration: 7000,
    }),
    errorTitle: "Error Suggesting CBAM ID",
  });
  return result;
}

export async function handleSuggestImageHintsAI(
  form: UseFormReturn<ProductFormData>,
  toast: ToastFn,
  setLoadingState: (loading: boolean) => void
): Promise<string[] | null> {
  const { productName, productCategory } = form.getValues();
  if (!productName && !productCategory) {
    toast({
      title: "Input Required",
      description: "Please provide product name or category to suggest image hints.",
      variant: "destructive",
    });
    setLoadingState(false);
    return null;
  }
  const result = await withAiHandling({
    aiCall: () =>
      suggestImageHints({
        productName: productName || "",
        productCategory: productCategory || undefined,
      }),
    toast,
    setLoadingState,
    successToast: (res) =>
      res.imageHints.length === 0
        ? {
            title: "No specific image hints suggested.",
            description: "Ensure product name or category is provided.",
          }
        : {
            title: "Image Hints Suggested!",
            description: `${res.imageHints.length} hint(s) suggested by AI.`,
            variant: "default",
          },
    errorTitle: "Error Suggesting Image Hints",
  });
  return result ? result.imageHints : null;
}

```
- workspace/src/utils/dppDisplayUtils.tsx:
```tsx

// --- File: dppDisplayUtils.tsx ---
// Description: Utility functions for generating display details (text, icons, variants) for DPP compliance, EBSI status, and completeness.


import React from "react";
import type { DigitalProductPassport, EbsiVerificationDetails, DisplayableProduct, ProductComplianceSummary, SimpleLifecycleEvent } from "@/types/dpp";
import { ShieldCheck, ShieldAlert, ShieldQuestion, Info as InfoIcon, AlertCircle, AlertTriangle, CheckCircle2, RefreshCw, Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ComplianceDetails {
  text: string;
  variant: "default" | "destructive" | "outline" | "secondary";
  icon: JSX.Element;
  tooltipText: string;
}

interface EbsiStatusDisplayDetails extends ComplianceDetails {}

// Configuration for DPP completeness checks
const BASE_ESSENTIAL_FIELDS_CONFIG: Array<{
  key: keyof DisplayableProduct | string;
  label: string;
  check?: (p: DisplayableProduct) => boolean;
  categoryScope?: string[];
}> = [
  { key: 'productName', label: 'Product Name' },
  { key: 'gtin', label: 'GTIN' },
  { key: 'category', label: 'Category', check: p => !!(p.category || p.productCategory) },
  { key: 'manufacturer', label: 'Manufacturer' },
  { key: 'modelNumber', label: 'Model Number' },
  { key: 'productDetails.description', label: 'Description', check: p => !!(p.description || p.productDescription) },
  { key: 'productDetails.imageUrl', label: 'Image URL', check: (p) => !!(p.productDetails?.imageUrl || p.imageUrl) && !(p.productDetails?.imageUrl || p.imageUrl)!.includes('placehold.co') && !(p.productDetails?.imageUrl || p.imageUrl)!.includes('?text=') },
  { key: 'productDetails.materials', label: 'Materials Info', check: p => !!p.productDetails?.materials && p.productDetails.materials.trim() !== '' },
  { key: 'productDetails.sustainabilityClaims', label: 'Sustainability Claims', check: p => !!p.productDetails?.sustainabilityClaims && p.productDetails.sustainabilityClaims.trim() !== '' },
  { key: 'productDetails.energyLabel', label: 'Energy Label', categoryScope: ['Appliances', 'Electronics'] },
  { key: 'productDetails.specifications', label: 'Specifications', check: (p) => {
      const specs = p.productDetails?.specifications || p.specifications;
      if (typeof specs === 'string') return !!specs && specs.trim() !== '' && specs.trim() !== '{}';
      if (typeof specs === 'object' && specs !== null) return Object.keys(specs).length > 0;
      return false;
    }
  },
  { key: 'lifecycleEvents', label: 'Lifecycle Events', check: (p) => (p.lifecycleEvents || []).length > 0 },
  { key: 'complianceSummary.overallStatus', label: 'Overall Compliance Status', check: (p) => p.complianceSummary?.overallStatus !== undefined && p.complianceSummary.overallStatus.toLowerCase() !== 'n/a' },
  { key: 'complianceSummary.eprel.status', label: 'EPREL Status', check: (p) => p.complianceSummary?.eprel?.status !== undefined && p.complianceSummary.eprel.status.toLowerCase() !== 'n/a' && !p.complianceSummary.eprel.status.toLowerCase().includes('not found')},
  { key: 'complianceSummary.ebsi.status', label: 'EBSI Status', check: (p) => p.complianceSummary?.ebsi?.status !== undefined && p.complianceSummary.ebsi.status.toLowerCase() !== 'n/a' && p.complianceSummary.ebsi.status.toLowerCase() !== 'not verified' && p.complianceSummary.ebsi.status.toLowerCase() !== 'error' },
  { key: 'complianceSummary.specificRegulations', label: 'Specific Regulations Count', check: (p) => (p.complianceSummary?.specificRegulations || []).length > 0 },
  { key: 'productDetails.carbonFootprint.value', label: 'General Carbon Footprint Value', check: p => p.productDetails?.carbonFootprint?.value !== null && p.productDetails?.carbonFootprint?.value !== undefined},
  { key: 'productDetails.esprSpecifics.durabilityInformation', label: 'ESPR Durability Info', categoryScope: ['Appliances', 'Electronics', 'Furniture', 'Textiles'] }, // Example category scope
];

const BATTERY_FIELDS_CONFIG: Array<{
  key: keyof DisplayableProduct | string;
  label: string;
  check?: (p: DisplayableProduct) => boolean;
}> = [
  { key: 'batteryRegulation.batteryChemistry', label: 'Battery Chemistry', check: p => !!p.batteryRegulation?.batteryChemistry },
  { key: 'batteryRegulation.stateOfHealth.value', label: 'Battery State of Health (SoH)', check: p => p.batteryRegulation?.stateOfHealth?.value !== null && p.batteryRegulation?.stateOfHealth?.value !== undefined },
  { key: 'batteryRegulation.carbonFootprint.value', label: 'Battery Mfg. Carbon Footprint', check: p => p.batteryRegulation?.carbonFootprint?.value !== null && p.batteryRegulation?.carbonFootprint?.value !== undefined },
  { key: 'batteryRegulation.recycledContent', label: 'Battery Recycled Content', check: p => (p.batteryRegulation?.recycledContent || []).length > 0 },
];

export const getOverallComplianceDetails = (dpp: DigitalProductPassport): ComplianceDetails => {
  let compliantCount = 0;
  let pendingCount = 0;
  let nonCompliantCount = 0;
  const regulationsChecked = Object.values(dpp.compliance).filter(
    (reg): reg is { status: string } => typeof reg === 'object' && reg !== null && 'status' in reg && typeof reg.status === 'string'
  );

  if (regulationsChecked.length === 0) {
    if (Object.keys(dpp.compliance).length === 0) {
      const iconElement = <ShieldQuestion className="h-5 w-5 text-muted-foreground" />;
      return { text: "N/A", variant: "secondary", icon: iconElement, tooltipText: "No regulations applicable or tracked." };
    }
    const iconElement = <ShieldQuestion className="h-5 w-5 text-muted-foreground" />;
    return { text: "No Data", variant: "outline", icon: iconElement, tooltipText: "Compliance data not yet available." };
  }

  regulationsChecked.forEach(reg => {
    const status = reg.status?.toLowerCase();
    // Compliant statuses
    if (['compliant', 'registered', 'conformant', 'synced successfully', 'verified', 'cleared', 'notified'].includes(status)) compliantCount++;
    // Pending statuses
    else if (['pending', 'pending_review', 'pending_assessment', 'pending_verification', 'in progress', 'data incomplete', 'pending notification', 'pending documents'].includes(status)) pendingCount++;
    // Non-compliant statuses
    else if (['non_compliant', 'non_conformant', 'error', 'data mismatch', 'product not found in eprel', 'mismatch'].includes(status)) nonCompliantCount++;
    // Neutral statuses like 'N/A', 'Not Applicable', 'Not Required' are ignored for this calculation
  });

  if (nonCompliantCount > 0) {
    const iconElement = <ShieldAlert className="h-5 w-5 text-destructive" />;
    return { text: "Non-Compliant", variant: "destructive", icon: iconElement, tooltipText: "One or more regulations are non-compliant." };
  }
  if (pendingCount > 0) {
    const iconElement = <InfoIcon className="h-5 w-5 text-warning" />;
    return { text: "Pending", variant: "outline", icon: iconElement, tooltipText: "One or more regulations are pending." };
  }
  if (compliantCount === regulationsChecked.filter(r => !['n/a', 'not applicable', 'not required'].includes(r.status.toLowerCase())).length && compliantCount > 0) {
    const iconElement = <ShieldCheck className="h-5 w-5 text-success" />;
    return { text: "Fully Compliant", variant: "default", icon: iconElement, tooltipText: "All tracked regulations compliant." };
  }
  if (compliantCount > 0 && (pendingCount > 0 || nonCompliantCount === 0)) {
    const iconElement = <ShieldCheck className="h-5 w-5 text-success" />; // Or InfoIcon if we want to be more conservative
    return { text: "Partially Compliant", variant: "default", icon: iconElement, tooltipText: "Some regulations are compliant, others may be pending or N/A." };
  }
  const iconElementDefault = <ShieldQuestion className="h-5 w-5 text-muted-foreground" />;
  return { text: "Review Needed", variant: "outline", icon: iconElementDefault, tooltipText: "Compliance status requires review." };
};

export const getEbsiStatusDetails = (status?: EbsiVerificationDetails['status']): EbsiStatusDisplayDetails => {
  if (!status) {
    const iconElement = <ShieldQuestion className="h-4 w-4 text-muted-foreground" />;
    return { text: "N/A", variant: "secondary", icon: iconElement, tooltipText: "EBSI status unknown." };
  }
  switch (status) {
    case 'verified':
      const verifiedIcon = <ShieldCheck className="h-4 w-4 text-success" />;
      return { text: "Verified", variant: "default", icon: verifiedIcon, tooltipText: "EBSI verification successful." };
    case 'pending_verification':
      const pendingIcon = <InfoIcon className="h-4 w-4 text-warning" />;
      return { text: "Pending", variant: "outline", icon: pendingIcon, tooltipText: "EBSI verification pending." };
    case 'not_verified':
      const notVerifiedIcon = <AlertCircle className="h-4 w-4 text-danger" />;
      return { text: "Not Verified", variant: "destructive", icon: notVerifiedIcon, tooltipText: "EBSI verification failed." };
    case 'error':
      const errorIcon = <AlertTriangle className="h-4 w-4 text-red-700" />;
      return { text: "Error", variant: "destructive", icon: errorIcon, tooltipText: "Error during EBSI verification." };
    default:
      const unknownIcon = <ShieldQuestion className="h-4 w-4 text-muted-foreground" />;
      return { text: "Unknown", variant: "secondary", icon: unknownIcon, tooltipText: "EBSI status is unknown." };
  }
};

export const calculateDppCompletenessForList = (product: DisplayableProduct): { score: number; filledFields: number; totalFields: number; missingFields: string[] } => {
  let essentialFieldsConfig = [...BASE_ESSENTIAL_FIELDS_CONFIG];

  const currentCategory = product.category || product.productCategory;
  const isBatteryRelevantCategory = currentCategory?.toLowerCase().includes('electronics') || currentCategory?.toLowerCase().includes('automotive') || currentCategory?.toLowerCase().includes('battery') || (product.batteryRegulation && product.batteryRegulation.status !== 'not_applicable');

  if (isBatteryRelevantCategory) {
    essentialFieldsConfig = [...essentialFieldsConfig, ...BATTERY_FIELDS_CONFIG];
  }

  let filledCount = 0;
  const missingFields: string[] = [];
  let actualTotalFields = 0;

  essentialFieldsConfig.forEach(fieldConfig => {
    if (fieldConfig.categoryScope && currentCategory) {
      const productCategoryLower = currentCategory.toLowerCase();
      if (!fieldConfig.categoryScope.some(scope => productCategoryLower.includes(scope.toLowerCase()))) { return; }
    }
    actualTotalFields++;

    let isFieldFilled = false;
    const keys = (fieldConfig.key as string).split('.');
    let value: any = product;
    let found = true;
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        value = undefined;
        found = false;
        break;
      }
    }
    
    if (found) {
      if (fieldConfig.check) {
        isFieldFilled = fieldConfig.check(product);
      } else {
        if (typeof value === 'object' && value !== null) {
          isFieldFilled = Object.keys(value).length > 0 || (Array.isArray(value) && value.length > 0);
        } else {
          isFieldFilled = value !== null && value !== undefined && String(value).trim() !== '' && String(value).toLowerCase().trim() !== 'n/a';
        }
      }
    }
    
    if (isFieldFilled) {
      filledCount++;
    } else {
      missingFields.push(fieldConfig.label);
    }
  });

  const score = actualTotalFields > 0 ? Math.round((filledCount / actualTotalFields) * 100) : 0;
  return { score, filledFields: filledCount, totalFields: actualTotalFields, missingFields };
};


// Utility functions for status display (moved from ComplianceTab)

interface StatusDisplayConfig {
  icon: JSX.Element;
  variant: "default" | "destructive" | "outline" | "secondary";
  classes: string;
}

const successDisplay: StatusDisplayConfig = {
  icon: <ShieldCheck className="h-5 w-5 text-success" />,
  variant: "default",
  classes: "bg-green-100 text-green-700 border-green-300",
};

const errorDisplay: StatusDisplayConfig = {
  icon: <AlertTriangle className="h-5 w-5 text-danger" />,
  variant: "destructive",
  classes: "bg-red-100 text-red-700 border-red-300",
};

const pendingDisplay: StatusDisplayConfig = {
  icon: <InfoIcon className="h-5 w-5 text-warning" />,
  variant: "outline",
  classes: "bg-yellow-100 text-yellow-700 border-yellow-300",
};

const defaultDisplay: StatusDisplayConfig = {
  icon: <InfoIcon className="h-5 w-5 text-muted-foreground" />,
  variant: "secondary",
  classes: "bg-muted text-muted-foreground",
};

const STATUS_DISPLAY_MAP: Record<string, StatusDisplayConfig> = {
  compliant: successDisplay,
  registered: successDisplay,
  verified: successDisplay,
  "synced successfully": successDisplay,
  conformant: successDisplay,
  cleared: successDisplay,
  notified: successDisplay,
  active: successDisplay, // For product status

  "non-compliant": errorDisplay,
  non_conformant: errorDisplay,
  error: errorDisplay,
  "error during sync": errorDisplay,
  mismatch: errorDisplay,
  flagged: errorDisplay, // For product status
  recalled: errorDisplay, // For product status
  revoked: errorDisplay, // For product status

  pending: pendingDisplay,
  "pending review": pendingDisplay,
  pending_review: pendingDisplay,
  pending_assessment: pendingDisplay,
  pending_verification: pendingDisplay,
  "in progress": pendingDisplay,
  "data incomplete": pendingDisplay,
  "data mismatch": pendingDisplay, 
  "product not found in eprel": pendingDisplay,
  "pending notification": pendingDisplay,
  "pending documents": pendingDisplay,


  "not applicable": defaultDisplay,
  "n/a": defaultDisplay,
  "not found": defaultDisplay,
  "not verified": defaultDisplay,
  "not required": defaultDisplay,
  draft: defaultDisplay, // For product status
  archived: defaultDisplay, // For product status
  default: defaultDisplay,
};

export const getStatusIcon = (status?: string): JSX.Element => {
  const key = status?.toLowerCase().trim().replace(/_/g, ' ') ?? 'default';
  return STATUS_DISPLAY_MAP[key]?.icon ?? STATUS_DISPLAY_MAP.default.icon;
};

export const getStatusBadgeVariant = (status?: string): "default" | "destructive" | "outline" | "secondary" => {
  const key = status?.toLowerCase().trim().replace(/_/g, ' ') ?? 'default';
  return STATUS_DISPLAY_MAP[key]?.variant ?? STATUS_DISPLAY_MAP.default.variant;
};

export const getStatusBadgeClasses = (status?: string): string => {
  const key = status?.toLowerCase().trim().replace(/_/g, ' ') ?? 'default';
  return STATUS_DISPLAY_MAP[key]?.classes ?? STATUS_DISPLAY_MAP.default.classes;
};

```
- workspace/src/utils/dppLifecycleStateMachine.ts:
```ts

// --- File: src/utils/dppLifecycleStateMachine.ts ---
// Description: Simple finite state machine for DPP lifecycle stages.

export enum DppLifecycleState {
  DESIGN = 'DESIGN',
  MANUFACTURING = 'MANUFACTURING',
  QUALITY_ASSURANCE = 'QUALITY_ASSURANCE',
  DISTRIBUTION = 'DISTRIBUTION',
  IN_USE = 'IN_USE',
  MAINTENANCE = 'MAINTENANCE', 
  END_OF_LIFE = 'END_OF_LIFE',
}

export const ALLOWED_TRANSITIONS: Record<DppLifecycleState, DppLifecycleState[]> = {
  [DppLifecycleState.DESIGN]: [DppLifecycleState.MANUFACTURING],
  [DppLifecycleState.MANUFACTURING]: [DppLifecycleState.QUALITY_ASSURANCE],
  [DppLifecycleState.QUALITY_ASSURANCE]: [DppLifecycleState.DISTRIBUTION],
  [DppLifecycleState.DISTRIBUTION]: [DppLifecycleState.IN_USE],
  [DppLifecycleState.IN_USE]: [DppLifecycleState.MAINTENANCE, DppLifecycleState.END_OF_LIFE],
  [DppLifecycleState.MAINTENANCE]: [DppLifecycleState.IN_USE], // After maintenance, it goes back to 'In Use'
  [DppLifecycleState.END_OF_LIFE]: [], // Terminal state
};

export class DppLifecycleStateMachine {
  private currentState: DppLifecycleState;

  constructor(initialState: DppLifecycleState) {
    this.currentState = initialState;
  }

  getCurrentState(): DppLifecycleState {
    return this.currentState;
  }

  canTransition(next: DppLifecycleState): boolean {
    const allowed = ALLOWED_TRANSITIONS[this.currentState];
    return allowed ? allowed.includes(next) : false;
  }

  transition(next: DppLifecycleState): void {
    if (!this.canTransition(next)) {
      throw new Error(`Invalid state transition from ${this.currentState} to ${next}`);
    }
    this.currentState = next;
  }
}

```
- workspace/src/utils/fileUtils.ts:
```ts

// --- File: src/utils/fileUtils.ts ---
// Description: Utility functions for file handling.

// This utility converts a File object to a Base64 encoded Data URI.
// This is essential for passing file data (like images or documents) to Genkit flows.
export const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};


```
- workspace/src/utils/sortUtils.ts:
```ts

// --- File: src/utils/sortUtils.ts ---
// Description: Utility functions for sorting Digital Product Passports.

import type { DigitalProductPassport, SortableKeys } from '@/types/dpp';

/**
 * Returns the value to use when sorting a DPP by the given key.
 * Handles nested keys and special cases.
 */
export function getSortValue(dpp: DigitalProductPassport, key: SortableKeys): any {
  switch (key) {
    case 'metadata.status':
      return dpp.metadata.status;
    case 'metadata.last_updated':
      return new Date(dpp.metadata.last_updated).getTime();
    case 'ebsiVerification.status':
      return dpp.ebsiVerification?.status;
    case 'metadata.onChainStatus': 
      return dpp.metadata?.onChainStatus;
    default:
      return (dpp as any)[key];
  }
}


```
- workspace/src/utils/products/validation.ts:
```ts
// src/utils/products/validation.ts
import { z } from 'zod';
import type { MaterialInfo, CustomAttribute, CarbonFootprintData, DigitalTwinData, EthicalSourcingData, EsprSpecifics } from '@/types/products';

const materialInfoSchema: z.ZodType<MaterialInfo> = z.object({
  name: z.string().min(1, 'Material name is required'),
  percentage: z.number().min(0).max(100).optional(),
  source: z.string().optional(),
  isRecycled: z.boolean().optional(),
  sustainabilityCertification: z.string().optional(),
  origin: z.string().optional(),
  suppliers: z.array(z.string()).optional(),
});

const customAttributeSchema: z.ZodType<CustomAttribute> = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
  type: z.enum(['string', 'number', 'boolean', 'date', 'url']).optional(),
  isRequired: z.boolean().optional(),
  category: z.string().optional(),
});

export const productFormSchema = z.object({
  productName: z.string().min(3, { message: "Product name must be at least 3 characters long." }),
  manufacturer: z.string().min(2, { message: "Manufacturer name is required." }),
  category: z.string().min(2, { message: "Category is required." }),
  modelNumber: z.string().optional(),
  gtin: z.string().optional(),
  sku: z.string().optional(),
  nfcTagId: z.string().optional(),
  rfidTagId: z.string().optional(),
  description: z.string().min(10, { message: "Description must be at least 10 characters long." }).optional(),
  materials: z.string().optional(),
  sustainabilityClaims: z.string().optional(),
  keyCompliancePoints: z.string().optional(),
  specifications: z.string().optional().refine(val => {
    if (!val) return true;
    try {
      JSON.parse(val);
      return true;
    } catch {
      return false;
    }
  }, { message: "Specifications must be valid JSON" }),
  energyLabel: z.string().optional(),
  imageUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
  imageHint: z.string().optional(),
  customAttributes: z.array(customAttributeSchema).optional(),
  // Add more complex validations for other fields if needed
});

```
  </change>
</changes>
```