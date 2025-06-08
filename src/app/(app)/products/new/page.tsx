
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ProductForm, { type ProductFormData } from "@/components/products/ProductForm";
import { extractProductData } from "@/ai/flows/extract-product-data";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, CheckCircle2, Loader2, ScanLine, Info, Cpu, Edit, FileWarning } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProductSupplyChainLink, SimpleLifecycleEvent, ProductComplianceSummary, CustomAttribute } from "@/types/dpp";

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Extended ProductFormData to include origin fields for initial state management
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

// StoredUserProduct now directly uses fields from ProductFormData including origins
interface StoredUserProduct extends ProductFormData {
  id: string;
  status: string;
  compliance: string;
  lastUpdated: string;
  productCategory?: string; // Retain this as it might not be part of core ProductFormData for submission but useful for storage/display
  keySustainabilityPoints?: string[]; // Optional display fields
  keyCompliancePoints?: string[]; // Optional display fields
  materialsUsed?: { name: string; percentage?: number; source?: string; isRecycled?: boolean }[]; // Optional display fields
  energyLabelRating?: string; // Optional display fields
  repairability?: { score: number; scale: number; detailsUrl?: string }; // Optional display fields
  recyclabilityInfo?: { percentage?: number; instructionsUrl?: string }; // Optional display fields
  supplyChainLinks?: ProductSupplyChainLink[]; // Specific domain data
  lifecycleEvents?: SimpleLifecycleEvent[]; // Specific domain data
  complianceSummary?: ProductComplianceSummary; // Specific domain data
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
        // Map StoredUserProduct to InitialProductFormData, including origin fields
        const editData: Partial<InitialProductFormData> = {
          ...productToEdit, // This now includes origin fields if they were saved
          // Ensure numeric fields that could be null/undefined are handled
          stateOfHealth: productToEdit.stateOfHealth ?? undefined,
          carbonFootprintManufacturing: productToEdit.carbonFootprintManufacturing ?? undefined,
          recycledContentPercentage: productToEdit.recycledContentPercentage ?? undefined,
        };
        setCurrentProductDataForForm(editData);
        setActiveTab("manual");
        setAiExtractionAppliedSuccessfully(false); // Reset this flag for edit mode
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
      // Reset only AI-extractable fields or all? For now, keeping some user choices like category.
      setCurrentProductDataForForm(prev => ({
        ...defaultFormState, // Reset to defaults
        gtin: prev.gtin, // Keep GTIN if user typed it
        productCategory: prev.productCategory, // Keep category
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
        // If AI returned an empty object for specs, it's still an AI action.
        if (result.specifications) aiInitialFormData.specificationsOrigin = 'AI_EXTRACTED';
      }

      if (result.energyLabel) { aiInitialFormData.energyLabel = result.energyLabel; aiInitialFormData.energyLabelOrigin = 'AI_EXTRACTED'; }

      // Battery fields
      if (result.batteryChemistry) { aiInitialFormData.batteryChemistry = result.batteryChemistry; aiInitialFormData.batteryChemistryOrigin = 'AI_EXTRACTED'; }
      if (result.stateOfHealth !== undefined && result.stateOfHealth !== null) { aiInitialFormData.stateOfHealth = result.stateOfHealth; aiInitialFormData.stateOfHealthOrigin = 'AI_EXTRACTED'; }
      if (result.carbonFootprintManufacturing !== undefined && result.carbonFootprintManufacturing !== null) { aiInitialFormData.carbonFootprintManufacturing = result.carbonFootprintManufacturing; aiInitialFormData.carbonFootprintManufacturingOrigin = 'AI_EXTRACTED'; }
      if (result.recycledContentPercentage !== undefined && result.recycledContentPercentage !== null) { aiInitialFormData.recycledContentPercentage = result.recycledContentPercentage; aiInitialFormData.recycledContentPercentageOrigin = 'AI_EXTRACTED'; }

      // Reset image and custom attributes on new AI extraction
      aiInitialFormData.imageUrl = ""; 
      aiInitialFormData.imageHint = "";
      aiInitialFormData.imageUrlOrigin = undefined;
      aiInitialFormData.customAttributesJsonString = ""; // Reset custom attributes

      setCurrentProductDataForForm(prev => ({...prev, ...aiInitialFormData}));
      setAiExtractionAppliedSuccessfully(true);

      toast({
        title: "Data Extracted Successfully",
        description: "Review and complete the extracted information in the form now shown in 'Manual Entry / Review'. Fields suggested by AI are marked.",
        variant: "default",
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
      
      // Create a base product object from formDataFromForm.
      // The StoredUserProduct type is now aligned with ProductFormData for core fields + origins.
      const productCoreData: StoredUserProduct = {
        id: isEditMode && editProductId ? editProductId : `USER_PROD${Date.now().toString().slice(-6)}`,
        ...formDataFromForm, // This now includes xxxOrigin fields directly
        productName: formDataFromForm.productName || "Unnamed Product", // Ensure productName has a fallback
        // Set status and lastUpdated, preserve existing data if editing
        status: (isEditMode && editProductId ? (userProducts.find(p => p.id === editProductId)?.status) : "Draft") || "Draft",
        compliance: (isEditMode && editProductId ? (userProducts.find(p => p.id === editProductId)?.compliance) : "N/A") || "N/A",
        lastUpdated: new Date().toISOString(),
        // Preserve complex array/object fields if editing, otherwise initialize empty
        supplyChainLinks: isEditMode && editProductId ? (userProducts.find(p => p.id === editProductId)?.supplyChainLinks) || [] : [],
        lifecycleEvents: isEditMode && editProductId ? (userProducts.find(p => p.id === editProductId)?.lifecycleEvents) || [] : [],
        complianceSummary: isEditMode && editProductId ? (userProducts.find(p => p.id === editProductId)?.complianceSummary) : undefined,
        // These display-specific fields are not directly part of ProductFormData, they are derived for display
        // For StoredUserProduct, they can remain optional or be populated if ProductFormData starts including them.
        // For now, they are not directly transferred from formDataFromForm unless ProductFormData schema changes.
      };


      if (isEditMode && editProductId) {
        const productIndex = userProducts.findIndex(p => p.id === editProductId);
        if (productIndex > -1) {
          // Merge, ensuring complex objects from existing are not lost if not in formDataFromForm
          userProducts[productIndex] = {
            ...userProducts[productIndex], // Keep existing complex fields
            ...productCoreData, // Overwrite with new simple fields and origins
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

      // Reset form state for next creation
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
        <p className="text-muted-foreground">
          {isEditMode
            ? `Modify the details for product ID: ${editProductId}. Fields previously suggested by AI document extraction are marked with a CPU icon.`
            : "Create a Digital Product Passport by extracting data from a document using AI, or by filling the form manually."}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(newTab) => {
          setActiveTab(newTab);
          if (newTab !== "manual" && aiExtractionAppliedSuccessfully) {
            // If user navigates away from manual tab after AI extraction,
            // consider if the AI data should be cleared or maintained.
            // For now, it's maintained until a new extraction or save.
            // setAiExtractionAppliedSuccessfully(false); // Potentially reset this
          }
      }} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="ai-extraction" disabled={isEditMode}>AI Data Extraction</TabsTrigger>
          <TabsTrigger value="manual">{isEditMode ? "Edit Product Details" : "Manual Entry / Review"}</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="mt-6">
           {(aiExtractionAppliedSuccessfully || isEditMode) && activeTab === 'manual' && (
            <Alert className="mb-6 border-info bg-info/10 text-info-foreground">
              <FileWarning className="h-5 w-5 text-info" />
              <AlertTitle className="font-semibold text-info">
                {isEditMode ? "Editing Product" : "AI Data Populated"}
              </AlertTitle>
              <AlertDescription>
                {isEditMode
                  ? "You are editing an existing product. Fields suggested by AI document extraction or generation are marked."
                  : "Some fields below have been pre-filled based on the AI data extraction. Please review all fields carefully and complete any missing information."}
                Fields suggested by AI are marked with a <Cpu className="inline h-4 w-4 align-middle" /> icon. Modifying these fields will change their origin to 'manual'.
              </AlertDescription>
            </Alert>
          )}
          <ProductForm
            onSubmit={handleProductFormSubmit}
            isSubmitting={isSubmittingProduct}
            initialData={currentProductDataForForm} // Pass the current state including origins
            isStandalonePage={true}
            key={editProductId || 'new'} // Ensure form re-renders if editProductId changes
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
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline flex items-center"><ScanLine className="mr-2 h-6 w-6 text-primary" />Upload Document for AI Extraction</CardTitle>
                <CardDescription>
                  Select a document file (PDF, DOCX, TXT, PNG, JPG). Max 10MB. AI will attempt to pre-fill the product form.
                  For battery products, try a 'battery_spec_sheet' document type.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid w-full max-w-sm items-center gap-2">
                  <Label htmlFor="document-upload">Document File</Label>
                  <Input id="document-upload" type="file" onChange={handleFileChange} className="file:text-primary file:font-medium" />
                </div>
                <div className="grid w-full max-w-sm items-center gap-2">
                  <Label htmlFor="document-type">Document Type</Label>
                  <Input id="document-type" value={documentType} onChange={(e) => setDocumentType(e.target.value)} placeholder="e.g., invoice, specification, battery_spec_sheet" />
                </div>

                <Button onClick={handleExtractData} disabled={isLoadingAi || !file} variant="secondary">
                  {isLoadingAi ? ( <Loader2 className="mr-2 h-4 w-4 animate-spin" /> ) : ( <Cpu className="mr-2 h-4 w-4" /> )}
                  {isLoadingAi ? "Extracting Data..." : "Extract Data with AI"}
                </Button>

                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {!currentProductDataForForm.productName && !isLoadingAi && file && !aiExtractionAppliedSuccessfully && (
                  <Card className="border-dashed border-2 border-muted bg-muted/30">
                    <CardContent className="p-6 text-center text-muted-foreground">
                      <ScanLine className="mx-auto h-10 w-10 mb-3" />
                      <p>Click "Extract Data with AI" above to populate product information from the selected file and document type.</p>
                      <p className="text-xs mt-1">You will then be taken to the "Manual Entry / Review" tab to review it.</p>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
    
