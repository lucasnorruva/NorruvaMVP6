// --- File: src/types/productFormTypes.ts ---
// Description: Type definitions and Zod schemas for the product form.
"use client";

import { z } from "zod";

// Schema for Technical Details Tab
export const technicalDetailsSchema = z.object({
  modelNumber: z.string().optional(),
  gtin: z.string().optional(),
}).optional();

// Schema for Sustainability Tab
export const sustainabilitySchema = z.object({
  recycledContentPercentage: z.number().optional(),
  materials: z.string().optional(),
}).optional();

// Schema for Compliance Tab
export const complianceSchema = z.object({
  eprelId: z.string().optional(),
}).optional();


// Main Form Schema
export const formSchema = z.object({
  productName: z.string().min(2, "Product name must be at least 2 characters."),
  category: z.string().min(2, "Category is required."),
  
  // Nested objects for each tab
  technical: technicalDetailsSchema,
  sustainability: sustainabilitySchema,
  compliance: complianceSchema,

  // Fields for AI origin tracking (optional)
  productNameOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  // Add other origin fields as needed
});

export type ProductFormData = z.infer<typeof formSchema>;
