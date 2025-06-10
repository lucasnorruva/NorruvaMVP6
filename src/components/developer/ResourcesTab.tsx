import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  FileCode,
  BookText,
  Wrench,
  FileJson,
  ExternalLink as ExternalLinkIcon,
  Zap as ZapIcon,
  FileText as FileTextIcon,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function ResourcesTab() {
  const conceptualSdks = [
    { name: "JavaScript", description: "Simplify Norruva API calls in web apps", href: "/developer/sdks/javascript", icon: FileCode },
    { name: "Python", description: "Interact with the API using Python", href: "#", icon: FileCode, soon: true },
    { name: "Java", description: "Coming soon", href: "#", icon: FileCode, soon: true },
  ];

  const mockCodeSamples = [
    { id: "sample1", title: "Fetching a Product Passport (Python)", description: "A Python script demonstrating how to authenticate and retrieve a DPP using its ID.", linkText: "View on GitHub (Mock)", href: "#", icon: FileCode },
    { id: "sample2", title: "Creating a New DPP with Battery Data (Node.js)", description: "Node.js example for creating a new product passport, including specific fields for EU Battery Regulation.", linkText: "View Snippet (Mock)", href: "#", icon: FileCode },
    { id: "sample3", title: "Validating a QR Identifier (Java)", description: "Java code snippet for using the QR validation endpoint to get product summary information.", linkText: "View on GitHub (Mock)", href: "#", icon: FileCode },
  ];

  const mockTutorials = [
    { id: "tut1", title: "Step-by-Step: Integrating DPP QR Scanning into a Retail App", description: "Learn how to use the Norruva API to allow consumers to scan QR codes and view product passports directly in your application.", linkText: "Read Tutorial", href: "/developer/tutorials/qr-scan-integration", icon: BookText },
    { id: "tut2", title: "Automating Updates with Webhooks", description: "A guide on setting up webhooks to receive real-time notifications for DPP status changes or new compliance requirements.", linkText: "Read Tutorial", href: "/developer/tutorials/webhooks-automation", icon: BookText },
    { id: "tut3", title: "Best Practices for Managing DPP Data via API", description: "Explore strategies for efficiently managing large volumes of product data, versioning DPPs, and ensuring data accuracy through API integrations.", linkText: "Read Tutorial", href: "/developer/tutorials/dpp-data-management-api", icon: BookText },
  ];

  const [mockDppGeneratorProductName, setMockDppGeneratorProductName] = useState("");
  const [mockDppGeneratorCategory, setMockDppGeneratorCategory] = useState("");
  const [mockDppGeneratorGtin, setMockDppGeneratorGtin] = useState("");
  const [generatedMockDppJson, setGeneratedMockDppJson] = useState<string | null>(null);
  const [isGeneratingMockDpp, setIsGeneratingMockDpp] = useState(false);

  const handleGenerateMockDpp = () => {
    setIsGeneratingMockDpp(true);
    setTimeout(() => {
      setGeneratedMockDppJson(
        JSON.stringify(
          {
            id: "MOCK_DPP",
            productName: mockDppGeneratorProductName || "Test Widget",
            category: mockDppGeneratorCategory || "Gadgets",
            gtin: mockDppGeneratorGtin || "0123456789012",
          },
          null,
          2
        )
      );
      setIsGeneratingMockDpp(false);
    }, 500);
  };

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <FileCode className="mr-3 h-6 w-6 text-primary" /> SDKs (Conceptual)
          </CardTitle>
          <CardDescription>
            Language-specific Software Development Kits to accelerate your integration with the Norruva API.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {conceptualSdks.map((sdk) => (
            <Card key={sdk.name} className="shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-md font-medium flex items-center">
                  <sdk.icon className="mr-2 h-5 w-5 text-accent" />
                  {sdk.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 flex-grow">
                <p className="text-xs text-muted-foreground flex-grow min-h-[40px]">{sdk.description}</p>
              </CardContent>
              <div className="p-4 pt-0">
                <Button variant="outline" size="sm" className="w-full group" asChild>
                  <Link href={sdk.href} passHref className={cn(sdk.soon && "opacity-60 cursor-not-allowed")}> 
                    {sdk.soon ? "Coming Soon" : (
                      <>
                        View Details <ExternalLinkIcon className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <BookText className="mr-3 h-6 w-6 text-primary" /> Code Samples
          </CardTitle>
          <CardDescription>Practical examples to help you get started with common API operations.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockCodeSamples.map((sample) => (
            <Card key={sample.id} className="shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-md font-medium flex items-center">
                  <sample.icon className="mr-2 h-5 w-5 text-accent" />
                  {sample.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 flex-grow">
                <p className="text-xs text-muted-foreground flex-grow min-h-[48px]">{sample.description}</p>
              </CardContent>
              <div className="p-4 pt-0">
                <Button variant="link" size="sm" className="p-0 h-auto text-primary group" asChild>
                  <Link href={sample.href} passHref className="opacity-60 cursor-not-allowed">
                    {sample.linkText} <ExternalLinkIcon className="ml-1 h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <BookText className="mr-3 h-6 w-6 text-primary" /> Tutorials
          </CardTitle>
          <CardDescription>Step-by-step guides for common integration scenarios and use cases.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockTutorials.map((tutorial) => (
            <Card key={tutorial.id} className="shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-md font-medium flex items-center">
                  <tutorial.icon className="mr-2 h-5 w-5 text-accent" />
                  {tutorial.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 flex-grow">
                <p className="text-xs text-muted-foreground flex-grow min-h-[48px]">{tutorial.description}</p>
              </CardContent>
              <div className="p-4 pt-0">
                <Button variant="link" size="sm" className="p-0 h-auto text-primary group" asChild={tutorial.href !== "#"}>
                  {tutorial.href === "#" ? (
                    <span className="opacity-60 cursor-not-allowed flex items-center">
                      {tutorial.linkText} <ExternalLinkIcon className="ml-1 h-3 w-3" />
                    </span>
                  ) : (
                    <Link href={tutorial.href}>
                      {tutorial.linkText} <ExternalLinkIcon className="ml-1 h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <Wrench className="mr-3 h-6 w-6 text-primary" />Developer Tools
          </CardTitle>
          <CardDescription>Utilities to help you build and test your integrations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start text-left h-auto py-3 group hover:bg-accent/10" asChild>
              <a href="/openapi.yaml" target="_blank" rel="noopener noreferrer">
                <FileJson className="mr-2 h-5 w-5 text-primary group-hover:text-accent transition-colors" />
                <div>
                  <p className="font-medium group-hover:text-accent transition-colors">Download OpenAPI Spec</p>
                  <p className="text-xs text-muted-foreground">Get the v1 API specification.</p>
                </div>
              </a>
            </Button>
            <Button variant="outline" className="justify-start text-left h-auto py-3 group hover:bg-accent/10" disabled>
              <ExternalLinkIcon className="mr-2 h-5 w-5 text-primary group-hover:text-accent transition-colors" />
              <div>
                <p className="font-medium group-hover:text-accent transition-colors">View Postman Collection</p>
                <p className="text-xs text-muted-foreground">Mocked for now.</p>
              </div>
            </Button>
            <Button variant="outline" className="justify-start text-left h-auto py-3 group hover:bg-accent/10 opacity-70 col-span-1 sm:col-span-2" disabled>
              <ZapIcon className="mr-2 h-5 w-5 text-primary group-hover:text-accent transition-colors" />
              <div>
                <p className="font-medium group-hover:text-accent transition-colors">
                  CLI Tool <Badge variant="outline" className="ml-auto text-xs">Coming Soon</Badge>
                </p>
                <p className="text-xs text-muted-foreground">Manage DPPs from your terminal.</p>
              </div>
            </Button>
          </div>
          <Separator />
          <div>
            <h4 className="text-md font-semibold mb-2 flex items-center">
              <FileTextIcon className="mr-2 h-5 w-5 text-accent" />Mock DPP Generator (Enhanced)
            </h4>
            <div className="space-y-3 p-3 border rounded-md bg-muted/30">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="devToolsMockDppName" className="text-xs">Product Name (Optional)</label>
                  <Input
                    id="devToolsMockDppName"
                    value={mockDppGeneratorProductName}
                    onChange={(e) => setMockDppGeneratorProductName(e.target.value)}
                    placeholder="e.g., Test Widget"
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <label htmlFor="devToolsMockDppCategory" className="text-xs">Category (Optional)</label>
                  <Input
                    id="devToolsMockDppCategory"
                    value={mockDppGeneratorCategory}
                    onChange={(e) => setMockDppGeneratorCategory(e.target.value)}
                    placeholder="e.g., Gadgets"
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <label htmlFor="devToolsMockDppGtin" className="text-xs">GTIN (Optional)</label>
                  <Input
                    id="devToolsMockDppGtin"
                    value={mockDppGeneratorGtin}
                    onChange={(e) => setMockDppGeneratorGtin(e.target.value)}
                    placeholder="e.g., 0123456789012"
                    className="h-8 text-xs"
                  />
                </div>
              </div>
              <Button size="sm" onClick={handleGenerateMockDpp} disabled={isGeneratingMockDpp} variant="secondary">
                {isGeneratingMockDpp ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ZapIcon className="mr-2 h-4 w-4" />}
                {isGeneratingMockDpp ? "Generating..." : "Generate Mock DPP JSON"}
              </Button>
              {generatedMockDppJson && (
                <div className="mt-3">
                  <label className="text-xs">Generated Mock DPP:</label>
                  <Textarea value={generatedMockDppJson} readOnly rows={10} className="font-mono text-xs bg-background" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
