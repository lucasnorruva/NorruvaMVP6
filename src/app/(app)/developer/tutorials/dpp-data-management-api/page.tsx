
// --- File: page.tsx (Conceptual Tutorial: Best Practices for Managing DPP Data via API) ---
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { LayersIcon, Terminal, Settings, Workflow, ShieldCheck, Database, BarChart3, RefreshCw, AlertTriangle, KeyRound, Filter } from "lucide-react";
import DocsPageLayout from '@/components/developer/DocsPageLayout';

export default function DppDataManagementApiTutorialPage() {
  const sections = [
    {
      title: "Introduction: The Importance of DPP Data Management",
      icon: LayersIcon,
      content: "Effectively managing Digital Product Passport (DPP) data through an API is crucial for maintaining accuracy, ensuring compliance, and enabling efficient operations. This tutorial provides conceptual best practices for developers integrating with the Norruva DPP API."
    },
    {
      title: "1. Ensuring Data Accuracy and Validation",
      icon: ShieldCheck,
      content: (
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li><strong>Client-Side Validation:</strong> Implement validation in your application before sending data to the API to catch errors early. Ensure data types, formats, and required fields meet the API specifications (see <Link href="/developer/docs/api-reference" className="text-primary hover:underline">API Reference</Link>).</li>
          <li><strong>Source Data Quality:</strong> The accuracy of your DPPs depends heavily on the quality of your source data. Establish processes to verify information from your internal systems (PLM, ERP) or suppliers before API submission.</li>
          <li><strong>Handle API Validation Responses:</strong> Pay close attention to API error responses, especially 400 Bad Request errors, which often indicate validation failures. Use the error details to correct your data.</li>
        </ul>
      )
    },
    {
      title: "2. Efficient Data Upload and Updates",
      icon: Database,
      content: (
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li><strong>Use Correct HTTP Methods:</strong> Use <code className="bg-muted px-1 rounded-sm">POST /dpp</code> for creating new DPPs and <code className="bg-muted px-1 rounded-sm">PUT /dpp/{'{productId}'}</code> for updating existing ones. PUT requests should ideally be idempotent.</li>
          <li><strong>Batch Operations (Conceptual):</strong> For creating or updating multiple DPPs, utilize conceptual batch import endpoints like <code className="bg-muted px-1 rounded-sm">POST /dpp/import</code> if available. This is generally more efficient than many individual requests.</li>
          <li><strong>Partial Updates:</strong> When updating a DPP, only send the fields that have changed to minimize payload size and processing, if the API supports partial updates via PUT or PATCH (conceptual).</li>
        </ul>
      )
    },
    {
      title: "3. Data Synchronization & Webhooks",
      icon: RefreshCw,
      content: (
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li><strong>Leverage Webhooks:</strong> Subscribe to relevant webhook events (e.g., <code className="bg-muted px-1 rounded-sm">dpp.updated</code>, <code className="bg-muted px-1 rounded-sm">compliance.status.changed</code>) to get real-time notifications. This avoids excessive API polling. See the <Link href="/developer/tutorials/webhooks-automation" className="text-primary hover:underline">Webhooks Automation Tutorial</Link>.</li>
          <li><strong>Reconciliation Strategy:</strong> Periodically perform a full data sync or use checksums/timestamps if webhooks might be missed, to ensure data consistency between your system and Norruva.</li>
        </ul>
      )
    },
    {
      title: "4. Handling DPP Versioning (Conceptual)",
      icon: LayersIcon,
      content: (
         <p className="text-sm text-muted-foreground">
            The Norruva API (conceptually) versions DPP data. Each significant update via PUT might result in a new version. Understand how versioning is handled (e.g., new version ID, version field in metadata). Your application may need to track specific versions for historical reporting or audit purposes. The <code className="bg-muted px-1 rounded-sm">GET /dpp/history/{'{productId}'}</code> endpoint can provide an audit trail.
          </p>
      )
    },
    {
      title: "5. API Rate Limiting & Error Handling",
      icon: AlertTriangle,
      content: (
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li><strong>Respect Rate Limits:</strong> Be aware of API rate limits and implement client-side throttling if necessary. Refer to the <Link href="/developer/docs/rate-limiting" className="text-primary hover:underline">Rate Limiting Guide</Link>.</li>
          <li><strong>Implement Retries:</strong> For transient errors (e.g., 50x errors, network issues), implement an exponential backoff retry strategy.</li>
          <li><strong>Robust Error Logging:</strong> Log all API request failures with details (endpoint, payload, error response) to aid in debugging. See the <Link href="/developer/docs/error-codes" className="text-primary hover:underline">Error Codes Guide</Link>.</li>
        </ul>
      )
    },
    {
        title: "6. Security Best Practices",
        icon: KeyRound,
        content: (
            <ul className="list-disc list-inside space-y-2 text-sm">
                <li><strong>Secure API Key Management:</strong> Store API keys securely (e.g., environment variables, secret management services). Do not embed them in client-side code. Rotate keys periodically. See <Link href="/developer/docs/authentication" className="text-primary hover:underline">Authentication Guide</Link>.</li>
                <li><strong>Data Privacy:</strong> When retrieving and storing DPP data, be mindful of any personally identifiable information (PII) or commercially sensitive data. Adhere to GDPR and other relevant privacy regulations. See <Link href="/developer/docs/data-privacy" className="text-primary hover:underline">Data Privacy Guide</Link>.</li>
                <li><strong>Input Sanitization:</strong> Although the API performs validation, sanitize inputs on your end to prevent unexpected issues.</li>
            </ul>
        )
    },
    {
        title: "7. Efficient Querying and Filtering",
        icon: Filter,
        content: (
             <p className="text-sm text-muted-foreground">
                When listing DPPs (e.g., <code className="bg-muted px-1 rounded-sm">GET /dpp</code>), use available filter parameters (status, category, search query, etc.) to retrieve only the data you need. Avoid fetching all DPPs and filtering client-side if possible. Check the <Link href="/developer/docs/api-reference" className="text-primary hover:underline">API Reference</Link> for available query parameters.
            </p>
        )
    }
  ];

  return (
    <DocsPageLayout
      pageTitle="Tutorial: Best Practices for Managing DPP Data via API"
      pageIcon={LayersIcon}
      backLink="/developer/docs"
      backLinkText="Back to Docs Hub"
      alertTitle="Conceptual Tutorial"
      alertDescription="This tutorial provides conceptual best practices for interacting with the Norruva DPP API. Specific API behaviors and features are illustrative."
    >
      <div className="space-y-6">
        {sections.map((section, index) => (
          <Card key={index} className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center">
                <section.icon className="mr-3 h-6 w-6 text-primary" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {typeof section.content === 'string' ? <p className="text-sm text-muted-foreground">{section.content}</p> : section.content}
            </CardContent>
          </Card>
        ))}
      </div>
       <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle>Conclusion</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            By following these best practices, you can build robust, efficient, and compliant integrations with the Norruva Digital Product Passport API. Always refer to the latest API documentation for specific endpoint details and updates.
          </p>
        </CardContent>
      </Card>
    </DocsPageLayout>
  );
}

