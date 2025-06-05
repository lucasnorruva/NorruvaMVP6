

// Interface for a single lifecycle event
export interface LifecycleEvent {
  id: string;
  type: string; // e.g., 'Manufactured', 'Shipped', 'Sold', 'Recycled'
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
  name: string;
  issuer: string; // Could be DID or name
  issueDate: string; // ISO date string
  expiryDate?: string; // ISO date string
  vcId?: string; // Verifiable Credential ID for the certificate
  documentUrl?: string;
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
    transactionHash?: string;
  }>;
}

// Interface for a Verifiable Credential reference
export interface VerifiableCredentialReference {
  id: string; // VC's own ID
  type: string[]; // e.g., ["VerifiableCredential", "BatteryPassportCredential"]
  issuer: string; // DID of the issuer
  issuanceDate: string;
  credentialSubject: Record<string, any>; // The actual data claims
  proof?: any; // The cryptographic proof
  verificationMethod?: string; // URI to the verification method
}

export interface DigitalProductPassport {
  id: string; // Unique DPP Identifier (could be UUID, or linked to an NFT ID)
  version?: number; // Version of the DPP data structure
  productName: string;
  category: string;
  gtin?: string; // Global Trade Item Number
  modelNumber?: string;
  manufacturer?: { // Made manufacturer an object for more detail
    name: string;
    did?: string; // Decentralized Identifier for the manufacturer
    address?: string;
  };
  
  metadata: {
    created_at?: string; // ISO date string
    last_updated: string; // ISO date string
    status: 'draft' | 'published' | 'archived' | 'pending_review' | 'revoked'; // Added 'revoked'
    dppStandardVersion?: string; // e.g., "CIRPASS v1.0"
  };

  blockchainIdentifiers?: { // Optional group for blockchain specific IDs
    platform?: string; // e.g., "Ethereum", "Polygon", "EBSI-ESSIF"
    contractAddress?: string;
    tokenId?: string;
    anchorTransactionHash?: string;
  };

  productDetails?: { // Optional group for more detailed product info
    description?: string;
    imageUrl?: string;
    materials?: Array<{ name: string; percentage?: number; origin?: string; isRecycled?: boolean }>;
    sustainabilityClaims?: Array<{ claim: string; evidenceVcId?: string }>; // Claims can be linked to VCs
    energyLabel?: string;
  };
  
  lifecycleEvents?: LifecycleEvent[];
  certifications?: Certification[];
  traceability?: TraceabilityInfo;
  
  compliance: { // Existing structure, can be expanded per regulation as shown for battery_regulation
    eu_espr?: { status: 'compliant' | 'non_compliant' | 'pending'; reportUrl?: string; vcId?: string };
    us_scope3?: { status: 'compliant' | 'non_compliant' | 'pending'; reportUrl?: string; vcId?: string };
    battery_regulation?: { 
      status: 'compliant' | 'non_compliant' | 'pending'; 
      batteryPassportId?: string; 
      carbonFootprint?: number; // kg CO2e
      recycledContent?: { material: string; percentage: number }[];
      vcId?: string; // VC for the battery passport itself or key attestations
    };
  };

  verifiableCredentials?: VerifiableCredentialReference[]; // Store an array of VCs

  consumerScans?: number;
  
  dataController?: string; // DID or legal entity
  accessControlPolicyUrl?: string;
}

export interface DashboardFiltersState {
  status: 'all' | 'draft' | 'published' | 'archived' | 'pending_review' | 'revoked'; // Added revoked
  regulation: 'all' | 'eu_espr' | 'us_scope3' | 'battery_regulation';
  category: 'all' | string;
  searchQuery?: string;
}

