
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChartHorizontal, BarChart3, Droplet, Recycle, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

// Simplified product type for selection
interface ProductForSelection {
  id: string;
  name: string;
  category: string;
  // Mock sustainability data for comparison
  carbonFootprint: number; // kg CO2e
  recyclabilityScore: number; // %
  waterUsage: number; // L/unit
  repairabilityIndex: number; // /10
}

// Simplified mock product data for this page
const MOCK_PRODUCTS_FOR_SELECTION: ProductForSelection[] = [
  { id: "PROD001", name: "EcoFriendly Refrigerator X2000", category: "Appliances", carbonFootprint: 180, recyclabilityScore: 95, waterUsage: 500, repairabilityIndex: 8.5 },
  { id: "PROD002", name: "Smart LED Bulb (4-Pack)", category: "Electronics", carbonFootprint: 5.2, recyclabilityScore: 75, waterUsage: 10, repairabilityIndex: 6.0 },
  { id: "PROD003", name: "Organic Cotton T-Shirt", category: "Apparel", carbonFootprint: 2.5, recyclabilityScore: 80, waterUsage: 2700, repairabilityIndex: 5.0 },
  { id: "PROD004", name: "Recycled Plastic Water Bottle", category: "Homeware", carbonFootprint: 0.5, recyclabilityScore: 100, waterUsage: 1, repairabilityIndex: 2.0 },
  { id: "PROD005", name: "Solar Powered Garden Light", category: "Outdoor", carbonFootprint: 3.0, recyclabilityScore: 60, waterUsage: 5, repairabilityIndex: 7.0 },
];

interface ComparisonData {
  metric: string;
  unit: string;
  icon: React.ElementType;
  values: { productId: string, productName: string, value: number }[];
}

export default function CompareSustainabilityPage() {
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [comparisonResults, setComparisonResults] = useState<ComparisonData[] | null>(null);

  const handleProductSelect = (productId: string) => {
    setSelectedProductIds(prevSelected =>
      prevSelected.includes(productId)
        ? prevSelected.filter(id => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const handleGenerateComparison = () => {
    if (selectedProductIds.length < 2) {
      alert("Please select at least two products to compare.");
      setComparisonResults(null);
      return;
    }
    const productsToCompare = MOCK_PRODUCTS_FOR_SELECTION.filter(p => selectedProductIds.includes(p.id));

    const results: ComparisonData[] = [
      {
        metric: "Carbon Footprint",
        unit: "kg CO₂e",
        icon: BarChart3,
        values: productsToCompare.map(p => ({ productId: p.id, productName: p.name, value: p.carbonFootprint})),
      },
      {
        metric: "Recyclability Score",
        unit: "%",
        icon: Recycle,
        values: productsToCompare.map(p => ({ productId: p.id, productName: p.name, value: p.recyclabilityScore})),
      },
      {
        metric: "Water Usage",
        unit: "L/unit",
        icon: Droplet,
        values: productsToCompare.map(p => ({ productId: p.id, productName: p.name, value: p.waterUsage})),
      },
      {
        metric: "Repairability Index",
        unit: "/10",
        icon: Wrench,
        values: productsToCompare.map(p => ({ productId: p.id, productName: p.name, value: p.repairabilityIndex})),
      }
    ];
    setComparisonResults(results);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline font-semibold">Compare Product Sustainability</h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Select Products for Comparison</CardTitle>
          <CardDescription>Choose two or more products from the list below to compare their key sustainability metrics.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto border rounded-md">
            <Table>
              <TableHeader className="sticky top-0 bg-muted z-10">
                <TableRow>
                  <TableHead className="w-[50px]">Select</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_PRODUCTS_FOR_SELECTION.map(product => (
                  <TableRow key={product.id} className="hover:bg-muted/30">
                    <TableCell>
                      <Checkbox
                        id={`select-${product.id}`}
                        checked={selectedProductIds.includes(product.id)}
                        onCheckedChange={() => handleProductSelect(product.id)}
                        aria-label={`Select ${product.name}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button onClick={handleGenerateComparison} className="mt-6" disabled={selectedProductIds.length < 2}>
            <BarChartHorizontal className="mr-2 h-5 w-5" />
            Generate Comparison
          </Button>
        </CardContent>
      </Card>

      {comparisonResults && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Sustainability Comparison</CardTitle>
            <CardDescription>Side-by-side comparison of selected products' sustainability metrics.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Metric</TableHead>
                    {comparisonResults[0].values.map(product => (
                      <TableHead key={product.productId} className="min-w-[150px] text-center">{product.productName}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparisonResults.map(metricData => (
                    <TableRow key={metricData.metric}>
                      <TableCell className="font-medium flex items-center">
                        <metricData.icon className="mr-2 h-4 w-4 text-primary" />
                        {metricData.metric} ({metricData.unit})
                      </TableCell>
                      {metricData.values.map(productValue => (
                        <TableCell key={productValue.productId} className="text-center">{productValue.value.toLocaleString()}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
       {selectedProductIds.length > 0 && !comparisonResults && (
         <Card className="shadow-lg border-dashed">
            <CardContent className="p-6 text-center text-muted-foreground">
                <BarChartHorizontal className="mx-auto h-12 w-12 mb-3 text-primary/50" />
                <p>Click "Generate Comparison" to see the results for the selected products.</p>
            </CardContent>
         </Card>
       )}
    </div>
  );
}
