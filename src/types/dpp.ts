// --- File: dpp.ts ---
// Description: TypeScript type definitions for Digital Product Passports and related entities.

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
  suppliedItem: string; // e.g., "Battery Cells", "Recycled Aluminum Casing"
  notes?: string;
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
  };

  lifecycleEvents?: LifecycleEvent[];
  certifications?: Certification[];
  traceability?: TraceabilityInfo;

  compliance: {
    eprelId?: string;
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
      stateOfHealth?: {value: number; unit: '%'; measurementDate: string; vcId?: string};
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
    metadata: { last_updated: "2024-07-28T10:00:00Z", status: "published", dppStandardVersion: "CIRPASS v0.9 Draft" },
    productDetails: {
      description: "An eco friendly fridge.",
      energyLabel: "A++",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "refrigerator appliance",
      materials: [{name: "Recycled Steel", percentage: 70, isRecycled: true}]
    },
    compliance: {
      eprelId: "EPREL_REG_12345",
      esprConformity: { status: "conformant", assessmentId: "ESPR_ASSESS_001", assessmentDate: "2024-07-01" },
      battery_regulation: { status: "not_applicable" },
    },
    ebsiVerification: { status: "verified", verificationId: "EBSI_TX_ABC123", lastChecked: "2024-07-29T00:00:00Z"},
    blockchainIdentifiers: { platform: "MockChain", anchorTransactionHash: "0x123abc456def789ghi012jkl345mno678pqr901stu234vwx567yz890abcdef"},
    consumerScans: 1250,
    lifecycleEvents: [
      {id: "evt1", type: "Manufactured", timestamp: "2024-01-01T00:00:00Z", transactionHash: "0xabc...def"}
    ],
    certifications: [
      {id: "cert1", name: "Energy Star", issuer: "EPA", issueDate: "2024-01-01", documentUrl: "#", transactionHash: "0xcertAnchor1"}
    ],
    supplyChainLinks: [
      { supplierId: "SUP001", suppliedItem: "Compressor Unit XJ-500", notes: "Primary compressor supplier." },
      { supplierId: "SUP002", suppliedItem: "Recycled Steel Panels", notes: "Certified recycled content." }
    ]
  },
  {
    id: "DPP002",
    productName: "Sustainable Cotton T-Shirt",
    category: "Apparel",
    manufacturer: { name: "EcoThreads"},
    metadata: { last_updated: "2024-07-25T14:30:00Z", status: "draft" },
    productDetails: {
      description: "A sustainable t-shirt made from organic cotton.",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "cotton t-shirt apparel",
      materials: [{name: "Organic Cotton", percentage: 100}]
    },
    compliance: {
      eu_espr: { status: "pending" },
      battery_regulation: { status: "not_applicable" },
    },
    ebsiVerification: { status: "pending_verification", lastChecked: "2024-07-20T00:00:00Z"},
    consumerScans: 300,
    blockchainIdentifiers: { platform: "MockChain" },
    supplyChainLinks: [
       { supplierId: "SUP003", suppliedItem: "Organic Cotton Yarn", notes: "GOTS Certified Supplier" }
    ]
  },
  {
    id: "DPP003",
    productName: "Recycled Polymer Phone Case",
    category: "Accessories",
    manufacturer: { name: "ReCase It"},
    metadata: { last_updated: "2024-07-22T09:15:00Z", status: "published" },
    compliance: {
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
    metadata: { last_updated: "2024-07-20T11:00:00Z", status: "archived" },
    compliance: {
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
    metadata: { last_updated: "2024-07-29T08:00:00Z", status: "pending_review" },
    productDetails: {
      description: "A high-performance EV battery module.",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "ev battery module",
    },
    compliance: {
      battery_regulation: {
        status: "pending",
        carbonFootprint: { value: 120, unit: "kg CO2e/kWh" },
        recycledContent: [{ material: "Cobalt", percentage: 15 }],
        stateOfHealth: {value: 98, unit: "%", measurementDate: "2024-07-28"}
      },
      eu_espr: { status: "pending" },
    },
    ebsiVerification: { status: "pending_verification", lastChecked: "2024-07-29T00:00:00Z"},
    consumerScans: 50,
    certifications: [
      {id: "cert_bat_01", name: "UN 38.3 Transport Test", issuer: "TestCert Ltd.", issueDate: "2024-07-01", documentUrl: "#", transactionHash: "0xcertAnchorBat1"}
    ],
    blockchainIdentifiers: { platform: "BatteryChain", anchorTransactionHash: "0xevBatteryAnchorHash555AAA"},
    supplyChainLinks: []
  },
];

// Type for individual compliance regulation details
export interface ComplianceDetailItem {
  regulationName: string;
  status: 'Compliant' | 'Non-Compliant' | 'Pending' | 'Not Applicable' | 'In Progress' | 'Data Incomplete';
  detailsUrl?: string;
  verificationId?: string;
  lastChecked: string; // ISO Date string
  notes?: string;
}

// Updated structure for compliance summary within SimpleProductDetail
export interface ProductComplianceSummary {
  overallStatus: 'Compliant' | 'Non-Compliant' | 'Pending Review' | 'N/A' | 'Data Incomplete';
  eprel?: {
    id?: string;
    status: 'Registered' | 'Pending' | 'Not Found' | 'N/A' | 'Error';
    url?: string;
    lastChecked: string;
  };
  ebsi?: {
    status: 'Verified' | 'Pending' | 'Not Verified' | 'Error' | 'N/A';
    verificationId?: string;
    transactionUrl?: string;
    lastChecked: string;
  };
  specificRegulations?: ComplianceDetailItem[];
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
  keyCompliancePoints?: string[]; // Kept for overview, but detailed in complianceSummary
  specifications?: Record<string, string>;
  materialsUsed?: { name: string; percentage?: number; source?: string; isRecycled?: boolean }[];
  energyLabelRating?: string;
  repairability?: { score: number; scale: number; detailsUrl?: string };
  recyclabilityInfo?: { percentage?: number; instructionsUrl?: string };
  supplyChainLinks?: ProductSupplyChainLink[];
  complianceSummary?: ProductComplianceSummary; // New structured compliance field
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
    keyCompliancePoints: ["EU Ecodesign Compliant", "EU Energy Labelling Compliant", "EPREL Registered: EPREL_REG_12345"], // General points
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
      { supplierId: "SUP002", suppliedItem: "Recycled Steel Panels (70%)", notes: "Certified recycled content from post-consumer sources." }
    ],
    complianceSummary: {
      overallStatus: "Compliant",
      eprel: { id: "EPREL12345", status: "Registered", url: "#eprel-link", lastChecked: "2024-07-01" },
      ebsi: { status: "Verified", verificationId: "EBSI-VC-XYZ-001", transactionUrl: "#ebsi-tx-001", lastChecked: "2024-07-05" },
      specificRegulations: [
        { regulationName: "EU Ecodesign 2019/2019", status: "Compliant", verificationId: "ECOD001", lastChecked: "2024-06-15", detailsUrl: "#ecodesign-report" },
        { regulationName: "RoHS Directive 2011/65/EU", status: "Compliant", lastChecked: "2024-06-10" },
        { regulationName: "WEEE Directive 2012/19/EU", status: "Compliant", lastChecked: "2024-06-10" },
      ]
    }
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
       { supplierId: "SUP004", suppliedItem: "LED Chips & Drivers", notes: "Specialized electronics supplier." }
    ],
    complianceSummary: {
      overallStatus: "Pending Review",
      eprel: { status: "Pending", lastChecked: "2024-07-10" },
      ebsi: { status: "Pending", lastChecked: "2024-07-15" },
      specificRegulations: [
        { regulationName: "RoHS Directive 2011/65/EU", status: "Compliant", lastChecked: "2024-07-01" },
        { regulationName: "EMC Directive 2014/30/EU", status: "Pending", lastChecked: "2024-07-01", notes: "Awaiting test report" },
        { regulationName: "EU Battery Regulation (if applicable)", status: "Data Incomplete", lastChecked: "2024-07-20", notes: "Internal battery component data needed."},
      ]
    }
  },
  {
    id: "USER_PROD123456",
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
      eprel: { status: "N/A", lastChecked: "2024-07-20" },
      ebsi: { status: "N/A", lastChecked: "2024-07-20" },
      specificRegulations: [
        { regulationName: "TSCA Title VI", status: "Pending", lastChecked: "2024-07-18", notes: "Awaiting supplier declaration for finish."}
      ]
    }
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

