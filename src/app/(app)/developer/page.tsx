
// --- File: page.tsx (Developer Portal) ---
// Description: Main page for the Developer Portal, providing access to API keys, documentation, and tools.
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge"; 
import { KeyRound, BookOpen, Lightbulb, ShieldAlert, LifeBuoy, PlusCircle, Copy, Trash2, PlayCircle, Send, FileJson, Loader2, ServerIcon as ServerLucideIcon, BarChart2, FileClock, Edit2, Link as LinkIconPath, ExternalLink as ExternalLinkIcon, Search, Users, Activity, FileCog, Scale, Rocket, Settings2, PackageSearch, Layers, Lock, MessageSquare, Share2, BookText, VenetianMask, TestTube2, Server as ServerIconShadcn, Webhook, Info } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

import ApiKeysManager, { type ApiKey } from '@/components/developer/ApiKeysManager';
import WebhooksManager, { type WebhookEntry } from '@/components/developer/WebhooksManager';


const initialMockApiKeys: ApiKey[] = [
  { id: "key_sandbox_1", key: "sand_sk_xxxx1234ABCD...", type: "Sandbox", created: "2024-07-01", lastUsed: "2024-07-28", status: "Active" },
  { id: "key_prod_req_1", key: "N/A (Request Pending)", type: "Production", created: "2024-07-25", lastUsed: "N/A", status: "Pending Approval" },
  { id: "key_prod_active_1", key: "prod_sk_xxxx5678EFGH...", type: "Production", created: "2024-06-15", lastUsed: "2024-07-29", status: "Active" },
];

const initialMockWebhooks: WebhookEntry[] = [
  { id: "wh_1", url: "https://api.example.com/webhook/product-updates", events: ["product.created", "product.updated", "dpp.status.changed"], status: "Active" },
  { id: "wh_2", url: "https://api.example.com/webhook/compliance-changes", events: ["compliance.status.changed"], status: "Disabled" },
  { id: "wh_3", url: "https://user.integrations.com/norruva/events", events: ["product.lifecycle.event.added", "product.deleted"], status: "Active" },
];

const MOCK_API_PRODUCTS: Record<string, any> = {
  "PROD001": {
    productId: "PROD001",
    productName: "EcoFriendly Refrigerator X2000",
    category: "Appliances",
    status: "Active",
    manufacturer: "GreenTech Appliances",
    modelNumber: "X2000-ECO",
    gtin: "01234567890123",
    energyLabel: "A+++",
    compliance: {
      REACH: { status: "Compliant", lastChecked: "2024-07-01" },
      RoHS: { status: "Compliant", lastChecked: "2024-07-01" }
    },
    lifecycleEvents: [
        { eventId: "EVT001", type: "Manufactured", timestamp: "2024-01-15T08:00:00Z", location: "EcoFactory, Germany" }
    ]
  },
  "PROD002": {
    productId: "PROD002",
    productName: "Smart LED Bulb (4-Pack)",
    category: "Electronics",
    status: "Active",
    manufacturer: "BrightSpark Electronics",
    modelNumber: "BS-LED-S04B",
    gtin: "98765432109876",
    energyLabel: "A+",
    compliance: {
      RoHS: { status: "Compliant", lastChecked: "2024-07-01" },
      CE_Mark: { status: "Compliant", lastChecked: "2024-07-01" },
      Battery_Regulation: { status: "Pending Documentation", lastChecked: "2024-07-20"}
    },
    lifecycleEvents: []
  }
};

const MOCK_COMPLIANCE_SUMMARIES: Record<string, any> = {
    "PROD001": {
        productId: "PROD001",
        overallStatus: "Compliant",
        details: [
            { regulation: "REACH", status: "Compliant", lastChecked: "2024-07-01", evidenceLink: "/docs/PROD001/REACH.pdf" },
            { regulation: "RoHS", status: "Compliant", lastChecked: "2024-07-01", evidenceLink: "/docs/PROD001/RoHS.pdf" },
            { regulation: "WEEE", status: "Compliant", lastChecked: "2024-07-01", evidenceLink: "/docs/PROD001/WEEE.pdf" }
        ],
        nextReviewDate: "2025-07-01"
    },
    "PROD002": {
        productId: "PROD002",
        overallStatus: "Pending Documentation",
        details: [
            { regulation: "RoHS", status: "Compliant", lastChecked: "2024-07-01" },
            { regulation: "CE Mark", status: "Compliant", lastChecked: "2024-07-01" },
            { regulation: "EU Battery Regulation", status: "Pending Documentation", lastChecked: "2024-07-20", notes: "Awaiting battery chemistry details from supplier." }
        ],
        nextReviewDate: "2024-08-15"
    }
}

