
// --- File: page.tsx (Private Layer Architecture Docs) ---
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Layers3, ShieldAlert, Lock, Share2, Info, FileText, ExternalLink } from "lucide-react";
import DocsPageLayout from '@/components/developer/DocsPageLayout';

export default function PrivateLayerArchitecturePage() {
  return (
    <DocsPageLayout
      pageTitle="Private Layer Architecture (Conceptual)"
      pageIcon="Layers3" // Using Layers3 for a multi-layer feel
      backLink="/developer/docs"
      backLinkText="Back to Docs Hub"
      alertTitle="Conceptual Framework"
      alertDescription="This document outlines the conceptual architecture for a private data layer within the Norruva DPP platform, focusing on managing sensitive B2B data and its potential interaction with the public layer."
    >
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Lock className="mr-2 h-5 w-5 text-primary"/>The Need for a Private Layer</CardTitle>
          <CardDescription>
            While public Digital Product Passports enhance transparency, certain supply chain and detailed product data may be too sensitive or proprietary for full public disclosure. A private layer addresses this need.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            A conceptual private layer in the Norruva platform would allow permissioned stakeholders (e.g., manufacturers, direct suppliers, auditors under NDA) to securely share and manage more granular data that underpins the claims made in the public DPP.
          </p>
          <p>Key objectives for a private layer include:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Protecting Sensitive Data:</strong> Safeguarding intellectual property, detailed costings, specific batch numbers, or confidential audit results.</li>
            <li><strong>Enabling Detailed B2B Collaboration:</strong> Facilitating secure data exchange between trusted partners in the supply chain.</li>
            <li><strong>Supporting Deep Audits:</strong> Providing auditors with access to comprehensive data for thorough verification, beyond what's publicly available.</li>
            <li><strong>Foundation for Verifiable Claims:</strong> Acting as the source of truth from which public, verifiable claims (e.g., using Verifiable Credentials or ZKPs) can be derived.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><FileText className="mr-2 h-5 w-5 text-primary"/>Conceptual Data Models for Private Layer</CardTitle>
          <CardDescription>
            The types of data envisioned for the private layer are detailed in a separate document within the project.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            We've outlined several conceptual data structures that might reside on this private layer. These include:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Detailed Supplier Attestations (e.g., specific batch compliance, ethical sourcing evidence).</li>
            <li>Internal B2B Component Transfer Records (tracking parts between verified entities).</li>
            <li>Confidential Material Composition Details (e.g., proprietary alloy formulas).</li>
          </ul>
           <p className="text-sm text-muted-foreground mt-2">
            For detailed conceptual data models, please refer to the <code className="bg-muted px-1 py-0.5 rounded-sm">docs/private-layer-data-concepts.md</code> file in the project repository.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><ShieldAlert className="mr-2 h-5 w-5 text-primary"/>Private Layer API Endpoints (Conceptual)</CardTitle>
          <CardDescription>
            To interact with this private data, a set of secure, permissioned API endpoints would be necessary. We've designed mock endpoints in our OpenAPI specification:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">
            These conceptual endpoints (prefixed with <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/private/</code>) would require robust authentication and authorization mechanisms beyond standard API key access, potentially involving mutual TLS, OAuth 2.0 client credentials, or attribute-based access control.
          </p>
          <p className="text-sm">Example mock endpoints include:</p>
          <ul className="list-disc list-inside space-y-1.5 text-sm">
            <li>
              <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">GET /api/v1/private/dpp/{"{productId}"}/supplier/{"{supplierId}"}/attestations</code>: Retrieves detailed attestations from a specific supplier for a product. (A mock of this is implemented).
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">POST /api/v1/private/dpp/{"{productId}"}/component-transfer</code>: Records a private transfer of a component. (A mock of this endpoint is also implemented and available for testing in the <Link href="/developer#playground" className="text-primary hover:underline">API Playground</Link> under "Private Layer Endpoints").
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">GET /api/v1/private/dpp/{"{productId}"}/confidential-materials</code>: Fetches confidential material composition data.
            </li>
          </ul>
          <Button variant="link" asChild className="p-0 h-auto text-sm">
            <a href="/openapi.yaml" target="_blank" rel="noopener noreferrer">
                View in OpenAPI Specification <ExternalLink className="ml-1 h-3 w-3"/>
            </a>
          </Button>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Share2 className="mr-2 h-5 w-5 text-primary"/>Bridging Private and Public Layers</CardTitle>
          <CardDescription>
            A key architectural challenge is ensuring sensitive data remains private while still enabling public verification of relevant claims.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            The private layer acts as the "source of truth" for detailed information. The public layer can then present summaries or proofs derived from this private data without exposing all underlying details.
          </p>
          <p>Conceptual mechanisms include:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Verifiable Credentials (VCs):</strong> A supplier might issue a VC (anchored on EBSI) stating "Component X is >50% recycled content" based on detailed batch data stored in their private system, which is linked to the DPP via the private layer APIs.</li>
            <li><strong>Zero-Knowledge Proofs (ZKPs - Advanced):</strong> For highly sensitive data, ZKPs could prove a specific claim (e.g., "This product contains no substances from conflict minerals list X") without revealing the full bill of materials or specific sourcing locations from the private layer.</li>
            <li><strong>Aggregated & Anonymized Data:</strong> The platform could (conceptually) aggregate data from multiple private DPP interactions to provide anonymized industry benchmarks or trends on the public layer.</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            This tiered approach aims to balance transparency with confidentiality, meeting both regulatory demands and business needs. The Norruva platform's private layer APIs are the first step in enabling such secure data interactions.
          </p>
        </CardContent>
      </Card>
    </DocsPageLayout>
  );
}


