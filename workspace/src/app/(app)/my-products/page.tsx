
// --- File: src/app/(app)/my-products/page.tsx ---
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bookmark, Eye, Trash2, Info, ShoppingBag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MOCK_PUBLIC_PASSPORTS } from '@/data'; // Using public passport data for display
import type { PublicProductInfo } from '@/types/dpp';

const TRACKED_PRODUCTS_STORAGE_KEY = 'norruvaTrackedProductIds';

interface TrackedProductDisplayInfo extends Pick<PublicProductInfo, 'passportId' | 'productName' | 'imageUrl' | 'category' | 'imageHint'> {}

export default function MyTrackedProductsPage() {
  const [trackedProducts, setTrackedProducts] = useState<TrackedProductDisplayInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadTrackedProducts = useCallback(() => {
    setIsLoading(true);
    const storedIdsString = localStorage.getItem(TRACKED_PRODUCTS_STORAGE_KEY);
    const trackedIds: string[] = storedIdsString ? JSON.parse(storedIdsString) : [];
    
    const productsToDisplay: TrackedProductDisplayInfo[] = trackedIds.map(id => {
      const publicInfo = MOCK_PUBLIC_PASSPORTS[id] || MOCK_PUBLIC_PASSPORTS[`PROD${id.replace('DPP','')}`] ; // Attempt mapping if needed
      if (publicInfo) {
        return {
          passportId: publicInfo.passportId,
          productName: publicInfo.productName,
          imageUrl: publicInfo.imageUrl || "https://placehold.co/100x100.png?text=N/A",
          category: publicInfo.category,
          imageHint: publicInfo.imageHint
        };
      }
      // Fallback if product info not found in mocks (e.g. user-added ID from another source)
      return {
        passportId: id,
        productName: `Product ID: ${id}`,
        imageUrl: "https://placehold.co/100x100.png?text=Info+Missing",
        category: "Unknown",
        imageHint: "product"
      };
    }).filter(Boolean) as TrackedProductDisplayInfo[];
    
    setTrackedProducts(productsToDisplay);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadTrackedProducts();
  }, [loadTrackedProducts]);

  const handleUntrackProduct = (productId: string) => {
    const storedIdsString = localStorage.getItem(TRACKED_PRODUCTS_STORAGE_KEY);
    let trackedIds: string[] = storedIdsString ? JSON.parse(storedIdsString) : [];
    trackedIds = trackedIds.filter(id => id !== productId);
    localStorage.setItem(TRACKED_PRODUCTS_STORAGE_KEY, JSON.stringify(trackedIds));
    loadTrackedProducts(); // Reload the list
    toast({
      title: "Product Untracked",
      description: `Product ID ${productId} has been removed from your list.`,
    });
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-headline font-semibold flex items-center">
            <Bookmark className="mr-3 h-7 w-7 text-primary" /> My Tracked Products
          </CardTitle>
          <CardDescription>
            Access and manage the Digital Product Passports you've saved for quick reference.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-muted-foreground">Loading your tracked products...</p>}
          {!isLoading && trackedProducts.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              <ShoppingBag className="mx-auto h-12 w-12 mb-3" />
              <p className="text-lg font-medium">You haven't tracked any products yet.</p>
              <p className="mt-1">
                Visit a product's passport page and click "Track This Product" to add it to this list.
              </p>
              <Button asChild className="mt-4">
                <Link href="/dpp-live-dashboard">Explore Live DPPs</Link>
              </Button>
            </div>
          )}
          {!isLoading && trackedProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {trackedProducts.map((product) => (
                <Card key={product.passportId} className="flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div className="aspect-square w-full bg-muted overflow-hidden">
                    <Image
                      src={product.imageUrl}
                      alt={product.productName}
                      width={300}
                      height={300}
                      className="object-cover w-full h-full"
                      data-ai-hint={product.imageHint || `${product.category} ${product.productName.split(' ')[0]}`}
                    />
                  </div>
                  <CardHeader className="flex-grow pb-3 pt-4">
                    <CardTitle className="text-md font-semibold leading-tight h-12 overflow-hidden">
                      {product.productName}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      ID: {product.passportId} <br/> Category: {product.category}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col sm:flex-row gap-2 pt-0 pb-4 px-4">
                    <Button asChild size="sm" className="flex-1">
                      <Link href={`/passport/${product.passportId}`}>
                        <Eye className="mr-2 h-4 w-4" /> View Passport
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUntrackProduct(product.passportId)}
                      className="flex-1"
                    >
                      <Trash2 className="mr-2 h-4 w-4 text-destructive" /> Untrack
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
