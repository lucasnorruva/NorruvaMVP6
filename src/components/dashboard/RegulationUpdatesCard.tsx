
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, ExternalLink } from "lucide-react"; // Added ExternalLink
import Link from "next/link";

interface RegulationUpdate {
  id: string;
  title: string;
  summary: string;
  date: string;
  source?: string;
  link?: string;
}

const mockRegulationUpdates: RegulationUpdate[] = [
  { id: "reg001", title: "EU ESPR - New Draft v1.3 Published", summary: "Key changes focus on enhanced durability requirements for electronics and mandatory recycled content in packaging.", date: "July 28, 2024", source: "European Commission", link: "#"},
  { id: "reg002", title: "Updated Guidance on EU Battery Regulation Reporting", summary: "Clarifications on carbon footprint calculation methodologies and data submission for battery passports.", date: "July 22, 2024", source: "ECHA", link: "#"},
  { id: "reg003", title: "US Scope 3 Emissions - New Industry Sector Benchmarks", summary: "EPA releases updated benchmarks for Scope 3 reporting, impacting supply chain data collection for certain industries.", date: "July 15, 2024", source: "US EPA", link: "#"},
];

export const RegulationUpdatesCard = () => (
  <Card className="shadow-lg">
    <CardHeader>
      <CardTitle className="font-headline flex items-center">
        <Info className="mr-2 h-5 w-5 text-info" />
        Recent Regulation Changes
      </CardTitle>
      <CardDescription>Stay informed on the latest regulatory developments.</CardDescription>
    </CardHeader>
    <CardContent>
      {mockRegulationUpdates.length > 0 ? (
        <ul className="space-y-4">
          {mockRegulationUpdates.map((update) => (
            <li key={update.id} className="border-b pb-3 last:border-b-0 last:pb-0">
              <h4 className="font-medium text-sm">{update.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {update.date} {update.source && ` - ${update.source}`}
              </p>
              <p className="text-sm text-foreground/90 mt-1.5">{update.summary}</p>
              {update.link && (
                <Link href={update.link} target="_blank" rel="noopener noreferrer" asChild>
                  <Button variant="link" size="sm" className="p-0 h-auto mt-1 text-primary">
                    Learn More
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">No recent regulation updates.</p>
      )}
    </CardContent>
  </Card>
);

