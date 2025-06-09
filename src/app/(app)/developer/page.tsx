
// --- File: page.tsx (Developer Portal) ---
// Description: Main page for the Developer Portal, providing access to API keys, documentation, and tools.
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
    KeyRound, BookOpen, Lightbulb, ShieldAlert, LifeBuoy, PlusCircle, Copy, Trash2, PlayCircle, Send, FileJson,
    Loader2, ServerIcon as ServerLucideIcon, BarChart2, FileClock, Edit2, Link as LinkIconPath,
    ExternalLink as ExternalLinkIcon, Search, Users, Activity, FileCog, Rocket, Settings2, PackageSearch, Layers,
    Lock, MessageSquare, Share2, BookText, TestTube2, Server as ServerIconShadcn, Webhook, Info, Clock,
    AlertTriangle as ErrorIcon, FileCode, LayoutGrid, Wrench, HelpCircle, Globe, BarChartBig, Megaphone,
    Zap as ZapIcon, ServerCrash, Laptop, DatabaseZap, CheckCircle, Building, FileText as FileTextIcon, History,
    UploadCloud, ShieldCheck, Cpu, HardDrive, Filter as FilterIcon, AlertTriangle, RefreshCw, Info as InfoIconLucide, Tags, FilePlus2
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import ApiKeysManager, { type ApiKey } from '@/components/developer/ApiKeysManager';
import WebhooksManager, { type WebhookEntry } from '@/components/developer/WebhooksManager';
import ApiPlaygroundEndpointCard from '@/components/developer/ApiPlaygroundEndpointCard';
import { cn } from '@/lib/utils';

// Import new dashboard section components
import ApiMetricsCard from '@/components/developer/dashboard/ApiMetricsCard';
import PlatformNewsCard from '@/components/developer/dashboard/PlatformNewsCard';
import ServiceStatusCard from '@/components/developer/dashboard/ServiceStatusCard';
import DataFlowKpisCard from '@/components/developer/dashboard/DataFlowKpisCard';
import QuickActionsCard from '@/components/developer/dashboard/QuickActionsCard';


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
  { id: "sample1", title: "Fetching a Product Passport (Python)", description: "A Python script demonstrating how to authenticate and retrieve a DPP using its ID.", linkText: "View on GitHub (Mock)", href: "#", icon: FileCode },
  { id: "sample2", title: "Creating a New DPP with Battery Data (Node.js)", description: "Node.js example for creating a new product passport, including specific fields for EU Battery Regulation.", linkText: "View Snippet (Mock)", href: "#", icon: FileCode },
  { id: "sample3", title: "Validating a QR Identifier (Java)", description: "Java code snippet for using the QR validation endpoint to get product summary information.", linkText: "View on GitHub (Mock)", href: "#", icon: FileCode },
];

