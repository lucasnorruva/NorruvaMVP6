
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { ProductFormData } from "@/components/products/ProductForm";
import { extractProductData } from "@/ai/flows/extract-product-data";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, CheckCircle2, Info, Edit, Compass, Wand2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProductSupplyChainLink, SimpleLifecycleEvent, ProductComplianceSummary, CustomAttribute, BatteryRegulationDetails, ScipNotificationDetails, EuCustomsDataDetails, TextileInformation, ConstructionProductInformation } from "@/types/dpp"; 
import { fileToDataUri } from '@/utils/fileUtils';
import AiExtractionSection from "@/components/products/new/AiExtractionSection";
import ProductDetailsSection from "@/components/products/new/ProductDetailsSection";

type AiOrigin = 'AI_EXTRACTED' | 'manual' | undefined;

interface BatteryRegulationOrigin {
  batteryChemistryOrigin?: AiOrigin;
  batteryPassportIdOrigin?: AiOrigin;
  carbonFootprintOrigin?: {
    valueOrigin?: AiOrigin;
    unitOrigin?: AiOrigin;
    calculationMethodOrigin?: AiOrigin;
    vcIdOrigin?: AiOrigin;
  };
  recycledContentOrigin?: Array<{
    materialOrigin?: AiOrigin;
    percentageOrigin?: AiOrigin;
    vcIdOrigin?: AiOrigin;
  }>;
  stateOfHealthOrigin?: {
    valueOrigin?: AiOrigin;
    unitOrigin?: AiOrigin;
    measurementDateOrigin?: AiOrigin;
    vcIdOrigin?: AiOrigin;
  };
  vcIdOrigin?: AiOrigin;
}

export interface InitialProductFormData extends Omit<ProductFormData, 'batteryRegulation' | 'compliance'> {
  productNameOrigin?: AiOrigin;
  productDescriptionOrigin?: AiOrigin;
  manufacturerOrigin?: AiOrigin;
  modelNumberOrigin?: AiOrigin;
  materialsOrigin?: AiOrigin;
  sustainabilityClaimsOrigin?: AiOrigin;
  energyLabelOrigin?: AiOrigin;
  specificationsOrigin?: AiOrigin;
  imageUrlOrigin?: 'AI_EXTRACTED' | 'manual' | undefined;
  batteryRegulation?: Partial<BatteryRegulationDetails>;
  batteryRegulationOrigin?: BatteryRegulationOrigin;
  compliance?: {
    eprel?: Partial<ProductFormData['compliance']['eprel']>;
    esprConformity?: Partial<ProductFormData['compliance']['esprConformity']>;
    scipNotification?: Partial<ScipNotificationDetails>;
    euCustomsData?: Partial<EuCustomsDataDetails>;
    battery_regulation?: Partial<BatteryRegulationDetails>;
  };
  textileInformation?: Partial<TextileInformation>; 
  constructionProductInformation?: Partial<ConstructionProductInformation>; 
  onChainStatus?: string; 
  onChainLifecycleStage?: string; 
}


export interface StoredUserProduct extends Omit<ProductFormData, 'batteryRegulation' | 'compliance'> {
  id: string;
  status: string; 
  compliance: string; 
  lastUpdated: string;
  productCategory?: string;
  keySustainabilityPoints?: string[];
  keyCompliancePoints?: string[];
  materialsUsed?: { name: string; percentage?: number; source?: string; isRecycled?: boolean }[];
  energyLabelRating?: string;
  repairability?: { score: number; scale: number; detailsUrl?: string };
  recyclabilityInfo?: { percentage?: number; instructionsUrl?: string };
  supplyChainLinks?: ProductSupplyChainLink[];
  lifecycleEvents?: SimpleLifecycleEvent[];
  complianceSummary?: ProductComplianceSummary; 
  
  complianceData?: { 
    eprel?: Partial<ProductFormData['compliance']['eprel']>;
    esprConformity?: Partial<ProductFormData['compliance']['esprConformity']>;
    scipNotification?: Partial<ScipNotificationDetails>;
    euCustomsData?: Partial<EuCustomsDataDetails>;
    battery_regulation?: Partial<BatteryRegulationDetails>;
  };
  batteryRegulation?: Partial<BatteryRegulationDetails>;
  textileInformation?: Partial<TextileInformation>; 
  constructionProductInformation?: Partial<ConstructionProductInformation>; 
  metadata?: { 
    onChainStatus?: string;
    onChainLifecycleStage?: string;
    created_at?: string;
    last_updated?: string;
    status?: string;
    dppStandardVersion?: string;
  };
}

