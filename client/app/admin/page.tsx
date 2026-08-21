import { PlatformOverview } from "@/components/admin/platform-overview";
import { PlatformStatCard } from "@/components/admin/platform-stat-card";
import { AuditLogTable } from "@/components/admin/audit-log-table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Platform Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Global metrics and health status for GechExpress.
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Global Report
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PlatformStatCard title="Total GMV" amount="$2.4M" trend="+12.5%" trendUp={true} highlight={true} />
        <PlatformStatCard title="Platform Revenue" amount="$124,500" trend="+15.2%" trendUp={true} />
        <PlatformStatCard title="Active Sellers" amount="1,245" trend="+3.4%" trendUp={true} />
        <PlatformStatCard title="Total Customers" amount="84.2k" trend="+8.1%" trendUp={true} />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <PlatformOverview />
        </div>
        <div className="space-y-8">
          {/* We'll use AuditLogTable as a quick feed here */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50 p-6">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Recent Security Events</h2>
            <AuditLogTable limit={5} />
          </div>
        </div>
      </div>
    </div>
  );
}
