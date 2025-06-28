// src/utils/products/validation.ts
import { z } from 'zod';

export const productFormSchema = z.object({
  productName: z.string().min(3, { message: "Product name must be at least 3 characters long." }),
  manufacturer: z.string().min(2, { message: "Manufacturer name is required." }),
  category: z.string().min(2, { message: "Category is required." }),
  modelNumber: z.string().optional(),
  gtin: z.string().optional(),
  sku: z.string().optional(),
  nfcTagId: z.string().optional(),
  rfidTagId: z.string().optional(),
  description: z.string().min(10, { message: "Description must be at least 10 characters long." }).optional(),
  materials: z.string().optional(),
  sustainabilityClaims: z.string().optional(),
  keyCompliancePoints: z.string().optional(),
  specifications: z.string().optional(),
  energyLabel: z.string().optional(),
  imageUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
  imageHint: z.string().optional(),
  customAttributes: z.array(z.object({
    key: z.string(),
    value: z.string(),
  })).optional(),
  // Add more complex validations for other fields if needed
});
