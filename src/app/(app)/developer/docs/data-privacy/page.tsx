
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, VenetianMask, FileText, Trash2, DownloadCloud, KeyRound, Globe, Activity, ShieldCheck as ShieldCheckIcon } from "lucide-react";
import Link from "next/link";
import DocsPageLayout from '@/components/developer/DocsPageLayout';

export default function DataPrivacyPage() {
  return (
    <DocsPageLayout
      pageTitle="Data Privacy, Security & Compliance"
      pageIcon={VenetianMask}
      alertTitle="Conceptual Documentation"
      alertDescription="This document outlines conceptual approaches to data privacy, security, and broader compliance within the Norruva DPP platform. Actual implementation details would require legal and technical review."
    >
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Introduction</CardTitle>
          <CardDescription>
            The Norruva Digital Product Passport (DPP) platform is designed with data privacy, security, and compliance with regulations like GDPR as fundamental considerations. This guide outlines our conceptual approach to handling personal data, ensuring data subject rights, and maintaining a robust security posture.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            While DPPs primarily focus on product-specific data, they can intersect with personal data related to manufacturers, suppliers, consumers, or platform users. Ensuring the robust protection of any such personal data, alongside the integrity and verifiability of product data, is paramount.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><UserCheck className="mr-2 h-5 w-5 text-primary"/>Key GDPR Principles & Norruva's Approach</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="font-semibold text-lg mb-1">Lawfulness, Fairness, and Transparency</h3>
            <p className="text-sm">Personal data processing will have a clear legal basis. Users and data subjects will be informed about how their data is processed. The platform facilitates transparency by allowing users to manage their consent preferences for certain data processing activities via the <Link href="/gdpr" className="text-primary hover:underline">GDPR Management Page</Link>.</p>
          </section>
          <section>
            <h3 className="font-semibold text-lg mb-1">Purpose Limitation & Data Minimization</h3>
            <p className="text-sm">Personal data collected will be for specified, explicit, and legitimate purposes related to DPP creation, management, and compliance. We aim to collect only the data necessary for these purposes.</p>
          </section>
          <section>
            <h3 className="font-semibold text-lg mb-1">Accuracy</h3>
            <p className="text-sm">Reasonable steps will be taken to ensure personal data is accurate and kept up to date. Users may have mechanisms to update their information.</p>
          </section>
          <section>
            <h3 className="font-semibold text-lg mb-1">Integrity and Confidentiality (Security)</h3>
            <p className="text-sm">Appropriate technical and organizational measures are conceptualized to protect personal data against unauthorized or unlawful processing and against accidental loss, destruction, or damage. This includes HTTPS for data in transit, secure (mock) storage, and role-based access controls. API access is managed via <Link href="/developer/docs/authentication" className="text-primary hover:underline">API keys</Link>.</p>
          </section>
          <section>
            <h3 className="font-semibold text-lg mb-1">Accountability</h3>
            <p className="text-sm">The platform aims to maintain records of data processing activities and implement policies that demonstrate compliance.</p>
          </section>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><FileText className="mr-2 h-5 w-5 text-primary"/>Data Subject Rights</CardTitle>
          <CardDescription>
            The Norruva platform conceptually supports data subject rights under GDPR. Users can manage aspects of their data via the <Link href="/gdpr" className="text-primary hover:underline">GDPR Management Page</Link>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium">Right of Access & Right to Rectification</h4>
            <p className="text-sm text-muted-foreground">Users can (conceptually) view and request corrections to their personal data managed by the platform.</p>
          </div>
          <div>
            <h4 className="font-medium flex items-center"><Trash2 className="mr-1.5 h-4 w-4 text-destructive"/>Right to Erasure ('Right to be Forgotten')</h4>
            <p className="text-sm text-muted-foreground">Users can request the deletion of their personal data, subject to legal and contractual obligations. The <Link href="/gdpr" className="text-primary hover:underline">GDPR Management Page</Link> provides a mock interface for this.</p>
          </div>
          <div>
            <h4 className="font-medium flex items-center"><DownloadCloud className="mr-1.5 h-4 w-4 text-accent"/>Right to Data Portability</h4>
            <p className="text-sm text-muted-foreground">Users can request their personal data in a structured, commonly used, and machine-readable format. The <Link href="/gdpr" className="text-primary hover:underline">GDPR Management Page</Link> provides a mock interface for this.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><ShieldCheckIcon className="mr-2 h-5 w-5 text-primary"/>Broader Compliance & Security Posture (Conceptual)</CardTitle>
          <CardDescription>Our platform is designed with a comprehensive approach to security and regulatory alignment.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h3 className="font-semibold text-md mb-1 flex items-center"><Globe className="mr-2 h-4 w-4 text-accent"/>EBSI Integration for Verifiable Credentials</h3>
            <p className="text-sm text-muted-foreground">
              The Norruva platform's conceptual integration with EBSI (European Blockchain Services Infrastructure) aims to support Verifiable Credentials (VCs). This enhances data integrity, trust, and interoperability for DPPs, allowing for secure and tamper-proof sharing of product claims and attestations.
              More details can be found in our <Link href="/developer/docs/ebsi-integration" className="text-primary hover:underline">EBSI Integration Overview</Link>.
            </p>
          </section>
          <section>
            <h3 className="font-semibold text-md mb-1 flex items-center"><Activity className="mr-2 h-4 w-4 text-accent"/>CSRD &amp; EU Taxonomy Alignment</h3>
            <p className="text-sm text-muted-foreground">
              We aim to structure DPP data and provide API capabilities to help businesses align with the Corporate Sustainability Reporting Directive (CSRD) and the EU Taxonomy. This includes tracking relevant environmental, social, and governance (ESG) metadata associated with products. Future API endpoints may facilitate audit reporting for these regulations. (Conceptual)
            </p>
          </section>
           <section>
            <h3 className="font-semibold text-md mb-1 flex items-center"><KeyRound className="mr-2 h-4 w-4 text-accent"/>Secure API Design &amp; Data Handling</h3>
            <p className="text-sm text-muted-foreground">
              All Norruva APIs are conceptually designed with security and GDPR principles at their core, including data minimization and purpose limitation. We envision using encrypted payloads for sensitive data in transit and architecting our backend with SOC2-readiness as a goal to ensure robust data protection.
            </p>
          </section>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><VenetianMask className="mr-2 h-5 w-5 text-primary"/>QR Codes &amp; Data Privacy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            QR codes generated by or for the Norruva platform are designed to link to secure endpoints (HTTPS). They <strong>do not</strong> embed sensitive personal data directly. Access to detailed or private information through these links requires appropriate authentication and authorization, ensuring that only permitted data is visible based on the user's role and permissions. This aligns with privacy-by-design principles.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Developer Responsibilities</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Developers building applications that integrate with or utilize the Norruva DPP API must also uphold their responsibilities under GDPR and other relevant data privacy laws. Key considerations include:
          </p>
          <ul className="list-disc list-inside text-sm space-y-1.5 mt-3 text-muted-foreground">
            <li>Securely managing API keys and access credentials as detailed in our <Link href="/developer/docs/authentication" className="text-primary hover:underline">Authentication Guide</Link>.</li>
            <li>Implementing appropriate consent mechanisms if your application collects or processes personal data from users.</li>
            <li>Ensuring any personal data processed or stored within your own systems is handled securely, in line with data minimization principles, and only for legitimate purposes.</li>
            <li>Respecting data subject rights for data under your control, providing mechanisms for users to exercise their rights.</li>
            <li>Clearly communicating your application's data privacy practices to your users through a comprehensive privacy policy.</li>
            <li>Understanding and adhering to the data access and usage policies defined by the Norruva platform, especially when handling sensitive product or compliance information retrieved via the API.</li>
          </ul>
        </CardContent>
      </Card>
    </DocsPageLayout>
  );
}