// MOCK_DPPS needs to be updated to conform to the new (mostly optional) structure
// For now, fields in MOCK_DPPS that don't exist in the new DigitalProductPassport (like direct manufacturer string) 
// will cause type errors if not handled. The simplest is to ensure all new complex fields are optional or update MOCK_DPPS.
// I've made new complex types optional. Simpler fields like `manufacturer` as string are now `manufacturer.name`.
// This will likely require MOCK_DPPS to be adjusted in a future step if its usage is critical.
// For now, I'm aiming for the definition task.
export const MOCK_DPPS: DigitalProductPassport[] = [
  {
    id: "DPP001",
    productName: "EcoSmart Refrigerator X500",
    category: "Appliances",
    manufacturer: { name: "GreenTech Appliances"},
    metadata: { last_updated: "2024-07-28T10:00:00Z", status: "published" },
    compliance: {
      eu_espr: { status: "compliant" },
      battery_regulation: { status: "non_compliant" },
    },
    consumerScans: 1250,
    productDetails: { description: "An eco friendly fridge.", energyLabel: "A++"}
  },
  {
    id: "DPP002",
    productName: "Sustainable Cotton T-Shirt",
    category: "Apparel",
    manufacturer: { name: "EcoThreads"},
    metadata: { last_updated: "2024-07-25T14:30:00Z", status: "draft" },
    compliance: {
      eu_espr: { status: "pending" },
    },
    consumerScans: 300,
    productDetails: { description: "A sustainable t-shirt."}
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
     productDetails: { description: "A recycled phone case."}
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
    productDetails: { description: "A modular sofa."}
  },
  {
    id: "DPP005",
    productName: "High-Performance EV Battery",
    category: "Automotive Parts",
    manufacturer: { name: "PowerVolt"},
    metadata: { last_updated: "2024-07-29T08:00:00Z", status: "pending_review" },
    compliance: {
      battery_regulation: { status: "pending", carbonFootprint: 120 },
      eu_espr: { status: "pending" },
    },
    consumerScans: 50,
    productDetails: { description: "An EV Battery."}
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
    productDetails: { description: "Fairtrade coffee beans."}
  },
  {
    id: "DPP007",
    productName: "Smart Home Thermostat G2",
    category: "Electronics",
    manufacturer: { name: "HomeSmart Inc."},
    metadata: { last_updated: "2024-07-10T12:45:00Z", status: "published" },
    compliance: { 
      eu_espr: { status: "compliant" },
      battery_regulation: { status: "compliant" },
    },
    consumerScans: 980,
    productDetails: { description: "A smart thermostat."}
  },
  {
    id: "DPP008",
    productName: "Recycled Glass Water Bottle",
    category: "Homeware",
    manufacturer: { name: "ClearlyGreen Bottles"},
    metadata: { last_updated: "2024-08-01T10:00:00Z", status: "published" },
    compliance: {
      eu_espr: { status: "compliant" },
    },
    consumerScans: 620,
    productDetails: { description: "A recycled glass bottle."}
  },
  {
    id: "DPP009",
    productName: "Bamboo Cutting Board Set",
    category: "Homeware",
    manufacturer: { name: "EcoKitchenware"},
    metadata: { last_updated: "2024-08-02T11:30:00Z", status: "pending_review" },
    compliance: {
      eu_espr: { status: "pending" },
    },
    consumerScans: 150,
    productDetails: { description: "A bamboo cutting board."}
  },
  {
    id: "DPP010",
    productName: "Wooden Toy Train",
    category: "Toys",
    manufacturer: { name: "PlaySafe Toys"},
    metadata: { last_updated: "2024-08-03T10:00:00Z", status: "published" },
    compliance: {}, 
    consumerScans: 75,
    productDetails: { description: "A wooden toy train."}
  },
  {
    id: "DPP011",
    productName: "Imported Textile Rug",
    category: "Textiles",
    manufacturer: { name: "WeaveWorld Imports"},
    metadata: { last_updated: "2024-08-03T11:00:00Z", status: "draft" },
    compliance: { us_scope3: {status: "pending"} }, 
    consumerScans: 20,
    productDetails: { description: "An imported rug."}
  }
];
