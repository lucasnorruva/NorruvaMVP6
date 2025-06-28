// src/services/products/exportService.ts
/**
 * Service for exporting product data in various formats
 */
import type { ProductListItem } from '@/types/products';

export class ProductExportService {
  async exportToCSV(products: ProductListItem[]): Promise<Blob> {
    const headers = [
      'ID',
      'Product Name',
      'Manufacturer',
      'Category',
      'Status',
      'Compliance Status',
      'Last Updated',
      'Completeness Score',
    ];

    const csvContent = [
      headers.join(','),
      ...products.map(product => [
        product.id,
        `"${product.productName.replace(/"/g, '""')}"`,
        `"${product.manufacturer.replace(/"/g, '""')}"`,
        `"${product.category.replace(/"/g, '""')}"`,
        product.status,
        product.complianceStatus,
        product.lastUpdated,
        product.completenessScore,
      ].join(','))
    ].join('\n');

    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  }

  async exportToJSON(products: ProductListItem[]): Promise<Blob> {
    const jsonContent = JSON.stringify(products, null, 2);
    return new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  }

  async exportToXLSX(products: ProductListItem[]): Promise<Blob> {
    // In a real implementation, you would use a library like xlsx or exceljs
    // For now, return CSV format as a mock
    console.warn("XLSX export is not fully implemented. Returning CSV instead.");
    return this.exportToCSV(products);
  }

  downloadBlob(blob: Blob, filename: string): void {
    if (typeof window === 'undefined') return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const productExportService = new ProductExportService();
