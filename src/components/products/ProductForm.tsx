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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExtractProductDataOutput } from "@/ai/flows/extract-product-data";

const formSchema = z.object({
  productName: z.string().min(2, "Product name must be at least 2 characters.").optional(),
  productDescription: z.string().optional(),
  manufacturer: z.string().optional(),
  modelNumber: z.string().optional(),
  // For simplicity, specifications will be a string for now.
  // In a real app, this would be a more complex field (e.g., array of key-value pairs).
  specifications: z.string().optional(), 
  energyLabel: z.string().optional(),
});

export type ProductFormData = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData?: Partial<ExtractProductDataOutput>;
  onSubmit: (data: ProductFormData) => void;
  isSubmitting?: boolean;
}

export default function ProductForm({ initialData, onSubmit, isSubmitting }: ProductFormProps) {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: initialData?.productName || "",
      productDescription: initialData?.productDescription || "",
      manufacturer: initialData?.manufacturer || "",
      modelNumber: initialData?.modelNumber || "",
      specifications: initialData?.specifications ? JSON.stringify(initialData.specifications, null, 2) : "",
      energyLabel: initialData?.energyLabel || "",
    },
  });

  // Update form values if initialData changes (e.g., after AI extraction)
  React.useEffect(() => {
    if (initialData) {
      form.reset({
        productName: initialData.productName || "",
        productDescription: initialData.productDescription || "",
        manufacturer: initialData.manufacturer || "",
        modelNumber: initialData.modelNumber || "",
        specifications: initialData.specifications ? JSON.stringify(initialData.specifications, null, 2) : "",
        energyLabel: initialData.energyLabel || "",
      });
    }
  }, [initialData, form]);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., EcoBoiler X1" {...field} />
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
                  <FormLabel>Product Description</FormLabel>
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
                    <FormLabel>Manufacturer</FormLabel>
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
                    <FormLabel>Model Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., GTX-EB-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="specifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specifications (JSON format)</FormLabel>
                  <FormControl>
                    <Textarea placeholder='e.g., { "color": "blue", "weight": "10kg" }' {...field} rows={5} />
                  </FormControl>
                  <FormDescription>
                    Enter product specifications as a JSON object.
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
                  <FormLabel>Energy Label</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., A++" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Product"}
        </Button>
      </form>
    </Form>
  );
}
