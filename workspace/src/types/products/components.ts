// src/types/products/components.ts
/**
 * Component-specific types
 */
import type { Product, ProductListItem, ProductSearchFilters, ProductFormData } from './';
import type { ApiError } from './api';
import type { ReactNode } from 'react';
import type { UseFormReturn } from 'react-hook-form'; // Added

export interface ComponentProps {
  className?: string;
  testId?: string;
}

export interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
}

export interface ErrorState {
  hasError: boolean;
  error?: Error | ApiError;
  errorBoundary?: boolean;
}

export interface ProductComponentState extends LoadingState, ErrorState {
  product?: Product;
  isDirty?: boolean;
}

export interface ProductFormProps extends ComponentProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  validationSchema?: any;
}

export interface ProductFormSectionProps { // Added new generic form section props
  form: UseFormReturn<ProductFormData>;
  isSubmitting: boolean;
}

export interface ProductListProps extends ComponentProps {
  onProductSelect?: (productId: string) => void;
  onProductEdit?: (productId: string) => void;
  onProductDelete?: (productId: string, productName?: string) => void;
  onCreateNew?: () => void;
  showCreateButton?: boolean;
  showExportButton?: boolean;
  viewMode?: 'grid' | 'list';
  pageSize?: number;
}


export interface ProductDetailProps extends ComponentProps {
  productId: string;
  onEdit?: () => void;
  onDelete?: () => void;
  readOnly?: boolean;
}

// Utility types for hooks
export type UseProductQuery = {
  productId: string;
  options?: {
    enabled?: boolean;
    refetchOnWindowFocus?: boolean;
  };
};

export type UseProductMutation = {
  onSuccess?: (data: Product | string) => void; // string for delete
  onError?: (error: ApiError) => void;
};