export default function DeveloperPortalPage() {
  const { toast } = useToast();

  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialMockApiKeys);
  const [webhooks, setWebhooks] = useState<WebhookEntry[]>(initialMockWebhooks);

  const [getProductId, setGetProductId] = useState<string>("PROD001");
  const [getProductResponse, setGetProductResponse] = useState<string | null>(null);
  const [isGetProductLoading, setIsGetProductLoading] = useState(false);

  const [listProductsResponse, setListProductsResponse] = useState<string | null>(null);
  const [isListProductsLoading, setIsListProductsLoading] = useState(false);
  
  const [postLifecycleEventProductId, setPostLifecycleEventProductId] = useState<string>("PROD001");
  const [postLifecycleEventBody, setPostLifecycleEventBody] = useState<string>(
    JSON.stringify({ eventType: "Shipped", location: "Warehouse B", details: "Order #SO12345" }, null, 2)
  );
  const [postLifecycleEventResponse, setPostLifecycleEventResponse] = useState<string | null>(null);
  const [isPostLifecycleEventLoading, setIsPostLifecycleEventLoading] = useState(false);

  const [getComplianceProductId, setGetComplianceProductId] = useState<string>("PROD001");
  const [getComplianceResponse, setGetComplianceResponse] = useState<string | null>(null);
  const [isGetComplianceLoading, setIsGetComplianceLoading] = useState(false);


  const handleCopyKey = (apiKeyToCopy: string) => {
    if (apiKeyToCopy.startsWith("N/A")) {
        toast({ title: "Key Not Available", description: "This key is pending approval or not yet generated."});
        return;
    }
    navigator.clipboard.writeText(apiKeyToCopy);
    toast({
      title: "API Key Copied!",
      description: "The API key has been copied to your clipboard.",
    });
  };

  const handleGenerateSandboxKey = () => {
    const newKeyId = `key_sandbox_${Date.now().toString().slice(-5)}`;
    const newKey: ApiKey = {
      id: newKeyId,
      key: `sand_sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}...`,
      type: "Sandbox",
      created: new Date().toISOString().split('T')[0],
      lastUsed: "Never",
      status: "Active"
    };
    setApiKeys(prevKeys => [newKey, ...prevKeys]);
    toast({ title: "Sandbox Key Generated", description: `New key ${newKey.key.substring(0,15)}... created.` });
  };

  const handleRequestProductionKey = () => {
    const newReqId = `key_prod_req_${Date.now().toString().slice(-5)}`;
    const newRequest: ApiKey = {
      id: newReqId,
      key: "N/A (Request Pending)",
      type: "Production",
      created: new Date().toISOString().split('T')[0],
      lastUsed: "N/A",
      status: "Pending Approval"
    };
    setApiKeys(prevKeys => [newRequest, ...prevKeys]);
    toast({ title: "Production Key Requested", description: "Your request for a production key has been submitted (mock)." });
  };
  
  const handleDeleteApiKey = (keyId: string) => {
    setApiKeys(prevKeys => prevKeys.filter(key => key.id !== keyId));
    toast({ title: "API Key Deleted", description: `Key ID ${keyId} has been removed (mock).`, variant: "destructive" });
  };

  const handleAddWebhook = () => {
    const newWebhookId = `wh_${Date.now().toString().slice(-5)}`;
    const newWebhook: WebhookEntry = {
      id: newWebhookId,
      url: `https://new.webhook.example.com/handler/${newWebhookId}`,
      events: ["product.updated", "dpp.verified"],
      status: "Active"
    };
    setWebhooks(prevWebhooks => [newWebhook, ...prevWebhooks]);
    toast({ title: "Webhook Added", description: `New webhook for ${newWebhook.url} created (mock).` });
  };

  const handleEditWebhook = (webhookId: string) => {
    toast({ title: "Mock Action", description: `Edit functionality for webhook ${webhookId} is not implemented.` });
  };

  const handleDeleteWebhook = (webhookId: string) => {
    setWebhooks(prevWebhooks => prevWebhooks.filter(wh => wh.id !== webhookId));
    toast({ title: "Webhook Deleted", description: `Webhook ID ${webhookId} has been removed (mock).`, variant: "destructive" });
  };


  const handleMockGetProductDetails = async () => {
    setIsGetProductLoading(true);
    setGetProductResponse(null);
    await new Promise(resolve => setTimeout(resolve, 700)); 
    const product = MOCK_API_PRODUCTS[getProductId];
    if (product) {
      setGetProductResponse(JSON.stringify(product, null, 2));
    } else {
      setGetProductResponse(JSON.stringify({ error: "Product not found", productId: getProductId }, null, 2));
    }
    setIsGetProductLoading(false);
  };

  const handleMockListProducts = async () => {
    setIsListProductsLoading(true);
    setListProductsResponse(null);
    await new Promise(resolve => setTimeout(resolve, 500)); 
    const response = {
      data: Object.values(MOCK_API_PRODUCTS),
      pageInfo: {
        totalCount: Object.keys(MOCK_API_PRODUCTS).length,
        hasNextPage: false,
      }
    };
    setListProductsResponse(JSON.stringify(response, null, 2));
    setIsListProductsLoading(false);
  };

  const handleMockPostLifecycleEvent = async () => {
    setIsPostLifecycleEventLoading(true);
    setPostLifecycleEventResponse(null);
    await new Promise(resolve => setTimeout(resolve, 600));
    try {
        const requestBody = JSON.parse(postLifecycleEventBody);
        if (!MOCK_API_PRODUCTS[postLifecycleEventProductId]) {
            setPostLifecycleEventResponse(JSON.stringify({ error: "Product not found", productId: postLifecycleEventProductId }, null, 2));
            setIsPostLifecycleEventLoading(false); 
            return;
        }
        const response = {
            success: true,
            eventId: `EVT_MOCK_${Date.now().toString().slice(-5)}`,
            productId: postLifecycleEventProductId,
            message: "Lifecycle event added successfully (mock).",
            receivedData: requestBody
        };
        setPostLifecycleEventResponse(JSON.stringify(response, null, 2));
    } catch (e) {
        setPostLifecycleEventResponse(JSON.stringify({ error: "Invalid JSON in request body.", details: e instanceof Error ? e.message : String(e) }, null, 2));
    } finally {
        setIsPostLifecycleEventLoading(false);
    }
  };

  const handleMockGetComplianceSummary = async () => {
    setIsGetComplianceLoading(true);
    setGetComplianceResponse(null);
    await new Promise(resolve => setTimeout(resolve, 650));
    const summary = MOCK_COMPLIANCE_SUMMARIES[getComplianceProductId];
    if (summary) {
      setGetComplianceResponse(JSON.stringify(summary, null, 2));
    } else {
      setGetComplianceResponse(JSON.stringify({ error: "Compliance summary not found for product", productId: getComplianceProductId }, null, 2));
    }
    setIsGetComplianceLoading(false);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline font-semibold">Developer Portal</h1>
      </div>

      <div className="relative w-full md:max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search Developer Portal (coming soon)..."
          className="pl-10 bg-background" 
          disabled 
        />
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><Rocket className="mr-3 h-6 w-6 text-primary" /> Getting Started</CardTitle>
          <CardDescription>New to Norruva DPP? Start here to learn the basics and make your first API call.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="default" asChild>
            <Link href="/developer/guides/quick-start">
              Read Quick Start Guide
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            Our Quick Start Guide will walk you through setting up your environment, authentication, and basic DPP operations.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-xl border-primary/20" id="api-playground">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><PlayCircle className="mr-3 h-6 w-6 text-primary" /> Interactive API Playground</CardTitle>
          <CardDescription>Experiment with Norruva API endpoints in this interactive sandbox. This environment uses mock data and simulated responses, allowing you to test integrations safely.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Get Product Details Endpoint */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center"><ServerLucideIcon className="mr-2 h-5 w-5 text-info"/>GET /api/v1/products/{'{productId}'}</CardTitle>
              <CardDescription>Retrieve details for a specific product by its ID.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="productIdInput-get">Product ID</Label>
                <Input id="productIdInput-get" value={getProductId} onChange={(e) => setGetProductId(e.target.value)} placeholder="e.g., PROD001" />
              </div>
              <Button onClick={handleMockGetProductDetails} disabled={isGetProductLoading} variant="secondary">
                {isGetProductLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                {isGetProductLoading ? "Fetching..." : "Send Request"}
              </Button>
              {getProductResponse && (
                <div className="mt-4">
                  <Label className="flex items-center"><FileJson className="mr-2 h-4 w-4 text-accent"/>Mock Response:</Label>
                  <pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto max-h-60"><code>{getProductResponse}</code></pre>
                </div>
              )}
              <div className="mt-4">
                <Label className="flex items-center font-medium"><Info className="mr-2 h-4 w-4 text-muted-foreground"/>Example cURL Request (Conceptual):</Label>
                <pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto">
                  <code>
{`curl -X GET "https://your-norruva-instance.com/api/v1/products/${getProductId || '{productId}'}" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                  </code>
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* List Products Endpoint */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center"><ServerLucideIcon className="mr-2 h-5 w-5 text-info"/>GET /api/v1/products</CardTitle>
              <CardDescription>Retrieve a list of products. (Mock returns all available mock products)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <Button onClick={handleMockListProducts} disabled={isListProductsLoading} variant="secondary">
                {isListProductsLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                {isListProductsLoading ? "Fetching..." : "Send Request"}
              </Button>
              {listProductsResponse && (
                <div className="mt-4">
                  <Label className="flex items-center"><FileJson className="mr-2 h-4 w-4 text-accent"/>Mock Response:</Label>
                  <pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto max-h-60"><code>{listProductsResponse}</code></pre>
                </div>
              )}
              <div className="mt-4">
                <Label className="flex items-center font-medium"><Info className="mr-2 h-4 w-4 text-muted-foreground"/>Example cURL Request (Conceptual):</Label>
                <pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto">
                  <code>
{`curl -X GET "https://your-norruva-instance.com/api/v1/products?category=Electronics&status=Active" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                  </code>
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* POST Lifecycle Event Endpoint */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center"><ServerLucideIcon className="mr-2 h-5 w-5 text-info"/>POST /api/v1/products/{'{productId}'}/lifecycle-events</CardTitle>
              <CardDescription>Add a new lifecycle event to a product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="productIdInput-post-event">Product ID</Label>
                <Input id="productIdInput-post-event" value={postLifecycleEventProductId} onChange={(e) => setPostLifecycleEventProductId(e.target.value)} placeholder="e.g., PROD001"/>
              </div>
              <div>
                <Label htmlFor="postLifecycleEventBody">Request Body (JSON)</Label>
                <Textarea id="postLifecycleEventBody" value={postLifecycleEventBody} onChange={(e) => setPostLifecycleEventBody(e.target.value)} rows={5} className="font-mono text-xs"/>
              </div>
              <Button onClick={handleMockPostLifecycleEvent} disabled={isPostLifecycleEventLoading} variant="secondary">
                {isPostLifecycleEventLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                {isPostLifecycleEventLoading ? "Sending..." : "Send Request"}
              </Button>
              {postLifecycleEventResponse && (
                <div className="mt-4">
                  <Label className="flex items-center"><FileJson className="mr-2 h-4 w-4 text-accent"/>Mock Response:</Label>
                  <pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto max-h-60"><code>{postLifecycleEventResponse}</code></pre>
                </div>
              )}
              <div className="mt-4">
                <Label className="flex items-center font-medium"><Info className="mr-2 h-4 w-4 text-muted-foreground"/>Example cURL Request (Conceptual):</Label>
                <pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto">
                  <code>
{`curl -X POST "https://your-norruva-instance.com/api/v1/products/${postLifecycleEventProductId || '{productId}'}/lifecycle-events" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '${postLifecycleEventBody}'`}
                  </code>
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* GET Compliance Summary Endpoint */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center"><ServerLucideIcon className="mr-2 h-5 w-5 text-info"/>GET /api/v1/products/{'{productId}'}/compliance-summary</CardTitle>
              <CardDescription>Retrieve a compliance summary for a specific product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="productIdInput-get-compliance">Product ID</Label>
                <Input id="productIdInput-get-compliance" value={getComplianceProductId} onChange={(e) => setGetComplianceProductId(e.target.value)} placeholder="e.g., PROD001" />
              </div>
              <Button onClick={handleMockGetComplianceSummary} disabled={isGetComplianceLoading} variant="secondary">
                {isGetComplianceLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                {isGetComplianceLoading ? "Fetching..." : "Send Request"}
              </Button>
              {getComplianceResponse && (
                <div className="mt-4">
                  <Label className="flex items-center"><FileJson className="mr-2 h-4 w-4 text-accent"/>Mock Response:</Label>
                  <pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto max-h-60"><code>{getComplianceResponse}</code></pre>
                </div>
              )}
              <div className="mt-4">
                <Label className="flex items-center font-medium"><Info className="mr-2 h-4 w-4 text-muted-foreground"/>Example cURL Request (Conceptual):</Label>
                <pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto">
                  <code>
{`curl -X GET "https://your-norruva-instance.com/api/v1/products/${getComplianceProductId || '{productId}'}/compliance-summary" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                  </code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <ApiKeysManager
        apiKeys={apiKeys}
        onCopyKey={handleCopyKey}
        onGenerateSandboxKey={handleGenerateSandboxKey}
        onRequestProductionKey={handleRequestProductionKey}
        onDeleteApiKey={handleDeleteApiKey}
      />

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-lg" id="api-docs">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><BookOpen className="mr-3 h-6 w-6 text-primary" /> API Documentation &amp; Guides</CardTitle>
            <CardDescription>Explore detailed documentation, integration guides, and best practices for building with Norruva DPP APIs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
                <h4 className="font-semibold">Core Documentation</h4>
                <ul className="list-disc list-inside text-sm text-primary space-y-1 pl-2">
                    <li><Link href="/developer/docs/api-reference" className="hover:underline flex items-center"><BookText className="mr-1.5 h-4 w-4 inline-block"/>API Reference</Link> <span className="text-xs text-muted-foreground">(Endpoints, Schemas)</span></li>
                    <li><Link href="/developer/docs/authentication" className="hover:underline flex items-center"><KeyRound className="mr-1.5 h-4 w-4 inline-block"/>Authentication</Link> <span className="text-xs text-muted-foreground">(API Keys, OAuth 2.0)</span></li>
                    <li><Link href="#" className="hover:underline text-muted-foreground line-through flex items-center"><LinkIconPath className="mr-1.5 h-4 w-4 inline-block"/>Rate Limiting &amp; Usage</Link> <span className="text-xs text-muted-foreground">(Coming Soon)</span></li>
                    <li><Link href="#" className="hover:underline text-muted-foreground line-through flex items-center"><FileCog className="mr-1.5 h-4 w-4 inline-block"/>Error Codes &amp; Handling</Link> <span className="text-xs text-muted-foreground">(Coming Soon)</span></li>
                </ul>
            </div>
             <div className="space-y-2 pt-3 border-t">
                <h4 className="font-semibold">Integration Guides &amp; Best Practices</h4>
                <ul className="list-disc list-inside text-sm text-primary space-y-1 pl-2">
                    <li><Link href="/developer/guides/quick-start" className="hover:underline flex items-center"><Rocket className="mr-1.5 h-4 w-4 inline-block"/>Quick Start Integration Guide</Link></li>
                    <li><Link href="/developer/docs/ebsi-integration" className="hover:underline flex items-center"><Share2 className="mr-1.5 h-4 w-4 inline-block"/>EBSI Integration Overview</Link></li>
                    <li><Link href="#" className="hover:underline text-muted-foreground line-through flex items-center"><Scale className="mr-1.5 h-4 w-4 inline-block"/>Regulatory Alignment (ESPR, EPREL)</Link> <span className="text-xs text-muted-foreground">(Coming Soon)</span></li>
                    <li><Link href="#" className="hover:underline text-muted-foreground line-through flex items-center"><Layers className="mr-1.5 h-4 w-4 inline-block"/>Best Practices for Data Management</Link> <span className="text-xs text-muted-foreground">(Coming Soon)</span></li>
                </ul>
            </div>
            <div className="space-y-2 pt-3 border-t">
                <h4 className="font-semibold">Testing &amp; Validation</h4>
                 <ul className="list-disc list-inside text-sm text-primary space-y-1 pl-2">
                    <li><Link href="/developer/docs/testing-validation" className="hover:underline flex items-center"><TestTube2 className="mr-1.5 h-4 w-4 inline-block"/>Testing &amp; Validation Guide</Link></li>
                 </ul>
            </div>
             <div className="space-y-2 pt-3 border-t">
                <h4 className="font-semibold">Operations</h4>
                 <ul className="list-disc list-inside text-sm text-primary space-y-1 pl-2">
                    <li><Link href="/developer/docs/deployment-monitoring" className="hover:underline flex items-center"><ServerIconShadcn className="mr-1.5 h-4 w-4 inline-block"/>Deployment &amp; Monitoring Guide</Link></li>
                 </ul>
            </div>
             <div className="space-y-2 pt-3 border-t">
                <h4 className="font-semibold">Security &amp; Privacy</h4>
                 <ul className="list-disc list-inside text-sm text-primary space-y-1 pl-2">
                    <li><Link href="/developer/docs/data-privacy" className="hover:underline flex items-center"><VenetianMask className="mr-1.5 h-4 w-4 inline-block"/>Data Privacy &amp; GDPR Guide</Link></li>
                 </ul>
            </div>
            <Button variant="default" className="w-full sm:w-auto mt-3" asChild>
                <Link href="/developer/docs/api-reference">
                    <FileJson className="mr-2 h-5 w-5" /> View Full API Reference
                </Link>
            </Button>
          </CardContent>
        </Card>

        <WebhooksManager
          webhooks={webhooks}
          onAddWebhook={handleAddWebhook}
          onEditWebhook={handleEditWebhook}
          onDeleteWebhook={handleDeleteWebhook}
        />
      </div>
      
      <Card className="shadow-lg" id="developer-resources">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><Lightbulb className="mr-3 h-6 w-6 text-primary" /> Developer Resources</CardTitle>
          <CardDescription>Find SDKs, code samples, templates, tutorials, and GitHub resources to accelerate your DPP integration.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">SDKs (Coming Soon)</h4>
            <ul className="space-y-2">
              <li> <Button variant="outline" className="w-full justify-start" disabled> <FileCog className="mr-2 h-5 w-5 text-accent" /> JavaScript SDK </Button> </li>
              <li> <Button variant="outline" className="w-full justify-start" disabled> <FileCog className="mr-2 h-5 w-5 text-accent" /> Python SDK </Button> </li>
              <li> <Button variant="outline" className="w-full justify-start" disabled> <FileCog className="mr-2 h-5 w-5 text-accent" /> Java SDK </Button> </li>
            </ul>
             <p className="text-xs text-muted-foreground mt-2">Official SDKs are under development. Check back soon for updates.</p>
          </div>
          <div className="space-y-3">
            <div id="code-samples">
                <h4 className="font-semibold mb-1">Code Samples &amp; Templates</h4>
                 <p className="text-sm text-muted-foreground">Access a library of code snippets and project templates for common integration scenarios like DPP creation, event logging, and compliance checks.</p>
                <Button variant="link" className="p-0 h-auto text-primary hover:underline" asChild>
                  <Link href="#code-samples">Browse Code Samples (Mock)</Link>
                </Button>
            </div>
            <div id="tutorials">
                <h4 className="font-semibold mb-1">Tutorials</h4>
                 <p className="text-sm text-muted-foreground">Follow step-by-step guides to implement specific DPP functionalities and use cases, such as blockchain anchoring or battery passport data submission.</p>
                 <Button variant="link" className="p-0 h-auto text-primary hover:underline" asChild>
                  <Link href="#tutorials">View Tutorials (Mock)</Link>
                </Button>
            </div>
            <div>
                <h4 className="font-semibold mb-1">GitHub Integration</h4>
                 <p className="text-sm text-muted-foreground">Explore our open-source repositories, contribute to the ecosystem, find community projects, and raise issues related to our SDKs or platform.</p>
                 <Button variant="link" className="p-0 h-auto text-primary hover:underline" asChild>
                  <Link href="#" target="_blank" rel="noopener noreferrer">Norruva on GitHub (Mock) <ExternalLinkIcon className="inline h-3 w-3 ml-1" /></Link>
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><Settings2 className="mr-3 h-6 w-6 text-primary" /> Advanced Features &amp; Customization</CardTitle>
          <CardDescription>Explore advanced capabilities to tailor your DPP solutions and manage integrations effectively.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-md mb-1 flex items-center"><PackageSearch className="mr-2 h-5 w-5 text-accent"/>Customizable DPP Templates</h4>
            <p className="text-sm text-muted-foreground">Define custom data schemas and presentation templates for your Digital Product Passports to meet specific industry or product needs. (Coming Soon)</p>
            <Button variant="outline" size="sm" className="mt-2" disabled>Explore Templates (Soon)</Button>
          </div>
          <div className="pt-3 border-t">
            <h4 className="font-semibold text-md mb-1 flex items-center"><Layers className="mr-2 h-5 w-5 text-accent"/>Advanced Query Options</h4>
            <p className="text-sm text-muted-foreground">Utilize powerful query capabilities to search and filter DPP data based on complex criteria, enabling sophisticated data analysis and reporting. (Documentation Coming Soon)</p>
             <Button variant="link" className="p-0 h-auto text-primary hover:underline mt-1" asChild>
                <Link href="#">View Query Language Docs (Mock)</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground pt-3 border-t">
            Information on API Rate Limiting and access to your API Usage &amp; Reporting dashboard (see below) are also key parts of our advanced feature set.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><BarChart2 className="mr-3 h-6 w-6 text-primary" /> API Usage &amp; Reporting</CardTitle>
          <CardDescription>Monitor your API usage, view logs, and understand integration performance (Mock Data).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-md font-medium flex items-center"><FileClock className="mr-2 h-4 w-4 text-info"/>Recent API Calls</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">1,234</p>
                        <p className="text-xs text-muted-foreground">in the last 24 hours</p>
                    </CardContent>
                </Card>
                 <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-md font-medium flex items-center"><ShieldAlert className="mr-2 h-4 w-4 text-destructive"/>Error Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">0.15%</p>
                        <p className="text-xs text-muted-foreground">Average over the last 7 days</p>
                    </CardContent>
                </Card>
            </div>
            <ul className="list-disc list-inside text-sm space-y-1">
                <li><Link href="#" className="text-primary hover:underline">View detailed API call logs (Mock)</Link></li>
                <li><Link href="#" className="text-primary hover:underline">Webhook delivery success rates and retry attempts (Mock)</Link></li>
                <li><Button variant="outline" size="sm" className="mt-1" disabled>Export usage reports (Coming Soon)</Button></li>
            </ul>
             <Button variant="outline" disabled>Access Full Reporting Dashboard (Coming Soon)</Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><Scale className="mr-3 h-6 w-6 text-primary" /> Regulatory Updates &amp; Compliance Tools</CardTitle>
          <CardDescription>Stay informed on EU regulations and access tools to help validate your DPP solutions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-1">Latest Regulatory News</h4>
            <p className="text-sm text-muted-foreground">This section will feature updates on ESPR, EPREL, EBSI, and other relevant EU directives impacting Digital Product Passports. Check back for timelines, guidance documents, and summaries.</p>
            <Button variant="link" className="p-0 h-auto text-primary hover:underline mt-1" asChild>
                <Link href="#">View All Updates (Mock)</Link>
            </Button>
          </div>
          <div className="pt-3 border-t">
            <h4 className="font-semibold mb-1">Compliance Validation Tools (Coming Soon)</h4>
            <p className="text-sm text-muted-foreground">We are developing tools to help you check your DPP data structures and API integrations against common regulatory requirements. These tools will provide feedback and suggestions for improvement.</p>
            <Button variant="outline" size="sm" className="mt-2" disabled>Access Validation Tools (Soon)</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg" id="security-privacy">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><Lock className="mr-3 h-6 w-6 text-primary" /> Security &amp; Data Privacy</CardTitle>
          <CardDescription>Resources on securing DPP applications, GDPR compliance, and data integrity.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h4 className="font-semibold text-md mb-1">Securing DPP Applications</h4>
            <p className="text-sm text-muted-foreground">Best practices for API key management, authentication, authorization, and secure data handling when building applications that interact with DPPs.</p>
            <Button variant="link" className="p-0 h-auto text-primary hover:underline mt-1" asChild>
                <Link href="#">Read Security Guide (Mock)</Link>
            </Button>
          </div>
          <div className="pt-3 border-t">
            <h4 className="font-semibold text-md mb-1 flex items-center"><VenetianMask className="mr-2 h-4 w-4 text-accent"/>GDPR Compliance for Developers</h4>
            <p className="text-sm text-muted-foreground">Understand your responsibilities under GDPR when processing personal data associated with Digital Product Passports. Access guidelines and checklists.</p>
             <Button variant="link" className="p-0 h-auto text-primary hover:underline mt-1" asChild>
                <Link href="/developer/docs/data-privacy">View Data Privacy &amp; GDPR Guide</Link>
            </Button>
          </div>
           <div className="pt-3 border-t">
            <h4 className="font-semibold text-md mb-1">Blockchain for Data Integrity</h4>
            <p className="text-sm text-muted-foreground">Learn how Norruva leverages blockchain (or similar distributed ledger technologies) to enhance the integrity and traceability of DPP data, and how to interact with these features.</p>
             <Button variant="link" className="p-0 h-auto text-primary hover:underline mt-1" asChild>
                <Link href="#">Blockchain Integration Docs (Mock)</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><Users className="mr-3 h-6 w-6 text-primary" /> Support &amp; Community</CardTitle>
          <CardDescription>Get help, share ideas, and connect with other developers building with Norruva.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
             <Link href="#" target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="outline" className="w-full h-full flex-col py-4 group hover:border-primary hover:bg-primary/5">
                  <LifeBuoy className="mb-1 h-6 w-6 text-accent group-hover:text-primary transition-colors"/> 
                  <span className="group-hover:text-primary transition-colors">Help Center / FAQ</span>
                  <span className="text-xs text-muted-foreground">(Mock)</span>
              </Button>
             </Link>
             <Link href="#" target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="outline" className="w-full h-full flex-col py-4 group hover:border-primary hover:bg-primary/5">
                  <Activity className="mb-1 h-6 w-6 text-accent group-hover:text-primary transition-colors"/> 
                  <span className="group-hover:text-primary transition-colors">Community Forum</span>
                  <span className="text-xs text-muted-foreground">(Mock Link)</span>
              </Button>
             </Link>
             <Link href="#" target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="outline" className="w-full h-full flex-col py-4 group hover:border-primary hover:bg-primary/5">
                  <FileCog className="mb-1 h-6 w-6 text-accent group-hover:text-primary transition-colors"/> 
                  <span className="group-hover:text-primary transition-colors">Submit Support Ticket</span>
                  <span className="text-xs text-muted-foreground">(Mock Link)</span>
              </Button>
             </Link>
          </div>
          <div className="pt-4 border-t border-border">
            <Button variant="link" asChild className="p-0 h-auto text-primary hover:underline">
              <a href="mailto:dev-feedback@norruva.com">
                <MessageSquare className="mr-2 h-4 w-4"/> Provide Feedback (dev-feedback@norruva.com)
              </a>
            </Button>
            <p className="text-xs text-muted-foreground mt-1">Help us improve the Developer Portal by sharing your thoughts and suggestions.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
