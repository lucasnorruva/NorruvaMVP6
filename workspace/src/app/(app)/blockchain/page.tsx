"use client";

import React, { useEffect, useState, FormEvent, useCallback, useMemo } from "react";
import Link from "next/link"; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    Fingerprint, ShieldCheck, Info as InfoIconLucide, AlertCircle, Anchor, Link2, Edit, UploadCloud, 
    KeyRound, FileText, Send, Loader2, HelpCircle, ExternalLink, FileJson, PlayCircle, Package, 
    PlusCircle, CalendarDays, Sigma, Layers3, Tag, CheckCircle as CheckCircleLucide, 
    Server as ServerIcon, Link as LinkIconPath, FileCog, BookOpen, CircleDot, Clock, Share2, Users, Factory, Truck, ShoppingCart, Recycle as RecycleIconLucide, Upload, MessageSquare,
    FileEdit, MessageSquareWarning, ListCollapse, Hash, Layers, FileLock, Users2 as DaoIcon, ThumbsUp, ThumbsDown
} from "lucide-react";
import type { DigitalProductPassport, VerifiableCredentialReference, MintTokenResponse, UpdateTokenMetadataResponse, TokenStatusResponse, OwnershipNftLink } from "@/types/dpp";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea"; 

const EBSI_EXPLORER_BASE_URL = "https://mock-ebsi-explorer.example.com/tx/";
const TOKEN_EXPLORER_BASE_URL = "https://mock-token-explorer.example.com/token/"; 
const TX_EXPLORER_BASE_URL = "https://mock-token-explorer.example.com/tx/"; 
const MOCK_API_KEY = "SANDBOX_KEY_123";
const MOCK_TRANSACTION_DELAY = 1500; 

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
  const hasAuthVc = product.authenticationVcId;
  const hasOwnershipNft = product.ownershipNftLink;

  return (
    <div className="space-y-3 text-xs">
      {hasBlockchainInfo && (
        <div>
          <h4 className="text-sm font-semibold text-primary mb-1.5 flex items-center"><LinkIconPath className="h-4 w-4 mr-1.5"/>Blockchain Identifiers</h4>
          {product.blockchainIdentifiers?.platform && (
            <TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger className="text-left w-full">
            <div className="flex items-center gap-1 mb-0.5"><Layers3 className="h-3.5 w-3.5 text-muted-foreground"/><span className="text-muted-foreground">Platform:</span><span className="text-foreground/90">{product.blockchainIdentifiers.platform}</span></div>
            </TooltipTrigger><TooltipContent><p>The blockchain network or platform used.</p></TooltipContent></Tooltip></TooltipProvider>
          )}
          {product.blockchainIdentifiers?.contractAddress && (
            <TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger className="text-left w-full">
            <div className="flex items-center gap-1 mb-0.5"><FileCog className="h-3.5 w-3.5 text-muted-foreground"/><span className="text-muted-foreground">Contract:</span><span className="font-mono break-all text-foreground/90">{product.blockchainIdentifiers.contractAddress}</span></div>
            </TooltipTrigger><TooltipContent><p>Address of the smart contract managing this DPP or token.</p></TooltipContent></Tooltip></TooltipProvider>
          )}
           {product.blockchainIdentifiers?.tokenId && (
            <TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger className="text-left w-full">
            <div className="flex items-center gap-1 mb-0.5"><Tag className="h-3.5 w-3.5 text-muted-foreground"/><span className="text-muted-foreground">Token ID:</span><span className="font-mono break-all text-foreground/90">{product.blockchainIdentifiers.tokenId}</span></div>
            </TooltipTrigger><TooltipContent><p>Unique identifier of the NFT representing this DPP.</p></TooltipContent></Tooltip></TooltipProvider>
          )}
          {product.blockchainIdentifiers?.anchorTransactionHash && (
            <>
              <TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger className="text-left w-full">
              <div className="flex items-center gap-1 mb-0.5"><Anchor className="h-3.5 w-3.5 text-muted-foreground"/><span className="text-muted-foreground">Anchor Tx:</span><span className="font-mono break-all text-foreground/90" title={product.blockchainIdentifiers.anchorTransactionHash!}>{product.blockchainIdentifiers.anchorTransactionHash.substring(0,10)}...{product.blockchainIdentifiers.anchorTransactionHash.slice(-8)}</span></div>
              </TooltipTrigger><TooltipContent><p>Transaction hash proving the DPP data was anchored on-chain.</p></TooltipContent></Tooltip></TooltipProvider>
              <div className="flex items-center gap-1">
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground"/>
                <span className="text-muted-foreground">Explorer:</span>
                <Link href={`${TX_EXPLORER_BASE_URL}${product.blockchainIdentifiers.anchorTransactionHash}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    View on Mock Explorer <ExternalLink className="inline h-3 w-3 ml-0.5" />
                </Link>
              </div>
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
            {product.ebsiVerification?.issuerDid && (
            <TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger className="text-left w-full">
            <div className="flex items-center gap-1 mb-0.5"><Users className="h-3.5 w-3.5 text-muted-foreground"/><span className="text-muted-foreground">Issuer DID:</span><span className="font-mono text-foreground/90 break-all">{product.ebsiVerification.issuerDid}</span></div>
            </TooltipTrigger><TooltipContent><p>Decentralized Identifier of the entity that issued the EBSI Verifiable Credential.</p></TooltipContent></Tooltip></TooltipProvider>
            )}
            {product.ebsiVerification?.schema && (
            <TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger className="text-left w-full">
            <div className="flex items-center gap-1 mb-0.5"><FileJson className="h-3.5 w-3.5 text-muted-foreground"/><span className="text-muted-foreground">Schema:</span><span className="font-mono text-foreground/90 break-all">{product.ebsiVerification.schema}</span></div>
            </TooltipTrigger><TooltipContent><p>The schema or type definition of the Verifiable Credential.</p></TooltipContent></Tooltip></TooltipProvider>
            )}
            {product.ebsiVerification?.issuanceDate && (<div className="flex items-center gap-1 mb-0.5"><CalendarDays className="h-3.5 w-3.5 text-muted-foreground"/><span className="text-muted-foreground">Issued:</span><span className="font-mono text-foreground/90 break-all">{new Date(product.ebsiVerification.issuanceDate).toLocaleString()}</span></div>)}
        </div>
      )}

      {(hasAuthVc || hasOwnershipNft) && (
        <div className={cn((hasBlockchainInfo || hasEbsiInfo) && "mt-2 pt-2 border-t border-border/30")}>
            <h4 className="text-sm font-semibold text-primary mb-1.5 flex items-center"><KeyRound className="h-4 w-4 mr-1.5"/>Authenticity & Ownership VCs/NFTs</h4>
             {hasAuthVc && (
                <div className="flex items-center gap-1 mb-0.5"><FileLock className="h-3.5 w-3.5 text-muted-foreground"/><span className="text-muted-foreground">Auth VC ID:</span><span className="font-mono break-all text-foreground/90">{product.authenticationVcId}</span></div>
             )}
             {hasOwnershipNft && (
                <div className="mt-1">
                    <div className="flex items-center gap-1 mb-0.5"><Tag className="h-3.5 w-3.5 text-muted-foreground"/><span className="text-muted-foreground">Ownership NFT:</span></div>
                    <div className="pl-4 text-xs">
                        {product.ownershipNftLink?.registryUrl && <p><span className="text-muted-foreground">Registry:</span> <Link href={product.ownershipNftLink.registryUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{product.ownershipNftLink.registryUrl}</Link></p>}
                        <p><span className="text-muted-foreground">Contract:</span> <span className="font-mono break-all text-foreground/90">{product.ownershipNftLink?.contractAddress}</span></p>
                        <p><span className="text-muted-foreground">Token ID:</span> <span className="font-mono break-all text-foreground/90">{product.ownershipNftLink?.tokenId}</span></p>
                        {product.ownershipNftLink?.chainName && <p><span className="text-muted-foreground">Chain:</span> <span className="text-foreground/90">{product.ownershipNftLink.chainName}</span></p>}
                    </div>
                </div>
             )}
        </div>
      )}
      
      {!hasBlockchainInfo && !hasEbsiInfo && !hasAuthVc && !hasOwnershipNft && (
        <p className="text-muted-foreground text-sm">No specific blockchain, EBSI, authenticity VC or ownership NFT details available for this product.</p>
      )}
    </div>
  );
}

const getTokenStatusVisuals = (status?: string) => {
  if (!status) return { icon: InfoIconLucide, color: "text-muted-foreground", badge: "secondary" as const };
  const s = status.toLowerCase();
  if (s.includes("minted") || s.includes("active")) return { icon: CheckCircleLucide, color: "text-green-600", badge: "default" as const };
  if (s.includes("transferred")) return { icon: Send, color: "text-blue-500", badge: "outline" as const };
  if (s.includes("burned") || s.includes("locked")) return { icon: AlertCircle, color: "text-red-600", badge: "destructive" as const };
  return { icon: InfoIconLucide, color: "text-muted-foreground", badge: "secondary" as const };
};

interface MockDaoProposal {
  id: string;
  title: string;
  description: string;
  status: 'Voting Active' | 'Succeeded & Executed' | 'Defeated' | 'Queued';
  votesFor?: number;
  votesAgainst?: number;
}

const initialMockDaoProposals: MockDaoProposal[] = [
  { id: "PROP001", title: "Enable Transfer for Token DPP001", description: "Owner request for resale of EcoSmart Refrigerator X500.", status: "Voting Active", votesFor: 250, votesAgainst: 50 },
  { id: "PROP002", title: "Grant MINTER_ROLE to 0xNewMinterAddr...", description: "Onboarding a new manufacturing partner for smart bulb production.", status: "Succeeded & Executed" },
  { id: "PROP003", title: "Adjust Voting Quorum to 3%", description: "Proposal to lower the quorum threshold for faster decision-making.", status: "Defeated", votesFor: 120, votesAgainst: 300 },
  { id: "PROP004", title: "Pause DPPToken Contract for Maintenance", description: "Scheduled upgrade of DPPToken logic requires temporary pause.", status: "Queued" },
];

export default function BlockchainPage() {
  const [filter, setFilter] = useState<"all" | "anchored" | "not_anchored">("all");
  const [dpps, setDpps] = useState<DigitalProductPassport[]>([]);
  const [selected, setSelected] = useState<DigitalProductPassport | null>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState<string | boolean>(false);

  const [anchorPlatform, setAnchorPlatform] = useState("EBSI Mock Ledger");
  const [custodyStep, setCustodyStep] = useState({ stepName: "", actorDid: "", timestamp: "", location: "", transactionHash: "" });
  const [transferName, setTransferName] = useState("");
  const [transferDid, setTransferDid] = useState("");
  const [transferTime, setTransferTime] = useState("");

  const [fetchedCredential, setFetchedCredential] = useState<any | null>(null);

  const [mintContractAddress, setMintContractAddress] = useState("0xMOCK_DPP_TOKEN_CONTRACT");
  const [mintRecipientAddress, setMintRecipientAddress] = useState("0xRECIPIENT_MOCK_ADDRESS");
  const [mintMetadataUri, setMintMetadataUri] = useState(""); 
  const [mintResponse, setMintResponse] = useState<MintTokenResponse | null>(null);
  
  const [updateTokenId, setUpdateTokenId] = useState("");
  const [updateMetadataUri, setUpdateMetadataUri] = useState("ipfs://new-mock-metadata-cid");
  const [updateTokenResponse, setUpdateTokenResponse] = useState<UpdateTokenMetadataResponse | null>(null);

  const [statusTokenId, setStatusTokenId] = useState("");
  const [statusTokenResponse, setStatusTokenResponse] = useState<string | null>(null); 
  const [parsedTokenStatus, setParsedTokenStatus] = useState<TokenStatusResponse | null>(null); 

  const [viewTokenId, setViewTokenId] = useState("");
  const [viewTokenMetadataResponse, setViewTokenMetadataResponse] = useState<string | null>(null);
  const [isViewingTokenMetadata, setIsViewingTokenMetadata] = useState(false);

  const [onChainStatusUpdate, setOnChainStatusUpdate] = useState<string>("active");
  const [criticalEventDescription, setCriticalEventDescription] = useState<string>("");
  const [criticalEventSeverity, setCriticalEventSeverity] = useState<'High' | 'Medium' | 'Low'>("High");
  const [isUpdatingOnChainStatusLoading, setIsUpdatingOnChainStatusLoading] = useState(false);
  const [isLoggingCriticalEventLoading, setIsLoggingCriticalEventLoading] = useState(false);

  const [onChainLifecycleStage, setOnChainLifecycleStage] = useState<string>("Manufacturing");
  const [vcIdToRegister, setVcIdToRegister] = useState<string>("");
  const [vcHashToRegister, setVcHashToRegister] = useState<string>("");
  const [isUpdatingLifecycleStageLoading, setIsUpdatingLifecycleStageLoading] = useState(false);
  const [isRegisteringVcHashLoading, setIsRegisteringVcHashLoading] = useState(false);

  const [authVcProductId, setAuthVcProductId] = useState<string>("");
  const [nftProductId, setNftProductId] = useState<string>("");
  const [nftRegistryUrl, setNftRegistryUrl] = useState<string>("");
  const [nftContractAddress, setNftContractAddress] = useState<string>("");
  const [nftTokenId, setNftTokenId] = useState<string>("");
  const [nftChainName, setNftChainName] = useState<string>("");

  const [proposalTargetTokenId, setProposalTargetTokenId] = useState<string>("");
  const [proposalActionType, setProposalActionType] = useState<string>("enableTransfer");
  const [proposalTargetAddress, setProposalTargetAddress] = useState<string>("");
  const [proposalDescription, setProposalDescription] = useState<string>("");
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);
  const [daoProposals, setDaoProposals] = useState<MockDaoProposal[]>(initialMockDaoProposals);


  const lifecycleStageOptions = ["Design", "Manufacturing", "QualityAssurance", "Distribution", "InUse", "Maintenance", "EndOfLife"];


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
        if(data && data.error && data.error.message && data.status !== 200) { 
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
        console.error("Fetch error for DPPs:", err);
        toast({title: "Fetching DPPs Failed", description: err.message || "Network error or failed to parse response.", variant: "destructive"});
        setDpps([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [filter, toast]); 

  const handleSelectProduct = (dpp: DigitalProductPassport | null) => {
    setSelected(dpp);
    if (dpp) {
      const tokenId = dpp.blockchainIdentifiers?.tokenId;
      const contractAddr = dpp.blockchainIdentifiers?.contractAddress;
      setUpdateTokenId(tokenId || "");
      setStatusTokenId(tokenId || "");
      setViewTokenId(tokenId || "");
      setMintMetadataUri(tokenId ? `ipfs://dpp_metadata_for_${tokenId}` : `ipfs://dpp_metadata_for_${dpp.id}`);
      
      setAuthVcProductId(dpp.id); 
      setNftProductId(dpp.id); 
      setNftRegistryUrl(dpp.ownershipNftLink?.registryUrl || "");
      setNftContractAddress(dpp.ownershipNftLink?.contractAddress || contractAddr || "");
      setNftTokenId(dpp.ownershipNftLink?.tokenId || tokenId || "");
      setNftChainName(dpp.ownershipNftLink?.chainName || dpp.blockchainIdentifiers?.platform || "");
      setProposalTargetTokenId(dpp.id); // Pre-fill for DAO proposal

    } else {
      setUpdateTokenId("");
      setStatusTokenId("");
      setViewTokenId("");
      setMintMetadataUri("");
      setAuthVcProductId(""); 
      setNftProductId(""); 
      setNftRegistryUrl("");
      setNftContractAddress("");
      setNftTokenId("");
      setNftChainName("");
      setProposalTargetTokenId("");
    }
    setFetchedCredential(null);
    setMintResponse(null);
    setUpdateTokenResponse(null);
    setStatusTokenResponse(null);
    setParsedTokenStatus(null);
    setViewTokenMetadataResponse(null);
  };

  const updateDppLocally = (updated: DigitalProductPassport) => {
    setDpps(prev => prev.map(d => (d.id === updated.id ? updated : d)));
    if (selected && selected.id === updated.id) {
      setSelected(updated); 
      const tokenId = updated.blockchainIdentifiers?.tokenId;
      if (tokenId) { 
          setUpdateTokenId(tokenId);
          setStatusTokenId(tokenId);
          setViewTokenId(tokenId);
      }
      if (updated.ownershipNftLink) {
        setNftRegistryUrl(updated.ownershipNftLink.registryUrl || "");
        setNftContractAddress(updated.ownershipNftLink.contractAddress);
        setNftTokenId(updated.ownershipNftLink.tokenId);
        setNftChainName(updated.ownershipNftLink.chainName || "");
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
    await new Promise(resolve => setTimeout(resolve, MOCK_TRANSACTION_DELAY));
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
    await new Promise(resolve => setTimeout(resolve, MOCK_TRANSACTION_DELAY));
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
    await new Promise(resolve => setTimeout(resolve, MOCK_TRANSACTION_DELAY));
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
    await new Promise(resolve => setTimeout(resolve, MOCK_TRANSACTION_DELAY / 2));
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
    setIsActionLoading("mintToken");
    setMintResponse(null);
    await new Promise(resolve => setTimeout(resolve, MOCK_TRANSACTION_DELAY));
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
    setIsActionLoading(false);
  };

  const handleUpdateTokenMetadata = async (e: FormEvent) => {
    e.preventDefault();
    if (!updateTokenId) {
        toast({ title: "Token ID Required", description: "Please enter a Token ID to update metadata.", variant: "destructive" });
        return;
    }
    setIsActionLoading("updateTokenMeta");
    setUpdateTokenResponse(null);
    await new Promise(resolve => setTimeout(resolve, MOCK_TRANSACTION_DELAY));
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
    setIsActionLoading(false);
  };
  
  const handleGetTokenStatus = async (e: FormEvent) => {
    e.preventDefault();
    if (!statusTokenId) {
        toast({ title: "Token ID Required", description: "Please enter a Token ID to get its status.", variant: "destructive" });
        return;
    }
    setIsActionLoading("gettingTokenStatus");
    setStatusTokenResponse(null);
    setParsedTokenStatus(null);
    await new Promise(resolve => setTimeout(resolve, MOCK_TRANSACTION_DELAY / 2));
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
    setIsActionLoading(false);
  };

  const handleViewTokenMetadata = async (e: FormEvent) => {
    e.preventDefault();
    if (!viewTokenId && !parsedTokenStatus?.metadataUri) {
      toast({ title: "Token ID or URI Required", description: "Please ensure a Token ID is entered or Get Token Status was run.", variant: "destructive" });
      return;
    }
    setIsViewingTokenMetadata(true);
    setViewTokenMetadataResponse(null);
    await new Promise(resolve => setTimeout(resolve, MOCK_TRANSACTION_DELAY / 2));

    const metadataUriToFetch = parsedTokenStatus?.metadataUri || `ipfs://dpp_metadata_for_${viewTokenId || selected?.id}`;
    
    const mockMetadata = {
      name: `DPP Token for ${selected?.productName || viewTokenId || 'Product'}`,
      description: `Verifiable Digital Product Passport for ${selected?.productName || 'Unknown Product'}. Category: ${selected?.category || 'N/A'}.`,
      image: selected?.productDetails?.imageUrl || "https://placehold.co/300x300.png?text=DPP+NFT",
      external_url: selected ? `https://norruva.example.com/passport/${selected.id}` : "https://norruva.example.com",
      attributes: [
        { trait_type: "Product ID", value: selected?.id || viewTokenId },
        { trait_type: "Category", value: selected?.category || "N/A" },
        { trait_type: "Manufacturer", value: selected?.manufacturer?.name || "N/A" },
        { trait_type: "GTIN", value: selected?.gtin || "N/A" },
        { trait_type: "DPP Standard Version", value: selected?.metadata?.dppStandardVersion || "N/A" },
        ...(selected?.productDetails?.customAttributes || []).map(attr => ({ trait_type: attr.key, value: attr.value }))
      ]
    };
    setViewTokenMetadataResponse(JSON.stringify(mockMetadata, null, 2));
    toast({ title: "Token Metadata Fetched (Mock)", description: `Displaying conceptual off-chain metadata for token URI: ${metadataUriToFetch}` });
    setIsViewingTokenMetadata(false);
  };

  const handleUpdateOnChainStatus = async (e: FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setIsUpdatingOnChainStatusLoading(true);
    try {
      const res = await fetch(`/api/v1/dpp/${selected.id}/onchain-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${MOCK_API_KEY}` },
        body: JSON.stringify({ status: onChainStatusUpdate }),
      });
      const data = await res.json(); 
      if (res.ok && data.updatedProduct) {
        updateDppLocally(data.updatedProduct as DigitalProductPassport); 
        toast({ title: "On-Chain Status Update (Mock)", description: data.message || `Conceptual status for ${selected.productName} updated to '${onChainStatusUpdate}'.` });
      } else {
        handleApiError(res, "Updating On-Chain Status");
      }
    } catch (error) {
      handleApiError(new Response(JSON.stringify({ error: { message: (error as Error).message } }), { status: 500 }), "Updating On-Chain Status");
    }
    setIsUpdatingOnChainStatusLoading(false);
  };

  const handleLogCriticalEvent = async (e: FormEvent) => {
    e.preventDefault();
    if (!selected || !criticalEventDescription.trim()) {
      toast({ title: "Missing Info", description: "Please select a product and enter an event description.", variant: "destructive" });
      return;
    }
    setIsLoggingCriticalEventLoading(true);
     try {
      const res = await fetch(`/api/v1/dpp/${selected.id}/log-critical-event`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${MOCK_API_KEY}` },
        body: JSON.stringify({ eventDescription: criticalEventDescription, severity: criticalEventSeverity }),
      });
       const data = await res.json();
      if (res.ok && data.updatedProduct) {
        updateDppLocally(data.updatedProduct as DigitalProductPassport);
        toast({ title: "Critical Event Logged (Mock)", description: data.message || `Event logged for ${selected.productName}.` });
        setCriticalEventDescription("");
      } else {
        handleApiError(res, "Logging Critical Event");
      }
    } catch (error) {
      handleApiError(new Response(JSON.stringify({ error: { message: (error as Error).message } }), { status: 500 }), "Logging Critical Event");
    }
    setIsLoggingCriticalEventLoading(false);
  };

  const handleUpdateOnChainLifecycleStage = async (e: FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setIsUpdatingLifecycleStageLoading(true);
    try {
      const res = await fetch(`/api/v1/dpp/${selected.id}/onchain-lifecycle-stage`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${MOCK_API_KEY}` },
        body: JSON.stringify({ lifecycleStage: onChainLifecycleStage }),
      });
      const data = await res.json();
      if (res.ok && data.updatedProduct) {
        updateDppLocally(data.updatedProduct as DigitalProductPassport);
        toast({ title: "Lifecycle Stage Update (Mock)", description: data.message || `Conceptual stage for ${selected.productName} updated to '${onChainLifecycleStage}'.` });
      } else {
        handleApiError(res, "Updating Lifecycle Stage");
      }
    } catch (error) {
       handleApiError(new Response(JSON.stringify({ error: { message: (error as Error).message } }), { status: 500 }), "Updating Lifecycle Stage");
    }
    setIsUpdatingLifecycleStageLoading(false);
  };

  const handleRegisterVcHash = async (e: FormEvent) => {
    e.preventDefault();
    if (!selected || !vcIdToRegister.trim() || !vcHashToRegister.trim()) {
      toast({ title: "Missing Info", description: "Please select a product, enter a VC ID and VC Hash.", variant: "destructive" });
      return;
    }
    setIsRegisteringVcHashLoading(true);
    try {
      const res = await fetch(`/api/v1/dpp/${selected.id}/register-vc-hash`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${MOCK_API_KEY}` },
        body: JSON.stringify({ vcId: vcIdToRegister, vcHash: vcHashToRegister }),
      });
       const data = await res.json();
      if (res.ok && data.updatedProduct) {
        updateDppLocally(data.updatedProduct as DigitalProductPassport);
        toast({ title: "VC Hash Registered (Mock)", description: data.message || `VC Hash for ID '${vcIdToRegister}' registered for ${selected.productName}.` });
        setVcIdToRegister("");
        setVcHashToRegister("");
      } else {
        handleApiError(res, "Registering VC Hash");
      }
    } catch (error) {
        handleApiError(new Response(JSON.stringify({ error: { message: (error as Error).message } }), { status: 500 }), "Registering VC Hash");
    }
    setIsRegisteringVcHashLoading(false);
  };

  const handleIssueAuthVc = async (e: FormEvent) => {
    e.preventDefault();
    if (!authVcProductId) {
      toast({ title: "Product ID Required", description: "Please enter a Product ID to issue an Auth VC for.", variant: "destructive" });
      return;
    }
    setIsActionLoading("issueAuthVc");
    try {
      const res = await fetch(`/api/v1/dpp/${authVcProductId}/issue-auth-vc`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${MOCK_API_KEY}` },
        body: JSON.stringify({}), 
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Authentication VC Issued (Mock)", description: data.message });
        if (data.updatedProduct) updateDppLocally(data.updatedProduct);
      } else {
        handleApiError(res, "Issuing Authentication VC");
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "An unknown error occurred";
      toast({ title: "Issuing Auth VC Failed", description: errorMsg, variant: "destructive" });
    }
    setIsActionLoading(false);
  };
  
  const handleLinkNft = async (e: FormEvent) => {
    e.preventDefault();
    if (!nftProductId || !nftContractAddress || !nftTokenId) {
      toast({ title: "Required Fields Missing", description: "Product ID, NFT Contract Address, and Token ID are required.", variant: "destructive" });
      return;
    }
    setIsActionLoading("linkNft");
    const payload: OwnershipNftLink & { registryUrl?: string } = {
        contractAddress: nftContractAddress,
        tokenId: nftTokenId,
        ...(nftRegistryUrl && { registryUrl: nftRegistryUrl }),
        ...(nftChainName && { chainName: nftChainName }),
    };
    try {
      const res = await fetch(`/api/v1/dpp/${nftProductId}/link-nft`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${MOCK_API_KEY}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Ownership NFT Linked (Mock)", description: data.message });
        if (data.updatedProduct) updateDppLocally(data.updatedProduct);
      } else {
        handleApiError(res, "Linking Ownership NFT");
      }
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "An unknown error occurred";
        toast({ title: "Linking NFT Failed", description: errorMsg, variant: "destructive" });
    }
    setIsActionLoading(false);
  };

  const handleSubmitMockProposal = async (e: FormEvent) => {
    e.preventDefault();
    if (!proposalTargetTokenId && (proposalActionType === 'enableTransfer')) {
      toast({ title: "Token ID Required", description: "Please specify a Target Token ID for 'Enable Transfer' action.", variant: "destructive" });
      return;
    }
    if (!proposalTargetAddress && (proposalActionType.includes("ROLE"))) {
      toast({ title: "Target Address Required", description: "Please specify a Target Address for role management actions.", variant: "destructive" });
      return;
    }
    if (!proposalDescription.trim()) {
      toast({ title: "Proposal Description Required", description: "Please provide a rationale for the proposal.", variant: "destructive" });
      return;
    }

    setIsSubmittingProposal(true);
    await new Promise(resolve => setTimeout(resolve, 700)); // Simulate network delay

    // In a real app, this would interact with the Governor contract.
    // Here, we just show a toast.
    const newProposal: MockDaoProposal = {
        id: `PROP${(daoProposals.length + 1).toString().padStart(3,'0')}`,
        title: `${proposalActionType.replace(/([A-Z])/g, ' $1').trim()} for ${proposalActionType.includes("ROLE") ? proposalTargetAddress.substring(0,10) + "..." : "Token " + proposalTargetTokenId}`,
        description: proposalDescription,
        status: 'Voting Active',
        votesFor: 0,
        votesAgainst: 0
    };
    setDaoProposals(prev => [newProposal, ...prev]);

    toast({
      title: "Mock DAO Proposal Submitted",
      description: `Proposal "${newProposal.title}" submitted successfully. It is now in 'Voting Active' state (conceptual).`,
      duration: 7000,
    });
    setProposalTargetTokenId(selected?.id || ""); // Reset to selected product or clear
    // setProposalActionType("enableTransfer"); // Keep current for potentially more proposals of same type
    setProposalTargetAddress("");
    setProposalDescription("");
    setIsSubmittingProposal(false);
  };
  
  const handleVoteOnProposal = (proposalId: string, voteType: 'for' | 'against') => {
    setDaoProposals(prev => prev.map(p => {
      if (p.id === proposalId && p.status === 'Voting Active') {
        return {
          ...p,
          votesFor: voteType === 'for' ? (p.votesFor || 0) + (Math.floor(Math.random() * 50) + 10) : p.votesFor,
          votesAgainst: voteType === 'against' ? (p.votesAgainst || 0) + (Math.floor(Math.random() * 20) + 5) : p.votesAgainst,
        };
      }
      return p;
    }));
    toast({title: "Vote Recorded (Mock)", description: `Your vote on proposal ${proposalId} has been conceptually recorded.`});
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
            <li><strong>Smart Contract Actions:</strong> Conceptual interactions for on-chain status updates and event logging.</li>
            <li><strong>Authenticity & Ownership:</strong> Issuing conceptual VCs for authenticity and linking NFTs for ownership.</li>
          </ul>
          <p className="mt-2">
            These operations interact with mock API endpoints. For technical details, refer to the 
            <Link href="/openapi.yaml" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium ml-1">
              OpenAPI Specification <ExternalLink className="inline h-3.5 w-3.5 ml-0.5" />
            </Link>.
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
                                    </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <BlockchainStatus product={dpp} />
                                    </CardContent>
                                </Card>

                                {dpp.blockchainIdentifiers?.anchorTransactionHash ? (
                                  <Card className="bg-background">
                                    <CardHeader><CardTitle className="text-md flex items-center"><Anchor className="mr-2 h-4 w-4 text-green-600"/>DPP Anchoring Status</CardTitle></CardHeader>
                                    <CardContent className="space-y-1.5 text-sm">
                                      <p className="font-medium text-green-700">Product is Anchored.</p>
                                      {dpp.blockchainIdentifiers.platform && <p><strong className="text-muted-foreground">Platform:</strong> {dpp.blockchainIdentifiers.platform}</p>}
                                      {dpp.blockchainIdentifiers.contractAddress && <p><strong className="text-muted-foreground">Contract:</strong> <span className="font-mono text-xs break-all">{dpp.blockchainIdentifiers.contractAddress}</span></p>}
                                      {dpp.blockchainIdentifiers.tokenId && <p><strong className="text-muted-foreground">Token ID:</strong> <span className="font-mono text-xs break-all">{dpp.blockchainIdentifiers.tokenId}</span></p>}
                                      <p><strong className="text-muted-foreground">Tx Hash:</strong> <span className="font-mono text-xs break-all">{dpp.blockchainIdentifiers.anchorTransactionHash}</span></p>
                                      <Link href={`${TX_EXPLORER_BASE_URL}${dpp.blockchainIdentifiers.anchorTransactionHash}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs inline-flex items-center">
                                        View on Mock Explorer <ExternalLink className="inline h-3 w-3 ml-1" />
                                      </Link>
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
                                        {(dpp.traceability?.supplyChainSteps || []).length > 0 ? (
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
                                            {isActionLoading === "custody" ? "Processing..." : "Add Custody Step"}
                                        </Button>
                                      </div>
                                    </form>
                                  </CardContent>
                                </Card>
                                
                                <Card className="bg-background">
                                  <CardHeader><CardTitle className="text-md flex items-center"><FileText className="mr-2 h-4 w-4 text-info"/>Verifiable Credentials</CardTitle></CardHeader>
                                  <CardContent>
                                     <h4 className="font-medium mb-1.5 text-sm">Linked VCs in Product Data:</h4>
                                    {(dpp.verifiableCredentials && dpp.verifiableCredentials.length > 0) ? (
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
                                            {isActionLoading === "transfer" ? "Processing..." : "Transfer Ownership"}
                                        </Button>
                                      </form>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card className="bg-background mt-6 md:col-span-2">
                              <CardHeader>
                                <CardTitle className="text-md flex items-center"><ListCollapse className="mr-2 h-4 w-4 text-info"/>Conceptual Smart Contract &amp; Public Layer Actions</CardTitle>
                                <CardDescription className="text-xs">Simulate direct interactions with a DPP smart contract or public layer operations.</CardDescription>
                              </CardHeader>
                              <CardContent className="grid sm:grid-cols-2 gap-x-6 gap-y-8">
                                <form onSubmit={handleUpdateOnChainStatus} className="space-y-3 p-3 border rounded-md">
                                  <h4 className="font-medium text-sm flex items-center"><Sigma className="h-4 w-4 mr-1.5 text-primary"/>Update On-Chain DPP Status</h4>
                                  <p className="text-xs text-muted-foreground">Simulate updating the product's status on the blockchain (e.g., after recall).</p>
                                  <Select value={onChainStatusUpdate} onValueChange={setOnChainStatusUpdate}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="active">Active</SelectItem>
                                      <SelectItem value="recalled">Recalled</SelectItem>
                                      <SelectItem value="flagged_for_review">Flagged for Review</SelectItem>
                                      <SelectItem value="archived">Archived (End of Life)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button type="submit" size="sm" disabled={isUpdatingOnChainStatusLoading}>
                                    {isUpdatingOnChainStatusLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sigma className="mr-2 h-4 w-4" />}
                                    {isUpdatingOnChainStatusLoading ? "Submitting..." : "Update Mock Status"}
                                  </Button>
                                </form>
                                <form onSubmit={handleLogCriticalEvent} className="space-y-3 p-3 border rounded-md">
                                  <h4 className="font-medium text-sm flex items-center"><MessageSquareWarning className="h-4 w-4 mr-1.5 text-primary"/>Log Critical Event On-Chain</h4>
                                  <p className="text-xs text-muted-foreground">Simulate recording a critical event (e.g., major defect, safety recall details).</p>
                                  <Textarea value={criticalEventDescription} onChange={e => setCriticalEventDescription(e.target.value)} placeholder="Enter event description..." rows={1} />
                                  <Select value={criticalEventSeverity} onValueChange={(value) => setCriticalEventSeverity(value as 'High' | 'Medium' | 'Low')}>
                                    <SelectTrigger><SelectValue placeholder="Select Severity" /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="High">High</SelectItem>
                                      <SelectItem value="Medium">Medium</SelectItem>
                                      <SelectItem value="Low">Low</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button type="submit" size="sm" disabled={isLoggingCriticalEventLoading}>
                                    {isLoggingCriticalEventLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageSquareWarning className="mr-2 h-4 w-4" />}
                                    {isLoggingCriticalEventLoading ? "Submitting..." : "Log Mock Event"}
                                  </Button>
                                </form>
                                <form onSubmit={handleUpdateOnChainLifecycleStage} className="space-y-3 p-3 border rounded-md">
                                  <h4 className="font-medium text-sm flex items-center"><Layers className="h-4 w-4 mr-1.5 text-primary"/>Update DPP Lifecycle Stage On-Chain</h4>
                                  <p className="text-xs text-muted-foreground">Simulate updating the product's lifecycle stage on the blockchain.</p>
                                  <Select value={onChainLifecycleStage} onValueChange={setOnChainLifecycleStage}>
                                    <SelectTrigger><SelectValue placeholder="Select Lifecycle Stage" /></SelectTrigger>
                                    <SelectContent>
                                      {lifecycleStageOptions.map(stage => (
                                        <SelectItem key={stage} value={stage}>{stage.replace(/([A-Z])/g, ' $1').trim()}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Button type="submit" size="sm" disabled={isUpdatingLifecycleStageLoading}>
                                    {isUpdatingLifecycleStageLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Layers3 className="mr-2 h-4 w-4" />}
                                    {isUpdatingLifecycleStageLoading ? "Updating..." : "Update Mock Stage"}
                                  </Button>
                                </form>
                                <form onSubmit={handleRegisterVcHash} className="space-y-3 p-3 border rounded-md">
                                  <h4 className="font-medium text-sm flex items-center"><Hash className="h-4 w-4 mr-1.5 text-primary"/>Register Verifiable Credential Hash On-Chain</h4>
                                  <p className="text-xs text-muted-foreground">Simulate registering a VC hash on the blockchain for integrity verification.</p>
                                  <Input value={vcIdToRegister} onChange={e => setVcIdToRegister(e.target.value)} placeholder="Verifiable Credential ID (e.g., urn:uuid:...)" />
                                  <Input value={vcHashToRegister} onChange={e => setVcHashToRegister(e.target.value)} placeholder="VC Hash (SHA256)" />
                                  <Button type="submit" size="sm" disabled={isRegisteringVcHashLoading}>
                                    {isRegisteringVcHashLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Hash className="mr-2 h-4 w-4" />}
                                    {isRegisteringVcHashLoading ? "Registering..." : "Register Mock VC Hash"}
                                  </Button>
                                </form>
                                <form onSubmit={handleIssueAuthVc} className="space-y-3 p-3 border rounded-md">
                                  <h4 className="font-medium text-sm flex items-center"><FileLock className="h-4 w-4 mr-1.5 text-primary"/>Issue Authentication VC (Mock)</h4>
                                  <p className="text-xs text-muted-foreground">Simulate issuing a Verifiable Credential attesting to product authenticity.</p>
                                  <Input value={authVcProductId} onChange={e => setAuthVcProductId(e.target.value)} placeholder="Product ID (pre-filled)" />
                                  <Button type="submit" size="sm" disabled={isActionLoading === "issueAuthVc" || !authVcProductId}>
                                    {isActionLoading === "issueAuthVc" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileLock className="mr-2 h-4 w-4" />}
                                    {isActionLoading === "issueAuthVc" ? "Issuing..." : "Issue Auth VC"}
                                  </Button>
                                </form>
                                <form onSubmit={handleLinkNft} className="space-y-3 p-3 border rounded-md">
                                  <h4 className="font-medium text-sm flex items-center"><Tag className="h-4 w-4 mr-1.5 text-primary"/>Link Ownership NFT (Mock)</h4>
                                  <p className="text-xs text-muted-foreground">Simulate linking an NFT representing product ownership.</p>
                                  <Input value={nftProductId} onChange={e => setNftProductId(e.target.value)} placeholder="Product ID (pre-filled)" />
                                  <Input value={nftRegistryUrl} onChange={e => setNftRegistryUrl(e.target.value)} placeholder="NFT Registry URL (e.g., OpenSea, Rarible)" />
                                  <Input value={nftContractAddress} onChange={e => setNftContractAddress(e.target.value)} placeholder="NFT Contract Address (e.g., 0x...)" />
                                  <Input value={nftTokenId} onChange={e => setNftTokenId(e.target.value)} placeholder="NFT Token ID (e.g., 123)" />
                                  <Input value={nftChainName} onChange={e => setNftChainName(e.target.value)} placeholder="Blockchain Name (e.g., Ethereum)" />
                                  <Button type="submit" size="sm" disabled={isActionLoading === "linkNft" || !nftProductId || !nftContractAddress || !nftTokenId}>
                                    {isActionLoading === "linkNft" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Tag className="mr-2 h-4 w-4" />}
                                    {isActionLoading === "linkNft" ? "Linking..." : "Link Ownership NFT"}
                                  </Button>
                                </form>
                              </CardContent>
                            </Card>


                            <div className="md:col-span-2 mt-6">
                                <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center">
                                    <KeyRound className="mr-2 h-5 w-5 text-primary" /> DPP Token Operations (Conceptual)
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                These operations simulate interactions with smart contracts related to DPP tokens. For details on the
                                underlying design, refer to the project's{" "}
                                <Link href="/developer/docs/ebsi-integration" className="text-primary hover:underline">
                                    blockchain architecture documentation
                                </Link>.
                                </p>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <Card className="bg-background">
                                        <CardHeader>
                                            <CardTitle className="text-md flex items-center"><PlusCircle className="h-4 w-4 mr-1.5 text-primary"/>Mint Token</CardTitle>
                                            <CardDescription className="text-xs">Simulates creating a unique blockchain token (e.g., ERC-721 NFT) representing this DPP.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <form onSubmit={handleMintToken} className="space-y-3">
                                                <Input value={mintContractAddress} onChange={e => setMintContractAddress(e.target.value)} placeholder="Contract Address (e.g., 0x...)" />
                                                <Input value={mintRecipientAddress} onChange={e => setMintRecipientAddress(e.target.value)} placeholder="Recipient Address (e.g., 0x...)" />
                                                <Input value={mintMetadataUri} onChange={e => setMintMetadataUri(e.target.value)} placeholder="Metadata URI (e.g., ipfs://...)" />
                                                <Button type="submit" size="sm" disabled={isActionLoading === "mintToken" || !selected}>
                                                    {isActionLoading === "mintToken" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                                                    {isActionLoading === "mintToken" ? "Processing..." : "Mint Token"}
                                                </Button>
                                                {mintResponse?.transactionHash && (
                                                    <p className="text-xs text-muted-foreground mt-1"> Tx Hash: <Link href={`${TX_EXPLORER_BASE_URL}${mintResponse.transactionHash}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-mono break-all">{mintResponse.transactionHash} <ExternalLink className="inline h-3 w-3 ml-0.5"/></Link></p>
                                                )}
                                                {renderApiResult("Mint Token", mintResponse, !!(mintResponse && mintResponse.error))}
                                            </form>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-background">
                                        <CardHeader>
                                            <CardTitle className="text-md flex items-center"><FileEdit className="h-4 w-4 mr-1.5 text-primary"/>Update Token Metadata</CardTitle>
                                            <CardDescription className="text-xs">Simulates updating the on-chain metadata URI (e.g., tokenURI) for an existing token.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <form onSubmit={handleUpdateTokenMetadata} className="space-y-3">
                                                <Input value={updateTokenId} onChange={e => setUpdateTokenId(e.target.value)} placeholder={selected?.blockchainIdentifiers?.tokenId ? `Token ID (e.g., ${selected.blockchainIdentifiers.tokenId})` : "Enter Token ID"} />
                                                <Input value={updateMetadataUri} onChange={e => setUpdateMetadataUri(e.target.value)} placeholder="New Metadata URI (e.g., ipfs://...)" />
                                                <Button type="submit" size="sm" disabled={isActionLoading === "updateTokenMeta" || !updateTokenId}>
                                                    {isActionLoading === "updateTokenMeta" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileEdit className="mr-2 h-4 w-4" />}
                                                    {isActionLoading === "updateTokenMeta" ? "Processing..." : "Update Metadata"}
                                                </Button>
                                                {updateTokenResponse?.transactionHash && (
                                                     <p className="text-xs text-muted-foreground mt-1">Tx Hash: <Link href={`${TX_EXPLORER_BASE_URL}${updateTokenResponse.transactionHash}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-mono break-all">{updateTokenResponse.transactionHash} <ExternalLink className="inline h-3 w-3 ml-0.5"/></Link></p>
                                                )}
                                                {renderApiResult("Update Token Metadata", updateTokenResponse, !!(updateTokenResponse && updateTokenResponse.error))}
                                            </form>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-background">
                                        <CardHeader>
                                            <CardTitle className="text-md flex items-center"><InfoIconLucide className="h-4 w-4 mr-1.5 text-primary"/>Get Token Status</CardTitle>
                                            <CardDescription className="text-xs">Simulates fetching the current on-chain status of a token.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <form onSubmit={handleGetTokenStatus} className="space-y-3">
                                                <Input value={statusTokenId} onChange={e => setStatusTokenId(e.target.value)} placeholder={selected?.blockchainIdentifiers?.tokenId ? `Token ID (e.g., ${selected.blockchainIdentifiers.tokenId})` : "Enter Token ID"} />
                                                <Button type="submit" size="sm" disabled={isActionLoading === "gettingTokenStatus" || !statusTokenId}>
                                                    {isActionLoading === "gettingTokenStatus" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <InfoIconLucide className="mr-2 h-4 w-4" />}
                                                    {isActionLoading === "gettingTokenStatus" ? "Fetching..." : "Get Status"}
                                                </Button>
                                                {parsedTokenStatus && (
                                                <div className="mt-2 space-y-1.5 p-3 text-xs border rounded bg-muted/30">
                                                    <div className="flex items-center justify-between"><strong className="text-muted-foreground">Owner:</strong> <span className="font-mono text-foreground/90 break-all">{parsedTokenStatus.ownerAddress}</span></div>
                                                    <div className="flex items-center justify-between"><strong className="text-muted-foreground">Status:</strong><Badge variant={getTokenStatusVisuals(parsedTokenStatus.status).badge} className={cn("capitalize", getTokenStatusVisuals(parsedTokenStatus.status).color)}>{React.createElement(getTokenStatusVisuals(parsedTokenStatus.status).icon, {className: "mr-1.5 h-3.5 w-3.5"})}{parsedTokenStatus.status}</Badge></div>
                                                    {parsedTokenStatus.metadataUri && <div className="flex items-center justify-between"><strong className="text-muted-foreground">Metadata URI:</strong> <Link href={parsedTokenStatus.metadataUri} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-mono break-all">{parsedTokenStatus.metadataUri} <ExternalLink className="inline h-3 w-3 ml-0.5"/></Link></div>}
                                                    <div className="flex items-center justify-between"><strong className="text-muted-foreground">Minted At:</strong> <span className="text-foreground/90">{new Date(parsedTokenStatus.mintedAt).toLocaleString()}</span></div>
                                                    {parsedTokenStatus.lastTransactionHash && <div className="flex items-center justify-between"><strong className="text-muted-foreground">Last Tx:</strong> <Link href={`${TX_EXPLORER_BASE_URL}${parsedTokenStatus.lastTransactionHash}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-mono break-all">{parsedTokenStatus.lastTransactionHash} <ExternalLink className="inline h-3 w-3 ml-0.5"/></Link></div>}
                                                </div>
                                                )}
                                                {renderApiResult("Token Status Raw", statusTokenResponse)}
                                            </form>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-background">
                                        <CardHeader>
                                            <CardTitle className="text-md flex items-center"><FileJson className="h-4 w-4 mr-1.5 text-primary"/>View Off-Chain Token Metadata</CardTitle>
                                            <CardDescription className="text-xs">Simulates fetching and displaying the JSON metadata linked by the token's URI (e.g., from IPFS).</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <form onSubmit={handleViewTokenMetadata} className="space-y-3">
                                                <Input value={viewTokenId} onChange={e => setViewTokenId(e.target.value)} placeholder={selected?.blockchainIdentifiers?.tokenId || parsedTokenStatus?.tokenId || "Enter Token ID or Get Status"} />
                                                <Button type="submit" size="sm" disabled={isViewingTokenMetadata || (!viewTokenId && !parsedTokenStatus?.metadataUri)}>
                                                    {isViewingTokenMetadata ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileJson className="mr-2 h-4 w-4" />}
                                                    {isViewingTokenMetadata ? "Fetching..." : "View Metadata"}
                                                </Button>
                                                {renderApiResult("Off-Chain Token Metadata", viewTokenMetadataResponse)}
                                            </form>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                             {/* DAO Governance Section */}
                            <Card className="bg-background mt-6 md:col-span-2">
                                <CardHeader>
                                    <CardTitle className="text-md flex items-center">
                                        <DaoIcon className="mr-2 h-5 w-5 text-primary" /> DAO Governance &amp; Proposals (Conceptual)
                                    </CardTitle>
                                    <CardDescription className="text-xs">Simulate creating and interacting with DAO proposals for DPPToken management.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <form onSubmit={handleSubmitMockProposal} className="p-4 border rounded-md space-y-4 bg-muted/30">
                                        <h4 className="font-medium text-sm text-foreground">Create New Mock Proposal</h4>
                                        <div>
                                            <Label htmlFor="proposalTokenId">Target Token ID (for 'Enable Transfer')</Label>
                                            <Input id="proposalTokenId" value={proposalTargetTokenId} onChange={e => setProposalTargetTokenId(e.target.value)} placeholder="e.g., DPP001" disabled={proposalActionType !== 'enableTransfer'} />
                                        </div>
                                        <div>
                                            <Label htmlFor="proposalActionType">Action Type</Label>
                                            <Select value={proposalActionType} onValueChange={setProposalActionType}>
                                                <SelectTrigger id="proposalActionType"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="enableTransfer">Enable Transfer for Token</SelectItem>
                                                    <SelectItem value="grantMinterRole">Grant MINTER_ROLE</SelectItem>
                                                    <SelectItem value="grantUpdaterRole">Grant UPDATER_ROLE</SelectItem>
                                                    <SelectItem value="revokeMinterRole">Revoke MINTER_ROLE</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {proposalActionType.includes("ROLE") && (
                                          <div>
                                            <Label htmlFor="proposalTargetAddress">Target Address (for Role Action)</Label>
                                            <Input id="proposalTargetAddress" value={proposalTargetAddress} onChange={e => setProposalTargetAddress(e.target.value)} placeholder="0x..." />
                                          </div>
                                        )}
                                        <div>
                                            <Label htmlFor="proposalDescription">Proposal Description / Rationale</Label>
                                            <Textarea id="proposalDescription" value={proposalDescription} onChange={e => setProposalDescription(e.target.value)} placeholder="Explain the purpose of this proposal..." rows={2} />
                                        </div>
                                        <Button type="submit" size="sm" disabled={isSubmittingProposal}>
                                            {isSubmittingProposal ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                            {isSubmittingProposal ? "Submitting..." : "Submit Mock Proposal"}
                                        </Button>
                                    </form>
                                    <div>
                                        <h4 className="font-medium text-sm text-foreground mb-2">Mock Proposal List</h4>
                                        <div className="space-y-3 max-h-60 overflow-y-auto">
                                            {daoProposals.map(prop => (
                                                <Card key={prop.id} className="p-3 bg-background/70">
                                                    <div className="flex justify-between items-start">
                                                        <h5 className="font-semibold text-xs text-primary">{prop.id}: {prop.title}</h5>
                                                        <Badge variant={
                                                            prop.status === 'Voting Active' ? 'outline' :
                                                            prop.status === 'Succeeded & Executed' ? 'default' :
                                                            prop.status === 'Defeated' ? 'destructive' : 'secondary'
                                                        } className={cn(
                                                            "text-[0.65rem] px-1.5 py-0.5",
                                                            prop.status === 'Voting Active' && "border-yellow-500 text-yellow-600 bg-yellow-500/10",
                                                            prop.status === 'Succeeded & Executed' && "border-green-500 text-green-700 bg-green-500/10",
                                                            prop.status === 'Defeated' && "border-red-500 text-red-700 bg-red-500/10",
                                                            prop.status === 'Queued' && "border-blue-500 text-blue-700 bg-blue-500/10",
                                                        )}>
                                                            {prop.status}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-0.5 mb-1.5">{prop.description}</p>
                                                    {prop.status === 'Voting Active' && (
                                                        <div className="flex items-center justify-between text-xs">
                                                            <div className="flex gap-2">
                                                                <Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-500/10 h-auto p-1 text-xs" onClick={() => handleVoteOnProposal(prop.id, 'for')}>
                                                                    <ThumbsUp className="h-3 w-3 mr-1"/> For ({prop.votesFor || 0})
                                                                </Button>
                                                                <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-500/10 h-auto p-1 text-xs" onClick={() => handleVoteOnProposal(prop.id, 'against')}>
                                                                    <ThumbsDown className="h-3 w-3 mr-1"/> Against ({prop.votesAgainst || 0})
                                                                </Button>
                                                            </div>
                                                            <span className="text-muted-foreground">Voting Ends: Mock 5 days</span>
                                                        </div>
                                                    )}
                                                </Card>
                                            ))}
                                            {daoProposals.length === 0 && <p className="text-xs text-muted-foreground text-center py-2">No DAO proposals yet.</p>}
                                        </div>
                                    </div>
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
