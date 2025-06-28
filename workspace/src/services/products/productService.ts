// src/services/products/productService.ts
/**
 * Mock product service layer
 */
import type { Product, ProductFormData, ProductSearchParams, ApiResponse, PaginatedResponse } from '@/types/products';
import { MOCK_DPPS as mockDppData } from '@/data/mockDpps';

// A simple mock API delay
const apiDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

const mapToProduct = (dpp: any): Product => {
    // This is a conceptual mapping. In a real app, this would be more robust.
    return {
        id: dpp.id,
        createdAt: dpp.metadata.created_at || new Date().toISOString(),
        updatedAt: dpp.metadata.last_updated,
        version: dpp.version || 1,
        productName: { value: dpp.productName, origin: 'manual', lastModified: dpp.metadata.last_updated },
        manufacturer: { value: dpp.manufacturer?.name, origin: 'manual', lastModified: dpp.metadata.last_updated },
        category: { value: dpp.category, origin: 'manual', lastModified: dpp.metadata.last_updated },
        status: dpp.metadata.status,
        complianceStatus: dpp.complianceSummary?.overallStatus === 'Compliant' ? 'compliant' : 'pending',
        lifecycleStage: 'in_use',
        details: dpp.productDetails,
        tags: [],
        metadata: dpp.metadata,
    } as Product;
}

export const productService = {
  async getProducts(params: ProductSearchParams): Promise<PaginatedResponse<Product>> {
    await apiDelay(500);
    console.log('Fetching products with params:', params);
    // Simple filtering for mock
    let products = mockDppData.map(mapToProduct);
    if (params.query) {
        products = products.filter(p => p.productName.value.toLowerCase().includes(params.query!.toLowerCase()));
    }
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
  },

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    await apiDelay(300);
    const product = mockDppData.find(p => p.id === id);
    if (!product) {
      throw { code: '404', message: 'Product not found' };
    }
    return { 
        data: mapToProduct(product),
        status: 'success',
        timestamp: new Date().toISOString(),
        requestId: `req_${Math.random()}`
    };
  },

  async createProduct(data: ProductFormData): Promise<ApiResponse<Product>> {
    await apiDelay(700);
    const newProduct: Product = {
        id: `PROD_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
        productName: { value: data.productName, origin: 'manual', lastModified: new Date().toISOString() },
        manufacturer: { value: data.manufacturer, origin: 'manual', lastModified: new Date().toISOString() },
        category: { value: data.category, origin: 'manual', lastModified: new Date().toISOString() },
        status: 'draft',
        complianceStatus: 'pending',
        lifecycleStage: 'design',
        details: data as any, // Unsafe mapping for mock
        tags: [],
        metadata: {},
    };
    // mockDppData.push(newProduct as any); // Don't actually mutate the mock data for now
    console.log("Mock creating product:", newProduct);
    return {
        data: newProduct,
        status: 'success',
        message: 'Product created successfully',
        timestamp: new Date().toISOString(),
        requestId: `req_${Math.random()}`
    };
  },

  async updateProduct(id: string, data: Partial<ProductFormData>): Promise<ApiResponse<Product>> {
    await apiDelay(600);
    const index = mockDppData.findIndex(p => p.id === id);
    if (index === -1) {
      throw { code: '404', message: 'Product not found' };
    }
    const updatedProduct = { ...mockDppData[index], ...data }; // simple merge for mock
    // mockDppData[index] = updatedProduct;
    console.log("Mock updating product:", id, "with", data);
    return {
        data: mapToProduct(updatedProduct),
        status: 'success',
        message: 'Product updated successfully',
        timestamp: new Date().toISOString(),
        requestId: `req_${Math.random()}`
    };
  },

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    await apiDelay(400);
    const index = mockDppData.findIndex(p => p.id === id);
    if (index === -1) {
      throw { code: '404', message: 'Product not found' };
    }
    // mockDppData.splice(index, 1);
    console.log("Mock deleting product:", id);
    return {
        data: undefined,
        status: 'success',
        message: 'Product deleted successfully',
        timestamp: new Date().toISOString(),
        requestId: `req_${Math.random()}`
    };
  },
};
