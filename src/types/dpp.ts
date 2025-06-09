
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
    specifications?: string; // JSON string for technical specifications
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
    metadata: { 
      created_at: "2024-01-01T10:00:00Z", 
      last_updated: "2024-07-30T10:00:00Z",
      status: "published", 
      dppStandardVersion: "CIRPASS v0.9 Draft" 
    },
    productDetails: {
      description: "An eco friendly fridge.",
      energyLabel: "A++",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "refrigerator appliance",
      materials: [{name: "Recycled Steel", percentage: 70, isRecycled: true}],
      specifications: JSON.stringify({ "Capacity (Liters)": "400", "Annual Energy Consumption (kWh)": "150", "Noise Level (dB)": "38", "Dimensions (HxWxD cm)": "180x70x65", "Color": "Stainless Steel" }, null, 2),
      customAttributes: [
        {key: "Eco Rating", value: "Gold Star (Self-Assessed)"},
        {key: "Special Feature", value: "AI Defrost Technology"},
        {key: "Warranty Period", value: "5 Years"},
        {key: "Country of Origin", value: "Germany"}
      ],
    },
    compliance: {
      eprel: { id: "EPREL_REG_12345", status: "Registered", url: "#eprel-link", lastChecked: "2024-01-18T00:00:00Z" }, 
      esprConformity: { status: "conformant", assessmentId: "ESPR_ASSESS_001", assessmentDate: "2024-01-01" },
      battery_regulation: { status: "not_applicable" },
    },
    ebsiVerification: { 
      status: "verified", 
      verificationId: "EBSI_TX_ABC123", 
      lastChecked: "2024-07-25T00:00:00Z"
    },
    blockchainIdentifiers: { platform: "MockChain", anchorTransactionHash: "0x123abc456def789ghi012jkl345mno678pqr901stu234vwx567yz890abcdef"},
    consumerScans: 1250,
    lifecycleEvents: [
      {id: "evt1", type: "Manufactured", timestamp: "2024-01-15T00:00:00Z", transactionHash: "0xabc...def", responsibleParty: "GreenTech Appliances"}
    ],
    certifications: [
      {id: "cert1", name: "Energy Star", issuer: "EPA", issueDate: "2024-01-01T11:00:00Z", documentUrl: "#", transactionHash: "0xcertAnchor1", standard: "Energy Star Program Requirements for Refrigerators v6.0"},
      {id: "cert2", name: "ISO 14001", issuer: "TUV Rheinland", issueDate: "2024-01-20T00:00:00Z", expiryDate: "2026-11-14", documentUrl: "#iso14001", vcId: "vc:iso:14001:greentech:dpp001", standard: "ISO 14001:2015"}
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
      specifications: JSON.stringify({ "Fit": "Regular", "GSM": "180", "Origin": "India", "Care": "Machine wash cold" }, null, 2),
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
      specifications: JSON.stringify({ "Capacity (kWh)": "75", "Voltage (V)": "400", "Weight (kg)": "450", "Chemistry": "NMC 811" }, null, 2),
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
  specifications?: string; // Changed to string to hold JSON string
  materialsUsed?: { name: string; percentage?: number; source?: string; isRecycled?: boolean }[];
  energyLabelRating?: string;
  repairability?: { score: number; scale: number; detailsUrl?: string };
  recyclabilityInfo?: { percentage?: number; instructionsUrl?: string };
  supplyChainLinks?: ProductSupplyChainLink[];
  complianceSummary?: ProductComplianceSummary;
  lifecycleEvents?: SimpleLifecycleEvent[];
  certifications?: SimpleCertification[];
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
  certifications?: SimpleCertification[]; 
  customAttributesJsonString?: string; // Used to store CustomAttribute[] as JSON string
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
  materials?: string; // This is a simple string in RichMockProduct, maybe it should be array of objects?
  sustainabilityClaims?: string;
  energyLabel?: string;
  specifications?: string; // JSON string for technical specifications
  lifecycleEvents?: SimpleLifecycleEvent[];
  complianceSummary?: ProductComplianceSummary;
  batteryChemistry?: string;
  stateOfHealth?: number | null;
  carbonFootprintManufacturing?: number | null;
  recycledContentPercentage?: number | null;
  ebsiVerification?: EbsiVerificationDetails;
  certifications?: Certification[]; 
  supplyChainLinks?: ProductSupplyChainLink[];
  customAttributes?: CustomAttribute[]; // For consistency with DigitalProductPassport
  blockchainIdentifiers?: DigitalProductPassport['blockchainIdentifiers'];
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
    specifications: JSON.stringify({ "Capacity (Liters)": "400", "Annual Energy Consumption (kWh)": "150", "Noise Level (dB)": "38", "Dimensions (HxWxD cm)": "180x70x65", "Color": "Stainless Steel" }, null, 2),
    customAttributes: [
        {key: "Eco Rating", value: "Gold Star (Self-Assessed)"},
        {key: "Special Feature", value: "AI Defrost Technology"},
        {key: "Warranty Period", value: "5 Years"},
        {key: "Country of Origin", value: "Germany"},
    ],
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
  }
];

export type IconName = keyof typeof import('lucide-react');

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
  isVerified?: boolean;
  link?: string;
  standard?: string;
  vcId?: string;
  transactionHash?: string;
}

