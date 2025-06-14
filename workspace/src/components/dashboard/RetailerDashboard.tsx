// --- File: src/components/dashboard/RetailerDashboard.tsx ---
"use client";

import React, { useState } from 'react'; // Added useState
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingBag, MessageSquare, BarChart3, Percent, Users, FileSpreadsheet, Eye } from "lucide-react";
import { RetailerQuickActionsCard } from "./RetailerQuickActionsCard";
import { RegulationUpdatesCard } from "./RegulationUpdatesCard";
import { MetricCard } from "@/components/dpp-dashboard/MetricCard";
import { MOCK_DPPS } from '@/data'; // Using full MOCK_DPPS for richer data
import type { DigitalProductPassport } from '@/types/dpp';
import { useToast } from '@/hooks/use-toast';
import { getAiHintForImage } from '@/utils/imageUtils';


export const RetailerDashboard = () => {
  const { toast } = useToast();
  const [posProductId, setPosProductId] = useState('');

  const featuredProducts = MOCK_DPPS.filter(p => p.metadata.status === 'published').slice(0, 3); // Show 3 published products

  const quickStats = [
    { title: "DPPs Viewed Recently", value: "78", icon: Eye, description: "(Last 7 days - Mock)" },
    { title: "Top Scanned Categories", value: "Electronics, Apparel", icon: BarChart3, description: "(Mock Data)" },
    { title: "New Products This Week", value: "5", icon: ShoppingBag, description: "(Mock Data)" },
  ];
  
  const handleGeneratePosSheet = () => {
    if (!posProductId.trim()) {
      toast({ title: "Product ID Required", description: "Please enter a Product ID to generate the info sheet.", variant: "destructive" });
      return;
    }
    const productExists = MOCK_DPPS.some(p => p.id === posProductId.trim());
    if (productExists) {
      toast({ title: "Info Sheet Generation Started", description: `Point-of-Sale info sheet for Product ID: ${posProductId} is being generated (mock).`, variant: "default" });
      setPosProductId(""); // Clear input
    } else {
      toast({ title: "Product Not Found", description: `Product with ID "${posProductId}" not found.`, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><ShoppingBag className="mr-2 text-primary"/>Product Information Access</CardTitle>
          <CardDescription>Access DPPs for products you sell and manage consumer information.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickStats.map(stat => (
            <MetricCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} description={stat.description} />
          ))}
        </CardContent>
      </Card>

      <RetailerQuickActionsCard />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><FileSpreadsheet className="mr-2 text-primary"/>Generate Point-of-Sale Info Sheet (Mock)</CardTitle>
          <CardDescription>Quickly generate a consumer-facing info sheet for a product using its DPP data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Label htmlFor="posProductId">Product ID</Label>
          <div className="flex gap-2">
            <Input 
              id="posProductId" 
              placeholder="Enter Product ID (e.g., DPP001)" 
              value={posProductId}
              onChange={(e) => setPosProductId(e.target.value)}
            />
            <Button onClick={handleGeneratePosSheet}>Generate Sheet</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">Featured Products</CardTitle>
          <CardDescription>Highlights from your product catalog.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => {
            const aiHint = getAiHintForImage({
                productName: product.productName,
                category: product.category,
                imageHint: product.productDetails?.imageHint,
            });
            return (
            <Card key={product.id} className="overflow-hidden flex flex-col">
              <div className="aspect-[4/3] w-full bg-muted overflow-hidden">
                <Image
                  src={product.productDetails?.imageUrl || "https://placehold.co/300x225.png?text=No+Image"}
                  alt={product.productName}
                  width={300}
                  height={225}
                  className="object-cover w-full h-full"
                  data-ai-hint={aiHint}
                />
              </div>
              <CardHeader className="pb-2 pt-3">
                <CardTitle className="text-md font-semibold leading-tight h-10">
                  <Link href={`/passport/${product.id}`} className="hover:underline text-primary">
                    {product.productName}
                  </Link>
                </CardTitle>
                <CardDescription className="text-xs">{product.category}</CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground flex-grow">
                <p className="line-clamp-3">
                  {product.productDetails?.description || "No description available."}
                </p>
              </CardContent>
              <div className="p-4 pt-2">
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href={`/passport/${product.id}`}>View Public DPP</Link>
                </Button>
              </div>
            </Card>
          );
        })}
        {featuredProducts.length === 0 && <p className="text-muted-foreground col-span-full text-center py-4">No featured products available.</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center"><MessageSquare className="mr-2 h-5 w-5"/>Market Alerts</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground">New sustainability claim verified for 'Eco T-Shirt'. Upcoming regulation update for 'Electronics' category.</p></CardContent>
      </Card>
      <RegulationUpdatesCard />
    </div>
  );
};
