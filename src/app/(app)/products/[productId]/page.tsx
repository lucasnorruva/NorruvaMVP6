
"use client";

import { useParams, notFound, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { AlertTriangle, CheckCircle2, Info, Leaf, FileText, Truck, Recycle, Settings2, ShieldCheck, GitBranch, Zap, ExternalLink, Cpu, Fingerprint, Server, BatteryCharging, BarChart3, Percent, Factory, ShoppingBag as ShoppingBagIcon, PackageSearch, CalendarDays, MapPin, Droplet, Target, Users, Layers, Edit3, Wrench, Workflow, Loader2, ListChecks } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

import ProductLifecycleFlowchart, { type LifecyclePhase } from '@/components/products/ProductLifecycleFlowchart';
import OverallProductCompliance, { type OverallComplianceData, type ProductNotification as OverallProductNotification } from '@/components/products/OverallProductCompliance';
import ProductAlerts, { type ProductNotification } from '@/components/products/ProductAlerts';

import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useRole } from '@/contexts/RoleContext';
import { useToast } from '@/hooks/use-toast';
import { checkProductCompliance } from '@/ai/flows/check-product-compliance-flow';
import type { ProductFormData } from '@/components/products/ProductForm';

const USER_PRODUCTS_LOCAL_STORAGE_KEY = 'norruvaUserProducts';

interface StoredUserProduct extends ProductFormData {
  id: string;
  status: string;
  compliance: string;
  lastUpdated: string;
  productNameOrigin?: 'AI_EXTRACTED' | 'manual';
  productDescriptionOrigin?: 'AI_EXTRACTED' | 'manual';
  imageUrl?: string; // Ensure imageUrl is part of StoredUserProduct if saved by ProductForm
  // ... other origin fields if needed
}


interface MaterialComposition {
  name: string;
  value: number;
  fill: string;
}

interface HistoricalDataPoint {
  year: string;
  value: number;
}
export interface MockProductType { 
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