export interface PublicProductInfo {
  passportId: string;
  productName: string;
  tagline: string;
  imageUrl: string;
  imageHint?: string;
  productStory: string;
  sustainabilityHighlights: Array<{ iconName?: IconName; text: string }>;
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
    tagline: "Cool, Efficient, Sustainable.",
    imageUrl: "https://placehold.co/800x600.png",
    imageHint: "refrigerator kitchen",
    productStory: "The EcoFriendly Refrigerator X2000 is designed for the modern, environmentally conscious household. It features our latest FrostFree technology, an A+++ energy rating, and is built with over 70% recycled materials. Its smart features help optimize cooling and reduce energy consumption, contributing to a greener planet one kitchen at a time. This DPP provides full transparency into its lifecycle and sustainability credentials.",
    sustainabilityHighlights: [
      { iconName: "Zap", text: "A+++ Energy Rating" },
      { iconName: "Recycle", text: "Made with 70% Recycled Steel" },
      { iconName: "Leaf", text: "Low GWP Refrigerant Used" },
      { iconName: "Award", text: "Certified for 15-year Durability" }
    ],
    manufacturerName: "GreenTech Appliances",
    manufacturerWebsite: "#",
    brandLogoUrl: "https://placehold.co/150x50.png?text=GreenTech",
    learnMoreLink: "#",
    complianceSummary: "Fully compliant with EU Ecodesign and Energy Labelling directives. EPREL registered. EBSI verification completed for key claims.",
    category: "Appliances",
    modelNumber: "X500-ECO",
    anchorTransactionHash: "0x123abc456def789ghi012jkl345mno678pqr901stu234vwx567yz890abcdef",
    blockchainPlatform: "MockChain (Ethereum L1)",
    ebsiStatus: 'verified',
    ebsiVerificationId: "EBSI-VC-XYZ-00123",
    lifecycleHighlights: [
      { stage: "Manufacturing", date: "Jan 2024", details: "Produced in our green-certified facility in Germany.", isEbsiVerified: true, iconName: "Factory" },
      { stage: "Shipped", date: "Feb 2024", details: "Transported via low-emission logistics partners to EU distribution centers.", isEbsiVerified: false, iconName: "Truck" },
      { stage: "Sold", date: "Mar 2024", details: "First retail sale recorded in Paris, France.", isEbsiVerified: false, iconName: "ShoppingCart" },
      { stage: "End-of-Life Path", date: "Est. 2039", details: "Designed for 95% recyclability. Refer to local WEEE collection.", isEbsiVerified: false, iconName: "Recycle" }
    ],
    certifications: [
      { name: "Energy Star", authority: "EPA", isVerified: true, standard: "Energy Star Program Requirements for Refrigerators v6.0", transactionHash: "0xcertAnchor1" },
      { name: "ISO 14001", authority: "TUV Rheinland", expiryDate: "2026-11-14", isVerified: true, vcId: "vc:iso:14001:greentech:dpp001", standard: "ISO 14001:2015" }
    ],
    customAttributes: [
        {key: "Eco Rating", value: "Gold Star (Self-Assessed)"},
        {key: "Special Feature", value: "AI Defrost Technology"},
        {key: "Warranty Period", value: "5 Years"},
        {key: "Country of Origin", value: "Germany"},
    ],
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
      { name: "RoHS Compliance", authority: "Self-Certified", isVerified: true },
      { name: "CE Marking", authority: "Self-Certified", isVerified: true },
      { name: "Bluetooth SIG Qualification", authority: "Bluetooth SIG", expiryDate: "2028-01-01", link:"#", isVerified: true },
    ],
    customAttributes: [
        {key: "Smart Home Compatibility", value: "Google Home, Amazon Alexa, Apple HomeKit"},
        {key: "Light Color Options", value: "RGBW (16 million colors + Tunable White)"},
    ],
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
    certifications: [], 
    customAttributes: [
        {key: "Wood Type", value: "Oak"},
        {key: "Finish", value: "Natural Oil"},
        {key: "Artisan Name", value: "John Craft"},
        {key: "Lead Time", value: "4-6 Weeks"}
    ],
  }
};

// Supplier type for managing suppliers
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
  imageUrlOrigin?: 'AI_EXTRACTED' | 'manual'; 
  materials?: string;
  sustainabilityClaims?: string;
  energyLabel?: string;
  specifications?: string; // Changed to string to hold JSON string for display & form consistency
  lifecycleEvents?: SimpleLifecycleEvent[];
  complianceSummary?: ProductComplianceSummary;
  batteryChemistry?: string;
  stateOfHealth?: number | null;
  carbonFootprintManufacturing?: number | null;
  recycledContentPercentage?: number | null;
  ebsiStatus?: 'verified' | 'pending' | 'not_verified' | 'error' | 'N/A'; 
  supplyChainLinks?: ProductSupplyChainLink[];
  certifications?: SimpleCertification[]; 
  customAttributes?: CustomAttribute[]; // For display on list if needed; form uses customAttributesJsonString
  customAttributesJsonString?: string; // Stays as string for form consistency
  blockchainIdentifiers?: DigitalProductPassport['blockchainIdentifiers']; // Add this for filtering
}

