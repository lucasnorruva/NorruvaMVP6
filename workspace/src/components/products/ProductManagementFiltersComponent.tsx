
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Filter, ListFilter, Search, Tag, ShieldAlert, CheckSquare, Link as LinkIcon, XCircle, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export interface ProductManagementFilterState {
  searchQuery: string;
  status: string;
  compliance: string;
  category: string;
  blockchainAnchored?: 'all' | 'anchored' | 'not_anchored';
}

interface ProductManagementFiltersComponentProps {
  filters: ProductManagementFilterState;
  onFilterChange: (filters: ProductManagementFilterState) => void;
  statusOptions: string[];
  complianceOptions: string[];
  categoryOptions: string[];
}

const defaultFilters: ProductManagementFilterState = {
  searchQuery: "",
  status: "All",
  compliance: "All",
  category: "All",
  blockchainAnchored: "all",
};

export default function ProductManagementFiltersComponent({
  filters,
  onFilterChange,
  statusOptions,
  complianceOptions,
  categoryOptions,
}: ProductManagementFiltersComponentProps) {

  const handleInputChange = (filterName: keyof ProductManagementFilterState, value: string) => {
    onFilterChange({ ...filters, [filterName]: value });
  };

  const anchoringOptions = [
    { value: "all", label: "All Anchoring Statuses" },
    { value: "anchored", label: "Anchored" },
    { value: "not_anchored", label: "Not Anchored" },
  ];

  const handleClearFilters = () => {
    onFilterChange(defaultFilters);
  };

  const activeFilterCount = [
    filters.searchQuery && filters.searchQuery.length > 0,
    filters.status !== defaultFilters.status,
    filters.compliance !== defaultFilters.compliance,
    filters.category !== defaultFilters.category,
    filters.blockchainAnchored !== defaultFilters.blockchainAnchored,
  ].filter(Boolean).length;

  return (
    <Card className="shadow-md">
      <CardContent className="p-0">
        <Accordion type="single" collapsible defaultValue="filter-section" className="w-full">
          <AccordionItem value="filter-section" className="border-b-0">
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50 rounded-t-lg [&[data-state=open]]:rounded-b-none [&[data-state=open]]:border-b">
              <div className="flex items-center text-md font-medium">
                <SlidersHorizontal className="h-5 w-5 mr-2 text-primary" />
                Filter & Search Products
                {activeFilterCount > 0 && (
                  <span className={cn(
                    "ml-2 px-2 py-0.5 text-xs font-semibold rounded-full",
                    "bg-primary/20 text-primary" 
                  )}>
                    {activeFilterCount} active
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end p-4 border-t">
                <div>
                  <Label htmlFor="search-query-pm" className="text-sm font-medium mb-1 flex items-center">
                    <Search className="h-4 w-4 mr-2 text-primary" />
                    Search (Name, GTIN, Brand)
                  </Label>
                  <Input
                    id="search-query-pm"
                    type="text"
                    placeholder="Enter search term..."
                    value={filters.searchQuery}
                    onChange={(e) => handleInputChange('searchQuery', e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="status-filter-pm" className="text-sm font-medium mb-1 flex items-center">
                    <CheckSquare className="h-4 w-4 mr-2 text-primary" />
                    Filter by DPP Status
                  </Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger id="status-filter-pm" className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={`pm-status-${option}`} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="compliance-filter-pm" className="text-sm font-medium mb-1 flex items-center">
                    <ShieldAlert className="h-4 w-4 mr-2 text-primary" />
                    Filter by Compliance Status
                  </Label>
                  <Select
                    value={filters.compliance}
                    onValueChange={(value) => handleInputChange('compliance', value)}
                  >
                    <SelectTrigger id="compliance-filter-pm" className="w-full">
                      <SelectValue placeholder="Select compliance status" />
                    </SelectTrigger>
                    <SelectContent>
                      {complianceOptions.map((option) => (
                        <SelectItem key={`pm-comp-${option}`} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category-filter-pm" className="text-sm font-medium mb-1 flex items-center">
                    <Tag className="h-4 w-4 mr-2 text-primary" />
                    Filter by Category
                  </Label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger id="category-filter-pm" className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((category) => (
                        <SelectItem key={`pm-cat-${category}`} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="anchoring-filter-pm-acc" className="text-sm font-medium mb-1 flex items-center">
                    <LinkIcon className="h-4 w-4 mr-1.5 text-primary" />
                    Blockchain Anchoring
                  </Label>
                  <Select
                    value={filters.blockchainAnchored || 'all'}
                    onValueChange={(value) => handleInputChange('blockchainAnchored', value as ProductManagementFilterState['blockchainAnchored'])}
                  >
                    <SelectTrigger id="anchoring-filter-pm-acc" className="w-full">
                      <SelectValue placeholder="Select anchoring status" />
                    </SelectTrigger>
                    <SelectContent>
                      {anchoringOptions.map((option) => (
                        <SelectItem key={`pm-anchor-acc-${option.value}`} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {activeFilterCount > 0 && (
                <div className="p-4 pt-0 text-right">
                  <Button variant="outline" size="sm" onClick={handleClearFilters}>
                    <XCircle className="mr-2 h-4 w-4" /> Clear All Filters
                  </Button>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

