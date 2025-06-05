
"use client";

import { useParams, notFound, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { AlertTriangle, CheckCircle2, Info, Leaf, FileText, Truck, Recycle, Settings2, ShieldCheck, GitBranch, Zap, ExternalLink, Cpu, Fingerprint, Server, BatteryCharging, BarChart3, Percent, Factory, ShoppingBag as ShoppingBagIcon, PackageCheck, CircleDollarSign, Wrench, AlertCircle, PackageSearch, CalendarDays, MapPin, Droplet, Target } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

import ProductLifecycleFlowchart, { type LifecyclePhase } from '@/components/products/ProductLifecycleFlowchart';
import OverallProductCompliance, { type OverallComplianceData, type ProductNotification as OverallProductNotification } from '@/components/products/OverallProductCompliance';
import ProductAlerts, { type ProductNotification } from '@/components/products/ProductAlerts';

import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';


// Mock product data - in a real app, this would come from an API
interface MaterialComposition {
  name: string;
  value: number;
  fill: string;
}

interface HistoricalDataPoint {
  year: string;
  value: number;
}
interface MockProductType {
  productId: string;
  productName: string;
  productNameOrigin?: 'AI_EXTRACTED' | 'manual';
  gtin: string;
  gtinVerified?: boolean;
  category: string;
  status: string;
  compliance: string;
  complianceLastChecked?: string;
  lastUpdated: string;
  manufacturer: string;
  manufacturerVerified?: boolean;
  modelNumber: string;
  description: string;
  descriptionOrigin?: 'AI_EXTRACTED' | 'manual';
  imageUrl: string;
  imageHint: string;
  materials: string;
  sustainabilityClaims: string;
  sustainabilityClaimsVerified?: boolean;
  energyLabel: string;
  specifications: Record<string, string>;
  lifecycleEvents: Array<{ id: string; type: string; timestamp: string; location: string; details: string; isBlockchainAnchored?: boolean; transactionHash?: string }>;
  complianceData: Record<string, { status: string; lastChecked: string; reportId: string; isVerified?: boolean }>;
  isDppBlockchainAnchored?: boolean;
  dppAnchorTransactionHash?: string;
  batteryChemistry?: string;
  batteryChemistryOrigin?: string;
  stateOfHealth?: number;
  stateOfHealthOrigin?: string;
  carbonFootprintManufacturing?: number;
  carbonFootprintManufacturingOrigin?: string;
  recycledContentPercentage?: number;
  recycledContentPercentageOrigin?: string;

  // New fields for the visual dashboard
  currentLifecyclePhaseIndex: number;
  lifecyclePhases: LifecyclePhase[];
  overallCompliance: OverallComplianceData;
  notifications: ProductNotification[]; // Uses ProductNotification from ProductAlerts

  // Enhanced Sustainability Data
  materialComposition?: MaterialComposition[];
  historicalCarbonFootprint?: HistoricalDataPoint[];
  waterUsage?: { value: number; unit: string; trend?: 'up' | 'down' | 'stable'; trendValue?: string };
  recyclabilityScore?: { value: number; unit: string };
  repairabilityIndex?: { value: number; scale: number };
  certifications?: Array<{ name: string, authority: string, link?: string, verified?: boolean}>;
}

const MOCK_PRODUCTS: MockProductType[] = [
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
      { id: "EVT001", type: "Manufactured", timestamp: "2024-01-15", location: "EcoFactory, Germany", details: "Production batch #PB789", isBlockchainAnchored: true, transactionHash: "0xabc123..." },
      { id: "EVT002", type: "Shipped", timestamp: "2024-01-20", location: "Hamburg Port", details: "Container #C0N741N3R", isBlockchainAnchored: true, transactionHash: "0xdef456..." },
      { id: "EVT003", type: "Sold", timestamp: "2024-02-10", location: "Retail Store, Paris", details: "Invoice #INV00567", isBlockchainAnchored: false },
    ],
    complianceData: {
      "REACH": { status: "Compliant", lastChecked: "2024-07-01", reportId: "REACH-X2000-001", isVerified: true },
      "RoHS": { status: "Compliant", lastChecked: "2024-07-01", reportId: "ROHS-X2000-001", isVerified: true },
      "WEEE": { status: "Compliant", lastChecked: "2024-07-01", reportId: "WEEE-X2000-001", isVerified: false },
    },
    isDppBlockchainAnchored: true,
    dppAnchorTransactionHash: "0x123mainanchor789",
    currentLifecyclePhaseIndex: 2,
    lifecyclePhases: [
      { id: "lc001", name: "Raw Materials", icon: PackageSearch, status: 'completed', timestamp: "2023-12-01", details: "Sourcing of verified recycled steel and bio-polymers.", complianceMetrics: [{ name: "Supplier Ethical Audit", status: "compliant", reportLink: "#" }], sustainabilityMetrics: [{ name: "Recycled Content Input", value: 75, unit: "%", targetValue: 70 }] },
      { id: "lc002", name: "Manufacturing", icon: Factory, status: 'completed', timestamp: "2024-01-15", details: "Assembly at EcoFactory, Germany. Production batch #PB789.", complianceMetrics: [{ name: "ISO 14001 Certification", status: "compliant", reportLink: "#" }], sustainabilityMetrics: [{ name: "Energy Used", value: 50, unit: "kWh/unit", targetValue: 55 }, { name: "Waste Generated", value: 2, unit: "kg/unit", targetValue: 3 }] },
      { id: "lc003", name: "Shipment", icon: Truck, status: 'in_progress', timestamp: "2024-01-20", details: "Shipping to distribution center via low-emission freight. Container #C0N741N3R.", complianceMetrics: [{ name: "Carbon Offset Cert.", status: "pending_review", reportLink: "#" }], sustainabilityMetrics: [{ name: "Transport Emissions", value: 15, unit: "kg CO2e", targetValue: 12 }] },
      { id: "lc004", name: "Retail", icon: ShoppingBagIcon, status: 'pending', timestamp: "2024-02-10", details: "Product available at certified retail partners.", complianceMetrics: [], sustainabilityMetrics: [] },
      { id: "lc005", name: "Consumer Use", icon: PackageCheck, status: 'pending', details: "Estimated 10-year lifespan with smart energy monitoring.", complianceMetrics: [], sustainabilityMetrics: [{ name: "Avg. Energy Use", value: 150, unit: "kWh/yr (est.)" }] },
      { id: "lc006", name: "End-of-Life", icon: Recycle, status: 'pending', details: "Designated for 95% recyclability through partner network.", complianceMetrics: [], sustainabilityMetrics: [{ name: "Recyclability Potential", value: 95, unit: "%"}] }
    ],
    overallCompliance: {
      gdpr: { status: "compliant", lastChecked: "2024-07-01" },
      eprel: { status: "compliant", entryId: "EPREL12345", lastChecked: "2024-06-20" },
      ebsiVerified: { status: "compliant", verificationId: "EBSI-TX-ABCDEF0123", lastChecked: "2024-07-15" },
      scip: { status: "not_applicable", lastChecked: "2024-07-01" },
      csrd: { status: "in_progress", lastChecked: "2024-07-20" }
    },
    notifications: [
      { id: "n001", type: "info", message: "Quarterly sustainability report due next month.", date: "2024-07-10" },
      { id: "n002", type: "warning", message: "Supplier 'PolyCore' ethical audit expiring soon.", date: "2024-07-18" }
    ],
    materialComposition: [
      { name: 'Recycled Steel', value: 70, fill: 'hsl(var(--chart-1))' },
      { name: 'Bio-Polymers', value: 20, fill: 'hsl(var(--chart-2))' },
      { name: 'Glass', value: 10, fill: 'hsl(var(--chart-5))' },
    ],
    historicalCarbonFootprint: [
      { year: '2021', value: 250 },
      { year: '2022', value: 220 },
      { year: '2023', value: 200 },
      { year: '2024', value: 180 },
    ],
    waterUsage: { value: 500, unit: 'L/unit', trend: 'down', trendValue: '-5%' },
    recyclabilityScore: { value: 95, unit: '%' },
    repairabilityIndex: { value: 8.5, scale: 10 },
    certifications: [
        { name: 'Energy Star', authority: 'EPA', verified: true, link: '#' },
        { name: 'EU Ecolabel', authority: 'European Commission', verified: true, link: '#' },
        { name: 'TCO Certified', authority: 'TCO Development', verified: false, link: '#' },
    ]
  },
  {
    productId: "PROD002",
    productName: "Smart LED Bulb (4-Pack) with Battery Backup",
    productNameOrigin: "AI_EXTRACTED",
    gtin: "98765432109876",
    gtinVerified: false,
    category: "Electronics",
    status: "Active",
    compliance: "Pending Documentation",
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
    batteryChemistry: "Li-ion NMC",
    batteryChemistryOrigin: "AI_EXTRACTED",
    stateOfHealth: 99,
    stateOfHealthOrigin: "manual",
    carbonFootprintManufacturing: 5.2,
    carbonFootprintManufacturingOrigin: "AI_EXTRACTED",
    recycledContentPercentage: 8,
    recycledContentPercentageOrigin: "manual",
    lifecycleEvents: [
      { id: "EVT004", type: "Manufactured", timestamp: "2024-03-01", location: "Shenzhen, China", details: "Batch #LEDB456", isBlockchainAnchored: true, transactionHash: "0xghi789..." },
      { id: "EVT005", type: "Imported", timestamp: "2024-03-15", location: "Rotterdam Port", details: "Shipment #SHP0089", isBlockchainAnchored: false },
    ],
    complianceData: {
      "RoHS": { status: "Compliant", lastChecked: "2024-07-01", reportId: "ROHS-LEDB456-001", isVerified: true },
      "CE Mark": { status: "Compliant", lastChecked: "2024-07-01", reportId: "CE-LEDB456-001", isVerified: true },
      "Battery Regulation (EU 2023/1542)": { status: "Pending Documentation", lastChecked: "2024-07-20", reportId: "BATREG-LEDB456-PRE", isVerified: false },
    },
    isDppBlockchainAnchored: false,
    currentLifecyclePhaseIndex: 1,
    lifecyclePhases: [
      { id: "lc007", name: "Materials Sourcing", icon: PackageSearch, status: 'completed', timestamp: "2024-02-01", details: "Sourcing of PC, Al, LED chips, battery components.", complianceMetrics: [{ name: "Conflict Minerals Report", status: "compliant", reportLink: "#" }], sustainabilityMetrics: [{ name: "Supplier Diversity Score", value: 60, unit: "/100", targetValue: 75 }] },
      { id: "lc008", name: "Manufacturing & Assembly", icon: Factory, status: 'in_progress', timestamp: "2024-03-01", details: "Assembly in Shenzhen, China. Batch #LEDB456.", complianceMetrics: [{ name: "Factory Safety Audit", status: "compliant", reportLink: "#" }], sustainabilityMetrics: [{ name: "Carbon Footprint (Mfg.)", value: 5.2, unit: "kg CO2e", targetValue: 5.0 }, { name: "Recycled Packaging Used", value: 90, unit: "%", targetValue: 100}] },
      { id: "lc009", name: "Distribution", icon: Truck, status: 'pending', details: "Global distribution network.", complianceMetrics: [], sustainabilityMetrics: [] },
      { id: "lc010", name: "Retail Sale", icon: ShoppingBagIcon, status: 'pending', details: "Available through online and physical stores.", complianceMetrics: [], sustainabilityMetrics: [] },
      { id: "lc011", name: "Use Phase", icon: PackageCheck, status: 'pending', details: "Estimated 3-year useful life for battery component.", complianceMetrics: [], sustainabilityMetrics: [{ name: "Energy Savings (vs Incand.)", value: 85, unit: "%" }] },
      { id: "lc012", name: "Battery EOL", icon: Recycle, status: 'issue', details: "Battery designed for easy removal and recycling. Documentation for EU Battery Regulation (EU 2023/1542) is overdue.", complianceMetrics: [{name: "WEEE Compliance", status: "pending_review"}], sustainabilityMetrics: [{name: "Battery Recyclability", value: 70, unit: "%", targetValue: 80}]}
    ],
    overallCompliance: {
      gdpr: { status: "not_applicable", lastChecked: "2024-07-01" },
      eprel: { status: "pending_review", lastChecked: "2024-07-20" },
      ebsiVerified: { status: "pending_review", verificationId: "PENDING_EBSI_CHECK", lastChecked: "2024-07-20" },
      scip: { status: "compliant", declarationId: "SCIP-XYZ", lastChecked: "2024-07-01" },
      csrd: { status: "pending_review", lastChecked: "2024-07-20" }
    },
    notifications: [
      { id: "n003", type: "error", message: "Battery Regulation documentation overdue! Action required.", date: "2024-07-19" },
      { id: "n004", type: "warning", message: "EPREL registration data needs review by end of week.", date: "2024-07-22" }
    ],
    materialComposition: [
        { name: 'Polycarbonate', value: 40, fill: 'hsl(var(--chart-1))' },
        { name: 'Aluminum', value: 30, fill: 'hsl(var(--chart-2))' },
        { name: 'LEDs & Electronics', value: 20, fill: 'hsl(var(--chart-3))' },
        { name: 'Li-ion Cell', value: 10, fill: 'hsl(var(--chart-4))' },
    ],
    historicalCarbonFootprint: [
      { year: '2022', value: 6.5 },
      { year: '2023', value: 5.8 },
      { year: '2024', value: 5.2 },
    ],
    waterUsage: { value: 10, unit: 'L/unit (mfg)' },
    recyclabilityScore: { value: 75, unit: '%' },
    repairabilityIndex: { value: 6.0, scale: 10 },
    certifications: [
        { name: 'RoHS Compliant', authority: 'Self-declared', verified: true },
        { name: 'CE Marked', authority: 'Self-declared', verified: true },
    ]
  },
];


