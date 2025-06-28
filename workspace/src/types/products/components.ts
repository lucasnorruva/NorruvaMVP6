// src/types/products/components.ts
/**
 * Component-specific types
 */
import { Product, ProductListItem, ProductSearchFilters, ProductFormData } from './';
import { ApiError } from './api';

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

export interface ProductListProps extends ComponentProps {
  products: ProductListItem[];
  filters?: ProductSearchFilters;
  onFilterChange?: (filters: ProductSearchFilters) => void;
  onProductSelect?: (productId: string) => void;
  isLoading?: boolean;
  error?: ApiError;
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
  onSuccess?: (data: Product | string) => void;
  onError?: (error: ApiError) => void;
};
