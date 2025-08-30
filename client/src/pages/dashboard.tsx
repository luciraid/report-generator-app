import { useQuery } from "@tanstack/react-query";
import ReportStats from "@/components/report-stats";
import RecentReportsTable from "@/components/recent-reports-table";
import { WorkshopReport } from "@shared/schema";

interface StatsData {
  totalReports: number;
  thisMonth: number;
  componentsServiced: number;
}

export default function Dashboard() {
  const { data: reports = [], isLoading: reportsLoading } = useQuery<WorkshopReport[]>({
    queryKey: ["/api/reports"],
  });

  const { data: stats = { totalReports: 0, thisMonth: 0, componentsServiced: 0 }, isLoading: statsLoading } = useQuery<StatsData>({
    queryKey: ["/api/stats"],
  });

  return (
    <div className="p-6">
      <ReportStats stats={stats} isLoading={statsLoading} />
      <RecentReportsTable reports={reports} isLoading={reportsLoading} />
    </div>
  );
}
