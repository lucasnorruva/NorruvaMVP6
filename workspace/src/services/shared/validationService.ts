// src/services/shared/validationService.ts
/**
 * Validation service with comprehensive business rules
 */

import { z } from 'zod';
import type { ProductFormData, ProductSearchParams } from '@/types/products';
import { productFormSchema } from '@/utils/products/validation';

const searchParamsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.string().default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  query: z.string().max(200).optional(),
  category: z.string().max(50).optional(),
  manufacturer: z.string().max(100).optional(),
  status: z.array(z.string()).optional(),
  complianceStatus: z.array(z.string()).optional(),
});

export class ValidationService {
  async validateProductData(data: ProductFormData): Promise<ProductFormData> {
    try {
      return productFormSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation failed: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
      }
      throw error;
    }
  }

  async validatePartialProductData(data: Partial<ProductFormData>): Promise<Partial<ProductFormData>> {
    try {
      const partialSchema = productFormSchema.partial();
      return partialSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation failed: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
      }
      throw error;
    }
  }

  validateSearchParams(params: ProductSearchParams): ProductSearchParams {
    try {
      return searchParamsSchema.parse(params);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Search parameters validation failed: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
      }
      throw error;
    }
  }
}
