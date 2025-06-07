
// --- File: ProductContainer.tsx ---
// Description: Main layout component for the product detail view, managing tabs.
"use client";

import { useState } from "react";
import type { SimpleProductDetail, ProductSupplyChainLink } from "@/types/dpp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductHeader from "./ProductHeader";
import OverviewTab from "./OverviewTab";
import SustainabilityTab from './SustainabilityTab';
import ComplianceTab from './ComplianceTab';
import LifecycleTab from './LifecycleTab';
import SupplyChainTab from './SupplyChainTab';

import { Package, Leaf, ShieldCheck, History, Layers } from 'lucide-react';


interface ProductContainerProps {
  product: SimpleProductDetail;
  onSupplyChainUpdate: (updatedLinks: ProductSupplyChainLink[]) => void;
}

export default function ProductContainer({ product, onSupplyChainUpdate }: ProductContainerProps) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!product) {
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
          <TabsTrigger value="sustainability" className="flex items-center gap-2 py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm">
            <Leaf className="h-4 w-4" /> Sustainability
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2 py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm">
            <ShieldCheck className="h-4 w-4" /> Compliance
          </TabsTrigger>
          <TabsTrigger value="lifecycle" className="flex items-center gap-2 py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm">
            <History className="h-4 w-4" /> Lifecycle
          </TabsTrigger>
          <TabsTrigger value="supplyChain" className="flex items-center gap-2 py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm">
            <Layers className="h-4 w-4" /> Supply Chain
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewTab product={product} />
        </TabsContent>

        <TabsContent value="sustainability" className="mt-6">
          <SustainabilityTab product={product} />
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <ComplianceTab product={product} />
        </TabsContent>

        <TabsContent value="lifecycle" className="mt-6">
          <LifecycleTab product={product} />
        </TabsContent>

         <TabsContent value="supplyChain" className="mt-6">
          <SupplyChainTab product={product} onSupplyChainLinksChange={onSupplyChainUpdate} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
