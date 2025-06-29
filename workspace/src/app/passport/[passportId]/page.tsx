"use client";

// --- File: page.tsx (Public Product Passport Viewer) ---
// Description: Main page component for displaying the public view of a Digital Product Passport.

import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import * as LucideIcons from "lucide-react";
import {
  Leaf,
  Recycle,
  ShieldCheck,
  Cpu,
  ExternalLink,
  Building,
  Zap,
  ChevronDown,
  ChevronUp,
  Fingerprint,
  ServerIcon,
  AlertCircle,
  Info as InfoIcon,
  ListChecks,
  History as HistoryIcon,
  Award,
  Bot,
  Barcode,
  KeyRound,
  FileLock,
  Anchor,
  Layers3,
  FileCog,
  Tag,
  SigmaSquare,
  Handshake,
  Database,
  Layers as LayersIconShadcn,
  CalendarDays as CalendarIcon,
  FileText as FileTextIcon,
  Heart,
  Thermometer,
  User,
  Factory,
  Truck,
  ShoppingCart,
  Construction,
  Shirt,
  Cloud,
  Wind,
  Sun,
  BookmarkPlus,
  BookmarkCheck,
  AlertTriangle as AlertTriangleIcon,
  Globe,
} from "lucide-react";
import { Logo } from "@/components/icons/Logo";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useRole } from "@/contexts/RoleContext";
import type {
  PublicProductInfo,
  IconName,
  LifecycleHighlight,
  PublicCertification,
  CustomAttribute,
  BatteryRegulationDetails,
  RecycledContentData,
  CarbonFootprintData,
} from "@/types/dpp";
import { MOCK_PUBLIC_PASSPORTS } from "@/data";
import RoleSpecificCard from "@/components/passport/RoleSpecificCard";
import { getAiHintForImage } from "@/utils/imageUtils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { TRACKED_PRODUCTS_STORAGE_KEY } from "@/types/dpp";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";

const STORY_TRUNCATE_LENGTH = 250;

