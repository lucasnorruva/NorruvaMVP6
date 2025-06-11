
// --- File: page.tsx (Regulatory Alignment Docs) ---
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, Settings, Info, Database as DatabaseIcon, Anchor, UserCheck } from "lucide-react"; // Added relevant icons
import Link from "next/link";
import DocsPageLayout from '@/components/developer/DocsPageLayout';

export default function RegulatoryAlignmentPage() {
  return (
    <DocsPageLayout
      pageTitle="Regulatory Alignment (ESPR, EPREL, etc.)"
      pageIcon={Scale}
    >
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Overview of Regulatory Support</CardTitle>
          <CardDescription>
            The Norruva Digital Product Passport (DPP) platform is designed to help businesses align with key product regulations, primarily within the European Union.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Digital Product Passports are becoming increasingly central to new EU regulations aimed at promoting sustainability, circularity, and transparency. Our platform aims to provide the tools, data structures, and integration capabilities necessary to help businesses meet these requirements efficiently.
          </p>
          <p>
            This section will be continuously updated with detailed guides, data mapping examples, and API integration patterns for specific regulations as they mature and as platform features are developed.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="flex items-center"><Settings className="mr-2 h-5 w-5 text-primary"/>Key Regulations & Platform Alignment</CardTitle>
            <CardDescription>Conceptual alignment with major EU product regulations and systems.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <section>
                <h3 className="font-semibold text-lg mb-1">Ecodesign for Sustainable Products Regulation (ESPR)</h3>
                <p className="text-sm text-muted-foreground">
                    ESPR will require DPPs for a wide range of products to provide information on their environmental sustainability. The Norruva platform is being developed with ESPR data requirements in mind, aiming to support data elements related to durability, reparability, recycled content, and substance of concern declarations.
                </p>
                <Button variant="link" className="p-0 h-auto text-xs mt-1" asChild>
                  <Link href="/compliance/pathways/espr">View ESPR Pathway</Link>
                </Button>
            </section>
            <section>
                <h3 className="font-semibold text-lg mb-1">EPREL Database (EU Product Registry for Energy Labelling)</h3>
                <p className="text-sm text-muted-foreground">
                    For products requiring energy labels, EPREL is the mandatory registration database. The Norruva DPP can be structured to hold relevant EPREL data points, and future integrations may facilitate streamlined data submission or verification. The platform currently allows for manual EPREL ID entry and simulated sync checks.
                </p>
                 <Button variant="link" className="p-0 h-auto text-xs mt-1" disabled>EPREL Integration Details (Coming Soon)</Button>
            </section>
            <section>
                <h3 className="font-semibold text-lg mb-1 flex items-center"><DatabaseIcon className="mr-2 h-4 w-4 text-accent"/>ECHA SCIP API (Substances of Concern In articles as such or complex objects (Products))</h3>
                <p className="text-sm text-muted-foreground">
                    The SCIP database requires notifications for articles containing Substances of Very High Concern (SVHCs). DPPs can help manage and track SVHC information. The Norruva platform conceptually supports preparing data for SCIP notifications, potentially via API integration in the future.
                </p>
                 <Button variant="link" className="p-0 h-auto text-xs mt-1" asChild>
                   <Link href="/compliance/pathways/scip">View SCIP Notification Helper</Link>
                </Button>
            </section>
             <section>
                <h3 className="font-semibold text-lg mb-1 flex items-center"><UserCheck className="mr-2 h-4 w-4 text-accent"/>EORI System (Economic Operators Registration and Identification)</h3>
                <p className="text-sm text-muted-foreground">
                    EORI numbers are essential for customs and other regulatory procedures. The Norruva platform allows for storing EORI numbers as part of manufacturer details within the DPP. This data can then be leveraged for customs declarations and verifications (conceptually).
                </p>
                 <Button variant="link" className="p-0 h-auto text-xs mt-1" disabled>EORI Integration Notes (Coming Soon)</Button>
            </section>
             <section>
                <h3 className="font-semibold text-lg mb-1 flex items-center"><Anchor className="mr-2 h-4 w-4 text-accent"/>EU Customs Data Model (EUCDM)</h3>
                <p className="text-sm text-muted-foreground">
                    DPP data, including product identifiers, classification, origin, and compliance attestations, can be structured to align with the EUCDM. This facilitates smoother customs processes by providing readily available and verifiable information for import/export declarations. The Norruva platform aims to support this data mapping.
                </p>
                 <Button variant="link" className="p-0 h-auto text-xs mt-1" disabled>EUCDM Mapping Guide (Coming Soon)</Button>
            </section>
             <section>
                <h3 className="font-semibold text-lg mb-1">EU Battery Regulation (EU 2023/1542)</h3>
                <p className="text-sm text-muted-foreground">
                    This regulation mandates a "Battery Passport" for LMT, industrial, and EV batteries. The Norruva platform includes specific fields for battery data (chemistry, carbon footprint, recycled content, SoH) aligned with the Battery Regulation's requirements. Our <Link href="/compliance/pathways/battery-regulation" className="text-primary hover:underline">Battery Regulation Pathway</Link> provides step-by-step guidance.
                </p>
            </section>
             <section>
                <h3 className="font-semibold text-lg mb-1">Other Relevant Directives & Initiatives</h3>
                <p className="text-sm text-muted-foreground">
                    The platform also considers interconnections with other important areas:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mt-2">
                    <li><strong>CSRD (Corporate Sustainability Reporting Directive):</strong> DPP data can provide valuable product-level information for corporate sustainability reports.</li>
                    <li><strong>EBSI (European Blockchain Services Infrastructure):</strong> We are exploring how EBSI can be leveraged for verifiable credentials and trusted data exchange related to DPPs. Refer to our <Link href="/developer/docs/ebsi-integration" className="text-primary hover:underline">EBSI Integration Overview</Link>.</li>
                </ul>
            </section>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Info className="mr-2 h-5 w-5 text-primary"/>Staying Updated</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Product regulations are dynamic. We recommend consulting official EU sources for the latest legal texts and guidance. The Norruva platform will evolve to support these changes, and this documentation will be updated accordingly.
          </p>
        </CardContent>
      </Card>
    </DocsPageLayout>
  );
}

