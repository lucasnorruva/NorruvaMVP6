
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Filter, ListFilter, Search, Tag, ShieldAlert, CheckSquare, Link as LinkIcon, XCircle } from "lucide-react"; // Added XCircle
import { Button } from "@/components/ui/button"; // Added Button import

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

  const hasActiveFilters =
    filters.searchQuery !== defaultFilters.searchQuery ||
    filters.status !== defaultFilters.status ||
    filters.compliance !== defaultFilters.compliance ||
    filters.category !== defaultFilters.category ||
    filters.blockchainAnchored !== defaultFilters.blockchainAnchored;

  return (
    <Card className="shadow-md">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
          <div>
            <Label htmlFor="search-query" className="text-sm font-medium mb-1 flex items-center">
              <Search className="h-4 w-4 mr-2 text-primary" />
              Search (Name, GTIN, Brand)
            </Label>
            <Input
              id="search-query"
              type="text"
              placeholder="Enter search term..."
              value={filters.searchQuery}
              onChange={(e) => handleInputChange('searchQuery', e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="status-filter" className="text-sm font-medium mb-1 flex items-center">
              <CheckSquare className="h-4 w-4 mr-2 text-primary" />
              Filter by DPP Status
            </Label>
            <Select
              value={filters.status}
              onValueChange={(value) => handleInputChange('status', value)}
            >
              <SelectTrigger id="status-filter" className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="compliance-filter" className="text-sm font-medium mb-1 flex items-center">
              <ShieldAlert className="h-4 w-4 mr-2 text-primary" />
              Filter by Compliance Status
            </Label>
            <Select
              value={filters.compliance}
              onValueChange={(value) => handleInputChange('compliance', value)}
            >
              <SelectTrigger id="compliance-filter" className="w-full">
                <SelectValue placeholder="Select compliance status" />
              </SelectTrigger>
              <SelectContent>
                {complianceOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
           <div>
            <Label htmlFor="category-filter" className="text-sm font-medium mb-1 flex items-center">
              <Tag className="h-4 w-4 mr-2 text-primary" />
              Filter by Category
            </Label>
            <Select
              value={filters.category}
              onValueChange={(value) => handleInputChange('category', value)}
            >
              <SelectTrigger id="category-filter" className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="anchoring-filter-pm" className="text-sm font-medium mb-1 flex items-center">
              <LinkIcon className="h-4 w-4 mr-1.5 text-primary" />
              Blockchain Anchoring
            </Label>
            <Select
              value={filters.blockchainAnchored || 'all'}
              onValueChange={(value) => handleInputChange('blockchainAnchored', value as ProductManagementFilterState['blockchainAnchored'])}
            >
              <SelectTrigger id="anchoring-filter-pm" className="w-full">
                <SelectValue placeholder="Select anchoring status" />
              </SelectTrigger>
              <SelectContent>
                {anchoringOptions.map((option) => (
                  <SelectItem key={`pm-anchor-${option.value}`} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {hasActiveFilters && (
          <div className="mt-4 text-right">
            <Button variant="outline" size="sm" onClick={handleClearFilters}>
              <XCircle className="mr-2 h-4 w-4" /> Clear All Filters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
