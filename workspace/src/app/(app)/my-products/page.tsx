// --- File: src/app/(app)/my-products/page.tsx ---
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bookmark,
  Eye,
  Trash2,
  Info,
  ShoppingBag,
  Briefcase,
  CalendarDays,
  CheckCircle,
  AlertTriangle,
  PackageSearch,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MOCK_PUBLIC_PASSPORTS, MOCK_DPPS } from "@/data";
import type { PublicProductInfo, DigitalProductPassport } from "@/types/dpp";
import { TRACKED_PRODUCTS_STORAGE_KEY } from "@/types/dpp";
import { cn } from "@/lib/utils";

interface TrackedProductDisplayInfo
  extends Pick<
    PublicProductInfo,
    | "passportId"
    | "productName"
    | "imageUrl"
    | "category"
    | "imageHint"
    | "manufacturerName"
  > {
  status?: DigitalProductPassport["metadata"]["status"];
  lastUpdated?: string;
}

const getProductStatusBadgeVariant = (
  status?: DigitalProductPassport["metadata"]["status"],
) => {
  if (!status) return "secondary";
  switch (status) {
    case "published":
      return "default";
    case "draft":
      return "outline";
    case "pending_review":
      return "outline";
    default:
      return "secondary";
  }
};

const getProductStatusBadgeClass = (
  status?: DigitalProductPassport["metadata"]["status"],
) => {
  if (!status) return "bg-muted text-muted-foreground";
  switch (status) {
    case "published":
      return "bg-green-100 text-green-700 border-green-300";
    case "draft":
      return "bg-gray-100 text-gray-700 border-gray-300";
    case "pending_review":
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    case "archived":
      return "bg-muted text-muted-foreground";
    case "flagged":
      return "bg-red-100 text-red-700 border-red-300";
    case "revoked":
      return "bg-orange-100 text-orange-700 border-orange-300";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const ProductStatusIcon = ({
  status,
}: {
  status?: DigitalProductPassport["metadata"]["status"];
}) => {
  if (!status) return <Info className="mr-1.5 h-3 w-3" />;
  switch (status) {
    case "published":
      return <CheckCircle className="mr-1.5 h-3 w-3" />;
    case "pending_review":
      return <Info className="mr-1.5 h-3 w-3" />;
    case "flagged":
      return <AlertTriangle className="mr-1.5 h-3 w-3" />;
    default:
      return <Info className="mr-1.5 h-3 w-3" />;
  }
};

export default function MyTrackedProductsPage() {
  const [trackedProducts, setTrackedProducts] = useState<
    TrackedProductDisplayInfo[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadTrackedProducts = useCallback(() => {
    setIsLoading(true);
    const storedIdsString = localStorage.getItem(TRACKED_PRODUCTS_STORAGE_KEY);
    const trackedIds: string[] = storedIdsString
      ? JSON.parse(storedIdsString)
      : [];

    const productsToDisplay: TrackedProductDisplayInfo[] = trackedIds
      .map((id) => {
        const publicInfo =
          MOCK_PUBLIC_PASSPORTS[id] ||
          MOCK_PUBLIC_PASSPORTS[`PROD${id.replace("DPP", "")}`];
        const dppInfo = MOCK_DPPS.find((dpp) => dpp.id === id);

        if (publicInfo) {
          return {
            passportId: publicInfo.passportId,
            productName: publicInfo.productName,
            imageUrl:
              publicInfo.imageUrl ||
              "https://placehold.co/300x225.png?text=N/A",
            category: publicInfo.category,
            imageHint: publicInfo.imageHint,
            manufacturerName: publicInfo.manufacturerName,
            status: dppInfo?.metadata.status,
            lastUpdated: dppInfo?.metadata.last_updated,
          };
        }

        if (dppInfo) {
          return {
            passportId: dppInfo.id,
            productName: dppInfo.productName,
            imageUrl:
              dppInfo.productDetails?.imageUrl ||
              "https://placehold.co/300x225.png?text=N/A",
            category: dppInfo.category,
            imageHint: dppInfo.productDetails?.imageHint,
            manufacturerName: dppInfo.manufacturer?.name,
            status: dppInfo.metadata.status,
            lastUpdated: dppInfo.metadata.last_updated,
          };
        }
        return {
          passportId: id,
          productName: `Product ID: ${id} (Info not fully available)`,
          imageUrl: "https://placehold.co/300x225.png?text=Info+Missing",
          category: "Unknown",
          imageHint: "product",
          manufacturerName: "N/A",
          status: "draft",
          lastUpdated: new Date().toISOString(),
        };
      })
      .filter(Boolean) as TrackedProductDisplayInfo[];

    setTrackedProducts(
      productsToDisplay.sort((a, b) =>
        a.productName.localeCompare(b.productName),
      ),
    );
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadTrackedProducts();
  }, [loadTrackedProducts]);

  const handleUntrackProduct = (productId: string) => {
    const storedIdsString = localStorage.getItem(TRACKED_PRODUCTS_STORAGE_KEY);
    let trackedIds: string[] = storedIdsString
      ? JSON.parse(storedIdsString)
      : [];
    trackedIds = trackedIds.filter((id) => id !== productId);
    localStorage.setItem(
      TRACKED_PRODUCTS_STORAGE_KEY,
      JSON.stringify(trackedIds),
    );
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
            <Bookmark className="mr-3 h-7 w-7 text-primary" /> My Tracked
            Products
          </CardTitle>
          <CardDescription>
            Access and manage the Digital Product Passports you've saved for
            quick reference.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="text-center py-10 text-muted-foreground">
              <PackageSearch className="mx-auto h-12 w-12 mb-3 text-primary animate-pulse" />
              <p className="text-lg font-medium">
                Loading your tracked products...
              </p>
            </div>
          )}
          {!isLoading && trackedProducts.length === 0 && (
            <div className="text-center py-16 text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
              <ShoppingBag className="mx-auto h-16 w-16 mb-4 text-primary/70" />
              <p className="text-xl font-semibold text-foreground/90">
                You haven't tracked any products yet.
              </p>
              <p className="mt-2 text-sm">
                Visit a product's passport page and click the "Track This
                Product" button to add it here.
              </p>
              <Button
                asChild
                className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link href="/dpp-live-dashboard">Explore Live DPPs</Link>
              </Button>
            </div>
          )}
          {!isLoading && trackedProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {trackedProducts.map((product) => (
                <Card
                  key={product.passportId}
                  className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 rounded-lg border-border/50"
                >
                  <Link
                    href={`/passport/${product.passportId}`}
                    className="block aspect-[4/3] w-full bg-muted overflow-hidden relative group"
                  >
                    <Image
                      src={product.imageUrl}
                      alt={product.productName}
                      width={300}
                      height={225}
                      className="object-cover w-full h-full group-hover:opacity-90 transition-opacity"
                      data-ai-hint={
                        product.imageHint ||
                        `${product.category} ${product.productName.split(" ")[0]}`
                      }
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="h-8 w-8 text-white" />
                    </div>
                  </Link>
                  <CardHeader className="flex-grow pb-2 pt-4 px-4">
                    <CardTitle className="text-md font-semibold leading-tight h-10 overflow-hidden group">
                      <Link
                        href={`/passport/${product.passportId}`}
                        className="hover:text-primary transition-colors"
                      >
                        {product.productName}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-xs mt-0.5">
                      ID: {product.passportId}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-xs space-y-1.5 pt-0 pb-3 px-4">
                    <p className="flex items-center">
                      <Briefcase className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />{" "}
                      Manufacturer:{" "}
                      <span className="font-medium ml-1 truncate">
                        {product.manufacturerName || "N/A"}
                      </span>
                    </p>
                    <p className="flex items-center">
                      <Bookmark className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />{" "}
                      Category:{" "}
                      <span className="font-medium ml-1">
                        {product.category}
                      </span>
                    </p>
                    <div className="flex items-center">
                      <ProductStatusIcon status={product.status} />
                      <span className="text-muted-foreground mr-1">
                        Status:
                      </span>
                      <Badge
                        variant={getProductStatusBadgeVariant(product.status)}
                        className={cn(
                          "capitalize text-[0.7rem] px-1.5 py-0.5 h-auto",
                          getProductStatusBadgeClass(product.status),
                        )}
                      >
                        {product.status?.replace("_", " ") || "Unknown"}
                      </Badge>
                    </div>
                    <p className="flex items-center">
                      <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />{" "}
                      Last Updated:{" "}
                      <span className="font-medium ml-1">
                        {product.lastUpdated
                          ? new Date(product.lastUpdated).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </p>
                  </CardContent>
                  <div className="p-4 pt-2 border-t border-border/50">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleUntrackProduct(product.passportId)}
                      className="w-full"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Untrack Product
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
