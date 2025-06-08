
// --- File: page.tsx (Manufacturer Onboarding Guide) ---
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Building, Info, ArrowLeft, Users, FileText, Bot, Layers, CheckCircle, Rocket, HelpCircle } from "lucide-react";

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
      icon: Bot,
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <Building className="mr-3 h-7 w-7 text-primary" />
          Manufacturer Onboarding Guide (Conceptual)
        </h1>
        <Button variant="outline" asChild>
          <Link href="/developer"><ArrowLeft className="mr-2 h-4 w-4" />Back to Developer Portal</Link>
        </Button>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Conceptual Guide</AlertTitle>
        <AlertDescription>
          This guide outlines the conceptual steps for manufacturers to onboard onto the Norruva DPP platform. Specific features and workflows are for illustrative purposes.
        </AlertDescription>
      </Alert>

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

    </div>
  );
}
