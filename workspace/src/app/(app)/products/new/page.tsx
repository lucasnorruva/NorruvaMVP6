
// --- File: page.tsx (Add/Edit Product) ---
// Description: Main page component for creating or editing product DPPs.

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
import type { ProductSupplyChainLink, SimpleLifecycleEvent, ProductComplianceSummary, CustomAttribute, BatteryRegulationDetails, ScipNotificationDetails, EuCustomsDataDetails, TextileInformation, ConstructionProductInformation, CarbonFootprintData, StateOfHealthData, RecycledContentData, EsprSpecifics, DigitalTwinData } from '@/types/dpp'; // Added DigitalTwinData
import type { StoredUserProduct, InitialProductFormData, ProductDetailsOrigin, BatteryRegulationOrigin } from "@/types/dpp";
import { USER_PRODUCTS_LOCAL_STORAGE_KEY } from '@/types/dpp';
import { fileToDataUri } from '@/utils/fileUtils';
import AiExtractionSection from "@/components/products/form/AiExtractionSection";
import ProductDetailsSection from "@/components/products/form/ProductDetailsSection";


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
  },
  digitalTwinOrigin: {
    uriOrigin: undefined,
    sensorDataEndpointOrigin: undefined,
    realTimeStatusOrigin: undefined,
    predictiveMaintenanceAlertsOrigin: undefined,
  },
  conflictMineralsReportUrlOrigin: undefined,
  fairTradeCertificationIdOrigin: undefined,
  ethicalSourcingPolicyUrlOrigin: undefined,
  carbonFootprintOrigin: {
    valueOrigin: undefined,
    unitOrigin: undefined,
    calculationMethodOrigin: undefined,
    scope1EmissionsOrigin: undefined,
    scope2EmissionsOrigin: undefined,
    scope3EmissionsOrigin: undefined,
    dataSourceOrigin: undefined,
    vcIdOrigin: undefined,
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
        carbonFootprint: {
          value: null, unit: "", calculationMethod: "",
          scope1Emissions: null, scope2Emissions: null, scope3Emissions: null,
          dataSource: "", vcId: ""
        },
        digitalTwin: {
          uri: "", sensorDataEndpoint: "", realTimeStatus: "", predictiveMaintenanceAlerts: ""
        },
        conflictMineralsReportUrl: "", 
        fairTradeCertificationId: "", 
        ethicalSourcingPolicyUrl: "", 
    },
    onChainStatus: "Unknown", 
    onChainLifecycleStage: "Unknown", 
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
          productDetails: {
            description: productToEdit.productDetails?.description,
            materials: productToEdit.productDetails?.materials,
            sustainabilityClaims: productToEdit.productDetails?.sustainabilityClaims,
            keyCompliancePoints: productToEdit.productDetails?.keyCompliancePoints,
            specifications: productToEdit.productDetails?.specifications,
            energyLabel: productToEdit.productDetails?.energyLabel,
            imageUrl: productToEdit.productDetails?.imageUrl,
            imageHint: productToEdit.productDetails?.imageHint,
            customAttributesJsonString: productToEdit.productDetails?.customAttributesJsonString,
            esprSpecifics: { 
                ...defaultEsprSpecificsState, 
                ...(productToEdit.productDetails?.esprSpecifics || {}) 
            },
            carbonFootprint: {
                ...defaultFormState.productDetails?.carbonFootprint,
                ...(productToEdit.productDetails?.carbonFootprint || {})
            },
            digitalTwin: {
                ...defaultFormState.productDetails?.digitalTwin,
                ...(productToEdit.productDetails?.digitalTwin || {})
            },
            conflictMineralsReportUrl: productToEdit.productDetails?.conflictMineralsReportUrl, 
            fairTradeCertificationId: productToEdit.productDetails?.fairTradeCertificationId, 
            ethicalSourcingPolicyUrl: productToEdit.productDetails?.ethicalSourcingPolicyUrl, 
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
          productNameOrigin: productToEdit.productNameOrigin,
          manufacturerOrigin: productToEdit.manufacturerOrigin,
          modelNumberOrigin: productToEdit.modelNumberOrigin,
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
        status: (isEditMode && editProductId ? (userProducts.find(p => p.id === editProductId)?.status) : "Draft") || "Draft",
        compliance: (isEditMode && editProductId ? (userProducts.find(p => p.id === editProductId)?.compliance) : "N/A") || "N/A", 
        lastUpdated: new Date().toISOString(),
        productName: formDataFromForm.productName,
        gtin: formDataFromForm.gtin,
        manufacturer: formDataFromForm.manufacturer,
        modelNumber: formDataFromForm.modelNumber,
        sku: formDataFromForm.sku,
        nfcTagId: formDataFromForm.nfcTagId,
        rfidTagId: formDataFromForm.rfidTagId,
        productCategory: formDataFromForm.productCategory,
        productDetails: formDataFromForm.productDetails,
        batteryRegulation: formDataFromForm.batteryRegulation,
        complianceData: formDataFromForm.compliance,
        textileInformation: formDataFromForm.textileInformation,
        constructionProductInformation: formDataFromForm.constructionProductInformation,
        metadata: {
          onChainStatus: formDataFromForm.onChainStatus,
          onChainLifecycleStage: formDataFromForm.onChainLifecycleStage,
        },
        productDetailsOrigin: formDataFromForm.productDetailsOrigin,
        batteryRegulationOrigin: formDataFromForm.batteryRegulationOrigin,
        productNameOrigin: formDataFromForm.productNameOrigin,
        manufacturerOrigin: formDataFromForm.manufacturerOrigin,
        modelNumberOrigin: formDataFromForm.modelNumberOrigin,
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
import type { ProductFormData } from "@/types/productFormTypes";

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

```
- workspace/src/components/products/form/SustainabilityComplianceFormSection.tsx:
```tsx

// --- File: SustainabilityComplianceFormSection.tsx ---
// Description: Form section component for sustainability and compliance details.
"use client";

import React, { useState } from "react"; 
import type { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AiIndicator, AiSuggestionDisplay } from "@/components/products/form"; 
import { Loader2, Sparkles } from "lucide-react";
import type { ProductFormData } from "@/types/productFormTypes"; 
import type { InitialProductFormData } from "@/app/(app)/products/new/page";
import type { ToastInput } from "@/hooks/use-toast"; 
import { handleSuggestClaimsAI, handleSuggestKeyCompliancePointsAI } from "@/utils/aiFormHelpers"; 

type ToastFn = (input: ToastInput) => void;

interface SustainabilityComplianceFormSectionProps {
  form: UseFormReturn<ProductFormData>;
  initialData?: Partial<InitialProductFormData>;
  suggestedClaims: string[]; 
  setSuggestedClaims: React.Dispatch<React.SetStateAction<string[]>>; 
  handleClaimClick: (claim: string) => void;
  suggestedKeyCompliancePoints: string[]; 
  setSuggestedKeyCompliancePoints: React.Dispatch<React.SetStateAction<string[]>>; 
  isSubmittingForm?: boolean;
  toast: ToastFn; 
}

export default function SustainabilityComplianceFormSection({
  form,
  initialData,
  suggestedClaims,
  setSuggestedClaims, 
  handleClaimClick,
  suggestedKeyCompliancePoints, 
  setSuggestedKeyCompliancePoints, 
  isSubmittingForm,
  toast, 
}: SustainabilityComplianceFormSectionProps) {
  const [isSuggestingClaimsInternal, setIsSuggestingClaimsInternal] = useState(false);
  const [isSuggestingComplianceInternal, setIsSuggestingComplianceInternal] = useState(false); 

  const callSuggestClaimsAIInternal = async () => {
    const claims = await handleSuggestClaimsAI(form, toast, setIsSuggestingClaimsInternal);
    if (claims) {
        setSuggestedClaims(claims); 
    } else {
        setSuggestedClaims([]); 
    }
  };

  const callSuggestKeyCompliancePointsAIInternal = async () => {
    const points = await handleSuggestKeyCompliancePointsAI(form, toast, setIsSuggestingComplianceInternal);
    if (points) {
        setSuggestedKeyCompliancePoints(points);
    } else {
        setSuggestedKeyCompliancePoints([]);
    }
  };
  
  const anyLocalAISuggestionInProgress = isSuggestingClaimsInternal || isSuggestingComplianceInternal;

  return (
    <div className="space-y-6 pt-4">
      <FormField
        control={form.control}
        name="productDetails.materials"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Key Materials
              <AiIndicator fieldOrigin={form.getValues("productDetailsOrigin.materialsOrigin") || initialData?.productDetailsOrigin?.materialsOrigin} fieldName="Key Materials" />
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., Organic Cotton, Recycled PET, Aluminum (comma-separated)"
                {...field}
                rows={3}
                onChange={(e) => { field.onChange(e); form.setValue("productDetailsOrigin.materialsOrigin" as any, "manual"); }}
              />
            </FormControl>
            <FormDescription>List primary materials. This helps AI suggest relevant claims.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="productDetails.sustainabilityClaims"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel className="flex items-center">
                Sustainability Claims
                <AiIndicator fieldOrigin={form.getValues("productDetailsOrigin.sustainabilityClaimsOrigin") || initialData?.productDetailsOrigin?.sustainabilityClaimsOrigin} fieldName="Sustainability Claims" />
              </FormLabel>
              <Button type="button" variant="ghost" size="sm" onClick={callSuggestClaimsAIInternal} disabled={anyLocalAISuggestionInProgress || !!isSubmittingForm}>
                {isSuggestingClaimsInternal ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-info" />}
                <span className="ml-2">{isSuggestingClaimsInternal ? "Suggesting..." : "Suggest Claims"}</span>
              </Button>
            </div>
            <FormControl>
              <Textarea
                placeholder="e.g., - Made with 70% recycled materials\n- Carbon neutral production"
                {...field}
                rows={4}
                onChange={(e) => { field.onChange(e); form.setValue("productDetailsOrigin.sustainabilityClaimsOrigin" as any, "manual"); }}
              />
            </FormControl>
            <FormDescription>
              Enter sustainability claims manually, one per line (optionally start with '- '). Or, use AI suggestions which will be appended.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <AiSuggestionDisplay
        suggestions={suggestedClaims}
        onAddSuggestion={handleClaimClick}
        title="AI Suggested Sustainability Claims:"
        itemNoun="claim"
      />

      <FormField
        control={form.control}
        name="productDetails.keyCompliancePoints"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel className="flex items-center">
                Key Compliance Points
                <AiIndicator fieldOrigin={form.getValues("productDetailsOrigin.keyCompliancePointsOrigin") || initialData?.productDetailsOrigin?.keyCompliancePointsOrigin} fieldName="Key Compliance Points" />
              </FormLabel>
              <Button type="button" variant="ghost" size="sm" onClick={callSuggestKeyCompliancePointsAIInternal} disabled={anyLocalAISuggestionInProgress || !!isSubmittingForm}>
                {isSuggestingComplianceInternal ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-info" />}
                <span className="ml-2">{isSuggestingComplianceInternal ? "Suggesting..." : "Suggest Points"}</span>
              </Button>
            </div>
            <FormControl>
              <Textarea
                placeholder="e.g., - EU ESPR Compliant\n- RoHS Certified\n- Battery Passport Ready"
                {...field}
                rows={4}
                onChange={(e) => { field.onChange(e); form.setValue("productDetailsOrigin.keyCompliancePointsOrigin" as any, "manual"); }}
              />
            </FormControl>
            <FormDescription>
              List key compliance aspects, one per line. AI can help suggest these based on product category and applicable regulations.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <AiSuggestionDisplay
        suggestions={suggestedKeyCompliancePoints}
        onAddSuggestion={(point) => {
            const currentPoints = form.getValues("productDetails.keyCompliancePoints") || "";
            form.setValue("productDetails.keyCompliancePoints", currentPoints ? `${currentPoints}\n- ${point}` : `- ${point}`, { shouldValidate: true });
        }}
        title="AI Suggested Key Compliance Points:"
        itemNoun="compliance point"
      />

      <FormField
        control={form.control}
        name="productDetails.energyLabel"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Energy Label
              <AiIndicator fieldOrigin={form.getValues("productDetailsOrigin.energyLabelOrigin") || initialData?.productDetailsOrigin?.energyLabelOrigin} fieldName="Energy Label" />
            </FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., A++, B, Not Applicable"
                {...field}
                onChange={(e) => { field.onChange(e); form.setValue("productDetailsOrigin.energyLabelOrigin" as any, "manual"); }}
              />
            </FormControl>
            <FormDescription>Specify the product's energy efficiency rating, if applicable.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

```
- workspace/src/components/products/ui/ProductCard.tsx:
```tsx

// --- File: ProductCard.tsx ---
// Description: Card component for displaying a single product in a grid view.
"use client";

import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getAiHintForImage } from '@/utils/imageUtils';
import { ProductCompletenessIndicator } from './ProductCompletenessIndicator';
import ProductStatusBadge from './ProductStatusBadge';
import ProductComplianceBadge from './ProductComplianceBadge';
import type { UserRole } from '@/contexts/RoleContext';
import type { DisplayableProduct } from '@/types/dpp';

interface ProductCardProps {
  product: DisplayableProduct & { completeness: { score: number; filledFields: number; totalFields: number; missingFields: string[] } };
  currentRole: UserRole;
  onDeleteProduct: (product: DisplayableProduct) => void;
}

const ProductCard = memo<ProductCardProps>(({ product, currentRole, onDeleteProduct }) => {
  const canEdit = (currentRole === 'admin' || currentRole === 'manufacturer') && product.id.startsWith("USER_PROD");
  const canDelete = (currentRole === 'admin' || currentRole === 'manufacturer') && product.id.startsWith("USER_PROD");
  const aiHint = getAiHintForImage({
    productName: product.productName,
    category: product.category,
    imageHint: product.imageHint,
  });

  return (
    <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold leading-tight mb-1">
              <Link href={`/products/${product.id}`} className="hover:underline text-primary">
                {product.productName || "Unnamed Product"}
              </Link>
            </CardTitle>
            <CardDescription className="text-xs">{product.id}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions for {product.productName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/products/${product.id}`}><Eye className="mr-2 h-4 w-4" /> View Details</Link>
              </DropdownMenuItem>
              {canEdit && <DropdownMenuItem asChild><Link href={`/products/edit?id=${product.id}`}><Edit className="mr-2 h-4 w-4" /> Edit</Link></DropdownMenuItem>}
              {canDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onDeleteProduct(product)} className="text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="text-xs text-muted-foreground pt-1">
          {product.category}
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="w-full aspect-[4/3] rounded-md overflow-hidden bg-muted">
          <Image
            src={product.imageUrl || "https://placehold.co/400x300.png?text=N/A"}
            alt={product.productName || "Product image"}
            width={400}
            height={300}
            className="object-cover w-full h-full"
            data-ai-hint={aiHint}
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Status:</span>
            <ProductStatusBadge status={product.status} />
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Compliance:</span>
            <ProductComplianceBadge compliance={product.compliance} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2">
        <span className="text-xs text-muted-foreground">DPP Completeness</span>
        <ProductCompletenessIndicator completenessData={product.completeness} />
      </CardFooter>
    </Card>
  );
});
ProductCard.displayName = 'ProductCard';
export default ProductCard;

```
- workspace/src/components/products/ui/ProductComplianceBadge.tsx:
```tsx
// This file is being moved from its old location.
// The new location is src/components/products/list/ProductComplianceBadge.tsx.
// This old file is being deleted.

```
- workspace/src/components/products/ui/ProductListSkeleton.tsx:
```tsx

// --- File: ProductListSkeleton.tsx ---
// Description: Skeleton loader for the product list grid.
"use client";

import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="flex flex-col">
          <CardHeader>
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </CardHeader>
          <CardContent className="flex-grow">
            <Skeleton className="h-full w-full aspect-[4/3] rounded-md" />
          </CardContent>
          <CardFooter className="flex-col items-start gap-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

```
- workspace/src/components/products/ui/ProductStatusBadge.tsx:
```tsx

// --- File: ProductStatusBadge.tsx ---
// Description: Component to display a product's status as a styled badge.
"use client";

import React from 'react';
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Info, Archive, FileEdit } from "lucide-react"; 
import { cn } from '@/lib/utils';
import type { DisplayableProduct } from "@/types/dpp";

interface ProductStatusBadgeProps {
  status: DisplayableProduct['status'];
}

export default function ProductStatusBadge({ status }: ProductStatusBadgeProps) {
  const getProductStatusBadgeVariant = (s: DisplayableProduct['status']) => {
    switch (s) {
      case "Active": return "default";
      case "Pending": return "outline";
      case "Draft": return "secondary";
      case "Archived": return "secondary";
      case "Flagged": return "destructive";
      default: return "secondary";
    }
  };

  const getProductStatusBadgeClass = (s: DisplayableProduct['status']) => {
    switch (s) {
        case "Active": return "bg-green-100 text-green-700 border-green-300";
        case "Pending": return "bg-yellow-100 text-yellow-700 border-yellow-300";
        case "Draft": return "bg-blue-100 text-blue-700 border-blue-300";
        case "Archived": return "bg-muted text-muted-foreground";
        case "Flagged": return "bg-red-100 text-red-700 border-red-300";
        default: return "bg-muted text-muted-foreground";
    }
  };

  const StatusIcon = 
    status === "Active" ? CheckCircle : 
    status === "Pending" ? Info :
    status === "Draft" ? FileEdit :
    status === "Archived" ? Archive : 
    status === "Flagged" ? AlertTriangle :
    Info;

  return (
    <Badge
      variant={getProductStatusBadgeVariant(status)}
      className={cn("capitalize", getProductStatusBadgeClass(status))}
    >
      <StatusIcon className="mr-1 h-3.5 w-3.5" />
      {status}
    </Badge>
  );
}

```
- workspace/src/hooks/useProductSearch.ts:
```tsx
// This file is obsolete and is being deleted.
// Search logic is now part of the `useProductList` hook.

```
- workspace/src/types/products/index.ts:
```ts
// This file is being deleted as it's part of an overly complex architecture.
// All types are now centralized in src/types/dpp.


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

const BASE_ESSENTIAL_FIELDS_CONFIG: Array<{
  key: string; // Use string to accommodate dot notation
  label: string;
  check?: (p: DisplayableProduct) => boolean;
  categoryScope?: string[];
}> = [
  { key: 'productName', label: 'Product Name' },
  { key: 'gtin', label: 'GTIN' },
  { key: 'category', label: 'Category', check: p => !!(p.category || p.productCategory) },
  { key: 'manufacturer', label: 'Manufacturer' },
  { key: 'modelNumber', label: 'Model Number' },
  { key: 'productDetails.description', label: 'Description', check: p => !!(p.productDetails?.description) },
  { key: 'productDetails.imageUrl', label: 'Image URL', check: (p) => !!p.productDetails?.imageUrl && !p.productDetails.imageUrl.includes('placehold.co') && !p.productDetails.imageUrl.includes('?text=') },
  { key: 'productDetails.materials', label: 'Materials Info', check: p => !!p.productDetails?.materials && p.productDetails.materials.trim() !== '' },
  { key: 'productDetails.sustainabilityClaims', label: 'Sustainability Claims', check: p => !!p.productDetails?.sustainabilityClaims && p.productDetails.sustainabilityClaims.trim() !== '' },
  { key: 'productDetails.energyLabel', label: 'Energy Label', categoryScope: ['Appliances', 'Electronics'] },
  { key: 'productDetails.specifications', label: 'Specifications', check: (p) => {
      const specs = p.productDetails?.specifications;
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
];

const BATTERY_FIELDS_CONFIG: Array<{
  key: string; // Use string for dot notation
  label: string;
  check?: (p: DisplayableProduct) => boolean;
}> = [
  { key: 'batteryRegulation.batteryChemistry', label: 'Battery Chemistry', check: p => !!p.batteryRegulation?.batteryChemistry },
  { key: 'batteryRegulation.stateOfHealth.value', label: 'Battery State of Health (SoH)', check: p => typeof p.batteryRegulation?.stateOfHealth?.value === 'number' && p.batteryRegulation.stateOfHealth.value !== null },
  { key: 'batteryRegulation.carbonFootprint.value', label: 'Battery Mfg. Carbon Footprint', check: p => typeof p.batteryRegulation?.carbonFootprint?.value === 'number' && p.batteryRegulation.carbonFootprint.value !== null },
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
    if (fieldConfig.check) {
      isFieldFilled = fieldConfig.check(product);
    } else {
      const keys = (fieldConfig.key as string).split('.');
      let value: any = product;
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          value = undefined;
          break;
        }
      }

      if (typeof value === 'object' && value !== null) {
        isFieldFilled = Object.keys(value).length > 0 || (Array.isArray(value) && value.length > 0);
      } else {
        isFieldFilled = value !== null && value !== undefined && String(value).trim() !== '' && String(value).toLowerCase().trim() !== 'n/a';
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

  "non-compliant": errorDisplay,
  non_conformant: errorDisplay,
  error: errorDisplay,
  "error during sync": errorDisplay,
  mismatch: errorDisplay,

  pending: pendingDisplay,
  "pending review": pendingDisplay,
  pending_review: pendingDisplay,
  pending_assessment: pendingDisplay,
  pending_verification: pendingDisplay,
  "in progress": pendingDisplay,
  "data incomplete": pendingDisplay,
  "data mismatch": pendingDisplay, // This was in errorDisplay, but can also mean pending action
  "product not found in eprel": pendingDisplay,
  "pending notification": pendingDisplay,
  "pending documents": pendingDisplay,


  "not applicable": defaultDisplay,
  "n/a": defaultDisplay,
  "not found": defaultDisplay,
  "not verified": defaultDisplay,
  "not required": defaultDisplay,
  default: defaultDisplay,
};

export const getStatusIcon = (status?: string): JSX.Element => {
  const key = status?.toLowerCase().trim() ?? 'default';
  return STATUS_DISPLAY_MAP[key]?.icon ?? STATUS_DISPLAY_MAP.default.icon;
};

export const getStatusBadgeVariant = (status?: string): "default" | "destructive" | "outline" | "secondary" => {
  const key = status?.toLowerCase().trim() ?? 'default';
  return STATUS_DISPLAY_MAP[key]?.variant ?? STATUS_DISPLAY_MAP.default.variant;
};

export const getStatusBadgeClasses = (status?: string): string => {
  const key = status?.toLowerCase().trim() ?? 'default';
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
- workspace/src/utils/productDetailUtils.ts:
```ts

// --- File: src/utils/productDetailUtils.ts ---
// Description: Utilities for fetching and preparing product details for display.


import { USER_PRODUCTS_LOCAL_STORAGE_KEY } from '@/types/dpp';
import { MOCK_DPPS } from '@/data';
import type { DigitalProductPassport, StoredUserProduct, SimpleProductDetail, ComplianceDetailItem, EbsiVerificationDetails, CustomAttribute, SimpleCertification, Certification, ScipNotificationDetails, EuCustomsDataDetails, BatteryRegulationDetails, EsprSpecifics, DigitalTwinData } from '@/types/dpp';
import { getOverallComplianceDetails } from '@/utils/dppDisplayUtils';

// Helper function to map DigitalProductPassport to SimpleProductDetail
function mapDppToSimpleProductDetail(dpp: DigitalProductPassport): SimpleProductDetail {
    const mapStatus = (status: DigitalProductPassport['metadata']['status']): SimpleProductDetail['status'] => {
        switch (status) {
            case 'published': return 'Active';
            case 'archived': return 'Archived';
            case 'pending_review': return 'Pending';
            case 'draft': return 'Draft';
            case 'revoked': return 'Archived'; // Consider revoked as archived for simple view
            case 'flagged': return 'Flagged'; // Added Flagged status
            default: return 'Draft';
        }
    };

    const specificRegulations: ComplianceDetailItem[] = [];
    
    if (dpp.compliance.eu_espr) {
        specificRegulations.push({
            regulationName: "EU ESPR",
            status: dpp.compliance.eu_espr.status as ComplianceDetailItem['status'],
            detailsUrl: dpp.compliance.eu_espr.reportUrl,
            verificationId: dpp.compliance.eu_espr.vcId,
            lastChecked: dpp.metadata.last_updated, 
        });
    }
    if (dpp.compliance.esprConformity) {
         specificRegulations.push({
            regulationName: "ESPR Conformity Assessment",
            status: dpp.compliance.esprConformity.status as ComplianceDetailItem['status'],
            verificationId: dpp.compliance.esprConformity.assessmentId || dpp.compliance.esprConformity.vcId,
            lastChecked: dpp.compliance.esprConformity.assessmentDate || dpp.metadata.last_updated,
        });
    }
    if (dpp.compliance.us_scope3) {
        specificRegulations.push({
            regulationName: "US Scope 3 Emissions",
            status: dpp.compliance.us_scope3.status as ComplianceDetailItem['status'],
            detailsUrl: dpp.compliance.us_scope3.reportUrl,
            verificationId: dpp.compliance.us_scope3.vcId,
            lastChecked: dpp.metadata.last_updated, 
        });
    }

    const complianceOverallStatusDetails = getOverallComplianceDetails(dpp);
    
    const customAttributes = dpp.productDetails?.customAttributes || [];
    const mappedCertifications: SimpleCertification[] = dpp.certifications?.map(cert => ({
        id: cert.id, 
        name: cert.name,
        authority: cert.issuer,
        standard: cert.standard,
        issueDate: cert.issueDate,
        expiryDate: cert.expiryDate,
        documentUrl: cert.documentUrl,
        isVerified: !!(cert.vcId || cert.transactionHash),
        vcId: cert.vcId,
        transactionHash: cert.transactionHash,
    })) || [];

    return {
        id: dpp.id,
        productName: dpp.productName,
        category: dpp.category,
        status: mapStatus(dpp.metadata.status),
        manufacturer: dpp.manufacturer?.name,
        gtin: dpp.gtin,
        modelNumber: dpp.modelNumber,
        sku: dpp.sku,
        nfcTagId: dpp.nfcTagId,
        rfidTagId: dpp.rfidTagId,
        description: dpp.productDetails?.description,
        imageUrl: dpp.productDetails?.imageUrl,
        imageHint: dpp.productDetails?.imageHint,
        keySustainabilityPoints: dpp.productDetails?.sustainabilityClaims?.map(c => c.claim).filter(Boolean) || [],
        keyCompliancePoints: dpp.productDetails?.keyCompliancePoints, 
        specifications: dpp.productDetails?.specifications,
        customAttributes: customAttributes,
        productDetails: { 
            esprSpecifics: dpp.productDetails?.esprSpecifics,
            carbonFootprint: dpp.productDetails?.carbonFootprint,
            digitalTwin: dpp.productDetails?.digitalTwin, // Include digitalTwin
            conflictMineralsReportUrl: dpp.productDetails?.conflictMineralsReportUrl,
            fairTradeCertificationId: dpp.productDetails?.fairTradeCertificationId,
            ethicalSourcingPolicyUrl: dpp.productDetails?.ethicalSourcingPolicyUrl,
        },
        complianceSummary: {
            overallStatus: complianceOverallStatusDetails.text,
            eprel: dpp.compliance.eprel ? {
                id: dpp.compliance.eprel.id,
                status: dpp.compliance.eprel.status,
                url: dpp.compliance.eprel.url,
                lastChecked: dpp.compliance.eprel.lastChecked,
            } : { status: 'N/A', lastChecked: new Date().toISOString() },
            ebsi: dpp.ebsiVerification ? {
                status: dpp.ebsiVerification.status,
                verificationId: dpp.ebsiVerification.verificationId,
                lastChecked: dpp.ebsiVerification.lastChecked,
            } : { status: 'N/A', lastChecked: new Date().toISOString() },
            scip: dpp.compliance.scipNotification, 
            euCustomsData: dpp.compliance.euCustomsData, 
            battery: dpp.compliance.battery_regulation,
            specificRegulations: specificRegulations,
        },
        lifecycleEvents: dpp.lifecycleEvents?.map(event => ({
            id: event.id,
            eventName: event.type,
            date: event.timestamp,
            location: event.location,
            notes: event.data ? `Data: ${JSON.stringify(event.data)}` : (event.responsibleParty ? `Responsible: ${event.responsibleParty}` : undefined),
            status: event.transactionHash ? 'Completed' : (event.type.toLowerCase().includes('schedul') || event.type.toLowerCase().includes('upcoming') ? 'Upcoming' : 'In Progress'),
            iconName: event.type.toLowerCase().includes('manufactur') ? 'Factory' :
                      event.type.toLowerCase().includes('ship') ? 'Truck' :
                      event.type.toLowerCase().includes('quality') || event.type.toLowerCase().includes('certif') ? 'ShieldCheck' :
                      event.type.toLowerCase().includes('sale') || event.type.toLowerCase().includes('sold') ? 'ShoppingCart' :
                      'Info',
        })) || [],
        materialsUsed: dpp.productDetails?.materials?.map(m => ({ name: m.name, percentage: m.percentage, source: m.origin, isRecycled: m.isRecycled })),
        energyLabelRating: dpp.productDetails?.energyLabel,
        repairability: dpp.productDetails?.repairabilityScore ? { score: dpp.productDetails.repairabilityScore.value, scale: dpp.productDetails.repairabilityScore.scale, detailsUrl: dpp.productDetails.repairabilityScore.reportUrl } : undefined,
        recyclabilityInfo: dpp.productDetails?.recyclabilityInformation ? { percentage: dpp.productDetails.recyclabilityInformation.recycledContentPercentage, instructionsUrl: dpp.productDetails.recyclabilityInformation.instructionsUrl } : undefined,
        supplyChainLinks: dpp.supplyChainLinks || [],
        certifications: mappedCertifications,
        authenticationVcId: dpp.authenticationVcId,
        ownershipNftLink: dpp.ownershipNftLink,
        blockchainPlatform: dpp.blockchainIdentifiers?.platform,
        contractAddress: dpp.blockchainIdentifiers?.contractAddress,
        tokenId: dpp.blockchainIdentifiers?.tokenId,
        anchorTransactionHash: dpp.blockchainIdentifiers?.anchorTransactionHash,
        ebsiStatus: dpp.ebsiVerification?.status, 
        ebsiVerificationId: dpp.ebsiVerification?.verificationId, 
        onChainStatus: dpp.metadata.onChainStatus,
        onChainLifecycleStage: dpp.metadata.onChainLifecycleStage,
        textileInformation: dpp.textileInformation, 
        constructionProductInformation: dpp.constructionProductInformation, 
        batteryRegulation: dpp.compliance.battery_regulation, 
        lastUpdated: dpp.metadata.last_updated,
        conflictMineralsReportUrl: dpp.productDetails?.conflictMineralsReportUrl, 
        fairTradeCertificationId: dpp.productDetails?.fairTradeCertificationId, 
        ethicalSourcingPolicyUrl: dpp.productDetails?.ethicalSourcingPolicyUrl, 
    };
}


export async function fetchProductDetails(productId: string): Promise<SimpleProductDetail | null> {
  await new Promise(resolve => setTimeout(resolve, 0)); 

  const storedProductsString = typeof window !== 'undefined' ? localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY) : null;
  if (storedProductsString) {
    const userProducts: StoredUserProduct[] = JSON.parse(storedProductsString);
    const userProductData = userProducts.find(p => p.id === productId);
    if (userProductData) {
      let parsedCustomAttributes: CustomAttribute[] = [];
      if (userProductData.productDetails?.customAttributesJsonString) { 
          try {
              const parsed = JSON.parse(userProductData.productDetails.customAttributesJsonString);
              if (Array.isArray(parsed)) parsedCustomAttributes = parsed;
          } catch (e) { console.error("Failed to parse customAttributesJsonString from localStorage for USER_PROD:", e); }
      }
      const certificationsForUserProd: Certification[] = userProductData.certifications?.map(sc => ({
          id: sc.id || `cert_user_${sc.name.replace(/\s+/g, '_')}_${Math.random().toString(36).slice(2, 7)}`,
          name: sc.name,
          issuer: sc.authority,
          issueDate: sc.issueDate,
          expiryDate: sc.expiryDate,
          documentUrl: sc.documentUrl,
          standard: sc.standard,
          vcId: sc.vcId,
          transactionHash: sc.transactionHash,
      })) || [];
      
      const complianceSummaryFromStorage = userProductData.complianceSummary || { overallStatus: 'N/A' as SimpleProductDetail['complianceSummary']['overallStatus'] };
      const ebsiFromStorage = complianceSummaryFromStorage.ebsi;

      const dppEquivalent: DigitalProductPassport = {
        id: userProductData.id,
        productName: userProductData.productName || "N/A",
        category: userProductData.productCategory || "N/A",
        manufacturer: userProductData.manufacturer ? { name: userProductData.manufacturer } : undefined,
        modelNumber: userProductData.modelNumber,
        sku: userProductData.sku,
        nfcTagId: userProductData.nfcTagId,
        rfidTagId: userProductData.rfidTagId,
        gtin: userProductData.gtin,
        metadata: {
          status: (userProductData.status?.toLowerCase() as DigitalProductPassport['metadata']['status']) || 'draft',
          last_updated: userProductData.lastUpdated || new Date().toISOString(),
          created_at: userProductData.metadata?.created_at || userProductData.lastUpdated || new Date().toISOString(),
          onChainStatus: userProductData.metadata?.onChainStatus,
          onChainLifecycleStage: userProductData.metadata?.onChainLifecycleStage,
          dppStandardVersion: userProductData.metadata?.dppStandardVersion,
        },
        productDetails: {
          description: userProductData.productDetails?.description, 
          imageUrl: userProductData.productDetails?.imageUrl,
          imageHint: userProductData.productDetails?.imageHint,
          sustainabilityClaims: userProductData.productDetails?.sustainabilityClaims?.split('\n').map(s => ({ claim: s.trim() })).filter(c => c.claim) || [],
          keyCompliancePoints: userProductData.productDetails?.keyCompliancePoints, 
          materials: userProductData.productDetails?.materials?.split(',').map(m => ({ name: m.trim() })) || [],
          energyLabel: userProductData.productDetails?.energyLabel,
          specifications: userProductData.productDetails?.specifications,
          customAttributes: parsedCustomAttributes,
          conflictMineralsReportUrl: userProductData.productDetails?.conflictMineralsReportUrl, 
          fairTradeCertificationId: userProductData.productDetails?.fairTradeCertificationId, 
          ethicalSourcingPolicyUrl: userProductData.productDetails?.ethicalSourcingPolicyUrl, 
          esprSpecifics: userProductData.productDetails?.esprSpecifics,
          carbonFootprint: userProductData.productDetails?.carbonFootprint,
          digitalTwin: userProductData.productDetails?.digitalTwin, 
        },
        compliance: { 
          eprel: userProductData.complianceData?.eprel || complianceSummaryFromStorage.eprel,
          scipNotification: userProductData.complianceData?.scipNotification || complianceSummaryFromStorage.scip,
          euCustomsData: userProductData.complianceData?.euCustomsData || complianceSummaryFromStorage.euCustomsData,
          battery_regulation: userProductData.complianceData?.battery_regulation || userProductData.batteryRegulation || complianceSummaryFromStorage.battery,
          esprConformity: userProductData.complianceData?.esprConformity,
        },
        ebsiVerification: ebsiFromStorage ? {
          status: ebsiFromStorage.status as EbsiVerificationDetails['status'],
          verificationId: ebsiFromStorage.verificationId,
          lastChecked: ebsiFromStorage.lastChecked,
        } : undefined,
        lifecycleEvents: userProductData.lifecycleEvents?.map(e => ({
          id: e.id,
          type: e.eventName,
          timestamp: e.date,
          location: e.location,
          data: e.notes ? { notes: e.notes } : undefined,
        })),
        certifications: certificationsForUserProd,
        supplyChainLinks: userProductData.supplyChainLinks || [],
        authenticationVcId: userProductData.authenticationVcId, 
        ownershipNftLink: userProductData.ownershipNftLink, 
        blockchainIdentifiers: userProductData.blockchainIdentifiers,
        textileInformation: userProductData.textileInformation,
        constructionProductInformation: userProductData.constructionProductInformation,
      };
      return mapDppToSimpleProductDetail(dppEquivalent);
    }
  }

  let canonicalLookupId = productId;
  if (productId.startsWith("PROD") && !productId.startsWith("USER_PROD")) {
    canonicalLookupId = productId.replace("PROD", "DPP");
  }
  
  const foundMockDpp = MOCK_DPPS.find(dpp => dpp.id === canonicalLookupId);
  if (foundMockDpp) {
    return mapDppToSimpleProductDetail(foundMockDpp);
  }
  
  if (productId !== canonicalLookupId) {
    const foundMockDppOriginalId = MOCK_DPPS.find(dpp => dpp.id === productId);
    if (foundMockDppOriginalId) {
      return mapDppToSimpleProductDetail(foundMockDppOriginalId);
    }
  }

  return null;
}

```
- workspace/src/utils/sortUtils.ts:
```ts

// --- File: src/utils/sortUtils.ts ---
// Description: Utility functions for sorting Digital Product Passports.

import type { DigitalProductPassport, SortableKeys, DisplayableProduct } from '@/types/dpp';

/**
 * Returns the value to use when sorting a DPP by the given key.
 * Handles nested keys and special cases.
 */
export function getSortValue(dpp: DigitalProductPassport | DisplayableProduct, key: SortableKeys): any {
  if (key === 'metadata.status' || key === 'status') {
    return 'metadata' in dpp ? dpp.metadata.status : dpp.status;
  }
  if (key === 'metadata.last_updated' || key === 'lastUpdated') {
    const dateStr = 'metadata' in dpp ? dpp.metadata.last_updated : dpp.lastUpdated;
    return dateStr ? new Date(dateStr).getTime() : 0;
  }
  if (key === 'ebsiVerification.status' || key === 'ebsiStatus') {
    return 'ebsiVerification' in dpp ? dpp.ebsiVerification?.status : dpp.ebsiStatus;
  }
  if (key === 'metadata.onChainStatus' || key === 'onChainStatus') {
    return 'metadata' in dpp ? dpp.metadata?.onChainStatus : dpp.onChainStatus;
  }
  if (key === 'compliance') {
    // This key is used for the badge, but if we want to sort by it, we need a rule.
    // Let's sort by the text representation of compliance.
    const complianceText = 'complianceSummary' in dpp ? dpp.complianceSummary?.overallStatus : (dpp as any).compliance;
    return complianceText || '';
  }

  // Handle direct properties
  if (key in dpp) {
    return (dpp as any)[key];
  }

  return null; // Fallback for unhandled keys
}

```
- workspace/src/utils/dppEventTracker.ts:
```ts
// src/utils/dppEventTracker.ts
"use client"
import { ethers } from 'ethers';
import { DPP_TOKEN_ADDRESS } from '../config/contractAddresses';
// Assuming you have your DPPToken ABI available
// import DPPTokenABI from '../contracts/abi/DPPToken.json';

// Conceptual function to listen for DPPToken events
export const startTrackingDppEvents = (provider: ethers.Provider) => {
  // *** IMPORTANT ***
  // This is a conceptual example.
  // In a real application, you would likely use:
  // 1. A robust event indexing solution (like TheGraph, or a custom backend indexer)
  //    to reliably capture all past and future events.
  // 2. Proper error handling and connection management for the provider.
  // 3. Filtering logic based on specific token IDs or event types if needed.

  // Ensure the provider is connected
  if (!provider) {
    console.error("Provider not available for event tracking.");
    return;
  }

  try {
    // Create a contract instance using the conceptual address and ABI
    // Replace with your actual DPPToken ABI
    // const dppTokenContract = new ethers.Contract(DPP_TOKEN_ADDRESS, DPPTokenABI, provider);

    // Placeholder for contract instance creation with comments
    console.warn("Using conceptual contract instance for event tracking. Replace with real instance and ABI.");
    const dppTokenContract = {
        on: (eventName: string, callback: (...args: any[]) => void) => {
            console.log(`Conceptual listener for ${eventName} registered.`);
            // In a real implementation, this would set up an actual event listener
        }
    } as any; // Cast to any to avoid type errors with placeholder

    // --- Event Listeners ---

    // Listen for PassportMinted events
    dppTokenContract.on('PassportMinted', (tokenId: ethers.BigNumber, holder: string, metadataHash: string) => {
      console.log('PassportMinted Event:', {
        tokenId: tokenId.toString(),
        holder,
        metadataHash,
      });
      // Add logic to process the event (e.g., update a database, notify frontend)
    });

    // Listen for StatusUpdated events
    dppTokenContract.on('StatusUpdated', (tokenId: ethers.BigNumber, oldStatus: number, newStatus: number) => {
      console.log('StatusUpdated Event:', {
        tokenId: tokenId.toString(),
        oldStatus, // You might need to map these numbers to your Status enum
        newStatus,
      });
      // Add logic to process the event
    });

    // Listen for CustodyTransferred events
    dppTokenContract.on('CustodyTransferred', (tokenId: ethers.BigNumber, from: string, to: string) => {
      console.log('CustodyTransferred Event:', {
        tokenId: tokenId.toString(),
        from,
        to,
      });
      // Add logic to process the event
    });

    // Listen for MetadataUpdated events
    dppTokenContract.on('MetadataUpdated', (tokenId: ethers.BigNumber, oldMetadataHash: string, newMetadataHash: string) => {
      console.log('MetadataUpdated Event:', {
        tokenId: tokenId.toString(),
        oldMetadataHash,
        newMetadataHash,
      });
      // Add logic to process the event
    });

    console.log("Conceptual DPPToken event listeners started.");

  } catch (error) {
    console.error("Error setting up DPPToken event listeners:", error);
  }
};

// Example usage (conceptual):
// Assuming you have an ethers.js provider instance
// const provider = new ethers.JsonRpcProvider("YOUR_RPC_URL");
// startTrackingDppEvents(provider);
```