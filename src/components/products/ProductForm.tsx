
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { InitialProductFormData } from "@/app/(app)/products/new/page"; 
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Cpu, BatteryCharging, Loader2 } from "lucide-react";
import React from "react";

const formSchema = z.object({
  productName: z.string().min(2, "Product name must be at least 2 characters.").optional(),
  gtin: z.string().optional().describe("Global Trade Item Number"),
  productDescription: z.string().optional(),
  manufacturer: z.string().optional(),
  modelNumber: z.string().optional(),
  materials: z.string().optional().describe("Key materials used in the product, e.g., Cotton, Recycled Polyester, Aluminum."),
  sustainabilityClaims: z.string().optional().describe("Brief sustainability claims, e.g., 'Made with 50% recycled content', 'Carbon neutral production'."),
  specifications: z.string().optional(), 
  energyLabel: z.string().optional(),
  // Battery Regulation Fields
  batteryChemistry: z.string().optional(),
  stateOfHealth: z.coerce.number().nullable().optional(),
  carbonFootprintManufacturing: z.coerce.number().nullable().optional(),
  recycledContentPercentage: z.coerce.number().nullable().optional(),
});

export type ProductFormData = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData?: Partial<InitialProductFormData>; 
  onSubmit: (data: ProductFormData) => Promise<void>; // onSubmit is now async
  isSubmitting?: boolean;
  isStandalonePage?: boolean; 
}

