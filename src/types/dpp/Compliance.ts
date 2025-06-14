
// --- File: Compliance.ts ---
// Description: Compliance related type definitions.

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
  lastChecked?: string; // Not a form field, for display
}

export interface EuCustomsDataDetails {
  status?: 'Verified' | 'Pending Documents' | 'Mismatch' | 'Cleared' | 'N/A' | string;
  declarationId?: string;
  hsCode?: string;
  countryOfOrigin?: string; // ISO 3166-1 Alpha-2
  netWeightKg?: number | null;
  grossWeightKg?: number | null;
  customsValuation?: {
    value?: number | null;
    currency?: string; // ISO 4217
  };
  lastChecked?: string; // Not a form field, for display
}

export interface CarbonFootprintData {
  value?: number | null; // Total manufacturing CF or relevant scope value
  unit?: string; // e.g., kg CO2e/kWh, kg CO2e/battery
  calculationMethod?: string; // e.g., PEFCR, ISO 14067
  scope1Emissions?: number | null; // tCO2e
  scope2Emissions?: number | null; // tCO2e (location-based)
  scope3Emissions?: number | null; // tCO2e (relevant categories)
  dataSource?: string; // e.g., "Primary data from factory", "Ecoinvent 3.8"
  vcId?: string;
}

export interface RecycledContentData {
  material?: 'Cobalt' | 'Lead' | 'Lithium' | 'Nickel' | 'Other' | string; // Specific materials for battery reg
  percentage?: number | null;
  source?: 'Pre-consumer' | 'Post-consumer' | 'Mixed';
  vcId?: string;
}

export interface StateOfHealthData {
  value?: number | null; // Typically percentage
  unit?: string; // e.g., "%"
  measurementDate?: string; // ISO Date string
  measurementMethod?: string; // e.g., "Direct Measurement", "Estimation Algorithm v1.2"
  vcId?: string;
}

export interface BatteryRegulationDetails {
  status?: 'compliant' | 'non_compliant' | 'pending' | 'not_applicable' | string;
  batteryChemistry?: string;
  batteryPassportId?: string; // Unique ID for the battery passport
  ratedCapacityAh?: number | null; // Ampere-hours
  nominalVoltage?: number | null; // Volts
  expectedLifetimeCycles?: number | null; // e.g., at 80% DoD
  manufacturingDate?: string; // ISO Date string
  manufacturerName?: string; // Could be different from overall product manufacturer
  carbonFootprint?: CarbonFootprintData;
  recycledContent?: RecycledContentData[];
  stateOfHealth?: StateOfHealthData;
  recyclingEfficiencyRate?: number | null; // Percentage
  materialRecoveryRates?: { // Recovery rates for specific materials
    cobalt?: number | null; // Percentage
    lead?: number | null;   // Percentage
    lithium?: number | null; // Percentage
    nickel?: number | null;  // Percentage
  };
  dismantlingInformationUrl?: string;
  safetyInformationUrl?: string;
  vcId?: string; // Overall VC for battery regulation compliance
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
    lastChecked: string; // ISO Date string
  };
  ebsi?: {
    status: 'Verified' | 'Pending' | 'Not Verified' | 'Error' | 'N/A' | string;
    verificationId?: string;
    transactionUrl?: string;
    lastChecked: string; // ISO Date string
  };
  scip?: ScipNotificationDetails;
  euCustomsData?: EuCustomsDataDetails;
  battery?: BatteryRegulationDetails;
  specificRegulations?: ComplianceDetailItem[];
}

export interface SimpleCertification {
  id: string; // Made non-optional
  name: string;
  authority: string;
  standard?: string;
  issueDate: string; // ISO Date string
  expiryDate?: string; // ISO Date string
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
  percentage: number | null; // Allow null for form input
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

