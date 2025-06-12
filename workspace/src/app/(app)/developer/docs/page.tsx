
// --- File: page.tsx (Developer Documentation Hub) ---
"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    ArrowLeft,
    BookOpen, 
    BookText, 
    KeyRound, 
    Webhook, 
    Clock, 
    AlertTriangle as ErrorIcon, 
    FileJson, 
    Rocket, 
    Share2, 
    Scale, 
    Layers as LayersIcon, 
    Users, 
    ShieldCheck, 
    TestTube2,
    QrCode,
    Server as ServerIconShadcn,
    VenetianMask,
    History,
    Layers3, // Added for Private Layer
    Zap // Added for ZKP Layer
} from "lucide-react";

export default function DeveloperDocumentationHubPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <BookOpen className="mr-3 h-7 w-7 text-primary" />
          Developer Documentation Hub
        </h1>
        <Button variant="outline" asChild>
          <Link href="/developer">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Developer Portal
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <BookText className="mr-3 h-6 w-6 text-primary" /> API Documentation & Guides
          </CardTitle>
          <CardDescription>
            Your central resource for detailed documentation, integration guides, and best practices for leveraging the Norruva DPP APIs.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
          <div className="space-y-3">
            <h4 className="font-semibold text-md mb-1 flex items-center">
              <BookText className="mr-2 h-5 w-5 text-accent" />Core Documentation
            </h4>
            <ul className="list-none space-y-1.5 text-sm">
              <li><Link href="/developer/docs/api-reference" className="text-primary hover:underline flex items-center"><BookText className="mr-2 h-4 w-4" />API Reference <span className="text-xs text-muted-foreground ml-1"> (Endpoints, Schemas)</span></Link></li>
              <li><Link href="/developer/docs/authentication" className="text-primary hover:underline flex items-center"><KeyRound className="mr-2 h-4 w-4" />Authentication <span className="text-xs text-muted-foreground ml-1"> (API Keys, OAuth2 Concept)</span></Link></li>
              <li><Link href="/developer/docs/webhooks-guide" className="text-primary hover:underline flex items-center"><Webhook className="mr-2 h-4 w-4" />Webhooks Guide</Link></li>
              <li><Link href="/developer/docs/rate-limiting" className="text-primary hover:underline flex items-center"><Clock className="mr-2 h-4 w-4" />Rate Limiting &amp; Usage</Link></li>
              <li><Link href="/developer/docs/error-codes" className="text-primary hover:underline flex items-center"><ErrorIcon className="mr-2 h-4 w-4" />Error Codes &amp; Handling</Link></li>
              <li><Link href="/developer/docs/api-changelog" className="text-primary hover:underline flex items-center"><History className="mr-2 h-4 w-4" />API Changelog</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-md mb-1 flex items-center">
              <Rocket className="mr-2 h-5 w-5 text-accent" />Integration Guides &amp; Best Practices
            </h4>
            <ul className="list-none space-y-1.5 text-sm">
              <li><Link href="/developer/guides/quick-start" className="text-primary hover:underline flex items-center"><Rocket className="mr-2 h-4 w-4" />Quick Start Integration Guide</Link></li>
              <li><Link href="/developer/guides/manufacturer-onboarding" className="text-primary hover:underline flex items-center"><Users className="mr-2 h-4 w-4" />Manufacturer Onboarding</Link></li>
              <li><Link href="/developer/docs/ebsi-integration" className="text-primary hover:underline flex items-center"><Share2 className="mr-2 h-4 w-4" />EBSI Integration Overview</Link></li>
              <li><Link href="/developer/docs/public-layer-ebsi" className="text-primary hover:underline flex items-center"><Share2 className="mr-2 h-4 w-4" />Public Layer & EBSI Alignment</Link></li>
              <li><Link href="/developer/docs/private-layer-architecture" className="text-primary hover:underline flex items-center"><Layers3 className="mr-2 h-4 w-4" />Private Layer Architecture</Link></li>
              <li><Link href="/developer/docs/zkp-layer-concepts" className="text-primary hover:underline flex items-center"><Zap className="mr-2 h-4 w-4" />ZKP Layer Concepts</Link></li> 
              <li><Link href="/developer/docs/regulatory-alignment" className="text-primary hover:underline flex items-center"><Scale className="mr-2 h-4 w-4" />Regulatory Alignment (ESPR, EPREL)</Link></li>
              <li><Link href="/developer/docs/data-management-best-practices" className="text-primary hover:underline flex items-center"><LayersIcon className="mr-2 h-4 w-4" />Data Management Best Practices</Link></li>
              <li><Link href="/developer/docs/qr-code-embedding" className="text-primary hover:underline flex items-center"><QrCode className="mr-2 h-4 w-4" />QR Code Generation &amp; Embedding</Link></li>
              <li><Link href="/developer/guides/auditor-integration" className="text-primary hover:underline flex items-center"><ShieldCheck className="mr-2 h-4 w-4" />Auditor Integration</Link></li>
            </ul>
          </div>
          <div className="space-y-6"> 
            <div className="space-y-3">
              <h4 className="font-semibold text-md mb-1 flex items-center">
                <TestTube2 className="mr-2 h-5 w-5 text-accent" />Testing &amp; Validation
              </h4>
              <ul className="list-none space-y-1.5 text-sm">
                <li><Link href="/developer/docs/testing-validation" className="text-primary hover:underline flex items-center"><TestTube2 className="mr-2 h-4 w-4" />Testing &amp; Validation Guide</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-md mb-1 flex items-center">
                <ServerIconShadcn className="mr-2 h-5 w-5 text-accent" />Operations
              </h4>
              <ul className="list-none space-y-1.5 text-sm">
                <li><Link href="/developer/docs/deployment-monitoring" className="text-primary hover:underline flex items-center"><ServerIconShadcn className="mr-2 h-4 w-4" />Deployment &amp; Monitoring Guide</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-md mb-1 flex items-center">
                <VenetianMask className="mr-2 h-5 w-5 text-accent" />Security &amp; Privacy
              </h4>
              <ul className="list-none space-y-1.5 text-sm">
                <li><Link href="/developer/docs/data-privacy" className="text-primary hover:underline flex items-center"><VenetianMask className="mr-2 h-4 w-4" />Data Privacy &amp; GDPR Guide</Link></li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    

