
// --- File: WebhooksManager.tsx ---
// Description: Component for managing Webhooks in the Developer Portal.
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Webhook, PlusCircle, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

// This interface should match the one in developer/page.tsx
export interface WebhookEntry {
  id: string;
  url: string;
  events: string[];
  status: "Active" | "Disabled" | "Error";
}

interface WebhooksManagerProps {
  webhooks: WebhookEntry[];
  onAddWebhook: () => void;
  onEditWebhook: (webhookId: string) => void;
  onDeleteWebhook: (webhookId: string) => void;
}

export default function WebhooksManager({
  webhooks,
  onAddWebhook,
  onEditWebhook,
  onDeleteWebhook,
}: WebhooksManagerProps) {
  return (
    <Card className="shadow-lg" id="webhooks-manager">
      <CardHeader>
        <CardTitle className="font-headline flex items-center"><Webhook className="mr-3 h-6 w-6 text-primary" /> Webhooks</CardTitle>
        <CardDescription>Configure webhooks to receive real-time notifications for events.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Endpoint URL</TableHead>
              <TableHead>Events</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {webhooks.map(wh => (
              <TableRow key={wh.id}>
                <TableCell className="truncate max-w-[150px] sm:max-w-[200px] text-sm font-mono">{wh.url}</TableCell>
                <TableCell className="text-xs max-w-[120px] truncate">{wh.events.join(', ')}</TableCell>
                <TableCell>
                  <Badge
                    variant={wh.status === "Active" ? "default" : "outline"}
                    className={cn(
                      "capitalize",
                      wh.status === "Active" && "bg-green-100 text-green-700 border-green-300",
                      wh.status === "Disabled" && "bg-muted text-muted-foreground border-border",
                      wh.status === "Error" && "bg-red-100 text-red-700 border-red-300"
                    )}
                  >
                    {wh.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon" aria-label="Edit webhook" title="Edit Webhook" onClick={() => onEditWebhook(wh.id)}>
                    <Edit2 className="h-4 w-4" />
                    <span className="sr-only">Edit webhook</span>
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Delete webhook" title="Delete Webhook" onClick={() => onDeleteWebhook(wh.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete webhook</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {webhooks.length === 0 && (
                <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
                        No webhooks configured.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
        <Button variant="secondary" onClick={onAddWebhook}>
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Webhook
        </Button>
        <p className="text-xs text-muted-foreground">Get notified about product updates, compliance changes, and more by registering webhook endpoints.</p>
      </CardContent>
    </Card>
  );
}
