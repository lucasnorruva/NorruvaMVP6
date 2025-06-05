
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { KeyRound, BookOpen, Webhook, Lightbulb, DownloadCloud, ShieldAlert, LifeBuoy, PlusCircle, Copy, Trash2, PlayCircle, Send, FileJson, Loader2, ServerIcon } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const mockApiKeys = [
  { id: "key_sandbox_1", key: "sand_sk_xxxx1234ABCD...", type: "Sandbox", created: "2024-07-01", lastUsed: "2024-07-28", status: "Active" },
  { id: "key_prod_1", key: "prod_sk_xxxx5678EFGH...", type: "Production", created: "2024-07-15", lastUsed: "N/A", status: "Pending Approval" },
];

const mockWebhooks = [
  { id: "wh_1", url: "https://api.example.com/webhook/product-updates", events: ["product.created", "product.updated"], status: "Active" },
  { id: "wh_2", url: "https://api.example.com/webhook/compliance-changes", events: ["compliance.status.changed"], status: "Disabled" },
];

// Simplified mock product data for API responses
const MOCK_API_PRODUCTS: Record<string, any> = {
  "PROD001": {
    productId: "PROD001",
    productName: "EcoFriendly Refrigerator X2000",
    category: "Appliances",
    status: "Active",
    manufacturer: "GreenTech Appliances",
    modelNumber: "X2000-ECO",
    gtin: "01234567890123",
    energyLabel: "A+++",
    compliance: {
      REACH: "Compliant",
      RoHS: "Compliant"
    }
  },
  "PROD002": {
    productId: "PROD002",
    productName: "Smart LED Bulb (4-Pack)",
    category: "Electronics",
    status: "Active",
    manufacturer: "BrightSpark Electronics",
    modelNumber: "BS-LED-S04B",
    gtin: "98765432109876",
    energyLabel: "A+",
    compliance: {
      RoHS: "Compliant",
      CE_Mark: "Compliant",
      Battery_Regulation: "Pending Documentation"
    }
  }
};

