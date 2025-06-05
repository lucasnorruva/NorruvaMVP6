
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { KeyRound, BookOpen, Webhook, Lightbulb, DownloadCloud, ShieldAlert, LifeBuoy, PlusCircle, Copy, Trash2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

const mockApiKeys = [
  { id: "key_sandbox_1", key: "sand_sk_xxxx1234ABCD...", type: "Sandbox", created: "2024-07-01", lastUsed: "2024-07-28", status: "Active" },
  { id: "key_prod_1", key: "prod_sk_xxxx5678EFGH...", type: "Production (Pending)", created: "2024-07-15", lastUsed: "N/A", status: "Pending Approval" },
];

const mockWebhooks = [
  { id: "wh_1", url: "https://api.example.com/webhook/product-updates", events: ["product.created", "product.updated"], status: "Active" },
  { id: "wh_2", url: "https://api.example.com/webhook/compliance-changes", events: ["compliance.status.changed"], status: "Disabled" },
];

export default function DeveloperPortalPage() {
  const { toast } = useToast();

  const handleCopyKey = (apiKey: string) => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: "API Key Copied!",
      description: "The API key has been copied to your clipboard.",
    });
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
                    <Badge variant={apiKey.status === "Active" ? "default" : "outline"} className={apiKey.status === "Active" ? "bg-green-500/20 text-green-700 border-green-500/30" : "bg-yellow-500/20 text-yellow-700 border-yellow-500/30"}>
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
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
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
                                <Badge variant={wh.status === "Active" ? "default" : "outline"}  className={wh.status === "Active" ? "bg-green-500/20 text-green-700 border-green-500/30" : ""}>{wh.status}</Badge>
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
             <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
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

