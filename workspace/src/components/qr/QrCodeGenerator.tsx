"use client";

import React, { useRef } from "react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";

interface QrCodeGeneratorProps {
  productId: string;
  size?: number; // Allow size customization
}

export default function QrCodeGenerator({
  productId,
  size = 128,
}: QrCodeGeneratorProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dataUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/passport/${productId}`
      : `/passport/${productId}`;

  const handleDownload = () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgRef.current);
    // Add XML declaration for better SVG compatibility
    const svgString = '<?xml version="1.0" standalone="no"?>\r\n' + source;
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
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
      <div className="p-2 bg-white rounded-md shadow-sm inline-block">
        {" "}
        {/* Add padding for better quiet zone */}
        <QRCode value={dataUrl} size={size} ref={svgRef} level="H" />
      </div>
      <Button variant="outline" size="sm" onClick={handleDownload}>
        Download QR (SVG)
      </Button>
    </div>
  );
}