  currentLifecyclePhaseIndex: number;
  lifecyclePhases: LifecyclePhase[];
  overallCompliance: OverallComplianceData;
  notifications: ProductNotification[];

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
    lastUpdated: "2024-07-20T10:00:00Z",
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
      { id: "EVT001", type: "Manufactured", timestamp: "2024-01-15T08:00:00Z", location: "EcoFactory, Germany", details: "Production batch #PB789. End-of-line quality checks passed. Blockchain anchor event for manufacturing completion. Quality control data recorded; triggers manufacturing completion.", isBlockchainAnchored: true, transactionHash: "0xabc123def456ghi789jkl0mno1pq" },
      { id: "EVT002", type: "Shipped", timestamp: "2024-01-20T14:00:00Z", location: "Hamburg Port, Germany", details: "Container #C0N741N3R to distributor. Shipment data logged, triggers customs declaration prep.", isBlockchainAnchored: true, transactionHash: "0xdef456ghi789jkl0mno1pqrust" },
      { id: "EVT003", type: "Sold", timestamp: "2024-02-10T16:30:00Z", location: "Retail Store, Paris", details: "Invoice #INV00567. Warranty activated. Consumer registration data collected (GDPR compliant).", isBlockchainAnchored: false },
      { id: "EVT00X", type: "Maintenance", timestamp: "2025-02-15T10:00:00Z", location: "Consumer Home, Paris", details: "Scheduled filter replacement by certified technician. Service record updated.", isBlockchainAnchored: false }
    ],
    complianceData: {
      "REACH": { status: "Compliant", lastChecked: "2024-07-01T00:00:00Z", reportId: "REACH-X2000-001", isVerified: true },
      "RoHS": { status: "Compliant", lastChecked: "2024-07-01T00:00:00Z", reportId: "ROHS-X2000-001", isVerified: true },
      "WEEE": { status: "Compliant", lastChecked: "2024-07-01T00:00:00Z", reportId: "WEEE-X2000-001", isVerified: false },
    },
    isDppBlockchainAnchored: true,
    dppAnchorTransactionHash: "0x123mainanchor789xyzabc001",
    currentLifecyclePhaseIndex: 2, 
    lifecyclePhases: [
      { id: "lc001", name: "Raw Materials", icon: PackageSearch, status: 'completed', timestamp: "2023-12-01T10:00:00Z", location: "Verified Suppliers Network", details: "Sourcing of certified recycled steel and bio-polymers. Supplier compliance data (e.g., REACH for raw materials) recorded and verified. Quality control data recorded; triggers manufacturing completion.", complianceMetrics: [{ name: "Supplier Ethical Audit", status: "compliant", reportLink: "#" }, { name: "Material Origin Traceability", status: "compliant"}], sustainabilityMetrics: [{ name: "Recycled Content Input", value: 75, unit: "%", targetValue: 70 }, { name: "Conflict Minerals Free", status: "compliant"}] },
      { id: "lc002", name: "Manufacturing", icon: Factory, status: 'completed', timestamp: "2024-01-15T08:00:00Z", location: "EcoFactory, Germany", details: "Assembly at EcoFactory. Production batch #PB789 logged. Energy & waste data captured for sustainability reporting. End-of-line quality checks passed, triggers blockchain anchor for manufacturing completion.", complianceMetrics: [{ name: "ISO 14001 Certification", status: "compliant", reportLink: "#" }, { name: "Factory Safety Standards", status: "compliant"}], sustainabilityMetrics: [{ name: "Energy Used", value: 50, unit: "kWh/unit", targetValue: 55 }, { name: "Waste Generated", value: 2, unit: "kg/unit", targetValue: 3 }, {name: "Water Usage", value: 15, unit: "L/unit", targetValue: 20}] },
      { id: "lc003", name: "Distribution", icon: Truck, status: 'in_progress', timestamp: "2024-01-20T14:00:00Z", location: "Global Logistics Network", details: "Shipping to distribution centers via low-emission freight. Container #C0N741N3R. Carbon offset calculation in progress based on transport data. Customs declaration prep triggered.", complianceMetrics: [{ name: "Carbon Offset Cert.", status: "pending_review", reportLink: "#" }, { name: "Customs Compliance (EU)", status: "compliant"}], sustainabilityMetrics: [{ name: "Transport Emissions", value: 15, unit: "kg CO2e/unit", targetValue: 12 }] },
      { id: "lc004", name: "Retail & Sale", icon: ShoppingBagIcon, status: 'pending', timestamp: "2024-02-10T16:30:00Z", location: "Authorized Retailers", details: "Product available at certified retail partners. Point-of-sale data syncs warranty info. EPREL data accessible to consumers via QR code.", complianceMetrics: [{ name: "EPREL Data Sync", status: "compliant"}], sustainabilityMetrics: [{ name: "Packaging Recyclability", value: 100, unit: "%" }] },
      { id: "lc005", name: "Consumer Use", icon: Users, status: 'upcoming', timestamp: "2024-02-11T00:00:00Z", location: "Consumer Homes", details: "Estimated 10-year lifespan. Smart models provide energy usage data to consumer app. Repairability info (manuals, spare parts) available via DPP.", sustainabilityMetrics: [{ name: "Avg. Energy Use (est.)", value: 150, unit: "kWh/yr" }, {name: "Repairability Score", value: 8.5, unit: "/10"}] },
      { id: "lc006", name: "End-of-Life", icon: Recycle, status: 'upcoming', timestamp: "2034-02-10T00:00:00Z", location: "Certified Recycling Partners", details: "Designated for 95% recyclability. Take-back program details in DPP. Disassembly instructions and material composition available to recyclers for efficient processing.", complianceMetrics: [{name: "WEEE Compliance", status: "compliant"}], sustainabilityMetrics: [{ name: "Recyclability Potential", value: 95, unit: "%"}, {name: "Material Recovery Rate (target)", value: 90, unit: "%"}]}
    ],
    overallCompliance: {
      gdpr: { status: "compliant", lastChecked: "2024-07-01T10:00:00Z" },
      eprel: { status: "compliant", entryId: "EPREL12345", lastChecked: "2024-06-20T10:00:00Z" },
      ebsiVerified: { status: "compliant", verificationId: "EBSI-TX-ABCDEF0123", lastChecked: "2024-07-15T10:00:00Z" },
      scip: { status: "not_applicable", lastChecked: "2024-07-01T10:00:00Z" }, 
      csrd: { status: "in_progress", lastChecked: "2024-07-20T10:00:00Z" }
    },
    notifications: [
      { id: "n001", type: "info", message: "Quarterly sustainability report due next month.", date: "2024-07-10T10:00:00Z" },
      { id: "n002", type: "warning", message: "Supplier 'PolyCore' ethical audit expiring soon. Action recommended.", date: "2024-07-18T10:00:00Z" }
    ],
    materialComposition: [ { name: 'Recycled Steel', value: 70, fill: 'hsl(var(--chart-1))' }, { name: 'Bio-Polymers', value: 20, fill: 'hsl(var(--chart-2))' }, { name: 'Glass', value: 10, fill: 'hsl(var(--chart-5))' }, ],
    historicalCarbonFootprint: [ { year: '2021', value: 250 }, { year: '2022', value: 220 }, { year: '2023', value: 200 }, { year: '2024', value: 180 }, ],
    waterUsage: { value: 500, unit: 'L/unit (mfg)', trend: 'down', trendValue: '-5%' },
    recyclabilityScore: { value: 95, unit: '%' },
    repairabilityIndex: { value: 8.5, scale: 10 },
    certifications: [ { name: 'Energy Star', authority: 'EPA', verified: true, link: '#' }, { name: 'EU Ecolabel', authority: 'European Commission', verified: true, link: '#' }, { name: 'TCO Certified', authority: 'TCO Development', verified: false, link: '#' }, ]
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
    complianceLastChecked: "2024-07-20T00:00:00Z",
    lastUpdated: "2024-07-18T00:00:00Z",
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
    specifications: { "Lumens": "800 lm per bulb", "Color Temperature": "2700K - 6500K tunable", "Lifespan": "25,000 hours", "Connectivity": "Wi-Fi, Bluetooth", "Battery Backup Time": "2 hours" },
    batteryChemistry: "Li-ion NMC", batteryChemistryOrigin: "AI_EXTRACTED", stateOfHealth: 99, stateOfHealthOrigin: "manual", carbonFootprintManufacturing: 5.2, carbonFootprintManufacturingOrigin: "AI_EXTRACTED", recycledContentPercentage: 8, recycledContentPercentageOrigin: "manual",
    lifecycleEvents: [ { id: "EVT004", type: "Manufactured", timestamp: "2024-03-01T10:00:00Z", location: "Shenzhen, China", details: "Batch #LEDB456. Battery passport data generated. SCIP database notified of components. Quality control data recorded.", isBlockchainAnchored: true, transactionHash: "0xghi789jkl0mno1pqrustvwx" }, { id: "EVT005", type: "Imported", timestamp: "2024-03-15T10:00:00Z", location: "Rotterdam Port, Netherlands", details: "Shipment #SHP0089. EU customs cleared. Triggers CE marking verification.", isBlockchainAnchored: false }, { id: "EVT006", type: "Software Update", timestamp: "2024-08-01T00:00:00Z", location: "OTA Server", details: "Firmware v1.2 deployed. Improves energy efficiency algorithm. Update logged to DPP.", isBlockchainAnchored: true, transactionHash: "0xotaUpdateHash123xyz" } ],
    complianceData: { "RoHS": { status: "Compliant", lastChecked: "2024-07-01T10:00:00Z", reportId: "ROHS-LEDB456-001", isVerified: true }, "CE Mark": { status: "Compliant", lastChecked: "2024-07-01T10:00:00Z", reportId: "CE-LEDB456-001", isVerified: true }, "Battery Regulation (EU 2023/1542)": { status: "Pending Documentation", lastChecked: "2024-07-20T10:00:00Z", reportId: "BATREG-LEDB456-PRE", isVerified: false }, },
    isDppBlockchainAnchored: false, currentLifecyclePhaseIndex: 1, 
    lifecyclePhases: [ { id: "lc007", name: "Materials Sourcing", icon: PackageSearch, status: 'completed', timestamp: "2024-02-01T10:00:00Z", location: "Global Suppliers", details: "Sourcing of PC, Al, LED chips, battery components. Conflict minerals check completed. Supplier data for battery chemistry (e.g. Cobalt source) recorded for Battery Regulation.", complianceMetrics: [{ name: "Conflict Minerals Report", status: "compliant", reportLink: "#" }, { name: "Supplier Chemical Safety Data Sheets", status: "compliant" }], sustainabilityMetrics: [{ name: "Supplier Diversity Score", value: 60, unit: "/100", targetValue: 75 }, {name: "Battery Component Traceability", status: "compliant"}] }, { id: "lc008", name: "Manufacturing", icon: Factory, status: 'in_progress', timestamp: "2024-03-01T10:00:00Z", location: "Shenzhen, China", details: "Assembly in Shenzhen. Batch #LEDB456. Initial battery SoH recorded. SCIP notification for SVHC in components submitted. Carbon footprint of manufacturing calculated.", complianceMetrics: [{ name: "Factory Safety Audit (ISO 45001)", status: "compliant", reportLink: "#" }, {name: "SCIP Database Submission", status: "compliant", reportLink: "#"}], sustainabilityMetrics: [{ name: "Carbon Footprint (Mfg.)", value: 5.2, unit: "kg CO2e/pack", targetValue: 5.0 }, { name: "Recycled Packaging Used", value: 90, unit: "%", targetValue: 100}] }, { id: "lc009", name: "Distribution", icon: Truck, status: 'pending', timestamp: "2024-03-15T10:00:00Z", location: "Global Distribution Network", details: "Global distribution. Awaiting final packaging data for carbon footprint update of distribution phase. Customs documents generated.", complianceMetrics: [], sustainabilityMetrics: [{name: "Logistics Efficiency Score", value: 7, unit:"/10 (target)"}] }, { id: "lc010", name: "Retail Sale", icon: ShoppingBagIcon, status: 'pending', timestamp: "2024-04-01T00:00:00Z", location: "Online & Physical Stores", details: "Available through various retail channels. EPREL data to be displayed at point of sale. Consumer warranty registration activated on sale.", complianceMetrics: [{name: "EPREL Label Display", status: "pending_review"}], sustainabilityMetrics: [] }, { id: "lc011", name: "Use & Maintenance", icon: Users, status: 'upcoming', timestamp: "2024-04-02T00:00:00Z", location: "Consumer Homes & Businesses", details: "Estimated 3-year useful life for battery. OTA firmware updates enhance performance and security. Battery replacement guide in DPP for consumers/technicians.", sustainabilityMetrics: [{ name: "Energy Savings (vs Incand.)", value: 85, unit: "%" }, {name: "Firmware Update Frequency", value: 2, unit: "updates/yr (avg)"}] }, { id: "lc012", name: "Battery EOL", icon: Recycle, status: 'issue', timestamp: "2027-04-01T00:00:00Z", location: "Designated Collection Points", details: "Battery designed for removal. Documentation for EU Battery Regulation (EU 2023/1542) is overdue, impacting certified recycling pathway.", complianceMetrics: [{name: "WEEE Compliance", status: "pending_review"}, {name: "EU Battery Reg. Documentation", status: "non_compliant", reportLink: "#"}], sustainabilityMetrics: [{name: "Battery Recyclability", value: 70, unit: "%", targetValue: 80}]} ],
    overallCompliance: { gdpr: { status: "not_applicable", lastChecked: "2024-07-01T10:00:00Z" }, eprel: { status: "pending_review", lastChecked: "2024-07-20T10:00:00Z" }, ebsiVerified: { status: "pending_review", verificationId: "PENDING_EBSI_CHECK", lastChecked: "2024-07-20T10:00:00Z" },  scip: { status: "compliant", declarationId: "SCIP-XYZ789", lastChecked: "2024-07-01T10:00:00Z" }, csrd: { status: "pending_review", lastChecked: "2024-07-20T10:00:00Z" } },
    notifications: [ { id: "n003", type: "error", message: "Battery Regulation documentation overdue! Action required.", date: "2024-07-19T10:00:00Z" }, { id: "n004", type: "warning", message: "EPREL registration data needs review by end of week.", date: "2024-07-22T10:00:00Z" }, { id: "n005", type: "info", message: "Firmware update v1.2 successfully deployed.", date: "2024-08-01T02:00:00Z"} ],
    materialComposition: [ { name: 'Polycarbonate', value: 40, fill: 'hsl(var(--chart-1))' }, { name: 'Aluminum', value: 30, fill: 'hsl(var(--chart-2))' }, { name: 'LEDs & Electronics', value: 20, fill: 'hsl(var(--chart-3))' }, { name: 'Li-ion Cell', value: 10, fill: 'hsl(var(--chart-4))' }, ],
    historicalCarbonFootprint: [ { year: '2022', value: 6.5 }, { year: '2023', value: 5.8 }, { year: '2024', value: 5.2 }, ],
    waterUsage: { value: 10, unit: 'L/unit (mfg)' },
    recyclabilityScore: { value: 75, unit: '%' },
    repairabilityIndex: { value: 6.0, scale: 10 },
    certifications: [ { name: 'RoHS Compliant', authority: 'Self-declared', verified: true }, { name: 'CE Marked', authority: 'Self-declared', verified: true }, { name: 'UL Listed', authority: 'Underwriters Laboratories', verified: false, link: '#'}, ]
  },
];

