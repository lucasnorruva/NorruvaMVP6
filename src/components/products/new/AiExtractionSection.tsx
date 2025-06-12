
"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Cpu, Loader2, AlertTriangle, ScanLine } from "lucide-react";
import type { InitialProductFormData } from "@/app/(app)/products/new/page";

interface AiExtractionSectionProps {
  file: File | null;
  documentType: string;
  isLoading: boolean;
  error: string | null;
  currentProductData: Partial<InitialProductFormData>;
  aiExtractionAppliedSuccessfully: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDocumentTypeChange: (value: string) => void;
  onExtractData: () => void;
}

export default function AiExtractionSection({
  file,
  documentType,
  isLoading,
  error,
  currentProductData,
  aiExtractionAppliedSuccessfully,
  onFileChange,
  onDocumentTypeChange,
  onExtractData,
}: AiExtractionSectionProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <ScanLine className="mr-2 h-6 w-6 text-primary" />Upload Document for AI Extraction
        </CardTitle>
        <CardDescription>
          Select a document file (PDF, DOCX, TXT, PNG, JPG). Max 10MB. AI will attempt to pre-fill the product form.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid w-full max-w-sm items-center gap-2">
          <Label htmlFor="document-upload">Document File</Label>
          <Input
            id="document-upload"
            type="file"
            onChange={onFileChange}
            className="file:text-primary file:font-medium"
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-2">
          <Label htmlFor="document-type">Document Type</Label>
          <Input
            id="document-type"
            value={documentType}
            onChange={(e) => onDocumentTypeChange(e.target.value)}
            placeholder="e.g., invoice, specification sheet"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Examples: invoice, specification, battery_spec_sheet, commercial_invoice, packing_list, material_safety_data_sheet, bill_of_materials, technical_drawing.
          </p>
        </div>
        <Button onClick={onExtractData} disabled={isLoading || !file} variant="secondary">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Cpu className="mr-2 h-4 w-4" />}
          {isLoading ? "Extracting Data..." : "Extract Data with AI"}
        </Button>
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {!currentProductData.productName && !isLoading && file && !aiExtractionAppliedSuccessfully && (
          <Card className="border-dashed border-2 border-muted bg-muted/30">
            <CardContent className="p-6 text-center text-muted-foreground">
              <ScanLine className="mx-auto h-10 w-10 mb-3" />
              <p>
                Click "Extract Data with AI" above to populate product information from the selected file and document
                type.
              </p>
              <p className="text-xs mt-1">You will then be taken to the "Manual Entry / Review" tab to review it.</p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}

