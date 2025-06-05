
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
      recycledContent?: { material: string; percentage: number; vcId?: string }[];
      stateOfHealth?: { value: number; unit: '%'; measurementDate: string; vcId?: string};
      vcId?: string;
    };
  };

  ebsiVerification?: EbsiVerificationDetails; // Overall EBSI verification status for the DPP
  verifiableCredentials?: VerifiableCredentialReference[]; // Store an array of linked VCs

  consumerScans?: number;
  
  dataController?: string; // DID or legal entity
  accessControlPolicyUrl?: string;
  privacyPolicyUrl?: string;
}

export interface DashboardFiltersState {
  status: 'all' | 'draft' | 'published' | 'archived' | 'pending_review' | 'revoked';
  regulation: 'all' | 'eu_espr' | 'us_scope3' | 'battery_regulation'; // This might need to become more dynamic
  category: 'all' | string;
  searchQuery?: string;
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
      battery_regulation: { status: "non_compliant" }, // Example, refrigerators don't usually have this directly
    },
    ebsiVerification: { status: "verified", verificationId: "EBSI_TX_ABC123", lastChecked: "2024-07-29T00:00:00Z"},
    blockchainIdentifiers: { platform: "MockChain", anchorTransactionHash: "0x123...abc"},
    consumerScans: 1250,
    lifecycleEvents: [
      {id: "evt1", type: "Manufactured", timestamp: "2024-01-01T00:00:00Z", transactionHash: "0xabc...def"}
    ],
    certifications: [
      {id: "cert1", name: "Energy Star", issuer: "EPA", issueDate: "2024-01-01", documentUrl: "#"}
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
      eu_espr: { status: "pending" }, // old field for example
    },
    ebsiVerification: { status: "pending_verification", lastChecked: "2024-07-20T00:00:00Z"},
    consumerScans: 300,
  },
  // ... other mock DPPs would ideally be updated too, but keeping concise for now
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
    category: "Automotive Parts", // Changed category for relevance
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
  },
  // Keep a few more simple ones for variety in the list view
   {
    id: "DPP006",
    productName: "Organic FairTrade Coffee Beans",
    category: "Groceries",
    manufacturer: { name: "BeanGood Coffee"},
    metadata: { last_updated: "2024-06-15T18:00:00Z", status: "published" },
    compliance: {
      eu_espr: { status: "compliant" }, // Assuming ESPR might apply to packaging indirectly
      us_scope3: { status: "non_compliant" }, 
    },
    consumerScans: 1520,
    productDetails: { description: "Fairtrade coffee beans.", imageUrl: "https://placehold.co/600x400.png", imageHint: "coffee beans bag"}
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
      battery_regulation: { status: "compliant" }, // If it has a small non-rechargeable battery for backup
    },
    ebsiVerification: { status: "verified", lastChecked: "2024-07-11T00:00:00Z"},
    consumerScans: 980,
    productDetails: { description: "A smart thermostat.", imageUrl: "https://placehold.co/600x400.png", imageHint: "smart thermostat device"}
  }
];

