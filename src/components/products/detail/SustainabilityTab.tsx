
// --- File: SustainabilityTab.tsx ---
// Description: Displays sustainability-related information for a product.
"use client";

import type { SimpleProductDetail } from "@/types/dpp";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Zap, Recycle, Wrench, CheckCircle, AlertCircle, Info, Users, Handshake, ExternalLink, FileText, BarChart3, BookText } from "lucide-react"; // Added BookText
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SustainabilityTabProps {
  product: SimpleProductDetail;
}

const DetailItem: React.FC<{ label: string; value?: string | number | null; unit?: string; link?: string; isUrl?: boolean }> = ({ label, value, unit, link, isUrl }) => {
  if (value === undefined || value === null || String(value).trim() === "") return null;
  return (
    <div className="flex justify-between items-center text-sm py-1.5 border-b border-border/50 last:border-b-0">
      <span className="text-muted-foreground">{label}:</span>
      {isUrl && typeof value === 'string' && value.startsWith('http') ? (
        <Link href={value} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline truncate max-w-[60%]">
          View Document/Policy <ExternalLink className="inline h-3 w-3 ml-1" />
        </Link>
      ) : (
        <span className="font-medium text-foreground/90 text-right truncate max-w-[60%]">
          {value}
          {unit && <span className="ml-0.5 text-xs text-muted-foreground">{unit}</span>}
          {link && (
            <Link href={link} target="_blank" rel="noopener noreferrer" className="ml-1.5 text-primary hover:underline text-xs">(Details)</Link>
          )}
        </span>
      )}
    </div>
  );
};

