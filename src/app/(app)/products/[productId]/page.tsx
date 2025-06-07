
// --- File: page.tsx (Product Detail Page) ---
// Description: Main page component for displaying individual product details.
"use client";

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import ProductContainer from '@/components/products/detail/ProductContainer';
import { SIMPLE_MOCK_PRODUCTS, USER_PRODUCTS_LOCAL_STORAGE_KEY } from '@/types/dpp';
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
              complianceSummary: userProductToDisplay.complianceSummary, 
              lifecycleEvents: userProductToDisplay.lifecycleEvents,
              // Ensure all fields from SimpleProductDetail are mapped
              keyCompliancePoints: [], // Add mock or derive if possible
              materialsUsed: userProductToDisplay.materials ? userProductToDisplay.materials.split(',').map(m => ({name: m.trim()})) : [],
              energyLabelRating: userProductToDisplay.energyLabel,
              // Add other SimpleProductDetail fields here if they exist in StoredUserProduct
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
          // Merge existing StoredUserProduct with updated supplyChainLinks and lastUpdated
          userProducts[productIndex] = {
            ...userProducts[productIndex], // Keep existing StoredUserProduct fields
            supplyChainLinks: updatedLinks, // Update only this part
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


  if (product === undefined) { 
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