const getDefaultMockProductValues = (id: string): MockProductType => ({
  productId: id,
  productName: "User Added Product",
  gtin: "",
  category: "General",
  status: "Draft",
  compliance: "N/A",
  lastUpdated: new Date().toISOString(),
  manufacturer: "N/A",
  modelNumber: "N/A",
  description: "No description provided.",
  imageUrl: `https://placehold.co/600x400.png?text=${encodeURIComponent(id)}`,
  imageHint: "product placeholder",
  materials: "Not specified",
  sustainabilityClaims: "None specified",
  energyLabel: "N/A",
  specifications: {},
  lifecycleEvents: [],
  complianceData: {},
  currentLifecyclePhaseIndex: 0,
  lifecyclePhases: [ { id: "lc_user_default_1", name: "Created", icon: PackageSearch, status: 'completed', timestamp: new Date().toISOString(), location: "System", details: "Product entry created by user." }, { id: "lc_user_default_2", name: "Pending Review", icon: Factory, status: 'in_progress', details: "Awaiting further data input and review." } ],
  overallCompliance: { gdpr: { status: "pending_review", lastChecked: new Date().toISOString() }, eprel: { status: "pending_review", lastChecked: new Date().toISOString() }, ebsiVerified: { status: "pending_review", lastChecked: new Date().toISOString() }, scip: { status: "pending_review", lastChecked: new Date().toISOString() }, csrd: { status: "pending_review", lastChecked: new Date().toISOString() }, },
  notifications: [ {id: "user_info_1", type: "info", message: "This product was added by a user and may have incomplete data. Please review and update.", date: new Date().toISOString()} ],
});

const TrustSignalIcon = ({ isVerified, tooltipText, VerifiedIcon = CheckCircle2, UnverifiedIcon = Info, customClasses }: { isVerified?: boolean, tooltipText: string, VerifiedIcon?: React.ElementType, UnverifiedIcon?: React.ElementType, customClasses?: string }) => {
  if (isVerified === undefined) return null;
  const IconToRender = isVerified ? VerifiedIcon : UnverifiedIcon;
  const colorClass = isVerified ? 'text-green-500' : 'text-yellow-600'; 

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <span className='cursor-help'>
            <IconToRender className={cn("h-4 w-4 ml-1", colorClass, customClasses)} />
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
             <Cpu className="h-4 w-4 text-info ml-1 cursor-help" />
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
  materials: {}, 
} satisfies import("@/components/ui/chart").ChartConfig;

