"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DocsPageLayout from '@/components/developer/DocsPageLayout';
import { QrCode } from "lucide-react";

export default function QrCodeEmbeddingPage() {
  return (
    <DocsPageLayout
      pageTitle="QR Code Generation & Embedding"
      pageIcon="QrCode"
      alertTitle="Conceptual Documentation"
      alertDescription="How to obtain a QR image from the API and embed it in your applications."
    >
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Generate a QR Code</CardTitle>
          <CardDescription>
            Request the QR code using <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/qr/generate/&lt;productId&gt;</code>.
            The endpoint returns JSON of the form <code>{`{ qrCode: "data:image/png;base64,..." }`}</code>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">Example request:</p>
          <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto"><code>GET /api/v1/qr/generate/DPP001</code></pre>
          <p className="text-sm">Successful responses return JSON with a <code>qrCode</code> field containing a data URL.</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg mt-6">
        <CardHeader>
          <CardTitle>Embedding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">Call the endpoint and set the returned <code>qrCode</code> value as your image <code>src</code>:</p>
          <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto"><code>{`const res = await fetch('https://api.example.com/api/v1/qr/generate/DPP001');
const { qrCode } = await res.json();
<img src={qrCode} alt="Product QR" />`}</code></pre>
          <p className="text-sm">Scanning the QR directs users to the product's public passport.</p>
        </CardContent>
      </Card>
    </DocsPageLayout>
  );
}
