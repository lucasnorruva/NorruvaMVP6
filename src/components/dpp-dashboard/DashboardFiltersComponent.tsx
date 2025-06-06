
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { DashboardFiltersState } from "@/types/dpp";
import { Filter, ListFilter, Search, Link as LinkIcon, SlidersHorizontal } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

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

  const anchoringOptions = [
    { value: "all", label: "All Anchoring Statuses" },
    { value: "anchored", label: "Anchored" },
    { value: "not_anchored", label: "Not Anchored" },
  ];

  const activeFilterCount = [
    filters.searchQuery && filters.searchQuery.length > 0,
    filters.status !== 'all',
    filters.regulation !== 'all',
    filters.category !== 'all',
    filters.blockchainAnchored !== 'all',
  ].filter(Boolean).length;

  return (
    <Card className="shadow-md">
      <CardContent className="p-0"> {/* Remove CardContent padding, accordion will handle it */}
        <Accordion type="single" collapsible defaultValue="filter-section" className="w-full">
          <AccordionItem value="filter-section" className="border-b-0">
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50 rounded-t-lg [&[data-state=open]]:rounded-b-none [&[data-state=open]]:border-b">
              <div className="flex items-center text-md font-medium">
                <SlidersHorizontal className="h-5 w-5 mr-2 text-primary" />
                Filter Options
                {activeFilterCount > 0 && (
                  <span className={cn(
                    "ml-2 px-2 py-0.5 text-xs font-semibold rounded-full",
                    activeFilterCount > 0 ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    {activeFilterCount} active
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-0"> {/* AccordionContent has pb-4 by default */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end p-4 border-t">
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
                <div>
                  <Label htmlFor="anchoring-filter" className="text-sm font-medium mb-1 flex items-center">
                    <LinkIcon className="h-4 w-4 mr-2 text-primary" />
                    Blockchain Anchoring
                  </Label>
                  <Select
                    value={filters.blockchainAnchored || 'all'}
                    onValueChange={(value) => onFiltersChange({ blockchainAnchored: value as DashboardFiltersState['blockchainAnchored'] })}
                  >
                    <SelectTrigger id="anchoring-filter" className="w-full">
                      <SelectValue placeholder="Select anchoring status" />
                    </SelectTrigger>
                    <SelectContent>
                      {anchoringOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};
