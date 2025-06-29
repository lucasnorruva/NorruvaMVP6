// --- File: page.tsx (Data Management Best Practices Docs) ---
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Shield,
  RotateCcw,
  Users,
  CheckSquare,
  Search,
  DatabaseBackup,
  Link as LinkIconPath,
} from "lucide-react";
import Link from "next/link";
import DocsPageLayout from "@/components/developer/DocsPageLayout";

export default function DataManagementBestPracticesPage() {
  return (
    <DocsPageLayout
      pageTitle="Data Management Best Practices"
      pageIcon="Layers"
      alertTitle="Guidance Note"
      alertDescription="Essential best practices for managing Digital Product Passport (DPP) data to ensure compliance, transparency, and trust."
    >
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Introduction</CardTitle>
          <CardDescription>
            Maintaining accurate, up-to-date, and comprehensive product data is
            paramount for the success of your Digital Product Passports and for
            meeting regulatory obligations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Adhering to these best practices will help you maximize the value of
            your DPPs, minimize compliance risks, and ensure the integrity of
            your product information throughout its lifecycle.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Core Principles for DPP Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-4">
            <CheckSquare className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-lg">
                Data Accuracy & Validation
              </h4>
              <p className="text-sm text-muted-foreground">
                Implement robust internal processes to verify the accuracy of
                all data before submission to the Norruva DPP platform. Utilize
                any platform validation features available and consider
                automated checks where possible. Incorrect data can lead to
                compliance issues and erode trust.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <DatabaseBackup className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-lg">Data Completeness</h4>
              <p className="text-sm text-muted-foreground">
                Strive to provide all relevant data points required by
                applicable regulations (e.g., ESPR, Battery Regulation). Beyond
                regulatory minimums, consider what information is valuable to
                consumers, recyclers, and other stakeholders in your value
                chain. Comprehensive DPPs are more useful.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <RotateCcw className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-lg">
                Version Control & Updates
              </h4>
              <p className="text-sm text-muted-foreground">
                Understand how the Norruva platform handles DPP versioning.
                Establish clear internal procedures for updating DPPs whenever
                product specifications, compliance status, lifecycle events, or
                supplier information changes. Maintain an audit trail of
                changes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Shield className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-lg">
                Secure Credential Management
              </h4>
              <p className="text-sm text-muted-foreground">
                Securely manage API keys and any other credentials used to
                interact with the platform. Do not hardcode keys in client
                applications or commit them to version control. Refer to our{" "}
                <Link
                  href="/developer/docs/authentication"
                  className="text-primary hover:underline"
                >
                  Authentication Guide
                </Link>{" "}
                for more details on secure API key usage.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Users className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-lg">
                Data Governance & Responsibility
              </h4>
              <p className="text-sm text-muted-foreground">
                Establish clear internal responsibilities for DPP data
                ownership, management, updates, and compliance oversight within
                your organization. Define roles and ensure accountability for
                data quality.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Search className="h-6 w-6 text-teal-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-lg">
                Regular Audits & Reviews
              </h4>
              <p className="text-sm text-muted-foreground">
                Periodically review your DPP data for accuracy, completeness,
                and relevance. This is especially important when product
                specifications change, new regulatory requirements are
                introduced, or your supply chain evolves. Set up a regular audit
                schedule.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <LinkIconPath className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-lg">
                Supply Chain Collaboration
              </h4>
              <p className="text-sm text-muted-foreground">
                Work closely with your suppliers to ensure the data they provide
                for components and materials is accurate, timely, and in the
                required format. Establish clear data exchange protocols and
                communication channels. Data quality from your suppliers
                directly impacts your DPP quality.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Future Considerations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This section will be expanded with more detailed guidance,
            platform-specific tips, and examples related to data schemas,
            interoperability standards (like those from CIRPASS), and data
            lifecycle management tools as the Norruva platform evolves.
          </p>
        </CardContent>
      </Card>
    </DocsPageLayout>
  );
}
