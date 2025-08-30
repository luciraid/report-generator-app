import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "wouter";

export default function Header() {
  const [location] = useLocation();
  
  const getPageTitle = () => {
    switch (location) {
      case "/":
        return "Workshop Reports Dashboard";
      case "/new-report":
        return "Create New Report";
      case "/search":
        return "Search Reports";
      default:
        return "MRO Workshop Reports";
    }
  };

  const getPageDescription = () => {
    switch (location) {
      case "/":
        return "View recent reports and statistics";
      case "/new-report":
        return "Enter component details and maintenance information";
      case "/search":
        return "Find reports using search and filters";
      default:
        return "Workshop Management System";
    }
  };

  return (
    <header className="bg-card shadow-sm border-b border-border px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold" data-testid="text-page-title">{getPageTitle()}</h2>
          <p className="text-muted-foreground" data-testid="text-page-description">{getPageDescription()}</p>
        </div>
        {location !== "/new-report" && (
          <Link href="/new-report">
            <Button className="flex items-center space-x-2" data-testid="button-new-report">
              <Plus className="w-4 h-4" />
              <span>New Report</span>
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
