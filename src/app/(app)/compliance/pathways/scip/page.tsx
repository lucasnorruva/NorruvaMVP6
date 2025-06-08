
// --- File: page.tsx (SCIP Database Notification Helper) ---
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, Database, Info, Layers, ListChecks, ExternalLink, UploadCloud } from "lucide-react";

export default function ScipNotificationHelperPage() {
  const scipSections = [
    {
      icon: Layers,
      title: "Leveraging DPP Data for SCIP",
      description: "Understand how data from your Digital Product Passports can streamline SCIP notifications.",
      details: [
        "Material Composition: DPPs contain detailed material breakdowns, essential for identifying SVHCs.",
        "Supplier Information: Traceability data in DPPs can help pinpoint where SVHCs originate in your supply chain.",
        "Concentration Levels: Accurate data on substance concentrations above 0.1% w/w is key for notification triggers."
      ],
    },
    {
      icon: ListChecks,
      title: "Conceptual Platform Features",
      description: "How the Norruva platform could assist with SCIP compliance (illustrative).",
      details: [
        "Automated SVHC Screening: Conceptually, the platform could flag products containing SVHCs based on their DPP data and the ECHA Candidate List.",
        "Notification Dossier Preparation: Pre-fill SCIP notification fields using data from the DPP to reduce manual entry.",
        "IUCLID Data Package Generation: Generate a mock data package in a format conceptually compatible with ECHA's IUCLID software for submission.",
        "Notification Tracking: Maintain a record of submitted notifications and their statuses (conceptual)."
      ],
    },
    {
      icon: UploadCloud,
      title: "Streamlined Submission Process (Conceptual)",
      description: "While direct submission to ECHA is not part of this mock, the platform aims to prepare data effectively.",
      details: [
        "The generated data package would need to be imported into the official IUCLID tool.",
        "Always ensure final review and validation within IUCLID before submission to ECHA.",
        "Refer to ECHA's official SCIP submission guides for detailed instructions."
      ],
      link: "https://echa.europa.eu/scip-database",
      linkText: "Visit ECHA SCIP Database Portal"
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <ShieldAlert className="mr-3 h-7 w-7 text-primary" />
          SCIP Database Notification Helper (Conceptual)
        </h1>
        <Button variant="outline" asChild>
          <Link href="/compliance/pathways">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Compliance Pathways
          </Link>
        </Button>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Conceptual Guidance & Disclaimer</AlertTitle>
        <AlertDescription>
          This guide provides a conceptual overview of how the Norruva platform could assist with SCIP database notifications. It is not exhaustive and does not constitute legal or regulatory advice. Companies are solely responsible for ensuring compliance with SCIP notification obligations. Always refer to official ECHA documentation and guidance.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Database className="mr-2 h-5 w-5 text-primary"/>Introduction to SCIP Notifications</CardTitle>
          <CardDescription>
            The SCIP database aims to increase knowledge of hazardous chemicals in articles and products on the EU market. Companies supplying articles containing Substances of Very High Concern (SVHCs) on the ECHA Candidate List in a concentration above 0.1% weight by weight (w/w) must submit notifications to ECHA.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            The Norruva platform, through its Digital Product Passports, can help gather and structure the necessary information for these notifications.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {scipSections.map((section, index) => (
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
                    <Link href={section.link} target="_blank" rel="noopener noreferrer">
                      {section.linkText} <ExternalLink className="ml-1 h-3 w-3"/>
                    </Link>
                 </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>Important Considerations for SCIP</CardTitle>
        </CardHeader>
        <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>The ECHA Candidate List of SVHCs is regularly updated. Ensure you are using the latest version for your assessments.</li>
                <li>Notifications are required for articles placed on the EU market.</li>
                <li>Complex objects (products) may require notifications for multiple articles within them if they contain SVHCs above the threshold.</li>
                <li>Data accuracy is crucial. Incorrect or incomplete notifications can lead to compliance issues.</li>
                <li>Consult ECHA's official website and guidance documents for the most up-to-date and detailed information.</li>
            </ul>
        </CardContent>
      </Card>
    </div>
  );
}

