// src/types/products/api.ts
/**
 * API-specific types
 */
import type { Product, ProductStatus, ComplianceStatus } from './base';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error' | 'warning';
  timestamp: string;
  requestId: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  requestId: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductListItem {
  id: string;
  productName: string;
  manufacturer: string;
  category: string;
  status: ProductStatus;
  complianceStatus: ComplianceStatus;
  lastUpdated: string;
  imageUrl?: string;
  completenessScore: number;
}

export interface ProductSearchFilters {
  query?: string;
  category?: string;
  manufacturer?: string;
  status?: ProductStatus[];
  complianceStatus?: ComplianceStatus[];
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
}

export interface ProductSearchParams extends ProductSearchFilters {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}
