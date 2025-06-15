
// --- File: Product.ts ---
// Description: Product related type definitions and mock data.

import type { LifecycleEvent, SimpleLifecycleEvent, LifecycleHighlight, IconName as LucideIconName } from './Lifecycle';
import type {
  Certification, EbsiVerificationDetails, SimpleCertification, ProductComplianceSummary, PublicCertification,
  BatteryRegulationDetails, ScipNotificationDetails, EuCustomsDataDetails, TextileInformation, ConstructionProductInformation, EsprSpecifics, CarbonFootprintData
} from './Compliance'; 

export const USER_PRODUCTS_LOCAL_STORAGE_KEY = 'norruvaUserProducts';
export const USER_SUPPLIERS_LOCAL_STORAGE_KEY = 'norruvaUserSuppliers';
export const TRACKED_PRODUCTS_STORAGE_KEY = 'norruvaTrackedProductIds';

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

export interface OwnershipNftLink {
  registryUrl?: string;
  contractAddress: string;
  tokenId: string;
  chainName?: string;
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
    eori?: string;
  };

  metadata: {
    created_at?: string;
    last_updated: string;
    status: 'draft' | 'published' | 'archived' | 'pending_review' | 'revoked' | 'flagged';
    dppStandardVersion?: string;
    dataSchemaVersion?: string;
    onChainStatus?: string; 
    onChainLifecycleStage?: string; 
  };

  blockchainIdentifiers?: {
    platform?: string;
    contractAddress?: string;
    tokenId?: string;
    anchorTransactionHash?: string;
  };

  authenticationVcId?: string;
  ownershipNftLink?: OwnershipNftLink;

  productDetails?: {
    description?: string;
    imageUrl?: string;
    imageHint?: string;
    materials?: Array<{ name: string; percentage?: number; origin?: string; isRecycled?: boolean; recycledContentPercentage?: number }>;
    sustainabilityClaims?: Array<{ claim: string; evidenceVcId?: string; verificationDetails?: string }>;
    energyLabel?: string;
    repairabilityScore?: { value: number; scale: number; reportUrl?: string; vcId?: string };
    recyclabilityInformation?: { instructionsUrl?: string; recycledContentPercentage?: number; designForRecycling?: boolean; vcId?: string };
    specifications?: string; 
    customAttributes?: CustomAttribute[];
    conflictMineralsReportUrl?: string; 
    fairTradeCertificationId?: string; 
    ethicalSourcingPolicyUrl?: string; 
    keyCompliancePoints?: string; 
    esprSpecifics?: EsprSpecifics; 
    carbonFootprint?: CarbonFootprintData; // Added for Task 3
  };

  textileInformation?: TextileInformation;
  constructionProductInformation?: ConstructionProductInformation;
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
    battery_regulation?: BatteryRegulationDetails; 
    scipNotification?: ScipNotificationDetails;
    euCustomsData?: EuCustomsDataDetails;
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

export type SortableKeys = keyof DigitalProductPassport | 'metadata.status' | 'metadata.last_updated' | 'overallCompliance' | 'ebsiVerification.status' | 'metadata.onChainStatus';

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
  keyCompliancePoints?: string; 
  specifications?: string; 
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
  ownershipNftLink?: OwnershipNftLink; 
  blockchainPlatform?: string;
  contractAddress?: string;
  tokenId?: string;
  anchorTransactionHash?: string;
  ebsiStatus?: EbsiVerificationDetails['status']; 
  ebsiVerificationId?: string; 
  onChainStatus?: string; 
  onChainLifecycleStage?: string; 
  textileInformation?: TextileInformation;
  constructionProductInformation?: ConstructionProductInformation;
  batteryRegulation?: BatteryRegulationDetails; 
  lastUpdated?: string; 
  conflictMineralsReportUrl?: string; 
  fairTradeCertificationId?: string; 
  ethicalSourcingPolicyUrl?: string; 
  productDetails?: { 
    esprSpecifics?: EsprSpecifics;
    carbonFootprint?: CarbonFootprintData; // Added for Task 3
    conflictMineralsReportUrl?: string;
    fairTradeCertificationId?: string;
    ethicalSourcingPolicyUrl?: string;
  };
}

export interface StoredUserProduct extends Omit<ProductFormData, 'batteryRegulation' | 'compliance' | 'productDetails'> {
  id: string;
  status: string; 
  compliance: string; 
  lastUpdated: string;
  productCategory?: string;
  keySustainabilityPoints?: string[]; 
  keyCompliancePoints?: string;
  keyCompliancePointsOrigin?: 'AI_EXTRACTED' | 'manual';
  materialsUsed?: { name: string; percentage?: number; source?: string; isRecycled?: boolean }[];
  energyLabelRating?: string;
  repairability?: { score: number; scale: number; detailsUrl?: string };
  recyclabilityInfo?: { percentage?: number; instructionsUrl?: string };
  supplyChainLinks?: ProductSupplyChainLink[];
  lifecycleEvents?: SimpleLifecycleEvent[];
  complianceSummary?: ProductComplianceSummary; 
  
