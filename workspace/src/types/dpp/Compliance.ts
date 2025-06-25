
// --- File: Compliance.ts ---
// Description: Compliance related type definitions.
import type React from 'react';

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string; // ISO Date string
  expiryDate?: string; // ISO Date string
  vcId?: string;
  documentUrl?: string;
  standard?: string;
  transactionHash?: string;
}

export interface EbsiVerificationDetails {
  status: 'verified' | 'pending_verification' | 'not_verified' | 'error' | 'N/A';
  verificationId?: string;
  issuerDid?: string;
  schema?: string;
  issuanceDate?: string; // ISO Date string
  lastChecked: string; // ISO Date string
  message?: string;
}

export interface ScipNotificationDetails {
  status?: 'Notified' | 'Pending Notification' | 'Not Required' | 'Error' | 'N/A' | string;
  notificationId?: string;
  svhcListVersion?: string;
  submittingLegalEntity?: string;
  articleName?: string;
  primaryArticleId?: string;
  safeUseInstructionsLink?: string; // Should be a URL
  lastChecked?: string;
}

export interface EuCustomsDataDetails {
  status?: 'Verified' | 'Pending Documents' | 'Mismatch' | 'Cleared' | 'N/A' | 'CBAM Relevant - Verified' | 'CBAM Relevant - Pending' | string;
  declarationId?: string;
  hsCode?: string;
  countryOfOrigin?: string; // ISO 3166-1 Alpha-2
  netWeightKg?: number | null;
  grossWeightKg?: number | null;
  customsValuation?: {
    value?: number | null;
    currency?: string; // ISO 4217
  };
  cbamGoodsIdentifier?: string;
  lastChecked?: string;
}

export interface CarbonFootprintData {
  value?: number | null;
  unit?: string;
  calculationMethod?: string;
  scope1Emissions?: number | null;
  scope2Emissions?: number | null;
  scope3Emissions?: number | null;
  dataSource?: string;
  vcId?: string;
}

export interface RecycledContentData {
  material?: string;
  percentage?: number | null;
  source?: 'Pre-consumer' | 'Post-consumer' | 'Mixed' | 'Unknown' | string;
  vcId?: string;
}

export interface StateOfHealthData {
  value?: number | null;
  unit?: string;
  measurementDate?: string;
  measurementMethod?: string;
  vcId?: string;
}

export interface BatteryRegulationDetails {
  status?: 'compliant' | 'non_compliant' | 'pending' | 'not_applicable' | string;
  batteryChemistry?: string;
  batteryPassportId?: string;
  ratedCapacityAh?: number | null;
  nominalVoltage?: number | null;
  expectedLifetimeCycles?: number | null;
  manufacturingDate?: string;
  manufacturerName?: string;
  carbonFootprint?: CarbonFootprintData;
  recycledContent?: RecycledContentData[];
  stateOfHealth?: StateOfHealthData;
  recyclingEfficiencyRate?: number | null;
  materialRecoveryRates?: {
    cobalt?: number | null;
    lead?: number | null;
    lithium?: number | null;
    nickel?: number | null;
  };
  dismantlingInformationUrl?: string;
  safetyInformationUrl?: string;
  vcId?: string;
}

export interface EsprSpecifics {
  durabilityInformation?: string;
  repairabilityInformation?: string;
  recycledContentSummary?: string;
  energyEfficiencySummary?: string;
  substanceOfConcernSummary?: string;
}

export interface DigitalTwinData {
  uri?: string;
  sensorDataEndpoint?: string;
  realTimeStatus?: string;
  predictiveMaintenanceAlerts?: string;
}


export interface ComplianceDetailItem {
  regulationName: string;
  status: 'Compliant' | 'Non-Compliant' | 'Pending' | 'Not Applicable' | 'In Progress' | 'Data Incomplete' | 'Registered' | 'Verified' | 'Notified' | 'Pending Notification' | 'Not Required' | 'Pending Documents' | 'Mismatch' | 'Cleared' | 'Conformant' | 'Non-Conformant' | 'Pending Assessment' | 'Error' | 'Data Mismatch' | 'Product Not Found in EPREL' | 'Synced Successfully' | string;
  detailsUrl?: string;
  verificationId?: string;
  lastChecked: string; // ISO Date string
  notes?: string;
}

export interface ProductComplianceSummary {
  overallStatus: 'Compliant' | 'Non-Compliant' | 'Pending Review' | 'N/A' | 'Data Incomplete' | 'Flagged' | string;
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
  scip?: ScipNotificationDetails;
  euCustomsData?: EuCustomsDataDetails;
  battery?: BatteryRegulationDetails;
  specificRegulations?: ComplianceDetailItem[];
}

