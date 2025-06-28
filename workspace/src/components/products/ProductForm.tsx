// --- File: ProductForm.tsx ---
"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProductFormData } from "@/types/productFormTypes";
import { formSchema } from "@/types/productFormTypes";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Import tab content components
import BasicInfoTabContent from "./form/BasicInfoTabContent";
import TechnicalDetailsTabContent from "./form/TechnicalDetailsTabContent";
import SustainabilityTabContent from "./form/SustainabilityTabContent";
import ComplianceRegulationsTabContent from "./form/ComplianceRegulationsTabContent";

interface ProductFormProps {
  id?: string;
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export default function ProductForm({ id, initialData, onSubmit, isSubmitting }: ProductFormProps) {
  const formMethods = useForm<ProductFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      // Provide default structure for nested objects
      technical: {
        modelNumber: "",
        gtin: "",
      },
      sustainability: {
        recycledContentPercentage: 0,
        materials: ""
      },
      compliance: {
        eprelId: ""
      }
    },
  });

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{id ? "Edit Digital Product Passport" : "Create Digital Product Passport"}</CardTitle>
            <CardDescription>
              {id
                ? `Editing product ID: ${id}. Please update the necessary information below.`
                : "Fill in the details below to create a new DPP. Use the tabs to navigate through sections."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic-info" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
                <TabsTrigger value="technical-details">Technical</TabsTrigger>
                <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
              </TabsList>
              
              <div className="mt-6">
                <TabsContent value="basic-info">
                  <BasicInfoTabContent />
                </TabsContent>
                <TabsContent value="technical-details">
                  <TechnicalDetailsTabContent />
                </TabsContent>
                <TabsContent value="sustainability">
                  <SustainabilityTabContent />
                </TabsContent>
                <TabsContent value="compliance">
                  <ComplianceRegulationsTabContent />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {id ? "Save Changes" : "Create Product Passport"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
