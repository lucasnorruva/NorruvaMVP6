// --- File: src/components/dashboard/insights/ComplianceHotspotsTable.tsx ---
"use client";

import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ShieldAlert, ShieldQuestion } from "lucide-react";
import { MOCK_DPPS } from "@/data";
import type { DigitalProductPassport } from "@/types/dpp";

interface ComplianceHotspot {
  category: string;
  nonCompliantCount: number;
  pendingReviewCount: number;
  totalInCategory: number;
}

export default function ComplianceHotspotsTable() {
  const hotspotsData = useMemo(() => {
    const categoryMap: Record<
      string,
      { nonCompliant: number; pending: number; total: number }
    > = {};
    MOCK_DPPS.forEach((dpp) => {
      const category = dpp.category || "Uncategorized";
      if (!categoryMap[category]) {
        categoryMap[category] = { nonCompliant: 0, pending: 0, total: 0 };
      }
      categoryMap[category].total++;

      const overallStatus = dpp.complianceSummary?.overallStatus?.toLowerCase();
      if (overallStatus === "non-compliant" || overallStatus === "flagged") {
        categoryMap[category].nonCompliant++;
      } else if (
        overallStatus === "pending review" ||
        overallStatus === "pending"
      ) {
        categoryMap[category].pending++;
      }
    });

    return Object.entries(categoryMap)
      .map(([category, counts]) => ({
        category,
        nonCompliantCount: counts.nonCompliant,
        pendingReviewCount: counts.pending,
        totalInCategory: counts.total,
      }))
      .filter(
        (item) => item.nonCompliantCount > 0 || item.pendingReviewCount > 0,
      ) // Only show categories with issues
      .sort(
        (a, b) =>
          b.nonCompliantCount +
          b.pendingReviewCount -
          (a.nonCompliantCount + a.pendingReviewCount),
      ); // Sort by total issues
  }, []);

  return (
    <Card className="shadow-lg lg:col-span-2">
      {" "}
      {/* Adjusted span */}
      <CardHeader>
        <CardTitle className="font-headline text-lg flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5 text-primary" />
          Compliance Hotspots by Category
        </CardTitle>
        <CardDescription>
          Categories with products requiring compliance attention.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hotspotsData.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Non-Compliant</TableHead>
                <TableHead className="text-center">Pending Review</TableHead>
                <TableHead className="text-center">Total in Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hotspotsData.map((hotspot) => (
                <TableRow key={hotspot.category}>
                  <TableCell className="font-medium">
                    {hotspot.category}
                  </TableCell>
                  <TableCell className="text-center">
                    {hotspot.nonCompliantCount > 0 ? (
                      <Badge
                        variant="destructive"
                        className="bg-red-100 text-red-700 border-red-300"
                      >
                        <ShieldAlert className="mr-1 h-3 w-3" />{" "}
                        {hotspot.nonCompliantCount}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {hotspot.pendingReviewCount > 0 ? (
                      <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-700 border-yellow-300"
                      >
                        <ShieldQuestion className="mr-1 h-3 w-3" />{" "}
                        {hotspot.pendingReviewCount}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {hotspot.totalInCategory}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-muted-foreground py-6">
            No significant compliance hotspots identified across categories.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
