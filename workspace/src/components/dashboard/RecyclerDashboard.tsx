
// --- File: src/components/dashboard/RecyclerDashboard.tsx ---
"use client";

import React, { useState } from 'react'; // Added useState
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Recycle as RecycleIcon, AlertTriangle, BarChart3, Search, FileText as FileTextIcon } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { RecyclerQuickActionsCard } from "./RecyclerQuickActionsCard";
import { RegulationUpdatesCard } from "./RegulationUpdatesCard";
import { useToast } from '@/hooks/use-toast'; // Import useToast
import { MOCK_DPPS } from '@/data'; // To check if product ID exists for disassembly guide

const mockMaterialRecoveryData = [
  { name: 'Plastics (PET, PP)', volume: 450, fill: 'hsl(var(--chart-1))' },
  { name: 'Metals (Al, Steel)', volume: 300, fill: 'hsl(var(--chart-2))' },
  { name: 'Glass', volume: 150, fill: 'hsl(var(--chart-3))' },
  { name: 'Batteries (Li-ion)', volume: 50, fill: 'hsl(var(--chart-4))' },
  { name: 'Textiles (Cotton)', volume: 120, fill: 'hsl(var(--chart-5))' },
  { name: 'Other (Mixed)', volume: 80, fill: 'hsl(var(--muted))' },
];

export const RecyclerDashboard = () => {
  const { toast } = useToast();
  const [materialSearchTerm, setMaterialSearchTerm] = useState('');
  const [disassemblyProductId, setDisassemblyProductId] = useState('');

  const handleMaterialSearch = () => {
    if (!materialSearchTerm.trim()) {
      toast({ title: "Input Required", description: "Please enter a material to search for.", variant: "destructive" });
      return;
    }
    // Simulate search
    const mockFoundCount = Math.floor(Math.random() * 50) + 5;
    toast({
      title: "Material Search (Mock)",
      description: `Found ${mockFoundCount} products containing "${materialSearchTerm}". (This is a mock search result).`,
    });
  };

  const handleViewDisassemblyGuide = () => {
    if (!disassemblyProductId.trim()) {
      toast({ title: "Product ID Required", description: "Please enter a Product ID to view its disassembly guide.", variant: "destructive" });
      return;
    }
    const productExists = MOCK_DPPS.some(p => p.id === disassemblyProductId.trim());
    if (productExists) {
      toast({
        title: "Disassembly Guide (Mock)",
        description: `Fetching disassembly guide for Product ID: ${disassemblyProductId}. (Conceptual - no actual guide will be shown).`,
      });
    } else {
       toast({
        title: "Product Not Found",
        description: `Product with ID "${disassemblyProductId}" not found. Cannot fetch disassembly guide.`,
        variant: "destructive",
      });
    }
  };


  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><RecycleIcon className="mr-2 text-primary"/>End-of-Life & Material Recovery</CardTitle>
          <CardDescription>Access DPP information for disassembly and material recovery.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-muted/50">
            <CardHeader><CardTitle className="text-lg">Products Processed</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">450</p><p className="text-xs text-muted-foreground">This month (Mock)</p></CardContent>
          </Card>
          <Card className="bg-muted/50">
            <CardHeader><CardTitle className="text-lg">Material Recovery Rate</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold text-accent">85%</p><p className="text-xs text-muted-foreground">(Mock Avg.)</p></CardContent>
          </Card>
        </CardContent>
      </Card>
      
      <RecyclerQuickActionsCard />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><BarChart3 className="mr-2 text-primary"/>Common Recoverable Materials (Mock Volume)</CardTitle>
          <CardDescription>Estimated volume of materials recovered in the last reporting period.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockMaterialRecoveryData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} width={120} />
              <RechartsTooltip 
                cursor={{fill: 'hsl(var(--muted))'}}
                contentStyle={{backgroundColor: 'hsl(var(--popover))', borderRadius: 'var(--radius)', border: '1px solid hsl(var(--border))'}}
                labelStyle={{color: 'hsl(var(--popover-foreground))'}}
              />
              <Legend wrapperStyle={{fontSize: '12px', paddingTop: '10px'}} />
              <Bar dataKey="volume" name="Recovered Volume (kg)" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><Search className="mr-2 text-primary"/>Search Products by Material</CardTitle>
            <CardDescription>Find products containing specific materials for targeted recycling.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Label htmlFor="materialSearch" className="sr-only">Material to Search</Label>
            <div className="flex gap-2">
              <Input 
                id="materialSearch" 
                placeholder="e.g., Lithium, PET" 
                value={materialSearchTerm}
                onChange={(e) => setMaterialSearchTerm(e.target.value)}
              />
              <Button onClick={handleMaterialSearch}>Search</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><FileTextIcon className="mr-2 text-primary"/>View Disassembly Guide</CardTitle>
            <CardDescription>Access EOL instructions and disassembly guides for specific products.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Label htmlFor="disassemblyProductId" className="sr-only">Product ID for Disassembly Guide</Label>
            <div className="flex gap-2">
              <Input 
                id="disassemblyProductId" 
                placeholder="Enter Product ID (e.g., DPP001)" 
                value={disassemblyProductId}
                onChange={(e) => setDisassemblyProductId(e.target.value)}
              />
              <Button onClick={handleViewDisassemblyGuide}>View Guide</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center"><AlertTriangle className="mr-2 h-5 w-5"/>Material Alerts</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground">High volume of 'Recycled PET' available from recent batch. Low stock of 'Lithium Carbonate' for battery recycling.</p></CardContent>
      </Card>
      <RegulationUpdatesCard />
    </div>
  );
};
