
// --- File: page.tsx (Webhooks Guide Docs) ---
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Webhook, ArrowLeft, Settings, FileJson, ShieldCheck, ThumbsUp, RefreshCw, ListChecks } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WebhooksGuidePage() {
  const examplePayload = `{
  "eventId": "evt_123abc456def",
  "eventType": "dpp.status.updated",
  "timestamp": "2024-08-15T10:30:00Z",
  "apiVersion": "v1",
  "data": {
    "productId": "DPP001",
    "oldStatus": "pending_review",
    "newStatus": "published",
    "changedBy": "user_admin@example.com"
  },
  "environment": "sandbox"
}`;

  const exampleSignatureHeader = "X-Norruva-Signature: t=1678886400,v1=a1b2c3d4e5f6...";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <Webhook className="mr-3 h-7 w-7 text-primary" />
          Webhooks Guide (Conceptual)
        </h1>
        <Button variant="outline" asChild>
            <Link href="/developer"><ArrowLeft className="mr-2 h-4 w-4" />Back to Developer Portal</Link>
        </Button>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Conceptual Documentation</AlertTitle>
        <AlertDescription>
          This guide outlines how webhooks could conceptually function within the Norruva DPP platform to provide real-time event notifications. Specific implementation details may vary.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Info className="mr-2 h-5 w-5 text-primary"/>Understanding Webhooks</CardTitle>
          <CardDescription>
            Webhooks are automated messages sent from apps when something happens. They have a message (payload) which is sent to a unique URL – your webhook endpoint.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            In the context of the Norruva DPP platform, webhooks allow your application to receive real-time notifications about events related to Digital Product Passports, compliance statuses, or other relevant activities. This eliminates the need for your application to constantly poll our API for changes.
          </p>
          <p>
            <strong>Key Benefits:</strong>
          </p>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li><strong>Real-time Updates:</strong> Get notified instantly when events occur.</li>
            <li><strong>Efficiency:</strong> Avoid unnecessary API polling, saving resources.</li>
            <li><strong>Automation:</strong> Trigger automated workflows in your system based on events.</li>
            <li><strong>Integration:</strong> Seamlessly integrate Norruva DPP events into your existing applications and services.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary"/>Conceptual Event Types</CardTitle>
          <CardDescription>
            You would be able to subscribe to various event types. Here are some examples:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">dpp.created</code>: When a new DPP is created.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">dpp.updated</code>: When an existing DPP's information is modified.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">dpp.status.changed</code>: When a DPP's status (e.g., draft, published, archived) changes.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">compliance.status.updated</code>: When a product's compliance status for a specific regulation changes.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">ebsi.verification.completed</code>: When an EBSI verification process for a DPP completes (successfully or not).</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">supply_chain_data.request</code>: If a manufacturer requests data from a supplier.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">supply_chain_data.submitted</code>: If a supplier submits requested data.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Settings className="mr-2 h-5 w-5 text-primary"/>Webhook Setup (Conceptual)</CardTitle>
          <CardDescription>
            Configuring your webhook endpoints would be done through the Developer Portal.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            1. Navigate to the <Link href="/developer#webhooks" className="text-primary hover:underline">Webhooks section</Link> in the Developer Portal.
          </p>
          <p>
            2. Click "Add New Webhook" (or similar).
          </p>
          <p>
            3. Provide your <strong>HTTPS endpoint URL</strong>. This is the URL on your server where Norruva will send the event notifications.
          </p>
          <p>
            4. Select the specific event types you want to subscribe to for this endpoint.
          </p>
          <p>
            5. Save your webhook configuration. A unique signing secret might be generated for you to verify payloads (see Security section).
          </p>
           <p className="text-sm text-muted-foreground">
            You could have multiple webhook endpoints, each subscribing to different sets of events.
          </p>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><FileJson className="mr-2 h-5 w-5 text-primary"/>Payload Structure (Conceptual)</CardTitle>
          <CardDescription>
            Webhook notifications would be sent as HTTP POST requests with a JSON payload.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>A typical payload might look like this:</p>
          <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
            <code>
              {examplePayload}
            </code>
          </pre>
           <ul className="list-disc list-inside text-sm space-y-1 mt-2">
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">eventId</code>: Unique identifier for the event.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">eventType</code>: The type of event that occurred (e.g., "dpp.status.updated").</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">timestamp</code>: ISO 8601 timestamp of when the event occurred.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">apiVersion</code>: Version of the API that generated the event.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">data</code>: An object containing details specific to the event.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">environment</code>: Indicates if the event originated from "sandbox" or "production".</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-primary"/>Securing Your Webhooks</CardTitle>
          <CardDescription>
            It's crucial to verify that incoming webhook requests originate from Norruva.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <h4 className="font-semibold">Verify Signatures</h4>
          <p>
            Each webhook request would include a signature in an HTTP header (e.g., <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">{exampleSignatureHeader.split(':')[0]}</code>). This signature is generated using a secret key unique to your webhook endpoint.
          </p>
          <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto">
            <code>
              {exampleSignatureHeader}
            </code>
          </pre>
          <p className="text-sm">
            Your endpoint should:
          </p>
          <ol className="list-decimal list-inside text-sm space-y-1">
            <li>Parse the timestamp (<code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">t</code>) and signature(s) (<code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">v1</code>) from the header.</li>
            <li>Prepare the <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">signed_payload</code> string by concatenating the timestamp, a dot (<code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">.</code>), and the raw request body.</li>
            <li>Compute an HMAC with SHA256 using your webhook's signing secret and the <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">signed_payload</code>.</li>
            <li>Compare the computed signature with the signature(s) provided in the header. If they match, the request is authentic.</li>
          </ol>
          <h4 className="font-semibold mt-3">Other Security Best Practices</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li><strong>Use HTTPS:</strong> Always provide HTTPS URLs for your webhook endpoints.</li>
            <li><strong>Endpoint Secrecy:</strong> Keep your webhook endpoint URLs non-public if possible.</li>
            <li><strong>Idempotency:</strong> Design your event processing logic to be idempotent. This means that processing the same event multiple times should not have unintended side effects, as network issues might cause retries.</li>
          </ul>
        </CardContent>
      </Card>

       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><ThumbsUp className="mr-2 h-5 w-5 text-primary"/>Responding to Webhooks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            Your endpoint should respond to webhook requests promptly. A <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">2xx</code> HTTP status code (e.g., 200 OK) acknowledges receipt of the event.
          </p>
          <p className="text-sm">
            It's best practice to process webhook events asynchronously. Acknowledge receipt immediately, then process the payload in a background job or queue to avoid timeouts.
          </p>
          <p className="text-sm text-muted-foreground">
            Any response code outside the <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">2xx</code> range, including <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">3xx</code> redirects, will indicate to Norruva that you did not successfully receive the webhook.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><RefreshCw className="mr-2 h-5 w-5 text-primary"/>Retry Policy (Conceptual)</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            If your endpoint fails to respond with a <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">2xx</code> status code, Norruva might attempt to redeliver the webhook notification. This would typically follow an exponential backoff schedule for a certain period (e.g., up to 24 hours or a set number of retries).
          </p>
          <p className="text-sm text-muted-foreground">
            Details about the retry schedule and how to monitor failed deliveries would be available.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
