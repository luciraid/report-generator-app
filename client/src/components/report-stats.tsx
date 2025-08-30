import { Card } from "@/components/ui/card";
import { FileText, Calendar, Clock, Settings } from "lucide-react";

interface StatsData {
  totalReports: number;
  thisMonth: number;
  componentsServiced: number;
}

interface ReportStatsProps {
  stats: StatsData;
  isLoading: boolean;
}

export default function ReportStats({ stats, isLoading }: ReportStatsProps) {
  const statCards = [
    {
      title: "Total Reports",
      value: stats.totalReports,
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "This Month",
      value: stats.thisMonth,
      icon: Calendar,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Components Serviced",
      value: stats.componentsServiced,
      icon: Settings,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card p-6 rounded-lg shadow-sm border border-border animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-muted rounded w-20 mb-2"></div>
                <div className="h-8 bg-muted rounded w-12"></div>
              </div>
              <div className="w-12 h-12 bg-muted rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm" data-testid={`text-stat-title-${index}`}>{stat.title}</p>
                <p className="text-2xl font-bold" data-testid={`text-stat-value-${index}`}>{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
