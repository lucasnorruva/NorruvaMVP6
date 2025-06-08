
// --- File: dpp.ts ---
// Description: TypeScript type definitions for Digital Product Passports and related entities.
import type { LucideIcon } from 'lucide-react';

// Local storage keys
export const USER_PRODUCTS_LOCAL_STORAGE_KEY = 'norruvaUserProducts';
export const USER_SUPPLIERS_LOCAL_STORAGE_KEY = 'norruvaUserSuppliers';


// Interface for a single lifecycle event
export interface LifecycleEvent {
  id: string;
  type: string;
  timestamp: string;
  location?: string;
  responsibleParty?: string;
  data?: Record<string, any>;
  transactionHash?: string;
  vcId?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  vcId?: string;
  documentUrl?: string;
  standard?: string;
  transactionHash?: string;
}

export interface TraceabilityInfo {
  batchId?: string;
  originCountry?: string;
  supplyChainSteps?: Array<{
    stepName: string;
    actorDid?: string;
    timestamp: string;
    location?: string;
    transactionHash?: string;
  }>;
}

export interface VerifiableCredentialReference {
  id: string;
  type: string[];
  name?: string;
  issuer: string;
  issuanceDate: string;
  credentialSubject: Record<string, any>;
  proof?: any;
  verificationMethod?: string;
}

export interface EbsiVerificationDetails {
  status: 'verified' | 'pending_verification' | 'not_verified' | 'error';
  verificationId?: string;
  lastChecked: string;
  message?: string;
}

export interface ProductSupplyChainLink {
  supplierId: string;
  suppliedItem: string;
  notes?: string;
}

export interface CustomAttribute {
  key: string;
  value: string;
}

export interface DigitalProductPassport {
  id: string;
  version?: number;
  productName: string;
  category: string;
  gtin?: string;
  modelNumber?: string;
  manufacturer?: {
    name: string;
    did?: string;
    address?: string;
  };

  metadata: {
    created_at?: string;
    last_updated: string;
    status: 'draft' | 'published' | 'archived' | 'pending_review' | 'revoked';
    dppStandardVersion?: string;
    dataSchemaVersion?: string;
  };

  blockchainIdentifiers?: {
    platform?: string;
    contractAddress?: string;
    tokenId?: string;
    anchorTransactionHash?: string;
  };

  productDetails?: {
    description?: string;
    imageUrl?: string;
    imageHint?: string;
    materials?: Array<{ name: string; percentage?: number; origin?: string; isRecycled?: boolean; recycledContentPercentage?: number }>;
    sustainabilityClaims?: Array<{ claim: string; evidenceVcId?: string; verificationDetails?: string }>;
    energyLabel?: string;
    repairabilityScore?: { value: number; scale: number; reportUrl?: string; vcId?: string };
    recyclabilityInformation?: { instructionsUrl?: string; recycledContentPercentage?: number; designForRecycling?: boolean; vcId?: string };
    customAttributes?: CustomAttribute[];
  };

  lifecycleEvents?: LifecycleEvent[];
  certifications?: Certification[];
  traceability?: TraceabilityInfo;

  compliance: {
    eprel?: {
      id?: string;
      status: string;
      url?: string;
      lastChecked: string;
    };
    esprConformity?: {
      assessmentId?: string;
      status: 'conformant' | 'non_conformant' | 'pending_assessment';
      assessmentDate?: string;
      vcId?: string;
    };
    eu_espr?: { status: 'compliant' | 'non_compliant' | 'pending'; reportUrl?: string; vcId?: string };
    us_scope3?: { status: 'compliant' | 'non_compliant' | 'pending'; reportUrl?: string; vcId?: string };
    battery_regulation?: {
      status: 'compliant' | 'non_compliant' | 'pending' | 'not_applicable';
      batteryPassportId?: string;
      carbonFootprint?: { value: number; unit: string; calculationMethod?: string; vcId?: string };
      recycledContent?: Array<{ material: string; percentage: number; vcId?: string }>;
      stateOfHealth?: {value: number; unit: string; measurementDate: string; vcId?: string};
      vcId?: string;
    };
  };

  ebsiVerification?: EbsiVerificationDetails;
  verifiableCredentials?: VerifiableCredentialReference[];
  consumerScans?: number;
  dataController?: string;
  accessControlPolicyUrl?: string;
  privacyPolicyUrl?: string;
  supplyChainLinks?: ProductSupplyChainLink[];
}

export interface DashboardFiltersState {
  status: 'all' | 'draft' | 'published' | 'archived' | 'pending_review' | 'revoked';
  regulation: 'all' | 'eu_espr' | 'us_scope3' | 'battery_regulation';
  category: 'all' | string;
  searchQuery?: string;
  blockchainAnchored?: 'all' | 'anchored' | 'not_anchored';
}

export type SortableKeys = keyof DigitalProductPassport | 'metadata.status' | 'metadata.last_updated' | 'overallCompliance' | 'ebsiVerification.status';

export interface SortConfig {
  key: SortableKeys | null;
  direction: 'ascending' | 'descending' | null;
}


