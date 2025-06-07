
// --- File: page.tsx (Developer Portal) ---
// Description: Main page for the Developer Portal, providing access to API keys, documentation, and tools.
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
    KeyRound, BookOpen, Lightbulb, ShieldAlert, LifeBuoy, PlusCircle, Copy, Trash2, PlayCircle, Send, FileJson, 
    Loader2, ServerIcon as ServerLucideIcon, BarChart2, FileClock, Edit2, Link as LinkIconPath, 
    ExternalLink as ExternalLinkIcon, Search, Users, Activity, FileCog, Rocket, Settings2, PackageSearch, Layers, 
    Lock, MessageSquare, Share2, BookText, TestTube2, Server as ServerIconShadcn, Webhook, Info, Clock, 
    AlertTriangle as ErrorIcon, FileCode, LayoutGrid, Wrench, HelpCircle, Globe, BarChartBig, Megaphone, 
    Zap as ZapIcon, ServerCrash, Laptop, DatabaseZap, CheckCircle, Building, FileText as FileTextIcon, History, 
    UploadCloud, ShieldCheck, Cpu, HardDrive 
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

import ApiKeysManager, { type ApiKey } from '@/components/developer/ApiKeysManager';
import WebhooksManager, { type WebhookEntry } from '@/components/developer/WebhooksManager';
import { cn } from '@/lib/utils';


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
  "DPP001": { 
    productId: "DPP001",
    productName: "EcoSmart Refrigerator X500 (from MOCK_DPPS)",
    category: "Appliances",
    status: "Active",
    manufacturer: "GreenTech Appliances",
    modelNumber: "X500-ECO",
    gtin: "01234567890123",
    energyLabel: "A++",
    compliance: {
      REACH: { status: "Compliant", lastChecked: "2024-07-01" },
      RoHS: { status: "Compliant", lastChecked: "2024-07-01" }
    },
    lifecycleEvents: [
        { eventId: "EVT001", type: "Manufactured", timestamp: "2024-01-15T08:00:00Z", location: "EcoFactory, Germany" }
    ],
    metadata: { last_updated: "2024-07-28T10:00:00Z", status: "published", dppStandardVersion: "CIRPASS v0.9 Draft" },
    productDetails: {
      description: "An eco friendly fridge from MOCK_DPPS data source.",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "refrigerator appliance",
      materials: [{name: "Recycled Steel", percentage: 70, isRecycled: true}]
    },
    ebsiVerification: { status: "verified", verificationId: "EBSI_TX_ABC123", lastChecked: "2024-07-29T00:00:00Z"},
    blockchainIdentifiers: { platform: "MockChain", anchorTransactionHash: "0x123abc456def789ghi012jkl345mno678pqr901stu234vwx567yz890abcdef"},
    consumerScans: 1250,
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
    "DPP001": {
        productId: "DPP001",
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

const platformAnnouncements = [
  { id: "ann1", date: "Aug 1, 2024", title: "New API Version v1.1 Released", summary: "Version 1.1 of the DPP API is now live, featuring enhanced query parameters for lifecycle events and new endpoints for supplier data management. Check the API Reference for details.", link: "/developer/docs/api-reference" },
  { id: "ann2", date: "Jul 25, 2024", title: "Webinar: Navigating EU Battery Regulation", summary: "Join us next week for a deep dive into using the Norruva platform to comply with the new EU Battery Regulation requirements. Registration is open.", link: "#" },
  { id: "ann3", date: "Jul 15, 2024", title: "Sandbox Environment Maintenance", summary: "Scheduled maintenance for the Sandbox environment will occur on July 20th, 02:00-04:00 UTC. Production environment will not be affected.", link: "#" },
];

const DataFlowKPIs = [
    { title: "DPP Creation Success Rate", value: "99.8%", icon: CheckCircle, color: "text-green-500", description: "Successful DPP initial creations via API." },
    { title: "Average Data Ingestion Time", value: "1.2s", icon: Clock, color: "text-blue-500", description: "Time from API call to DPP visibility." },
    { title: "DPP Retrieval Speed (P95)", value: "250ms", icon: ZapIcon, color: "text-info", description: "95th percentile for public API GET /dpp/{id}." },
    { title: "Webhook Delivery Success", value: "99.95%", icon: Send, color: "text-green-500", description: "Successful event notifications to subscribed endpoints." },
];


export default function DeveloperPortalPage() {
  const { toast } = useToast();

  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialMockApiKeys);
  const [webhooks, setWebhooks] = useState<WebhookEntry[]>(initialMockWebhooks);
  const [currentEnvironment, setCurrentEnvironment] = useState<string>("sandbox");
  const mockOrganizationName = "Acme Innovations"; 

  const [getProductId, setGetProductId] = useState<string>("DPP001");
  const [getProductResponse, setGetProductResponse] = useState<string | null>(null);
  const [isGetProductLoading, setIsGetProductLoading] = useState(false);

  const [listProductsResponse, setListProductsResponse] = useState<string | null>(null);
  const [isListProductsLoading, setIsListProductsLoading] = useState(false);

  const [postLifecycleEventProductId, setPostLifecycleEventProductId] = useState<string>("DPP001");
  const [postLifecycleEventBody, setPostLifecycleEventBody] = useState<string>(
    JSON.stringify({ eventType: "Shipped", location: "Warehouse B", details: "Order #SO12345" }, null, 2)
  );
  const [postLifecycleEventResponse, setPostLifecycleEventResponse] = useState<string | null>(null);
  const [isPostLifecycleEventLoading, setIsPostLifecycleEventLoading] = useState(false);

  const [getComplianceProductId, setGetComplianceProductId] = useState<string>("DPP001");
  const [getComplianceResponse, setGetComplianceResponse] = useState<string | null>(null);
  const [isGetComplianceLoading, setIsGetComplianceLoading] = useState(false);

  const [postVerifyProductId, setPostVerifyProductId] = useState<string>("DPP001");
  const [postVerifyResponse, setPostVerifyResponse] = useState<string | null>(null);
  const [isPostVerifyLoading, setIsPostVerifyLoading] = useState(false);

  const [putProductId, setPutProductId] = useState<string>("DPP001");
  const [putProductBody, setPutProductBody] = useState<string>(
    JSON.stringify({ productDetails: { description: "Updated description with enhanced features." }, metadata: { status: "pending_review"} }, null, 2)
  );
  const [putProductResponse, setPutProductResponse] = useState<string | null>(null);
  const [isPutProductLoading, setIsPutProductLoading] = useState(false);

  const [deleteProductId, setDeleteProductId] = useState<string>("PROD002"); 
  const [deleteProductResponse, setDeleteProductResponse] = useState<string | null>(null);
  const [isDeleteProductLoading, setIsDeleteProductLoading] = useState(false);

  const [mockDppGeneratorProductName, setMockDppGeneratorProductName] = useState("");
  const [mockDppGeneratorCategory, setMockDppGeneratorCategory] = useState("");
  const [generatedMockDppJson, setGeneratedMockDppJson] = useState<string | null>(null);
  const [isGeneratingMockDpp, setIsGeneratingMockDpp] = useState(false);

  const [getHistoryProductId, setGetHistoryProductId] = useState<string>("DPP001");
  const [getHistoryResponse, setGetHistoryResponse] = useState<string | null>(null);
  const [isGetHistoryLoading, setIsGetHistoryLoading] = useState(false);

  const [postImportFileType, setPostImportFileType] = useState<string>("csv");
  const [postImportResponse, setPostImportResponse] = useState<string | null>(null);
  const [isPostImportLoading, setIsPostImportLoading] = useState(false);

  const [getGraphProductId, setGetGraphProductId] = useState<string>("DPP001");
  const [getGraphResponse, setGetGraphResponse] = useState<string | null>(null);
  const [isGetGraphLoading, setIsGetGraphLoading] = useState(false);

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

  const handleMockPostVerify = async () => {
    setIsPostVerifyLoading(true);
    setPostVerifyResponse(null);
    await new Promise(resolve => setTimeout(resolve, 600));
    const product = MOCK_API_PRODUCTS[postVerifyProductId];
    if (product) {
        const mockVerificationResult = {
            productId: postVerifyProductId,
            verificationStatus: "Verified (Mock)",
            complianceChecks: [
                { regulation: "REACH", status: "Compliant", details: "All substances within limits." },
                { regulation: "RoHS", status: "Compliant", details: "No restricted hazardous substances found." }
            ],
            authenticity: "Authentic (Mock)",
            timestamp: new Date().toISOString()
        };
      setPostVerifyResponse(JSON.stringify(mockVerificationResult, null, 2));
    } else {
      setPostVerifyResponse(JSON.stringify({ error: "Product not found for verification", productId: postVerifyProductId }, null, 2));
    }
    setIsPostVerifyLoading(false);
  };

  const handleMockPutProduct = async () => {
    setIsPutProductLoading(true);
    setPutProductResponse(null);
    await new Promise(resolve => setTimeout(resolve, 550));
    const productExists = MOCK_API_PRODUCTS[putProductId];
    if (productExists) {
        try {
            const requestBody = JSON.parse(putProductBody);
            const updatedProduct = { ...productExists, ...requestBody, metadata: { ...productExists.metadata, ...requestBody.metadata, last_updated: new Date().toISOString() } };
            setPutProductResponse(JSON.stringify(updatedProduct, null, 2));
        } catch (e) {
            setPutProductResponse(JSON.stringify({ error: "Invalid JSON in request body for PUT.", details: e instanceof Error ? e.message : String(e) }, null, 2));
        }
    } else {
        setPutProductResponse(JSON.stringify({ error: "Product not found for update", productId: putProductId }, null, 2));
    }
    setIsPutProductLoading(false);
  };

  const handleMockDeleteProduct = async () => {
    setIsDeleteProductLoading(true);
    setDeleteProductResponse(null);
    await new Promise(resolve => setTimeout(resolve, 450));
    const productExists = MOCK_API_PRODUCTS[deleteProductId];
    if (productExists) {
      setDeleteProductResponse(JSON.stringify({ message: `Product ${deleteProductId} archived successfully (mock).`, status: "Archived", timestamp: new Date().toISOString() }, null, 2));
    } else {
      setDeleteProductResponse(JSON.stringify({ error: "Product not found for deletion", productId: deleteProductId }, null, 2));
    }
    setIsDeleteProductLoading(false);
  };

  const handleGenerateMockDpp = async () => {
    setIsGeneratingMockDpp(true);
    setGeneratedMockDppJson(null);
    await new Promise(resolve => setTimeout(resolve, 700)); 
    const mockDpp = {
      id: `MOCK_DPP_${Date.now().toString().slice(-5)}`,
      productName: mockDppGeneratorProductName || "Mock Product Alpha",
      category: mockDppGeneratorCategory || "Electronics",
      manufacturer: { name: "MockGen Inc." },
      metadata: {
        status: "draft",
        last_updated: new Date().toISOString(),
      },
      productDetails: {
        description: "This is a mock Digital Product Passport generated for testing and demonstration purposes.",
        materials: [{ name: "Mock Material", percentage: 100, isRecycled: false }],
      },
      compliance: {
        eprel: { status: "N/A", lastChecked: new Date().toISOString() }
      },
    };
    setGeneratedMockDppJson(JSON.stringify(mockDpp, null, 2));
    toast({ title: "Mock DPP Generated", description: "A sample DPP JSON has been displayed." });
    setIsGeneratingMockDpp(false);
  };

  const handleMockGetHistory = async () => {
    setIsGetHistoryLoading(true);
    setGetHistoryResponse(null);
    await new Promise(resolve => setTimeout(resolve, 400));
    const product = MOCK_API_PRODUCTS[getHistoryProductId];
    if (product) {
        const history = [
            { event: "DPP Created", timestamp: "2024-01-01T10:00:00Z", user: "system" },
            { event: "Lifecycle Event Added: Manufactured", timestamp: "2024-01-15T08:00:00Z", user: "manufacturer_user@example.com", details: { location: "EcoFactory, Germany" } },
            { event: "Compliance Status Updated: REACH to Compliant", timestamp: "2024-07-01T12:00:00Z", user: "verifier_bot" },
        ];
        setGetHistoryResponse(JSON.stringify({ productId: getHistoryProductId, auditTrail: history }, null, 2));
    } else {
        setGetHistoryResponse(JSON.stringify({ error: "Product not found for history", productId: getHistoryProductId }, null, 2));
    }
    setIsGetHistoryLoading(false);
  };

  const handleMockPostImport = async () => {
    setIsPostImportLoading(true);
    setPostImportResponse(null);
    await new Promise(resolve => setTimeout(resolve, 800));
    const mockSuccessCount = Math.floor(Math.random() * 50) + 10; 
    setPostImportResponse(JSON.stringify({
        message: `Batch import processed (mock). File type: ${postImportFileType.toUpperCase()}`,
        importedCount: mockSuccessCount,
        failedCount: Math.floor(Math.random() * 5),
        timestamp: new Date().toISOString()
    }, null, 2));
    setIsPostImportLoading(false);
  };

  const handleMockGetGraph = async () => {
    setIsGetGraphLoading(true);
    setGetGraphResponse(null);
    await new Promise(resolve => setTimeout(resolve, 750));
    const product = MOCK_API_PRODUCTS[getGraphProductId];
    if (product) {
        const graphData = {
            productId: getGraphProductId,
            graphType: "supply_chain_visualization",
            nodes: [
                { id: "SUP001", label: "GreenCompress Ltd.", type: "supplier" },
                { id: "SUP002", label: "RecycleSteel Corp.", type: "supplier" },
                { id: getGraphProductId, label: product.productName, type: "product" }
            ],
            edges: [
                { source: "SUP001", target: getGraphProductId, label: "Compressor Unit" },
                { source: "SUP002", target: getGraphProductId, label: "Recycled Steel Panels" }
            ],
            message: "Conceptual supply chain graph data."
        };
        setGetGraphResponse(JSON.stringify(graphData, null, 2));
    } else {
        setGetGraphResponse(JSON.stringify({ error: "Product not found for graph", productId: getGraphProductId }, null, 2));
    }
    setIsGetGraphLoading(false);
  };


  const dashboardQuickActions = [
    { label: "View My API Keys", href: "#", targetTab: "api_keys", icon: KeyRound },
    { label: "Explore API Reference", href: "/developer/docs/api-reference", icon: BookText },
    { label: "Manage Webhooks", href: "#", targetTab: "webhooks", icon: Webhook },
    { label: "Check API Status", href: "#", icon: ServerCrash, targetTab: "dashboard", tooltip: "View API Status on Dashboard" },
  ];

  const codeSampleLanguages = ["cURL", "JavaScript", "Python", "Java", "Go"];
  const conceptualSdks = [
      { name: "JavaScript SDK", link: "#", soon: true, icon: FileCode },
      { name: "Python SDK", link: "#", soon: true, icon: FileCode },
      { name: "Java SDK", link: "#", soon: true, icon: FileCode },
      { name: "Go SDK", link: "#", soon: true, icon: FileCode },
      { name: "C# SDK", link: "#", soon: true, icon: FileCode },
  ];


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline font-bold text-primary">Developer Portal</h1>
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Building className="h-4 w-4" />
                <span>Org: <span className="font-medium text-foreground">{mockOrganizationName}</span></span>
            </div>
            <Separator orientation="vertical" className="h-5" />
            <Label htmlFor="env-switcher" className="text-sm text-muted-foreground">Environment:</Label>
            <Select value={currentEnvironment} onValueChange={setCurrentEnvironment}>
                <SelectTrigger id="env-switcher" className="w-[150px] bg-card shadow-sm h-9">
                    <SelectValue placeholder="Select Environment" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="sandbox">
                        <div className="flex items-center gap-2">
                            <TestTube2 className="h-4 w-4 text-info" /> Sandbox
                        </div>
                    </SelectItem>
                    <SelectItem value="production">
                        <div className="flex items-center gap-2">
                            <ServerIconShadcn className="h-4 w-4 text-green-600" /> Production
                        </div>
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>
      
      <div className="relative w-full sm:w-auto md:max-w-md ml-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
            type="search"
            placeholder="Search Portal (API docs, guides...)"
            className="pl-10 bg-background shadow-sm h-10"
            disabled // Conceptual search
        />
      </div>


      <Tabs defaultValue="dashboard" className="w-full" id="developer-portal-tabs">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-7">
          <TabsTrigger value="dashboard"><LayoutGrid className="mr-1.5 h-4 w-4 sm:hidden md:inline-block" />Dashboard</TabsTrigger>
          <TabsTrigger value="api_keys"><KeyRound className="mr-1.5 h-4 w-4 sm:hidden md:inline-block" />API Keys</TabsTrigger>
          <TabsTrigger value="webhooks"><Webhook className="mr-1.5 h-4 w-4 sm:hidden md:inline-block" />Webhooks</TabsTrigger>
          <TabsTrigger value="playground"><PlayCircle className="mr-1.5 h-4 w-4 sm:hidden md:inline-block" />Playground</TabsTrigger>
          <TabsTrigger value="documentation"><BookText className="mr-1.5 h-4 w-4 sm:hidden md:inline-block" />Docs</TabsTrigger>
          <TabsTrigger value="resources"><FileCog className="mr-1.5 h-4 w-4 sm:hidden md:inline-block" />Resources</TabsTrigger>
          <TabsTrigger value="settings_usage"><Settings2 className="mr-1.5 h-4 w-4 sm:hidden md:inline-block" />Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6 space-y-6">
          <Card className="shadow-lg bg-card border-primary/20">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary flex items-center"><Rocket className="mr-3 h-6 w-6" />Welcome to Norruva DPP API!</CardTitle>
              <CardDescription>Start here to learn the basics, set up your environment, and make your first API call.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="default" asChild size="lg">
                <Link href="/developer/guides/quick-start">
                  Read Quick Start Guide
                  <ExternalLinkIcon className="ml-2 h-4 w-4"/>
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                Our Quick Start Guide will walk you through authentication and basic DPP operations for the selected environment: <Badge variant="outline" className="capitalize">{currentEnvironment}</Badge>.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="shadow-md lg:col-span-1">
              <CardHeader>
                <CardTitle className="font-headline text-lg flex items-center"><BarChartBig className="mr-2 h-5 w-5 text-primary" /> Key API Metrics &amp; Health (<span className="capitalize">{currentEnvironment}</span>)</CardTitle>
                <CardDescription>Mock conceptual API metrics for the current environment.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded-md"><span>API Calls (Last 24h):</span> <span className="font-semibold">{currentEnvironment === 'sandbox' ? '1,234' : '105,678'}</span></div>
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded-md"><span>Error Rate (Last 24h):</span> <span className="font-semibold">{currentEnvironment === 'sandbox' ? '0.2%' : '0.05%'}</span></div>
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded-md"><span>Avg. Latency:</span> <span className="font-semibold">{currentEnvironment === 'sandbox' ? '120ms' : '85ms'}</span></div>
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded-md"><span>API Uptime (Last 7d):</span> <span className="font-semibold text-green-600">{currentEnvironment === 'sandbox' ? '99.95%' : '99.99%'}</span></div>
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded-md"><span>Peak Requests/Sec:</span> <span className="font-semibold">{currentEnvironment === 'sandbox' ? '15' : '250'}</span></div>
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded-md"><span>API Status:</span> <span className="font-semibold text-green-600 flex items-center"><CheckCircle className="h-4 w-4 mr-1.5"/>All Systems Operational</span></div>
                <Button variant="link" size="sm" className="p-0 h-auto text-primary mt-2" onClick={() => document.querySelector('#developer-portal-tabs [data-state="inactive"][value="settings_usage"]')?.ariaSelected === "false" ? (document.querySelector('#developer-portal-tabs [data-state="inactive"][value="settings_usage"]') as HTMLElement)?.click() : null}>View Full Usage Report</Button>
              </CardContent>
            </Card>

            <Card className="shadow-md lg:col-span-2">
              <CardHeader>
                <CardTitle className="font-headline text-lg flex items-center"><Megaphone className="mr-2 h-5 w-5 text-primary" /> Platform News &amp; Announcements</CardTitle>
                <CardDescription>Stay updated with the latest from Norruva.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm max-h-60 overflow-y-auto">
                {platformAnnouncements.map(ann => (
                  <div key={ann.id} className="p-2.5 border-b last:border-b-0">
                    <h4 className="font-semibold text-foreground">{ann.title} <span className="text-xs text-muted-foreground font-normal">- {ann.date}</span></h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{ann.summary}</p>
                    {ann.link !== "#" ? (
                      <Link href={ann.link} passHref><Button variant="link" size="sm" className="p-0 h-auto text-primary text-xs mt-1">Learn More <ExternalLinkIcon className="ml-1 h-3 w-3"/></Button></Link>
                    ) : (
                       <Button variant="link" size="sm" className="p-0 h-auto text-primary text-xs mt-1" disabled>Learn More</Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg bg-card border-primary/10">
            <CardHeader>
                <CardTitle className="font-headline text-lg flex items-center"><Share2 className="mr-2 h-5 w-5 text-primary" />Conceptual API Data Flow &amp; KPIs</CardTitle>
                <CardDescription>Visualizing typical API interactions and target performance indicators.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h4 className="font-medium text-md text-foreground">Data Flow Example:</h4>
                    <div className="p-4 border rounded-md bg-muted/50 space-y-3 text-sm">
                        <div className="flex items-center gap-2"><Laptop className="h-5 w-5 text-info"/> Developer App <span className="text-muted-foreground mx-1">&rarr;</span> <ServerIconShadcn className="h-5 w-5 text-primary"/> Norruva API (DPP Create)</div>
                        <div className="flex items-center gap-2 ml-4"><ServerIconShadcn className="h-5 w-5 text-primary"/> Norruva API <span className="text-muted-foreground mx-1">&rarr;</span> <DatabaseZap className="h-5 w-5 text-accent"/> DPP Storage/Blockchain</div>
                        <div className="flex items-center gap-2 ml-4"><DatabaseZap className="h-5 w-5 text-accent"/> DPP Storage <span className="text-muted-foreground mx-1">&rarr;</span> <ServerIconShadcn className="h-5 w-5 text-primary"/> Norruva API (DPP Read)</div>
                        <div className="flex items-center gap-2"><ServerIconShadcn className="h-5 w-5 text-primary"/> Norruva API <span className="text-muted-foreground mx-1">&rarr;</span> <Users className="h-5 w-5 text-info"/> Consumers/Verifiers</div>
                        <div className="flex items-center gap-2 ml-4"><ServerIconShadcn className="h-5 w-5 text-primary"/> Norruva API <span className="text-muted-foreground mx-1">&rarr;</span> <Webhook className="h-5 w-5 text-info"/> Developer App (Events)</div>
                    </div>
                     <p className="text-xs text-muted-foreground">This is a simplified representation. Actual flows may involve more components like EBSI integration.</p>
                </div>
                <div className="space-y-3">
                    <h4 className="font-medium text-md text-foreground">Key Performance Indicators (Targets):</h4>
                    {DataFlowKPIs.map(kpi => (
                        <div key={kpi.title} className="flex items-start p-2.5 border-b last:border-b-0 rounded-md hover:bg-muted/20">
                            <kpi.icon className={cn("h-5 w-5 mr-3 mt-0.5 flex-shrink-0", kpi.color)} />
                            <div>
                                <span className="font-semibold text-sm text-foreground">{kpi.title}: <span className={cn("font-bold", kpi.color)}>{kpi.value}</span></span>
                                <p className="text-xs text-muted-foreground">{kpi.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="font-headline text-lg flex items-center"><ZapIcon className="mr-2 h-5 w-5 text-primary" /> Quick Actions</CardTitle>
              <CardDescription>Access common developer tasks and resources directly.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {dashboardQuickActions.map(action => (
                action.targetTab ? (
                  <Button key={action.label} variant="outline" className="w-full justify-start text-left h-auto py-3 group hover:bg-accent/10" onClick={() => {
                    const targetTabTrigger = document.querySelector(`#developer-portal-tabs [data-state="inactive"][value="${action.targetTab}"]`) as HTMLElement | null;
                    if (targetTabTrigger && targetTabTrigger.ariaSelected === "false") {
                        targetTabTrigger.click();
                    } else if (action.targetTab === 'dashboard') { // If already on dashboard or clicking dashboard
                        const dashboardTab = document.querySelector(`#developer-portal-tabs [value="dashboard"]`) as HTMLElement | null;
                        if (dashboardTab) dashboardTab.click();
                    }
                  }}>
                    <action.icon className="mr-3 h-5 w-5 text-primary group-hover:text-accent transition-colors" />
                    <div>
                      <p className="font-medium group-hover:text-accent transition-colors">{action.label}</p>
                    </div>
                  </Button>
                ) : (
                  <Link key={action.label} href={action.href} passHref legacyBehavior>
                    <a className="block">
                      <Button variant="outline" className="w-full justify-start text-left h-auto py-3 group hover:bg-accent/10">
                        <action.icon className="mr-3 h-5 w-5 text-primary group-hover:text-accent transition-colors" />
                        <div>
                          <p className="font-medium group-hover:text-accent transition-colors">{action.label}</p>
                        </div>
                      </Button>
                    </a>
                  </Link>
                )
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api_keys" className="mt-6">
           <ApiKeysManager
              apiKeys={apiKeys}
              onCopyKey={handleCopyKey}
              onGenerateSandboxKey={handleGenerateSandboxKey}
              onRequestProductionKey={handleRequestProductionKey}
              onDeleteApiKey={handleDeleteApiKey}
            />
            <Card className="mt-6 shadow-md">
              <CardHeader><CardTitle className="text-sm font-medium">Note on API Key Management</CardTitle></CardHeader>
              <CardContent><p className="text-xs text-muted-foreground">Best practices include rotating keys regularly, restricting key permissions (future feature), and revoking compromised keys immediately. Refer to the <Link href="/developer/docs/authentication" className="text-primary hover:underline">Authentication Guide</Link>.</p></CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="mt-6">
            <WebhooksManager
              webhooks={webhooks}
              onAddWebhook={handleAddWebhook}
              onEditWebhook={handleEditWebhook}
              onDeleteWebhook={handleDeleteWebhook}
            />
            <Card className="mt-6 shadow-md">
              <CardHeader><CardTitle className="text-sm font-medium">Future Enhancements</CardTitle></CardHeader>
              <CardContent><p className="text-xs text-muted-foreground">A Webhook Test Suite with event replay, detailed logs, and signature verification debugging tools is planned. See the <Link href="/developer/docs/webhooks-guide" className="text-primary hover:underline">Webhooks Guide</Link>.</p></CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="playground" className="mt-6 space-y-6">
          <Card className="shadow-xl border-primary/20">
            <CardHeader>
            <CardTitle className="font-headline flex items-center"><PlayCircle className="mr-3 h-6 w-6 text-primary" /> Full Interactive API Playground</CardTitle>
            <CardDescription>Experiment with Norruva API endpoints in this interactive sandbox. This environment uses mock data and simulated responses for the <Badge variant="outline" className="capitalize">{currentEnvironment}</Badge> environment.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* GET /api/v1/dpp/{productId} */}
              <Card>
                  <CardHeader>
                  <CardTitle className="text-lg flex items-center"><ServerLucideIcon className="mr-2 h-5 w-5 text-info"/>GET /api/v1/dpp/{'{productId}'}</CardTitle>
                  <CardDescription>Retrieve details for a specific product by its ID.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                  <div>
                      <Label htmlFor="productIdInput-get">Product ID</Label>
                      <Input id="productIdInput-get" value={getProductId} onChange={(e) => setGetProductId(e.target.value)} placeholder="e.g., DPP001" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Button onClick={handleMockGetProductDetails} disabled={isGetProductLoading} variant="secondary">
                        {isGetProductLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        {isGetProductLoading ? "Fetching..." : "Send Request"}
                    </Button>
                    <Select defaultValue="cURL" disabled>
                        <SelectTrigger className="w-[150px] text-xs h-9"><SelectValue placeholder="Code Sample" /></SelectTrigger>
                        <SelectContent>{codeSampleLanguages.map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  {getProductResponse && (
                      <div className="mt-4">
                      <Label className="flex items-center"><FileJson className="mr-2 h-4 w-4 text-accent"/>Mock Response:</Label>
                      <pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto max-h-60"><code>{getProductResponse}</code></pre>
                      </div>
                  )}
                  </CardContent>
              </Card>

              {/* GET /api/v1/dpp (List DPPs) */}
              <Card>
                  <CardHeader>
                  <CardTitle className="text-lg flex items-center"><ServerLucideIcon className="mr-2 h-5 w-5 text-info"/>GET /api/v1/dpp</CardTitle>
                  <CardDescription>Retrieve a list of all available Digital Product Passports (mock data).</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                      <Button onClick={handleMockListProducts} disabled={isListProductsLoading} variant="secondary">
                          {isListProductsLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                          {isListProductsLoading ? "Fetching..." : "Send Request"}
                      </Button>
                       <Select defaultValue="cURL" disabled>
                          <SelectTrigger className="w-[150px] text-xs h-9"><SelectValue placeholder="Code Sample" /></SelectTrigger>
                          <SelectContent>{codeSampleLanguages.map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}</SelectContent>
                      </Select>
                  </div>
                  {listProductsResponse && (
                      <div className="mt-4">
                      <Label className="flex items-center"><FileJson className="mr-2 h-4 w-4 text-accent"/>Mock Response:</Label>
                      <pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto max-h-60"><code>{listProductsResponse}</code></pre>
                      </div>
                  )}
                  </CardContent>
              </Card>

              {/* POST /api/v1/dpp */}
              <Card>
                  <CardHeader>
                  <CardTitle className="text-lg flex items-center"><ServerLucideIcon className="mr-2 h-5 w-5 text-info"/>POST /api/v1/dpp</CardTitle>
                  <CardDescription>Create a new Digital Product Passport (Conceptual).</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">To create a new DPP with a full form, please use the <Link href="/products/new" className="text-primary hover:underline">Add New Product page</Link>. This playground simulates a basic create action.</p>
                  <div className="flex items-center justify-between">
                    <Button onClick={() => toast({title: "Mock POST /api/v1/dpp", description: "Simulated DPP creation request sent."})} variant="secondary">
                        <Send className="mr-2 h-4 w-4" /> Send Create Request (Mock)
                    </Button>
                    <Select defaultValue="cURL" disabled>
                        <SelectTrigger className="w-[150px] text-xs h-9"><SelectValue placeholder="Code Sample" /></SelectTrigger>
                        <SelectContent>{codeSampleLanguages.map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  </CardContent>
              </Card>

              {/* PUT /api/v1/dpp/{productId} */}
              <Card>
                  <CardHeader>
                  <CardTitle className="text-lg flex items-center"><ServerLucideIcon className="mr-2 h-5 w-5 text-info"/>PUT /api/v1/dpp/{'{productId}'}</CardTitle>
                  <CardDescription>Update an existing Digital Product Passport.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                  <div>
                      <Label htmlFor="productIdInput-put">Product ID</Label>
                      <Input id="productIdInput-put" value={putProductId} onChange={(e) => setPutProductId(e.target.value)} placeholder="e.g., DPP001"/>
                  </div>
                  <div>
                      <Label htmlFor="putProductBody">Request Body (JSON)</Label>
                      <Textarea id="putProductBody" value={putProductBody} onChange={(e) => setPutProductBody(e.target.value)} rows={4} className="font-mono text-xs"/>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button onClick={handleMockPutProduct} disabled={isPutProductLoading} variant="secondary">
                        {isPutProductLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        {isPutProductLoading ? "Sending..." : "Send Request"}
                    </Button>
                    <Select defaultValue="cURL" disabled>
                        <SelectTrigger className="w-[150px] text-xs h-9"><SelectValue placeholder="Code Sample" /></SelectTrigger>
                        <SelectContent>{codeSampleLanguages.map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  {putProductResponse && (
                      <div className="mt-4">
                      <Label className="flex items-center"><FileJson className="mr-2 h-4 w-4 text-accent"/>Mock Response:</Label>
                      <pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto max-h-60"><code>{putProductResponse}</code></pre>
                      </div>
                  )}
                  </CardContent>
              </Card>

              {/* DELETE /api/v1/dpp/{productId} */}
              <Card>
                  <CardHeader>
                  <CardTitle className="text-lg flex items-center"><ServerLucideIcon className="mr-2 h-5 w-5 text-info"/>DELETE /api/v1/dpp/{'{productId}'}</CardTitle>
                  <CardDescription>Archive a Digital Product Passport.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                  <div>
                      <Label htmlFor="productIdInput-delete">Product ID</Label>
                      <Input id="productIdInput-delete" value={deleteProductId} onChange={(e) => setDeleteProductId(e.target.value)} placeholder="e.g., PROD002"/>
                  </div>
                   <div className="flex items-center justify-between">
                    <Button onClick={handleMockDeleteProduct} disabled={isDeleteProductLoading} variant="destructive">
                        {isDeleteProductLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                        {isDeleteProductLoading ? "Deleting..." : "Send Request"}
                    </Button>
                    <Select defaultValue="cURL" disabled>
                        <SelectTrigger className="w-[150px] text-xs h-9"><SelectValue placeholder="Code Sample" /></SelectTrigger>
                        <SelectContent>{codeSampleLanguages.map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  {deleteProductResponse && (
                      <div className="mt-4">
                      <Label className="flex items-center"><FileJson className="mr-2 h-4 w-4 text-accent"/>Mock Response:</Label>
                      <pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto max-h-60"><code>{deleteProductResponse}</code></pre>
                      </div>
                  )}
                  </CardContent>
              </Card>
              
              {/* POST /api/v1/dpp/{productId}/lifecycle-events */}
              <Card>
                  <CardHeader>
                  <CardTitle className="text-lg flex items-center"><ServerLucideIcon className="mr-2 h-5 w-5 text-info"/>POST /api/v1/dpp/{'{productId}'}/lifecycle-events</CardTitle>
                  <CardDescription>Add a new lifecycle event to a specific DPP.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                  <div>
                      <Label htmlFor="productIdInput-post-event">Product ID</Label>
                      <Input id="productIdInput-post-event" value={postLifecycleEventProductId} onChange={(e) => setPostLifecycleEventProductId(e.target.value)} placeholder="e.g., DPP001"/>
                  </div>
                  <div>
                      <Label htmlFor="postLifecycleEventBody">Request Body (JSON)</Label>
                      <Textarea id="postLifecycleEventBody" value={postLifecycleEventBody} onChange={(e) => setPostLifecycleEventBody(e.target.value)} rows={5} className="font-mono text-xs"/>
                  </div>
                   <div className="flex items-center justify-between">
                      <Button onClick={handleMockPostLifecycleEvent} disabled={isPostLifecycleEventLoading} variant="secondary">
                          {isPostLifecycleEventLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                          {isPostLifecycleEventLoading ? "Sending..." : "Send Request"}
                      </Button>
                      <Select defaultValue="cURL" disabled>
                          <SelectTrigger className="w-[150px] text-xs h-9"><SelectValue placeholder="Code Sample" /></SelectTrigger>
                          <SelectContent>{codeSampleLanguages.map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}</SelectContent>
                      </Select>
                  </div>
                  {postLifecycleEventResponse && (
                      <div className="mt-4">
                      <Label className="flex items-center"><FileJson className="mr-2 h-4 w-4 text-accent"/>Mock Response:</Label>
                      <pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto max-h-60"><code>{postLifecycleEventResponse}</code></pre>
                      </div>
                  )}
                  </CardContent>
              </Card>

              {/* GET /api/v1/dpp/{productId}/compliance-summary */}
              <Card>
                  <CardHeader>
                  <CardTitle className="text-lg flex items-center"><ServerLucideIcon className="mr-2 h-5 w-5 text-info"/>GET /api/v1/dpp/{'{productId}'}/compliance-summary</CardTitle>
                  <CardDescription>Retrieve a compliance summary for a specific product.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                  <div>
                      <Label htmlFor="productIdInput-get-compliance">Product ID</Label>
                      <Input id="productIdInput-get-compliance" value={getComplianceProductId} onChange={(e) => setGetComplianceProductId(e.target.value)} placeholder="e.g., DPP001" />
                  </div>
                  <div className="flex items-center justify-between">
                      <Button onClick={handleMockGetComplianceSummary} disabled={isGetComplianceLoading} variant="secondary">
                          {isGetComplianceLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                          {isGetComplianceLoading ? "Fetching..." : "Send Request"}
                      </Button>
                       <Select defaultValue="cURL" disabled>
                          <SelectTrigger className="w-[150px] text-xs h-9"><SelectValue placeholder="Code Sample" /></SelectTrigger>
                          <SelectContent>{codeSampleLanguages.map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}</SelectContent>
                      </Select>
                  </div>
                  {getComplianceResponse && (
                      <div className="mt-4">
                      <Label className="flex items-center"><FileJson className="mr-2 h-4 w-4 text-accent"/>Mock Response:</Label>
                      <pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto max-h-60"><code>{getComplianceResponse}</code></pre>
                      </div>
                  )}
                  </CardContent>
              </Card>

              {/* POST /api/v1/dpp/verify */}
              <Card>
                  <CardHeader>
                  <CardTitle className="text-lg flex items-center"><ServerLucideIcon className="mr-2 h-5 w-5 text-info"/>POST /api/v1/dpp/verify</CardTitle>
                  <CardDescription>Perform compliance and authenticity checks on a DPP (mock).</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                  <div>
                      <Label htmlFor="productIdInput-verify">Product ID to Verify</Label>
                      <Input id="productIdInput-verify" value={postVerifyProductId} onChange={(e) => setPostVerifyProductId(e.target.value)} placeholder="e.g., DPP001"/>
                  </div>
                   <div className="flex items-center justify-between">
                    <Button onClick={handleMockPostVerify} disabled={isPostVerifyLoading} variant="secondary">
                        {isPostVerifyLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        {isPostVerifyLoading ? "Verifying..." : "Send Request"}
                    </Button>
                    <Select defaultValue="cURL" disabled>
                        <SelectTrigger className="w-[150px] text-xs h-9"><SelectValue placeholder="Code Sample" /></SelectTrigger>
                        <SelectContent>{codeSampleLanguages.map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  {postVerifyResponse && (
                      <div className="mt-4">
                      <Label className="flex items-center"><FileJson className="mr-2 h-4 w-4 text-accent"/>Mock Response:</Label>
                      <pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto max-h-60"><code>{postVerifyResponse}</code></pre>
                      </div>
                  )}
                  </CardContent>
              </Card>
             
              {/* GET /api/v1/dpp/history/{productId} */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center"><History className="mr-2 h-5 w-5 text-info"/>GET /api/v1/dpp/history/{'{productId}'}</CardTitle>
                  <CardDescription>Retrieve the audit trail / history for a specific DPP.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="historyProductIdInput">Product ID</Label>
                    <Input id="historyProductIdInput" value={getHistoryProductId} onChange={(e) => setGetHistoryProductId(e.target.value)} placeholder="e.g., DPP001" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Button onClick={handleMockGetHistory} disabled={isGetHistoryLoading} variant="secondary">
                        {isGetHistoryLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        {isGetHistoryLoading ? "Fetching History..." : "Send Request"}
                    </Button>
                    <Select defaultValue="cURL" disabled>
                        <SelectTrigger className="w-[150px] text-xs h-9"><SelectValue placeholder="Code Sample" /></SelectTrigger>
                        <SelectContent>{codeSampleLanguages.map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  {getHistoryResponse && (
                    <div className="mt-4">
                      <Label className="flex items-center"><FileJson className="mr-2 h-4 w-4 text-accent"/>Mock Response:</Label>
                      <pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto max-h-60"><code>{getHistoryResponse}</code></pre>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* POST /api/v1/dpp/import */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center"><UploadCloud className="mr-2 h-5 w-5 text-info"/>POST /api/v1/dpp/import</CardTitle>
                  <CardDescription>Batch import Digital Product Passports (CSV, JSON, etc.).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="importFileType">File Type (Conceptual)</Label>
                    <Select value={postImportFileType} onValueChange={setPostImportFileType}>
                      <SelectTrigger id="importFileType">
                        <SelectValue placeholder="Select file type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="api">API (Simulate direct data feed)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-xs text-muted-foreground">For this mock, just select a type and send. A real implementation would include file upload or data input.</p>
                  <div className="flex items-center justify-between">
                    <Button onClick={handleMockPostImport} disabled={isPostImportLoading} variant="secondary">
                        {isPostImportLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        {isPostImportLoading ? "Importing..." : "Send Request"}
                    </Button>
                    <Select defaultValue="cURL" disabled>
                        <SelectTrigger className="w-[150px] text-xs h-9"><SelectValue placeholder="Code Sample" /></SelectTrigger>
                        <SelectContent>{codeSampleLanguages.map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  {postImportResponse && (
                    <div className="mt-4">
                      <Label className="flex items-center"><FileJson className="mr-2 h-4 w-4 text-accent"/>Mock Response:</Label>
                      <pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto max-h-60"><code>{postImportResponse}</code></pre>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* GET /api/v1/dpp/graph/{productId} */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center"><Share2 className="mr-2 h-5 w-5 text-info"/>GET /api/v1/dpp/graph/{'{productId}'}</CardTitle>
                  <CardDescription>Retrieve data for supply chain visualization.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="graphProductIdInput">Product ID</Label>
                    <Input id="graphProductIdInput" value={getGraphProductId} onChange={(e) => setGetGraphProductId(e.target.value)} placeholder="e.g., DPP001" />
                  </div>
                   <div className="flex items-center justify-between">
                    <Button onClick={handleMockGetGraph} disabled={isGetGraphLoading} variant="secondary">
                        {isGetGraphLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        {isGetGraphLoading ? "Fetching Graph Data..." : "Send Request"}
                    </Button>
                    <Select defaultValue="cURL" disabled>
                        <SelectTrigger className="w-[150px] text-xs h-9"><SelectValue placeholder="Code Sample" /></SelectTrigger>
                        <SelectContent>{codeSampleLanguages.map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  {getGraphResponse && (
                    <div className="mt-4">
                      <Label className="flex items-center"><FileJson className="mr-2 h-4 w-4 text-accent"/>Mock Response:</Label>
                      <pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto max-h-60"><code>{getGraphResponse}</code></pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            </CardContent>
        </Card>
        </TabsContent>

        <TabsContent value="documentation" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline flex items-center"><BookOpen className="mr-3 h-6 w-6 text-primary" /> Explore Our Documentation</CardTitle>
                <CardDescription>Find all our guides, API references, and best practices in one place to help you build robust integrations with the Norruva DPP platform.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild size="lg">
                  <Link href="/developer/docs">
                    Go to Documentation Hub
                    <ExternalLinkIcon className="ml-2 h-4 w-4"/>
                  </Link>
                </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
             <Card className="shadow-lg lg:col-span-1">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center"><FileCode className="mr-3 h-6 w-6 text-primary" /> SDKs (Conceptual)</CardTitle>
                    <CardDescription>Language-specific Software Development Kits to accelerate your integration with the Norruva DPP API.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {conceptualSdks.map(sdk => (
                        <Button key={sdk.name} variant="outline" className="w-full justify-start text-left group hover:bg-accent/10" asChild>
                            <a href={sdk.link} target="_blank" rel="noopener noreferrer" className={cn(sdk.soon && "opacity-60 cursor-not-allowed")}>
                                <sdk.icon className="mr-2 h-4 w-4 text-primary group-hover:text-accent transition-colors" />
                                <span className="flex-grow group-hover:text-accent transition-colors">{sdk.name}</span>
                                {sdk.soon && <Badge variant="outline" className="ml-auto text-xs">Soon</Badge>}
                                {!sdk.soon && <ExternalLinkIcon className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />}
                            </a>
                        </Button>
                    ))}
                </CardContent>
            </Card>

            <Card className="shadow-lg lg:col-span-2">
              <CardHeader>
                  <CardTitle className="font-headline flex items-center"><Wrench className="mr-3 h-6 w-6 text-primary" />Developer Tools</CardTitle>
                  <CardDescription>Utilities to help you build and test your integrations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <Button variant="outline" className="justify-start text-left" asChild>
                      <a href="/openapi.yaml" target="_blank" rel="noopener noreferrer">
                        <FileJson className="mr-2"/>Download OpenAPI 3.1 Spec
                      </a>
                    </Button>
                  <Button variant="outline" className="justify-start text-left" disabled>
                    <ExternalLinkIcon className="mr-2"/>View Postman Collection
                  </Button>
                  <Button variant="outline" className="justify-start text-left opacity-70 col-span-1 sm:col-span-2" disabled>
                    <ZapIcon className="mr-2"/>CLI Tool <Badge variant="outline" className="ml-auto text-xs">Coming Soon</Badge>
                  </Button>
                </div>
                <Separator />
                <div>
                  <h4 className="text-md font-semibold mb-2 flex items-center"><FileTextIcon className="mr-2 h-5 w-5 text-accent"/>Mock DPP Generator (Simplified)</h4>
                   <div className="space-y-3 p-3 border rounded-md bg-muted/30">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="devToolsMockDppName" className="text-xs">Product Name (Optional)</Label>
                        <Input id="devToolsMockDppName" value={mockDppGeneratorProductName} onChange={(e) => setMockDppGeneratorProductName(e.target.value)} placeholder="e.g., Test Widget" className="h-8 text-xs"/>
                      </div>
                      <div>
                        <Label htmlFor="devToolsMockDppCategory" className="text-xs">Category (Optional)</Label>
                        <Input id="devToolsMockDppCategory" value={mockDppGeneratorCategory} onChange={(e) => setMockDppGeneratorCategory(e.target.value)} placeholder="e.g., Gadgets" className="h-8 text-xs"/>
                      </div>
                    </div>
                    <Button size="sm" onClick={handleGenerateMockDpp} disabled={isGeneratingMockDpp} variant="secondary">
                      {isGeneratingMockDpp ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <ZapIcon className="mr-2 h-4 w-4" />}
                      {isGeneratingMockDpp ? "Generating..." : "Generate Mock DPP JSON"}
                    </Button>
                    {generatedMockDppJson && (
                      <div className="mt-3">
                        <Label className="text-xs">Generated Mock DPP:</Label>
                        <Textarea value={generatedMockDppJson} readOnly rows={6} className="font-mono text-xs bg-background"/>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg lg:col-span-3">
              <CardHeader>
                  <CardTitle className="font-headline flex items-center"><FileCode className="mr-3 h-6 w-6 text-primary" /> Code Samples &amp; Tutorials</CardTitle>
                  <CardDescription>Practical examples and step-by-step guides.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="space-y-3">
                      <h4 className="font-semibold text-md mb-1 text-muted-foreground">Code Samples</h4>
                      {mockCodeSamples.map(sample => (
                      <div key={sample.id} className="p-3 border rounded-md bg-muted/30">
                          <h5 className="text-sm font-medium text-foreground mb-0.5 flex items-center"><sample.icon className="mr-2 h-4 w-4 text-primary/80"/>{sample.title}</h5>
                          <p className="text-xs text-muted-foreground mb-1.5">{sample.description}</p>
                          <Button variant="link" size="sm" className="p-0 h-auto text-primary text-xs" disabled>{sample.linkText}</Button>
                      </div>
                      ))}
                  </div>
                  <div className="space-y-3 pt-4 border-t">
                      <h4 className="font-semibold text-md mb-1 text-muted-foreground">Tutorials</h4>
                      {mockTutorials.map(tutorial => (
                      <div key={tutorial.id} className="p-3 border rounded-md bg-muted/30">
                          <h5 className="text-sm font-medium text-foreground mb-0.5 flex items-center"><tutorial.icon className="mr-2 h-4 w-4 text-primary/80"/>{tutorial.title}</h5>
                          <p className="text-xs text-muted-foreground mb-1.5">{tutorial.description}</p>
                          <Button variant="link" size="sm" className="p-0 h-auto text-primary text-xs" disabled>{tutorial.linkText}</Button>
                      </div>
                      ))}
                  </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg lg:col-span-3">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center"><Lightbulb className="mr-3 h-6 w-6 text-primary" /> AI &amp; Smart Assist Features (Conceptual)</CardTitle>
                    <CardDescription>Leverage AI to streamline your development and integration process.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 border rounded-md bg-muted/30">
                        <h4 className="text-md font-semibold mb-1 flex items-center"><MessageSquare className="mr-2 h-5 w-5 text-accent"/>AI Doc Co-Pilot</h4>
                        <p className="text-sm text-muted-foreground">Get live troubleshooting, code assistance, and answers to your API questions directly within the documentation or via a dedicated chat interface.</p>
                        <Button variant="outline" size="sm" className="mt-3" asChild><Link href="/copilot">Access Co-Pilot</Link></Button>
                    </div>
                    <div className="p-4 border rounded-md bg-muted/30">
                        <h4 className="text-md font-semibold mb-1 flex items-center"><FileCog className="mr-2 h-5 w-5 text-accent"/>SDK Autogeneration Assistant</h4>
                        <p className="text-sm text-muted-foreground">Specify your preferred language and receive AI-assisted guidance for generating tailored SDKs or client libraries. (Future Feature)</p>
                    </div>
                    <div className="p-4 border rounded-md bg-muted/30 md:col-span-2">
                        <h4 className="text-md font-semibold mb-1 flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-accent"/>Real-time AI Integration Suggestions</h4>
                        <p className="text-sm text-muted-foreground">Receive contextual, AI-powered suggestions for best-practice integration patterns as you explore the API playground and documentation. (Future Feature)</p>
                    </div>
                </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings_usage" className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           <Card className="shadow-lg lg:col-span-2">
                <CardHeader>
                <CardTitle className="font-headline flex items-center"><BarChart2 className="mr-3 h-6 w-6 text-primary" /> API Usage &amp; Reporting</CardTitle>
                <CardDescription>Monitor your API usage, view logs, and understand integration performance (Mock Data for <Badge variant="outline" className="capitalize">{currentEnvironment}</Badge> environment for <Badge variant="outline">{mockOrganizationName}</Badge>).</CardDescription>
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
                    </ul>
                    <Button variant="outline" disabled>Access Full Reporting Dashboard (Coming Soon)</Button>
                    <p className="text-xs text-muted-foreground mt-2">Note: Usage metrics are specific to '{mockOrganizationName}'. In a multi-tenant setup, admins would see aggregated views or switch tenant reports.</p>
                </CardContent>
            </Card>
            <div className="space-y-6">
                <Card className="shadow-lg">
                    <CardHeader>
                    <CardTitle className="font-headline flex items-center"><Settings2 className="mr-3 h-6 w-6 text-primary" /> Advanced Organization Settings</CardTitle>
                    <CardDescription>Explore advanced capabilities and configurations for the <Badge variant="outline" className="capitalize">{currentEnvironment}</Badge> environment for <Badge variant="outline">{mockOrganizationName}</Badge>.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-md mb-1 flex items-center"><PackageSearch className="mr-2 h-5 w-5 text-accent"/>Tenant Branding Customization</h4>
                        <p className="text-sm text-muted-foreground">Apply your organization's logo and theme. (Conceptual)</p>
                    </div>
                    <div className="pt-3 border-t">
                        <h4 className="font-semibold text-md mb-1 flex items-center"><Layers className="mr-2 h-5 w-5 text-accent"/>Data Schema Mapping</h4>
                        <p className="text-sm text-muted-foreground">Configure custom data fields for your organization's DPPs. (Conceptual)</p>
                    </div>
                    <div className="pt-3 border-t">
                        <h4 className="font-semibold text-md mb-1 flex items-center"><Users className="mr-2 h-5 w-5 text-accent"/>User Management for {mockOrganizationName}</h4>
                        <p className="text-sm text-muted-foreground">Invite and manage users within your organization. (Conceptual - See main <Link href="/settings/users" className="text-primary hover:underline">Settings</Link>)</p>
                    </div>
                    </CardContent>
                </Card>
                 <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center"><HelpCircle className="mr-3 h-6 w-6 text-primary" /> Support &amp; Feedback</CardTitle>
                        <CardDescription>Get help and share your thoughts.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button variant="outline" className="w-full justify-start" asChild><Link href="#"><LifeBuoy className="mr-2 h-4 w-4" /> Help Center / FAQ (Mock)</Link></Button>
                        <Button variant="outline" className="w-full justify-start" asChild><Link href="#"><Users className="mr-2 h-4 w-4" /> Community Forum (Mock)</Link></Button>
                        <Button variant="link" asChild className="p-0 h-auto text-primary hover:underline"><a href="mailto:dev-feedback@norruva.com"><MessageSquare className="mr-2 h-4 w-4"/> Provide Feedback</a></Button>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}


    


    

