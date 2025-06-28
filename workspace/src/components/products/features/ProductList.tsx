// src/components/products/features/ProductList.tsx
/**
 * Feature component for product list with search and filtering
 */
"use client";

import React, { memo, useCallback, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, Download, Upload } from 'lucide-react';
import type { 
  ProductListItem, 
  ProductSearchFilters, 
  ComponentProps 
} from '@/types/products';
import { ProductCard } from '../ui/ProductCard';
import { ProductListSkeleton } from '../ui/ProductListSkeleton';
import { EmptyState } from '../../shared/EmptyState';
import { ErrorBoundary } from '../../shared/ErrorBoundary';
import { useProductList } from '@/hooks/products/useProduct';
import { useProductSearch } from '@/hooks/products/useProductSearch';
import { useDebounce } from '@/hooks/shared/useDebounce';
import { productExportService } from '@/services/products/exportService';

interface ProductListProps extends ComponentProps {
  onProductSelect?: (productId: string) => void;
  onProductEdit?: (productId: string) => void;
  onProductDelete?: (productId: string, productName?: string) => void;
  onCreateNew?: () => void;
  showCreateButton?: boolean;
  showExportButton?: boolean;
  viewMode?: 'grid' | 'list';
  pageSize?: number;
}

const ProductList = memo<ProductListProps>(({
  onProductSelect,
  onProductEdit,
  onProductDelete,
  onCreateNew,
  showCreateButton = true,
  showExportButton = true,
  viewMode = 'grid',
  pageSize = 20,
  className,
  testId,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ProductSearchFilters>({});
  
  const debouncedQuery = useDebounce(searchQuery, 300);
  
  const searchParams = useMemo(() => ({
    page: currentPage,
    limit: pageSize,
    query: debouncedQuery,
    ...filters,
    sortBy: 'updatedAt',
    sortOrder: 'desc' as const,
  }), [currentPage, pageSize, debouncedQuery, filters]);

  const {
    data: productsResponse,
    isLoading,
    error,
    refetch,
  } = useProductList(searchParams);

  const products = productsResponse?.data || [];
  const pagination = productsResponse?.pagination;

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  }, []);

  const handleFilterChange = useCallback((newFilters: Partial<ProductSearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page on filter change
  }, []);

  const handleExport = useCallback(async () => {
    try {
      const blob = await productExportService.exportToCSV(products);
      productExportService.downloadBlob(blob, `products-${new Date().toISOString().split('T')[0]}.csv`);
    } catch (error) {
      console.error('Export failed:', error);
    }
  }, [products]);

  const gridClasses = viewMode === 'grid' 
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
    : 'space-y-4';

  if (error) {
    return (
      <Card className={className} data-testid={testId}>
        <CardContent className="p-6">
          <EmptyState
            title="Failed to load products"
            description={error.message}
            action={
              <Button onClick={() => refetch()} variant="outline">
                Try Again
              </Button>
            }
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <ErrorBoundary fallback={<div>Something went wrong with the product list.</div>}>
      <div className={`space-y-6 ${className}`} data-testid={testId}>
        {/* Header and Actions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Products</CardTitle>
              <div className="flex items-center gap-2">
                {showExportButton && (
                  <Button variant="outline" size="sm" onClick={handleExport} disabled={products.length === 0}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                )}
                {showCreateButton && onCreateNew && (
                  <Button onClick={onCreateNew}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Product
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={e => handleSearch(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" disabled>
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
          </CardHeader>
        </Card>
        
        {/* Product List */}
        {isLoading ? (
          <ProductListSkeleton count={pageSize} viewMode={viewMode} />
        ) : products.length === 0 ? (
          <EmptyState
            title="No products found"
            description="Try adjusting your search or filters, or create a new product."
            action={onCreateNew ? <Button onClick={onCreateNew}>Create New Product</Button> : undefined}
          />
        ) : (
          <div className={gridClasses}>
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onView={onProductSelect}
                onEdit={onProductEdit}
                onDelete={onProductDelete}
              />
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === pagination.totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
});

ProductList.displayName = 'ProductList';

export { ProductList };
