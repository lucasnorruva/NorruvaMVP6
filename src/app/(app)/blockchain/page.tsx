
"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Fingerprint, ShieldCheck, InfoIcon, AlertCircle, Anchor, Link2, Edit, UploadCloud, KeyRound, FileText, Send } from "lucide-react";
import { CardDescription } from "@/components/ui/card";
import type { DigitalProductPassport } from "@/types/dpp";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
const EBSI_EXPLORER_BASE_URL = "https://mock-ebsi-explorer.example.com/tx/";
const MOCK_API_KEY = "SANDBOX_KEY_123"; // Use a key known from .env.example or tests

const getEbsiStatusBadge = (status?: "verified" | "pending" | "not_verified" | "error" | string) => {
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
      {/* TODO: Provide more detailed EBSI anchoring status visualization (e.g., transaction progress) */}
      {product.blockchainIdentifiers?.anchorTransactionHash ? (
        <>
          <div className="flex flex-col mb-1">
            <span className="text-xs text-muted-foreground">Product Record Hash:</span>
            <span className="font-mono text-xs break-all text-foreground/90" title={product.blockchainIdentifiers.anchorTransactionHash!}>
              {product.blockchainIdentifiers.anchorTransactionHash}
            </span>
          </div>
 {/* Added EBSI Explorer Link block for clarity */}
          <div className="flex flex-col mb-2"> {/* Increased bottom margin */}
            <span className="text-xs text-muted-foreground">EBSI Explorer:</span>
            <a href={`${EBSI_EXPLORER_BASE_URL}${product.blockchainIdentifiers.anchorTransactionHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">
              View on EBSI Explorer
            </a>
          </div>
 {/* Display EBSI Verification ID */}
 {product.ebsiVerification?.verificationId && (
            <div className="flex flex-col mb-1">
              <span className="text-xs text-muted-foreground">EBSI Verification ID:</span>
              <span className="font-mono text-xs text-foreground/90 break-all">
                {product.ebsiVerification.verificationId}
              </span>
            </div>
 )}
 {/* Display EBSI Issuer DID, Schema, and Issuance Date if available */}
          {product.ebsiVerification?.issuerDid && (<div className="flex flex-col mb-1"><span className="text-xs text-muted-foreground">EBSI Issuer DID:</span><span className="font-mono text-xs text-foreground/90 break-all">{product.ebsiVerification.issuerDid}</span></div>)}
          {product.ebsiVerification?.schema && (<div className="flex flex-col mb-1"><span className="text-xs text-muted-foreground">EBSI Schema:</span><span className="font-mono text-xs text-foreground/90 break-all">{product.ebsiVerification.schema}</span></div>)}
          {product.ebsiVerification?.issuanceDate && (<div className="flex flex-col mb-1"><span className="text-xs text-muted-foreground">EBSI Issuance Date:</span><span className="font-mono text-xs text-foreground/90 break-all">{new Date(product.ebsiVerification.issuanceDate).toLocaleString()}</span></div>)}
 </>
      ) : null /* Render nothing if no anchor hash */ }
      {product.blockchainIdentifiers?.platform && (
        <div className="flex flex-col mb-1">
          <span className="text-xs text-muted-foreground">Platform:</span>
          <span className="text-foreground/90">{product.blockchainIdentifiers.platform}</span>
        </div>
      )}
 {product.ebsiVerification?.status && (
        <div className="flex flex-col mb-1">
          <span className="text-xs text-muted-foreground">EBSI Verification Status:</span>
          <div className="flex items-center mt-0.5">{getEbsiStatusBadge(product.ebsiVerification.status as any)}</div>
        </div>
      )}
      {!product.blockchainIdentifiers?.anchorTransactionHash && !product.ebsiVerification?.status && (
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

  const [anchorPlatform, setAnchorPlatform] = useState("");
  const [custodyStep, setCustodyStep] = useState({ stepName: "", actorDid: "", timestamp: "", location: "", transactionHash: "" });
  const [transferName, setTransferName] = useState("");
  const [transferDid, setTransferDid] = useState("");
  const [transferTime, setTransferTime] = useState("");

  useEffect(() => {
    setIsLoading(true);
    // TODO: Add loading state indicator while fetching DPPs
    fetch(`/api/v1/dpp?blockchainAnchored=${filter}`, {

        headers: { Authorization: `Bearer ${MOCK_API_KEY}` }
    })
      .then(res => res.json())
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
      });;
  }, [filter, toast]);

  const updateDpp = (updated: DigitalProductPassport) => {
    setDpps(prev => prev.map(d => (d.id === updated.id ? updated : d)));
    if (selected && selected.id === updated.id) setSelected(updated);
  };

  const handleApiError = async (response: Response, action: string) => {
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
  };

  const handleAnchor = async (e: FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    if (!anchorPlatform) {
 toast({ title: "Validation Error", description: "Please enter a blockchain platform.", variant: "destructive" });
 setIsLoading(false);
 return;
    }
    setIsLoading(true);
    // TODO: Add loading state indicator for this action
    const res = await fetch(`/api/v1/dpp/anchor/${selected.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${MOCK_API_KEY}` },
      body: JSON.stringify({ platform: anchorPlatform }),
    });
    if (res.ok) {
      const data = await res.json();
      updateDpp(data);
      setAnchorPlatform("");
      toast({ title: "DPP Anchored", description: `Product ${selected.id} successfully anchored to ${anchorPlatform}.` });
    } else {
      handleApiError(res, "Anchoring DPP");
    };
    ;
    setIsLoading(false);
  };

  const handleAddCustody = async (e: FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    if (!custodyStep.stepName || !custodyStep.actorDid || !custodyStep.timestamp) {
 toast({ title: "Validation Error", description: "Please fill in step name, actor DID, and timestamp.", variant: "destructive" });
 setIsLoading(false);
 return;
    }
    setIsLoading(true);

    // TODO: Add loading state indicator for this action
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
      handleApiError(res, "Updating Custody");;
    };
    ;
    setIsLoading(false);
  };

  const handleTransfer = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!transferName || !transferDid || !transferTime) {
 toast({ title: "Validation Error", description: "Please fill in new owner name, DID, and transfer timestamp.", variant: "destructive" });
 setIsLoading(false);
 return;
    }
    if (!selected) return;
    // TODO: Add loading state indicator for this action
    const res = await fetch(`/api/v1/dpp/transfer-ownership/${selected.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${MOCK_API_KEY}` },
      body: JSON.stringify({ newOwner: {name: transferName, did: transferDid }, transferTimestamp: transferTime }),
    });
    if (res.ok) {
      const data = await res.json();
      updateDpp(data);
      setTransferName("");
      setTransferDid("");
      setTransferTime("");
      toast({ title: "Ownership Transferred", description: `Ownership of ${selected.id} transferred to ${transferName}.` });
    } else {;
    };
    ;
    setIsLoading(false);
      handleApiError(res, "Transferring Ownership");
    }
  };

  const fetchCredential = async (productId: string) => {
    const res = await fetch(`/api/v1/dpp/${productId}/credential`, {
        headers: { Authorization: `Bearer ${MOCK_API_KEY}` }
    });
    if (res.ok) {
      const data = await res.json();
      // Displaying credential in an alert for simplicity; a modal or dedicated view is better for real use.
      alert(
        "Verifiable Credential (Mock):\n\n" +
        "<pre><code>" +
        JSON.stringify(data, null, 2) +
        "</code></pre>"
      );

      toast({ title: "Credential Retrieved", description: "Verifiable credential data fetched (displayed in alert)." });
    } else {
      handleApiError(res, "Fetching Credential");
    }
  };

function setFilter(arg0: any): void {
  throw new Error("Function not implemented.");
}

function setSelected(arg0: any): void {
  throw new Error("Function not implemented.");
}

function handleAnchor(event: FormEvent<HTMLFormElement>): void {
  throw new Error("Function not implemented.");
}

function setAnchorPlatform(value: string): void {
  throw new Error("Function not implemented.");
}

function handleAddCustody(event: FormEvent<HTMLFormElement>): void {
  throw new Error("Function not implemented.");
}

function setCustodyStep(arg0: any): void {
  throw new Error("Function not implemented.");
}

function handleTransfer(event: FormEvent<HTMLFormElement>): void {
  throw new Error("Function not implemented.");
}

function setTransferName(value: string): void {
  throw new Error("Function not implemented.");
}

function setTransferDid(value: string): void {
  throw new Error("Function not implemented.");
}

function setTransferTime(value: string): void {
  throw new Error("Function not implemented.");
}

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-headline font-semibold">Blockchain Management</h1>

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
                      <Button variant="outline" size="sm" onClick={() => setSelected(selected?.id === dpp.id ? null : dpp)}>
                        {selected?.id === dpp.id ? "Hide Details" : "Manage"}
                      </Button>
                    </TableCell>
                  </TableRow>
                  {selected?.id === dpp.id && (
                    <TableRow>
                      <TableCell colSpan={4} className="py-4"> {/* Added padding here */}
                        <div className="p-4 border rounded-md space-y-6 bg-card">
                          <div className="mb-6">
                            <h3 className="flex items-center mb-2 font-semibold text-lg text-primary"><Fingerprint className="h-5 w-5 mr-2" />Blockchain & EBSI Details</h3>
                            <BlockchainStatus product={dpp} />

                          </div>

                          {!dpp.blockchainIdentifiers?.anchorTransactionHash && (
                            <Card className="bg-background">
                              <CardHeader><CardTitle className="text-md flex items-center"><Anchor className="mr-2 h-4 w-4 text-info"/>Anchor DPP on Blockchain</CardTitle></CardHeader>
                              <CardContent>
                                <form onSubmit={handleAnchor} className="flex flex-wrap gap-2 items-end">
 <Input value={anchorPlatform} onChange={e => setAnchorPlatform(e.target.value)} placeholder="Blockchain Platform (e.g., EBSI)" className="flex-grow sm:flex-grow-0 sm:w-60" />
                                  <Button type="submit" size="sm">Anchor Product</Button>
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
                                  <Button type="submit" size="sm" className="sm:col-start-3 md:col-start-auto">Add Custody Step</Button>
                                </div>
                              </form>
                            </CardContent>
                          </Card>
                          
                          {/* Placeholder for Verifiable Credentials Section */}
 <div className="p-4 border rounded-md space-y-3 bg-muted/30">
 <h3 className="flex items-center mb-2 font-semibold text-lg text-primary"><FileText className="h-5 w-5 mr-2" />Verifiable Credentials</h3>
 <p className="text-muted-foreground text-sm">Placeholder for Verifiable Credentials List. Will display VC type, issuer, issuance date, etc.</p>
 <p className="text-muted-foreground text-sm">Placeholder for VC Revocation Status.</p>
 <Badge variant="secondary">Revocation Status: Placeholder</Badge>
 </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <Card className="bg-background">
                              <CardHeader><CardTitle className="text-md flex items-center"><UploadCloud className="mr-2 h-4 w-4 text-info"/>Transfer Ownership</CardTitle></CardHeader>
                              <CardContent>
                                <form onSubmit={handleTransfer} className="space-y-3">
                                  <Input placeholder="New Owner Name" value={transferName} onChange={e => setTransferName(e.target.value)} />
                                  <Input placeholder="New Owner DID" value={transferDid} onChange={e => setTransferDid(e.target.value)} />
                                  <Input type="datetime-local" value={transferTime} onChange={e => setTransferTime(e.target.value)} />
                                  <Button type="submit" size="sm" className="w-full">Transfer Ownership</Button>
                                </form>
                              </CardContent>
                            </Card>
                            <Card className="bg-background">
                              <CardHeader><CardTitle className="text-md flex items-center"><FileText className="mr-2 h-4 w-4 text-info"/>Verifiable Credential</CardTitle></CardHeader>
                              <CardContent>
                                <p className="text-xs text-muted-foreground mb-2">Retrieve a mock verifiable credential for this DPP.</p>
                                <Button size="sm" variant="secondary" onClick={() => fetchCredential(dpp.id)} className="w-full">
                                  <Send className="mr-2 h-4 w-4"/> Get Credential
                                </Button>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
              {dpps.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                    No DPPs match the current filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function toast(arg0: { title: string; description: string; }) {
  throw new Error("Function not implemented.");
}

function handleApiError(res: Response, arg1: string) {
  throw new Error("Function not implemented.");
}

