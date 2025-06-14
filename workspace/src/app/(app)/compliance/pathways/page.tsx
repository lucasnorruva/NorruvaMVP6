
"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { isEuCountry } from '@/lib/euCountryCodes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, BatteryCharging, Recycle, ShieldAlert, Construction, Database, Globe } from 'lucide-react'; // Added Globe

interface Pathway {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  status: 'active' | 'coming_soon' | 'conceptual';
  euSpecific?: boolean;
}

const pathways: Pathway[] = [
  {
    id: 'battery-regulation',
    title: 'EU Battery Regulation Pathway',
    description: 'Prepare your Digital Battery Passport. Detail battery composition, carbon footprint, performance, due diligence, and end-of-life management as per EU 2023/1542.',
    icon: BatteryCharging,
    href: '/compliance/pathways/battery-regulation',
    status: 'active',
    euSpecific: true,
  },
  {
    id: 'espr',
    title: 'EU ESPR Pathway',
    description: 'Navigate the Ecodesign for Sustainable Products Regulation. Address durability, repairability, recycled content, and information requirements for various product categories.',
    icon: Recycle,
    href: '/compliance/pathways/espr',
    status: 'active',
    euSpecific: true,
  },
  {
    id: 'csrd',
    title: 'CSRD Alignment Guide',
    description: 'Understand how DPP data can support your Corporate Sustainability Reporting Directive obligations, particularly for product-related environmental and social impacts.',
    icon: BookOpen,
    href: '/compliance/pathways/csrd',
    status: 'active',
    euSpecific: true,
  },
  {
    id: 'scip',
    title: 'SCIP Database Notification Helper',
    description: 'Streamline the process of notifying the ECHA SCIP database for products containing Substances of Very High Concern (SVHCs) on the Candidate List.',
    icon: Database,
    href: '/compliance/pathways/scip',
    status: 'active',
    euSpecific: true,
  },
  {
    id: 'cbam',
    title: 'CBAM Reporting Assistant (Conceptual)',
    description: 'Guidance on collecting and managing data for the Carbon Border Adjustment Mechanism. Includes overview of key CBAM data points and how DPPs can assist.',
    icon: Globe, // Changed icon
    href: "/developer/docs/cbam-concepts", // Points to conceptual doc
    status: 'conceptual', // Marked as conceptual
    euSpecific: true,
  },
];

export default function CompliancePathwaysPage() {
  const searchParams = useSearchParams();
  const countryParam = searchParams.get('country');
  const country = countryParam ? decodeURIComponent(countryParam) : null;
  const highlightEU = isEuCountry(country);
  return (
    <div className="space-y-8">
      <div className="text-center">
        <BookOpen className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-headline font-semibold text-primary">Compliance Pathways Navigator</h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Step-by-step guidance, tools, and resources to help you meet specific EU regulations and standards for your Digital Product Passports.
        </p>
        {highlightEU && country && (
          <p className="mt-2">
            <Badge variant="outline">Guidance for {country}</Badge>
          </p>
        )}
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Understanding Compliance Pathways</CardTitle>
          <CardDescription>
            These pathways are designed to simplify the complex landscape of product compliance. Each pathway focuses on a specific regulation, breaking down the requirements into manageable steps and helping you gather the necessary data for your DPPs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            By following these pathways, you can ensure your products not only meet legal obligations but also enhance transparency and build trust with consumers and stakeholders.
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-semibold mb-6 text-center font-headline">Available & Upcoming Pathways</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {pathways.map((pathway) => {
            const linkHref = country && pathway.status !== 'conceptual' // Don't add country to conceptual doc link unless specifically designed for it
                ? `${pathway.href}?country=${encodeURIComponent(country)}` 
                : pathway.href;
            const isExternalLink = pathway.href.startsWith('/developer/docs/');

            return (
            <Card
              key={pathway.id}
              className={`shadow-lg flex flex-col ${pathway.status === 'coming_soon' || pathway.status === 'conceptual' ? 'opacity-70' : ''} ${highlightEU && pathway.euSpecific ? 'ring-2 ring-primary' : ''}`}
            >
              <CardHeader className="flex-shrink-0">
                <div className="flex items-start justify-between">
                  <pathway.icon className="h-10 w-10 text-primary mb-3 flex-shrink-0" />
                  {(pathway.status === 'coming_soon' || pathway.status === 'conceptual') && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 border border-yellow-300 px-2 py-0.5 rounded-full font-medium flex items-center">
                      <Construction className="h-3 w-3 mr-1" /> {pathway.status === 'conceptual' ? 'Conceptual' : 'Coming Soon'}
                    </span>
                  )}
                </div>
                <CardTitle className="text-xl font-headline">{pathway.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground text-sm">{pathway.description}</p>
              </CardContent>
              <div className="p-6 pt-0 mt-auto">
                {pathway.status === 'active' || pathway.status === 'conceptual' ? (
                  <Link href={linkHref} passHref legacyBehavior={isExternalLink ? false : undefined} target={isExternalLink ? "_blank" : undefined} rel={isExternalLink ? "noopener noreferrer" : undefined}>
                    <a className="block">
                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        {pathway.status === 'conceptual' ? 'View Concepts' : 'Start Pathway'} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </a>
                  </Link>
                ) : (
                  <Button className="w-full" disabled>
                    Coming Soon
                  </Button>
                )}
              </div>
            </Card>
            );
          })}
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">General Compliance Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Stay informed about evolving EU regulations and their deadlines.</li>
            <li>Maintain accurate and comprehensive records for all product data.</li>
            <li>Collaborate closely with your supply chain partners to ensure data consistency.</li>
            <li>When in doubt, consult with legal or compliance experts specializing in EU product law.</li>
            <li>Regularly review and update your DPPs as product information or regulations change.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

```
  </change>
  <change>
    <file>/workspace/src/types/dpp/Compliance.ts</file>
    <content><![CDATA[
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
  lastChecked?: string;
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
  cbamGoodsIdentifier?: string; // Added for CBAM
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
  euCustomsData?: EuCustomsDataDetails; // Will now include cbamGoodsIdentifier
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
