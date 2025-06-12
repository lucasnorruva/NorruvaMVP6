
// --- File: page.tsx (Public Layer & EBSI Alignment Docs) ---
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, CheckCircle, KeyRound, FileText, ExternalLink, Info } from "lucide-react";
import Link from "next/link";
import DocsPageLayout from '@/components/developer/DocsPageLayout';

export default function PublicLayerEbsiPage() {
  return (
    <DocsPageLayout
      pageTitle="Public Layer & EBSI Alignment (Conceptual)"
      pageIcon="Share2"
      backLink="/developer/docs"
      backLinkText="Back to Docs Hub"
      alertTitle="Conceptual Framework"
      alertDescription="This document outlines the conceptual approach to the Norruva platform's public layer, focusing on alignment with EBSI principles for verifiable credentials and data interoperability."
    >
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>The Role of the Public Layer</CardTitle>
          <CardDescription>
            The public layer in the Norruva architecture is designed to provide verifiable, transparent, and interoperable information about products, primarily leveraging concepts aligned with the European Blockchain Services Infrastructure (EBSI).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            It aims to facilitate trust by allowing stakeholders (consumers, regulators, businesses) to verify key product claims and data points using standardized mechanisms. This layer complements potentially more private or detailed data managed elsewhere.
          </p>
          <p>
            Key goals of the public layer include:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Interoperability:</strong> Ensuring DPP data can be understood and used across different systems and borders, aligning with EBSI's vision.</li>
            <li><strong>Verifiability:</strong> Enabling independent verification of product claims through mechanisms like Verifiable Credentials (VCs).</li>
            <li><strong>Transparency:</strong> Providing accessible public information about product authenticity, key compliance aspects, and (optionally) ownership.</li>
            <li><strong>Security:</strong> Utilizing cryptographic methods to ensure data integrity and authenticity of claims.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><CheckCircle className="mr-2 h-5 w-5 text-primary"/>Verifiable Credentials (VCs) for Product Authenticity</CardTitle>
          <CardDescription>
            Using VCs to attest to the authenticity and key attributes of a product.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The Norruva platform conceptually supports the issuance and management of VCs for product authenticity. The <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">authenticationVcId</code> field in the Digital Product Passport data model is intended to store an identifier for such a credential.
          </p>
          <p className="text-sm">
            <strong>Conceptual Workflow:</strong>
          </p>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>A manufacturer (or authorized issuer) generates a VC attesting to the product's authenticity, key identifiers (e.g., GTIN, model number), and manufacturing details.</li>
            <li>This VC would be signed using a DID verifiable within the EBSI ecosystem (or a similar trust framework).</li>
            <li>The ID of this VC is stored in the product's DPP (<code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">authenticationVcId</code>).</li>
            <li>Stakeholders can then retrieve this VC (conceptually, via a VC registry or directly from the issuer based on the ID) and verify its signature and claims against the EBSI trust model.</li>
          </ol>
          <p>
            The mock API endpoint <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">POST /api/v1/dpp/{"{productId}"}/issue-auth-vc</code> simulates the process of assigning such a VC ID to a product within our system.
          </p>
           <Button variant="link" asChild className="p-0 h-auto text-sm mt-2">
              <Link href="/developer/docs/api-reference#token-endpoints">See API Reference for VC/Token Endpoints</Link>
           </Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><KeyRound className="mr-2 h-5 w-5 text-primary"/>NFT-Based Concepts for Ownership Tracking</CardTitle>
          <CardDescription>
            Exploring Non-Fungible Tokens (NFTs) as a mechanism for representing and transferring product ownership or unique product instances.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">ownershipNftLink</code> field in the DPP data model allows for conceptually linking a product passport to an NFT. This could represent:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Proof of Ownership:</strong> The holder of the NFT is the current owner of the physical product or a digital twin.</li>
            <li><strong>Transferability:</strong> Ownership can be transferred by transferring the NFT on a blockchain.</li>
            <li><strong>Unique Instance Tracking:</strong> Each NFT can represent a unique, serialized product item.</li>
          </ul>
          <p>
            The link includes details like <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">contractAddress</code>, <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">tokenId</code>, <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">chainName</code>, and an optional <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">registryUrl</code> (e.g., to an NFT marketplace).
          </p>
          <p>
            The mock API endpoint <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">POST /api/v1/dpp/{"{productId}"}/link-nft</code> simulates the process of associating NFT details with a product in our system.
          </p>
          <p className="text-xs text-muted-foreground">
            Note: While powerful, NFT-based ownership for all physical products presents challenges (e.g., linking physical to digital, gas fees). This is a conceptual exploration aligning with potential future trends.
          </p>
        </CardContent>
      </Card>

       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><FileText className="mr-2 h-5 w-5 text-primary"/>Alignment with EBSI Principles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Our conceptual approach to VCs and NFT-links aligns with EBSI's core principles:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>
              <strong>Decentralized Identity (ESSIF):</strong> Issuers of VCs (e.g., manufacturers, certifiers) and owners (via DIDs linked to NFT ownership) would leverage ESSIF for managing their digital identities securely.
            </li>
            <li>
              <strong>Verifiable Credentials:</strong> Authenticity claims, compliance attestations, and even ownership (if an NFT represents a VC) would be in the form of W3C-compliant VCs, verifiable against the EBSI trust framework.
            </li>
            <li>
              <strong>Interoperability:</strong> By using standardized VC data models and DID methods compatible with EBSI, DPP data becomes more interoperable across different EU systems and member states.
            </li>
            <li>
              <strong>Data Integrity & Traceability:</strong> Anchoring VCs or proofs on an EBSI-conformant ledger (or a private ledger with proofs on EBSI) enhances data integrity and provides an immutable audit trail for key product events or claims.
            </li>
          </ul>
           <p className="text-sm mt-2">
            For a more general overview of how Norruva conceptually integrates with EBSI services, please see the <Link href="/developer/docs/ebsi-integration" className="text-primary hover:underline">EBSI Integration Overview document</Link>.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Info className="mr-2 h-5 w-5 text-primary"/>Further Considerations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This public layer architecture is conceptual. A full implementation would require careful consideration of specific EBSI use cases (e.g., a Diploma use case for product certifications, ESSIF for identity), selection of appropriate VC schemas, and robust integration with EBSI's APIs and trust infrastructure. The mock APIs provided are for demonstrating the data flow and platform capabilities within the Norruva system itself.
          </p>
        </CardContent>
      </Card>
    </DocsPageLayout>
  );
}
