"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Fingerprint, ShieldCheck, InfoIcon, AlertCircle } from "lucide-react";
import type { DigitalProductPassport } from "@/types/dpp";

const getEbsiStatusBadge = (status?: "verified" | "pending" | "not_verified" | "error") => {
  switch (status) {
    case "verified":
      return <Badge variant="default" className="bg-green-500/20 text-green-700 border-green-500/30"><ShieldCheck className="mr-1.5 h-3.5 w-3.5" />Verified</Badge>;
    case "pending":
      return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-700 border-yellow-500/30"><InfoIcon className="mr-1.5 h-3.5 w-3.5" />Pending</Badge>;
    case "not_verified":
      return <Badge variant="destructive"><AlertCircle className="mr-1.5 h-3.5 w-3.5" />Not Verified</Badge>;
    case "error":
      return <Badge variant="destructive" className="bg-red-500/20 text-red-700 border-red-500/30"><AlertCircle className="mr-1.5 h-3.5 w-3.5" />Error</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

function BlockchainStatus({ product }: { product: DigitalProductPassport }) {
  return (
    <div className="space-y-1">
      {product.blockchainIdentifiers?.anchorTransactionHash && (
        <div className="flex flex-col mb-1">
          <span className="text-xs text-muted-foreground">Product Record Hash:</span>
          <span className="font-mono text-xs break-all text-foreground/90" title={product.blockchainIdentifiers.anchorTransactionHash!}>
            {product.blockchainIdentifiers.anchorTransactionHash}
          </span>
        </div>
      )}
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
      {product.ebsiVerification?.status === "verified" && product.ebsiVerification.verificationId && (
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">EBSI Verification ID:</span>
          <span className="font-mono text-xs text-foreground/90 break-all">{product.ebsiVerification.verificationId}</span>
        </div>
      )}
      {!product.blockchainIdentifiers?.anchorTransactionHash && !product.ebsiVerification?.status && (
        <p className="text-muted-foreground">No specific blockchain or EBSI verification details available for this product.</p>
      )}
    </div>
  );
}

export default function BlockchainPage() {
  const [filter, setFilter] = useState<"all" | "anchored" | "not_anchored">("all");
  const [dpps, setDpps] = useState<DigitalProductPassport[]>([]);
  const [selected, setSelected] = useState<DigitalProductPassport | null>(null);

  const [anchorPlatform, setAnchorPlatform] = useState("");
  const [custodyStep, setCustodyStep] = useState({ stepName: "", actorDid: "", timestamp: "", location: "", transactionHash: "" });
  const [transferDid, setTransferDid] = useState("");
  const [transferTime, setTransferTime] = useState("");

  useEffect(() => {
    fetch(`/api/v1/dpp?blockchainAnchored=${filter}`)
      .then(res => res.json())
      .then(data => setDpps(data.data));
  }, [filter]);

  const updateDpp = (updated: DigitalProductPassport) => {
    setDpps(prev => prev.map(d => (d.id === updated.id ? updated : d)));
    if (selected && selected.id === updated.id) setSelected(updated);
  };

  const handleAnchor = async (e: FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    const res = await fetch(`/api/v1/dpp/anchor/${selected.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform: anchorPlatform }),
    });
    if (res.ok) {
      const data = await res.json();
      updateDpp(data);
      setAnchorPlatform("");
    }
  };

  const handleAddCustody = async (e: FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    const res = await fetch(`/api/v1/dpp/custody/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(custodyStep),
    });
    if (res.ok) {
      const data = await res.json();
      updateDpp(data);
      setCustodyStep({ stepName: "", actorDid: "", timestamp: "", location: "", transactionHash: "" });
    }
  };

  const handleTransfer = async (e: FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    const res = await fetch(`/api/v1/dpp/extend/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chainOfCustodyUpdate: { newOwnerDid: transferDid, transferTimestamp: transferTime } }),
    });
    if (res.ok) {
      const data = await res.json();
      updateDpp(data);
      setTransferDid("");
      setTransferTime("");
    }
  };

  const fetchCredential = async (productId: string) => {
    const res = await fetch(`/api/v1/dpp/${productId}/credential`);
    if (res.ok) {
      const data = await res.json();
      alert(JSON.stringify(data, null, 2));
    }
  };

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
            <SelectItem value="anchored">Anchored</SelectItem>
            <SelectItem value="not_anchored">Not Anchored</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Digital Product Passports</CardTitle>
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
                  <TableRow>
                    <TableCell>{dpp.id}</TableCell>
                    <TableCell>{dpp.productName}</TableCell>
                    <TableCell>
                      {dpp.blockchainIdentifiers?.anchorTransactionHash ? (
                        <Badge className="bg-green-100 text-green-700 border-green-300">Anchored</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-muted text-muted-foreground">Not Anchored</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => setSelected(selected?.id === dpp.id ? null : dpp)}>
                        {selected?.id === dpp.id ? "Hide" : "Manage"}
                      </Button>
                    </TableCell>
                  </TableRow>
                  {selected?.id === dpp.id && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <div className="p-4 border rounded-md space-y-6">
                          <div>
                            <div className="flex items-center mb-2 font-medium"><Fingerprint className="h-5 w-5 mr-2" />Blockchain &amp; EBSI Verification</div>
                            <BlockchainStatus product={dpp} />
                          </div>
                          {!dpp.blockchainIdentifiers?.anchorTransactionHash && (
                            <form onSubmit={handleAnchor} className="flex flex-wrap gap-2 items-end">
                              <Input value={anchorPlatform} onChange={e => setAnchorPlatform(e.target.value)} placeholder="Platform" className="w-48" />
                              <Button type="submit" size="sm">Anchor</Button>
                            </form>
                          )}
                          <div>
                            <h4 className="font-medium mb-2">Chain of Custody</h4>
                            <ul className="space-y-1 text-sm">
                              {dpp.traceability?.supplyChainSteps?.length ? (
                                dpp.traceability.supplyChainSteps.map((step, idx) => (
                                  <li key={idx} className="border-b last:border-b-0 pb-1">
                                    <span className="font-medium">{step.stepName}</span> - {new Date(step.timestamp).toLocaleString()} ({step.actorDid})
                                  </li>
                                ))
                              ) : (
                                <li className="text-muted-foreground">No steps recorded</li>
                              )}
                            </ul>
                            <form onSubmit={handleAddCustody} className="mt-2 flex flex-wrap gap-2 items-end">
                              <Input placeholder="Step Name" value={custodyStep.stepName} onChange={e => setCustodyStep({ ...custodyStep, stepName: e.target.value })} className="w-32" />
                              <Input placeholder="Actor DID" value={custodyStep.actorDid} onChange={e => setCustodyStep({ ...custodyStep, actorDid: e.target.value })} className="w-40" />
                              <Input type="datetime-local" value={custodyStep.timestamp} onChange={e => setCustodyStep({ ...custodyStep, timestamp: e.target.value })} className="w-44" />
                              <Input placeholder="Location" value={custodyStep.location} onChange={e => setCustodyStep({ ...custodyStep, location: e.target.value })} className="w-32" />
                              <Input placeholder="Tx Hash" value={custodyStep.transactionHash} onChange={e => setCustodyStep({ ...custodyStep, transactionHash: e.target.value })} className="w-36" />
                              <Button type="submit" size="sm">Add Step</Button>
                            </form>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" variant="secondary" onClick={() => fetchCredential(dpp.id)}>Get Credential</Button>
                            <form onSubmit={handleTransfer} className="flex flex-wrap gap-2 items-end">
                              <Input placeholder="New Owner DID" value={transferDid} onChange={e => setTransferDid(e.target.value)} className="w-48" />
                              <Input type="datetime-local" value={transferTime} onChange={e => setTransferTime(e.target.value)} className="w-44" />
                              <Button type="submit" size="sm">Transfer</Button>
                            </form>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

