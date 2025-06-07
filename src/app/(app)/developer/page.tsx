
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
import { KeyRound, BookOpen, Lightbulb, ShieldAlert, LifeBuoy, PlusCircle, Copy, Trash2, PlayCircle, Send, FileJson, Loader2, ServerIcon as ServerLucideIcon, BarChart2, FileClock, Edit2, Link as LinkIconPath, ExternalLink as ExternalLinkIcon, Search, Users, Activity, FileCog, Scale, Rocket, Settings2, PackageSearch, Layers, Lock, MessageSquare, Share2, BookText, VenetianMask, TestTube2, Server as ServerIconShadcn, Webhook, Info, Clock, AlertTriangle as ErrorIcon, Layers as LayersIcon, FileCode, LayoutGrid, Wrench, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

import ApiKeysManager, { type ApiKey } from '@/components/developer/ApiKeysManager';
import WebhooksManager, { type WebhookEntry } from '@/components/developer/WebhooksManager';


const initialMockApiKeys: ApiKey[] = [
  { id: "key_sandbox_1", key: "sand_sk_xxxx1234ABCD", type: "Sandbox", created: "2024-07-01", lastUsed: "2024-07-28", status: "Active" },
  { id: "key_prod_req_1", key: "N/A (Request Pending)", type: "Production", created: "2024-07-25", lastUsed: "N/A", status: "Pending Approval" },
  { id: "key_prod_active_1", key: "prod_sk_xxxx5678EFGH", type: "Production", created: "2024-06-15", lastUsed: "2024-07-29", status: "Active" },
  { id: "key_sandbox_revoked_1", key: "sand_sk_xxxxWXYZrevoked", type: "Sandbox", created: "2024-05-10", lastUsed: "2024-05-12", status: "Revoked" },
];

const initialMockWebhooks: WebhookEntry[] = [
  { id: "wh_1", url: "https://api.example.com/webhook/product-updates", events: ["product.created", "product.updated", "dpp.status.changed"], status: "Active" },
  { id: "wh_2", url: "https://api.example.com/webhook/compliance-changes", events: ["compliance.status.changed"], status: "Disabled" },
  { id: "wh_3", url: "https://user.integrations.com/norruva/events", events: ["product.lifecycle.event.added", "product.deleted"], status: "Active" },
  { id: "wh_4", url: "https://another.service/endpoint/failed-hook", events: ["product.updated"], status: "Error" },
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

const mockCodeSamples = [
  { 
    id: "sample1", 
    title: "Fetching a Product Passport (Python)", 
    description: "A Python script demonstrating how to authenticate and retrieve a DPP using its ID.", 
    linkText: "View on GitHub (Mock)", 
    icon: FileCode 
  },
  { 
    id: "sample2", 
    title: "Creating a New DPP with Battery Data (Node.js)", 
    description: "Node.js example for creating a new product passport, including specific fields for EU Battery Regulation.", 
    linkText: "View Snippet (Mock)", 
    icon: FileCode 
  },
  { 
    id: "sample3", 
    title: "Validating a QR Identifier (Java)", 
    description: "Java code snippet for using the QR validation endpoint to get product summary information.", 
    linkText: "View on GitHub (Mock)", 
    icon: FileCode 
  },
];

const mockTutorials = [
  { 
    id: "tut1", 
    title: "Step-by-Step: Integrating DPP QR Scanning into a Retail App", 
    description: "Learn how to use the Norruva API to allow consumers to scan QR codes and view product passports directly in your application.", 
    linkText: "Read Tutorial (Mock)", 
    icon: BookText 
  },
  { 
    id: "tut2", 
    title: "Automating Compliance Updates with Webhooks", 
    description: "A guide on setting up webhooks to receive real-time notifications for DPP status changes or new compliance requirements.", 
    linkText: "Read Tutorial (Mock)", 
    icon: BookText 
  },
  { 
    id: "tut3", 
    title: "Best Practices for Managing DPP Data via API", 
    description: "Explore strategies for efficiently managing large volumes of product data, versioning DPPs, and ensuring data accuracy through API integrations.", 
    linkText: "Read Tutorial (Mock)", 
    icon: BookText 
  },
];


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


  const handleCopyKey = (keyToCopy: string) => {
    const keyEntry = apiKeys.find(k => k.key === keyToCopy);
    if (keyEntry?.status === 'Pending Approval' || keyToCopy.startsWith("N/A") || keyEntry?.status === 'Revoked') {
        toast({ 
            title: "Key Not Available", 
            description: `This key is ${keyEntry?.status?.toLowerCase() || 'not available for copying'}.`,
            variant: "destructive"
        });
        return;
    }
    navigator.clipboard.writeText(keyToCopy);
    toast({
      title: "API Key Copied!",
      description: "The API key has been copied to your clipboard.",
    });
  };

  const handleGenerateSandboxKey = () => {
    const newKeyId = `key_sandbox_${Date.now().toString().slice(-5)}`;
    const newKey: ApiKey = {
      id: newKeyId,
      key: `sand_sk_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`,
      type: "Sandbox",
      created: new Date().toISOString().split('T')[0],
      lastUsed: "Never",
      status: "Active"
    };
    setApiKeys(prevKeys => [newKey, ...prevKeys]);
    toast({ title: "Sandbox Key Generated", description: `New key ${newKey.key.substring(0,12)}... created.` });
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
    toast({ title: "Mock Action", description: `Edit functionality for webhook ${webhookId} is not implemented. In a real app, this would open an edit form.` });
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
    <div className="space-y-10"> {/* Increased overall spacing */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-4xl font-headline font-bold text-primary">Developer Portal</h1>
         <div className="relative w-full sm:w-auto md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
            type="search"
            placeholder="Search Portal (Coming Soon)..."
            className="pl-10 bg-background shadow-sm" 
            disabled 
            />
        </div>
      </div>

      {/* Section: Getting Started */}
      <section id="getting-started" className="space-y-4">
        <h2 className="text-2xl font-semibold font-headline flex items-center text-foreground">
            <Rocket className="mr-3 h-6 w-6 text-accent" /> Getting Started
        </h2>
        <Card className="shadow-lg bg-card border-primary/20">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-primary">Welcome to Norruva DPP API</CardTitle>
            <CardDescription>New to Norruva? Start here to learn the basics, set up your environment, and make your first API call.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="default" asChild size="lg">
              <Link href="/developer/guides/quick-start">
                Read Quick Start Guide
                <ExternalLinkIcon className="ml-2 h-4 w-4"/>
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Our Quick Start Guide will walk you through authentication and basic DPP operations.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Section: Core API Tools */}
      <section id="core-tools" className="space-y-4">
        <h2 className="text-2xl font-semibold font-headline flex items-center text-foreground">
            <Wrench className="mr-3 h-6 w-6 text-accent" /> Core API Tools
        </h2>
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="shadow-lg lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-headline flex items-center"><PlayCircle className="mr-3 h-6 w-6 text-primary" /> Interactive API Playground</CardTitle>
              <CardDescription>Experiment with Norruva API endpoints in this interactive sandbox. This environment uses mock data and simulated responses.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Placeholder for condensed playground or link */}
               <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center"><ServerLucideIcon className="mr-2 h-5 w-5 text-info"/>GET /products/{'{productId}'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label htmlFor="productIdInput-get-dev">Product ID</Label>
                    <Input id="productIdInput-get-dev" value={getProductId} onChange={(e) => setGetProductId(e.target.value)} placeholder="e.g., PROD001" />
                  </div>
                  <Button onClick={handleMockGetProductDetails} disabled={isGetProductLoading} variant="secondary" size="sm">
                    {isGetProductLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    {isGetProductLoading ? "Fetching..." : "Send Request"}
                  </Button>
                  {getProductResponse && (
                    <div className="mt-2">
                      <pre className="p-2 bg-muted rounded-md text-xs overflow-x-auto max-h-40"><code>{getProductResponse}</code></pre>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Button variant="outline" asChild className="w-full">
                <Link href="#api-playground-full"> {/* Update this if the full playground is on a separate section/page */}
                  <PlayCircle className="mr-2 h-4 w-4"/> Go to Full API Playground
                </Link>
              </Button>
            </CardContent>
          </Card>
          <div className="space-y-6 lg:col-span-1">
            <ApiKeysManager
              apiKeys={apiKeys.slice(0,2)} // Show fewer for brevity
              onCopyKey={handleCopyKey}
              onGenerateSandboxKey={handleGenerateSandboxKey}
              onRequestProductionKey={handleRequestProductionKey}
              onDeleteApiKey={handleDeleteApiKey}
            />
            <WebhooksManager
              webhooks={webhooks.slice(0,1)} // Show fewer
              onAddWebhook={handleAddWebhook}
              onEditWebhook={handleEditWebhook}
              onDeleteWebhook={handleDeleteWebhook}
            />
          </div>
        </div>
      </section>
      
      <div id="api-playground-full"> {/* Anchor for the full playground section */}
        <Card className="shadow-xl border-primary/20 mt-8">
            <CardHeader>
            <CardTitle className="font-headline flex items-center"><PlayCircle className="mr-3 h-6 w-6 text-primary" /> Full Interactive API Playground</CardTitle>
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
      </div>

      {/* Section: Documentation Hub */}
      <section id="documentation-hub" className="space-y-4">
        <h2 className="text-2xl font-semibold font-headline flex items-center text-foreground">
            <BookOpen className="mr-3 h-6 w-6 text-accent" /> Documentation Hub
        </h2>
        <Card className="shadow-lg" id="api-docs">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><BookText className="mr-3 h-6 w-6 text-primary" /> API Documentation &amp; Guides</CardTitle>
            <CardDescription>Explore detailed documentation, integration guides, and best practices for building with Norruva DPP APIs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <h4 className="font-semibold text-md mb-2">Core Documentation</h4>
              <ul className="list-none space-y-2.5 text-sm pl-0">
                <li><Link href="/developer/docs/api-reference" className="text-primary hover:underline flex items-center"><BookText className="mr-2 h-4 w-4"/>API Reference <span className="text-xs text-muted-foreground ml-1.5"> (Endpoints, Schemas)</span></Link></li>
                <li><Link href="/developer/docs/authentication" className="text-primary hover:underline flex items-center"><KeyRound className="mr-2 h-4 w-4"/>Authentication <span className="text-xs text-muted-foreground ml-1.5"> (API Keys)</span></Link></li>
                <li><Link href="/developer/docs/webhooks-guide" className="text-primary hover:underline flex items-center"><Webhook className="mr-2 h-4 w-4"/>Webhooks Guide <span className="text-xs text-muted-foreground ml-1.5"> (Event Notifications)</span></Link></li>
                <li><Link href="/developer/docs/rate-limiting" className="text-primary hover:underline flex items-center"><Clock className="mr-2 h-4 w-4"/>Rate Limiting &amp; Usage</Link></li>
                <li><Link href="/developer/docs/error-codes" className="text-primary hover:underline flex items-center"><ErrorIcon className="mr-2 h-4 w-4"/>Error Codes &amp; Handling</Link></li>
              </ul>
            </div>
            <div className="pt-4 border-t border-border/70">
              <h4 className="font-semibold text-md mb-2">Integration Guides &amp; Best Practices</h4>
              <ul className="list-none space-y-2.5 text-sm pl-0">
                <li><Link href="/developer/guides/quick-start" className="text-primary hover:underline flex items-center"><Rocket className="mr-2 h-4 w-4"/>Quick Start Integration Guide</Link></li>
                <li><Link href="/developer/docs/ebsi-integration" className="text-primary hover:underline flex items-center"><Share2 className="mr-2 h-4 w-4"/>EBSI Integration Overview</Link></li>
                <li><Link href="/developer/docs/regulatory-alignment" className="text-primary hover:underline flex items-center"><Scale className="mr-2 h-4 w-4"/>Regulatory Alignment (ESPR, EPREL)</Link></li>
                <li><Link href="/developer/docs/data-management-best-practices" className="text-primary hover:underline flex items-center"><LayersIcon className="mr-2 h-4 w-4"/>Data Management Best Practices</Link></li>
              </ul>
            </div>
            <div className="pt-4 border-t border-border/70">
              <h4 className="font-semibold text-md mb-2">Testing &amp; Validation</h4>
              <ul className="list-none space-y-2.5 text-sm pl-0">
                <li><Link href="/developer/docs/testing-validation" className="text-primary hover:underline flex items-center"><TestTube2 className="mr-2 h-4 w-4"/>Testing &amp; Validation Guide</Link></li>
              </ul>
            </div>
            <div className="pt-4 border-t border-border/70">
              <h4 className="font-semibold text-md mb-2">Operations</h4>
              <ul className="list-none space-y-2.5 text-sm pl-0">
                <li><Link href="/developer/docs/deployment-monitoring" className="text-primary hover:underline flex items-center"><ServerIconShadcn className="mr-2 h-4 w-4"/>Deployment &amp; Monitoring Guide</Link></li>
              </ul>
            </div>
            <div className="pt-4 border-t border-border/70">
              <h4 className="font-semibold text-md mb-2">Security &amp; Privacy</h4>
              <ul className="list-none space-y-2.5 text-sm pl-0">
                <li><Link href="/developer/docs/data-privacy" className="text-primary hover:underline flex items-center"><VenetianMask className="mr-2 h-4 w-4"/>Data Privacy &amp; GDPR Guide</Link></li>
              </ul>
            </div>
            <Button variant="default" className="w-full sm:w-auto mt-4" asChild>
              <Link href="/developer/docs/api-reference">
                <FileJson className="mr-2 h-5 w-5" /> View Full API Reference
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Section: Learning & Resources */}
      <section id="learning-resources" className="space-y-4">
        <h2 className="text-2xl font-semibold font-headline flex items-center text-foreground">
            <Lightbulb className="mr-3 h-6 w-6 text-accent" /> Learning & Resources
        </h2>
        <Card className="shadow-lg" id="developer-resources">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><FileCog className="mr-3 h-6 w-6 text-primary" /> Developer Resources</CardTitle>
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
            <div className="space-y-5">
              <div id="code-samples" className="space-y-3">
                <h4 className="font-semibold text-md flex items-center"><FileCode className="mr-2 h-5 w-5 text-accent"/>Code Samples &amp; Templates</h4>
                <p className="text-sm text-muted-foreground -mt-2">
                  Access a library of code snippets and project templates for common integration scenarios.
                </p>
                {mockCodeSamples.map(sample => (
                  <div key={sample.id} className="p-3 border rounded-md bg-muted/30">
                    <h5 className="text-sm font-medium text-foreground mb-0.5 flex items-center"><sample.icon className="mr-2 h-4 w-4 text-primary/80"/>{sample.title}</h5>
                    <p className="text-xs text-muted-foreground mb-1.5">{sample.description}</p>
                    <Button variant="link" size="sm" className="p-0 h-auto text-primary text-xs" disabled>{sample.linkText}</Button>
                  </div>
                ))}
              </div>
              
              <div id="tutorials" className="space-y-3 pt-4 border-t">
                 <h4 className="font-semibold text-md flex items-center"><BookText className="mr-2 h-5 w-5 text-accent"/>Tutorials</h4>
                 <p className="text-sm text-muted-foreground -mt-2">
                  Follow step-by-step guides to implement specific DPP functionalities and use cases.
                </p>
                {mockTutorials.map(tutorial => (
                  <div key={tutorial.id} className="p-3 border rounded-md bg-muted/30">
                    <h5 className="text-sm font-medium text-foreground mb-0.5 flex items-center"><tutorial.icon className="mr-2 h-4 w-4 text-primary/80"/>{tutorial.title}</h5>
                    <p className="text-xs text-muted-foreground mb-1.5">{tutorial.description}</p>
                    <Button variant="link" size="sm" className="p-0 h-auto text-primary text-xs" disabled>{tutorial.linkText}</Button>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t">
                  <h4 className="font-semibold text-md mb-1">GitHub Integration</h4>
                  <p className="text-sm text-muted-foreground">Explore our open-source repositories, contribute to the ecosystem, find community projects, and raise issues related to our SDKs or platform.</p>
                  <Button variant="link" className="p-0 h-auto text-primary hover:underline" asChild>
                    <Link href="#" target="_blank" rel="noopener noreferrer">Norruva on GitHub (Mock) <ExternalLinkIcon className="inline h-3 w-3 ml-1" /></Link>
                  </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section: Platform Operations & Support */}
      <section id="platform-operations" className="space-y-4">
         <h2 className="text-2xl font-semibold font-headline flex items-center text-foreground">
            <LayoutGrid className="mr-3 h-6 w-6 text-accent" /> Platform Operations & Support
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-lg" id="api-usage">
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
                <CardTitle className="font-headline flex items-center"><Users className="mr-3 h-6 w-6 text-primary" /> Support &amp; Community</CardTitle>
                <CardDescription>Get help, share ideas, and connect with other developers building with Norruva.</CardDescription>
                </CardHeader>
                <CardContent>
                <div className="grid grid-cols-1 gap-3 mb-6">
                    <Link href="#" target="_blank" rel="noopener noreferrer" className="block">
                    <Button variant="outline" className="w-full h-auto flex-col py-3 group hover:border-primary hover:bg-primary/5">
                        <LifeBuoy className="mb-1 h-5 w-5 text-accent group-hover:text-primary transition-colors"/> 
                        <span className="group-hover:text-primary transition-colors text-sm">Help Center / FAQ</span>
                        <span className="text-xs text-muted-foreground">(Mock)</span>
                    </Button>
                    </Link>
                    <Link href="#" target="_blank" rel="noopener noreferrer" className="block">
                    <Button variant="outline" className="w-full h-auto flex-col py-3 group hover:border-primary hover:bg-primary/5">
                        <Activity className="mb-1 h-5 w-5 text-accent group-hover:text-primary transition-colors"/> 
                        <span className="group-hover:text-primary transition-colors text-sm">Community Forum</span>
                        <span className="text-xs text-muted-foreground">(Mock Link)</span>
                    </Button>
                    </Link>
                    <Link href="#" target="_blank" rel="noopener noreferrer" className="block">
                    <Button variant="outline" className="w-full h-auto flex-col py-3 group hover:border-primary hover:bg-primary/5">
                        <HelpCircle className="mb-1 h-5 w-5 text-accent group-hover:text-primary transition-colors"/> 
                        <span className="group-hover:text-primary transition-colors text-sm">Submit Support Ticket</span>
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <Card className="shadow-lg">
                <CardHeader>
                <CardTitle className="font-headline flex items-center"><Settings2 className="mr-3 h-6 w-6 text-primary" /> Advanced Features</CardTitle>
                <CardDescription>Explore advanced capabilities to tailor your DPP solutions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div>
                    <h4 className="font-semibold text-md mb-1 flex items-center"><PackageSearch className="mr-2 h-5 w-5 text-accent"/>Customizable DPP Templates</h4>
                    <p className="text-sm text-muted-foreground">Define custom data schemas and presentation templates. (Coming Soon)</p>
                </div>
                <div className="pt-3 border-t">
                    <h4 className="font-semibold text-md mb-1 flex items-center"><Layers className="mr-2 h-5 w-5 text-accent"/>Advanced Query Options</h4>
                    <p className="text-sm text-muted-foreground">Utilize powerful query capabilities for DPP data. (Docs Coming Soon)</p>
                </div>
                </CardContent>
            </Card>
            <Card className="shadow-lg">
                <CardHeader>
                <CardTitle className="font-headline flex items-center"><Scale className="mr-3 h-6 w-6 text-primary" /> Regulatory Updates</CardTitle>
                <CardDescription>Stay informed on EU regulations impacting DPPs.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">Updates on ESPR, EPREL, EBSI, etc. will be featured here.</p>
                    <Button variant="link" className="p-0 h-auto text-primary hover:underline" asChild>
                        <Link href="#">View All Updates (Mock)</Link>
                    </Button>
                </CardContent>
            </Card>
            <Card className="shadow-lg" id="security-privacy">
                <CardHeader>
                <CardTitle className="font-headline flex items-center"><Lock className="mr-3 h-6 w-6 text-primary" /> Security &amp; Data Privacy</CardTitle>
                <CardDescription>Resources on securing DPP applications and data integrity.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                <div>
                    <h4 className="font-semibold text-md mb-1">GDPR Compliance</h4>
                     <Button variant="link" className="p-0 h-auto text-primary hover:underline" asChild>
                        <Link href="/developer/docs/data-privacy">View Data Privacy & GDPR Guide</Link>
                    </Button>
                </div>
                </CardContent>
            </Card>
        </div>
      </section>
    </div>
  );
}
    
    
