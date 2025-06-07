
// Interface for a single lifecycle event
export interface LifecycleEvent {
  id: string;
  type: string; // e.g., 'Manufactured', 'Shipped', 'Sold', 'Recycled', 'Repaired', 'OwnershipTransferred'
  timestamp: string; // ISO date string
  location?: string;
  responsibleParty?: string; // DID or name
  data?: Record<string, any>; // Additional data specific to the event
  transactionHash?: string; // Blockchain transaction hash for this event
  vcId?: string; // Verifiable Credential ID for this event
}

// Interface for a single certification
export interface Certification {
  id: string;
  name: string; // e.g., "EU Ecolabel", "Energy Star"
  issuer: string; // Could be DID or name
  issueDate: string; // ISO date string
  expiryDate?: string; // ISO date string
  vcId?: string; // Verifiable Credential ID for the certificate
  documentUrl?: string;
  standard?: string; // e.g., "ISO 14024"
  transactionHash?: string; // Optional: Blockchain transaction hash if the cert doc itself is anchored
}

// Interface for traceability information
export interface TraceabilityInfo {
  batchId?: string;
  originCountry?: string;
  supplyChainSteps?: Array<{
    stepName: string;
    actorDid?: string; // Decentralized Identifier for the actor
    timestamp: string;
    location?: string;
    transactionHash?: string; // Blockchain tx hash for this specific step
  }>;
}

// Interface for a Verifiable Credential reference
export interface VerifiableCredentialReference {
  id: string; // VC's own ID (e.g., a CID or URL)
  type: string[]; // e.g., ["VerifiableCredential", "BatteryPassportCredential", "ESPRComplianceCredential"]
  name?: string; // A human-readable name for the VC context
  issuer: string; // DID of the issuer
  issuanceDate: string;
  credentialSubject: Record<string, any>; // The actual data claims
  proof?: any; // The cryptographic proof
  verificationMethod?: string; // URI to the verification method
}

export interface EbsiVerificationDetails {
  status: 'verified' | 'pending_verification' | 'not_verified' | 'error';
  verificationId?: string; // e.g., EBSI transaction ID or Verifiable Attestation ID
  lastChecked: string; // ISO date string
  message?: string;
}

export interface DigitalProductPassport {
  id: string; // Unique DPP Identifier (could be UUID, or linked to an NFT ID)
  version?: number; // Version of the DPP data structure
  productName: string;
  category: string;
  gtin?: string; // Global Trade Item Number
  modelNumber?: string;
  manufacturer?: {
    name: string;
    did?: string; // Decentralized Identifier for the manufacturer
    address?: string;
  };
  
  metadata: {
    created_at?: string; // ISO date string
    last_updated: string; // ISO date string
    status: 'draft' | 'published' | 'archived' | 'pending_review' | 'revoked';
    dppStandardVersion?: string; // e.g., "CIRPASS v1.0"
    dataSchemaVersion?: string; // Version of this specific data schema
  };

  blockchainIdentifiers?: {
    platform?: string; // e.g., "Ethereum", "Polygon", "EBSI-ESSIF"
    contractAddress?: string;
    tokenId?: string;
    anchorTransactionHash?: string; // Hash of the transaction anchoring the DPP or its latest state
  };

  productDetails?: {
    description?: string;
    imageUrl?: string;
    imageHint?: string; // Added for AI image searching if placeholder
    materials?: Array<{ name: string; percentage?: number; origin?: string; isRecycled?: boolean; recycledContentPercentage?: number }>;
    sustainabilityClaims?: Array<{ claim: string; evidenceVcId?: string; verificationDetails?: string }>;
    energyLabel?: string; // e.g., "A++"
    repairabilityScore?: { value: number; scale: number; reportUrl?: string; vcId?: string };
    recyclabilityInformation?: { instructionsUrl?: string; recycledContentPercentage?: number; designForRecycling?: boolean; vcId?: string };
  };
  
  lifecycleEvents?: LifecycleEvent[];
  certifications?: Certification[];
  traceability?: TraceabilityInfo;
  
