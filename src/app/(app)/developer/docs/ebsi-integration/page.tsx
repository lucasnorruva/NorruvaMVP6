
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Share2, ShieldCheck, BookOpen, Info, Workflow, Database, Users as UsersIcon, Layers, QrCode as QrCodeIcon } from "lucide-react"; // Added Database icon and QrCodeIcon
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
          <CardTitle className="flex items-center"><Database className="mr-2 h-5 w-5 text-primary"/>Digital Product Passport Data Structure on Blockchain</CardTitle>
          <CardDescription>
            Defining a robust and interoperable data structure for DPPs is crucial for blockchain integration and EBSI compliance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The Norruva platform's DPP data structure is designed to be comprehensive, covering all necessary information from product origin to end-of-life, while ensuring it can be efficiently managed on a blockchain and verified via EBSI.
          </p>
          <section>
            <h3 className="font-semibold text-lg mb-2">Key Data Elements (Conceptual)</h3>
            <p className="text-sm">Our conceptual data model for a blockchain-based DPP includes, but is not limited to:</p>
            <ul className="list-disc list-inside space-y-1 text-sm mt-2">
              <li><strong>Unique DPP Identifier:</strong> Could be a UUID, an NFT ID, or an EBSI-compatible DID.</li>
              <li><strong>Product Master Data:</strong> Name, GTIN, category, manufacturer (with DID), model number, description.</li>
              <li><strong>Blockchain Identifiers:</strong> Platform, contract address, token ID, anchor transaction hash.</li>
              <li><strong>Lifecycle Events:</strong> Timestamped records of key events (manufacturing, shipping, sale, repair, recycling) with optional blockchain transaction hashes and Verifiable Credential (VC) references for each event.</li>
              <li><strong>Certifications & Declarations:</strong> Details of compliance certificates, standards met, with references to VCs or verifiable documents.</li>
              <li><strong>Traceability Information:</strong> Batch/serial numbers, origin data, supply chain actor DIDs, and event hashes.</li>
              <li><strong>Sustainability Attributes:</strong> Material composition (including recycled content), carbon footprint, energy efficiency, repairability scores, waste data.</li>
              <li><strong>Regulatory Compliance Data:</strong> Status for specific regulations (e.g., ESPR, Battery Regulation), links to EPREL, SCIP database IDs, relevant VCs.</li>
              <li><strong>Verifiable Credentials Store:</strong> A collection of VCs related to the product's claims, attestations, and lifecycle events.</li>
              <li><strong>Access Control & GDPR:</strong> Data controller information, links to access policies.</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-1">
              This structure is versioned and aims for alignment with evolving EU standards (e.g., CIRPASS recommendations).
            </p>
          </section>
          <section>
            <h3 className="font-semibold text-lg mb-2">Data Interoperability</h3>
            <p className="text-sm">
              To ensure interoperability within the EBSI ecosystem and beyond, data elements are structured to be compatible with semantic web technologies. We aim for JSON-LD (JSON for Linked Data) representation where appropriate, allowing DPP data to be machine-readable and linkable across different systems and data sources.
            </p>
          </section>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Share2 className="mr-2 h-5 w-5 text-primary"/>Conceptual Blockchain Network and Node Setup</CardTitle>
          <CardDescription>
            This section outlines the conceptual approach for setting up the blockchain network and nodes that would interact with EBSI.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h3 className="font-semibold text-lg mb-2">Network Type</h3>
            <p className="text-sm">
              For enterprise-grade DPP management, a <strong>permissioned blockchain network</strong> (e.g., Hyperledger Fabric, or a private/consortium EVM chain) is conceptually preferred. This allows for controlled access, better performance for enterprise workloads, and easier governance regarding data privacy and compliance. Interaction with EBSI might involve anchoring proofs or VCs to an EBSI-conformant ledger.
            </p>
          </section>
          <section>
            <h3 className="font-semibold text-lg mb-2">Node Configuration (Mock Considerations)</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>Security:</strong> Nodes would require robust security measures, including network firewalls, access control lists, and regular security audits. Private key management would be critical.</li>
              <li><strong>Reliability & Scalability:</strong> High availability setups (e.g., multiple redundant nodes) and a scalable architecture to handle growing numbers of DPPs and transactions.</li>
              <li><strong>Compliance:</strong> Nodes handling EU citizen data or DPPs for the EU market would need to be hosted and operated in compliance with GDPR and other relevant EU data sovereignty regulations.</li>
              <li><strong>EBSI Interaction Point:</strong> Specific nodes might be designated as gateways or adaptors for communicating with the EBSI network, handling credential exchange, or notarisation requests.</li>
            </ul>
          </section>
           <p className="text-xs text-muted-foreground mt-2">
            Actual deployment would require careful planning with infrastructure experts and adherence to EBSI's technical specifications.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><QrCodeIcon className="mr-2 h-5 w-5 text-primary"/>QR Code Integration for DPP Access (Conceptual)</CardTitle>
          <CardDescription>
            Details on how QR codes would be generated and used to access Digital Product Passports.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h3 className="font-semibold text-lg mb-2">Data to Encode in QR Codes</h3>
            <p className="text-sm">
              Each QR code should encode a unique identifier that reliably links to the specific product's Digital Product Passport. This could be:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm ml-4">
              <li>A URL pointing to the public passport viewer, e.g., <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">https://norruva.com/passport/{'{productId}'}</code>.</li>
              <li>A Decentralized Identifier (DID) for the product, which can then be resolved to its DPP data.</li>
              <li>A unique hash or reference to the product's record on the blockchain.</li>
            </ul>
            <p className="text-sm mt-1">
              The preferred method is often a URL that resolves through a secure backend, allowing for flexibility and updates.
            </p>
          </section>
          <section>
            <h3 className="font-semibold text-lg mb-2">Fallback URL Considerations</h3>
            <p className="text-sm">
              It's crucial to have a fallback mechanism. If a QR code scanner cannot directly interpret advanced data formats (like a DID), the encoded data should at least resolve to a human-readable web page providing product information and instructions.
            </p>
          </section>
          <section>
            <h3 className="font-semibold text-lg mb-2">Security Considerations for QR Generation</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>QR codes themselves should not contain sensitive personal data or private keys.</li>
              <li>The endpoint the QR code resolves to must be secure (HTTPS).</li>
              <li>Access to detailed or private DPP data via the QR code's link should be protected by appropriate authentication and authorization mechanisms, especially if it involves more than publicly mandated information.</li>
              <li>Consider measures against QR code tampering or phishing if the QR codes are physically placed on products.</li>
            </ul>
          </section>
          <section>
            <h3 className="font-semibold text-lg mt-3 mb-2">Conceptual QR Code Scanning Process</h3>
            <p className="text-sm">
              When a user scans a product's QR code:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm ml-4">
              <li>The scanner (e.g., a mobile app or a dedicated scanning device) decodes the unique identifier.</li>
              <li>The identifier is used to query the Norruva platform's backend API.</li>
              <li>The API retrieves the relevant DPP data, potentially fetching/verifying information from the underlying blockchain and EBSI infrastructure (conceptually).</li>
              <li>The DPP Viewer displays the product information, including its (mock) blockchain data and EBSI compliance status.</li>
              <li>For sensitive data sections within the DPP, user authentication might be required.</li>
            </ul>
            <p className="text-sm mt-1">
              The goal is to provide a seamless experience from scan to information retrieval, ensuring data integrity and compliance.
            </p>
          </section>
        </CardContent>
      </Card>

    </div>
  );
}