export default function SustainabilityTab({ product }: SustainabilityTabProps) {
  if (!product) {
    return <p className="text-muted-foreground p-4">Sustainability data not available.</p>;
  }

  const hasEthicalSourcingInfo = product.conflictMineralsReportUrl || product.fairTradeCertificationId || product.ethicalSourcingPolicyUrl;
  const esprSpecifics = product.productDetails?.esprSpecifics;
  const hasEsprSpecifics = esprSpecifics && Object.values(esprSpecifics).some(value => !!value);


  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Leaf className="mr-2 h-5 w-5 text-green-600" /> Key Sustainability Claims
          </CardTitle>
        </CardHeader>
        <CardContent>
          {product.keySustainabilityPoints && product.keySustainabilityPoints.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {product.keySustainabilityPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-success flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No specific sustainability claims listed.</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Users className="mr-2 h-5 w-5 text-indigo-600" /> Materials Composition
          </CardTitle>
        </CardHeader>
        <CardContent>
          {product.materialsUsed && product.materialsUsed.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {product.materialsUsed.map((material, index) => (
                <li key={index} className="p-2 bg-muted/50 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{material.name}</span>
                    {material.percentage && <Badge variant="secondary">{material.percentage}%</Badge>}
                  </div>
                  {material.source && <p className="text-xs text-muted-foreground">Source: {material.source}</p>}
                  {material.isRecycled && <Badge variant="outline" className="mt-1 text-xs border-green-500/50 text-green-600 bg-green-500/10">Recycled Content</Badge>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Material composition details not available.</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Zap className="mr-2 h-5 w-5 text-warning" /> Energy Efficiency
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DetailItem label="Energy Label Rating" value={product.energyLabelRating} />
          {esprSpecifics?.energyEfficiencySummary && <DetailItem label="ESPR Energy Summary" value={esprSpecifics.energyEfficiencySummary} />}
          {!product.energyLabelRating && !esprSpecifics?.energyEfficiencySummary && <p className="text-sm text-muted-foreground">Energy information not specified.</p>}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Wrench className="mr-2 h-5 w-5 text-blue-600" /> Repair &amp; Recyclability
          </CardTitle>
          <CardDescription>Information on product end-of-life and maintenance.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {product.repairability && (
            <div>
              <h4 className="text-sm font-medium mb-1">Repairability Score:</h4>
              <p className="text-foreground/90">
                <span className="font-bold text-xl text-blue-700">{product.repairability.score}</span> / {product.repairability.scale}
                {product.repairability.detailsUrl && (
                  <Link href={product.repairability.detailsUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="link" size="sm" className="p-0 h-auto ml-2 text-xs">View Details</Button>
                  </Link>
                )}
              </p>
            </div>
          )}
           {esprSpecifics?.repairabilityInformation && <DetailItem label="ESPR Repairability Info" value={esprSpecifics.repairabilityInformation} />}
          {product.recyclabilityInfo && (
            <div className="mt-2">
              <h4 className="text-sm font-medium mb-1">Recyclability:</h4>
               <DetailItem label="Recyclable Content" value={product.recyclabilityInfo.percentage} unit="%" />
               {product.recyclabilityInfo.instructionsUrl && (
                 <Link href={product.recyclabilityInfo.instructionsUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block">
                   <Button variant="outline" size="sm" className="text-xs">
                     <Recycle className="mr-1.5 h-3.5 w-3.5"/> Recycling Instructions
                   </Button>
                 </Link>
               )}
            </div>
          )}
           {esprSpecifics?.recycledContentSummary && <DetailItem label="ESPR Recycled Content Summary" value={esprSpecifics.recycledContentSummary} />}
          {!product.repairability && !product.recyclabilityInfo && !esprSpecifics?.repairabilityInformation && !esprSpecifics?.recycledContentSummary &&(
             <p className="text-sm text-muted-foreground">Repair and recyclability information not specified.</p>
          )}
        </CardContent>
      </Card>

      {hasEsprSpecifics && (
        <Card className="shadow-sm md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <BookText className="mr-2 h-5 w-5 text-purple-600" /> ESPR Ecodesign Parameters
            </CardTitle>
             <CardDescription>Narrative summaries for specific Ecodesign requirements.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <DetailItem label="Durability Information" value={esprSpecifics?.durabilityInformation} />
            <DetailItem label="Substance of Concern Summary" value={esprSpecifics?.substanceOfConcernSummary} />
            {/* Other ESPR fields already integrated or can be added as DetailItem here */}
          </CardContent>
        </Card>
      )}

      {hasEthicalSourcingInfo && (
        <Card className="shadow-sm md:col-span-2"> {/* Span full width on md screens */}
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <Handshake className="mr-2 h-5 w-5 text-purple-600" /> Ethical Sourcing & Supply Chain Transparency
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <DetailItem label="Conflict Minerals Report" value={product.conflictMineralsReportUrl} isUrl />
            <DetailItem label="Fair Trade Certification ID/Link" value={product.fairTradeCertificationId} isUrl={product.fairTradeCertificationId?.startsWith('http')} />
            <DetailItem label="Ethical Sourcing Policy" value={product.ethicalSourcingPolicyUrl} isUrl />
            {!product.conflictMineralsReportUrl && !product.fairTradeCertificationId && !product.ethicalSourcingPolicyUrl && (
                 <p className="text-sm text-muted-foreground">No specific ethical sourcing information provided.</p>
            )}
          </CardContent>
        </Card>
      )}

      {product.batteryRegulation?.carbonFootprint && (product.batteryRegulation.carbonFootprint.value !== null && product.batteryRegulation.carbonFootprint.value !== undefined) && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-red-500" /> Carbon Footprint (Battery)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <DetailItem label="Value" value={product.batteryRegulation.carbonFootprint.value} unit={product.batteryRegulation.carbonFootprint.unit} />
            <DetailItem label="Calculation Method" value={product.batteryRegulation.carbonFootprint.calculationMethod} />
            <DetailItem label="Data Source" value={product.batteryRegulation.carbonFootprint.dataSource} />
            {product.batteryRegulation.carbonFootprint.scope1Emissions !== null && product.batteryRegulation.carbonFootprint.scope1Emissions !== undefined && <DetailItem label="Scope 1 Emissions" value={product.batteryRegulation.carbonFootprint.scope1Emissions} unit={product.batteryRegulation.carbonFootprint.unit?.replace('/kWh', '')} />}
            {product.batteryRegulation.carbonFootprint.scope2Emissions !== null && product.batteryRegulation.carbonFootprint.scope2Emissions !== undefined &&  <DetailItem label="Scope 2 Emissions" value={product.batteryRegulation.carbonFootprint.scope2Emissions} unit={product.batteryRegulation.carbonFootprint.unit?.replace('/kWh', '')} />}
            {product.batteryRegulation.carbonFootprint.scope3Emissions !== null && product.batteryRegulation.carbonFootprint.scope3Emissions !== undefined &&  <DetailItem label="Scope 3 Emissions" value={product.batteryRegulation.carbonFootprint.scope3Emissions} unit={product.batteryRegulation.carbonFootprint.unit?.replace('/kWh', '')} />}
            <DetailItem label="Carbon Footprint VC ID" value={product.batteryRegulation.carbonFootprint.vcId} />
          </CardContent>
        </Card>
      )}

    </div>
  );
}
