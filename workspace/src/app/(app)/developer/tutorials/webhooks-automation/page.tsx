// --- File: page.tsx (Conceptual Webhooks Automation Tutorial) ---
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  Webhook,
  Terminal,
  Settings,
  Workflow,
  ShieldCheck,
} from "lucide-react";
import DocsPageLayout from "@/components/developer/DocsPageLayout";

export default function WebhooksAutomationTutorialPage() {
  const conceptualWebhookHandlerCode = `
// Conceptual Node.js/Express example
const express = require('express');
const crypto = require('crypto');
const app = express();

// Middleware to parse JSON bodies (raw for signature verification)
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

const NORRUVA_WEBHOOK_SECRET = 'your_webhook_signing_secret'; // Get this from Developer Portal

app.post('/webhook-receiver', (req, res) => {
  // 1. Verify Signature (Conceptual - Refer to Webhooks Guide for details)
  const signature = req.headers['x-norruva-signature'];
  // const timestamp = /* parse from signature */;
  // const requestBody = req.rawBody.toString();
  // const expectedSignature = crypto.createHmac('sha256', NORRUVA_WEBHOOK_SECRET)
  //                              .update(\`\${timestamp}.\${requestBody}\`)
  //                              .digest('hex');
  // if (signature !== \`t=\${timestamp},v1=\${expectedSignature}\`) {
  //   console.warn('Invalid webhook signature');
  //   return res.status(400).send('Invalid signature');
  // }

  const event = req.body;
  console.log('Received event:', event.eventType, event.data);

  // 2. Acknowledge receipt immediately
  res.status(200).send('Event received');

  // 3. Process the event asynchronously
  processEvent(event);
});

async function processEvent(event) {
  switch (event.eventType) {
    case 'dpp.status.updated':
      // Example: Update product status in your internal DB
      console.log(\`DPP \${event.data.productId} status changed to \${event.data.newStatus}\`);
      // await updateProductStatusInDB(event.data.productId, event.data.newStatus);
      break;
    case 'compliance.status.updated':
      // Example: Notify compliance team or trigger internal review
      console.log(\`Compliance for \${event.data.productId} for \${event.data.regulation} updated to \${event.data.newStatus}\`);
      // await notifyComplianceTeam(event.data.productId, event.data.regulation, event.data.newStatus);
      break;
    // Add more cases for other event types
    default:
      console.log('Unhandled event type:', event.eventType);
  }
}

// app.listen(3000, () => console.log('Webhook receiver listening on port 3000'));
  `;

  const steps = [
    {
      title: "Introduction: Why Automate with Webhooks?",
      icon: Workflow,
      content:
        "Webhooks allow your application to receive real-time notifications when specific events occur in the Norruva DPP platform (e.g., a DPP's status changes, a compliance check completes). This is more efficient than constantly polling the API for updates and enables you to build reactive, automated workflows.",
    },
    {
      title: "Prerequisites",
      icon: Settings,
      content: (
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>
            A publicly accessible HTTPS endpoint on your server to receive
            webhook POST requests.
          </li>
          <li>
            A webhook configured in the Norruva Developer Portal pointing to
            your endpoint, subscribed to the desired event types. Refer to the{" "}
            <Link
              href="/developer/docs/webhooks-guide"
              className="text-primary hover:underline"
            >
              Webhooks Guide
            </Link>{" "}
            for setup details.
          </li>
          <li>
            Your webhook signing secret (obtained from the Developer Portal when
            configuring the webhook) for verifying request authenticity.
          </li>
        </ul>
      ),
    },
    {
      title: "Step 1: Setting Up Your Webhook Receiver Endpoint",
      icon: Terminal,
      content: (
        <>
          <p className="text-sm mb-2">
            Your application needs an HTTP endpoint that accepts POST requests
            with a JSON payload. Below is a conceptual Node.js/Express example:
          </p>
          <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto max-h-96">
            <code className="language-javascript">
              {conceptualWebhookHandlerCode.trim()}
            </code>
          </pre>
        </>
      ),
    },
    {
      title: "Step 2: Verifying Webhook Signatures",
      icon: ShieldCheck,
      content: (
        <p className="text-sm">
          It's crucial to verify that incoming webhook requests originate from
          Norruva to prevent malicious attacks. Each request will include a
          signature in the{" "}
          <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
            X-Norruva-Signature
          </code>{" "}
          header. Use your webhook's signing secret to compute an HMAC SHA256
          hash of the timestamp and raw request body, then compare it to the
          provided signature. Detailed instructions are in the{" "}
          <Link
            href="/developer/docs/webhooks-guide#securing-your-webhooks"
            className="text-primary hover:underline"
          >
            Webhooks Guide - Securing Your Webhooks
          </Link>{" "}
          section. The code snippet above includes a commented-out conceptual
          verification.
        </p>
      ),
    },
    {
      title: "Step 3: Parsing the Event Payload & Responding",
      icon: Workflow,
      content: (
        <p className="text-sm">
          Once verified, parse the JSON payload from the request body. The
          payload structure typically includes{" "}
          <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
            eventId
          </code>
          ,{" "}
          <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
            eventType
          </code>
          ,{" "}
          <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
            timestamp
          </code>
          , and a{" "}
          <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
            data
          </code>{" "}
          object specific to the event.
          <br />
          <br />
          Your endpoint should{" "}
          <strong>respond quickly with a 2xx HTTP status code</strong> (e.g.,
          200 OK) to acknowledge receipt. Process the event data asynchronously
          (e.g., using a message queue or background job) to avoid timeouts if
          processing takes time.
        </p>
      ),
    },
    {
      title: "Step 4: Implementing Business Logic",
      icon: Workflow,
      content: (
        <>
          <p className="text-sm">
            Based on the{" "}
            <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
              eventType
            </code>
            , implement the desired automation in your system.
            <br />
            <strong>Examples:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4 mt-2">
            <li>
              <code className="bg-muted px-1 rounded-sm">
                dpp.status.updated
              </code>
              : Update the product status in your internal database, trigger
              inventory checks, or update marketing materials.
            </li>
            <li>
              <code className="bg-muted px-1 rounded-sm">
                compliance.status.updated
              </code>
              : Notify your compliance team, log the change for auditing, or
              automatically flag products for review.
            </li>
            <li>
              <code className="bg-muted px-1 rounded-sm">
                ebsi.verification.completed
              </code>
              : Update internal records with the verification outcome,
              potentially trigger workflows for verified products.
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Step 5: Best Practices & Error Handling",
      icon: Settings,
      content: (
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>
            <strong>Idempotency:</strong> Design your event processing to be
            idempotent. This means processing the same event multiple times
            should not have unintended side effects, as network issues might
            cause retries from Norruva.
          </li>
          <li>
            <strong>Asynchronous Processing:</strong> Acknowledge webhook
            receipt immediately (200 OK) and process the payload in a background
            job or queue.
          </li>
          <li>
            <strong>Error Handling & Logging:</strong> Log all incoming webhooks
            and any errors during processing. Implement retry mechanisms in your
            system if downstream processing fails.
          </li>
          <li>
            <strong>Monitor Endpoint Health:</strong> Ensure your webhook
            receiver endpoint is robust and monitored for availability and
            performance.
          </li>
        </ul>
      ),
    },
  ];

  return (
    <DocsPageLayout
      pageTitle="Tutorial: Automating Updates with Webhooks (Conceptual)"
      pageIcon="Webhook"
      backLink="/developer#resources"
      backLinkText="Back to Developer Resources"
      alertTitle="Conceptual Tutorial"
      alertDescription="This tutorial outlines conceptual steps for using webhooks for automation. Code examples are illustrative; always refer to the main Webhooks Guide for detailed setup and security information."
    >
      <div className="space-y-6">
        {steps.map((step, index) => (
          <Card key={index} className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center">
                <step.icon className="mr-3 h-6 w-6 text-primary" />
                {step.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {typeof step.content === "string" ? (
                <p className="text-sm text-muted-foreground">{step.content}</p>
              ) : (
                step.content
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            After understanding these concepts, refer to the specific event
            types and payload structures in the{" "}
            <Link
              href="/developer/docs/api-reference"
              className="text-primary hover:underline"
            >
              API Reference
            </Link>{" "}
            and the detailed security measures in the{" "}
            <Link
              href="/developer/docs/webhooks-guide"
              className="text-primary hover:underline"
            >
              Webhooks Guide
            </Link>{" "}
            to build a robust webhook integration.
          </p>
        </CardContent>
      </Card>
    </DocsPageLayout>
  );
}