export const MOCK_DPPS: DigitalProductPassport[] = [
  {
    id: "DPP001",
    productName: "EcoSmart Refrigerator X500",
    category: "Appliances",
    manufacturer: { name: "GreenTech Appliances"},
    modelNumber: "X500-ECO",
    metadata: { last_updated: "2024-07-28T10:00:00Z", status: "published", dppStandardVersion: "CIRPASS v0.9 Draft", created_at: "2024-01-01T10:00:00Z" },
    productDetails: {
      description: "An eco friendly fridge.",
      energyLabel: "A++",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "refrigerator appliance",
      materials: [{name: "Recycled Steel", percentage: 70, isRecycled: true}],
      customAttributes: [
        {key: "Eco Rating", value: "Gold Star (Self-Assessed)"},
        {key: "Special Feature", value: "AI Defrost Technology"},
        {key: "Warranty Period", value: "5 Years"},
        {key: "Country of Origin", value: "Germany"}
      ],
    },
    compliance: {
      eprel: { id: "EPREL_REG_12345", status: "Registered", url: "#eprel-link", lastChecked: "2024-07-01T00:00:00Z" },
      esprConformity: { status: "conformant", assessmentId: "ESPR_ASSESS_001", assessmentDate: "2024-07-01" },
      battery_regulation: { status: "not_applicable" },
    },
    ebsiVerification: { status: "verified", verificationId: "EBSI_TX_ABC123", lastChecked: "2024-07-29T00:00:00Z"},
    blockchainIdentifiers: { platform: "MockChain", anchorTransactionHash: "0x123abc456def789ghi012jkl345mno678pqr901stu234vwx567yz890abcdef"},
    consumerScans: 1250,
    lifecycleEvents: [
      {id: "evt1", type: "Manufactured", timestamp: "2024-01-01T00:00:00Z", transactionHash: "0xabc...def", responsibleParty: "GreenTech Appliances"}
    ],
    certifications: [
      {id: "cert1", name: "Energy Star", issuer: "EPA", issueDate: "2024-01-01", documentUrl: "#", transactionHash: "0xcertAnchor1", standard: "Energy Star Program Requirements for Refrigerators v6.0"},
      {id: "cert2", name: "ISO 14001", issuer: "TUV Rheinland", issueDate: "2023-11-15", expiryDate: "2026-11-14", documentUrl: "#iso14001", vcId: "vc:iso:14001:greentech:dpp001", standard: "ISO 14001:2015"}
    ],
    supplyChainLinks: [
      { supplierId: "SUP001", suppliedItem: "Compressor Unit XJ-500", notes: "Primary compressor supplier for EU market. Audited for ethical sourcing." },
      { supplierId: "SUP002", suppliedItem: "Recycled Steel Panels (70%)", notes: "Certified post-consumer recycled content." }
    ]
  },
  {
    id: "DPP002",
    productName: "Sustainable Cotton T-Shirt",
    category: "Apparel",
    manufacturer: { name: "EcoThreads"},
    modelNumber: "ET-TS-ORG-M",
    metadata: { last_updated: "2024-07-25T14:30:00Z", status: "draft", created_at: "2024-03-01T10:00:00Z" },
    productDetails: {
      description: "A sustainable t-shirt made from organic cotton.",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "cotton t-shirt apparel",
      materials: [{name: "Organic Cotton", percentage: 100}],
      customAttributes: [{key: "Certifications", value: "GOTS, Fair Trade"}, {key: "Care Instructions", value: "Machine wash cold, tumble dry low"}]
    },
    compliance: {
      eprel: { status: "Not Applicable", lastChecked: "2024-07-25T00:00:00Z" },
      eu_espr: { status: "pending" },
      battery_regulation: { status: "not_applicable" },
    },
    ebsiVerification: { status: "pending_verification", lastChecked: "2024-07-20T00:00:00Z"},
    consumerScans: 300,
    blockchainIdentifiers: { platform: "MockChain" },
    certifications: [
      {id: "cert3", name: "GOTS", issuer: "Control Union", issueDate: "2024-02-20", expiryDate: "2025-02-19", documentUrl: "#gots", standard: "Global Organic Textile Standard 6.0"},
    ],
    supplyChainLinks: [
       { supplierId: "SUP003", suppliedItem: "Organic Cotton Yarn", notes: "GOTS Certified Supplier for all global production." }
    ]
  },
  {
    id: "DPP003",
    productName: "Recycled Polymer Phone Case",
    category: "Accessories",
    manufacturer: { name: "ReCase It"},
    modelNumber: "RC-POLY-IP15",
    metadata: { last_updated: "2024-07-22T09:15:00Z", status: "published", created_at: "2024-04-10T10:00:00Z" },
    compliance: {
      eprel: { status: "Not Applicable", lastChecked: "2024-07-22T00:00:00Z" },
      eu_espr: { status: "compliant" },
      us_scope3: { status: "compliant" },
      battery_regulation: { status: "not_applicable" },
    },
    consumerScans: 2100,
     productDetails: { description: "A recycled phone case."},
     blockchainIdentifiers: { platform: "OtherChain", anchorTransactionHash: "0x789polymerAnchorHash000333"},
     supplyChainLinks: [],
     ebsiVerification: { status: "not_verified", lastChecked: "2024-07-23T00:00:00Z"},
  },
  {
    id: "DPP004",
    productName: "Modular Sofa System",
    category: "Furniture",
    manufacturer: { name: "Comfy Living"},
    modelNumber: "CL-MODSOFA-01",
    metadata: { last_updated: "2024-07-20T11:00:00Z", status: "archived", created_at: "2023-12-01T10:00:00Z" },
    compliance: {
      eprel: { status: "Not Applicable", lastChecked: "2024-07-20T00:00:00Z" },
      eu_espr: { status: "compliant" },
      battery_regulation: { status: "not_applicable" },
    },
    consumerScans: 850,
    productDetails: { description: "A modular sofa."},
    supplyChainLinks: [],
    ebsiVerification: { status: "error", lastChecked: "2024-07-19T00:00:00Z", message: "Connection timeout to EBSI node."},
  },
  {
    id: "DPP005",
    productName: "High-Performance EV Battery",
    category: "Automotive Parts",
    manufacturer: { name: "PowerVolt"},
    modelNumber: "PV-EVB-75KWH",
    metadata: { last_updated: "2024-07-29T08:00:00Z", status: "pending_review", created_at: "2024-05-01T10:00:00Z" },
    productDetails: {
      description: "A high-performance EV battery module.",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "ev battery module",
      customAttributes: [
        {key: "Cycle Life", value: "3000 cycles @ 80% DoD"},
        {key: "Charging Time (0-80%)", value: "45 minutes (DC Fast Charge)"}
      ]
    },
    compliance: {
      eprel: { status: "Data Mismatch", lastChecked: "2024-07-28T00:00:00Z", id: "EPREL_OLD_ID" },
      battery_regulation: {
        status: "pending",
        carbonFootprint: { value: 120, unit: "kg CO2e/kWh" },
        recycledContent: [{ material: "Cobalt", percentage: 15 }],
        stateOfHealth: {value: 98, unit: '%', measurementDate: "2024-07-15T00:00:00Z"},
      },
      eu_espr: { status: "pending" },
    },
    ebsiVerification: { status: "pending_verification", lastChecked: "2024-07-29T00:00:00Z"},
    consumerScans: 50,
    certifications: [
      {id: "cert_bat_01", name: "UN 38.3 Transport Test", issuer: "TestCert Ltd.", issueDate: "2024-07-01", documentUrl: "#", transactionHash: "0xcertAnchorBat1", standard: "UN Manual of Tests and Criteria, Part III, subsection 38.3"}
    ],
    blockchainIdentifiers: { platform: "BatteryChain", anchorTransactionHash: "0xevBatteryAnchorHash555AAA"},
    supplyChainLinks: []
  },
];

// Type for individual compliance regulation details
export interface ComplianceDetailItem {
  regulationName: string;
  status: 'Compliant' | 'Non-Compliant' | 'Pending' | 'Not Applicable' | 'In Progress' | 'Data Incomplete' | string; // string for flexibility
  detailsUrl?: string;
  verificationId?: string;
  lastChecked: string; // ISO Date string
  notes?: string;
}

// Updated structure for compliance summary within SimpleProductDetail
export interface ProductComplianceSummary {
  overallStatus: 'Compliant' | 'Non-Compliant' | 'Pending Review' | 'N/A' | 'Data Incomplete' | string;
  eprel?: {
    id?: string;
    status: string;
    url?: string;
    lastChecked: string;
  };
  ebsi?: {
    status: 'Verified' | 'Pending' | 'Not Verified' | 'Error' | 'N/A' | string;
    verificationId?: string;
    transactionUrl?: string;
    lastChecked: string;
  };
  specificRegulations?: ComplianceDetailItem[];
}

// Interface for a simplified lifecycle event for the detail page
export interface SimpleLifecycleEvent {
  id: string;
  eventName: string;
  date: string; // ISO Date string
  location?: string;
  notes?: string;
  status: 'Completed' | 'In Progress' | 'Upcoming' | 'Delayed' | 'Cancelled';
  iconName?: keyof typeof import('lucide-react');
  keyDocuments?: { name: string; type: 'PDF' | 'Link'; url: string }[];
}

export interface SimpleCertification {
  name: string;
  authority: string;
  standard?: string;
  issueDate: string;
  expiryDate?: string;
  documentUrl?: string;
  isVerified?: boolean;
  vcId?: string;
  transactionHash?: string;
}


export interface SimpleProductDetail {
  id: string;
  productName: string;
  category: string;
  status: 'Active' | 'Draft' | 'Archived' | 'Pending';
  manufacturer?: string;
  gtin?: string;
  modelNumber?: string;
  description?: string;
  imageUrl?: string;
  imageHint?: string;
  keySustainabilityPoints?: string[];
  keyCompliancePoints?: string[];
  specifications?: Record<string, string> | string; // Allow string for JSON
  materialsUsed?: { name: string; percentage?: number; source?: string; isRecycled?: boolean }[];
  energyLabelRating?: string;
  repairability?: { score: number; scale: number; detailsUrl?: string };
  recyclabilityInfo?: { percentage?: number; instructionsUrl?: string };
  supplyChainLinks?: ProductSupplyChainLink[];
  complianceSummary?: ProductComplianceSummary;
  lifecycleEvents?: SimpleLifecycleEvent[];
  certifications?: SimpleCertification[]; // Added certifications field
  customAttributes?: CustomAttribute[];
}

