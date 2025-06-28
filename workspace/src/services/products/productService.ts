// src/services/products/productService.ts
/**
 * Product service layer with comprehensive error handling and caching
 * This service currently uses mock data and simulates API calls.
 */

import type {
  Product,
  ProductFormData,
  ProductListItem,
  ProductSearchParams,
  ApiResponse,
  ApiError,
  PaginatedResponse,
} from '@/types/products';
import { MOCK_DPPS as mockDppData } from '@/data/mockDpps';
import { ValidationService } from '@/services/shared/validationService';
import { DataOrigin } from '@/types/products';

// A simple mock API delay
const apiDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

const mapDppToProduct = (dpp: any): Product => {
  return {
    id: dpp.id,
    createdAt: dpp.metadata.created_at || new Date().toISOString(),
    updatedAt: dpp.metadata.last_updated || new Date().toISOString(),
    version: dpp.version || 1,
    productName: dpp.productName || { value: "N/A", origin: DataOrigin.MANUAL, lastModified: new Date().toISOString() },
    manufacturer: dpp.manufacturer || { value: "N/A", origin: DataOrigin.MANUAL, lastModified: new Date().toISOString() },
    category: dpp.category || { value: "N/A", origin: DataOrigin.MANUAL, lastModified: new Date().toISOString() },
    status: dpp.status,
    complianceStatus: dpp.complianceStatus,
    lifecycleStage: dpp.lifecycleStage,
    details: dpp.details,
    tags: dpp.tags || [],
    metadata: dpp.metadata || {},
    gtin: dpp.gtin,
    modelNumber: dpp.modelNumber,
  };
};

export class ProductService {
  private validator: ValidationService;
  
  constructor() {
    this.validator = new ValidationService();
  }
  
  async getProducts(params: ProductSearchParams): Promise<PaginatedResponse<Product>> {
    await apiDelay(500);
    const products = mockDppData.map(mapDppToProduct);
    return {
      data: products,
      pagination: {
        page: params.page,
        limit: params.limit,
        total: products.length,
        totalPages: Math.ceil(products.length / params.limit),
      },
      status: 'success',
      message: 'Products fetched successfully',
      timestamp: new Date().toISOString(),
      requestId: `req_${Math.random()}`
    };
  }

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    await apiDelay(300);
    const product = mockDppData.find(p => p.id === id);
    if (!product) {
      throw { code: '404', message: 'Product not found' };
    }
    return { 
        data: mapDppToProduct(product),
        status: 'success',
        timestamp: new Date().toISOString(),
        requestId: `req_${Math.random()}`
    };
  }
  
  async createProduct(data: ProductFormData): Promise<ApiResponse<Product>> {
    await apiDelay(700);
    const now = new Date().toISOString();
    const newProduct: Product = {
      id: `PROD_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      version: 1,
      productName: { value: data.productName, origin: DataOrigin.MANUAL, lastModified: now },
      manufacturer: { value: data.manufacturer, origin: DataOrigin.MANUAL, lastModified: now },
      category: { value: data.category, origin: DataOrigin.MANUAL, lastModified: now },
      status: 'draft' as any,
      complianceStatus: 'pending' as any,
      lifecycleStage: 'design' as any,
      details: {
          description: { value: data.description, origin: DataOrigin.MANUAL, lastModified: now },
          materials: { value: data.materials.split(',').map(m=>({name: m.trim()})), origin: DataOrigin.MANUAL, lastModified: now },
          sustainabilityClaims: { value: data.sustainabilityClaims.split('\n'), origin: DataOrigin.MANUAL, lastModified: now },
          keyCompliancePoints: { value: data.keyCompliancePoints.split('\n'), origin: DataOrigin.MANUAL, lastModified: now },
          specifications: { value: JSON.parse(data.specifications || '{}'), origin: DataOrigin.MANUAL, lastModified: now },
          energyLabel: { value: data.energyLabel || 'N/A', origin: DataOrigin.MANUAL, lastModified: now },
          imageUrl: { value: data.imageUrl || '', origin: DataOrigin.MANUAL, lastModified: now },
          customAttributes: { value: data.customAttributes, origin: DataOrigin.MANUAL, lastModified: now },
      },
      tags: [],
      metadata: {},
    };
    console.log("Mock creating product:", newProduct);
    // In a real app, we would add to our state: mockDppData.push(newProduct as any);
    return {
        data: newProduct,
        status: 'success',
        message: 'Product created successfully',
        timestamp: now,
        requestId: `req_${Math.random()}`
    };
  }

  async updateProduct(id: string, data: Partial<ProductFormData>): Promise<ApiResponse<Product>> {
    await apiDelay(600);
    const index = mockDppData.findIndex(p => p.id === id);
    if (index === -1) {
      throw { code: '404', message: 'Product not found' };
    }
    const existing = mockDppData[index];
    const updatedProduct = { ...existing, ...data };
    console.log("Mock updating product:", id, "with", data);
    return {
        data: mapDppToProduct(updatedProduct),
        status: 'success',
        message: 'Product updated successfully',
        timestamp: new Date().toISOString(),
        requestId: `req_${Math.random()}`
    };
  }

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    await apiDelay(400);
    console.log("Mock deleting product:", id);
    return {
        data: undefined,
        status: 'success',
        message: 'Product deleted successfully',
        timestamp: new Date().toISOString(),
        requestId: `req_${Math.random()}`
    };
  }
}

export const productService = new ProductService();
