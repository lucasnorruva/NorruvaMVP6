// src/services/products/aiService.ts
/**
 * AI service for product data extraction and suggestions
 * This is a conceptual service layer. In a real app, this would make calls to a backend that runs Genkit flows.
 */
import type { ProductFormData } from '@/types/products';
import { generateProductName } from '@/ai/flows/generate-product-name-flow';
import { generateProductDescription } from '@/ai/flows/generate-product-description-flow';
import { generateProductSpecifications } from '@/ai/flows/generate-product-specifications-flow';
import { suggestKeySustainabilityPoints } from '@/ai/flows/suggest-key-sustainability-points';

export class ProductAIService {
  async generateProductName(category: string, description?: string): Promise<string> {
    const result = await generateProductName({
      productCategory: category,
      productDescription: description || '',
    });
    return result.productName;
  }

  async generateDescription(productName: string, category: string): Promise<string> {
    const result = await generateProductDescription({
      productName,
      productCategory: category,
    });
    return result.productDescription;
  }

  async generateSustainabilityClaims(materials: string, category: string): Promise<string[]> {
      const result = await suggestKeySustainabilityPoints({
        materials,
        productCategory: category
      });
      return result.sustainabilityPoints;
  }
  
  async generateSpecifications(productName: string, category: string): Promise<string> {
      const result = await generateProductSpecifications({
        productName,
        productCategory: category,
      });
      return result.specificationsJsonString;
  }
}

export const productAIService = new ProductAIService();
