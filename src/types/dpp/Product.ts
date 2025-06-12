
// --- File: Product.ts ---
// Description: Product related type definitions and mock data.

import type { LifecycleEvent, SimpleLifecycleEvent, LifecycleHighlight } from './Lifecycle';
import type { Certification, EbsiVerificationDetails, SimpleCertification, ProductComplianceSummary, PublicCertification, BatteryRegulationDetails } from './Compliance'; // Added BatteryRegulationDetails

export const USER_PRODUCTS_LOCAL_STORAGE_KEY = 'norruvaUserProducts';
export const USER_SUPPLIERS_LOCAL_STORAGE_KEY = 'norruvaUserSuppliers';

export interface SupplyChainStep {
  stepName: string;
  actorDid?: string;
  timestamp: string;
  location?: string;
  transactionHash?: string;
}

export interface TraceabilityInfo {
  batchId?: string;
  originCountry?: string;
  supplyChainSteps?: SupplyChainStep[];
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

export interface ProductSupplyChainLink {
  supplierId: string;
  suppliedItem: string;
  notes?: string;
}

export interface CustomAttribute {
  key: string;
  value: string;
}

export interface DocumentReference {
  name: string;
  url: string;
  type: string;
  addedTimestamp: string;
}

export interface DigitalProductPassport {
  id: string;
  version?: number;
  productName: string;
  category: string;
  gtin?: string;
  modelNumber?: string;
  sku?: string;
  nfcTagId?: string;
  rfidTagId?: string;
  manufacturer?: {
    name: string;
    did?: string;
    address?: string;
    eori?: string; // Added EORI to manufacturer
  };

  metadata: {
    created_at?: string;
    last_updated: string;
    status: 'draft' | 'published' | 'archived' | 'pending_review' | 'revoked' | 'flagged';
    dppStandardVersion?: string;
    dataSchemaVersion?: string;
  };

  blockchainIdentifiers?: {
    platform?: string;
    contractAddress?: string;
    tokenId?: string;
    anchorTransactionHash?: string;
  };

