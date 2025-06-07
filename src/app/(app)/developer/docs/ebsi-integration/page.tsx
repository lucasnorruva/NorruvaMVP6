
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Share2, ShieldCheck, BookOpen, Info, Workflow, Database, Users as UsersIcon, Layers, QrCode as QrCodeIcon, FileJson, CheckCircle } from "lucide-react"; // Added Database, QrCodeIcon, FileJson, CheckCircle
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
            Integration with EBSI for DPPs would primarily utilize Verifiable Credentials (VCs) and potentially the Notarisation API, all underpinned by ESSIF for decentralized identity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h3 className="font-semibold text-lg mb-2 flex items-center"><CheckCircle className="mr-2 h-5 w-5 text-green-600" />Verifiable Credentials (VCs)</h3>
            <p className="text-sm">
              Key product attributes, certifications, lifecycle events, and compliance statements can be issued as VCs. These digitally signed credentials are tamper-proof and can be easily verified across borders using the EBSI trust framework. This enables reliable cross-border traceability of products and their associated claims.
            </p>
          </section>
          <section>
            <h3 className="font-semibold text-lg mb-2 flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-green-600" />ESSIF & Digital Signatures</h3>
            <p className="text-sm">
              The European Self-Sovereign Identity Framework (ESSIF) allows manufacturers, verifiers, and other stakeholders to use Decentralized Identifiers (DIDs). These DIDs are used to issue and verify VCs through digital signatures, adhering to EBSI's cryptographic standards. This ensures the authenticity of data and the integrity of compliance claims within the DPP.
            </p>
          </section>
          <section>
            <h3 className="font-semibold text-lg mb-2">Notarisation API</h3>
            <p className="text-sm">
              Anchoring DPP data hashes or critical event proofs onto EBSI's ledger via the Notarisation API provides immutable timestamps and proof of existence, further enhancing data integrity.
            </p>
          </section>
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
            <h3 className="font-semibold text-lg mb-2">Storing Product Data Immutably</h3>
            <p className="text-sm">
              While the full DPP data might reside off-chain (e.g., in a secure database) for performance and scalability, key data points or their cryptographic hashes would be recorded on the blockchain. This includes:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                <li><strong>DPP Anchor:</strong> A hash of the complete DPP document (or its core sections) can be stored on-chain to prove its existence and integrity at a point in time.</li>
                <li><strong>Critical Lifecycle Events:</strong> Hashes or key details of significant events like manufacturing completion, ownership transfer, or disposal can be recorded as transactions.</li>
                <li><strong>Certification Anchors:</strong> Hashes of important certifications can be linked to the product's on-chain record.</li>
            </ul>
            <p className="text-sm mt-1">
                This hybrid approach ensures data immutability and an auditable trail for critical information without overwhelming the blockchain with large data blobs. Smart contracts would manage the pointers and hashes.
            </p>
          </section>
          <section>
            <h3 className="font-semibold text-lg mb-2 mt-3">Node Configuration (Mock Considerations)</h3>
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
          <CardTitle className="flex items-center"><FileJson className="mr-2 h-5 w-5 text-primary"/>Smart Contracts for DPP Management (Conceptual)</CardTitle>
          <CardDescription>
            Outlining the role and key functions of smart contracts in the DPP ecosystem.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h3 className="font-semibold text-lg mb-2">Purpose of Smart Contracts</h3>
            <p className="text-sm">
              Smart contracts would automate and enforce the rules governing Digital Product Passports on the blockchain. They manage the registration, updates, and lifecycle transitions of DPPs, ensuring data integrity and controlled access.
            </p>
          </section>
          <section>
            <h3 className="font-semibold text-lg mb-2">Key Conceptual Functions</h3>
            <p className="text-sm">While specific implementation would vary, core functions might include:</p>
            <ul className="list-disc list-inside space-y-1 text-sm mt-2">
              <li><code>registerDPP(productId: string, dppHash: bytes32, initialMetadata: string)</code>: Creates a new DPP record on-chain, linking to off-chain data via its hash.</li>
              <li><code>updateDPPHash(productId: string, newDppHash: bytes32)</code>: Updates the hash pointer for a DPP, effectively versioning it.</li>
              <li><code>addLifecycleEvent(productId: string, eventType: string, eventDataHash: bytes32, eventTimestamp: uint256)</code>: Logs a new lifecycle event hash for a product.</li>
              <li><code>transferOwnership(productId: string, newOwnerDID: string)</code>: Records a change in product ownership, potentially using DIDs.</li>
              <li><code>addCertification(productId: string, certificationId: string, certHash: bytes32, issuerDID: string)</code>: Links a new certification to the DPP.</li>
              <li><code>verifyDPP(productId: string) returns (bool)</code>: Checks the validity or status of a DPP based on on-chain rules.</li>
            </ul>
          </section>
          <section>
            <h3 className="font-semibold text-lg mb-2">Deployment & EBSI Interaction</h3>
            <p className="text-sm">
              These smart contracts would be deployed on the conceptually chosen blockchain platform (e.g., a permissioned EVM chain). For EBSI integration, they might interact with EBSI-compliant DIDs, store references to Verifiable Credentials (VCs) anchored on EBSI, or trigger notarisation events. This ensures that product data managed by the smart contracts is verifiable within the EBSI ecosystem, leveraging EBSI's trust infrastructure for cross-border operations.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              This is a high-level conceptual outline. Actual smart contract development is complex and requires careful security auditing.
            </p>
          </section>
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
              <li>QR codes themselves <strong>must not</strong> contain sensitive personal data or private keys.</li>
              <li>The endpoint the QR code resolves to <strong>must be secure (HTTPS)</strong> and interact with a trusted backend system.</li>
              <li>Access to detailed or private DPP data via the QR code's link <strong>must be protected by robust authentication and authorization mechanisms</strong>, especially for information beyond publicly mandated data.</li>
              <li>Consider measures against QR code tampering or phishing (e.g., signed QR codes if standards emerge, user education) if the QR codes are physically placed on products.</li>
            </ul>
          </section>
          <section>
            <h3 className="font-semibold text-lg mt-3 mb-2">Conceptual QR Code Scanning Process</h3>
            <p className="text-sm">
              When a user scans a product's QR code:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm ml-4">
              <li>The scanner (e.g., a mobile app or a dedicated scanning device) decodes the unique identifier.</li>
              <li>The identifier is used to query the Norruva platform's <strong>secure backend API</strong>.</li>
              <li>The API retrieves the relevant DPP data, potentially fetching/verifying information from the underlying blockchain and EBSI infrastructure (conceptually). Access to sensitive data is conditional based on user roles and permissions.</li>
              <li>The DPP Viewer displays the product information, including its (mock) blockchain data and EBSI compliance status.</li>
              <li>For sensitive data sections within the DPP, user authentication (and authorization) <strong>will be required</strong>.</li>
            </ul>
            <p className="text-sm mt-1">
              The goal is to provide a seamless experience from scan to information retrieval, ensuring data integrity, security, and compliance.
            </p>
          </section>
        </CardContent>
      </Card>

    </div>
  );
}
    

    