const AiIndicator = ({ fieldOrigin, fieldName }: { fieldOrigin?: 'AI_EXTRACTED' | 'manual', fieldName: string }) => {
  if (fieldOrigin === 'AI_EXTRACTED') {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger type="button" className="ml-1.5 cursor-help align-middle">
            <Cpu className="h-4 w-4 text-info" />
          </TooltipTrigger>
          <TooltipContent>
            <p>This {fieldName.toLowerCase()} was suggested by AI.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  return null;
};


export default function ProductForm({ initialData, onSubmit, isSubmitting, isStandalonePage = true }: ProductFormProps) {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: initialData?.productName || "",
      gtin: initialData?.gtin || "",
      productDescription: initialData?.productDescription || "",
      manufacturer: initialData?.manufacturer || "",
      modelNumber: initialData?.modelNumber || "",
      materials: initialData?.materials || "",
      sustainabilityClaims: initialData?.sustainabilityClaims || "",
      specifications: initialData?.specifications ? (typeof initialData.specifications === 'string' ? initialData.specifications : JSON.stringify(initialData.specifications, null, 2)) : "",
      energyLabel: initialData?.energyLabel || "",
      batteryChemistry: initialData?.batteryChemistry || "",
      stateOfHealth: initialData?.stateOfHealth ?? undefined,
      carbonFootprintManufacturing: initialData?.carbonFootprintManufacturing ?? undefined,
      recycledContentPercentage: initialData?.recycledContentPercentage ?? undefined,
    },
  });

  React.useEffect(() => {
    if (initialData) {
      form.reset({
        productName: initialData.productName || "",
        gtin: initialData.gtin || "",
        productDescription: initialData.productDescription || "",
        manufacturer: initialData.manufacturer || "",
        modelNumber: initialData.modelNumber || "",
        materials: initialData.materials || "",
        sustainabilityClaims: initialData.sustainabilityClaims || "",
        specifications: initialData.specifications ? (typeof initialData.specifications === 'string' ? initialData.specifications : JSON.stringify(initialData.specifications, null, 2)) : "",
        energyLabel: initialData.energyLabel || "",
        batteryChemistry: initialData.batteryChemistry || "",
        stateOfHealth: initialData.stateOfHealth ?? undefined,
        carbonFootprintManufacturing: initialData.carbonFootprintManufacturing ?? undefined,
        recycledContentPercentage: initialData.recycledContentPercentage ?? undefined,
      });
    }
  }, [initialData, form]);

  const formContent = (
    <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3', 'item-4']} className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-lg font-semibold">Basic Information</AccordionTrigger>
        <AccordionContent className="space-y-6 pt-4">
          <FormField
            control={form.control}
            name="productName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Product Name 
                  <AiIndicator fieldOrigin={initialData?.productNameOrigin} fieldName="Product Name" />
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g., EcoBoiler X1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gtin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GTIN (Global Trade Item Number)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 01234567890123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="productDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Product Description
                  <AiIndicator fieldOrigin={initialData?.productDescriptionOrigin} fieldName="Product Description" />
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="Detailed description of the product..." {...field} rows={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="manufacturer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Manufacturer
                    <AiIndicator fieldOrigin={initialData?.manufacturerOrigin} fieldName="Manufacturer" />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., GreenTech Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="modelNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Model Number
                    <AiIndicator fieldOrigin={initialData?.modelNumberOrigin} fieldName="Model Number" />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., GTX-EB-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger className="text-lg font-semibold">Sustainability & Compliance</AccordionTrigger>
        <AccordionContent className="space-y-6 pt-4">
           <FormField
            control={form.control}
            name="materials"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                    Key Materials
                    <AiIndicator fieldOrigin={initialData?.materialsOrigin} fieldName="Key Materials" />
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="e.g., Organic Cotton, Recycled PET, Aluminum Alloy" {...field} rows={3}/>
                </FormControl>
                <FormDescription>
                  List the primary materials used in the product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sustainabilityClaims"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                    Sustainability Claims
                    <AiIndicator fieldOrigin={initialData?.sustainabilityClaimsOrigin} fieldName="Sustainability Claims" />
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="e.g., Made with 70% recycled materials, Carbon neutral certified, Biodegradable packaging" {...field} rows={3}/>
                </FormControl>
                 <FormDescription>
                  Highlight key sustainability features of the product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="energyLabel"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                    Energy Label
                    <AiIndicator fieldOrigin={initialData?.energyLabelOrigin} fieldName="Energy Label" />
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g., A++" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="item-3">
        <AccordionTrigger className="text-lg font-semibold">Technical Specifications</AccordionTrigger>
        <AccordionContent className="pt-4">
           <FormField
              control={form.control}
              name="specifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Specifications (JSON format)
                    <AiIndicator fieldOrigin={initialData?.specificationsOrigin} fieldName="Specifications" />
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder='e.g., { "color": "blue", "weight": "10kg" }' {...field} rows={5} />
                  </FormControl>
                  <FormDescription>
                    Enter detailed product specifications as a JSON object. If AI extracted this, ensure it is valid JSON.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-4">
        <AccordionTrigger className="text-lg font-semibold flex items-center">
            <BatteryCharging className="mr-2 h-5 w-5 text-primary" /> Battery Passport Details
        </AccordionTrigger>
        <AccordionContent className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="batteryChemistry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Battery Chemistry
                    <AiIndicator fieldOrigin={initialData?.batteryChemistryOrigin} fieldName="Battery Chemistry" />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Li-ion NMC, LFP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stateOfHealth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    State of Health (%)
                    <AiIndicator fieldOrigin={initialData?.stateOfHealthOrigin} fieldName="State of Health" />
                  </FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 98" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? null : e.target.valueAsNumber)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="carbonFootprintManufacturing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Manufacturing Carbon Footprint (kg CO₂e)
                    <AiIndicator fieldOrigin={initialData?.carbonFootprintManufacturingOrigin} fieldName="Carbon Footprint" />
                  </FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 75.5" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? null : e.target.valueAsNumber)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recycledContentPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Recycled Content (%)
                    <AiIndicator fieldOrigin={initialData?.recycledContentPercentageOrigin} fieldName="Recycled Content" />
                  </FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 15" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? null : e.target.valueAsNumber)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );


  if (isStandalonePage) {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Product Information</CardTitle>
              <CardDescription>Fill in the details for the Digital Product Passport. Fields suggested by AI will be marked with a <Cpu className="inline h-4 w-4 text-info align-middle" /> icon.</CardDescription>
            </CardHeader>
            <CardContent>
              {formContent}
            </CardContent>
          </Card>
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Saving Product..." : "Save Product"}
          </Button>
        </form>
      </Form>
    );
  }

  return (
     <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {formContent}
           <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Saving Changes..." : "Save Changes"}
          </Button>
        </form>
    </Form>
  );
}

