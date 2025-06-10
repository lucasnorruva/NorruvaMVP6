// --- File: Compliance.ts ---
// Description: Compliance related type definitions.

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

export interface EbsiVerificationDetails {
  status: 'verified' | 'pending_verification' | 'not_verified' | 'error';
  verificationId?: string;
  lastChecked: string;
  message?: string;
}

export interface ComplianceDetailItem {
  regulationName: string;
  status: 'Compliant' | 'Non-Compliant' | 'Pending' | 'Not Applicable' | 'In Progress' | 'Data Incomplete' | string;
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
  specificRegulations?: ComplianceDetailItem[];
}

export interface SimpleCertification {
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