// This type is used when storing user-created/edited products in localStorage.
export interface StoredUserProduct {
  id: string;
  productName?: string;
  gtin?: string;
  productDescription?: string;
  manufacturer?: string;
  modelNumber?: string;
  materials?: string;
  sustainabilityClaims?: string;
  specifications?: string; // JSON string
  energyLabel?: string;
  productCategory?: string;
  imageUrl?: string;
  imageHint?: string;
  imageUrlOrigin?: 'AI_EXTRACTED' | 'manual';
  batteryChemistry?: string;
  stateOfHealth?: number | null;
  carbonFootprintManufacturing?: number | null;
  recycledContentPercentage?: number | null;
  status: 'Active' | 'Draft' | 'Archived' | 'Pending' | string; // Allow string for flexibility
  compliance: string;
  lastUpdated: string;
  productNameOrigin?: 'AI_EXTRACTED' | 'manual';
  productDescriptionOrigin?: 'AI_EXTRACTED' | 'manual';
  manufacturerOrigin?: 'AI_EXTRACTED' | 'manual';
  modelNumberOrigin?: 'AI_EXTRACTED' | 'manual';
  materialsOrigin?: 'AI_EXTRACTED' | 'manual';
  sustainabilityClaimsOrigin?: 'AI_EXTRACTED' | 'manual';
  energyLabelOrigin?: 'AI_EXTRACTED' | 'manual';
  specificationsOrigin?: 'AI_EXTRACTED' | 'manual';
  batteryChemistryOrigin?: 'AI_EXTRACTED' | 'manual';
  stateOfHealthOrigin?: 'AI_EXTRACTED' | 'manual';
  carbonFootprintManufacturingOrigin?: 'AI_EXTRACTED' | 'manual';
  recycledContentPercentageOrigin?: 'AI_EXTRACTED' | 'manual';
  supplyChainLinks?: ProductSupplyChainLink[];
  lifecycleEvents?: SimpleLifecycleEvent[];
  complianceSummary?: ProductComplianceSummary;
  certifications?: SimpleCertification[]; // Added for stored user products
  customAttributesJsonString?: string;
}

// Initial mock product data for /products page (more detailed than SimpleProductDetail)
export interface RichMockProduct {
  id: string;
  productId: string;
  productName: string;
  category?: string;
  status: 'Active' | 'Draft' | 'Archived' | 'Pending';
  compliance: string;
  lastUpdated: string;
  gtin?: string;
  manufacturer?: string;
  modelNumber?: string;
  description?: string;
  imageUrl?: string;
  imageHint?: string;
  materials?: string;
  sustainabilityClaims?: string;
  energyLabel?: string;
  specifications?: Record<string, string> | string;
  lifecycleEvents?: SimpleLifecycleEvent[];
  complianceSummary?: ProductComplianceSummary;
  batteryChemistry?: string;
  stateOfHealth?: number | null;
  carbonFootprintManufacturing?: number | null;
  recycledContentPercentage?: number | null;
  ebsiVerification?: EbsiVerificationDetails;
  certifications?: Certification[]; // Use full Certification here if it's the source
  supplyChainLinks?: ProductSupplyChainLink[];
  customAttributesJsonString?: string;
}


