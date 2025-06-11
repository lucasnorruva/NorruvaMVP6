
"use client";

import React, { useEffect, useState, FormEvent, useCallback, useMemo } from "react";
import Link from "next/link"; // Added this import
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    Fingerprint, ShieldCheck, InfoIcon as InfoIconLucide, AlertCircle, Anchor, Link2, Edit, UploadCloud, 
    KeyRound, FileText, Send, Loader2, HelpCircle, ExternalLink, FileJson, PlayCircle, Package, 
    PlusCircle, CalendarDays, Sigma, Layers3, Tag, CheckCircle as CheckCircleLucide, 
    Server as ServerIcon, Link as LinkIconPath, FileCog, BookOpen, CircleDot, Clock, Share2, Users, Factory, Truck, ShoppingCart, Recycle as RecycleIconLucide, Upload, MessageSquare
} from "lucide-react";
import type { DigitalProductPassport, VerifiableCredentialReference, MintTokenResponse, UpdateTokenMetadataResponse, TokenStatusResponse } from "@/types/dpp";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { Separator } from "@/components/ui/separator";

const EBSI_EXPLORER_BASE_URL = "https://mock-ebsi-explorer.example.com/tx/";
const TOKEN_EXPLORER_BASE_URL = "https://mock-token-explorer.example.com/tx/";
const MOCK_API_KEY = "SANDBOX_KEY_123";

const getEbsiStatusBadge = (status?: "verified" | "pending_verification" | "not_verified" | "error" | string) => {
  let Icon = InfoIconLucide;
  let classes = "bg-muted text-muted-foreground";
  let text = "Unknown";

  switch (status?.toLowerCase()) {
    case "verified":
      Icon = ShieldCheck;
      classes = "bg-green-500/20 text-green-700 border-green-500/30";
      text = "Verified";
      break;
    case "pending":
    case "pending_verification":
      Icon = InfoIconLucide;
      classes = "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
      text = "Pending";
      break;
    case "not_verified":
      Icon = AlertCircle;
      classes = "bg-orange-500/20 text-orange-700 border-orange-500/30";
      text = "Not Verified";
      break;
    case "error":
      Icon = AlertCircle;
      classes = "bg-red-500/20 text-red-700 border-red-500/30";
      text = "Error";
      break;
    default:
      Icon = HelpCircle;
      text = status ? status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ') : "Unknown";
      break;
  }
  return <Badge variant="outline" className={cn("capitalize", classes)}><Icon className="mr-1.5 h-3.5 w-3.5" />{text}</Badge>;
};

