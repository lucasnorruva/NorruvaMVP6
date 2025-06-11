
// --- File: page.tsx (QR Code Generation & Embedding Docs) ---
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DocsPageLayout from '@/components/developer/DocsPageLayout';
import { QrCode, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

export default function QrCodeEmbeddingPage() {
  const exampleJsonResponse = `{
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6CAYAAAB...",
  "productId": "DPP001",
  "linksTo": "/passport/DPP001"
}`;

  const exampleHtmlEmbedding = `
<!DOCTYPE html>
<html>
<head>
  <title>DPP QR Code</title>
</head>
<body>
  <h1>Product Passport QR Code</h1>
  <img id="dppQrCode" src="" alt="Digital Product Passport QR Code" />

  <script>
    async function fetchAndDisplayQrCode(productId) {
      try {
        // Replace with your actual API key and endpoint if different
        const apiKey = "YOUR_SANDBOX_API_KEY"; 
        const response = await fetch(\`/api/v1/qr/generate/\${productId}\`, {
          headers: {
            'Authorization': \`Bearer \${apiKey}\`
          }
        });

        if (!response.ok) {
          throw new Error(\`API Error: \${response.status} \${response.statusText}\`);
        }

        const data = await response.json();
        
        if (data.qrCode) {
          document.getElementById('dppQrCode').src = data.qrCode;
          document.getElementById('dppQrCode').alt = \`QR Code for Product \${data.productId}\`;
        } else {
          console.error("QR code data URL not found in response:", data);
        }
      } catch (error) {
        console.error('Failed to fetch or display QR code:', error);
        document.getElementById('dppQrCode').alt = 'Error loading QR code';
      }
    }

    // Example: Fetch QR for product DPP001
    fetchAndDisplayQrCode('DPP001');
  </script>
</body>
</html>
  `;

  return (
    <DocsPageLayout
      pageTitle="QR Code Generation & Embedding"
      pageIcon="QrCode"
      alertTitle="Conceptual Guidance"
      alertDescription="This guide explains how to conceptually generate QR codes via the Norruva API and embed them in your applications or on physical products."
    >
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><QrCode className="mr-2 h-5 w-5 text-primary"/>Generating a QR Code (JSON Response)</CardTitle>
          <CardDescription>
            To obtain a QR code image data, you'll typically make a GET request to an endpoint like:
            <br />
            <code className="bg-muted px-1.5 py-0.5 rounded-sm font-mono text-sm">GET /api/v1/qr/generate/&lt;productId&gt;</code>
            <br />
            Replace <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">&lt;productId&gt;</code> with the unique identifier of the product.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            This endpoint (conceptually) returns a JSON object containing the QR code as a Base64 encoded data URL, along with other relevant information.
          </p>
          <p className="text-sm font-medium">Example JSON Response:</p>
          <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
            <code>{exampleJsonResponse}</code>
          </pre>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">qrCode</code>: The Base64 data URL for the PNG image of the QR code.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">productId</code>: The ID of the product for which the QR code was generated.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">linksTo</code>: The URL path the QR code will direct to (typically the public passport viewer).</li>
          </ul>
           <p className="text-xs text-muted-foreground">
            Note: While the <Link href="/api/v1/qr/DPP001" target="_blank" className="text-primary hover:underline"><code>/api/v1/qr/&lt;productId&gt;</code></Link> endpoint directly serves a PNG image (useful for direct image source), the <code>/generate/</code> endpoint discussed here is conceptualized for scenarios where you need the data URL within a JSON response, perhaps for more complex client-side handling or logging.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg mt-6">
        <CardHeader>
          <CardTitle className="flex items-center"><LinkIcon className="mr-2 h-5 w-5 text-primary"/>Embedding the QR Code in HTML</CardTitle>
          <CardDescription>
            Once you have the data URL, you can easily embed it as the source of an image tag.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">Below is a conceptual HTML and JavaScript example demonstrating how to fetch the JSON response and set the QR code image:</p>
          <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
            <code>{exampleHtmlEmbedding}</code>
          </pre>
          <p className="text-sm text-muted-foreground mt-2">
            In a React/Next.js application, you would fetch this data in a component (e.g., in a <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">useEffect</code> hook or server component) and set it to the <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">src</code> attribute of an <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">&lt;Image /&gt;</code> component or a standard <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">&lt;img /&gt;</code> tag.
          </p>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg mt-6">
        <CardHeader>
          <CardTitle>Best Practices for QR Codes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
            <ul className="list-disc list-inside space-y-1">
                <li><strong>Size and Placement:</strong> Ensure the QR code is large enough to be easily scanned by common devices and placed on a flat, non-reflective surface.</li>
                <li><strong>Contrast:</strong> Use high contrast between the QR code (dark) and its background (light).</li>
                <li><strong>Quiet Zone:</strong> Maintain a clear margin (quiet zone) around the QR code.</li>
                <li><strong>Testing:</strong> Always test your QR codes with multiple scanning apps and devices before final production.</li>
                <li><strong>Durability:</strong> If printed on physical products or packaging, ensure the QR code material is durable enough to last the expected lifecycle of the product.</li>
            </ul>
        </CardContent>
      </Card>
    </DocsPageLayout>
  );
}