export const SIMPLE_MOCK_PRODUCTS: SimpleProductDetail[] = [
  {
    id: "PROD001",
    productName: "EcoFriendly Refrigerator X2000",
    category: "Appliances",
    status: "Active",
    manufacturer: "GreenTech Appliances",
    gtin: "01234567890123",
    modelNumber: "X2000-ECO",
    description: "State-of-the-art energy efficient refrigerator, built with sustainable materials and smart energy management. Features advanced frost-free systems and optimized airflow for even temperature distribution.",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "modern refrigerator kitchen",
    keySustainabilityPoints: ["Energy Star Certified", "Made with 70% recycled steel", "95% recyclable at end-of-life", "Low Global Warming Potential (GWP) refrigerant"],
    keyCompliancePoints: ["EU Ecodesign Compliant", "EU Energy Labelling Compliant", "EPREL Registered"],
    specifications: { "Capacity": "400L", "Warranty": "5 years", "Dimensions": "180x70x65 cm", "Color": "Stainless Steel", "Noise Level": "38 dB"},
    materialsUsed: [
      { name: "Recycled Steel", percentage: 70, source: "Certified Recycler A", isRecycled: true },
      { name: "Bio-based Polymers (Insulation)", percentage: 15, source: "EcoPoly Corp" },
      { name: "Tempered Glass (Shelves)", percentage: 10, source: "GlassWorld Inc." }
    ],
    energyLabelRating: "A+++",
    repairability: { score: 8.5, scale: 10, detailsUrl: "#repair-details-PROD001" },
    recyclabilityInfo: { percentage: 95, instructionsUrl: "#recycling-PROD001" },
    supplyChainLinks: [
      { supplierId: "SUP001", suppliedItem: "Compressor Unit XJ-500", notes: "Primary compressor supplier. Audited for fair labor practices." },
      { supplierId: "SUP002", suppliedItem: "Recycled Steel Panels (70%)", notes: "Certified post-consumer recycled content." }
    ],
    complianceSummary: {
      overallStatus: "Compliant",
      eprel: { id: "EPREL12345", status: "Registered", url: "#eprel-link", lastChecked: "2024-07-01T00:00:00Z" },
      ebsi: { status: "Verified", verificationId: "EBSI-VC-XYZ-00123", transactionUrl: "#ebsi-tx-001", lastChecked: "2024-07-05T00:00:00Z" },
      specificRegulations: [
        { regulationName: "EU Ecodesign 2019/2019", status: "Compliant", verificationId: "ECOD001", lastChecked: "2024-06-15T00:00:00Z", detailsUrl: "#ecodesign-report" },
        { regulationName: "RoHS Directive 2011/65/EU", status: "Compliant", lastChecked: "2024-06-10T00:00:00Z" },
        { regulationName: "WEEE Directive 2012/19/EU", status: "Compliant", lastChecked: "2024-06-10T00:00:00Z" },
      ]
    },
    lifecycleEvents: [
      { id: "lc001", eventName: "Manufacturing Complete", date: "2024-01-15T00:00:00Z", location: "EcoFactory, Germany", status: "Completed", iconName: "Factory" },
      {
        id: "lc002",
        eventName: "Quality Assurance Passed",
        date: "2024-01-16T00:00:00Z",
        location: "EcoFactory, Germany",
        status: "Completed",
        iconName: "ShieldCheck",
        keyDocuments: [
          { name: "QA Report Q1-2024", type: "PDF", url: "#qa-report-q1-2024.pdf" },
          { name: "Compliance Checklist (Internal)", type: "Link", url: "#compliance-checklist-internal" }
        ]
      },
      { id: "lc003", eventName: "Shipped to Distributor", date: "2024-01-20T00:00:00Z", location: "Logistics Hub, Hamburg", status: "Completed", iconName: "Truck" },
      { id: "lc004", eventName: "First Retail Sale", date: "2024-02-10T00:00:00Z", location: "Paris, France", status: "Completed", iconName: "ShoppingCart" },
      { id: "lc005", eventName: "Scheduled Maintenance", date: "2025-02-15T00:00:00Z", notes: "Filter replacement due.", status: "Upcoming", iconName: "Wrench" },
    ],
    certifications: [
      { name: "Energy Star", authority: "EPA", issueDate: "2024-01-01", documentUrl: "#", isVerified: true, standard: "Energy Star Program Requirements for Refrigerators v6.0", transactionHash: "0xcertAnchor1" },
      { name: "ISO 14001", authority: "TUV Rheinland", issueDate: "2023-11-15", expiryDate: "2026-11-14", documentUrl: "#iso14001", isVerified: true, vcId: "vc:iso:14001:greentech:dpp001", standard: "ISO 14001:2015" }
    ],
    customAttributes: [
      {key: "Eco Rating", value: "Gold Star (Self-Assessed)"},
      {key: "Special Feature", value: "AI Defrost Technology"},
      {key: "Warranty Period", value: "5 Years"},
      {key: "Country of Origin", value: "Germany"}
    ]
  },
  {
    id: "PROD002",
    productName: "Smart LED Bulb (4-Pack)",
    category: "Electronics",
    status: "Active",
    manufacturer: "BrightSpark Electronics",
    gtin: "98765432109876",
    modelNumber: "BS-LED-S04B",
    description: "Tunable white and color smart LED bulbs, designed for long lifespan and connectivity with smart home systems. Uses 85% less energy than traditional incandescent bulbs.",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "led bulbs packaging",
    keySustainabilityPoints: ["Uses 85% less energy", "Recyclable packaging materials", "Mercury-free design", "Long lifespan (25,000 hours)"],
    keyCompliancePoints: ["RoHS Compliant", "CE Marked"],
    specifications: { "Lumens": "800lm per bulb", "Connectivity": "Wi-Fi, Bluetooth", "Lifespan": "25,000 hours", "Color Temperature": "2700K-6500K", "Wattage": "9W (Equivalent to 60W)"},
    materialsUsed: [
      { name: "Polycarbonate (Housing)", percentage: 60, isRecycled: false },
      { name: "Aluminum (Heat Sink)", percentage: 30, isRecycled: true },
      { name: "Electronic Components", percentage: 10 }
    ],
    energyLabelRating: "A+",
    repairability: { score: 6.0, scale: 10, detailsUrl: "#repair-details-PROD002" },
    recyclabilityInfo: { percentage: 75, instructionsUrl: "#recycling-PROD002" },
    supplyChainLinks: [
      { supplierId: "SUP004", suppliedItem: "LED Chips & Drivers", notes: "Specialized electronics supplier from Shanghai." }
    ],
    complianceSummary: {
      overallStatus: "Pending Review",
      eprel: { status: "Data Mismatch", lastChecked: "2024-07-10T00:00:00Z", id: "EPREL_EXISTING_BS-LED-S04B" },
      ebsi: { status: "Pending", lastChecked: "2024-07-15T00:00:00Z" },
      specificRegulations: [
        { regulationName: "RoHS Directive 2011/65/EU", status: "Compliant", lastChecked: "2024-07-01T00:00:00Z" },
        { regulationName: "EMC Directive 2014/30/EU", status: "Pending", lastChecked: "2024-07-01T00:00:00Z", notes: "Awaiting test report" },
        { regulationName: "EU Battery Regulation (if applicable)", status: "Data Incomplete", lastChecked: "2024-07-20T00:00:00Z", notes: "Internal battery component data needed."},
      ]
    },
    lifecycleEvents: [
      { id: "lc006", eventName: "Production Started", date: "2024-03-01T00:00:00Z", location: "Shenzhen, China", status: "In Progress", iconName: "Cog" },
      { id: "lc007", eventName: "Firmware Update v1.2 Deployment", date: "2024-08-01T00:00:00Z", notes: "Improved energy efficiency algorithm and security patches.", status: "Upcoming", iconName: "UploadCloud" },
      { id: "lc008", eventName: "Batch Testing", date: "2024-03-10T00:00:00Z", status: "Completed", iconName: "ClipboardCheck"},
    ],
    certifications: [
      { name: "RoHS Compliance", authority: "Self-Certified", issueDate: "2024-03-01", isVerified: true, standard: "Directive 2011/65/EU" },
      { name: "CE Marking", authority: "Self-Certified", issueDate: "2024-03-01", isVerified: true },
      { name: "Bluetooth SIG Qualification", authority: "Bluetooth SIG", issueDate: "2024-03-05", expiryDate: "2028-01-01", documentUrl:"#", isVerified: true, standard: "Bluetooth Core Spec v5.2" },
    ],
    customAttributes: [
        {key: "Smart Home Compatibility", value: "Google Home, Amazon Alexa, Apple HomeKit"},
        {key: "Light Color Options", value: "RGBW (16 million colors + Tunable White)"}
    ]
  },
  {
    id: "USER_PROD123456", // Example User-Added Product
    productName: "Custom Craft Wooden Chair",
    category: "Furniture",
    status: "Draft",
    manufacturer: "Artisan Woodworks",
    gtin: "11223344556677",
    modelNumber: "CWC-001",
    description: "A handcrafted wooden chair made from sustainably sourced oak. Each chair is unique and built to last.",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "wooden chair artisan",
    keySustainabilityPoints: ["Sustainably Sourced Oak", "Handcrafted Locally", "Durable Design", "Low VOC Finish"],
    keyCompliancePoints: ["TSCA Title VI Compliant (Formaldehyde)"],
    specifications: { "Material": "Solid Oak", "Finish": "Natural Oil", "Weight Capacity": "120kg", "Dimensions": "45cm x 50cm x 90cm" },
    materialsUsed: [
        { name: "FSC Certified Oak Wood", percentage: 95, source: "Sustainable Forests Co-op" },
        { name: "Natural Oil Finish", percentage: 5, source: "EcoFinishes Ltd." }
    ],
    energyLabelRating: "N/A",
    repairability: { score: 7.5, scale: 10 },
    recyclabilityInfo: { percentage: 80, instructionsUrl: "#recycling-USER_PROD123456"},
    supplyChainLinks: [],
    complianceSummary: {
      overallStatus: "N/A",
      eprel: { status: "Product Not Found in EPREL", lastChecked: "2024-07-20T00:00:00Z" },
      ebsi: { status: "N/A", lastChecked: "2024-07-20T00:00:00Z" },
      specificRegulations: [
        { regulationName: "TSCA Title VI", status: "Pending", lastChecked: "2024-07-18T00:00:00Z", notes: "Awaiting supplier declaration for finish."}
      ]
    },
    lifecycleEvents: [
        { id: "lc_user_001", eventName: "Design Finalized", date: "2024-06-01T00:00:00Z", status: "Completed", iconName: "PenTool"},
        { id: "lc_user_002", eventName: "Material Sourcing", date: "2024-06-05T00:00:00Z", status: "In Progress", iconName: "Search"},
        { id: "lc_user_003", eventName: "Assembly Scheduled", date: "2024-08-15T00:00:00Z", status: "Upcoming", iconName: "CalendarCheck"},
    ],
    certifications: [], // User products might start with no certs
    customAttributes: [
        {key: "Wood Type", value: "Oak"},
        {key: "Finish", value: "Natural Oil"}
    ]
  }
];

export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  location?: string;
  materialsSupplied: string;
  status: 'Active' | 'Inactive' | 'Pending Review';
  lastUpdated: string;
}