  authenticationVcId?: string;
  ownershipNftLink?: {
    registryUrl?: string;
    contractAddress: string;
    tokenId: string;
    chainName?: string;
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
  documents?: DocumentReference[];
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
    battery_regulation?: BatteryRegulationDetails; // Using imported type
    scipNotification?: { // SCIP data structure
      status?: string;
      notificationId?: string;
      svhcListVersion?: string;
      submittingLegalEntity?: string;
      articleName?: string;
      primaryArticleId?: string;
      safeUseInstructionsLink?: string;
      lastChecked?: string;
    };
    euCustomsData?: { // EU Customs data structure
      status?: string;
      declarationId?: string;
      hsCode?: string;
      countryOfOrigin?: string;
      netWeightKg?: number | null;
      grossWeightKg?: number | null;
      customsValuation?: {
        value?: number | null;
        currency?: string;
      };
      lastChecked?: string;
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
  status: 'all' | 'draft' | 'published' | 'archived' | 'pending_review' | 'revoked' | 'flagged';
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

export interface SimpleProductDetail {
  id: string;
  productName: string;
  category: string;
  status: 'Active' | 'Draft' | 'Archived' | 'Pending' | 'Flagged';
  manufacturer?: string;
  gtin?: string;
  modelNumber?: string;
  sku?: string;
  nfcTagId?: string;
  rfidTagId?: string;
  description?: string;
  imageUrl?: string;
  imageHint?: string;
  keySustainabilityPoints?: string[];
  keyCompliancePoints?: string[];
  specifications?: string; // JSON string
  customAttributes?: CustomAttribute[];
  materialsUsed?: { name: string; percentage?: number; source?: string; isRecycled?: boolean }[];
  energyLabelRating?: string;
  repairability?: { score: number; scale: number; detailsUrl?: string };
  recyclabilityInfo?: { percentage?: number; instructionsUrl?: string };
  supplyChainLinks?: ProductSupplyChainLink[];
  complianceSummary?: ProductComplianceSummary;
  lifecycleEvents?: SimpleLifecycleEvent[];
  certifications?: SimpleCertification[];
  documents?: DocumentReference[];
  authenticationVcId?: string;
  ownershipNftLink?: { registryUrl?: string; contractAddress: string; tokenId: string; chainName?: string; };
}

export interface StoredUserProduct {
  id: string;
  productName?: string;
  gtin?: string;
  productDescription?: string;
  manufacturer?: string;
  modelNumber?: string;
  sku?: string;
  nfcTagId?: string;
  rfidTagId?: string;
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
  status: 'Active' | 'Draft' | 'Archived' | 'Pending' | 'Flagged' | string;
  compliance: string; // Simplified compliance text for list view
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
  documents?: DocumentReference[];
  customAttributesJsonString?: string;
  complianceData?: { // For detailed compliance data storage
    eprel?: Partial<DigitalProductPassport['compliance']['eprel']>;
    esprConformity?: Partial<DigitalProductPassport['compliance']['esprConformity']>;
    scipNotification?: Partial<DigitalProductPassport['compliance']['scipNotification']>;
    euCustomsData?: Partial<DigitalProductPassport['compliance']['euCustomsData']>;
    battery_regulation?: Partial<DigitalProductPassport['compliance']['battery_regulation']>;
  };
  batteryRegulation?: Partial<BatteryRegulationDetails>;
}

export interface RichMockProduct {
  id: string;
  productId: string;
  productName: string;
  category?: string;
  status: 'Active' | 'Draft' | 'Archived' | 'Pending' | 'Flagged';
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
  specifications?: string; // JSON string for technical specifications
  lifecycleEvents?: SimpleLifecycleEvent[];
  complianceSummary?: ProductComplianceSummary;
  batteryChemistry?: string;
  stateOfHealth?: number | null;
  carbonFootprintManufacturing?: number | null;
  recycledContentPercentage?: number | null;
  ebsiVerification?: EbsiVerificationDetails;
  certifications?: Certification[];
  documents?: DocumentReference[];
  supplyChainLinks?: ProductSupplyChainLink[];
  customAttributes?: CustomAttribute[];
  blockchainIdentifiers?: DigitalProductPassport['blockchainIdentifiers'];
  authenticationVcId?: string;
  ownershipNftLink?: { registryUrl?: string; contractAddress: string; tokenId: string; chainName?: string; };
}

export interface PublicProductInfo {
  passportId: string;
  productName: string;
  tagline: string;
  imageUrl: string;
  imageHint?: string;
  productStory: string;
  sustainabilityHighlights: Array<{ iconName?: LifecycleHighlight['iconName']; text: string }>;
  manufacturerName: string;
  manufacturerWebsite?: string;
  brandLogoUrl?: string;
  learnMoreLink?: string;
  complianceSummary: string;
  category: string;
  modelNumber: string;
  sku?: string;
  nfcTagId?: string;
  rfidTagId?: string;
  anchorTransactionHash?: string;
  blockchainPlatform?: string;
  ebsiStatus?: 'verified' | 'pending' | 'not_verified' | 'error';
  ebsiVerificationId?: string;
  lifecycleHighlights?: LifecycleHighlight[];
  certifications?: PublicCertification[];
  customAttributes?: CustomAttribute[];
  documents?: DocumentReference[];
  authenticationVcId?: string;
  ownershipNftLink?: { registryUrl?: string; contractAddress: string; tokenId: string; chainName?: string; };
}

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

export interface DisplayableProduct {
  id: string;
  productId?: string;
  productName?: string;
  category?: string;
  productCategory?: string;
  status: 'Active' | 'Draft' | 'Archived' | 'Pending' | 'Flagged' | string;
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
  specifications?: string; // JSON string for display & form consistency
  lifecycleEvents?: SimpleLifecycleEvent[];
  complianceSummary?: ProductComplianceSummary;
  batteryChemistry?: string;
  stateOfHealth?: number | null;
  carbonFootprintManufacturing?: number | null;
  recycledContentPercentage?: number | null;
  ebsiStatus?: 'verified' | 'pending' | 'not_verified' | 'error' | 'N/A';
  supplyChainLinks?: ProductSupplyChainLink[];
  certifications?: SimpleCertification[];
  documents?: DocumentReference[];
  customAttributes?: CustomAttribute[];
  customAttributesJsonString?: string;
  blockchainIdentifiers?: DigitalProductPassport['blockchainIdentifiers'];
  authenticationVcId?: string;
  ownershipNftLink?: { registryUrl?: string; contractAddress: string; tokenId: string; chainName?: string; };
}

export interface AnchorResult {
  productId: string;
  anchorTransactionHash: string;
  platform?: string;
}

// Token Operation Response Types
export interface MintTokenResponse {
  tokenId: string;
  contractAddress: string;
  transactionHash: string;
  message?: string;
  error?: string; // For client-side errors or API-returned errors
}

export interface UpdateTokenMetadataResponse {
  tokenId: string;
  contractAddress: string;
  transactionHash: string;
  message?: string;
  error?: string; // For client-side errors or API-returned errors
}

export interface TokenStatusResponse {
  tokenId: string;
  contractAddress: string;
  ownerAddress: string;
  mintedAt: string; // ISO date string
  metadataUri?: string | null;
  lastTransactionHash?: string | null;
  status: string; // e.g., "minted", "transferred", "active"
  message?: string;
}
