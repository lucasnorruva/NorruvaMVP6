
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
    UploadCloud, ShieldCheck, Cpu, HardDrive, Filter as FilterIcon, AlertTriangle
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

const systemStatusData = [
    { name: "DPP Core API", status: "Operational", icon: CheckCircle, color: "text-green-500" },
    { name: "AI Services (Genkit Flows)", status: "Operational", icon: CheckCircle, color: "text-green-500" },
    { name: "Data Extraction Service (Mock)", status: "Degraded Performance", icon: AlertTriangle, color: "text-yellow-500" },
    { name: "EBSI Mock Interface", status: "Operational", icon: CheckCircle, color: "text-green-500" },
    { name: "Developer Portal Site", status: "Operational", icon: CheckCircle, color: "text-green-500" },
    { name: "Sandbox Environment API", status: "Under Maintenance", icon: Wrench, color: "text-blue-500" },
    { name: "Documentation Site", status: "Operational", icon: CheckCircle, color: "text-green-500" },
];


const generateMockCodeSnippet = (
  endpointKey: string,
  method: string,
  language: string,
  params: any,
  body: string | null,
  currentEnv: string
): string => {
  const apiKeyPlaceholder = `YOUR_${currentEnv.toUpperCase()}_API_KEY`;
  const baseUrl = 'http://localhost:9002/api/v1';

  let urlPath = "";
  switch (endpointKey) {
    case "getProduct": urlPath = `/dpp/${params.productId || '{productId}'}`; break;
    case "listDpps":
        const queryParams = new URLSearchParams();
        if (params.status && params.status !== 'all') queryParams.append('status', params.status);
        if (params.category && params.category !== 'all') queryParams.append('category', params.category);
        if (params.searchQuery) queryParams.append('searchQuery', params.searchQuery);
        if (params.blockchainAnchored && params.blockchainAnchored !== 'all') queryParams.append('blockchainAnchored', params.blockchainAnchored);
        urlPath = `/dpp${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        break;
    case "createDpp": urlPath = "/dpp"; break;
    case "updateDpp": urlPath = `/dpp/${params.productId || '{productId}'}`; break;
    case "deleteDpp": urlPath = `/dpp/${params.productId || '{productId}'}`; break;
    case "qrValidate": urlPath = "/qr/validate"; break;
    case "addLifecycleEvent": urlPath = `/dpp/${params.productId || '{productId}'}/lifecycle-events`; break;
    case "getComplianceSummary": urlPath = `/dpp/${params.productId || '{productId}'}/compliance-summary`; break;
    case "verifyDpp": urlPath = "/dpp/verify"; break;
    case "getDppHistory": urlPath = `/dpp/history/${params.productId || '{productId}'}`; break;
    case "importDpps": urlPath = "/dpp/import"; break;
    case "getDppGraph": urlPath = `/dpp/graph/${params.productId || '{productId}'}`; break;
    default: urlPath = "/unknown-endpoint";
  }

  const fullUrl = `${baseUrl}${urlPath}`;
  const safeBody = body || '{}'; // Ensure body is a valid JSON string if null

  if (language === "cURL") {
    let curlCmd = `curl -X ${method} \\\n  '${fullUrl}' \\\n  -H 'Authorization: Bearer ${apiKeyPlaceholder}'`;
    if (method === "POST" || method === "PUT") {
      curlCmd += ` \\\n  -H 'Content-Type: application/json' \\\n  -d '${safeBody.replace(/'/g, "'\\''")}'`; // Basic escaping for single quotes in body
    }
    return curlCmd;
  } else if (language === "JavaScript") {
    let jsFetch = `fetch('${fullUrl}', {\n  method: '${method}',\n  headers: {\n    'Authorization': 'Bearer ${apiKeyPlaceholder}'`;
    if (method === "POST" || method === "PUT") {
      jsFetch += `,\n    'Content-Type': 'application/json'`;
    }
    jsFetch += `\n  }`;
    if (method === "POST" || method === "PUT") {
      jsFetch += `,\n  body: JSON.stringify(${safeBody})`;
    }
    jsFetch += `\n})\n.then(response => response.json())\n.then(data => console.log(data))\n.catch(error => console.error('Error:', error));`;
    return jsFetch;
  } else if (language === "Python") {
    let pyRequests = `import requests\nimport json\n\nurl = "${fullUrl}"\nheaders = {\n  "Authorization": "Bearer ${apiKeyPlaceholder}"`;
    if (method === "POST" || method === "PUT") {
      pyRequests += `,\n  "Content-Type": "application/json"`;
    }
    pyRequests += `\n}`;
    if (method === "POST" || method === "PUT") {
      pyRequests += `\npayload = json.dumps(${safeBody})`; // Assume safeBody is a valid Python dict representation or JSON string
      pyRequests += `\nresponse = requests.request("${method}", url, headers=headers, data=payload)`;
    } else {
      pyRequests += `\nresponse = requests.request("${method}", url, headers=headers)`;
    }
    pyRequests += `\n\nprint(response.json())`;
    return pyRequests;
  }
  return "Code snippet not available for this language.";
};