export const MOCK_SUPPLIERS: Supplier[] = [
  { id: "SUP001", name: "GreenCompress Ltd.", contactPerson: "Sarah Miller", email: "sarah.miller@greencompress.com", location: "Stuttgart, Germany", materialsSupplied: "Eco-friendly compressors, Cooling units", status: "Active", lastUpdated: "2024-07-15T10:00:00Z" },
  { id: "SUP002", name: "RecycleSteel Corp.", contactPerson: "John Davis", email: "jdavis@recyclesteel.com", location: "Rotterdam, Netherlands", materialsSupplied: "Recycled steel panels, Stainless steel components", status: "Active", lastUpdated: "2024-06-20T14:30:00Z" },
  { id: "SUP003", name: "Organic Textiles Co.", contactPerson: "Aisha Khan", email: "akhan@organictextiles.com", location: "Coimbatore, India", materialsSupplied: "GOTS certified organic cotton yarn, Natural dyes", status: "Active", lastUpdated: "2024-07-01T09:00:00Z" },
  { id: "SUP004", name: "PolySolutions Inc.", contactPerson: "Mike Chen", email: "chen.m@polysolutions.com", location: "Shanghai, China", materialsSupplied: "Recycled PET pellets, Bio-polymers, LED Chips & Drivers", status: "Pending Review", lastUpdated: "2024-05-10T11:00:00Z" },
];

// Unified type for products displayed in the product list page
export interface DisplayableProduct {
  id: string;
  productId?: string;
  productName?: string;
  category?: string;
  productCategory?: string;
  status: 'Active' | 'Draft' | 'Archived' | 'Pending' | string;
  compliance: string;
  lastUpdated: string;
  gtin?: string;
  manufacturer?: string;
  modelNumber?: string;
  description?: string;
  productDescription?: string;
  imageUrl?: string;
  imageHint?: string;
  imageUrlOrigin?: 'AI_EXTRACTED' | 'manual'; // Added for image
  materials?: string;
  sustainabilityClaims?: string;
  energyLabel?: string;
  specifications?: Record<string, string> | string;
  lifecycleEvents?: SimpleLifecycleEvent[];
  complianceSummary?: ProductComplianceSummary;
  batteryChemistry?: string;
  stateOfHealth?: number | null;
  carbonFootprintManufacturing?: number | null;
  recycledContentPercentage?: number | null;
  ebsiStatus?: 'verified' | 'pending' | 'not_verified' | 'error' | 'N/A'; // For DisplayableProduct on list view
  supplyChainLinks?: ProductSupplyChainLink[];
  certifications?: SimpleCertification[]; // Added to DisplayableProduct
  customAttributesJsonString?: string;
}

// --- Types for Public Passport Page ---
export type IconName = keyof typeof import('lucide-react');

export interface SustainabilityHighlight {
  iconName: IconName;
  text: string;
}

export interface LifecycleHighlight {
  stage: string;
  date: string;
  details?: string;
  isEbsiVerified?: boolean;
  iconName?: IconName;
}

export interface PublicCertification {
  name: string;
  authority: string;
  expiryDate?: string;
  link?: string;
  isVerified?: boolean;
}

export interface PublicProductInfo {
  passportId: string;
  productName: string;
  tagline: string;
  imageUrl: string;
  imageHint: string;
  productStory: string;
  sustainabilityHighlights: SustainabilityHighlight[];
  manufacturerName: string;
  manufacturerWebsite?: string;
  brandLogoUrl?: string;
  learnMoreLink?: string;
  complianceSummary: string;
  category: string;
  modelNumber: string;
  anchorTransactionHash?: string;
  blockchainPlatform?: string;
  ebsiStatus?: 'verified' | 'pending' | 'not_verified' | 'error';
  ebsiVerificationId?: string;
  lifecycleHighlights?: LifecycleHighlight[];
  certifications?: PublicCertification[];
  customAttributes?: CustomAttribute[];
}

