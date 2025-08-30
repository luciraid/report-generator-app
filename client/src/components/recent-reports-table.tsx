import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Printer } from "lucide-react";
import { WorkshopReport } from "@shared/schema";
import { Link } from "wouter";

interface RecentReportsTableProps {
  reports: WorkshopReport[];
  isLoading: boolean;
}

export default function RecentReportsTable({ reports, isLoading }: RecentReportsTableProps) {

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Recent Reports</h3>
            <Button variant="ghost" disabled>View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded animate-pulse">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-4 bg-muted rounded w-32"></div>
                <div className="h-4 bg-muted rounded w-28"></div>
                <div className="h-4 bg-muted rounded w-20"></div>
                <div className="h-4 bg-muted rounded w-24"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentReports = reports.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold" data-testid="text-recent-reports-title">Recent Reports</h3>
          <Link href="/search">
            <Button variant="ghost" data-testid="button-view-all">View All</Button>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Report ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Incoming Part</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Outgoing Part</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Visit Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Exit Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {recentReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No reports found. <Link href="/new-report"><Button variant="link" className="p-0 h-auto">Create your first report</Button></Link>
                  </td>
                </tr>
              ) : (
                recentReports.map((report) => (
                  <tr key={report.id} className="hover:bg-accent/50 transition-colors" data-testid={`row-report-${report.id}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary" data-testid={`text-report-number-${report.id}`}>
                      {report.reportNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" data-testid={`text-incoming-part-${report.id}`}>
                      {report.incomingPartNumber} / {report.incomingSerialNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" data-testid={`text-outgoing-part-${report.id}`}>
                      {report.outgoingPartNumber} / {report.outgoingSerialNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" data-testid={`text-visit-reason-${report.id}`}>
                      {report.reasonForShopVisit.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" data-testid={`text-exit-reason-${report.id}`}>
                      {report.shopExitReason.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" data-testid={`button-view-${report.id}`}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" data-testid={`button-print-${report.id}`}>
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
      </CardContent>
    </Card>
  );
}