const calculateDppCompleteness = (product: MockProductType): { score: number; filledFields: number; totalFields: number; missingFields: string[] } => {
  const essentialFieldsConfig: Array<{ key: keyof MockProductType | string; label: string; check?: (p: MockProductType) => boolean; categoryScope?: string[] }> = [
    { key: 'productName', label: 'Product Name' }, { key: 'gtin', label: 'GTIN' }, { key: 'category', label: 'Category' }, { key: 'manufacturer', label: 'Manufacturer' }, { key: 'modelNumber', label: 'Model Number' }, { key: 'description', label: 'Description' }, { key: 'imageUrl', label: 'Image URL', check: (p) => p.imageUrl && !p.imageUrl.includes('placehold.co') }, { key: 'materials', label: 'Materials' }, { key: 'sustainabilityClaims', label: 'Sustainability Claims' }, { key: 'energyLabel', label: 'Energy Label', categoryScope: ['Appliances', 'Electronics'] }, { key: 'specifications', label: 'Specifications', check: (p) => p.specifications && Object.keys(p.specifications).length > 0 }, { key: 'lifecycleEvents', label: 'Lifecycle Events', check: (p) => (p.lifecycleEvents || []).length > 0 }, { key: 'complianceData', label: 'Compliance Data', check: (p) => p.complianceData && Object.keys(p.complianceData).length > 0 },
  ];

  const isBatteryRelevantCategory = product.category?.toLowerCase().includes('electronics') || product.category?.toLowerCase().includes('automotive parts') || product.category?.toLowerCase().includes('battery');
  if (isBatteryRelevantCategory || product.batteryChemistry) {
    essentialFieldsConfig.push({ key: 'batteryChemistry', label: 'Battery Chemistry' });
    essentialFieldsConfig.push({ key: 'stateOfHealth', label: 'Battery State of Health (SoH)', check: p => typeof p.stateOfHealth === 'number' });
    essentialFieldsConfig.push({ key: 'carbonFootprintManufacturing', label: 'Battery Mfg. Carbon Footprint', check: p => typeof p.carbonFootprintManufacturing === 'number' });
    essentialFieldsConfig.push({ key: 'recycledContentPercentage', label: 'Battery Recycled Content', check: p => typeof p.recycledContentPercentage === 'number' });
  }

  let filledCount = 0;
  const missingFields: string[] = [];
  let actualTotalFields = 0;

  essentialFieldsConfig.forEach(fieldConfig => {
    if (fieldConfig.categoryScope) {
      const productCategoryLower = product.category?.toLowerCase();
      if (!productCategoryLower || !fieldConfig.categoryScope.some(scope => productCategoryLower.includes(scope.toLowerCase()))) { return; }
    }
    actualTotalFields++;
    if (fieldConfig.check) {
      if (fieldConfig.check(product)) { filledCount++; } else { missingFields.push(fieldConfig.label); }
    } else {
      const value = product[fieldConfig.key as keyof MockProductType];
      if (value !== null && value !== undefined && String(value).trim() !== '' && String(value).trim() !== 'N/A' && !String(value).includes('placehold.co')) { filledCount++; } else { missingFields.push(fieldConfig.label); }
    }
  });
  const score = actualTotalFields > 0 ? Math.round((filledCount / actualTotalFields) * 100) : 0;
  return { score, filledFields: filledCount, totalFields: actualTotalFields, missingFields };
};

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.productId as string;
  const [product, setProduct] = useState<MockProductType | null | undefined>(undefined);
  const router = useRouter();
  const { currentRole } = useRole();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('specifications'); 
  const [isCheckingCompliance, setIsCheckingCompliance] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      await new Promise(resolve => setTimeout(resolve, 300)); 

      let foundProduct: MockProductType | undefined;

      if (productId.startsWith("USER_PROD")) {
        const storedProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
        const userAddedProducts: StoredUserProduct[] = storedProductsString ? JSON.parse(storedProductsString) : [];
        const storedProduct = userAddedProducts.find(p => p.id === productId);

        if (storedProduct) {
          const defaults = getDefaultMockProductValues(storedProduct.id);
          foundProduct = {
            ...defaults,
            productId: storedProduct.id,
            productName: storedProduct.productName || "User Added Product",
            gtin: storedProduct.gtin || "",
            category: storedProduct.productCategory || "General",
            status: storedProduct.status,
            compliance: storedProduct.compliance,
            lastUpdated: storedProduct.lastUpdated,
            manufacturer: storedProduct.manufacturer || "N/A",
            modelNumber: storedProduct.modelNumber || "N/A",
            description: storedProduct.productDescription || "No description provided.",
            imageUrl: storedProduct.imageUrl || defaults.imageUrl, // Use stored imageUrl or default
            imageHint: storedProduct.imageUrl ? (storedProduct.productName || "product") : defaults.imageHint, // Basic hint if image exists
            materials: storedProduct.materials || "Not specified",
            sustainabilityClaims: storedProduct.sustainabilityClaims || "None specified",
            energyLabel: storedProduct.energyLabel || "N/A",
            specifications: storedProduct.specifications ? (typeof storedProduct.specifications === 'string' ? JSON.parse(storedProduct.specifications) : storedProduct.specifications) : {},
            productNameOrigin: storedProduct.productNameOrigin || 'manual',
            descriptionOrigin: storedProduct.productDescriptionOrigin || 'manual',
            batteryChemistry: storedProduct.batteryChemistry,
            // batteryChemistryOrigin: storedProduct.batteryChemistryOrigin, // This field is not in StoredUserProduct
            stateOfHealth: storedProduct.stateOfHealth,
            // stateOfHealthOrigin: storedProduct.stateOfHealthOrigin,
            carbonFootprintManufacturing: storedProduct.carbonFootprintManufacturing,
            // carbonFootprintManufacturingOrigin: storedProduct.carbonFootprintManufacturingOrigin,
            recycledContentPercentage: storedProduct.recycledContentPercentage,
            // recycledContentPercentageOrigin: storedProduct.recycledContentPercentageOrigin,
          };
        }
      }

      if (!foundProduct) {
        foundProduct = MOCK_PRODUCTS.find(p => p.productId === productId);
      }
      
      setProduct(foundProduct);
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const hasBatteryData = product?.batteryChemistry || product?.stateOfHealth !== undefined || product?.carbonFootprintManufacturing !== undefined || product?.recycledContentPercentage !== undefined;

  useEffect(() => {
    if (product) {
      let newDefaultTab = 'specifications'; 
      const criticalErrorNotification = product.notifications?.find(n => n.type === 'error');
      let errorDrivenTab: string | null = null;
      if (criticalErrorNotification) {
        const message = criticalErrorNotification.message.toLowerCase();
        if (message.includes('battery regulation') || message.includes('battery passport')) { if (hasBatteryData) { errorDrivenTab = 'battery'; } }
        if (!errorDrivenTab && (message.includes('compliance') || message.includes('regulation'))) { errorDrivenTab = 'compliance';  }
      }
      if (errorDrivenTab) { newDefaultTab = errorDrivenTab; } 
      else {
        switch (currentRole) {
          case 'manufacturer': newDefaultTab = 'specifications'; break;
          case 'supplier': newDefaultTab = 'specifications'; break;
          case 'retailer': newDefaultTab = 'sustainability'; break;
          case 'recycler': newDefaultTab = hasBatteryData ? 'battery' : 'sustainability'; break;
          case 'verifier': newDefaultTab = 'compliance'; break;
          case 'admin': newDefaultTab = 'lifecycle'; break;
          default: newDefaultTab = 'specifications';
        }
      }
      setActiveTab(newDefaultTab);
    }
  }, [currentRole, product, hasBatteryData]);

  const handleSimulateComplianceCheck = async () => {
    if (!product) return;
    const currentStageIndex = product.currentLifecyclePhaseIndex;
    const currentStage = product.lifecyclePhases[currentStageIndex];
    let nextStageIndex = currentStageIndex + 1;
    let nextStage = product.lifecyclePhases[nextStageIndex];
    if (!nextStage) { toast({ title: "End of Lifecycle", description: "This product is already at its final defined lifecycle stage.", variant: "default" }); return; }
    setIsCheckingCompliance(true);
    try {
      const output = await checkProductCompliance({ productId: product.productId, currentLifecycleStageName: currentStage.name, newLifecycleStageName: nextStage.name, productCategory: product.category, });
      toast({ title: `Compliance Re-Check for ${product.productName}`, description: ( <div> <p>Moved to Stage: <strong>{output.newLifecycleStageName}</strong></p> <p>New Overall Status: <strong>{output.simulatedOverallStatus}</strong></p> <p className="mt-2 text-xs">{output.simulatedReport}</p> </div> ), duration: 9000,  });
    } catch (error) { console.error("Compliance check simulation failed:", error); toast({ title: "Error Simulating Compliance Check", description: error instanceof Error ? error.message : "An unknown error occurred.", variant: "destructive", });
    } finally { setIsCheckingCompliance(false); }
  };

  if (product === undefined) { return <ProductDetailSkeleton />; }
  if (!product) { notFound(); return null; }

  const currentYear = new Date().getFullYear().toString();
  const currentCarbonFootprint = product.historicalCarbonFootprint?.find(p => p.year === currentYear)?.value || product.historicalCarbonFootprint?.[product.historicalCarbonFootprint.length - 1]?.value;
  const dppCompleteness = calculateDppCompleteness(product);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center">
            <h1 className="text-3xl font-headline font-semibold">{product.productName}</h1>
            <DataOriginIcon origin={product.productNameOrigin} fieldName="Product Name" />
            {product.isDppBlockchainAnchored && ( <TooltipProvider> <Tooltip delayDuration={100}> <TooltipTrigger asChild> <Fingerprint className="h-6 w-6 text-primary ml-2 cursor-help" /> </TooltipTrigger> <TooltipContent> <p>This Digital Product Passport is anchored on the blockchain, ensuring its integrity and authenticity.</p> </TooltipContent> </Tooltip> </TooltipProvider> )}
            {product.isDppBlockchainAnchored && product.dppAnchorTransactionHash && ( <TooltipProvider> <Tooltip delayDuration={100}> <TooltipTrigger asChild> <Button variant="ghost" size="icon" className="ml-1 h-7 w-7" onClick={() => alert(`Mock: View on Explorer - Tx: ${product.dppAnchorTransactionHash}`)}> <ExternalLink className="h-4 w-4 text-primary/70 hover:text-primary" /> </Button> </TooltipTrigger> <TooltipContent> <p>View on Blockchain Explorer (mock). Tx: {product.dppAnchorTransactionHash}</p> </TooltipContent> </Tooltip> </TooltipProvider> )}
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge variant={ product.status === "Active" ? "default" : product.status === "Archived" ? "secondary" : "outline" } className={cn( product.status === "Active" ? "bg-green-500/20 text-green-700 border-green-500/30" : "" )}> {product.status} </Badge>
            <TooltipProvider> <Tooltip delayDuration={100}> <TooltipTrigger asChild> <Badge variant={ product.compliance === "Compliant" ? "default" : product.compliance === "Pending Documentation" ? "outline" : product.compliance === "Pending" ? "outline" : product.compliance === "N/A" ? "secondary" : "destructive" } className={cn( product.compliance === "Compliant" ? "bg-green-500/20 text-green-700 border-green-500/30" : "", (product.compliance === "Pending" || product.compliance === "Pending Documentation") ? "bg-yellow-500/20 text-yellow-700 border-yellow-500/30" : "", product.compliance === "N/A" ? "bg-muted text-muted-foreground border-border" : "" ,"cursor-help" )}> {product.compliance} {product.compliance === "Compliant" && <CheckCircle2 className="h-3 w-3 ml-1" />} {(product.compliance === "Pending" || product.compliance === "Pending Documentation") && <Info className="h-3 w-3 ml-1" />} {product.compliance === "Non-Compliant" && <AlertTriangle className="h-3 w-3 ml-1" />} </Badge> </TooltipTrigger> <TooltipContent> <p>Overall compliance status. Last checked: {product.complianceLastChecked ? new Date(product.complianceLastChecked).toLocaleDateString() : "N/A"}</p> </TooltipContent> </Tooltip> </TooltipProvider>
            <span className="text-sm text-muted-foreground">Last updated: {new Date(product.lastUpdated).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex gap-2"> <Link href={`/passport/${product.productId}`} passHref target="_blank"> <Button variant="outline"> <ExternalLink className="mr-2 h-4 w-4" /> View Public Passport </Button> </Link> </div>
      </div>
      
      <Card className="shadow-xl border-primary/20 bg-muted/30">
        <CardHeader className="flex flex-row justify-between items-start">
          <div> <CardTitle className="text-2xl font-headline text-primary">Live DPP Status Overview</CardTitle> <CardDescription>Dynamic summary of product compliance, alerts, and lifecycle progress.</CardDescription> </div>
           <Button  onClick={handleSimulateComplianceCheck}  disabled={isCheckingCompliance || product.currentLifecyclePhaseIndex >= product.lifecyclePhases.length -1} variant="secondary" size="sm" > {isCheckingCompliance ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Workflow className="mr-2 h-4 w-4" />} Simulate Next Stage & Check Compliance </Button>
        </CardHeader>
        <CardContent className="space-y-6"> <OverallProductCompliance  complianceData={product.overallCompliance}  notifications={product.notifications as OverallProductNotification[]}  /> {product.notifications && product.notifications.length > 0 && ( <ProductAlerts notifications={product.notifications} /> )} <ProductLifecycleFlowchart phases={product.lifecyclePhases} currentPhaseIndex={product.currentLifecyclePhaseIndex} /> </CardContent>
      </Card>

      <Card className="shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-3">
          <div className="md:col-span-1 p-6">
            <AspectRatio ratio={4/3} className="bg-muted rounded-md overflow-hidden">
              <Image
                src={product.imageUrl || "https://placehold.co/600x400.png?text=No+Image"}
                alt={product.productName}
                fill
                className="object-contain"
                data-ai-hint={product.imageHint || product.productName.split(" ").slice(0,2).join(" ")}
                priority
              />
            </AspectRatio>
          </div>
          <div className="md:col-span-2 p-6">
            <div className="flex items-center"> <CardTitle className="text-2xl mb-2">{product.productName}</CardTitle> <DataOriginIcon origin={product.productNameOrigin} fieldName="Product Name" /> </div>
            <div className="flex items-start"> <CardDescription className="text-base mb-4">{product.description}</CardDescription> <DataOriginIcon origin={product.descriptionOrigin} fieldName="Description" /> </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center"> <strong className="text-foreground/80 mr-1">GTIN:</strong> {product.gtin || "N/A"}  <TrustSignalIcon  isVerified={product.gtinVerified}  tooltipText={product.gtinVerified ? "GTIN Verified" : "GTIN Not Verified"}  VerifiedIcon={CheckCircle2}  UnverifiedIcon={Info} /> </div>
              <div><strong className="text-foreground/80">Category:</strong> {product.category || "N/A"}</div>
              <div className="flex items-center"> <strong className="text-foreground/80 mr-1">Manufacturer:</strong> {product.manufacturer || "N/A"}  <TrustSignalIcon  isVerified={product.manufacturerVerified}  tooltipText={product.manufacturerVerified ? "Manufacturer Verified" : "Manufacturer Not Verified"} VerifiedIcon={CheckCircle2}  UnverifiedIcon={Info} /> </div>
              <div><strong className="text-foreground/80">Model:</strong> {product.modelNumber || "N/A"}</div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-md font-semibold mb-2 flex items-center"> <Leaf className="h-5 w-5 mr-2 text-accent" />Key Sustainability Info  <TrustSignalIcon  isVerified={product.sustainabilityClaimsVerified}  tooltipText={product.sustainabilityClaimsVerified ? "Sustainability Claims Verified" : "Sustainability Claims Pending Verification"} VerifiedIcon={CheckCircle2}  UnverifiedIcon={Info} /> </h4>
              <p className="text-sm text-muted-foreground mb-1"><strong>Materials:</strong> {product.materials || "N/A"}</p>
              <p className="text-sm text-muted-foreground mb-1"><strong>Claims:</strong> {product.sustainabilityClaims || "N/A"}</p>
              <p className="text-sm text-muted-foreground"><strong>Energy Label:</strong> <Badge variant="secondary">{product.energyLabel || "N/A"}</Badge></p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="shadow-lg">
        <CardHeader> <CardTitle className="flex items-center"> <ListChecks className="mr-2 h-5 w-5 text-primary" /> DPP Data Completeness </CardTitle> <CardDescription> Indicates how complete the information for this Digital Product Passport is. </CardDescription> </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2"> <span className="text-lg font-semibold text-primary">{dppCompleteness.score}% Complete</span> <span className="text-sm text-muted-foreground"> {dppCompleteness.filledFields} / {dppCompleteness.totalFields} essential fields filled </span> </div>
          <Progress value={dppCompleteness.score} className="w-full h-3" />
          {dppCompleteness.missingFields.length > 0 && ( <div className="mt-3"> <p className="text-xs text-muted-foreground">Missing or incomplete essential fields:</p> <ul className="list-disc list-inside text-xs text-muted-foreground pl-2 max-h-20 overflow-y-auto"> {dppCompleteness.missingFields.map(field => <li key={field}>{field}</li>)} </ul> </div> )}
          {dppCompleteness.score === 100 && ( <p className="text-sm text-green-600 mt-3 flex items-center"> <CheckCircle2 className="mr-2 h-4 w-4" /> All essential data points are present! </p> )}
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={cn("grid w-full", hasBatteryData ? "grid-cols-2 sm:grid-cols-5" : "grid-cols-2 sm:grid-cols-4")}>
          <TabsTrigger value="specifications"><Settings2 className="mr-2 h-4 w-4" />Specifications</TabsTrigger>
          {hasBatteryData && <TabsTrigger value="battery"><BatteryCharging className="mr-2 h-4 w-4" />Battery Details</TabsTrigger>}
          <TabsTrigger value="compliance"><ShieldCheck className="mr-2 h-4 w-4" />Compliance</TabsTrigger>
          <TabsTrigger value="lifecycle"><GitBranch className="mr-2 h-4 w-4" />Lifecycle</TabsTrigger>
          <TabsTrigger value="sustainability"><Zap className="mr-2 h-4 w-4" />Sustainability</TabsTrigger>
        </TabsList>

        <TabsContent value="specifications" className="mt-4">
          <Card> <CardHeader> <CardTitle>Detailed Specifications</CardTitle> </CardHeader>
            <CardContent className="space-y-2">
              {product.specifications && Object.keys(product.specifications).length > 0 ? ( Object.entries(product.specifications).map(([key, value]) => ( <div key={key} className="flex flex-col sm:flex-row justify-between text-sm border-b pb-1"> <span className="font-medium text-foreground/90">{key}:</span> <span className="text-muted-foreground text-left sm:text-right">{value}</span> </div> )) ) : ( <p className="text-sm text-muted-foreground">No specifications provided.</p> )}
            </CardContent>
          </Card>
        </TabsContent>

        {hasBatteryData && (
          <TabsContent value="battery" className="mt-4">
            <Card> <CardHeader> <CardTitle className="flex items-center"><BatteryCharging className="mr-2 h-5 w-5 text-primary" />EU Battery Passport Information</CardTitle> <CardDescription>Key data points relevant to the EU Battery Regulation.</CardDescription> </CardHeader>
              <CardContent className="space-y-3">
                {product.batteryChemistry && ( <div className="flex items-center justify-between text-sm border-b pb-1"> <span className="font-medium text-foreground/90 flex items-center">Battery Chemistry <DataOriginIcon origin={product.batteryChemistryOrigin} fieldName="Battery Chemistry" /></span> <span className="text-muted-foreground">{product.batteryChemistry}</span> </div> )}
                {product.stateOfHealth !== undefined && ( <div className="flex items-center justify-between text-sm border-b pb-1"> <span className="font-medium text-foreground/90 flex items-center">State of Health (SoH) <DataOriginIcon origin={product.stateOfHealthOrigin} fieldName="State of Health" /></span> <span className="text-muted-foreground">{product.stateOfHealth}%</span> </div> )}
                {product.carbonFootprintManufacturing !== undefined && ( <div className="flex items-center justify-between text-sm border-b pb-1"> <span className="font-medium text-foreground/90 flex items-center">Manufacturing Carbon Footprint <DataOriginIcon origin={product.carbonFootprintManufacturingOrigin} fieldName="Manufacturing Carbon Footprint" /></span> <span className="text-muted-foreground">{product.carbonFootprintManufacturing} kg CO₂e</span> </div> )}
                {product.recycledContentPercentage !== undefined && ( <div className="flex items-center justify-between text-sm border-b pb-1"> <span className="font-medium text-foreground/90 flex items-center">Recycled Content <DataOriginIcon origin={product.recycledContentPercentageOrigin} fieldName="Recycled Content" /></span> <span className="text-muted-foreground">{product.recycledContentPercentage}%</span> </div> )}
                {!product.batteryChemistry && product.stateOfHealth === undefined && product.carbonFootprintManufacturing === undefined && product.recycledContentPercentage === undefined && (
                    <p className="text-sm text-muted-foreground">No battery-specific information provided for this product.</p>
                )}
                <p className="text-xs text-muted-foreground pt-2">Additional battery passport information such as performance, durability, and detailed material composition would be displayed here as available.</p>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="compliance" className="mt-4">
          <Card> <CardHeader> <CardTitle>Compliance Records</CardTitle> <CardDescription>Status of compliance with key regulations.</CardDescription> </CardHeader>
            <CardContent className="space-y-4">
              {product.complianceData && Object.keys(product.complianceData).length > 0 ? ( Object.entries(product.complianceData).map(([reg, data]) => ( <Card key={reg} className="bg-muted/50 p-4 rounded-lg"> <CardTitle className="text-md flex items-center justify-between"> <span className="flex items-center"> {reg}  <TrustSignalIcon  isVerified={data.isVerified}  tooltipText={data.isVerified ? `${reg} Verified` : `${reg} Status Pending Verification`} VerifiedIcon={CheckCircle2} UnverifiedIcon={Info} /> </span> <Badge variant={data.status === "Compliant" ? "default" : data.status.startsWith("Pending") ? "outline" : "destructive"} className={cn( data.status === "Compliant" ? "bg-green-500/20 text-green-700 border-green-500/30" : "", data.status.startsWith("Pending") ? "bg-yellow-500/20 text-yellow-700 border-yellow-500/30" : "" )}> {data.status} </Badge> </CardTitle> <p className="text-xs text-muted-foreground mt-1">Last Checked: {new Date(data.lastChecked).toLocaleDateString()}</p> {data.reportId && <p className="text-xs text-muted-foreground">Report ID: {data.reportId}</p>} </Card> )) ) : ( <p className="text-sm text-muted-foreground">No specific compliance records available for this product.</p> )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lifecycle" className="mt-4">
          <Card> <CardHeader> <CardTitle>Product Lifecycle Events</CardTitle> <CardDescription>Key events in the product's journey.</CardDescription> </CardHeader>
            <CardContent>
              {product.lifecycleEvents && product.lifecycleEvents.length > 0 ? ( <ul className="space-y-4"> {product.lifecycleEvents.map((event) => ( <li key={event.id} className="border p-3 rounded-md bg-background hover:bg-muted/30 transition-colors"> <div className="flex justify-between items-start mb-1"> <p className="font-semibold text-primary flex items-center"> {event.type} {event.isBlockchainAnchored && ( <TooltipProvider> <Tooltip delayDuration={100}> <TooltipTrigger asChild> <Server className="h-4 w-4 text-primary ml-2 cursor-help" /> </TooltipTrigger> <TooltipContent> <p>This lifecycle event is recorded on the blockchain, providing an immutable audit trail.</p> </TooltipContent> </Tooltip> </TooltipProvider> )} {event.isBlockchainAnchored && event.transactionHash && ( <TooltipProvider> <Tooltip delayDuration={100}> <TooltipTrigger asChild> <Button variant="ghost" size="icon" className="ml-1 h-5 w-5" onClick={() => alert(`Mock: View on Explorer - Event Tx: ${event.transactionHash}`)}> <ExternalLink className="h-3 w-3 text-primary/70 hover:text-primary" /> </Button> </TooltipTrigger> <TooltipContent> <p>View event on Blockchain Explorer (mock). Tx: {event.transactionHash}</p> </TooltipContent> </Tooltip> </TooltipProvider> )} </p> <p className="text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleDateString()}</p> </div> <p className="text-sm text-muted-foreground">Location: {event.location}</p> <p className="text-sm text-muted-foreground">Details: {event.details}</p> </li> ))} </ul> ) : ( <p className="text-sm text-muted-foreground">No lifecycle events recorded for this product.</p> )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sustainability" className="mt-4">
          <Card> <CardHeader> <CardTitle className="flex items-center"><Zap className="mr-2 h-5 w-5 text-accent" />Detailed Sustainability Information</CardTitle> <CardDescription>In-depth data on materials, carbon footprint, circularity, etc.</CardDescription> </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {product.materialComposition && product.materialComposition.length > 0 && ( <Card className="shadow-sm"> <CardHeader> <CardTitle className="text-lg flex items-center"><Leaf className="mr-2 h-4 w-4 text-green-500" />Material Composition</CardTitle> </CardHeader> <CardContent> <ChartContainer config={chartConfig} className="aspect-square h-[250px] w-full"> <ResponsiveContainer width="100%" height="100%"> <PieChart> <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} /> <Pie data={product.materialComposition} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => { const RADIAN = Math.PI / 180; const radius = innerRadius + (outerRadius - innerRadius) * 0.5; const x = cx + radius * Math.cos(-midAngle * RADIAN); const y = cy + radius * Math.sin(-midAngle * RADIAN); return ( <text x={x} y={y} fill="hsl(var(--primary-foreground))" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-medium"> {`${(percent * 100).toFixed(0)}%`} </text> ); }}> {product.materialComposition.map((entry, index) => ( <Cell key={`cell-${index}`} fill={entry.fill} className={cn("stroke-background focus:outline-none", entry.fill.startsWith("hsl") ? "" : entry.fill)} /> ))} </Pie> <ChartLegend content={<ChartLegendContent nameKey="name" />} className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center" /> </PieChart> </ResponsiveContainer> </ChartContainer> </CardContent> </Card> )}
                {product.historicalCarbonFootprint && product.historicalCarbonFootprint.length > 0 && ( <Card className="shadow-sm"> <CardHeader> <CardTitle className="text-lg flex items-center"><BarChart3 className="mr-2 h-4 w-4 text-red-500" />Carbon Footprint Trend</CardTitle> <CardDescription> (kg CO₂e over time)</CardDescription> </CardHeader> <CardContent> <ChartContainer config={chartConfig} className="aspect-video h-[250px] w-full"> <ResponsiveContainer width="100%" height="100%"> <LineChart data={product.historicalCarbonFootprint} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}> <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /> <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} dy={5} /> <YAxis stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} /> <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} /> <Line type="monotone" dataKey="value" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ fill: "hsl(var(--chart-1))", r:4 }} activeDot={{r:6}} name="kg CO₂e" /> </LineChart> </ResponsiveContainer> </ChartContainer> </CardContent> </Card> )}
              </div>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t">
                {product.waterUsage && ( <Card className="bg-muted/50 p-4"> <CardTitle className="text-sm font-medium flex items-center text-foreground/80 mb-1"><Droplet className="mr-2 h-4 w-4 text-blue-500"/>Water Usage</CardTitle> <p className="text-2xl font-bold">{product.waterUsage.value} <span className="text-sm font-normal text-muted-foreground">{product.waterUsage.unit}</span></p> {product.waterUsage.trend && <p className={cn("text-xs", product.waterUsage.trend === 'down' ? 'text-green-600' : 'text-red-600')}>{product.waterUsage.trendValue} vs last period</p>} </Card> )}
                 {product.recyclabilityScore && ( <Card className="bg-muted/50 p-4"> <CardTitle className="text-sm font-medium flex items-center text-foreground/80 mb-1"><Recycle className="mr-2 h-4 w-4 text-green-600"/>Recyclability Score</CardTitle> <p className="text-2xl font-bold">{product.recyclabilityScore.value}<span className="text-sm font-normal text-muted-foreground">{product.recyclabilityScore.unit}</span></p> <p className="text-xs text-muted-foreground">Based on material & design</p> </Card> )}
                {product.repairabilityIndex && ( <Card className="bg-muted/50 p-4"> <CardTitle className="text-sm font-medium flex items-center text-foreground/80 mb-1"><Wrench className="mr-2 h-4 w-4 text-orange-500"/>Repairability Index</CardTitle> <p className="text-2xl font-bold">{product.repairabilityIndex.value}<span className="text-sm font-normal text-muted-foreground"> / {product.repairabilityIndex.scale}</span></p> <p className="text-xs text-muted-foreground">Based on ESPR draft</p> </Card> )}
              </div>
              {product.certifications && product.certifications.length > 0 && ( <div className="pt-4 border-t"> <CardTitle className="text-md font-semibold mb-2 flex items-center"><CheckCircle2 className="mr-2 h-5 w-5 text-primary"/>Certifications & Standards</CardTitle> <ul className="space-y-2"> {product.certifications.map(cert => ( <li key={cert.name} className="flex items-center justify-between text-sm p-2 bg-background rounded-md border hover:bg-muted/30 transition-colors"> <div className="flex items-center"> <TrustSignalIcon  isVerified={cert.verified}  tooltipText={cert.verified ? "Verified Certification" : "Self-Declared / Pending Verification"} VerifiedIcon={CheckCircle2} UnverifiedIcon={Target} customClasses={cn(cert.verified ? 'text-green-500' : 'text-yellow-600')}  /> <span className="ml-2 font-medium">{cert.name}</span> <span className="text-muted-foreground ml-1 text-xs">({cert.authority})</span> </div> {cert.link && <Link href={cert.link} target="_blank" rel="noopener noreferrer"><Button variant="link" size="sm" className="h-auto p-0">Details <ExternalLink className="ml-1 h-3 w-3"/></Button></Link>} </li> ))} </ul> </div> )}
              {(!product.materialComposition || product.materialComposition.length === 0) && (!product.historicalCarbonFootprint || product.historicalCarbonFootprint.length === 0) && !product.waterUsage && !product.recyclabilityScore && !product.repairabilityIndex && (!product.certifications || product.certifications.length === 0) && ( <p className="text-sm text-muted-foreground">Detailed sustainability information is not yet available for this product.</p> )}
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"> <div> <Skeleton className="h-10 w-3/4 mb-2" /> <Skeleton className="h-6 w-1/2" /> </div> <div className="flex gap-2"> <Skeleton className="h-10 w-40" /> </div> </div>
      <Card className="shadow-xl border-primary/20 bg-muted/30"> <CardHeader> <Skeleton className="h-8 w-1/2 mb-2" /> </CardHeader> <CardContent className="space-y-6"> <Skeleton className="h-24 w-full" />  <Skeleton className="h-16 w-full" />  <Skeleton className="h-48 w-full" />  </CardContent> </Card>
      <Card className="shadow-lg overflow-hidden"> <div className="grid md:grid-cols-3"> <div className="md:col-span-1 p-6"> <AspectRatio ratio={4/3} className="bg-muted rounded-md overflow-hidden"> <Skeleton className="h-full w-full" /> </AspectRatio> </div> <div className="md:col-span-2 p-6 space-y-4"> <Skeleton className="h-8 w-3/4" /> <Skeleton className="h-20 w-full" /> <div className="grid grid-cols-2 gap-4"> <Skeleton className="h-6 w-full" /> <Skeleton className="h-6 w-full" /> <Skeleton className="h-6 w-full" /> <Skeleton className="h-6 w-full" /> </div> <div className="mt-4 pt-4 border-t space-y-2"> <Skeleton className="h-6 w-1/3 mb-2" /> <Skeleton className="h-5 w-full" /> <Skeleton className="h-5 w-full" /> <Skeleton className="h-5 w-1/2" /> </div> </div> </div> </Card>
      <Card className="shadow-lg"> <CardHeader> <Skeleton className="h-7 w-1/2 mb-1" /> <Skeleton className="h-4 w-3/4" /> </CardHeader> <CardContent> <div className="flex items-center justify-between mb-2"> <Skeleton className="h-8 w-1/4" /> <Skeleton className="h-5 w-1/3" /> </div> <Skeleton className="h-3 w-full" /> <div className="mt-3 space-y-1"> <Skeleton className="h-4 w-1/2" /> <Skeleton className="h-3 w-1/3" /> <Skeleton className="h-3 w-1/3" /> </div> </CardContent> </Card>
      <Skeleton className="h-10 w-full md:w-2/3" /> 
      <Card className="mt-4"> <CardHeader> <Skeleton className="h-7 w-1/3" /> <Skeleton className="h-5 w-2/3" /> </CardHeader> <CardContent className="space-y-3"> <Skeleton className="h-8 w-full" /> <Skeleton className="h-8 w-full" /> <Skeleton className="h-8 w-full" /> </CardContent> </Card>
    </div>
  )
}