export const MOCK_PUBLIC_PASSPORTS: Record<string, PublicProductInfo> = {
  "PROD001": {
    passportId: "PROD001",
    productName: "EcoFriendly Refrigerator X2000",
    tagline: "Sustainable Cooling, Smart Living.",
    imageUrl: "https://placehold.co/800x600.png",
    imageHint: "modern refrigerator kitchen",
    productStory: "Experience the future of refrigeration with the EcoFriendly Refrigerator X2000. Designed with both the planet and your lifestyle in mind, this appliance combines cutting-edge cooling technology with sustainable materials. Its spacious interior, smart energy management, and sleek design make it a perfect addition to any modern, eco-conscious home. We believe in transparency, and this Digital Product Passport gives you insight into its journey and impact. Built to last and designed for efficiency, the X2000 helps you reduce your environmental footprint without compromising on performance or style. More details include advanced frost-free systems, optimized airflow for even temperature distribution, and compartments designed for specific food types to prolong freshness.",
    sustainabilityHighlights: [
      { iconName: "Zap", text: "Energy Star Certified A+++" },
      { iconName: "Recycle", text: "Made with 70% recycled steel" },
      { iconName: "Recycle", text: "95% recyclable at end-of-life" },
      { iconName: "Zap", text: "Smart energy consumption features" }
    ],
    manufacturerName: "GreenTech Appliances",
    manufacturerWebsite: "#",
    brandLogoUrl: "https://placehold.co/150x50.png?text=GreenTech",
    learnMoreLink: "#",
    complianceSummary: "Fully compliant with EU Ecodesign and Energy Labelling regulations. EBSI verified.",
    category: "Home Appliances",
    modelNumber: "X2000-ECO",
    anchorTransactionHash: "0x123abc456def789ghi012jkl345mno678pqr901stu234vwx567yz890abcdef",
    blockchainPlatform: "MockChain (Ethereum Compatible)",
    ebsiStatus: 'verified',
    ebsiVerificationId: "EBSI-VC-ATTR-XYZ-00123",
    lifecycleHighlights: [
      { stage: "Manufactured", date: "2024-01-15", details: "Initial production run batch #PB789 completed at EcoFactory, Germany.", isEbsiVerified: true, iconName: "Factory" },
      { stage: "Quality Assurance", date: "2024-01-16", details: "All quality control checks passed. Product meets ISO 9001 standards.", isEbsiVerified: true, iconName: "ShieldCheck" },
      { stage: "Shipped to Distributor", date: "2024-01-20", details: "Outbound shipment via GreenLogistics. Container #C0N741N3R.", isEbsiVerified: true, iconName: "Truck" },
      { stage: "Sold to Consumer", date: "2024-02-10", details: "First retail sale recorded. Warranty activated for customer.", isEbsiVerified: false, iconName: "ShoppingCart" },
      { stage: "Scheduled Maintenance", date: "2025-02-15", details: "Preventative maintenance, including filter replacement, due. Customer notified.", isEbsiVerified: false, iconName: "Wrench" },
    ],
    certifications: [
      { name: "EU Energy Label A+++", authority: "European Commission", expiryDate: "N/A", link: "#", isVerified: true },
      { name: "CE Marking", authority: "Self-Certified (Manufacturer)", expiryDate: "N/A", isVerified: true },
      { name: "ISO 9001:2015", authority: "TUV SUD", expiryDate: "2026-05-20", link: "#", isVerified: false },
      { name: "Green Product Award 2024", authority: "EcoChoice Org", expiryDate: "N/A", link: "#", isVerified: true },
    ],
    customAttributes: [
      {key: "Eco Rating", value: "Gold Star (Self-Assessed)"},
      {key: "Special Feature", value: "AI Defrost Technology"},
      {key: "Warranty Period", value: "5 Years"},
      {key: "Country of Origin", value: "Germany"}
    ]
  },
  "PROD002": {
    passportId: "PROD002",
    productName: "Smart LED Bulb (4-Pack)",
    tagline: "Illuminate Your World, Sustainably.",
    imageUrl: "https://placehold.co/800x600.png",
    imageHint: "led bulbs packaging",
    productStory: "Brighten your home responsibly with our Smart LED Bulb pack. These energy-efficient bulbs offer customizable lighting and connect to smart home systems. Designed for a long lifespan, reducing waste.",
    sustainabilityHighlights: [
      { iconName: "Zap", text: "Uses 85% less energy than incandescent bulbs" },
      { iconName: "Recycle", text: "Recyclable packaging materials" },
      { iconName: "Leaf", text: "Mercury-free design" },
    ],
    manufacturerName: "BrightSpark Electronics",
    manufacturerWebsite: "#",
    brandLogoUrl: "https://placehold.co/150x50.png?text=BrightSpark",
    learnMoreLink: "#",
    complianceSummary: "Complies with EU energy efficiency and hazardous substance directives. EBSI verification pending.",
    category: "Electronics",
    modelNumber: "BS-LED-S04",
    anchorTransactionHash: "0xdef456ghi789jkl012mno345pqr678stu901vwx234yz567abcdef012345",
    blockchainPlatform: "MockChain (Polygon Layer 2)",
    ebsiStatus: 'pending',
    lifecycleHighlights: [
      { stage: "Manufactured", date: "2024-03-01", details: "Batch #LEDB456 produced in Shenzhen SmartPlant facility.", isEbsiVerified: true, iconName: "Factory" },
      { stage: "Imported to EU", date: "2024-03-15", details: "Cleared customs at Rotterdam Port, Netherlands. Ready for EU distribution.", isEbsiVerified: false, iconName: "Anchor" },
      { stage: "Firmware Update v1.2", date: "2024-08-01", details: "Over-the-air firmware update v1.2 deployed, improving energy efficiency algorithm and security patches.", isEbsiVerified: true, iconName: "UploadCloud" },
      { stage: "Product Registration", date: "2024-03-20", details: "Registered in EPREL database (ID: EPREL_PENDING_002), awaiting final data submission.", isEbsiVerified: false, iconName: "ClipboardCheck" },
    ],
    certifications: [
      { name: "RoHS Compliance", authority: "Self-Certified", expiryDate: "N/A", isVerified: true },
      { name: "CE Marking", authority: "Self-Certified", expiryDate: "N/A", isVerified: true },
      { name: "Bluetooth SIG Qualification", authority: "Bluetooth SIG", expiryDate: "2028-01-01", link:"#", isVerified: true },
    ],
    customAttributes: [
        {key: "Smart Home Compatibility", value: "Google Home, Amazon Alexa, Apple HomeKit"},
        {key: "Light Color Options", value: "RGBW (16 million colors + Tunable White)"}
    ]
  },
  "USER_PROD123456": {
    passportId: "USER_PROD123456",
    productName: "Custom Craft Wooden Chair",
    tagline: "Artisan Quality, Sustainable Design.",
    imageUrl: "https://placehold.co/800x600.png",
    imageHint: "wooden chair artisan",
    productStory: "This chair is handcrafted by local artisans using sustainably sourced oak. Its timeless design and durable construction ensure it will be a cherished piece for generations. The natural oil finish is eco-friendly and enhances the wood's natural beauty.",
    sustainabilityHighlights: [
      { iconName: "Leaf", text: "Sustainably Sourced Oak (FSC Certified)" },
      { iconName: "Users", text: "Handcrafted Locally" },
      { iconName: "ShieldCheck", text: "Durable Design for Longevity" },
      { iconName: "Paintbrush", text: "Low VOC Natural Oil Finish" }
    ],
    manufacturerName: "Artisan Woodworks",
    complianceSummary: "TSCA Title VI Compliant (Formaldehyde). Currently undergoing additional certifications.",
    category: "Furniture",
    modelNumber: "CWC-001",
    ebsiStatus: 'not_verified',
    certifications: [], // User-added products might start with fewer certs
    customAttributes: [
        {key: "Wood Type", value: "Oak"},
        {key: "Finish", value: "Natural Oil"},
        {key: "Artisan Name", value: "John Craft"},
        {key: "Lead Time", value: "4-6 Weeks"}
    ]
  }
};

