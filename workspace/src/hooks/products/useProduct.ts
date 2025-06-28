// src/hooks/products/useProduct.ts
/**
 * Product-specific hooks with comprehensive error handling and performance optimization
 */
"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  Product,
  ProductFormData,
  ProductListItem,
  ProductSearchParams,
  ApiResponse,
  ApiError,
  UseProductQuery,
  UseProductMutation,
} from '@/types/products';
import { productService } from '@/services/products/productService';
import { useErrorHandler } from '@/hooks/shared/useErrorHandler';
import { useToast } from '@/hooks/use-toast';
import React from 'react';

// Query keys factory for better cache management
export const productQueryKeys = {
  all: ['products'] as const,
  lists: () => [...productQueryKeys.all, 'list'] as const,
  list: (params: Partial<ProductSearchParams>) => 
    [...productQueryKeys.lists(), params] as const,
  details: () => [...productQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...productQueryKeys.details(), id] as const,
  search: (query: string) => [...productQueryKeys.all, 'search', query] as const,
};

/**
 * Hook for fetching a single product with error handling and caching
 */
export function useProduct({ productId, options = {} }: UseProductQuery) {
  const { handleError } = useErrorHandler();
  
  return useQuery({
    queryKey: productQueryKeys.detail(productId),
    queryFn: async () => {
      try {
        const response = await productService.getProduct(productId);
        return response.data;
      } catch (error) {
        handleError(error as ApiError, 'Failed to fetch product');
        throw error;
      }
    },
    enabled: !!productId && options.enabled !== false,
    refetchOnWindowFocus: options.refetchOnWindowFocus ?? false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes, gcTime is the new name for cacheTime
    retry: (failureCount, error) => {
      // Don't retry on 404 or 403 errors
      const apiError = error as ApiError;
      if (apiError.code === '404' || apiError.code === '403') {
        return false;
      }
      return failureCount < 3;
    },
  });
}

/**
 * Hook for fetching product list with filters and pagination
 */
export function useProductList(params: ProductSearchParams) {
  const { handleError } = useErrorHandler();
  
  return useQuery({
    queryKey: productQueryKeys.list(params),
    queryFn: async () => {
      try {
        const response = await productService.getProducts(params);
        return response;
      } catch (error) {
        handleError(error as ApiError, 'Failed to fetch products');
        throw error;
      }
    },
    placeholderData: (previousData, previousQuery) => previousData, // keepPreviousData is now placeholderData
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for creating a new product
 */
export function useCreateProduct({ onSuccess, onError }: UseProductMutation = {}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { handleError } = useErrorHandler();
  
  return useMutation({
    mutationFn: async (data: ProductFormData) => {
      const response = await productService.createProduct(data);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch product list
      queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() });
      
      // Add new product to cache
      queryClient.setQueryData(productQueryKeys.detail(data.id), data);
      
      toast({
        title: 'Product Created',
        description: `${data.productName.value} has been successfully created.`,
        variant: 'default',
      });
      
      onSuccess?.(data);
    },
    onError: (error: ApiError) => {
      handleError(error, 'Failed to create product');
      onError?.(error);
    },
  });
}

/**
 * Hook for updating an existing product
 */
export function useUpdateProduct({ onSuccess, onError }: UseProductMutation = {}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { handleError } = useErrorHandler();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ProductFormData> }) => {
      const response = await productService.updateProduct(id, data);
      return response.data;
    },
    onSuccess: (data) => {
      // Update product in cache
      queryClient.setQueryData(productQueryKeys.detail(data.id), data);
      
      // Invalidate product list to ensure consistency
      queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() });
      
      toast({
        title: 'Product Updated',
        description: `${data.productName.value} has been successfully updated.`,
        variant: 'default',
      });
      
      onSuccess?.(data);
    },
    onError: (error: ApiError) => {
      handleError(error, 'Failed to update product');
      onError?.(error);
    },
  });
}

/**
 * Hook for deleting a product
 */
export function useDeleteProduct({ onSuccess, onError }: UseProductMutation = {}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { handleError } = useErrorHandler();
  
  return useMutation({
    mutationFn: async (productId: string) => {
      await productService.deleteProduct(productId);
      return productId;
    },
    onSuccess: (productId) => {
      // Remove product from cache
      queryClient.removeQueries({ queryKey: productQueryKeys.detail(productId) });
      
      // Invalidate product list
      queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() });
      
      toast({
        title: 'Product Deleted',
        description: 'Product has been successfully deleted.',
        variant: 'default',
      });
      
      onSuccess?.(productId as any);
    },
    onError: (error: ApiError) => {
      handleError(error, 'Failed to delete product');
      onError?.(error);
    },
  });
}
