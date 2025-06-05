
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Added for redirection
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ProductForm, { type ProductFormData } from "@/components/products/ProductForm";
import { extractProductData } from "@/ai/flows/extract-product-data";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, CheckCircle2, Loader2, ScanLine, Info, Cpu } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Helper to convert file to data URI
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
  // Battery Regulation Origins
  batteryChemistryOrigin?: 'AI_EXTRACTED' | 'manual';
  stateOfHealthOrigin?: 'AI_EXTRACTED' | 'manual';
  carbonFootprintManufacturingOrigin?: 'AI_EXTRACTED' | 'manual';
  recycledContentPercentageOrigin?: 'AI_EXTRACTED' | 'manual';
}

const USER_PRODUCTS_LOCAL_STORAGE_KEY = 'norruvaUserProducts';

export default function AddNewProductPage() {
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>("invoice"); 
  const [extractedData, setExtractedData] = useState<Partial<InitialProductFormData> | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("ai-extraction");
  const router = useRouter();


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setExtractedData(null); 
      setError(null);
    }
  };

  const handleExtractData = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    setIsLoadingAi(true);
    setError(null);
    setExtractedData(null);

    try {
      const documentDataUri = await fileToDataUri(file);
      const result = await extractProductData({ documentDataUri, documentType });
      
      const initialFormData: Partial<InitialProductFormData> = {};
      if (result.productName) {
        initialFormData.productName = result.productName;
        initialFormData.productNameOrigin = 'AI_EXTRACTED';
      }
      if (result.productDescription) {
        initialFormData.productDescription = result.productDescription;
        initialFormData.productDescriptionOrigin = 'AI_EXTRACTED';
      }
      if (result.manufacturer) {
        initialFormData.manufacturer = result.manufacturer;
        initialFormData.manufacturerOrigin = 'AI_EXTRACTED';
      }
      if (result.modelNumber) {
        initialFormData.modelNumber = result.modelNumber;
        initialFormData.modelNumberOrigin = 'AI_EXTRACTED';
      }
      if (result.specifications && Object.keys(result.specifications).length > 0) {
        initialFormData.specifications = JSON.stringify(result.specifications, null, 2);
        initialFormData.specificationsOrigin = 'AI_EXTRACTED';
      }
      if (result.energyLabel) {
        initialFormData.energyLabel = result.energyLabel;
        initialFormData.energyLabelOrigin = 'AI_EXTRACTED';
      }

      // Battery Regulation Fields
      if (result.batteryChemistry) {
        initialFormData.batteryChemistry = result.batteryChemistry;
        initialFormData.batteryChemistryOrigin = 'AI_EXTRACTED';
      }
      if (result.stateOfHealth !== undefined && result.stateOfHealth !== null) {
        initialFormData.stateOfHealth = result.stateOfHealth;
        initialFormData.stateOfHealthOrigin = 'AI_EXTRACTED';
      }
      if (result.carbonFootprintManufacturing !== undefined && result.carbonFootprintManufacturing !== null) {
        initialFormData.carbonFootprintManufacturing = result.carbonFootprintManufacturing;
        initialFormData.carbonFootprintManufacturingOrigin = 'AI_EXTRACTED';
      }
      if (result.recycledContentPercentage !== undefined && result.recycledContentPercentage !== null) {
        initialFormData.recycledContentPercentage = result.recycledContentPercentage;
        initialFormData.recycledContentPercentageOrigin = 'AI_EXTRACTED';
      }
      
      initialFormData.gtin = initialData.gtin || "";
      // productCategory will be handled by initialData or user input in the form

      setExtractedData(initialFormData);
      toast({
        title: "Data Extracted Successfully",
        description: "Review and complete the extracted information in the form now shown in 'Manual Entry'.",
        variant: "default",
        action: <CheckCircle2 className="text-green-500" />,
      });
      setActiveTab("manual"); 
    } catch (err) {
      console.error("Extraction failed:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during extraction.";
      setError(errorMessage);
      toast({
        title: "Extraction Failed",
        description: errorMessage,
        variant: "destructive",
        action: <AlertTriangle className="text-white" />,
      });
    } finally {
      setIsLoadingAi(false);
    }
  };
  
  const initialData: Partial<InitialProductFormData> = {
    gtin: "",
    productName: "",
    productDescription: "",
    manufacturer: "",
    modelNumber: "",
    materials: "",
    sustainabilityClaims: "",
    specifications: "",
    energyLabel: "",
    productCategory: "", // Added for explicit initialization
    batteryChemistry: "",
  };

  const handleProductFormSubmit = async (data: ProductFormData) => {
    setIsSubmittingProduct(true);
    console.log("Submitting product data to save:", data);
    
    try {
      const existingProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
      const existingProducts = existingProductsString ? JSON.parse(existingProductsString) : [];
      
      const newProduct = {
        id: `USER_PROD${Date.now().toString().slice(-6)}`, // Simple unique ID
        name: data.productName || "Unnamed Product",
        category: data.productCategory || "General",
        status: "Draft", // Default status for new products
        compliance: "N/A", // Default compliance
        lastUpdated: new Date().toISOString().split('T')[0],
        // Include other fields from ProductFormData if the listing page table is updated to show them
        // For now, keeping it compatible with the existing `products/page.tsx` structure
        gtin: data.gtin,
        productDescription: data.productDescription,
        manufacturer: data.manufacturer,
        modelNumber: data.modelNumber,
        // ... etc. if you want to store more comprehensive data
      };

      const updatedProducts = [...existingProducts, newProduct];
      localStorage.setItem(USER_PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(updatedProducts));

      toast({
        title: "Product Saved to Local Storage",
        description: `${newProduct.name} has been saved.`,
        variant: "default",
        action: <CheckCircle2 className="text-green-500" />,
      });
      
      // Optionally reset form or navigate away
      setExtractedData(null); // Clear any AI extracted data
      setActiveTab("ai-extraction"); // Switch back to AI tab
      // Reset the actual form fields via its own mechanism if ProductForm component exposes a reset
      // For now, redirecting to product list
      router.push('/products');

    } catch (e) {
      console.error("Failed to save product to localStorage", e);
      toast({
        title: "Save Failed",
        description: "Could not save the product to local storage.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-semibold">Add New Product</h1>
        <p className="text-muted-foreground">
          Create a Digital Product Passport by extracting data from a document using AI, or by filling the form manually.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="ai-extraction">AI Data Extraction</TabsTrigger>
          <TabsTrigger value="manual">Manual Entry / Review</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual" className="mt-6">
          <ProductForm 
            onSubmit={handleProductFormSubmit}
            isSubmitting={isSubmittingProduct}
            initialData={{...initialData, ...extractedData}} // Merge initialData with extractedData
            isStandalonePage={true}
          />
        </TabsContent>

        <TabsContent value="ai-extraction" className="mt-6">
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
                {isLoadingAi ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Cpu className="mr-2 h-4 w-4" /> 
                )}
                {isLoadingAi ? "Extracting Data..." : "Extract Data with AI"}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {!extractedData && !isLoadingAi && file && (
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
        </TabsContent>
      </Tabs>
    </div>
  );
}

