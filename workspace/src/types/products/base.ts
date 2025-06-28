// src/types/products/base.ts
/**
 * Base product types with comprehensive type safety
 */

// Base utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Status enums for better type safety
export enum ProductStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PENDING = 'pending',
  ARCHIVED = 'archived',
  RECALLED = 'recalled',
}

export enum ComplianceStatus {
  COMPLIANT = 'compliant',
  NON_COMPLIANT = 'non_compliant',
  PENDING = 'pending',
  NOT_APPLICABLE = 'not_applicable',
}

export enum LifecycleStage {
  DESIGN = 'design',
  MANUFACTURING = 'manufacturing',
  DISTRIBUTION = 'distribution',
  IN_USE = 'in_use',
  MAINTENANCE = 'maintenance',
  END_OF_LIFE = 'end_of_life',
}

// Data origin tracking
export enum DataOrigin {
  AI_EXTRACTED = 'ai_extracted',
  MANUAL = 'manual',
  IMPORTED = 'imported',
  SYSTEM_GENERATED = 'system_generated',
}

// Base interfaces
export interface BaseEntity {
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly version: number;
}

export interface AuditableField<T = string> {
  value: T;
  origin: DataOrigin;
  lastModified: string;
  modifiedBy?: string;
}

// Product identification
export interface ProductIdentifiers {
  readonly id: string;
  gtin?: string;
  sku?: string;
  modelNumber?: string;
  nfcTagId?: string;
  rfidTagId?: string;
}

// Carbon footprint data
export interface CarbonFootprintData {
  value: number | null;
  unit: string;
  calculationMethod?: string;
  scope1Emissions?: number | null;
  scope2Emissions?: number | null;
  scope3Emissions?: number | null;
  dataSource?: string;
  vcId?: string;
  certificationId?: string;
  measurementDate?: string;
}

// Digital Twin information
export interface DigitalTwinData {
  uri?: string;
  sensorDataEndpoint?: string;
  realTimeStatus?: string;
  predictiveMaintenanceAlerts?: string;
  lastSyncDate?: string;
  healthScore?: number;
}

// Ethical sourcing
export interface EthicalSourcingData {
  conflictMineralsReportUrl?: string;
  fairTradeCertificationId?: string;
  ethicalSourcingPolicyUrl?: string;
  supplierCodeOfConductUrl?: string;
  auditReportUrl?: string;
}

// ESPR specific data
export interface EsprSpecifics {
  durabilityInformation?: string;
  repairabilityInformation?: string;
  recycledContentSummary?: string;
  energyEfficiencySummary?: string;
  substanceOfConcernSummary?: string;
  circularityScore?: number;
}

// Material information
export interface MaterialInfo {
  name: string;
  percentage?: number;
  source?: string;
  isRecycled?: boolean;
  sustainabilityCertification?: string;
  origin?: string;
  suppliers?: string[];
}

// Custom attributes
export interface CustomAttribute {
  key: string;
  value: string;
  type?: 'string' | 'number' | 'boolean' | 'date' | 'url';
  isRequired?: boolean;
  category?: string;
}

// Product details with comprehensive tracking
export interface ProductDetails {
  description: AuditableField<string>;
  materials: AuditableField<MaterialInfo[]>;
  sustainabilityClaims: AuditableField<string[]>;
  keyCompliancePoints: AuditableField<string[]>;
  specifications: AuditableField<Record<string, any>>;
  energyLabel: AuditableField<string>;
  imageUrl: AuditableField<string>;
  imageHint?: AuditableField<string>;
  customAttributes: AuditableField<CustomAttribute[]>;
  carbonFootprint?: CarbonFootprintData;
  digitalTwin?: DigitalTwinData;
  ethicalSourcing?: EthicalSourcingData;
  esprSpecifics?: EsprSpecifics;
}

// Main product interface
export interface Product extends BaseEntity, ProductIdentifiers {
  productName: AuditableField<string>;
  manufacturer: AuditableField<string>;
  category: AuditableField<string>;
  status: ProductStatus;
  complianceStatus: ComplianceStatus;
  lifecycleStage: LifecycleStage;
  details: ProductDetails;
  tags: string[];
  metadata: Record<string, any>;
}
