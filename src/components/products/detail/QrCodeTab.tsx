
// --- File: QrCodeTab.tsx ---
// Description: Displays the product's QR code and provides context.
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import QrCodeGenerator from "@/components/qr/QrCodeGenerator";
import { QrCode as QrCodeIcon } from "lucide-react"; // Renamed to avoid conflict

interface QrCodeTabProps {
  productId: string;
  productName: string;
}

export default function QrCodeTab({ productId, productName }: QrCodeTabProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <QrCodeIcon className="mr-2 h-5 w-5 text-primary" /> Product QR Code
        </CardTitle>
        <CardDescription>
          This QR code links directly to the public Digital Product Passport for "{productName}".
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="p-4 bg-white rounded-lg shadow-md inline-block">
          <QrCodeGenerator productId={productId} />
        </div>
        <div className="text-center text-sm text-muted-foreground max-w-md">
          <p>
            Scan this code with any standard QR code reader on a smartphone or tablet to access the product's public information.
          </p>
          <p className="mt-2">
            It can be used on product packaging, labels, marketing materials, or at the point of sale to provide consumers and stakeholders with instant access to verified product data.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
