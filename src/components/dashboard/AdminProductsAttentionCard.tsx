"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Eye } from "lucide-react";
import { MOCK_DPPS } from "@/types/dpp"; // Assuming this mock data is suitable for now
import type { DigitalProductPassport } from "@/types/dpp";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Filter mock DPPs for those needing attention
const productsNeedingAttention: DigitalProductPassport[] = MOCK_DPPS.filter(
  (dpp) => dpp.metadata.status === 'pending_review' || dpp.metadata.status === 'flagged'
).slice(0, 3); // Show a few examples

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
        {productsNeedingAttention.length > 0 ? (
          <ul className="space-y-3">
            {productsNeedingAttention.map((product) => (
              <li key={product.id} className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                <div>
                  <Link href={`/products/${product.id}`} className="font-medium text-primary hover:underline">
                    {product.productName} ({product.id})
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    Category: {product.category}
                  </p>
                </div>
                <Badge
                  variant={product.metadata.status === 'pending_review' ? "outline" : "destructive"}
                  className={cn(
                    "capitalize",
                    product.metadata.status === 'pending_review' && "bg-yellow-100 text-yellow-700 border-yellow-300",
                    product.metadata.status === 'flagged' && "bg-red-100 text-red-700 border-red-300"
                  )}
                >
                  {product.metadata.status.replace('_', ' ')}
                </Badge>
              </li>
            ))}
            {MOCK_DPPS.filter(dpp => dpp.metadata.status === 'pending_review' || dpp.metadata.status === 'flagged').length > 3 && (
                 <p className="text-xs text-muted-foreground text-center mt-3">And more...</p>
            )}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No products currently require immediate attention.</p>
        )}
        <Button variant="secondary" size="sm" className="mt-4 w-full sm:w-auto" asChild>
          <Link href="/products?status=pending_review&status=flagged">
            <Eye className="mr-2 h-4 w-4" /> View All Products Requiring Action
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