const USER_PRODUCTS_LOCAL_STORAGE_KEY = 'norruvaUserProducts';

const defaultBatteryRegulationState: Partial<BatteryRegulationDetails> = {
  status: "not_applicable", batteryChemistry: "", batteryPassportId: "",
  carbonFootprint: { value: null, unit: "", calculationMethod: "", vcId: "" },
  recycledContent: [],
  stateOfHealth: { value: null, unit: "", measurementDate: "", vcId: "" },
  vcId: "",
};

const defaultBatteryRegulationOriginState: BatteryRegulationOrigin = {
  batteryChemistryOrigin: undefined, batteryPassportIdOrigin: undefined,
  carbonFootprintOrigin: { valueOrigin: undefined, unitOrigin: undefined, calculationMethodOrigin: undefined, vcIdOrigin: undefined, },
  recycledContentOrigin: [],
  stateOfHealthOrigin: { valueOrigin: undefined, unitOrigin: undefined, measurementDateOrigin: undefined, vcIdOrigin: undefined, },
  vcIdOrigin: undefined,
};

const defaultScipNotificationState: Partial<ScipNotificationDetails> = {
  status: "N/A", notificationId: "", svhcListVersion: "", submittingLegalEntity: "",
  articleName: "", primaryArticleId: "", safeUseInstructionsLink: ""
};

