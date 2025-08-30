import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface SearchFiltersProps {
  onSearch: (filters: {
    search?: string;
    reasonForShopVisit?: string;
    shopExitReason?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => void;
}

export default function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [filters, setFilters] = useState({
    search: "",
    reasonForShopVisit: "",
    shopExitReason: "",
    dateFrom: "",
    dateTo: "",
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    // Auto-search on filter change (except for text input)
    if (key !== "search") {
      onSearch(newFilters);
    }
  };

  const handleSearchSubmit = () => {
    onSearch(filters);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              className="pl-10"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              onKeyPress={handleKeyPress}
              data-testid="input-search"
            />
          </div>
        </div>
        
        <div>
          <Select onValueChange={(value) => handleFilterChange("reasonForShopVisit", value)} value={filters.reasonForShopVisit}>
            <SelectTrigger data-testid="select-visit-reason">
              <SelectValue placeholder="All Visit Reasons" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Visit Reasons</SelectItem>
              <SelectItem value="scheduled-maintenance">Scheduled Maintenance</SelectItem>
              <SelectItem value="unscheduled-repair">Unscheduled Repair</SelectItem>
              <SelectItem value="inspection">Inspection</SelectItem>
              <SelectItem value="overhaul">Overhaul</SelectItem>
              <SelectItem value="modification">Modification</SelectItem>
              <SelectItem value="testing">Testing</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select onValueChange={(value) => handleFilterChange("shopExitReason", value)} value={filters.shopExitReason}>
            <SelectTrigger data-testid="select-exit-reason">
              <SelectValue placeholder="All Exit Reasons" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Exit Reasons</SelectItem>
              <SelectItem value="repair-completed">Repair Completed</SelectItem>
              <SelectItem value="maintenance-completed">Maintenance Completed</SelectItem>
              <SelectItem value="inspection-completed">Inspection Completed</SelectItem>
              <SelectItem value="no-defect-found">No Defect Found</SelectItem>
              <SelectItem value="beyond-repair">Beyond Repair</SelectItem>
              <SelectItem value="awaiting-parts">Awaiting Parts</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="date-from">Date From</Label>
          <Input
            id="date-from"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
            data-testid="input-date-from"
          />
        </div>
        <div>
          <Label htmlFor="date-to">Date To</Label>
          <Input
            id="date-to"
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange("dateTo", e.target.value)}
            data-testid="input-date-to"
          />
        </div>
        <div className="flex items-end">
          <Button 
            onClick={handleSearchSubmit} 
            className="w-full"
            data-testid="button-apply-filters"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}