  compliance: {
    // Specific regulation fields can be nested here
    eprelId?: string; // EPREL Database ID
    esprConformity?: {
      assessmentId?: string;
      status: 'conformant' | 'non_conformant' | 'pending_assessment';
      assessmentDate?: string;
      vcId?: string;
    };
    // Existing compliance fields from before
    eu_espr?: { status: 'compliant' | 'non_compliant' | 'pending'; reportUrl?: string; vcId?: string }; // Can be deprecated if using esprConformity
    us_scope3?: { status: 'compliant' | 'non_compliant' | 'pending'; reportUrl?: string; vcId?: string };
    battery_regulation?: { 
      status: 'compliant' | 'non_compliant' | 'pending'; 
      batteryPassportId?: string; 
      carbonFootprint?: { value: number; unit: string; calculationMethod?: string; vcId?: string };
      recycledContent?: Array<{ material: string; percentage: number; vcId?: string }>;
      stateOfHealth?: {value: number; unit: '%'; measurementDate: string; vcId?: string};
      vcId?: string;
    };
  };

  ebsiVerification?: EbsiVerificationDetails; // Overall EBSI verification status for the DPP
  verifiableCredentials?: VerifiableCredentialReference[]; // Store an array of linked VCs

  consumerScans?: number;
  
  dataController?: string; // DID or legal entity
  accessControlPolicyUrl?: string;
  privacyPolicyUrl?: string;
  supplyChainLinks?: ProductSupplyChainLink[]; // Added for supply chain management
}

export interface DashboardFiltersState {
  status: 'all' | 'draft' | 'published' | 'archived' | 'pending_review' | 'revoked';
  regulation: 'all' | 'eu_espr' | 'us_scope3' | 'battery_regulation'; // This might need to become more dynamic
  category: 'all' | string;
  searchQuery?: string;
  blockchainAnchored?: 'all' | 'anchored' | 'not_anchored';
}

// MOCK_DPPS needs to be updated to conform to the new (mostly optional) structure.
// I've made new complex types optional.
// For brevity, only updating a couple of mock items to reflect new structure
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
    },
    ebsiVerification: { status: "pending_verification", lastChecked: "2024-07-20T00:00:00Z"},
    consumerScans: 300,
    blockchainIdentifiers: { platform: "MockChain" }, // No anchor hash
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
    },
    consumerScans: 2100,
     productDetails: { description: "A recycled phone case."},
     blockchainIdentifiers: { platform: "OtherChain", anchorTransactionHash: "0x789polymerAnchorHash000333"},
     supplyChainLinks: []
  },
  {
    id: "DPP004",
    productName: "Modular Sofa System",
    category: "Furniture",
    manufacturer: { name: "Comfy Living"},
    metadata: { last_updated: "2024-07-20T11:00:00Z", status: "archived" },
    compliance: { 
      eu_espr: { status: "compliant" },
    },
    consumerScans: 850,
    productDetails: { description: "A modular sofa."}, // No blockchainIdentifiers
    supplyChainLinks: []
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
   {
    id: "DPP006",
    productName: "Organic FairTrade Coffee Beans",
    category: "Groceries",
    manufacturer: { name: "BeanGood Coffee"},
    metadata: { last_updated: "2024-06-15T18:00:00Z", status: "published" },
    compliance: {
      eu_espr: { status: "compliant" }, 
      us_scope3: { status: "non_compliant" }, 
    },
    consumerScans: 1520,
    productDetails: { description: "Fairtrade coffee beans.", imageUrl: "https://placehold.co/600x400.png", imageHint: "coffee beans bag"},
    supplyChainLinks: []
  },
  {
    id: "DPP007",
    productName: "Smart Home Thermostat G2",
    category: "Electronics",
    manufacturer: { name: "HomeSmart Inc."},
    metadata: { last_updated: "2024-07-10T12:45:00Z", status: "published" },
    compliance: { 
      eprelId: "EPREL_THERMO_789",
      esprConformity: {status: "conformant"},
      battery_regulation: { status: "compliant" }, 
    },
    ebsiVerification: { status: "verified", lastChecked: "2024-07-11T00:00:00Z"},
    consumerScans: 980,
    productDetails: { description: "A smart thermostat.", imageUrl: "https://placehold.co/600x400.png", imageHint: "smart thermostat device"},
    blockchainIdentifiers: { platform: "SmartHomeChain", anchorTransactionHash: "0xthermoAnchorHash777BBB"},
    supplyChainLinks: []
  }
];

