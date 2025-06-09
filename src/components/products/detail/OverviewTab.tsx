
"use client";

import type { SimpleProductDetail } from "@/types/dpp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { FileText, CheckCircle, Leaf, ShieldCheck, Tag, Barcode, ListChecks } from "lucide-react";
import { getAiHintForImage } from "@/utils/imageUtils"; // Import centralized utility

interface OverviewTabProps {
  product: SimpleProductDetail;
}

export default function OverviewTab({ product }: OverviewTabProps) {
  if (!product) {
    return <p className="text-muted-foreground p-4">Product data not available.</p>;
  }

  const imageDisplayUrl = product.imageUrl || "https://placehold.co/400x300.png?text=No+Image";
  const aiHint = getAiHintForImage({
    productName: product.productName,
    category: product.category,
    imageHint: product.imageHint,
  });

  let parsedSpecifications: Record<string, any> = {};
  if (product.specifications && typeof product.specifications === 'string') {
      try {
          parsedSpecifications = JSON.parse(product.specifications);
      } catch (e) {
          console.warn("Failed to parse specifications JSON string, displaying as raw string or handling as error.", e);
          // Display raw string if parsing fails and it's not empty
          if (product.specifications.trim() !== "") {
            parsedSpecifications = { "Raw Specifications": product.specifications };
          }
      }
  }
  // Note: If product.specifications was already an object, it would be used directly by `SimpleProductDetail` type,
  // but current mapping ensures it's a string for `SimpleProductDetail` if coming from `DigitalProductPassport`.

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Left Column: Image and Identifiers */}
      <div className="md:col-span-1 space-y-6">
        <Card className="overflow-hidden shadow-sm">
          <CardHeader className="p-0">
            <AspectRatio ratio={4 / 3} className="bg-muted">
              <Image
                src={imageDisplayUrl}
                alt={product.productName}
                fill // Use fill for AspectRatio
                className="object-contain" // object-contain to ensure full image is visible
                data-ai-hint={aiHint}
                priority={!imageDisplayUrl.startsWith("data:")} // Avoid priority for Data URIs
              />
            </AspectRatio>
          </CardHeader>
        </Card>

        {(product.gtin || product.modelNumber) && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <Barcode className="mr-2 h-5 w-5 text-primary" />
                Identifiers
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1.5">
              {product.gtin && (
                <p><strong className="text-muted-foreground">GTIN:</strong> {product.gtin}</p>
              )}
              {product.modelNumber && (
                <p><strong className="text-muted-foreground">Model:</strong> {product.modelNumber}</p>
              )}
              {!product.gtin && !product.modelNumber && (
                <p className="text-muted-foreground">No identifiers provided.</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Right Column: Description, Key Points, Specifications, Custom Attributes */}
      <div className="md:col-span-2 space-y-6">
        {product.description ? (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-32 pr-3">
                <p className="text-sm text-foreground/90 whitespace-pre-line">{product.description}</p>
              </ScrollArea>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No description provided.</p>
            </CardContent>
          </Card>
        )}

        <div className="grid sm:grid-cols-2 gap-6">
          {product.keySustainabilityPoints && product.keySustainabilityPoints.length > 0 ? (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Leaf className="mr-2 h-5 w-5 text-green-600" />
                  Key Sustainability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5 text-sm">
                  {product.keySustainabilityPoints.map((point, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : (
             <Card className="shadow-sm">
                <CardHeader><CardTitle className="text-lg font-semibold flex items-center"><Leaf className="mr-2 h-5 w-5 text-green-600" />Key Sustainability</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">No key sustainability points listed.</p></CardContent>
            </Card>
          )}

          {product.keyCompliancePoints && product.keyCompliancePoints.length > 0 ? (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <ShieldCheck className="mr-2 h-5 w-5 text-blue-600" />
                  Key Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5 text-sm">
                  {product.keyCompliancePoints.map((point, index) => (
                    <li key={index} className="flex items-center">
                      <ShieldCheck className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : (
             <Card className="shadow-sm">
                <CardHeader><CardTitle className="text-lg font-semibold flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-blue-600" />Key Compliance</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">No key compliance points listed.</p></CardContent>
            </Card>
          )}
        </div>

        {Object.keys(parsedSpecifications).length > 0 ? (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <Tag className="mr-2 h-5 w-5 text-primary" />
                Technical Specifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {Object.entries(parsedSpecifications).map(([key, value]) => (
                  <div key={key} className="flex">
                    <dt className="font-medium text-muted-foreground w-1/3 truncate capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</dt>
                    <dd className="text-foreground/90 w-2/3 whitespace-pre-wrap">{String(value)}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        ) : (
           <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-lg font-semibold flex items-center"><Tag className="mr-2 h-5 w-5 text-primary" />Technical Specifications</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">No technical specifications provided.</p></CardContent>
          </Card>
        )}

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <ListChecks className="mr-2 h-5 w-5 text-primary" />
              Additional Attributes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {product.customAttributes && product.customAttributes.length > 0 ? (
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {product.customAttributes.map((attr) => (
                  <div key={attr.key} className="flex">
                    <dt className="font-medium text-muted-foreground w-1/3 truncate">{attr.key}:</dt>
                    <dd className="text-foreground/90 w-2/3 whitespace-pre-wrap">{attr.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-sm text-muted-foreground">No additional attributes provided.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

