
// --- File: page.tsx (Product Detail Page) ---
// Description: Main page component for displaying individual product details.
"use client";

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import ProductContainer from '@/components/products/detail/ProductContainer';
import type { SimpleProductDetail, ProductSupplyChainLink, StoredUserProduct, DigitalProductPassport } from '@/types/dpp';
import { USER_PRODUCTS_LOCAL_STORAGE_KEY } from '@/types/dpp';
import { MOCK_DPPS } from '@/data';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { syncEprelData } from '@/ai/flows/sync-eprel-data-flow';
import { fetchProductDetails } from '@/utils/productDetailUtils'; // Import the new utility

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.productId as string;
  const [product, setProduct] = useState<SimpleProductDetail | null | undefined>(undefined);
  const [isSyncingEprel, setIsSyncingEprel] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (productId) {
      const loadProduct = async () => {
        const fetchedProduct = await fetchProductDetails(productId);
        // Simulate loading time for better UX, even if fetchProductDetails is quick
        setTimeout(() => {
          setProduct(fetchedProduct);
        }, 300);
      };
      loadProduct();
    }
  }, [productId]);

  const handleSupplyChainUpdate = (updatedLinks: ProductSupplyChainLink[]) => {
    if (!product) return;

    const updatedProductData = { ...product, supplyChainLinks: updatedLinks };
    setProduct(updatedProductData);

    if (product.id.startsWith("USER_PROD")) {
      try {
        const storedProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
        const userProducts: StoredUserProduct[] = storedProductsString ? JSON.parse(storedProductsString) : [];
        const productIndex = userProducts.findIndex(p => p.id === product.id);
        if (productIndex > -1) {
          userProducts[productIndex] = {
            ...userProducts[productIndex],
            supplyChainLinks: updatedLinks,
            lastUpdated: new Date().toISOString(),
          };
          localStorage.setItem(USER_PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(userProducts));
          toast({
            title: "Supply Chain Updated",
            description: `Supplier links for ${product.productName} saved to local storage.`,
            variant: "default",
          });
        } else {
           toast({ title: "Error Updating Storage", description: "Could not find product in local storage to update supply chain.", variant: "destructive" });
        }
      } catch (error) {
        toast({ title: "Storage Error", description: "Failed to save supply chain updates to local storage.", variant: "destructive" });
        console.error("Error saving supply chain to localStorage:", error);
      }
    } else {
        const mockDppIndex = MOCK_DPPS.findIndex(dpp => dpp.id === product.id);
        if (mockDppIndex > -1) {
            MOCK_DPPS[mockDppIndex].supplyChainLinks = updatedLinks;
            MOCK_DPPS[mockDppIndex].metadata.last_updated = new Date().toISOString();
        }
        toast({ title: "Supply Chain Updated (Session Only)", description: "Supply chain links updated for this session (mock product).", variant: "default" });
    }
  };

  const handleSyncEprel = async () => {
    if (!product || !product.modelNumber) {
      toast({ title: "Missing Information", description: "Product model number is required to sync with EPREL.", variant: "destructive" });
      return;
    }
    setIsSyncingEprel(true);
    try {
      const result = await syncEprelData({
        productId: product.id,
        productName: product.productName,
        modelNumber: product.modelNumber,
      });

      const currentComplianceSummary = product.complianceSummary || { overallStatus: "N/A" as SimpleProductDetail['complianceSummary']['overallStatus'] };
      
      let eprelIdToSet: string | undefined = currentComplianceSummary.eprel?.id;
      if (result.syncStatus.toLowerCase().includes('successfully') || result.syncStatus.toLowerCase().includes('mismatch')) {
        eprelIdToSet = result.eprelId; 
      } else if (result.syncStatus.toLowerCase().includes('not found') || result.syncStatus.toLowerCase().includes('error')) {
        eprelIdToSet = undefined; 
      }

      const newEprelData = {
        id: eprelIdToSet,
        status: result.syncStatus,
        lastChecked: result.lastChecked,
        url: currentComplianceSummary.eprel?.url, 
      };
      
      const updatedProductData: SimpleProductDetail = {
        ...product,
        complianceSummary: {
          ...currentComplianceSummary,
          eprel: newEprelData,
        },
      };
      setProduct(updatedProductData);

      if (product.id.startsWith("USER_PROD")) {
        const storedProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
        const userProducts: StoredUserProduct[] = storedProductsString ? JSON.parse(storedProductsString) : [];
        const productIndex = userProducts.findIndex(p => p.id === product.id);
        if (productIndex > -1) {
          if (!userProducts[productIndex].complianceSummary) { 
            userProducts[productIndex].complianceSummary = { overallStatus: "N/A" };
          }
          userProducts[productIndex].complianceSummary!.eprel = newEprelData;
          userProducts[productIndex].lastUpdated = result.lastChecked;
          localStorage.setItem(USER_PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(userProducts));
        }
      } else {
         const mockDppIndex = MOCK_DPPS.findIndex(dpp => dpp.id === product.id);
         if (mockDppIndex > -1 && MOCK_DPPS[mockDppIndex].compliance) {
            MOCK_DPPS[mockDppIndex].compliance.eprel = newEprelData;
            MOCK_DPPS[mockDppIndex].metadata.last_updated = result.lastChecked;
         }
      }
      toast({ title: "EPREL Sync", description: result.message, variant: result.syncStatus.toLowerCase().includes('error') || result.syncStatus.toLowerCase().includes('mismatch') ? "destructive" : "default" });

    } catch (error) {
      toast({ title: "EPREL Sync Error", description: `An unexpected error occurred during EPREL sync. ${error instanceof Error ? error.message : ''}`, variant: "destructive" });
      console.error("EPREL Sync Error:", error);
    } finally {
      setIsSyncingEprel(false);
    }
  };

  const canSyncEprel = !!product?.modelNumber;

  if (product === undefined) { 
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-xl font-medium text-muted-foreground">Loading product details...</p>
        <p className="text-sm text-muted-foreground/80 mt-1">Please wait a moment.</p>
      </div>
    );
  }

  if (!product) { 
    notFound();
  }

  return (
    <ProductContainer
      product={product}
      onSupplyChainUpdate={handleSupplyChainUpdate}
      onSyncEprel={handleSyncEprel}
      isSyncingEprel={isSyncingEprel}
      canSyncEprel={canSyncEprel}
    />
  );
}

    