const TrustSignalIcon = ({ isVerified, tooltipText, Icon = CheckCircle2 }: { isVerified?: boolean, tooltipText: string, Icon?: React.ElementType }) => {
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

const chartConfig = {
  carbon: { label: "Carbon Footprint (kg CO₂e)", color: "hsl(var(--chart-1))" },
  materials: {}, // Will be populated by material names
} satisfies import("@/components/ui/chart").ChartConfig;


export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.productId as string;
  const [product, setProduct] = useState<MockProductType | null | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const foundProduct = MOCK_PRODUCTS.find(p => p.productId === productId);
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
    notFound(); // Triggers 404 page
    return null;
  }

  const hasBatteryData = product.batteryChemistry || product.stateOfHealth !== undefined || product.carbonFootprintManufacturing !== undefined || product.recycledContentPercentage !== undefined;

  const currentYear = new Date().getFullYear().toString();
  const currentCarbonFootprint = product.historicalCarbonFootprint?.find(p => p.year === currentYear)?.value || product.historicalCarbonFootprint?.[product.historicalCarbonFootprint.length - 1]?.value;


  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center">
            <h1 className="text-3xl font-headline font-semibold">{product.productName}</h1>
            <DataOriginIcon origin={product.productNameOrigin} fieldName="Product Name" />
            {product.isDppBlockchainAnchored && (
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Fingerprint className="h-6 w-6 text-primary ml-2" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This Digital Product Passport is anchored on the blockchain, ensuring its integrity and authenticity.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {product.isDppBlockchainAnchored && product.dppAnchorTransactionHash && (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      {/* Using a non-functional button for mock display, replace with Link for real use */}
                      <Button variant="ghost" size="icon" className="ml-1 h-7 w-7" onClick={() => alert(`Mock: View on Explorer - Tx: ${product.dppAnchorTransactionHash}`)}>
                        <ExternalLink className="h-4 w-4 text-primary/70 hover:text-primary" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View on Blockchain Explorer (mock). Tx: {product.dppAnchorTransactionHash}</p>
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
                      product.compliance === "Pending Documentation" ? "outline" :
                      product.compliance === "Pending" ? "outline" : "destructive"
                  } className={`
                            ${product.compliance === "Compliant" ? "bg-green-500/20 text-green-700 border-green-500/30" : ""}
                            ${(product.compliance === "Pending" || product.compliance === "Pending Documentation") ? "bg-yellow-500/20 text-yellow-700 border-yellow-500/30" : ""}
                            cursor-help
                            `}>
                    {product.compliance}
                    {product.compliance === "Compliant" && <CheckCircle2 className="h-3 w-3 ml-1" />}
                    {(product.compliance === "Pending" || product.compliance === "Pending Documentation") && <Info className="h-3 w-3 ml-1" />}
                    {product.compliance === "Non-Compliant" && <AlertTriangle className="h-3 w-3 ml-1" />}
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

      {/* Visual Dashboard Section */}
      <Card className="shadow-xl border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-primary">Live DPP Status Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <OverallProductCompliance 
            complianceData={product.overallCompliance} 
            notifications={product.notifications as OverallProductNotification[]} 
          />
          {product.notifications && product.notifications.length > 0 && (
            <ProductAlerts notifications={product.notifications} />
          )}
          <ProductLifecycleFlowchart
            phases={product.lifecyclePhases}
            currentPhaseIndex={product.currentLifecyclePhaseIndex}
          />
        </CardContent>
      </Card>


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
              <DataOriginIcon origin={product.productNameOrigin} fieldName="Product Name" />
            </div>
            <div className="flex items-start">
              <CardDescription className="text-base mb-4">{product.description}</CardDescription>
              <DataOriginIcon origin={product.descriptionOrigin} fieldName="Description" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center"><strong className="text-foreground/80 mr-1">GTIN:</strong> {product.gtin} <TrustSignalIcon isVerified={product.gtinVerified} tooltipText={product.gtinVerified ? "GTIN Verified" : "GTIN Not Verified"} /></div>
              <div><strong className="text-foreground/80">Category:</strong> {product.category}</div>
              <div className="flex items-center"><strong className="text-foreground/80 mr-1">Manufacturer:</strong> {product.manufacturer} <TrustSignalIcon isVerified={product.manufacturerVerified} tooltipText={product.manufacturerVerified ? "Manufacturer Verified" : "Manufacturer Not Verified"} /></div>
              <div><strong className="text-foreground/80">Model:</strong> {product.modelNumber}</div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-md font-semibold mb-2 flex items-center"><Leaf className="h-5 w-5 mr-2 text-accent" />Key Sustainability Info <TrustSignalIcon isVerified={product.sustainabilityClaimsVerified} tooltipText={product.sustainabilityClaimsVerified ? "Sustainability Claims Verified" : "Sustainability Claims Pending Verification"} /></h4>
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
                <CardTitle className="flex items-center"><BatteryCharging className="mr-2 h-5 w-5 text-primary" />EU Battery Passport Information</CardTitle>
                <CardDescription>Key data points relevant to the EU Battery Regulation.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {product.batteryChemistry && (
                  <div className="flex items-center justify-between text-sm border-b pb-1">
                    <span className="font-medium text-foreground/90 flex items-center">Battery Chemistry <DataOriginIcon origin={product.batteryChemistryOrigin} fieldName="Battery Chemistry" /></span>
                    <span className="text-muted-foreground">{product.batteryChemistry}</span>
                  </div>
                )}
                {product.stateOfHealth !== undefined && (
                  <div className="flex items-center justify-between text-sm border-b pb-1">
                    <span className="font-medium text-foreground/90 flex items-center">State of Health (SoH) <DataOriginIcon origin={product.stateOfHealthOrigin} fieldName="State of Health" /></span>
                    <span className="text-muted-foreground">{product.stateOfHealth}%</span>
                  </div>
                )}
                {product.carbonFootprintManufacturing !== undefined && (
                  <div className="flex items-center justify-between text-sm border-b pb-1">
                    <span className="font-medium text-foreground/90 flex items-center">Manufacturing Carbon Footprint <DataOriginIcon origin={product.carbonFootprintManufacturingOrigin} fieldName="Manufacturing Carbon Footprint" /></span>
                    <span className="text-muted-foreground">{product.carbonFootprintManufacturing} kg CO₂e</span>
                  </div>
                )}
                {product.recycledContentPercentage !== undefined && (
                  <div className="flex items-center justify-between text-sm border-b pb-1">
                    <span className="font-medium text-foreground/90 flex items-center">Recycled Content <DataOriginIcon origin={product.recycledContentPercentageOrigin} fieldName="Recycled Content" /></span>
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
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-primary flex items-center">
                        {event.type}
                        {event.isBlockchainAnchored && (
                          <TooltipProvider>
                            <Tooltip delayDuration={100}>
                              <TooltipTrigger asChild>
                                <Server className="h-4 w-4 text-primary ml-2" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>This lifecycle event is recorded on the blockchain, providing an immutable audit trail.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                         {event.isBlockchainAnchored && event.transactionHash && (
                            <TooltipProvider>
                              <Tooltip delayDuration={100}>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="ml-1 h-5 w-5" onClick={() => alert(`Mock: View on Explorer - Event Tx: ${event.transactionHash}`)}>
                                    <ExternalLink className="h-3 w-3 text-primary/70 hover:text-primary" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View event on Blockchain Explorer (mock). Tx: {event.transactionHash}</p>
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
              <CardTitle className="flex items-center"><Zap className="mr-2 h-5 w-5 text-accent" />Detailed Sustainability Information</CardTitle>
              <CardDescription>In-depth data on materials, carbon footprint, circularity, etc.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {product.materialComposition && product.materialComposition.length > 0 && (
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center"><Leaf className="mr-2 h-4 w-4 text-green-500" />Material Composition</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={chartConfig} className="aspect-square h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                            <Pie data={product.materialComposition} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                                const RADIAN = Math.PI / 180;
                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                return (
                                  <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-medium">
                                    {`${(percent * 100).toFixed(0)}%`}
                                  </text>
                                );
                              }}>
                              {product.materialComposition.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Pie>
                            <ChartLegend content={<ChartLegendContent nameKey="name" />} className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center" />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                )}

                {product.historicalCarbonFootprint && product.historicalCarbonFootprint.length > 0 && (
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center"><BarChart3 className="mr-2 h-4 w-4 text-red-500" />Carbon Footprint Trend</CardTitle>
                      <CardDescription> (kg CO₂e over time)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={chartConfig} className="aspect-video h-[250px] w-full">
                         <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={product.historicalCarbonFootprint} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} dy={5} />
                            <YAxis stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                            <ChartTooltip
                              cursor={false}
                              content={<ChartTooltipContent indicator="line" />}
                            />
                            <Line type="monotone" dataKey="value" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={true} name="kg CO₂e" />
                          </LineChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t">
                {product.waterUsage && (
                  <Card className="bg-muted/50 p-4">
                    <CardTitle className="text-sm font-medium flex items-center text-foreground/80 mb-1"><Droplet className="mr-2 h-4 w-4 text-blue-500"/>Water Usage</CardTitle>
                    <p className="text-2xl font-bold">{product.waterUsage.value} <span className="text-sm font-normal text-muted-foreground">{product.waterUsage.unit}</span></p>
                    {product.waterUsage.trend && <p className={cn("text-xs", product.waterUsage.trend === 'down' ? 'text-green-600' : 'text-red-600')}>{product.waterUsage.trendValue} vs last period</p>}
                  </Card>
                )}
                 {product.recyclabilityScore && (
                  <Card className="bg-muted/50 p-4">
                    <CardTitle className="text-sm font-medium flex items-center text-foreground/80 mb-1"><Recycle className="mr-2 h-4 w-4 text-green-600"/>Recyclability Score</CardTitle>
                    <p className="text-2xl font-bold">{product.recyclabilityScore.value}<span className="text-sm font-normal text-muted-foreground">{product.recyclabilityScore.unit}</span></p>
                     <p className="text-xs text-muted-foreground">Based on material & design</p>
                  </Card>
                )}
                {product.repairabilityIndex && (
                  <Card className="bg-muted/50 p-4">
                    <CardTitle className="text-sm font-medium flex items-center text-foreground/80 mb-1"><Wrench className="mr-2 h-4 w-4 text-orange-500"/>Repairability Index</CardTitle>
                    <p className="text-2xl font-bold">{product.repairabilityIndex.value}<span className="text-sm font-normal text-muted-foreground"> / {product.repairabilityIndex.scale}</span></p>
                     <p className="text-xs text-muted-foreground">Based on ESPR draft</p>
                  </Card>
                )}
              </div>

              {product.certifications && product.certifications.length > 0 && (
                <div className="pt-4 border-t">
                  <h4 className="text-md font-semibold mb-2 flex items-center"><CheckCircle2 className="mr-2 h-5 w-5 text-primary"/>Certifications</h4>
                  <ul className="space-y-2">
                    {product.certifications.map(cert => (
                      <li key={cert.name} className="flex items-center justify-between text-sm p-2 bg-background rounded-md border">
                        <div className="flex items-center">
                           <TrustSignalIcon isVerified={cert.verified} tooltipText={cert.verified ? "Verified Certification" : "Self-Declared / Pending Verification"} Icon={cert.verified ? CheckCircle2 : Target} />
                           <span className="ml-2 font-medium">{cert.name}</span>
                           <span className="text-muted-foreground ml-1 text-xs">({cert.authority})</span>
                        </div>
                        {cert.link && <Link href={cert.link} target="_blank" rel="noopener noreferrer"><Button variant="link" size="sm" className="h-auto p-0">Details <ExternalLink className="ml-1 h-3 w-3"/></Button></Link>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

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

      <Card className="shadow-xl border-primary/20">
        <CardHeader>
          <Skeleton className="h-8 w-1/2 mb-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-24 w-full" /> {/* Placeholder for OverallCompliance */}
          <Skeleton className="h-16 w-full" /> {/* Placeholder for ProductAlerts */}
          <Skeleton className="h-48 w-full" /> {/* Placeholder for ProductLifecycleFlowchart */}
        </CardContent>
      </Card>


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
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          </div>
        </div>
      </Card>
      <Skeleton className="h-10 w-full md:w-2/3" /> {/* TabsList skeleton */}
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

    