export const USER_SUPPLIERS_LOCAL_STORAGE_KEY = 'norruvaUserSuppliers';
export const MOCK_SUPPLIERS: Supplier[] = [
  { id: "SUP001", name: "GreenCompress Ltd.", contactPerson: "Sarah Miller", email: "sarah.miller@greencompress.com", location: "Stuttgart, Germany", materialsSupplied: "Eco-friendly compressors, Cooling units", status: "Active", lastUpdated: "2024-07-15T10:00:00Z" },
  { id: "SUP002", name: "RecycleSteel Corp.", contactPerson: "John Davis", email: "jdavis@recyclesteel.com", location: "Rotterdam, Netherlands", materialsSupplied: "Recycled steel panels, Stainless steel components", status: "Active", lastUpdated: "2024-06-20T14:30:00Z" },
  { id: "SUP003", name: "Organic Textiles Co.", contactPerson: "Aisha Khan", email: "akhan@organictextiles.com", location: "Coimbatore, India", materialsSupplied: "GOTS certified organic cotton yarn, Natural dyes", status: "Active", lastUpdated: "2024-07-01T09:00:00Z" },
  { id: "SUP004", name: "PolySolutions Inc.", contactPerson: "Mike Chen", email: "chen.m@polysolutions.com", location: "Shanghai, China", materialsSupplied: "Recycled PET pellets, Bio-polymers, LED Chips & Drivers", status: "Pending Review", lastUpdated: "2024-05-10T11:00:00Z" },
];