  productDetails?: Partial<ProductFormData['productDetails']>; 
  complianceData?: { 
    eprel?: Partial<ProductFormData['compliance']['eprel']>;
    esprConformity?: Partial<ProductFormData['compliance']['esprConformity']>;
    scipNotification?: Partial<ScipNotificationDetails>;
    euCustomsData?: Partial<EuCustomsDataDetails & { cbamGoodsIdentifier?: string }>;
    battery_regulation?: Partial<ProductFormData['compliance']['battery_regulation']>;
  };
  batteryRegulation?: Partial<BatteryRegulationDetails>; 
  textileInformation?: Partial<TextileInformation>; 
  constructionProductInformation?: Partial<ConstructionProductInformation>; 
  metadata?: Partial<InitialProductFormData>; // Re-using this for metadata structure if needed
  authenticationVcId?: string; 
  ownershipNftLink?: { registryUrl?: string; contractAddress: string; tokenId: string; chainName?: string; }; 
  blockchainIdentifiers?: InitialProductFormData['blockchainIdentifiers']; 
  conflictMineralsReportUrl?: string; 
  fairTradeCertificationId?: string; 
  ethicalSourcingPolicyUrl?: string; 
  productNameOrigin?: 'AI_EXTRACTED' | 'manual';
  productDescriptionOrigin?: 'AI_EXTRACTED' | 'manual';
  manufacturerOrigin?: 'AI_EXTRACTED' | 'manual';
  modelNumberOrigin?: 'AI_EXTRACTED' | 'manual';
  materialsOrigin?: 'AI_EXTRACTED' | 'manual';
  sustainabilityClaimsOrigin?: 'AI_EXTRACTED' | 'manual';
  energyLabelOrigin?: 'AI_EXTRACTED' | 'manual';
  specificationsOrigin?: 'AI_EXTRACTED' | 'manual';
  imageUrlOrigin?: 'AI_EXTRACTED' | 'manual';
  productDetailsOrigin?: { 
    descriptionOrigin?: 'AI_EXTRACTED' | 'manual';
    materialsOrigin?: 'AI_EXTRACTED' | 'manual';
    sustainabilityClaimsOrigin?: 'AI_EXTRACTED' | 'manual';
    keyCompliancePointsOrigin?: 'AI_EXTRACTED' | 'manual';
    specificationsOrigin?: 'AI_EXTRACTED' | 'manual';
    energyLabelOrigin?: 'AI_EXTRACTED' | 'manual';
    imageUrlOrigin?: 'AI_EXTRACTED' | 'manual';
    esprSpecificsOrigin?: {
      durabilityInformationOrigin?: 'AI_EXTRACTED' | 'manual';
      repairabilityInformationOrigin?: 'AI_EXTRACTED' | 'manual';
      recycledContentSummaryOrigin?: 'AI_EXTRACTED' | 'manual';
      energyEfficiencySummaryOrigin?: 'AI_EXTRACTED' | 'manual';
      substanceOfConcernSummaryOrigin?: 'AI_EXTRACTED' | 'manual';
    };
    carbonFootprintOrigin?: { // Added for Task 3
        valueOrigin?: 'AI_EXTRACTED' | 'manual';
        unitOrigin?: 'AI_EXTRACTED' | 'manual';
        calculationMethodOrigin?: 'AI_EXTRACTED' | 'manual';
        scope1EmissionsOrigin?: 'AI_EXTRACTED' | 'manual';
        scope2EmissionsOrigin?: 'AI_EXTRACTED' | 'manual';
        scope3EmissionsOrigin?: 'AI_EXTRACTED' | 'manual';
        dataSourceOrigin?: 'AI_EXTRACTED' | 'manual';
        vcIdOrigin?: 'AI_EXTRACTED' | 'manual';
    };
  };
  batteryRegulationOrigin?: any; 
}

