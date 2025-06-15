
// --- File: src/app/(app)/my-products/page.tsx ---
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Eye, Trash2, Info, ShoppingBag, Briefcase, CalendarDays, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MOCK_PUBLIC_PASSPORTS } from '@/data'; 
import type { PublicProductInfo, DigitalProductPassport } from '@/types/dpp';
import { TRACKED_PRODUCTS_STORAGE_KEY } from '@/types/dpp'; 
import { cn } from "@/lib/utils";

interface TrackedProductDisplayInfo extends Pick<PublicProductInfo, 'passportId' | 'productName' | 'imageUrl' | 'category' | 'imageHint' | 'manufacturerName'> {
  status?: DigitalProductPassport['metadata']['status'];
  lastUpdated?: string;
}

const getProductStatusBadgeVariant = (status?: DigitalProductPassport['metadata']['status']) => {
    if (!status) return "secondary";
    switch (status) {
        case 'published': return "default";
        case 'draft': return "outline";
        case 'pending_review': return "outline";
        default: return "secondary";
    }
};

const getProductStatusBadgeClass = (status?: DigitalProductPassport['metadata']['status']) => {
    if (!status) return "bg-muted text-muted-foreground";
    switch (status) {
        case 'published': return "bg-green-100 text-green-700 border-green-300";
        case 'draft': return "bg-gray-100 text-gray-700 border-gray-300";
        case 'pending_review': return "bg-yellow-100 text-yellow-700 border-yellow-300";
        case 'archived': return "bg-muted text-muted-foreground";
        case 'flagged': return "bg-red-100 text-red-700 border-red-300";
        case 'revoked': return "bg-orange-100 text-orange-700 border-orange-300";
        default: return "bg-muted text-muted-foreground";
    }
};

const ProductStatusIcon = ({ status }: { status?: DigitalProductPassport['metadata']['status'] }) => {
    if (!status) return <Info className="mr-1.5 h-3 w-3" />;
    switch (status) {
        case 'published': return <CheckCircle className="mr-1.5 h-3 w-3" />;
        case 'pending_review': return <Info className="mr-1.5 h-3 w-3" />;
        case 'flagged': return <AlertTriangle className="mr-1.5 h-3 w-3" />;
        default: return <Info className="mr-1.5 h-3 w-3" />;
    }
};

export default function MyTrackedProductsPage() {
  const [trackedProducts, setTrackedProducts] = useState<TrackedProductDisplayInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadTrackedProducts = useCallback(() => {
    setIsLoading(true);
    const storedIdsString = localStorage.getItem(TRACKED_PRODUCTS_STORAGE_KEY);
    const trackedIds: string[] = storedIdsString ? JSON.parse(storedIdsString) : [];
    
    const productsToDisplay: TrackedProductDisplayInfo[] = trackedIds.map(id => {
      const publicInfo = MOCK_PUBLIC_PASSPORTS[id] || MOCK_PUBLIC_PASSPORTS[`PROD${id.replace('DPP','')}`] ; 
      if (publicInfo) {
        return {
          passportId: publicInfo.passportId,
          productName: publicInfo.productName,
          imageUrl: publicInfo.imageUrl || "https://placehold.co/100x100.png?text=N/A",
          category: publicInfo.category,
          imageHint: publicInfo.imageHint,
          manufacturerName: publicInfo.manufacturerName,
          status: publicInfo.status,
          lastUpdated: publicInfo.lastUpdated,
        };
      }
      return {
        passportId: id,
        productName: `Product ID: ${id}`,
        imageUrl: "https://placehold.co/100x100.png?text=Info+Missing",
        category: "Unknown",
        imageHint: "product",
        manufacturerName: "N/A",
        status: "draft", 
        lastUpdated: new Date().toISOString(),
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
    loadTrackedProducts(); 
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
                  <CardHeader className="flex-grow pb-2 pt-3">
                    <CardTitle className="text-md font-semibold leading-tight h-10 overflow-hidden">
                      {product.productName}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      ID: {product.passportId}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-xs space-y-1.5 pt-0 pb-3 px-4">
                    <p className="flex items-center"><Briefcase className="h-3.5 w-3.5 mr-1.5 text-muted-foreground"/> Manufacturer: <span className="font-medium ml-1 truncate">{product.manufacturerName || 'N/A'}</span></p>
                    <p className="flex items-center"><Tag className="h-3.5 w-3.5 mr-1.5 text-muted-foreground"/> Category: <span className="font-medium ml-1">{product.category}</span></p>
                     <div className="flex items-center">
                        <ProductStatusIcon status={product.status} />
                        Status: 
                        <Badge
                            variant={getProductStatusBadgeVariant(product.status)}
                            className={cn("ml-1.5 capitalize text-[0.7rem] px-1.5 py-0.5 h-auto", getProductStatusBadgeClass(product.status))}
                        >
                            {product.status?.replace('_', ' ') || 'Unknown'}
                        </Badge>
                    </div>
                    <p className="flex items-center"><CalendarDays className="h-3.5 w-3.5 mr-1.5 text-muted-foreground"/> Last Updated: <span className="font-medium ml-1">{product.lastUpdated ? new Date(product.lastUpdated).toLocaleDateString() : 'N/A'}</span></p>
                  </CardContent>
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
