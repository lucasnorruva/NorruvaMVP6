// src/hooks/products/useProductSearch.ts
/**
 * Advanced search hook with debouncing and filtering
 */
"use client";

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useDebounce } from '@/hooks/shared/useDebounce';
import type { ProductSearchFilters, ProductListItem } from '@/types/products';

interface UseProductSearchOptions {
  initialFilters?: ProductSearchFilters;
  debounceDelay?: number;
  localSearch?: boolean;
  data?: ProductListItem[];
}

export function useProductSearch({
  initialFilters = {},
  debounceDelay = 300,
  localSearch = false,
  data = [],
}: UseProductSearchOptions = {}) {
  const [filters, setFilters] = useState<ProductSearchFilters>(initialFilters);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  // Debounce search query for performance
  const debouncedQuery = useDebounce(filters.query || '', debounceDelay);
  
  // Local search implementation
  const filteredData = useMemo(() => {
    if (!localSearch || !data.length) return data;
    
    return data.filter((product) => {
      // Text search
      if (debouncedQuery) {
        const searchText = debouncedQuery.toLowerCase();
        const searchableText = [
          product.productName,
          product.manufacturer,
          product.category,
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(searchText)) {
          return false;
        }
      }
      
      // Category filter
      if (filters.category && product.category !== filters.category) {
        return false;
      }
      
      // Manufacturer filter
      if (filters.manufacturer && product.manufacturer !== filters.manufacturer) {
        return false;
      }
      
      // Status filter
      if (filters.status?.length && !filters.status.includes(product.status)) {
        return false;
      }
      
      // Compliance status filter
      if (filters.complianceStatus?.length && 
          !filters.complianceStatus.includes(product.complianceStatus)) {
        return false;
      }
      
      return true;
    });
  }, [data, debouncedQuery, filters, localSearch]);
  
  // Update search history
  useEffect(() => {
    if (debouncedQuery && debouncedQuery.length > 2) {
      setSearchHistory(prev => {
        const newHistory = [debouncedQuery, ...prev.filter(q => q !== debouncedQuery)];
        return newHistory.slice(0, 10); // Keep last 10 searches
      });
    }
  }, [debouncedQuery]);
  
  // Filter update handlers
  const updateFilters = useCallback((newFilters: Partial<ProductSearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);
  
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);
  
  const clearSearch = useCallback(() => {
    setFilters(prev => ({ ...prev, query: undefined }));
  }, []);
  
  // Search suggestions based on history
  const searchSuggestions = useMemo(() => {
    if (!filters.query) return searchHistory;
    
    return searchHistory.filter(query =>
      query.toLowerCase().startsWith(filters.query!.toLowerCase())
    );
  }, [filters.query, searchHistory]);
  
  return {
    filters,
    updateFilters,
    clearFilters,
    clearSearch,
    filteredData,
    searchHistory,
    searchSuggestions,
  };
}