export interface SimpleCertification {
  id: string;
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

export interface FiberCompositionEntry {
  fiberName: string;
  percentage: number | null;
}

export interface TextileInformation {
  fiberComposition?: FiberCompositionEntry[];
  countryOfOriginLabeling?: string;
  careInstructionsUrl?: string;
  isSecondHand?: boolean;
}

export interface EssentialCharacteristic {
  characteristicName: string;
  value: string;
  unit?: string;
  testMethod?: string;
}

export interface ConstructionProductInformation {
  declarationOfPerformanceId?: string;
  ceMarkingDetailsUrl?: string;
  intendedUseDescription?: string;
  essentialCharacteristics?: EssentialCharacteristic[];
}

export interface TransitProduct {
  id: string;
  name: string;
  category?: string;
  stage: string;
  eta: string;
  dppStatus: ProductComplianceSummary['overallStatus'];
  transport: "Ship" | "Truck" | "Plane";
  origin: string;
  destination: string;
}

export interface CustomsAlert {
  id: string;
  productId: string;
  message: string;
  severity: "High" | "Medium" | "Low";
  timestamp: string;
  regulation?: string;
}

export interface InspectionEvent {
  id: string;
  icon: React.ElementType;
  title: string;
  timestamp: string;
  description: string;
  status: "Completed" | "Action Required" | "Upcoming" | "In Progress" | "Delayed" | "Cancelled";
  badgeVariant?: "outline" | "default" | "destructive" | "secondary" | null | undefined;
}

export interface ServiceJob {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  location: string;
  issue: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled';
  priority: 'High' | 'Medium' | 'Low';
  scheduledDate: string; // ISO string
  assignedTechnician?: string;
  notes?: string;
}

```
- workspace/src/types/dpp/index.ts:
```ts

export * from './Lifecycle';
export * from './Compliance';
export * from './Product';
// Explicitly re-export constants from Product.ts
export { USER_PRODUCTS_LOCAL_STORAGE_KEY, USER_SUPPLIERS_LOCAL_STORAGE_KEY, TRACKED_PRODUCTS_STORAGE_KEY } from './Product';
// Ensure all necessary types are exported
export type { 
    CustomsAlert, 
    InspectionEvent, 
    BatteryRegulationDetails, 
    EsprSpecifics, 
    CarbonFootprintData,
    DigitalTwinData,
    ServiceJob
} from './Compliance';

```
- workspace/src/data/mockTransitProducts.ts:
```ts
// --- File: src/data/mockTransitProducts.ts ---
import type { TransitProduct } from '@/types/dpp';

export const MOCK_TRANSIT_PRODUCTS: TransitProduct[] = [
  { id: "DPP001", name: "EcoSmart Refrigerator X500", category: "Appliances", stage: "Cleared - Inland Transit (DE)", eta: "2024-08-02", dppStatus: "Compliant", transport: "Truck", origin: "Gdansk, Poland", destination: "Berlin, Germany" },
  { id: "DPP002", name: "Sustainable Cotton T-Shirt", category: "Apparel", stage: "At Customs (Rotterdam, NL)", eta: "2024-08-05", dppStatus: "Pending Review", transport: "Ship", origin: "Mumbai, India", destination: "Paris, France" },
  { id: "DPP003", name: "Recycled Polymer Phone Case", category: "Accessories", stage: "Airborne - Approaching EU", eta: "2024-08-08", dppStatus: "Compliant", transport: "Plane", origin: "Shenzhen, China", destination: "Frankfurt, Germany" },
  { id: "DPP004", name: "Modular Sofa System", category: "Furniture", stage: "Awaiting Customs Clearance (Antwerp, BE)", eta: "2024-08-01", dppStatus: "Pending Review", transport: "Ship", origin: "Ho Chi Minh City, Vietnam", destination: "Lyon, France" },
  { id: "DPP005", name: "High-Performance EV Battery", category: "Automotive Parts", stage: "Pre-Arrival Notification Submitted (Bremerhaven, DE)", eta: "2024-08-15", dppStatus: "Pending Review", transport: "Ship", origin: "Newark, United States", destination: "Stuttgart, Germany" },
  { id: "DPP006", name: "EcoSmart Insulation Panel R50", category: "Construction Materials", stage: "At Port of Entry (Zeebrugge, BE)", eta: "2024-08-20", dppStatus: "Compliant", transport: "Ship", origin: "Factory, Belgium", destination: "Construction Site, United Kingdom" },
  { id: "PROD789", name: "Smart Thermostat G3", category: "Electronics", stage: "Approaching EU Border (Hamburg)", eta: "2024-08-10", dppStatus: "Compliant", transport: "Ship", origin: "Shanghai, China", destination: "Munich, Germany" },
  { id: "PROD101", name: "Luxury Handbags Batch B", category: "Fashion Accessories", stage: "Flagged for Inspection (CDG Airport)", eta: "2024-08-03", dppStatus: "Non-Compliant", transport: "Plane", origin: "Milan, Italy", destination: "New York, United States (Transit EU)"},
  { id: "PROD222", name: "Pharmaceutical Batch Z", category: "Healthcare", stage: "Awaiting Final Clearance (FRA Airport)", eta: "2024-08-06", dppStatus: "Compliant", transport: "Plane", origin: "Zurich, Switzerland", destination: "London, United Kingdom"},
  { id: "PROD333", name: "Industrial Machinery Parts", category: "Industrial Equipment", stage: "Customs Declaration Submitted", eta: "2024-08-12", dppStatus: "Pending Review", transport: "Truck", origin: "Prague, Czechia", destination: "Madrid, Spain"},
  { id: "PROD800", name: "Vintage Electronics Lot", category: "Electronics", stage: "Delayed at Customs (Antwerp)", eta: "2024-07-25", dppStatus: "Non-Compliant", transport: "Ship", origin: "Hong Kong", destination: "Brussels, Belgium" },
  { id: "PROD801", name: "Fresh Flowers Batch", category: "Agriculture", stage: "Arrived at Airport (AMS)", eta: new Date().toISOString().split('T')[0], dppStatus: "Pending Review", transport: "Plane", origin: "Nairobi, Kenya", destination: "Amsterdam, Netherlands" },
];
