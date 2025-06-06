
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

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

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
  imageUrlOrigin?: 'AI_EXTRACTED' | 'manual';
}

interface StoredUserProduct extends ProductFormData {
  id: string;
  status: string;
  compliance: string;
  lastUpdated: string;
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
  imageUrlOrigin?: 'AI_EXTRACTED' | 'manual';
  productCategory?: string;
  imageUrl?: string;
}

const USER_PRODUCTS_LOCAL_STORAGE_KEY = 'norruvaUserProducts';

// Helper to determine new origin status
const determineOrigin = (
  currentValue: any,
  previousValue: any,
  previousOrigin: 'AI_EXTRACTED' | 'manual' | undefined
): 'AI_EXTRACTED' | 'manual' | undefined => {
  if (currentValue !== previousValue) {
     // If user clears a field that had a value, it's a manual action.
     // If a field was empty and user provides a value, it's manual.
     // If a field had a value and user changes it to another non-empty value, it's manual.
    if ( (previousValue !== undefined && previousValue !== null && previousValue !== "") && (currentValue === "" || currentValue === null || currentValue === undefined) ) {
        return 'manual'; // User cleared an existing field
    }
    if (currentValue !== "" && currentValue !== null && currentValue !== undefined) {
        return 'manual'; // User provided or changed a value
    }
  }
  return previousOrigin; // Otherwise, preserve initial origin
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
  
  const [currentProductDataForForm, setCurrentProductDataForForm] = useState<Partial<InitialProductFormData>>({
    gtin: "", productName: "", productDescription: "", manufacturer: "", modelNumber: "",
    materials: "", sustainabilityClaims: "", specifications: "", energyLabel: "", productCategory: "",
    imageUrl: "",
    batteryChemistry: "", stateOfHealth: undefined, carbonFootprintManufacturing: undefined, recycledContentPercentage: undefined
  });

  useEffect(() => {
    if (isEditMode && editProductId) {
      const storedProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
      const userProducts: StoredUserProduct[] = storedProductsString ? JSON.parse(storedProductsString) : [];
      const productToEdit = userProducts.find(p => p.id === editProductId);
      if (productToEdit) {
        const editData: Partial<InitialProductFormData> = {
          ...productToEdit,
          // Ensure numeric fields that might be null/undefined are handled correctly
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
      setCurrentProductDataForForm({
        gtin: "", productName: "", productDescription: "", manufacturer: "", modelNumber: "",
        materials: "", sustainabilityClaims: "", specifications: "", energyLabel: "", productCategory: "",
        imageUrl: "",
        batteryChemistry: "", stateOfHealth: undefined, carbonFootprintManufacturing: undefined, recycledContentPercentage: undefined
      });
    }
  }, [isEditMode, editProductId, router, toast]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setCurrentProductDataForForm(prev => ({ // Reset relevant fields, keep GTIN etc. if user typed manually before AI
        ...prev, 
        productName: "", productDescription: "", manufacturer: "", modelNumber: "",
        materials: "", sustainabilityClaims: "", specifications: "", energyLabel: "", 
        batteryChemistry: "", stateOfHealth: undefined, carbonFootprintManufacturing: undefined, recycledContentPercentage: undefined,
        productNameOrigin: undefined, productDescriptionOrigin: undefined, manufacturerOrigin: undefined, modelNumberOrigin: undefined,
        materialsOrigin: undefined, sustainabilityClaimsOrigin: undefined, specificationsOrigin: undefined, energyLabelOrigin: undefined,
        batteryChemistryOrigin: undefined, stateOfHealthOrigin: undefined, carbonFootprintManufacturingOrigin: undefined, recycledContentPercentageOrigin: undefined,
        imageUrlOrigin: undefined,
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
      if (result.specifications && Object.keys(result.specifications).length > 0) { aiInitialFormData.specifications = JSON.stringify(result.specifications, null, 2); aiInitialFormData.specificationsOrigin = 'AI_EXTRACTED'; } else { aiInitialFormData.specifications = ""; }
      if (result.energyLabel) { aiInitialFormData.energyLabel = result.energyLabel; aiInitialFormData.energyLabelOrigin = 'AI_EXTRACTED'; }
      if (result.batteryChemistry) { aiInitialFormData.batteryChemistry = result.batteryChemistry; aiInitialFormData.batteryChemistryOrigin = 'AI_EXTRACTED'; }
      if (result.stateOfHealth !== undefined && result.stateOfHealth !== null) { aiInitialFormData.stateOfHealth = result.stateOfHealth; aiInitialFormData.stateOfHealthOrigin = 'AI_EXTRACTED'; }
      if (result.carbonFootprintManufacturing !== undefined && result.carbonFootprintManufacturing !== null) { aiInitialFormData.carbonFootprintManufacturing = result.carbonFootprintManufacturing; aiInitialFormData.carbonFootprintManufacturingOrigin = 'AI_EXTRACTED'; }
      if (result.recycledContentPercentage !== undefined && result.recycledContentPercentage !== null) { aiInitialFormData.recycledContentPercentage = result.recycledContentPercentage; aiInitialFormData.recycledContentPercentageOrigin = 'AI_EXTRACTED'; }
      
      // Merge AI data with existing form data (e.g., if user typed GTIN manually first)
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

      // currentProductDataForForm holds the state before this specific form submission (could be from AI extraction or load-for-edit)
      const dataPriorToThisEdit = currentProductDataForForm;

      const productToSave: StoredUserProduct = {
        id: isEditMode && editProductId ? editProductId : `USER_PROD${Date.now().toString().slice(-6)}`,
        productName: formDataFromForm.productName || dataPriorToThisEdit.productName || "Unnamed Product",
        gtin: formDataFromForm.gtin || dataPriorToThisEdit.gtin,
        productDescription: formDataFromForm.productDescription || dataPriorToThisEdit.productDescription,
        manufacturer: formDataFromForm.manufacturer || dataPriorToThisEdit.manufacturer,
        modelNumber: formDataFromForm.modelNumber || dataPriorToThisEdit.modelNumber,
        materials: formDataFromForm.materials || dataPriorToThisEdit.materials,
        sustainabilityClaims: formDataFromForm.sustainabilityClaims || dataPriorToThisEdit.sustainabilityClaims,
        specifications: formDataFromForm.specifications || dataPriorToThisEdit.specifications,
        energyLabel: formDataFromForm.energyLabel || dataPriorToThisEdit.energyLabel,
        productCategory: formDataFromForm.productCategory || dataPriorToThisEdit.productCategory,
        imageUrl: formDataFromForm.imageUrl || dataPriorToThisEdit.imageUrl,
        batteryChemistry: formDataFromForm.batteryChemistry || dataPriorToThisEdit.batteryChemistry,
        stateOfHealth: formDataFromForm.stateOfHealth !== undefined && formDataFromForm.stateOfHealth !== null ? formDataFromForm.stateOfHealth : dataPriorToThisEdit.stateOfHealth,
        carbonFootprintManufacturing: formDataFromForm.carbonFootprintManufacturing !== undefined && formDataFromForm.carbonFootprintManufacturing !== null ? formDataFromForm.carbonFootprintManufacturing : dataPriorToThisEdit.carbonFootprintManufacturing,
        recycledContentPercentage: formDataFromForm.recycledContentPercentage !== undefined && formDataFromForm.recycledContentPercentage !== null ? formDataFromForm.recycledContentPercentage : dataPriorToThisEdit.recycledContentPercentage,

        productNameOrigin: determineOrigin(formDataFromForm.productName, dataPriorToThisEdit.productName, dataPriorToThisEdit.productNameOrigin),
        productDescriptionOrigin: determineOrigin(formDataFromForm.productDescription, dataPriorToThisEdit.productDescription, dataPriorToThisEdit.productDescriptionOrigin),
        manufacturerOrigin: determineOrigin(formDataFromForm.manufacturer, dataPriorToThisEdit.manufacturer, dataPriorToThisEdit.manufacturerOrigin),
        modelNumberOrigin: determineOrigin(formDataFromForm.modelNumber, dataPriorToThisEdit.modelNumber, dataPriorToThisEdit.modelNumberOrigin),
        materialsOrigin: determineOrigin(formDataFromForm.materials, dataPriorToThisEdit.materials, dataPriorToThisEdit.materialsOrigin),
        sustainabilityClaimsOrigin: determineOrigin(formDataFromForm.sustainabilityClaims, dataPriorToThisEdit.sustainabilityClaims, dataPriorToThisEdit.sustainabilityClaimsOrigin),
        energyLabelOrigin: determineOrigin(formDataFromForm.energyLabel, dataPriorToThisEdit.energyLabel, dataPriorToThisEdit.energyLabelOrigin),
        specificationsOrigin: determineOrigin(formDataFromForm.specifications, dataPriorToThisEdit.specifications, dataPriorToThisEdit.specificationsOrigin),
        imageUrlOrigin: determineOrigin(formDataFromForm.imageUrl, dataPriorToThisEdit.imageUrl, dataPriorToThisEdit.imageUrlOrigin),
        batteryChemistryOrigin: determineOrigin(formDataFromForm.batteryChemistry, dataPriorToThisEdit.batteryChemistry, dataPriorToThisEdit.batteryChemistryOrigin),
        stateOfHealthOrigin: determineOrigin(formDataFromForm.stateOfHealth, dataPriorToThisEdit.stateOfHealth, dataPriorToThisEdit.stateOfHealthOrigin),
        carbonFootprintManufacturingOrigin: determineOrigin(formDataFromForm.carbonFootprintManufacturing, dataPriorToThisEdit.carbonFootprintManufacturing, dataPriorToThisEdit.carbonFootprintManufacturingOrigin),
        recycledContentPercentageOrigin: determineOrigin(formDataFromForm.recycledContentPercentage, dataPriorToThisEdit.recycledContentPercentage, dataPriorToThisEdit.recycledContentPercentageOrigin),
        
        status: (isEditMode && editProductId ? (userProducts.find(p => p.id === editProductId)?.status) : "Draft") || "Draft",
        compliance: (isEditMode && editProductId ? (userProducts.find(p => p.id === editProductId)?.compliance) : "N/A") || "N/A",
        lastUpdated: new Date().toISOString(),
      };


      if (isEditMode && editProductId) {
        const productIndex = userProducts.findIndex(p => p.id === editProductId);
        if (productIndex > -1) {
          userProducts[productIndex] = productToSave;
          localStorage.setItem(USER_PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(userProducts));
          toast({ title: "Product Updated", description: `${productToSave.productName} has been updated.`, variant: "default", action: <CheckCircle2 className="text-green-500" /> });
          router.push(`/products/${editProductId}`);
        } else {
          throw new Error("Product not found for update.");
        }
      } else {
        userProducts.push(productToSave);
        localStorage.setItem(USER_PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(userProducts));
        toast({ title: "Product Saved", description: `${productToSave.productName} has been saved.`, variant: "default", action: <CheckCircle2 className="text-green-500" /> });
        router.push('/products');
      }
      
      setCurrentProductDataForForm({ 
        gtin: "", productName: "", productDescription: "", manufacturer: "", modelNumber: "",
        materials: "", sustainabilityClaims: "", specifications: "", energyLabel: "", productCategory: "",
        imageUrl: "",
        batteryChemistry: "", stateOfHealth: undefined, carbonFootprintManufacturing: undefined, recycledContentPercentage: undefined
       }); // Reset form holder
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
            ? `Modify the details for product ID: ${editProductId}. Fields previously suggested by AI are marked with a CPU icon.`
            : "Create a Digital Product Passport by extracting data from a document using AI, or by filling the form manually."}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(newTab) => {
          setActiveTab(newTab);
          if (newTab !== "manual" && aiExtractionAppliedSuccessfully) {
            setAiExtractionAppliedSuccessfully(false); 
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
                  ? "You are editing an existing product. Fields previously suggested by AI are marked."
                  : "Some fields below have been pre-filled based on the AI data extraction. Please review all fields carefully and complete any missing information."}
                Fields suggested by AI are marked with a <Cpu className="inline h-4 w-4 align-middle" /> icon. Modifying these fields will change their origin to 'manual'.
              </AlertDescription>
            </Alert>
          )}
          <ProductForm 
            onSubmit={handleProductFormSubmit}
            isSubmitting={isSubmittingProduct}
            initialData={currentProductDataForForm} 
            isStandalonePage={true}
            key={editProductId || 'new'} 
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
