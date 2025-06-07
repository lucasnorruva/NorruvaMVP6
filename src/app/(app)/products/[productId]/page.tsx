
// --- File: page.tsx (Product Detail Page) ---
// Description: Main page component for displaying individual product details.
"use client";

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import ProductContainer from '@/components/products/detail/ProductContainer';
import { SIMPLE_MOCK_PRODUCTS, USER_PRODUCTS_LOCAL_STORAGE_KEY } from '@/types/dpp';
import type { SimpleProductDetail, ProductSupplyChainLink, StoredUserProduct, ProductComplianceSummary } from '@/types/dpp';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { syncEprelData } from '@/ai/flows/sync-eprel-data-flow';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.productId as string;
  const [product, setProduct] = useState<SimpleProductDetail | null | undefined>(undefined); // undefined for loading state
  const [isSyncingEprel, setIsSyncingEprel] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (productId) {
      let foundProduct: SimpleProductDetail | undefined = SIMPLE_MOCK_PRODUCTS.find(p => p.id === productId);
      
      if (!foundProduct && productId.startsWith("USER_PROD")) {
        const storedProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
        if (storedProductsString) {
          const userProducts: StoredUserProduct[] = JSON.parse(storedProductsString);
          const userProductToDisplay = userProducts.find(p => p.id === productId);
          if (userProductToDisplay) {
            // Ensure complianceSummary and its eprel/ebsi fields are objects
            const complianceSummary: ProductComplianceSummary = {
              overallStatus: userProductToDisplay.complianceSummary?.overallStatus || "N/A",
              eprel: userProductToDisplay.complianceSummary?.eprel || { status: "N/A", lastChecked: new Date().toISOString() },
              ebsi: userProductToDisplay.complianceSummary?.ebsi || { status: "N/A", lastChecked: new Date().toISOString() },
              specificRegulations: userProductToDisplay.complianceSummary?.specificRegulations || [],
            };

            foundProduct = {
              id: userProductToDisplay.id,
              productName: userProductToDisplay.productName || "N/A",
              category: userProductToDisplay.productCategory || "N/A",
              status: (userProductToDisplay.status as SimpleProductDetail['status']) || "Draft",
              manufacturer: userProductToDisplay.manufacturer,
              gtin: userProductToDisplay.gtin,
              modelNumber: userProductToDisplay.modelNumber,
              description: userProductToDisplay.productDescription,
              imageUrl: userProductToDisplay.imageUrl,
              imageHint: userProductToDisplay.imageHint,
              supplyChainLinks: userProductToDisplay.supplyChainLinks || [],
              keySustainabilityPoints: userProductToDisplay.sustainabilityClaims?.split('\n').map(s => s.trim()).filter(Boolean) || [],
              specifications: userProductToDisplay.specifications ? JSON.parse(userProductToDisplay.specifications) : undefined,
              complianceSummary: complianceSummary, 
              lifecycleEvents: userProductToDisplay.lifecycleEvents,
              keyCompliancePoints: [], 
              materialsUsed: userProductToDisplay.materials ? userProductToDisplay.materials.split(',').map(m => ({name: m.trim()})) : [],
              energyLabelRating: userProductToDisplay.energyLabel,
            };
          }
        }
      }
      
      setTimeout(() => { 
        setProduct(foundProduct || null);
      }, 300); 
    }
  }, [productId]);

  const handleSupplyChainUpdate = (updatedLinks: ProductSupplyChainLink[]) => {
    if (!product) return;

    const updatedProduct = { ...product, supplyChainLinks: updatedLinks };
    setProduct(updatedProduct);

    if (product.id.startsWith("USER_PROD")) {
      try {
        const storedProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
        let userProducts: StoredUserProduct[] = storedProductsString ? JSON.parse(storedProductsString) : [];
        
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

      const updatedProduct: SimpleProductDetail = {
        ...product,
        complianceSummary: {
          ...product.complianceSummary,
          overallStatus: product.complianceSummary?.overallStatus || "N/A", // Keep existing overallStatus or default
          eprel: {
            id: result.eprelId || product.complianceSummary?.eprel?.id, // Preserve old ID if new one isn't returned
            status: result.syncStatus,
            lastChecked: result.lastChecked,
            url: product.complianceSummary?.eprel?.url, // Preserve existing URL
          },
          ebsi: product.complianceSummary?.ebsi,
          specificRegulations: product.complianceSummary?.specificRegulations,
        },
      };
      setProduct(updatedProduct); 

      if (product.id.startsWith("USER_PROD")) {
        const storedProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
        let userProducts: StoredUserProduct[] = storedProductsString ? JSON.parse(storedProductsString) : [];
        const productIndex = userProducts.findIndex(p => p.id === product.id);
        if (productIndex > -1) {
          // Ensure complianceSummary exists on the stored product before updating its eprel part
          if (!userProducts[productIndex].complianceSummary) {
            userProducts[productIndex].complianceSummary = { overallStatus: "N/A" };
          }
           userProducts[productIndex].complianceSummary!.eprel = updatedProduct.complianceSummary?.eprel;
           userProducts[productIndex].lastUpdated = result.lastChecked;
          localStorage.setItem(USER_PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(userProducts));
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

    
