"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Eye } from "lucide-react";
import { MOCK_DPPS } from "@/data";
import type { DigitalProductPassport } from "@/types/dpp";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Filter mock DPPs for those needing attention
const productsNeedingAttentionList: DigitalProductPassport[] = MOCK_DPPS.filter(
  (dpp) =>
    dpp.metadata.status === "pending_review" ||
    dpp.metadata.status === "flagged",
);
const displayLimit = 3;
const displayedProducts = productsNeedingAttentionList.slice(0, displayLimit);
const remainingCount =
  productsNeedingAttentionList.length - displayedProducts.length;

export default function AdminProductsAttentionCard() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5 text-destructive" />
          Products Awaiting Action
        </CardTitle>
        <CardDescription>
          Products that are flagged or pending review.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {displayedProducts.length > 0 ? (
          <ul className="space-y-3">
            {displayedProducts.map((product) => (
              <li
                key={product.id}
                className="flex items-center justify-between p-3 border rounded-md bg-muted/30"
              >
                <div>
                  <Link
                    href={`/products/${product.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {product.productName} ({product.id})
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    Category: {product.category}
                  </p>
                </div>
                <Badge
                  variant={
                    product.metadata.status === "pending_review"
                      ? "outline"
                      : "destructive"
                  }
                  className={cn(
                    "capitalize",
                    product.metadata.status === "pending_review" &&
                      "bg-yellow-100 text-yellow-700 border-yellow-300",
                    product.metadata.status === "flagged" &&
                      "bg-red-100 text-red-700 border-red-300",
                  )}
                >
                  {product.metadata.status.replace("_", " ")}
                </Badge>
              </li>
            ))}
            {remainingCount > 0 && (
              <p className="text-xs text-muted-foreground text-center mt-3">
                ...and {remainingCount} more product(s) requiring attention.
              </p>
            )}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            No products currently require immediate attention.
          </p>
        )}
        <Button
          variant="secondary"
          size="sm"
          className="mt-4 w-full sm:w-auto"
          asChild
        >
          <Link href="/products?status=pending_review&status=flagged">
            <Eye className="mr-2 h-4 w-4" /> View All Products Requiring Action
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