const mockTutorials = [
  { id: "tut1", title: "Step-by-Step: Integrating DPP QR Scanning into a Retail App", description: "Learn how to use the Norruva API to allow consumers to scan QR codes and view product passports directly in your application.", linkText: "Read Tutorial", href: "/developer/tutorials/qr-scan-integration", icon: BookText },
  { id: "tut2", title: "Automating Updates with Webhooks", description: "A guide on setting up webhooks to receive real-time notifications for DPP status changes or new compliance requirements.", linkText: "Read Tutorial", href: "/developer/tutorials/webhooks-automation", icon: BookText },
  { id: "tut3", title: "Best Practices for Managing DPP Data via API", description: "Explore strategies for efficiently managing large volumes of product data, versioning DPPs, and ensuring data accuracy through API integrations.", linkText: "Read Tutorial", href: "/developer/tutorials/dpp-data-management-api", icon: BookText },
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

const dashboardQuickActions = [
  { label: "View My API Keys", href: "#", targetTab: "api_keys", icon: KeyRound },
  { label: "Explore API Reference", href: "/developer/docs/api-reference", icon: BookText },
  { label: "Manage Webhooks", href: "#", targetTab: "webhooks", icon: Webhook },
  { label: "Check API Status", href: "#", targetTab: "dashboard", icon: ServerCrash, tooltip: "View API Status on Dashboard" },
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
  const baseUrl = 'http://localhost:9002/api/v1'; // This should ideally come from an env var or config

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
    case "patchDppExtend": urlPath = `/dpp/extend/${params.productId || '{productId}'}`; break;
    case "deleteDpp": urlPath = `/dpp/${params.productId || '{productId}'}`; break;
    case "qrValidate": urlPath = "/qr/validate"; break;
    case "addLifecycleEvent": urlPath = `/dpp/${params.productId || '{productId}'}/lifecycle-events`; break;
    case "getComplianceSummary": urlPath = `/dpp/${params.productId || '{productId}'}/compliance-summary`; break;
    case "verifyDpp": urlPath = `/dpp/verify/${params.productIdPath || '{productId}'}`; break; 
    case "getDppHistory": urlPath = `/dpp/history/${params.productId || '{productId}'}`; break;
    case "importDpps": urlPath = "/dpp/import"; break;
    case "getDppGraph": urlPath = `/dpp/graph/${params.productId || '{productId}'}`; break;
    case "getDppStatus": urlPath = `/dpp/status/${params.productId || '{productId}'}`; break;
    default: urlPath = "/unknown-endpoint";
  }

  const fullUrl = `${baseUrl}${urlPath}`;
  const safeBody = body || '{}';

  if (language === "cURL") {
    let curlCmd = `curl -X ${method} \\\n  '${fullUrl}' \\\n  -H 'Authorization: Bearer ${apiKeyPlaceholder}'`;
    if ((method === "POST" || method === "PUT" || method === "PATCH") && body) {
      curlCmd += ` \\\n  -H 'Content-Type: application/json' \\\n  -d '${safeBody.replace(/'/g, "'\\''")}'`;
    }
    return curlCmd;
  } else if (language === "JavaScript") {
    let jsFetch = `fetch('${fullUrl}', {\n  method: '${method}',\n  headers: {\n    'Authorization': 'Bearer ${apiKeyPlaceholder}'`;
    if ((method === "POST" || method === "PUT" || method === "PATCH") && body) {
      jsFetch += `,\n    'Content-Type': 'application/json'`;
    }
    jsFetch += `\n  }`;
    if ((method === "POST" || method === "PUT" || method === "PATCH") && body) {
      jsFetch += `,\n  body: JSON.stringify(${safeBody})`;
    }
    jsFetch += `\n})\n.then(response => response.json())\n.then(data => console.log(data))\n.catch(error => console.error('Error:', error));`;
    return jsFetch;
  } else if (language === "Python") {
    let pyRequests = `import requests\nimport json\n\nurl = "${fullUrl}"\nheaders = {\n  "Authorization": "Bearer ${apiKeyPlaceholder}"`;
    if ((method === "POST" || method === "PUT" || method === "PATCH") && body) {
      pyRequests += `,\n  "Content-Type": "application/json"`;
    }
    pyRequests += `\n}`;
    if ((method === "POST" || method === "PUT" || method === "PATCH") && body) {
      pyRequests += `\npayload = json.dumps(${safeBody})`;
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
  const [lastStatusCheckTime, setLastStatusCheckTime] = useState<string | null>(null); 
  const [activeTopTab, setActiveTopTab] = useState("dashboard");

  useEffect(() => {
    // This effect runs only on the client side
    setLastStatusCheckTime(new Date().toLocaleTimeString());
  }, []);


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
    JSON.stringify({ eventType: "Shipped", location: "Warehouse B", details: { orderId: "SO12345" } }, null, 2)
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


  const [postVerifyProductIdPath, setPostVerifyProductIdPath] = useState<string>("DPP001"); 
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

  const [patchDppExtendProductId, setPatchDppExtendProductId] = useState<string>("DPP001");
  const [patchDppExtendBody, setPatchDppExtendBody] = useState<string>(
    JSON.stringify({ documentReference: { documentName: "Compliance Report 2024", documentUrl: "https://example.com/report.pdf", documentType: "Compliance Certificate" } }, null, 2)
  );
  const [patchDppExtendResponse, setPatchDppExtendResponse] = useState<string | null>(null);
  const [isPatchDppExtendLoading, setIsPatchDppExtendLoading] = useState(false);
  const [patchDppExtendSnippetLang, setPatchDppExtendSnippetLang] = useState("cURL");

  const [deleteProductId, setDeleteProductId] = useState<string>("DPP002");
  const [deleteProductResponse, setDeleteProductResponse] = useState<string | null>(null);
  const [isDeleteProductLoading, setIsDeleteProductLoading] = useState(false);
  const [deleteDppSnippetLang, setDeleteDppSnippetLang] = useState("cURL");

  const [mockDppGeneratorProductName, setMockDppGeneratorProductName] = useState("");
  const [mockDppGeneratorCategory, setMockDppGeneratorCategory] = useState("");
  const [mockDppGeneratorGtin, setMockDppGeneratorGtin] = useState(""); 
  const [generatedMockDppJson, setGeneratedMockDppJson] = useState<string | null>(null);
  const [isGeneratingMockDpp, setIsGeneratingMockDpp] = useState(false);

  const [getHistoryProductId, setGetHistoryProductId] = useState<string>("DPP001");
  const [getHistoryResponse, setGetHistoryResponse] = useState<string | null>(null);
  const [isGetHistoryLoading, setIsGetHistoryLoading] = useState(false);
  const [getDppHistorySnippetLang, setGetDppHistorySnippetLang] = useState("cURL");

  const [postImportFileType, setPostImportFileType] = useState<string>("csv");
  const [postImportSourceDescription, setPostImportSourceDescription] = useState<string>("");
  const [postImportResponse, setPostImportResponse] = useState<string | null>(null);
  const [isPostImportLoading, setIsPostImportLoading] = useState(false);
  const [importDppsSnippetLang, setImportDppsSnippetLang] = useState("cURL");

  const [getGraphProductId, setGetGraphProductId] = useState<string>("DPP001");
  const [getGraphResponse, setGetGraphResponse] = useState<string | null>(null);
  const [isGetGraphLoading, setIsGetGraphLoading] = useState(false);
  const [getDppGraphSnippetLang, setGetDppGraphSnippetLang] = useState("cURL");

  const [getStatusProductId, setGetStatusProductId] = useState<string>("DPP001");
  const [getStatusResponse, setGetStatusResponse] = useState<string | null>(null);
  const [isGetStatusLoading, setIsGetStatusLoading] = useState(false);
  const [getStatusSnippetLang, setGetStatusSnippetLang] = useState("cURL");


  const [getProductCodeSnippet, setGetProductCodeSnippet] = useState("");
  const [listDppsCodeSnippet, setListDppsCodeSnippet] = useState("");
  const [createDppCodeSnippet, setCreateDppCodeSnippet] = useState("");
  const [updateDppCodeSnippet, setUpdateDppCodeSnippet] = useState("");
  const [patchDppExtendCodeSnippet, setPatchDppExtendCodeSnippet] = useState("");
  const [deleteDppCodeSnippet, setDeleteDppCodeSnippet] = useState("");
  const [qrValidateCodeSnippet, setQrValidateCodeSnippet] = useState("");
  const [addLifecycleEventCodeSnippet, setAddLifecycleEventCodeSnippet] = useState("");
  const [getComplianceSummaryCodeSnippet, setGetComplianceSummaryCodeSnippet] = useState("");
  const [verifyDppCodeSnippet, setVerifyDppCodeSnippet] = useState("");
  const [getDppHistoryCodeSnippet, setGetDppHistoryCodeSnippet] = useState("");
  const [importDppsCodeSnippet, setImportDppsCodeSnippet] = useState("");
  const [getDppGraphCodeSnippet, setGetDppGraphCodeSnippet] = useState("");
  const [getStatusCodeSnippet, setGetStatusCodeSnippet] = useState("");


  const updateSnippet = useCallback((
    endpointKey: string,
    method: string,
    lang: string,
    params: any,
    body: string | null,
    setSnippetFn: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const snippet = generateMockCodeSnippet(endpointKey, method, lang, params, body, currentEnvironment);
    setSnippetFn(snippet);
  }, [currentEnvironment]);


  useEffect(() => updateSnippet("getProduct", "GET", getProductSnippetLang, { productId: getProductId }, null, setGetProductCodeSnippet), [getProductId, getProductSnippetLang, updateSnippet]);
  useEffect(() => updateSnippet("listDpps", "GET", listDppsSnippetLang, listDppFilters, null, setListDppsCodeSnippet), [listDppFilters, listDppsSnippetLang, updateSnippet]);
  useEffect(() => updateSnippet("createDpp", "POST", createDppSnippetLang, {}, postDppBody, setCreateDppCodeSnippet), [postDppBody, createDppSnippetLang, updateSnippet]);
  useEffect(() => updateSnippet("updateDpp", "PUT", updateDppSnippetLang, { productId: putProductId }, putProductBody, setUpdateDppCodeSnippet), [putProductId, putProductBody, updateDppSnippetLang, updateSnippet]);
  useEffect(() => updateSnippet("patchDppExtend", "PATCH", patchDppExtendSnippetLang, { productId: patchDppExtendProductId }, patchDppExtendBody, setPatchDppExtendCodeSnippet), [patchDppExtendProductId, patchDppExtendBody, patchDppExtendSnippetLang, updateSnippet]);
  useEffect(() => updateSnippet("deleteDpp", "DELETE", deleteDppSnippetLang, { productId: deleteProductId }, null, setDeleteDppCodeSnippet), [deleteProductId, deleteDppSnippetLang, updateSnippet]);
  useEffect(() => updateSnippet("qrValidate", "POST", qrValidateSnippetLang, {}, postQrValidateBody, setQrValidateCodeSnippet), [postQrValidateBody, qrValidateSnippetLang, updateSnippet]);
  useEffect(() => updateSnippet("addLifecycleEvent", "POST", addLifecycleEventSnippetLang, { productId: postLifecycleEventProductId }, postLifecycleEventBody, setAddLifecycleEventCodeSnippet), [postLifecycleEventProductId, postLifecycleEventBody, addLifecycleEventSnippetLang, updateSnippet]);
  useEffect(() => updateSnippet("getComplianceSummary", "GET", getComplianceSummarySnippetLang, { productId: getComplianceProductId }, null, setGetComplianceSummaryCodeSnippet), [getComplianceProductId, getComplianceSummarySnippetLang, updateSnippet]);
  useEffect(() => updateSnippet("verifyDpp", "POST", verifyDppSnippetLang, { productIdPath: postVerifyProductIdPath }, null, setVerifyDppCodeSnippet), [postVerifyProductIdPath, verifyDppSnippetLang, updateSnippet]); 
  useEffect(() => updateSnippet("getDppHistory", "GET", getDppHistorySnippetLang, { productId: getHistoryProductId }, null, setGetDppHistoryCodeSnippet), [getHistoryProductId, getDppHistorySnippetLang, updateSnippet]);
  useEffect(() => updateSnippet("importDpps", "POST", importDppsSnippetLang, { fileType: postImportFileType, sourceDescription: postImportSourceDescription }, JSON.stringify({ fileType: postImportFileType, data: "mock_base64_data", sourceDescription: postImportSourceDescription }), setImportDppsCodeSnippet), [postImportFileType, postImportSourceDescription, importDppsSnippetLang, updateSnippet]);
  useEffect(() => updateSnippet("getDppGraph", "GET", getDppGraphSnippetLang, { productId: getGraphProductId }, null, setGetDppGraphCodeSnippet), [getGraphProductId, getDppGraphSnippetLang, updateSnippet]);
  useEffect(() => updateSnippet("getDppStatus", "GET", getStatusSnippetLang, { productId: getStatusProductId }, null, setGetStatusCodeSnippet), [getStatusProductId, getStatusSnippetLang, updateSnippet]);


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
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    body: any | null,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setResponse: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    setLoading(true);
    setResponse(null);
    toast({ title: "Sending Mock API Request...", description: `${method} ${url}` });
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_${currentEnvironment.toUpperCase()}_API_KEY`
        }
      };
      if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = typeof body === 'string' ? body : JSON.stringify(body);
      }

      await new Promise(resolve => setTimeout(resolve, 500)); 

      const res = await fetch(url, options);
      const responseData = await res.json();

      if (!res.ok) {
        setResponse(JSON.stringify({ status: res.status, error: responseData }, null, 2));
        toast({ title: `Mock API Error: ${res.status}`, description: responseData.error?.message || 'A mock API error occurred.', variant: "destructive" });
      } else {
        setResponse(JSON.stringify(responseData, null, 2));
        toast({ title: "Mock API Response Received", description: `${method} request to ${url} was successful (simulated).`, variant: "default"});
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      setResponse(JSON.stringify({ error: "Network or parsing error during mock call", details: errorMsg }, null, 2));
      toast({ title: "Mock Request Failed", description: errorMsg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleMockGetProductDetails = () => { updateSnippet("getProduct", "GET", getProductSnippetLang, { productId: getProductId }, null, setGetProductCodeSnippet); makeApiCall(`/api/v1/dpp/${getProductId}`, 'GET', null, setIsGetProductLoading, setGetProductResponse); }
  const handleMockListProducts = () => { const queryParams = new URLSearchParams(); if (listDppFilters.status !== 'all') queryParams.append('status', listDppFilters.status); if (listDppFilters.category !== 'all') queryParams.append('category', listDppFilters.category); if (listDppFilters.searchQuery) queryParams.append('searchQuery', listDppFilters.searchQuery); if (listDppFilters.blockchainAnchored !== 'all') queryParams.append('blockchainAnchored', listDppFilters.blockchainAnchored); const url = `/api/v1/dpp?${queryParams.toString()}`; updateSnippet("listDpps", "GET", listDppsSnippetLang, listDppFilters, null, setListDppsCodeSnippet); makeApiCall(url, 'GET', null, setIsListProductsLoading, setListProductsResponse); };
  const handleMockPostDpp = () => { updateSnippet("createDpp", "POST", createDppSnippetLang, {}, postDppBody, setCreateDppCodeSnippet); makeApiCall('/api/v1/dpp', 'POST', postDppBody, setIsPostDppLoading, setPostDppResponse); }
  const handleMockPutProduct = () => { updateSnippet("updateDpp", "PUT", updateDppSnippetLang, { productId: putProductId }, putProductBody, setUpdateDppCodeSnippet); makeApiCall(`/api/v1/dpp/${putProductId}`, 'PUT', putProductBody, setIsPutProductLoading, setPutProductResponse); }
  const handleMockPatchDppExtend = () => { updateSnippet("patchDppExtend", "PATCH", patchDppExtendSnippetLang, { productId: patchDppExtendProductId }, patchDppExtendBody, setPatchDppExtendCodeSnippet); makeApiCall(`/api/v1/dpp/extend/${patchDppExtendProductId}`, 'PATCH', patchDppExtendBody, setIsPatchDppExtendLoading, setPatchDppExtendResponse); }
  const handleMockDeleteProduct = () => { updateSnippet("deleteDpp", "DELETE", deleteDppSnippetLang, { productId: deleteProductId }, null, setDeleteDppCodeSnippet); makeApiCall(`/api/v1/dpp/${deleteProductId}`, 'DELETE', null, setIsDeleteProductLoading, setDeleteProductResponse); }
  const handleMockPostLifecycleEvent = () => { updateSnippet("addLifecycleEvent", "POST", addLifecycleEventSnippetLang, { productId: postLifecycleEventProductId }, postLifecycleEventBody, setAddLifecycleEventCodeSnippet); makeApiCall(`/api/v1/dpp/${postLifecycleEventProductId}/lifecycle-events`, 'POST', postLifecycleEventBody, setIsPostLifecycleEventLoading, setPostLifecycleEventResponse); }
  const handleMockGetComplianceSummary = () => { updateSnippet("getComplianceSummary", "GET", getComplianceSummarySnippetLang, { productId: getComplianceProductId }, null, setGetComplianceSummaryCodeSnippet); makeApiCall(`/api/v1/dpp/${getComplianceProductId}/compliance-summary`, 'GET', null, setIsGetComplianceLoading, setGetComplianceResponse); }
  const handleMockPostQrValidate = () => { updateSnippet("qrValidate", "POST", qrValidateSnippetLang, {}, postQrValidateBody, setQrValidateCodeSnippet); makeApiCall('/api/v1/qr/validate', 'POST', postQrValidateBody, setIsPostQrValidateLoading, setPostQrValidateResponse); }
  const handleMockPostVerify = () => { updateSnippet("verifyDpp", "POST", verifyDppSnippetLang, { productIdPath: postVerifyProductIdPath }, null, setVerifyDppCodeSnippet); makeApiCall(`/api/v1/dpp/verify/${postVerifyProductIdPath}`, 'POST', null, setIsPostVerifyLoading, setPostVerifyResponse); }
  const handleMockGetHistory = () => { updateSnippet("getDppHistory", "GET", getDppHistorySnippetLang, { productId: getHistoryProductId }, null, setGetDppHistoryCodeSnippet); makeApiCall(`/api/v1/dpp/history/${getHistoryProductId}`, 'GET', null, setIsGetHistoryLoading, setGetHistoryResponse); }
  const handleMockPostImport = () => { const body = { fileType: postImportFileType, data: "mock_file_content_base64_encoded", sourceDescription: postImportSourceDescription }; updateSnippet("importDpps", "POST", importDppsSnippetLang, body, JSON.stringify(body), setImportDppsCodeSnippet); makeApiCall('/api/v1/dpp/import', 'POST', body, setIsPostImportLoading, setPostImportResponse); }
  const handleMockGetGraph = () => { updateSnippet("getDppGraph", "GET", getDppGraphSnippetLang, { productId: getGraphProductId }, null, setGetDppGraphCodeSnippet); makeApiCall(`/api/v1/dpp/graph/${getGraphProductId}`, 'GET', null, setIsGetGraphLoading, setGetGraphResponse); }
  const handleMockGetStatus = () => { updateSnippet("getDppStatus", "GET", getStatusSnippetLang, { productId: getStatusProductId }, null, setGetStatusCodeSnippet); makeApiCall(`/api/v1/dpp/status/${getStatusProductId}`, 'GET', null, setIsGetStatusLoading, setGetStatusResponse); }


  const handleGenerateMockDpp = async () => {
    setIsGeneratingMockDpp(true);
    setGeneratedMockDppJson(null);
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const randomDigits = (n: number) => Math.random().toString().slice(2, 2 + n);
    const gtinValue = mockDppGeneratorGtin || `0${randomDigits(12)}`;
    const modelNumValue = `MOCK-MODEL-${randomDigits(4)}`;

    const mockDpp = {
      id: `MOCK_DPP_${Date.now().toString().slice(-5)}`,
      productName: mockDppGeneratorProductName || "Mock Product Alpha",
      category: mockDppGeneratorCategory || "Electronics",
      gtin: gtinValue,
      modelNumber: modelNumValue,
      manufacturer: { name: "MockGen Inc." },
      metadata: {
        created_at: new Date().toISOString(),
        last_updated: new Date().toISOString(),
        status: "draft",
        dppStandardVersion: "CIRPASS v1.0 Draft",
      },
      productDetails: {
        description: `This is a mock Digital Product Passport for ${mockDppGeneratorProductName || "Mock Product Alpha"}, a ${mockDppGeneratorCategory || "generic electronic device"}. GTIN: ${gtinValue}. Model: ${modelNumValue}. Generated for testing and demonstration purposes.`,
        materials: [{ name: "Recycled ABS Plastic", percentage: 60, isRecycled: true }, { name: "Aluminum Alloy", percentage: 30 }, {name: "Glass", percentage: 10}],
        specifications: JSON.stringify({
          "Color": "Space Gray",
          "Dimensions (mm)": "150 x 75 x 8",
          "Weight (g)": 180,
          "Connectivity": ["Bluetooth 5.2", "Wi-Fi 6", "NFC"],
          "Power Source": "Rechargeable Li-Po Battery"
        }, null, 2),
        customAttributes: [
          { key: "Warranty", value: "2 Years International" },
          { key: "Launch Date", value: `2024-Q${Math.floor(Math.random()*4)+1}` },
          { key: "Eco-Certified", value: (Math.random() > 0.5).toString() }
        ],
        imageUrl: `https://placehold.co/600x400.png?text=${encodeURIComponent((mockDppGeneratorProductName || "Mock Product").substring(0,15))}`
      },
      compliance: {
        eprel: { status: 'N/A', lastChecked: new Date().toISOString() },
        battery_regulation: { status: 'not_applicable' }
      },
      ebsiVerification: { status: 'pending_verification', lastChecked: new Date().toISOString() },
      consumerScans: Math.floor(Math.random() * 100),
    };
    setGeneratedMockDppJson(JSON.stringify(mockDpp, null, 2));
    toast({ title: "Mock DPP Generated", description: "A sample DPP JSON has been displayed with more details." });
    setIsGeneratingMockDpp(false);
  };


  const codeSampleLanguages = ["cURL", "JavaScript", "Python"];
  const conceptualSdks = [
      { name: "JavaScript SDK", href: "/developer/sdks/javascript", soon: false, icon: FileCode, description: "Client library for Node.js and browser environments." },
      { name: "Python SDK", href: "#", soon: true, icon: FileCode, description: "Integrate Norruva APIs with your Python applications." },
      { name: "Java SDK", href: "#", soon: true, icon: FileCode, description: "SDK for Java-based enterprise systems." },
      { name: "Go SDK", href: "#", soon: true, icon: FileCode, description: "Efficient Go library for backend integrations." },
      { name: "C# SDK", href: "#", soon: true, icon: FileCode, description: "SDK for .NET applications." },
  ];

  const getUsageMetric = useCallback((metricType: 'calls' | 'errorRate') => {
    if (currentEnvironment === 'sandbox') {
        return metricType === 'calls' ? '1,234' : '0.2%';
    }
    return metricType === 'calls' ? '105,678' : '0.05%';
  }, [currentEnvironment]);

  const overallSystemStatus = useMemo(() => {
    const nonOperationalServices = systemStatusData.filter(s => s.status !== "Operational");
    if (nonOperationalServices.length === 0) {
      return { text: "All Systems Operational", icon: CheckCircle, color: "text-green-500" };
    }
    if (nonOperationalServices.some(s => s.status === "Degraded Performance" || s.status === "Under Maintenance")) {
      return { text: "Some Systems Impacted", icon: AlertTriangle, color: "text-yellow-500" };
    }
    return { text: "Multiple Issues Detected", icon: ServerCrash, color: "text-red-500" };
  }, []);

  const handleRefreshStatus = () => {
    if (typeof window !== 'undefined') {
      setLastStatusCheckTime(new Date().toLocaleTimeString());
    }
    toast({title: "System Status Refreshed", description: "Mock status data re-evaluated."});
  };

  const handleDashboardQuickActionTabChange = (tabValue: string) => {
    const tabsElement = document.getElementById('developer-portal-tabs');
    if (tabsElement) {
        const trigger = tabsElement.querySelector(`button[role="tab"][value="${tabValue}"]`) as HTMLElement | null;
        trigger?.click();
    }
    setActiveTopTab(tabValue); 
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
            disabled
        />
      </div>


      <Tabs defaultValue="dashboard" className="w-full" id="developer-portal-tabs" value={activeTopTab} onValueChange={setActiveTopTab}>
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
             <ApiMetricsCard
                currentEnvironment={currentEnvironment}
                getUsageMetric={getUsageMetric}
                overallApiStatus={overallSystemStatus}
                onViewFullReportClick={() => handleDashboardQuickActionTabChange("settings_usage")}
              />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <PlatformNewsCard announcements={platformAnnouncements} />
              <ServiceStatusCard
                systemStatusData={systemStatusData}
                overallSystemStatus={overallSystemStatus}
                lastStatusCheckTime={lastStatusCheckTime || "Loading..."}
                onRefreshStatus={handleRefreshStatus}
              />
            </div>
            <DataFlowKpisCard kpis={DataFlowKPIs} />
            <QuickActionsCard actions={dashboardQuickActions} onTabChange={handleDashboardQuickActionTabChange} />
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
          <Alert variant="default" className="bg-info/10 border-info/50 text-info-foreground">
            <InfoIconLucide className="h-5 w-5 text-info" />
            <AlertTitle className="font-semibold text-info">Mock API Environment</AlertTitle>
            <AlertDescription>
              This playground interacts with a <strong>mock API backend</strong>. Responses are simulated based on predefined data (like MOCK_DPPS) and conceptual API logic.
              This is for testing and exploration in the <Badge variant="outline" className="capitalize">{currentEnvironment}</Badge> environment.
            </AlertDescription>
          </Alert>
          <Card className="shadow-xl border-primary/20">
            <CardHeader>
            <CardTitle className="font-headline flex items-center"><PlayCircle className="mr-3 h-6 w-6 text-primary" /> Full Interactive API Playground</CardTitle>
            <CardDescription>Experiment with Norruva API endpoints in this interactive sandbox. This environment uses mock data and simulated responses for the <Badge variant="outline" className="capitalize">{currentEnvironment}</Badge> environment.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" defaultValue={['dpp-core']} className="w-full space-y-6">
                <AccordionItem value="dpp-core">
                  <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">DPP Core Management Endpoints</AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-6">
                    <ApiPlaygroundEndpointCard
                      title="GET /api/v1/dpp/{productId}"
                      description="Retrieve details for a specific product by its ID."
                      onSendRequest={handleMockGetProductDetails}
                      isLoading={isGetProductLoading}
                      response={getProductResponse}
                      codeSnippet={getProductCodeSnippet}
                      snippetLanguage={getProductSnippetLang}
                      onSnippetLanguageChange={(lang) => {setGetProductSnippetLang(lang); updateSnippet("getProduct", "GET", lang, { productId: getProductId }, null, setGetProductCodeSnippet);}}
                      codeSampleLanguages={codeSampleLanguages}
                    >
                      <div>
                        <Label htmlFor="productIdInput-get">Product ID (Path Parameter)</Label>
                        <Input id="productIdInput-get" value={getProductId} onChange={(e) => setGetProductId(e.target.value)} placeholder="e.g., DPP001" />
                      </div>
                    </ApiPlaygroundEndpointCard>

                    <ApiPlaygroundEndpointCard
                      title="GET /api/v1/dpp"
                      description="Retrieve a list of available Digital Product Passports with filtering."
                      onSendRequest={handleMockListProducts}
                      isLoading={isListProductsLoading}
                      response={listProductsResponse}
                      codeSnippet={listDppsCodeSnippet}
                      snippetLanguage={listDppsSnippetLang}
                      onSnippetLanguageChange={(lang) => {setListDppsSnippetLang(lang); updateSnippet("listDpps", "GET", lang, listDppFilters, null, setListDppsCodeSnippet);}}
                      codeSampleLanguages={codeSampleLanguages}
                    >
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
                              {['all', 'draft', 'published', 'archived', 'pending_review', 'revoked', 'flagged'].map(s => <SelectItem key={`listStatus-${s}`} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ')}</SelectItem>)}
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
                    </ApiPlaygroundEndpointCard>

                    <ApiPlaygroundEndpointCard
                      title="POST /api/v1/dpp"
                      description="Create a new Digital Product Passport."
                      onSendRequest={handleMockPostDpp}
                      isLoading={isPostDppLoading}
                      response={postDppResponse}
                      codeSnippet={createDppCodeSnippet}
                      snippetLanguage={createDppSnippetLang}
                      onSnippetLanguageChange={(lang) => {setCreateDppSnippetLang(lang); updateSnippet("createDpp", "POST", lang, {}, postDppBody, setCreateDppCodeSnippet);}}
                      codeSampleLanguages={codeSampleLanguages}
                    >
                      <div>
                        <Label htmlFor="postDppBody">Request Body (JSON)</Label>
                        <Textarea id="postDppBody" value={postDppBody} onChange={(e) => setPostDppBody(e.target.value)} rows={5} className="font-mono text-xs"/>
                        <p className="text-xs text-muted-foreground mt-1">Example required fields: productName, category. See API Reference for full schema.</p>
                      </div>
                    </ApiPlaygroundEndpointCard>

                    <ApiPlaygroundEndpointCard
                        title="PUT /api/v1/dpp/{productId}"
                        description="Update an existing Digital Product Passport."
                        onSendRequest={handleMockPutProduct}
                        isLoading={isPutProductLoading}
                        response={putProductResponse}
                        codeSnippet={updateDppCodeSnippet}
                        snippetLanguage={updateDppSnippetLang}
                        onSnippetLanguageChange={(lang) => {setUpdateDppSnippetLang(lang); updateSnippet("updateDpp", "PUT", lang, {productId: putProductId}, putProductBody, setUpdateDppCodeSnippet);}}
                        codeSampleLanguages={codeSampleLanguages}
                    >
                        <div>
                            <Label htmlFor="productIdInput-put">Product ID (Path Parameter)</Label>
                            <Input id="productIdInput-put" value={putProductId} onChange={(e) => setPutProductId(e.target.value)} placeholder="e.g., DPP001"/>
                        </div>
                        <div className="mt-2">
                            <Label htmlFor="putProductBody">Request Body (JSON)</Label>
                            <Textarea id="putProductBody" value={putProductBody} onChange={(e) => setPutProductBody(e.target.value)} rows={4} className="font-mono text-xs"/>
                            <p className="text-xs text-muted-foreground mt-1">Send partial or full updates. See API Reference for updatable fields.</p>
                        </div>
                    </ApiPlaygroundEndpointCard>

                    <ApiPlaygroundEndpointCard
                        title="PATCH /api/v1/dpp/extend/{productId}"
                        description="Extend a DPP by adding document references or other modular data."
                        onSendRequest={handleMockPatchDppExtend}
                        isLoading={isPatchDppExtendLoading}
                        response={patchDppExtendResponse}
                        codeSnippet={patchDppExtendCodeSnippet}
                        snippetLanguage={patchDppExtendSnippetLang}
                        onSnippetLanguageChange={(lang) => {setPatchDppExtendSnippetLang(lang); updateSnippet("patchDppExtend", "PATCH", lang, {productId: patchDppExtendProductId}, patchDppExtendBody, setPatchDppExtendCodeSnippet);}}
                        codeSampleLanguages={codeSampleLanguages}
                    >
                        <div>
                            <Label htmlFor="productIdInput-patch">Product ID (Path Parameter)</Label>
                            <Input id="productIdInput-patch" value={patchDppExtendProductId} onChange={(e) => setPatchDppExtendProductId(e.target.value)} placeholder="e.g., DPP001"/>
                        </div>
                        <div className="mt-2">
                            <Label htmlFor="patchDppExtendBody">Request Body (JSON)</Label>
                            <Textarea id="patchDppExtendBody" value={patchDppExtendBody} onChange={(e) => setPatchDppExtendBody(e.target.value)} rows={4} className="font-mono text-xs"/>
                            <p className="text-xs text-muted-foreground mt-1">Example: Add a document reference. See API Reference.</p>
                        </div>
                    </ApiPlaygroundEndpointCard>

                    <ApiPlaygroundEndpointCard
                        title="DELETE /api/v1/dpp/{productId}"
                        description="Archive a Digital Product Passport."
                        onSendRequest={handleMockDeleteProduct}
                        isLoading={isDeleteProductLoading}
                        response={deleteProductResponse}
                        codeSnippet={deleteDppCodeSnippet}
                        snippetLanguage={deleteDppSnippetLang}
                        onSnippetLanguageChange={(lang) => {setDeleteDppSnippetLang(lang); updateSnippet("deleteDpp", "DELETE", lang, {productId: deleteProductId}, null, setDeleteDppCodeSnippet);}}
                        codeSampleLanguages={codeSampleLanguages}
                    >
                        <div>
                            <Label htmlFor="productIdInput-delete">Product ID (Path Parameter)</Label>
                            <Input id="productIdInput-delete" value={deleteProductId} onChange={(e) => setDeleteProductId(e.target.value)} placeholder="e.g., PROD002"/>
                        </div>
                    </ApiPlaygroundEndpointCard>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="dpp-utility">
                  <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">DPP Utility & Advanced Endpoints</AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-6">
                    <ApiPlaygroundEndpointCard
                        title="GET /api/v1/dpp/status/{productId}"
                        description="Retrieve the current status of a specific DPP."
                        onSendRequest={handleMockGetStatus}
                        isLoading={isGetStatusLoading}
                        response={getStatusResponse}
                        codeSnippet={getStatusCodeSnippet}
                        snippetLanguage={getStatusSnippetLang}
                        onSnippetLanguageChange={(lang) => {setGetStatusSnippetLang(lang); updateSnippet("getDppStatus", "GET", lang, { productId: getStatusProductId }, null, setGetStatusCodeSnippet);}}
                        codeSampleLanguages={codeSampleLanguages}
                    >
                        <div>
                            <Label htmlFor="productIdInput-get-status">Product ID (Path Parameter)</Label>
                            <Input id="productIdInput-get-status" value={getStatusProductId} onChange={(e) => setGetStatusProductId(e.target.value)} placeholder="e.g., DPP001" />
                        </div>
                    </ApiPlaygroundEndpointCard>
                    
                    <ApiPlaygroundEndpointCard
                        title="POST /api/v1/qr/validate"
                        description="Validate a QR identifier and retrieve a DPP summary."
                        onSendRequest={handleMockPostQrValidate}
                        isLoading={isPostQrValidateLoading}
                        response={postQrValidateResponse}
                        codeSnippet={qrValidateCodeSnippet}
                        snippetLanguage={qrValidateSnippetLang}
                        onSnippetLanguageChange={(lang) => {setQrValidateSnippetLang(lang); updateSnippet("qrValidate", "POST", lang, {}, postQrValidateBody, setQrValidateCodeSnippet);}}
                        codeSampleLanguages={codeSampleLanguages}
                    >
                        <div>
                            <Label htmlFor="postQrValidateBody">Request Body (JSON)</Label>
                            <Textarea id="postQrValidateBody" value={postQrValidateBody} onChange={(e) => setPostQrValidateBody(e.target.value)} rows={3} className="font-mono text-xs"/>
                        </div>
                    </ApiPlaygroundEndpointCard>

                    <ApiPlaygroundEndpointCard
                        title="POST /api/v1/dpp/{productId}/lifecycle-events"
                        description="Add a new lifecycle event to a specific DPP."
                        onSendRequest={handleMockPostLifecycleEvent}
                        isLoading={isPostLifecycleEventLoading}
                        response={postLifecycleEventResponse}
                        codeSnippet={addLifecycleEventCodeSnippet}
                        snippetLanguage={addLifecycleEventSnippetLang}
                        onSnippetLanguageChange={(lang) => {setAddLifecycleEventSnippetLang(lang); updateSnippet("addLifecycleEvent", "POST", lang, {productId: postLifecycleEventProductId}, postLifecycleEventBody, setAddLifecycleEventCodeSnippet);}}
                        codeSampleLanguages={codeSampleLanguages}
                    >
                        <div>
                            <Label htmlFor="productIdInput-post-event">Product ID (Path Parameter)</Label>
                            <Input id="productIdInput-post-event" value={postLifecycleEventProductId} onChange={(e) => setPostLifecycleEventProductId(e.target.value)} placeholder="e.g., DPP001"/>
                        </div>
                        <div className="mt-2">
                            <Label htmlFor="postLifecycleEventBody">Request Body (JSON)</Label>
                            <Textarea id="postLifecycleEventBody" value={postLifecycleEventBody} onChange={(e) => setPostLifecycleEventBody(e.target.value)} rows={5} className="font-mono text-xs"/>
                        </div>
                    </ApiPlaygroundEndpointCard>

                    <ApiPlaygroundEndpointCard
                        title="GET /api/v1/dpp/{productId}/compliance-summary"
                        description="Retrieve a compliance summary for a specific product."
                        onSendRequest={handleMockGetComplianceSummary}
                        isLoading={isGetComplianceLoading}
                        response={getComplianceResponse}
                        codeSnippet={getComplianceSummaryCodeSnippet}
                        snippetLanguage={getComplianceSummarySnippetLang}
                        onSnippetLanguageChange={(lang) => {setGetComplianceSummarySnippetLang(lang); updateSnippet("getComplianceSummary", "GET", lang, {productId: getComplianceProductId}, null, setGetComplianceSummaryCodeSnippet);}}
                        codeSampleLanguages={codeSampleLanguages}
                    >
                        <div>
                            <Label htmlFor="productIdInput-get-compliance">Product ID (Path Parameter)</Label>
                            <Input id="productIdInput-get-compliance" value={getComplianceProductId} onChange={(e) => setGetComplianceProductId(e.target.value)} placeholder="e.g., DPP001" />
                        </div>
                    </ApiPlaygroundEndpointCard>

                    <ApiPlaygroundEndpointCard
                        title="POST /api/v1/dpp/verify/{productId}"
                        description="Perform compliance and authenticity checks on a DPP."
                        onSendRequest={handleMockPostVerify}
                        isLoading={isPostVerifyLoading}
                        response={postVerifyResponse}
                        codeSnippet={verifyDppCodeSnippet}
                        snippetLanguage={verifyDppSnippetLang}
                        onSnippetLanguageChange={(lang) => {setVerifyDppSnippetLang(lang); updateSnippet("verifyDpp", "POST", lang, {productIdPath: postVerifyProductIdPath}, null, setVerifyDppCodeSnippet);}}
                        codeSampleLanguages={codeSampleLanguages}
                    >
                        <div>
                            <Label htmlFor="productIdInput-verify-path">Product ID (Path Parameter)</Label>
                            <Input id="productIdInput-verify-path" value={postVerifyProductIdPath} onChange={(e) => setPostVerifyProductIdPath(e.target.value)} placeholder="e.g., DPP001"/>
                            <p className="text-xs text-muted-foreground mt-1">No request body needed for this mock endpoint.</p>
                        </div>
                    </ApiPlaygroundEndpointCard>

                    <ApiPlaygroundEndpointCard
                      title="GET /api/v1/dpp/history/{productId}"
                      description="Retrieve the audit trail / history for a specific DPP."
                      onSendRequest={handleMockGetHistory}
                      isLoading={isGetHistoryLoading}
                      response={getHistoryResponse}
                      codeSnippet={getDppHistoryCodeSnippet}
                      snippetLanguage={getDppHistorySnippetLang}
                      onSnippetLanguageChange={(lang) => {setGetDppHistorySnippetLang(lang); updateSnippet("getDppHistory", "GET", lang, {productId: getHistoryProductId}, null, setGetDppHistoryCodeSnippet);}}
                      codeSampleLanguages={codeSampleLanguages}
                    >
                      <div>
                        <Label htmlFor="historyProductIdInput">Product ID (Path Parameter)</Label>
                        <Input id="historyProductIdInput" value={getHistoryProductId} onChange={(e) => setGetHistoryProductId(e.target.value)} placeholder="e.g., DPP001" />
                      </div>
                    </ApiPlaygroundEndpointCard>

                    <ApiPlaygroundEndpointCard
                        title="POST /api/v1/dpp/import"
                        description="Batch import Digital Product Passports (CSV, JSON, etc.)."
                        onSendRequest={handleMockPostImport}
                        isLoading={isPostImportLoading}
                        response={postImportResponse}
                        codeSnippet={importDppsCodeSnippet}
                        snippetLanguage={importDppsSnippetLang}
                        onSnippetLanguageChange={(lang) => {setImportDppsSnippetLang(lang); updateSnippet("importDpps", "POST", lang, {fileType: postImportFileType, sourceDescription: postImportSourceDescription}, JSON.stringify({fileType: postImportFileType, data: "mock_base64_data", sourceDescription: postImportSourceDescription}), setImportDppsCodeSnippet);}}
                        codeSampleLanguages={codeSampleLanguages}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="importFileType">File Type</Label>
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
                             <div>
                              <Label htmlFor="importSourceDescription">Source Description (Optional)</Label>
                              <Input id="importSourceDescription" value={postImportSourceDescription} onChange={(e) => setPostImportSourceDescription(e.target.value)} placeholder="e.g., Q3 Supplier Data Upload"/>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">For this mock, 'data' field is simulated. See API Reference.</p>
                    </ApiPlaygroundEndpointCard>

                    <ApiPlaygroundEndpointCard
                        title="GET /api/v1/dpp/graph/{productId}"
                        description="Retrieve data for supply chain visualization."
                        onSendRequest={handleMockGetGraph}
                        isLoading={isGetGraphLoading}
                        response={getGraphResponse}
                        codeSnippet={getDppGraphCodeSnippet}
                        snippetLanguage={getDppGraphSnippetLang}
                        onSnippetLanguageChange={(lang) => {setGetDppGraphSnippetLang(lang); updateSnippet("getDppGraph", "GET", lang, {productId: getGraphProductId}, null, setGetDppGraphCodeSnippet);}}
                        codeSampleLanguages={codeSampleLanguages}
                    >
                      <div>
                        <Label htmlFor="graphProductIdInput">Product ID (Path Parameter)</Label>
                        <Input id="graphProductIdInput" value={getGraphProductId} onChange={(e) => setGetGraphProductId(e.target.value)} placeholder="e.g., DPP001" />
                      </div>
                    </ApiPlaygroundEndpointCard>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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
                <Card key={sdk.name} className="shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-md font-medium flex items-center"><sdk.icon className="mr-2 h-5 w-5 text-accent"/>{sdk.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 flex-grow">
                    <p className="text-xs text-muted-foreground flex-grow min-h-[40px]">{sdk.description}</p>
                  </CardContent>
                  <div className="p-4 pt-0">
                    <Button variant="outline" size="sm" className="w-full group" asChild>
                      <Link href={sdk.href} passHref className={cn(sdk.soon && "opacity-60 cursor-not-allowed")}>
                        {sdk.soon ? "Coming Soon" : <>View Details <ExternalLinkIcon className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" /></>}
                      </Link>
                    </Button>
                  </div>
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
                 <Card key={sample.id} className="shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-md font-medium flex items-center"><sample.icon className="mr-2 h-5 w-5 text-accent"/>{sample.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 flex-grow">
                    <p className="text-xs text-muted-foreground flex-grow min-h-[48px]">{sample.description}</p>
                  </CardContent>
                   <div className="p-4 pt-0">
                    <Button variant="link" size="sm" className="p-0 h-auto text-primary group" asChild>
                        <Link href={sample.href} passHref className="opacity-60 cursor-not-allowed">
                           {sample.linkText} <ExternalLinkIcon className="ml-1 h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center"><BookText className="mr-3 h-6 w-6 text-primary" /> Tutorials</CardTitle>
              <CardDescription>Step-by-step guides for common integration scenarios and use cases.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockTutorials.map(tutorial => (
                 <Card key={tutorial.id} className="shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-md font-medium flex items-center"><tutorial.icon className="mr-2 h-5 w-5 text-accent"/>{tutorial.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 flex-grow">
                    <p className="text-xs text-muted-foreground flex-grow min-h-[48px]">{tutorial.description}</p>
                  </CardContent>
                  <div className="p-4 pt-0">
                    <Button variant="link" size="sm" className="p-0 h-auto text-primary group" asChild={tutorial.href !== "#"}>
                        {tutorial.href === "#" ? (
                            <span className="opacity-60 cursor-not-allowed flex items-center">{tutorial.linkText} <ExternalLinkIcon className="ml-1 h-3 w-3" /></span>
                        ) : (
                            <Link href={tutorial.href}>
                                {tutorial.linkText} <ExternalLinkIcon className="ml-1 h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        )}
                    </Button>
                  </div>
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
                <h4 className="text-md font-semibold mb-2 flex items-center"><FileTextIcon className="mr-2 h-5 w-5 text-accent"/>Mock DPP Generator (Enhanced)</h4>
                <div className="space-y-3 p-3 border rounded-md bg-muted/30">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor="devToolsMockDppName" className="text-xs">Product Name (Optional)</Label>
                      <Input id="devToolsMockDppName" value={mockDppGeneratorProductName} onChange={(e) => setMockDppGeneratorProductName(e.target.value)} placeholder="e.g., Test Widget" className="h-8 text-xs"/>
                    </div>
                    <div>
                      <Label htmlFor="devToolsMockDppCategory" className="text-xs">Category (Optional)</Label>
                      <Input id="devToolsMockDppCategory" value={mockDppGeneratorCategory} onChange={(e) => setMockDppGeneratorCategory(e.target.value)} placeholder="e.g., Gadgets" className="h-8 text-xs"/>
                    </div>
                    <div>
                      <Label htmlFor="devToolsMockDppGtin" className="text-xs">GTIN (Optional)</Label>
                      <Input id="devToolsMockDppGtin" value={mockDppGeneratorGtin} onChange={(e) => setMockDppGeneratorGtin(e.target.value)} placeholder="e.g., 0123456789012" className="h-8 text-xs"/>
                    </div>
                  </div>
                  <Button size="sm" onClick={handleGenerateMockDpp} disabled={isGeneratingMockDpp} variant="secondary">
                    {isGeneratingMockDpp ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <ZapIcon className="mr-2 h-4 w-4" />}
                    {isGeneratingMockDpp ? "Generating..." : "Generate Mock DPP JSON"}
                  </Button>
                  {generatedMockDppJson && (
                    <div className="mt-3">
                      <Label className="text-xs">Generated Mock DPP:</Label>
                      <Textarea value={generatedMockDppJson} readOnly rows={10} className="font-mono text-xs bg-background"/>
                    </div>
                  )}
                </div>
              </div>
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

    

    


    



