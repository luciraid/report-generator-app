import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import SearchFilters from "@/components/search-filters";
import ReportsTable from "@/components/reports-table";

export default function SearchReports() {
  const [searchFilters, setSearchFilters] = useState({});

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["/api/reports/search", searchFilters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value) params.append(key, value as string);
      });
      
      const response = await fetch(`/api/reports/search?${params}`);
      if (!response.ok) {
        throw new Error("Failed to search reports");
      }
      return response.json();
    },
  });

  const handleSearch = (filters: any) => {
    setSearchFilters(filters);
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold" data-testid="text-search-title">Search & Filter Reports</h3>
          <p className="text-muted-foreground mt-1" data-testid="text-search-description">
            Find specific reports using filters and search criteria
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <SearchFilters onSearch={handleSearch} />
          <ReportsTable reports={reports} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