const defaultEuCustomsDataState: Partial<EuCustomsDataDetails> = {
  status: "N/A", declarationId: "", hsCode: "", countryOfOrigin: "",
  netWeightKg: null, grossWeightKg: null,
  customsValuation: { value: null, currency: "" }
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
    productName: "", gtin: "", sku: "", nfcTagId: "", rfidTagId: "", productDescription: "", manufacturer: "", modelNumber: "",
    materials: "", sustainabilityClaims: "", specifications: "", energyLabel: "", productCategory: "",
    imageUrl: "", imageHint: "", imageUrlOrigin: undefined,
    onChainStatus: "Unknown", 
    onChainLifecycleStage: "Unknown", 
    batteryRegulation: { ...defaultBatteryRegulationState },
    customAttributesJsonString: "",
    productNameOrigin: undefined, productDescriptionOrigin: undefined, manufacturerOrigin: undefined,
    modelNumberOrigin: undefined, materialsOrigin: undefined, sustainabilityClaimsOrigin: undefined,
    energyLabelOrigin: undefined, specificationsOrigin: undefined,
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
          ...productToEdit,
          onChainStatus: productToEdit.metadata?.onChainStatus || "Unknown", 
          onChainLifecycleStage: productToEdit.metadata?.onChainLifecycleStage || "Unknown", 
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
          batteryRegulationOrigin: { ...defaultBatteryRegulationOriginState }, 
          productNameOrigin: productToEdit.productNameOrigin || undefined,
          productDescriptionOrigin: productToEdit.productDescriptionOrigin || undefined,
          manufacturerOrigin: productToEdit.manufacturerOrigin || undefined,
          modelNumberOrigin: productToEdit.modelNumberOrigin || undefined,
          materialsOrigin: productToEdit.materialsOrigin || undefined,
          sustainabilityClaimsOrigin: productToEdit.sustainabilityClaimsOrigin || undefined,
          energyLabelOrigin: productToEdit.energyLabelOrigin || undefined,
          specificationsOrigin: productToEdit.specificationsOrigin || undefined,
          imageUrlOrigin: productToEdit.imageUrlOrigin || undefined,
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
        batteryRegulation: { ...defaultBatteryRegulationState },
        batteryRegulationOrigin: { ...defaultBatteryRegulationOriginState },
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
      if (result.productDescription) { aiInitialFormData.productDescription = result.productDescription; aiInitialFormData.productDescriptionOrigin = 'AI_EXTRACTED'; }
      if (result.manufacturer) { aiInitialFormData.manufacturer = result.manufacturer; aiInitialFormData.manufacturerOrigin = 'AI_EXTRACTED'; }
      if (result.modelNumber) { aiInitialFormData.modelNumber = result.modelNumber; aiInitialFormData.modelNumberOrigin = 'AI_EXTRACTED'; }

      if (result.specifications && Object.keys(result.specifications).length > 0) {
        aiInitialFormData.specifications = JSON.stringify(result.specifications, null, 2);
        aiInitialFormData.specificationsOrigin = 'AI_EXTRACTED';
      } else {
        aiInitialFormData.specifications = "";
        if (result.specifications) aiInitialFormData.specificationsOrigin = 'AI_EXTRACTED';
      }

      if (result.energyLabel) { aiInitialFormData.energyLabel = result.energyLabel; aiInitialFormData.energyLabelOrigin = 'AI_EXTRACTED'; }

      if (result.batteryChemistry && aiInitialFormData.batteryRegulation) {
         aiInitialFormData.batteryRegulation.batteryChemistry = result.batteryChemistry;
         if (aiInitialFormData.batteryRegulationOrigin) aiInitialFormData.batteryRegulationOrigin.batteryChemistryOrigin = 'AI_EXTRACTED';
      }
      if (result.batteryPassportId && aiInitialFormData.batteryRegulation) {
        aiInitialFormData.batteryRegulation.batteryPassportId = result.batteryPassportId;
        if (aiInitialFormData.batteryRegulationOrigin) aiInitialFormData.batteryRegulationOrigin.batteryPassportIdOrigin = 'AI_EXTRACTED';
      }
      if (result.carbonFootprint && aiInitialFormData.batteryRegulation) {
        aiInitialFormData.batteryRegulation.carbonFootprint = {...result.carbonFootprint, value: result.carbonFootprint.value ?? null};
        if (aiInitialFormData.batteryRegulationOrigin) aiInitialFormData.batteryRegulationOrigin.carbonFootprintOrigin = { valueOrigin: 'AI_EXTRACTED', unitOrigin: 'AI_EXTRACTED', calculationMethodOrigin: 'AI_EXTRACTED', vcIdOrigin: 'AI_EXTRACTED'};
      }
      if (result.recycledContent && aiInitialFormData.batteryRegulation) {
        aiInitialFormData.batteryRegulation.recycledContent = result.recycledContent.map(rc => ({...rc, percentage: rc.percentage ?? null}));
        if (aiInitialFormData.batteryRegulationOrigin) aiInitialFormData.batteryRegulationOrigin.recycledContentOrigin = result.recycledContent.map(() => ({ materialOrigin: 'AI_EXTRACTED', percentageOrigin: 'AI_EXTRACTED', vcIdOrigin: 'AI_EXTRACTED' }));
      }
      if (result.stateOfHealth && aiInitialFormData.batteryRegulation) {
        aiInitialFormData.batteryRegulation.stateOfHealth = {...result.stateOfHealth, value: result.stateOfHealth.value ?? null};
        if (aiInitialFormData.batteryRegulationOrigin) aiInitialFormData.batteryRegulationOrigin.stateOfHealthOrigin = { valueOrigin: 'AI_EXTRACTED', unitOrigin: 'AI_EXTRACTED', measurementDateOrigin: 'AI_EXTRACTED', vcIdOrigin: 'AI_EXTRACTED'};
      }
      if (result.batteryRegulationVcId && aiInitialFormData.batteryRegulation) {
        aiInitialFormData.batteryRegulation.vcId = result.batteryRegulationVcId;
        if (aiInitialFormData.batteryRegulationOrigin) aiInitialFormData.batteryRegulationOrigin.vcIdOrigin = 'AI_EXTRACTED';
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

      aiInitialFormData.imageUrl = "";
      aiInitialFormData.imageHint = "";
      aiInitialFormData.imageUrlOrigin = undefined;
      aiInitialFormData.customAttributesJsonString = "";
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
          status: (isEditMode && editProductId ? userProducts.find(p => p.id === editProductId)?.metadata?.status : 'draft') || 'draft',
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
            lastChecked: new Date().toISOString(),
          } : undefined,
          battery: formDataFromForm.compliance?.battery_regulation ? { 
            status: formDataFromForm.compliance.battery_regulation.status || 'not_applicable',
            batteryChemistry: formDataFromForm.compliance.battery_regulation.batteryChemistry,
          } : undefined,
        },
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
