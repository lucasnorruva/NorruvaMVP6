"use client";

import type { SimpleProductDetail } from "@/types/dpp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  FileText,
  CheckCircle,
  Leaf,
  ShieldCheck,
  Tag,
  Barcode,
  ListChecks,
  Info,
  Fingerprint,
  Link as LinkIconPath,
  KeyRound,
  ExternalLink,
  Database,
  Anchor,
  Layers3,
  FileCog,
  Sigma,
  Layers as LayersIconShadcn,
  Cpu,
  SigmaSquare,
  Shirt,
  Construction,
  BatteryCharging,
  Activity as ActivityIcon,
  Thermometer,
  Zap,
  ClockIcon,
} from "lucide-react";
import { getAiHintForImage } from "@/utils/imageUtils";
import NextLink from "next/link";
import { getEbsiStatusBadge } from "@/utils/dppDisplayUtils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import React, { useState, useEffect } from "react"; // Added useState and useEffect

interface OverviewTabProps {
  product: SimpleProductDetail;
}

const LiveDataCard: React.FC<{ category: string }> = ({ category }) => {
  const [temperature, setTemperature] = useState<string>("N/A");
  const [usageHours, setUsageHours] = useState(
    Math.floor(Math.random() * 1000) + 200,
  );
  const [energyDraw, setEnergyDraw] = useState<string>("N/A");

  useEffect(() => {
    const tempInterval = setInterval(() => {
      if (category.toLowerCase().includes("appliance")) {
        setTemperature(`${(Math.random() * 6 + 2).toFixed(1)}°C`); // e.g., Refrigerator temp
      } else if (category.toLowerCase().includes("electronics")) {
        setTemperature(`${(Math.random() * 30 + 40).toFixed(1)}°C`); // e.g., CPU temp
      } else if (category.toLowerCase().includes("automotive")) {
        setTemperature(`${(Math.random() * 20 + 70).toFixed(1)}°C`); // e.g., Engine/Battery temp
      } else {
        setTemperature("Stable");
      }
    }, 5000);

    const usageInterval = setInterval(() => {
      setUsageHours((prev) => prev + Math.floor(Math.random() * 2) + 1); // Increment by 1 or 2 hours
    }, 10000); // Update every 10 seconds

    const energyInterval = setInterval(() => {
      if (category.toLowerCase().includes("appliance")) {
        setEnergyDraw(`${(Math.random() * 100 + 20).toFixed(0)}W`); // Typical appliance draw
      } else if (category.toLowerCase().includes("electronics")) {
        setEnergyDraw(`${(Math.random() * 50 + 10).toFixed(0)}W`); // Lower for electronics
      } else if (category.toLowerCase().includes("automotive")) {
        setEnergyDraw(`${(Math.random() * 5 + 1).toFixed(1)}kW`); // Higher for EV/Automotive
      } else {
        setEnergyDraw("Low");
      }
    }, 3000);

    return () => {
      clearInterval(tempInterval);
      clearInterval(usageInterval);
      clearInterval(energyInterval);
    };
  }, [category]);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <ActivityIcon className="mr-2 h-5 w-5 text-primary" />
          Live Product Data (Simulated IoT)
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <div className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
          <span className="flex items-center text-muted-foreground">
            <Thermometer className="h-4 w-4 mr-1.5 text-red-500" />
            Operating Temp:
          </span>
          <span className="font-semibold text-foreground/90">
            {temperature}
          </span>
        </div>
        <div className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
          <span className="flex items-center text-muted-foreground">
            <ClockIcon className="h-4 w-4 mr-1.5 text-blue-500" />
            Usage Hours:
          </span>
          <span className="font-semibold text-foreground/90">
            {usageHours.toLocaleString()} hrs
          </span>
        </div>
        <div className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
          <span className="flex items-center text-muted-foreground">
            <Zap className="h-4 w-4 mr-1.5 text-yellow-500" />
            Energy Draw:
          </span>
          <span className="font-semibold text-foreground/90">{energyDraw}</span>
        </div>
        <p className="text-xs text-muted-foreground text-center pt-2">
          Simulated IoT Data - For Demonstration Only.
        </p>
      </CardContent>
    </Card>
  );
};

