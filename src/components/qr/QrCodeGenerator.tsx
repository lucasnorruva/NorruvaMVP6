"use client";

import React, { useRef } from "react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";

interface QrCodeGeneratorProps {
  productId: string;
}

export default function QrCodeGenerator({ productId }: QrCodeGeneratorProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const handleDownload = () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgRef.current);
    const blob = new Blob([source], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `qr-${productId}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center gap-2 mt-4">
      <QRCode value={`/passport/${productId}`} ref={svgRef} />
      <Button variant="outline" size="sm" onClick={handleDownload}>
        Download QR
      </Button>
    </div>
  );
}
