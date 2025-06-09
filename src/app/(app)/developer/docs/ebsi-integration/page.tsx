
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, BookOpen, Workflow, Database, QrCode, FileCog } from "lucide-react";
import DocsPageLayout from '@/components/developer/DocsPageLayout';

export default function EbsiIntegrationOverviewPage() {
  return (
    <DocsPageLayout
      pageTitle="EBSI Integration Overview"
      pageIcon={Share2}
      alertTitle="Conceptual Documentation"
      alertDescription="This page outlines the conceptual approach to integrating with the European Blockchain Services Infrastructure (EBSI) for Digital Product Passports. Actual implementation details will vary."
    >
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
            <h3 className="font-semibold text-lg mb-2">Verifiable Credentials (VCs)</h3>
            <p className="text-sm">
              Key product attributes, certifications, lifecycle events, and compliance statements can be issued as VCs. These digitally signed credentials are tamper-proof and can be easily verified across borders using the EBSI trust framework.
            </p>
          </section>
          <section>
            <h3 className="font-semibold text-lg mb-2">ESSIF & Digital Signatures</h3>
            <p className="text-sm">
              The European Self-Sovereign Identity Framework (ESSIF) allows manufacturers, verifiers, and other stakeholders to use Decentralized Identifiers (DIDs). These DIDs are used to issue and verify VCs through digital signatures.
            </p>
          </section>
          <section>
            <h3 className="font-semibold text-lg mb-2">Notarisation API</h3>
            <p className="text-sm">
              Anchoring DPP data hashes or critical event proofs onto EBSI's ledger via the Notarisation API provides immutable timestamps and proof of existence.
            </p>
          </section>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Database className="mr-2 h-5 w-5 text-primary"/>Blockchain Platform Selection for Norruva DPP</CardTitle>
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
          <CardTitle className="flex items-center"><QrCode className="mr-2 h-5 w-5 text-primary"/>QR Code Integration with EBSI</CardTitle>
          <CardDescription>
            Conceptual overview of integrating QR codes for physical product linkage in an EBSI-enabled DPP ecosystem.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h3 className="font-semibold text-lg mb-2">Data Encoding in QR Codes</h3>
            <p className="text-sm">
              QR codes on products could encode various identifiers to link to the DPP:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-4">
              <li>A URL pointing to the human-readable public DPP viewer (e.g., <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">https://dpp.norruva.com/passport/{'{productId}'}</code>).</li>
              <li>A Decentralized Identifier (DID) of the product or its manufacturer.</li>
              <li>A reference to a key Verifiable Credential (e.g., a VC summarizing key attributes or authenticity).</li>
            </ul>
             <p className="text-sm mt-1">The choice depends on the use case and desired level of directness vs. indirection.</p>
          </section>
          <section>
            <h3 className="font-semibold text-lg mb-2">Security and Access Control</h3>
            <p className="text-sm">
              QR codes themselves are public. Security relies on the endpoint they resolve to:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-4">
              <li>Endpoints must use HTTPS.</li>
              <li>Access to sensitive or detailed DPP data should require further authentication or authorization, potentially involving the scanner presenting their own VCs to prove their role or permissions.</li>
              <li>Publicly accessible information via QR scan should be carefully curated.</li>
            </ul>
          </section>
          <section>
            <h3 className="font-semibold text-lg mb-2">Offline Scenarios (Conceptual)</h3>
            <p className="text-sm">
              For scenarios requiring offline verification, QR codes could potentially encode a signed, self-contained VC (e.g., using <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">VC-JWT</code> or <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">CBOR-LD</code>) with essential product information. This is more complex but offers offline capabilities.
            </p>
          </section>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><FileCog className="mr-2 h-5 w-5 text-primary"/>Role of Smart Contracts with EBSI</CardTitle>
          <CardDescription>
            Smart contracts can play a crucial role in automating, governing, and enhancing the trustworthiness of DPPs within an EBSI-integrated system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h3 className="font-semibold text-lg mb-2">DPP Lifecycle Management</h3>
            <p className="text-sm">
              Smart contracts can manage the state transitions of a DPP (e.g., 'draft', 'published', 'recalled', 'recycled'). They can enforce rules for who can trigger these transitions and log events immutably.
            </p>
          </section>
          <section>
            <h3 className="font-semibold text-lg mb-2">Verifiable Credential (VC) Management</h3>
            <p className="text-sm">
              Contracts could facilitate aspects of VC lifecycle:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-4">
              <li>Registering VCs or their proofs on-chain.</li>
              <li>Managing VC revocation lists (e.g., through a VC Status List 2021 approach).</li>
              <li>Automating verification checks based on predefined rules.</li>
            </ul>
          </section>
          <section>
            <h3 className="font-semibold text-lg mb-2">Access Control Logic</h3>
            <p className="text-sm">
              Define and enforce granular permissions for who can view or update specific sections of a DPP. This could be integrated with DIDs and VCs, allowing role-based access.
            </p>
          </section>
           <section>
            <h3 className="font-semibold text-lg mb-2">Interacting with EBSI Services</h3>
            <p className="text-sm">
              Smart contracts might act as oracles or bridges to interact with EBSI core services, for example, to trigger a notarisation request on EBSI or query an EBSI-trusted VC registry.
            </p>
          </section>
           <section>
            <h3 className="font-semibold text-lg mb-2">Data Integrity & Auditability</h3>
            <p className="text-sm">
              Smart contracts can validate data hashes against on-chain anchors, ensuring that off-chain DPP data hasn't been tampered with. They provide an immutable audit trail of significant DPP events and attestations.
            </p>
          </section>
        </CardContent>
      </Card>
    </DocsPageLayout>
  );
}