export default function DeveloperPortalPage() {
  const { toast } = useToast();

  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialMockApiKeys);
  const [webhooks, setWebhooks] = useState<WebhookEntry[]>(initialMockWebhooks);
  const [currentEnvironment, setCurrentEnvironment] = useState<string>("sandbox");
  const mockOrganizationName = "Acme Innovations"; 
  const [lastStatusCheckTime, setLastStatusCheckTime] = useState(new Date().toLocaleTimeString());

  const [getProductId, setGetProductId] = useState<string>("DPP001");
  const [getProductResponse, setGetProductResponse] = useState<string | null>(null);
  const [isGetProductLoading, setIsGetProductLoading] = useState(false);
  const [getProductSnippetLang, setGetProductSnippetLang] = useState("cURL");

  const [listDppFilters, setListDppFilters] = useState({ status: "all", category: "all", searchQuery: "", blockchainAnchored: "all"});
  const [listProductsResponse, setListProductsResponse] = useState<string | null>(null);
  const [isListProductsLoading, setIsListProductsLoading] = useState(false);
  const [listDppsSnippetLang, setListDppsSnippetLang] = useState("cURL");
  
  const [postDppBody, setPostDppBody] = useState<string>(
    JSON.stringify({ productName: "New Widget Pro", category: "Gadgets", gtin: "1234500000123" }, null, 2)
  );
  const [postDppResponse, setPostDppResponse] = useState<string | null>(null);
  const [isPostDppLoading, setIsPostDppLoading] = useState(false);
  const [createDppSnippetLang, setCreateDppSnippetLang] = useState("cURL");

  const [postLifecycleEventProductId, setPostLifecycleEventProductId] = useState<string>("DPP001");
  const [postLifecycleEventBody, setPostLifecycleEventBody] = useState<string>(
    JSON.stringify({ eventType: "Shipped", location: "Warehouse B", details: "Order #SO12345" }, null, 2)
  );
  const [postLifecycleEventResponse, setPostLifecycleEventResponse] = useState<string | null>(null);
  const [isPostLifecycleEventLoading, setIsPostLifecycleEventLoading] = useState(false);
  const [addLifecycleEventSnippetLang, setAddLifecycleEventSnippetLang] = useState("cURL");

  const [getComplianceProductId, setGetComplianceProductId] = useState<string>("DPP001");
  const [getComplianceResponse, setGetComplianceResponse] = useState<string | null>(null);
  const [isGetComplianceLoading, setIsGetComplianceLoading] = useState(false);
  const [getComplianceSummarySnippetLang, setGetComplianceSummarySnippetLang] = useState("cURL");
  
  const [postQrValidateBody, setPostQrValidateBody] = useState<string>(
    JSON.stringify({ qrIdentifier: "DPP001" }, null, 2)
  );
  const [postQrValidateResponse, setPostQrValidateResponse] = useState<string | null>(null);
  const [isPostQrValidateLoading, setIsPostQrValidateLoading] = useState(false);
  const [qrValidateSnippetLang, setQrValidateSnippetLang] = useState("cURL");


  const [postVerifyProductId, setPostVerifyProductId] = useState<string>("DPP001");
  const [postVerifyResponse, setPostVerifyResponse] = useState<string | null>(null);
  const [isPostVerifyLoading, setIsPostVerifyLoading] = useState(false);
  const [verifyDppSnippetLang, setVerifyDppSnippetLang] = useState("cURL");

  const [putProductId, setPutProductId] = useState<string>("DPP001");
  const [putProductBody, setPutProductBody] = useState<string>(
    JSON.stringify({ productDetails: { description: "Updated description with enhanced features." }, metadata: { status: "pending_review"} }, null, 2)
  );
  const [putProductResponse, setPutProductResponse] = useState<string | null>(null);
  const [isPutProductLoading, setIsPutProductLoading] = useState(false);
  const [updateDppSnippetLang, setUpdateDppSnippetLang] = useState("cURL");

  const [deleteProductId, setDeleteProductId] = useState<string>("PROD002"); 
  const [deleteProductResponse, setDeleteProductResponse] = useState<string | null>(null);
  const [isDeleteProductLoading, setIsDeleteProductLoading] = useState(false);
  const [deleteDppSnippetLang, setDeleteDppSnippetLang] = useState("cURL");

  const [mockDppGeneratorProductName, setMockDppGeneratorProductName] = useState("");
  const [mockDppGeneratorCategory, setMockDppGeneratorCategory] = useState("");
  const [generatedMockDppJson, setGeneratedMockDppJson] = useState<string | null>(null);
  const [isGeneratingMockDpp, setIsGeneratingMockDpp] = useState(false);

  const [getHistoryProductId, setGetHistoryProductId] = useState<string>("DPP001");
  const [getHistoryResponse, setGetHistoryResponse] = useState<string | null>(null);
  const [isGetHistoryLoading, setIsGetHistoryLoading] = useState(false);
  const [getDppHistorySnippetLang, setGetDppHistorySnippetLang] = useState("cURL");

  const [postImportFileType, setPostImportFileType] = useState<string>("csv");
  const [postImportResponse, setPostImportResponse] = useState<string | null>(null);
  const [isPostImportLoading, setIsPostImportLoading] = useState(false);
  const [importDppsSnippetLang, setImportDppsSnippetLang] = useState("cURL");

  const [getGraphProductId, setGetGraphProductId] = useState<string>("DPP001");
  const [getGraphResponse, setGetGraphResponse] = useState<string | null>(null);
  const [isGetGraphLoading, setIsGetGraphLoading] = useState(false);
  const [getDppGraphSnippetLang, setGetDppGraphSnippetLang] = useState("cURL");

  // State for code snippets, one for each endpoint card
  const [getProductCodeSnippet, setGetProductCodeSnippet] = useState("");
  const [listDppsCodeSnippet, setListDppsCodeSnippet] = useState("");
  const [createDppCodeSnippet, setCreateDppCodeSnippet] = useState("");
  const [updateDppCodeSnippet, setUpdateDppCodeSnippet] = useState("");
  const [deleteDppCodeSnippet, setDeleteDppCodeSnippet] = useState("");
  const [qrValidateCodeSnippet, setQrValidateCodeSnippet] = useState("");
  const [addLifecycleEventCodeSnippet, setAddLifecycleEventCodeSnippet] = useState("");
  const [getComplianceSummaryCodeSnippet, setGetComplianceSummaryCodeSnippet] = useState("");
  const [verifyDppCodeSnippet, setVerifyDppCodeSnippet] = useState("");
  const [getDppHistoryCodeSnippet, setGetDppHistoryCodeSnippet] = useState("");
  const [importDppsCodeSnippet, setImportDppsCodeSnippet] = useState("");
  const [getDppGraphCodeSnippet, setGetDppGraphCodeSnippet] = useState("");


  const updateSnippet = (
    endpointKey: string, 
    method: string, 
    lang: string, 
    params: any, 
    body: string | null, 
    setSnippetFn: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const snippet = generateMockCodeSnippet(endpointKey, method, lang, params, body, currentEnvironment);
    setSnippetFn(snippet);
  };

  // Effects to update snippets when relevant state changes
  useEffect(() => updateSnippet("getProduct", "GET", getProductSnippetLang, { productId: getProductId }, null, setGetProductCodeSnippet), [getProductId, getProductSnippetLang, currentEnvironment]);
  useEffect(() => updateSnippet("listDpps", "GET", listDppsSnippetLang, listDppFilters, null, setListDppsCodeSnippet), [listDppFilters, listDppsSnippetLang, currentEnvironment]);
  useEffect(() => updateSnippet("createDpp", "POST", createDppSnippetLang, {}, postDppBody, setCreateDppCodeSnippet), [postDppBody, createDppSnippetLang, currentEnvironment]);
  useEffect(() => updateSnippet("updateDpp", "PUT", updateDppSnippetLang, { productId: putProductId }, putProductBody, setUpdateDppCodeSnippet), [putProductId, putProductBody, updateDppSnippetLang, currentEnvironment]);
  useEffect(() => updateSnippet("deleteDpp", "DELETE", deleteDppSnippetLang, { productId: deleteProductId }, null, setDeleteDppCodeSnippet), [deleteProductId, deleteDppSnippetLang, currentEnvironment]);
  useEffect(() => updateSnippet("qrValidate", "POST", qrValidateSnippetLang, {}, postQrValidateBody, setQrValidateCodeSnippet), [postQrValidateBody, qrValidateSnippetLang, currentEnvironment]);
  useEffect(() => updateSnippet("addLifecycleEvent", "POST", addLifecycleEventSnippetLang, { productId: postLifecycleEventProductId }, postLifecycleEventBody, setAddLifecycleEventCodeSnippet), [postLifecycleEventProductId, postLifecycleEventBody, addLifecycleEventSnippetLang, currentEnvironment]);
  useEffect(() => updateSnippet("getComplianceSummary", "GET", getComplianceSummarySnippetLang, { productId: getComplianceProductId }, null, setGetComplianceSummaryCodeSnippet), [getComplianceProductId, getComplianceSummarySnippetLang, currentEnvironment]);
  useEffect(() => updateSnippet("verifyDpp", "POST", verifyDppSnippetLang, { productId: postVerifyProductId }, JSON.stringify({ productId: postVerifyProductId }), setVerifyDppCodeSnippet), [postVerifyProductId, verifyDppSnippetLang, currentEnvironment]);
  useEffect(() => updateSnippet("getDppHistory", "GET", getDppHistorySnippetLang, { productId: getHistoryProductId }, null, setGetDppHistoryCodeSnippet), [getHistoryProductId, getDppHistorySnippetLang, currentEnvironment]);
  useEffect(() => updateSnippet("importDpps", "POST", importDppsSnippetLang, { fileType: postImportFileType }, JSON.stringify({ fileType: postImportFileType, data: "mock_base64_data" }), setImportDppsCodeSnippet), [postImportFileType, importDppsSnippetLang, currentEnvironment]);
  useEffect(() => updateSnippet("getDppGraph", "GET", getDppGraphSnippetLang, { productId: getGraphProductId }, null, setGetDppGraphCodeSnippet), [getGraphProductId, getDppGraphSnippetLang, currentEnvironment]);


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


  const makeApiCall = async (
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body: any | null,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setResponse: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    setLoading(true);
    setResponse(null);
    toast({ title: "Sending Request...", description: `${method} ${url}` });
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_${currentEnvironment.toUpperCase()}_API_KEY` // Using placeholder
        }
      };
      if (body && (method === 'POST' || method === 'PUT')) {
        options.body = typeof body === 'string' ? body : JSON.stringify(body);
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mocking the fetch call
      const res = await fetch(url, options);
      const responseData = await res.json();
      
      if (!res.ok) {
        setResponse(JSON.stringify({ status: res.status, error: responseData }, null, 2));
        toast({ title: `Error: ${res.status}`, description: responseData.error?.message || 'An API error occurred.', variant: "destructive" });
      } else {
        setResponse(JSON.stringify(responseData, null, 2));
        toast({ title: "Success!", description: `${method} request to ${url} was successful.`, variant: "default"});
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      setResponse(JSON.stringify({ error: "Network or parsing error", details: errorMsg }, null, 2));
      toast({ title: "Request Failed", description: errorMsg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleMockGetProductDetails = () => {
    updateSnippet("getProduct", "GET", getProductSnippetLang, { productId: getProductId }, null, setGetProductCodeSnippet);
    makeApiCall(`/api/v1/dpp/${getProductId}`, 'GET', null, setIsGetProductLoading, setGetProductResponse);
  }
  
  const handleMockListProducts = () => {
    const queryParams = new URLSearchParams();
    if (listDppFilters.status !== 'all') queryParams.append('status', listDppFilters.status);
    if (listDppFilters.category !== 'all') queryParams.append('category', listDppFilters.category);
    if (listDppFilters.searchQuery) queryParams.append('searchQuery', listDppFilters.searchQuery);
    if (listDppFilters.blockchainAnchored !== 'all') queryParams.append('blockchainAnchored', listDppFilters.blockchainAnchored);
    const url = `/api/v1/dpp?${queryParams.toString()}`;
    updateSnippet("listDpps", "GET", listDppsSnippetLang, listDppFilters, null, setListDppsCodeSnippet);
    makeApiCall(url, 'GET', null, setIsListProductsLoading, setListProductsResponse);
  };

  const handleMockPostDpp = () => {
    updateSnippet("createDpp", "POST", createDppSnippetLang, {}, postDppBody, setCreateDppCodeSnippet);
    makeApiCall('/api/v1/dpp', 'POST', postDppBody, setIsPostDppLoading, setPostDppResponse);
  }
  const handleMockPutProduct = () => {
    updateSnippet("updateDpp", "PUT", updateDppSnippetLang, { productId: putProductId }, putProductBody, setUpdateDppCodeSnippet);
    makeApiCall(`/api/v1/dpp/${putProductId}`, 'PUT', putProductBody, setIsPutProductLoading, setPutProductResponse);
  }
  const handleMockDeleteProduct = () => {
    updateSnippet("deleteDpp", "DELETE", deleteDppSnippetLang, { productId: deleteProductId }, null, setDeleteDppCodeSnippet);
    makeApiCall(`/api/v1/dpp/${deleteProductId}`, 'DELETE', null, setIsDeleteProductLoading, setDeleteProductResponse);
  }
  const handleMockPostLifecycleEvent = () => {
    updateSnippet("addLifecycleEvent", "POST", addLifecycleEventSnippetLang, { productId: postLifecycleEventProductId }, postLifecycleEventBody, setAddLifecycleEventCodeSnippet);
    makeApiCall(`/api/v1/dpp/${postLifecycleEventProductId}/lifecycle-events`, 'POST', postLifecycleEventBody, setIsPostLifecycleEventLoading, setPostLifecycleEventResponse);
  }
  const handleMockGetComplianceSummary = () => {
    updateSnippet("getComplianceSummary", "GET", getComplianceSummarySnippetLang, { productId: getComplianceProductId }, null, setGetComplianceSummaryCodeSnippet);
    makeApiCall(`/api/v1/dpp/${getComplianceProductId}/compliance-summary`, 'GET', null, setIsGetComplianceLoading, setGetComplianceResponse);
  }
  const handleMockPostQrValidate = () => {
    updateSnippet("qrValidate", "POST", qrValidateSnippetLang, {}, postQrValidateBody, setQrValidateCodeSnippet);
    makeApiCall('/api/v1/qr/validate', 'POST', postQrValidateBody, setIsPostQrValidateLoading, setPostQrValidateResponse);
  }
  const handleMockPostVerify = () => {
    const body = { productId: postVerifyProductId };
    updateSnippet("verifyDpp", "POST", verifyDppSnippetLang, body, JSON.stringify(body), setVerifyDppCodeSnippet);
    makeApiCall(`/api/v1/dpp/verify`, 'POST', body, setIsPostVerifyLoading, setPostVerifyResponse); 
  }
  const handleMockGetHistory = () => {
    updateSnippet("getDppHistory", "GET", getDppHistorySnippetLang, { productId: getHistoryProductId }, null, setGetDppHistoryCodeSnippet);
    makeApiCall(`/api/v1/dpp/history/${getHistoryProductId}`, 'GET', null, setIsGetHistoryLoading, setGetHistoryResponse);
  }
  const handleMockPostImport = () => {
    const body = { fileType: postImportFileType, data: "mock_file_content_base64_encoded" };
    updateSnippet("importDpps", "POST", importDppsSnippetLang, body, JSON.stringify(body), setImportDppsCodeSnippet);
    makeApiCall('/api/v1/dpp/import', 'POST', body, setIsPostImportLoading, setPostImportResponse);
  }
  const handleMockGetGraph = () => {
    updateSnippet("getDppGraph", "GET", getDppGraphSnippetLang, { productId: getGraphProductId }, null, setGetDppGraphCodeSnippet);
    makeApiCall(`/api/v1/dpp/graph/${getGraphProductId}`, 'GET', null, setIsGetGraphLoading, setGetDppGraphCodeSnippet);
  }


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
        eprel: { status: 'N/A', lastChecked: new Date().toISOString() }
      },
    };
    setGeneratedMockDppJson(JSON.stringify(mockDpp, null, 2));
    toast({ title: "Mock DPP Generated", description: "A sample DPP JSON has been displayed." });
    setIsGeneratingMockDpp(false);
  };


  const dashboardQuickActions = [
    { label: "View My API Keys", href: "#", targetTab: "api_keys", icon: KeyRound },
    { label: "Explore API Reference", href: "/developer/docs/api-reference", icon: BookText },
    { label: "Manage Webhooks", href: "#", targetTab: "webhooks", icon: Webhook },
    { label: "Check API Status", href: "#", icon: ServerCrash, targetTab: "dashboard", tooltip: "View API Status on Dashboard" },
  ];

  const codeSampleLanguages = ["cURL", "JavaScript", "Python"]; // Simplified list
  const conceptualSdks = [
      { name: "JavaScript SDK", link: "#", soon: true, icon: FileCode, description: "Client library for Node.js and browser environments." },
      { name: "Python SDK", link: "#", soon: true, icon: FileCode, description: "Integrate Norruva APIs with your Python applications." },
      { name: "Java SDK", link: "#", soon: true, icon: FileCode, description: "SDK for Java-based enterprise systems." },
      { name: "Go SDK", link: "#", soon: true, icon: FileCode, description: "Efficient Go library for backend integrations." },
      { name: "C# SDK", link: "#", soon: true, icon: FileCode, description: "SDK for .NET applications." },
  ];

  const getUsageMetric = (metricType: 'calls' | 'errorRate') => {
    if (currentEnvironment === 'sandbox') {
        return metricType === 'calls' ? '1,234' : '0.2%';
    }
    return metricType === 'calls' ? '105,678' : '0.05%';
  };


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
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded-md"><span>API Calls (Last 24h):</span> <span className="font-semibold">{getUsageMetric('calls')}</span></div>
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded-md"><span>Error Rate (Last 24h):</span> <span className="font-semibold">{getUsageMetric('errorRate')}</span></div>
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded-md"><span>Avg. Latency:</span> <span className="font-semibold">{currentEnvironment === 'sandbox' ? '120ms' : '85ms'}</span></div>
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded-md"><span>API Uptime (Last 7d):</span> <span className="font-semibold text-green-600">{currentEnvironment === 'sandbox' ? '99.95%' : '99.99%'}</span></div>
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded-md"><span>Peak Requests/Sec:</span> <span className="font-semibold">{currentEnvironment === 'sandbox' ? '15' : '250'}</span></div>
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded-md"><span>Overall API Status:</span> <span className="font-semibold text-green-600 flex items-center"><CheckCircle className="h-4 w-4 mr-1.5"/>All Systems Operational</span></div>
                <Button variant="link" size="sm" className="p-0 h-auto text-primary mt-2" onClick={() => document.querySelector('#developer-portal-tabs [data-state="inactive"][value="settings_usage"]')?.ariaSelected === "false" ? (document.querySelector('#developer-portal-tabs [data-state="inactive"][value="settings_usage"]') as HTMLElement)?.click() : null}>View Full Usage Report</Button>
              </CardContent>
            </Card>
            
            <Card className="shadow-md lg:col-span-2">
              <CardHeader>
                <CardTitle className="font-headline text-lg flex items-center"><Megaphone className="mr-2 h-5 w-5 text-primary" /> Platform News &amp; Announcements</CardTitle>
                <CardDescription>Stay updated with the latest from Norruva.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm max-h-72 overflow-y-auto">
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

          <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline text-lg flex items-center">
                    <ServerIconShadcn className="mr-2 h-5 w-5 text-primary" /> System &amp; Service Status
                </CardTitle>
                <CardDescription>Current operational status of Norruva platform components.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {systemStatusData.map((service) => {
                    const StatusIcon = service.icon;
                    return (
                        <div key={service.name} className="flex items-center justify-between p-2.5 border-b last:border-b-0 rounded-md hover:bg-muted/30">
                            <div className="flex items-center">
                                <StatusIcon className={cn("h-5 w-5 mr-3", service.color)} />
                                <span className="text-sm font-medium text-foreground">{service.name}</span>
                            </div>
                            <Badge
                                variant={service.status === "Operational" ? "default" : service.status.includes("Degraded") ? "outline" : "secondary"}
                                className={cn("text-xs",
                                    service.status === "Operational" && "bg-green-100 text-green-700 border-green-300",
                                    service.status.includes("Degraded") && "bg-yellow-100 text-yellow-700 border-yellow-300",
                                    service.status.includes("Maintenance") && "bg-blue-100 text-blue-700 border-blue-300"
                                )}
                            >
                                {service.status}
                            </Badge>
                        </div>
                    );
                })}
                <p className="text-xs text-muted-foreground pt-2">
                    Last checked: {lastStatusCheckTime}. For detailed incidents, visit status.norruva.com (conceptual).
                </p>
            </CardContent>
          </Card>

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
                    } else if (action.targetTab === 'dashboard') { 
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
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <Button onClick={handleMockGetProductDetails} disabled={isGetProductLoading} variant="secondary">
                        {isGetProductLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        {isGetProductLoading ? "Fetching..." : "Send Request"}
                    </Button>
                    <Select value={getProductSnippetLang} onValueChange={(value) => {setGetProductSnippetLang(value); updateSnippet("getProduct", "GET", value, {productId: getProductId}, null, setGetProductCodeSnippet);}}>
                        <SelectTrigger className="w-full sm:w-[150px] text-xs h-9"><SelectValue placeholder="Code Sample" /></SelectTrigger>
                        <SelectContent>{codeSampleLanguages.map(lang => <SelectItem key={`getProd-${lang}`} value={lang}>{lang}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  {getProductCodeSnippet && <div className="mt-2"><Label className="text-xs text-muted-foreground">Code Snippet ({getProductSnippetLang}):</Label><pre className="mt-1 p-2 bg-muted rounded-md text-xs overflow-x-auto max-h-40"><code>{getProductCodeSnippet}</code></pre></div>}
                  {getProductResponse && <div className="mt-4"><Label className="flex items-center"><FileJson className="mr-2 h-4 w-4 text-accent"/>Response:</Label><pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto max-h-60"><code>{getProductResponse}</code></pre></div>}
                  </CardContent>
              </Card>

              {/* GET /api/v1/dpp (List DPPs) */}
              <Card>
                  <CardHeader>
                  <CardTitle className="text-lg flex items-center"><ServerLucideIcon className="mr-2 h-5 w-5 text-info"/>GET /api/v1/dpp</CardTitle>
                  <CardDescription>Retrieve a list of available Digital Product Passports with filtering.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="list-dpp-search">Search Query (ID, Name, GTIN, Manufacturer)</Label>
                        <Input id="list-dpp-search" value={listDppFilters.searchQuery} onChange={(e) => setListDppFilters(prev => ({...prev, searchQuery: e.target.value}))} placeholder="e.g., EcoSmart, DPP001" />
                      </div>
                      <div>
                        <Label htmlFor="list-dpp-category">Category</Label>
                        <Input id="list-dpp-category" value={listDppFilters.category === 'all' ? '' : listDppFilters.category} onChange={(e) => setListDppFilters(prev => ({...prev, category: e.target.value || 'all'}))} placeholder="e.g., Appliances (or 'all')" />
                      </div>
                      <div>
                        <Label htmlFor="list-dpp-status">Status</Label>
                        <Select value={listDppFilters.status} onValueChange={(value) => setListDppFilters(prev => ({...prev, status: value}))}>
                          <SelectTrigger id="list-dpp-status"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {['all', 'draft', 'published', 'archived', 'pending_review', 'revoked'].map(s => <SelectItem key={`listStatus-${s}`} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="list-dpp-anchored">Blockchain Anchored</Label>
                         <Select value={listDppFilters.blockchainAnchored} onValueChange={(value) => setListDppFilters(prev => ({...prev, blockchainAnchored: value}))}>
                          <SelectTrigger id="list-dpp-anchored"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="anchored">Anchored</SelectItem>
                            <SelectItem value="not_anchored">Not Anchored</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center justify-between flex-wrap gap-2 mt-4">
                        <Button onClick={handleMockListProducts} disabled={isListProductsLoading} variant="secondary">
                            {isListProductsLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                            {isListProductsLoading ? "Fetching..." : "Send Request"}
                        </Button>
                         <Select value={listDppsSnippetLang} onValueChange={(value) => {setListDppsSnippetLang(value); updateSnippet("listDpps", "GET", value, listDppFilters, null, setListDppsCodeSnippet);}}>
                            <SelectTrigger className="w-full sm:w-[150px] text-xs h-9"><SelectValue placeholder="Code Sample" /></SelectTrigger>
                            <SelectContent>{codeSampleLanguages.map(lang => <SelectItem key={`listDpp-${lang}`} value={lang}>{lang}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    {listDppsCodeSnippet && <div className="mt-2"><Label className="text-xs text-muted-foreground">Code Snippet ({listDppsSnippetLang}):</Label><pre className="mt-1 p-2 bg-muted rounded-md text-xs overflow-x-auto max-h-40"><code>{listDppsCodeSnippet}</code></pre></div>}
                    {listProductsResponse && <div className="mt-4"><Label className="flex items-center"><FileJson className="mr-2 h-4 w-4 text-accent"/>Response:</Label><pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto max-h-96"><code>{listProductsResponse}</code></pre></div>}
                  </CardContent>
              </Card>

              {/* POST /api/v1/dpp */}
              <Card>
                  <CardHeader>
                  <CardTitle className="text-lg flex items-center"><ServerLucideIcon className="mr-2 h-5 w-5 text-info"/>POST /api/v1/dpp</CardTitle>
                  <CardDescription>Create a new Digital Product Passport.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                  <div>
                      <Label htmlFor="postDppBody">Request Body (JSON)</Label>
                      <Textarea id="postDppBody" value={postDppBody} onChange={(e) => setPostDppBody(e.target.value)} rows={5} className="font-mono text-xs"/>
                      <p className="text-xs text-muted-foreground mt-1">Example required fields: productName, category. See API Reference for full schema.</p>
                  </div>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <Button onClick={handleMockPostDpp} disabled={isPostDppLoading} variant="secondary">
                        {isPostDppLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        {isPostDppLoading ? "Creating..." : "Send Request"}
                    </Button>
                    <Select value={createDppSnippetLang} onValueChange={(value) => {setCreateDppSnippetLang(value); updateSnippet("createDpp", "POST", value, {}, postDppBody, setCreateDppCodeSnippet);}}>
                        <SelectTrigger className="w-full sm:w-[150px] text-xs h-9"><SelectValue placeholder="Code Sample" /></SelectTrigger>
                        <SelectContent>{codeSampleLanguages.map(lang => <SelectItem key={`createDpp-${lang}`} value={lang}>{lang}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                   {createDppCodeSnippet && <div className="mt-2"><Label className="text-xs text-muted-foreground">Code Snippet ({createDppSnippetLang}):</Label><pre className="mt-1 p-2 bg-muted rounded-md text-xs overflow-x-auto max-h-40"><code>{createDppCodeSnippet}</code></pre></div>}
                   {postDppResponse && <div className="mt-4"><Label className="flex items-center"><FileJson className="mr-2 h-4 w-4 text-accent"/>Response:</Label><pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto max-h-60"><code>{postDppResponse}</code></pre></div>}
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
                       <p className="text-xs text-muted-foreground mt-1">Send partial or full updates. See API Reference for updatable fields.</p>
                  </div>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <Button onClick={handleMockPutProduct} disabled={isPutProductLoading} variant="secondary">
                        {isPutProductLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        {isPutProductLoading ? "Sending..." : "Send Request"}
                    </Button>
                     <Select value={updateDppSnippetLang} onValueChange={(value) => {setUpdateDppSnippetLang(value); updateSnippet("updateDpp", "PUT", value, {productId: putProductId}, putProductBody, setUpdateDppCodeSnippet);}}>
                        <SelectTrigger className="w-full sm:w-[150px] text-xs h-9"><SelectValue placeholder="Code Sample" /></SelectTrigger>
                        <SelectContent>{codeSampleLanguages.map(lang => <SelectItem key={`updateDpp-${lang}`} value={lang}>{lang}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  {updateDppCodeSnippet && <div className="mt-2"><Label className="text-xs text-muted-foreground">Code Snippet ({updateDppSnippetLang}):</Label><pre className="mt-1 p-2 bg-muted rounded-md text-xs overflow-x-auto max-h-40"><code>{updateDppCodeSnippet}</code></pre></div>}
                  {putProductResponse && <div className="mt-4"><Label className="flex items-center"><FileJson className="mr-2 h-4 w-4 text-accent"/>Response:</Label><pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto max-h-60"><code>{putProductResponse}</code></pre></div>}
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
                   <div className="flex items-center justify-between flex-wrap gap-2">
                    <Button onClick={handleMockDeleteProduct} disabled={isDeleteProductLoading} variant="destructive">
                        {isDeleteProductLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                        {isDeleteProductLoading ? "Deleting..." : "Send Request"}
                    </Button>
                    <Select value={deleteDppSnippetLang} onValueChange={(value) => {setDeleteDppSnippetLang(value); updateSnippet("deleteDpp", "DELETE", value, {productId: deleteProductId}, null, setDeleteDppCodeSnippet);}}>
                        <SelectTrigger className="w-full sm:w-[150px] text-xs h-9"><SelectValue placeholder="Code Sample" /></SelectTrigger>
                        <SelectContent>{codeSampleLanguages.map(lang => <SelectItem key={`deleteDpp-${lang}`} value={lang}>{lang}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  {deleteDppCodeSnippet && <div className="mt-2"><Label className="text-xs text-muted-foreground">Code Snippet ({deleteDppSnippetLang}):</Label><pre className="mt-1 p-2 bg-muted rounded-md text-xs overflow-x-auto max-h-40"><code>{deleteDppCodeSnippet}</code></pre></div>}
                  {deleteProductResponse && <div className="mt-4"><Label className="flex items-center"><FileJson className="mr-2 h-4 w-4 text-accent"/>Response:</Label><pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto max-h-60"><code>{deleteProductResponse}</code></pre></div>}
                  </CardContent>
              </Card>
              
              {/* POST /api/v1/qr/validate */}
              <Card>
                  <CardHeader>
                  <CardTitle className="text-lg flex items-center"><ServerLucideIcon className="mr-2 h-5 w-5 text-info"/>POST /api/v1/qr/validate</CardTitle>
                  <CardDescription>Validate a QR identifier and retrieve a DPP summary.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                  <div>
                      <Label htmlFor="postQrValidateBody">Request Body (JSON)</Label>
                      <Textarea id="postQrValidateBody" value={postQrValidateBody} onChange={(e) => setPostQrValidateBody(e.target.value)} rows={3} className="font-mono text-xs"/>
                  </div>
                   <div className="flex items-center justify-between flex-wrap gap-2">
                    <Button onClick={handleMockPostQrValidate} disabled={isPostQrValidateLoading} variant="secondary">
                        {isPostQrValidateLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        {isPostQrValidateLoading ? "Validating..." : "Send Request"}
                    </Button>
                    <Select value={qrValidateSnippetLang} onValueChange={(value) => {setQrValidateSnippetLang(value); updateSnippet("qrValidate", "POST", value, {}, postQrValidateBody, setQrValidateCodeSnippet);}}>
                        <SelectTrigger className="w-full sm:w-[150px] text-xs h-9"><SelectValue placeholder="Code Sample" /></SelectTrigger>
                        <SelectContent>{codeSampleLanguages.map(lang => <SelectItem key={`qrValidate-${lang}`} value={lang}>{lang}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  {qrValidateCodeSnippet && <div className="mt-2"><Label className="text-xs text-muted-foreground">Code Snippet ({qrValidateSnippetLang}):</Label><pre className="mt-1 p-2 bg-muted rounded-md text-xs overflow-x-auto max-h-40"><code>{qrValidateCodeSnippet}</code></pre></div>}
                  {postQrValidateResponse && <div className="mt-4"><Label className="flex items-center"><FileJson className="mr-2 h-4 w-4 text-accent"/>Response:</Label><pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto max-h-60"><code>{postQrValidateResponse}</code></pre></div>}
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
                   <div className="flex items-center justify-between flex-wrap gap-2">
                      <Button onClick={handleMockPostLifecycleEvent} disabled={isPostLifecycleEventLoading} variant="secondary">
                          {isPostLifecycleEventLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                          {isPostLifecycleEventLoading ? "Sending..." : "Send Request"}
                      </Button>
                      <Select value={addLifecycleEventSnippetLang} onValueChange={(value) => {setAddLifecycleEventSnippetLang(value); updateSnippet("addLifecycleEvent", "POST", value, {productId: postLifecycleEventProductId}, postLifecycleEventBody, setAddLifecycleEventCodeSnippet);}}>
                          <SelectTrigger className="w-full sm:w-[150px] text-xs h-9"><SelectValue placeholder="Code Sample" /></SelectTrigger>
                          <SelectContent>{codeSampleLanguages.map(lang => <SelectItem key={`addLifecycle-${lang}`} value={lang}>{lang}</SelectItem>)}</SelectContent>
                      </Select>
                  </div>
                  {addLifecycleEventCodeSnippet && <div className="mt-2"><Label className="text-xs text-muted-foreground">Code Snippet ({addLifecycleEventSnippetLang}):</Label><pre className="mt-1 p-2 bg-muted rounded-md text-xs overflow-x-auto max-h-40"><code>{addLifecycleEventCodeSnippet}</code></pre></div>}
                  {postLifecycleEventResponse && <div className="mt-4"><Label className="flex items-center"><FileJson className="mr-2 h-4 w-4 text-accent"/>Response:</Label><pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto max-h-60"><code>{postLifecycleEventResponse}</code></pre></div>}
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
                  <div className="flex items-center justify-between flex-wrap gap-2">
                      <Button onClick={handleMockGetComplianceSummary} disabled={isGetComplianceLoading} variant="secondary">
                          {isGetComplianceLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                          {isGetComplianceLoading ? "Fetching..." : "Send Request"}
                      </Button>
                       <Select value={getComplianceSummarySnippetLang} onValueChange={(value) => {setGetComplianceSummarySnippetLang(value); updateSnippet("getComplianceSummary", "GET", value, {productId: getComplianceProductId}, null, setGetComplianceSummaryCodeSnippet);}}>
                          <SelectTrigger className="w-full sm:w-[150px] text-xs h-9"><SelectValue placeholder="Code Sample" /></SelectTrigger>
                          <SelectContent>{codeSampleLanguages.map(lang => <SelectItem key={`getCompliance-${lang}`} value={lang}>{lang}</SelectItem>)}</SelectContent>
                      </Select>
                  </div>
                  {getComplianceSummaryCodeSnippet && <div className="mt-2"><Label className="text-xs text-muted-foreground">Code Snippet ({getComplianceSummarySnippetLang}):</Label><pre className="mt-1 p-2 bg-muted rounded-md text-xs overflow-x-auto max-h-40"><code>{getComplianceSummaryCodeSnippet}</code></pre></div>}
                  {getComplianceResponse && <div className="mt-4"><Label className="flex items-center"><FileJson className="mr-2 h-4 w-4 text-accent"/>Response:</Label><pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto max-h-60"><code>{getComplianceResponse}</code></pre></div>}
                  </CardContent>
              </Card>

              {/* POST /api/v1/dpp/verify */}
              <Card>
                  <CardHeader>
                  <CardTitle className="text-lg flex items-center"><ServerLucideIcon className="mr-2 h-5 w-5 text-info"/>POST /api/v1/dpp/verify</CardTitle>
                  <CardDescription>Perform compliance and authenticity checks on a DPP.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                  <div>
                      <Label htmlFor="productIdInput-verify">Product ID to Verify</Label>
                      <Input id="productIdInput-verify" value={postVerifyProductId} onChange={(e) => setPostVerifyProductId(e.target.value)} placeholder="e.g., DPP001"/>
                  </div>
                   <div className="flex items-center justify-between flex-wrap gap-2">
                    <Button onClick={handleMockPostVerify} disabled={isPostVerifyLoading} variant="secondary">
                        {isPostVerifyLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        {isPostVerifyLoading ? "Verifying..." : "Send Request"}
                    </Button>
                    <Select value={verifyDppSnippetLang} onValueChange={(value) => {setVerifyDppSnippetLang(value); updateSnippet("verifyDpp", "POST", value, {productId: postVerifyProductId}, JSON.stringify({productId: postVerifyProductId}), setVerifyDppCodeSnippet);}}>
                        <SelectTrigger className="w-full sm:w-[150px] text-xs h-9"><SelectValue placeholder="Code Sample" /></SelectTrigger>
                        <SelectContent>{codeSampleLanguages.map(lang => <SelectItem key={`verifyDpp-${lang}`} value={lang}>{lang}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  {verifyDppCodeSnippet && <div className="mt-2"><Label className="text-xs text-muted-foreground">Code Snippet ({verifyDppSnippetLang}):</Label><pre className="mt-1 p-2 bg-muted rounded-md text-xs overflow-x-auto max-h-40"><code>{verifyDppCodeSnippet}</code></pre></div>}
                  {postVerifyResponse && <div className="mt-4"><Label className="flex items-center"><FileJson className="mr-2 h-4 w-4 text-accent"/>Response:</Label><pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto max-h-60"><code>{postVerifyResponse}</code></pre></div>}
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
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <Button onClick={handleMockGetHistory} disabled={isGetHistoryLoading} variant="secondary">
                        {isGetHistoryLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        {isGetHistoryLoading ? "Fetching History..." : "Send Request"}
                    </Button>
                    <Select value={getDppHistorySnippetLang} onValueChange={(value) => {setGetDppHistorySnippetLang(value); updateSnippet("getDppHistory", "GET", value, {productId: getHistoryProductId}, null, setGetDppHistoryCodeSnippet);}}>
                        <SelectTrigger className="w-full sm:w-[150px] text-xs h-9"><SelectValue placeholder="Code Sample" /></SelectTrigger>
                        <SelectContent>{codeSampleLanguages.map(lang => <SelectItem key={`getHistory-${lang}`} value={lang}>{lang}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  {getDppHistoryCodeSnippet && <div className="mt-2"><Label className="text-xs text-muted-foreground">Code Snippet ({getDppHistorySnippetLang}):</Label><pre className="mt-1 p-2 bg-muted rounded-md text-xs overflow-x-auto max-h-40"><code>{getDppHistoryCodeSnippet}</code></pre></div>}
                  {getHistoryResponse && <div className="mt-4"><Label className="flex items-center"><FileJson className="mr-2 h-4 w-4 text-accent"/>Response:</Label><pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto max-h-60"><code>{getHistoryResponse}</code></pre></div>}
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
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <Button onClick={handleMockPostImport} disabled={isPostImportLoading} variant="secondary">
                        {isPostImportLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        {isPostImportLoading ? "Importing..." : "Send Request"}
                    </Button>
                    <Select value={importDppsSnippetLang} onValueChange={(value) => {setImportDppsSnippetLang(value); updateSnippet("importDpps", "POST", value, {fileType: postImportFileType}, JSON.stringify({fileType: postImportFileType, data: "mock_base64_data"}), setImportDppsCodeSnippet);}}>
                        <SelectTrigger className="w-full sm:w-[150px] text-xs h-9"><SelectValue placeholder="Code Sample" /></SelectTrigger>
                        <SelectContent>{codeSampleLanguages.map(lang => <SelectItem key={`importDpps-${lang}`} value={lang}>{lang}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  {importDppsCodeSnippet && <div className="mt-2"><Label className="text-xs text-muted-foreground">Code Snippet ({importDppsSnippetLang}):</Label><pre className="mt-1 p-2 bg-muted rounded-md text-xs overflow-x-auto max-h-40"><code>{importDppsCodeSnippet}</code></pre></div>}
                  {postImportResponse && <div className="mt-4"><Label className="flex items-center"><FileJson className="mr-2 h-4 w-4 text-accent"/>Response:</Label><pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto max-h-60"><code>{postImportResponse}</code></pre></div>}
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
                   <div className="flex items-center justify-between flex-wrap gap-2">
                    <Button onClick={handleMockGetGraph} disabled={isGetGraphLoading} variant="secondary">
                        {isGetGraphLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        {isGetGraphLoading ? "Fetching Graph Data..." : "Send Request"}
                    </Button>
                    <Select value={getDppGraphSnippetLang} onValueChange={(value) => {setGetDppGraphSnippetLang(value); updateSnippet("getDppGraph", "GET", value, {productId: getGraphProductId}, null, setGetDppGraphCodeSnippet);}}>
                        <SelectTrigger className="w-full sm:w-[150px] text-xs h-9"><SelectValue placeholder="Code Sample" /></SelectTrigger>
                        <SelectContent>{codeSampleLanguages.map(lang => <SelectItem key={`getGraph-${lang}`} value={lang}>{lang}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  {getDppGraphCodeSnippet && <div className="mt-2"><Label className="text-xs text-muted-foreground">Code Snippet ({getDppGraphSnippetLang}):</Label><pre className="mt-1 p-2 bg-muted rounded-md text-xs overflow-x-auto max-h-40"><code>{getDppGraphCodeSnippet}</code></pre></div>}
                  {getGraphResponse && <div className="mt-4"><Label className="flex items-center"><FileJson className="mr-2 h-4 w-4 text-accent"/>Response:</Label><pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto max-h-60"><code>{getGraphResponse}</code></pre></div>}
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

        <TabsContent value="resources" className="mt-6 space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center"><FileCode className="mr-3 h-6 w-6 text-primary" /> SDKs (Conceptual)</CardTitle>
              <CardDescription>Language-specific Software Development Kits to accelerate your integration with the Norruva API.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {conceptualSdks.map(sdk => (
                <Card key={sdk.name} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-md font-medium flex items-center"><sdk.icon className="mr-2 h-5 w-5 text-accent"/>{sdk.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-xs text-muted-foreground h-10">{sdk.description}</p>
                    <Button variant="outline" size="sm" className="w-full group" asChild>
                      <a href={sdk.link} target="_blank" rel="noopener noreferrer" className={cn(sdk.soon && "opacity-60 cursor-not-allowed")}>
                        {sdk.soon ? "Coming Soon" : <>View on GitHub <ExternalLinkIcon className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" /></>}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center"><BookText className="mr-3 h-6 w-6 text-primary" /> Code Samples</CardTitle>
              <CardDescription>Practical examples to help you get started with common API operations.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockCodeSamples.map(sample => (
                 <Card key={sample.id} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-md font-medium flex items-center"><sample.icon className="mr-2 h-5 w-5 text-accent"/>{sample.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-xs text-muted-foreground h-12">{sample.description}</p>
                    <Button variant="link" size="sm" className="p-0 h-auto text-primary group" disabled>
                      {sample.linkText} <ExternalLinkIcon className="ml-1 h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center"><Wrench className="mr-3 h-6 w-6 text-primary" />Developer Tools</CardTitle>
              <CardDescription>Utilities to help you build and test your integrations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start text-left h-auto py-3 group hover:bg-accent/10" asChild>
                  <a href="/openapi.yaml" target="_blank" rel="noopener noreferrer">
                    <FileJson className="mr-2 h-5 w-5 text-primary group-hover:text-accent transition-colors"/>
                    <div>
                      <p className="font-medium group-hover:text-accent transition-colors">Download OpenAPI Spec</p>
                      <p className="text-xs text-muted-foreground">Get the v1 API specification.</p>
                    </div>
                  </a>
                </Button>
                <Button variant="outline" className="justify-start text-left h-auto py-3 group hover:bg-accent/10" disabled>
                   <ExternalLinkIcon className="mr-2 h-5 w-5 text-primary group-hover:text-accent transition-colors"/>
                   <div>
                      <p className="font-medium group-hover:text-accent transition-colors">View Postman Collection</p>
                      <p className="text-xs text-muted-foreground">Mocked for now.</p>
                    </div>
                </Button>
                <Button variant="outline" className="justify-start text-left h-auto py-3 group hover:bg-accent/10 opacity-70 col-span-1 sm:col-span-2" disabled>
                  <ZapIcon className="mr-2 h-5 w-5 text-primary group-hover:text-accent transition-colors"/>
                  <div>
                    <p className="font-medium group-hover:text-accent transition-colors">CLI Tool <Badge variant="outline" className="ml-auto text-xs">Coming Soon</Badge></p>
                    <p className="text-xs text-muted-foreground">Manage DPPs from your terminal.</p>
                  </div>
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

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center"><BookText className="mr-3 h-6 w-6 text-primary" /> Tutorials</CardTitle>
              <CardDescription>Step-by-step guides for common integration scenarios and use cases.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockTutorials.map(tutorial => (
                 <Card key={tutorial.id} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-md font-medium flex items-center"><tutorial.icon className="mr-2 h-5 w-5 text-accent"/>{tutorial.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-xs text-muted-foreground h-12">{tutorial.description}</p>
                    <Button variant="link" size="sm" className="p-0 h-auto text-primary group" disabled>
                      {tutorial.linkText} <ExternalLinkIcon className="ml-1 h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>


        <TabsContent value="settings_usage" className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="shadow-lg lg:col-span-2">
                <CardHeader>
                <CardTitle className="font-headline flex items-center"><BarChart2 className="mr-3 h-6 w-6 text-primary" /> API Usage & Reporting</CardTitle>
                <CardDescription>Monitor your API usage, view logs, and understand integration performance (Mock Data for <Badge variant="outline" className="capitalize">{currentEnvironment}</Badge> environment for <Badge variant="outline">{mockOrganizationName}</Badge>).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <Card className="bg-muted/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-md font-medium flex items-center"><FileClock className="mr-2 h-4 w-4 text-info"/>Recent API Calls</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{getUsageMetric('calls')}</p>
                                <p className="text-xs text-muted-foreground">in the last 24 hours</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-muted/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-md font-medium flex items-center"><ShieldAlert className="mr-2 h-4 w-4 text-destructive"/>Error Rate</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{getUsageMetric('errorRate')}</p>
                                <p className="text-xs text-muted-foreground">Average over the last 7 days</p>
                            </CardContent>
                        </Card>
                    </div>
                    <ul className="list-disc list-inside text-sm space-y-1">
                        <li><Link href="/developer/docs/rate-limiting" className="text-primary hover:underline">Understanding Rate Limits</Link></li>
                        <li><Link href="/developer/docs/error-codes" className="text-primary hover:underline">API Error Codes</Link></li>
                    </ul>
                    <Button asChild>
                       <Link href="/developer/reports/api-usage">
                        <BarChartBig className="mr-2 h-4 w-4"/> View API Usage Dashboard
                       </Link>
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">Note: Usage metrics are specific to '{mockOrganizationName}'. In a multi-tenant setup, admins would see aggregated views or switch tenant reports.</p>
                </CardContent>
            </Card>
            <div className="space-y-6 lg:col-span-1">
                <Card className="shadow-lg">
                    <CardHeader>
                    <CardTitle className="font-headline flex items-center"><Settings2 className="mr-3 h-6 w-6 text-primary" /> Advanced Organization Settings</CardTitle>
                    <CardDescription>Explore advanced capabilities and configurations for the <Badge variant="outline" className="capitalize">{currentEnvironment}</Badge> environment for <Badge variant="outline">{mockOrganizationName}</Badge>).</CardDescription>
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
                        <CardTitle className="font-headline flex items-center"><HelpCircle className="mr-3 h-6 w-6 text-primary" /> Support & Feedback</CardTitle>
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

