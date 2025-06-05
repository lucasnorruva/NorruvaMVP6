
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ProductForm, { type ProductFormData } from "@/components/products/ProductForm";
import { extractProductData, type ExtractProductDataOutput } from "@/ai/flows/extract-product-data";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, AlertTriangle, CheckCircle2, Loader2, ScanLine, Info } from "lucide-react";
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

export default function AddNewProductPage() {
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>("invoice"); 
  const [extractedData, setExtractedData] = useState<Partial<ExtractProductDataOutput & ProductFormData> | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("manual");


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
      // Ensure the result is compatible with ProductFormData where overlapping
      const initialFormData: Partial<ExtractProductDataOutput & ProductFormData> = {
        ...result, // AI extracted data
        // any specific ProductFormData fields can be mapped here if names differ or need transformation
      };
      setExtractedData(initialFormData);
      toast({
        title: "Data Extracted Successfully",
        description: "Review and complete the extracted information in the form below.",
        variant: "default",
        action: <CheckCircle2 className="text-green-500" />,
      });
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

  const handleProductFormSubmit = async (data: ProductFormData) => {
    setIsSubmittingProduct(true);
    console.log("Submitting product data:", data);
    // Here you would typically send the data to your backend API to save the product
    // For demo purposes, we simulate an API call and show a toast
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    toast({
      title: "Product Saved (Simulated)",
      description: `${data.productName || "The new product"} has been saved.`,
      variant: "default",
      action: <CheckCircle2 className="text-green-500" />,
    });
    // Optionally reset form or navigate away
    // setFile(null);
    // setExtractedData(null);
    // setActiveTab("manual"); // Or navigate to product list
    setIsSubmittingProduct(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-semibold">Add New Product</h1>
        <p className="text-muted-foreground">
          Create a Digital Product Passport by filling the form manually or by extracting data from a document using AI.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="ai-extraction">AI Data Extraction</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual" className="mt-6">
          <ProductForm 
            onSubmit={handleProductFormSubmit}
            isSubmitting={isSubmittingProduct}
            initialData={extractedData || {}} // Pass extracted data if available from AI tab
            isStandalonePage={true} // To render the card and submit button within ProductForm
          />
        </TabsContent>

        <TabsContent value="ai-extraction" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center"><ScanLine className="mr-2 h-6 w-6 text-primary" />Upload Document for AI Extraction</CardTitle>
              <CardDescription>
                Select a document file (PDF, DOCX, TXT, PNG, JPG). Max 10MB. AI will attempt to pre-fill the product form.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid w-full max-w-sm items-center gap-2">
                <Label htmlFor="document-upload">Document File</Label>
                <Input id="document-upload" type="file" onChange={handleFileChange} className="file:text-primary file:font-medium" />
              </div>
              
              <Button onClick={handleExtractData} disabled={isLoadingAi || !file} className="bg-accent text-accent-foreground hover:bg-accent/90">
                {isLoadingAi ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UploadCloud className="mr-2 h-4 w-4" />
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

              {extractedData && (
                <Alert variant="default" className="bg-info/10 border-info/50">
                  <Info className="h-4 w-4 text-info" />
                  <AlertTitle className="text-info">Data Extracted</AlertTitle>
                  <AlertDescription>
                    AI has pre-filled some information. Please switch to the "Manual Entry" tab to review, complete, and save the product.
                  </AlertDescription>
                </Alert>
              )}
               {!extractedData && !isLoadingAi && file && (
                <Card className="border-dashed border-2 border-muted bg-muted/30">
                  <CardContent className="p-6 text-center text-muted-foreground">
                    <ScanLine className="mx-auto h-10 w-10 mb-3" />
                    <p>Click "Extract Data with AI" to populate product information from the selected file.</p>
                    <p className="text-xs mt-1">You can then review it in the "Manual Entry" tab.</p>
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

