
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
    Zap as ZapIcon, ServerCrash, Laptop, DatabaseZap, CheckCircle, Building, FileText as FileTextIconPg, History, 
    UploadCloud, ShieldCheck, Cpu, HardDrive, Filter as FilterIcon, AlertTriangle, RefreshCw, Info as InfoIconLucide, Tags, FilePlus2, Sigma, Hash, Layers3
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import ApiKeysManager, { type ApiKey } from '@/components/developer/ApiKeysManager';
import WebhooksManager, { type WebhookEntry } from '@/components/developer/WebhooksManager';
import DeveloperEndpointCard from '@/components/developer/DeveloperEndpointCard';
import { cn } from '@/lib/utils';
import { generateMockCodeSnippet } from '@/utils/apiPlaygroundUtils'; 
import ResourcesTab from '@/components/developer/ResourcesTab'; 

// Import new dashboard section components
import ApiMetricsCard from '@/components/developer/dashboard/ApiMetricsCard';
import PlatformNewsCard from '@/components/developer/dashboard/PlatformNewsCard';
import ServiceStatusCard from '@/components/developer/dashboard/ServiceStatusCard';
import DataFlowKpisCard from '@/components/developer/dashboard/DataFlowKpisCard';
import QuickActionsCard from '@/components/developer/dashboard/QuickActionsCard';


const initialMockApiKeys: ApiKey[] = [
  { id: "key_sandbox_1", key: "SANDBOX_KEY_123", type: "Sandbox", created: "2024-07-01", lastUsed: "2024-07-28", status: "Active" },
  { id: "key_prod_req_1", key: "N/A (Request Pending)", type: "Production", created: "2024-07-25", lastUsed: "N/A", status: "Pending Approval" },
  { id: "key_prod_active_1", key: "PROD_KEY_456", type: "Production", created: "2024-06-15", lastUsed: "2024-07-29", status: "Active" },
  { id: "key_sandbox_revoked_1", key: "sand_sk_xxxxWXYZrevoked", type: "Sandbox", created: "2024-05-10", lastUsed: "2024-05-12", status: "Revoked" },
];

const initialMockWebhooks: WebhookEntry[] = [
  { id: "wh_1", url: "https://api.example.com/webhook/product-updates", events: ["product.created", "product.updated", "dpp.status.changed"], status: "Active" },
  { id: "wh_2", url: "https://api.example.com/webhook/compliance-changes", events: ["compliance.status.changed"], status: "Disabled" },
  { id: "wh_3", url: "https://user.integrations.com/norruva/events", events: ["product.lifecycle.event.added", "product.deleted"], status: "Active" },
  { id: "wh_4", url: "https://another.service/endpoint/failed-hook", events: ["product.updated"], status: "Error" },
];


const platformAnnouncements = [
  { id: "ann1", date: "Aug 1, 2024", title: "New API Version v1.1 Released", summary: "Version 1.1 of the DPP API is now live, featuring enhanced query parameters for lifecycle events and new endpoints for supplier data management. Check the API Reference for details.", link: "/developer/docs/api-reference" },
  { id: "ann2", date: "Jul 25, 2024", title: "Webinar: Navigating EU Battery Regulation", summary: "Join us next week for a deep dive into using the Norruva platform to comply with the new EU Battery Regulation requirements. Registration is open.", link: "#" },
  { id: "ann3", date: "Jul 15, 2024", title: "Sandbox Environment Maintenance", summary: "Scheduled maintenance for the Sandbox environment will occur on July 20th, 02:00-04:00 UTC. Production environment will not be affected.", link: "#" },
];

const DataFlowKPIs = [
    { title: "DPP Creation Success Rate", value: "99.8%", icon: CheckCircle, color: "text-success", description: "Successful DPP initial creations via API." },
    { title: "Average Data Ingestion Time", value: "1.2s", icon: Clock, color: "text-blue-500", description: "Time from API call to DPP visibility." },
    { title: "DPP Retrieval Speed (P95)", value: "250ms", icon: ZapIcon, color: "text-info", description: "95th percentile for public API GET /dpp/{id}." },
    { title: "Webhook Delivery Success", value: "99.95%", icon: Send, color: "text-success", description: "Successful event notifications to subscribed endpoints." },
];

const systemStatusData = [
    { name: "DPP Core API", status: "Operational", icon: CheckCircle, color: "text-success" },
    { name: "AI Services (Genkit Flows)", status: "Operational", icon: CheckCircle, color: "text-success" },
    { name: "Data Extraction Service (Mock)", status: "Degraded Performance", icon: AlertTriangle, color: "text-warning" },
    { name: "EBSI Mock Interface", status: "Operational", icon: CheckCircle, color: "text-success" },
    { name: "Developer Portal Site", status: "Operational", icon: CheckCircle, color: "text-success" },
    { name: "Sandbox Environment API", status: "Under Maintenance", icon: Wrench, color: "text-blue-500" },
    { name: "Documentation Site", status: "Operational", icon: CheckCircle, color: "text-success" },
];

const dashboardQuickActions = [
  { label: "View My API Keys", href: "#", targetTab: "api_keys", icon: KeyRound, tooltip: "Manage your API access keys" },
  { label: "Explore API Reference", href: "/developer/docs/api-reference", icon: BookText, tooltip: "Detailed API endpoint documentation" },
  { label: "Manage Webhooks", href: "#", targetTab: "webhooks", icon: Webhook, tooltip: "Configure event notifications" },
  { label: "Tutorials & Resources", href: "#", targetTab: "resources", icon: Lightbulb, tooltip: "Access SDKs, tutorials, and developer guides" },
  { label: "Check API Status", href: "#", targetTab: "dashboard", icon: ServerCrash, tooltip: "View current API and system status" },
];


