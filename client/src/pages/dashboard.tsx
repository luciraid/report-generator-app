import React from "react";
import { useQuery } from "@tanstack/react-query";
import RecentReportsTable from "@/components/recent-reports-table";

export default function Dashboard() {
  // ✅ Fetch stats
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    queryFn: () => fetch("/api/stats").then((res) => res.json()),
  });

  // ✅ Fetch reports
  const { data: reports, isLoading, error } = useQuery({
    queryKey: ["/api/reports"],
    queryFn: () => fetch("/api/reports").then((res) => res.json()),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Failed to load reports</div>;

  return (
    <div className="space-y-6">
      {/* Dashboard cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white shadow rounded-lg">
            <h4 className="text-sm font-medium text-gray-500">Total Reports</h4>
            <p className="text-2xl font-bold">{stats.totalReports}</p>
          </div>
          <div className="p-4 bg-white shadow rounded-lg">
            <h4 className="text-sm font-medium text-gray-500">Reports This Month</h4>
            <p className="text-2xl font-bold">{stats.thisMonth}</p>
          </div>
          <div className="p-4 bg-white shadow rounded-lg">
            <h4 className="text-sm font-medium text-gray-500">Components Serviced</h4>
            <p className="text-2xl font-bold">{stats.componentsServiced}</p>
          </div>
        </div>
      )}

      {/* Recent Reports Table */}
      <div className="p-4 bg-white shadow rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Recent Workshop Reports</h3>
        <RecentReportsTable reports={reports ?? []} />
      </div>
    </div>
  );
}
