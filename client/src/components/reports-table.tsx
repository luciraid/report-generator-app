import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Edit, Printer, FileDown, FileText } from "lucide-react";
import { WorkshopReport } from "@shared/schema";

interface ReportsTableProps {
  reports: WorkshopReport[];
  isLoading: boolean;
}

export default function ReportsTable({ reports, isLoading }: ReportsTableProps) {
  const [selectedReports, setSelectedReports] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedReports(reports.map(r => r.id));
    } else {
      setSelectedReports([]);
    }
  };

  const handleSelectReport = (reportId: string, checked: boolean) => {
    if (checked) {
      setSelectedReports(prev => [...prev, reportId]);
    } else {
      setSelectedReports(prev => prev.filter(id => id !== reportId));
    }
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    // TODO: Implement export functionality
    console.log(`Exporting ${selectedReports.length || reports.length} reports as ${format}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
          <div className="flex space-x-2">
            <div className="h-9 bg-muted rounded w-24 animate-pulse"></div>
            <div className="h-9 bg-muted rounded w-24 animate-pulse"></div>
          </div>
        </div>
        <div className="border rounded-lg">
          <div className="h-64 bg-muted rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Export Options */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground" data-testid="text-results-count">
          Showing {reports.length} results
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleExport('csv')}
            data-testid="button-export-csv"
          >
            <FileText className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleExport('pdf')}
            data-testid="button-export-pdf"
          >
            <FileDown className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Search Results Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left">
                  <Checkbox
                    checked={selectedReports.length === reports.length && reports.length > 0}
                    onCheckedChange={handleSelectAll}
                    data-testid="checkbox-select-all"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Report ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">DMF</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Incoming Part</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Outgoing Part</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Modification</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Visit Reason</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Exit Reason</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-muted-foreground">
                    No reports found matching your criteria.
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id} className="hover:bg-accent/50 transition-colors" data-testid={`row-search-result-${report.id}`}>
                    <td className="px-4 py-4">
                      <Checkbox
                        checked={selectedReports.includes(report.id)}
                        onCheckedChange={(checked) => handleSelectReport(report.id, checked as boolean)}
                        data-testid={`checkbox-select-${report.id}`}
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-primary" data-testid={`text-search-report-number-${report.id}`}>
                      {report.reportNumber}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-testid={`text-search-dmf-${report.id}`}>
                      {new Date(report.dateOfManufacture).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-mono" data-testid={`text-search-incoming-${report.id}`}>
                      {report.incomingPartNumber} / {report.incomingSerialNumber}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-mono" data-testid={`text-search-outgoing-${report.id}`}>
                      {report.outgoingPartNumber} / {report.outgoingSerialNumber}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-testid={`text-search-modification-${report.id}`}>
                      {report.modificationStatus.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-testid={`text-search-visit-reason-${report.id}`}>
                      {report.reasonForShopVisit.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-testid={`text-search-exit-reason-${report.id}`}>
                      {report.shopExitReason.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" data-testid={`button-search-view-${report.id}`}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" data-testid={`button-search-edit-${report.id}`}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" data-testid={`button-search-print-${report.id}`}>
                          <Printer className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {reports.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Showing 1-{reports.length} of {reports.length} results
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled data-testid="button-previous">
              Previous
            </Button>
            <Button size="sm" data-testid="button-page-1">1</Button>
            <Button variant="outline" size="sm" disabled data-testid="button-next">
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}