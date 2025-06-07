
"use client";

import { useState } from "react";
import type { SimpleProductDetail } from "@/types/dpp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductHeader from "./ProductHeader";
import OverviewTab from "./OverviewTab";
// Import other tab components here as they are created
// e.g., import SustainabilityTab from './SustainabilityTab';
// import ComplianceTab from './ComplianceTab';
// import LifecycleTab from './LifecycleTab';
// import SupplyChainTab from './SupplyChainTab';

import { Package, Leaf, ShieldCheck, History, Layers } from 'lucide-react';


interface ProductContainerProps {
  product: SimpleProductDetail;
}

export default function ProductContainer({ product }: ProductContainerProps) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!product) {
    // This case should ideally be handled by the parent page component with notFound()
    return <p>Product not found.</p>;
  }

  return (
    <div className="space-y-6">
      <ProductHeader product={product} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 h-auto p-1.5">
          <TabsTrigger value="overview" className="flex items-center gap-2 py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm">
            <Package className="h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="sustainability" disabled className="flex items-center gap-2 py-2">
            <Leaf className="h-4 w-4" /> Sustainability
          </TabsTrigger>
          <TabsTrigger value="compliance" disabled className="flex items-center gap-2 py-2">
            <ShieldCheck className="h-4 w-4" /> Compliance
          </TabsTrigger>
          <TabsTrigger value="lifecycle" disabled className="flex items-center gap-2 py-2">
            <History className="h-4 w-4" /> Lifecycle
          </TabsTrigger>
          <TabsTrigger value="supplyChain" disabled className="flex items-center gap-2 py-2">
            <Layers className="h-4 w-4" /> Supply Chain
          </TabsTrigger>
          {/* Add more TabsTriggers as new tabs are implemented */}
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewTab product={product} />
        </TabsContent>
        
        <TabsContent value="sustainability" className="mt-6">
          <p className="text-muted-foreground p-4 text-center">Sustainability information coming soon.</p>
          {/* <SustainabilityTab product={product} /> */}
        </TabsContent>
        
        <TabsContent value="compliance" className="mt-6">
          <p className="text-muted-foreground p-4 text-center">Compliance details coming soon.</p>
          {/* <ComplianceTab product={product} /> */}
        </TabsContent>

        <TabsContent value="lifecycle" className="mt-6">
          <p className="text-muted-foreground p-4 text-center">Product lifecycle information coming soon.</p>
          {/* <LifecycleTab product={product} /> */}
        </TabsContent>

         <TabsContent value="supplyChain" className="mt-6">
          <p className="text-muted-foreground p-4 text-center">Supply chain details coming soon.</p>
          {/* <SupplyChainTab product={product} /> */}
        </TabsContent>
        {/* Add more TabsContent as new tabs are implemented */}
      </Tabs>
    </div>
  );
}

    