export default function PublicPassportPage() {
  const params = useParams();
  const passportId = params.passportId as string;
  const [product, setProduct] = useState<PublicProductInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStoryExpanded, setIsStoryExpanded] = useState(false);
  const [isTracked, setIsTracked] = useState(false);
  const { currentRole } = useRole();
  const { toast } = useToast();

  const updateTrackedStatus = useCallback(() => {
    if (typeof window !== "undefined") {
      const storedIdsString = localStorage.getItem(
        TRACKED_PRODUCTS_STORAGE_KEY,
      );
      const trackedIds: string[] = storedIdsString
        ? JSON.parse(storedIdsString)
        : [];
      setIsTracked(trackedIds.includes(passportId));
    }
  }, [passportId]);

  useEffect(() => {
    const fetchedProduct =
      MOCK_PUBLIC_PASSPORTS[passportId] ||
      MOCK_PUBLIC_PASSPORTS[`PROD${passportId.replace("DPP", "")}`];
    if (fetchedProduct) {
      setProduct({
        ...fetchedProduct,
        customAttributes: fetchedProduct.customAttributes || [],
        documents: fetchedProduct.documents || [],
        authenticationVcId: fetchedProduct.authenticationVcId,
        ownershipNftLink: fetchedProduct.ownershipNftLink,
        productDetails: {
          ...(fetchedProduct.productDetails || {}),
          esprSpecifics: fetchedProduct.productDetails?.esprSpecifics,
          carbonFootprint: fetchedProduct.productDetails?.carbonFootprint,
          digitalTwin: fetchedProduct.productDetails?.digitalTwin,
          conflictMineralsReportUrl:
            fetchedProduct.productDetails?.conflictMineralsReportUrl,
          fairTradeCertificationId:
            fetchedProduct.productDetails?.fairTradeCertificationId,
          ethicalSourcingPolicyUrl:
            fetchedProduct.productDetails?.ethicalSourcingPolicyUrl,
        },
      });
      updateTrackedStatus();
    }
    setIsLoading(false);
  }, [passportId, updateTrackedStatus]);

  const handleToggleTrackProduct = () => {
    if (typeof window === "undefined") return;

    const storedIdsString = localStorage.getItem(TRACKED_PRODUCTS_STORAGE_KEY);
    let trackedIds: string[] = storedIdsString
      ? JSON.parse(storedIdsString)
      : [];
    const productIndex = trackedIds.indexOf(passportId);

    if (productIndex > -1) {
      trackedIds.splice(productIndex, 1);
      toast({
        title: "Product Untracked",
        description: `${product?.productName || passportId} removed from your list.`,
      });
    } else {
      trackedIds.push(passportId);
      toast({
        title: "Product Tracked",
        description: `${product?.productName || passportId} added to your list.`,
      });
    }
    localStorage.setItem(
      TRACKED_PRODUCTS_STORAGE_KEY,
      JSON.stringify(trackedIds),
    );
    updateTrackedStatus();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading product passport...</p>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const toggleStoryExpansion = () => {
    setIsStoryExpanded(!isStoryExpanded);
  };

  const displayProductStory =
    isStoryExpanded || product.productStory.length <= STORY_TRUNCATE_LENGTH
      ? product.productStory
      : `${product.productStory.substring(0, STORY_TRUNCATE_LENGTH)}...`;

  const getEbsiStatusBadge = (
    status?: "verified" | "pending" | "not_verified" | "error",
  ) => {
    switch (status) {
      case "verified":
        return (
          <Badge
            variant="default"
            className="bg-green-500/20 text-green-700 border-green-500/30"
          >
            <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
            Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-500/20 text-yellow-700 border-yellow-500/30"
          >
            <InfoIcon className="mr-1.5 h-3.5 w-3.5" />
            Pending
          </Badge>
        );
      case "not_verified":
        return (
          <Badge variant="destructive">
            <AlertCircle className="mr-1.5 h-3.5 w-3.5" />
            Not Verified
          </Badge>
        );
      case "error":
        return (
          <Badge
            variant="destructive"
            className="bg-red-500/20 text-red-700 border-red-500/30"
          >
            <AlertCircle className="mr-1.5 h-3.5 w-3.5" />
            Error
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const aiCopilotQuery = encodeURIComponent(
    `What are the key compliance requirements for a product like '${product.productName}' in the '${product.category}' category? Also, what are specific considerations for its EBSI status of '${product.ebsiStatus || "N/A"}'?`,
  );
  const aiCopilotLink = `/copilot?contextQuery=${aiCopilotQuery}`;

  const aiHintForImage = getAiHintForImage({
    productName: product.productName,
    category: product.category,
    imageHint: product.imageHint,
  });

  const hasEthicalSourcingInfo =
    product.conflictMineralsReportUrl ||
    product.fairTradeCertificationId ||
    product.ethicalSourcingPolicyUrl;
  const generalCarbonFootprint = product.productDetails?.carbonFootprint;
  const cbamGoodsIdentifier =
    product.compliance?.euCustomsData?.cbamGoodsIdentifier;

  const carbonFootprintChartData = useMemo(() => {
    if (!generalCarbonFootprint) return null;
    const { scope1Emissions, scope2Emissions, scope3Emissions, unit } =
      generalCarbonFootprint;
    const data = [];
    if (typeof scope1Emissions === "number")
      data.push({
        name: "Scope 1",
        emissions: scope1Emissions,
        fill: "hsl(var(--chart-1))",
      });
    if (typeof scope2Emissions === "number")
      data.push({
        name: "Scope 2",
        emissions: scope2Emissions,
        fill: "hsl(var(--chart-2))",
      });
    if (typeof scope3Emissions === "number")
      data.push({
        name: "Scope 3",
        emissions: scope3Emissions,
        fill: "hsl(var(--chart-3))",
      });
    return data.length > 0
      ? {
          data,
          unit: unit?.replace("/kWh", "").replace("/unit", "") || "kg CO2e",
        }
      : null;
  }, [generalCarbonFootprint]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="py-6 bg-card shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link href="/" passHref>
            <Logo className="h-10 w-auto text-primary" />
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant={isTracked ? "default" : "outline"}
              size="sm"
              onClick={handleToggleTrackProduct}
              className="text-xs"
            >
              {isTracked ? (
                <BookmarkCheck className="mr-1.5 h-4 w-4" />
              ) : (
                <BookmarkPlus className="mr-1.5 h-4 w-4" />
              )}
              {isTracked ? "Untrack Product" : "Track This Product"}
            </Button>
            <Badge
              variant="outline"
              className="border-primary text-primary text-sm"
            >
              Digital Product Passport
            </Badge>
          </div>
        </div>
      </header>

      <main
        id="main-content"
        className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"
      >
        <div className="bg-card p-6 sm:p-8 rounded-xl shadow-xl">
          <div className="text-center mb-8">
            <h1 className="font-headline text-3xl md:text-4xl font-semibold text-primary mb-2">
              {product.productName}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              {product.tagline}
            </p>
            <div className="mt-3 text-sm text-muted-foreground">
              <span>Category: {product.category}</span> |{" "}
              <span>Model: {product.modelNumber}</span>
              {cbamGoodsIdentifier && (
                <span className="block mt-1">
                  <Badge
                    variant="outline"
                    className="bg-blue-100 text-blue-700 border-blue-300"
                  >
                    <Globe className="mr-1.5 h-3.5 w-3.5" /> CBAM ID:{" "}
                    {cbamGoodsIdentifier}
                  </Badge>
                </span>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="w-full">
              <Image
                src={product.imageUrl}
                alt={product.productName}
                width={800}
                height={600}
                className="rounded-lg object-cover shadow-md aspect-[4/3]"
                data-ai-hint={aiHintForImage}
                priority={
                  product.imageUrl
                    ? !product.imageUrl.startsWith("data:")
                    : true
                }
              />
            </div>
            <div className="space-y-6">
              <Card className="bg-muted border-border">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">
                    {currentRole === "manufacturer"
                      ? "Product Story (Manufacturer View)"
                      : "Product Story"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed">
                    {displayProductStory}
                  </p>
                  {product.productStory.length > STORY_TRUNCATE_LENGTH && (
                    <Button
                      variant="link"
                      onClick={toggleStoryExpansion}
                      className="p-0 h-auto mt-2 text-primary hover:text-primary/80"
                    >
                      {isStoryExpanded ? "Read Less" : "Read More"}
                      {isStoryExpanded ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </Button>
                  )}
                  {currentRole === "recycler" && (
                    <p className="text-xs text-muted-foreground mt-3">
                      Recyclers: Focus on 'Materials Composition' and
                      'Lifecycle' sections for EOL details.
                    </p>
                  )}
                  {currentRole === "service_provider" && (
                    <p className="text-xs text-muted-foreground mt-3">
                      Service Providers: Check 'Technical Specifications' and
                      'Documents' for repair guides.
                    </p>
                  )}
                </CardContent>
              </Card>

              {(product.sku || product.nfcTagId || product.rfidTagId) && (
                <Card className="border-accent/50">
                  <CardHeader>
                    <CardTitle className="text-xl text-accent flex items-center">
                      <Barcode className="mr-2 h-6 w-6" /> Identifiers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm">
                    {product.sku && (
                      <p>
                        <strong className="text-muted-foreground">SKU:</strong>{" "}
                        {product.sku}
                      </p>
                    )}
                    {product.nfcTagId && (
                      <p>
                        <strong className="text-muted-foreground">
                          NFC Tag ID:
                        </strong>{" "}
                        {product.nfcTagId}
                      </p>
                    )}
                    {product.rfidTagId && (
                      <p>
                        <strong className="text-muted-foreground">
                          RFID Tag ID:
                        </strong>{" "}
                        {product.rfidTagId}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              <Card className="border-accent/50">
                <CardHeader>
                  <CardTitle className="text-xl text-accent flex items-center">
                    <Leaf className="mr-2 h-6 w-6" /> Sustainability Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {product.sustainabilityHighlights.map(
                      (highlight, index) => {
                        const IconComponent =
                          highlight.iconName &&
                          (LucideIcons as any)[highlight.iconName]
                            ? (LucideIcons as any)[highlight.iconName]
                            : Leaf;
                        return (
                          <li
                            key={index}
                            className="flex items-center text-foreground"
                          >
                            <IconComponent className="h-5 w-5 mr-3 text-accent flex-shrink-0" />
                            <span>{highlight.text}</span>
                          </li>
                        );
                      },
                    )}
                  </ul>
                  {currentRole === "retailer" && (
                    <p className="text-xs text-muted-foreground mt-3">
                      Key consumer-facing sustainability points.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-border text-center">
            <Link href={aiCopilotLink} passHref>
              <Button
                variant="secondary"
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Bot className="mr-2 h-5 w-5" /> Ask AI Co-Pilot about this
                Product
              </Button>
            </Link>
          </div>

          <div className="mt-10 pt-8 border-t border-border">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-primary flex items-center">
                    <Building className="mr-2 h-6 w-6" /> Manufacturer
                    Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    {product.manufacturerName}
                  </h3>
                  {product.brandLogoUrl && (
                    <div className="my-3">
                      <Image
                        src={product.brandLogoUrl}
                        alt={`${product.manufacturerName} Logo`}
                        width={150}
                        height={50}
                        className="object-contain"
                        data-ai-hint="brand logo"
                      />
                    </div>
                  )}
                  {product.manufacturerWebsite && (
                    <Link
                      href={product.manufacturerWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary hover:underline"
                    >
                      Visit Website <ExternalLink className="ml-1 h-4 w-4" />
                    </Link>
                  )}
                  {currentRole === "manufacturer" && (
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 h-auto mt-1 text-primary block"
                      onClick={() =>
                        alert(
                          "Mock: View Internal Details for " +
                            product.passportId,
                        )
                      }
                    >
                      View Internal Details (Mock)
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-primary flex items-center">
                    <HistoryIcon className="mr-2 h-6 w-6" /> Product Journey
                    Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {product.lifecycleHighlights &&
                  product.lifecycleHighlights.length > 0 ? (
                    <ul className="space-y-3">
                      {product.lifecycleHighlights.map((event, index) => {
                        const Icon =
                          event.iconName && (LucideIcons as any)[event.iconName]
                            ? (LucideIcons as any)[event.iconName]
                            : ListChecks;
                        return (
                          <li
                            key={index}
                            className="text-sm text-foreground border-b border-border/50 pb-2 last:border-b-0 last:pb-0 flex items-start"
                          >
                            <Icon className="h-5 w-5 mr-3 mt-0.5 text-primary flex-shrink-0" />
                            <div className="flex-grow">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">
                                  {event.stage}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {event.date}
                                </span>
                              </div>
                              {event.details && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {event.details}
                                </p>
                              )}
                              {event.isEbsiVerified && (
                                <Badge
                                  variant="default"
                                  className="mt-1.5 text-xs bg-green-100 text-green-700 border-green-300"
                                >
                                  <ShieldCheck className="mr-1 h-3 w-3" /> EBSI
                                  Verified
                                </Badge>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No key lifecycle events available.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-primary flex items-center">
                    <Award className="mr-2 h-6 w-6" /> Product Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {product.certifications &&
                  product.certifications.length > 0 ? (
                    <ul className="space-y-2">
                      {product.certifications.map((cert, index) => (
                        <li
                          key={index}
                          className="text-sm text-foreground border-b border-border/50 pb-1.5 last:border-b-0"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{cert.name}</span>
                            {cert.isVerified && (
                              <ShieldCheck
                                className="h-4 w-4 text-success"
                                title="Verified Certification"
                              />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Authority: {cert.authority}
                          </p>
                          {cert.expiryDate && (
                            <p className="text-xs text-muted-foreground">
                              Expires:{" "}
                              {new Date(cert.expiryDate).toLocaleDateString()}
                            </p>
                          )}
                          {cert.link && (
                            <Link
                              href={cert.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline inline-flex items-center"
                            >
                              View Details{" "}
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No certifications listed for this product.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {hasEthicalSourcingInfo && (
              <div className="mt-8 pt-6 border-t border-border">
                <Card className="border-0 shadow-none">
                  <CardHeader className="px-0 pt-0 pb-4">
                    <CardTitle className="text-xl text-primary flex items-center">
                      <Handshake className="mr-2 h-6 w-6" /> Ethical Sourcing &
                      Transparency
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm px-0 pb-0">
                    {product.conflictMineralsReportUrl && (
                      <p>
                        <strong className="text-muted-foreground">
                          Conflict Minerals Report:
                        </strong>{" "}
                        <Link
                          href={product.conflictMineralsReportUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          View Report{" "}
                          <ExternalLink className="inline h-3 w-3 ml-1" />
                        </Link>
                      </p>
                    )}
                    {product.fairTradeCertificationId && (
                      <p>
                        <strong className="text-muted-foreground">
                          Fair Trade Certification:
                        </strong>{" "}
                        {product.fairTradeCertificationId.startsWith("http") ? (
                          <Link
                            href={product.fairTradeCertificationId}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            View Certificate{" "}
                            <ExternalLink className="inline h-3 w-3 ml-1" />
                          </Link>
                        ) : (
                          product.fairTradeCertificationId
                        )}
                      </p>
                    )}
                    {product.ethicalSourcingPolicyUrl && (
                      <p>
                        <strong className="text-muted-foreground">
                          Ethical Sourcing Policy:
                        </strong>{" "}
                        <Link
                          href={product.ethicalSourcingPolicyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          View Policy{" "}
                          <ExternalLink className="inline h-3 w-3 ml-1" />
                        </Link>
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {generalCarbonFootprint &&
              generalCarbonFootprint.value !== null &&
              generalCarbonFootprint.value !== undefined && (
                <div className="mt-8 pt-6 border-t border-border">
                  <Card className="border-0 shadow-none">
                    <CardHeader className="px-0 pt-0 pb-4">
                      <CardTitle className="text-xl text-primary flex items-center">
                        <Cloud className="mr-2 h-6 w-6" />
                        Product Carbon Footprint
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm px-0 pb-0">
                      <p>
                        <strong className="text-muted-foreground">
                          Total Value:
                        </strong>{" "}
                        {generalCarbonFootprint.value}{" "}
                        {generalCarbonFootprint.unit}
                      </p>
                      {generalCarbonFootprint.calculationMethod && (
                        <p>
                          <strong className="text-muted-foreground">
                            Method:
                          </strong>{" "}
                          {generalCarbonFootprint.calculationMethod}
                        </p>
                      )}
                      {carbonFootprintChartData &&
                      carbonFootprintChartData.data.length > 0 ? (
                        <div className="mt-3">
                          <h4 className="text-sm font-semibold mb-1">
                            GHG Emissions by Scope (
                            {carbonFootprintChartData.unit}):
                          </h4>
                          <div className="h-48 w-full max-w-md">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={carbonFootprintChartData.data}
                                layout="vertical"
                                margin={{
                                  top: 5,
                                  right: 20,
                                  left: 10,
                                  bottom: 5,
                                }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                  type="number"
                                  stroke="hsl(var(--muted-foreground))"
                                  fontSize={10}
                                />
                                <YAxis
                                  dataKey="name"
                                  type="category"
                                  stroke="hsl(var(--muted-foreground))"
                                  fontSize={10}
                                  width={60}
                                />
                                <RechartsTooltip
                                  cursor={{ fill: "hsl(var(--muted))" }}
                                  contentStyle={{
                                    backgroundColor: "hsl(var(--popover))",
                                    borderRadius: "var(--radius)",
                                    border: "1px solid hsl(var(--border))",
                                  }}
                                  labelStyle={{
                                    color: "hsl(var(--popover-foreground))",
                                  }}
                                  formatter={(
                                    value: any,
                                    name: any,
                                    props: any,
                                  ) => [
                                    `${value} ${carbonFootprintChartData.unit}`,
                                    props.payload.name,
                                  ]}
                                />
                                <Bar
                                  dataKey="emissions"
                                  name="Emissions"
                                  radius={[0, 4, 4, 0]}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      ) : (
                        (generalCarbonFootprint.scope1Emissions ||
                          generalCarbonFootprint.scope2Emissions ||
                          generalCarbonFootprint.scope3Emissions) && (
                          <div className="mt-1 pt-1 border-t border-border/30">
                            <strong className="text-muted-foreground">
                              GHG Emissions by Scope:
                            </strong>
                            <ul className="list-disc list-inside ml-4 text-xs">
                              {generalCarbonFootprint.scope1Emissions && (
                                <li>
                                  Scope 1:{" "}
                                  {generalCarbonFootprint.scope1Emissions}{" "}
                                  {generalCarbonFootprint.unit?.replace(
                                    "/kWh",
                                    "",
                                  )}
                                </li>
                              )}
                              {generalCarbonFootprint.scope2Emissions && (
                                <li>
                                  Scope 2:{" "}
                                  {generalCarbonFootprint.scope2Emissions}{" "}
                                  {generalCarbonFootprint.unit?.replace(
                                    "/kWh",
                                    "",
                                  )}
                                </li>
                              )}
                              {generalCarbonFootprint.scope3Emissions && (
                                <li>
                                  Scope 3:{" "}
                                  {generalCarbonFootprint.scope3Emissions}{" "}
                                  {generalCarbonFootprint.unit?.replace(
                                    "/kWh",
                                    "",
                                  )}
                                </li>
                              )}
                            </ul>
                          </div>
                        )
                      )}
                      {generalCarbonFootprint.dataSource && (
                        <p>
                          <strong className="text-muted-foreground">
                            Data Source:
                          </strong>{" "}
                          {generalCarbonFootprint.dataSource}
                        </p>
                      )}
                      {generalCarbonFootprint.vcId && (
                        <p>
                          <strong className="text-muted-foreground">
                            VC ID:
                          </strong>{" "}
                          <span className="font-mono text-xs">
                            {generalCarbonFootprint.vcId}
                          </span>
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

            {product.customAttributes &&
              product.customAttributes.length > 0 && (
                <div className="mt-8 pt-6 border-t border-border">
                  <Card className="border-0 shadow-none">
                    <CardHeader className="px-0 pt-0 pb-4">
                      <CardTitle className="text-xl text-primary flex items-center">
                        <InfoIcon className="mr-2 h-6 w-6" /> Additional
                        Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm px-0 pb-0">
                      <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                        {product.customAttributes.map((attr, index) => (
                          <div key={index} className="flex">
                            <dt className="font-medium text-muted-foreground w-1/3 truncate">
                              {attr.key}:
                            </dt>
                            <dd className="text-foreground/90 w-2/3 whitespace-pre-wrap">
                              {attr.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </CardContent>
                  </Card>
                </div>
              )}

            {product.textileInformation && (
              <div className="mt-8 pt-6 border-t border-border">
                <Card className="border-0 shadow-none">
                  <CardHeader className="px-0 pt-0 pb-4">
                    <CardTitle className="text-xl text-primary flex items-center">
                      <Shirt className="mr-2 h-6 w-6" />
                      Textile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm px-0 pb-0">
                    {product.textileInformation.fiberComposition &&
                      product.textileInformation.fiberComposition.length >
                        0 && (
                        <div>
                          <strong className="text-muted-foreground">
                            Fiber Composition:
                          </strong>
                          <ul className="list-disc list-inside ml-4">
                            {product.textileInformation.fiberComposition.map(
                              (fc, idx) => (
                                <li key={idx}>
                                  {fc.fiberName}:{" "}
                                  {fc.percentage === null ||
                                  fc.percentage === undefined
                                    ? "N/A"
                                    : `${fc.percentage}%`}
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
                        <Link
                          href={product.textileInformation.careInstructionsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          View Care Guide
                        </Link>
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
              </div>
            )}

            {product.constructionProductInformation && (
              <div className="mt-8 pt-6 border-t border-border">
                <Card className="border-0 shadow-none">
                  <CardHeader className="px-0 pt-0 pb-4">
                    <CardTitle className="text-xl text-primary flex items-center">
                      <Construction className="mr-2 h-6 w-6" />
                      Construction Product Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm px-0 pb-0">
                    {product.constructionProductInformation
                      .declarationOfPerformanceId && (
                      <p>
                        <strong className="text-muted-foreground">
                          DoP ID:
                        </strong>{" "}
                        {
                          product.constructionProductInformation
                            .declarationOfPerformanceId
                        }
                      </p>
                    )}
                    {product.constructionProductInformation
                      .ceMarkingDetailsUrl && (
                      <p>
                        <strong className="text-muted-foreground">
                          CE Marking:
                        </strong>{" "}
                        <Link
                          href={
                            product.constructionProductInformation
                              .ceMarkingDetailsUrl
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          View Details
                        </Link>
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
                                  {ec.testMethod
                                    ? `(Test: ${ec.testMethod})`
                                    : ""}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}
                  </CardContent>
                </Card>
              </div>
            )}
            {product.batteryRegulation &&
              product.batteryRegulation.status &&
              product.batteryRegulation.status.toLowerCase() !==
                "not_applicable" && (
                <div className="mt-8 pt-6 border-t border-border">
                  <Card className="border-0 shadow-none">
                    <CardHeader className="px-0 pt-0 pb-4">
                      <CardTitle className="text-xl text-primary flex items-center">
                        <BatteryCharging className="mr-2 h-6 w-6" />
                        EU Battery Regulation Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm px-0 pb-0">
                      <p>
                        <strong className="text-muted-foreground flex items-center">
                          <InfoIcon className="mr-1.5 h-4 w-4 text-blue-500" />
                          Status:
                        </strong>{" "}
                        <Badge variant="outline" className="capitalize">
                          {product.batteryRegulation.status?.replace(
                            "_",
                            " ",
                          ) || "N/A"}
                        </Badge>
                      </p>
                      {product.batteryRegulation.batteryChemistry && (
                        <p>
                          <strong className="text-muted-foreground flex items-center">
                            <Thermometer className="mr-1.5 h-4 w-4 text-blue-500" />
                            Chemistry:
                          </strong>{" "}
                          {product.batteryRegulation.batteryChemistry}
                        </p>
                      )}
                      {product.batteryRegulation.batteryPassportId && (
                        <p>
                          <strong className="text-muted-foreground flex items-center">
                            <Barcode className="mr-1.5 h-4 w-4 text-blue-500" />
                            Passport ID:
                          </strong>{" "}
                          <span className="font-mono text-xs">
                            {product.batteryRegulation.batteryPassportId}
                          </span>
                        </p>
                      )}

                      {product.batteryRegulation.carbonFootprint &&
                        product.batteryRegulation.carbonFootprint.value !==
                          null &&
                        product.batteryRegulation.carbonFootprint.value !==
                          undefined && (
                          <div className="mt-2 pt-2 border-t border-border/30">
                            <strong className="text-muted-foreground flex items-center">
                              <Cloud className="mr-1.5 h-4 w-4 text-orange-500" />
                              Carbon Footprint:
                            </strong>
                            <p className="pl-5">
                              Value:{" "}
                              {product.batteryRegulation.carbonFootprint.value}{" "}
                              {product.batteryRegulation.carbonFootprint.unit ||
                                ""}
                            </p>
                            {product.batteryRegulation.carbonFootprint
                              .calculationMethod && (
                              <p className="pl-5">
                                Method:{" "}
                                {
                                  product.batteryRegulation.carbonFootprint
                                    .calculationMethod
                                }
                              </p>
                            )}
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
                            {product.batteryRegulation.carbonFootprint
                              .dataSource && (
                              <p className="text-xs text-muted-foreground pl-5">
                                Data Source:{" "}
                                {
                                  product.batteryRegulation.carbonFootprint
                                    .dataSource
                                }
                              </p>
                            )}
                          </div>
                        )}

                      {product.batteryRegulation.recycledContent &&
                        product.batteryRegulation.recycledContent.length >
                          0 && (
                          <div className="mt-2 pt-2 border-t border-border/30">
                            <strong className="text-muted-foreground flex items-center">
                              <Recycle className="mr-1.5 h-4 w-4 text-green-600" />
                              Recycled Content:
                            </strong>
                            <ul className="list-disc list-inside ml-5">
                              {product.batteryRegulation.recycledContent.map(
                                (rc, idx) => (
                                  <li key={idx}>
                                    {rc.material}: {rc.percentage ?? "N/A"}%{" "}
                                    {rc.source && `(Source: ${rc.source})`}
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}

                      {product.batteryRegulation.stateOfHealth &&
                        product.batteryRegulation.stateOfHealth.value !==
                          null &&
                        product.batteryRegulation.stateOfHealth.value !==
                          undefined && (
                          <div className="mt-2 pt-2 border-t border-border/30">
                            <strong className="text-muted-foreground flex items-center">
                              <Heart className="mr-1.5 h-4 w-4 text-red-500" />
                              State of Health:
                            </strong>
                            <p className="pl-5">
                              Value:{" "}
                              {product.batteryRegulation.stateOfHealth.value}
                              {product.batteryRegulation.stateOfHealth.unit ||
                                "%"}
                            </p>
                            {product.batteryRegulation.stateOfHealth
                              .measurementDate && (
                              <p className="pl-5">
                                Measured:{" "}
                                {new Date(
                                  product.batteryRegulation.stateOfHealth.measurementDate,
                                ).toLocaleDateString()}
                              </p>
                            )}
                            {product.batteryRegulation.stateOfHealth.vcId && (
                              <p className="pl-5">
                                VC ID:{" "}
                                <span className="font-mono text-xs">
                                  {product.batteryRegulation.stateOfHealth.vcId}
                                </span>
                              </p>
                            )}
                          </div>
                        )}
                      {product.batteryRegulation.vcId && (
                        <p className="mt-2 pt-2 border-t border-border/30">
                          <strong className="text-muted-foreground flex items-center">
                            <FileTextIcon className="mr-1.5 h-4 w-4 text-purple-500" />
                            Overall Battery VC ID:
                          </strong>{" "}
                          <span className="font-mono text-xs">
                            {product.batteryRegulation.vcId}
                          </span>
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

            <div className="mt-8 pt-6 border-t border-border">
              <Card className="border-0 shadow-none">
                <CardHeader className="px-0 pt-0 pb-4">
                  <CardTitle className="text-xl text-primary flex items-center">
                    <Fingerprint className="mr-2 h-6 w-6" /> Blockchain &amp;
                    Token Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm px-0 pb-0">
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
                      <Link
                        href={`https://mock-token-explorer.example.com/tx/${product.anchorTransactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center text-xs ml-2"
                      >
                        View Anchor Tx <ExternalLink className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  )}
                  {product.contractAddress && product.tokenId && (
                    <Link
                      href={`https://mock-token-explorer.example.com/token/${product.contractAddress}/${product.tokenId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center text-xs mt-1"
                    >
                      View Token on Mock Explorer{" "}
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                  )}
                  {product.ebsiStatus && (
                    <div className="mt-1.5 pt-1.5 border-t border-border/50">
                      <strong className="text-muted-foreground flex items-center">
                        <LucideIcons.Database className="mr-1.5 h-4 w-4 text-indigo-500" />
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
                          <Badge
                            variant="outline"
                            className="capitalize text-xs"
                          >
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
                      available for this product.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {(product.authenticationVcId || product.ownershipNftLink) && (
              <div className="mt-8 pt-6 border-t border-border">
                <Card className="border-0 shadow-none">
                  <CardHeader className="px-0 pt-0 pb-4">
                    <CardTitle className="text-xl text-primary flex items-center">
                      <KeyRound className="mr-2 h-6 w-6" /> Authenticity &amp;
                      Ownership
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm px-0 pb-0">
                    {product.authenticationVcId && (
                      <div className="flex flex-col mb-2">
                        <span className="text-xs text-muted-foreground">
                          Authenticity VC ID:
                        </span>
                        <span
                          className="font-mono text-xs break-all text-foreground/90"
                          title={product.authenticationVcId}
                        >
                          {product.authenticationVcId}
                        </span>
                      </div>
                    )}
                    {product.ownershipNftLink && (
                      <div className="pt-2 mt-2 border-t border-border/30">
                        <h4 className="text-sm font-semibold text-foreground mb-1">
                          Ownership NFT Link:
                        </h4>
                        {product.ownershipNftLink.registryUrl && (
                          <p>
                            <Link
                              href={product.ownershipNftLink.registryUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline inline-flex items-center"
                            >
                              View on Registry{" "}
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </Link>
                          </p>
                        )}
                        <p>
                          Contract:{" "}
                          <span className="font-mono text-xs break-all">
                            {product.ownershipNftLink.contractAddress}
                          </span>
                        </p>
                        <p>
                          Token ID:{" "}
                          <span className="font-mono">
                            {product.ownershipNftLink.tokenId}
                          </span>
                        </p>
                        {product.ownershipNftLink.chainName && (
                          <p>Chain: {product.ownershipNftLink.chainName}</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-border">
              <CardHeader className="px-0 pt-0 pb-4">
                <CardTitle className="text-xl text-primary">
                  Compliance Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                {currentRole === "verifier" && (
                  <p className="text-sm font-semibold text-info mb-2">
                    Auditor View: Access detailed compliance records and
                    initiate audits via the main dashboard.
                  </p>
                )}
                {currentRole === "manufacturer" &&
                  product.ebsiStatus === "pending" && (
                    <p className="text-sm text-orange-600 mb-2">
                      <strong>Action Required:</strong> EBSI verification for
                      this product is pending. Please review and complete
                      necessary steps through your dashboard.
                    </p>
                  )}
                <p className="text-foreground">{product.complianceSummary}</p>
                {product.learnMoreLink && (
                  <Link
                    href={product.learnMoreLink}
                    passHref
                    className="mt-3 inline-block"
                  >
                    <Button
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary/10"
                    >
                      Learn More About Our Standards
                    </Button>
                  </Link>
                )}
              </CardContent>
            </div>
          </div>
        </div>
        <RoleSpecificCard product={product} />
      </main>

      <footer className="py-8 bg-foreground text-background text-center mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} Norruva. All rights reserved.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Empowering Transparent &amp; Sustainable Commerce.
          </p>
        </div>
      </footer>
    </div>
  );
}
