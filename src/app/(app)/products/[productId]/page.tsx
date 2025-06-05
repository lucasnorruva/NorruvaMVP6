
"use client";

import { useParams, notFound, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { AlertTriangle, CheckCircle2, Info, Leaf, FileText, Truck, Recycle, Settings2, ShieldCheck, GitBranch, Zap, ExternalLink, Cpu, Fingerprint, Server, BatteryCharging, BarChart3, Percent } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; 
import { Button } from '@/components/ui/button';
import Link from 'next/link';


// Mock product data - in a real app, this would come from an API
const MOCK_PRODUCTS = [
  { 
    productId: "PROD001", 
    productName: "EcoFriendly Refrigerator X2000", 
    gtin: "01234567890123",
    gtinVerified: true,
    category: "Appliances", 
    status: "Active", 
    compliance: "Compliant", 
    complianceLastChecked: "2024-07-15",
    lastUpdated: "2024-07-20",
    manufacturer: "GreenTech Appliances",
    manufacturerVerified: true,
    modelNumber: "X2000-ECO",
    description: "A state-of-the-art refrigerator designed for maximum energy efficiency and minimal environmental impact. Features advanced cooling technology and smart controls.",
    descriptionOrigin: "manual",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "refrigerator appliance",
    materials: "Recycled Steel (70%), Bio-based Polymers (20%), Glass (10%)",
    sustainabilityClaims: "Energy Star Certified, Made with 70% recycled content, 95% recyclable at end-of-life.",
    sustainabilityClaimsVerified: true,
    energyLabel: "A+++",
    specifications: {
      "Dimensions (HxWxD)": "180cm x 70cm x 65cm",
      "Capacity": "400 Liters",
      "Energy Consumption": "150 kWh/year",
      "Noise Level": "35 dB",
      "Warranty": "5 years comprehensive, 10 years on compressor"
    },
    lifecycleEvents: [
      { id: "EVT001", type: "Manufactured", timestamp: "2024-01-15", location: "EcoFactory, Germany", details: "Production batch #PB789", isBlockchainAnchored: true },
      { id: "EVT002", type: "Shipped", timestamp: "2024-01-20", location: "Hamburg Port", details: "Container #C0N741N3R", isBlockchainAnchored: true },
      { id: "EVT003", type: "Sold", timestamp: "2024-02-10", location: "Retail Store, Paris", details: "Invoice #INV00567", isBlockchainAnchored: false },
    ],
    complianceData: {
      "REACH": { status: "Compliant", lastChecked: "2024-07-01", reportId: "REACH-X2000-001", isVerified: true },
      "RoHS": { status: "Compliant", lastChecked: "2024-07-01", reportId: "ROHS-X2000-001", isVerified: true },
      "WEEE": { status: "Compliant", lastChecked: "2024-07-01", reportId: "WEEE-X2000-001", isVerified: false },
    },
    isDppBlockchainAnchored: true,
  },
   { 
    productId: "PROD002", 
    productName: "Smart LED Bulb (4-Pack) with Battery Backup", 
    productNameOrigin: "AI_EXTRACTED",
    gtin: "98765432109876",
    gtinVerified: false,
    category: "Electronics", 
    status: "Active", 
    compliance: "Pending", 
    complianceLastChecked: "2024-07-20",
    lastUpdated: "2024-07-18",
    manufacturer: "BrightSpark Electronics",
    manufacturerVerified: true,
    modelNumber: "BS-LED-S04B",
    description: "Energy-efficient smart LED bulbs with customizable lighting options, long lifespan, and integrated battery backup for power outages. Connects to smart home systems.",
    descriptionOrigin: "AI_EXTRACTED",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "led bulbs package battery",
    materials: "Polycarbonate, Aluminum, LEDs, Li-ion Battery Cell",
    sustainabilityClaims: "Uses 85% less energy, Mercury-free, Recyclable packaging, Conflict-free minerals in battery.",
    sustainabilityClaimsVerified: false,
    energyLabel: "A+",
    specifications: {
      "Lumens": "800 lm per bulb",
      "Color Temperature": "2700K - 6500K tunable",
      "Lifespan": "25,000 hours",
      "Connectivity": "Wi-Fi, Bluetooth",
      "Battery Backup Time": "2 hours"
    },
    // Battery Regulation Data
    batteryChemistry: "Li-ion NMC",
    batteryChemistryOrigin: "AI_EXTRACTED",
    stateOfHealth: 99, // As percentage
    stateOfHealthOrigin: "manual",
    carbonFootprintManufacturing: 5.2, // kg CO2e
    carbonFootprintManufacturingOrigin: "AI_EXTRACTED",
    recycledContentPercentage: 8, // As percentage
    recycledContentPercentageOrigin: "manual",

    lifecycleEvents: [
      { id: "EVT004", type: "Manufactured", timestamp: "2024-03-01", location: "Shenzhen, China", details: "Batch #LEDB456", isBlockchainAnchored: true },
      { id: "EVT005", type: "Imported", timestamp: "2024-03-15", location: "Rotterdam Port", details: "Shipment #SHP0089", isBlockchainAnchored: false },
    ],
    complianceData: {
      "RoHS": { status: "Compliant", lastChecked: "2024-07-01", reportId: "ROHS-LEDB456-001", isVerified: true },
      "CE Mark": { status: "Compliant", lastChecked: "2024-07-01", reportId: "CE-LEDB456-001", isVerified: true },
      "Battery Regulation (EU 2023/1542)": { status: "Pending Documentation", lastChecked: "2024-07-20", reportId: "BATREG-LEDB456-PRE", isVerified: false },
    },
    isDppBlockchainAnchored: false,
  },
];

type ProductType = typeof MOCK_PRODUCTS[0] & {
  batteryChemistry?: string;
  batteryChemistryOrigin?: string;
  stateOfHealth?: number;
  stateOfHealthOrigin?: string;
  carbonFootprintManufacturing?: number;
  carbonFootprintManufacturingOrigin?: string;
  recycledContentPercentage?: number;
  recycledContentPercentageOrigin?: string;
};

const TrustSignalIcon = ({ isVerified, tooltipText, Icon = CheckCircle2 }: {isVerified?: boolean, tooltipText: string, Icon?: React.ElementType}) => {
  if (isVerified === undefined) return null;
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <span> 
            {isVerified ? <Icon className="h-4 w-4 text-green-500 ml-1" /> : <Info className="h-4 w-4 text-yellow-500 ml-1" />}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
};

const DataOriginIcon = ({ origin, fieldName }: { origin?: string, fieldName: string }) => {
  if (origin === 'AI_EXTRACTED') {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <Cpu className="h-4 w-4 text-info ml-1" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{fieldName} data suggested by AI.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  return null;
};


export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.productId as string;
  const [product, setProduct] = useState<ProductType | null | undefined>(undefined); 
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      await new Promise(resolve => setTimeout(resolve, 500)); 
      const foundProduct = MOCK_PRODUCTS.find(p => p.productId === productId) as ProductType | undefined;
      setProduct(foundProduct);
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (product === undefined) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    notFound();
    return null; 
  }
  
  const hasBatteryData = product.batteryChemistry || product.stateOfHealth !== undefined || product.carbonFootprintManufacturing !== undefined || product.recycledContentPercentage !== undefined;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center">
            <h1 className="text-3xl font-headline font-semibold">{product.productName}</h1>
            <DataOriginIcon origin={(product as any).productNameOrigin} fieldName="Product Name" />
            {product.isDppBlockchainAnchored && (
                <TooltipProvider>
                    <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                             <Fingerprint className="h-6 w-6 text-primary ml-2" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>This Digital Product Passport is anchored on the blockchain.</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge variant={
              product.status === "Active" ? "default" : 
              product.status === "Archived" ? "secondary" : "outline"
            } className={
              product.status === "Active" ? "bg-green-500/20 text-green-700 border-green-500/30" : ""
            }>
              {product.status}
            </Badge>
            <TooltipProvider>
                <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                         <Badge variant={
                            product.compliance === "Compliant" ? "default" :
                            product.compliance === "Pending" ? "outline" : "destructive"
                            } className={`
                            ${product.compliance === "Compliant" ? "bg-green-500/20 text-green-700 border-green-500/30" : ""}
                            ${product.compliance === "Pending" ? "bg-yellow-500/20 text-yellow-700 border-yellow-500/30" : ""}
                            cursor-help
                            `}>
                            {product.compliance}
                            {product.compliance === "Compliant" && <CheckCircle2 className="h-3 w-3 ml-1"/>}
                            {product.compliance === "Pending" && <Info className="h-3 w-3 ml-1"/>}
                            {product.compliance === "Non-Compliant" && <AlertTriangle className="h-3 w-3 ml-1"/>}
                        </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Overall compliance status. Last checked: {product.complianceLastChecked || "N/A"}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <span className="text-sm text-muted-foreground">Last updated: {product.lastUpdated}</span>
          </div>
        </div>
        <div className="flex gap-2">
            <Link href={`/passport/${product.productId}`} passHref target="_blank">
              <Button variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Public Passport
              </Button>
            </Link>
         </div>
      </div>

      <Card className="shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-3">
          <div className="md:col-span-1">
            <AspectRatio ratio={1}>
              <Image 
                src={product.imageUrl} 
                alt={product.productName} 
                fill 
                className="object-cover"
                data-ai-hint={product.imageHint}
                priority 
              />
            </AspectRatio>
          </div>
          <div className="md:col-span-2 p-6">
            <div className="flex items-center">
                 <CardTitle className="text-2xl mb-2">{product.productName}</CardTitle>
                 <DataOriginIcon origin={(product as any).productNameOrigin} fieldName="Product Name"/>
            </div>
            <div className="flex items-start">
                <CardDescription className="text-base mb-4">{product.description}</CardDescription>
                <DataOriginIcon origin={(product as any).descriptionOrigin} fieldName="Description"/>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center"><strong className="text-foreground/80 mr-1">GTIN:</strong> {product.gtin} <TrustSignalIcon isVerified={product.gtinVerified} tooltipText={product.gtinVerified ? "GTIN Verified" : "GTIN Not Verified"} /></div>
              <div><strong className="text-foreground/80">Category:</strong> {product.category}</div>
              <div className="flex items-center"><strong className="text-foreground/80 mr-1">Manufacturer:</strong> {product.manufacturer} <TrustSignalIcon isVerified={product.manufacturerVerified} tooltipText={product.manufacturerVerified ? "Manufacturer Verified" : "Manufacturer Not Verified"} /></div>
              <div><strong className="text-foreground/80">Model:</strong> {product.modelNumber}</div>
            </div>
             <div className="mt-4 pt-4 border-t">
                <h4 className="text-md font-semibold mb-2 flex items-center"><Leaf className="h-5 w-5 mr-2 text-growth-green"/>Key Sustainability Info <TrustSignalIcon isVerified={product.sustainabilityClaimsVerified} tooltipText={product.sustainabilityClaimsVerified ? "Sustainability Claims Verified" : "Sustainability Claims Pending Verification"} /></h4>
                <p className="text-sm text-muted-foreground mb-1"><strong>Materials:</strong> {product.materials}</p>
                <p className="text-sm text-muted-foreground mb-1"><strong>Claims:</strong> {product.sustainabilityClaims}</p>
                <p className="text-sm text-muted-foreground"><strong>Energy Label:</strong> <Badge variant="secondary">{product.energyLabel}</Badge></p>
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="specifications" className="w-full">
        <TabsList className={cn("grid w-full", hasBatteryData ? "grid-cols-2 sm:grid-cols-5" : "grid-cols-2 sm:grid-cols-4")}>
          <TabsTrigger value="specifications"><Settings2 className="mr-2 h-4 w-4" />Specifications</TabsTrigger>
          {hasBatteryData && <TabsTrigger value="battery"><BatteryCharging className="mr-2 h-4 w-4" />Battery Details</TabsTrigger>}
          <TabsTrigger value="compliance"><ShieldCheck className="mr-2 h-4 w-4" />Compliance</TabsTrigger>
          <TabsTrigger value="lifecycle"><GitBranch className="mr-2 h-4 w-4" />Lifecycle</TabsTrigger>
          <TabsTrigger value="sustainability"><Zap className="mr-2 h-4 w-4" />Sustainability</TabsTrigger>
        </TabsList>

        <TabsContent value="specifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex flex-col sm:flex-row justify-between text-sm border-b pb-1">
                  <span className="font-medium text-foreground/90">{key}:</span>
                  <span className="text-muted-foreground text-left sm:text-right">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {hasBatteryData && (
          <TabsContent value="battery" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><BatteryCharging className="mr-2 h-5 w-5 text-primary"/>EU Battery Passport Information</CardTitle>
                <CardDescription>Key data points relevant to the EU Battery Regulation.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {product.batteryChemistry && (
                  <div className="flex items-center justify-between text-sm border-b pb-1">
                    <span className="font-medium text-foreground/90 flex items-center">Battery Chemistry <DataOriginIcon origin={product.batteryChemistryOrigin} fieldName="Battery Chemistry"/></span>
                    <span className="text-muted-foreground">{product.batteryChemistry}</span>
                  </div>
                )}
                {product.stateOfHealth !== undefined && (
                  <div className="flex items-center justify-between text-sm border-b pb-1">
                    <span className="font-medium text-foreground/90 flex items-center">State of Health (SoH) <DataOriginIcon origin={product.stateOfHealthOrigin} fieldName="State of Health"/></span>
                    <span className="text-muted-foreground">{product.stateOfHealth}%</span>
                  </div>
                )}
                {product.carbonFootprintManufacturing !== undefined && (
                  <div className="flex items-center justify-between text-sm border-b pb-1">
                    <span className="font-medium text-foreground/90 flex items-center">Manufacturing Carbon Footprint <DataOriginIcon origin={product.carbonFootprintManufacturingOrigin} fieldName="Manufacturing Carbon Footprint"/></span>
                    <span className="text-muted-foreground">{product.carbonFootprintManufacturing} kg CO₂e</span>
                  </div>
                )}
                {product.recycledContentPercentage !== undefined && (
                  <div className="flex items-center justify-between text-sm border-b pb-1">
                    <span className="font-medium text-foreground/90 flex items-center">Recycled Content <DataOriginIcon origin={product.recycledContentPercentageOrigin} fieldName="Recycled Content"/></span>
                    <span className="text-muted-foreground">{product.recycledContentPercentage}%</span>
                  </div>
                )}
                 <p className="text-xs text-muted-foreground pt-2">Additional battery passport information such as performance, durability, and detailed material composition would be displayed here as available.</p>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="compliance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Records</CardTitle>
              <CardDescription>Status of compliance with key regulations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(product.complianceData).map(([reg, data]) => (
                <Card key={reg} className="bg-muted/50 p-4 rounded-lg">
                  <CardTitle className="text-md flex items-center justify-between">
                    <span className="flex items-center">{reg} <TrustSignalIcon isVerified={data.isVerified} tooltipText={data.isVerified ? `${reg} Verified` : `${reg} Status Pending Verification`} /></span>
                    <Badge variant={data.status === "Compliant" ? "default" : data.status.startsWith("Pending") ? "outline" : "destructive"} className={
                        data.status === "Compliant" ? "bg-green-500/20 text-green-700" : 
                        data.status.startsWith("Pending") ? "bg-yellow-500/20 text-yellow-700 border-yellow-500/30" : ""
                    }>
                      {data.status}
                    </Badge>
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">Last Checked: {data.lastChecked}</p>
                  {data.reportId && <p className="text-xs text-muted-foreground">Report ID: {data.reportId}</p>}
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lifecycle" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Lifecycle Events</CardTitle>
              <CardDescription>Key events in the product's journey.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {product.lifecycleEvents.map((event) => (
                  <li key={event.id} className="border p-3 rounded-md bg-background hover:bg-muted/30 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-semibold text-primary flex items-center">
                        {event.type}
                        {event.isBlockchainAnchored && (
                            <TooltipProvider>
                                <Tooltip delayDuration={100}>
                                    <TooltipTrigger asChild>
                                        <Server className="h-4 w-4 text-primary ml-2" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Event anchored on blockchain.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                        </p>
                      <p className="text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleDateString()}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Location: {event.location}</p>
                    <p className="text-sm text-muted-foreground">Details: {event.details}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sustainability" className="mt-4">
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Zap className="mr-2 h-5 w-5 text-growth-green"/>Detailed Sustainability Information</CardTitle> {/* Changed icon to Zap for variety */}
               <CardDescription>In-depth data on materials, carbon footprint, circularity, etc.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm border-b pb-1">
                    <span className="font-medium text-foreground/90 flex items-center"><Leaf className="mr-2 h-4 w-4 text-green-500"/> Detailed Material Breakdown:</span>
                    <span className="text-muted-foreground">To be populated from BOM or LCA data.</span>
                </div>
                 <div className="flex items-center justify-between text-sm border-b pb-1">
                    <span className="font-medium text-foreground/90 flex items-center"><BarChart3 className="mr-2 h-4 w-4 text-red-500"/> Carbon Footprint (Calculated):</span>
                    <span className="text-muted-foreground">[Value] kg CO₂e (Scope 1, 2, 3). To be integrated.</span>
                </div>
                <div className="flex items-center justify-between text-sm border-b pb-1">
                    <span className="font-medium text-foreground/90 flex items-center"><Recycle className="mr-2 h-4 w-4 text-blue-500"/> Recyclability Score:</span>
                    <span className="text-muted-foreground">95% (Based on material composition and design for disassembly).</span>
                </div>
                <div className="flex items-center justify-between text-sm border-b pb-1">
                    <span className="font-medium text-foreground/90 flex items-center"><Settings2 className="mr-2 h-4 w-4 text-orange-500"/> Repairability Index:</span>
                    <span className="text-muted-foreground">7.5/10 (To be calculated based on ESPR requirements).</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground/90 flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-yellow-500"/> Certifications:</span>
                    <span className="text-muted-foreground">Energy Star, EU Ecolabel (Mock).</span>
                </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-10 w-3/4 mb-2" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <Skeleton className="h-10 w-40" /> 
      </div>
      <Card className="shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-3">
          <div className="md:col-span-1">
            <AspectRatio ratio={1}>
              <Skeleton className="h-full w-full" />
            </AspectRatio>
          </div>
          <div className="md:col-span-2 p-6 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
            <div className="mt-4 pt-4 border-t space-y-2">
                <Skeleton className="h-6 w-1/3 mb-2"/>
                <Skeleton className="h-5 w-full"/>
                <Skeleton className="h-5 w-full"/>
                <Skeleton className="h-5 w-1/2"/>
            </div>
          </div>
        </div>
      </Card>
      <Skeleton className="h-10 w-full md:w-2/3" /> 
      <Card className="mt-4">
        <CardHeader>
          <Skeleton className="h-7 w-1/3" />
          <Skeleton className="h-5 w-2/3" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}
