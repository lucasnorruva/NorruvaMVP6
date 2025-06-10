
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
import type { ProductSupplyChainLink, SimpleLifecycleEvent, ProductComplianceSummary, CustomAttribute } from "@/types/dpp";
import { fileToDataUri } from '@/utils/fileUtils'; // Import the utility function
import AiExtractionSection from "@/components/products/new/AiExtractionSection";
import ProductDetailsSection from "@/components/products/new/ProductDetailsSection";

export interface InitialProductFormData extends ProductFormData {
  productNameOrigin?: 'AI_EXTRACTED' | 'manual';
  productDescriptionOrigin?: 'AI_EXTRACTED' | 'manual';
  manufacturerOrigin?: 'AI_EXTRACTED' | 'manual';
  modelNumberOrigin?: 'AI_EXTRACTED' | 'manual';
  materialsOrigin?: 'AI_EXTRACTED' | 'manual';
  sustainabilityClaimsOrigin?: 'AI_EXTRACTED' | 'manual';
  energyLabelOrigin?: 'AI_EXTRACTED' | 'manual';
  specificationsOrigin?: 'AI_EXTRACTED' | 'manual';
  batteryChemistryOrigin?: 'AI_EXTRACTED' | 'manual';
  stateOfHealthOrigin?: 'AI_EXTRACTED' | 'manual';
  carbonFootprintManufacturingOrigin?: 'AI_EXTRACTED' | 'manual';
  recycledContentPercentageOrigin?: 'AI_EXTRACTED' | 'manual';
}

interface StoredUserProduct extends ProductFormData {
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
}

const USER_PRODUCTS_LOCAL_STORAGE_KEY = 'norruvaUserProducts';


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

  const defaultFormState: Partial<InitialProductFormData> = {
    productName: "", gtin: "", productDescription: "", manufacturer: "", modelNumber: "",
    materials: "", sustainabilityClaims: "", specifications: "", energyLabel: "", productCategory: "",
    imageUrl: "", imageHint: "", imageUrlOrigin: undefined,
    batteryChemistry: "", stateOfHealth: undefined, carbonFootprintManufacturing: undefined, recycledContentPercentage: undefined,
    customAttributesJsonString: "",
    productNameOrigin: undefined, productDescriptionOrigin: undefined, manufacturerOrigin: undefined,
    modelNumberOrigin: undefined, materialsOrigin: undefined, sustainabilityClaimsOrigin: undefined,
    energyLabelOrigin: undefined, specificationsOrigin: undefined, batteryChemistryOrigin: undefined,
    stateOfHealthOrigin: undefined, carbonFootprintManufacturingOrigin: undefined,
    recycledContentPercentageOrigin: undefined,
  };

  const [currentProductDataForForm, setCurrentProductDataForForm] = useState<Partial<InitialProductFormData>>(defaultFormState);

  useEffect(() => {
    if (isEditMode && editProductId) {
      const storedProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
      const userProducts: StoredUserProduct[] = storedProductsString ? JSON.parse(storedProductsString) : [];
      const productToEdit = userProducts.find(p => p.id === editProductId);
      if (productToEdit) {
        const editData: Partial<InitialProductFormData> = {
          ...productToEdit, 
          stateOfHealth: productToEdit.stateOfHealth ?? undefined,
          carbonFootprintManufacturing: productToEdit.carbonFootprintManufacturing ?? undefined,
          recycledContentPercentage: productToEdit.recycledContentPercentage ?? undefined,
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

      const aiInitialFormData: Partial<InitialProductFormData> = {};
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

      if (result.batteryChemistry) { aiInitialFormData.batteryChemistry = result.batteryChemistry; aiInitialFormData.batteryChemistryOrigin = 'AI_EXTRACTED'; }
      if (result.stateOfHealth !== undefined && result.stateOfHealth !== null) { aiInitialFormData.stateOfHealth = result.stateOfHealth; aiInitialFormData.stateOfHealthOrigin = 'AI_EXTRACTED'; }
      if (result.carbonFootprintManufacturing !== undefined && result.carbonFootprintManufacturing !== null) { aiInitialFormData.carbonFootprintManufacturing = result.carbonFootprintManufacturing; aiInitialFormData.carbonFootprintManufacturingOrigin = 'AI_EXTRACTED'; }
      if (result.recycledContentPercentage !== undefined && result.recycledContentPercentage !== null) { aiInitialFormData.recycledContentPercentage = result.recycledContentPercentage; aiInitialFormData.recycledContentPercentageOrigin = 'AI_EXTRACTED'; }

      aiInitialFormData.imageUrl = ""; 
      aiInitialFormData.imageHint = "";
      aiInitialFormData.imageUrlOrigin = undefined;
      aiInitialFormData.customAttributesJsonString = ""; 

      setCurrentProductDataForForm(prev => ({...prev, ...aiInitialFormData}));
      setAiExtractionAppliedSuccessfully(true);

      toast({
        title: "AI Extraction Complete!",
        description: "Information has been extracted from your document. Please review and complete the details in the 'Manual Entry / Review' tab. Fields populated by AI are marked.",
        variant: "default",
        duration: 7000,
        action: <CheckCircle2 className="text-green-500" />,
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
        id: isEditMode && editProductId ? editProductId : `USER_PROD_${Date.now().toString().slice(-6)}`, // Ensure USER_PROD prefix
        ...formDataFromForm, 
        productName: formDataFromForm.productName || "Unnamed Product", 
        status: (isEditMode && editProductId ? (userProducts.find(p => p.id === editProductId)?.status) : "Draft") || "Draft",
        compliance: (isEditMode && editProductId ? (userProducts.find(p => p.id === editProductId)?.compliance) : "N/A") || "N/A",
        lastUpdated: new Date().toISOString(),
        supplyChainLinks: isEditMode && editProductId ? (userProducts.find(p => p.id === editProductId)?.supplyChainLinks) || [] : [],
        lifecycleEvents: isEditMode && editProductId ? (userProducts.find(p => p.id === editProductId)?.lifecycleEvents) || [] : [],
        complianceSummary: isEditMode && editProductId ? (userProducts.find(p => p.id === editProductId)?.complianceSummary) : undefined,
      };


      if (isEditMode && editProductId) {
        const productIndex = userProducts.findIndex(p => p.id === editProductId);
        if (productIndex > -1) {
          userProducts[productIndex] = {
            ...userProducts[productIndex], 
            ...productCoreData, 
          };
          localStorage.setItem(USER_PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(userProducts));
          toast({ title: "Product Updated", description: `${productCoreData.productName} has been updated.`, variant: "default", action: <CheckCircle2 className="text-green-500" /> });
          router.push(`/products/${editProductId}`);
        } else {
          throw new Error("Product not found for update.");
        }
      } else {
        userProducts.push(productCoreData);
        localStorage.setItem(USER_PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(userProducts));
        toast({ title: "Product Saved", description: `${productCoreData.productName} has been saved.`, variant: "default", action: <CheckCircle2 className="text-green-500" /> });
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
    
