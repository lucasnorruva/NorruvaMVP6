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
import { UploadCloud, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

// Helper to convert file to data URI
const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function AiDataExtractionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>("invoice"); // Default or allow user to select
  const [extractedData, setExtractedData] = useState<Partial<ExtractProductDataOutput> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setExtractedData(null); // Reset extracted data when new file is selected
      setError(null);
    }
  };

  const handleExtractData = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setExtractedData(null);

    try {
      const documentDataUri = await fileToDataUri(file);
      const result = await extractProductData({ documentDataUri, documentType });
      setExtractedData(result);
      toast({
        title: "Data Extracted Successfully",
        description: "Review the extracted information below.",
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
      setIsLoading(false);
    }
  };

  const handleProductFormSubmit = async (data: ProductFormData) => {
    setIsSubmittingProduct(true);
    console.log("Submitting product data:", data);
    // Here you would typically send the data to your backend API
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    toast({
      title: "Product Saved",
      description: `${data.productName || "The new product"} has been saved.`,
      variant: "default",
      action: <CheckCircle2 className="text-green-500" />,
    });
    // Optionally reset form or navigate away
    // setFile(null);
    // setExtractedData(null);
    setIsSubmittingProduct(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-semibold">Add New Product via AI Data Extraction</h1>
        <p className="text-muted-foreground">
          Upload a supplier document (e.g., invoice, specification sheet) to automatically extract product details.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Upload Document</CardTitle>
          <CardDescription>
            Select a document file (PDF, DOCX, TXT, PNG, JPG). Max 10MB.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="document-upload">Document File</Label>
            <Input id="document-upload" type="file" onChange={handleFileChange} className="file:text-primary file:font-medium" />
          </div>
          
          {/* Optional: Document Type Selector if needed
          <div>
            <Label htmlFor="document-type">Document Type</Label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger id="document-type">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="invoice">Invoice</SelectItem>
                <SelectItem value="specification">Specification Sheet</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          */}

          <Button onClick={handleExtractData} disabled={isLoading || !file} className="bg-accent text-accent-foreground hover:bg-accent/90">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UploadCloud className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Extracting Data..." : "Extract Data with AI"}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {extractedData && (
         <ProductForm 
            initialData={extractedData} 
            onSubmit={handleProductFormSubmit}
            isSubmitting={isSubmittingProduct}
          />
      )}
       {!extractedData && !isLoading && file && (
        <Card className="shadow-lg border-dashed border-2 border-muted">
          <CardContent className="p-6 text-center text-muted-foreground">
            <ScanLine className="mx-auto h-12 w-12 mb-4" />
            <p>Click "Extract Data with AI" to populate product information from the selected file.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