function BlockchainStatus({ product }: { product: DigitalProductPassport }) {
  const hasBlockchainInfo = product.blockchainIdentifiers?.platform || product.blockchainIdentifiers?.contractAddress || product.blockchainIdentifiers?.tokenId || product.blockchainIdentifiers?.anchorTransactionHash;
  const hasEbsiInfo = product.ebsiVerification?.status || product.ebsiVerification?.verificationId || product.ebsiVerification?.issuerDid || product.ebsiVerification?.schema || product.ebsiVerification?.issuanceDate;

  return (
    <div className="space-y-3 text-xs">
      {hasBlockchainInfo && (
        <div>
          <h4 className="text-sm font-semibold text-primary mb-1.5 flex items-center"><LinkIconPath className="h-4 w-4 mr-1.5"/>Blockchain Identifiers</h4>
          {product.blockchainIdentifiers?.platform && (
            <div className="flex items-center gap-1 mb-0.5"><Layers3 className="h-3.5 w-3.5 text-muted-foreground"/><span className="text-muted-foreground">Platform:</span><span className="text-foreground/90">{product.blockchainIdentifiers.platform}</span></div>
          )}
          {product.blockchainIdentifiers?.contractAddress && (
            <div className="flex items-center gap-1 mb-0.5"><FileCog className="h-3.5 w-3.5 text-muted-foreground"/><span className="text-muted-foreground">Contract:</span><span className="font-mono break-all text-foreground/90">{product.blockchainIdentifiers.contractAddress}</span></div>
          )}
           {product.blockchainIdentifiers?.tokenId && (
            <div className="flex items-center gap-1 mb-0.5"><Tag className="h-3.5 w-3.5 text-muted-foreground"/><span className="text-muted-foreground">Token ID:</span><span className="font-mono break-all text-foreground/90">{product.blockchainIdentifiers.tokenId}</span></div>
          )}
          {product.blockchainIdentifiers?.anchorTransactionHash && (
            <>
              <div className="flex items-center gap-1 mb-0.5"><Anchor className="h-3.5 w-3.5 text-muted-foreground"/><span className="text-muted-foreground">Anchor Tx:</span><span className="font-mono break-all text-foreground/90" title={product.blockchainIdentifiers.anchorTransactionHash!}>{product.blockchainIdentifiers.anchorTransactionHash.substring(0,10)}...{product.blockchainIdentifiers.anchorTransactionHash.slice(-8)}</span></div>
              <div className="flex items-center gap-1"><ExternalLink className="h-3.5 w-3.5 text-muted-foreground"/><span className="text-muted-foreground">Explorer:</span><a href={`${TOKEN_EXPLORER_BASE_URL}${product.blockchainIdentifiers.anchorTransactionHash}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View on Mock Explorer <ExternalLink className="inline h-3 w-3 ml-0.5" /></a></div>
            </>
          )}
        </div>
      )}
      
      {hasEbsiInfo && (
        <div className={cn(hasBlockchainInfo && "mt-2 pt-2 border-t border-border/30")}>
            <h4 className="text-sm font-semibold text-primary mb-1.5 flex items-center"><ShieldCheck className="h-4 w-4 mr-1.5"/>EBSI Verification</h4>
            {product.ebsiVerification?.status && (
              <div className="flex items-center gap-1 mb-0.5"><Sigma className="h-3.5 w-3.5 text-muted-foreground"/><span className="text-muted-foreground">Status:</span><div className="flex items-center mt-0.5">{getEbsiStatusBadge(product.ebsiVerification.status)}</div></div>
            )}
            {product.ebsiVerification?.verificationId && (
              <div className="flex items-center gap-1 mb-0.5"><Fingerprint className="h-3.5 w-3.5 text-muted-foreground"/><span className="text-muted-foreground">Verification ID:</span><span className="font-mono text-foreground/90 break-all">{product.ebsiVerification.verificationId}</span></div>
            )}
            {product.ebsiVerification?.issuerDid && (<div className="flex items-center gap-1 mb-0.5"><Users className="h-3.5 w-3.5 text-muted-foreground"/><span className="text-muted-foreground">Issuer DID:</span><span className="font-mono text-foreground/90 break-all">{product.ebsiVerification.issuerDid}</span></div>)}
            {product.ebsiVerification?.schema && (<div className="flex items-center gap-1 mb-0.5"><FileJson className="h-3.5 w-3.5 text-muted-foreground"/><span className="text-muted-foreground">Schema:</span><span className="font-mono text-foreground/90 break-all">{product.ebsiVerification.schema}</span></div>)}
            {product.ebsiVerification?.issuanceDate && (<div className="flex items-center gap-1 mb-0.5"><CalendarDays className="h-3.5 w-3.5 text-muted-foreground"/><span className="text-muted-foreground">Issued:</span><span className="font-mono text-foreground/90 break-all">{new Date(product.ebsiVerification.issuanceDate).toLocaleString()}</span></div>)}
        </div>
      )}
      
      {!hasBlockchainInfo && !hasEbsiInfo && (
        <p className="text-muted-foreground text-sm">No specific blockchain or EBSI verification details available for this product.</p>
      )}
    </div>
  );
}

const getTokenStatusVisuals = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes("minted") || s.includes("active")) return { icon: CheckCircleLucide, color: "text-green-600", badge: "default" as const };
  if (s.includes("transferred")) return { icon: Send, color: "text-blue-500", badge: "outline" as const };
  if (s.includes("burned") || s.includes("locked")) return { icon: AlertCircle, color: "text-red-600", badge: "destructive" as const };
  return { icon: InfoIconLucide, color: "text-muted-foreground", badge: "secondary" as const };
};


export default function BlockchainPage() {
  const [filter, setFilter] = useState<"all" | "anchored" | "not_anchored">("all");
  const [dpps, setDpps] = useState<DigitalProductPassport[]>([]);
  const [selected, setSelected] = useState<DigitalProductPassport | null>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState<string | boolean>(false);

  const [anchorPlatform, setAnchorPlatform] = useState("EBSI");
  const [custodyStep, setCustodyStep] = useState({ stepName: "", actorDid: "", timestamp: "", location: "", transactionHash: "" });
  const [transferName, setTransferName] = useState("");
  const [transferDid, setTransferDid] = useState("");
  const [transferTime, setTransferTime] = useState("");

  const [fetchedCredential, setFetchedCredential] = useState<any | null>(null);

  const [mintContractAddress, setMintContractAddress] = useState("0xABCDEF123456");
  const [mintRecipientAddress, setMintRecipientAddress] = useState("0x1234567890");
  const [mintMetadataUri, setMintMetadataUri] = useState("ipfs://sample-metadata-uri");
  const [mintResponse, setMintResponse] = useState<MintTokenResponse | null>(null);
  const [isMintingToken, setIsMintingToken] = useState(false);

  const [updateTokenId, setUpdateTokenId] = useState("");
  const [updateMetadataUri, setUpdateMetadataUri] = useState("ipfs://new-metadata-uri");
  const [updateTokenResponse, setUpdateTokenResponse] = useState<UpdateTokenMetadataResponse | null>(null);
  const [isUpdatingTokenMeta, setIsUpdatingTokenMeta] = useState(false);

  const [statusTokenId, setStatusTokenId] = useState("");
  const [statusTokenResponse, setStatusTokenResponse] = useState<string | null>(null); // Store raw response for display
  const [isGettingTokenStatus, setIsGettingTokenStatus] = useState(false);
  const [parsedTokenStatus, setParsedTokenStatus] = useState<TokenStatusResponse | null>(null); // Store parsed response for display


  const handleApiError = useCallback(async (response: Response, action: string) => {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { error: { message: "Failed to parse error response." } };
    }
    toast({
      title: `${action} Failed`,
      description: `${errorData?.error?.message || `An unexpected error occurred during ${action.toLowerCase()}.`} (Status: ${response.status})`,
      variant: "destructive",
    });
  }, [toast]);

 useEffect(() => {
    setIsLoading(true);
    fetch(`/api/v1/dpp?blockchainAnchored=${filter}`, {
        headers: { Authorization: `Bearer ${MOCK_API_KEY}` }
    })
      .then(async res => {
        if (!res.ok) {
           const errorBody = await res.json().catch(() => ({ error: { message: "Failed to parse error response." }}));
           toast({title: "Error fetching DPPs", description: errorBody?.error?.message || `Status: ${res.status}`, variant: "destructive"});
           setDpps([]); 
           return { data: [], error: { message: errorBody?.error?.message || `Error fetching DPPs: ${res.status}` }};
        }
        return res.json();
      })
      .then(data => {
        if(data && data.error && data.error.message) {
             setDpps(data.data || []);
        } else if (data && Array.isArray(data.data)) {
          setDpps(data.data);
        } else {
          console.error("Unexpected data structure received for DPPs:", data);
          toast({title: "Data Error", description: "Received unexpected data format for DPPs.", variant: "destructive"});
          setDpps([]);
        }
      })
      .catch(err => {
        toast({title: "Fetching DPPs Failed", description: err.message || "Network error or failed to parse response.", variant: "destructive"});
        setDpps([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [filter, toast]);

  const handleSelectProduct = (dpp: DigitalProductPassport | null) => {
    setSelected(dpp);
    if (dpp && dpp.blockchainIdentifiers?.tokenId) {
      setUpdateTokenId(dpp.blockchainIdentifiers.tokenId);
      setStatusTokenId(dpp.blockchainIdentifiers.tokenId);
    } else {
      setUpdateTokenId("");
      setStatusTokenId("");
    }
    setFetchedCredential(null);
    setMintResponse(null);
    setUpdateTokenResponse(null);
    setStatusTokenResponse(null);
    setParsedTokenStatus(null);
  };

  const updateDppLocally = (updated: DigitalProductPassport) => {
    setDpps(prev => prev.map(d => (d.id === updated.id ? updated : d)));
    if (selected && selected.id === updated.id) {
      setSelected(updated); 
      if (updated.blockchainIdentifiers?.tokenId) { 
          setUpdateTokenId(updated.blockchainIdentifiers.tokenId);
          setStatusTokenId(updated.blockchainIdentifiers.tokenId);
      }
    }
  };

  const handleAnchor = async (e: FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    if (!anchorPlatform) {
        toast({ title: "Validation Error", description: "Please enter a blockchain platform.", variant: "destructive" });
        return;
    }
    setIsActionLoading("anchor");
    const res = await fetch(`/api/v1/dpp/anchor/${selected.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${MOCK_API_KEY}` },
      body: JSON.stringify({ platform: anchorPlatform }),
    });
    if (res.ok) {
      const data: DigitalProductPassport = await res.json();
      updateDppLocally(data);
      toast({ title: "DPP Anchored", description: `Product ${selected.productName} successfully anchored to ${anchorPlatform}. Mock contract, token ID, and tx hash also set.` });
    } else {
      handleApiError(res, "Anchoring DPP");
    }
    setIsActionLoading(false);
  };

  const handleAddCustody = async (e: FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    if (!custodyStep.stepName || !custodyStep.actorDid || !custodyStep.timestamp) {
        toast({ title: "Validation Error", description: "Please fill in step name, actor DID, and timestamp.", variant: "destructive" });
        return;
    }
    setIsActionLoading("custody");
    const res = await fetch(`/api/v1/dpp/custody/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${MOCK_API_KEY}` },
      body: JSON.stringify(custodyStep),
    });
    if (res.ok) {
      const data: DigitalProductPassport = await res.json();
      updateDppLocally(data);
      setCustodyStep({ stepName: "", actorDid: "", timestamp: "", location: "", transactionHash: "" });
      toast({ title: "Custody Updated", description: `New custody step added to ${selected.productName}.` });
    } else {
      handleApiError(res, "Updating Custody");
    }
    setIsActionLoading(false);
  };

  const handleTransfer = async (e: FormEvent) => {
    e.preventDefault();
    if (!selected) {
        toast({ title: "No Product Selected", description: "Please select a product to transfer ownership.", variant: "destructive" });
        return;
    }
    if (!transferName || !transferTime) { 
        toast({ title: "Validation Error", description: "Please fill in new owner name and transfer timestamp.", variant: "destructive" });
        return;
    }
    
    setIsActionLoading("transfer");
    const res = await fetch(`/api/v1/dpp/transfer-ownership/${selected.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${MOCK_API_KEY}` },
      body: JSON.stringify({ newOwner: {name: transferName, did: transferDid || undefined }, transferTimestamp: transferTime }),
    });
    if (res.ok) {
      const data: DigitalProductPassport = await res.json();
      updateDppLocally(data);
      setTransferName("");
      setTransferDid("");
      setTransferTime("");
      toast({ title: "Ownership Transferred", description: `Ownership of ${selected.productName} transferred to ${transferName}.` });
    } else {
      handleApiError(res, "Transferring Ownership");
    }
    setIsActionLoading(false);
  };

  const fetchAndDisplayCredential = async (productId: string) => {
    setIsActionLoading("fetchCredential");
    setFetchedCredential(null);
    const res = await fetch(`/api/v1/dpp/${productId}/credential`, {
        headers: { Authorization: `Bearer ${MOCK_API_KEY}` }
    });
    if (res.ok) {
      const data = await res.json();
      setFetchedCredential(data);
      toast({ title: "Credential Retrieved", description: "Verifiable credential data fetched and displayed." });
    } else {
      handleApiError(res, "Fetching Credential");
      setFetchedCredential({ error: "Failed to fetch credential." });
    }
    setIsActionLoading(false);
  };

  const handleMintToken = async (e: FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setIsMintingToken(true);
    setMintResponse(null);
    try {
      const res = await fetch(`/api/v1/token/mint/${selected.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${MOCK_API_KEY}` },
        body: JSON.stringify({ contractAddress: mintContractAddress, recipientAddress: mintRecipientAddress, metadataUri: mintMetadataUri }),
      });
      const data: MintTokenResponse = await res.json();
      setMintResponse(data); 
      if (res.ok && data.tokenId && selected) {
        toast({ title: "Token Mint Initiated (Mock)", description: `Token ${data.tokenId} for ${selected.productName} minted. Tx: ${data.transactionHash}` });
        const updatedSelectedDpp: DigitalProductPassport = {
            ...selected,
            blockchainIdentifiers: {
                ...(selected.blockchainIdentifiers || {}),
                tokenId: data.tokenId,
                contractAddress: data.contractAddress || selected.blockchainIdentifiers?.contractAddress, 
            }
        };
        updateDppLocally(updatedSelectedDpp);
      } else {
        handleApiError(res, "Minting Token");
      }
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "An unknown error occurred";
        setMintResponse({ error: "Client-side error", message: errorMsg } as any);
        toast({ title: "Minting Token Failed", description: errorMsg, variant: "destructive" });
    }
    setIsMintingToken(false);
  };

  const handleUpdateTokenMetadata = async (e: FormEvent) => {
    e.preventDefault();
    if (!updateTokenId) {
        toast({ title: "Token ID Required", description: "Please enter a Token ID to update metadata.", variant: "destructive" });
        return;
    }
    setIsUpdatingTokenMeta(true);
    setUpdateTokenResponse(null);
    try {
        const res = await fetch(`/api/v1/token/metadata/${updateTokenId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${MOCK_API_KEY}` },
        body: JSON.stringify({ metadataUri: updateMetadataUri, contractAddress: selected?.blockchainIdentifiers?.contractAddress || "0xUpdatedContractIfDifferent" }),
        });
        const data: UpdateTokenMetadataResponse = await res.json();
        setUpdateTokenResponse(data);
        if (res.ok) {
        toast({ title: "Token Metadata Update Initiated (Mock)", description: `Metadata for token ${updateTokenId} updated. Tx: ${data.transactionHash}` });
        } else {
        handleApiError(res, "Updating Token Metadata");
        }
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "An unknown error occurred";
        setUpdateTokenResponse({ error: "Client-side error", message: errorMsg } as any);
        toast({ title: "Updating Token Metadata Failed", description: errorMsg, variant: "destructive" });
    }
    setIsUpdatingTokenMeta(false);
  };
  
  const handleGetTokenStatus = async (e: FormEvent) => {
    e.preventDefault();
    if (!statusTokenId) {
        toast({ title: "Token ID Required", description: "Please enter a Token ID to get its status.", variant: "destructive" });
        return;
    }
    setIsGettingTokenStatus(true);
    setStatusTokenResponse(null);
    setParsedTokenStatus(null);
    try {
        const res = await fetch(`/api/v1/token/status/${statusTokenId}`, {
        headers: { Authorization: `Bearer ${MOCK_API_KEY}` },
        });
        const data: TokenStatusResponse = await res.json();
        setStatusTokenResponse(JSON.stringify(data, null, 2));
        if (res.ok) {
          setParsedTokenStatus(data); 
          toast({ title: "Token Status Retrieved (Mock)", description: `Status for token ${statusTokenId} displayed.` });
        } else {
          handleApiError(res, "Getting Token Status");
        }
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "An unknown error occurred";
        setStatusTokenResponse(JSON.stringify({ error: "Client-side error", message: errorMsg }, null, 2));
        toast({ title: "Getting Token Status Failed", description: errorMsg, variant: "destructive" });
    }
    setIsGettingTokenStatus(false);
  };

  const renderApiResult = (title: string, responseString: string | null | object, isErrorResponse?: boolean) => {
    if (!responseString) return null;
    let displayString: string;
    let parsedContent: any = null;

    if (typeof responseString === 'string') {
        displayString = responseString;
        try {
            parsedContent = JSON.parse(displayString);
        } catch (e) { /* ignore parsing error for raw string display */ }
    } else {
        displayString = JSON.stringify(responseString, null, 2);
        parsedContent = responseString;
    }
    
    if (title.includes("Credential") && parsedContent && parsedContent['@context'] && !isErrorResponse) {
        return (
            <details className="mt-2 text-xs">
                <summary className="cursor-pointer text-muted-foreground hover:text-foreground">View Parsed & Raw Credential Response</summary>
                <div className="mt-1 p-3 border rounded-md bg-muted/30 space-y-1.5">
                    <div className="font-medium">Credential Details:</div>
                    {parsedContent.id && <div className="flex items-center gap-1"><FileText className="h-3 w-3 text-muted-foreground"/><strong>ID:</strong> <span className="font-mono break-all">{parsedContent.id}</span></div>}
                    {parsedContent.type && Array.isArray(parsedContent.type) && <div className="flex items-center gap-1"><Sigma className="h-3 w-3 text-muted-foreground"/><strong>Type:</strong> {parsedContent.type.join(', ')}</div>}
                    {parsedContent.issuer && <div className="flex items-center gap-1"><Factory className="h-3 w-3 text-muted-foreground"/><strong>Issuer:</strong> <span className="font-mono break-all">{parsedContent.issuer}</span></div>}
                    {parsedContent.issuanceDate && <div className="flex items-center gap-1"><CalendarDays className="h-3 w-3 text-muted-foreground"/><strong>Issued:</strong> {new Date(parsedContent.issuanceDate).toLocaleString()}</div>}
                    {parsedContent.credentialSubject && (
                        <div className="flex items-start gap-1"><Users className="h-3 w-3 text-muted-foreground mt-0.5"/><strong>Subject:</strong> <pre className="font-mono break-all text-xs bg-background/50 p-1 rounded max-w-full overflow-x-auto">{JSON.stringify(parsedContent.credentialSubject, null, 1).substring(0,200)}...</pre></div>
                    )}
                </div>
                <pre className="mt-2 p-2 bg-muted/50 text-muted-foreground rounded overflow-x-auto max-h-60">
                    <code suppressHydrationWarning>{displayString}</code>
                </pre>
            </details>
        );
    }

    return (
        <details className="mt-2 text-xs">
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">View Mock {title} Response (Raw JSON)</summary>
            <pre className="mt-1 p-2 bg-muted/50 text-muted-foreground rounded overflow-x-auto max-h-60">
                <code suppressHydrationWarning>{displayString}</code>
            </pre>
        </details>
    );
  };


  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-headline font-semibold">Blockchain Management</h1>

      <Card className="shadow-md bg-muted/30 border-primary/10">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center">
            <InfoIconLucide className="mr-3 h-6 w-6 text-primary" />
            About Blockchain Management
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-foreground/90 space-y-2">
          <p>
           This page provides tools to manage on-chain aspects of your Digital Product Passports (DPPs). You can simulate:
          </p>
          <ul className="list-disc list-inside pl-4 space-y-1">
            <li><strong>Anchoring DPPs:</strong> Recording DPP data hashes and key identifiers on a mock blockchain.</li>
            <li><strong>Updating Chain of Custody:</strong> Documenting product transfers and lifecycle events.</li>
            <li><strong>Transferring Ownership:</strong> Modifying DPP ownership records.</li>
            <li><strong>Managing Verifiable Credentials:</strong> Viewing and retrieving product-related VCs.</li>
            <li><strong>DPP Token Operations:</strong> Conceptual minting, metadata updates, and status checks for DPP tokens.</li>
          </ul>
          <p className="mt-2">
            These operations interact with mock API endpoints. For technical details, refer to the 
            <a href="/openapi.yaml" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium ml-1">
              OpenAPI Specification <ExternalLink className="inline h-3.5 w-3.5 ml-0.5" />
            </a>.
          </p>
        </CardContent>
      </Card>

      <div className="max-w-xs">
        <Label htmlFor="anchoring-filter">Filter by Anchoring Status</Label>
        <Select value={filter} onValueChange={v => setFilter(v as any)}>
          <SelectTrigger id="anchoring-filter">
            <SelectValue placeholder="Select anchoring status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All DPPs</SelectItem>
            <SelectItem value="anchored">Anchored DPPs</SelectItem>
            <SelectItem value="not_anchored">Not Anchored DPPs</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Digital Product Passports</CardTitle>
          <CardDescription>View and manage blockchain-related aspects of DPPs.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-3 text-muted-foreground">Loading DPPs...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Anchoring Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dpps.map(dpp => (
                  <React.Fragment key={dpp.id}>
                    <TableRow className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">{dpp.id}</TableCell>
                      <TableCell>{dpp.productName}</TableCell>
                      <TableCell>
                        {dpp.blockchainIdentifiers?.anchorTransactionHash ? (
                          <Badge className="bg-green-100 text-green-700 border-green-300"><ShieldCheck className="mr-1 h-3 w-3"/>Anchored</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-muted text-muted-foreground"><Link2 className="mr-1 h-3 w-3"/>Not Anchored</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleSelectProduct(selected?.id === dpp.id ? null : dpp)}>
                          {selected?.id === dpp.id ? "Hide Details" : "Manage"}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {selected?.id === dpp.id && (
                      <TableRow>
                        <TableCell colSpan={4} className="py-4">
                          <div className="p-4 border rounded-md space-y-6 bg-card">
                            <h3 className="text-lg font-semibold text-primary mb-2">Managing: {selected.productName} ({selected.id})</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <Card className="bg-background">
                                    <CardHeader>
                                    <CardTitle className="text-md flex items-center">
                                        <Fingerprint className="h-5 w-5 mr-2 text-info" />
                                        Blockchain & EBSI Details
                                        <TooltipProvider delayDuration={100}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                            <HelpCircle className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
                                            </TooltipTrigger>
                                            <TooltipContent className="max-w-xs">
                                            <p className="text-xs">
                                                Blockchain anchoring provides an immutable record of the DPP's data integrity. 
                                                EBSI (European Blockchain Services Infrastructure) verification enhances trust using verifiable credentials.
                                            </p>
                                            </TooltipContent>
                                        </Tooltip>
                                        </TooltipProvider>
                                    </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <BlockchainStatus product={dpp} />
                                    </CardContent>
                                </Card>

                                {selected.blockchainIdentifiers?.anchorTransactionHash ? (
                                  <Card className="bg-background">
                                    <CardHeader><CardTitle className="text-md flex items-center"><Anchor className="mr-2 h-4 w-4 text-green-600"/>DPP Anchoring Status</CardTitle></CardHeader>
                                    <CardContent className="space-y-1.5 text-sm">
                                      <p className="font-medium text-green-700">Product is Anchored.</p>
                                      {selected.blockchainIdentifiers.platform && <p><strong className="text-muted-foreground">Platform:</strong> {selected.blockchainIdentifiers.platform}</p>}
                                      {selected.blockchainIdentifiers.contractAddress && <p><strong className="text-muted-foreground">Contract:</strong> <span className="font-mono text-xs break-all">{selected.blockchainIdentifiers.contractAddress}</span></p>}
                                      {selected.blockchainIdentifiers.tokenId && <p><strong className="text-muted-foreground">Token ID:</strong> <span className="font-mono text-xs break-all">{selected.blockchainIdentifiers.tokenId}</span></p>}
                                      <p><strong className="text-muted-foreground">Tx Hash:</strong> <span className="font-mono text-xs break-all">{selected.blockchainIdentifiers.anchorTransactionHash}</span></p>
                                      <a href={`${TOKEN_EXPLORER_BASE_URL}${selected.blockchainIdentifiers.anchorTransactionHash}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs inline-flex items-center">
                                        View on Mock Explorer <ExternalLink className="inline h-3 w-3 ml-1" />
                                      </a>
                                    </CardContent>
                                  </Card>
                                ) : (
                                  <Card className="bg-background">
                                    <CardHeader><CardTitle className="text-md flex items-center"><Anchor className="mr-2 h-4 w-4 text-info"/>Anchor DPP on Blockchain</CardTitle></CardHeader>
                                    <CardContent>
                                      <form onSubmit={handleAnchor} className="flex flex-wrap gap-2 items-end">
                                        <Input value={anchorPlatform} onChange={e => setAnchorPlatform(e.target.value)} placeholder="Blockchain Platform (e.g., EBSI)" className="flex-grow sm:flex-grow-0 sm:w-60" />
                                        <Button type="submit" size="sm" disabled={isActionLoading === "anchor" || !anchorPlatform.trim()}>
                                            {isActionLoading === "anchor" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Anchor className="mr-2 h-4 w-4"/>}
                                            {isActionLoading === "anchor" ? "Anchoring..." : "Anchor Product"}
                                        </Button>
                                      </form>
                                    </CardContent>
                                  </Card>
                                )}

                                <Card className="bg-background">
                                  <CardHeader><CardTitle className="text-md flex items-center"><Edit className="mr-2 h-4 w-4 text-info"/>Update Chain of Custody</CardTitle></CardHeader>
                                  <CardContent>
                                    <h4 className="font-medium mb-2 text-sm">Current Steps:</h4>
                                    <ul className="space-y-2 text-xs mb-3 max-h-32 overflow-y-auto border p-2 rounded-md bg-muted/30">
                                        {dpp.traceability?.supplyChainSteps?.length ? (
                                          (dpp.traceability.supplyChainSteps || []).map((step, idx) => (
                                          <li key={idx} className="p-1.5 border-b last:border-b-0 bg-background/50 rounded-sm">
                                            <div className="font-semibold">{step.stepName}</div>
                                            <div className="text-muted-foreground">Timestamp: {new Date(step.timestamp).toLocaleString()}</div>
                                            <div className="text-muted-foreground">Actor DID: <span className="font-mono break-all">{step.actorDid || 'N/A'}</span></div>
                                            {step.location && <div className="text-muted-foreground">Location: {step.location}</div>}
                                            {step.transactionHash && <div className="text-muted-foreground">Tx Hash: <span className="font-mono break-all">{step.transactionHash}</span></div>}
                                          </li>
                                        ))
                                      ) : (
                                        <li className="text-muted-foreground text-center py-2">No custody steps recorded.</li>
                                      )}
                                    </ul>
                                    <form onSubmit={handleAddCustody} className="mt-2 space-y-3">
                                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 items-end">
                                        <Input placeholder="Step Name" value={custodyStep.stepName} onChange={e => setCustodyStep({ ...custodyStep, stepName: e.target.value })} />
                                        <Input placeholder="Actor DID" value={custodyStep.actorDid} onChange={e => setCustodyStep({ ...custodyStep, actorDid: e.target.value })} />
                                        <Input type="datetime-local" value={custodyStep.timestamp} onChange={e => setCustodyStep({ ...custodyStep, timestamp: e.target.value })} />
                                        <Input placeholder="Location (Optional)" value={custodyStep.location} onChange={e => setCustodyStep({ ...custodyStep, location: e.target.value })} />
                                        <Input placeholder="Tx Hash (Optional)" value={custodyStep.transactionHash} onChange={e => setCustodyStep({ ...custodyStep, transactionHash: e.target.value })} />
                                        <Button type="submit" size="sm" className="sm:col-start-3 md:col-start-auto" disabled={isActionLoading === "custody"}>
                                            {isActionLoading === "custody" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4"/>}
                                            {isActionLoading === "custody" ? "Adding Step..." : "Add Custody Step"}
                                        </Button>
                                      </div>
                                    </form>
                                  </CardContent>
                                </Card>
                                
                                <Card className="bg-background">
                                  <CardHeader><CardTitle className="text-md flex items-center"><FileText className="mr-2 h-4 w-4 text-info"/>Verifiable Credentials</CardTitle></CardHeader>
                                  <CardContent>
                                     <h4 className="font-medium mb-1.5 text-sm">Linked VCs in Product Data:</h4>
                                    {dpp.verifiableCredentials && dpp.verifiableCredentials.length > 0 ? (
                                      <ul className="space-y-2 text-xs mb-3 max-h-40 overflow-y-auto border p-2 rounded-md bg-muted/30">
                                        {dpp.verifiableCredentials.map((vc, idx) => (
                                          <li key={idx} className="border-b last:border-b-0 pb-1.5 p-1.5 bg-background/50 rounded-sm">
                                            <p className="font-semibold">{vc.name || vc.type.join(', ')}</p>
                                            <p className="truncate" title={vc.id}><strong className="text-muted-foreground">ID:</strong> <span className="font-mono">{vc.id.substring(0,30)}...</span></p>
                                            <p><strong className="text-muted-foreground">Issuer:</strong> <span className="font-mono break-all">{vc.issuer}</span></p>
                                            <p><strong className="text-muted-foreground">Issued:</strong> {new Date(vc.issuanceDate).toLocaleDateString()}</p>
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p className="text-xs text-muted-foreground mb-2">No verifiable credentials directly linked in main product record.</p>
                                    )}
                                    <Button size="sm" variant="secondary" onClick={() => fetchAndDisplayCredential(dpp.id)} className="w-full sm:w-auto" disabled={isActionLoading === "fetchCredential"}>
                                      {isActionLoading === "fetchCredential" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4"/>}
                                       {isActionLoading === "fetchCredential" ? "Fetching..." : "Get Specific Credential (Mock)"}
                                    </Button>
                                    {renderApiResult("Fetched Credential", fetchedCredential, !!(fetchedCredential && fetchedCredential.error))}
                                  </CardContent>
                                </Card>

                                <Card className="bg-background">
                                    <CardHeader><CardTitle className="text-md flex items-center"><UploadCloud className="mr-2 h-4 w-4 text-info"/>Transfer Ownership</CardTitle></CardHeader>
                                    <CardContent>
                                      <form onSubmit={handleTransfer} className="space-y-3">
                                        <Input placeholder="New Owner Name" value={transferName} onChange={e => setTransferName(e.target.value)} />
                                        <Input placeholder="New Owner DID (Optional)" value={transferDid} onChange={e => setTransferDid(e.target.value)} />
                                        <Input type="datetime-local" value={transferTime} onChange={e => setTransferTime(e.target.value)} />
                                        <Button type="submit" size="sm" className="w-full" disabled={isActionLoading === "transfer"}>
                                            {isActionLoading === "transfer" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                            {isActionLoading === "transfer" ? "Transferring..." : "Transfer Ownership"}
                                        </Button>
                                      </form>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card className="bg-background mt-6">
                                <CardHeader>
                                  <CardTitle className="text-md flex items-center"><KeyRound className="mr-2 h-4 w-4 text-info"/>DPP Token Operations (Conceptual)</CardTitle>
                                  <CardDescription className="text-xs">
                                      These operations simulate interactions with smart contracts. 
                                      For details on the underlying design, refer to the project's 
                                      <Link href="/developer/docs/ebsi-integration" className="text-primary hover:underline ml-1">blockchain architecture documentation</Link>.
                                  </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <form onSubmit={handleMintToken} className="space-y-3 p-3 border rounded-md">
                                        <h4 className="font-medium text-sm flex items-center"><PlayCircle className="h-4 w-4 mr-1.5 text-primary"/>Mint Token for Product: {dpp.productName}</h4>
                                        <p className="text-xs text-muted-foreground">Simulates creating a unique blockchain token (e.g., ERC-721 NFT) representing this DPP.</p>
                                        <Input value={mintContractAddress} onChange={e => setMintContractAddress(e.target.value)} placeholder="Contract Address (e.g., 0x...)" />
                                        <Input value={mintRecipientAddress} onChange={e => setMintRecipientAddress(e.target.value)} placeholder="Recipient Address (e.g., 0x...)" />
                                        <Input value={mintMetadataUri} onChange={e => setMintMetadataUri(e.target.value)} placeholder="Metadata URI (e.g., ipfs://...)" />
                                        <Button type="submit" size="sm" disabled={isMintingToken}>
                                            {isMintingToken ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlayCircle className="mr-2 h-4 w-4" />}
                                            {isMintingToken ? "Minting..." : "Mint Token"}
                                        </Button>
                                         {mintResponse?.transactionHash && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Tx Hash: <a href={`${TOKEN_EXPLORER_BASE_URL}${mintResponse.transactionHash}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-mono break-all">{mintResponse.transactionHash} <ExternalLink className="inline h-3 w-3 ml-0.5"/></a>
                                            </p>
                                        )}
                                        {renderApiResult("Mint Token", mintResponse, !!(mintResponse && mintResponse.error))}
                                    </form>
                                    <form onSubmit={handleUpdateTokenMetadata} className="space-y-3 p-3 border rounded-md">
                                        <h4 className="font-medium text-sm flex items-center"><Edit className="h-4 w-4 mr-1.5 text-primary"/>Update Token Metadata</h4>
                                        <p className="text-xs text-muted-foreground">Simulates updating the on-chain metadata URI (e.g., tokenURI) for an existing token.</p>
                                        <Input value={updateTokenId} onChange={e => setUpdateTokenId(e.target.value)} placeholder={selected?.blockchainIdentifiers?.tokenId ? "Token ID (auto-filled)" : "Enter Token ID"} />
                                        <Input value={updateMetadataUri} onChange={e => setUpdateMetadataUri(e.target.value)} placeholder="New Metadata URI (e.g., ipfs://...)" />
                                        <Button type="submit" size="sm" disabled={isUpdatingTokenMeta}>
                                            {isUpdatingTokenMeta ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Edit className="mr-2 h-4 w-4" />}
                                            {isUpdatingTokenMeta ? "Updating..." : "Update Metadata"}
                                        </Button>
                                        {updateTokenResponse?.transactionHash && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Tx Hash: <a href={`${TOKEN_EXPLORER_BASE_URL}${updateTokenResponse.transactionHash}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-mono break-all">{updateTokenResponse.transactionHash} <ExternalLink className="inline h-3 w-3 ml-0.5"/></a>
                                            </p>
                                        )}
                                        {renderApiResult("Update Token Metadata", updateTokenResponse, !!(updateTokenResponse && updateTokenResponse.error))}
                                    </form>
                                    <form onSubmit={handleGetTokenStatus} className="space-y-3 p-3 border rounded-md">
                                        <h4 className="font-medium text-sm flex items-center"><CircleDot className="h-4 w-4 mr-1.5 text-primary"/>Get Token Status</h4>
                                        <p className="text-xs text-muted-foreground">Simulates fetching the current on-chain status of a token.</p>
                                        <Input value={statusTokenId} onChange={e => setStatusTokenId(e.target.value)} placeholder={selected?.blockchainIdentifiers?.tokenId ? "Token ID (auto-filled)" : "Enter Token ID"} />
                                        <Button type="submit" size="sm" disabled={isGettingTokenStatus}>
                                            {isGettingTokenStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <InfoIconLucide className="mr-2 h-4 w-4" />}
                                            {isGettingTokenStatus ? "Fetching..." : "Get Status"}
                                        </Button>
                                        {parsedTokenStatus && (
                                          <div className="mt-2 space-y-1.5 p-3 text-xs border rounded bg-muted/30">
                                            <div className="flex items-center justify-between">
                                                <strong className="text-muted-foreground">Owner:</strong> <span className="font-mono text-foreground/90 break-all">{parsedTokenStatus.ownerAddress}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <strong className="text-muted-foreground">Status:</strong>
                                                <Badge variant={getTokenStatusVisuals(parsedTokenStatus.status).badge} className={cn("capitalize", getTokenStatusVisuals(parsedTokenStatus.status).color)}>
                                                  {React.createElement(getTokenStatusVisuals(parsedTokenStatus.status).icon, {className: "mr-1.5 h-3.5 w-3.5"})}
                                                  {parsedTokenStatus.status}
                                                </Badge>
                                            </div>
                                            {parsedTokenStatus.metadataUri && <div className="flex items-center justify-between"><strong className="text-muted-foreground">Metadata URI:</strong> <a href={parsedTokenStatus.metadataUri} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-mono break-all">{parsedTokenStatus.metadataUri} <ExternalLink className="inline h-3 w-3 ml-0.5"/></a></div>}
                                            <div className="flex items-center justify-between"><strong className="text-muted-foreground">Minted At:</strong> <span className="text-foreground/90">{new Date(parsedTokenStatus.mintedAt).toLocaleString()}</span></div>
                                            {parsedTokenStatus.lastTransactionHash && <div className="flex items-center justify-between"><strong className="text-muted-foreground">Last Tx:</strong> <a href={`${TOKEN_EXPLORER_BASE_URL}${parsedTokenStatus.lastTransactionHash}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-mono break-all">{parsedTokenStatus.lastTransactionHash} <ExternalLink className="inline h-3 w-3 ml-0.5"/></a></div>}
                                          </div>
                                        )}
                                        {renderApiResult("Token Status Raw", statusTokenResponse)}
                                    </form>
                                </CardContent>
                            </Card>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
                {dpps.length === 0 && !isLoading && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                      No DPPs match the current filter.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