export default function DeveloperPortalPage() {
  const { toast } = useToast();

  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialMockApiKeys);
  const [webhooks, setWebhooks] = useState<WebhookEntry[]>(initialMockWebhooks);
  const [currentEnvironment, setCurrentEnvironment] = useState<string>("sandbox");
  const mockOrganizationName = "Acme Innovations";
  const [lastStatusCheckTime, setLastStatusCheckTime] = useState<string | null>(null); 
  const [activeTopTab, setActiveTopTab] = useState("dashboard");

  useEffect(() => {
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

  const [postOnchainStatusProductId, setPostOnchainStatusProductId] = useState<string>("DPP001");
  const [postOnchainStatusBody, setPostOnchainStatusBody] = useState<string>(JSON.stringify({ status: "active" }, null, 2));
  const [postOnchainStatusResponse, setPostOnchainStatusResponse] = useState<string | null>(null);
  const [isPostOnchainStatusLoading, setIsPostOnchainStatusLoading] = useState(false);
  const [postOnchainStatusSnippetLang, setPostOnchainStatusSnippetLang] = useState("cURL");

  const [postOnchainLifecycleProductId, setPostOnchainLifecycleProductId] = useState<string>("DPP001");
  const [postOnchainLifecycleBody, setPostOnchainLifecycleBody] = useState<string>(JSON.stringify({ lifecycleStage: "Manufacturing" }, null, 2));
  const [postOnchainLifecycleResponse, setPostOnchainLifecycleResponse] = useState<string | null>(null);
  const [isPostOnchainLifecycleLoading, setIsPostOnchainLifecycleLoading] = useState(false);
  const [postOnchainLifecycleSnippetLang, setPostOnchainLifecycleSnippetLang] = useState("cURL");

  const [postLogCriticalEventProductId, setPostLogCriticalEventProductId] = useState<string>("DPP001");
  const [postLogCriticalEventBody, setPostLogCriticalEventBody] = useState<string>(JSON.stringify({ eventDescription: "Safety recall initiated for batch XYZ.", severity: "High" }, null, 2));
  const [postLogCriticalEventResponse, setPostLogCriticalEventResponse] = useState<string | null>(null);
  const [isPostLogCriticalEventLoading, setIsPostLogCriticalEventLoading] = useState(false);
  const [postLogCriticalEventSnippetLang, setPostLogCriticalEventSnippetLang] = useState("cURL");
  
  const [postRegisterVcHashProductId, setPostRegisterVcHashProductId] = useState<string>("DPP001");
  const [postRegisterVcHashBody, setPostRegisterVcHashBody] = useState<string>(JSON.stringify({ vcId: "urn:uuid:example-vc-id-123", vcHash: "a1b2c3d4e5f6..." }, null, 2));
  const [postRegisterVcHashResponse, setPostRegisterVcHashResponse] = useState<string | null>(null);
  const [isPostRegisterVcHashLoading, setIsPostRegisterVcHashLoading] = useState(false);
  const [postRegisterVcHashSnippetLang, setPostRegisterVcHashSnippetLang] = useState("cURL");

  const [postComponentTransferProductId, setPostComponentTransferProductId] = useState<string>("DPP001");
  const [postComponentTransferBody, setPostComponentTransferBody] = useState<string>(
    JSON.stringify({
      componentId: "COMP_XYZ_123",
      quantity: 100,
      transferDate: new Date().toISOString(),
      fromParty: { participantId: "SUP001", role: "Supplier" },
      toParty: { participantId: "MFG001", role: "Manufacturer" }
    }, null, 2)
  );
  const [postComponentTransferResponse, setPostComponentTransferResponse] = useState<string | null>(null);
  const [isPostComponentTransferLoading, setIsPostComponentTransferLoading] = useState(false);
  const [postComponentTransferSnippetLang, setPostComponentTransferSnippetLang] = useState("cURL");

  const [zkpSubmitDppId, setZkpSubmitDppId] = useState<string>("DPP001");
  const [zkpSubmitBody, setZkpSubmitBody] = useState<string>(
    JSON.stringify({ claimType: "material_compliance_svhc_lead_less_0.1", proofData: "0xMockProofData...", publicInputs: { productBatchId: "BATCH123" } }, null, 2)
  );
  const [zkpSubmitResponse, setZkpSubmitResponse] = useState<string | null>(null);
  const [isZkpSubmitLoading, setIsZkpSubmitLoading] = useState(false);
  const [zkpSubmitSnippetLang, setZkpSubmitSnippetLang] = useState("cURL");

  const [zkpVerifyDppId, setZkpVerifyDppId] = useState<string>("DPP001");
  const [zkpVerifyClaimType, setZkpVerifyClaimType] = useState<string>("material_compliance_svhc_lead_less_0.1");
  const [zkpVerifyResponse, setZkpVerifyResponse] = useState<string | null>(null);
  const [isZkpVerifyLoading, setIsZkpVerifyLoading] = useState(false);
  const [zkpVerifySnippetLang, setZkpVerifySnippetLang] = useState("cURL");

  const [mintTokenProductId, setMintTokenProductId] = useState<string>("DPP001");
  const [mintTokenBody, setMintTokenBody] = useState<string>(JSON.stringify({ contractAddress: "0xMOCK_DPP_TOKEN_CONTRACT", recipientAddress: "0xRECIPIENT_MOCK_ADDRESS", metadataUri: "ipfs://example_metadata_cid" }, null, 2));
  const [mintTokenResponsePlayground, setMintTokenResponsePlayground] = useState<string | null>(null);
  const [isMintTokenLoading, setIsMintTokenLoading] = useState(false);
  const [mintTokenSnippetLang, setMintTokenSnippetLang] = useState("cURL");

  const [updateTokenMetaTokenId, setUpdateTokenMetaTokenId] = useState<string>("101");
  const [updateTokenMetaBody, setUpdateTokenMetaBody] = useState<string>(JSON.stringify({ metadataUri: "ipfs://new_example_metadata_cid" }, null, 2));
  const [updateTokenMetaResponse, setUpdateTokenMetaResponse] = useState<string | null>(null);
  const [isUpdateTokenMetaLoading, setIsUpdateTokenMetaLoading] = useState(false);
  const [updateTokenMetaSnippetLang, setUpdateTokenMetaSnippetLang] = useState("cURL");

  const [getTokenStatusTokenId, setGetTokenStatusTokenId] = useState<string>("101");
  const [getTokenStatusResponse, setGetTokenStatusResponse] = useState<string | null>(null);
  const [isGetTokenStatusLoading, setIsGetTokenStatusLoading] = useState(false);
  const [getTokenStatusSnippetLang, setGetTokenStatusSnippetLang] = useState("cURL");


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
  const [postOnchainStatusCodeSnippet, setPostOnchainStatusCodeSnippet] = useState("");
  const [postOnchainLifecycleCodeSnippet, setPostOnchainLifecycleCodeSnippet] = useState("");
  const [postLogCriticalEventCodeSnippet, setPostLogCriticalEventCodeSnippet] = useState("");
  const [postRegisterVcHashCodeSnippet, setPostRegisterVcHashCodeSnippet] = useState("");
  const [postComponentTransferCodeSnippet, setPostComponentTransferCodeSnippet] = useState("");
  const [zkpSubmitCodeSnippet, setZkpSubmitCodeSnippet] = useState("");
  const [zkpVerifyCodeSnippet, setZkpVerifyCodeSnippet] = useState("");
  const [mintTokenCodeSnippet, setMintTokenCodeSnippet] = useState("");
  const [updateTokenMetaCodeSnippet, setUpdateTokenMetaCodeSnippet] = useState("");
  const [getTokenStatusCodeSnippet, setGetTokenStatusCodeSnippet] = useState("");


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
  useEffect(() => updateSnippet("importDpps", "POST", importDppsSnippetLang, { fileType: postImportFileType, sourceDescription: postImportSourceDescription }, JSON.stringify({fileType: postImportFileType, data: "mock_base64_data", sourceDescription: postImportSourceDescription }), setImportDppsCodeSnippet), [postImportFileType, postImportSourceDescription, importDppsSnippetLang, updateSnippet]);
  useEffect(() => updateSnippet("getDppGraph", "GET", getDppGraphSnippetLang, { productId: getGraphProductId }, null, setGetDppGraphCodeSnippet), [getGraphProductId, getDppGraphSnippetLang, updateSnippet]);
  useEffect(() => updateSnippet("getDppStatus", "GET", getStatusSnippetLang, { productId: getStatusProductId }, null, setGetStatusCodeSnippet), [getStatusProductId, getStatusSnippetLang, updateSnippet]);

  useEffect(() => updateSnippet("onchainStatus", "POST", postOnchainStatusSnippetLang, { productId: postOnchainStatusProductId }, postOnchainStatusBody, setPostOnchainStatusCodeSnippet), [postOnchainStatusProductId, postOnchainStatusBody, postOnchainStatusSnippetLang, updateSnippet]);
  useEffect(() => updateSnippet("onchainLifecycleStage", "POST", postOnchainLifecycleSnippetLang, { productId: postOnchainLifecycleProductId }, postOnchainLifecycleBody, setPostOnchainLifecycleCodeSnippet), [postOnchainLifecycleProductId, postOnchainLifecycleBody, postOnchainLifecycleSnippetLang, updateSnippet]);
  useEffect(() => updateSnippet("logCriticalEvent", "POST", postLogCriticalEventSnippetLang, { productId: postLogCriticalEventProductId }, postLogCriticalEventBody, setPostLogCriticalEventCodeSnippet), [postLogCriticalEventProductId, postLogCriticalEventBody, postLogCriticalEventSnippetLang, updateSnippet]);
  useEffect(() => updateSnippet("registerVcHash", "POST", postRegisterVcHashSnippetLang, { productId: postRegisterVcHashProductId }, postRegisterVcHashBody, setPostRegisterVcHashCodeSnippet), [postRegisterVcHashProductId, postRegisterVcHashBody, postRegisterVcHashSnippetLang, updateSnippet]);
  
  useEffect(() => updateSnippet("postComponentTransfer", "POST", postComponentTransferSnippetLang, { productId: postComponentTransferProductId }, postComponentTransferBody, setPostComponentTransferCodeSnippet), [postComponentTransferProductId, postComponentTransferBody, postComponentTransferSnippetLang, updateSnippet]);

  useEffect(() => updateSnippet("zkpSubmitProof", "POST", zkpSubmitSnippetLang, { dppId: zkpSubmitDppId }, zkpSubmitBody, setZkpSubmitCodeSnippet), [zkpSubmitDppId, zkpSubmitBody, zkpSubmitSnippetLang, updateSnippet]);
  useEffect(() => updateSnippet("zkpVerifyClaim", "GET", zkpVerifySnippetLang, { dppId: zkpVerifyDppId, claimType: zkpVerifyClaimType }, null, setZkpVerifyCodeSnippet), [zkpVerifyDppId, zkpVerifyClaimType, zkpVerifySnippetLang, updateSnippet]);

  useEffect(() => updateSnippet("mintToken", "POST", mintTokenSnippetLang, { productId: mintTokenProductId }, mintTokenBody, setMintTokenCodeSnippet), [mintTokenProductId, mintTokenBody, mintTokenSnippetLang, updateSnippet]);
  useEffect(() => updateSnippet("updateTokenMetadata", "PATCH", updateTokenMetaSnippetLang, { tokenId: updateTokenMetaTokenId }, updateTokenMetaBody, setUpdateTokenMetaCodeSnippet), [updateTokenMetaTokenId, updateTokenMetaBody, updateTokenMetaSnippetLang, updateSnippet]);
  useEffect(() => updateSnippet("getTokenStatus", "GET", getTokenStatusSnippetLang, { tokenId: getTokenStatusTokenId }, null, setGetTokenStatusCodeSnippet), [getTokenStatusTokenId, getTokenStatusSnippetLang, updateSnippet]);


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
    const webhookToEdit = webhooks.find(wh => wh.id === webhookId);
    if (webhookToEdit) {
        const newUrl = prompt(`Enter new URL for webhook ${webhookId}:`, webhookToEdit.url);
        if (newUrl) {
            setWebhooks(prev => prev.map(wh => wh.id === webhookId ? {...wh, url: newUrl} : wh));
            toast({ title: "Webhook Updated (Mock)", description: `URL for webhook ${webhookId} changed.` });
        }
    }
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
    
    const apiKeyToUse = apiKeys.find(k => k.type.toLowerCase() === currentEnvironment && k.status === 'Active')?.key || 'SANDBOX_KEY_123'; // Fallback to static key if none found

    toast({ 
      title: `Sending API Request (via Playground)...`, 
      description: `${method} ${url}` 
    });

    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKeyToUse}` 
        }
      };
      if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = typeof body === 'string' ? body : JSON.stringify(body);
      }

      const res = await fetch(url, options); 
      const responseData = await res.json();

      if (!res.ok) {
        setResponse(JSON.stringify({ status: res.status, error: responseData.error || responseData }, null, 2));
        toast({ title: `API Error: ${res.status}`, description: responseData.error?.message || 'An API error occurred.', variant: "destructive" });
      } else {
        setResponse(JSON.stringify(responseData, null, 2));
        toast({ title: "API Response Received", description: `${method} request to ${url} was successful.`, variant: "default"});
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      setResponse(JSON.stringify({ error: "Client-side error during API call", details: errorMsg }, null, 2));
      toast({ title: "Request Failed (Client Error)", description: errorMsg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleMockGetProductDetails = () => { updateSnippet("getProduct", "GET", getProductSnippetLang, { productId: getProductId }, null, setGetProductCodeSnippet); makeApiCall(`/api/v1/dpp/${getProductId}`, 'GET', null, setIsGetProductLoading, setGetProductResponse); }
  const handleMockListProducts = () => { const queryParams = new URLSearchParams(); if (listDppFilters.status !== 'all') queryParams.append('status', listDppFilters.status); if (listDppFilters.category !== 'all') queryParams.append('category', listDppFilters.category); if (listDppFilters.searchQuery) queryParams.append('searchQuery', listDppFilters.searchQuery); if (listDppFilters.blockchainAnchored !== 'all') queryParams.append('blockchainAnchored', listDppFilters.blockchainAnchored); const url = `/api/v1/dpp${queryParams.toString() ? `?${queryParams.toString()}`: ''}`; updateSnippet("listDpps", "GET", listDppsSnippetLang, listDppFilters, null, setListDppsCodeSnippet); makeApiCall(url, 'GET', null, setIsListProductsLoading, setListProductsResponse); };
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
  const handleMockGetGraph = () => { updateSnippet("getDppGraph", "GET", getDppGraphSnippetLang, { productId: getGraphProductId }, null, setGetDppGraphCodeSnippet); makeApiCall(`/api/v1/dpp/graph/${getGraphProductId}`, 'GET', null, setIsGetGraphLoading, setGetDppGraphResponse); }
  const handleMockGetStatus = () => { updateSnippet("getDppStatus", "GET", getStatusSnippetLang, { productId: getStatusProductId }, null, setGetStatusCodeSnippet); makeApiCall(`/api/v1/dpp/status/${getStatusProductId}`, 'GET', null, setIsGetStatusLoading, setGetStatusResponse); }

  const handleMockUpdateOnChainStatus = () => { updateSnippet("onchainStatus", "POST", postOnchainStatusSnippetLang, { productId: postOnchainStatusProductId }, postOnchainStatusBody, setPostOnchainStatusCodeSnippet); makeApiCall(`/api/v1/dpp/${postOnchainStatusProductId}/onchain-status`, 'POST', postOnchainStatusBody, setIsPostOnchainStatusLoading, setPostOnchainStatusResponse); }
  const handleMockUpdateOnChainLifecycleStage = () => { updateSnippet("onchainLifecycleStage", "POST", postOnchainLifecycleSnippetLang, { productId: postOnchainLifecycleProductId }, postOnchainLifecycleBody, setPostOnchainLifecycleCodeSnippet); makeApiCall(`/api/v1/dpp/${postOnchainLifecycleProductId}/onchain-lifecycle-stage`, 'POST', postOnchainLifecycleBody, setIsPostOnchainLifecycleLoading, setPostOnchainLifecycleResponse); }
  const handleMockLogCriticalEvent = () => { updateSnippet("logCriticalEvent", "POST", postLogCriticalEventSnippetLang, { productId: postLogCriticalEventProductId }, postLogCriticalEventBody, setPostLogCriticalEventCodeSnippet); makeApiCall(`/api/v1/dpp/${postLogCriticalEventProductId}/log-critical-event`, 'POST', postLogCriticalEventBody, setIsPostLogCriticalEventLoading, setPostLogCriticalEventResponse); }
  const handleMockRegisterVcHash = () => { updateSnippet("registerVcHash", "POST", postRegisterVcHashSnippetLang, { productId: postRegisterVcHashProductId }, postRegisterVcHashBody, setPostRegisterVcHashCodeSnippet); makeApiCall(`/api/v1/dpp/${postRegisterVcHashProductId}/register-vc-hash`, 'POST', postRegisterVcHashBody, setIsPostRegisterVcHashLoading, setPostRegisterVcHashResponse); }
  
  const handleMockPostComponentTransfer = () => { updateSnippet("postComponentTransfer", "POST", postComponentTransferSnippetLang, { productId: postComponentTransferProductId }, postComponentTransferBody, setPostComponentTransferCodeSnippet); makeApiCall(`/api/v1/private/dpp/${postComponentTransferProductId}/component-transfer`, 'POST', postComponentTransferBody, setIsPostComponentTransferLoading, setPostComponentTransferResponse); }

  const handleMockZkpSubmitProof = () => { updateSnippet("zkpSubmitProof", "POST", zkpSubmitSnippetLang, { dppId: zkpSubmitDppId }, zkpSubmitBody, setZkpSubmitCodeSnippet); makeApiCall(`/api/v1/zkp/submit-proof/${zkpSubmitDppId}`, 'POST', zkpSubmitBody, setIsZkpSubmitLoading, setZkpSubmitResponse); }
  const handleMockZkpVerifyClaim = () => { updateSnippet("zkpVerifyClaim", "GET", zkpVerifySnippetLang, { dppId: zkpVerifyDppId, claimType: zkpVerifyClaimType }, null, setZkpVerifyCodeSnippet); makeApiCall(`/api/v1/zkp/verify-claim/${zkpVerifyDppId}?claimType=${encodeURIComponent(zkpVerifyClaimType)}`, 'GET', null, setIsZkpVerifyLoading, setZkpVerifyResponse); }

  const handleMockMintToken = () => { updateSnippet("mintToken", "POST", mintTokenSnippetLang, { productId: mintTokenProductId }, mintTokenBody, setMintTokenCodeSnippet); makeApiCall(`/api/v1/token/mint/${mintTokenProductId}`, 'POST', mintTokenBody, setIsMintTokenLoading, setMintTokenResponsePlayground); }
  const handleMockUpdateTokenMetadata = () => { updateSnippet("updateTokenMetadata", "PATCH", updateTokenMetaSnippetLang, { tokenId: updateTokenMetaTokenId }, updateTokenMetaBody, setUpdateTokenMetaCodeSnippet); makeApiCall(`/api/v1/token/metadata/${updateTokenMetaTokenId}`, 'PATCH', updateTokenMetaBody, setIsUpdateTokenMetaLoading, setUpdateTokenMetaResponse); }
  const handleMockGetTokenStatus = () => { updateSnippet("getTokenStatus", "GET", getTokenStatusSnippetLang, { tokenId: getTokenStatusTokenId }, null, setGetTokenStatusCodeSnippet); makeApiCall(`/api/v1/token/status/${getTokenStatusTokenId}`, 'GET', null, setIsGetTokenStatusLoading, setGetTokenStatusResponse); }


  const codeSampleLanguages = ["cURL", "JavaScript", "Python"];

  const endpointConfigs = [
    {
      id: 'get-product',
      section: 'core',
      title: 'GET /api/v1/dpp/{productId}',
      description: 'Retrieve details for a specific product by its ID.',
      onSendRequest: handleMockGetProductDetails,
      isLoading: isGetProductLoading,
      response: getProductResponse,
      codeSnippet: getProductCodeSnippet,
      snippetLanguage: getProductSnippetLang,
      onSnippetLanguageChange: (lang: string) => { setGetProductSnippetLang(lang); updateSnippet('getProduct','GET',lang,{ productId: getProductId },null,setGetProductCodeSnippet); },
      children: (
        <div>
          <Label htmlFor="productIdInput-get">Product ID (Path Parameter)</Label>
          <Input id="productIdInput-get" value={getProductId} onChange={(e) => setGetProductId(e.target.value)} placeholder="e.g., DPP001" />
        </div>
      )
    },
    {
      id: 'list-dpps',
      section: 'core',
      title: 'GET /api/v1/dpp',
      description: 'Retrieve a list of available Digital Product Passports with filtering.',
      onSendRequest: handleMockListProducts,
      isLoading: isListProductsLoading,
      response: listProductsResponse,
      codeSnippet: listDppsCodeSnippet,
      snippetLanguage: listDppsSnippetLang,
      onSnippetLanguageChange: (lang: string) => { setListDppsSnippetLang(lang); updateSnippet('listDpps','GET',lang,listDppFilters,null,setListDppsCodeSnippet); },
      children: (
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
                {['all','draft','published','archived','pending_review','revoked','flagged'].map(s => <SelectItem key={`listStatus-${s}`} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace('_',' ')}</SelectItem>)}
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
      )
    },
    {
      id: 'create-dpp',
      section: 'core',
      title: 'POST /api/v1/dpp',
      description: 'Create a new Digital Product Passport.',
      onSendRequest: handleMockPostDpp,
      isLoading: isPostDppLoading,
      response: postDppResponse,
      codeSnippet: createDppCodeSnippet,
      snippetLanguage: createDppSnippetLang,
      onSnippetLanguageChange: (lang: string) => { setCreateDppSnippetLang(lang); updateSnippet('createDpp','POST',lang,{},postDppBody,setCreateDppCodeSnippet); },
      children: (
        <div>
          <Label htmlFor="postDppBody">Request Body (JSON)</Label>
          <Textarea id="postDppBody" value={postDppBody} onChange={(e) => setPostDppBody(e.target.value)} rows={5} className="font-mono text-xs" />
          <p className="text-xs text-muted-foreground mt-1">Example required fields: productName, category. See API Reference for full schema.</p>
        </div>
      )
    },
    {
      id: 'update-dpp',
      section: 'core',
      title: 'PUT /api/v1/dpp/{productId}',
      description: 'Update an existing Digital Product Passport.',
      onSendRequest: handleMockPutProduct,
      isLoading: isPutProductLoading,
      response: putProductResponse,
      codeSnippet: updateDppCodeSnippet,
      snippetLanguage: updateDppSnippetLang,
      onSnippetLanguageChange: (lang: string) => { setUpdateDppSnippetLang(lang); updateSnippet('updateDpp','PUT',lang,{productId: putProductId},putProductBody,setUpdateDppCodeSnippet); },
      children: (
        <>
          <div>
            <Label htmlFor="productIdInput-put">Product ID (Path Parameter)</Label>
            <Input id="productIdInput-put" value={putProductId} onChange={(e) => setPutProductId(e.target.value)} placeholder="e.g., DPP001" />
          </div>
          <div className="mt-2">
            <Label htmlFor="putProductBody">Request Body (JSON)</Label>
            <Textarea id="putProductBody" value={putProductBody} onChange={(e) => setPutProductBody(e.target.value)} rows={4} className="font-mono text-xs" />
            <p className="text-xs text-muted-foreground mt-1">Send partial or full updates. See API Reference for updatable fields.</p>
          </div>
        </>
      )
    },
    {
      id: 'patch-dpp-extend',
      section: 'core',
      title: 'PATCH /api/v1/dpp/extend/{productId}',
      description: 'Extend a DPP by adding document references or other modular data.',
      onSendRequest: handleMockPatchDppExtend,
      isLoading: isPatchDppExtendLoading,
      response: patchDppExtendResponse,
      codeSnippet: patchDppExtendCodeSnippet,
      snippetLanguage: patchDppExtendSnippetLang,
      onSnippetLanguageChange: (lang: string) => { setPatchDppExtendSnippetLang(lang); updateSnippet('patchDppExtend','PATCH',lang,{productId: patchDppExtendProductId},patchDppExtendBody,setPatchDppExtendCodeSnippet); },
      children: (
        <>
          <div>
            <Label htmlFor="productIdInput-patch">Product ID (Path Parameter)</Label>
            <Input id="productIdInput-patch" value={patchDppExtendProductId} onChange={(e) => setPatchDppExtendProductId(e.target.value)} placeholder="e.g., DPP001" />
          </div>
          <div className="mt-2">
            <Label htmlFor="patchDppExtendBody">Request Body (JSON)</Label>
            <Textarea id="patchDppExtendBody" value={patchDppExtendBody} onChange={(e) => setPatchDppExtendBody(e.target.value)} rows={4} className="font-mono text-xs" />
            <p className="text-xs text-muted-foreground mt-1">Example: Add a document reference. See API Reference.</p>
          </div>
        </>
      )
    },
    {
      id: 'delete-dpp',
      section: 'core',
      title: 'DELETE /api/v1/dpp/{productId}',
      description: 'Archive a Digital Product Passport.',
      onSendRequest: handleMockDeleteProduct,
      isLoading: isDeleteProductLoading,
      response: deleteProductResponse,
      codeSnippet: deleteDppCodeSnippet,
      snippetLanguage: deleteDppSnippetLang,
      onSnippetLanguageChange: (lang: string) => { setDeleteDppSnippetLang(lang); updateSnippet('deleteDpp','DELETE',lang,{productId: deleteProductId},null,setDeleteDppCodeSnippet); },
      children: (
        <div>
          <Label htmlFor="productIdInput-delete">Product ID (Path Parameter)</Label>
          <Input id="productIdInput-delete" value={deleteProductId} onChange={(e) => setDeleteProductId(e.target.value)} placeholder="e.g., PROD002" />
        </div>
      )
    },
    {
      id: 'get-status',
      section: 'utility',
      title: 'GET /api/v1/dpp/status/{productId}',
      description: 'Retrieve the current status of a specific DPP.',
      onSendRequest: handleMockGetStatus,
      isLoading: isGetStatusLoading,
      response: getStatusResponse,
      codeSnippet: getStatusCodeSnippet,
      snippetLanguage: getStatusSnippetLang,
      onSnippetLanguageChange: (lang: string) => { setGetStatusSnippetLang(lang); updateSnippet('getDppStatus','GET',lang,{ productId: getStatusProductId },null,setGetStatusCodeSnippet); },
      children: (
        <div>
          <Label htmlFor="productIdInput-get-status">Product ID (Path Parameter)</Label>
          <Input id="productIdInput-get-status" value={getStatusProductId} onChange={(e) => setGetStatusProductId(e.target.value)} placeholder="e.g., DPP001" />
        </div>
      )
    },
    {
      id: 'qr-validate',
      section: 'utility',
      title: 'POST /api/v1/qr/validate',
      description: 'Validate a QR identifier and retrieve a DPP summary.',
      onSendRequest: handleMockPostQrValidate,
      isLoading: isPostQrValidateLoading,
      response: postQrValidateResponse,
      codeSnippet: qrValidateCodeSnippet,
      snippetLanguage: qrValidateSnippetLang,
      onSnippetLanguageChange: (lang: string) => { setQrValidateSnippetLang(lang); updateSnippet('qrValidate','POST',lang,{},postQrValidateBody,setQrValidateCodeSnippet); },
      children: (
        <div>
          <Label htmlFor="postQrValidateBody">Request Body (JSON)</Label>
          <Textarea id="postQrValidateBody" value={postQrValidateBody} onChange={(e) => setPostQrValidateBody(e.target.value)} rows={3} className="font-mono text-xs" />
        </div>
      )
    },
    {
      id: 'post-lifecycle-event',
      section: 'utility',
      title: 'POST /api/v1/dpp/{productId}/lifecycle-events',
      description: 'Add a new lifecycle event to a specific DPP.',
      onSendRequest: handleMockPostLifecycleEvent,
      isLoading: isPostLifecycleEventLoading,
      response: postLifecycleEventResponse,
      codeSnippet: addLifecycleEventCodeSnippet,
      snippetLanguage: addLifecycleEventSnippetLang,
      onSnippetLanguageChange: (lang: string) => { setAddLifecycleEventSnippetLang(lang); updateSnippet('addLifecycleEvent','POST',lang,{productId: postLifecycleEventProductId},postLifecycleEventBody,setAddLifecycleEventCodeSnippet); },
      children: (
        <>
          <div>
            <Label htmlFor="productIdInput-post-event">Product ID (Path Parameter)</Label>
            <Input id="productIdInput-post-event" value={postLifecycleEventProductId} onChange={(e) => setPostLifecycleEventProductId(e.target.value)} placeholder="e.g., DPP001" />
          </div>
          <div className="mt-2">
            <Label htmlFor="postLifecycleEventBody">Request Body (JSON)</Label>
            <Textarea id="postLifecycleEventBody" value={postLifecycleEventBody} onChange={(e) => setPostLifecycleEventBody(e.target.value)} rows={5} className="font-mono text-xs" />
          </div>
        </>
      )
    },
    {
      id: 'get-compliance-summary',
      section: 'utility',
      title: 'GET /api/v1/dpp/{productId}/compliance-summary',
      description: 'Retrieve a compliance summary for a specific product.',
      onSendRequest: handleMockGetComplianceSummary,
      isLoading: isGetComplianceLoading,
      response: getComplianceResponse,
      codeSnippet: getComplianceSummaryCodeSnippet,
      snippetLanguage: getComplianceSummarySnippetLang,
      onSnippetLanguageChange: (lang: string) => { setGetComplianceSummarySnippetLang(lang); updateSnippet('getComplianceSummary','GET',lang,{productId: getComplianceProductId},null,setGetComplianceSummaryCodeSnippet); },
      children: (
        <div>
          <Label htmlFor="productIdInput-get-compliance">Product ID (Path Parameter)</Label>
          <Input id="productIdInput-get-compliance" value={getComplianceProductId} onChange={(e) => setGetComplianceProductId(e.target.value)} placeholder="e.g., DPP001" />
        </div>
      )
    },
    {
      id: 'verify-dpp',
      section: 'utility',
      title: 'POST /api/v1/dpp/verify/{productId}',
      description: 'Perform compliance and authenticity checks on a DPP.',
      onSendRequest: handleMockPostVerify,
      isLoading: isPostVerifyLoading,
      response: postVerifyResponse,
      codeSnippet: verifyDppCodeSnippet,
      snippetLanguage: verifyDppSnippetLang,
      onSnippetLanguageChange: (lang: string) => { setVerifyDppSnippetLang(lang); updateSnippet('verifyDpp','POST',lang,{productIdPath: postVerifyProductIdPath},null,setVerifyDppCodeSnippet); },
      children: (
        <div>
          <Label htmlFor="productIdInput-verify-path">Product ID (Path Parameter)</Label>
          <Input id="productIdInput-verify-path" value={postVerifyProductIdPath} onChange={(e) => setPostVerifyProductIdPath(e.target.value)} placeholder="e.g., DPP001" />
          <p className="text-xs text-muted-foreground mt-1">No request body needed for this mock endpoint.</p>
        </div>
      )
    },
    {
      id: 'get-history',
      section: 'utility',
      title: 'GET /api/v1/dpp/history/{productId}',
      description: 'Retrieve the audit trail / history for a specific DPP.',
      onSendRequest: handleMockGetHistory,
      isLoading: isGetHistoryLoading,
      response: getHistoryResponse,
      codeSnippet: getDppHistoryCodeSnippet,
      snippetLanguage: getDppHistorySnippetLang,
      onSnippetLanguageChange: (lang: string) => { setGetDppHistorySnippetLang(lang); updateSnippet('getDppHistory','GET',lang,{productId: getHistoryProductId},null,setGetDppHistoryCodeSnippet); },
      children: (
        <div>
          <Label htmlFor="historyProductIdInput">Product ID (Path Parameter)</Label>
          <Input id="historyProductIdInput" value={getHistoryProductId} onChange={(e) => setGetHistoryProductId(e.target.value)} placeholder="e.g., DPP001" />
        </div>
      )
    },
    {
      id: 'import-dpps',
      section: 'utility',
      title: 'POST /api/v1/dpp/import',
      description: 'Batch import Digital Product Passports (CSV, JSON, etc.).',
      onSendRequest: handleMockPostImport,
      isLoading: isPostImportLoading,
      response: postImportResponse,
      codeSnippet: importDppsCodeSnippet,
      snippetLanguage: importDppsSnippetLang,
      onSnippetLanguageChange: (lang: string) => { setImportDppsSnippetLang(lang); updateSnippet('importDpps','POST',lang,{fileType: postImportFileType, sourceDescription: postImportSourceDescription}, JSON.stringify({fileType: postImportFileType, data: 'mock_base64_data', sourceDescription: postImportSourceDescription}), setImportDppsCodeSnippet); },
      children: (
        <>
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
              <Input id="importSourceDescription" value={postImportSourceDescription} onChange={(e) => setPostImportSourceDescription(e.target.value)} placeholder="e.g., Q3 Supplier Data Upload" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">For this mock, 'data' field is simulated. See API Reference.</p>
        </>
      )
    },
    {
      id: 'get-graph',
      section: 'utility',
      title: 'GET /api/v1/dpp/graph/{productId}',
      description: 'Retrieve data for supply chain visualization.',
      onSendRequest: handleMockGetGraph,
      isLoading: isGetGraphLoading,
      response: getGraphResponse,
      codeSnippet: getDppGraphCodeSnippet,
      snippetLanguage: getDppGraphSnippetLang,
      onSnippetLanguageChange: (lang: string) => { setGetDppGraphSnippetLang(lang); updateSnippet('getDppGraph','GET',lang,{productId: getGraphProductId},null,setGetDppGraphCodeSnippet); },
      children: (
        <div>
          <Label htmlFor="graphProductIdInput">Product ID (Path Parameter)</Label>
          <Input id="graphProductIdInput" value={getGraphProductId} onChange={(e) => setGetGraphProductId(e.target.value)} placeholder="e.g., DPP001" />
        </div>
      )
    },
    {
      id: 'update-onchain-status',
      section: 'onchain',
      title: 'POST /api/v1/dpp/{productId}/onchain-status',
      description: 'Conceptually update the on-chain status of a DPP.',
      onSendRequest: handleMockUpdateOnChainStatus,
      isLoading: isPostOnchainStatusLoading,
      response: postOnchainStatusResponse,
      codeSnippet: postOnchainStatusCodeSnippet,
      snippetLanguage: postOnchainStatusSnippetLang,
      onSnippetLanguageChange: (lang: string) => { setPostOnchainStatusSnippetLang(lang); updateSnippet('onchainStatus','POST',lang,{productId: postOnchainStatusProductId},postOnchainStatusBody,setPostOnchainStatusCodeSnippet); },
      children: (
        <>
          <div>
            <Label htmlFor="onchainStatusProductIdPlayground">Product ID (Path Parameter)</Label>
            <Input id="onchainStatusProductIdPlayground" value={postOnchainStatusProductId} onChange={(e) => setPostOnchainStatusProductId(e.target.value)} placeholder="e.g., DPP001" />
          </div>
          <div className="mt-2">
            <Label htmlFor="onchainStatusBodyPlayground">Request Body (JSON)</Label>
            <Textarea id="onchainStatusBodyPlayground" value={postOnchainStatusBody} onChange={(e) => setPostOnchainStatusBody(e.target.value)} rows={3} className="font-mono text-xs" />
          </div>
        </>
      )
    },
    {
      id: 'update-onchain-lifecycle-stage',
      section: 'onchain',
      title: 'POST /api/v1/dpp/{productId}/onchain-lifecycle-stage',
      description: 'Conceptually update the on-chain lifecycle stage of a DPP.',
      onSendRequest: handleMockUpdateOnChainLifecycleStage,
      isLoading: isPostOnchainLifecycleLoading,
      response: postOnchainLifecycleResponse,
      codeSnippet: postOnchainLifecycleCodeSnippet,
      snippetLanguage: postOnchainLifecycleSnippetLang,
      onSnippetLanguageChange: (lang: string) => { setPostOnchainLifecycleSnippetLang(lang); updateSnippet('onchainLifecycleStage','POST',lang,{productId: postOnchainLifecycleProductId},postOnchainLifecycleBody,setPostOnchainLifecycleCodeSnippet); },
      children: (
        <>
          <div>
            <Label htmlFor="onchainLifecycleProductIdPlayground">Product ID (Path Parameter)</Label>
            <Input id="onchainLifecycleProductIdPlayground" value={postOnchainLifecycleProductId} onChange={(e) => setPostOnchainLifecycleProductId(e.target.value)} placeholder="e.g., DPP001" />
          </div>
          <div className="mt-2">
            <Label htmlFor="onchainLifecycleBodyPlayground">Request Body (JSON)</Label>
            <Textarea id="onchainLifecycleBodyPlayground" value={postOnchainLifecycleBody} onChange={(e) => setPostOnchainLifecycleBody(e.target.value)} rows={3} className="font-mono text-xs" />
          </div>
        </>
      )
    },
    {
      id: 'log-critical-event',
      section: 'onchain',
      title: 'POST /api/v1/dpp/{productId}/log-critical-event',
      description: 'Conceptually log a critical event on-chain for a DPP.',
      onSendRequest: handleMockLogCriticalEvent,
      isLoading: isPostLogCriticalEventLoading,
      response: postLogCriticalEventResponse,
      codeSnippet: postLogCriticalEventCodeSnippet,
      snippetLanguage: postLogCriticalEventSnippetLang,
      onSnippetLanguageChange: (lang: string) => { setPostLogCriticalEventSnippetLang(lang); updateSnippet('logCriticalEvent','POST',lang,{productId: postLogCriticalEventProductId},postLogCriticalEventBody,setPostLogCriticalEventCodeSnippet); },
      children: (
        <>
          <div>
            <Label htmlFor="logCriticalEventProductIdPlayground">Product ID (Path Parameter)</Label>
            <Input id="logCriticalEventProductIdPlayground" value={postLogCriticalEventProductId} onChange={(e) => setPostLogCriticalEventProductId(e.target.value)} placeholder="e.g., DPP001" />
          </div>
          <div className="mt-2">
            <Label htmlFor="logCriticalEventBodyPlayground">Request Body (JSON)</Label>
            <Textarea id="logCriticalEventBodyPlayground" value={postLogCriticalEventBody} onChange={(e) => setPostLogCriticalEventBody(e.target.value)} rows={3} className="font-mono text-xs" />
          </div>
        </>
      )
    },
    {
      id: 'register-vc-hash',
      section: 'onchain',
      title: 'POST /api/v1/dpp/{productId}/register-vc-hash',
      description: "Conceptually register a VC's hash on-chain for a DPP.",
      onSendRequest: handleMockRegisterVcHash,
      isLoading: isPostRegisterVcHashLoading,
      response: postRegisterVcHashResponse,
      codeSnippet: postRegisterVcHashCodeSnippet,
      snippetLanguage: postRegisterVcHashSnippetLang,
      onSnippetLanguageChange: (lang: string) => { setPostRegisterVcHashSnippetLang(lang); updateSnippet('registerVcHash','POST',lang,{productId: postRegisterVcHashProductId},postRegisterVcHashBody,setPostRegisterVcHashCodeSnippet); },
      children: (
        <>
          <div>
            <Label htmlFor="registerVcHashProductIdPlayground">Product ID (Path Parameter)</Label>
            <Input id="registerVcHashProductIdPlayground" value={postRegisterVcHashProductId} onChange={(e) => setPostRegisterVcHashProductId(e.target.value)} placeholder="e.g., DPP001" />
          </div>
          <div className="mt-2">
            <Label htmlFor="registerVcHashBodyPlayground">Request Body (JSON)</Label>
            <Textarea id="registerVcHashBodyPlayground" value={postRegisterVcHashBody} onChange={(e) => setPostRegisterVcHashBody(e.target.value)} rows={3} className="font-mono text-xs" />
          </div>
        </>
      )
    },
    {
      id: 'post-component-transfer',
      section: 'private',
      title: 'POST /api/v1/private/dpp/{productId}/component-transfer',
      description: '[Private Layer] Record a private B2B component transfer.',
      onSendRequest: handleMockPostComponentTransfer,
      isLoading: isPostComponentTransferLoading,
      response: postComponentTransferResponse,
      codeSnippet: postComponentTransferCodeSnippet,
      snippetLanguage: postComponentTransferSnippetLang,
      onSnippetLanguageChange: (lang: string) => { setPostComponentTransferSnippetLang(lang); updateSnippet('postComponentTransfer','POST',lang,{productId: postComponentTransferProductId},postComponentTransferBody,setPostComponentTransferCodeSnippet); },
      children: (
        <>
          <div>
            <Label htmlFor="componentTransferProductIdPlayground">Product ID (Path Parameter)</Label>
            <Input id="componentTransferProductIdPlayground" value={postComponentTransferProductId} onChange={(e) => setPostComponentTransferProductId(e.target.value)} placeholder="e.g., DPP001" />
          </div>
          <div className="mt-2">
            <Label htmlFor="componentTransferBodyPlayground">Request Body (JSON)</Label>
            <Textarea id="componentTransferBodyPlayground" value={postComponentTransferBody} onChange={(e) => setPostComponentTransferBody(e.target.value)} rows={8} className="font-mono text-xs" />
          </div>
        </>
      )
    },
    {
      id: 'zkp-submit-proof',
      section: 'zkp',
      title: 'POST /api/v1/zkp/submit-proof/{dppId}',
      description: '[ZKP Layer] Submit a Zero-Knowledge Proof for a DPP (Mock).',
      onSendRequest: handleMockZkpSubmitProof,
      isLoading: isZkpSubmitLoading,
      response: zkpSubmitResponse,
      codeSnippet: zkpSubmitCodeSnippet,
      snippetLanguage: zkpSubmitSnippetLang,
      onSnippetLanguageChange: (lang: string) => { setZkpSubmitSnippetLang(lang); updateSnippet('zkpSubmitProof','POST',lang,{dppId: zkpSubmitDppId},zkpSubmitBody,setZkpSubmitCodeSnippet); },
      children: (
        <>
          <div>
            <Label htmlFor="zkpSubmitDppIdPlayground">DPP ID (Path Parameter)</Label>
            <Input id="zkpSubmitDppIdPlayground" value={zkpSubmitDppId} onChange={(e) => setZkpSubmitDppId(e.target.value)} placeholder="e.g., DPP001" />
          </div>
          <div className="mt-2">
            <Label htmlFor="zkpSubmitBodyPlayground">Request Body (JSON)</Label>
            <Textarea id="zkpSubmitBodyPlayground" value={zkpSubmitBody} onChange={(e) => setZkpSubmitBody(e.target.value)} rows={5} className="font-mono text-xs" />
            <p className="text-xs text-muted-foreground mt-1">Body should include claimType, proofData, publicInputs. See API Reference.</p>
          </div>
        </>
      )
    },
    {
      id: 'zkp-verify-claim',
      section: 'zkp',
      title: 'GET /api/v1/zkp/verify-claim/{dppId}',
      description: '[ZKP Layer] Verify a ZKP claim for a DPP (Mock).',
      onSendRequest: handleMockZkpVerifyClaim,
      isLoading: isZkpVerifyLoading,
      response: zkpVerifyResponse,
      codeSnippet: zkpVerifyCodeSnippet,
      snippetLanguage: zkpVerifySnippetLang,
      onSnippetLanguageChange: (lang: string) => { setZkpVerifySnippetLang(lang); updateSnippet('zkpVerifyClaim','GET',lang,{dppId: zkpVerifyDppId, claimType: zkpVerifyClaimType},null,setZkpVerifyCodeSnippet); },
      children: (
        <>
          <div>
            <Label htmlFor="zkpVerifyDppIdPlayground">DPP ID (Path Parameter)</Label>
            <Input id="zkpVerifyDppIdPlayground" value={zkpVerifyDppId} onChange={(e) => setZkpVerifyDppId(e.target.value)} placeholder="e.g., DPP001" />
          </div>
          <div className="mt-2">
            <Label htmlFor="zkpVerifyClaimTypePlayground">Claim Type (Query Parameter)</Label>
            <Input id="zkpVerifyClaimTypePlayground" value={zkpVerifyClaimType} onChange={(e) => setZkpVerifyClaimType(e.target.value)} placeholder="e.g., material_compliance_svhc_lead_less_0.1" />
          </div>
        </>
      )
    },
    {
      id: 'mint-token',
      section: 'token',
      title: 'POST /api/v1/token/mint/{productId}',
      description: 'Mints a blockchain token representing the specified DPP.',
      onSendRequest: handleMockMintToken,
      isLoading: isMintTokenLoading,
      response: mintTokenResponsePlayground,
      codeSnippet: mintTokenCodeSnippet,
      snippetLanguage: mintTokenSnippetLang,
      onSnippetLanguageChange: (lang: string) => { setMintTokenSnippetLang(lang); updateSnippet('mintToken', 'POST', lang, { productId: mintTokenProductId }, mintTokenBody, setMintTokenCodeSnippet); },
      children: (
        <>
          <div><Label htmlFor="mintTokenProductIdPlayground">Product ID (Path Parameter)</Label><Input id="mintTokenProductIdPlayground" value={mintTokenProductId} onChange={(e) => setMintTokenProductId(e.target.value)} placeholder="e.g., DPP001" /></div>
          <div className="mt-2"><Label htmlFor="mintTokenBodyPlayground">Request Body (JSON)</Label><Textarea id="mintTokenBodyPlayground" value={mintTokenBody} onChange={(e) => setMintTokenBody(e.target.value)} rows={4} className="font-mono text-xs" /></div>
        </>
      )
    },
    {
      id: 'update-token-metadata',
      section: 'token',
      title: 'PATCH /api/v1/token/metadata/{tokenId}',
      description: 'Updates the on-chain metadata URI for a minted DPP token.',
      onSendRequest: handleMockUpdateTokenMetadata,
      isLoading: isUpdateTokenMetaLoading,
      response: updateTokenMetaResponse,
      codeSnippet: updateTokenMetaCodeSnippet,
      snippetLanguage: updateTokenMetaSnippetLang,
      onSnippetLanguageChange: (lang: string) => { setUpdateTokenMetaSnippetLang(lang); updateSnippet('updateTokenMetadata', 'PATCH', lang, { tokenId: updateTokenMetaTokenId }, updateTokenMetaBody, setUpdateTokenMetaCodeSnippet); },
      children: (
        <>
          <div><Label htmlFor="updateTokenMetaTokenIdPlayground">Token ID (Path Parameter)</Label><Input id="updateTokenMetaTokenIdPlayground" value={updateTokenMetaTokenId} onChange={(e) => setUpdateTokenMetaTokenId(e.target.value)} placeholder="e.g., 101" /></div>
          <div className="mt-2"><Label htmlFor="updateTokenMetaBodyPlayground">Request Body (JSON)</Label><Textarea id="updateTokenMetaBodyPlayground" value={updateTokenMetaBody} onChange={(e) => setUpdateTokenMetaBody(e.target.value)} rows={3} className="font-mono text-xs" /></div>
        </>
      )
    },
    {
      id: 'get-token-status',
      section: 'token',
      title: 'GET /api/v1/token/status/{tokenId}',
      description: 'Retrieves on-chain information for a DPP token.',
      onSendRequest: handleMockGetTokenStatus,
      isLoading: isGetTokenStatusLoading,
      response: getTokenStatusResponse,
      codeSnippet: getTokenStatusCodeSnippet,
      snippetLanguage: getTokenStatusSnippetLang,
      onSnippetLanguageChange: (lang: string) => { setGetTokenStatusSnippetLang(lang); updateSnippet('getTokenStatus', 'GET', lang, { tokenId: getTokenStatusTokenId }, null, setGetTokenStatusCodeSnippet); },
      children: (
        <div><Label htmlFor="getTokenStatusTokenIdPlayground">Token ID (Path Parameter)</Label><Input id="getTokenStatusTokenIdPlayground" value={getTokenStatusTokenId} onChange={(e) => setGetTokenStatusTokenId(e.target.value)} placeholder="e.g., 101" /></div>
      )
    }
  ] as const;

  const getUsageMetric = useCallback((metricType: 'calls' | 'errorRate') => {
    if (currentEnvironment === 'sandbox') {
        return metricType === 'calls' ? '1,234' : '0.2%';
    }
    return metricType === 'calls' ? '105,678' : '0.05%';
  }, [currentEnvironment]);

  const overallSystemStatus = useMemo(() => {
    const nonOperationalServices = systemStatusData.filter(s => s.status !== "Operational");
    if (nonOperationalServices.length === 0) {
      return { text: "All Systems Operational", icon: CheckCircle, color: "text-success" };
    }
    if (nonOperationalServices.some(s => s.status === "Degraded Performance" || s.status === "Under Maintenance")) {
      return { text: "Some Systems Impacted", icon: AlertTriangle, color: "text-warning" };
    }
    return { text: "Multiple Issues Detected", icon: ServerCrash, color: "text-danger" };
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
            <AlertTitle className="font-semibold text-info">API Playground Environment</AlertTitle>
            <AlertDescription>
              This playground interacts with the application's <strong>mock API backend</strong>. Responses are simulated based on predefined data (like MOCK_DPPS) and the logic in your <code className="text-xs bg-info/20 p-0.5 rounded-sm">/api/v1/...</code> routes.
              Using API Key: <Badge variant="outline" className="capitalize bg-info/20 border-info/40">SANDBOX_KEY_123</Badge> (This is used for all playground requests regardless of the environment dropdown above).
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
                    {endpointConfigs.filter(e => e.section === 'core').map(ep => (
                      <DeveloperEndpointCard key={ep.id} {...ep} codeSampleLanguages={codeSampleLanguages}>
                        {ep.children}
                      </DeveloperEndpointCard>
                    ))}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="dpp-utility">
                  <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">DPP Utility & Advanced Endpoints</AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-6">
                    {endpointConfigs.filter(e => e.section === 'utility').map(ep => (
                      <DeveloperEndpointCard key={ep.id} {...ep} codeSampleLanguages={codeSampleLanguages}>
                        {ep.children}
                      </DeveloperEndpointCard>
                    ))}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="dpp-onchain">
                  <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline flex items-center">
                    <Sigma className="mr-2 h-5 w-5" /> Conceptual On-Chain DPP Operations
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-6">
                    {endpointConfigs.filter(e => e.section === 'onchain').map(ep => (
                      <DeveloperEndpointCard key={ep.id} {...ep} codeSampleLanguages={codeSampleLanguages}>
                        {ep.children}
                      </DeveloperEndpointCard>
                    ))}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="dpp-token">
                  <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline flex items-center">
                    <KeyRound className="mr-2 h-5 w-5" /> DPP Token Operations (Conceptual)
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-6">
                    {endpointConfigs.filter(e => e.section === 'token').map(ep => (
                      <DeveloperEndpointCard key={ep.id} {...ep} codeSampleLanguages={codeSampleLanguages}>
                        {ep.children}
                      </DeveloperEndpointCard>
                    ))}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="private-layer">
                  <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline flex items-center">
                    <Layers3 className="mr-2 h-5 w-5" /> Private Layer Endpoints (Conceptual)
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-6">
                    {endpointConfigs.filter(e => e.section === 'private').map(ep => (
                      <DeveloperEndpointCard key={ep.id} {...ep} codeSampleLanguages={codeSampleLanguages}>
                        {ep.children}
                      </DeveloperEndpointCard>
                    ))}
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="zkp-layer">
                  <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline flex items-center">
                    <ZapIcon className="mr-2 h-5 w-5" /> ZKP Layer Endpoints (Conceptual)
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-6">
                    {endpointConfigs.filter(e => e.section === 'zkp').map(ep => (
                      <DeveloperEndpointCard key={ep.id} {...ep} codeSampleLanguages={codeSampleLanguages}>
                        {ep.children}
                      </DeveloperEndpointCard>
                    ))}
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

        <TabsContent value="resources" className="mt-6">
          <ResourcesTab />
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

```
```

I've implemented the enhancements for the Developer Portal Dashboard (Task 15).

Key changes include:
1.  Created five new functional components in `src/components/developer/dashboard/`:
    *   `ApiMetricsCard.tsx`
    *   `PlatformNewsCard.tsx`
    *   `ServiceStatusCard.tsx`
    *   `DataFlowKpisCard.tsx`
    *   `QuickActionsCard.tsx`
2.  Integrated these components into the "Dashboard" tab of the Developer Portal page (`src/app/(app)/developer/page.tsx`).
3.  Added mock data arrays within `src/app/(app)/developer/page.tsx` to populate these new dashboard cards.
4.  The `ApiMetricsCard` now shows conceptual API usage based on the selected `currentEnvironment`.
5.  The `ServiceStatusCard` includes a mock "Refresh" button and displays a "Last Checked" time.
6.  The `QuickActionsCard` buttons are now functional for tab switching within the Developer Portal using a new handler `handleDashboardQuickActionTabChange`.

The Developer Portal dashboard should now be much more informative and provide a better overview for developers.