```
  </change>
  <change>
    <file>/src/app/(app)/products/[productId]/page.tsx</file>
    <content><![CDATA[
// --- File: page.tsx (Product Detail Page) ---
// Description: Main page component for displaying individual product details.
"use client";

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import ProductContainer from '@/components/products/detail/ProductContainer';
import { USER_PRODUCTS_LOCAL_STORAGE_KEY, MOCK_DPPS } from '@/types/dpp';
import type { SimpleProductDetail, ProductSupplyChainLink, StoredUserProduct, DigitalProductPassport, ComplianceDetailItem, EbsiVerificationDetails, CustomAttribute, SimpleCertification } from '@/types/dpp';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { syncEprelData } from '@/ai/flows/sync-eprel-data-flow';
import { getOverallComplianceDetails } from '@/utils/dppDisplayUtils';


// Helper function to map DigitalProductPassport to SimpleProductDetail
function mapDppToSimpleProductDetail(dpp: DigitalProductPassport): SimpleProductDetail {
    const mapStatus = (status: DigitalProductPassport['metadata']['status']): SimpleProductDetail['status'] => {
        switch (status) {
            case 'published': return 'Active';
            case 'archived': return 'Archived';
            case 'pending_review': return 'Pending';
            case 'draft': return 'Draft';
            case 'revoked': return 'Archived'; // Treat revoked as archived for simple display
            default: return 'Draft'; // Default for any unhandled statuses
        }
    };

    const specificRegulations: ComplianceDetailItem[] = [];
    if (dpp.compliance.eu_espr) {
        specificRegulations.push({
            regulationName: "EU ESPR",
            status: dpp.compliance.eu_espr.status as ComplianceDetailItem['status'],
            detailsUrl: dpp.compliance.eu_espr.reportUrl,
            verificationId: dpp.compliance.eu_espr.vcId,
            lastChecked: dpp.metadata.last_updated,
        });
    }
    if (dpp.compliance.esprConformity) {
         specificRegulations.push({
            regulationName: "ESPR Conformity Assessment",
            status: dpp.compliance.esprConformity.status as ComplianceDetailItem['status'],
            verificationId: dpp.compliance.esprConformity.assessmentId || dpp.compliance.esprConformity.vcId,
            lastChecked: dpp.compliance.esprConformity.assessmentDate || dpp.metadata.last_updated,
        });
    }
    if (dpp.compliance.us_scope3) {
        specificRegulations.push({
            regulationName: "US Scope 3 Emissions",
            status: dpp.compliance.us_scope3.status as ComplianceDetailItem['status'],
            detailsUrl: dpp.compliance.us_scope3.reportUrl,
            verificationId: dpp.compliance.us_scope3.vcId,
            lastChecked: dpp.metadata.last_updated,
        });
    }
    if (dpp.compliance.battery_regulation) {
        specificRegulations.push({
            regulationName: "EU Battery Regulation",
            status: dpp.compliance.battery_regulation.status as ComplianceDetailItem['status'],
            verificationId: dpp.compliance.battery_regulation.batteryPassportId || dpp.compliance.battery_regulation.vcId,
            lastChecked: dpp.metadata.last_updated,
            notes: `CF: ${dpp.compliance.battery_regulation.carbonFootprint?.value || 'N/A'} ${dpp.compliance.battery_regulation.carbonFootprint?.unit || ''}`
        });
    }

    const complianceOverallStatusDetails = getOverallComplianceDetails(dpp);

    const keyCompliancePointsPopulated: string[] = [];
     if (complianceOverallStatusDetails.text && complianceOverallStatusDetails.text.toLowerCase() !== 'n/a' && complianceOverallStatusDetails.text.toLowerCase() !== 'no data') {
        keyCompliancePointsPopulated.push(`Overall Status: ${complianceOverallStatusDetails.text}`);
    }

    if (dpp.ebsiVerification?.status && dpp.ebsiVerification.status.toLowerCase() !== 'n/a') {
        const ebsiStatusText = dpp.ebsiVerification.status.replace(/_/g, ' ');
        const capitalizedEbsiStatus = ebsiStatusText.charAt(0).toUpperCase() + ebsiStatusText.slice(1);
        keyCompliancePointsPopulated.push(`EBSI Status: ${capitalizedEbsiStatus}`);
    }

    let specificRegCount = 0;
    specificRegulations.forEach(reg => {
        if (specificRegCount < 2 && reg.status && reg.status.toLowerCase() !== 'n/a' && reg.status.toLowerCase() !== 'not applicable') {
            const regStatusText = reg.status.replace(/_/g, ' ');
            const capitalizedRegStatus = regStatusText.charAt(0).toUpperCase() + regStatusText.slice(1);
            keyCompliancePointsPopulated.push(`${reg.regulationName}: ${capitalizedRegStatus}`);
            specificRegCount++;
        }
    });

    if (keyCompliancePointsPopulated.length === 0 && specificRegulations.length > 0) {
        keyCompliancePointsPopulated.push("Review Compliance tab for regulation details.");
    }
    
    const customAttributes = dpp.productDetails?.customAttributes || [];

    const mappedCertifications: SimpleCertification[] = dpp.certifications?.map(cert => ({
        name: cert.name,
        authority: cert.issuer,
        standard: cert.standard,
        issueDate: cert.issueDate,
        expiryDate: cert.expiryDate,
        documentUrl: cert.documentUrl,
        isVerified: !!(cert.vcId || cert.transactionHash),
        vcId: cert.vcId,
        transactionHash: cert.transactionHash,
    })) || [];


    return {
        id: dpp.id,
        productName: dpp.productName,
        category: dpp.category,
        status: mapStatus(dpp.metadata.status),
        manufacturer: dpp.manufacturer?.name,
        gtin: dpp.gtin,
        modelNumber: dpp.modelNumber,
        description: dpp.productDetails?.description,
        imageUrl: dpp.productDetails?.imageUrl,
        imageHint: dpp.productDetails?.imageHint,
        keySustainabilityPoints: dpp.productDetails?.sustainabilityClaims?.map(c => c.claim).filter(Boolean) || [],
        keyCompliancePoints: keyCompliancePointsPopulated,
        specifications: dpp.productDetails?.materials ? 
            Object.fromEntries(dpp.productDetails.materials.map((m, i) => [`material_${i+1}`, `${m.name} (${m.percentage || 'N/A'}%)`]))
            : undefined,
        complianceSummary: {
            overallStatus: complianceOverallStatusDetails.text,
            eprel: dpp.compliance.eprel ? {
                id: dpp.compliance.eprel.id,
                status: dpp.compliance.eprel.status,
                url: dpp.compliance.eprel.url,
                lastChecked: dpp.compliance.eprel.lastChecked,
            } : { status: 'N/A', lastChecked: new Date().toISOString() },
            ebsi: dpp.ebsiVerification ? {
                status: dpp.ebsiVerification.status,
                verificationId: dpp.ebsiVerification.verificationId,
                lastChecked: dpp.ebsiVerification.lastChecked,
            } : { status: 'N/A', lastChecked: new Date().toISOString() },
            specificRegulations: specificRegulations,
        },
        lifecycleEvents: dpp.lifecycleEvents?.map(event => ({
            id: event.id,
            eventName: event.type,
            date: event.timestamp,
            location: event.location,
            notes: event.data ? `Data: ${JSON.stringify(event.data)}` : (event.responsibleParty ? `Responsible: ${event.responsibleParty}` : undefined),
            status: event.transactionHash ? 'Completed' : (event.type.toLowerCase().includes('schedul') || event.type.toLowerCase().includes('upcoming') ? 'Upcoming' : 'In Progress'),
            iconName: event.type.toLowerCase().includes('manufactur') ? 'Factory' :
                      event.type.toLowerCase().includes('ship') ? 'Truck' :
                      event.type.toLowerCase().includes('quality') || event.type.toLowerCase().includes('certif') ? 'ShieldCheck' :
                      event.type.toLowerCase().includes('sale') || event.type.toLowerCase().includes('sold') ? 'ShoppingCart' :
                      'Info',
        })) || [],
        materialsUsed: dpp.productDetails?.materials?.map(m => ({ name: m.name, percentage: m.percentage, source: m.origin, isRecycled: m.isRecycled })),
        energyLabelRating: dpp.productDetails?.energyLabel,
        repairability: dpp.productDetails?.repairabilityScore ? { score: dpp.productDetails.repairabilityScore.value, scale: dpp.productDetails.repairabilityScore.scale, detailsUrl: dpp.productDetails.repairabilityScore.reportUrl } : undefined,
        recyclabilityInfo: dpp.productDetails?.recyclabilityInformation ? { percentage: dpp.productDetails.recyclabilityInformation.recycledContentPercentage, instructionsUrl: dpp.productDetails.recyclabilityInformation.instructionsUrl } : undefined,
        supplyChainLinks: dpp.supplyChainLinks || [],
        certifications: mappedCertifications,
        customAttributes: customAttributes,
    };
}


export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.productId as string;
  const [product, setProduct] = useState<SimpleProductDetail | null | undefined>(undefined);
  const [isSyncingEprel, setIsSyncingEprel] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (productId) {
      let foundDpp: DigitalProductPassport | undefined;

      if (productId.startsWith("USER_PROD")) {
        const storedProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
        if (storedProductsString) {
          const userProducts: StoredUserProduct[] = JSON.parse(storedProductsString);
          const userProductData = userProducts.find(p => p.id === productId);
          if (userProductData) {
             let parsedCustomAttributes: CustomAttribute[] = [];
              if (userProductData.customAttributesJsonString) {
                  try {
                      const parsed = JSON.parse(userProductData.customAttributesJsonString);
                      if (Array.isArray(parsed)) parsedCustomAttributes = parsed;
                  } catch (e) {
                      console.error("Failed to parse customAttributesJsonString from localStorage for USER_PROD:", e);
                  }
              }
             const certificationsForUserProd: Certification[] = userProductData.certifications?.map(sc => ({
                id: `cert_user_${sc.name.replace(/\s+/g, '_')}`, // mock an ID
                name: sc.name,
                issuer: sc.authority,
                issueDate: sc.issueDate,
                expiryDate: sc.expiryDate,
                documentUrl: sc.documentUrl,
                standard: sc.standard,
                vcId: sc.vcId,
                transactionHash: sc.transactionHash,
              })) || [];


            // Construct a DigitalProductPassport-like object from StoredUserProduct
            foundDpp = {
              id: userProductData.id,
              productName: userProductData.productName || "N/A",
              category: userProductData.productCategory || "N/A",
              manufacturer: { name: userProductData.manufacturer || "N/A" },
              modelNumber: userProductData.modelNumber,
              gtin: userProductData.gtin,
              metadata: {
                status: (userProductData.status?.toLowerCase() as DigitalProductPassport['metadata']['status']) || 'draft',
                last_updated: userProductData.lastUpdated || new Date().toISOString(),
                created_at: userProductData.lastUpdated || new Date().toISOString(), // Assuming created_at is same as lastUpdated for stored
              },
              productDetails: {
                description: userProductData.productDescription,
                imageUrl: userProductData.imageUrl,
                imageHint: userProductData.imageHint,
                sustainabilityClaims: userProductData.sustainabilityClaims?.split('\n').map(s => ({ claim: s.trim() })).filter(c => c.claim) || [],
                materials: userProductData.materials?.split(',').map(m => ({ name: m.trim() })) || [], // Simplified mapping
                energyLabel: userProductData.energyLabel,
                customAttributes: parsedCustomAttributes,
              },
              compliance: { // Basic compliance from StoredUserProduct
                eprel: userProductData.complianceSummary?.eprel,
              },
              ebsiVerification: userProductData.complianceSummary?.ebsi ? {
                status: userProductData.complianceSummary.ebsi.status as EbsiVerificationDetails['status'],
                verificationId: userProductData.complianceSummary.ebsi.verificationId,
                lastChecked: userProductData.complianceSummary.ebsi.lastChecked,
              } : undefined,
              lifecycleEvents: userProductData.lifecycleEvents?.map(e => ({
                  id: e.id,
                  type: e.eventName,
                  timestamp: e.date,
                  location: e.location,
                  data: e.notes ? { notes: e.notes } : undefined,
              })),
              certifications: certificationsForUserProd,
              supplyChainLinks: userProductData.supplyChainLinks || [],
            } as DigitalProductPassport; // Cast as it's a partial reconstruction
          }
        }
      } else {
        foundDpp = MOCK_DPPS.find(dpp => dpp.id === productId);
      }

      setTimeout(() => { // Simulate loading delay
        if (foundDpp) {
          setProduct(mapDppToSimpleProductDetail(foundDpp));
        } else {
          setProduct(null); // Product not found
        }
      }, 300);
    }
  }, [productId]);

  const handleSupplyChainUpdate = (updatedLinks: ProductSupplyChainLink[]) => {
    if (!product) return;

    const updatedProductData = { ...product, supplyChainLinks: updatedLinks };
    setProduct(updatedProductData);

    if (product.id.startsWith("USER_PROD")) {
      try {
        const storedProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
        let userProducts: StoredUserProduct[] = storedProductsString ? JSON.parse(storedProductsString) : [];
        const productIndex = userProducts.findIndex(p => p.id === product.id);
        if (productIndex > -1) {
          userProducts[productIndex] = {
            ...userProducts[productIndex],
            supplyChainLinks: updatedLinks,
            lastUpdated: new Date().toISOString(),
          };
          localStorage.setItem(USER_PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(userProducts));
          toast({
            title: "Supply Chain Updated",
            description: `Supplier links for ${product.productName} saved to local storage.`,
            variant: "default",
          });
        } else {
           toast({ title: "Error Updating Storage", description: "Could not find product in local storage to update supply chain.", variant: "destructive" });
        }
      } catch (error) {
        toast({ title: "Storage Error", description: "Failed to save supply chain updates to local storage.", variant: "destructive" });
        console.error("Error saving supply chain to localStorage:", error);
      }
    } else {
        // For mock products, update in-memory MOCK_DPPS if needed for session persistence beyond this component
        const mockDppIndex = MOCK_DPPS.findIndex(dpp => dpp.id === product.id);
        if (mockDppIndex > -1) {
            MOCK_DPPS[mockDppIndex].supplyChainLinks = updatedLinks;
            MOCK_DPPS[mockDppIndex].metadata.last_updated = new Date().toISOString();
        }
        toast({ title: "Supply Chain Updated (Session Only)", description: "Supply chain links updated for this session (mock product).", variant: "default" });
    }
  };

  const handleSyncEprel = async () => {
    if (!product || !product.modelNumber) {
      toast({ title: "Missing Information", description: "Product model number is required to sync with EPREL.", variant: "destructive" });
      return;
    }
    setIsSyncingEprel(true);
    try {
      const result = await syncEprelData({
        productId: product.id,
        productName: product.productName,
        modelNumber: product.modelNumber,
      });

      const currentComplianceSummary = product.complianceSummary || { overallStatus: "N/A" as SimpleProductDetail['complianceSummary']['overallStatus'] };
      
      let eprelIdToSet: string | undefined = currentComplianceSummary.eprel?.id;
      if (result.syncStatus.toLowerCase().includes('successfully') || result.syncStatus.toLowerCase().includes('mismatch')) {
        eprelIdToSet = result.eprelId; 
      } else if (result.syncStatus.toLowerCase().includes('not found') || result.syncStatus.toLowerCase().includes('error')) {
        eprelIdToSet = undefined; 
      }

      const newEprelData = {
        id: eprelIdToSet,
        status: result.syncStatus,
        lastChecked: result.lastChecked,
        url: currentComplianceSummary.eprel?.url, // Preserve existing URL
      };
      
      const updatedProductData: SimpleProductDetail = {
        ...product,
        complianceSummary: {
          ...currentComplianceSummary,
          eprel: newEprelData,
        },
      };
      setProduct(updatedProductData);

      // Update localStorage for USER_PROD or MOCK_DPPS for session
      if (product.id.startsWith("USER_PROD")) {
        const storedProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
        let userProducts: StoredUserProduct[] = storedProductsString ? JSON.parse(storedProductsString) : [];
        const productIndex = userProducts.findIndex(p => p.id === product.id);
        if (productIndex > -1) {
          if (!userProducts[productIndex].complianceSummary) { 
            userProducts[productIndex].complianceSummary = { overallStatus: "N/A" };
          }
          userProducts[productIndex].complianceSummary!.eprel = newEprelData;
          userProducts[productIndex].lastUpdated = result.lastChecked;
          localStorage.setItem(USER_PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(userProducts));
        }
      } else {
         const mockDppIndex = MOCK_DPPS.findIndex(dpp => dpp.id === product.id);
         if (mockDppIndex > -1 && MOCK_DPPS[mockDppIndex].compliance) {
            MOCK_DPPS[mockDppIndex].compliance.eprel = newEprelData;
            MOCK_DPPS[mockDppIndex].metadata.last_updated = result.lastChecked;
         }
      }
      toast({ title: "EPREL Sync", description: result.message, variant: result.syncStatus.toLowerCase().includes('error') || result.syncStatus.toLowerCase().includes('mismatch') ? "destructive" : "default" });

    } catch (error) {
      toast({ title: "EPREL Sync Error", description: `An unexpected error occurred during EPREL sync. ${error instanceof Error ? error.message : ''}`, variant: "destructive" });
      console.error("EPREL Sync Error:", error);
    } finally {
      setIsSyncingEprel(false);
    }
  };

  const canSyncEprel = !!product?.modelNumber;

  if (product === undefined) { // Loading state
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-xl font-medium text-muted-foreground">Loading product details...</p>
        <p className="text-sm text-muted-foreground/80 mt-1">Please wait a moment.</p>
      </div>
    );
  }

  if (!product) { // Product not found after loading
    notFound();
  }

  return (
    <ProductContainer
      product={product}
      onSupplyChainUpdate={handleSupplyChainUpdate}
      onSyncEprel={handleSyncEprel}
      isSyncingEprel={isSyncingEprel}
      canSyncEprel={canSyncEprel}
    />
  );
}

