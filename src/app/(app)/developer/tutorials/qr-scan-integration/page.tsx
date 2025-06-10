
// --- File: page.tsx (Conceptual QR Scan Integration Tutorial) ---
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookText, Info, QrCode, Settings, Send, Smartphone, Layers, ExternalLink } from "lucide-react";
import DocsPageLayout from '@/components/developer/DocsPageLayout'; // Import the layout

export default function QrScanIntegrationTutorialPage() {
  const validateQrEndpoint = "/api/v1/qr/validate";
  const exampleApiCall = `
async function validateProductQr(qrIdentifier) {
  const response = await fetch('${validateQrEndpoint}', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY' // Use your Sandbox or Production key
    },
    body: JSON.stringify({ qrIdentifier: qrIdentifier })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'QR validation failed');
  }

  return response.json();
}

// Example Usage:
// validateProductQr("DPP001")
//   .then(summary => console.log("Product Summary:", summary))
//   .catch(error => console.error(error));
  `;

  const steps = [
    {
      title: "Introduction & Goal",
      icon: BookText,
      content: "This conceptual tutorial walks through integrating QR code scanning into a hypothetical retail mobile or web application to fetch Digital Product Passport (DPP) summaries using the Norruva API. The goal is to allow consumers to quickly access key product information."
    },
    {
      title: "Prerequisites",
      icon: Settings,
      content: (
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>
            A Norruva Developer Account and an API Key (Sandbox key for testing). 
            Get yours from the <Link href="/developer#api_keys" className="text-primary hover:underline">API Keys tab</Link>.
          </li>
          <li>Basic understanding of your chosen frontend framework (e.g., React Native, Next.js, Swift, Kotlin).</li>
          <li>Familiarity with making API requests (e.g., using <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">fetch</code> or <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">axios</code>).</li>
        </ul>
      )
    },
    {
      title: "Step 1: Implement QR Code Scanning",
      icon: Smartphone,
      content: (
        <>
          <p className="text-sm mb-2">Choose a QR code scanning library suitable for your application's platform:</p>
          <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
            <li><strong>Web Apps:</strong> Libraries like <code className="bg-muted px-1 py-0.5 rounded-sm">html5-qrcode-scanner</code> or <code className="bg-muted px-1 py-0.5 rounded-sm">react-qr-reader</code>.</li>
            <li><strong>Mobile Apps (React Native):</strong> <code className="bg-muted px-1 rounded-sm">react-native-camera</code> or <code className="bg-muted px-1 rounded-sm">expo-camera</code> with barcode scanning capabilities.</li>
            <li><strong>Native Mobile (iOS/Android):</strong> Utilize built-in AVFoundation (iOS) or ML Kit Barcode Scanning (Android).</li>
          </ul>
          <p className="text-sm mt-2">The scanner should extract the string data encoded in the QR code. This will typically be a unique product identifier (e.g., "DPP001").</p>
        </>
      )
    },
    {
      title: "Step 2: Call the Norruva QR Validation API",
      icon: Send,
      content: (
        <>
          <p className="text-sm mb-2">Once the QR identifier is extracted, make a POST request to the Norruva API endpoint:</p>
          <p className="font-mono text-xs bg-muted p-2 rounded-md"><code className="bg-green-100 text-green-700 border-green-300 px-1.5 py-0.5 rounded-sm mr-1.5">POST</code> {validateQrEndpoint}</p>
          <p className="text-sm mt-2 mb-1">Request Body (JSON):</p>
          <pre className="bg-muted p-2 rounded-md text-xs"><code>{`{\n  "qrIdentifier": "YOUR_EXTRACTED_IDENTIFIER"\n}`}</code></pre>
          <p className="text-sm mt-2 mb-1">Example API call (JavaScript Fetch):</p>
          <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto"><code className="language-javascript">{exampleApiCall}</code></pre>
          <p className="text-xs text-muted-foreground mt-1">Ensure you handle API errors, such as 404 if the product is not found. Refer to the <Link href="/developer/docs/error-codes" className="text-primary hover:underline">Error Handling Guide</Link>.</p>
        </>
      )
    },
    {
      title: "Step 3: Display Product Summary Information",
      icon: Layers,
      content: (
        <>
          <p className="text-sm mb-2">
            The <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">{validateQrEndpoint}</code> endpoint returns a JSON object with key product information. 
            See the <Link href="/developer/docs/api-reference#qr-validate-section" className="text-primary hover:underline">API Reference for the full response schema</Link>.
          </p>
          <p className="text-sm mb-1">Key fields you might display:</p>
          <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
            <li><code className="bg-muted px-1 rounded-sm">productName</code></li>
            <li><code className="bg-muted px-1 rounded-sm">category</code></li>
            <li><code className="bg-muted px-1 rounded-sm">manufacturer</code></li>
            <li><code className="bg-muted px-1 rounded-sm">ebsiCompliance.status</code> (e.g., "verified", "pending")</li>
          </ul>
        </>
      )
    },
    {
      title: "Step 4: Link to Full Public Passport Viewer",
      icon: ExternalLink,
      content: (
        <p className="text-sm">
          The API response from <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">{validateQrEndpoint}</code> includes a <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">dppUrl</code> field (e.g., <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">/passport/DPP001</code>). Provide a link or button in your application that directs the user to this URL on the Norruva platform (or your white-labeled viewer) to see the full Digital Product Passport.
        </p>
      )
    },
    {
      title: "Conclusion & Next Steps",
      icon: BookText,
      content: (
        <p className="text-sm">
          You've conceptually integrated QR code scanning to provide users with instant access to DPP summaries. Explore further API capabilities, such as retrieving full DPP details or handling lifecycle events, in our <Link href="/developer/docs/api-reference" className="text-primary hover:underline">API Reference</Link>.
        </p>
      )
    }
  ];

  return (
    <DocsPageLayout
      pageTitle="Tutorial: Integrating DPP QR Scanning (Conceptual)"
      pageIcon={QrCode}
      backLink="/developer/docs"
      backLinkText="Back to Docs Hub"
      alertTitle="Conceptual Tutorial"
      alertDescription="This tutorial shows how to integrate QR scanning for DPPs. Code examples are illustrative and conceptual; adapt them for your specific application stack."
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
              {typeof step.content === 'string' ? <p className="text-sm text-muted-foreground">{step.content}</p> : step.content}
            </CardContent>
          </Card>
        ))}
      </div>
    </DocsPageLayout>
  );
}

