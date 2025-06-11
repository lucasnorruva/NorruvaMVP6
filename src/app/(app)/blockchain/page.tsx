
"use client";

import React, { useEffect, useState, FormEvent, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Fingerprint, ShieldCheck, InfoIcon, AlertCircle, Anchor, Link2, Edit, UploadCloud, KeyRound, FileText, Send, Loader2, HelpCircle, ExternalLink, FileJson } from "lucide-react";
import { CardDescription } from "@/components/ui/card";
import type { DigitalProductPassport, VerifiableCredentialReference, MintTokenResponse, UpdateTokenMetadataResponse, TokenStatusResponse } from "@/types/dpp";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; 

const EBSI_EXPLORER_BASE_URL = "https://mock-ebsi-explorer.example.com/tx/";
const MOCK_API_KEY = "SANDBOX_KEY_123"; 

const getEbsiStatusBadge = (status?: "verified" | "pending_verification" | "not_verified" | "error" | string) => {
  switch (status?.toLowerCase()) {
    case "verified":
      return <Badge variant="default" className="bg-green-500/20 text-green-700 border-green-500/30"><ShieldCheck className="mr-1.5 h-3.5 w-3.5" />Verified</Badge>;
    case "pending":
    case "pending_verification":
      return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-700 border-yellow-500/30"><InfoIcon className="mr-1.5 h-3.5 w-3.5" />Pending</Badge>;
    case "not_verified":
      return <Badge variant="destructive" className="bg-orange-500/20 text-orange-700 border-orange-500/30"><AlertCircle className="mr-1.5 h-3.5 w-3.5" />Not Verified</Badge>;
    case "error":
      return <Badge variant="destructive" className="bg-red-500/20 text-red-700 border-red-500/30"><AlertCircle className="mr-1.5 h-3.5 w-3.5" />Error</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

function BlockchainStatus({ product }: { product: DigitalProductPassport }) {
  return (
    <div className="space-y-3 p-4 border rounded-md bg-muted/30">
      {product.blockchainIdentifiers?.platform && (
        <div className="flex flex-col mb-1">
          <span className="text-xs text-muted-foreground">Platform:</span>
          <span className="text-foreground/90">{product.blockchainIdentifiers.platform}</span>
        </div>
      )}
      {product.blockchainIdentifiers?.contractAddress && (
        <div className="flex flex-col mb-1">
          <span className="text-xs text-muted-foreground">Contract Address:</span>
          <span className="font-mono text-xs break-all text-foreground/90">
            {product.blockchainIdentifiers.contractAddress}
          </span>
        </div>
      )}
       {product.blockchainIdentifiers?.tokenId && (
        <div className="flex flex-col mb-1">
          <span className="text-xs text-muted-foreground">Token ID:</span>
          <span className="font-mono text-xs break-all text-foreground/90">
            {product.blockchainIdentifiers.tokenId}
          </span>
        </div>
      )}
      {product.blockchainIdentifiers?.anchorTransactionHash ? (
        <>
          <div className="flex flex-col mb-1">
            <span className="text-xs text-muted-foreground">Anchor Transaction Hash:</span>
            <span className="font-mono text-xs break-all text-foreground/90" title={product.blockchainIdentifiers.anchorTransactionHash!}>
              {product.blockchainIdentifiers.anchorTransactionHash}
            </span>
          </div>
          <div className="flex flex-col mb-2">
            <span className="text-xs text-muted-foreground">EBSI Explorer (Conceptual):</span>
            <a href={`${EBSI_EXPLORER_BASE_URL}${product.blockchainIdentifiers.anchorTransactionHash}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">
              View on Mock Explorer <ExternalLink className="inline h-3 w-3 ml-0.5" />
            </a>
          </div>
        </>
      ) : null}
       {product.ebsiVerification?.status && (
        <div className="flex flex-col mb-1">
          <span className="text-xs text-muted-foreground">EBSI Verification Status:</span>
          <div className="flex items-center mt-0.5">{getEbsiStatusBadge(product.ebsiVerification.status)}</div>
        </div>
      )}
      {product.ebsiVerification?.verificationId && (
        <div className="flex flex-col mb-1">
          <span className="text-xs text-muted-foreground">EBSI Verification ID:</span>
          <span className="font-mono text-xs text-foreground/90 break-all">
            {product.ebsiVerification.verificationId}
          </span>
        </div>
      )}
      {product.ebsiVerification?.issuerDid && (<div className="flex flex-col mb-1"><span className="text-xs text-muted-foreground">EBSI Issuer DID:</span><span className="font-mono text-xs text-foreground/90 break-all">{product.ebsiVerification.issuerDid}</span></div>)}
      {product.ebsiVerification?.schema && (<div className="flex flex-col mb-1"><span className="text-xs text-muted-foreground">EBSI Schema:</span><span className="font-mono text-xs text-foreground/90 break-all">{product.ebsiVerification.schema}</span></div>)}
      {product.ebsiVerification?.issuanceDate && (<div className="flex flex-col mb-1"><span className="text-xs text-muted-foreground">EBSI Issuance Date:</span><span className="font-mono text-xs text-foreground/90 break-all">{new Date(product.ebsiVerification.issuanceDate).toLocaleString()}</span></div>)}
      
      {!product.blockchainIdentifiers?.anchorTransactionHash && !product.ebsiVerification?.status && !product.blockchainIdentifiers?.platform && (
        <p className="text-muted-foreground text-sm">No specific blockchain or EBSI verification details available for this product.</p>
      )}
    </div>
  );
}

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
  const [mintResponse, setMintResponse] = useState<string | null>(null);
  const [isMintingToken, setIsMintingToken] = useState(false);

  const [updateTokenId, setUpdateTokenId] = useState("");
  const [updateMetadataUri, setUpdateMetadataUri] = useState("ipfs://new-metadata-uri");
  const [updateTokenResponse, setUpdateTokenResponse] = useState<string | null>(null);
  const [isUpdatingTokenMeta, setIsUpdatingTokenMeta] = useState(false);

  const [statusTokenId, setStatusTokenId] = useState("");
  const [statusTokenResponse, setStatusTokenResponse] = useState<string | null>(null);
  const [isGettingTokenStatus, setIsGettingTokenStatus] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/v1/dpp?blockchainAnchored=${filter}`, {
        headers: { Authorization: `Bearer ${MOCK_API_KEY}` }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`API Error: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if(data.error) {
          toast({title: "Error fetching DPPs", description: data.error.message, variant: "destructive"});
          setDpps([]);
        } else {
          setDpps(data.data || []);
        }
      })
      .catch(err => {
        toast({title: "Error fetching DPPs", description: err.message, variant: "destructive"});
        setDpps([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [filter, toast]);

  const updateDpp = (updated: DigitalProductPassport) => {
    setDpps(prev => prev.map(d => (d.id === updated.id ? updated : d)));
    if (selected && selected.id === updated.id) setSelected(updated);
  };

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
      const data = await res.json();
      updateDpp(data);
      // setAnchorPlatform(""); // Keep platform for subsequent anchors if desired
      toast({ title: "DPP Anchored", description: `Product ${selected.id} successfully anchored to ${anchorPlatform}. Mock contract address and token ID also set.` });
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
      const data = await res.json();
      updateDpp(data);
      setCustodyStep({ stepName: "", actorDid: "", timestamp: "", location: "", transactionHash: "" });
      toast({ title: "Custody Updated", description: `New custody step added to ${selected.id}.` });
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
      const data = await res.json();
      updateDpp(data);
      setTransferName("");
      setTransferDid("");
      setTransferTime("");
      toast({ title: "Ownership Transferred", description: `Ownership of ${selected.id} transferred to ${transferName}.` });
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
      const data = await res.json();
      setMintResponse(JSON.stringify(data, null, 2));
      if (res.ok) {
        toast({ title: "Token Mint Initiated (Mock)", description: `Token for ${selected.id} minted. Tx: ${data.transactionHash}` });
      } else {
        handleApiError(res, "Minting Token");
      }
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "An unknown error occurred";
        setMintResponse(JSON.stringify({ error: "Client-side error", message: errorMsg }, null, 2));
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
        body: JSON.stringify({ metadataUri: updateMetadataUri, contractAddress: "0xUpdatedContractIfDifferent" }),
        });
        const data = await res.json();
        setUpdateTokenResponse(JSON.stringify(data, null, 2));
        if (res.ok) {
        toast({ title: "Token Metadata Update Initiated (Mock)", description: `Metadata for token ${updateTokenId} updated. Tx: ${data.transactionHash}` });
        } else {
        handleApiError(res, "Updating Token Metadata");
        }
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "An unknown error occurred";
        setUpdateTokenResponse(JSON.stringify({ error: "Client-side error", message: errorMsg }, null, 2));
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
    try {
        const res = await fetch(`/api/v1/token/status/${statusTokenId}`, {
        headers: { Authorization: `Bearer ${MOCK_API_KEY}` },
        });
        const data = await res.json();
        setStatusTokenResponse(JSON.stringify(data, null, 2));
        if (res.ok) {
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


  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-headline font-semibold">Blockchain Management</h1>

      <Card className="shadow-md bg-muted/30 border-primary/10">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center">
            <InfoIcon className="mr-3 h-6 w-6 text-primary" />
            About Blockchain Management
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-foreground/90 space-y-2">
          <p>
            This page provides conceptual tools to manage on-chain aspects of your Digital Product Passports (DPPs). You can simulate actions such as:
          </p>
          <ul className="list-disc list-inside pl-4 space-y-1">
            <li><strong>Anchoring DPPs:</strong> Recording DPP data hashes and key identifiers on a mock blockchain.</li>
            <li><strong>Updating Chain of Custody:</strong> Documenting product transfers and lifecycle events.</li>
            <li><strong>Transferring Ownership:</strong> Modifying DPP ownership records (conceptually).</li>
            <li><strong>Managing Verifiable Credentials:</strong> Viewing and retrieving product-related VCs.</li>
            <li><strong>DPP Token Operations:</strong> Conceptual minting, metadata updates, and status checks for DPP tokens.</li>
          </ul>
          <p className="mt-2">
            These operations are based on the conceptual API endpoints. For technical details, refer to the 
            <a href="/openapi.yaml" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium ml-1">
              OpenAPI Specification <ExternalLink className="inline h-3.5 w-3.5 ml-0.5" />
            </a>.
          </p>
        </CardContent>
      </Card>

      <div className="max-w-xs">
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
                        <Button variant="outline" size="sm" onClick={() => { setSelected(selected?.id === dpp.id ? null : dpp); setFetchedCredential(null); setMintResponse(null); setUpdateTokenResponse(null); setStatusTokenResponse(null); }}>
                          {selected?.id === dpp.id ? "Hide Details" : "Manage"}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {selected?.id === dpp.id && (
                      <TableRow>
                        <TableCell colSpan={4} className="py-4">
                          <div className="p-4 border rounded-md space-y-6 bg-card">
                            <div className="mb-6">
                              <h3 className="flex items-center mb-2 font-semibold text-lg text-primary">
                                <Fingerprint className="h-5 w-5 mr-2" />
                                Blockchain & EBSI Details
                                <TooltipProvider delayDuration={100}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <HelpCircle className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                      <p className="text-xs">
                                        Blockchain anchoring (e.g., transaction hash, contract address, token ID) provides an immutable record of the DPP's data integrity. 
                                        EBSI (European Blockchain Services Infrastructure) verification can enhance trust using verifiable credentials.
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </h3>
                              <BlockchainStatus product={dpp} />
                            </div>

                            {!dpp.blockchainIdentifiers?.anchorTransactionHash && (
                              <Card className="bg-background">
                                <CardHeader><CardTitle className="text-md flex items-center"><Anchor className="mr-2 h-4 w-4 text-info"/>Anchor DPP on Blockchain</CardTitle></CardHeader>
                                <CardContent>
                                  <form onSubmit={handleAnchor} className="flex flex-wrap gap-2 items-end">
                                    <Input value={anchorPlatform} onChange={e => setAnchorPlatform(e.target.value)} placeholder="Blockchain Platform (e.g., EBSI)" className="flex-grow sm:flex-grow-0 sm:w-60" />
                                    <Button type="submit" size="sm" disabled={isActionLoading === "anchor"}>
                                        {isActionLoading === "anchor" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Anchor Product
                                    </Button>
                                  </form>
                                </CardContent>
                              </Card>
                            )}

                            <Card className="bg-background mb-6">
                              <CardHeader><CardTitle className="text-md flex items-center"><Edit className="mr-2 h-4 w-4 text-info"/>Update Chain of Custody</CardTitle></CardHeader>
                              <CardContent>
                                <h4 className="font-medium mb-2 text-sm">Current Steps:</h4>
                                <ul className="space-y-1 text-xs mb-3 max-h-32 overflow-y-auto border p-2 rounded-md bg-muted/30">
                                    {dpp.traceability?.supplyChainSteps?.length ? (
                                      (dpp.traceability.supplyChainSteps || []).map((step, idx) => (
                                      <li key={idx} className="border-b last:border-b-0 pb-1">
                                        <span className="font-semibold">{step.stepName}</span> - {new Date(step.timestamp).toLocaleString()} <br/> <span className="text-muted-foreground">Actor: {step.actorDid || 'N/A'}, Location: {step.location || 'N/A'} Tx: {step.transactionHash || 'N/A'}</span>
                                      </li>
                                    ))
                                  ) : (
                                    <li className="text-muted-foreground">No steps recorded</li>
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
                                        {isActionLoading === "custody" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Add Custody Step
                                    </Button>
                                  </div>
                                </form>
                              </CardContent>
                            </Card>
                            
                            <Card className="bg-background">
                              <CardHeader><CardTitle className="text-md flex items-center"><FileText className="mr-2 h-4 w-4 text-info"/>Verifiable Credentials</CardTitle></CardHeader>
                              <CardContent>
                                {dpp.verifiableCredentials && dpp.verifiableCredentials.length > 0 ? (
                                  <ul className="space-y-2 text-xs mb-3 max-h-40 overflow-y-auto border p-2 rounded-md bg-muted/30">
                                    {dpp.verifiableCredentials.map((vc, idx) => (
                                      <li key={idx} className="border-b last:border-b-0 pb-1">
                                        <p className="font-semibold">{vc.name || vc.type.join(', ')}</p>
                                        <p>ID: <span className="font-mono">{vc.id}</span></p>
                                        <p>Issuer: <span className="font-mono">{vc.issuer}</span></p>
                                        <p>Issued: {new Date(vc.issuanceDate).toLocaleDateString()}</p>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-xs text-muted-foreground mb-2">No verifiable credentials directly linked to this DPP in the main record.</p>
                                )}
                                <Button size="sm" variant="secondary" onClick={() => fetchAndDisplayCredential(dpp.id)} className="w-full sm:w-auto" disabled={isActionLoading === "fetchCredential"}>
                                  {isActionLoading === "fetchCredential" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4"/>}
                                   Get Specific Credential for DPP
                                </Button>
                                {fetchedCredential && (
                                  <Alert className="mt-3 text-xs bg-muted/50">
                                    <FileJson className="h-4 w-4" />
                                    <AlertTitle>Fetched Credential Detail:</AlertTitle>
                                    <AlertDescription>
                                      <pre className="mt-1 p-2 bg-black/80 text-white rounded-md text-[0.7rem] overflow-x-auto max-h-60">
                                        <code>{JSON.stringify(fetchedCredential, null, 2)}</code>
                                      </pre>
                                    </AlertDescription>
                                  </Alert>
                                )}
                                <p className="text-xs text-muted-foreground mt-2">
                                  This action fetches a mock Verifiable Credential JSON for the DPP. In a real system, VCs might be stored off-chain and referenced, or embedded.
                                </p>
                              </CardContent>
                            </Card>

                            <Card className="bg-background mt-6">
                                <CardHeader><CardTitle className="text-md flex items-center"><UploadCloud className="mr-2 h-4 w-4 text-info"/>Transfer Ownership</CardTitle></CardHeader>
                                <CardContent>
                                  <form onSubmit={handleTransfer} className="space-y-3">
                                    <Input placeholder="New Owner Name" value={transferName} onChange={e => setTransferName(e.target.value)} />
                                    <Input placeholder="New Owner DID (Optional)" value={transferDid} onChange={e => setTransferDid(e.target.value)} />
                                    <Input type="datetime-local" value={transferTime} onChange={e => setTransferTime(e.target.value)} />
                                    <Button type="submit" size="sm" className="w-full" disabled={isActionLoading === "transfer"}>
                                        {isActionLoading === "transfer" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Transfer Ownership
                                    </Button>
                                  </form>
                                </CardContent>
                            </Card>

                            <Card className="bg-background mt-6">
                                <CardHeader><CardTitle className="text-md flex items-center"><KeyRound className="mr-2 h-4 w-4 text-info"/>DPP Token Operations (Conceptual)</CardTitle></CardHeader>
                                <CardContent className="space-y-6">
                                    <form onSubmit={handleMintToken} className="space-y-3 p-3 border rounded-md">
                                        <h4 className="font-medium text-sm">Mint Token for Product: {dpp.id}</h4>
                                        <Input value={mintContractAddress} onChange={e => setMintContractAddress(e.target.value)} placeholder="Contract Address (e.g., 0x...)" />
                                        <Input value={mintRecipientAddress} onChange={e => setMintRecipientAddress(e.target.value)} placeholder="Recipient Address (e.g., 0x...)" />
                                        <Input value={mintMetadataUri} onChange={e => setMintMetadataUri(e.target.value)} placeholder="Metadata URI (e.g., ipfs://...)" />
                                        <Button type="submit" size="sm" disabled={isMintingToken}>
                                            {isMintingToken ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                            Mint Token
                                        </Button>
                                        {mintResponse && <pre className="mt-2 p-2 bg-muted text-xs rounded overflow-x-auto max-h-40"><code>{mintResponse}</code></pre>}
                                    </form>
                                    <form onSubmit={handleUpdateTokenMetadata} className="space-y-3 p-3 border rounded-md">
                                        <h4 className="font-medium text-sm">Update Token Metadata</h4>
                                        <Input value={updateTokenId} onChange={e => setUpdateTokenId(e.target.value)} placeholder="Token ID (e.g., 123)" />
                                        <Input value={updateMetadataUri} onChange={e => setUpdateMetadataUri(e.target.value)} placeholder="New Metadata URI (e.g., ipfs://...)" />
                                        <Button type="submit" size="sm" disabled={isUpdatingTokenMeta}>
                                            {isUpdatingTokenMeta ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Edit className="mr-2 h-4 w-4" />}
                                            Update Metadata
                                        </Button>
                                        {updateTokenResponse && <pre className="mt-2 p-2 bg-muted text-xs rounded overflow-x-auto max-h-40"><code>{updateTokenResponse}</code></pre>}
                                    </form>
                                    <form onSubmit={handleGetTokenStatus} className="space-y-3 p-3 border rounded-md">
                                        <h4 className="font-medium text-sm">Get Token Status</h4>
                                        <Input value={statusTokenId} onChange={e => setStatusTokenId(e.target.value)} placeholder="Token ID (e.g., 123)" />
                                        <Button type="submit" size="sm" disabled={isGettingTokenStatus}>
                                            {isGettingTokenStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <InfoIcon className="mr-2 h-4 w-4" />}
                                            Get Status
                                        </Button>
                                        {statusTokenResponse && <pre className="mt-2 p-2 bg-muted text-xs rounded overflow-x-auto max-h-60"><code>{statusTokenResponse}</code></pre>}
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
