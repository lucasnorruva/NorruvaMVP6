
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input"; // Added Input import
import type { DashboardFiltersState } from "@/types/dpp";
import { Filter, ListFilter, Search } from "lucide-react"; // Added Search icon

interface DashboardFiltersComponentProps {
  filters: DashboardFiltersState;
  onFiltersChange: (newFilters: Partial<DashboardFiltersState>) => void;
  availableRegulations: Array<{ value: string, label: string }>;
  availableCategories: string[];
}

export const DashboardFiltersComponent: React.FC<DashboardFiltersComponentProps> = ({
  filters,
  onFiltersChange,
  availableRegulations,
  availableCategories,
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end"> {/* Adjusted grid to md:grid-cols-4 */}
          <div>
            <Label htmlFor="search-query" className="text-sm font-medium mb-1 flex items-center">
              <Search className="h-4 w-4 mr-2 text-primary" />
              Search by Product Name
            </Label>
            <Input
              id="search-query"
              type="text"
              placeholder="Enter product name..."
              value={filters.searchQuery || ""}
              onChange={(e) => onFiltersChange({ searchQuery: e.target.value })}
              className="w-full"
            />
          </div>
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
           <div>
            <Label htmlFor="category-filter" className="text-sm font-medium mb-1 flex items-center">
              <ListFilter className="h-4 w-4 mr-2 text-primary" />
              Filter by Category
            </Label>
            <Select
              value={filters.category}
              onValueChange={(value) => onFiltersChange({ category: value as DashboardFiltersState['category'] })}
            >
              <SelectTrigger id="category-filter" className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {availableCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
