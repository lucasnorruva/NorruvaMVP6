
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Share2, ShieldCheck, BookOpen, Info, Workflow, Database, Users as UsersIcon, Layers } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EbsiIntegrationOverviewPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <Share2 className="mr-3 h-7 w-7 text-primary" />
          EBSI Integration Overview
        </h1>
        <Button variant="outline" asChild>
            <Link href="/developer">Back to Developer Portal</Link>
        </Button>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Conceptual Documentation</AlertTitle>
        <AlertDescription>
          This page outlines the conceptual approach to integrating with the European Blockchain Services Infrastructure (EBSI) for Digital Product Passports. Actual implementation details will vary.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><BookOpen className="mr-2 h-5 w-5 text-primary"/>Understanding EBSI Core Architecture</CardTitle>
          <CardDescription>
            EBSI is a peer-to-peer network of distributed nodes across Europe, supporting cross-border public services using blockchain technology. Key aspects include its multi-ledger approach, decentralized identity (ESSIF), and focus on GDPR compliance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            The Norruva platform's conceptual EBSI integration aims to leverage these features for verifiable credentials related to DPPs, ensuring authenticity and trusted data exchange.
          </p>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Nodes: Distributed and managed by member states and the European Commission.</li>
            <li>Ledgers: Supports various blockchain technologies (e.g., Hyperledger Besu).</li>
            <li>Core Services: ESSIF (Self-Sovereign Identity), Verifiable Credentials, Notarisation, Trusted Data Sharing.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Workflow className="mr-2 h-5 w-5 text-primary"/>Key EBSI Protocols for DPP</CardTitle>
          <CardDescription>
            Integration with EBSI for DPPs would primarily utilize Verifiable Credentials and potentially the Notarisation API.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Verifiable Credentials (VCs):</strong> Key product attributes, certifications, and lifecycle events can be issued as VCs, making them tamper-proof and easily verifiable across borders.
          </p>
          <p>
            <strong>Notarisation API:</strong> Anchoring DPP data hashes or critical event proofs onto EBSI's ledger to provide immutable timestamps and proof of existence.
          </p>
          <p>
            <strong>ESSIF:</strong> Using decentralized identifiers (DIDs) for manufacturers, products, and other stakeholders to manage access and control over DPP data.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Layers className="mr-2 h-5 w-5 text-primary"/>Blockchain Platform Selection for Norruva DPP</CardTitle>
          <CardDescription>
            Choosing a suitable blockchain platform is critical for a successful and compliant EBSI integration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h3 className="font-semibold text-lg mb-2">Key Selection Criteria</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>Scalability:</strong> The platform must handle a large volume of DPPs and transactions efficiently.</li>
              <li><strong>Security:</strong> Robust security features to protect sensitive product data and prevent fraud.</li>
              <li><strong>Transaction Costs:</strong> Predictable and manageable transaction fees.</li>
              <li><strong>Regulatory Compliance & EBSI Interoperability:</strong> Must support EBSI standards and EU regulations (e.g., GDPR).</li>
              <li><strong>Smart Contract Capabilities:</strong> Advanced smart contract functionality for DPP logic and lifecycle management.</li>
              <li><strong>Ecosystem & Support:</strong> Active developer community and available enterprise support.</li>
            </ul>
          </section>
          <section>
            <h3 className="font-semibold text-lg mb-2">Conceptual Choice for Norruva</h3>
            <p className="text-sm">
              For the Norruva DPP system, a conceptual alignment with a <strong>permissioned EVM-compatible blockchain (e.g., a private Ethereum instance or a Layer 2 solution like Polygon with enterprise features)</strong> is considered. This approach aims to balance the transparency and immutability of blockchain with the control required for enterprise applications and regulatory compliance.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              The specific choice would involve further in-depth analysis and proof-of-concepts in a real-world scenario.
            </p>
          </section>
        </CardContent>
      </Card>

       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Database className="mr-2 h-5 w-5 text-primary"/>Relevant Blockchain Standards</CardTitle>
          <CardDescription>
            Alignment with established blockchain standards is crucial for robust and interoperable DPPs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h3 className="font-semibold text-lg mb-1">Smart Contracts</h3>
            <p className="text-sm">
              Smart contracts would govern the lifecycle of a DPP on the chosen blockchain, managing registration, updates, ownership transfers (if applicable), and access permissions. They would also interact with EBSI bridge services for anchoring or VC issuance.
            </p>
          </section>
           <section>
            <h3 className="font-semibold text-lg mb-1">Data Formats & Storage</h3>
            <p className="text-sm">
              DPP data itself might be stored off-chain (e.g., IPFS, secure databases) with hashes and VCs on-chain. Data formats should align with EU standards (e.g., based on CIRPASS, specific product group requirements) and be representable as JSON-LD for semantic interoperability.
            </p>
          </section>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Share2 className="mr-2 h-5 w-5 text-primary"/>Conceptual Interaction with Selected Blockchain Technologies</CardTitle>
          <CardDescription>
            While EBSI itself provides a foundational layer, specific product data might reside on or interact with other DLTs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            The choice of blockchain (e.g., a permissioned chain like Hyperledger Fabric for enterprise data, or a public chain like Ethereum/Polygon for certain public attestations) would dictate the specific smart contract languages and tools.
          </p>
           <p className="text-sm text-muted-foreground">
            Norruva's approach will prioritize platforms that offer robust security, scalability for a large number of DPPs, cost-effectiveness for transactions, and strong support for interoperability standards required by EBSI.
           </p>
        </CardContent>
      </Card>
    </div>
  );
}
