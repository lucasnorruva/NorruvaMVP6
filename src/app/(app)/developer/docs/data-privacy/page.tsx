
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, UserCheck, Info, VenetianMask, FileText, Trash2, DownloadCloud } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DataPrivacyPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <VenetianMask className="mr-3 h-7 w-7 text-primary" />
          Data Privacy & GDPR Compliance
        </h1>
        <Button variant="outline" asChild>
            <Link href="/developer">Back to Developer Portal</Link>
        </Button>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Conceptual Documentation</AlertTitle>
        <AlertDescription>
          This document outlines conceptual approaches to data privacy and GDPR compliance within the Norruva DPP platform. Actual implementation details would require legal and technical review.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Introduction</CardTitle>
          <CardDescription>
            The Norruva Digital Product Passport (DPP) platform is designed with data privacy and compliance with regulations like GDPR at its core. This guide outlines our conceptual approach to handling personal data and ensuring data subject rights.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Digital Product Passports, while primarily focused on product data, may involve processing personal data related to manufacturers, suppliers, consumers (e.g., warranty registration, repair history), or platform users. Protecting this data is paramount.
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
          <CardTitle className="flex items-center"><ShieldAlert className="mr-2 h-5 w-5 text-primary"/>QR Codes & Data Privacy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            QR codes generated by or for the Norruva platform are designed to link to secure endpoints (HTTPS). They <strong>do not</strong> embed sensitive personal data directly. Access to detailed or private information through these links requires appropriate authentication and authorization, ensuring that only permitted data is visible.
          </p>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Developer Responsibilities</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Developers integrating with the Norruva DPP API are also responsible for ensuring their applications handle personal data in compliance with GDPR and other applicable data privacy regulations. This includes managing user consent, securing API keys, and respecting data subject rights for any data processed within their own systems.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
