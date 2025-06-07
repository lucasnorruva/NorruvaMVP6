
// --- File: page.tsx (Webhooks Guide Docs) ---
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Webhook, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WebhooksGuidePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <Webhook className="mr-3 h-7 w-7 text-primary" />
          Webhooks Guide
        </h1>
        <Button variant="outline" asChild>
            <Link href="/developer"><ArrowLeft className="mr-2 h-4 w-4" />Back to Developer Portal</Link>
        </Button>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Content Coming Soon</AlertTitle>
        <AlertDescription>
          This page will provide a comprehensive guide on using Webhooks with the Norruva DPP platform to receive real-time event notifications.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Understanding Webhooks</CardTitle>
          <CardDescription>
            Webhooks allow your applications to receive real-time HTTP notifications when specific events occur within the Norruva platform, such as DPP status changes or compliance updates.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            This guide will cover:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>How to register and manage webhook endpoints.</li>
            <li>Available event types you can subscribe to.</li>
            <li>Payload structure for different event notifications.</li>
            <li>Best practices for securing and handling webhook requests.</li>
            <li>Retry mechanisms and error handling.</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Detailed information, code examples, and setup instructions will be available here shortly. You can manage your webhooks in the <Link href="/developer#webhooks-manager" className="text-primary hover:underline">Webhooks Manager section</Link> of the Developer Portal.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