// --- New types for refactored Product Detail Page ---
export interface SimpleProductDetail {
  id: string;
  productName: string;
  category: string;
  status: 'Active' | 'Draft' | 'Archived' | 'Pending'; // Simplified status
  manufacturer?: string;
  gtin?: string;
  modelNumber?: string;
  description?: string;
  imageUrl?: string;
  imageHint?: string;
  // Simplified key details for overview
  keySustainabilityPoints?: string[];
  keyCompliancePoints?: string[];
  specifications?: Record<string, string>; // Simple key-value for now
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
    keySustainabilityPoints: ["Energy Star Certified A+++", "Made with 70% recycled steel", "95% recyclable at end-of-life"],
    keyCompliancePoints: ["EU Ecodesign Compliant", "EU Energy Labelling Compliant", "EPREL Registered: EPREL_REG_12345"],
    specifications: { "Capacity": "400L", "Warranty": "5 years", "Dimensions": "180x70x65 cm", "Color": "Stainless Steel"}
  },
  {
    id: "PROD002",
    productName: "Smart LED Bulb Pack (4-pack)",
    category: "Electronics",
    status: "Active",
    manufacturer: "BrightSpark Electronics",
    gtin: "98765432109876",
    modelNumber: "BS-LED-S04B",
    description: "Tunable white and color smart LED bulbs, designed for long lifespan and connectivity with smart home systems. Uses 85% less energy than traditional incandescent bulbs.",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "led bulbs packaging",
    keySustainabilityPoints: ["Uses 85% less energy", "Recyclable packaging materials", "Mercury-free design"],
    keyCompliancePoints: ["RoHS Compliant", "CE Marked"],
    specifications: { "Lumens": "800lm per bulb", "Connectivity": "Wi-Fi, Bluetooth", "Lifespan": "25,000 hours", "Color Temperature": "2700K-6500K"}
  },
  // Add more simple mock products if needed, ensure IDs match those expected from lists.
  {
    id: "USER_PROD123456", // Example of a user-added product ID structure
    productName: "Custom Craft Wooden Chair",
    category: "Furniture",
    status: "Draft",
    manufacturer: "Artisan Woodworks",
    gtin: "11223344556677",
    modelNumber: "CWC-001",
    description: "A handcrafted wooden chair made from sustainably sourced oak. Each chair is unique and built to last.",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "wooden chair artisan",
    keySustainabilityPoints: ["Sustainably Sourced Oak", "Handcrafted Locally", "Durable Design"],
    keyCompliancePoints: ["TSCA Title VI Compliant (Formaldehyde)"],
    specifications: { "Material": "Solid Oak", "Finish": "Natural Oil", "Weight Capacity": "120kg" }
  }
];
// --- End of new types for refactored Product Detail Page ---


// --- For Supply Chain Module ---
export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  location?: string;
  materialsSupplied: string; // Comma-separated list or general description
  status: 'Active' | 'Inactive' | 'Pending Review';
  lastUpdated: string; // ISO date string
}

export interface ProductSupplyChainLink {
  supplierId: string;
  suppliedItem: string; // e.g., "Battery Cells", "Recycled Aluminum Casing"
  notes?: string;
}

export const USER_SUPPLIERS_LOCAL_STORAGE_KEY = 'norruvaUserSuppliers';
export const MOCK_SUPPLIERS: Supplier[] = [
  { id: "SUP001", name: "GreenCompress Ltd.", contactPerson: "Sarah Miller", email: "sarah.miller@greencompress.com", location: "Stuttgart, Germany", materialsSupplied: "Eco-friendly compressors, Cooling units", status: "Active", lastUpdated: "2024-07-15T10:00:00Z" },
  { id: "SUP002", name: "RecycleSteel Corp.", contactPerson: "John Davis", email: "jdavis@recyclesteel.com", location: "Rotterdam, Netherlands", materialsSupplied: "Recycled steel panels, Stainless steel components", status: "Active", lastUpdated: "2024-06-20T14:30:00Z" },
  { id: "SUP003", name: "Organic Textiles Co.", contactPerson: "Aisha Khan", email: "akhan@organictextiles.com", location: "Coimbatore, India", materialsSupplied: "GOTS certified organic cotton yarn, Natural dyes", status: "Active", lastUpdated: "2024-07-01T09:00:00Z" },
  { id: "SUP004", name: "PolySolutions Inc.", contactPerson: "Mike Chen", email: "chen.m@polysolutions.com", location: "Shanghai, China", materialsSupplied: "Recycled PET pellets, Bio-polymers", status: "Pending Review", lastUpdated: "2024-05-10T11:00:00Z" },
];
// --- End of Supply Chain Module types ---

    