export default function DeveloperPortalPage() {
  const { toast } = useToast();

  const [getProductId, setGetProductId] = useState<string>("PROD001");
  const [getProductResponse, setGetProductResponse] = useState<string | null>(null);
  const [isGetProductLoading, setIsGetProductLoading] = useState(false);

  const [listProductsResponse, setListProductsResponse] = useState<string | null>(null);
  const [isListProductsLoading, setIsListProductsLoading] = useState(false);

  const handleCopyKey = (apiKey: string) => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: "API Key Copied!",
      description: "The API key has been copied to your clipboard.",
    });
  };

  const handleMockGetProductDetails = async () => {
    setIsGetProductLoading(true);
    setGetProductResponse(null);
    await new Promise(resolve => setTimeout(resolve, 700)); // Simulate API delay
    const product = MOCK_API_PRODUCTS[getProductId];
    if (product) {
      setGetProductResponse(JSON.stringify(product, null, 2));
    } else {
      setGetProductResponse(JSON.stringify({ error: "Product not found", productId: getProductId }, null, 2));
    }
    setIsGetProductLoading(false);
  };

  const handleMockListProducts = async () => {
    setIsListProductsLoading(true);
    setListProductsResponse(null);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    const response = {
      data: [MOCK_API_PRODUCTS["PROD001"], MOCK_API_PRODUCTS["PROD002"]],
      pageInfo: {
        totalCount: 2,
        hasNextPage: false,
      }
    };
    setListProductsResponse(JSON.stringify(response, null, 2));
    setIsListProductsLoading(false);
  };


  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline font-semibold">Developer Portal</h1>
        <Link href="#" target="_blank"> {/* Replace with actual main docs link */}
          <Button variant="outline">
            <BookOpen className="mr-2 h-5 w-5" />
            View Full Documentation
          </Button>
        </Link>
      </div>

      {/* API Playground Section */}
      <Card className="shadow-xl border-primary/20">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><PlayCircle className="mr-3 h-6 w-6 text-primary" /> Interactive API Playground</CardTitle>
          <CardDescription>Test out mock API endpoints directly in your browser. (Simulated responses)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Get Product Details Endpoint */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center"><ServerIcon className="mr-2 h-5 w-5 text-info"/>GET /api/v1/products/{'{productId}'}</CardTitle>
              <CardDescription>Retrieve details for a specific product by its ID.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="productIdInput">Product ID</Label>
                <Input 
                  id="productIdInput" 
                  value={getProductId} 
                  onChange={(e) => setGetProductId(e.target.value)} 
                  placeholder="e.g., PROD001" 
                />
              </div>
              <Button onClick={handleMockGetProductDetails} disabled={isGetProductLoading} variant="secondary">
                {isGetProductLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                {isGetProductLoading ? "Fetching..." : "Send Request"}
              </Button>
              {getProductResponse && (
                <div className="mt-4">
                  <Label className="flex items-center"><FileJson className="mr-2 h-4 w-4 text-accent"/>Mock Response:</Label>
                  <pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto max-h-60">
                    <code>{getProductResponse}</code>
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* List Products Endpoint */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center"><ServerIcon className="mr-2 h-5 w-5 text-info"/>GET /api/v1/products</CardTitle>
              <CardDescription>Retrieve a list of products. (Mock returns first 2 products)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <Button onClick={handleMockListProducts} disabled={isListProductsLoading} variant="secondary">
                {isListProductsLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                {isListProductsLoading ? "Fetching..." : "Send Request"}
              </Button>
              {listProductsResponse && (
                <div className="mt-4">
                  <Label className="flex items-center"><FileJson className="mr-2 h-4 w-4 text-accent"/>Mock Response:</Label>
                  <pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto max-h-60">
                    <code>{listProductsResponse}</code>
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>


      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><KeyRound className="mr-3 h-6 w-6 text-primary" /> API Keys</CardTitle>
          <CardDescription>Manage your API keys for accessing Norruva platform services.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key (Partial)</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockApiKeys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell className="font-mono text-sm">{apiKey.key}</TableCell>
                  <TableCell><Badge variant={apiKey.type === "Sandbox" ? "secondary" : "default"}>{apiKey.type}</Badge></TableCell>
                  <TableCell>{apiKey.created}</TableCell>
                  <TableCell>{apiKey.lastUsed}</TableCell>
                  <TableCell>
                    <Badge
                      variant={apiKey.status === "Active" ? "default" : "outline"}
                      className={cn(
                        apiKey.status === "Active" ? "bg-green-500/20 text-green-700 border-green-500/30" : "",
                        apiKey.status === "Pending Approval" ? "bg-yellow-500/20 text-yellow-700 border-yellow-500/30" : ""
                      )}
                    >
                      {apiKey.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleCopyKey(apiKey.key)} title="Copy Key">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Delete Key (Mock)" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex gap-4">
            <Button variant="secondary">
              <PlusCircle className="mr-2 h-5 w-5" /> Generate New Sandbox Key (Mock)
            </Button>
            <Button variant="outline">Request Production Key (Mock)</Button>
          </div>
          <p className="text-xs text-muted-foreground">API keys provide access to your account data. Keep them secure and do not share them publicly.</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><BookOpen className="mr-3 h-6 w-6 text-primary" /> API Reference</CardTitle>
            <CardDescription>Explore detailed documentation for our APIs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="list-disc list-inside text-primary space-y-1">
              <li><Link href="#" className="hover:underline">Products API</Link></li>
              <li><Link href="#" className="hover:underline">Lifecycle Events API</Link></li>
              <li><Link href="#" className="hover:underline">Compliance API</Link></li>
              <li><Link href="#" className="hover:underline">Sustainability API</Link></li>
              <li><Link href="#" className="hover:underline">Authentication</Link></li>
            </ul>
            <p className="text-sm text-muted-foreground">Our APIs follow RESTful principles and use standard HTTP response codes. All API requests must be authenticated.</p>
             <Button variant="link" className="p-0 h-auto">View OpenAPI Specification (Mock)</Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><Webhook className="mr-3 h-6 w-6 text-primary" /> Webhooks</CardTitle>
            <CardDescription>Configure webhooks to receive real-time notifications for events.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Endpoint URL</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockWebhooks.map(wh => (
                        <TableRow key={wh.id}>
                            <TableCell className="truncate max-w-[200px] text-sm">{wh.url}</TableCell>
                            <TableCell>
                                <Badge
                                  variant={wh.status === "Active" ? "default" : "outline"}
                                  className={cn(
                                    wh.status === "Active" ? "bg-green-500/20 text-green-700 border-green-500/30" : "bg-muted text-muted-foreground border-border"
                                  )}
                                >
                                  {wh.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right space-x-1">
                                <Button variant="ghost" size="sm">Edit (Mock)</Button>
                                 <Button variant="ghost" size="icon" title="Delete Webhook (Mock)" className="text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
             <Button variant="secondary">
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Webhook (Mock)
            </Button>
            <p className="text-xs text-muted-foreground">Get notified about product updates, compliance changes, and more.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><Lightbulb className="mr-3 h-6 w-6 text-primary" /> Guides & SDKs</CardTitle>
          <CardDescription>Find resources to help you integrate with Norruva.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Integration Guides</h4>
            <ul className="list-disc list-inside text-primary space-y-1">
              <li><Link href="#" className="hover:underline">Getting Started Guide</Link></li>
              <li><Link href="#" className="hover:underline">Authenticating Your Requests</Link></li>
              <li><Link href="#" className="hover:underline">Managing Digital Product Passports</Link></li>
              <li><Link href="#" className="hover:underline">Working with Webhooks</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">SDKs</h4>
            <ul className="space-y-2">
              <li>
                <Button variant="outline" className="w-full justify-start">
                  <DownloadCloud className="mr-2 h-5 w-5 text-accent" /> JavaScript SDK (Mock)
                </Button>
              </li>
              <li>
                <Button variant="outline" className="w-full justify-start">
                  <DownloadCloud className="mr-2 h-5 w-5 text-accent" /> Python SDK (Mock)
                </Button>
              </li>
               <li>
                <Button variant="outline" className="w-full justify-start">
                  <DownloadCloud className="mr-2 h-5 w-5 text-accent" /> Java SDK (Mock)
                </Button>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><ShieldAlert className="mr-3 h-6 w-6 text-primary" /> Support & Status</CardTitle>
          <CardDescription>Get help and check the status of our API services.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
           <Link href="#" target="_blank" className="flex-1">
            <Button variant="outline" className="w-full">
                <ShieldAlert className="mr-2 h-5 w-5 text-info"/> API Status Page (Mock)
            </Button>
           </Link>
           <Link href="#" target="_blank" className="flex-1">
            <Button variant="outline" className="w-full">
                <LifeBuoy className="mr-2 h-5 w-5 text-accent"/> Contact Support (Mock)
            </Button>
           </Link>
        </CardContent>
      </Card>
    </div>
  );
}

    

    