"use client";

import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ProductForm, {
  type ProductFormData,
} from "@/components/products/ProductForm";
import type { InitialProductFormData } from "@/app/(app)/products/new/page";
import { Cpu, FileWarning } from "lucide-react";

interface ProductDetailsSectionProps {
  isEditMode: boolean;
  aiExtractionAppliedSuccessfully: boolean;
  initialData: Partial<InitialProductFormData>;
  isSubmitting: boolean;
  onSubmit: (data: ProductFormData) => Promise<void>;
  editProductId: string | null;
}

export default function ProductDetailsSection({
  isEditMode,
  aiExtractionAppliedSuccessfully,
  initialData,
  isSubmitting,
  onSubmit,
  editProductId,
}: ProductDetailsSectionProps) {
  return (
    <>
      {(aiExtractionAppliedSuccessfully || isEditMode) && (
        <Alert className="mb-6 border-info bg-info/10 text-info-foreground shadow-sm">
          <FileWarning className="h-5 w-5 text-info" />
          <AlertTitle className="font-semibold text-info">
            {isEditMode
              ? "Editing Product: Review AI-Suggested Fields"
              : "AI Data Ready for Review"}
          </AlertTitle>
          <AlertDescription>
            {isEditMode
              ? "You are editing an existing product. Fields suggested by AI previously are marked with a CPU icon."
              : "Information extracted by AI has been pre-filled below. Please review each field carefully, complete any missing details, and make corrections as needed."}
            <br />
            Fields populated or suggested by AI are marked with a{" "}
            <Cpu className="inline h-4 w-4 align-middle" /> icon. Modifying
            these fields will change their origin to 'manual'.
          </AlertDescription>
        </Alert>
      )}
      <ProductForm
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        initialData={initialData}
        isStandalonePage={true}
        key={editProductId || "new"}
      />
    </>
  );
}
