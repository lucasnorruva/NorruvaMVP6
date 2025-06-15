// --- File: ApiKeysManager.tsx ---
// Description: Component for managing API Keys in the Developer Portal.
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { KeyRound, PlusCircle, Copy, Trash2, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface ApiKey {
  id: string;
  key: string;
  type: "Sandbox" | "Production";
  created: string;
  lastUsed: string;
  status: "Active" | "Pending Approval" | "Revoked";
  scopes?: string[]; // Added scopes
}

interface ApiKeysManagerProps {
  apiKeys: ApiKey[];
  onCopyKey: (keyToCopy: string) => void;
  onGenerateSandboxKey: () => void;
  onRequestProductionKey: () => void;
  onDeleteApiKey: (keyId: string) => void;
}

export default function ApiKeysManager({
  apiKeys,
  onCopyKey,
  onGenerateSandboxKey,
  onRequestProductionKey,
  onDeleteApiKey,
}: ApiKeysManagerProps) {
  return (
    <Card className="shadow-lg" id="api_keys"> {/* Changed id to match link */}
      <CardHeader>
        <CardTitle className="font-headline flex items-center"><KeyRound className="mr-3 h-6 w-6 text-primary" /> API Keys</CardTitle>
        <CardDescription>Manage your API keys for accessing Norruva platform services. Scopes shown are conceptual.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Key (Partial)</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Used</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Scopes (Conceptual)</TableHead> {/* New Column */}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys.map((apiKey) => (
              <TableRow key={apiKey.id}>
                <TableCell className="font-mono text-sm">{apiKey.key.startsWith("N/A") ? apiKey.key : `${apiKey.key.substring(0, 12)}...`}</TableCell>
                <TableCell>
                  <Badge 
                    variant={apiKey.type === "Sandbox" ? "secondary" : "default"}
                    className={cn(
                      apiKey.type === "Sandbox" ? "bg-muted text-muted-foreground border-border" : "bg-primary/20 text-primary border-primary/30"
                    )}
                  >
                    {apiKey.type}
                  </Badge>
                </TableCell>
                <TableCell>{apiKey.created}</TableCell>
                <TableCell>{apiKey.lastUsed}</TableCell>
                <TableCell>
                  <Badge
                    variant={apiKey.status === "Active" ? "default" : "outline"}
                    className={cn(
                      "capitalize",
                      apiKey.status === "Active" && "bg-green-100 text-green-700 border-green-300",
                      apiKey.status === "Pending Approval" && "bg-yellow-100 text-yellow-700 border-yellow-300",
                      apiKey.status === "Revoked" && "bg-muted text-muted-foreground border-border line-through"
                    )}
                  >
                    {apiKey.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs"> {/* Scopes Cell */}
                  {apiKey.scopes && apiKey.scopes.length > 0 ? (
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {apiKey.scopes.map(scope => (
                        <TooltipProvider key={scope} delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline" className="px-1.5 py-0.5 text-[0.65rem] bg-blue-500/10 text-blue-700 border-blue-500/30">
                                {scope}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent><p>{scope} permission</p></TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Copy API key"
                    onClick={() => onCopyKey(apiKey.key)}
                    title="Copy Key"
                    disabled={apiKey.status === 'Pending Approval' || apiKey.key.startsWith("N/A") || apiKey.status === 'Revoked'}
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy API key</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Delete API key"
                    title="Delete Key"
                    onClick={() => onDeleteApiKey(apiKey.id)}
                    className="text-destructive hover:text-destructive"
                    disabled={apiKey.status === 'Revoked'} 
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete API key</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
             {apiKeys.length === 0 && (
                <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-4"> {/* Adjusted colSpan */}
                        No API keys found. Generate or request one below.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex flex-wrap gap-4">
          <Button variant="secondary" onClick={onGenerateSandboxKey}>
            <PlusCircle className="mr-2 h-5 w-5" /> Generate New Sandbox Key
          </Button>
          <Button variant="outline" onClick={onRequestProductionKey}>Request Production Key</Button>
        </div>
        <p className="text-xs text-muted-foreground">API keys provide access to your account data. Keep them secure and do not share them publicly.</p>
      </CardContent>
    </Card>
  );
}

