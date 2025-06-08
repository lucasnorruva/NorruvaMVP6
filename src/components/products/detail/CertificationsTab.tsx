
// --- File: CertificationsTab.tsx ---
// Description: Displays product certifications in a dedicated tab.
"use client";

import type { SimpleProductDetail, SimpleCertification } from "@/types/dpp";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, ShieldCheck, FileText, ExternalLink, CalendarDays, Fingerprint, DatabaseZap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CertificationsTabProps {
  product: SimpleProductDetail;
}

export default function CertificationsTab({ product }: CertificationsTabProps) {
  if (!product.certifications || product.certifications.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Award className="mr-2 h-5 w-5 text-primary" /> Product Certifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No certifications listed for this product.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <Award className="mr-2 h-5 w-5 text-primary" /> Product Certifications
        </CardTitle>
        <CardDescription>
          Overview of certifications and standards met by this product.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {product.certifications.map((cert, index) => (
          <div key={`${cert.name}-${index}`} className="p-4 border rounded-lg bg-background hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
              <h4 className="font-medium text-md text-foreground flex items-center">
                {cert.isVerified ? (
                  <ShieldCheck className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                ) : (
                  <FileText className="mr-2 h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
                {cert.name}
              </h4>
              {cert.isVerified && (
                <Badge variant="default" className="mt-1 sm:mt-0 text-xs bg-green-100 text-green-700 border-green-300">
                  Verified
                </Badge>
              )}
            </div>
            <div className="text-xs space-y-1.5 text-muted-foreground">
              <p><strong className="text-foreground/80">Issuing Authority:</strong> {cert.authority}</p>
              {cert.standard && <p><strong className="text-foreground/80">Standard:</strong> {cert.standard}</p>}
              <p className="flex items-center">
                <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-muted-foreground/80"/>
                <strong className="text-foreground/80">Issued:</strong> {new Date(cert.issueDate).toLocaleDateString()}
                {cert.expiryDate && <span className="ml-2"><strong className="text-foreground/80">Expires:</strong> {new Date(cert.expiryDate).toLocaleDateString()}</span>}
              </p>
              
              {cert.vcId && (
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center cursor-default">
                        <Fingerprint className="h-3.5 w-3.5 mr-1.5 text-indigo-500 flex-shrink-0" />
                        <strong className="text-foreground/80 mr-1">VC ID:</strong>
                        <span className="font-mono truncate text-foreground/90">{cert.vcId}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="start" className="bg-popover text-popover-foreground shadow-lg rounded-md p-2 border max-w-xs">
                      <p className="text-xs break-all">{cert.vcId}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {cert.transactionHash && (
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                       <div className="flex items-center cursor-default">
                        <DatabaseZap className="h-3.5 w-3.5 mr-1.5 text-teal-500 flex-shrink-0" />
                        <strong className="text-foreground/80 mr-1">Blockchain Tx:</strong>
                        <span className="font-mono truncate text-foreground/90">{cert.transactionHash}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="start" className="bg-popover text-popover-foreground shadow-lg rounded-md p-2 border max-w-xs">
                      <p className="text-xs break-all">{cert.transactionHash}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {cert.documentUrl && (
                <Button variant="link" size="sm" asChild className="p-0 h-auto text-primary mt-1.5">
                  <Link href={cert.documentUrl} target="_blank" rel="noopener noreferrer">
                    View Document <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
