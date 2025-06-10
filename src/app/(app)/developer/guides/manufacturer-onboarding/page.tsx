
// --- File: page.tsx (Manufacturer Onboarding Guide) ---
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Info, Users, FileText, Layers, CheckCircle, Rocket, HelpCircle, PlusCircle } from "lucide-react"; // Removed Building
import DocsPageLayout from '@/components/developer/DocsPageLayout'; // Import the layout

export default function ManufacturerOnboardingPage() {
  const steps = [
    {
      title: "Registering Your Organization",
      icon: Users,
      description: "Set up your manufacturer account on the Norruva platform. This involves providing your company details, primary contact information, and potentially configuring initial user roles for your team. Access to certain features may depend on your organization's verification status.",
      link: "/settings",
      linkText: "Go to Organization Settings (Conceptual)"
    },
    {
      title: "Understanding DPP Data Requirements",
      icon: FileText,
      description: "Familiarize yourself with the data points required for your product categories under relevant regulations (e.g., ESPR, EU Battery Regulation). Accurate and comprehensive data is crucial for compliance.",
      links: [
        { href: "/developer/docs/regulatory-alignment", text: "Regulatory Alignment Guide" },
        { href: "/developer/docs/data-management-best-practices", text: "Data Management Best Practices" }
      ]
    },
    {
      title: "Creating Your First Product DPP",
      icon: PlusCircle,
      description: "Utilize our platform tools to create Digital Product Passports. You can leverage AI-powered data extraction from existing documents or use the manual entry form. The platform guides you through essential fields.",
      link: "/products/new",
      linkText: "Add New Product"
    },
    {
      title: "Managing Supply Chain Data",
      icon: Layers,
      description: "Link suppliers to your products and manage information about components and materials. Accurate supply chain data enhances traceability and supports sustainability claims. Manage your list of suppliers and link them on the product detail page.",
      link: "/suppliers",
      linkText: "Manage Suppliers"
    },
    {
      title: "Publishing & Verifying DPPs",
      icon: CheckCircle,
      description: "Once your DPP data is complete and reviewed, publish it. For certain product categories or claims, verification through systems like EBSI may be required. Our platform aims to streamline this process.",
      link: "/developer/docs/ebsi-integration",
      linkText: "Learn about EBSI Integration"
    },
    {
      title: "Utilizing the API for Automation",
      icon: Rocket,
      description: "For manufacturers managing a large number of products, our API allows for batch creation/updates of DPPs, integration with your internal systems (ERP, PLM), and automated data synchronization.",
      links: [
        { href: "/developer/docs/api-reference", text: "API Reference" },
        { href: "/developer/guides/quick-start", text: "Quick Start Guide" }
      ]
    }
  ];

  return (
    <DocsPageLayout
      pageTitle="Manufacturer Onboarding Guide (Conceptual)"
      pageIcon="Building" // Changed from {Building} to "Building"
      backLink="/developer/docs"
      backLinkText="Back to Docs Hub"
      alertTitle="Conceptual Guide"
      alertDescription="This document conceptually outlines onboarding steps for manufacturers using the Norruva DPP platform. Features and workflows are illustrative."
    >
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Welcome, Manufacturer!</CardTitle>
          <CardDescription>
            This guide will walk you through the key steps to effectively use the Norruva platform for managing your Digital Product Passports.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Our goal is to help you meet regulatory requirements, enhance product transparency, and leverage your product data for better sustainability and efficiency.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {steps.map((step, index) => (
          <Card key={index} className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <step.icon className="mr-3 h-5 w-5 text-primary" />
                Step {index + 1}: {step.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{step.description}</p>
              {step.link && step.linkText && (
                <Button variant="link" asChild className="p-0 h-auto text-sm">
                  <Link href={step.link}>{step.linkText}</Link>
                </Button>
              )}
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
            <CardTitle className="text-lg flex items-center"><HelpCircle className="mr-2 h-5 w-5 text-primary"/>Next Steps & Support</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
                Once you are comfortable with these initial steps, explore advanced features like detailed compliance pathways, sustainability reporting, and the full capabilities of our Developer API.
            </p>
            <Button variant="outline" asChild>
                <Link href="/developer#resources">Access Developer Resources</Link>
            </Button>
        </CardContent>
      </Card>
    </DocsPageLayout>
  );
}

