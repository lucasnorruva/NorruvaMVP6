
"use client";

import type { SimpleProductDetail } from "@/types/dpp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { FileText, CheckCircle, Leaf, ShieldCheck, Tag, Barcode, ListChecks, Info, Fingerprint, Link as LinkIcon } from "lucide-react"; // Added Fingerprint, Link as LinkIcon
import { getAiHintForImage } from "@/utils/imageUtils";
import NextLink from "next/link"; // Renamed to avoid conflict with LinkIcon

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
  let specificationsError = false;
  if (product.specifications && typeof product.specifications === 'string' && product.specifications.trim()) {
      try {
          parsedSpecifications = JSON.parse(product.specifications);
          if (Object.keys(parsedSpecifications).length === 0 && product.specifications.trim() !== '{}') {
             parsedSpecifications = { "Raw Data": product.specifications };
          }
      } catch (e) {
          console.warn("Failed to parse specifications JSON string:", e);
          parsedSpecifications = { "Unformatted Specifications": product.specifications };
          specificationsError = true;
      }
  } else if (product.specifications && typeof product.specifications === 'object' && product.specifications !== null) {
    parsedSpecifications = product.specifications;
  }


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
                fill 
                className="object-contain" 
                data-ai-hint={aiHint}
                priority={!imageDisplayUrl.startsWith("data:")}
              />
            </AspectRatio>
          </CardHeader>
        </Card>

        {(product.gtin || product.modelNumber || product.sku || product.nfcTagId || product.rfidTagId) && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <Barcode className="mr-2 h-5 w-5 text-primary" />
                Identifiers
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1.5">
              {product.sku && (
                <p><strong className="text-muted-foreground">SKU:</strong> {product.sku}</p>
              )}
              {product.gtin && (
                <p><strong className="text-muted-foreground">GTIN:</strong> {product.gtin}</p>
              )}
              {product.modelNumber && (
                <p><strong className="text-muted-foreground">Model:</strong> {product.modelNumber}</p>
              )}
              {product.nfcTagId && (
                <p><strong className="text-muted-foreground">NFC Tag ID:</strong> {product.nfcTagId}</p>
              )}
              {product.rfidTagId && (
                <p><strong className="text-muted-foreground">RFID Tag ID:</strong> {product.rfidTagId}</p>
              )}
            </CardContent>
          </Card>
        )}

        {(product.authenticationVcId || product.ownershipNftLink) && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <Fingerprint className="mr-2 h-5 w-5 text-primary" />
                Authenticity & Ownership
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              {product.authenticationVcId && (
                <div>
                  <strong className="text-muted-foreground">Authenticity VC ID:</strong>
                  <p className="font-mono text-xs break-all text-foreground/90">{product.authenticationVcId}</p>
                </div>
              )}
              {product.ownershipNftLink && (
                <div className="mt-1.5 pt-1.5 border-t border-border/50">
                  <strong className="text-muted-foreground block mb-0.5">Ownership NFT:</strong>
                  <p>Token ID: <span className="font-mono text-foreground/90">{product.ownershipNftLink.tokenId}</span></p>
                  <p>Contract: <span className="font-mono text-xs break-all text-foreground/90">{product.ownershipNftLink.contractAddress}</span></p>
                  {product.ownershipNftLink.chainName && <p>Chain: <span className="text-foreground/90">{product.ownershipNftLink.chainName}</span></p>}
                  {product.ownershipNftLink.registryUrl && (
                    <NextLink href={product.ownershipNftLink.registryUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center text-xs mt-1">
                      View on Registry <LinkIcon className="ml-1 h-3 w-3" />
                    </NextLink>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

      </div>

      {/* Right Column: Description, Key Points, Specifications, Custom Attributes */}
      <div className="md:col-span-2 space-y-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            {product.description ? (
              <ScrollArea className="h-32 pr-3">
                <p className="text-sm text-foreground/90 whitespace-pre-line">{product.description}</p>
              </ScrollArea>
            ) : (
              <p className="text-sm text-muted-foreground">No description provided.</p>
            )}
          </CardContent>
        </Card>

        <div className="grid sm:grid-cols-2 gap-6">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-lg font-semibold flex items-center"><Leaf className="mr-2 h-5 w-5 text-green-600" />Key Sustainability</CardTitle></CardHeader>
            <CardContent>
              {product.keySustainabilityPoints && product.keySustainabilityPoints.length > 0 ? (
                <ul className="space-y-1.5 text-sm">
                  {product.keySustainabilityPoints.map((point, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-success flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No key sustainability points listed.</p>
              )}
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-lg font-semibold flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-blue-600" />Key Compliance</CardTitle></CardHeader>
            <CardContent>
               {product.keyCompliancePoints && product.keyCompliancePoints.length > 0 ? (
                <ul className="space-y-1.5 text-sm">
                  {product.keyCompliancePoints.map((point, index) => (
                    <li key={index} className="flex items-center">
                      <ShieldCheck className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No key compliance points listed.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <Tag className="mr-2 h-5 w-5 text-primary" />
              Technical Specifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(parsedSpecifications).length > 0 ? (
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {Object.entries(parsedSpecifications).map(([key, value]) => (
                  <div key={key} className="flex">
                    <dt className="font-medium text-muted-foreground w-1/3 truncate capitalize">{key.replace(/([A-Z]+(?=[A-Z][a-z]))|([A-Z](?=[a-z]))/g, ' $1$2').trim()}:</dt>
                    <dd className="text-foreground/90 w-2/3 whitespace-pre-wrap">{String(value)}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-sm text-muted-foreground">No technical specifications provided.</p>
            )}
             {specificationsError && (
              <p className="text-xs text-orange-600 mt-2 flex items-center"><Info className="h-3.5 w-3.5 mr-1"/>Specifications data might not be correctly formatted as JSON.</p>
            )}
          </CardContent>
        </Card>

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
