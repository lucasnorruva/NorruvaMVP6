
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DashboardFiltersState } from "@/types/dpp";
import { Filter } from "lucide-react";

interface DashboardFiltersComponentProps {
  filters: DashboardFiltersState;
  onFiltersChange: (newFilters: Partial<DashboardFiltersState>) => void;
  availableRegulations: Array<{ value: string, label: string }>;
}

export const DashboardFiltersComponent: React.FC<DashboardFiltersComponentProps> = ({
  filters,
  onFiltersChange,
  availableRegulations,
}) => {
  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "draft", label: "Draft" },
    { value: "pending_review", label: "Pending Review" },
    { value: "published", label: "Published" },
    { value: "archived", label: "Archived" },
  ];

  return (
    <Card className="shadow-md">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
          <div>
            <Label htmlFor="status-filter" className="text-sm font-medium mb-1 flex items-center">
              <Filter className="h-4 w-4 mr-2 text-primary" />
              Filter by Status
            </Label>
            <Select
              value={filters.status}
              onValueChange={(value) => onFiltersChange({ status: value as DashboardFiltersState['status'] })}
            >
              <SelectTrigger id="status-filter" className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="regulation-filter" className="text-sm font-medium mb-1 flex items-center">
              <Filter className="h-4 w-4 mr-2 text-primary" />
              Filter by Regulation (Compliant)
            </Label>
            <Select
              value={filters.regulation}
              onValueChange={(value) => onFiltersChange({ regulation: value as DashboardFiltersState['regulation'] })}
            >
              <SelectTrigger id="regulation-filter" className="w-full">
                <SelectValue placeholder="Select regulation" />
              </SelectTrigger>
              <SelectContent>
                {availableRegulations.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Placeholder for Time Range Filter */}
          {/* <div>
            <Label htmlFor="time-range-filter">Time Range</Label>
            <Select
              // value={filters.timeRange}
              // onValueChange={(value) => onFiltersChange({ timeRange: value as DashboardFiltersState['timeRange'] })}
            >
              <SelectTrigger id="time-range-filter" disabled className="w-full">
                <SelectValue placeholder="Select time range (soon)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
};
