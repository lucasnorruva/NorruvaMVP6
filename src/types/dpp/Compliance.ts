
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

export interface ComplianceDetailItem {
  regulationName: string;
  status: 'Compliant' | 'Non-Compliant' | 'Pending' | 'Not Applicable' | 'In Progress' | 'Data Incomplete' | 'Registered' | 'Verified' | 'Notified' | 'Pending Notification' | 'Not Required' | 'Pending Documents' | 'Mismatch' | 'Cleared' | 'Conformant' | 'Non-Conformant' | 'Pending Assessment' | 'Error' | 'Data Mismatch' | 'Product Not Found in EPREL' | 'Synced Successfully' | string; // Made string more open
  detailsUrl?: string;
  verificationId?: string; // Can be EPREL ID, SCIP Notification ID, Customs Declaration ID, Assessment ID etc.
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
  scip?: { // SCIP API integration
    status: 'Notified' | 'Pending Notification' | 'Not Required' | 'Error' | 'N/A' | string;
    notificationId?: string;
    lastChecked: string; // ISO Date string
  };
  euCustomsData?: { // EU Customs Data Model integration
    status: 'Verified' | 'Pending Documents' | 'Mismatch' | 'Cleared' | 'N/A' | string;
    declarationId?: string;
    lastChecked: string; // ISO Date string
  };
  specificRegulations?: ComplianceDetailItem[];
}

export interface SimpleCertification {
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

