
// --- File: page.tsx (Product Detail Page) ---
// Description: Main page component for displaying individual product details.
"use client";

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import ProductContainer from '@/components/products/detail/ProductContainer';
import { SIMPLE_MOCK_PRODUCTS, USER_PRODUCTS_LOCAL_STORAGE_KEY } from '@/types/dpp';
import type { SimpleProductDetail, ProductSupplyChainLink, StoredUserProduct } from '@/types/dpp'; // Added StoredUserProduct
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"; // Added useToast

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.productId as string;
  const [product, setProduct] = useState<SimpleProductDetail | null | undefined>(undefined); // undefined for loading state
  const { toast } = useToast(); // Added toast

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
            // This mapping might need to be more comprehensive based on actual StoredUserProduct structure
            foundProduct = {
              id: userProductToDisplay.id,
              productName: userProductToDisplay.productName || "N/A",
              category: userProductToDisplay.productCategory || "N/A", // Assuming productCategory maps to category
              status: userProductToDisplay.status as SimpleProductDetail['status'] || "Draft",
              manufacturer: userProductToDisplay.manufacturer,
              gtin: userProductToDisplay.gtin,
              modelNumber: userProductToDisplay.modelNumber,
              description: userProductToDisplay.productDescription, // Assuming productDescription maps to description
              imageUrl: userProductToDisplay.imageUrl,
              // imageHint: userProductToDisplay.imageHint, // Add if StoredUserProduct has it
              // keySustainabilityPoints: userProductToDisplay.sustainabilityClaims?.split('\n').filter(s => s.trim() !== ''), // Example mapping
              // keyCompliancePoints: [], // Example mapping
              // specifications: userProductToDisplay.specifications ? JSON.parse(userProductToDisplay.specifications) : {}, // Example mapping
              materialsUsed: userProductToDisplay.materials ? [{ name: userProductToDisplay.materials }] : [], // Simplified mapping
              energyLabelRating: userProductToDisplay.energyLabel,
              supplyChainLinks: userProductToDisplay.supplyChainLinks || [], // Ensure this exists on StoredUserProduct or SimpleProductDetail
              // Add other fields from StoredUserProduct to SimpleProductDetail as needed
              // For now, focusing on supplyChainLinks
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
            lastUpdated: new Date().toISOString(), // Update lastUpdated timestamp
          };
          localStorage.setItem(USER_PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(userProducts));
          toast({
            title: "Supply Chain Updated",
            description: `Supplier links for ${product.productName} saved to local storage.`,
            variant: "default",
          });
        } else {
           toast({ title: "Error", description: "Could not find product in local storage to update.", variant: "destructive" });
        }
      } catch (error) {
        toast({ title: "Storage Error", description: "Failed to save supply chain updates to local storage.", variant: "destructive" });
        console.error("Error saving to localStorage:", error);
      }
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
