
// --- File: page.tsx (Product Detail Page) ---
// Description: Main page component for displaying individual product details.
"use client";

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import ProductContainer from '@/components/products/detail/ProductContainer';
import { SIMPLE_MOCK_PRODUCTS, USER_PRODUCTS_LOCAL_STORAGE_KEY } from '@/types/dpp'; // Corrected import
import type { SimpleProductDetail, ProductSupplyChainLink, StoredUserProduct } from '@/types/dpp';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.productId as string;
  const [product, setProduct] = useState<SimpleProductDetail | null | undefined>(undefined); // undefined for loading state
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
            // Map StoredUserProduct to SimpleProductDetail for display
            foundProduct = {
              id: userProductToDisplay.id,
              productName: userProductToDisplay.productName || "N/A",
              category: userProductToDisplay.productCategory || "N/A",
              status: userProductToDisplay.status as SimpleProductDetail['status'] || "Draft",
              manufacturer: userProductToDisplay.manufacturer,
              gtin: userProductToDisplay.gtin,
              modelNumber: userProductToDisplay.modelNumber,
              description: userProductToDisplay.productDescription,
              imageUrl: userProductToDisplay.imageUrl,
              // Map other relevant fields from StoredUserProduct to SimpleProductDetail
              // For now, focusing on fields needed for already implemented tabs and supply chain
              supplyChainLinks: userProductToDisplay.supplyChainLinks || [],
              // You might need to construct complianceSummary and lifecycleEvents from StoredUserProduct
              // if they are managed there. For now, they might be undefined for USER_PROD if not explicitly mapped.
            };
          }
        }
      }
      
      setTimeout(() => {
        setProduct(foundProduct || null);
      }, 300); // Simulate fetch delay
    }
  }, [productId]);

  const handleSupplyChainUpdate = (updatedLinks: ProductSupplyChainLink[]) => {
    if (!product) return;

    setProduct(prevProduct => prevProduct ? { ...prevProduct, supplyChainLinks: updatedLinks } : null);

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


  if (product === undefined) { // Loading state
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  return <ProductContainer product={product} onSupplyChainUpdate={handleSupplyChainUpdate} />;
}

    