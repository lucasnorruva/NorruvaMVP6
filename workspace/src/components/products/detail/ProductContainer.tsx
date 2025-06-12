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
import CertificationsTab from './CertificationsTab';
import QrCodeTab from './QrCodeTab';
import HistoryTab from './HistoryTab'; // Import the new HistoryTab

import { Package, Leaf, ShieldCheck, History as HistoryIcon, Layers, Award, QrCode } from 'lucide-react';


interface ProductContainerProps {
  product: SimpleProductDetail;
  onSupplyChainUpdate: (updatedLinks: ProductSupplyChainLink[]) => void;
  onSyncEprel: () => Promise<void>;
  isSyncingEprel: boolean;
  canSyncEprel: boolean; 
}

export default function ProductContainer({ 
  product, 
  onSupplyChainUpdate,
  onSyncEprel,
  isSyncingEprel,
  canSyncEprel 
}: ProductContainerProps) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!product) {
    return <p>Product not found.</p>;
  }
  
  const tabItems = [
    { value: "overview", label: "Overview", icon: Package },
    { value: "sustainability", label: "Sustainability", icon: Leaf },
    { value: "compliance", label: "Compliance", icon: ShieldCheck },
    { value: "certifications", label: "Certifications", icon: Award },
    { value: "lifecycle", label: "Lifecycle", icon: HistoryIcon },
    { value: "supplyChain", label: "Supply Chain", icon: Layers },
    { value: "history", label: "History", icon: HistoryIcon }, // Added History tab
    { value: "qrCode", label: "QR Code", icon: QrCode },
  ];

  return (
    <div className="space-y-6">
      <ProductHeader product={product} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2 h-auto p-1.5"> {/* Adjusted grid columns */}
          {tabItems.map(tab => (
            <TabsTrigger 
              key={tab.value} 
              value={tab.value} 
              className="flex items-center gap-2 py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm"
            >
              <tab.icon className="h-4 w-4" /> {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewTab product={product} />
        </TabsContent>

        <TabsContent value="sustainability" className="mt-6">
          <SustainabilityTab product={product} />
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <ComplianceTab 
            product={product} 
            onSyncEprel={onSyncEprel}
            isSyncingEprel={isSyncingEprel}
            canSyncEprel={canSyncEprel}
          />
        </TabsContent>
        
        <TabsContent value="certifications" className="mt-6">
          <CertificationsTab product={product} />
        </TabsContent>

        <TabsContent value="lifecycle" className="mt-6">
          <LifecycleTab product={product} />
        </TabsContent>

         <TabsContent value="supplyChain" className="mt-6">
          <SupplyChainTab product={product} onSupplyChainLinksChange={onSupplyChainUpdate} />
        </TabsContent>

        <TabsContent value="history" className="mt-6"> {/* Added TabsContent for History */}
          <HistoryTab productId={product.id} />
        </TabsContent>

        <TabsContent value="qrCode" className="mt-6">
          <QrCodeTab productId={product.id} productName={product.productName} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
    
