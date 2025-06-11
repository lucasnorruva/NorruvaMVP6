// --- File: page.tsx (CSRD Alignment Guide) ---
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, Info, Layers, BarChart3, Cpu, Link as LinkIcon } from "lucide-react";

export default function CsrdAlignmentGuidePage() {
  const searchParams = useSearchParams();
  const countryParam = searchParams.get('country');
  const country = countryParam ? decodeURIComponent(countryParam) : null;
  const csrdSections = [
    {
      icon: Layers,
      title: "DPP Data & ESRS Mapping (Conceptual)",
      description: "Understand how specific data points within a Digital Product Passport can conceptually align with requirements under European Sustainability Reporting Standards (ESRS).",
      details: [
        "ESRS E1 (Climate Change): DPPs can provide data on product carbon footprint, energy consumption during use phase, and emissions related to manufacturing (if available).",
        "ESRS E5 (Resource use and circular economy): DPPs are key for data on material composition, recycled content, product durability, repairability, and end-of-life information (e.g., recyclability rates).",
        "ESRS S1-S4 (Social Standards): Information on manufacturing locations and supplier details in DPPs can contribute to assessments of working conditions and human rights in the value chain (requires further data linkage).",
      ],
    },
    {
      icon: BarChart3,
      title: "Double Materiality Assessment Support",
      description: "Leverage aggregated DPP data to help identify and assess sustainability impacts, risks, and opportunities (IROs) related to your products, a core component of the CSRD's double materiality principle.",
      details: [
        "Impact Materiality: DPPs can highlight products with high environmental footprints (e.g., high carbon emissions, use of critical raw materials).",
        "Financial Materiality: Product compliance data (or lack thereof) from DPPs can indicate potential financial risks (fines, market access restrictions) or opportunities (eco-labeled products).",
      ],
    },
    {
      icon: LinkIcon,
      title: "Using Norruva API for CSRD Data (Conceptual)",
      description: "Our API (conceptually) allows you to programmatically access DPP data, which can then be aggregated and transformed for your CSRD reporting needs.",
      details: [
        "Retrieve detailed product information, including material breakdowns and sustainability claims, for multiple products.",
        "Filter products based on compliance status or specific attributes relevant to CSRD disclosures.",
        "Integrate DPP data flows into your existing sustainability management or ERP systems.",
      ],
      link: "/developer/docs/api-reference",
      linkText: "View API Reference"
    },
    {
      icon: Cpu,
      title: "Future: AI-Assisted CSRD Snippets",
      description: "We envision future AI tools that could help generate initial drafts of CSRD reporting snippets based on aggregated data from your Digital Product Passports.",
      details: [
        "AI could analyze trends in material usage, recycled content percentages, or product lifecycle emissions across your portfolio.",
        "Generate summaries of product-related environmental performance for inclusion in sustainability reports.",
        "Please note: All AI-generated content would require human review and validation for accuracy and completeness.",
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <BookOpen className="mr-3 h-7 w-7 text-primary" />
          CSRD Alignment Guide (Conceptual)
        </h1>
        {country && (
          <Badge variant="outline" className="ml-3">Guidance for {country}</Badge>
        )}
        <Button variant="outline" asChild>
          <Link href="/compliance/pathways">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Compliance Pathways
          </Link>
        </Button>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Conceptual Guidance</AlertTitle>
        <AlertDescription>
          This guide provides a high-level overview of how Digital Product Passports (DPPs) and the Norruva platform can support CSRD alignment. It is not exhaustive and is not legal or financial advice. Always consult CSRD experts and official ESRS documentation.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Introduction to CSRD & DPPs</CardTitle>
          <CardDescription>
            The Corporate Sustainability Reporting Directive (CSRD) significantly expands sustainability reporting requirements for many EU companies. Digital Product Passports play a crucial role by providing granular, verifiable data at the product level, which is essential for comprehensive and accurate CSRD disclosures.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            The Norruva platform aims to help you structure and manage this product-specific data, making it easier to integrate into your broader CSRD reporting processes.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {csrdSections.map((section, index) => (
          <Card key={index} className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <section.icon className="mr-3 h-5 w-5 text-primary" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{section.description}</p>
              {section.details && section.details.length > 0 && (
                <ul className="list-disc list-inside space-y-1.5 text-sm text-foreground/90 pl-2">
                  {section.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              )}
              {section.link && section.linkText && (
                 <Button variant="link" asChild className="p-0 h-auto text-sm mt-2">
                    <Link href={section.link}>{section.linkText}</Link>
                 </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>Important Considerations</CardTitle>
        </CardHeader>
        <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>The specific data points required for CSRD will depend on your company's materiality assessment and the applicable ESRS.</li>
                <li>DPP data is a valuable input, but CSRD reporting encompasses broader organizational and value chain information beyond individual products.</li>
                <li>Ensure robust data governance and verification processes for all information used in CSRD reports, including data from DPPs.</li>
                <li>Stay updated with evolving ESRS guidance and interpretations from EFRAG and relevant authorities.</li>
            </ul>
        </CardContent>
      </Card>
    </div>
  );
}
