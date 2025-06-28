
// --- File: RoleSpecificCard.tsx ---
// Description: Displays role-specific tips, actions, or information on the public product passport page.
"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRole } from '@/contexts/RoleContext';
import type { PublicProductInfo } from '@/types/dpp'; 
import { Settings, Building, UploadCloud, QrCode, HardHat as ToolIcon, ClipboardCheck, Info as InfoIcon } from 'lucide-react';

interface RoleSpecificCardProps {
  product: PublicProductInfo; 
}

export default function RoleSpecificCard({ product }: RoleSpecificCardProps) {
  const { currentRole } = useRole();

  let title = "Role-Specific Information";
  let IconComponent: React.ElementType = InfoIcon;
  let content: React.ReactNode = null;

  switch (currentRole) {
    case 'admin':
      title = "Admin Overview";
      IconComponent = Settings;
      content = (
        <>
          <p className="text-sm text-muted-foreground">As an admin, you can oversee data integrity, manage user access, and configure platform settings. Ensure all product data is accurate and regulatory requirements are met.</p>
          <Link href="/settings" passHref className="mt-3 inline-block">
            <Button variant="outline" size="sm">Go to Platform Settings</Button>
          </Link>
        </>
      );
      break;
    case 'manufacturer':
      title = "Manufacturer Tools & Insights";
      IconComponent = Building;
      content = (
        <>
          <p className="text-sm text-muted-foreground">Ensure all product data is accurate and up-to-date. You can manage this product&apos;s DPP via your dashboard. Consider initiating a new compliance check if recent changes were made.</p>
          {product.ebsiStatus === 'pending' && (
            <p className="text-sm text-orange-600 mt-2">
              <strong>Action Required:</strong> EBSI verification for this product is pending. Please review and complete necessary steps via your dashboard to ensure full traceability and compliance.
            </p>
          )}
          <Button variant="outline" size="sm" className="mt-3" onClick={() => alert('Mock: Navigating to product edit page for ' + product.passportId)}>Edit Product DPP (Mock)</Button>
        </>
      );
      break;
    case 'supplier':
      title = "Supplier Actions";
      IconComponent = UploadCloud;
      content = (
        <>
          <p className="text-sm text-muted-foreground">If you supply components or materials for this product, ensure your declarations and certifications are up-to-date in the system. Accurate supplier data is crucial for overall DPP validity.</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => alert('Mock: Navigating to supplier data portal for product ' + product.passportId)}>Update My Supplied Data (Mock)</Button>
        </>
      );
      break;
    case 'retailer':
      title = "Retailer Resources";
      IconComponent = QrCode;
      content = (
        <>
          <p className="text-sm text-muted-foreground">Utilize this DPP QR code on product displays for enhanced customer transparency and engagement. Access marketing assets, verify authenticity, and provide rich product information at the point of sale.</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => alert('Mock: Downloading POS material for ' + product.passportId)}>Download POS Kit (Mock)</Button>
        </>
      );
      break;
    case 'recycler':
      title = "Recycler & EOL Information";
      IconComponent = ToolIcon;
      content = (
        <>
          <p className="text-sm text-muted-foreground">Access detailed disassembly guides, material composition breakdowns, and safety information for efficient and safe end-of-life processing. Report recovered materials through your portal.</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => alert('Mock: Accessing EOL documents for ' + product.passportId)}>View Disassembly Guide (Mock)</Button>
        </>
      );
      break;
    case 'verifier':
      title = "Auditor & Verifier Tools";
      IconComponent = ClipboardCheck;
      content = (
        <>
          <p className="text-sm text-muted-foreground">Review comprehensive compliance records, verify claims, and access audit trails for this product. Plan your next audit cycle or request further documentation from the verifier dashboard.</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => alert('Mock: Initiating audit for ' + product.passportId)}>Initiate Audit (Mock)</Button>
        </>
      );
      break;
    default:
      return null; 
  }

  return (
    <Card className="mt-10 shadow-md border-primary/20">
      <CardHeader>
        <CardTitle className="text-xl text-primary flex items-center">
          <IconComponent className="mr-2 h-6 w-6" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
}
