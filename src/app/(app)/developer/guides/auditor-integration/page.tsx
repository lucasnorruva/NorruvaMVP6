
// --- File: page.tsx (Auditor & Verifier Integration Guide) ---
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldCheck, Info, FileSearch, History, Bot, Edit, Database, KeyRound } from "lucide-react";
import DocsPageLayout from '@/components/developer/DocsPageLayout'; // Import the layout

export default function AuditorIntegrationPage() {
  const steps = [
    {
      title: "Accessing DPP Data",
      icon: FileSearch,
      description: "Auditors and verifiers can access Digital Product Passport data through dedicated API endpoints (with appropriate permissions) or via a specialized Verifier Dashboard (conceptual). This ensures access to the latest, most accurate product information.",
      links: [
        { href: "/developer/docs/api-reference", text: "Explore API Reference" },
        { href: "/developer/docs/authentication", text: "Understand API Authentication" }
      ]
    },
    {
      title: "Verifying Claims & Certifications",
      icon: ShieldCheck,
      description: "The platform facilitates verification of product claims and certifications. This includes checking against EBSI Verifiable Credentials, reviewing anchored documents, and validating data against source systems (conceptually).",
      links: [
        { href: "/developer/docs/ebsi-integration", text: "Learn about EBSI Integration" },
      ]
    },
    {
      title: "Reviewing Audit Trails & Lifecycle Events",
      icon: History,
      description: "Access immutable audit trails for DPPs, tracking changes, updates, and key lifecycle events. This transparency is crucial for comprehensive audits and ensuring data integrity over time. The platform's Audit Log provides a system-wide view.",
      links: [
         { href: "/audit-log", text: "View System Audit Log (Conceptual)" }
      ]
    },
    {
      title: "Utilizing Compliance Tools & AI Co-Pilot",
      icon: Bot,
      description: "Leverage built-in compliance tools and the AI Co-Pilot to check DPP data against specific regulatory requirements (e.g., ESPR, Battery Regulation). The Co-Pilot can assist in interpreting complex regulations.",
      links: [
        { href: "/copilot", text: "Access AI Compliance Co-Pilot" },
        { href: "/developer/docs/regulatory-alignment", text: "Regulatory Alignment Details" }
      ]
    },
    {
      title: "Reporting & Attestation Workflow",
      icon: Edit,
      description: "The platform aims to support workflows for auditors to submit verification reports or attestations. This might involve dedicated API endpoints for report submission or features within a Verifier Portal (conceptual).",
    },
    {
      title: "Secure Data Handling & Access Control",
      icon: KeyRound,
      description: "Auditors are expected to handle all accessed data securely and in compliance with data privacy regulations like GDPR. Role-based access control within the platform ensures that verifiers only access data relevant to their scope.",
      links: [
        { href: "/developer/docs/data-privacy", text: "Data Privacy & GDPR Guide" }
      ]
    }
  ];

  return (
    <DocsPageLayout
      pageTitle="Auditor & Verifier Integration Guide"
      pageIcon="ShieldCheck"
      backLink="/developer/docs"
      backLinkText="Back to Docs Hub"
      alertTitle="Conceptual Guide"
      alertDescription="This document conceptually outlines integration points and workflows for auditors and verifiers interacting with the Norruva DPP platform. Features and API endpoints are illustrative."
    >
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Introduction for Auditors & Verifiers</CardTitle>
          <CardDescription>
            The Norruva platform is designed to enhance transparency and trust in product data. This guide helps auditors and verifiers understand how to leverage the platform for their verification and attestation processes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Our goal is to provide you with reliable access to DPP data, tools for efficient verification, and support for your reporting needs, ultimately contributing to a more compliant and sustainable product ecosystem.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {steps.map((step, index) => (
          <Card key={index} className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <step.icon className="mr-3 h-5 w-5 text-primary" />
                {step.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{step.description}</p>
              {step.links && step.links.length > 0 && (
                <div className="space-y-1 mt-2">
                  {step.links.map(l => (
                    <Button key={l.href} variant="link" asChild className="p-0 h-auto text-sm block">
                      <Link href={l.href}>{l.text}</Link>
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="text-lg flex items-center"><Database className="mr-2 h-5 w-5 text-primary"/>Data Access Tiers (Conceptual)</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
                Auditors and Verifiers may have different levels of access based on their engagement and authorization:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                <li><strong>Public Data Access:</strong> Available via public DPP viewer and potentially limited API endpoints.</li>
                <li><strong>Permissioned Data Access:</strong> Requires specific API keys or Verifier Portal login, granting access to more detailed compliance information, supply chain data (if authorized by data owner), and sensitive lifecycle events.</li>
                <li><strong>Direct EBSI Interaction:</strong> Verifiers might interact directly with EBSI to validate VCs presented by manufacturers or the platform.</li>
            </ul>
        </CardContent>
      </Card>
    </DocsPageLayout>
  );
}