export interface RichMockProduct {
  id: string;
  productId: string;
  productName: string;
  category?: string;
  status: 'Active' | 'Draft' | 'Archived' | 'Pending' | 'Flagged' | 'published' | 'pending_review' | 'revoked';
  compliance: string;
  lastUpdated: string;
  gtin?: string;
  manufacturer?: string;
  modelNumber?: string;
  description?: string;
  productDescription?: string; 
  imageUrl?: string;
  imageHint?: string;
  materials?: string;
  sustainabilityClaims?: string; 
  keyCompliancePoints?: string; 
  energyLabel?: string;
  specifications?: string; 
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
  ownershipNftLink?: OwnershipNftLink; 
  metadata?: Partial<DigitalProductPassport['metadata']>; 
  textileInformation?: TextileInformation;
  constructionProductInformation?: ConstructionProductInformation;
  batteryRegulation?: BatteryRegulationDetails; 
  conflictMineralsReportUrl?: string; 
  fairTradeCertificationId?: string; 
  ethicalSourcingPolicyUrl?: string; 
  productDetails?: { 
    esprSpecifics?: EsprSpecifics;
    carbonFootprint?: CarbonFootprintData; 
    conflictMineralsReportUrl?: string;
    fairTradeCertificationId?: string;
    ethicalSourcingPolicyUrl?: string;
    description?: string; 
    imageUrl?: string;
    imageHint?: string;
    materials?: Array<{ name: string; percentage?: number; origin?: string; isRecycled?: boolean; recycledContentPercentage?: number }>;
    sustainabilityClaims?: Array<{ claim: string; evidenceVcId?: string; verificationDetails?: string }>;
    energyLabel?: string;
    repairabilityScore?: { value: number; scale: number; reportUrl?: string; vcId?: string };
    recyclabilityInformation?: { instructionsUrl?: string; recycledContentPercentage?: number; designForRecycling?: boolean; vcId?: string };
    specifications?: string; 
    customAttributes?: CustomAttribute[];
    keyCompliancePoints?: string; 
  };
}

export interface PublicProductInfo {
  passportId: string;
  productName: string;
  tagline: string;
  imageUrl: string;
  imageHint?: string;
  productStory: string;
  sustainabilityHighlights: Array<{ iconName?: LucideIconName; text: string }>;
  keyCompliancePoints?: string; 
  manufacturerName: string;
  manufacturerWebsite?: string;
  brandLogoUrl?: string;
  learnMoreLink?: string;
  complianceSummary: string;
  category: string;
  modelNumber: string;
  sku?: string;
  gtin?: string; 
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
  ownershipNftLink?: OwnershipNftLink; 
  contractAddress?: string;
  tokenId?: string;
  onChainStatus?: string; 
  onChainLifecycleStage?: string; 
  textileInformation?: TextileInformation;
  constructionProductInformation?: ConstructionProductInformation;
  batteryRegulation?: BatteryRegulationDetails; 
  conflictMineralsReportUrl?: string; 
  fairTradeCertificationId?: string; 
  ethicalSourcingPolicyUrl?: string; 
  productDetails?: { 
    esprSpecifics?: EsprSpecifics;
    carbonFootprint?: CarbonFootprintData; // Added for Task 3
    conflictMineralsReportUrl?: string;
    fairTradeCertificationId?: string;
    ethicalSourcingPolicyUrl?: string;
  };
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
  keyCompliancePoints?: string; 
  energyLabel?: string;
  specifications?: string; 
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
  ownershipNftLink?: OwnershipNftLink; 
  metadata?: Partial<DigitalProductPassport['metadata']>; 
  textileInformation?: TextileInformation;
  constructionProductInformation?: ConstructionProductInformation;
  batteryRegulation?: BatteryRegulationDetails; 
  conflictMineralsReportUrl?: string; 
  fairTradeCertificationId?: string; 
  ethicalSourcingPolicyUrl?: string; 
  productDetails?: { 
    esprSpecifics?: EsprSpecifics;
    carbonFootprint?: CarbonFootprintData; // Added for Task 3
    conflictMineralsReportUrl?: string;
    fairTradeCertificationId?: string;
    ethicalSourcingPolicyUrl?: string;
  };
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
  error?: string; 
}

export interface UpdateTokenMetadataResponse {
  tokenId: string;
  contractAddress: string;
  transactionHash: string;
  message?: string;
  error?: string; 
}

export interface TokenStatusResponse {
  tokenId: string;
  contractAddress: string;
  ownerAddress: string;
  mintedAt: string; 
  metadataUri?: string | null;
  lastTransactionHash?: string | null;
  status: string; 
  message?: string;
}

// Extended for Task 23
export type InitialProductFormData = Omit<ProductFormData, 'productDetailsOrigin' | 'batteryRegulationOrigin'> & {
  productNameOrigin?: 'AI_EXTRACTED' | 'manual';
  productDescriptionOrigin?: 'AI_EXTRACTED' | 'manual';
  manufacturerOrigin?: 'AI_EXTRACTED' | 'manual';
  modelNumberOrigin?: 'AI_EXTRACTED' | 'manual';
  materialsOrigin?: 'AI_EXTRACTED' | 'manual';
  sustainabilityClaimsOrigin?: 'AI_EXTRACTED' | 'manual';
  keyCompliancePointsOrigin?: 'AI_EXTRACTED' | 'manual';
  specificationsOrigin?: 'AI_EXTRACTED' | 'manual';
  energyLabelOrigin?: 'AI_EXTRACTED' | 'manual';
  imageUrlOrigin?: 'AI_EXTRACTED' | 'manual';
  batteryRegulationOrigin?: any; 
  productDetailsOrigin?: any;
  blockchainIdentifiers?: DigitalProductPassport['blockchainIdentifiers'];
};