export default function OverviewTab({ product }: OverviewTabProps) {
  if (!product) {
    return (
      <p className="text-muted-foreground p-4">Product data not available.</p>
    );
  }

  const imageDisplayUrl =
    product.imageUrl || "https://placehold.co/400x300.png?text=No+Image";
  const aiHint = getAiHintForImage({
    productName: product.productName,
    category: product.category,
    imageHint: product.imageHint,
  });

  let parsedSpecifications: Record<string, any> = {};
  let specificationsError = false;
  if (
    product.specifications &&
    typeof product.specifications === "string" &&
    product.specifications.trim()
  ) {
    try {
      parsedSpecifications = JSON.parse(product.specifications);
      if (
        Object.keys(parsedSpecifications).length === 0 &&
        product.specifications.trim() !== "{}"
      ) {
        parsedSpecifications = { "Raw Data": product.specifications };
      }
    } catch (e) {
      console.warn("Failed to parse specifications JSON string:", e);
      parsedSpecifications = {
        "Unformatted Specifications": product.specifications,
      };
      specificationsError = true;
    }
  } else if (
    product.specifications &&
    typeof product.specifications === "object" &&
    product.specifications !== null
  ) {
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

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <Barcode className="mr-2 h-5 w-5 text-primary" />
              Identifiers & Authenticity
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            {product.sku && (
              <p>
                <strong className="text-muted-foreground flex items-center">
                  <Tag className="mr-1.5 h-4 w-4" />
                  SKU:
                </strong>{" "}
                {product.sku}
              </p>
            )}
            {product.modelNumber && (
              <p>
                <strong className="text-muted-foreground flex items-center">
                  <Tag className="mr-1.5 h-4 w-4" />
                  Model:
                </strong>{" "}
                {product.modelNumber}
              </p>
            )}
            {product.nfcTagId && (
              <p>
                <strong className="text-muted-foreground flex items-center">
                  <Fingerprint className="mr-1.5 h-4 w-4" />
                  NFC Tag ID:
                </strong>{" "}
                {product.nfcTagId}
              </p>
            )}
            {product.rfidTagId && (
              <p>
                <strong className="text-muted-foreground flex items-center">
                  <Fingerprint className="mr-1.5 h-4 w-4" />
                  RFID Tag ID:
                </strong>{" "}
                {product.rfidTagId}
              </p>
            )}
            {product.authenticationVcId && (
              <div className="mt-1.5 pt-1.5 border-t border-border/50">
                <strong className="text-muted-foreground flex items-center">
                  <KeyRound className="mr-1.5 h-4 w-4 text-indigo-500" />
                  Authenticity VC ID:
                </strong>
                <p className="font-mono text-xs break-all text-foreground/90 mt-0.5">
                  {product.authenticationVcId}
                </p>
              </div>
            )}
            {product.ownershipNftLink && (
              <div className="mt-1.5 pt-1.5 border-t border-border/50">
                <strong className="text-muted-foreground block mb-0.5 flex items-center">
                  <Tag className="mr-1.5 h-4 w-4 text-purple-500" />
                  Ownership NFT:
                </strong>
                <p>
                  Token ID:{" "}
                  <span className="font-mono text-foreground/90">
                    {product.ownershipNftLink.tokenId}
                  </span>
                </p>
                <p>
                  Contract:{" "}
                  <span className="font-mono text-xs break-all text-foreground/90">
                    {product.ownershipNftLink.contractAddress}
                  </span>
                </p>
                {product.ownershipNftLink.chainName && (
                  <p>
                    Chain:{" "}
                    <span className="text-foreground/90">
                      {product.ownershipNftLink.chainName}
                    </span>
                  </p>
                )}
                {product.ownershipNftLink.registryUrl && (
                  <NextLink
                    href={product.ownershipNftLink.registryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center text-xs mt-1"
                  >
                    View on Registry <ExternalLink className="ml-1 h-3 w-3" />
                  </NextLink>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <LinkIconPath className="mr-2 h-5 w-5 text-primary" />
              Blockchain & On-Chain State
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {product.blockchainPlatform && (
              <p>
                <strong className="text-muted-foreground flex items-center">
                  <Layers3 className="mr-1.5 h-4 w-4 text-teal-600" />
                  Platform:
                </strong>{" "}
                {product.blockchainPlatform}
              </p>
            )}
            {product.contractAddress && (
              <p>
                <strong className="text-muted-foreground flex items-center">
                  <FileCog className="mr-1.5 h-4 w-4 text-teal-600" />
                  Contract Address:
                </strong>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="font-mono text-xs break-all ml-1">
                        {product.contractAddress}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{product.contractAddress}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </p>
            )}
            {product.tokenId && (
              <p>
                <strong className="text-muted-foreground flex items-center">
                  <Tag className="mr-1.5 h-4 w-4 text-teal-600" />
                  Token ID:
                </strong>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="font-mono text-xs break-all ml-1">
                        {product.tokenId}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{product.tokenId}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </p>
            )}
            {product.anchorTransactionHash && (
              <div>
                <strong className="text-muted-foreground flex items-center">
                  <Anchor className="mr-1.5 h-4 w-4 text-teal-600" />
                  Anchor Tx Hash:
                </strong>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="font-mono text-xs break-all">
                        {product.anchorTransactionHash}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{product.anchorTransactionHash}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <NextLink
                  href={`https://mock-token-explorer.example.com/tx/${product.anchorTransactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center text-xs ml-2"
                >
                  View Anchor Tx <ExternalLink className="ml-1 h-3 w-3" />
                </NextLink>
              </div>
            )}
            {product.contractAddress && product.tokenId && (
              <NextLink
                href={`https://mock-token-explorer.example.com/token/${product.contractAddress}/${product.tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center text-xs mt-1"
              >
                View Token on Mock Explorer{" "}
                <ExternalLink className="ml-1 h-3 w-3" />
              </NextLink>
            )}
            {product.ebsiStatus && (
              <div className="mt-1.5 pt-1.5 border-t border-border/50">
                <strong className="text-muted-foreground flex items-center">
                  <Database className="mr-1.5 h-4 w-4 text-indigo-500" />
                  EBSI Status:
                </strong>
                <div className="flex items-center mt-0.5">
                  {getEbsiStatusBadge(product.ebsiStatus)}
                </div>
                {product.ebsiVerificationId &&
                  product.ebsiStatus === "verified" && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="text-xs mt-0.5">
                            ID:{" "}
                            <span className="font-mono">
                              {product.ebsiVerificationId}
                            </span>
                          </p>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{product.ebsiVerificationId}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
              </div>
            )}
            {(product.onChainStatus || product.onChainLifecycleStage) && (
              <div className="mt-1.5 pt-1.5 border-t border-border/50">
                <h4 className="font-medium text-sm text-muted-foreground mb-1">
                  Conceptual On-Chain State:
                </h4>
                {product.onChainStatus && (
                  <p>
                    <strong className="text-muted-foreground flex items-center">
                      <SigmaSquare className="mr-1.5 h-4 w-4 text-purple-600" />
                      Status:
                    </strong>{" "}
                    <Badge
                      variant={
                        product.onChainStatus === "Active"
                          ? "default"
                          : "outline"
                      }
                      className={`capitalize text-xs ${product.onChainStatus === "Active" ? "bg-blue-100 text-blue-700 border-blue-300" : product.onChainStatus === "Recalled" ? "bg-red-100 text-red-700 border-red-300" : "bg-muted text-muted-foreground"}`}
                    >
                      {product.onChainStatus.replace(/_/g, " ")}
                    </Badge>
                  </p>
                )}
                {product.onChainLifecycleStage && (
                  <p className="mt-1">
                    <strong className="text-muted-foreground flex items-center">
                      <LayersIconShadcn className="mr-1.5 h-4 w-4 text-purple-600" />
                      Lifecycle Stage:
                    </strong>{" "}
                    <Badge variant="outline" className="capitalize text-xs">
                      {product.onChainLifecycleStage
                        .replace(/([A-Z])/g, " $1")
                        .trim()}
                    </Badge>
                  </p>
                )}
              </div>
            )}
            {!(
              product.blockchainPlatform ||
              product.contractAddress ||
              product.tokenId ||
              product.anchorTransactionHash ||
              product.ebsiStatus ||
              product.onChainStatus ||
              product.onChainLifecycleStage
            ) && (
              <p className="text-muted-foreground">
                No specific blockchain, EBSI, or on-chain state details
                available.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right/Center Column (Details) */}
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
                <p className="text-sm text-foreground/90 whitespace-pre-line">
                  {product.description}
                </p>
              </ScrollArea>
            ) : (
              <p className="text-sm text-muted-foreground">
                No description provided.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="grid sm:grid-cols-2 gap-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <Leaf className="mr-2 h-5 w-5 text-green-600" />
                Key Sustainability
              </CardTitle>
            </CardHeader>
            <CardContent>
              {product.keySustainabilityPoints &&
              product.keySustainabilityPoints.length > 0 ? (
                <ul className="space-y-1.5 text-sm">
                  {product.keySustainabilityPoints.map((point, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-success flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No key sustainability points listed.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <ShieldCheck className="mr-2 h-5 w-5 text-blue-600" />
                Key Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {product.keyCompliancePoints &&
              product.keyCompliancePoints.length > 0 ? (
                <ul className="space-y-1.5 text-sm">
                  {product.keyCompliancePoints.map((point, index) => (
                    <li key={index} className="flex items-center">
                      <ShieldCheck className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No key compliance points listed.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <LiveDataCard category={product.category} />

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
                    <dt className="font-medium text-muted-foreground w-1/3 truncate capitalize">
                      {key
                        .replace(
                          /([A-Z]+(?=[A-Z][a-z]))|([A-Z](?=[a-z]))/g,
                          " $1$2",
                        )
                        .trim()}
                      :
                    </dt>
                    <dd className="text-foreground/90 w-2/3 whitespace-pre-wrap">
                      {String(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-sm text-muted-foreground">
                No technical specifications provided.
              </p>
            )}
            {specificationsError && (
              <p className="text-xs text-orange-600 mt-2 flex items-center">
                <Info className="h-3.5 w-3.5 mr-1" />
                Specifications data might not be correctly formatted as JSON.
              </p>
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
                    <dt className="font-medium text-muted-foreground w-1/3 truncate">
                      {attr.key}:
                    </dt>
                    <dd className="text-foreground/90 w-2/3 whitespace-pre-wrap">
                      {attr.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-sm text-muted-foreground">
                No additional attributes provided.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Category-Specific Information */}
        {product.category === "Apparel" && product.textileInformation && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <Shirt className="mr-2 h-5 w-5 text-pink-500" />
                Textile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              {product.textileInformation.fiberComposition &&
                product.textileInformation.fiberComposition.length > 0 && (
                  <div>
                    <strong className="text-muted-foreground">
                      Fiber Composition:
                    </strong>
                    <ul className="list-disc list-inside ml-4">
                      {product.textileInformation.fiberComposition.map(
                        (fc, idx) => (
                          <li key={idx}>
                            {fc.fiberName}: {fc.percentage}%
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
              {product.textileInformation.countryOfOriginLabeling && (
                <p>
                  <strong className="text-muted-foreground">
                    Country of Origin (Label):
                  </strong>{" "}
                  {product.textileInformation.countryOfOriginLabeling}
                </p>
              )}
              {product.textileInformation.careInstructionsUrl && (
                <p>
                  <strong className="text-muted-foreground">
                    Care Instructions:
                  </strong>{" "}
                  <NextLink
                    href={product.textileInformation.careInstructionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View Care Guide
                  </NextLink>
                </p>
              )}
              {product.textileInformation.isSecondHand !== undefined && (
                <p>
                  <strong className="text-muted-foreground">
                    Second Hand:
                  </strong>{" "}
                  {product.textileInformation.isSecondHand ? "Yes" : "No"}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {product.category === "Construction Materials" &&
          product.constructionProductInformation && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Construction className="mr-2 h-5 w-5 text-orange-500" />
                  Construction Product Information
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                {product.constructionProductInformation
                  .declarationOfPerformanceId && (
                  <p>
                    <strong className="text-muted-foreground">DoP ID:</strong>{" "}
                    {
                      product.constructionProductInformation
                        .declarationOfPerformanceId
                    }
                  </p>
                )}
                {product.constructionProductInformation.ceMarkingDetailsUrl && (
                  <p>
                    <strong className="text-muted-foreground">
                      CE Marking:
                    </strong>{" "}
                    <NextLink
                      href={
                        product.constructionProductInformation
                          .ceMarkingDetailsUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View Details
                    </NextLink>
                  </p>
                )}
                {product.constructionProductInformation
                  .intendedUseDescription && (
                  <p>
                    <strong className="text-muted-foreground">
                      Intended Use:
                    </strong>{" "}
                    {
                      product.constructionProductInformation
                        .intendedUseDescription
                    }
                  </p>
                )}
                {product.constructionProductInformation
                  .essentialCharacteristics &&
                  product.constructionProductInformation
                    .essentialCharacteristics.length > 0 && (
                    <div>
                      <strong className="text-muted-foreground">
                        Essential Characteristics:
                      </strong>
                      <ul className="list-disc list-inside ml-4">
                        {product.constructionProductInformation.essentialCharacteristics.map(
                          (ec, idx) => (
                            <li key={idx}>
                              {ec.characteristicName}: {ec.value}{" "}
                              {ec.unit || ""}{" "}
                              {ec.testMethod ? `(Test: ${ec.testMethod})` : ""}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
              </CardContent>
            </Card>
          )}
        {product.batteryRegulation &&
          product.batteryRegulation.status &&
          product.batteryRegulation.status.toLowerCase() !==
            "not_applicable" && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <BatteryCharging className="mr-2 h-5 w-5 text-lime-600" />
                  EU Battery Regulation Details
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>
                  <strong className="text-muted-foreground">Status:</strong>{" "}
                  <Badge variant="outline" className="capitalize">
                    {product.batteryRegulation.status?.replace("_", " ")}
                  </Badge>
                </p>
                {product.batteryRegulation.batteryChemistry && (
                  <p>
                    <strong className="text-muted-foreground">
                      Chemistry:
                    </strong>{" "}
                    {product.batteryRegulation.batteryChemistry}
                  </p>
                )}
                {product.batteryRegulation.batteryPassportId && (
                  <p>
                    <strong className="text-muted-foreground">
                      Battery Passport ID:
                    </strong>{" "}
                    <span className="font-mono text-xs">
                      {product.batteryRegulation.batteryPassportId}
                    </span>
                  </p>
                )}

                {product.batteryRegulation.carbonFootprint &&
                  product.batteryRegulation.carbonFootprint.value !== null &&
                  product.batteryRegulation.carbonFootprint.value !==
                    undefined && (
                    <div className="mt-1 pt-1 border-t border-border/30">
                      <strong className="text-muted-foreground">
                        Carbon Footprint:
                      </strong>{" "}
                      {product.batteryRegulation.carbonFootprint.value}{" "}
                      {product.batteryRegulation.carbonFootprint.unit || ""}{" "}
                      (Method:{" "}
                      {product.batteryRegulation.carbonFootprint
                        .calculationMethod || "N/A"}
                      )
                      {(product.batteryRegulation.carbonFootprint
                        .scope1Emissions ||
                        product.batteryRegulation.carbonFootprint
                          .scope2Emissions ||
                        product.batteryRegulation.carbonFootprint
                          .scope3Emissions) && (
                        <ul className="list-disc list-inside ml-4 text-xs">
                          {product.batteryRegulation.carbonFootprint
                            .scope1Emissions && (
                            <li>
                              Scope 1:{" "}
                              {
                                product.batteryRegulation.carbonFootprint
                                  .scope1Emissions
                              }{" "}
                              {product.batteryRegulation.carbonFootprint.unit?.replace(
                                "/kWh",
                                "",
                              )}
                            </li>
                          )}
                          {product.batteryRegulation.carbonFootprint
                            .scope2Emissions && (
                            <li>
                              Scope 2:{" "}
                              {
                                product.batteryRegulation.carbonFootprint
                                  .scope2Emissions
                              }{" "}
                              {product.batteryRegulation.carbonFootprint.unit?.replace(
                                "/kWh",
                                "",
                              )}
                            </li>
                          )}
                          {product.batteryRegulation.carbonFootprint
                            .scope3Emissions && (
                            <li>
                              Scope 3:{" "}
                              {
                                product.batteryRegulation.carbonFootprint
                                  .scope3Emissions
                              }{" "}
                              {product.batteryRegulation.carbonFootprint.unit?.replace(
                                "/kWh",
                                "",
                              )}
                            </li>
                          )}
                        </ul>
                      )}
                      {product.batteryRegulation.carbonFootprint.dataSource && (
                        <p className="text-xs text-muted-foreground pl-5">
                          Data Source:{" "}
                          {product.batteryRegulation.carbonFootprint.dataSource}
                        </p>
                      )}
                    </div>
                  )}

                {product.batteryRegulation.recycledContent &&
                  product.batteryRegulation.recycledContent.length > 0 && (
                    <div className="mt-1 pt-1 border-t border-border/30">
                      <strong className="text-muted-foreground">
                        Recycled Content:
                      </strong>
                      <ul className="list-disc list-inside ml-4">
                        {product.batteryRegulation.recycledContent.map(
                          (rc, i) => (
                            <li key={i}>
                              {rc.material}: {rc.percentage ?? "N/A"}%{" "}
                              {rc.source && `(Source: ${rc.source})`}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}

                {product.batteryRegulation.stateOfHealth &&
                  product.batteryRegulation.stateOfHealth.value !== null &&
                  product.batteryRegulation.stateOfHealth.value !==
                    undefined && (
                    <div className="mt-1 pt-1 border-t border-border/30">
                      <strong className="text-muted-foreground">
                        State of Health:
                      </strong>{" "}
                      {product.batteryRegulation.stateOfHealth.value}
                      {product.batteryRegulation.stateOfHealth.unit || "%"}{" "}
                      (Measured:{" "}
                      {product.batteryRegulation.stateOfHealth.measurementDate
                        ? new Date(
                            product.batteryRegulation.stateOfHealth.measurementDate,
                          ).toLocaleDateString()
                        : "N/A"}
                      , Method:{" "}
                      {product.batteryRegulation.stateOfHealth
                        .measurementMethod || "N/A"}
                      )
                    </div>
                  )}
                {product.batteryRegulation.vcId && (
                  <p className="mt-1 pt-1 border-t border-border/30">
                    <strong className="text-muted-foreground">
                      Overall VC ID:
                    </strong>{" "}
                    <span className="font-mono text-xs">
                      {product.batteryRegulation.vcId}
                    </span>
                  </p>
                )}
              </CardContent>
            </Card>
          )}
      </div>
    </div>
  );
}
